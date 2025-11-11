"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Target, Zap, Loader } from "lucide-react";
import { dashboardConfig } from "../config/dashboard";

export default function NEOTracker() {
    const [neoData, setNeoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNEOData();
    }, []);

    const fetchNEOData = async () => {
        try {
            setLoading(true);
            setError(null);

            const today = new Date().toISOString().split("T")[0];
            const response = await fetch(
                `${dashboardConfig.apis.nasa.endpoints.neo}?start_date=${today}&end_date=${today}&api_key=${dashboardConfig.apis.nasa.apiKey}`
            );

            if (!response.ok) {
                // Handle specific HTTP status codes with user-friendly messages
                let errorMessage;
                switch (response.status) {
                    case 429:
                        errorMessage =
                            "Rate limit exceeded - switching to demo mode";
                        break;
                    case 503:
                        errorMessage = "NASA NEO API temporarily unavailable";
                        break;
                    case 500:
                        errorMessage = "NASA server error - using sample data";
                        break;
                    default:
                        errorMessage = `NASA API error (${response.status}) - displaying sample asteroids`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const todaysNEOs = data.near_earth_objects[today] || [];

            // Sort by miss distance (closest first)
            const sortedNEOs = todaysNEOs.sort((a, b) => {
                const distanceA = parseFloat(
                    a.close_approach_data[0]?.miss_distance?.kilometers || 0
                );
                const distanceB = parseFloat(
                    b.close_approach_data[0]?.miss_distance?.kilometers || 0
                );
                return distanceA - distanceB;
            });

            setNeoData({
                count: todaysNEOs.length,
                objects: sortedNEOs.slice(0, 5), // Show top 5
                totalCount: data.element_count,
            });
            setError(null); // Clear any previous errors
        } catch (err) {
            console.warn("NEO API unavailable:", err.message);
            setError(err.message);

            // Generate realistic fallback asteroid data
            const sampleAsteroids = [
                {
                    id: "sample_001",
                    name: "2024 AB1 (Sample)",
                    is_potentially_hazardous_asteroid: false,
                    estimated_diameter: {
                        kilometers: {
                            estimated_diameter_min: 0.045,
                            estimated_diameter_max: 0.101,
                        },
                    },
                    close_approach_data: [
                        {
                            miss_distance: { kilometers: "1892456.789" },
                            relative_velocity: {
                                kilometers_per_second: "18.24",
                            },
                            close_approach_date: new Date()
                                .toISOString()
                                .split("T")[0],
                        },
                    ],
                },
                {
                    id: "sample_002",
                    name: "2024 CD2 (Sample)",
                    is_potentially_hazardous_asteroid: false,
                    estimated_diameter: {
                        kilometers: {
                            estimated_diameter_min: 0.023,
                            estimated_diameter_max: 0.052,
                        },
                    },
                    close_approach_data: [
                        {
                            miss_distance: { kilometers: "3456789.123" },
                            relative_velocity: {
                                kilometers_per_second: "12.67",
                            },
                            close_approach_date: new Date()
                                .toISOString()
                                .split("T")[0],
                        },
                    ],
                },
                {
                    id: "sample_003",
                    name: "2024 EF3 (Sample)",
                    is_potentially_hazardous_asteroid: true,
                    estimated_diameter: {
                        kilometers: {
                            estimated_diameter_min: 0.156,
                            estimated_diameter_max: 0.349,
                        },
                    },
                    close_approach_data: [
                        {
                            miss_distance: { kilometers: "7891234.567" },
                            relative_velocity: {
                                kilometers_per_second: "22.89",
                            },
                            close_approach_date: new Date()
                                .toISOString()
                                .split("T")[0],
                        },
                    ],
                },
            ];

            setNeoData({
                count: sampleAsteroids.length,
                objects: sampleAsteroids,
                totalCount: 8, // Sample total
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDistance = (km) => {
        const distance = parseFloat(km);
        if (distance > 149597870) {
            // More than 1 AU
            return `${(distance / 149597870.7).toFixed(2)} AU`;
        } else if (distance > 1000000) {
            return `${(distance / 1000000).toFixed(2)}M km`;
        } else {
            return `${Math.round(distance).toLocaleString()} km`;
        }
    };

    const getDangerLevel = (neo) => {
        const isHazardous = neo.is_potentially_hazardous_asteroid;
        const distance = parseFloat(
            neo.close_approach_data[0]?.miss_distance?.kilometers || 0
        );

        if (isHazardous && distance < 7500000)
            return { level: "HIGH", color: "text-red-400 bg-red-500/20" };
        if (isHazardous || distance < 15000000)
            return {
                level: "MEDIUM",
                color: "text-yellow-400 bg-yellow-500/20",
            };
        return { level: "LOW", color: "text-green-400 bg-green-500/20" };
    };

    if (loading) {
        return (
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-semibold text-white">
                        Near-Earth Objects Today
                    </h3>
                </div>
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <Loader className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-2" />
                        <p className="text-white/70">
                            Loading asteroid data...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-semibold text-white">
                        Near-Earth Objects Today
                    </h3>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-orange-300 text-sm">
                        <Target className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                    <div className="mt-2 text-xs text-orange-200/70">
                        Displaying sample asteroid data while NASA API recovers
                    </div>
                </div>
                {neoData && (
                    <div className="space-y-4">
                        {/* Sample data display */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white/5 rounded-lg p-4">
                                <div className="text-2xl font-bold text-orange-400">
                                    {neoData.count}
                                </div>
                                <div className="text-sm text-gray-400">
                                    Objects today (sample)
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <div className="text-2xl font-bold text-red-400">
                                    {
                                        neoData.objects.filter(
                                            (obj) =>
                                                obj.is_potentially_hazardous_asteroid
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-gray-400">
                                    Potentially hazardous
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-400">
                                    {neoData.totalCount}
                                </div>
                                <div className="text-sm text-gray-400">
                                    This week (estimate)
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-lg font-semibold text-white">
                                Closest Approaches (Sample Data)
                            </h4>
                            {neoData.objects.map((neo) => (
                                <div
                                    key={neo.id}
                                    className="bg-white/10 rounded-lg p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h5 className="text-white font-medium">
                                                    {neo.name}
                                                </h5>
                                                {neo.is_potentially_hazardous_asteroid && (
                                                    <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                                                        Potentially Hazardous
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-400">
                                                        Miss Distance:
                                                    </span>
                                                    <div className="text-blue-300 font-mono">
                                                        {formatDistance(
                                                            neo
                                                                .close_approach_data[0]
                                                                .miss_distance
                                                                .kilometers
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">
                                                        Velocity:
                                                    </span>
                                                    <div className="text-green-300 font-mono">
                                                        {parseFloat(
                                                            neo
                                                                .close_approach_data[0]
                                                                .relative_velocity
                                                                .kilometers_per_second
                                                        ).toFixed(2)}{" "}
                                                        km/s
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">
                                                        Size:
                                                    </span>
                                                    <div className="text-purple-300 font-mono">
                                                        {(
                                                            neo
                                                                .estimated_diameter
                                                                .kilometers
                                                                .estimated_diameter_min *
                                                            1000
                                                        ).toFixed(0)}
                                                        -
                                                        {(
                                                            neo
                                                                .estimated_diameter
                                                                .kilometers
                                                                .estimated_diameter_max *
                                                            1000
                                                        ).toFixed(0)}
                                                        m
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">
                                                        Date:
                                                    </span>
                                                    <div className="text-yellow-300 font-mono">
                                                        {
                                                            neo
                                                                .close_approach_data[0]
                                                                .close_approach_date
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button
                    onClick={fetchNEOData}
                    className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                >
                    Try NASA API Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-semibold text-white">
                        Near-Earth Objects Today
                    </h3>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">
                        {neoData?.count}
                    </div>
                    <div className="text-sm text-gray-400">asteroids today</div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-400">
                            Total Tracked
                        </span>
                    </div>
                    <div className="text-lg font-bold text-blue-400">
                        {neoData?.totalCount}
                    </div>
                </div>
                <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-400">
                            Potentially Hazardous
                        </span>
                    </div>
                    <div className="text-lg font-bold text-yellow-400">
                        {neoData?.objects?.filter(
                            (neo) => neo.is_potentially_hazardous_asteroid
                        ).length || 0}
                    </div>
                </div>
            </div>

            {/* Asteroid List */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
                <div className="p-4 border-b border-white/10">
                    <h4 className="text-lg font-semibold text-white">
                        Closest Approaches Today
                    </h4>
                </div>
                <div className="divide-y divide-white/10">
                    {neoData?.objects?.map((neo, index) => {
                        const closeApproach = neo.close_approach_data[0];
                        const danger = getDangerLevel(neo);

                        return (
                            <div
                                key={neo.id}
                                className="p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h5 className="text-white font-medium truncate">
                                                {neo.name.replace(/[()]/g, "")}
                                            </h5>
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs font-medium ${danger.color}`}
                                            >
                                                {danger.level}
                                            </span>
                                            {neo.is_potentially_hazardous_asteroid && (
                                                <AlertTriangle className="w-4 h-4 text-red-400 flex-0" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-400">
                                            Miss Distance:
                                        </span>
                                        <div className="text-white font-medium">
                                            {formatDistance(
                                                closeApproach.miss_distance
                                                    .kilometers
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-gray-400">
                                            Velocity:
                                        </span>
                                        <div className="text-white font-medium">
                                            {parseFloat(
                                                closeApproach.relative_velocity
                                                    .kilometers_per_second
                                            ).toFixed(1)}{" "}
                                            km/s
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-gray-400">
                                            Diameter:
                                        </span>
                                        <div className="text-white font-medium">
                                            {Math.round(
                                                neo.estimated_diameter.meters
                                                    .estimated_diameter_min
                                            )}
                                            -
                                            {Math.round(
                                                neo.estimated_diameter.meters
                                                    .estimated_diameter_max
                                            )}
                                            m
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-gray-400">
                                            Time:
                                        </span>
                                        <div className="text-white font-medium">
                                            {new Date(
                                                closeApproach.close_approach_date_full
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Info */}
            <div className="bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>
                        Data from NASA&apos;s Near Earth Object Web Service •
                        Updated hourly
                    </span>
                </div>
            </div>
        </div>
    );
}
