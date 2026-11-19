import { Suspense } from "react";
import { Devices } from "@/components/lite/devices";

export const metadata = { title: "Devices" };

export default function DevicesPage() {
  // useSearchParams (for ?room=) needs a Suspense boundary on a static page.
  return (
    <Suspense>
      <Devices />
    </Suspense>
  );
}
