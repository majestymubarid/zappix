# Phase 1 — Foundation & Infrastructure
**Weeks 1–2 | "Build the bones"**

> At the end of this phase: A Hetzner server is live, your project is deployed, and a WhatsApp number can connect via QR code and send a test message.

---

## ✅ Acceptance Criteria
- [ ] Hetzner CX32 server running Ubuntu 24.04
- [ ] PostgreSQL, Redis, Nginx, PM2 installed and running
- [ ] zappix.ng pointing to your server with HTTPS working
- [ ] Next.js app deployed and visible at https://zappix.ng
- [ ] GitHub Actions deploys automatically on push to main
- [ ] Prisma schema created with all tables and first migration run
- [ ] Baileys connects a WhatsApp number via QR scan
- [ ] Baileys sends a test text message successfully
- [ ] Baileys posts a test WhatsApp Status successfully

---

## Step 1 — Provision Hetzner Server

### 1.1 Create the Server
1. Go to [hetzner.com](https://hetzner.com) → Cloud → New Project → Name it "Zappix"
2. Click **Add Server** with these settings:
   - **Location**: Falkenstein (FSN1) — best latency to Nigeria
   - **Image**: Ubuntu 24.04 LTS
   - **Type**: CX32 (4 vCPU, 8 GB RAM, 80 GB SSD) — ~€6.80/month
   - **Networking**: Enable public IPv4
   - **SSH Keys**: Add your public SSH key
   - **Backups**: Enable (+20% cost — strongly recommended)
   - **Name**: zappix-prod

3. Click **Create & Buy**. Note the server IP address.

### 1.2 Create a Hetzner Volume (Media Storage)
1. In the same project → **Volumes** → **Create Volume**
   - Size: 50 GB
   - Name: zappix-media
   - Server: attach to zappix-prod
2. Cost: €2.49/month

### 1.3 Configure Hetzner Firewall
1. **Firewalls** → **Create Firewall** → Name: "zappix-firewall"
2. Add these **Inbound Rules**:

| Protocol | Port | Source | Description |
|----------|------|--------|-------------|
| TCP | 22 | Your IP only | SSH |
| TCP | 80 | Any 0.0.0.0/0 | HTTP (redirected to HTTPS) |
| TCP | 443 | Any 0.0.0.0/0 | HTTPS |

> **Never** add rules for port 5432 (PostgreSQL) or 6379 (Redis) — these must only be accessible internally.

3. Apply firewall to zappix-prod server.

---

## Step 2 — Point Your Domain

In your domain registrar (wherever you bought zappix.ng):

1. Create an **A record**:
   - Host: `@`
   - Value: `YOUR_SERVER_IP`
   - TTL: 300

2. Create another **A record**:
   - Host: `www`
   - Value: `YOUR_SERVER_IP`
   - TTL: 300

Wait 5–30 minutes for DNS propagation before continuing.

---

## Step 3 — Initial Server Setup

SSH into your server:
```bash
ssh root@YOUR_SERVER_IP
```

Run the full setup script:

```bash
# ── Update system ──────────────────────────────────────────────────────────
apt update && apt upgrade -y

# ── Install Node.js 20 ────────────────────────────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version   # Should show v20.x.x

# ── Install PM2 ───────────────────────────────────────────────────────────
npm install -g pm2

# ── Install PostgreSQL 15 ─────────────────────────────────────────────────
apt install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql
psql --version   # Should show PostgreSQL 15.x

# ── Install Redis ─────────────────────────────────────────────────────────
apt install -y redis-server
systemctl enable redis-server
cat >> /etc/redis/redis.conf << 'EOF'
maxmemory 2gb
maxmemory-policy allkeys-lru
bind 127.0.0.1
EOF
systemctl restart redis-server
redis-cli ping   # Should return PONG

# ── Install Nginx ─────────────────────────────────────────────────────────
apt install -y nginx
systemctl enable nginx

# ── Install Certbot (free SSL) ────────────────────────────────────────────
apt install -y certbot python3-certbot-nginx

# ── Install Git ───────────────────────────────────────────────────────────
apt install -y git

# ── Install build tools ───────────────────────────────────────────────────
apt install -y build-essential

# ── Create app user (never run app as root) ───────────────────────────────
adduser --disabled-password --gecos "" zappix
usermod -aG sudo zappix

# ── Mount Hetzner Volume ──────────────────────────────────────────────────
mkfs.ext4 /dev/disk/by-id/scsi-0HC_Volume_$(ls /dev/disk/by-id/ | grep HC_Volume | head -1 | cut -d_ -f4)
mkdir -p /mnt/zappix-media
mount /dev/disk/by-id/scsi-0HC_Volume_* /mnt/zappix-media
# Add to fstab for auto-mount on reboot
echo "/dev/disk/by-id/scsi-0HC_Volume_* /mnt/zappix-media ext4 defaults 0 0" >> /etc/fstab

# Create subdirectories
mkdir -p /mnt/zappix-media/{media,sessions,exports,backups}
chown -R zappix:zappix /mnt/zappix-media
```

---

## Step 4 — Set Up PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

-- Run these SQL commands:
CREATE DATABASE zappix;
CREATE USER zappix_user WITH ENCRYPTED PASSWORD 'CHANGE_THIS_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE zappix TO zappix_user;
ALTER DATABASE zappix OWNER TO zappix_user;
\q

# Allow local password auth
echo "host zappix zappix_user 127.0.0.1/32 md5" >> /etc/postgresql/15/main/pg_hba.conf
systemctl restart postgresql

# Test connection
psql -U zappix_user -h 127.0.0.1 -d zappix -c "SELECT 1;"
```

---

## Step 5 — Scaffold the Next.js Project

On your **local machine**:

```bash
# Create Next.js app
npx create-next-app@latest zappix \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd zappix

# Install all dependencies
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
npm install @tanstack/react-query
npm install @prisma/client prisma
npm install next-auth@beta
npm install @auth/prisma-adapter
npm install bullmq ioredis
npm install @whiskeysockets/baileys
npm install zod
npm install react-hook-form @hookform/resolvers
npm install paystack
npm install resend
npm install recharts
npm install @dnd-kit/core @dnd-kit/sortable
npm install date-fns
npm install sharp  # image processing

# Install shadcn/ui
npx shadcn@latest init
# Choose: Default style, Slate base color, CSS variables: yes

# Install common shadcn components
npx shadcn@latest add button card input label select textarea
npx shadcn@latest add table badge dialog sheet tabs
npx shadcn@latest add dropdown-menu avatar progress toast
npx shadcn@latest add calendar popover separator skeleton

# Dev dependencies
npm install -D @types/node tsx
```

### 5.1 Project Structure

Create this folder structure:

```
zappix/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   └── page.tsx              # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── app/                      # Dashboard (protected)
│   │   │   └── dashboard/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── trpc/[trpc]/route.ts
│   │   │   └── webhooks/
│   │   │       └── paystack/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── server/
│   │   ├── trpc/
│   │   │   ├── routers/
│   │   │   │   └── index.ts
│   │   │   ├── context.ts
│   │   │   └── root.ts
│   │   ├── baileys/
│   │   │   ├── manager.ts
│   │   │   ├── sender.ts
│   │   │   └── session-store.ts
│   │   ├── queues/
│   │   │   └── index.ts
│   │   └── services/
│   │       ├── paystack.ts
│   │       └── email.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── components/
│       ├── ui/                       # shadcn components (auto-generated)
│       └── layout/
│           ├── navbar.tsx
│           └── sidebar.tsx
├── prisma/
│   └── schema.prisma
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Step 6 — Prisma Schema

Create `prisma/schema.prisma` with the full Zappix schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── Auth ──────────────────────────────────────────────────────────────────────
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]

  // Zappix fields
  accountType   String?   // whatsapp_tv | business | agency
  planId        String?
  plan          Plan?     @relation(fields: [planId], references: [id])
  isFounder     Boolean   @default(false)
  onboarded     Boolean   @default(false)
  riskAccepted  Boolean   @default(false)
  riskAcceptedAt DateTime?

  whatsappNumbers   WhatsappNumber[]
  contactLists      ContactList[]
  contacts          Contact[]
  broadcasts        Broadcast[]
  scheduledStatuses ScheduledStatus[]
  adSlots           AdSlot[]
  bots              Bot[]
  menuBots          MenuBot[]
  teamMemberships   TeamMember[]      @relation("MemberOf")
  teamOwnerships    TeamMember[]      @relation("OwnerOf")
  referralCode      ReferralCode?
  referralsMade     Referral[]        @relation("ReferrerUser")
  referredBy        Referral?         @relation("ReferredUser")
  commissions       Commission[]
  withdrawals       Withdrawal[]
  activityLogs      ActivityLog[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ── Plans ─────────────────────────────────────────────────────────────────────
model Plan {
  id                   String  @id @default(cuid())
  name                 String  // creator | growth | agency
  monthlyPrice         Int     // in kobo
  yearlyPrice          Int
  founderMonthlyPrice  Int
  founderYearlyPrice   Int
  maxNumbers           Int?    // null = unlimited
  maxContacts          Int?
  maxBroadcastsMonth   Int?
  maxStatusMonth       Int?
  maxTeamMembers       Int?
  maxAdSlots           Int?
  storageGb            Int?
  hasAdvancedBot       Boolean @default(false)
  hasApiAccess         Boolean @default(false)
  hasFullAnalytics     Boolean @default(false)
  hasCsvExport         Boolean @default(false)
  hasPdfExport         Boolean @default(false)
  paystackPlanCode     String?
  paystackYearlyCode   String?
  users                User[]
}

// ── WhatsApp Numbers ──────────────────────────────────────────────────────────
model WhatsappNumber {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  phoneNumber      String
  displayName      String
  colourTag        String   @default("green")
  category         String   @default("whatsapp_tv") // whatsapp_tv | business | support
  connectionStatus String   @default("disconnected") // connected|reconnecting|disconnected|paused|suspended
  sessionPath      String?
  lastConnectedAt  DateTime?
  warmupDay        Int      @default(0)
  warmupComplete   Boolean  @default(false)
  isActive         Boolean  @default(true)
  notes            String?

  scheduledStatuses ScheduledStatus[]
  broadcasts        BroadcastNumber[]
  adSlots           AdSlotNumber[]
  bots              Bot[]
  activityLogs      ActivityLog[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, phoneNumber])
}

