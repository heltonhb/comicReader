# Phase 03: admin-panel - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-16
**Phase:** 03-admin-panel
**Areas discussed:** Dashboard Layout

---

## Dashboard Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Sidebar navigation | Sidebar with icons/links on left, content area on right. Classic dashboard feel, good for many sections. | ✓ |
| Top tabs | Tabs at top for switching between sections. Similar to email apps, compact for few sections. | |
| Single page sections | All on one page with scrollable sections. Simplest to build, good for 2-3 sections. | |

**User's choice:** Sidebar navigation
**Notes:** Classic dashboard feel works well for an admin panel with multiple sections (Volumes, Uploads)

---

## OpenCode's Discretion

The following areas were left to OpenCode's discretion (user said "you decide"):
- Volume metadata fields and validation rules
- File organization in Firebase Storage (folder structure pattern)
- Upload progress UI (progress bars, toasts, or combination)
- Volume-file linking approach (automatic vs manual)