# MediaForge

A self-hosted media asset management and delivery platform — an open, private alternative to Cloudinary, ImageKit.io, and Bunny CDN. Upload once, transform via URL, deliver globally through your own domain.

---

## The Problem

Every modern application needs to serve media files — product images, profile pictures, thumbnails, PDFs. But a single uploaded photo needs to appear in dozens of variants: resized, cropped, converted to WebP or AVIF, compressed differently for mobile vs desktop. Services like Cloudinary handle this, but they charge per-transformation, store your files on their infrastructure, and serve from their domain — creating cost, ownership, and compliance concerns at scale.

## The Solution

MediaForge runs entirely on your AWS account. You upload a file once, and it becomes available at a delivery URL on your custom domain. By modifying URL parameters, any client can request any variant on the fly — no pre-processing, no batch jobs.

```
https://cdn.yourdomain.com/v1/image/w_800,f_auto,q_auto/products/hero.jpg
```

The transformation happens at the edge the first time it's requested, gets cached globally across 400+ CloudFront locations, and every subsequent request is served in ~5ms.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MediaForge                                     │
│                                                                             │
│   MANAGEMENT PATH                              DELIVERY PATH                │
│                                                                             │
│   ┌──────────────┐                          ┌────────────────┐              │
│   │   Next.js    │                          │ Browser Request│              │
│   │  Dashboard   │                          │cdn.yourdomain.com             │
│   └──────┬───────┘                          └───────┬────────┘              │
│          │                                          │                       │
│          ▼                                          ▼                       │
│   ┌──────────────┐   JWT validates    ┌─────────────────────┐               │
│   │   Cognito    │ ─ ─ ─ ─ ─ ─ ─ ─ ▶  │ CloudFront + ACM    │               │
│   │  User Pool   │                    │ CDN + Custom Domain │               │
│   └──────┬───────┘                    └───────┬─────────────┘               │
│          │                                    │                             │
│          ▼                                    ▼         ┌──────┐            │
│   ┌──────────────┐                    ┌──────────────┐  │Cache │            │
│   │ API Gateway  │                    │ Lambda@Edge  │◀-┤ Hit  │            │
│   │  + Cognito   │                    │ URL Parse +  │  │(95%+)│            │
│   │  Authorizer  │                    │ Sharp Transform └──────┘            │
│   └──────┬───────┘                    └──────┬───────┘                      │
│          │                                   │                              │
│          ▼                                   │                              │
│   ┌──────────────┐                           │                              │
│   │   Lambda     │                           │                              │
│   │ (API Logic)  │                           │                              │
│   └──┬───┬───┬───┘                           │                              │
│      │   │   │                               │                              │
│  ┌───┘   │   └────────────┐                  │                              │
│  │       │                │                  │                              │
│  │       ▼                ▼                  ▼                              │
│  │  ┌─────────────────────────────────────────────────┐                     │
│  │  │              PERSISTENT STORAGE                 │                     │
│  │  │                                                 │                     │
│  │  │  ┌───────────────────┐  ┌───────────────────┐   │                     │
│  │  │  │       S3          │  │    DynamoDB       │   │                     │
│  │  │  │  Originals +      │  │  Metadata, Folders│   │                     │
│  │  │  │  Cached Transforms│  │  Users, API Keys  │   │                     │
│  │  │  └───────────────────┘  └───────────────────┘   │                     │
│  │  └─────────────────────────────────────────────────┘                     │
│  │                                                                          │
│  │  ┌─────────────────────────────────────────────────┐                     │
│  │  │           ASYNC EMAIL PIPELINE                  │                     │
│  │  │                                                 │                     │
│  └▶ │  SNS ──▶ SQS ──▶ Email Worker ──▶ SES           │                     │
│     │  (event   (queue    Lambda)         (send)      │                     │
│     │   bus)     + DLQ)                               │                     │
│     └─────────────────────────────────────────────────┘                     │
│                                                                             │
│   ┌─────────────────────────────────────────────────────┐                   │
│   │   IAM — Least-privilege roles for every service     │                   │
│   └─────────────────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## AWS Services (11 total)