// ── Contacts ──────────────────────────────────────────────────────────────────
model Contact {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  phoneNumber  String
  firstName    String?
  lastName     String?
  email        String?
  city         String?
  state        String?
  source       String   @default("manual") // manual | csv_import | bot_capture
  isOptedOut   Boolean  @default(false)
  optedOutAt   DateTime?
  notes        String?
  customValues ContactCustomValue[]
  lists        ContactListMember[]
  tags         ContactTag[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([userId, phoneNumber])
}

model ContactList {
  id        String              @id @default(cuid())
  userId    String
  user      User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  isDefault Boolean             @default(false)
  members   ContactListMember[]
  createdAt DateTime            @default(now())
}

model ContactListMember {
  contactId String
  listId    String
  contact   Contact     @relation(fields: [contactId], references: [id], onDelete: Cascade)
  list      ContactList @relation(fields: [listId], references: [id], onDelete: Cascade)
  addedAt   DateTime    @default(now())
  @@id([contactId, listId])
}

model Tag {
  id       String       @id @default(cuid())
  userId   String
  name     String
  colour   String       @default("green")
  contacts ContactTag[]
  @@unique([userId, name])
}

model ContactTag {
  contactId  String
  tagId      String
  contact    Contact  @relation(fields: [contactId], references: [id], onDelete: Cascade)
  tag        Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now())
  @@id([contactId, tagId])
}

