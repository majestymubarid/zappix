**ZAPPIX**

Product Specification Document

**The Operating System for WhatsApp TV Businesses**

**zappix.ng**

*\"Run your WhatsApp TV like a real media company.\"*

Version 3.0 \| March 2026

*Confidential --- Not for Distribution*

**1. Positioning & Strategy**

**1.1 Category Positioning**

Zappix is not a scheduling tool or a broadcast tool. Zappix is the
operating system for WhatsApp TV businesses. This reframes the product
from a feature set into infrastructure --- something WhatsApp TV owners
run their entire business on.

> **INFO:** Feature positioning is weak because competitors can copy
> features. Category positioning is durable because you own the
> category.

**1.2 Headline Positioning Statement**

***\"Run your WhatsApp TV like a real media company.\"***

**1.3 Core Value Proposition**

Without Zappix, running a WhatsApp TV means manual posting, manual ad
bookings, manual payments, and manual reports. With Zappix, everything
is automated --- posting, bookings, reporting, and revenue collection.
That is a business upgrade, not a tool purchase.

  -----------------------------------------------------------------------
  **Without Zappix**                  **With Zappix**
  ----------------------------------- -----------------------------------
  Manual status posting every day     30 days of content scheduled in 10
                                      minutes

  WhatsApp chat to book ad slots      Brands book and pay online at
                                      zappix.ng/ads/yourTV

  Manually sending broadcasts one by  Blast 100k contacts across 10
  one                                 numbers in one click

  No data on what\'s working          Full analytics dashboard with
                                      period comparison

  Chasing payments from ad clients    Paystack collects payment
                                      automatically at booking
  -----------------------------------------------------------------------

**1.4 The Three Pillars**

Zappix has 9 features. Customers should only see 3 pillars. Customers
buy the pillar --- the features are the proof.

  -----------------------------------------------------------------------
  **Pillar**         **Goal**               **Features Inside**
  ------------------ ---------------------- -----------------------------
  Audience Growth    Grow reach and         Status Scheduler, Broadcast
                     engagement             Engine

  Monetisation       Earn more money from   Ad Slot Manager, Booking
                     audience               Pages, Analytics

  Automation         Reduce all manual work Chatbot Builder, Contact
                                            Manager, Menu Bot
  -----------------------------------------------------------------------

**1.5 Killer Feature --- Ad Slot Manager**

The Ad Slot Manager is Zappix\'s most powerful differentiator. It should
be positioned as the Shopify for WhatsApp ads. Every WhatsApp TV owner
gets a public booking page at:

**zappix.ng/ads/lagosgossipTV**

Brands can visit this page, browse available slots, pay via Paystack,
and schedule their ad --- without the TV owner doing anything manually.
This creates platform lock-in. Once a TV owner\'s clients are booking
through Zappix, they cannot easily leave.

**2. Ideal Customer Profile**

**2.1 Primary ICP --- Launch Focus**

> **NOTE:** Early SaaS must dominate one niche first. Zappix\'s primary
> ICP for launch is WhatsApp TV owners with an audience of 10,000 to
> 500,000 contacts.

Why this profile specifically:

-   They already sell ads --- they feel the pain of manual ad management
    every day

-   They already broadcast --- they know what bulk messaging is

-   They already manage contacts --- they understand audience size
    matters

-   They already make money --- they have budget and willingness to pay
    for tools

-   They are active on social media --- reachable via Instagram,
    Twitter/X, TikTok

  -----------------------------------------------------------------------
  **Attribute**      **Detail**
  ------------------ ----------------------------------------------------
  Profile            WhatsApp TV owner, individual or small team

  Audience size      10,000 --- 500,000 WhatsApp contacts

  Revenue            Earns from ad placements, affiliate links, premium
                     groups

  Pain               Manual posting, chasing ad clients, no data, missed
                     revenue

  Location           Nigeria (Lagos, Abuja, Port Harcourt primary)

  Age                18-35

  Platform           Active on Instagram and Twitter/X --- searchable

  Identifier         Posts \'Advertise here\' or \'DM for ad rates\' in
                     bio or status
  -----------------------------------------------------------------------

**2.2 Secondary ICP --- After Product-Market Fit**

Expand to these segments only after reaching 500 paying customers in the
primary ICP:

  ------------------------------------------------------------------------
  **Segment**           **Why They Need Zappix**         **Target From**
  --------------------- -------------------------------- -----------------
  Digital marketing     Manage multiple client WhatsApp  Month 6+
  agencies              accounts                         

  E-commerce sellers    Broadcast product drops,         Month 6+
                        automate order queries           

  Info-product creators Sell courses via WhatsApp,       Month 9+
                        automate lead capture            

  Churches              Broadcast services, manage       Month 9+
                        congregation lists               

  Real estate agents    Send listings, capture leads,    Month 12+
                        automate responses               
  ------------------------------------------------------------------------

**3. Pricing Plans**

**3.1 Plan Overview**

Three plans. Simplified from the original four. Clearer value
boundaries, less decision fatigue for customers.

  ------------------------------------------------------------------------
  **Plan**        **Monthly**   **Yearly**    **Best For**
  --------------- ------------- ------------- ----------------------------
  Creator         ₦15,000       ₦150,000      Small WhatsApp TVs, solo
                                              operators

  Growth          ₦35,000       ₦350,000      Serious TVs monetising with
                                              ads (Most Popular)

  Agency          ₦75,000       ₦750,000      Large operators, agencies,
                                              networks
  ------------------------------------------------------------------------

**3.2 Plan Feature Details**

  ------------------------------------------------------------------------
  **Feature**              **Creator**     **Growth**      **Agency**
  ------------------------ --------------- --------------- ---------------
  WhatsApp Numbers         2               10              Unlimited

  Contacts                 10,000          100,000         Unlimited

  Broadcasts/month         20              200             Unlimited

  Status Schedules/month   60              500             Unlimited

  Ad Slot Manager          Basic           Full            Full +
                                                           White-label

  Analytics                Basic           Full            Full + Export

  Chatbot / Auto-Reply     Basic           Advanced        Advanced

  Team Members             1               5               Unlimited

  API Access               No              No              Yes

  Media Storage            5 GB            20 GB           100 GB

  Support                  Email           WhatsApp        Dedicated
                                                           Manager
  ------------------------------------------------------------------------

