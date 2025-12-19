interface WpProps {
  params: Promise<{ id: string }>;
}

export default async function Wp({ params }: WpProps) {
  const { id } = await params;

  return (
    <div>Waypoint Page: {id}</div>
  )
}