"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { rooms, type Device, type RoomId } from "@/data/home";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DeviceRow } from "@/components/lite/device-row";
import { roomName, useHome } from "@/components/lite/home-provider";
import { PageHeader } from "@/components/lite/page-header";

const groups: { value: string; label: string; types: Device["type"][] }[] = [
  { value: "all", label: "All", types: [] },
  { value: "lights", label: "Lights", types: ["light"] },
  { value: "climate", label: "Climate", types: ["thermostat", "blind"] },
  { value: "security", label: "Security", types: ["lock"] },
  { value: "other", label: "Other", types: ["plug", "speaker"] },
];

export function Devices() {
  const { devices } = useHome();
  const params = useSearchParams();
  const initialRoom = rooms.some((r) => r.id === params.get("room")) ? (params.get("room") as RoomId) : "all";
  const [room, setRoom] = useState<RoomId | "all">(initialRoom);
  const [group, setGroup] = useState("all");
  const [query, setQuery] = useState("");

  const types = groups.find((g) => g.value === group)!.types;
  const q = query.trim().toLowerCase();
  const shown = devices.filter(
    (d) =>
      (room === "all" || d.room === room) &&
      (!types.length || types.includes(d.type)) &&
      (!q || d.name.toLowerCase().includes(q) || roomName(d.room).toLowerCase().includes(q)),
  );
  const byRoom = rooms.map((r) => ({ ...r, items: shown.filter((d) => d.room === r.id) })).filter((r) => r.items.length);

  return (
    <>
      <PageHeader title="Devices" description={`${devices.filter((d) => d.on && d.type !== "lock").length} of ${devices.filter((d) => d.type !== "lock").length} on · ${devices.filter((d) => d.type === "lock" && d.on).length} of ${devices.filter((d) => d.type === "lock").length} doors locked`} />

      <div className="grid gap-3 md:grid-cols-[1fr_14rem]">
        <SearchInput value={query} onValueChange={setQuery} placeholder="Search devices or rooms…" aria-label="Search devices" />
        <Select value={room} onValueChange={(v) => setRoom(v as RoomId | "all")}>
          <SelectTrigger aria-label="Room">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All rooms</SelectItem>
            {rooms.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <ToggleGroup type="single" value={group} onValueChange={(v) => v && setGroup(v)} aria-label="Device type">
          {groups.map((g) => (
            <ToggleGroupItem key={g.value} value={g.value} led>
              {g.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {byRoom.length ? (
        byRoom.map((r) => (
          <section key={r.id} aria-labelledby={`h-${r.id}`} className="grid gap-3">
            <h2 id={`h-${r.id}`} className="text-sm font-semibold text-fg">
              {r.name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {r.items.map((d) => (
                <DeviceRow key={d.id} device={d} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="tactile-well rounded-2xl p-8 text-center text-sm text-subtle">No devices match. Try another search or filter.</p>
      )}
    </>
  );
}
