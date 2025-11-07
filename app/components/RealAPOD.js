"use client";

import { useState, useEffect } from "react";
import { Camera, Calendar, ExternalLink, Loader } from "lucide-react";
import Image from "next/image";
import { dashboardConfig } from "../config/dashboard";

export default function RealAPOD() {
    const [apod, setApod] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAPOD();
    }, []);

    const fetchAPOD = async () => {
        try {
            setLoading(true);
            setError(null);

            // Using your personal NASA API key for higher rate limits
            const response = await fetch(
                `${dashboardConfig.apis.nasa.endpoints.apod}?api_key=${dashboardConfig.apis.nasa.apiKey}`
            );

            if (!response.ok) {
                // Handle specific HTTP status codes with user-friendly messages
                let errorMessage;
                switch (response.status) {
                    case 429:
                        errorMessage =
                            "Rate limit exceeded - switching to demo image";
                        break;
                    case 503:
                        errorMessage = "NASA APOD API temporarily unavailable";
                        break;
                    case 500:
                        errorMessage =
                            "NASA server error - displaying sample image";
                        break;
                    default:
                        errorMessage = `NASA API error (${response.status}) - using fallback image`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setApod(data);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.warn("APOD API unavailable:", err.message);
            setError(err.message);

            // Generate fallback APOD data with sample space imagery
            const fallbackAPOD = {
                title: "Eagle Nebula Pillars of Creation (Sample)",
                explanation:
                    "This stunning image shows the famous Pillars of Creation in the Eagle Nebula, captured by the Hubble Space Telescope. These towering columns of gas and dust are stellar nurseries where new stars are born. This is sample imagery displayed while the NASA APOD API is temporarily unavailable.",
                url: "https://www.nasa.gov/sites/default/files/thumbnails/image/hubble_birthstars_std_0.jpg",
                hdurl: "https://www.nasa.gov/sites/default/files/images/hubble_birthstars_hd.jpg",
                media_type: "image",
                date: new Date().toISOString().split("T")[0],
                copyright: "NASA/ESA/Hubble Space Telescope",
                service_version: "v1",
            };

            setApod(fallbackAPOD);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Camera className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">
                        Astronomy Picture of the Day
                    </h3>
                </div>
                <div className="aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <Loader className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                        <p className="text-white/70">Loading NASA APOD...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !apod) {
        return (
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Camera className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-semibold text-white">
                        Astronomy Picture of the Day
                    </h3>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                    <p className="text-orange-300">{error}</p>
                    <button
                        onClick={fetchAPOD}
                        className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                    >
                        Try NASA API Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black/30 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
            {/* API Warning Banner */}
            {error && apod && (
                <div className="bg-amber-500/20 border-b border-amber-500/30 p-4">
                    <p className="text-amber-300 text-sm">
                        ⚠️ Showing fallback content - NASA API: {error}
                    </p>
                </div>
            )}

            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Camera className="w-6 h-6 text-blue-400" />
                        <h3 className="text-xl font-semibold text-white">
                            Astronomy Picture of the Day
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4" />
                        {apod?.date}
                    </div>
                </div>
            </div>

            {/* Media */}
            <div className="px-6">
                {apod?.media_type === "image" ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                        <Image
                            src={apod.url}
                            alt={apod.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                ) : apod?.media_type === "video" ? (
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                        <iframe
                            src={apod.url}
                            title={apod.title}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>
                ) : null}
            </div>

            {/* Content */}
            <div className="p-6 pt-0">
                <div className="mb-4">
                    <h4 className="text-lg font-semibold text-white mb-2">
                        {apod?.title}
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                        {apod?.explanation}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">
                            Type: {apod?.media_type}
                        </span>
                        {apod?.copyright && (
                            <span className="text-gray-400">
                                © {apod.copyright}
                            </span>
                        )}
                    </div>
                    {apod?.hdurl && (
                        <a
                            href={apod.hdurl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            HD Image
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
