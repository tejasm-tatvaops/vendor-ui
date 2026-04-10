import { useState } from "react";
import { SectionTitle, cardClassName } from "./ui";

type Props = {
  location: string;
  address: string;
};

export function LocationMap({ location, address }: Props) {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const [mapError, setMapError] = useState(false);

  return (
    <section className={cardClassName}>
      <SectionTitle icon="📍" title="Location & Map" />
      <p className="mt-1 text-sm text-slate-500">{location}</p>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        {mapError ? (
          <div className="grid h-64 place-items-center bg-slate-50 p-4 text-center">
            <div>
              <p className="text-sm font-semibold text-slate-700">Map preview unavailable</p>
              <p className="mt-1 text-xs text-slate-500">{address}</p>
            </div>
          </div>
        ) : (
          <iframe
            title="Vendor location map"
            src={mapUrl}
            loading="lazy"
            className="h-64 w-full"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => setMapError(true)}
          />
        )}
      </div>
    </section>
  );
}
