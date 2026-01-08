"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { Verified } from "@/components/badges/verified";
import { Moderator } from "../badges/moderator";

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
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(0);

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
        const revs = waypoint.reviews || [];
        setReviews(revs);
        if (revs.length) {
          const sum = revs.reduce((s: number, r: any) => s + (r?.rating || 0), 0);
          const avg = sum / revs.length;
          setRating(Number(avg.toFixed(1)));
        } else {
          setRating(0);
        }
        
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Error: ${err}`);
      })
  }, [id]);

  // Render a single star with a clip for partial fills
  const Star = ({ fill, index }: { fill: number; index: number }) => {
    const clipId = `clip-${id}-${index}`;
    const fillPct = Math.max(0, Math.min(100, fill));
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="inline-block">
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={`${fillPct}%`} height="100%" />
          </clipPath>
        </defs>
        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.789 1.402 8.171L12 18.896l-7.336 3.874 1.402-8.171L.132 9.21l8.2-1.192z" fill="#e5e7eb" />
        <g clipPath={`url(#${clipId})`}>
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.789 1.402 8.171L12 18.896l-7.336 3.874 1.402-8.171L.132 9.21l8.2-1.192z" fill="#fbbf24" />
        </g>
      </svg>
    );
  };


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

        <div className="flex flex-col gap-1 w-full -mt-3 mb-1">
          {reviews.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const fill = Math.max(0, Math.min(100, (rating - i) * 100));
                    return <Star key={i} fill={fill} index={i} />;
                  })}
                </div>

              <div className="flex items-center">
                <div className="text-xs text-muted-foreground">({reviews.length})</div>
              </div>
            </div>
          )}
        </div>
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
                  href={`/u/${addedBy.handle}`}
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
                href={`/u/${addedBy.handle}`}
                className="font-medium"
              >
                {addedBy.handle}
              </a>

              {addedBy.verified && (
                <Verified content={`Official account of a government, organization, or recognized entity.`} />
              )}

              {addedBy.moderator && (
                <Moderator />
              )}
            </div>
          </div>
        )}

        <button
            type="submit"
            className="-ml-2 -mr-2 px-4 h-8 rounded-md bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors -mt-2 mb-2 w-[calc(100%+1rem)]"
        >
            <a href={`/w/${id}`} className="w-full h-full flex items-center justify-center">
              View more
            </a>
        </button>

      </CardContent>
    </Card>
  );
}