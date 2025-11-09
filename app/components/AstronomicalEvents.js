"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Moon,
    Sun,
    Calendar,
    MapPin,
    Clock,
    Globe,
    Star,
    Sparkles,
    Eye,
    Filter,
    Telescope,
} from "lucide-react";
import {
    format,
    addDays,
    isAfter,
    isBefore,
    differenceInDays,
    addYears,
} from "date-fns";

export default function AstronomicalEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState("all");
    const [selectedPeriod, setSelectedPeriod] = useState("upcoming");

    const generateEventsData = useCallback(() => {
        const currentYear = new Date().getFullYear();

        const eventsData = [
            // Meteor Showers
            {
                id: 1,
                type: "meteor",
                name: "Quadrantids",
                category: "Major",
                date: new Date(`${currentYear + 1}-01-04`),
                peakDate: new Date(`${currentYear + 1}-01-04`),
                duration: 7, // days
                zhr: 120, // Zenith Hourly Rate
                radiant: "Boötes",
                bestViewing: "Pre-dawn hours",
                moonPhase: "New Moon - Excellent conditions",
                visibility: "Northern Hemisphere",
                description:
                    "The Quadrantids are known for their bright fireball meteors with short duration but high intensity.",
                observingTips:
                    "Look northeast after midnight. Peak activity occurs over just a few hours.",
            },
            {
                id: 2,
                type: "meteor",
                name: "Perseids",
                category: "Major",
                date: new Date(`${currentYear + 1}-08-13`),
                peakDate: new Date(`${currentYear + 1}-08-13`),
                duration: 30,
                zhr: 100,
                radiant: "Perseus",
                bestViewing: "Late evening to dawn",
                moonPhase: "Waning Crescent - Good conditions",
                visibility: "Northern Hemisphere",
                description:
                    "One of the most reliable and spectacular meteor showers, known for fast and bright meteors.",
                observingTips:
                    "Best viewed from a dark location away from city lights. No telescope needed.",
            },
            {
                id: 3,
                type: "meteor",
                name: "Geminids",
                category: "Major",
                date: new Date(`${currentYear}-12-14`),
                peakDate: new Date(`${currentYear}-12-14`),
                duration: 14,
                zhr: 120,
                radiant: "Gemini",
                bestViewing: "All night",
                moonPhase: "Full Moon - Poor conditions",
                visibility: "Global",
                description:
                    "Often considered the best meteor shower of the year with multicolored meteors.",
                observingTips:
                    "Look high in the sky around 2 AM. Meteors appear slower than other showers.",
            },

            // Eclipses
            {
                id: 4,
                type: "eclipse",
                subType: "solar",
                name: "Total Solar Eclipse",
                category: "Total",
                date: new Date(`${currentYear + 1}-08-12`),
                duration: 378, // seconds
                magnitude: 1.0386,
                location: "Arctic, Europe, Asia",
                path: "Greenland, Iceland, Spain, Russia, China",
                visibility:
                    "Total eclipse visible across Arctic and northern regions",
                maxEclipse: "17:47 UTC",
                saros: 146,
                description:
                    "A spectacular total solar eclipse crossing multiple continents.",
                observingTips:
                    "Use proper eclipse glasses. Never look directly at the sun without protection.",
            },
            {
                id: 5,
                type: "eclipse",
                subType: "lunar",
                name: "Total Lunar Eclipse",
                category: "Total",
                date: new Date(`${currentYear + 1}-03-14`),
                duration: 200, // minutes
                magnitude: 1.178,
                location: "Global",
                path: "Pacific, Americas, Western Europe, Western Africa",
                visibility:
                    "Total lunar eclipse visible from Americas and western regions",
                maxEclipse: "06:59 UTC",
                saros: 129,
                description:
                    "A beautiful total lunar eclipse creating a 'Blood Moon' effect.",
                observingTips:
                    "Safe to view with naked eye. Best observed during totality phase.",
            },

            // Planetary Conjunctions
            {
                id: 6,
                type: "conjunction",
                name: "Venus-Jupiter Conjunction",
                category: "Close",
                date: new Date(`${currentYear + 1}-05-23`),
                separation: "0.5°", // degrees
                magnitude: "Venus: -4.0, Jupiter: -2.1",
                visibility: "Evening sky",
                direction: "Western horizon",
                bestViewing: "30 minutes after sunset",
                description:
                    "A spectacular close conjunction of the two brightest planets.",
                observingTips:
                    "Look west after sunset. They'll appear as a brilliant 'double star'.",
            },
            {
                id: 7,
                type: "conjunction",
                name: "Mars-Saturn Conjunction",
                category: "Wide",
                date: new Date(`${currentYear + 1}-04-10`),
                separation: "2.1°",
                magnitude: "Mars: 1.2, Saturn: 0.8",
                visibility: "Pre-dawn sky",
                direction: "Eastern horizon",
                bestViewing: "1 hour before sunrise",
                description:
                    "An interesting pairing of the red planet and ringed world.",
                observingTips:
                    "Use binoculars to see Saturn's rings while Mars appears as a red dot.",
            },

            // Other Events
            {
                id: 8,
                type: "opposition",
                name: "Mars Opposition",
                category: "Close",
                date: new Date(`${currentYear + 1}-01-16`),
                magnitude: "-1.4",
                distance: "0.68 AU",
                visibility: "All night",
                bestViewing: "Midnight",
                description:
                    "Mars at its closest approach to Earth, appearing largest and brightest.",
                observingTips:
                    "Perfect time for telescopic observation. Look for polar ice caps and surface features.",
            },
            {
                id: 9,
                type: "transit",
                name: "Mercury Transit",
                category: "Rare",
                date: new Date(`${currentYear + 7}-11-13`),
                duration: 485, // minutes
                visibility: "Americas, Europe, Africa, Asia",
                description:
                    "Mercury passes directly between Earth and the Sun.",
                observingTips:
                    "Requires telescope with solar filter. Mercury appears as tiny black dot crossing Sun's disk.",
            },
            {
                id: 10,
                type: "occultation",
                name: "Moon Occults Venus",
                category: "Bright",
                date: new Date(`${currentYear + 1}-07-19`),
                duration: 45, // minutes
                visibility: "Asia, Australia",
                magnitude: "Venus: -4.1",
                description:
                    "The Moon passes in front of Venus, temporarily hiding it from view.",
                observingTips:
                    "Watch as Venus disappears behind Moon's dark limb and reappears on bright limb.",
            },
        ];

        // Add some past events for comparison
        const pastEvents = [
            {
                id: 11,
                type: "meteor",
                name: "Leonids",
                category: "Variable",
                date: new Date(`${currentYear}-11-17`),
                peakDate: new Date(`${currentYear}-11-17`),
                duration: 21,
                zhr: 15,
                radiant: "Leo",
                bestViewing: "Pre-dawn hours",
                moonPhase: "Full Moon - Poor conditions",
                visibility: "Global",
                description:
                    "Famous for occasional meteor storms, though currently in quiet period.",
                observingTips:
                    "Best viewed after midnight when Leo constellation is high.",
            },
        ];

        setEvents([...eventsData, ...pastEvents]);
        setLoading(false);
    }, []);

    useEffect(() => {
        const initialTimeout = setTimeout(generateEventsData, 0);
        return () => clearTimeout(initialTimeout);
    }, [generateEventsData]);

    const getEventIcon = (type, subType) => {
        switch (type) {
            case "meteor":
                return Sparkles;
            case "eclipse":
                return subType === "solar" ? Sun : Moon;
            case "conjunction":
                return Star;
            case "opposition":
                return Globe;
            case "transit":
                return Eye;
            case "occultation":
                return Telescope;
            default:
                return Calendar;
        }
    };

    const getEventColor = (type, category) => {
        switch (type) {
            case "meteor":
                return category === "Major"
                    ? "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
                    : "text-orange-400 bg-orange-500/20 border-orange-500/30";
            case "eclipse":
                return category === "Total"
                    ? "text-red-400 bg-red-500/20 border-red-500/30"
                    : "text-purple-400 bg-purple-500/20 border-purple-500/30";
            case "conjunction":
                return "text-blue-400 bg-blue-500/20 border-blue-500/30";
            case "opposition":
                return "text-green-400 bg-green-500/20 border-green-500/30";
            case "transit":
                return "text-cyan-400 bg-cyan-500/20 border-cyan-500/30";
            case "occultation":
                return "text-pink-400 bg-pink-500/20 border-pink-500/30";
            default:
                return "text-gray-400 bg-gray-500/20 border-gray-500/30";
        }
    };

    const getTimeUntil = (eventDate) => {
        const now = new Date();
        const diff = differenceInDays(eventDate, now);

        if (diff < 0) return "Past event";
        if (diff === 0) return "Today";
        if (diff === 1) return "Tomorrow";
        if (diff < 30) return `${diff} days`;
        if (diff < 365) return `${Math.floor(diff / 30)} months`;
        return `${Math.floor(diff / 365)} years`;
    };

    const filteredEvents = events.filter((event) => {
        if (selectedType !== "all" && event.type !== selectedType) return false;

        const now = new Date();
        const isPast = isBefore(event.date, now);

        if (selectedPeriod === "upcoming" && isPast) return false;
        if (selectedPeriod === "past" && !isPast) return false;

        return true;
    });

    const sortedEvents = filteredEvents.sort((a, b) => {
        if (selectedPeriod === "upcoming") {
            return a.date.getTime() - b.date.getTime();
        } else {
            return b.date.getTime() - a.date.getTime();
        }
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                    Astronomical Events
                </h2>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 animate-pulse"
                        >
                            <div className="h-6 bg-gray-600 rounded mb-2"></div>
                            <div className="h-4 bg-gray-600 rounded mb-2"></div>
                            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                    Astronomical Events
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar className="w-4 h-4" />
                    Celestial Calendar
                </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Event Type Filter */}
                    <div>
                        <label className="block text-white font-medium mb-2">
                            Event Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                {
                                    id: "all",
                                    label: "All Events",
                                    icon: Calendar,
                                },
                                {
                                    id: "meteor",
                                    label: "Meteor Showers",
                                    icon: Sparkles,
                                },
                                { id: "eclipse", label: "Eclipses", icon: Sun },
                                {
                                    id: "conjunction",
                                    label: "Conjunctions",
                                    icon: Star,
                                },
                                {
                                    id: "opposition",
                                    label: "Oppositions",
                                    icon: Globe,
                                },
                            ].map((filter) => {
                                const Icon = filter.icon;
                                return (
                                    <button
                                        key={filter.id}
                                        onClick={() =>
                                            setSelectedType(filter.id)
                                        }
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                                            selectedType === filter.id
                                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                                                : "bg-white/10 hover:bg-white/20 text-gray-300"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Period Filter */}
                    <div>
                        <label className="block text-white font-medium mb-2">
                            Time Period
                        </label>
                        <div className="flex gap-2">
                            {[
                                { id: "upcoming", label: "Upcoming" },
                                { id: "past", label: "Recent Past" },
                                { id: "all", label: "All Time" },
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedPeriod(filter.id)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                        selectedPeriod === filter.id
                                            ? "bg-purple-500 text-white"
                                            : "bg-white/10 hover:bg-white/20 text-gray-300"
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
                {sortedEvents.map((event) => {
                    const Icon = getEventIcon(event.type, event.subType);
                    const colorClass = getEventColor(
                        event.type,
                        event.category
                    );
                    const isPast = isBefore(event.date, new Date());

                    return (
                        <div
                            key={event.id}
                            className={`bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-black/40 transition-all duration-300 ${
                                isPast ? "opacity-75" : ""
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${colorClass} border`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-white">
                                            {event.name}
                                        </h4>
                                        <p className="text-gray-300 capitalize">
                                            {event.type.replace("_", " ")} •{" "}
                                            {event.category}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {format(
                                                event.date,
                                                "EEEE, MMMM d, yyyy"
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div
                                        className={`font-medium ${
                                            isPast
                                                ? "text-gray-500"
                                                : "text-blue-400"
                                        }`}
                                    >
                                        {getTimeUntil(event.date)}
                                    </div>
                                    {!isPast && (
                                        <div className="text-sm text-gray-400">
                                            {event.type === "eclipse"
                                                ? "until eclipse"
                                                : event.type === "meteor"
                                                ? "until peak"
                                                : "until event"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-300 mb-4">
                                {event.description}
                            </p>

                            {/* Event-specific details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                {event.type === "meteor" && (
                                    <>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                ZHR (Peak):
                                            </span>
                                            <div className="text-white font-medium">
                                                {event.zhr} meteors/hour
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                Radiant:
                                            </span>
                                            <div className="text-white font-medium">
                                                {event.radiant}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                Duration:
                                            </span>
                                            <div className="text-white font-medium">
                                                {event.duration} days
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                Best Viewing:
                                            </span>
                                            <div className="text-white font-medium">
                                                {event.bestViewing}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                Moon Phase:
                                            </span>
                                            <div className="text-white font-medium">
                                                {event.moonPhase}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {event.type === "eclipse" && (
                                    <>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                Maximum:
                                            </span>
                                            <div className="text-white font-medium flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {event.maxEclipse}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                Duration:
                                            </span>
                                            <div className="text-white font-medium">
                                                {event.subType === "solar"
                                                    ? `${Math.floor(
                                                          event.duration / 60
                                                      )}m ${
                                                          event.duration % 60
                                                      }s`
                                                    : `${event.duration} minutes`}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                Magnitude:
                                            </span>
                                            <div className="text-white font-medium">
                                                {event.magnitude}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {event.type === "conjunction" && (
                                    <>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                Separation:
                                            </span>
                                            <div className="text-white font-medium">
                                                {event.separation}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                Magnitude:
                                            </span>
                                            <div className="text-white font-medium">
                                                {event.magnitude}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">
                                                Direction:
                                            </span>
                                            <div className="text-white font-medium">
                                                {event.direction}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <span className="text-gray-400 text-sm">
                                        Visibility:
                                    </span>
                                    <div className="text-white font-medium flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {event.visibility}
                                    </div>
                                </div>
                            </div>

                            {/* Observing Tips */}
                            {event.observingTips && (
                                <div className="bg-black/40 rounded-lg p-3 border-l-4 border-blue-500">
                                    <h5 className="text-blue-400 font-medium mb-1">
                                        Observing Tips
                                    </h5>
                                    <p className="text-gray-300 text-sm">
                                        {event.observingTips}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {sortedEvents.length === 0 && (
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-8 border border-white/10 text-center">
                    <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">
                        No events found
                    </h3>
                    <p className="text-gray-400">
                        Try adjusting your filters to see more astronomical
                        events.
                    </p>
                </div>
            )}
        </div>
    );
}
