# Project memory

## Product intent & audience

- App featuring "woos" (events/posts) created by hosts; users browse a feed and view detail screens.
- Social engagement: likes, shares, attendee tracking.

## Brand personality & voice

- Image-forward, social, visually immersive.

## Visual design & UX direction

- Woo cards on the home feed mirror the woo detail screen: full-bleed hero image with host info (avatar, name, @username) overlaid on a dark gradient at the bottom.
- Pill-style action bar (like, share) sits directly below the image.
- Details section below action bar uses a two-column layout: left side has two icon-led rows (orange icons) for date/time (e.g. "Mar 14 · 6:00 PM - 9:00 PM") and location (truncated with ellipsis); right side has attendee avatar stack vertically centered.
- Tapping a card navigates to the woo detail screen.
- Avoid the older card layout (separate like row + info box) — superseded but files still exist in the project.

## Decisions, constraints & rationale

- Framework: Expo (React Native); no `build` script present.
- Home list items rebuilt to match woo detail screen for visual consistency.
- Like button works directly on cards with optimistic updates; rolls back on request failure.
- Details row restructured from a cramped single-line layout to a clean two-column block with icon-led date/time and location rows; address truncates with ellipsis to prevent layout shifting.
- Old card component files retained untouched in case repurposed elsewhere.
- Visual verification requires device/preview — no browser preview for this native project.

## Open questions & assumptions

- Card proportions and new details layout on real devices still need manual confirmation.
- Fate of unused old card components (remove vs. keep) is undecided.