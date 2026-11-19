"use client";

import { useTheme } from "next-themes";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { home } from "@/data/home";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/lite/page-header";

const notifications = [
  { id: "n-doors", label: "Doors left unlocked", hint: "After 10 minutes", on: true },
  { id: "n-power", label: "High power use", hint: "Above 5 kW for 30 minutes", on: true },
  { id: "n-weekly", label: "Weekly summary", hint: "Mondays at 9:00", on: false },
];

const noop = () => () => {};

export function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  // The theme is only known in the browser; render the radio group unselected on the server.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [saved, setSaved] = useState(false);

  function save(e: FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <>
      <PageHeader title="Settings" description="Your profile and how the app behaves." />
      <div className="grid max-w-2xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Shown to other people in {home.name}.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} onChange={() => setSaved(false)} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Name">
                  <Input name="name" defaultValue={home.owner} autoComplete="name" />
                </FormField>
                <FormField label="Email">
                  <Input name="email" type="email" defaultValue="sam@example.com" autoComplete="email" />
                </FormField>
              </div>
              <FormField label="Home name">
                <Input name="home" defaultValue={home.name} />
              </FormField>
              {saved && (
                <Alert variant="success">
                  <AlertDescription>Saved.</AlertDescription>
                </Alert>
              )}
              <Button type="submit" variant="accent" className="w-fit">
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={mounted ? theme : undefined} onValueChange={setTheme} aria-label="Theme" className="grid gap-3 sm:grid-cols-3">
              {[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "Match system" },
              ].map((o) => (
                <div key={o.value} className="flex items-center gap-3">
                  <RadioGroupItem id={`theme-${o.value}`} value={o.value} />
                  <Label htmlFor={`theme-${o.value}`}>{o.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="gap-0">
            {notifications.map((n, i) => (
              <div key={n.id}>
                {i > 0 && <Separator className="my-1" />}
                <div className="flex items-center gap-4 py-3">
                  <label htmlFor={n.id} className="min-w-0 flex-1 cursor-pointer">
                    <span className="block text-sm font-medium text-fg">{n.label}</span>
                    <span className="block text-xs text-subtle">{n.hint}</span>
                  </label>
                  <Switch id={n.id} size="sm" defaultChecked={n.on} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
