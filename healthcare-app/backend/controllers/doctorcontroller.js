const Doctor = require("../models/Doctor");
const genAI = require("../config/googleAI");
const { searchNearbyDoctors, getPlaceDetails } = require("../services/googlePlaces");

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

exports.searchDoctors = async (req, res) => {
  try {
    const { specialist, userLat, userLng } = req.query;

    let doctors = [];
    let useGooglePlaces = false;

    // If user location is provided, try Google Places API first
    if (userLat && userLng && specialist) {
      try {
        console.log(`🔍 Searching Google Places for ${specialist} near ${userLat},${userLng}`);
        const googleDoctors = await searchNearbyDoctors(
          specialist,
          parseFloat(userLat),
          parseFloat(userLng),
          15000 // 15km radius
        );

        if (googleDoctors && googleDoctors.length > 0) {
          console.log(`✅ Found ${googleDoctors.length} doctors from Google Places`);
          doctors = googleDoctors;
          useGooglePlaces = true;
          
          // Save to database for future use (optional)
          for (const doc of googleDoctors) {
            try {
              await Doctor.findOneAndUpdate(
                { googlePlaceId: doc.googlePlaceId },
                {
                  name: doc.name,
                  specialist: doc.specialist,
                  location: doc.location,
                  rating: doc.rating,
                  active: doc.active,
                  availableSlots: doc.availableSlots,
                  googlePlaceId: doc.googlePlaceId,
                  userRatingsTotal: doc.userRatingsTotal,
                },
                { upsert: true, new: true }
              );
            } catch (dbError) {
              console.error("Error saving doctor to DB:", dbError.message);
            }
          }
        }
      } catch (googleError) {
        console.error("Google Places API error:", googleError.message);
        // Fallback to database
      }
    }

    // Fallback to database if Google Places didn't return results
    if (!useGooglePlaces || doctors.length === 0) {
      const query = { active: true, verified: true };
      if (specialist) {
        query.specialist = specialist;
      }
      doctors = await Doctor.find(query);
      console.log(`📊 Found ${doctors.length} doctors from database`);
    }

    // If no doctors found, return empty array
    if (doctors.length === 0) {
      return res.json({
        success: true,
        count: 0,
        doctors: [],
        topDoctors: []
      });
    }

    // Calculate distance for each doctor if user location is provided
    let doctorsWithDistance = doctors.map(doctor => {
      const doctorId = doctor._id ? doctor._id.toString() : doctor.googlePlaceId || `temp_${Math.random()}`;
      const doctorData = {
        id: doctorId,
        name: doctor.name,
        rating: doctor.rating || 0,
        userRatingsTotal: doctor.userRatingsTotal || 0,
        specialist: doctor.specialist,
        location: doctor.location,
        distance: null,
        googlePlaceId: doctor.googlePlaceId,
        address: doctor.location?.address || doctor.location?.formatted_address
      };

      if (userLat && userLng && doctor.location?.lat && doctor.location?.lng) {
        doctorData.distance = calculateDistance(
          parseFloat(userLat),
          parseFloat(userLng),
          doctor.location.lat,
          doctor.location.lng
        );
      }

      return doctorData;
    });

    // Use Google AI to recommend top 3 doctors based on location and rating
    let topDoctors = [];
    try {
      if (process.env.GOOGLE_AI_KEY && (userLat && userLng)) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are a healthcare recommendation system. Based on the user's location and doctor data from Google Maps, recommend the top 3 best doctors.
        
        Consider these factors in priority order:
        1. Google Maps rating (higher is better, prioritize doctors with 4.5+ rating)
        2. Number of reviews (more reviews = more reliable)
        3. Proximity to user (closer is better, but prioritize quality over distance)
        4. Overall value (balance between rating, reviews, and distance)
        
        User Location: Latitude ${userLat}, Longitude ${userLng}
        
        Doctors data with distances and Google Maps ratings:
        ${JSON.stringify(doctorsWithDistance.map(d => ({
          id: d.id,
          name: d.name,
          rating: d.rating,
          userRatingsTotal: d.userRatingsTotal,
          distance: d.distance,
          specialist: d.specialist
        })), null, 2)}
        
        Return ONLY a JSON array of doctor IDs in order of best recommendation to worst.
        Format: ["doctor_id_1", "doctor_id_2", "doctor_id_3"]
        
        Prioritize doctors with:
        - High Google Maps rating (4.5+)
        - Many reviews (100+)
        - Reasonable distance (< 10km preferred)
        `;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();
        
        // Try to extract JSON array from AI response
        try {
          // Remove markdown code blocks if present
          let cleanedResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
          // Try to find JSON array in response
          const jsonMatch = cleanedResponse.match(/\[.*?\]/s);
          if (jsonMatch) {
            topDoctors = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("No JSON array found in AI response");
          }
        } catch (parseError) {
          console.error("Failed to parse AI response:", parseError);
          // Fallback to distance + rating based sorting
          doctorsWithDistance.sort((a, b) => {
            // Sort by distance first (if available), then by rating
            if (a.distance !== null && b.distance !== null) {
              const distanceDiff = a.distance - b.distance;
              if (Math.abs(distanceDiff) < 5) { // If within 5km, prioritize rating
                return b.rating - a.rating;
              }
              return distanceDiff;
            }
            return b.rating - a.rating;
          });
          topDoctors = doctorsWithDistance.slice(0, 3).map(d => d.id);
        }
      } else {
        // Fallback: sort by distance (if available) or rating
        doctorsWithDistance.sort((a, b) => {
          if (a.distance !== null && b.distance !== null) {
            const distanceDiff = a.distance - b.distance;
            if (Math.abs(distanceDiff) < 5) { // If within 5km, prioritize rating
              return b.rating - a.rating;
            }
            return distanceDiff;
          }
          return b.rating - a.rating;
        });
        topDoctors = doctorsWithDistance.slice(0, 3).map(d => d.id);
      }
    } catch (aiError) {
      console.error("Google AI Error:", aiError.message);
      // Fallback to distance + rating based sorting
      doctorsWithDistance.sort((a, b) => {
        if (a.distance !== null && b.distance !== null) {
          const distanceDiff = a.distance - b.distance;
          if (Math.abs(distanceDiff) < 5) {
            return b.rating - a.rating;
          }
          return distanceDiff;
        }
        return b.rating - a.rating;
      });
      topDoctors = doctorsWithDistance.slice(0, 3).map(d => d.id);
    }

    // Add distance to doctor objects
    const doctorsWithDistanceMap = {};
    doctorsWithDistance.forEach(d => {
      doctorsWithDistanceMap[d.id] = d.distance;
    });

    const doctorsResponse = doctors.map(doctor => {
      // Handle both Mongoose documents and plain objects
      const doctorObj = doctor.toObject ? doctor.toObject() : { ...doctor };
      const doctorId = doctorObj._id ? doctorObj._id.toString() : doctorObj.googlePlaceId || doctorObj.id;
      
      if (doctorsWithDistanceMap[doctorId] !== null && doctorsWithDistanceMap[doctorId] !== undefined) {
        doctorObj.distance = doctorsWithDistanceMap[doctorId];
      }
      
      // Ensure all required fields
      if (!doctorObj._id && doctorObj.googlePlaceId) {
        doctorObj._id = doctorObj.googlePlaceId; // Use Google Place ID as temporary ID
      }
      
      return doctorObj;
    });

    res.json({
      success: true,
      count: doctors.length,
      doctors: doctorsResponse,
      topDoctors: topDoctors,
      userLocation: userLat && userLng ? { lat: parseFloat(userLat), lng: parseFloat(userLng) } : null
    });
  } catch (error) {
    console.error("Search doctors error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to search doctors",
      doctors: [],
      topDoctors: []
    });
  }
};