model CustomField {
  id         String               @id @default(cuid())
  userId     String
  name       String
  fieldType  String               // text | number | dropdown | date | boolean
  options    String?              // JSON for dropdown values
  sortOrder  Int                  @default(0)
  values     ContactCustomValue[]
}

model ContactCustomValue {
  id            String      @id @default(cuid())
  contactId     String
  customFieldId String
  value         String?
  contact       Contact     @relation(fields: [contactId], references: [id], onDelete: Cascade)
  customField   CustomField @relation(fields: [customFieldId], references: [id], onDelete: Cascade)
  @@unique([contactId, customFieldId])
}

// ── Scheduled Statuses ────────────────────────────────────────────────────────
model ScheduledStatus {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  mediaUrl         String?
  mediaType        String   // image | video | gif | text
  caption          String?
  label            String?
  scheduledAt      DateTime
  postedAt         DateTime?
  status           String   @default("pending") // pending|processing|posted|failed|cancelled
  targetAll        Boolean  @default(true)
  errorMessage     String?
  bulkBatchId      String?
  targetNumbers    StatusTargetNumber[]

  createdAt DateTime @default(now())
}

model StatusTargetNumber {
  statusId  String
  numberId  String
  status    ScheduledStatus @relation(fields: [statusId], references: [id], onDelete: Cascade)
  @@id([statusId, numberId])
}

