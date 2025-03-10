
// Google Maps API Integration

// Initialize the map
function initMap(elementId, lat, lng, zoom = 15) {
    // Check if the element exists
    const mapElement = document.getElementById(elementId);
    if (!mapElement) {
        console.error(`Map element with id '${elementId}' not found`);
        return null;
    }
    
    // Create map instance
    const map = new google.maps.Map(mapElement, {
        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
        zoom: zoom,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
    });
    
    // Add marker at the center
    const marker = new google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        map: map,
        animation: google.maps.Animation.DROP
    });
    
    return { map, marker };
}

// Display a map for a hotel or event
function displayLocationMap(elementId, coordinates) {
    if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
        console.error('Invalid coordinates provided');
        return null;
    }
    
    return initMap(elementId, coordinates.latitude, coordinates.longitude);
}

// Convert address to coordinates (geocoding)
function geocodeAddress(address, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            const location = {
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng()
            };
            callback(null, location);
        } else {
            callback(`Geocoding failed: ${status}`, null);
        }
    });
}
