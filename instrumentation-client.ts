import { initBotId } from 'botid/client/core';

// Define the paths that need bot protection
initBotId({
  protect: [
    {
      path: '/api/analytics',
      method: 'POST',
    },
    {
      path: '/api/progress',
      method: 'POST',
    },
    {
      path: '/api/leaderboard',
      method: 'GET',
    },
    {
      // Protect all lesson API endpoints
      path: '/api/lesson/*',
      method: 'POST',
    },
  ],
});