// ── Broadcasts ────────────────────────────────────────────────────────────────
model Broadcast {
  id            String            @id @default(cuid())
  userId        String
  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  messageType   String            // text | image | video | document | contact
  content       String            // JSON
  status        String            @default("draft") // draft|scheduled|sending|sent|failed|cancelled
  scheduledAt   DateTime?
  startedAt     DateTime?
  completedAt   DateTime?
  throttleSpeed String            @default("safe") // safe | normal | fast
  autoSplit     Boolean           @default(true)
  numbers       BroadcastNumber[]
  audiences     BroadcastAudience[]
  deliveries    BroadcastDelivery[]
  replies       BroadcastReply[]

  createdAt DateTime @default(now())
}

model BroadcastNumber {
  id          String    @id @default(cuid())
  broadcastId String
  numberId    String
  broadcast   Broadcast @relation(fields: [broadcastId], references: [id], onDelete: Cascade)
  number      WhatsappNumber @relation(fields: [numberId], references: [id])
  assigned    Int       @default(0)
  sent        Int       @default(0)
  delivered   Int       @default(0)
  failed      Int       @default(0)
}

model BroadcastAudience {
  broadcastId    String
  contactListId  String
  broadcast      Broadcast   @relation(fields: [broadcastId], references: [id], onDelete: Cascade)
  @@id([broadcastId, contactListId])
}

model BroadcastDelivery {
  id          String    @id @default(cuid())
  broadcastId String
  contactId   String
  numberId    String
  status      String    @default("queued") // queued | sent | delivered | failed
  sentAt      DateTime?
  deliveredAt DateTime?
  errorMessage String?
  broadcast   Broadcast @relation(fields: [broadcastId], references: [id], onDelete: Cascade)
}

model BroadcastReply {
  id          String    @id @default(cuid())
  broadcastId String
  contactPhone String
  message     String
  repliedAt   DateTime  @default(now())
  broadcast   Broadcast @relation(fields: [broadcastId], references: [id], onDelete: Cascade)
}

model OptOut {
  id                   String    @id @default(cuid())
  userId               String
  contactPhone         String
  optedOutViaBroadcast String?
  optedOutAt           DateTime  @default(now())
  isResubscribed       Boolean   @default(false)
  resubscribedAt       DateTime?
  @@unique([userId, contactPhone])
}

// ── Ad Slots ──────────────────────────────────────────────────────────────────
model AdSlot {
  id                   String         @id @default(cuid())
  userId               String
  user                 User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  name                 String
  slotType             String         // status | broadcast | combo
  estimatedReach       Int            @default(0)
  price                Int            // in kobo
  bookingMode          String         @default("both") // online | manual | both
  maxBookingsPerDay    Int            @default(3)
  creativeRequirements String?
  isActive             Boolean        @default(true)
  numbers              AdSlotNumber[]
  bookings             AdBooking[]

  createdAt DateTime @default(now())
}

