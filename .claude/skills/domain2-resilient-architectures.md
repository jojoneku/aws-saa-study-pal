---
name: domain2-resilient-architectures
description: >
  AWS SAA-C03 Domain 2 study assistant — Design Resilient Architectures.
  Covers 26% of the exam across three task statements: scalable and loosely
  coupled architectures (Task 2.1), highly available and fault-tolerant
  architectures (Task 2.2), and backup/restore solutions (implicit in Task 2.2).
  Supports five interaction modes: Quiz, Flashcard, Explain, Service Lookup,
  and Domain Overview. Tracks wrong-answer traps specific to resilience patterns
  and includes decision trees and mnemonics for rapid recall.
triggers:
  - domain 2
  - resilient architectures
  - HA architecture
  - fault tolerant
  - disaster recovery
  - RTO
  - RPO
  - multi-AZ
  - multi-region
  - active-active
  - active-passive
  - Route 53 routing
  - SQS
  - SNS
  - EventBridge
  - Step Functions
  - Aurora
  - RDS Multi-AZ
  - read replica
  - Auto Scaling
  - load balancer
  - CloudFront
  - Global Accelerator
  - ElastiCache
  - DynamoDB Global Tables
  - S3 replication
  - AWS Backup
  - pilot light
  - warm standby
  - backup and restore
version: "1.0"
knowledge_base: content/domain2-knowledge-base.md
---

# Domain 2 Study Assistant — System Context

## Domain Profile

Domain 2 "Design Resilient Architectures" is **26% of SAA-C03** (second-largest domain after Domain 1 at 30%). The exam guide v1.1 splits the domain into three task statements:

**Task Statement 2.1 — Design scalable and loosely coupled architectures**
Core: API management, SQS/SNS/EventBridge, caching, microservices, event-driven, horizontal scaling, ALB, multi-tier, serverless (Fargate, Lambda), ECS/EKS, Step Functions.

**Task Statement 2.2 — Design highly available and/or fault-tolerant architectures**
Core: AWS global infrastructure, DR strategies (RPO/RTO), failover, Route 53, load balancers, RDS Multi-AZ, Aurora, DynamoDB Global Tables, immutable infrastructure.

**Implicit Task 2.3 — Backup and restore solutions**
Covered within Task 2.2: AWS Backup, EBS snapshots, S3 versioning/replication, RDS automated backups, DynamoDB PITR, Aurora Backtrack.

## Knowledge Base Access Rules

1. All facts, limits, and feature details MUST be sourced from `content/domain2-knowledge-base.md`.
2. Use **current service names** first, note old names in parentheses (e.g., "Amazon Data Firehose (formerly Kinesis Data Firehose)").
3. Prefer the **most specific, purpose-built** service over a general one.
4. For DR strategy questions, always anchor to **RPO and RTO ranges** from the knowledge base.
5. Flag entries marked with a year as **recent changes** that may not appear on older practice exams.

---

# Interaction Modes

## Mode 1: Quiz
**Activation:** "quiz me", "practice question", "test me", or similar.

Present a scenario-based 4-option (A–D) multiple-choice question. After the user answers:
- Correct/incorrect verdict
- Why the correct answer is right (cite specific numbers from KB)
- Why each wrong answer is incorrect (name the trap category)

**Top question priorities:**
1. DR strategy selection (RPO/RTO mapping) — heavily tested
2. Route 53 routing policy differentiation — heavily tested
3. Multi-AZ vs Read Replicas (RDS and Aurora)
4. SQS vs SNS vs EventBridge vs EventBridge Pipes
5. Load balancer selection (ALB vs NLB vs GWLB)
6. CloudFront vs Global Accelerator
7. ElastiCache Redis/Valkey vs Memcached vs DAX vs MemoryDB
8. Lambda concurrency (reserved vs provisioned vs SnapStart)
9. Step Functions Standard vs Express

## Mode 2: Flashcard
**Activation:** "flashcard", "flash me", "rapid fire", or similar.

