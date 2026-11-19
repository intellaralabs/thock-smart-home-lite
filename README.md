# Maple House Lite: free smart home dashboard

A free, MIT-licensed smart home dashboard built with **[Thock UI](https://thock-ui.vercel.app)**, the tactile React
component library by Intellara Labs. It has three screens, light and dark themes, and works on phones.

**Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Radix UI, lucide-react, next-themes.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Screens

| Route | What it shows |
| --- | --- |
| `/` | Live power, devices on, temperature, doors, scenes, rooms with light switches, favourites, energy this week |
| `/devices` | Every device grouped by room, with search, a room picker and type filters. `?room=kitchen` opens one room |
| `/settings` | Profile, light/dark/system theme and notification switches |

## Project structure

```
app/                  layout.tsx (theme + state + shell) and one page per screen
components/ui/        Thock UI components (free, MIT; yours to edit)
components/lite/      app parts: shell, state provider, device row, screens
data/home.ts          demo data and the types the UI expects
lib/links.ts          Pro links and previews; set showProPreviews = false to remove them all
styles/tactile.css    design tokens: colours, raised and recessed surfaces, LEDs
```

## Connecting real devices

All state lives in `components/lite/home-provider.tsx`. Screens only call `useHome()` (`update`, `updateMany`,
`runScene`). Load your devices from your hub (Home Assistant, SmartThings, MQTT or your own API) instead of
`data/home.ts`, and send each action to the hub as well as to the reducer.

## Building your own product on this?

The "More screens" menu, the `/pro/*` preview pages, the overview teaser, the "Get Pro" button and the footer
are all switched off by one line in `lib/links.ts`:

```ts
export const showProPreviews = false;
```

You can then also delete `app/pro`, `data/pro-screens.ts`, `components/lite/pro-*.tsx` and `public/pro`.

## Want more?

The **full Smart Home template** has 13 screens:

- energy and solar charts, plus a live gauge
- alarm modes, locks and camera feeds
- automations with a step-by-step wizard, and a scene builder
- lighting faders and colour pickers
- climate knobs and heating schedules
- a ⌘K command menu
- sign-in screens

It's built with the Pro components (knobs, faders, gauges, sheets, toasts and more):
[thock-ui.vercel.app/templates/smart-home](https://thock-ui.vercel.app/templates/smart-home).

## Licence

MIT. See [LICENSE](LICENSE).
