# Location-Based AI Doctor Recommendations

## 🎯 Feature Overview

The DocNear application now includes **location-based AI recommendations** that suggest the best doctors near you based on:
- **Proximity** to your location
- **Doctor ratings**
- **AI-powered analysis** using Google Gemini

## ✨ How It Works

### 1. **Location Permission**
- When you visit the Search Doctors page, the app requests your location permission
- Uses browser's Geolocation API to get your current coordinates
- Location is only used for finding nearby doctors (not stored permanently)

### 2. **Distance Calculation**
- Backend calculates distance between your location and each doctor using the **Haversine formula**
- Distance is shown in kilometers (or meters if less than 1km)
- Doctors are sorted by proximity (with rating as secondary factor)

### 3. **AI-Powered Recommendations**
- Google Gemini AI analyzes:
  - Your location
  - Doctor locations
  - Doctor ratings
  - Distance from you
- Returns top 3 best recommendations balancing proximity and quality

## 🔧 Technical Implementation

### Backend (`doctorcontroller.js`)
- **Haversine Formula**: Calculates distance between two GPS coordinates
- **AI Integration**: Uses Google Gemini Pro to recommend doctors
- **Smart Sorting**: Prioritizes distance but considers rating when doctors are close

### Frontend (`SearchDoctors.tsx`)
- **Geolocation API**: Requests user location permission
- **Location State**: Stores user coordinates
- **UI Indicators**: Shows location status and distance on doctor cards

### API Endpoint
```
GET /api/doctors/search?specialist=Cardiologist&userLat=37.7749&userLng=-122.4194
```

**Parameters:**
- `specialist` (optional): Filter by specialty
- `userLat` (optional): User's latitude
- `userLng` (optional): User's longitude

**Response:**
```json
{
  "success": true,
  "count": 5,
  "doctors": [
    {
      "_id": "...",
      "name": "Dr. John Doe",
      "rating": 4.8,
      "distance": 2.5,
      "location": { "lat": 37.7849, "lng": -122.4094 }
    }
  ],
  "topDoctors": ["doctor_id_1", "doctor_id_2", "doctor_id_3"]
}
```

## 🎨 User Experience

### Location Permission Flow
1. User visits Search Doctors page
2. Browser prompts for location permission
3. If granted: Location is used for recommendations
4. If denied: User can still search, but without location-based sorting

### Visual Indicators
- **Location Status**: Shows if location is detected
- **Distance Badge**: Displays distance on each doctor card
- **AI Recommendations**: Top 3 doctors marked with "AI Pick" badge

## 🔒 Privacy & Security

- Location is **never stored** in database
- Only sent to backend for real-time calculations
- User can deny permission and still use the app
- Location data is not logged or saved

## 🧪 Testing

### Test with Location
1. Open Search Doctors page
2. Allow location permission when prompted
3. Search for a specialty
4. See doctors sorted by distance with AI recommendations

### Test without Location
1. Deny location permission
2. Search for doctors
3. Doctors sorted by rating only
4. Still get AI recommendations (based on rating)

## 📍 Adding Doctor Locations

To test the feature, add doctors with location data:

```javascript
// Example doctor with location
{
  name: "Dr. Sarah Johnson",
  specialist: "Cardiologist",
  location: {
    lat: 37.7749,  // San Francisco
    lng: -122.4194
  },
  rating: 4.8,
  active: true
}
```

## 🚀 Future Enhancements

- [ ] Map view showing doctor locations
- [ ] Directions to doctor's clinic
- [ ] Location-based filtering (within X km)
- [ ] Save favorite locations
- [ ] Multiple location support

---

**Note**: Make sure Google Generative Language API is enabled in Google Cloud Console for AI recommendations to work.
