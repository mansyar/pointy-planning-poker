import { createFileRoute } from '@tanstack/react-router';
import { StandupRoom } from '../components/standup/StandupRoom';

export const Route = createFileRoute('/standup/$slug')({
  component: () => {
    const { slug } = Route.useParams();
    return <StandupRoom slug={slug} />;
  },
});
