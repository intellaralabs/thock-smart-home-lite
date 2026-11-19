/*
 * Demo data. Replace it with data from your hub or API; the types below are the shape the UI expects.
 */

export type RoomId = "living" | "kitchen" | "bedroom" | "office" | "hallway";
export type DeviceType = "light" | "plug" | "thermostat" | "lock" | "speaker" | "blind";

export type Device = {
  id: string;
  name: string;
  room: RoomId;
  type: DeviceType;
  /** Powered on. For locks: locked. */
  on: boolean;
  /** Draw when on, in watts. */
  watts: number;
  /** light brightness, blind position or speaker volume, 0–100 */
  level?: number;
  /** thermostat target, °C */
  target?: number;
  /** thermostat current reading, °C */
  temperature?: number;
  favourite?: boolean;
};

export type Scene = { id: string; name: string; description: string; changes: { id: string; patch: Partial<Device> }[] };

export const home = { name: "Maple House", owner: "Sam Carter", outside: 14 };

export const rooms: { id: RoomId; name: string }[] = [
  { id: "living", name: "Living room" },
  { id: "kitchen", name: "Kitchen" },
  { id: "bedroom", name: "Bedroom" },
  { id: "office", name: "Office" },
  { id: "hallway", name: "Hallway" },
];

export const devices: Device[] = [
  { id: "living-ceiling", name: "Ceiling light", room: "living", type: "light", on: true, watts: 12, level: 72, favourite: true },
  { id: "living-lamp", name: "Floor lamp", room: "living", type: "light", on: true, watts: 9, level: 40 },
  { id: "living-speaker", name: "Speaker", room: "living", type: "speaker", on: false, watts: 8, level: 30 },
  { id: "living-blind", name: "Blinds", room: "living", type: "blind", on: true, watts: 2, level: 60 },
  { id: "living-thermostat", name: "Thermostat", room: "living", type: "thermostat", on: true, watts: 900, target: 21.5, temperature: 21.1, favourite: true },
  { id: "kitchen-pendants", name: "Pendants", room: "kitchen", type: "light", on: false, watts: 18, level: 100 },
  { id: "kitchen-kettle", name: "Kettle plug", room: "kitchen", type: "plug", on: false, watts: 2200 },
  { id: "kitchen-coffee", name: "Coffee machine", room: "kitchen", type: "plug", on: true, watts: 45, favourite: true },
  { id: "bedroom-lamp", name: "Bedside lamp", room: "bedroom", type: "light", on: false, watts: 6, level: 30 },
  { id: "bedroom-thermostat", name: "Radiator", room: "bedroom", type: "thermostat", on: true, watts: 600, target: 18, temperature: 18.4 },
  { id: "bedroom-blind", name: "Blackout blind", room: "bedroom", type: "blind", on: true, watts: 2, level: 100 },
  { id: "office-desk", name: "Desk lamp", room: "office", type: "light", on: true, watts: 7, level: 85 },
  { id: "office-plug", name: "Monitor plug", room: "office", type: "plug", on: true, watts: 60 },
  { id: "hallway-light", name: "Hall light", room: "hallway", type: "light", on: false, watts: 8, level: 60 },
  { id: "front-lock", name: "Front door", room: "hallway", type: "lock", on: true, watts: 1, favourite: true },
  { id: "back-lock", name: "Back door", room: "kitchen", type: "lock", on: false, watts: 1 },
];

export const scenes: Scene[] = [
  {
    id: "morning",
    name: "Good morning",
    description: "Blinds up, kitchen lights and coffee on",
    changes: [
      { id: "living-blind", patch: { on: true, level: 100 } },
      { id: "bedroom-blind", patch: { on: true, level: 100 } },
      { id: "kitchen-pendants", patch: { on: true, level: 100 } },
      { id: "kitchen-coffee", patch: { on: true } },
    ],
  },
  {
    id: "movie",
    name: "Movie night",
    description: "Dim living room, blinds down, speaker on",
    changes: [
      { id: "living-ceiling", patch: { on: true, level: 15 } },
      { id: "living-lamp", patch: { on: true, level: 10 } },
      { id: "living-blind", patch: { on: true, level: 0 } },
      { id: "living-speaker", patch: { on: true, level: 45 } },
    ],
  },
  {
    id: "away",
    name: "Leaving home",
    description: "Everything off, doors locked",
    changes: [
      ...["living-ceiling", "living-lamp", "living-speaker", "kitchen-pendants", "kitchen-coffee", "bedroom-lamp", "office-desk", "hallway-light"].map(
        (id) => ({ id, patch: { on: false } }),
      ),
      { id: "front-lock", patch: { on: true } },
      { id: "back-lock", patch: { on: true } },
    ],
  },
];

/** Whole-home use per day this week (kWh), Monday first. */
export const usageWeek = [21.4, 19.8, 23.1, 20.6, 24.9, 28.3, 17.2];
export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
