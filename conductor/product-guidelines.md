# Product Guidelines: Tempo

## 1. Design & UX Principles

- **Vibe:** "Neo-Brutalist" — raw, high-contrast, and uncompromising.
- **Core Look:** Heavy 4px black borders, hard 6px offset shadows (`brutal-shadow`), and zero glassmorphism. Layouts should utilize full horizontal real-estate (Dashboards).
- **Sensory Feedback:** Provide "high-juice" tactile feedback—Shadow Shifts (4px translation on active), snappy 0.1s transitions, haptic pulses, and sound effects—controlled via a unified "Juice" toggle.
- **Celebration:** Reward team consensus with subtle confetti, and use emoji rain for live, ephemeral reactions.
- **Responsiveness:**
  - Desktop (≥1024px): Multi-column dashboard layouts with dedicated tool areas and sidebars.
  - Mobile (<1024px): Specialized controller views and compact collapsible layouts.

## 2. Branding & Theming

- **Identity:** Tempo — Scrum Tools for Modern Teams. Logo mark: ◈ (Rotated 45deg).
- **Color Palette:**
  - Backgrounds: Primary white (`#ffffff`), Secondary black (`#000000`).
  - Accents: Retro Yellow (`#f7df1e`), Retro Pink (`#FF00E5`), Retro Blue (`#93c5fd`), Retro Green (`#4ade80`).
- **Typography:** **Space Grotesk** for UI/Headings; **JetBrains Mono** for numbers and code.

## 3. Prose & Communication Style

- **Voice:** Professional, concise, and ceremony-focused. "Zero-friction" means instant value without configuration overhead.
- **Terminology:** Use standard Agile terms. Refer to the suite as "Tempo" and individual tools by their names (e.g., "Planning Poker").
- **Feedback:** Keep UI text minimal—rely on visual indicators and color-coded status badges.

## 4. Accessibility (A11y)

- **Standard:** Target WCAG 2.1 AA compliance.
- **Contrast:** Minimum 4.5:1 for normal text.
- **Keyboard:** Full navigability with visible focus indicators.
- **Motion:** Respect `prefers-reduced-motion`—fallback to simple fade transitions.
