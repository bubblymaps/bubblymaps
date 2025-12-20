import { auth } from '@/server/auth';
import NotFound from '@/components/404';
import Dashboard from './dashboard';

export default async function ModPage() {
    const session = await auth();

    if (!session?.user.moderator) {
        return <NotFound />;
    }

    return (
        <Dashboard user={session.user} />
    )
}