| Service | Role | Justification |
|---------|------|---------------|
| **S3** | Origin storage for originals + cached transforms | Only viable option for large-scale object storage on AWS |
| **CloudFront** | Global CDN, edge caching, custom domain routing | Low-latency delivery at 400+ edge locations worldwide |
| **Lambda@Edge** | URL parsing + Sharp-based image transforms at the edge | Only way to run custom transform logic at CloudFront's edge |
| **Lambda** | Backend API logic — upload, CRUD, folders, events | Serverless compute, scales to zero, no servers to manage |
| **API Gateway** | REST API with auth, throttling, routing | Managed REST endpoints with native Cognito authorizer |
| **DynamoDB** | Asset metadata, folder tree, users, API keys | Single-digit ms reads, schema-flexible for varied metadata |
| **ACM** | SSL certificates for `cdn.yourdomain.com` | Free auto-renewing certs required by CloudFront for HTTPS |
| **Cognito** | User auth — signup, login, JWT issuance | Managed auth lifecycle, issues JWTs that API Gateway validates natively |
| **SNS** | Publishes user lifecycle events (fan-out) | Decouples API from downstream consumers |
| **SQS** | Queues email jobs with retry + dead-letter | Absorbs spikes, automatic retry, signup never blocked by email failure |
| **SES** | Sends templated transactional emails | Handles SPF/DKIM/DMARC, bounce management, delivery tracking |

---

## Flow Steps

### Flow 1 — User Signup

```
1. User submits email + password on the dashboard login page
2. Dashboard calls POST /v1/auth/signup → proxied to Cognito
3. Cognito creates the account and sends a verification code to the user's email
4. User enters the code on the verify page → Cognito confirms the account
5. Cognito fires the post-confirmation Lambda trigger
6. Post-confirmation Lambda:
   a. Creates a user record in DynamoDB (Users table)
   b. Generates a default API key → hashes with SHA-256 → stores in DynamoDB (ApiKeys table)
   c. Creates a root folder for the user in DynamoDB (Folders table)
   d. Publishes a USER_CREATED event to the SNS topic
7. SNS delivers the event to the SQS email queue (filtered by eventType)
8. Email Worker Lambda picks up the SQS message:
   a. Renders the welcome email template with user's name, API key, and delivery domain
   b. Sends via SES
   c. On success → message deleted from queue
   d. On failure → retries up to 3 times → dead-letter queue
9. User receives the welcome email in their inbox
```

### Flow 2 — File Upload

```
1. User logs into the dashboard → Cognito returns JWT access token
2. User drags a file onto the upload zone and selects a destination folder
3. Dashboard calls POST /v1/upload with the file + folder ID
   (Authorization: Bearer <jwt-token> header attached automatically)
4. API Gateway validates the JWT via the Cognito authorizer
   → Invalid/expired token = 401 rejected before reaching Lambda
5. API Lambda receives the request:
   a. Validates file type (against allowed MIME types) and size (against max limit)
   b. Generates a ULID for the asset ID
   c. Extracts metadata using Sharp (dimensions, format) and EXIF data
   d. Builds the S3 key: originals/{userId}/{folderId}/{assetId}.{ext}
   e. Uploads the file bytes to S3
   f. Writes the metadata record to DynamoDB (Assets table):
      - assetId, userId, folderId, fileName, originalKey, mimeType,
        fileSize, width, height, metadata, tags, status, timestamps
   g. Updates the folder's assetCount and totalSize in DynamoDB
6. Lambda returns the asset record including the delivery URL:
   https://cdn.yourdomain.com/v1/image/{folderId}/{fileName}
7. Dashboard displays the uploaded asset with a copy-ready delivery URL
```

### Flow 3 — Image Delivery + Transformation (the core flow)

```
Request URL: https://cdn.yourdomain.com/v1/image/w_500,h_300,f_auto,q_80/products/hero.jpg

STEP 1 — CloudFront Edge (cache check)
   Browser request hits the nearest CloudFront edge location.
   CloudFront checks its local cache using the full URL as the cache key.
   ├── CACHE HIT  → Serve immediately (~5ms). Done. This handles 95%+ of traffic.
   └── CACHE MISS → Trigger Lambda@Edge on origin-request event. Continue to step 2.

STEP 2 — Lambda@Edge (URL parsing)
   Lambda@Edge receives the CloudFront event and parses the URL:
   ├── Asset type:  "image"
   ├── Transforms:  { width: 500, height: 300, format: "auto", quality: 80 }
   └── Asset path:  "products/hero.jpg"

   For f_auto: reads the browser's Accept header from the viewer request.
   ├── Contains "image/avif"  → resolved format = AVIF
   ├── Contains "image/webp"  → resolved format = WebP
   └── Neither                → resolved format = original (JPEG)

STEP 3 — S3 Transform Cache (check for pre-built variant)
   Generates a deterministic cache key by hashing:
   SHA-256(w_500 + h_300 + f_avif + q_80 + products/hero.jpg)
   → transforms/{userId}/a8f3c2e1/{assetId}.avif

   Checks if this exact key exists in S3 (HEAD request).
   ├── EXISTS     → Rewrite CloudFront origin path to this S3 key. Done.
   └── NOT EXISTS → Continue to step 4.

STEP 4 — Transform with Sharp (first-time only, ~200-800ms)
   a. Fetch the original file from S3:
      originals/{userId}/{folderId}/{assetId}.jpg
   b. Pipe through Sharp in a single pass:
      → Resize to 500×300
      → Apply crop mode (default: cover)
      → Convert to AVIF format
      → Compress at quality 80
   c. The result is a transformed image buffer.

STEP 5 — Cache + Serve
   a. Write the transformed buffer to S3:
      transforms/{userId}/a8f3c2e1/{assetId}.avif
      (So step 3 catches it on the next request for this variant)
   b. Return the image to CloudFront with headers:
      Content-Type: image/avif
      Cache-Control: public, max-age=2592000, immutable
      Vary: Accept
   c. CloudFront caches this at the edge for 30 days.
   d. Browser receives the optimized image.

RESULT: Three-tier caching
   Tier 1 — CloudFront edge cache (~5ms, global, handles 95%+ of requests)
   Tier 2 — S3 transform cache (avoids re-processing on edge cache miss)
   Tier 3 — Original in S3 (only touched on first-ever transform)
```