**3.3 Founding Member Discount**

First 100 subscribers get a lifetime founding discount --- locked
forever regardless of future price increases.

  -----------------------------------------------------------------------
  **Plan**          **Normal Price**  **Founding        **Saving**
                                      Price**           
  ----------------- ----------------- ----------------- -----------------
  Creator           ₦15,000/mo        ₦12,000/mo        ₦3,000/mo ---
                                                        ₦36,000/yr

  Growth            ₦35,000/mo        ₦29,000/mo        ₦6,000/mo ---
                                                        ₦72,000/yr

  Agency            ₦75,000/mo        ₦65,000/mo        ₦10,000/mo ---
                                                        ₦120,000/yr
  -----------------------------------------------------------------------

> **INFO:** Early SaaS should reward early adopters. Founding discounts
> create urgency, loyalty, and powerful word-of-mouth from users who
> feel they got a special deal.

**4. Feature Specifications**

All features are implemented using the Baileys WhatsApp Web library.
Features requiring the official WhatsApp Business API are not included.
All analytics are based on what Baileys can reliably track.

**4.1 Status Scheduler --- Pillar: Audience Growth**

Schedule WhatsApp Status updates (images, videos, GIFs, text) days or
weeks in advance. Zappix auto-posts at the configured time across
selected WhatsApp numbers.

**Scheduling Modes**

-   Single Post --- schedule one status at a specific date and time

-   Bulk Upload --- upload up to 100 files at once, auto-assign to a
    posting time grid

-   Content Calendar --- month/week/day calendar view with content gap
    detection

  --------------------------------------------------------------------------
  **Type**     **Formats**   **Max Size** **Notes**
  ------------ ------------- ------------ ----------------------------------
  Image        JPG, PNG      5 MB         Auto-compressed if over limit

  Video        MP4           64 MB        Max 30 seconds

  GIF          GIF           5 MB         Auto-converted to MP4

  Text         Plain         700 chars    WhatsApp formatting supported
  --------------------------------------------------------------------------

> **WARNING:** Status analytics shows Estimated Reach based on contact
> list size --- not exact view counts. WhatsApp does not expose view
> counts via the Web protocol. This is clearly labelled throughout the
> UI.

**4.2 Broadcast Engine --- Pillar: Audience Growth**

Bulk messaging to thousands of contacts across multiple WhatsApp
numbers. Messages are sent individually to each contact with intelligent
throttling and personalisation.

**Message Types**

-   Text message --- up to 4,096 characters with WhatsApp formatting

-   Image + caption --- JPG, PNG up to 5MB

-   Video + caption --- MP4 up to 64MB

-   Document / PDF --- up to 100MB

-   Contact card --- vCard format

**Personalisation Tokens**

  -----------------------------------------------------------------------
  **Token**        **Value**                 **Fallback**
  ---------------- ------------------------- ----------------------------
  {firstName}      Contact\'s first name     Configurable

  {lastName}       Contact\'s last name      Configurable

  {fullName}       Full name                 Configurable

  {city}           Contact\'s city           Configurable

  {custom1}        Custom field 1            Configurable
  -----------------------------------------------------------------------

**Broadcast Analytics --- What Zappix Tracks**

  -----------------------------------------------------------------------
  **Metric**                          **Reliability**
  ----------------------------------- -----------------------------------
  Send Rate (sent without error)      High --- reliable

  Failed Sends                        High --- reliable

  Reply Rate                          High --- reliable

  Opt-out count                       High --- reliable

  Delivery Rate                       Medium --- best effort only, not
                                      guaranteed at scale
  -----------------------------------------------------------------------

**4.3 Ad Slot Manager --- Pillar: Monetisation**

The killer feature. Positions Zappix as the Shopify for WhatsApp ads.
Every user gets a public booking page at zappix.ng/ads/\[username\]
where brands book, pay, and schedule ads without any manual work from
the TV owner.

**Ad Slot Types**

-   Status Slot --- ad posted as WhatsApp Status (24hr or multi-day)

-   Broadcast Slot --- ad sent as direct message to contact list

-   Combo Slot --- Status + Broadcast bundled together (premium tier)

**Booking Modes**

-   Online Booking --- public page, brand pays via Paystack, owner
    approves creative, Zappix delivers

-   Manual Booking --- owner logs offline deal, Zappix handles delivery
    and reporting

**Ad Performance Reports**

-   Status Slot: Estimated reach based on contact list size

-   Broadcast Slot: Messages sent, failed sends, replies

-   Auto-sent to client 24 hours after delivery via email and WhatsApp

> **INFO:** Performance reports use Estimated Reach for status slots and
> Send Rate for broadcast slots. This is communicated clearly to ad
> clients on the booking page and in every report.

**4.4 Analytics Dashboard --- Pillar: Monetisation**

Overview dashboard with drill-down per feature. All metrics based on
data Baileys can reliably track.

  -------------------------------------------------------------------------
  **Section**   **Metrics**                       **Source**
  ------------- --------------------------------- -------------------------
  Status        Estimated reach, posts published, Contact list size
                best posting time                 

  Broadcasts    Send rate, failed sends, reply    Baileys events
                rate, opt-outs                    

  Audience      Contact growth, new contacts,     Database
                source breakdown                  

  Ad Revenue    Bookings, revenue, top clients,   Paystack + DB
                slot utilisation                  

  Bot           Conversations started, leads      Session records
                captured, orders collected        
  -------------------------------------------------------------------------

**Reporting Options**

-   Period selector: Today, 7 Days, 30 Days, Custom range

-   Period comparison: current vs previous side by side

