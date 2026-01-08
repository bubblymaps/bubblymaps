import { notFound, redirect } from "next/navigation"
import { auth } from "@/server/auth"
import { Waypoints } from "@/server/waypoints/waypoints"
import { WaypointEditForm } from "@/components/waypoint-edit-form"
import { canEditWaypoint } from "@/server/xp/exp"
import type { Waypoint } from "@/types/waypoints"
import { Footer } from "@/components/footer"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WaypointEditPage({ params }: PageProps) {
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)

  if (isNaN(id)) {
    notFound()
  }

  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const allowed = await canEditWaypoint(session.user.id)
  if (!allowed) {
    return (
      <h1>You do not have permission to edit this waypoint.</h1>
    )
  }

  const waypoint = await Waypoints.byId(id)

  if (!waypoint) {
    notFound()
  }

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-2xl">
          <WaypointEditForm waypoint={waypoint as unknown as Waypoint} />
        </div>
      </div>
      <Footer />
    </>
  )
}
