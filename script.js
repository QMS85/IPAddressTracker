
// IP Address Tracker Application
class IPTracker {
  constructor() {
    this.map = null;
    this.marker = null;
    this.currentIP = '192.212.174.101';
    this.init();
  }

  init() {
    this.initializeMap();
    this.bindEvents();
    this.loadInitialIP();
  }

  initializeMap() {
    // Initialize map centered on default location (Brooklyn, NY)
    this.map = L.map('map', {
      zoomControl: true,
      attributionControl: false
    }).setView([40.6892, -74.0445], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add custom marker
    this.addMarker(40.6892, -74.0445);
  }

  addMarker(lat, lng) {
    // Remove existing marker
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Create custom icon
    const customIcon = L.divIcon({
      html: '<div class="custom-marker"></div>',
      className: 'custom-marker-container',
      iconSize: [46, 56],
      iconAnchor: [23, 56]
    });

    // Add new marker
    this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    
    // Center map on marker
    this.map.setView([lat, lng], 13);
  }

  bindEvents() {
    const form = document.querySelector('.search-form');
    const input = document.getElementById('ip-input');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (query) {
        this.searchIP(query);
      }
    });

    // Handle Enter key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          this.searchIP(query);
        }
      }
    });
  }

  async searchIP(query) {
    try {
      // Show loading state
      this.updateLoadingState(true);
      
      // For demo purposes, we'll simulate different responses
      // In a real app, you would call the IPify API here
      const mockData = this.getMockData(query);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.updateDisplay(mockData);
      this.addMarker(mockData.location.lat, mockData.location.lng);
      
    } catch (error) {
      console.error('Error fetching IP data:', error);
      this.showError('Unable to fetch IP information. Please try again.');
    } finally {
      this.updateLoadingState(false);
    }
  }

  getMockData(query) {
    // Mock data for demonstration
    const mockResponses = {
      '8.8.8.8': {
        ip: '8.8.8.8',
        location: {
          country: 'US',
          region: 'California',
          city: 'Mountain View',
          lat: 37.4056,
          lng: -122.0775,
          timezone: '-08:00'
        },
        isp: 'Google LLC'
      },
      'github.com': {
        ip: '140.82.112.3',
        location: {
          country: 'US',
          region: 'California',
          city: 'San Francisco',
          lat: 37.7749,
          lng: -122.4194,
          timezone: '-08:00'
        },
        isp: 'GitHub, Inc.'
      }
    };

    return mockResponses[query] || {
      ip: '192.212.174.101',
      location: {
        country: 'US',
        region: 'NY',
        city: 'Brooklyn',
        lat: 40.6892,
        lng: -74.0445,
        timezone: '-05:00'
      },
      isp: 'SpaceX Starlink'
    };
  }

  updateDisplay(data) {
    document.getElementById('ip-value').textContent = data.ip;
    document.getElementById('location-value').textContent = 
      `${data.location.city}, ${data.location.region} ${this.getPostalCode(data.location.city)}`;
    document.getElementById('timezone-value').textContent = `UTC ${data.location.timezone}`;
    document.getElementById('isp-value').textContent = data.isp;
  }

  getPostalCode(city) {
    // Mock postal codes for demo
    const postalCodes = {
      'Brooklyn': '10001',
      'Mountain View': '94043',
      'San Francisco': '94102'
    };
    return postalCodes[city] || '10001';
  }

  updateLoadingState(isLoading) {
    const button = document.querySelector('.search-button');
    const input = document.getElementById('ip-input');
    
    if (isLoading) {
      button.disabled = true;
      input.disabled = true;
      button.style.opacity = '0.6';
    } else {
      button.disabled = false;
      input.disabled = false;
      button.style.opacity = '1';
    }
  }

  showError(message) {
    // Simple error handling - in a real app you might want a more sophisticated approach
    alert(message);
  }

  loadInitialIP() {
    // Load default IP data on page load
    const defaultData = {
      ip: '192.212.174.101',
      location: {
        country: 'US',
        region: 'NY',
        city: 'Brooklyn',
        lat: 40.6892,
        lng: -74.0445,
        timezone: '-05:00'
      },
      isp: 'SpaceX Starlink'
    };
    
    this.updateDisplay(defaultData);
  }
}

// Add custom marker styles
const markerStyles = `
  .custom-marker-container {
    background: transparent;
  }
  
  .custom-marker {
    width: 46px;
    height: 56px;
    background: url('icon-location.svg') no-repeat center;
    background-size: contain;
    position: relative;
  }
  
  .custom-marker::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: #000;
    border-radius: 50%;
    border: 3px solid #fff;
  }
`;

// Inject marker styles
const styleSheet = document.createElement('style');
styleSheet.textContent = markerStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new IPTracker();
});

// Handle resize events for map
window.addEventListener('resize', () => {
  if (window.tracker && window.tracker.map) {
    setTimeout(() => {
      window.tracker.map.invalidateSize();
    }, 100);
  }
});
