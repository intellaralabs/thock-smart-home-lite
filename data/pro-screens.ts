import { Lightbulb, Shield, Thermometer, Workflow, Zap, type LucideIcon } from "lucide-react";

/** Screens that are only in the full template. Screenshots live in public/pro/<slug>-{dark,light}.jpg. */
export type ProScreen = { slug: string; name: string; icon: LucideIcon; summary: string; points: string[] };

export const proScreens: ProScreen[] = [
  {
    slug: "energy",
    name: "Energy",
    icon: Zap,
    summary: "See what the house uses, what it costs and how much the sun covers.",
    points: [
      "Hourly use and solar, or the last 30 days",
      "Live power gauge and home battery",
      "Use by room and the biggest devices",
      "Costs from your own tariff",
    ],
  },
  {
    slug: "security",
    name: "Security",
    icon: Shield,
    summary: "Alarm, locks and cameras on one screen.",
    points: ["Off / Home / Away / Night alarm modes", "Lock every door in one tap", "Camera feeds with a live clock", "Events and things that need attention"],
  },
  {
    slug: "automations",
    name: "Automations",
    icon: Workflow,
    summary: "Make the house run itself.",
    points: ["Schedules, sensors, arrivals and devices as triggers", "Three-step wizard to create one", "Pause any automation with a switch", "Filter by running or paused"],
  },
  {
    slug: "lighting",
    name: "Lighting",
    icon: Lightbulb,
    summary: "Every light in the house on a mixing desk.",
    points: ["Master dimmer for the whole house", "A fader per light, grouped by room", "Colour picker and warm-to-cool white", "Rooms on or off in one tap"],
  },
  {
    slug: "climate",
    name: "Climate",
    icon: Thermometer,
    summary: "Heating and air quality, room by room.",
    points: ["Thermostat knobs with heat, cool, auto and eco", "Temperature and humidity in every room", "Humidity gauge", "Weekday and weekend heating schedules"],
  },
];
