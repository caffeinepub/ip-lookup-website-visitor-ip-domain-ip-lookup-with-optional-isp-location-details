# Specification

## Summary
**Goal:** Provide a single-page IP lookup website that automatically shows the visitor’s public IP and allows looking up an entered domain or IP, with optional extra details on demand.

**Planned changes:**
- Build a single-page UI that auto-fetches and displays the visitor’s public IP on load.
- Add a domain/IP input with submit via button and Enter key to run lookups and show results or errors.
- Add a user-controlled toggle/checkbox to request and reveal extra info (e.g., ISP and approximate location) only when enabled; hide details when disabled.
- Implement all fetching with React Query, including clear loading and error states for both the visitor IP fetch and lookups.
- Apply a coherent, distinctive visual theme consistently across the page using Tailwind and existing UI components (without editing immutable component source files).

**User-visible outcome:** On visiting the page, users immediately see their public IP, can look up a domain or IP to get an IP result, and can optionally enable a control to reveal ISP/location details (when available), with clear loading and error feedback.