### Flow 4 — Email Pipeline (SNS → SQS → SES)

```
1. A triggering event occurs (e.g., user signup, quota threshold reached)
2. The originating Lambda publishes an event to the SNS topic:
   {
     type: "USER_CREATED",
     userId: "usr_01HX...",
     email: "user@example.com",
     name: "Jane Doe",
     timestamp: "2026-04-06T..."
   }
   Message attributes: { eventType: "USER_CREATED", environment: "prod" }

3. SNS evaluates subscription filter policies:
   ├── SQS email queue: filter = { eventType: ["USER_CREATED"] } → MATCH → delivered
   ├── [Future] Slack queue: filter = { eventType: ["USER_CREATED"] } → delivered
   └── [Future] Analytics queue: filter = { eventType: ["*"] } → delivered

4. SQS receives the message:
   ├── Visibility timeout: 60 seconds
   ├── If no consumer picks it up → retried
   └── Message retention: 4 days

5. Email Worker Lambda is triggered by SQS (event source mapping):
   a. Parses the SQS batch (may contain multiple messages)
   b. For each message:
      - Extracts the SNS event payload
      - Routes by eventType → selects the correct Handlebars template
      - Renders the HTML email (welcome.hbs + _layout.hbs)
      - Calls SES SendEmail with the rendered HTML

6. SES sends the email:
   ├── Success → SQS message is deleted from the queue
   └── Failure (throttle, bounce, temporary error):
       ├── Message returns to SQS (visibility timeout expires)
       ├── Retry attempt 1, 2, 3...
       └── After 3 failures → message moves to the dead-letter queue
           └── CloudWatch alarm fires (DLQ depth > 0)

7. Key design properties:
   - User signup NEVER fails because of email — the flows are fully decoupled
   - Adding a new subscriber (Slack, analytics) = new SQS queue + filter policy
   - Adding a new email type = new event type + new template — no publisher changes
```

### Flow 5 — Cache Invalidation

```
1. User replaces an existing asset (re-uploads with the same path)
   or explicitly clicks "Purge Cache" in the dashboard
2. Dashboard calls POST /v1/cache/invalidate with the asset ID
3. API Lambda:
   a. Lists all S3 objects under transforms/{userId}/*/{assetId}.*
      (all cached variants of this asset)
   b. Deletes each variant from S3 (batch delete)
   c. Creates a CloudFront invalidation for the asset's URL pattern:
      /v1/image/*/{folderPath}/{fileName}
      (wildcards cover all transform combinations)
4. CloudFront propagates the invalidation to all edge locations (~30-60 seconds)
5. Next request for any variant of this asset will trigger a fresh transform
```

### Flow 6 — CI/CD Deployment (GitHub Actions)

```
Developer pushes to main branch
        │
        ├── infrastructure/ or packages/api/ or packages/email-worker/ changed?
        │   └── deploy-infra.yml triggers:
        │       1. Checkout → Install → Lint → Test
        │       2. AWS auth via GitHub OIDC (no stored secrets)
        │       3. cdk synth (generate CloudFormation templates)
        │       4. cdk diff (log what will change)
        │       5. cdk deploy --all --require-approval never
        │          Deploys in dependency order:
        │          AuthStack → StorageStack → ApiStack → CdnStack → EmailStack
        │
        ├── packages/dashboard/ changed?
        │   └── deploy-dashboard.yml triggers:
        │       1. Checkout → Install → Build (next build + static export)
        │       2. AWS auth via GitHub OIDC
        │       3. aws s3 sync build output → dashboard S3 bucket
        │       4. aws cloudfront create-invalidation (purge old dashboard files)
        │
        └── packages/edge-transform/ changed?
            └── deploy-edge.yml triggers:
                1. Checkout → Install → Bundle with esbuild (minimal for cold start)
                2. Run Sharp transform unit tests
                3. AWS auth via GitHub OIDC (us-east-1 — required for Lambda@Edge)
                4. cdk deploy CdnStack
                5. Wait for CloudFront distribution deployment (~2-5 min)
```

