"use client";

import { Minus, Plus } from "lucide-react";
import type { Device } from "@/data/home";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { DeviceIcon } from "@/components/lite/device-icon";
import { roomName, useHome } from "@/components/lite/home-provider";
import { cn } from "@/lib/utils";

const levelLabel: Partial<Record<Device["type"], string>> = { light: "Brightness", blind: "Position", speaker: "Volume" };

export function status(d: Device) {
  if (d.type === "lock") return d.on ? "Locked" : "Unlocked";
  if (!d.on) return "Off";
  if (d.type === "thermostat") return `${d.temperature?.toFixed(1)} °C → ${d.target} °C`;
  if (d.type === "blind") return d.level === 0 ? "Closed" : `${d.level}% open`;
  if (d.level != null) return `${d.level}%`;
  return "On";
}

/** One device: icon, name, status, on/off switch and, where it makes sense, a level or temperature control. */
export function DeviceRow({ device: d, showRoom = false, className }: { device: Device; showRoom?: boolean; className?: string }) {
  const { update } = useHome();
  const id = `switch-${d.id}`;
  const level = levelLabel[d.type];

  return (
    <div className={cn("tactile-tray grid gap-4 rounded-2xl p-4", className)}>
      <div className="flex items-center gap-3">
        <span
          className="tactile-key grid size-10 flex-none place-items-center rounded-xl [&_svg]:size-[18px]"
          data-selected={d.on || undefined}
          style={d.type === "lock" ? { color: d.on ? "var(--tactile-success)" : "var(--tactile-warning)" } : undefined}
        >
          <DeviceIcon type={d.type} />
        </span>
        <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
          <span className="block truncate text-sm font-medium text-fg">{d.name}</span>
          <span className="block truncate text-xs text-subtle">
            {showRoom && `${roomName(d.room)} · `}
            {status(d)}
          </span>
        </label>
        <Switch id={id} size="sm" checked={d.on} onCheckedChange={(on) => update(d.id, { on })} aria-label={d.type === "lock" ? `${d.name} locked` : undefined} />
      </div>

      {level && d.level != null && (
        <Slider
          aria-label={`${d.name} ${level.toLowerCase()}`}
          value={[d.level]}
          onValueChange={([v]) => update(d.id, { level: v, on: d.type === "blind" ? true : v > 0 })}
          disabled={!d.on && d.type !== "light"}
          className={cn(!d.on && "opacity-50")}
        />
      )}

      {d.type === "thermostat" && d.target != null && (
        <div className="flex items-center justify-between gap-3">
          <Button size="icon-sm" aria-label={`Lower ${d.name}`} onClick={() => update(d.id, { target: Math.max(10, d.target! - 0.5) })}>
            <Minus />
          </Button>
          <output className="font-mono text-2xl font-semibold tabular-nums text-fg" aria-live="polite">
            {d.target.toFixed(1)}°
          </output>
          <Button size="icon-sm" aria-label={`Raise ${d.name}`} onClick={() => update(d.id, { target: Math.min(28, d.target! + 0.5) })}>
            <Plus />
          </Button>
        </div>
      )}
    </div>
  );
}