-   CSV export --- Growth and Agency plans

-   PDF export --- Agency plan

**4.5 Chatbot Builder --- Pillar: Automation**

Turns every connected number into a 24/7 automated assistant. Form-based
builder, no code required.

**Bot Types**

-   Away Message --- auto-reply when unavailable, with hours schedule

-   Menu Bot --- numbered and keyword navigation routing to action flows

-   FAQ Bot --- keyword-triggered answers (up to 100 entries)

-   Payment Link Sender --- auto-send Paystack link on trigger

**Chatbot Flows**

-   Lead Capture --- collects name, email, phone via conversation

-   Order Collection --- collects item, quantity, address, contact

**4.6 Contact Manager --- Pillar: Automation**

Lightweight CRM for organising all WhatsApp contacts across every
connected number.

-   Manual entry, CSV import (up to 50,000 rows), bot auto-capture

-   Contact Lists, Tags, Custom Fields (up to 10), Smart Segments

-   Duplicate detection and merge

-   Bulk actions --- add to list, tag, export, delete

**4.7 Multi-Account Manager**

Manage multiple WhatsApp numbers from one dashboard. QR code connection,
team roles, activity log.

  -----------------------------------------------------------------------
  **Role**      **Permissions**
  ------------- ---------------------------------------------------------
  Admin         Full access except delete account and change subscription

  Editor        Create/edit content, manage contacts and bots, view
                analytics

  Viewer        Read-only --- cannot create or modify anything
  -----------------------------------------------------------------------

**4.8 WhatsApp Menu Bot --- Pillar: Automation**

Transforms any connected number into an interactive self-service
storefront. Customers navigate via numbered replies or keyword
shortcuts.

-   Product Catalogue --- categories, products with prices and
    descriptions

-   Service Menu --- services with pricing, turnaround, and CTA

-   Download Hub --- customers request and instantly receive PDFs, price
    lists, catalogues

-   Multi-level submenus up to 3 levels deep

**4.9 Referral System**

Every user gets a referral link (zappix.ng/ref/username) and code on
signup. 25% recurring commission on every payment their referrals make,
paid monthly via Paystack bank transfer.

  -----------------------------------------------------------------------
  **Plan Referred**       **Monthly Commission**  **Annual Commission**
  ----------------------- ----------------------- -----------------------
  Creator                 ₦3,750/mo               ₦45,000/yr

  Growth                  ₦8,750/mo               ₦105,000/yr

  Agency                  ₦18,750/mo              ₦225,000/yr
  -----------------------------------------------------------------------

**5. Baileys Capabilities & Limitations**

**5.1 Confirmed Capabilities**

  -----------------------------------------------------------------------
  **Capability**                     **Used In**
  ---------------------------------- ------------------------------------
  Send text, images, videos,         Broadcast Engine, Chatbot, Menu Bot
  documents to contacts              

  Post WhatsApp Status (image,       Status Scheduler, Ad Slot Manager
  video, text)                       

  Receive and route incoming         Chatbot, Menu Bot, Opt-out tracking
  messages in real time              

  QR code connection via             Multi-Account Manager
  multi-device protocol              

  Manage multiple simultaneous       Multi-Account Manager
  connections                        

  Persist sessions across server     Multi-Account Manager (local file
  restarts                           storage)

  Read Baileys-level send            Broadcast analytics --- send rate
  confirmation                       

  Detect incoming replies to         Broadcast analytics --- reply rate
  broadcasts                         
  -----------------------------------------------------------------------

**5.2 Limitations & Solutions**

  -----------------------------------------------------------------------
  **Limitation**         **Zappix Solution**
  ---------------------- ------------------------------------------------
  No exact status view   Estimated Reach shown --- based on contact list
  counts                 size. Labelled clearly as estimate.

  Delivery receipts      Send Rate used as primary metric. Delivery rate
  unreliable at scale    shown as best-effort only.

  Native broadcast lists Sends individually to each contact --- identical
  not accessible         result for recipient.

  WhatsApp Business API  Not included. All features use standard message
  features absent        types only.

  Read receipts          Read rate removed from all analytics. Send rate
  suppressed at scale    and reply rate used instead.

  Account ban risk from  Full Ban Risk Management system --- see Section
  high-volume sends      6.
  -----------------------------------------------------------------------

**5.3 Features Removed (Require Official API)**

  -----------------------------------------------------------------------
  **Removed Feature**      **Reason**
  ------------------------ ----------------------------------------------
  Interactive button       Official WhatsApp Business API only
  messages                 

  List message picker UI   Official WhatsApp Business API only

  Message templates with   Official WhatsApp Business API only
  approval                 

  Exact status view counts Web protocol does not expose this data

  True delivery            WhatsApp suppresses receipts at scale on Web
  confirmation rate        protocol

  Read rate analytics      WhatsApp suppresses read receipts at scale
  -----------------------------------------------------------------------

**6. Ban Risk Management System**

WhatsApp monitors accounts connected via third-party tools and can
restrict or ban numbers. Zappix implements a comprehensive system to
minimise this risk. Mitigation messaging for users: smart throttling,
human-like sending patterns, safe broadcast limits.

> **IMPORTANT:** No system guarantees 100% protection. Zappix Terms of
> Service state that account bans are outside Zappix\'s control. Users
> accept a risk disclosure before connecting any number.

**6.1 Risk Level by Behaviour**

  ------------------------------------------------------------------------
  **Behaviour**            **Risk     **Zappix Response**
                           Level**    
  ------------------------ ---------- ------------------------------------
  New SIM, sending 500+    CRITICAL   Hard block --- forced warm-up, no
  messages immediately                broadcasts until Day 14+

  Number \< 7 days old,    VERY HIGH  Broadcasts blocked --- warm-up must
  any broadcast attempted             complete first

  Established number,      HIGH       Auto-split across numbers, Safe
  identical message to                throttle enforced
  5,000+ contacts                     

  Established number,      MEDIUM     Warning shown, daily cap enforced,
  1,000+ messages per day             Safe recommended

  Established number,      LOW        Normal throttle available,
  100-500 messages per day            monitoring active

  Established number,      VERY LOW   All throttle modes available
  under 100 messages per              
  day                                 

  Status scheduling only,  MINIMAL    No restrictions
  no broadcasts                       
  ------------------------------------------------------------------------

