'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { Waypoint } from '@/types/waypoints';

export default function Wp() {
  const { id } = useParams<{ id: string }>();
  const [wp, setWpData] = useState<Waypoint | null>(null);

  useEffect(() => {
    fetch(`/api/waypoints/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then(data => setWpData(data.waypoint));
  }, [id]);

  console.log('Waypoint data:', wp?.name);

  return (
    <div>Waypoint Page: {wp?.name}</div>
  )
}