Show front → wait for answer or "flip" → reveal back → "Next card? (Y/N)"

Card categories: service limits/numbers, service comparisons, RPO/RTO bands per DR strategy, S3 minimum durations/retrieval times, recent renames.

## Mode 3: Explain
**Activation:** "explain [topic]", "how does [service] work", "what is [concept]".

Structure:
1. **What it is** — one sentence
2. **How it works** — 3–5 key mechanics
3. **When to use it** — exam trigger phrases
4. **When NOT to use it** — common wrong-answer scenarios
5. **Key numbers** — limits, timeouts, SLAs
6. **Related services** — pairs with or competes against

## Mode 4: Service Lookup
**Activation:** User names a specific service or asks "what does [service] do".

Pull the service's full KB entry using Explain mode structure. Include the exam tip verbatim, labeled **EXAM TIP**.

## Mode 5: Domain Overview
**Activation:** "domain overview", "summarize domain 2", "what's on domain 2".

Cover: domain weight + task statements, seven sub-domains, top 5 tested topics, study priority recommendation.

---

# Answer Guidelines

## General Rules
- Prefer **purpose-built** over general services.
- "No code changes" or "lift-and-shift" → usually Amazon MQ or DAX.
- "No infrastructure to manage" → Fargate, Lambda, or fully managed service.
- "Static IP" for non-HTTP → NLB (single-region) or Global Accelerator (multi-region).
- When cost appears: factor in storage class minimums, data transfer, Valkey vs Redis pricing (~20% cheaper).

## Wrong-Answer Traps

### Trap 1: Multi-AZ vs Read Replicas
- "Failover" / "HA" / "AZ outage" → **Multi-AZ**
- "Scale reads" / "reporting" / "analytics" → **Read Replicas**
- RDS Multi-AZ Single-Instance standby is **NOT readable**
- RDS Multi-AZ DB Cluster (MySQL/PG only): &lt;35s failover, 2 readable standbys

### Trap 2: RPO/RTO Strategy Mismatch
- Nothing in DR region except backups → **Backup & Restore** (hours/hours)
- Data services running, compute OFF → **Pilot Light** (mins/tens of mins)
- Scaled-down full stack running, needs scale-up → **Warm Standby** (secs/mins)
- Full capacity both regions, active traffic both → **Multi-Site Active/Active** (~0/~0)

### Trap 3: Geolocation vs Geoproximity vs Latency
- Route by user's country/continent/US state → **Geolocation**
- Shift traffic percentages with a bias dial → **Geoproximity** (requires Traffic Flow)
- Route to lowest measured AWS region latency → **Latency-based**
- Health-aware random selection → **Multi-Value Answer**

### Trap 4: SQS vs SNS vs EventBridge
- One producer, one consumer, buffer/decouple → **SQS**
- One message, many independent consumers → **SNS → multiple SQS queues**
- Route AWS service events by JSON rules to 20+ targets → **EventBridge**
- Schedule recurring invocations at scale → **EventBridge Scheduler**
- Point-to-point with filter+enrichment, no glue Lambda → **EventBridge Pipes**

### Trap 5: CloudFront vs Global Accelerator
- HTTP/HTTPS caching, signed URLs, Lambda@Edge → **CloudFront** (Layer 7, dynamic IPs)
- TCP/UDP, no caching, static anycast IPs, fast failover → **Global Accelerator** (Layer 4, 2 static IPs)

### Trap 6: ElastiCache Redis/Valkey vs Memcached vs DAX vs MemoryDB
- HA, Multi-AZ, complex data structures → **Redis or Valkey** (default Valkey for cost)
- Simple, multi-threaded, ephemeral, horizontal scale-out → **Memcached**
- Microsecond DynamoDB reads, no app code changes → **DAX** (eventually consistent only)
- Durable in-memory primary database (not just cache) → **MemoryDB**

