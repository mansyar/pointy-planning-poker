# Product Guidelines: Pointy Planning Poker

## 1. Design & UX Principles
* **Vibe:** "Modern Corporate" with Linear/Vercel-inspired aesthetics.
* **Core Look:** Deep shadows, subtle glassmorphism (`backdrop-blur`), and a clean, utility-first layout.
* **Sensory Feedback:** Provide "gaming-grade" juice—3D card flips, haptic pulses, and sound effects—that can all be disabled via a single unified toggle.
* **Celebration:** Reward team consensus with subtle confetti, and use emoji rain for live, ephemeral reactions.
* **Responsiveness:**
  * Desktop (≥1024px): "Table View" with a central poker table, surrounding avatars, and sidebar topic queue.
  * Mobile (<1024px): "Card Deck Controller" view with a full-screen card fan at the bottom, swipe-to-vote, and a compact layout.

## 2. Branding & Theming
* **Color Palette:**
  * Dark Mode (Default): `#0A0A0B` (primary bg), `#141416` (secondary), with `#818CF8` accents and glowing focus states.
  * Light Mode: `#FAFAFA` (primary bg), `#FFFFFF` (secondary), `#6366F1` accents.
* **Typography:**
  * **Inter** for UI elements, headings, and body.
  * **JetBrains Mono** for prominent numbers (e.g., Poker card values).
* **Theme Support:** System-preference auto-detection by default, with a manual toggle synced to the PWA `theme_color` meta tag.

## 3. Prose & Communication Style
* **Voice:** Professional, concise, and unobtrusive. "Zero-friction" means getting out of the user's way.
* **Terminology:** Use standard Agile terms (Facilitator, Topic, Estimate, Consensus).
* **Feedback:** Keep UI text minimal—rely on visual indicators (e.g., color-coded consensus badges: Unanimous/Near/Split) over verbose explanations.

## 4. Accessibility (A11y)
* **Standard:** Target WCAG 2.1 AA compliance.
* **Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text.
* **Keyboard:** Full navigability with visible focus indicators using `--border-focus`.
* **Motion:** Respect `prefers-reduced-motion`—fallback complex 3D flips and particle effects to simple fade transitions.
* **Screen Readers:** Ensure state changes (reveals, topic changes) are announced via `aria-live` regions.