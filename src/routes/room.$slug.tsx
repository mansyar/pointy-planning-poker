import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/room/$slug')({
  beforeLoad: ({ params }) => {
    // Redirect to the new /poker/:slug route
    // Maintain this redirect for at least 6 months for backward compatibility with shared links
    throw redirect({
      to: '/poker/$slug',
      params: { slug: params.slug },
    });
  },
});
