"use client";

import Link from "next/link";
import { Lightbulb, LockKeyhole, Power, Thermometer, Zap } from "lucide-react";
import { home, rooms, scenes, usageWeek, weekdays } from "@/data/home";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DeviceRow } from "@/components/lite/device-row";
import { formatWatts, useHome } from "@/components/lite/home-provider";
import { PageHeader } from "@/components/lite/page-header";
import { proScreens } from "@/data/pro-screens";
import { ProBadge } from "@/components/lite/pro-badge";
import { ProShot } from "@/components/lite/pro-shot";
import { proUrl, showProPreviews } from "@/lib/links";

function Stat({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: React.ReactNode }) {
  return (
    <div className="tactile-tray grid gap-2 rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-subtle">{label}</span>
        <span className="tactile-key pointer-events-none grid size-8 place-items-center rounded-lg [&_svg]:size-4">{icon}</span>
      </div>
      <span className="font-mono text-3xl font-semibold tabular-nums text-fg">{value}</span>
      <span className="text-xs text-subtle">{hint}</span>
    </div>
  );
}

export function Overview() {
  const { devices, liveWatts, activeScene, runScene, updateMany } = useHome();
  const on = devices.filter((d) => d.on && d.type !== "lock");
  const locks = devices.filter((d) => d.type === "lock");
  const thermostats = devices.filter((d) => d.type === "thermostat");
  const inside = thermostats.reduce((s, d) => s + (d.temperature ?? 0), 0) / thermostats.length;
  const lightsOn = devices.filter((d) => d.type === "light" && d.on);
  const max = Math.max(...usageWeek);

  return (
    <>
      <PageHeader title={`Welcome home, ${home.owner.split(" ")[0]}`} description={`${on.length} devices on · using ${formatWatts(liveWatts)} right now`}>
        <Button disabled={!lightsOn.length} onClick={() => updateMany(lightsOn.map((d) => d.id), { on: false })}>
          <Lightbulb /> All lights off
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Power now" value={formatWatts(liveWatts)} hint={`${on.length} devices drawing power`} icon={<Zap />} />
        <Stat label="Devices on" value={`${on.length}/${devices.length - locks.length}`} hint={`${lightsOn.length} lights on`} icon={<Power />} />
        <Stat label="Inside" value={`${inside.toFixed(1)}°`} hint={`Outside ${home.outside}°`} icon={<Thermometer />} />
        <Stat
          label="Doors"
          value={locks.every((l) => l.on) ? "Locked" : "Open"}
          hint={`${locks.filter((l) => l.on).length} of ${locks.length} locked`}
          icon={<LockKeyhole />}
        />
      </div>

      <section aria-labelledby="scenes" className="grid gap-3">
        <h2 id="scenes" className="text-sm font-semibold text-fg">
          Scenes
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {scenes.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={activeScene === s.id}
              onClick={() => runScene(s.id)}
              className="tactile-key grid gap-1 rounded-2xl p-4 text-left outline-offset-2"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-fg">
                <span className="tactile-led size-1.5" /> {s.name}
              </span>
              <span className="text-xs text-subtle">{s.description}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section aria-labelledby="rooms" className="grid content-start gap-3">
          <h2 id="rooms" className="text-sm font-semibold text-fg">
            Rooms
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {rooms.map((r) => {
              const inRoom = devices.filter((d) => d.room === r.id);
              const lights = inRoom.filter((d) => d.type === "light");
              const lit = lights.some((d) => d.on);
              const id = `room-${r.id}`;
              return (
                <div key={r.id} className="tactile-tray grid gap-3 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`/devices?room=${r.id}`} className="font-medium text-fg hover:underline">
                      {r.name}
                    </Link>
                    <Badge variant="well">
                      {inRoom.filter((d) => d.on && d.type !== "lock").length}/{inRoom.filter((d) => d.type !== "lock").length} on
                    </Badge>
                  </div>
                  {lights.length > 0 && (
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor={id} className="text-sm text-subtle">
                        Lights
                      </label>
                      <Switch id={id} size="sm" checked={lit} onCheckedChange={(v) => updateMany(lights.map((l) => l.id), { on: v })} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="favourites" className="grid content-start gap-3">
          <h2 id="favourites" className="text-sm font-semibold text-fg">
            Favourites
          </h2>
          {devices
            .filter((d) => d.favourite)
            .map((d) => (
              <DeviceRow key={d.id} device={d} showRoom />
            ))}
        </section>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Energy this week</CardTitle>
          <CardDescription>{usageWeek.reduce((a, b) => a + b, 0).toFixed(1)} kWh in total</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex h-40 items-end gap-2 sm:gap-4" aria-label="Daily use, kWh">
            {usageWeek.map((v, i) => (
              <li key={weekdays[i]} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="font-mono text-[11px] text-subtle">{v.toFixed(0)}</span>
                <span
                  className="tactile-well relative w-full max-w-10 overflow-hidden rounded-lg"
                  style={{ height: `${(v / max) * 100}%` }}
                  aria-label={`${weekdays[i]}: ${v} kWh`}
                >
                  <span className="absolute inset-x-1 bottom-1 top-1 rounded-md bg-brand shadow-[0_0_10px_var(--tactile-accent-glow)]" />
                </span>
                <span className="text-xs text-subtle">{weekdays[i]}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {showProPreviews && (
        <section aria-labelledby="pro" className="grid gap-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="pro" className="flex items-center gap-2 text-sm font-semibold text-fg">
                In the full template <ProBadge />
              </h2>
              <p className="mt-1 text-sm text-subtle">Energy, security, automations and more, built from the same components.</p>
            </div>
            <a href={proUrl} className="text-sm text-subtle underline-offset-4 hover:text-fg hover:underline">
              See the full template
            </a>
          </div>
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
            {proScreens.map(({ slug, name, icon: Icon }) => (
              <Link
                key={slug}
                href={`/pro/${slug}`}
                className="tactile-tray group grid w-56 flex-none snap-start gap-2 rounded-2xl p-2 outline-none focus-visible:ring-2 focus-visible:ring-(--tactile-focus) sm:w-auto"
              >
                <span className="overflow-hidden rounded-xl">
                  <ProShot slug={slug} alt="" sizes="(min-width: 1024px) 20vw, 224px" className="transition-transform duration-300 group-hover:scale-105" />
                </span>
                <span className="flex items-center gap-2 px-1.5 pb-1 text-sm font-medium text-fg [&_svg]:size-4">
                  <Icon aria-hidden /> {name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
