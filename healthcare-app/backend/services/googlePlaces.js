const axios = require("axios");

// Use Google AI Key for Places API (same API key works for both)
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_AI_KEY;

/**
 * Search for doctors/hospitals using Google Places API
 * @param {string} specialty - Medical specialty
 * @param {number} lat - User latitude
 * @param {number} lng - User longitude
 * @param {number} radius - Search radius in meters (default: 10000 = 10km)
 */
exports.searchNearbyDoctors = async (specialty, lat, lng, radius = 10000) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("⚠️  Google Maps API key not configured");
      return [];
    }

    // Map medical specialties to Google Places types/keywords
    const placeTypes = {
      'Cardiologist': 'doctor|hospital',
      'Dermatologist': 'doctor|hospital',
      'Orthopedist': 'doctor|hospital',
      'Neurologist': 'doctor|hospital',
      'Pediatrician': 'doctor|hospital',
      'Gynecologist': 'doctor|hospital',
      'General Physician': 'doctor|hospital',
      'Oncologist': 'doctor|hospital',
      'Ophthalmologist': 'doctor|hospital',
    };

    // Use Places API Nearby Search for location-based results
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: radius,
        type: 'doctor',
        keyword: specialty,
        key: GOOGLE_MAPS_API_KEY,
      }
    });

    if (response.data.status === 'OK' && response.data.results && response.data.results.length > 0) {
      console.log(`✅ Google Places found ${response.data.results.length} results`);
      
      // Transform Google Places results to our doctor format
      const doctors = response.data.results
        .filter(place => place.rating && place.rating >= 3.5) // Filter low-rated places
        .map((place) => {
          // Extract specialty from place name or types
          let extractedSpecialty = specialty || 'General Physician';
          if (place.types) {
            const specialtyKeywords = {
              'Cardiologist': ['cardio', 'heart', 'cardiac'],
              'Dermatologist': ['dermatology', 'skin'],
              'Orthopedist': ['orthopedic', 'bone', 'joint'],
              'Neurologist': ['neurology', 'brain', 'nerve'],
              'Pediatrician': ['pediatric', 'child', 'kids'],
              'Gynecologist': ['gynecology', 'gynecologist', 'women'],
            };
            
            const placeNameLower = place.name.toLowerCase();
            for (const [spec, keywords] of Object.entries(specialtyKeywords)) {
              if (keywords.some(kw => placeNameLower.includes(kw))) {
                extractedSpecialty = spec;
                break;
              }
            }
          }
          
          return {
            googlePlaceId: place.place_id,
            name: place.name,
            specialist: extractedSpecialty,
            location: {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
              address: place.vicinity || place.formatted_address || 'Address not available',
              formatted_address: place.vicinity || place.formatted_address,
            },
            rating: place.rating || 0,
            userRatingsTotal: place.user_ratings_total || 0,
            active: place.business_status === 'OPERATIONAL',
            availableSlots: generateTimeSlots(),
            // Additional Google Places data
            googleData: {
              placeId: place.place_id,
              photos: place.photos ? place.photos.map(p => p.photo_reference) : [],
              openingHours: place.opening_hours,
              priceLevel: place.price_level,
              types: place.types,
              businessStatus: place.business_status,
            }
          };
        })
        .sort((a, b) => b.rating - a.rating); // Sort by rating

      return doctors;
    } else if (response.data.status === 'ZERO_RESULTS') {
      console.log(`No doctors found for ${specialty} near ${lat},${lng}`);
      return [];
    } else {
      console.error("Google Places API error:", response.data.status, response.data.error_message);
      return [];
    }
  } catch (error) {
    console.error("Error searching Google Places:", error.message);
    return [];
  }
};

/**
 * Get detailed information about a place using Place ID
 */
exports.getPlaceDetails = async (placeId) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return null;
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        fields: 'name,rating,user_ratings_total,formatted_address,geometry,opening_hours,photos,website,formatted_phone_number,reviews',
      }
    });

    if (response.data.status === 'OK') {
      return response.data.result;
    }
    return null;
  } catch (error) {
    console.error("Error getting place details:", error.message);
    return null;
  }
};

/**
 * Generate available time slots based on current time
 */
function generateTimeSlots() {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  const startHour = Math.max(9, currentHour + 1); // Start from next hour or 9 AM
  const endHour = 17; // Until 5 PM
  
  for (let hour = startHour; hour <= endHour; hour++) {
    if (hour < 12) {
      slots.push(`${hour}:00 AM`);
      if (hour < endHour) {
        slots.push(`${hour}:30 AM`);
      }
    } else if (hour === 12) {
      slots.push(`12:00 PM`);
      slots.push(`12:30 PM`);
    } else {
      const displayHour = hour - 12;
      slots.push(`${displayHour}:00 PM`);
      if (hour < endHour) {
        slots.push(`${displayHour}:30 PM`);
      }
    }
  }
  
  // Return 4-8 available slots
  return slots.slice(0, Math.min(slots.length, Math.floor(Math.random() * 5) + 4));
}
