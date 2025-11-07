// Dashboard Configuration
// Customize your NASA dashboard here

export const dashboardConfig = {
    // API Configuration
    apis: {
        nasa: {
            // Using your personal NASA API key for expanded usage and higher rate limits
            // Rate limits: 1,000 requests per hour (vs 30/hour for DEMO_KEY)
            apiKey:
                process.env.NEXT_PUBLIC_NASA_API_KEY ||
                "aIWMqFERNcQ8hJ16gAOopWhN0YwpgejVLfV1m2c5",
            endpoints: {
                // Astronomy & Earth Imagery
                apod: "https://api.nasa.gov/planetary/apod",
                epic: "https://api.nasa.gov/EPIC/api/natural", // Earth Polychromatic Imaging Camera

                // Asteroid & Near Earth Objects
                neo: "https://api.nasa.gov/neo/rest/v1/feed",
                neoLookup: "https://api.nasa.gov/neo/rest/v1/neo",
                neoBrowse: "https://api.nasa.gov/neo/rest/v1/neo/browse",

                // Space Weather (DONKI APIs)
                solarFlares: "https://api.nasa.gov/DONKI/FLR", // Real solar flare data!
                coronalMassEjections: "https://api.nasa.gov/DONKI/CME",
                geomagneticStorms: "https://api.nasa.gov/DONKI/GST",
                solarParticles: "https://api.nasa.gov/DONKI/SEP",
                notifications: "https://api.nasa.gov/DONKI/notifications",

                // Mars & Planetary
                mars: "https://api.nasa.gov/insight_weather/", // Historical - InSight ended mission

                // Legacy endpoints for compatibility
                earth: "https://api.nasa.gov/planetary/earth/imagery",
            },
        },
    },

    // Refresh Intervals (in milliseconds)
    refreshRates: {
        clock: 1000, // Update clock every second
        liveStats: 30000, // Update stats every 30 seconds
        apod: 3600000, // Update APOD every hour
        neo: 3600000, // Update asteroids every hour
        marsWeather: 1800000, // Update Mars weather every 30 minutes
    },

    // UI Customization
    ui: {
        theme: {
            primary: "#3B82F6", // Blue
            secondary: "#8B5CF6", // Purple
            accent: "#F59E0B", // Orange
            success: "#10B981", // Green
            warning: "#F59E0B", // Orange
            danger: "#EF4444", // Red
        },

        // Animation settings
        animations: {
            enabled: true,
            duration: 300, // ms
            easing: "ease-in-out",
        },

        // Glass morphism effects
        glassEffect: {
            enabled: true,
            blur: 16, // backdrop-blur strength
            opacity: 0.3, // background opacity
        },
    },

    // Streaming Optimization
    streaming: {
        // Optimize for YouTube streaming
        youtubeMode: true,

        // Reduce API calls when streaming
        reducedUpdates: false,

        // Show status indicators
        showLiveIndicators: true,

        // Performance mode
        performanceMode: false, // Disables some animations for better performance
    },

    // Featured Sections
    sections: {
        overview: {
            enabled: true,
            title: "Mission Control",
            icon: "Star",
        },
        asteroids: {
            enabled: true,
            title: "Asteroid Watch",
            icon: "AlertTriangle",
            showDetails: true, // Show detailed asteroid information
        },
        apod: {
            enabled: true,
            title: "Daily Image",
            icon: "Camera",
            autoplay: false, // Auto-play videos
        },
        mars: {
            enabled: true,
            title: "Mars Weather",
            icon: "Sun",
            useSimulated: true, // Use simulated data (original API discontinued)
        },
        earth: {
            enabled: true,
            title: "Earth View",
            icon: "Globe",
        },
        solar: {
            enabled: true,
            title: "Space Weather",
            icon: "Activity",
        },
    },

    // Data Sources Configuration
    dataSources: {
        // Mock/Simulated data when APIs are unavailable
        useMockData: {
            mars: true, // Mars weather (original API discontinued)
            solar: true, // Solar activity (requires special access)
            iss: false, // ISS location (free API available)
        },

        // Cache settings
        cache: {
            enabled: true,
            duration: 300000, // Cache for 5 minutes
        },
    },

    // YouTube Streaming Specific
    youtube: {
        // Overlay settings for streaming
        showOverlays: true,

        // Brand customization
        channelName: "Your Space Channel",
        showBranding: false,

        // Chat integration (future feature)
        chatCommands: false,
    },
};

// Utility functions
export const getApiUrl = (service, params = {}) => {
    const { apis } = dashboardConfig;
    const baseUrl = apis.nasa.endpoints[service];
    const apiKey = apis.nasa.apiKey;

    const urlParams = new URLSearchParams({
        api_key: apiKey,
        ...params,
    });

    return `${baseUrl}?${urlParams}`;
};

export const isFeatureEnabled = (feature) => {
    return dashboardConfig.sections[feature]?.enabled ?? false;
};

export const getRefreshRate = (service) => {
    return dashboardConfig.refreshRates[service] ?? 60000; // Default 1 minute
};

export default dashboardConfig;
