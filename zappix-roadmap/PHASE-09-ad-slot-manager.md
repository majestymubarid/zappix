# Phase 9 — Ad Slot Manager
**Weeks 16–17 | "v1.3"**

> At the end of this phase: Users can create ad slots, accept online bookings with Paystack payment, approve creatives, and auto-deliver ads. Performance reports auto-sent to clients 24 hours after delivery.

---

## ✅ Acceptance Criteria
- [ ] Ad slot created with type, numbers, price, and availability
- [ ] Public booking page live at zappix.ng/ads/[username]
- [ ] Client can browse slots, pick a date, upload creative, and pay via Paystack
- [ ] Owner receives notification of new booking
- [ ] Owner approves or rejects creative from dashboard
- [ ] Approved booking auto-delivers at scheduled date and time
- [ ] Performance report auto-sent to client email 24 hours after delivery
- [ ] Manual booking entry works (for offline deals)
- [ ] Revenue dashboard shows total earnings, top clients, slot utilisation

---

## Key Implementation Notes

### Public Ad Booking Page
This page (`zappix.ng/ads/[username]`) must be **publicly accessible** (no auth required):

```typescript
// src/app/ads/[username]/page.tsx
export default async function AdBookingPage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findFirst({
    where: { email: { contains: params.username } }, // Match by slug from referral code
    include: {
      adSlots: {
        where: { isActive: true },
        include: { numbers: true },
      },
    },
  })

  // Show available slots, estimated reach per slot, prices
  // Paystack inline payment on booking form
}
```

### Paystack Payment for Ad Bookings
Use Paystack's one-time charge (not subscription):

```typescript
// After client fills booking form and clicks Pay:
const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_PUBLIC_KEY}` },
  body: JSON.stringify({
    email: clientEmail,
    amount: slotPrice, // in kobo
    callback_url: `https://zappix.ng/ads/${username}/confirm`,
    metadata: { bookingId, slotId, ownerId },
  }),
})
// Redirect client to authorization_url
```

### Auto-Deliver Ad
```typescript
// Triggered when booking status changes to 'approved'
async function scheduleAdDelivery(booking: AdBooking) {
  const deliveryTime = new Date(booking.scheduledDate)

  await adDeliveryQueue.add('deliver', { bookingId: booking.id }, {
    delay: deliveryTime.getTime() - Date.now(),
  })
}
```

### Performance Report Email
Send via Resend 24 hours after delivery:

```typescript
await resend.emails.send({
  from: 'reports@zappix.ng',
  to: booking.clientEmail,
  subject: `Ad Performance Report — ${tvOwnerName}`,
  html: generateReportHTML(delivery),
})
```

---

## Pages to Build
- `zappix.ng/ads/[username]` — Public booking page (slot cards, availability calendar, Paystack checkout)
- `/app/ads` — Overview with pending approvals queue
- `/app/ads/slots` — Manage all slots
- `/app/ads/slots/new` — Create slot form
- `/app/ads/bookings` — All bookings table with status filter
- `/app/ads/bookings/[id]` — Booking detail with creative preview and approve/reject buttons
- `/app/ads/revenue` — Revenue charts, top clients, slot utilisation heatmap

---

## ✅ Phase 9 Complete When:
- [ ] Public booking page accessible without login
- [ ] Full booking → payment → approval → delivery → report flow works end-to-end
- [ ] Performance report delivered to client email 24 hours after ad
- [ ] Revenue dashboard shows correct totals

**➡️ Next: [PHASE-10-chatbot-builder.md](./PHASE-10-chatbot-builder.md)**
