# ClearSign — Figma AI Prompt (Web + Tablet + Mobile)

**How to use this doc:** This whole file is written as one continuous prompt for Figma AI. Paste it in as-is if Figma AI accepts long prompts. If it truncates long input, feed it in this order instead: **Section 1 → Section 2 → Section 3**, then each screen in **Section 4** one at a time, adding "using the same ClearSign design system as before" to each follow-up prompt so the style stays consistent. Section 5–6 are reference for you while you review/wire the file. **Section 7 is new — paste it into Figma AI as a follow-up prompt on your existing file to fix the issues from your last screenshots** ("update the ClearSign file using the same design system, with these fixes:" + paste Section 7). Section 8 is a note for you, not for Figma.

**v2 — 19 Aug 2026:** Section 2's palette moved from teal/green to blue per your feedback, and Section 7 was added to fix the dull-landing-page, nav responsiveness, notch/status-bar, and duplicate-button issues from your screenshots.

---

## 1. Product Context

Design **ClearSign**, a medical-document translator app. Users photograph or upload a prescription, lab report, or doctor's note, and the app uses AI to turn it into a plain-language summary a non-medical person can actually understand — what the results mean, what's normal, what needs attention, and a "read aloud" option for accessibility. Primary users include patients, caregivers, and elderly users who find clinical language confusing or hard to read. The product's entire value is **clarity**: taking something dense and clinical and making it calm, legible, and human. Every design decision should serve that — generous legibility, low visual noise, and confident (not clinical-cold, not falsely cheerful) reassurance.

---

## 2. Design System — "Clarity" visual language

**Revised per your feedback (v2): shifted from teal/green to a blue clinical palette.** Avoid the generic flat-gradient SaaS blue — use one deep, confident blue as the only brand color and let whitespace and contrast do the rest, not gradients.

**Color tokens (light mode)**
- `ink` `#0E1B2B` — primary text, a deep navy-charcoal (cool, not warm-black)
- `paper` `#F3F6FC` — app background, a pale blue-white (this is what fixes the "creamy/greenish" look — it should read unmistakably cool/blue even at a glance)
- `surface` `#FFFFFF` — cards, inputs, sheets
- `sky-tint` `#E7EFFC` — light blue fill for badges, chips, selected states, AI message-bubble backgrounds
- `clinical-blue` `#1958C1` — primary brand color: primary buttons, active nav state, links, the highlighter-swipe signature. This is the one color that should feel "medical" at a glance — closer to an insurance-card/scrub blue than a tech-startup blue
- `clarity-amber` `#E2574C` — unchanged. Reserved **only** for "Critical"/"Watch" status and destructive actions (delete, logout) — this is a semantic signal color, not a theme color, so it stays regardless of the brand palette
- `steady-green` `#2E9A5E` — unchanged. Reserved **only** for "Normal" status dots/labels and success states — same logic, this is a status signal, not decoration
- `periwinkle` `#4C63D2` — AI-assistant accent (chat bubbles, "Ask AI" button, robot nav icon), sitting one step more violet than `clinical-blue` so AI-generated content stays visually distinct from the app's own chrome

> Note: the green/amber/red you see on status dots ("Normal" / "Watch" / "Critical") are meaningful medical signal colors, not the app's theme colors — those stay exactly as they are. What's changing is the *chrome*: background, primary buttons, active states, and the logo accent, which all move from teal/green to `clinical-blue`.

**Color tokens (dark mode — triggered by the Dark Mode toggle in Settings)**
- `ink` → `#EAF1FB`, `paper` → `#0B141F`, `surface` → `#12202F`, brand/accent colors stay but desaturate ~10% and lighten ~8% for contrast on dark.

**Typography — 3 roles, not 1 face doing everything**
- **Headings:** Sora (Semibold/Bold) — a warm, slightly rounded geometric sans. This is the "human" voice of the product, used for screen titles like "History," "Overview," "Log in."
- **Body/UI:** IBM Plex Sans (Regular/Medium) — an unusually legible, interface-tested face. Used for every label, button, paragraph, input.
- **Data/utility:** IBM Plex Mono (Regular) — used only for lab values, units, dates, and numbers (e.g., "142 mg/dL", "03 Aug 2026"). This gives medical numbers a printed-report precision without touching the rest of the UI.
- Base body size 16px minimum (never smaller, this app exists for readability). Support a user-adjustable text scale (100% / 125% / 150%) — surface this as a setting.

**Shape & elevation**
- 12px corner radius on cards and inputs, 24px on sheets/modals, fully round on avatars, FABs, and pill buttons.
- Flat design with one soft shadow level only (`0px 4px 16px rgba(19,42,40,0.08)`) — no heavy skeuomorphism, no glassmorphism.