**6.2 Number Warm-Up Programme**

Every new number is automatically enrolled in the 21-day Warm-Up
Programme. Limits increase gradually before full broadcasting is
unlocked.

  -------------------------------------------------------------------------
  **Day        **Max            **Features Available**
  Range**      Messages/Day**   
  ------------ ---------------- -------------------------------------------
  Days 1-3     0                Status scheduling only. Bot replies allowed
                                (incoming-triggered only).

  Days 4-7     50               Broadcasts enabled. Safe throttle only.
                                Manual approval per broadcast.

  Days 8-14    200              Broadcasts enabled. Safe throttle only.
                                Auto-send available.

  Days 15-21   500              Normal throttle unlocked. Daily cap
                                enforced.

  Day 22+      Unrestricted     All throttle modes available. Platform
                                monitoring continues.
  -------------------------------------------------------------------------

**6.3 Smart Throttle Engine**

  --------------------------------------------------------------------------
  **Mode**   **Delay**     **Msgs/min**   **Auto-Selected When**
  ---------- ------------- -------------- ----------------------------------
  Safe       2-3 seconds   20-30          Number \< 21 days, or first
                                          broadcast of the day

  Normal     0.75-1 second 60-80          Established number with regular
                                          send history

  Fast       0.4-0.5       120-150        User manually selects --- not
             second                       recommended for new numbers
  --------------------------------------------------------------------------

**Auto-Protection Rules**

-   Number \< 7 days old → Fast and Normal modes locked, Safe forced

-   Number sent \> 500 messages in last 24hrs → Normal is maximum
    allowed

-   WhatsApp returns rate-limit signal → throttle auto-drops to Safe for
    2 hours

-   3 consecutive message failures → broadcast paused, owner alerted
    immediately

-   Identical message to 10,000+ contacts → auto-split across all
    connected numbers

**6.4 Anti-Pattern Detection**

  ------------------------------------------------------------------------
  **Pattern Detected**   **Warning**        **Action**
  ---------------------- ------------------ ------------------------------
  Same message to \>     High risk warning  Auto-suggests number split
  5,000 contacts                            

  Broadcasting \> 3      Frequency warning  Soft block after 4th in 24hrs
  times per day                             

  Same number, same      Duplicate warning  Confirmation required
  message, within 48hrs                     

  Broadcast between      Timing warning     Recommends rescheduling
  1AM-5AM WAT                               

  New number \> 50 msgs  Warm-up block      Hard block enforced
  during warm-up                            

  Bulk import +          New contacts       24hr delay enforced
  immediate large blast  warning            
  ------------------------------------------------------------------------

**6.5 Content Safety Guidelines**

Shown in the broadcast composer to help users avoid WhatsApp spam
detection:

-   Personalise every message --- {firstName} ensures no two messages
    are identical

-   Avoid all-caps, excessive emojis, and spam trigger phrases

-   Always include opt-out option: \'Reply STOP to unsubscribe\'

-   Never send to contacts who did not opt in

-   Keep frequency reasonable --- maximum once per day to the same list

-   Use numbers at least 12 months old for high-volume broadcasts

**6.6 Number Health Monitor**

  --------------------------------------------------------------------------
  **Signal**             **Severity**   **Action**
  ---------------------- -------------- ------------------------------------
  Connection dropped     Medium         Immediate alert --- WhatsApp + email
  unexpectedly                          

  Send failure rate \>   High           Immediate alert --- broadcast paused
  5%                                    

  Unusual incoming block High           Immediate alert --- number flagged
  or report activity                    in dashboard

  WhatsApp ban warning   Critical       All posts paused --- owner must
  detected                              review

  Session expiring       Low            24hr advance warning sent
  within 24 hours                       

  Daily message limit at Low            In-app notification shown
  80%                                   
  --------------------------------------------------------------------------

**6.7 Risk Disclosure at Onboarding**

Before connecting any number, users must read and accept a Risk
Disclosure covering:

-   Zappix uses WhatsApp Web protocol --- not the official WhatsApp
    Business API

-   WhatsApp may restrict or ban numbers used with third-party tools

-   Zappix is not responsible for account bans

-   Users should connect established numbers --- ideally 12+ months old

-   The 21-day warm-up programme must be followed for new numbers

**Acceptance is logged with timestamp. Users cannot connect a number
without completing this step.**

**7. Technical Architecture**

**7.1 Architecture Style**

TypeScript monolith --- single Next.js codebase deployed on a Hetzner
VPS. Self-managed PostgreSQL and Redis. PM2 for process management.
GitHub Actions for CI/CD. Nginx as reverse proxy with free SSL via
Certbot. Domain: zappix.ng.

