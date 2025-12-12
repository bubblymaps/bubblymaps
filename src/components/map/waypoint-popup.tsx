"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { Verified } from "@/components/badges/verified";

interface WaypointPopupProps {
  name?: string;
  coordinates: [number, number];
  id: number;
  [key: string]: any;
}

export default function WaypointPopup({ coordinates, id }: WaypointPopupProps) {

  const [lng, lat] = coordinates ?? [0, 0];
  const [addedBy, setAddedBy] = useState<any>(undefined);
  const [desc, setDesc] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | undefined>(undefined);
  const [maintainer, setMaintainer] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/waypoints/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const waypoint = data.waypoint;

        setAddedBy(waypoint.addedBy);
        setDesc(waypoint.description);
        setVerified(waypoint.verified);
        setApproved(waypoint.approved);
        setAmenities(waypoint.amenities || []);
        setImageUrl(waypoint.image || null);
        setName(waypoint.name || undefined);
        setMaintainer(waypoint.maintainer || undefined);
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Error: ${err}`);
      })
  }, [id]);


  return (
    <Card className="min-w-[230px] rounded-xl p-0">
      {imageUrl ? (
        <div className="w-full aspect-[3/1] relative">
          <img
            src={imageUrl}
            alt={'Waypoint image'}
            className="w-full h-full object-cover rounded-t-xl"
            style={{ display: 'block', margin: 0, padding: 0, borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent rounded-t-xl pointer-events-none" />
        </div>
      ) : null}

      <CardHeader className={`flex flex-col items-center rounded-t-xl ${imageUrl ? 'ml-4 -mt-4 mb-1 p-0' : 'mt-2 -mb-1 -ml-3 -mr-3 py-2'}`}>
        <CardTitle className="text-lg font-extrabold tracking-wide text-zinc-800 dark:text-zinc-100 drop-shadow-sm mt-0">
          {name} {verified && <Verified content={`Verified by ${maintainer}.`} />}
        </CardTitle>
      </CardHeader>

      <CardContent className="py-1 text-sm">
        {desc && (
          <div className="border border-border/60 bg-muted/30 rounded-lg p-2 -mt-6 -ml-3 -mr-3 mb-2">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Description
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed text-pretty">
              {desc.length > 120 ? desc.slice(0, 117) + "…" : desc}
            </p>
          </div>
        )}

        {amenities && amenities.length > 0 && (
          <div className="mt-0 flex flex-wrap gap-2 mt-3 -ml-3 -mr-3 mb-2">
            {amenities.map((amenity, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {addedBy && (
          <div className="p-2 -mt-1 -ml-4 -mr-3 mb-0">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Added by
            </h4>
            <div className="flex items-center gap-2 mb-2 mt-2">
              {addedBy.image && (
                <a
                  href={`/profile/${addedBy.handle}`}
                  className="font-medium"
                >
                  <img
                    src={addedBy.image}
                    alt={addedBy.displayName}
                    className="w-7 h-7 rounded-full border object-cover"
                  />
                </a>
              )}

              <a
                href={`/profile/${addedBy.handle}`}
                className="font-medium"
              >
                {addedBy.handle}
              </a>

              {addedBy.verified && (
                <Verified content={`Official account of a government, organization, or recognized entity.`} />
              )}
            </div>
          </div>
        )}

        <button
            type="submit"
            className="-ml-2 -mr-2 px-4 h-8 rounded-md bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors -mt-2 mb-2 w-[calc(100%+1rem)]"
        >
            <a href={`/waypoints/${id}`} className="w-full h-full flex items-center justify-center">
              View more
            </a>
        </button>

      </CardContent>
    </Card>
  );
}