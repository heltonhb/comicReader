# Phase 03: admin-panel - Context

**Gathered:** 2026-04-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Create an internal admin panel where creating new volumes becomes a drag-and-drop process without code changes. The admin panel enables non-technical content management through:
1. Route protection requiring admin custom claims
2. Cataloging form for volume metadata entry
3. Mass file upload via dropzone to Firebase Storage

</domain>

<decisions>
## Implementation Decisions

### D-01: Dashboard Layout
- **Sidebar navigation** — Sidebar with icons/links on left, content area on right. Classic dashboard feel, good for many sections.

### OpenCode's Discretion
- Volume metadata fields: Use standard fields (title, author, description, pageCount, coverUrl, pdfUrl) — OpenCode decides exact validation rules
- File organization in Storage: OpenCode decides folder structure pattern
- Upload feedback: OpenCode decides progress UI (progress bars, toasts, or combination)
- Volume-file linking: OpenCode decides automatic linking vs manual URL paste

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Firebase Integration
- `src/firebase.js` — Firebase initialization (auth, firestore, storage)
- `src/store/authStore.js` — Existing auth patterns to follow

### Existing UI Patterns (Phase 2)
- `src/components/VolumeSelector.jsx` — UI patterns for listing items
- Tailwind gold accent color: `#D4AF37`

### Phase Context
- No external specs — requirements fully captured in decisions above

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- `src/store/authStore.js` — Zustand store pattern to follow for adminStore
- `src/components/BookLoader.jsx` — Loading spinner pattern (gold accent)
- Tailwind CSS configured with custom gold accent

### Established Patterns
- Zustand for state management
- Lazy loading for routes (see router.jsx)
- Firebase for all backend operations

### Integration Points
- New routes go in `src/router.jsx`
- Admin components go in `src/components/`
- Admin store goes in `src/store/`

</codebase_context>

<specifics>
## Specific Ideas

- Dashboard should have sidebar navigation with icons/links on left
- Sidebar should have at least two sections: Volumes (cataloging) and Uploads (dropzone)
- Use Tailwind gold accent (#D4AF37) for active states and highlights
- Match dark theme styling from Phase 2 reader components

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-admin-panel*
*Context gathered: 2026-04-16*