**Signature element**
- A soft **highlighter-swipe** underline (a short, hand-drawn-feel marker stroke in `clinical-blue` at 25% opacity) sits behind key section titles — "Overview," "Critical hits," "History." It's the one recurring visual flourish, and it directly represents the product's job: highlighting what matters in a report. Use it sparingly — section titles only, never on body text or buttons.

**Iconography**
- Rounded-stroke icon set (1.5px stroke), medically-literate but friendly: camera, upload/cloud, speaker/read-aloud, chat bubble with a small "+" (AI), gear, house, pencil (edit), trash (delete), toggle switches with sun/moon glyphs for dark mode.

---

## 3. Platforms & Responsive Rules

Design **three explicit breakpoints**, not one layout scaled up:

- **Mobile — 375–428px:** everything exactly as the wireframes show — bottom tab bar (Home / AI / Settings), single-column screens, full-screen modals for Profile and Take/Upload Image.
- **Tablet — 768–1024px:** keep the bottom tab bar in portrait; in landscape, convert it to a slim left rail nav (icons only, labels on hover/focus). History becomes a 2-column card grid. Report Results screen splits into two panes: document image pinned on the left (sticky on scroll), Overview/Critical hits/Read-aloud/Ask-AI on the right.
- **Desktop/Laptop — 1280px+:** persistent left sidebar (ClearSign logo top, History/Ask AI/Settings nav items, Profile pinned at the bottom of the sidebar) replaces the bottom tab bar entirely. Main content is a master-detail layout: History list ~360px wide on the left, selected report detail filling the rest. Login/Sign up become centered cards (max-width 440px) on the `paper` background rather than full-bleed forms. Take/Upload Image becomes a large drag-and-drop dropzone with "Upload Image" as primary and "Take Photo" (via webcam) as secondary.

State explicitly in the prompt: **"design distinct layouts for each breakpoint, don't just scale the mobile frame up."**

---

## 4. Screens

### 4.1 — Login
Centered layout. "Log in" as the page title (Heading/Sora). Email field ("Enter Email address"), password field ("Enter password") with a show/hide-password eye icon. "Forgot password?" link right-aligned under the password field. Primary button "Login" (full-width on mobile, fixed-width on desktop). Below it, "Don't have an account? **Sign up**" as a text link. States needed: empty, filled, error (red inline message under a field, e.g. "Enter a valid email"), loading (spinner in the button).

