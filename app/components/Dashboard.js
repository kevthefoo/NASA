"use client";

import { useState, useEffect } from "react";
import {
    Rocket,
    Star,
    Activity,
    AlertTriangle,
    Sun,
    Calendar,
    Globe,
    Satellite,
    Telescope,
} from "lucide-react";
import Header from "@/app/components/Header";
import NEOTracker from "./NEOTracker";
import MarsWeather from "./MarsWeather";
import SolarFlareMonitor from "./SolarFlareMonitor";
import AstronomicalEvents from "./AstronomicalEvents";

export default function Dashboard() {
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
        { id: "solar", label: "Solar Activity", icon: Activity },
        { id: "mars", label: "Mars Weather", icon: Sun },
        { id: "asteroids", label: "Asteroid Watch", icon: AlertTriangle },
        { id: "events", label: "Celestial Events", icon: Calendar },
    ];

    return (
        <div className="h-screen overflow-hidden p-3 text-white flex flex-col">
            {/* <Header mounted={mounted} currentTime={currentTime}/> */}

            {/* Compact Navigation Tabs */}
            <div className="mb-3 bg-black/30 backdrop-blur-md rounded-lg p-1 border border-white/20 shrink-0">
                <div className="flex gap-1">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                                    activeSection === section.id
                                        ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                        : "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {section.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area - Flexible Height */}
            <div className="flex-1 overflow-hidden">
                {activeSection === "overview" && (
                    <div className="h-full flex flex-col gap-3">
                        {/* Compact Live Statistics Grid */}
                        <div className="grid grid-cols-4 gap-3 shrink-0">
                            <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/20 hover:bg-black/50 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1 bg-blue-500/20 rounded">
                                        <Globe className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-gray-400 text-xs">
                                        ISS Crew
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-blue-400">
                                    {liveStats.issAstronauts}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Astronauts
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/20 hover:bg-black/50 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1 bg-yellow-500/20 rounded">
                                        <Activity className="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <span className="text-gray-400 text-xs">
                                        Solar Wind
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-yellow-400">
                                    {liveStats.solarWindSpeed}
                                </div>
                                <div className="text-xs text-gray-500">
                                    km/s
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/20 hover:bg-black/50 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1 bg-green-500/20 rounded">
                                        <Calendar className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span className="text-gray-400 text-xs">
                                        Space Weather
                                    </span>
                                </div>
                                <div className="text-lg font-bold text-green-400">
                                    {liveStats.geomagneticActivity}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Status
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/20 hover:bg-black/50 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1 bg-purple-500/20 rounded">
                                        <Rocket className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <span className="text-gray-400 text-xs">
                                        Missions
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-purple-400">
                                    {liveStats.activeMissions}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Active
                                </div>
                            </div>
                        </div>

                        {/* Compact Preview Cards */}
                        <div className="grid grid-cols-3 gap-3 flex-1 overflow-hidden">
                            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 h-full flex flex-col">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <Satellite className="w-5 h-5 text-blue-400" />
                                    ISS Live Tracker
                                </h3>
                                <div className="space-y-2 flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            Current Crew:
                                        </span>
                                        <span className="text-blue-400 font-semibold">
                                            7 Astronauts
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            Orbital Speed:
                                        </span>
                                        <span className="text-green-400 font-semibold">
                                            27,600 km/h
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            Status:
                                        </span>
                                        <span className="text-green-400 font-semibold flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            Live Tracking
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 h-full flex flex-col">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <Telescope className="w-5 h-5 text-purple-400" />
                                    Exoplanet Discoveries
                                </h3>
                                <div className="space-y-2 flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            Confirmed Planets:
                                        </span>
                                        <span className="text-purple-400 font-semibold">
                                            5,571+
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            Potentially Habitable:
                                        </span>
                                        <span className="text-green-400 font-semibold">
                                            64 Worlds
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            Latest Discovery:
                                        </span>
                                        <span className="text-yellow-400 font-semibold">
                                            TOI-715 b
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 h-full flex flex-col">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-yellow-400" />
                                    Upcoming Events
                                </h3>
                                <div className="space-y-2 flex-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            Quadrantids Peak:
                                        </span>
                                        <span className="text-yellow-400 font-semibold">
                                            Jan 4, 2026
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            Mars Opposition:
                                        </span>
                                        <span className="text-red-400 font-semibold">
                                            Jan 16, 2026
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            Next Eclipse:
                                        </span>
                                        <span className="text-purple-400 font-semibold">
                                            Mar 14, 2026
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "solar" && (
                    <div className="h-full overflow-hidden">
                        <SolarFlareMonitor />
                    </div>
                )}

                {activeSection === "mars" && (
                    <div className="h-full overflow-hidden">
                        <MarsWeather />
                    </div>
                )}

                {activeSection === "asteroids" && (
                    <div className="h-full overflow-hidden">
                        <NEOTracker />
                    </div>
                )}

                {activeSection === "events" && (
                    <div className="h-full overflow-hidden">
                        <AstronomicalEvents />
                    </div>
                )}
            </div>

            {/* Compact Status Footer */}
            <div className="mt-3 bg-black/20 backdrop-blur-md rounded-lg p-2 border border-white/10 shrink-0">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-300">Live Feed</span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400">NASA API</span>
                    </div>
                    <div className="text-gray-400">
                        {mounted
                            ? currentTime.toLocaleTimeString()
                            : "--:--:--"}
                    </div>
                </div>
            </div>
        </div>
    );
}
