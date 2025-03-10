
// Google Maps API Integration

// Get API key from server
async function getGoogleMapsApiKey() {
    try {
        const response = await fetch('/api/maps/key');
        const data = await response.json();
        return data.key;
    } catch (error) {
        console.error('Error fetching Google Maps API key:', error);
        // Fallback to default key if fetch fails
        return 'AIzaSyDPNvJy8vKpj1wZdbl-EU_yTU56xNwyPac';
    }
}

// Dynamically load Google Maps API
async function loadGoogleMapsScript() {
    const apiKey = await getGoogleMapsApiKey();
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        
        script.onload = resolve;
        script.onerror = reject;
        
        document.head.appendChild(script);
    });
}

// Initialize the map
async function initMap(elementId, lat, lng, zoom = 15) {
    await loadGoogleMapsScript();
    
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
async function displayLocationMap(elementId, coordinates) {
    if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
        console.error('Invalid coordinates provided');
        return null;
    }
    
    return initMap(elementId, coordinates.latitude, coordinates.longitude);
}

// Convert address to coordinates (geocoding)
async function geocodeAddress(address, callback) {
    await loadGoogleMapsScript();
    const geocoder = new google.maps.Geocoder();
    
    // If callback is provided, use it (older implementation)
    if (callback) {
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
    // Direct implementation for the map on dashboard-businesses
    else {
        return new Promise((resolve, reject) => {
            geocoder.geocode({ 'address': address }, function(results, status) {
                if (status === 'OK') {
                    resolve(results[0].geometry.location);
                } else {
                    reject(`Geocoding failed: ${status}`);
                }
            });
        });
    }
}

// Export functions if using module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMap,
        displayLocationMap,
        geocodeAddress,
        loadGoogleMapsScript
    };
}
