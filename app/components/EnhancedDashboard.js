"use client";

import { useState, useEffect } from "react";
import {
    Rocket,
    Star,
    Activity,
    AlertTriangle,
    Camera,
    Sun,
    Calendar,
    Globe,
    Zap,
} from "lucide-react";
import RealAPOD from "./RealAPOD";
import RealNEOTracker from "./RealNEOTracker";
import SimpleMarsWeather from "./SimpleMarsWeather";
import RealSolarFlareMonitor from "./RealSolarFlareMonitor";
import RealEarthImagery from "./RealEarthImagery";

export default function EnhancedDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeSection, setActiveSection] = useState("overview");
    const [mounted, setMounted] = useState(false);
    const [liveStats, setLiveStats] = useState({
        issAstronauts: 7,
        solarWindSpeed: 425,
        geomagneticActivity: "Quiet",
        activeMissions: 42,
    });

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulate some live data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveStats((prev) => ({
                ...prev,
                solarWindSpeed: Math.floor(Math.random() * 100) + 300,
                geomagneticActivity: Math.random() > 0.8 ? "Active" : "Quiet",
            }));
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const sections = [
        { id: "overview", label: "Mission Control", icon: Star },
        { id: "asteroids", label: "Asteroid Watch", icon: AlertTriangle },
        { id: "apod", label: "Daily Image", icon: Camera },
        { id: "mars", label: "Mars Weather", icon: Sun },
        { id: "earth", label: "Earth View", icon: Globe },
        { id: "solar", label: "Space Weather", icon: Activity },
    ];

    return (
        <div className="min-h-screen p-4 text-white">
            {/* Header with Live Clock */}
            <div className="mb-6 bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Rocket className="w-12 h-12 text-blue-400" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                NASA Mission Control
                            </h1>
                            <p className="text-gray-300 text-lg">
                                🌍 Live Space Data Dashboard • 🚀 YouTube
                                Streaming Ready
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-mono text-blue-400 tracking-wider">
                            {mounted ? currentTime.toLocaleTimeString() : '--:--:--'}
                        </div>
                        <div className="text-sm text-gray-300">
                            {mounted ? currentTime.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }) : 'Loading...'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6 bg-black/30 backdrop-blur-md rounded-xl p-2 border border-white/20">
                <div className="flex flex-wrap gap-2">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    activeSection === section.id
                                        ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                                        : "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {section.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {activeSection === "overview" && (
                    <div className="space-y-6">
                        {/* Live Statistics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-black/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Globe className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <span className="text-gray-400">
                                        ISS Crew
                                    </span>
                                </div>
                                <div className="text-3xl font-bold text-blue-400">
                                    {liveStats.issAstronauts}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Astronauts in orbit
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-black/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                                        <Activity className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <span className="text-gray-400">
                                        Solar Wind
                                    </span>
                                </div>
                                <div className="text-3xl font-bold text-yellow-400">
                                    {liveStats.solarWindSpeed}
                                </div>
                                <div className="text-sm text-gray-500">
                                    km/s velocity
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-black/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <Calendar className="w-6 h-6 text-green-400" />
                                    </div>
                                    <span className="text-gray-400">
                                        Space Weather
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-green-400">
                                    {liveStats.geomagneticActivity}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Geomagnetic status
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-black/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Rocket className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <span className="text-gray-400">
                                        Active Missions
                                    </span>
                                </div>
                                <div className="text-3xl font-bold text-purple-400">
                                    {liveStats.activeMissions}
                                </div>
                                <div className="text-sm text-gray-500">
                                    NASA programs
                                </div>
                            </div>
                        </div>

                        {/* Quick Preview Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                                    Today&apos;s Asteroid Activity
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Near-Earth Objects:
                                        </span>
                                        <span className="text-orange-400 font-semibold">
                                            Loading...
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Potentially Hazardous:
                                        </span>
                                        <span className="text-red-400 font-semibold">
                                            Monitoring
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Status:
                                        </span>
                                        <span className="text-green-400 font-semibold">
                                            All Clear
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <Camera className="w-6 h-6 text-blue-400" />
                                    Daily Space Image
                                </h3>
                                <div className="aspect-video bg-linear-to-br from-blue-900/30 to-purple-900/30 rounded-lg flex items-center justify-center mb-3">
                                    <div className="text-center">
                                        <Camera className="w-8 h-8 text-white/50 mx-auto mb-2" />
                                        <p className="text-white/70 text-sm">
                                            NASA APOD Loading...
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Astronomy Picture of the Day from NASA
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "asteroids" && <RealNEOTracker />}
                {activeSection === "apod" && <RealAPOD />}
                {activeSection === "mars" && <SimpleMarsWeather />}

                {activeSection === "earth" && <RealEarthImagery />}

                {activeSection === "solar" && <RealSolarFlareMonitor />}
            </div>

            {/* Status Footer */}
            <div className="mt-8 bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-300">
                                Live Data Feed Active
                            </span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400">
                            NASA API Integration
                        </span>
                    </div>
                    <div className="text-gray-400">
                        🚀 Ready for YouTube Streaming • Last updated:{" "}
                        {mounted ? currentTime.toLocaleTimeString() : '--:--:--'}
                    </div>
                </div>
            </div>
        </div>
    );
}
