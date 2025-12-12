"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface WaypointPopupProps {
  name?: string;
  coordinates: [number, number];
  id: number;
  [key: string]: any;
}

export default function WaypointPopup({ coordinates, id, name }: WaypointPopupProps) {

  const [lng, lat] = coordinates ?? [0, 0];
  const [addedBy, setAddedBy] = useState<any>(undefined);
  const [desc, setDesc] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Error: ${err}`);
      })
  }, [id]);

  return (
    <Card className="min-w-[230px] rounded-xl">
      <CardHeader className="py-2">
        <CardTitle className="text-base font-semibold">
          {name || "Waypoint"}
        </CardTitle>
      </CardHeader>

      <CardContent className="py-1 text-sm space-y-1">
        <div>
          <span className="font-medium">Longitude:</span> {lng.toFixed(5)}
        </div>
        <div>
          <span className="font-medium">Latitude:</span> {lat.toFixed(5)}
        </div>
        <div>
          <span className="font-medium">ID:</span> {id}
        </div>

        {imageUrl && (
          <div className="my-2">
            <img src={imageUrl} alt={name || "Waypoint Image"} className="w-full rounded-md" />
          </div>
        )}

        {name && (
          <>
            <Separator className="my-2" />
            <div>
              <span className="font-medium">Name:</span> {name}
            </div>
          </>
        )}

        {desc && (
          <div>
            <span className="font-medium">Description:</span> {desc}
          </div>
        )}

        {amenities.length > 0 && (
          <div>
            <span className="font-medium">Amenities:</span> {amenities.join(", ")}
          </div>
        )}

        {verified && (
            <div>
              <span className="font-medium text-green-600">Verified</span>
            </div>
        )}

        {approved && (
            <div>
              <span className="font-medium text-blue-600">Approved</span>
            </div>
        )}

        {addedBy && (

          <div className="flex items-center gap-2 mb-2">
            {addedBy.image && (
              <img
                src={addedBy.image}
                alt={addedBy.displayName}
                className="w-7 h-7 rounded-full border object-cover"
              />
            )}

            <span className="font-medium text-gray-900">{addedBy.displayName}</span>

            {addedBy.verified && (
              <span title="User is Verified" className="text-blue-500 ml-1 text-lg">✔️</span>
            )}

          </div>
        )}

      </CardContent>
    </Card>
  );
}