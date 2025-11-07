"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
    Globe,
    Camera,
    Clock,
    Satellite,
    MapPin,
    Image as ImageIcon,
} from "lucide-react";
import { dashboardConfig } from "../config/dashboard";

const RealEarthImagery = () => {
    const [epicData, setEpicData] = useState([]);
    const [currentImage, setCurrentImage] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    const generateFallbackData = useCallback(() => {
        // Generate sample data when API is unavailable
        const sampleImages = [
            {
                image: "epic_earth_001",
                date: new Date().toISOString(),
                caption: "Earth from DSCOVR satellite",
                imageUrl:
                    "https://epic.gsfc.nasa.gov/epic-galleries/2023/lunar_transit/thumbs/epic_1b_20230222173135.jpg",
                displayTime: new Date().toLocaleString(),
                coordinates: { lat: 0, lon: 0 },
            },
            {
                image: "epic_earth_002",
                date: new Date(Date.now() - 3600000).toISOString(),
                caption: "Pacific Ocean view from space",
                imageUrl:
                    "https://epic.gsfc.nasa.gov/epic-galleries/2023/eclipse/thumbs/epic_1b_20231014153201.jpg",
                displayTime: new Date(Date.now() - 3600000).toLocaleString(),
                coordinates: { lat: 15, lon: -120 },
            },
        ];

        setEpicData(sampleImages);
        setCurrentImage(sampleImages[0]);
        setImageIndex(0);
        setLastUpdated(new Date());
    }, []);

    const fetchEarthImagery = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch latest EPIC images
            const response = await fetch(
                `${dashboardConfig.apis.nasa.endpoints.epic}/images?api_key=${dashboardConfig.apis.nasa.apiKey}`
            );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: Failed to fetch Earth imagery`
                );
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                // Process the image data
                const processedImages = data
                    .slice(0, 10)
                    .map((item, index) => ({
                        ...item,
                        imageUrl: constructImageUrl(item),
                        displayTime: new Date(item.date).toLocaleString(),
                        coordinates: item.centroid_coordinates || {
                            lat: item.dscovr_j2000_position?.y || 0,
                            lon: item.dscovr_j2000_position?.x || 0,
                        },
                    }));

                setEpicData(processedImages);
                setCurrentImage(processedImages[0]);
                setImageIndex(0);
                setLastUpdated(new Date());
            } else {
                throw new Error("No imagery data available");
            }
        } catch (err) {
            console.error("Error fetching EPIC data:", err);
            setError(err.message);

            // Generate fallback data
            setTimeout(() => generateFallbackData(), 0);
        } finally {
            setLoading(false);
        }
    }, [generateFallbackData]);

    const constructImageUrl = (imageData) => {
        // Construct the full image URL from EPIC data
        if (!imageData.date || !imageData.image) return null;

        const date = new Date(imageData.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `https://api.nasa.gov/EPIC/archive/natural/${year}/${month}/${day}/png/${imageData.image}.png?api_key=${dashboardConfig.apis.nasa.apiKey}`;
    };

    const nextImage = useCallback(() => {
        if (epicData.length > 1) {
            const nextIndex = (imageIndex + 1) % epicData.length;
            setImageIndex(nextIndex);
            setCurrentImage(epicData[nextIndex]);
        }
    }, [epicData, imageIndex]);

    const previousImage = useCallback(() => {
        if (epicData.length > 1) {
            const prevIndex =
                imageIndex === 0 ? epicData.length - 1 : imageIndex - 1;
            setImageIndex(prevIndex);
            setCurrentImage(epicData[prevIndex]);
        }
    }, [epicData, imageIndex]);

    useEffect(() => {
        fetchEarthImagery();

        // Auto-refresh every hour
        const refreshInterval = setInterval(() => {
            setTimeout(fetchEarthImagery, 0);
        }, 3600000);

        // Auto-rotate images every 30 seconds
        const rotateInterval = setInterval(() => {
            if (epicData.length > 1) {
                setTimeout(nextImage, 0);
            }
        }, 30000);

        return () => {
            clearInterval(refreshInterval);
            clearInterval(rotateInterval);
        };
    }, [fetchEarthImagery, nextImage, epicData.length]);

    if (loading) {
        return (
            <div className="glass-panel p-6 h-full flex items-center justify-center">
                <div className="text-center">
                    <Satellite className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-bounce" />
                    <p className="text-white/80">Loading Earth Imagery...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Globe className="w-6 h-6 text-blue-400" />
                        <Camera className="w-3 h-3 text-green-400 absolute -top-1 -right-1" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            Earth from Space
                        </h3>
                        <p className="text-sm text-white/60">
                            NASA EPIC Camera {error && "• Demo Mode"}
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
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-2 mb-4">
                    <div className="flex items-center gap-2 text-blue-300 text-sm">
                        <ImageIcon className="w-4 h-4" />
                        Using sample imagery - EPIC API may be temporarily
                        unavailable
                    </div>
                </div>
            )}

            {/* Main Image Display */}
            <div className="flex-1 flex flex-col">
                {currentImage && (
                    <div className="relative flex-1 bg-black/20 rounded-lg overflow-hidden border border-white/10">
                        <div
                            className="absolute inset-0 bg-center bg-cover"
                            style={{
                                backgroundImage: currentImage.imageUrl
                                    ? `url(${currentImage.imageUrl})`
                                    : "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                            }}
                        >
                            {/* Image Loading Overlay */}
                            {imageLoading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="text-white">
                                        <Satellite className="w-8 h-8 mx-auto mb-2 animate-spin" />
                                        <p>Loading image...</p>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Controls */}
                            {epicData.length > 1 && (
                                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                                    <button
                                        onClick={previousImage}
                                        className="px-3 py-1 bg-black/50 text-white rounded-lg text-sm hover:bg-black/70 transition-colors"
                                    >
                                        ←
                                    </button>
                                    <span className="px-3 py-1 bg-black/50 text-white rounded-lg text-sm">
                                        {imageIndex + 1} / {epicData.length}
                                    </span>
                                    <button
                                        onClick={nextImage}
                                        className="px-3 py-1 bg-black/50 text-white rounded-lg text-sm hover:bg-black/70 transition-colors"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Hidden image for preloading and error handling */}
                        {currentImage.imageUrl && (
                            <Image
                                src={currentImage.imageUrl}
                                alt="Earth from space"
                                width={1}
                                height={1}
                                className="hidden"
                                onLoad={() => setImageLoading(false)}
                                onError={() => {
                                    setImageLoading(false);
                                    console.log(
                                        "Image failed to load:",
                                        currentImage.imageUrl
                                    );
                                }}
                                onLoadingComplete={() => setImageLoading(false)}
                            />
                        )}
                    </div>
                )}

                {/* Image Info */}
                {currentImage && (
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-white/80">
                                <MapPin className="w-4 h-4 text-green-400" />
                                <span>
                                    {currentImage.coordinates?.lat?.toFixed(
                                        2
                                    ) || "0.00"}
                                    °,
                                    {currentImage.coordinates?.lon?.toFixed(
                                        2
                                    ) || "0.00"}
                                    °
                                </span>
                            </div>
                            <div className="text-white/60">
                                {currentImage.displayTime}
                            </div>
                        </div>

                        {currentImage.caption && (
                            <p className="text-white/70 text-sm">
                                {currentImage.caption}
                            </p>
                        )}

                        <div className="flex justify-between text-xs text-white/50">
                            <span>
                                DSCOVR EPIC Camera • 1.5 million km from Earth
                            </span>
                            <span>Auto-updates hourly</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RealEarthImagery;