### 4.2 — Sign Up
Same centered card pattern. Title "Sign up." Fields: Name, Email address, Enter Password, Confirm Password (both password fields get show/hide toggles; Confirm Password shows a red inline error if it doesn't match Enter Password). Primary button "Sign up." Divider "— or —". Secondary button "Continue with Google" (Google "G" icon, white background, gray border). Below the form add a text link "Already have an account? **Log in**" (this connects back to 4.1).

### 4.3 — Home / History Dashboard
Top bar sits **below a dedicated status-bar safe zone** (see Section 7.3) — do not place any content in the same band as a device notch/Dynamic Island/punch-hole camera. Top bar itself: small icon mark + "ClearSign" wordmark on the left (the icon mark is a simple clipboard-with-checkmark or shield-cross glyph in `clinical-blue`, so the logo reads as a mark, not just type), circular profile picture with a thin 2px `clinical-blue` ring around it (tap → 4.8 Profile) on the right. Below it, "History" as a section title with the highlighter-swipe signature under it, plus a small muted report-count label to its right (e.g., "4 reports") so the header does real work instead of sitting flat. History is a vertical list (mobile/tablet-portrait) or grid (tablet-landscape/desktop) of report cards on `surface` white against the `paper` blue-tinted background — that background/card contrast is what gives the page depth instead of the flat look. Each card: a 3px colored status stripe down its left edge (green/amber/red, matching that report's status) so the list is scannable by color even without reading, a small document-type icon in a soft `sky-tint` circle, a one-line title (e.g., "Blood Test — Aug 12"), a 2-line plain-language preview snippet, and the severity label with its dot (green/amber/red — these stay as medical status colors, not theme colors). Long-press or a trailing trash icon reveals **Delete** with a confirm dialog ("Delete this report? This can't be undone" / Cancel / Delete in `clarity-amber`). Empty state (no history yet): friendly illustration + "Scan your first document to get started" + prominent button to 4.4. Floating camera action button, bottom-right, in `clinical-blue`, opens 4.4. Bottom tab bar: Home (active, `clinical-blue`), AI robot (center, raised/elevated circular icon in `periwinkle`), Settings gear — see Section 7.2 for how this bar needs to be built so every icon is independently tappable and it holds up across screen widths.

### 4.4 — Take / Upload Document
Back arrow top-left. Two primary actions stacked: "Take Image" (opens device camera) and "Upload Image" (opens file/gallery picker), separated by an "— or —" divider. Below, a large preview panel: empty state shows a dashed-border dropzone with an upload icon and "Your document preview will appear here"; filled state shows the captured/selected image with a small "Retake" / "Choose another" text action in the corner. A small AI/robot icon bottom-right of the preview area acts as the **"Analyze"** trigger once an image is present (disabled/greyed out until an image is loaded) — tapping it shows a brief processing state (progress ring + "Reading your document…") before navigating to 4.5.

### 4.5 — Report Results (Overview + Critical Hits)
Back arrow top-left. Document image thumbnail at the top (tap to expand full-screen). **Overview** card: section title with the highlighter-swipe, a "Read aloud" button top-right of the card (speaker icon; tapping it becomes a pause icon + a subtle animated waveform while playing), and 3–5 lines of plain-language summary text. **Critical hits** card directly below: same pattern, but its title/icon uses `clarity-amber`, and each flagged item shows the lab value in IBM Plex Mono next to its plain-language meaning (e.g., "**142 mg/dL** — higher than the typical range, worth asking your doctor about"). If there are no critical findings, replace this card with a calm `steady-green` state: "Nothing here needs urgent attention." **Exactly one** "Ask AI" trigger on this screen: a floating pill button, bottom-right, `periwinkle` fill, comfortably sized (56px tall, generous horizontal padding, robot icon + "Ask AI" label — bigger and more prominent than a small icon-only chip). It floats over the content with the screen's normal bottom padding, not docked full-width to the edge. Do **not** add a second, full-width "Ask AI about this report" bar pinned to the bottom of the screen — one clear entry point to the chat is enough; a second button competing for the same action reads as a mistake, not emphasis.

### 4.6 — Document Q&A Chat (scoped to one report)
Back arrow top-left, no bottom tab bar (this is a focused sub-flow). Small reference thumbnail of the document pinned at the top. Below it, 3 tappable **suggested-question chips** (each prefixed with a "?" icon) generated from that specific report, e.g. "What does this value mean?" — tapping one instantly sends it as a message. Below the chips, an open **chat thread area** (empty state: "Ask me anything about this report" in muted text) that fills with alternating message bubbles — user messages right-aligned in `surface`, AI messages left-aligned in pale `periwinkle` tint. Fixed input bar at the bottom: placeholder "Ask anything related to documentation," circular send button (up-arrow, `periwinkle` fill, disabled/grey when the field is empty).

### 4.7 — AI Assistant (general, full app-level chat)
Reached from the bottom tab bar's center robot icon, independent of any single report. Same chat-bubble system as 4.6, but this screen **keeps the bottom tab bar** (Home / AI-active / Settings) since it's a top-level destination, not a sub-flow. Include a small "currently speaking" indicator (animated sound-wave glyph, top-right) when read-aloud is active on a response. Input bar fixed at the bottom, same style as 4.6.

### 4.8 — Profile (edit overlay)
Presented as a sheet/modal over a dimmed Home screen. Header row: "Name" as an editable title with a pencil "Edit profile" icon top-right (tapping it switches all fields below from read-only to editable, and the button label changes to "Save"). Large circular profile photo in the center with a small camera badge bottom-right of the avatar (tap → opens 4.4's Take/Upload pattern, scoped to profile photo, with a circular crop step before saving). Four editable fields below (Name, Email, Phone, and one optional field such as Date of Birth). "Logout" as a text button with a logout icon, using `clarity-amber` since it's a meaningful/irreversible action; tapping it opens a confirm dialog before returning to 4.1 Login.

### 4.9 — Settings
Back arrow top-left. Vertical list, each row = icon + label, with the control on the right:
- **Enable Notification** — toggle switch (on = `steady-green` fill)
- **Dark mode** — toggle switch with sun/moon glyphs inside the thumb, switching the whole app's tokens per Section 2 when flipped
- **Rate App**, **Share App**, **Privacy Policy**, **Terms and Conditions**, **Cookie Policy**, **Contact**, **LinkedIn** — each a plain navigational row with a chevron, opening either an external link/share sheet or a simple static content page using the same design system (title + Sora heading + IBM Plex Sans body text + back arrow)

---

## 5. Global Interaction & Prototyping Map

Wire every one of these as a real click/tap connection in Figma's Prototype tab (Figma AI may draft the frames but often won't auto-wire every link — see Section 8):

| Element | Action |
|---|---|
| Login → "Login" button | Navigate to 4.3 Home |
| Login → "Sign up" link | Navigate to 4.2 |
| Sign up → "Sign up" button / "Continue with Google" | Navigate to 4.3 Home |
| Sign up → "Log in" link | Navigate to 4.1 |
| Home → history card | Navigate to 4.5, pre-loaded with that report |
| Home → history card trash icon | Open delete-confirm dialog → removes card from list |
| Home → camera FAB | Navigate to 4.4 |
| Home → profile avatar | Open 4.8 as overlay |
| Bottom nav → Home / AI / Settings | Navigate to 4.3 / 4.7 / 4.9, with the icon showing an active/selected state |
| 4.4 → Take Image / Upload Image | Populate the preview panel (swap empty→filled state) |
| 4.4 → Analyze (robot icon) | Show processing state, then navigate to 4.5 |
| 4.5 → Read aloud | Toggle icon (speaker↔pause) + show waveform state |
| 4.5 → Ask AI | Navigate to 4.6 |
| 4.6 / 4.7 → suggested chip | Auto-fill and "send" that message into the thread |
| 4.6 / 4.7 → send button | Add message bubble to thread, disabled state when input is empty |
| 4.8 → pencil "Edit profile" | Toggle all fields between read-only and editable variants |
| 4.8 → camera badge | Navigate to 4.4's pattern scoped to profile photo |
| 4.8 → Logout | Open confirm dialog → Navigate to 4.1 |
| 4.9 → each toggle | Switch on/off variant with color + thumb-position change |
| 4.9 → nav rows | Navigate to respective static page or external link |

---

## 6. Accessibility Requirements (core to the product, not an afterthought)

- Minimum 16px body text, with a working 100/125/150% text-scale setting
- Color is never the only signal — severity dots/labels always pair a color with a word ("Normal," "Watch," "Critical")
- Read-aloud (text-to-speech) available on every summary/result screen, not just once
- Contrast ratio ≥ 4.5:1 for all text in both light and dark mode
- Visible focus states on every interactive element (for keyboard and switch-access users)
- Touch targets minimum 44×44px on mobile

---

## 7. Round 2 — Build Fixes

These fix the four issues from your screenshots. Paste this whole section into Figma AI as a follow-up prompt on the existing file ("update ClearSign using the same design system, with these fixes:" + this section), then check each one manually since Figma AI's edits don't always apply everywhere at once.

**7.1 — Landing page looks dull**
Apply the updated 4.3 spec above: blue-tinted `paper` background behind white cards (not both near-white, which is what was flattening the contrast), a 3px colored status stripe on the left edge of each history card, a small icon mark next to the "ClearSign" wordmark, a thin `clinical-blue` ring on the profile avatar instead of a flat fill, and a report-count label next to the "History" title. These are small, cheap changes that give the page depth without adding clutter.

**7.2 — Bottom nav isn't responsive / only the robot icon does anything**
The elevated circular AI icon sitting above the bar is correct by design — that part isn't a bug. The actual problem is almost certainly that Home, AI, and Settings aren't three separate tappable layers. Rebuild the nav bar as: one Auto Layout frame, pinned to the bottom of the screen with **left+right stretch** and **bottom-fixed** constraints (so it holds its position at any screen width instead of drifting), containing **three separate components** — Home icon+label, the elevated AI circle, Settings icon+label — each its own frame/instance with its own hit area. In the Prototype tab, give each of those three its own "On Tap → Navigate to" connection (4.3 / 4.7 / 4.9). If they're currently baked into one flattened graphic, that's why only one spot on the bar responds.

**7.3 — Top notch/Dynamic Island covers the logo and avatar**
Don't design content inside a specific phone bezel mockup — that's what's making it iPhone-17-Pro-Max-specific and breaks on a Samsung punch-hole or an older flat-top phone. Instead: reserve a plain, empty **status-bar safe zone** at the very top of every screen frame (~54–59px on mobile, no logo/avatar/text allowed inside it), and start real content (the ClearSign top bar) below that. The phone bezel/notch graphic, if you want one for presentation, should sit **outside** or **on top of** this empty zone as a separate decorative layer used only for exporting screenshots — never something the real UI content has to share space with. Built this way, the same frame is safe on any device silhouette without redesigning per phone.

**7.4 — Two "Ask AI" buttons on the Report Results screen**
Per the updated 4.5 spec above: delete the full-width "Ask AI about this report" bar docked to the bottom of the screen entirely. Keep only the smaller floating pill button, and resize it up (~56px tall, icon + "Ask AI" label, generous padding) so it reads as a confident, single, deliberate action rather than a small afterthought — floating over the content bottom-right, not stretched edge-to-edge.

---

## 8. A note for you (not part of the Figma prompt)

Figma AI is very good at generating the visual frames and component states described above from a prompt like this. Where it typically falls short is **fully automatic click-wiring** — actions like "delete removes the card," "toggle changes app-wide dark mode," or "chat actually holds a conversation" are real app logic, not something a static design tool executes on its own. Figma AI can draft the *states* (toggle-on/toggle-off, filled/empty, error/success as separate variants), but you'll likely still need to go into the Prototype tab yourself and connect those variants together using the map in Section 5 — that's normal Figma prototyping work, not a gap in the prompt. If you want a genuinely functional (not just click-through) version later, that's a separate step of building it in code, which is a good next milestone once the design is locked.