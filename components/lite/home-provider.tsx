"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { devices as initialDevices, rooms, scenes, type Device, type RoomId } from "@/data/home";

/*
 * All app state lives here, in memory. To connect a real hub, load the devices from your API
 * and send each action to it as well as to the reducer.
 */

type State = { devices: Device[]; activeScene: string | null };
type Action =
  | { type: "update"; id: string; patch: Partial<Device> }
  | { type: "update-many"; ids: string[]; patch: Partial<Device> }
  | { type: "scene"; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "update":
      return { activeScene: null, devices: state.devices.map((d) => (d.id === action.id ? { ...d, ...action.patch } : d)) };
    case "update-many": {
      const ids = new Set(action.ids);
      return { activeScene: null, devices: state.devices.map((d) => (ids.has(d.id) ? { ...d, ...action.patch } : d)) };
    }
    case "scene": {
      const scene = scenes.find((s) => s.id === action.id);
      if (!scene) return state;
      const patches = new Map(scene.changes.map((c) => [c.id, c.patch]));
      return { activeScene: scene.id, devices: state.devices.map((d) => ({ ...d, ...patches.get(d.id) })) };
    }
  }
}

type HomeContext = State & {
  update: (id: string, patch: Partial<Device>) => void;
  updateMany: (ids: string[], patch: Partial<Device>) => void;
  runScene: (id: string) => void;
  /** Total draw right now, in watts. */
  liveWatts: number;
};

const Ctx = createContext<HomeContext | null>(null);

export function HomeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { devices: initialDevices, activeScene: null });
  const value = useMemo<HomeContext>(
    () => ({
      ...state,
      update: (id, patch) => dispatch({ type: "update", id, patch }),
      updateMany: (ids, patch) => dispatch({ type: "update-many", ids, patch }),
      runScene: (id) => dispatch({ type: "scene", id }),
      liveWatts: state.devices.reduce((w, d) => w + (d.on && d.type !== "lock" ? d.watts : 0), 0),
    }),
    [state],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHome() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useHome must be used inside <HomeProvider>");
  return ctx;
}

export const roomName = (id: RoomId) => rooms.find((r) => r.id === id)?.name ?? id;

export const formatWatts = (w: number) => (w >= 1000 ? `${(w / 1000).toFixed(1)} kW` : `${Math.round(w)} W`);
