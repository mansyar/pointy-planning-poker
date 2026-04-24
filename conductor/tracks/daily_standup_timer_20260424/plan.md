# Implementation Plan: Daily Standup Timer

## Phase 1: Foundation & Backend (Convex)

- [x] Task: Create standup schema definitions for `standup_entries` and `parking_lot` a1ef244
  - [x] Write schema tests in `convex/standup-schema.test.ts`
  - [x] Update `convex/schema.ts`
- [x] Task: Implement `standup.start` mutation 432710f
  - [x] Write failing tests for starting a standup (queue population)
  - [x] Implement `standup.start` in `convex/standup.ts`
- [x] Task: Implement `parkingLot.add` and `parkingLot.listByRoom` b022f36
  - [x] Write failing tests for parking lot operations
  - [x] Implement parking lot logic in `convex/parkingLot.ts`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Backend' (Protocol in workflow.md)

## Phase 2: Core Components & Logic (Timer & Queue)

- [ ] Task: Build hybrid timer logic
  - [ ] Write unit tests for timer calculation (startedAt + elapsedMs)
  - [ ] Implement timer calculation hook/utils
- [ ] Task: Implement `standup.next` and `standup.previous` mutations
  - [ ] Write tests for queue transitions and elapsed time recording
  - [ ] Implement transition logic in `convex/standup.ts`
- [ ] Task: Create `StandupTimer` component
  - [ ] Write tests for visual states (Green/Yellow/Red/Overtime)
  - [ ] Implement component with Framer Motion circular progress
- [ ] Task: Create `SpeakerQueue` component
  - [ ] Write tests for queue rendering and facilitator controls
  - [ ] Implement component with reordering support
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core Components & Logic' (Protocol in workflow.md)

## Phase 3: Room Setup & Integration

- [ ] Task: Update landing hub for Standup tool
  - [ ] Write tests for tool selection and room creation
  - [ ] Implement Standup option in `src/components/shared/LandingPage.tsx`
- [ ] Task: Create Standup Room Page structure
  - [ ] Write tests for room routing and setup state
  - [ ] Implement `src/routes/standup.$slug.tsx`
- [ ] Task: Implement Room Configuration (Timer/Order/Auto-advance)
  - [ ] Write tests for updating room config
  - [ ] Implement settings UI and mutations
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Room Setup & Integration' (Protocol in workflow.md)

## Phase 4: Parking Lot & Summary

- [ ] Task: Build Parking Lot UI
  - [ ] Write tests for adding/removing items in UI
  - [ ] Implement Parking Lot panel
- [ ] Task: Implement Session Summary view
  - [ ] Write tests for summary data calculation and "Copy Markdown"
  - [ ] Implement `SummaryView` component
- [ ] Task: Final Polish & Accessibility
  - [ ] Verify `aria-live` announcements for timer
  - [ ] Ensure mobile responsiveness for all new views
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Parking Lot & Summary' (Protocol in workflow.md)