**7.2 Tech Stack**

  ---------------------------------------------------------------------------
  **Layer**          **Technology**              **Purpose**
  ------------------ --------------------------- ----------------------------
  Frontend           Next.js 14 (App Router) +   Full-stack React with SSR
                     TypeScript                  

  Styling            Tailwind CSS + shadcn/ui    Design system and components

  API Layer          tRPC                        End-to-end type-safe API

  Database ORM       Prisma                      Type-safe queries and
                                                 migrations

  Database           PostgreSQL 15 (self-hosted  Primary data store
                     on Hetzner)                 

  Cache / Queues     Redis + BullMQ              Job queues, rate limiting,
                     (self-hosted)               sessions

  WhatsApp API       Baileys                     WhatsApp Web protocol
                     (@whiskeysockets/baileys)   

  Session Storage    Local filesystem on Hetzner Baileys session persistence
                     Volume                      

  Auth               NextAuth v5 + Google OAuth  Sign in with Google

  Payments           Paystack Node SDK           Subscriptions, transfers,
                                                 webhooks

  Media Storage      Hetzner Volume (mounted     Media uploads, session
                     filesystem)                 files, exports

  Email              Resend                      Transactional emails

  Process Manager    PM2                         Keep Zappix running,
                                                 auto-restart

  Web Server         Nginx (reverse proxy)       Route traffic to Next.js +
                                                 WebSocket

  SSL                Certbot (Let\'s Encrypt)    Free HTTPS for zappix.ng

  CI/CD              GitHub Actions              Auto-deploy on push to main
  ---------------------------------------------------------------------------

**7.3 Hetzner Infrastructure Plan**

Hetzner offers the best VPS value globally. All servers run Ubuntu 24.04
LTS in Falkenstein (FSN1) or Helsinki (HEL1) --- lowest latency to
Nigeria via European internet exchange points.

  ---------------------------------------------------------------------------
  **Phase**     **Server**   **Specs**         **Monthly      **Handles**
                                               Cost**         
  ------------- ------------ ----------------- -------------- ---------------
  Dev (Weeks    CX32         4 vCPU, 8 GB RAM, \~€6.80        Dev + 5-10 test
  1-10)                      80 GB SSD         (\~₦12,500)    numbers

  Launch (Weeks CX42         8 vCPU, 16 GB     \~€16.40       0-200 users,
  11-20)                     RAM, 160 GB SSD   (\~₦30,000)    \~50 WA numbers

  Growth (200+  CX52         16 vCPU, 32 GB    \~€32.40       200-1,000
  users)                     RAM, 320 GB SSD   (\~₦60,000)    users, \~150
                                                              numbers

  Scale (1,000+ 2x CX42 + LB Split app + DB    \~€55          1,000+ users,
  users)                     servers           (\~₦100,000)   500+ numbers
  ---------------------------------------------------------------------------

> **INFO:** All Hetzner plans include 20 TB of monthly traffic. Add a 50
> GB Hetzner Volume at €2.49/month for media storage and Baileys session
> files. Enable Hetzner Backups (+20% of server cost) for automatic
> snapshots.

**7.4 Server Setup Overview**

Initial server stack on a fresh Hetzner Ubuntu 24.04 instance:

-   Node.js 20 --- runtime for Next.js and Baileys

-   PostgreSQL 15 --- self-hosted primary database

-   Redis --- BullMQ job queues, rate limiting, session cache

-   PM2 --- process manager, auto-restarts on crash, starts on reboot

-   Nginx --- reverse proxy routing zappix.ng to Next.js on port 3000

-   Certbot --- free SSL certificate for zappix.ng and www.zappix.ng

-   GitHub Actions --- SSH deploy script pulls latest code, runs
    migrations, rebuilds, restarts PM2

**7.5 Hetzner Firewall Rules**

Configured via Hetzner Cloud Console --- free firewall:

  ----------------------------------------------------------------------------
  **Rule**        **Protocol**   **Port**    **Source**
  --------------- -------------- ----------- ---------------------------------
  SSH             TCP            22          Your IP only --- never open to
                                             public

  HTTP            TCP            80          Any --- redirected to HTTPS by
                                             Nginx

  HTTPS           TCP            443         Any --- main application traffic

  PostgreSQL      TCP            5432        127.0.0.1 only --- never expose
                                             publicly

  Redis           TCP            6379        127.0.0.1 only --- never expose
                                             publicly
  ----------------------------------------------------------------------------

**7.6 RAM Requirements for Baileys**

RAM is the most critical resource because each active Baileys connection
holds \~150-250 MB in memory:

  -----------------------------------------------------------------------
  **Connected        **RAM for          **Recommended Server RAM**
  Numbers**          Baileys**          
  ------------------ ------------------ ---------------------------------
  10 numbers         \~2 GB             8 GB minimum --- CX32

  50 numbers         \~8 GB             16 GB minimum --- CX42

  150 numbers        \~25 GB            32 GB minimum --- CX52

  500 numbers        \~80 GB            Split across multiple servers
  -----------------------------------------------------------------------

**7.7 Deployment Flow**

Every push to the main branch triggers an automatic deploy via GitHub
Actions:

-   GitHub Actions SSH into Hetzner server

-   git pull latest code

-   npm install dependencies

-   npx prisma migrate deploy --- run any new DB migrations

-   npm run build --- rebuild Next.js

-   pm2 restart zappix --- zero-downtime restart

**7.8 Backup Strategy**

-   Hetzner server snapshots --- automatic daily snapshots (enabled at
    provisioning, +20% cost)

-   PostgreSQL dumps --- cron job at 2AM daily, saved to Hetzner Volume,
    7-day retention

-   Hetzner Volume --- media files and Baileys sessions are on a
    separate persistent volume, not lost on server rebuild

**7.9 Cost vs Revenue Comparison**

  -----------------------------------------------------------------------------
  **Subscribers**   **Avg Plan**   **MRR**        **Server Cost**   **Cost %**
  ----------------- -------------- -------------- ----------------- -----------
  10 users          Growth ₦35k    ₦350,000       ₦12,500 (CX32)    3.6%

  50 users          Growth ₦35k    ₦1,750,000     ₦30,000 (CX42)    1.7%

  200 users         Growth ₦35k    ₦7,000,000     ₦30,000 (CX42)    0.4%

  500 users         Growth ₦35k    ₦17,500,000    ₦60,000 (CX52)    0.3%

  1,000 users       Growth ₦35k    ₦35,000,000    ₦100,000 (2x      0.3%
                                                  CX42)             
  -----------------------------------------------------------------------------

> **NOTE:** Hetzner infrastructure cost is under 4% of revenue from the
> very first paying users. This is one of the healthiest unit economics
> possible for a bootstrapped SaaS.

**8. Page Map**

Total: 64 pages across marketing, auth, and dashboard. Domain: zappix.ng

**8.1 Marketing / Public Pages**

  ---------------------------------------------------------------------------------
  **URL**                      **Page**        **Notes**
  ---------------------------- --------------- ------------------------------------
  zappix.ng                    Landing Page    New structure --- see Section 9.2

  zappix.ng/pricing            Pricing         3 plans + founding discount

  zappix.ng/features           Features        3-pillar structure

  zappix.ng/blog               Blog            SEO --- WhatsApp TV + Nigeria
                                               business topics

  zappix.ng/about              About           Story, mission, team

  zappix.ng/contact            Contact         Form, WhatsApp support, email

  zappix.ng/ads/\[username\]   Ad Booking Page Shopify for WhatsApp ads --- public
                                               booking

  zappix.ng/ref/\[slug\]       Referral        Personalised signup with referral
                               Landing         tracked

  zappix.ng/legal/terms        Terms of        Includes Baileys risk disclaimer
                               Service         

  zappix.ng/legal/privacy      Privacy Policy  NDPR-compliant

  zappix.ng/legal/refund       Refund Policy   Cancellation terms
  ---------------------------------------------------------------------------------

**8.2 Auth Pages**

  ---------------------------------------------------------------------------------------
  **URL**                               **Page**        **Notes**
  ------------------------------------- --------------- ---------------------------------
  zappix.ng/login                       Sign In         Google OAuth

  zappix.ng/signup                      Sign Up         Google OAuth + referral code
                                                        field + founding badge

  zappix.ng/onboarding                  Onboarding      5 steps including risk disclosure

  zappix.ng/onboarding/connect-number   Connect Number  QR scan + warm-up enrolment
  ---------------------------------------------------------------------------------------

**8.3 Dashboard Pages**

  ----------------------------------------------------------------------------------
  **URL**                                 **Page**
  --------------------------------------- ------------------------------------------
  zappix.ng/app/dashboard                 Home --- KPIs, broadcast chart, warm-up
                                          alerts

  zappix.ng/app/scheduler                 Content Calendar

  zappix.ng/app/scheduler/new             New Single Post

  zappix.ng/app/scheduler/bulk            Bulk Upload

  zappix.ng/app/broadcasts                Broadcasts List

  zappix.ng/app/broadcasts/new            Broadcast Composer --- 5-step wizard

  zappix.ng/app/broadcasts/\[id\]         Broadcast Report --- send rate, replies,
                                          opt-outs

  zappix.ng/app/contacts                  Contacts Table

  zappix.ng/app/contacts/\[id\]           Contact Profile

  zappix.ng/app/contacts/import           CSV Import

  zappix.ng/app/contacts/lists            Contact Lists

  zappix.ng/app/contacts/segments         Smart Segments

  zappix.ng/app/contacts/duplicates       Duplicate Manager

  zappix.ng/app/ads                       Ad Slots Home

  zappix.ng/app/ads/slots                 Manage Slots

  zappix.ng/app/ads/slots/new             Create Ad Slot

  zappix.ng/app/ads/bookings              All Bookings

  zappix.ng/app/ads/bookings/\[id\]       Booking Detail

  zappix.ng/app/ads/revenue               Revenue Dashboard

  zappix.ng/app/bots                      Bots Home

  zappix.ng/app/bots/\[id\]               Bot Builder

  zappix.ng/app/bots/\[id\]/submissions   Bot Submissions --- leads and orders

  zappix.ng/app/menu-bots                 Menu Bots Home

  zappix.ng/app/menu-bots/\[id\]          Menu Bot Builder

  zappix.ng/app/analytics                 Analytics Overview

  zappix.ng/app/analytics/status          Status Analytics --- estimated reach

  zappix.ng/app/analytics/broadcasts      Broadcast Analytics

  zappix.ng/app/analytics/audience        Audience Growth

  zappix.ng/app/analytics/revenue         Ad Revenue Analytics

  zappix.ng/app/accounts                  Accounts --- number health dashboard

  zappix.ng/app/accounts/new              Connect Number --- QR + warm-up

  zappix.ng/app/accounts/\[id\]           Number Settings

  zappix.ng/app/accounts/team             Team Members

  zappix.ng/app/accounts/activity         Activity Log

  zappix.ng/app/referrals                 Referral Dashboard

  zappix.ng/app/referrals/withdraw        Withdrawal Page

  zappix.ng/app/referrals/leaderboard     Full Leaderboard

  zappix.ng/app/settings                  Settings Hub

  zappix.ng/app/settings/profile          Profile Settings

  zappix.ng/app/settings/billing          Billing & Subscription

  zappix.ng/app/settings/notifications    Notification Settings

  zappix.ng/app/settings/api              API & Integrations --- Agency plan only
  ----------------------------------------------------------------------------------

**9. Go-To-Market & Sales Strategy**

**9.1 Launch Principle**

> **INFO:** Do NOT run ads for the first 100 customers. Do direct
> outreach only. Paid ads before product-market fit wastes money. Direct
> outreach generates learning, feedback, and the right early users.

**9.2 Landing Page Structure**

The landing page at zappix.ng should follow this exact structure for
maximum conversion:

  ------------------------------------------------------------------------
  **Section**    **Content**
  -------------- ---------------------------------------------------------
  Hero           Headline: Run your WhatsApp TV like a real media company.
                 Sub: Schedule posts, sell ad slots, and automate
                 broadcasts from one dashboard. CTA: Start free trial.

  Problem        Running a WhatsApp TV is chaotic. Manual posting, manual
                 ad bookings, manual payments, manual reports. No data. No
                 systems.

  Solution       Zappix automates everything. Your posts go out on time.
                 Your ad slots sell themselves. Your broadcasts reach 100k
                 contacts in one click.

  3 Pillars      Audience Growth. Monetisation. Automation. Each pillar
                 with a short description and screenshot.

  Ad Slot Demo   Show the zappix.ng/ads/\[username\] page --- live demo of
                 the booking experience. This is the most powerful
                 conversion moment.

  Testimonials   3-5 quotes from Nigerian WhatsApp TV owners. Real names,
                 real audience sizes if possible.

  Pricing        3 plans with founding member discount highlighted.
                 Urgency: Only 47 founding spots remaining.

  Final CTA      Start your free trial. No credit card required.
  ------------------------------------------------------------------------

**9.3 First 100 Customers --- Direct Outreach Plan**

**Step 1 --- Build Lead List (300 WhatsApp TVs)**

Sources to find WhatsApp TV owners:

-   Instagram --- search \'WhatsApp TV\' + Nigerian cities. Look for
    \'Advertise here\' in bio

-   Twitter/X --- search \'WhatsApp TV\', \'advertise on my TV\', \'DM
    for ad rates\'

-   TikTok --- creators posting WhatsApp TV content, ad rate cards

-   Telegram --- WhatsApp TV directories and networking groups

**Step 2 --- WhatsApp Outreach Message**

> Hi 👋 I\'m building a tool for WhatsApp TV owners that lets you: •
> Schedule 30 days of statuses in 10 minutes • Automatically deliver ads
> to your audience • Let brands book and pay for ad slots online at
> zappix.ng/ads/yourTV A few TV owners are testing it right now. Would
> you like early access?

**Step 3 --- 10-Minute Demo**

Show only three things in the demo. Nothing else:

-   1\. Status Scheduler --- schedule 7 days of content in 60 seconds

-   2\. Broadcast Engine --- send a test broadcast to a sample list

-   3\. Ad Booking Page --- show zappix.ng/ads/\[their name\] live

**Close immediately after the demo. Offer founding price as the final
push.**

**9.4 Growth Loop --- Referral Leaderboard**

The referral system is already strong. Elevate it with a monthly cash
leaderboard to turn WhatsApp TV owners into active Zappix promoters:

  -----------------------------------------------------------------------
  **Rank**               **Monthly Prize**
  ---------------------- ------------------------------------------------
  1st Place 🥇           ₦200,000 cash

  2nd Place 🥈           ₦100,000 cash

  3rd Place 🥉           ₦50,000 cash
  -----------------------------------------------------------------------

WhatsApp TV owners with large audiences will promote Zappix heavily to
their own networks to win the monthly prize --- on top of their 25%
recurring commission. This creates a compounding growth loop where
Zappix\'s best users become its best salespeople.

**9.5 Expansion Strategy --- After 500 Customers**

Once Zappix has achieved product-market fit with WhatsApp TV owners,
expand to adjacent segments in this order:

  -----------------------------------------------------------------------
  **Phase**       **Segment**        **Why They Need Zappix**
  --------------- ------------------ ------------------------------------
  1st expansion   E-commerce sellers Broadcast product drops, automate
                                     order enquiries, manage buyer lists

  2nd expansion   Course creators    Sell info products via WhatsApp,
                                     lead capture, payment automation

  3rd expansion   Churches           Broadcast services, manage large
                                     congregation contact lists

  4th expansion   Real estate agents Send property listings, capture
                                     buyer leads, automate responses
  -----------------------------------------------------------------------

**10. Development Roadmap**

**10.1 Overview**

Phased launch. Ship core features fast. Add one major feature every 2-3
weeks. Target public launch at Week 11 (v1.0). Full product at Week 21
(v2.0).

  --------------------------------------------------------------------------
  **Phase**              **Weeks**   **Milestone**
  ---------------------- ----------- ---------------------------------------
  1\. Foundation         1-2         Hetzner server live, Baileys connects
                                     and sends test message

  2\. Auth & Billing     3-4         Signup → Pay → Dashboard flow complete,
                                     risk disclosure active

  3\. Status Scheduler   5-6         Status scheduling and auto-posting live

  4\. Broadcast Engine   7-8         Bulk messaging with throttle and ban
                                     protection live

  5\. Analytics          9           Estimated reach, send rate, audience
                                     growth live

  6\. Referral System    10          Referral links, leaderboard, monthly
                                     payouts live

  LAUNCH v1.0            11          Public launch --- 4 features +
                                     referral + founding pricing

  7\. Contact Manager    12-13       CRM --- lists, tags, segments, import

  8\. Multi-Account      14-15       Teams, roles, activity log, linked
  Manager                            numbers

  9\. Ad Slot Manager    16-17       Booking pages, ad delivery, revenue
                                     dashboard

  10\. Chatbot Builder   18-19       Away messages, menu bot, lead and order
                                     flows

  11\. Menu Bot          20          Product catalogue, service menu,
                                     download hub

  FULL PRODUCT v2.0      21          All 9 features, full QA, performance
                                     audit
  --------------------------------------------------------------------------

**10.2 v1.0 Launch Checklist**

-   All 4 core features QA tested end-to-end

-   Ban Risk Management system fully active (warm-up, throttle, health
    monitor)

-   Risk disclosure shown and logged during onboarding

-   Hetzner CX32 server live with Nginx + SSL for zappix.ng

-   PostgreSQL, Redis, PM2 all running and stable

-   GitHub Actions CI/CD pipeline deploying on every push to main

-   Paystack live mode enabled --- all 3 plans active

-   Founding member discount active for first 100 signups

-   Marketing landing page live with 3-pillar structure

-   zappix.ng/ads/\[username\] pages working and indexed

-   Sentry error monitoring and basic analytics installed

-   Support WhatsApp number set up and monitored

**11. Brand Identity**

**11.1 Name, Domain & Logo**

Name: Zappix. Domain: zappix.ng. Logo: lightning bolt icon inside a
rounded square with green gradient fill. Wordmark in Fraunces bold. The
.ng domain reinforces the Nigerian-first positioning.

**11.2 Colour Palette**

  ------------------------------------------------------------------------
  **Role**       **Name**      **Hex**      **Usage**
  -------------- ------------- ------------ ------------------------------
  Primary        Zappix Green  #16A34A      Buttons, CTAs, active states,
                                            key accents

  Light Green    Soft Green    #22C55E      Hover states, success
                                            indicators

  Tint           Pale Green    #F0FDF4      Card backgrounds, tag
                                            backgrounds, badges

  Base           White         #FFFFFF      Page and card backgrounds

  Surface        Light Grey    #F8FAFC      App background, alternate rows

  Text Primary   Near Black    #0F172A      All headlines and body text

  Text Secondary Dark Slate    #334155      Subtitles and descriptions

  Muted          Slate         #64748B      Placeholders and metadata
  ------------------------------------------------------------------------

**11.3 Typography**

  -------------------------------------------------------------------------
  **Role**      **Font**           **Weight**   **Usage**
  ------------- ------------------ ------------ ---------------------------
  Display       Fraunces (serif)   800-900      Hero titles, section
                                                headings, KPI numbers

  UI            Nunito             400-800      Body text, labels, buttons,
                (sans-serif)                    navigation
  -------------------------------------------------------------------------

**11.4 Brand Voice**

-   Confident --- \'Broadcast smarter. Grow faster.\'

-   Direct --- no fluff, Nigerians appreciate straight talk

-   Empowering --- \'Your audience. Your rules.\'

-   Nigerian-built --- Naira pricing, local context, .ng domain,
    relatable examples

**12. Business Model**

**12.1 Revenue Streams**

-   Primary: Monthly and annual SaaS subscriptions --- 3 plans, ₦15,000
    to ₦75,000/month

-   Growth: Referral system + leaderboard prizes drive organic
    acquisition at near-zero CAC

-   Future: Transaction percentage on ad bookings processed through
    Zappix

**12.2 Unit Economics**

  -----------------------------------------------------------------------------------
  **Scenario**   **Subscribers**   **Avg       **MRR**       **Server    **Margin**
                                   Plan**                    Cost**      
  -------------- ----------------- ----------- ------------- ----------- ------------
  Month 3        50                Growth ₦35k ₦1,750,000    ₦30,000     98.3%

  Month 6        200               Growth ₦35k ₦7,000,000    ₦30,000     99.6%

  Month 12       500               Growth ₦35k ₦17,500,000   ₦60,000     99.7%

  Month 18       1,000             Growth ₦35k ₦35,000,000   ₦100,000    99.7%
  -----------------------------------------------------------------------------------

> **NOTE:** At ₦35M MRR with only ₦100k in server costs, Zappix has
> extraordinary unit economics. The main costs at scale are team
> salaries, payment processing fees (Paystack \~1.5%), and referral
> commissions (25% of referred revenue).

**12.3 Path to ₦50M+ MRR**

  -----------------------------------------------------------------------
  **Milestone**   **What Gets You There**
  --------------- -------------------------------------------------------
  ₦1M MRR         \~29 Growth plan subscribers --- achievable in Month
                  2-3 with direct outreach

  ₦5M MRR         \~143 Growth subscribers --- referral loop and
                  word-of-mouth from early users

  ₦17M MRR        \~500 subscribers --- product-market fit confirmed,
                  begin secondary ICP expansion

  ₦35M MRR        \~1,000 subscribers --- agency and e-commerce segments
                  adding volume

  ₦50M MRR        \~1,400 subscribers --- multiple ICPs active, referral
                  flywheel fully running
  -----------------------------------------------------------------------

**13. Appendix**

**13.1 Third-Party Services**

  ------------------------------------------------------------------------
  **Service**     **Provider**          **Purpose**
  --------------- --------------------- ----------------------------------
  WhatsApp API    Baileys (open source) WhatsApp Web multi-device protocol

  Payments        Paystack              Subscriptions, transfers, webhooks

  Database        PostgreSQL 15         Primary data store on Hetzner
                  (self-hosted)         

  Cache / Queues  Redis (self-hosted)   BullMQ job queues, rate limiting

  Media Storage   Hetzner Volume        Media uploads, Baileys sessions

  Email           Resend                Transactional emails and summaries

  Auth            Google OAuth via      Sign in with Google
                  NextAuth v5           

  Hosting         Hetzner VPS (Ubuntu   CX32 → CX42 → CX52 as users grow
                  24.04)                

  Web Server      Nginx + Certbot       Reverse proxy + free SSL for
                                        zappix.ng

  Process Manager PM2                   Keep app running, auto-restart

  CI/CD           GitHub Actions        Auto-deploy on push to main

  Monitoring      Sentry                Error tracking and alerting
  ------------------------------------------------------------------------

**13.2 Compliance & Legal Notes**

-   Baileys operates outside WhatsApp Terms of Service --- risk
    disclaimer required in Terms

-   Zappix is not liable for WhatsApp account bans from platform usage

-   User data governed by Nigeria Data Protection Regulation (NDPR)

-   Payment processing via Paystack --- CBN-licensed

-   Risk disclosure acceptance logged with timestamp before any number
    is connected

**13.3 Competitive Advantages**

Zappix has three structural advantages that are hard to replicate:

-   Nigeria runs on WhatsApp --- the market is massive and underserved

-   WhatsApp TV owners already make money --- high willingness to pay
    for tools that grow revenue

-   No dominant SaaS exists yet --- Zappix can define and own the
    category

**Zappix is not building a tool. It is building infrastructure for a
real economy.**

**13.4 Document Version History**

  -------------------------------------------------------------------------------
  **Version**   **Date**    **Changes**
  ------------- ----------- -----------------------------------------------------
  1.0           March 2026  Initial product specification

  2.0           March 2026  Added Baileys capabilities section, ban risk
                            management, removed features requiring official API

  3.0           March 2026  Switched infrastructure to Hetzner VPS (replaced
                            GCP). New category positioning: Operating System for
                            WhatsApp TV Businesses. Simplified pricing to 3 plans
                            with founding discount. Added ICP section, 3-pillar
                            framework, direct outreach sales strategy,
                            leaderboard growth loop, expansion plan, and path to
                            ₦50M MRR. Domain set to zappix.ng throughout.
  -------------------------------------------------------------------------------