---

## URL Transformation Reference

**Pattern:** `https://cdn.yourdomain.com/v1/{type}/{transforms}/{path}`

| Parameter | Description | Example |
|-----------|-------------|---------|
| `w_{n}` | Width in pixels | `w_500` |
| `h_{n}` | Height in pixels | `h_300` |
| `f_{fmt}` | Format: auto, webp, avif, png, jpg | `f_auto` |
| `q_{n}` | Quality 1-100, or auto | `q_auto` |
| `c_{mode}` | Crop: fill, fit, cover, contain, thumb | `c_fill` |
| `g_{pos}` | Gravity: center, north, face, auto | `g_center` |
| `ar_{r}` | Aspect ratio | `ar_16:9` |
| `e_{fx}` | Effects: blur, sharpen, grayscale, sepia | `e_blur:10` |
| `dpr_{n}` | Device pixel ratio | `dpr_2` |
| `bg_{hex}` | Background color (padding fill) | `bg_ffffff` |
| `r_{n}` | Border radius | `r_20` |
| `fl_{flag}` | Flags: progressive, strip, lossy | `fl_progressive` |

**Examples:**

```bash
# Auto-format, auto-quality, resize
cdn.yourdomain.com/v1/image/w_800,f_auto,q_auto/products/hero.jpg

# Square thumbnail with face detection
cdn.yourdomain.com/v1/image/w_150,h_150,c_thumb,g_face/avatars/user.jpg

# Retina-ready with blur effect
cdn.yourdomain.com/v1/image/w_400,dpr_2,e_blur:5,f_auto/banners/bg.jpg

# Video poster frame
cdn.yourdomain.com/v1/video/w_640,f_jpg/demos/intro.mp4

# PDF page as image
cdn.yourdomain.com/v1/document/w_800,f_png,pg_1/reports/q3.pdf

# Raw file passthrough (no transforms)
cdn.yourdomain.com/v1/raw/documents/contract.pdf
```

---

## Project Structure

```
media-forge/
├── .github/workflows/           # CI/CD pipelines (infra, dashboard, edge)
├── infrastructure/              # AWS CDK stacks (TypeScript)
│   ├── lib/
│   │   ├── auth-stack.ts        # Cognito
│   │   ├── storage-stack.ts     # S3 + DynamoDB
│   │   ├── api-stack.ts         # API Gateway + Lambda
│   │   ├── cdn-stack.ts         # CloudFront + ACM + Lambda@Edge
│   │   ├── email-stack.ts       # SNS + SQS + SES
│   │   └── dashboard-hosting-stack.ts
│   └── bin/app.ts               # CDK app entry
├── packages/
│   ├── core/                    # Shared types, URL parser, validators, constants
│   ├── edge-transform/          # Lambda@Edge — Sharp image processing at the CDN edge
│   ├── api/                     # Backend Lambda — upload, CRUD, folders, auth, events
│   ├── email-worker/            # SQS consumer Lambda — renders templates, sends via SES
│   └── dashboard/               # Next.js 15 — full web UI with Cognito auth
├── package.json                 # Monorepo root (npm workspaces)
└── turbo.json                   # Turborepo pipeline config
```

---

## Tech Stack

**Backend:** Node.js (TypeScript), AWS Lambda (ARM64), Sharp (image processing)

**Frontend:** Next.js 15 (App Router), Tailwind CSS, shadcn/ui, React Query, Cognito SDK

**Infrastructure:** AWS CDK (TypeScript), 11 AWS services

**CI/CD:** GitHub Actions, GitHub OIDC (no stored AWS keys), CDK deploy

---

## Getting Started

```bash
# Clone and scaffold
git clone https://github.com/yourorg/media-forge.git
cd media-forge

# Install dependencies (all packages)
npm install

# Configure environment
cp .env.example .env
# Edit .env with your AWS account, region, domain

# Deploy infrastructure (Phase 1)
cd infrastructure
npx cdk bootstrap
npx cdk deploy AuthStack StorageStack ApiStack

# Run the dashboard locally
cd ../packages/dashboard
npm run dev
```