import { Blinds, Lightbulb, Lock, Plug, Speaker, Thermometer } from "lucide-react";
import type { DeviceType } from "@/data/home";

const icons = { light: Lightbulb, plug: Plug, thermostat: Thermometer, lock: Lock, speaker: Speaker, blind: Blinds };

export function DeviceIcon({ type, className }: { type: DeviceType; className?: string }) {
  const Icon = icons[type];
  return <Icon className={className} aria-hidden />;
}
