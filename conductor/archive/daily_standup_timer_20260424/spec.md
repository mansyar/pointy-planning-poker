# Specification: Daily Standup Timer

## Overview

The Daily Standup Timer is a real-time module for the Tempo suite designed to facilitate timeboxed daily syncs. It provides a structured speaker queue, a shared countdown timer, and a parking lot for capturing off-topic items.

## Functional Requirements

- **Room Management:** Facilitators can create standup rooms with unique slugs. Legacy `/room/:slug` links will redirect to `/poker/:slug` for backward compatibility.
- **Speaker Queue:**
  - Automatically populates from online players.
  - Supports Alphabetical, Randomized, and Join Order sorting.
  - Facilitator can skip, pause, or reorder speakers.
- **Timer System:**
  - Hybrid client-server countdown timer.
  - Configurable per-person time limit (default 90s).
  - Optional auto-advance with a configurable grace period (0-15s).
- **Parking Lot:** Any participant can add text items to a shared list for post-standup discussion.
- **Session Summary:**
  - Displays total duration, participant stats, and per-person elapsed times.
  - "Copy Summary" feature exports the session details in Markdown format.

## Non-Functional Requirements

- **Latency:** Real-time sync < 150ms.
- **Responsiveness:** Optimized for both Desktop (dashboard view) and Mobile (controller view).
- **Accessibility:** WCAG 2.1 AA compliance, including `aria-live` announcements for timer events.

## Acceptance Criteria

- [ ] Users can create a standup room from the landing hub.
- [ ] The speaker queue correctly reflects online status and chosen sorting.
- [ ] The countdown timer syncs accurately across all participants.
- [ ] Facilitators can successfully transition between speakers.
- [ ] Parking lot items are visible to all and included in the final summary.
- [ ] The summary can be copied in Markdown format.

## Out of Scope

- Historical storage of standup summaries (ephemeral only).
- Direct integration with Jira/Linear for task updates.
