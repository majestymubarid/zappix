# Phase 7 — Contact Manager
**Weeks 12–13 | "v1.1"**

> At the end of this phase: Users have a full CRM for their contacts — lists, tags, custom fields, smart segments, CSV import, duplicate detection.

---

## ✅ Acceptance Criteria
- [ ] Contact table loads with search, filter by list/tag
- [ ] Manual contact add form works
- [ ] CSV import with column mapper imports correctly
- [ ] Duplicate detection flags matching phone numbers
- [ ] Merge duplicates combines lists, tags, and custom field data
- [ ] Tags can be created, applied, and filtered
- [ ] Smart segment with 3 conditions returns correct contacts
- [ ] Bulk actions work: add to list, apply tag, export, delete
- [ ] Contact profile shows full message history

---

## Key Implementation Notes

### CSV Import Flow
```typescript
// Use papaparse on the frontend for parsing
import Papa from 'papaparse'

const parsed = Papa.parse(file, { header: true, skipEmptyLines: true })
// Show column mapper: let user assign CSV columns to contact fields
// Validate phone numbers: strip spaces, convert to +234 format
// Check for duplicates before insert: prisma.contact.findMany where phoneNumber in [...]
// Use createMany with skipDuplicates: true for performance
```

### Phone Number Normalisation
```typescript
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('234')) return '+' + digits
  if (digits.startsWith('0')) return '+234' + digits.slice(1)
  if (digits.length === 10) return '+234' + digits
  return '+' + digits
}
```

### Smart Segment Rules Engine
```typescript
// Store rules as JSON: { conditions: [{ field, operator, value }], logic: 'and' | 'or' }
// Build Prisma where clause dynamically from rules
function buildSegmentQuery(rules: SegmentRule[], userId: string) {
  const conditions = rules.map(rule => {
    switch (rule.field) {
      case 'tag': return { tags: { some: { tag: { name: rule.value } } } }
      case 'city': return { city: rule.operator === 'is' ? rule.value : { not: rule.value } }
      case 'optOut': return { isOptedOut: rule.value === 'true' }
      case 'source': return { source: rule.value }
      default: return {}
    }
  })
  return { userId, [rules[0]?.logic === 'or' ? 'OR' : 'AND']: conditions }
}
```

---

## Pages to Build
- `/app/contacts` — Table with sidebar filters, bulk action toolbar
- `/app/contacts/[id]` — Profile with history timeline
- `/app/contacts/import` — CSV upload → column mapper → preview → import progress
- `/app/contacts/lists` — Lists with contact counts and last used date
- `/app/contacts/segments` — Segment builder with live preview count
- `/app/contacts/duplicates` — Side-by-side merge interface

---

## ✅ Phase 7 Complete When:
- [ ] 1,000 contacts imported from CSV in under 30 seconds
- [ ] Smart segment updates automatically when new contacts are added
- [ ] Duplicate detected and successfully merged (inherits all lists and tags)
- [ ] Contacts marked opt-out are excluded from broadcasts

**➡️ Next: [PHASE-08-multi-account.md](./PHASE-08-multi-account.md)**
