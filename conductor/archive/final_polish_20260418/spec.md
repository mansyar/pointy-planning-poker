# Specification: Final Polish, Accessibility & Deployment

## Overview

This track focuses on the final layer of product polish, accessibility, and deployment readiness required to transition the application from a functional prototype to a production-grade web app. It implements Progressive Web App (PWA) capabilities, unifies "Juice" sensory feedback, ensures full WCAG 2.1 AA compliance with screen reader announcements, and finalizes the deployment architecture with a multi-stage Dockerfile.

## Functional Requirements

1. **PWA & Offline Resilience:**
   - Configure a Service Worker to enable offline caching and app installation (standalone mode).
   - Dynamically sync the `<meta name="theme-color">` tag with the user's Dark/Light mode preference.
   - Implement a graceful **Subtle banner** overlay to indicate "Reconnecting..." during offline states while preserving the last known game state.

2. **Sensory "Juice" & Haptics:**
   - Update the existing settings toggle to control _both_ sound effects and haptic vibrations globally.
   - Implement `navigator.vibrate` triggers for the following actions:
     - **Card Selection:** Short, subtle vibration.
     - **The Reveal:** Distinct vibration when the facilitator reveals the votes.
     - **Unanimous Consensus:** Longer celebratory vibration when everyone agrees.

3. **Accessibility (A11y) Announcements:**
   - Add `aria-live` regions using a **Polite** assertiveness level (waiting for the screen reader to finish current sentences).
   - Announce critical game state changes: "Votes Revealed", "New Topic Active", and "Consensus Reached".
   - Ensure focus management moves logically (e.g., after the reveal or when closing a modal).

4. **Deployment Architecture:**
   - Create a multi-stage `Dockerfile` optimized for Coolify self-hosting.
   - Use strictly `node:22-alpine` as both the build and runtime image.
   - Ensure the image correctly utilizes `pnpm` and exposes the build output.

## Non-Functional Requirements

- **Performance:** Service worker initialization should not block the main thread.
- **Fallbacks:** `navigator.vibrate` should degrade gracefully on unsupported devices (e.g., desktop browsers or iOS devices that don't support the web API fully).

## Acceptance Criteria

- [ ] Users can install Pointy as a PWA, and it functions with a subtle offline banner when disconnected.
- [ ] Haptic vibrations occur simultaneously with audio on card selection, vote reveals, and unanimous results.
- [ ] Screen readers politely announce when a new topic is active, votes are revealed, or consensus is reached.
- [ ] The `Dockerfile` successfully builds the application locally using `node:22-alpine` and `pnpm`.

## Out of Scope

- Complex offline queueing or conflict resolution of actions.
- Deploying directly to a remote Coolify instance in this track (focus is on containerization).
