import { createFileRoute } from '@tanstack/react-router';
import { RoomPage } from '../components/RoomPage';

export const Route = createFileRoute('/poker/$slug')({
  component: () => {
    const { slug } = Route.useParams();
    return <RoomPage slug={slug} />;
  },
});