model AdSlotNumber {
  slotId   String
  numberId String
  slot     AdSlot         @relation(fields: [slotId], references: [id], onDelete: Cascade)
  number   WhatsappNumber @relation(fields: [numberId], references: [id])
  @@id([slotId, numberId])
}

model AdBooking {
  id              String      @id @default(cuid())
  slotId          String
  ownerId         String
  slot            AdSlot      @relation(fields: [slotId], references: [id])
  clientName      String
  clientEmail     String?
  clientPhone     String?
  creativeUrl     String?
  caption         String?
  broadcastText   String?
  scheduledDate   DateTime
  status          String      @default("pending_approval") // pending_approval|approved|rejected|delivered|cancelled
  bookingMode     String      // online | manual
  amount          Int         // in kobo
  paystackRef     String?
  approvedAt      DateTime?
  deliveredAt     DateTime?
  rejectionReason String?
  delivery        AdDelivery?

  createdAt DateTime @default(now())
}

model AdDelivery {
  id               String    @id @default(cuid())
  bookingId        String    @unique
  booking          AdBooking @relation(fields: [bookingId], references: [id])
  statusViews      Int       @default(0)
  broadcastSent    Int       @default(0)
  broadcastFailed  Int       @default(0)
  broadcastReplies Int       @default(0)
  estimatedReach   Int       @default(0)
  deliveredAt      DateTime?
  reportSentAt     DateTime?
}