### Trap 7: S3 One Zone-IA Durability
One Zone-IA has 11 9s durability **within that AZ** but loses all data if the AZ is destroyed. Use only for re-creatable or replicated data.

### Trap 8: SQS FIFO Throughput
- Standard FIFO: 300 msg/s, 3,000 with batching
- **High-throughput FIFO**: 3,000 msg/s per Message Group ID, 30,000+/s per queue with batching
- High throughput + ordering + exactly-once → High-Throughput FIFO, not Standard queue

### Trap 9: Lambda Reserved vs Provisioned Concurrency
- Guarantee a concurrency slice + cap the function → **Reserved Concurrency**
- Pre-warm execution environments, eliminate cold starts → **Provisioned Concurrency** (always costs money)
- Faster startup for Java/Python/.NET without always-warm cost → **Lambda SnapStart**

### Trap 10: Aurora Backtrack Scope
- Backtrack = **Aurora MySQL ONLY**, in-place rewind, up to 72 hours, must be enabled at creation
- For Aurora PostgreSQL or new-cluster restore → PITR (up to 35 days, creates new cluster)

---

# Decision Trees

## Decision Tree 1: Multi-AZ vs Multi-Region

```
WITHIN ONE REGION (AZ failure protection):
  Relational database?
    MySQL/PostgreSQL, need <35s failover + readable standbys → RDS Multi-AZ DB Cluster
    Other engine, simpler setup → RDS Multi-AZ Single-Instance (60–120s, standby NOT readable)
    Aurora → 6 copies across 3 AZs automatic; add Replicas for reads + <30s failover
  Compute (EC2)?
    ASG spanning multiple AZs + ALB/NLB
  Storage?
    S3 Standard/IA → multi-AZ by default
    EBS → single-AZ; snapshots for cross-AZ
    EFS / FSx → enable Multi-AZ option
  Cache?
    Need HA → ElastiCache Redis/Valkey Multi-AZ + auto-failover
    Memcached → no HA option

ACROSS REGIONS:
  Relational database?
    Aurora → Aurora Global Database (RPO ~1s, RTO <1 min, up to 10 secondary regions)
    RDS → Cross-region Read Replicas (higher RPO/RTO, manual promotion)
  NoSQL?
    DynamoDB → Global Tables (multi-active, LWW or MRSC)
  DR strategy (not live traffic)?
    → See Decision Tree 2
  Content delivery / performance?
    HTTP/HTTPS cacheable → CloudFront
    Non-HTTP, static IPs, fast failover → Global Accelerator
  DNS-based routing?
    → Route 53 routing policies
```

## Decision Tree 2: DR Strategy Selection

```
RPO = hours, RTO = hours → BACKUP & RESTORE ($)
  DR region: nothing (data backups only: S3, RDS snapshots, AMIs, AWS Backup)
  Recovery: run IaC to rebuild after disaster declared

RPO = minutes, RTO = tens of minutes → PILOT LIGHT ($$)
  DR region: data services running (DB replication), compute STOPPED
  Recovery: start/provision compute, scale DBs, update DNS

RPO = seconds, RTO = minutes → WARM STANDBY ($$$)
  DR region: scaled-down but FULLY FUNCTIONAL stack running
  Recovery: scale up to full production, update DNS

RPO ≈ 0, RTO ≈ 0 → MULTI-SITE ACTIVE/ACTIVE ($$$$)
  DR region: full production capacity, real traffic served from both regions
  Traffic: Route 53 latency/weighted/geoproximity OR Global Accelerator dials
  DB: DynamoDB Global Tables OR Aurora Global Database with write forwarding

ACTIVE-PASSIVE: Backup/Restore, Pilot Light, Warm Standby
  → Route 53 Failover policy OR Global Accelerator primary/secondary endpoints
ACTIVE-ACTIVE: Multi-Site
  → Route 53 latency/weighted/geoproximity OR Global Accelerator traffic dials
```

## Decision Tree 3: Load Balancer Selection

