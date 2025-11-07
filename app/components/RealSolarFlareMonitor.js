"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Sun,
    Activity,
    AlertTriangle,
    Clock,
    Zap,
    TrendingUp,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { dashboardConfig } from "../config/dashboard";

const RealSolarFlareMonitor = () => {
    const [flareData, setFlareData] = useState([]);
    const [recentFlares, setRecentFlares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const processFlareData = useCallback((flares) => {
        // Sort flares by date
        const sortedFlares = flares.sort(
            (a, b) => new Date(a.beginTime) - new Date(b.beginTime)
        );

        // Group flares by day for chart
        const flaresByDay = {};
        const recentFlares = [];

        sortedFlares.forEach((flare) => {
            const date = new Date(flare.beginTime).toISOString().split("T")[0];
            const intensity = getFlareIntensity(flare.classType);

            if (!flaresByDay[date]) {
                flaresByDay[date] = {
                    date,
                    count: 0,
                    totalIntensity: 0,
                    maxIntensity: 0,
                    flares: [],
                };
            }

            flaresByDay[date].count++;
            flaresByDay[date].totalIntensity += intensity;
            flaresByDay[date].maxIntensity = Math.max(
                flaresByDay[date].maxIntensity,
                intensity
            );
            flaresByDay[date].flares.push(flare);

            // Add to recent flares (last 10)
            if (recentFlares.length < 10) {
                recentFlares.push({
                    ...flare,
                    intensity: intensity,
                    color: getFlareColor(flare.classType),
                });
            }
        });

        // Convert to chart data
        const chartData = Object.values(flaresByDay).map((day) => ({
            date: day.date,
            count: day.count,
            avgIntensity: Math.round(day.totalIntensity / day.count),
            maxIntensity: day.maxIntensity,
            displayDate: new Date(day.date).toLocaleDateString(),
        }));

        return { chartData, recentFlares: recentFlares.reverse() };
    }, []);

    const generateFallbackData = useCallback(() => {
        // Generate simulated data when API is unavailable
        const data = [];
        const recent = [];

        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];

            const count = Math.floor(Math.random() * 8) + 1;
            data.push({
                date: dateStr,
                count: count,
                avgIntensity: Math.floor(Math.random() * 5) + 1,
                maxIntensity: Math.floor(Math.random() * 8) + 2,
                displayDate: date.toLocaleDateString(),
            });

            // Add some recent flares
            if (i < 7) {
                const flareClasses = ["C1.5", "C3.2", "M1.1", "M2.8", "X1.2"];
                const randomClass =
                    flareClasses[
                        Math.floor(Math.random() * flareClasses.length)
                    ];
                recent.push({
                    classType: randomClass,
                    beginTime: date.toISOString(),
                    peakTime: new Date(
                        date.getTime() + 30 * 60000
                    ).toISOString(),
                    intensity: getFlareIntensity(randomClass),
                    color: getFlareColor(randomClass),
                    sourceLocation: `N${Math.floor(
                        Math.random() * 30
                    )}E${Math.floor(Math.random() * 60)}`,
                });
            }
        }

        setFlareData(data);
        setRecentFlares(recent.slice(0, 6));
        setLastUpdated(new Date());
    }, []);

    const fetchSolarFlareData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Get data for the last 30 days
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 30);

            const formatDate = (date) => date.toISOString().split("T")[0];

            const response = await fetch(
                `${dashboardConfig.apis.nasa.endpoints.solarFlares}?` +
                    `startDate=${formatDate(startDate)}&` +
                    `endDate=${formatDate(endDate)}&` +
                    `api_key=${dashboardConfig.apis.nasa.apiKey}`
            );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                // Process flare data for charts
                const processedData = processFlareData(data);
                setFlareData(processedData.chartData);
                setRecentFlares(processedData.recentFlares);
                setLastUpdated(new Date());
            } else {
                // No flares in the period - create empty state
                setFlareData([]);
                setRecentFlares([]);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error("Error fetching solar flare data:", err);
            setError(err.message);

            // Fallback to simulated data if API fails
            setTimeout(() => generateFallbackData(), 0);
        } finally {
            setLoading(false);
        }
    }, [processFlareData, generateFallbackData]);

    const getFlareIntensity = (classType) => {
        if (!classType) return 1;
        const type = classType.toString().toUpperCase();
        if (type.includes("X")) return 10;
        if (type.includes("M")) return 5;
        if (type.includes("C")) return 2;
        if (type.includes("B")) return 1;
        return 1;
    };

    const getFlareColor = (classType) => {
        if (!classType) return "#8B5CF6";
        const type = classType.toString().toUpperCase();
        if (type.includes("X")) return "#EF4444"; // Red - Extreme
        if (type.includes("M")) return "#F97316"; // Orange - Major
        if (type.includes("C")) return "#EAB308"; // Yellow - Moderate
        return "#8B5CF6"; // Purple - Minor
    };

    useEffect(() => {
        fetchSolarFlareData();

        // Auto-refresh every hour
        const interval = setInterval(() => {
            setTimeout(fetchSolarFlareData, 0);
        }, dashboardConfig.refreshRates.neo);

        return () => clearInterval(interval);
    }, [fetchSolarFlareData]);

    if (loading) {
        return (
            <div className="glass-panel p-6 h-full flex items-center justify-center">
                <div className="text-center">
                    <Sun className="w-8 h-8 text-orange-400 mx-auto mb-4 animate-spin" />
                    <p className="text-white/80">
                        Loading Real Solar Flare Data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Sun className="w-6 h-6 text-orange-400" />
                        <Activity className="w-3 h-3 text-red-400 absolute -top-1 -right-1" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            Solar Activity Monitor
                        </h3>
                        <p className="text-sm text-white/60">
                            Real NASA DONKI Data {error && "• Fallback Mode"}
                        </p>
                    </div>
                </div>
                {lastUpdated && (
                    <div className="text-right">
                        <p className="text-xs text-white/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-orange-300 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        API temporarily unavailable - showing simulated data
                    </div>
                </div>
            )}

            <div className="flex-1 space-y-6">
                {/* Activity Chart */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        30-Day Solar Flare Activity
                    </h4>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={flareData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.1)"
                                />
                                <XAxis
                                    dataKey="displayDate"
                                    stroke="rgba(255,255,255,0.6)"
                                    fontSize={10}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.6)"
                                    fontSize={10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(0,0,0,0.9)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#F97316"
                                    name="Flares"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Flares */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Recent Solar Flares
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {recentFlares.length > 0 ? (
                            recentFlares.map((flare, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: flare.color,
                                            }}
                                        ></div>
                                        <div>
                                            <div className="text-white font-medium">
                                                Class{" "}
                                                {flare.classType || "Unknown"}
                                            </div>
                                            <div className="text-white/60 text-sm">
                                                {flare.sourceLocation ||
                                                    "Unknown location"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-white/80">
                                        {new Date(
                                            flare.beginTime
                                        ).toLocaleDateString()}
                                        <br />
                                        <span className="text-xs text-white/50">
                                            {new Date(
                                                flare.beginTime
                                            ).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-white/60">
                                <Sun className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No recent solar flare activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealSolarFlareMonitor;