// ── Bots ──────────────────────────────────────────────────────────────────────
model Bot {
  id                  String      @id @default(cuid())
  userId              String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  numberId            String
  number              WhatsappNumber @relation(fields: [numberId], references: [id])
  isEnabled           Boolean     @default(false)
  activeHoursStart    String?     // "08:00"
  activeHoursEnd      String?     // "22:00"
  greetingTrigger     String      @default("any")
  language            String      @default("en")
  humanTakeoverMins   Int         @default(30)
  reEngageMins        Int         @default(10)
  awayMessage         AwayMessage?
  menus               BotMenu[]
  faqEntries          FaqEntry[]
  flows               BotFlow[]
  sessions            BotSession[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AwayMessage {
  id               String  @id @default(cuid())
  botId            String  @unique
  bot              Bot     @relation(fields: [botId], references: [id], onDelete: Cascade)
  message          String
  scheduleType     String  @default("always") // always | custom_hours | weekends
  oneReplyPerHours Int     @default(24)
  isActive         Boolean @default(true)
}

model BotMenu {
  id             String     @id @default(cuid())
  botId          String
  bot            Bot        @relation(fields: [botId], references: [id], onDelete: Cascade)
  welcomeMessage String
  footerText     String?
  items          MenuItem[]
}

model MenuItem {
  id            String   @id @default(cuid())
  menuId        String
  menu          BotMenu  @relation(fields: [menuId], references: [id], onDelete: Cascade)
  number        Int
  label         String
  actionType    String   // faq | payment | lead_capture | order | submenu | escalate
  actionPayload String?  // JSON
  sortOrder     Int      @default(0)
}

model FaqEntry {
  id              String  @id @default(cuid())
  botId           String
  bot             Bot     @relation(fields: [botId], references: [id], onDelete: Cascade)
  triggerPhrases  String  // JSON array
  responseText    String
  isActive        Boolean @default(true)
}

model BotFlow {
  id           String         @id @default(cuid())
  botId        String
  bot          Bot            @relation(fields: [botId], references: [id], onDelete: Cascade)
  flowType     String         // lead_capture | order
  config       String         // JSON
  notifyOwner  Boolean        @default(true)
  isActive     Boolean        @default(true)
  submissions  BotSubmission[]
}

model BotSession {
  id            String    @id @default(cuid())
  botId         String
  bot           Bot       @relation(fields: [botId], references: [id])
  contactPhone  String
  currentFlowId String?
  currentStep   Int       @default(0)
  collectedData String?   // JSON
  status        String    @default("active") // active|completed|paused|escalated
  startedAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model BotSubmission {
  id           String   @id @default(cuid())
  flowId       String
  flow         BotFlow  @relation(fields: [flowId], references: [id])
  contactPhone String
  data         String   // JSON
  submissionType String // lead | order
  createdAt    DateTime @default(now())
}

// ── Menu Bot ──────────────────────────────────────────────────────────────────
model MenuBot {
  id               String     @id @default(cuid())
  userId           String
  user             User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  numberId         String
  triggerKeyword   String     @default("any")
  welcomeMessage   String
  footerText       String?
  sessionTimeoutMins Int      @default(10)
  language         String     @default("en")
  isActive         Boolean    @default(false)
  items            MenuBotItem[]

  createdAt DateTime @default(now())
}

model MenuBotItem {
  id           String   @id @default(cuid())
  menuBotId    String
  menuBot      MenuBot  @relation(fields: [menuBotId], references: [id], onDelete: Cascade)
  parentId     String?
  itemType     String   // product | service | download | submenu | action
  number       Int
  keyword      String?
  title        String
  description  String?
  price        String?
  imageUrl     String?
  fileUrl      String?
  ctaType      String?
  ctaPayload   String?  // JSON
  sortOrder    Int      @default(0)
  isActive     Boolean  @default(true)
}

// ── Referral System ───────────────────────────────────────────────────────────
model ReferralCode {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  code         String   @unique
  linkSlug     String   @unique
  isCustomised Boolean  @default(false)
  firstUsedAt  DateTime?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
}

model Referral {
  id             String    @id @default(cuid())
  referrerId     String
  referredUserId String    @unique
  referrer       User      @relation("ReferrerUser", fields: [referrerId], references: [id])
  referredUser   User      @relation("ReferredUser", fields: [referredUserId], references: [id])
  planId         String?
  status         String    @default("trial") // active | churned | trial | paused
  convertedAt    DateTime?
  churnedAt      DateTime?
  commissions    Commission[]
  createdAt      DateTime  @default(now())
}

model Commission {
  id                 String   @id @default(cuid())
  referralId         String
  referrerId         String
  referral           Referral @relation(fields: [referralId], references: [id])
  referrer           User     @relation(fields: [referrerId], references: [id])
  amount             Int      // in kobo
  status             String   @default("pending") // pending | available | withdrawn | reversed | paused
  billingCycleMonth  String   // "2026-03"
  paymentReference   String?
  releasedAt         DateTime?
  createdAt          DateTime @default(now())
}

model BankAccount {
  id                   String      @id @default(cuid())
  userId               String      @unique
  bankName             String
  accountNumber        String
  accountName          String
  paystackRecipientCode String?
  isVerified           Boolean     @default(false)
  createdAt            DateTime    @default(now())
  withdrawals          Withdrawal[]
}

model Withdrawal {
  id                String      @id @default(cuid())
  userId            String
  user              User        @relation(fields: [userId], references: [id])
  bankAccountId     String
  bankAccount       BankAccount @relation(fields: [bankAccountId], references: [id])
  amount            Int         // in kobo
  paystackTransferId String?
  status            String      @default("processing") // processing | completed | failed
  requestedAt       DateTime    @default(now())
  completedAt       DateTime?
}

// ── Team ──────────────────────────────────────────────────────────────────────
model TeamMember {
  id           String   @id @default(cuid())
  ownerId      String
  memberId     String
  owner        User     @relation("OwnerOf", fields: [ownerId], references: [id], onDelete: Cascade)
  member       User     @relation("MemberOf", fields: [memberId], references: [id], onDelete: Cascade)
  role         String   // admin | editor | viewer
  inviteEmail  String
  inviteStatus String   @default("pending") // pending | accepted | revoked
  invitedAt    DateTime @default(now())
  acceptedAt   DateTime?
  @@unique([ownerId, memberId])
}

// ── Analytics ─────────────────────────────────────────────────────────────────
model AnalyticsDaily {
  id                    String   @id @default(cuid())
  userId                String
  date                  DateTime @db.Date
  statusEstimatedReach  Int      @default(0)
  statusPostsPublished  Int      @default(0)
  broadcastsSent        Int      @default(0)
  messagesSent          Int      @default(0)
  messagesDelivered     Int      @default(0)
  broadcastReplies      Int      @default(0)
  optOuts               Int      @default(0)
  newContacts           Int      @default(0)
  totalContacts         Int      @default(0)
  adRevenue             Int      @default(0)
  adBookingsCount       Int      @default(0)
  botConversations      Int      @default(0)
  @@unique([userId, date])
}

// ── Activity Log ──────────────────────────────────────────────────────────────
model ActivityLog {
  id         String          @id @default(cuid())
  userId     String
  actorId    String
  user       User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  numberId   String?
  number     WhatsappNumber? @relation(fields: [numberId], references: [id])
  action     String
  targetType String?
  targetId   String?
  details    String?         // JSON
  ipAddress  String?
  createdAt  DateTime        @default(now())
}
```

---

## Step 7 — Environment Variables

Create `.env` on the server:

```bash
# Database
DATABASE_URL="postgresql://zappix_user:YOUR_PASSWORD@127.0.0.1:5432/zappix"

# Auth
NEXTAUTH_URL="https://zappix.ng"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
GOOGLE_CLIENT_ID="from Google Cloud Console"
GOOGLE_CLIENT_SECRET="from Google Cloud Console"

# Redis
REDIS_URL="redis://127.0.0.1:6379"

# Paystack
PAYSTACK_SECRET_KEY="sk_live_your_key_here"
PAYSTACK_PUBLIC_KEY="pk_live_your_key_here"
PAYSTACK_WEBHOOK_SECRET="from Paystack dashboard"

# Email
RESEND_API_KEY="re_your_key_here"

# Storage
MEDIA_PATH="/mnt/zappix-media/media"
SESSIONS_PATH="/mnt/zappix-media/sessions"
EXPORTS_PATH="/mnt/zappix-media/exports"

# App
NEXT_PUBLIC_APP_URL="https://zappix.ng"
NODE_ENV="production"
```

---

## Step 8 — Build the Baileys Connection Manager

Create `src/server/baileys/manager.ts`:

```typescript
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  WASocket,
  AnyMessageContent,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import path from 'path'
import fs from 'fs'

const SESSIONS_PATH = process.env.SESSIONS_PATH || '/mnt/zappix-media/sessions'

class WhatsAppManager {
  private connections = new Map<string, WASocket>()
  private qrCallbacks = new Map<string, (qr: string) => void>()
  private statusCallbacks = new Map<string, (status: string) => void>()

  async connect(numberId: string): Promise<WASocket> {
    if (this.connections.has(numberId)) {
      return this.connections.get(numberId)!
    }

    const sessionDir = path.join(SESSIONS_PATH, numberId)
    fs.mkdirSync(sessionDir, { recursive: true })

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, console as any),
      },
      printQRInTerminal: false,
      generateHighQualityLinkPreview: true,
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        const cb = this.qrCallbacks.get(numberId)
        if (cb) cb(qr)
      }

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

        this.connections.delete(numberId)
        const statusCb = this.statusCallbacks.get(numberId)
        if (statusCb) statusCb(shouldReconnect ? 'reconnecting' : 'disconnected')

        if (shouldReconnect) {
          setTimeout(() => this.connect(numberId), 5000)
        }
      }

      if (connection === 'open') {
        const statusCb = this.statusCallbacks.get(numberId)
        if (statusCb) statusCb('connected')
      }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (!msg.key.fromMe && msg.message) {
          // Route to bot handler — implemented in Phase 10
          console.log('Incoming message on', numberId, 'from', msg.key.remoteJid)
        }
      }
    })

    this.connections.set(numberId, sock)
    return sock
  }

  onQR(numberId: string, callback: (qr: string) => void) {
    this.qrCallbacks.set(numberId, callback)
  }

  onStatus(numberId: string, callback: (status: string) => void) {
    this.statusCallbacks.set(numberId, callback)
  }

  async sendMessage(numberId: string, jid: string, content: AnyMessageContent) {
    const sock = await this.connect(numberId)
    return sock.sendMessage(jid, content)
  }

  async postStatus(numberId: string, content: AnyMessageContent, viewers: string[]) {
    const sock = await this.connect(numberId)
    return sock.sendMessage('status@broadcast', content, {
      statusJidList: viewers,
    })
  }

  async disconnect(numberId: string) {
    const sock = this.connections.get(numberId)
    if (sock) {
      await sock.logout()
      this.connections.delete(numberId)
    }
  }

  isConnected(numberId: string): boolean {
    return this.connections.has(numberId)
  }
}

