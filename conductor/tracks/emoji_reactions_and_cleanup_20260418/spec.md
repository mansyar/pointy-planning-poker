# Specification: Emoji Reactions & Automated Cleanup

## Overview

This track finalizes the application's real-time engagement and ephemeral data lifecycle by introducing the final layers of interactive "juice" alongside automated backend cleanup. It implements real-time, auto-expiring floating emoji reactions that stream across the screen to boost participant engagement. Concurrently, it enforces the platform's "zero-storage" philosophy by deploying a robust background cron job (`cleanup.staleRooms`) that automatically purges inactive rooms and associated data after 24 hours.

## Functional Requirements

1. **Emoji Reactions (The "Juice"):**
   - Support a set of predefined emojis: ❤️, 👏, 🔥, 😂, 🎉.
   - **Animation Style:** Emojis burst dynamically from the reacting player's card on the voting table.
   - **Spam Prevention:** Allow rapid local clicks for immediate visual feedback (optimistic UI updates), but batch/throttle the database mutations (`reactions.send`) to prevent Convex overload.
   - **Auto-Expiration:** Emojis automatically expire and are removed from the client DOM after 5 seconds.
2. **Auto-Cleanup Cron Job:**
   - Implement `cleanup.staleRooms` scheduled function running every hour.
   - Identify rooms where `updatedAt` is older than 24 hours.
   - Cascading delete: Purge the room document and all associated `players`, `votes`, `topics`, and `reactions`.
3. **Accessibility (A11y) & Polish:**
   - **Reduced Motion Fallback:** Respect `prefers-reduced-motion`. Instead of floating/bursting, emojis appear static on the screen and simply fade in/out.
   - Ensure the new reaction buttons are keyboard-navigable and have appropriate `aria-label`s.

## Non-Functional Requirements

- **Performance:** Rendering multiple floating emojis simultaneously must not degrade framerate below 60fps on mobile.
- **Latency:** Real-time emoji sync should ideally happen within < 150ms.

## Acceptance Criteria

- [ ] Users can click emoji reaction buttons to see them burst from their own card immediately.
- [ ] Other players in the room see the emojis burst from the sender's card in real-time.
- [ ] Rapid clicking produces visual feedback instantly but batches Convex mutations.
- [ ] Emojis disappear from the UI after 5 seconds.
- [ ] When `prefers-reduced-motion` is enabled, emojis only fade in and out without bursting.
- [ ] The `cleanup.staleRooms` cron job runs successfully and permanently deletes 24-hour inactive rooms and all their child documents.

## Out of Scope

- Custom emoji uploads.
- Reaction counts/leaderboards (ephemeral only).
- Saving reactions to the session history.