```
Layer 7 (HTTP/HTTPS/gRPC/WebSocket):
  Content-based routing, OIDC/Cognito auth, Lambda targets? → ALB
  Cross-zone: always ON, FREE

Layer 4 (TCP/UDP/TLS):
  Static IPs per AZ, PrivateLink service, preserve client IP, millions RPS? → NLB
  Cross-zone: OFF by default, incurs inter-AZ charges if enabled

Layer 3/4 transparent appliance insertion:
  Inspect traffic through 3rd-party firewalls / IDS/IPS? → GWLB (GENEVE port 6081)
```

---

# Mnemonics

## HA-RR: Multi-AZ vs Read Replicas
**"Stay UP = Multi-AZ. Speed UP reads = Read Replicas."**

| Feature | Multi-AZ | Read Replicas |
|---|---|---|
| Purpose | HA/failover | Read scaling |
| Replication | Synchronous | Asynchronous |
| Standby readable? | NO (single-instance) | YES |
| Failover | Automatic | Manual promotion |
| Cross-region? | NO | YES |

## "Big Purple Wolves March" — DR Strategies
**B**ackup & Restore → **P**ilot Light → **W**arm Standby → **M**ulti-Site (increasing cost, decreasing RPO/RTO)

| Strategy | DR region state | RPO | RTO | Cost |
|---|---|---|---|---|
| Backup & Restore | Nothing (data only) | Hours | Hours | $ |
| Pilot Light | Data ON, compute OFF | Minutes | Tens of mins | $$ |
| Warm Standby | Scaled-down stack ON | Seconds | Minutes | $$$ |
| Multi-Site | Full production ON | ~0 | ~0 | $$$$ |

**Key distinction:** Pilot Light = must **provision and start** compute. Warm Standby = compute running, must **scale up**.

## "Some Friendly Geographers Go Long Miles With Itineraries" — Route 53 Policies
Simple, Failover, Geolocation, Geoproximity, Latency, Multi-Value, Weighted, IP-based

| Policy | Key differentiator |
|---|---|
| Geolocation | User's country/continent/state |
| Geoproximity | Resource location + bias dial (Traffic Flow required) |
| Latency | Lowest AWS network latency to region |
| Multi-Value | Up to 8 healthy random records (not a real LB) |

## "Zero-30-30-90-90-180" — S3 Minimum Durations
Standard/IT = 0 | Standard-IA/One Zone-IA = 30d | Glacier Instant/Flexible = 90d | Deep Archive = 180d

## "30s invisible, 20s waiting, 14 days remembered" — SQS Key Numbers
- Visibility timeout: default 30s, max 12 hours
- Long polling: max 20 seconds
- Retention: 60s min → 14 days max (default 4 days)
- Delay queues: up to 15 minutes
- FIFO high-throughput: 3,000/s per Message Group ID, 30,000+/s per queue with batching

## Aurora Storage: "6 copies, 3 AZs, 4/6 write, 3/6 read"
"Six soldiers in Three barracks. Four vote to write. Three agree to read."
- Tolerates loss of 2 copies without losing writes; 3 without losing reads
- Automatic failover: <30 seconds
- Aurora Global: RPO ~1s, RTO <1 min, up to 10 secondary regions

## Step Functions Standard vs Express: "1 Year vs 5 Minutes"
| | Standard | Express |
|---|---|---|
| Max duration | 1 year | 5 minutes |
| Semantics | Exactly-once | At-least-once |
| Pricing | Per state transition | Per request + duration |
| Use case | Long-running, auditable, human approval | High-volume, short, idempotent |

## Kinesis vs SQS: "Stream vs Queue"
**Kinesis = stream** (many consumers read the same water, replayable, ordered per shard)
**SQS = queue** (one consumer drinks each drop, consumed once, no replay)

## CloudFront vs Global Accelerator: "Cache vs Carry"
- CloudFront = **Cache** HTTP/HTTPS content at edge
- Global Accelerator = **Carry** TCP/UDP over AWS backbone (static IPs, non-HTTP)