// Singleton — one manager for the whole app
export const waManager = new WhatsAppManager()
```

---

## Step 9 — Configure Nginx

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/zappix << 'EOF'
server {
    listen 80;
    server_name zappix.ng www.zappix.ng;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name zappix.ng www.zappix.ng;

    # SSL — filled in by Certbot
    ssl_certificate /etc/letsencrypt/live/zappix.ng/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zappix.ng/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Critical for Baileys WebSocket connections
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}
EOF

ln -s /etc/nginx/sites-available/zappix /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# Get SSL certificate (DNS must be pointing to server first)
certbot --nginx -d zappix.ng -d www.zappix.ng --non-interactive --agree-tos -m your@email.com

# Auto-renewal cron
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

---

## Step 10 — GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Zappix to Hetzner

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Hetzner
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.HETZNER_IP }}
          username: zappix
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ~/zappix
            git pull origin main
            npm ci
            npx prisma migrate deploy
            npm run build
            pm2 restart zappix || pm2 start npm --name "zappix" -- start
            pm2 save
```

Add these **GitHub Secrets** in your repo settings:
- `HETZNER_IP` — your server IP
- `SSH_PRIVATE_KEY` — your private SSH key content

---

## Step 11 — Daily Database Backup

```bash
# Create backup script
cat > /home/zappix/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/mnt/zappix-media/backups"
pg_dump -U zappix_user -h 127.0.0.1 zappix > "$BACKUP_DIR/db_$DATE.sql"
find "$BACKUP_DIR" -name "db_*.sql" -mtime +7 -delete
echo "Backup completed: db_$DATE.sql"
EOF

chmod +x /home/zappix/backup-db.sh

# Add to crontab — 2AM daily
(crontab -l 2>/dev/null; echo "0 2 * * * /home/zappix/backup-db.sh >> /home/zappix/backup.log 2>&1") | crontab -
```

---

## Step 12 — Run First Migration and Test Baileys

```bash
# On server — switch to app user
su - zappix
cd ~/zappix

# Copy .env to server (do this via secure method, not git)
# Run migrations
npx prisma migrate deploy
npx prisma generate

# Build and start
npm run build
pm2 start npm --name "zappix" -- start
pm2 save
pm2 startup

# Test Baileys connection (create a quick test script)
node -e "
const { waManager } = require('./dist/server/baileys/manager');
waManager.onQR('test-number', (qr) => {
  console.log('QR CODE:', qr);
  console.log('Scan this QR code with WhatsApp');
});
waManager.connect('test-number');
"
```

---

## ✅ Phase 1 Complete When:
- [ ] https://zappix.ng loads the Next.js app with valid SSL
- [ ] GitHub push to main triggers automatic deploy
- [ ] PostgreSQL accepting connections from app
- [ ] Redis responding to ping
- [ ] Baileys connects a test WhatsApp number via QR scan
- [ ] Baileys successfully sends a text message
- [ ] Baileys successfully posts a test status
- [ ] Daily backup cron running

**➡️ Next: [PHASE-02-auth-billing.md](./PHASE-02-auth-billing.md)**
