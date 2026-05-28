# AWS SAA-C03 Domain 2: Design Resilient Architectures — Canonical Deep Research Reference

*Compiled May 2026 from AWS official documentation, What's New posts, and the SAA-C03 Exam Guide v1.1. Reflects service updates through early 2026. Designed as the source document for ~50-60 service reference cards, ~30 scenario quizzes, and ~40 identification flashcards.*

---

## 1. DOMAIN 2 OVERVIEW (FROM OFFICIAL EXAM GUIDE v1.1)

**Domain weight:** 26% of the SAA-C03 exam (second-largest domain).
**Source:** AWS Certified Solutions Architect – Associate (SAA-C03) Exam Guide v1.1 — https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html (PDF: https://docs.aws.amazon.com/pdfs/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.pdf).

### Task Statement 2.1 — Design scalable and loosely coupled architectures

**Knowledge of (verbatim):**
- API creation and management (for example, Amazon API Gateway, REST API)
- AWS managed services with appropriate use cases (for example, AWS Transfer Family, Amazon SQS, AWS Secrets Manager)
- Caching strategies
- Design principles for microservices (for example, stateless workloads compared with stateful workloads)
- Event-driven architectures
- Horizontal scaling and vertical scaling
- How to appropriately use edge accelerators (for example, content delivery network [CDN])
- How to migrate applications into containers
- Load balancing concepts (for example, Application Load Balancer [ALB])
- Multi-tier architectures
- Queuing and messaging concepts (for example, publish/subscribe)
- Serverless technologies and patterns (for example, AWS Fargate, AWS Lambda)
- Storage types with associated characteristics (for example, object, file, block)
- The orchestration of containers (for example, Amazon ECS, Amazon EKS)
- When to use read replicas
- Workflow orchestration (for example, AWS Step Functions)

**Skills in (verbatim):**
- Designing event-driven, microservice, and/or multi-tier architectures based on requirements
- Determining scaling strategies for components used in an architecture design
- Determining the AWS services required to achieve loose coupling based on requirements
- Determining when to use containers
- Determining when to use serverless technologies and patterns
- Recommending appropriate compute, storage, networking, and database technologies based on requirements
- Using purpose-built AWS services for workloads

### Task Statement 2.2 — Design highly available and/or fault-tolerant architectures

**Knowledge of (verbatim):**
- AWS global infrastructure (for example, Availability Zones, AWS Regions, Amazon Route 53)
- AWS Managed Services (AMS) with appropriate use cases (for example, Amazon Comprehend, Amazon Polly)
- Basic networking concepts (for example, route tables)
- Disaster recovery (DR) strategies (for example, backup and restore, pilot light, warm standby, active-active failover, recovery point objective [RPO], recovery time objective [RTO])
- Distributed design patterns
- Failover strategies
- Immutable infrastructure
- Load balancing concepts (for example, ALB)
- Proxy concepts (for example, Amazon RDS Proxy)
- Service quotas and throttling (for example, how to configure the service quotas for a workload in a standby environment)
- Storage options and characteristics (for example, durability, replication)
- Workload visibility (for example, AWS X-Ray)

**Skills in (verbatim):**
- Determining automation strategies to ensure infrastructure integrity
- Determining the AWS services required to provide a highly available and/or fault-tolerant architecture across AWS Regions or Availability Zones
- Identifying metrics based on business requirements to deliver a highly available solution
- Implementing designs to mitigate single points of failure
- Implementing strategies to ensure the durability and availability of data (for example, backups)
- Selecting an appropriate DR strategy to meet business requirements
- Using AWS services that improve the reliability of legacy applications and applications not built for the cloud (for example, when application changes are not possible)
- Using purpose-built AWS services for workloads

### v1.0 → v1.1 Exam Guide Changes (Domain 2-relevant)
- **AWS SSO → AWS IAM Identity Center** (rename)
- **Kinesis Data Firehose → Amazon Data Firehose** (rebrand Feb 2024)
- **Personal Health Dashboard → AWS Health Dashboard** (rename)
- **AWS Proton removed** from in-scope services
- **AWS VPN split** into AWS Client VPN and AWS Site-to-Site VPN
- **Application Migration Service, Migration Hub, SMS, CodeStar, Forecast, Fraud Detector** removed; **SageMaker → SageMaker AI**; **QuickSight → QuickSuite**

---

## 2. SERVICE INVENTORY ORGANIZED BY 7 SUB-DOMAINS

### Sub-domain A: Application Integration & Decoupling

#### A1. Amazon SQS
**What it is:** Fully managed pull-based message queue for decoupling producers and consumers.

**Key exam features:**
- **Standard** queues: unlimited TPS, at-least-once delivery, best-effort ordering
- **FIFO** queues (`.fifo` suffix): exactly-once processing within a 5-minute deduplication window, strict ordering per Message Group ID. Default 300 TPS per API method, 3,000 TPS with batching. **High-throughput FIFO**: up to 3,000 msgs/sec per message group ID, 30,000+ msgs/sec per queue with batching
- **Visibility timeout:** default 30s, max 12 hours
- **Long polling** (`ReceiveMessageWaitTimeSeconds` up to 20s) reduces empty receives and cost vs short polling
- **DLQ**: configured via redrive policy (`maxReceiveCount` 1–1000); DLQ must match source queue type. **Redrive Allow Policy** controls which sources may use a DLQ. **DLQ Redrive to Source** moves messages back for reprocessing
- **Message retention:** 60 sec to 14 days (default 4 days)
- **Batching:** up to 10 messages per batch, total ≤256 KB
- **Delay queues:** up to 15 min queue-level delay; per-message delay (Standard only)
- **Max message size:** 256 KB; SQS Extended Client Library + S3 supports up to 2 GB
- **Encryption:** SSE-SQS (default since Aug 2022) or SSE-KMS

**Exam tip:** Default loose-coupling answer. FIFO for ordering/dedup; Standard otherwise. Long polling reduces cost. DLQ + max receive count quarantines poison messages.

#### A2. Amazon SNS
**What it is:** Push-based pub/sub topic service for fan-out and A2A/A2P notifications.

**Key exam features:**
- **Standard topics**: at-least-once, best-effort order, very high TPS; subscribers include SQS, Lambda, HTTP(S), email, SMS, mobile push (APNs/FCM/ADM), Kinesis Data Firehose, Application endpoint
- **FIFO topics**: exactly-once, strict ordering per message group ID. **Can ONLY deliver to SQS (Standard or FIFO) queues**—no email/SMS/Lambda directly. 100 subscriptions max per FIFO topic
- **Message filtering**: filter policies attached to subscriptions; supports **attribute-based** and **payload-based** filtering (added Nov 2022, JSON body matching)
- **Per-subscription DLQ** (an SQS queue)
- **SNS → Firehose** for archive to S3/Redshift/OpenSearch/Splunk/Datadog/etc.
- **Encryption:** SSE-KMS; 256 KB max message (2 GB with Extended Client Library)

**Exam tip:** Canonical fan-out pattern = SNS → multiple SQS queues. FIFO topics deliver only to SQS. Use payload-based filtering when publishers don't control attributes.

#### A3. Amazon EventBridge
**What it is:** Serverless event router / event bus for event-driven architectures. Evolved from CloudWatch Events.

**Key exam features:**
- **Event buses**: default (AWS services), custom (your apps), partner (Zendesk, Datadog, Shopify, PagerDuty, etc.)
- **Rules**: JSON pattern match or schedule; up to 5 targets per rule
- **20+ AWS service targets** (Lambda, SQS, SNS, Step Functions, Kinesis, ECS, Batch, etc.)
- **Schema Registry** + **Schema Discovery** auto-infers schemas
- **Archive & Replay** for debug/recovery
- **EventBridge Pipes (Dec 2022)**: point-to-point integration from sources (SQS, Kinesis, DynamoDB Streams, MQ, Kafka) → optional filter → optional enrichment (Lambda/Step Functions/API Gateway/API destination) → target. Replaces Lambda glue code
- **EventBridge Scheduler (Nov 2022)**: one-time and recurring schedules at scale; supports **270+ AWS services and 6,000+ API actions**, time zones, flexible windows, default 10M schedules per account. **AWS recommends Scheduler over scheduled rules** for new workloads

**Exam tip:** EventBridge routes events with JSON rules; SNS pub/subs to many subscribers; SQS buffers between two services. For new scheduling needs, default to EventBridge Scheduler.

#### A4. AWS Step Functions
**What it is:** Serverless workflow orchestration via state machines (Amazon States Language).

**Key exam features:**
- **Standard workflows**: up to **1 year** execution, exactly-once, $/state transition, full history, async only
- **Express workflows**: up to **5 minutes**, at-least-once (must be idempotent), $/request+duration, no native history. Synchronous Express returns result; Asynchronous fire-and-forget
- **State types**: Task, Choice, Wait, Parallel, **Map** (Inline up to 40 concurrent / **Distributed** up to 10,000 concurrent child executions, can iterate S3 inventories/CSV/JSONL), Pass, Succeed, Fail
- **Error handling**: Retry (with backoff) and Catch
- **Three integration patterns**:
  1. **Request-Response** (default — fire and continue)
  2. **Run a Job (`.sync`)** — wait for the job to finish
  3. **Wait for Callback (`.waitForTaskToken`)** — pause for human approval / external system callback (Standard only)
- Direct integrations with 200+ AWS services / 9,000+ API actions

**Exam tip:** Standard for long-running (≤1 yr), exactly-once, auditable. Express for high-volume short (≤5 min), idempotent. `.waitForTaskToken` is the answer for human approval / external callback. Distributed Map for parallel iteration over S3 objects.

#### A5. Amazon MQ
**What it is:** Managed Apache ActiveMQ and RabbitMQ message broker for lift-and-shift migrations.

**Key exam features:**
- Protocols: **ActiveMQ** = JMS, AMQP 1.0, MQTT, OpenWire, STOMP, WSS; **RabbitMQ** = AMQP 0-9-1
- **ActiveMQ deployments**: single-instance (dev), **Active/Standby Multi-AZ** (prod HA, shared EFS)
- **RabbitMQ deployments**: single-instance (dev), **Cluster Multi-AZ** (3 nodes across 3 AZs, mirrored queues — prod HA)
- Public vs private brokers; EFS (durable) or EBS (throughput) storage

**Exam tip:** Default to SQS/SNS for new AWS-native apps. Choose Amazon MQ when migrating from on-prem with JMS/AMQP/MQTT/STOMP/OpenWire/WSS — no code rewrite.

#### A6. Amazon AppFlow
**What it is:** No-code, fully managed bidirectional data transfer between SaaS apps (Salesforce, Slack, ServiceNow, Zendesk, Marketo, Google Analytics, etc.) and AWS services (S3, Redshift, EventBridge, etc.).

**Key exam features:**
- **Triggers**: on-demand, scheduled, event-driven (e.g., Salesforce CDC)
- Up to 100 GB per flow run; PrivateLink support for Salesforce
- Filtering, validation, transformations, field-level mapping

**Exam tip:** When the prompt mentions SaaS ⇄ AWS data movement with no code, the answer is AppFlow.

### Sub-domain B: Compute & Scaling

#### B1. AWS Lambda
**What it is:** Serverless event-driven compute, pay per request + GB-second.

**Key exam features:**
- **Concurrency**: default 1,000 per region/account (soft limit). **Reserved concurrency** guarantees + caps a function; **Provisioned concurrency** pre-warms environments to eliminate cold starts
- **Lambda SnapStart**: snapshot-based fast startup; Java since 2022, **Python 3.12+ and .NET 8+ added Nov 2024** (paid: caching fee per version + restore fee per invocation, vs free for Java)
- **Limits**: max 15-min execution, 10,240 MB memory (~6 vCPU), 10 GB /tmp ephemeral storage, 10 GB container image, 250 MB zip unzipped, 5 layers, 6 MB sync payload, 256 KB async payload
- **Function URLs**: built-in HTTPS endpoint (AWS_IAM or NONE auth)
- **Container image support** (up to 10 GB) via ECR
- **Event source mappings**: SQS, Kinesis Data Streams, DynamoDB Streams, MSK/Kafka, MQ, DocumentDB
- **Lambda Destinations** (async): route success/failure to SQS/SNS/EventBridge/Lambda
- **Lambda@Edge**: Node.js/Python at CloudFront regional edge caches; 4 trigger types
- VPC integration uses Hyperplane ENIs (no cold-start ENI penalty)

**Exam tip:** Default for event-driven <15 min. Cold-start questions: **SnapStart** (cheaper, Java/Python/.NET) or **Provisioned Concurrency** (always-warm, $). Reserved Concurrency caps (and guarantees a slice), doesn't remove cold starts.

#### B2. Amazon ECS
**What it is:** AWS-native container orchestrator.

**Key exam features:**
- **Launch types**: Fargate (serverless), EC2 (you manage hosts), External (ECS Anywhere)
- **Capacity providers**: FARGATE, **FARGATE_SPOT** (~70% off, 2-min interrupt warning), ASG-based, ECS Managed Instances
- **Service Auto Scaling**: target tracking on CPU/memory/ALB request-count-per-target/custom; step; scheduled
- **Task placement** (EC2 only): strategies = binpack (cost-dense), random, spread (HA); constraints = distinctInstance, memberOf
- **Service Connect (re:Invent 2022)**: built-in service mesh with Envoy sidecar; CloudWatch metrics
- **Network modes** (EC2): awsvpc (default for Fargate, per-task ENI), bridge, host, none

**Exam tip:** Fargate when "no infrastructure to manage" or "serverless containers." EC2 launch type for steady, dense, cost-tuned workloads or GPU/privileged/EBS needs.

#### B3. Amazon EKS
**What it is:** Managed Kubernetes; AWS runs the HA control plane.

**Key exam features:**
- **Compute options**: self-managed nodes, **managed node groups**, **Fargate profiles** (1 pod per microVM, 20 GiB ephemeral default up to 175 GiB, ≤4 vCPU/30 GB per pod, no DaemonSets/privileged/GPUs/hostNetwork/EBS), **EKS Auto Mode** (GA Dec 2024 — managed Karpenter+ALB controller+EBS CSI+VPC CNI+CoreDNS; Bottlerocket nodes auto-replaced every 21 days)
- **Karpenter vs Cluster Autoscaler**: Karpenter is groupless, ~55s scale-up, picks best-fit instance/AZ/Spot per pending pod, consolidation; CA is ASG-based, ~3-4 min, less flexible
- **IAM for pods**: IRSA (OIDC, all K8s) vs **EKS Pod Identity (re:Invent 2023)** — single role reused across clusters, agent-based. Pod Identity not supported on Fargate (use IRSA)

**Exam tip:** EKS = Kubernetes portability. Fargate profiles for no-node-management. Karpenter / EKS Auto Mode for fast, cost-optimal scale-out. Pod Identity preferred over IRSA for new clusters.

#### B4. AWS Fargate
**What it is:** Serverless compute for containers (ECS + EKS), each task/pod in own Firecracker microVM.

**Key exam features:**
- vCPU/memory configs from 0.25 vCPU/0.5 GB up to **16 vCPU/120 GB** per task
- **Ephemeral storage**: ECS Fargate 20 GiB default, up to 200 GiB; EKS Fargate up to 175 GiB
- **Fargate Spot**: ECS only (no EKS), ~70% discount, 2-min SIGTERM warning
- Per-second billing (1-min minimum)
- Linux x86 / ARM (Graviton) / Windows (ECS only)

**Exam tip:** Fargate = no host management, per-task isolation, bursty workloads. EC2 launch type = steady high-density, GPU, Windows Spot, kernel control.

#### B5. Amazon EC2 Auto Scaling
**What it is:** Automatic scaling of EC2 fleets across AZs.

**Key exam features:**
- **Launch templates** (modern, versioned) vs **Launch configurations** — LCs deprecated for new accounts as of **Oct 1, 2024**; new accounts cannot create them at all
- **Dynamic scaling**: target tracking, step, simple, **predictive (ML-based 48-hour forecast from 14-day history)**
- **Warm pools**: pre-initialized stopped/hibernated/running instances for fast scale-out of slow-boot AMIs
- **Instance Refresh**: rolling replacement of all instances for AMI/template updates; auto-rollback; instance maintenance policy
- **Lifecycle hooks**: pause Pending:Wait / Terminating:Wait up to 1 hr for bootstrap/drain
- **Mixed instances policy**: multiple types + On-Demand/Spot/RI; allocation strategies (price-capacity-optimized recommended for Spot); attribute-based instance type selection
- **Capacity Rebalancing**: proactive Spot replacement before interruption
- **Health checks**: EC2, ELB, custom; **health-check grace period**
- **Termination policies**: default, OldestLaunchTemplate, OldestInstance, ClosestToNextInstanceHour, etc.
- Default cooldown 300s (ignored by target tracking); max instance lifetime; suspended processes

**Exam tip:** In any 2024+ scenario, choose launch templates. Predictive scaling for predictable cyclical loads. Warm pools for long-boot AMIs. Capacity Rebalancing + price-capacity-optimized for Spot resilience.

#### B6. AWS Auto Scaling / Application Auto Scaling
**What it is:** Generic scaling API for non-EC2 resources.

**Key exam features:**
- Scalable targets: **ECS services, DynamoDB tables/GSIs, Aurora replicas**, EC2 Spot Fleet, EMR, AppStream 2.0, **Lambda Provisioned Concurrency**, SageMaker endpoints, Comprehend, Keyspaces, MSK, ElastiCache, Neptune, WorkSpaces, custom
- Policies: target tracking (most common), step, scheduled
- **AWS Auto Scaling Plans** unifies scaling across resource types for an application

**Exam tip:** Scaling DynamoDB capacity / Aurora replicas / ECS task count = Application Auto Scaling (not EC2 Auto Scaling). DDB On-Demand and Aurora Serverless v2 self-scale—no need for it.

### Sub-domain C: API Layer

#### C1. Amazon API Gateway
**What it is:** Managed front door for REST, HTTP, and WebSocket APIs.

**Key exam features:**

| Feature | REST API | HTTP API (v2) | WebSocket |
|---|---|---|---|
| Cost | $3.50/M | **$1.00/M (~71% cheaper)** | $1.00/M + conn-min |
| Endpoint types | Edge / Regional / **Private (VPC endpoint)** | Regional only | Regional only |
| Caching | ✅ TTL 0–3600s | ❌ | ❌ |
| Usage plans + API keys | ✅ | ❌ | ✅ |
| Mapping templates (VTL) | ✅ | ❌ | ✅ |
| Request validation | ✅ | ❌ | ❌ |
| Native JWT/OIDC | ❌ (Lambda authorizer) | **✅** | ❌ |
| Cognito User Pool auth | ✅ | via JWT | ✅ |
| WAF | ✅ | ✅ (2025) | ❌ |
| mTLS | ✅ | ✅ | ❌ |
| X-Ray | ✅ | ❌ | ✅ |
| Canary deployments | ✅ | ❌ | ❌ |
| VPC Link | NLB | ALB/NLB/Cloud Map | n/a |

- **Throttling**: account default 10,000 RPS + 5,000 burst per region; stage / per-method / per-client (usage plans, REST only) overrides. Excess = HTTP 429
- **Caching** (REST only): 0.5 GB–237 GB per stage, TTL 0–3600s
- **Integration timeout**: 29s REST, 30s HTTP (hard limits)

**Exam tip:** Default HTTP API for cost + JWT/OIDC. REST for API keys+usage plans (monetization), caching, request validation, mapping templates, private VPC API, canary deploys, WAF+X-Ray.

#### C2. AWS AppSync
**What it is:** Managed GraphQL service with built-in real-time WebSocket subscriptions and offline sync via Amplify DataStore.

**Key exam features:**
- Data sources: DynamoDB, Aurora Serverless (Data API), Lambda, OpenSearch, HTTP, EventBridge, None
- **Resolvers**: VTL or **APPSYNC_JS (JavaScript, 2023+)**, Unit or Pipeline; Direct Lambda Resolvers skip templates
- **Auth modes**: API key, IAM, Cognito User Pools, OIDC, Lambda (mix up to 4)
- **AppSync Events (Oct 2024)**: pure serverless WebSocket pub/sub without GraphQL; channel namespaces; supports WAF; March 2025 added direct WebSocket publishing

**Exam tip:** GraphQL with multiple back-end data sources, real-time subscriptions, offline mobile sync = AppSync. Use AppSync Events for pub/sub WebSockets at scale.

### Sub-domain D: Load Balancing & Edge

#### D1. Application Load Balancer (ALB)
- **Layer 7** (HTTP/HTTPS, gRPC, WebSocket, HTTP/2, HTTP/3)
- Path/host/header/method/source IP/query string routing
- Target groups: EC2, IP, **Lambda**, ALB-as-target (chained), ECS tasks; weighted target groups for canary/blue-green
- Sticky sessions: duration-based (LB cookie `AWSALB`) or app-based (your cookie)
- OIDC + Cognito auth; **JWT verification (Nov 2025)** for client-credentials
- SSL/TLS termination + SNI + mTLS
- **Cross-zone load balancing ON by default and FREE**
- Idle timeout 60s default
- WAF integration; **VPC origin support** for CloudFront (Nov 2024) so ALBs can be private

**Exam tip:** ALB = L7 content routing; cross-zone always on/free; can't give static IP.

#### D2. Network Load Balancer (NLB)
- **Layer 4** (TCP/UDP/TLS)
- **Static IP per AZ** (or EIP/BYOIP); preserves client source IP
- **Required for VPC PrivateLink endpoint services**
- Cross-zone **OFF by default**; enabling incurs inter-AZ data charges
- TCP idle timeout 350s default (60–6000s configurable)
- Target types: instance, IP, **ALB-as-target** (NLB→ALB chain since 2021)

**Exam tip:** NLB for static IPs, UDP, PrivateLink, millions of RPS, source-IP preservation.

#### D3. Gateway Load Balancer (GWLB)
- **GENEVE on port 6081** for 3rd-party virtual appliances (firewalls, IDS/IPS, DPI)
- GWLB endpoints (GWLBE) transparently insert appliance fleet via route tables
- Symmetric flow stickiness

**Exam tip:** Any "3rd-party security appliance / IDS/IPS / transparent inline inspection / bump in the wire" = GWLB.

#### D4. Classic Load Balancer (CLB)
Legacy. New designs always pick ALB/NLB/GWLB. Connection draining (predecessor of "deregistration delay") default 300s.

#### D5. General ELB topics
- **Deregistration delay** default 300s, 0–3600s, target-group attribute (ALB/NLB/GWLB)
- Cross-zone LB: ALB always on/free; NLB/GWLB off by default
- ELB access logs to S3 (ALB/NLB/CLB)
- ACM certs for SSL/TLS

#### D6. Amazon CloudFront
- Global CDN, 600+ POPs, 13 regional edge caches
- Origins: S3 (with **OAC** — replaces legacy OAI; supports SSE-KMS, opt-in regions, POST/PUT), ALB, NLB, EC2, custom HTTP, MediaStore/Package, S3 Object Lambda, Lambda function URLs, **VPC origins (Nov 2024 — private ALBs/NLBs/EC2 without IGW)**
- **Origin failover**: origin groups, fail on configurable 4xx/5xx
- Geo restrictions; signed URLs (single object) vs signed cookies (multiple objects)
- Field-level encryption
- **Custom domain via ACM cert — must be in us-east-1**
- WAF + Shield Standard included
- Real-time logs (Kinesis), standard logs (S3)
- Price classes (All / 200 / 100)
- **CloudFront KeyValueStore (Nov 2023)** — global low-latency KV for Functions; 5 MB store, 1 KB value, 512 B key

**CloudFront Functions vs Lambda@Edge:**

| | CloudFront Functions | Lambda@Edge |
|---|---|---|
| Runs at | 600+ POPs | 13 regional edge caches |
| Language | JavaScript only | Node.js, Python |
| Triggers | viewer-req, viewer-resp | All 4 (viewer + origin) |
| Max exec | <1 ms | 5s viewer / 30s origin |
| Body access | ❌ | ✅ |
| Network calls | ❌ | ✅ |
| Cost | ~$0.10/M | $0.60/M + GB-s |

**Exam tip:** Use CloudFront Functions for cache-key normalization, header manipulation, lightweight URL rewrites at scale. Lambda@Edge for auth with network calls, image manipulation, request-body inspection. OAC > OAI for S3 origins.

#### D7. AWS Global Accelerator
- **2 static anycast IPs** (or BYOIP); Layer 4 (TCP/UDP); **no caching**
- Routes via AWS backbone to endpoint groups (per region), traffic dials (%), endpoint weights
- Health checks for ~30s failover
- Custom routing accelerator (deterministic EC2:port)
- Shield Standard included

**Exam tip:** CloudFront = L7 caching, dynamic IPs. Global Accelerator = L4, no caching, static IPs, fast multi-region failover, UDP/non-HTTP workloads.

### Sub-domain E: Caching

#### E1. Amazon ElastiCache
**Engines:** Redis OSS, Memcached, **Valkey** (open-source Redis fork added 2024 after Redis license change; **~20% cheaper on ElastiCache, ~33% on Serverless**; AWS now recommends Valkey for new deployments).

| | Redis/Valkey | Memcached |
|---|---|---|
| Data structures | Strings, lists, sets, sorted sets, hashes, streams, geo, hyperloglog, pub/sub | Strings only |
| Persistence (RDB+AOF) | ✅ | ❌ |
| Replication / Multi-AZ failover | ✅ | ❌ |
| Encryption at rest (KMS) | ✅ | (limited) |
| Multi-threaded | Mostly single | ✅ |
| Cluster mode (sharding) | ✅ | Auto-discovery |

- **ElastiCache Serverless (Nov 2023)** scales vCPU/storage on demand (ECPUs + GB-hours)
- Cluster mode enabled (sharded) vs disabled (single shard, 1 primary + up to 5 replicas)
- **Caching strategies**: lazy loading (cache-aside, populate on miss), write-through, TTL

**Exam tip:** Redis/Valkey for HA + complex structures + Multi-AZ + persistence. Memcached for simple, multi-threaded, ephemeral. Default to Valkey for cost.

#### E2. Amazon MemoryDB
- **Durable** Valkey/Redis-compatible **primary database** (not just cache)
- Multi-AZ distributed transactional log → 99.99% availability, zero data loss on failover
- Microsecond reads, single-digit ms writes
- Up to 5 replicas per shard; KMS encryption; ACLs
- **MemoryDB for Valkey (2024)** ~30% cheaper than for Redis OSS; supports vector search (GenAI)
- MemoryDB Multi-Region for cross-region active-active

**Exam tip:** MemoryDB replaces "Redis cache + RDS primary" with a single durable in-memory DB. ElastiCache = accelerate an existing DB; MemoryDB = be the DB.

#### E3. Amazon DAX (DynamoDB Accelerator)
- Purpose-built in-memory cache for DynamoDB
- **Microsecond reads** (vs ms for DDB); API-compatible (no app rewrite)
- Item cache (GetItem/BatchGetItem) + Query cache (Query/Scan)
- **Write-through**
- 1 primary + up to 10 replicas per cluster (Multi-AZ)
- Eventually consistent only; bypassed for strongly consistent reads; cluster is region-local (not Global Tables aware)

**Exam tip:** DAX = "DynamoDB cache with no code changes." Wrong answer for write-heavy or strongly-consistent workloads.

### Sub-domain F: Data Layer Scaling

#### F1. Amazon RDS
- Engines: MySQL, MariaDB, PostgreSQL, Oracle, SQL Server, **Db2** (added Oct 2023)
- Storage: **gp3 default**, gp2, io1, io2 Block Express, magnetic; storage autoscaling
- Backups: automated 1–35 days (PITR to any second); manual snapshots indefinite
- Encryption at rest (KMS) must be enabled at creation; snapshot-and-copy-encrypted to add later
- **Read replicas**: up to 15 (MySQL/MariaDB/PG), async, cross-AZ + cross-region, promotable, cascading (MySQL/MariaDB); replicas of replicas allowed
- **RDS Custom** for Oracle/SQL Server with OS-level access
- **RDS Proxy**: connection pooling, **66% faster failover**, preserves app connections, IAM auth + Secrets Manager integration; supports Aurora MySQL/PG, RDS MySQL/MariaDB/PG/SQL Server

**Exam tip:** Read replicas scale reads (async); Multi-AZ is HA. RDS Proxy is the answer for Lambda + RDS connection storms and faster failover.

#### F2. RDS Multi-AZ Single-Instance (Traditional)
- Synchronous replication to **one non-readable standby** in different AZ
- **Failover 60–120 seconds** (DNS CNAME flip + crash recovery)
- All engines supported
- Standby for HA only (not read scaling)

#### F3. RDS Multi-AZ DB Cluster (Nov 2022+)
- **1 writer + 2 readable standbys across 3 AZs**, semi-synchronous (1 of 2 must ack)
- **Failover <35 seconds** typically (no crash recovery)
- Readable standbys serve read traffic via reader endpoint
- **MySQL and PostgreSQL only** (not MariaDB/Oracle/SQL Server)
- Uses local NVMe + EBS

**Exam tip:** Multi-AZ DB Cluster = MySQL/PG only, <35s failover, readable standbys, 2× faster commit. Single-instance Multi-AZ for all other engines or simple HA.

#### F4. Amazon Aurora
- MySQL/PostgreSQL-compatible
- **6 storage copies across 3 AZs** (2 per AZ). Quorum: 4/6 write, 3/6 read. Tolerates loss of 2 copies without losing writes, 3 without losing reads
- Self-healing storage
- 10 GB → 128 TiB autoscaling
- 1 writer + up to 15 Aurora Replicas, ~10–20 ms lag
- Endpoints: writer, reader (load-balanced), custom, instance
- **Automatic failover <30 seconds**
- **Aurora Standard** vs **Aurora I/O-Optimized**: I/O-Optimized has no I/O charges but ~30% higher compute and ~2.25× storage; break-even when I/O > 25% of bill; one-time switch, switch back limited to once per 30 days

#### F5. Aurora Serverless v2
- ACU-based continuous scaling, 0–256 ACUs
- **Scale-to-zero / auto-pause launched Nov 2024**: min ACU = 0; resume ~15s after first connection (deeper sleep after 24h ~30s); blocked by open connections / RDS Proxy / zero-ETL / binlog
- Supported: Aurora PG 13.15+/14.12+/15.7+/16.3+; Aurora MySQL 3.08+
- Mixes serverless and provisioned instances in same cluster
- v1 deprecated for new clusters

**Exam tip:** Aurora Serverless v2 scale-to-zero is the variable workload / dev-test answer. v1 is legacy.

#### F6. Aurora Global Database
- **1 primary region + up to 10 secondary regions (expanded from 5 in 2024/2025)**
- Dedicated replication infrastructure; **<1 second replication latency**; RPO ~1s, RTO <1 min
- Secondary region: up to 16 read-only instances
- **Write forwarding** (MySQL 2.08.1+; PostgreSQL 14.9+/15.4+/16+): writes routed to primary, consistency levels EVENTUAL/SESSION/GLOBAL
- Planned switchover with zero data loss

**Exam tip:** Aurora's best multi-region DR answer. Beats cross-region read replicas on RPO/RTO.

#### F7. Aurora Backtrack
- **Aurora MySQL only** (not PostgreSQL)
- In-place rewind up to **72 hours**; minutes to complete
- Must be enabled at creation (or via snapshot restore)
- Affects entire cluster

**Exam tip:** Backtrack = fast in-place fix for accidental user changes. PITR = new cluster, all Aurora engines, up to 35-day window.

#### F8. Amazon DynamoDB
- NoSQL key-value/document; single-digit ms latency
- Item max **400 KB**; PK required, optional SK
- **GSI**: different PK/SK, eventually consistent, own RCU/WCU, addable any time (up to 20)
- **LSI**: same PK, different SK, strongly consistent option, **must be created at table creation**, max 5, 10 GB item collection size limit
- **Capacity modes**: On-demand (per-request, instant scale) vs Provisioned (RCU/WCU with auto scaling)
  - 1 RCU = 1 strongly consistent read of 4 KB/s or 2 eventually consistent
  - 1 WCU = 1 write of 1 KB/s
  - Transactional = 2× capacity
- **Adaptive capacity** (instant, automatic) handles hot partitions; **burst capacity** = 300s unused
- **Streams** (24h) → Lambda triggers, Global Tables replication
- **Kinesis Data Streams for DynamoDB**: up to 365 days, more consumers
- **PITR**: restore to any second in last 35 days
- On-demand backup retained indefinitely; AWS Backup integration
- TTL deletes have no WCU cost; up to 48h delay

#### F9. DynamoDB Global Tables
- **Multi-region, multi-active**; ~1s replication
- Default mode (MREC) = eventually consistent cross-region, **last-writer-wins** by `aws:rep:updatetime`
- **MRSC (Multi-Region Strong Consistency)** GA June 2025: strongly consistent across regions; requires exactly 3 regions OR 2 regions + 1 witness
- 99.999% availability SLA (vs 99.99% single region)
- Requires DynamoDB Streams (NEW_AND_OLD_IMAGES)

**Exam tip:** Multi-region active-active DDB = Global Tables. Use MRSC when strong cross-region consistency is required; MREC (LWW) for default eventual.

#### F10. Amazon Kinesis Data Streams
- **Provisioned mode**: each shard = 1 MB/s write or 1000 records/s; 2 MB/s read (shared) or 2 MB/s per consumer with EFO
- **On-demand mode**: scales to **10 GB/s write / 20 GB/s read per stream** (raised Nov 2024); throttling possible for >2× recent peak spikes
- **On-demand Advantage mode** (2025): warm throughput pre-provisioned up to 10 GiB/s; ≥60% discount for high-throughput accounts
- **Retention**: 24h default → up to 7 days extended → up to 365 days long-term
- **Enhanced Fan-Out (EFO)**: dedicated 2 MB/s per consumer, sub-200 ms push, 5 EFO consumers per stream
- Ordering guaranteed per shard (per partition key)
- KMS encryption

#### F11. Amazon Data Firehose
- **Renamed from Kinesis Data Firehose Feb 9, 2024** (APIs unchanged)
- Sources: Direct PUT, Kinesis Data Streams, MSK, AWS service logs
- Destinations: S3, Redshift (via S3), OpenSearch, Splunk, **Snowflake (2023)**, **Apache Iceberg (2024)**, S3 Tables, HTTP, Datadog/NewRelic/Dynatrace/MongoDB/Sumo/Elastic
- **Buffer**: 1–128 MB size, 60–900s interval (60s min)
- Optional Lambda transform; JSON → Parquet/ORC conversion; GZIP/Snappy/ZIP
- Dynamic partitioning to S3; CDC preview for MySQL/PG → Iceberg
- Fully managed, serverless, 60s minimum latency = "near-real-time" NOT real-time

#### F12. Amazon Managed Service for Apache Flink
- **Renamed from Kinesis Data Analytics Aug 30, 2023**
- Apache Flink applications (Java/Scala/Python/SQL)
- Studio notebooks (Zeppelin); SQL-only flavor deprecated
- Inputs: KDS, MSK, Firehose

### Sub-domain G: HA / DR / Routing / Storage Resilience / Observability

#### G1. Amazon Route 53 — Routing Policies

| Policy | Description | Health checks | Use case |
|---|---|---|---|
| Simple | Single resource (or random multi-IP without health check) | ❌ | One resource |
| Failover | Primary/secondary active-passive | ✅ required for primary | DR |
| Geolocation | By user continent/country/state | Optional | Localization, compliance |
| Geoproximity | By resource distance + bias (–99 to +99); uses Traffic Flow | Optional | Shift traffic between regions |
| Latency-based | Lowest-latency AWS region (not geography) | Optional | Multi-region performance |
| Multi-Value Answer | Up to 8 **healthy** records, random | ✅ | DNS-based LB with health awareness |
| Weighted | % split (weight 0–255) | Optional | Canary, blue-green |
| IP-Based | Source IP / CIDR (newer) | Optional | ISP-aware optimization |

**Health checks**: endpoint (HTTP/HTTPS/TCP, 30s or 10s, string match in first 5,120 bytes), calculated (up to 256 children with threshold), CloudWatch alarm (for private resources).

**Alias vs CNAME**: Alias = AWS-native, free queries, supports zone apex, AWS targets only, integrates target health. CNAME = paid, not at apex, any target.

**Route 53 Resolver**: inbound endpoints (on-prem → AWS), outbound endpoints (AWS → on-prem); forwarding rules shareable via RAM. **Resolver DNS Firewall** blocks malicious domains; supports AWS-managed lists.

**Public vs private hosted zones**: split-horizon DNS by deploying both with same name.

**DNSSEC** for public hosted zones; **Traffic Flow** visual policy builder.

**Exam tip:** Memorize the 8 policies. Geolocation = user location; Geoproximity = resource location + bias; Latency = lowest measured network latency.

#### G2. Application Recovery Controller (ARC)
- Formerly Route 53 ARC
- **Readiness checks**: continuously audit standby region readiness
- **Routing controls + safety rules**: manual/automated DNS flip with assertion-based safety on a separate HA data plane
- **Region switch (failover plans)**: orchestrate complex multi-region failover
- **Zonal shift / zonal autoshift**: manually (up to 3 days) or automatically (with weekly practice runs) shift traffic away from impaired AZ. Supports **cross-zone ALB, NLB, EC2 Auto Scaling Groups, EKS**

**Exam tip:** Zonal shift/autoshift = AZ-level recovery. Routing controls / Region switch = region-level. Data plane is separate from Route 53 control plane for reliability.

#### G3. S3 Durability, Availability, Storage Classes
- **Durability 99.999999999% (11 9s)** for all storage classes (within their AZs)
- Availability SLA varies

| Class | AZs | Min duration | Latency | Notes |
|---|---|---|---|---|
| Standard | ≥3 | None | ms | Default, 99.99% availability |
| Intelligent-Tiering | ≥3 | None | ms | Auto-tiers; monitoring fee per 1k objects >128 KB; no retrieval fees |
| Standard-IA | ≥3 | 30d | ms | 99.9% avail, retrieval fee, 128 KB min |
| One Zone-IA | **1** | 30d | ms | 99.5% avail, lower cost, **NOT AZ-resilient** |
| Glacier Instant Retrieval | ≥3 | 90d | ms | Ms archive (2021+) |
| Glacier Flexible Retrieval | ≥3 | 90d | min–hr | Expedited 1–5 min, Standard 3–5h, Bulk 5–12h |
| Glacier Deep Archive | ≥3 | 180d | hours | Cheapest; Standard 12h, Bulk 48h |
| Express One Zone (2023+) | **1** | 1h | <10 ms | Directory buckets; up to 2M RPS; for hot co-located data |

#### G4. S3 Replication
- **Versioning required on both** source and destination
- **CRR** (cross-region) and **SRR** (same-region); bidirectional supported
- **S3 RTC**: 99.99% replication within 15 minutes SLA
- **S3 Batch Replication** for pre-existing objects
- **S3 Multi-Region Access Points (MRAP)**: single global anycast endpoint, optional failover routing controls

#### G5. S3 Versioning, MFA Delete, Object Lock
- Versioning: enable, then can only **suspend** (never disable)
- **MFA Delete**: root account + MFA hardware/virtual; CLI only
- **Object Lock** (must be enabled at bucket creation; auto-enables versioning):
  - **Governance** mode: users with `s3:BypassGovernanceRetention` can override
  - **Compliance** mode: **NOBODY** can override or shorten, including root
  - **Legal Hold**: indefinite, independent of retention period

#### G6. AWS Backup
- Centralized backup across EBS, EFS, FSx (all), RDS, Aurora, DynamoDB, **S3**, Storage Gateway, EC2 AMIs, Neptune, DocumentDB, Redshift, Timestream, SAP HANA, VMware (on-prem and cloud), CloudFormation stacks
- **Backup vaults** (KMS encrypted), **backup plans** (schedule + lifecycle to cold)
- **Cross-region copy + cross-account copy** (AWS Organizations integration)
- **Backup Vault Lock**: WORM with Governance or **Compliance mode** (immutable past cooling-off, even AWS cannot delete)
- **Logically air-gapped vaults** + Multi-Party Approval (2025)
- **AWS Backup Audit Manager** for compliance frameworks
- **GuardDuty Malware Protection for Backup** (Nov 2025)
- Backup Gateway for on-prem VMware

**Exam tip:** Default answer for "centralized cross-account, cross-region, compliance-grade backup."

#### G7. EBS Snapshot Lifecycle
- Snapshots are **incremental** but only the latest is needed for restore; stored durably in S3 (managed)
- **Data Lifecycle Manager (DLM)**: free, automated snapshot/AMI lifecycle, cross-region/account copy, archive, pre/post scripts
- **EBS Snapshot Archive**: 75% cheaper, 24–72h restore, 90-day min, converted to full snapshot
- **Fast Snapshot Restore (FSR)**: pre-initialize for first-touch no penalty
- **Recycle Bin** for accidental deletes

#### G8. EBS Multi-Attach
- **io1, io2, io2 Block Express ONLY**
- **Same AZ**, up to **16 Nitro instances**
- Requires cluster-aware filesystem (GFS2, OCFS2, Oracle RAC ASM, Microsoft CSV) — standard XFS/EXT4 corrupts data
- io2 supports NVMe reservations / I/O fencing; io1 does not
- Use case: Oracle RAC, SAP HANA, clustered databases

#### G9. AMI Sharing
- Cross-account via launch permissions or AWS RAM
- Cross-region via AMI copy
- **Encrypted AMIs require customer-managed KMS key share** (default `alias/aws/ebs` cannot be shared)

#### G10. EC2 Placement Groups

| Type | Topology | Limits | Use case |
|---|---|---|---|
| **Cluster** | Same rack, single AZ, low-latency 10 Gbps single-flow | Single AZ; correlated failure risk | HPC, tightly-coupled MPI |
| **Spread** | Each instance on distinct hardware | **Max 7 running per AZ** | Critical instances needing isolation |
| **Partition** | Logical partitions, each on its own rack | **Max 7 partitions per AZ**, hundreds of instances | Cassandra, HDFS, Kafka |

#### G11. EC2 Auto Recovery
- Simplified auto-recovery **default since 2022** for supported instances
- Triggered on **system status check fail** (host issue), not instance/OS issues
- Retains instance ID, private/Elastic IPv4/IPv6, EBS volumes, metadata; loses RAM
- Doesn't work on instance-store-backed, bare metal, Dedicated Hosts

#### G12. FSx HA

| Flavor | Protocols | HA options | Cross-region replication |
|---|---|---|---|
| FSx for Windows File Server | SMB, NTFS, AD | Single-AZ or **Multi-AZ** (sync standby) | AWS Backup, DataSync |
| FSx for Lustre | POSIX, Mountpoint for S3 | **Single-AZ only**; Scratch (ephemeral) or Persistent (durable in-AZ) | Persistent_2 cross-region option |
| FSx for NetApp ONTAP | NFS/SMB/iSCSI | Single-AZ 1/2, **Multi-AZ 1/2** | **SnapMirror** |
| FSx for OpenZFS | NFS | Single-AZ, **Multi-AZ** (newer) | ZFS snapshot replication |

#### G13. AWS Storage Gateway

| Type | Protocol | Backing | Use case |
|---|---|---|---|
| S3 File Gateway | NFS, SMB | S3 (objects in your bucket) | Lift-and-shift file shares |
| FSx File Gateway | SMB | FSx for Windows | On-prem caching for FSx |
| Volume Gateway — Cached | iSCSI | S3 primary + local cache | Cloud primary, hot cache on-prem |
| Volume Gateway — Stored | iSCSI | On-prem primary + S3/EBS snapshots | On-prem primary with cloud backup |
| Tape Gateway | iSCSI VTL | S3 + Glacier/Deep Archive | Replace tape libraries |

#### G14. AWS DR Strategies (HEAVILY TESTED)

| Strategy | RPO | RTO | Cost | In DR region |
|---|---|---|---|---|
| **Backup & Restore** | hours | hours–24h | $ | Nothing—only data backups (snapshots/AMIs/S3 copies); IaC builds infra after disaster |
| **Pilot Light** | minutes | tens of mins | $$ | Data services running (DB replicas, S3 replicated); compute OFF |
| **Warm Standby** | seconds | minutes | $$$ | Scaled-down full stack running; **scale up** on failover |
| **Multi-Site Active/Active** | ~0 | ~0 | $$$$ | Full production capacity in both regions, serving live traffic |

Traffic shifting: Route 53 Failover or Global Accelerator (active/passive); Route 53 latency/weighted/geoproximity (active/active).

#### G15. AWS Elastic Disaster Recovery (DRS)
- Formerly CloudEndure Disaster Recovery
- Block-level continuous replication from any source (physical, VMware/Hyper-V VMs, EC2, other clouds) to AWS staging area
- **RPO seconds, RTO 5–20 minutes**
- PIT recovery for ransomware/corruption; auto OS conversion; non-disruptive drills; failback
- ~$20/month per server
- Doesn't replicate managed databases (RDS)

#### G16. RPO vs RTO
- **RPO** = max acceptable data loss (drives backup/replication frequency)
- **RTO** = max acceptable downtime (drives infra readiness)
- Lower RPO/RTO = higher cost

#### G17. Amazon CloudWatch
- **Metrics**: 15-month retention with rollups; basic 5-min, detailed 1-min, high-res 1-sec
- Memory, disk used, processes require the **CloudWatch Agent** (not in default EC2 metrics)
- **Alarms**: standard, **M-of-N** (flap suppression), **composite** (Boolean over child alarms, noise reduction), **anomaly detection** (ML-based)
- **Logs**: retention **defaults to "Never expire"** (cost trap); 1 day to 10 years configurable; Standard or **Infrequent Access** log class
- **Logs Insights** (pay per GB scanned ~$0.005), **metric filters**, **subscription filters** (Kinesis/Firehose/Lambda), **Live Tail**
- **Dashboards** (first 3 free)
- **Synthetics Canaries**: scripted browser/HTTP probes (Node Puppeteer / Python Selenium / Playwright); blueprints include heartbeat, broken-link, visual monitoring; as frequent as 1/min; max 100 canaries/account in major regions
- **RUM**: real user telemetry from JS/iOS/Android SDK
- **Evidently DEPRECATED Oct 17, 2025** — replaced by **AWS AppConfig** for feature flags
- **Application Signals (2024+)**: AWS-native APM on OpenTelemetry; auto-discovers services; **SLOs/SLIs**, error-budget burn rates, request-based SLOs (Sep 2024), Lambda support (Nov 2024); March 2026 added SLO Recommendations, Service-Level SLOs, SLO Performance Report
- **Container Insights**: cluster/service/task/pod metrics; **Enhanced Observability** ECS GA Dec 2024 + EKS earlier; adds GPU/Trainium/Inferentia/EFA metrics
- **Lambda Insights** for per-function system metrics + cold-start tracking

#### G18. AWS X-Ray
- Distributed tracing; trace ID via `X-Amzn-Trace-Id`
- Default sampling: 1 req/sec + 5% thereafter
- Segments / subsegments / annotations (indexed) / metadata (not indexed) / groups
- Now merged into **CloudWatch X-Ray Trace Map**
- X-Ray SDK in maintenance; **AWS Distro for OpenTelemetry (ADOT)** is recommended path

#### G19. AWS Health Dashboard
- Renamed from Personal Health Dashboard
- AWS Health API requires Business/Enterprise/Enterprise On-Ramp/Unified Ops Support
- Organizational view via AWS Organizations; events retained 90 days; EventBridge integration

#### G20. AWS Fault Injection Service (FIS)
- Renamed from Fault Injection **Simulator**
- Chaos engineering with built-in safety (**stop conditions = CloudWatch alarms**)
- Pre-built **scenarios**: AZ Power Interruption (Nov 2023), Cross-Region Connectivity (Nov 2023), **AZ Application Slowdown** and **Cross-AZ Traffic Slowdown** for gray-failure testing (Nov 2025)
- Actions: stop/terminate EC2, disrupt network, RDS failover, EBS pause IO, ECS task stop, EKS pod stress, SSM-driven OS stress
- **Recovery actions** (2024): integration with ARC zonal autoshift
- DynamoDB Global Tables MRSC replication-pause action (Jan 2026)

#### G21. AWS Resilience Hub
- Define apps from CloudFormation/Terraform/Resource Groups/AppRegistry/myApplications
- **Resilience policies** with **RTO + RPO targets** for 4 disruption types (Application, Infrastructure, AZ, Region)
- Outputs estimated workload RTO/RPO, **resilience score**, recommendations with cost estimates
- Generates SSM SOPs, CloudWatch alarms, and **FIS experiments**
- Continuous compliance drift detection

#### G22. AWS Trusted Advisor
- 6 categories including **Fault Tolerance** + Service Limits/Quotas
- Basic/Developer Support: service limits + small subset
- Business/Enterprise/Unified Ops: ~482 checks total + API + EventBridge + Organizational view + Trusted Advisor Priority (Enterprise only)
- Fault tolerance checks: RDS Multi-AZ, EBS snapshots, ELB cross-AZ, Aurora backtrack, ECS (Apr 2023), Lambda (Sep 2023), ElastiCache Multi-AZ, CloudFront origin failover, etc.

#### G23. AWS Well-Architected Tool
- 6 pillars including **Reliability** (Domain 2) and **Sustainability** (added 2021)
- Lenses: Serverless, SaaS, HPC, ML, IoT, Streaming Media, Games, SAP, Data Analytics, Hybrid Networking, Mgmt & Governance, FTR, **Financial Services (Mar 2024), Connected Mobility, Government, DevOps Guidance, Migration**
- Custom lenses (up to 5)
- Free

---

## 3. RECENT CHANGES (POST-2022)

| Year | Change |
|---|---|
| 2022 Nov | **RDS Multi-AZ DB Cluster** (2 readable standbys, <35s failover) |
| 2022 Nov | **EventBridge Scheduler** (270+ AWS services, millions of schedules) |
| 2022 Nov | **Lambda SnapStart for Java** |
| 2022 Dec | **EventBridge Pipes** (point-to-point with filter+enrichment) |
| 2022 Dec | Step Functions **Distributed Map** (10k concurrent, S3 iteration) |
| 2022 | **Simplified EC2 Auto Recovery** default |
| 2023 May | **Aurora I/O-Optimized** cluster configuration |
| 2023 Aug | **Kinesis Data Analytics → Managed Service for Apache Flink** rename |
| 2023 Oct | **RDS Db2** engine added |
| 2023 Nov | **S3 Express One Zone** (single-AZ, single-digit ms, directory buckets) |
| 2023 Nov | **CloudFront KeyValueStore** |
| 2023 Nov | **ElastiCache Serverless** |
| 2023 Nov | **EKS Pod Identity** |
| 2023 Nov | FIS **scenario library** (AZ Power Interruption, Cross-Region Connectivity) |
| 2023 | **Fault Injection Simulator → Fault Injection Service** rename |
| 2023 | **Personal Health Dashboard → AWS Health Dashboard** rename |
| 2024 Feb | **Kinesis Data Firehose → Amazon Data Firehose** rename |
| 2024 Jun | **CloudWatch Application Signals** GA |
| 2024 Oct | **Lambda SnapStart for Python and .NET** GA |
| 2024 Oct | **ElastiCache Valkey** engine launched (~20% cheaper than Redis OSS) |
| 2024 Oct | **CloudWatch Evidently deprecation announced** (retired Oct 17, 2025) |
| 2024 Oct | **EC2 Auto Scaling Launch Configurations end of support** for new accounts |
| 2024 Nov | **CloudFront VPC origins** (private ALBs/NLBs without IGW) |
| 2024 Nov | **Aurora Serverless v2 scale-to-zero** (min ACU = 0) |
| 2024 Nov | Kinesis Data Streams on-demand → **10 GB/s write, 20 GB/s read** |
| 2024 Dec | **EKS Auto Mode** GA |
| 2024 Dec | **Container Insights Enhanced Observability for ECS** GA |
| 2024 | **Snowmobile** discontinued |
| 2025 May | **Aurora Global Database expands from 5 → 10 secondary regions** |
| 2025 Jun | **DynamoDB Global Tables MRSC** GA (strong consistency, optional Witness Region) |
| 2025 Oct | **CloudWatch Evidently** end-of-support — use **AWS AppConfig** |
| 2025 Nov | FIS **AZ/Cross-AZ Application Slowdown** scenarios (gray-failure testing) |
| 2025 Nov | **Application Load Balancer JWT verification** |
| 2025 Nov | **GuardDuty Malware Protection for AWS Backup** |
| 2026 Jan | FIS action to pause DynamoDB Global Tables MRSC replication |
| 2026 Mar | Application Signals **SLO Recommendations**, **Service-Level SLOs**, **SLO Performance Report** |
| 2026 Apr | Aurora Serverless v2 renamed to "Aurora serverless" |

---

## 4. COMMON EXAM SCENARIOS WITH ANSWER REASONING (28 scenarios)

1. **"Order processing must process messages exactly once in strict order"** → **SQS FIFO** with content-based deduplication and Message Group ID. Standard queues are best-effort order with possible duplicates.

2. **"Send the same event to multiple independent consumers"** → **SNS fan-out → multiple SQS queues**. Each consumer scales independently; messages persist in each SQS queue until consumed.

3. **"Decouple a synchronous monolith from a slow downstream"** → Insert **SQS** queue. The front-end writes to SQS and returns; workers consume asynchronously. This absorbs traffic spikes.

4. **"Route AWS service events to many targets with JSON content-based rules"** → **EventBridge** (not SNS — EventBridge has richer pattern matching across 20+ AWS service targets).

5. **"Schedule a Lambda for 2 AM every Sunday at scale"** → **EventBridge Scheduler** (preferred over scheduled rules; 270+ services, time zones, 10M schedules per account default).

6. **"Move data from SQS into Step Functions with optional filtering — no glue code"** → **EventBridge Pipes**.

7. **"Workflow needs to wait for a human approval before continuing"** → **Step Functions Standard with `.waitForTaskToken`** integration pattern. Pause the workflow; an external API call with `SendTaskSuccess` resumes it.

8. **"Migrate an on-prem JMS/AMQP/MQTT app to AWS without rewriting code"** → **Amazon MQ** (not SQS — preserves protocol compatibility).

9. **"Lowest-cost DR with RPO/RTO of hours"** → **Backup & Restore**. Use AWS Backup for cross-region/cross-account snapshots; restore infrastructure via CloudFormation when needed.

10. **"Near-zero RTO with cost considered"** → **Pilot Light** if data replicated and compute can spin up in ~10s of minutes; **Warm Standby** if scenario emphasizes "scaled-down environment already running" or "immediate reduced-capacity service." Choose Warm Standby when scaling-up speed matters more than cost.

11. **"Multi-region active-active database"** → **DynamoDB Global Tables** (multi-active, LWW or MRSC for strong consistency) or **Aurora Global Database with write forwarding** for relational. DDB is the simpler answer for general use.

12. **"Reliable cross-account, cross-region backups with WORM"** → **AWS Backup with Backup Vault Lock in Compliance mode** + cross-region copy + AWS Organizations integration.

13. **"S3 11 9's of durability — what does it mean?"** → **Durability** = probability data not lost (99.999999999% across storage classes). **Availability** = probability data reachable (varies: Standard 99.99%, Standard-IA 99.9%, One Zone-IA 99.5%, Express One Zone 99.95%). One Zone classes have 11 9's durability **within that AZ** but lose all data if AZ destroyed.

14. **"ALB vs NLB vs GWLB"** → ALB for HTTP/HTTPS path/host routing (cross-zone always on/free). NLB for L4 / static IPs / UDP / PrivateLink endpoint services (cross-zone off by default, incurs data charges). GWLB for transparent 3rd-party appliance insertion via GENEVE on port 6081.

15. **"Need static IPs for non-HTTP workload across multiple regions with fast failover"** → **AWS Global Accelerator** (2 static anycast IPs, L4, no caching, ~30s health-check failover).

16. **"Need global static + dynamic content caching for HTTPS web app"** → **CloudFront** (L7, caching, signed URLs/cookies, OAC for S3, Lambda@Edge or CloudFront Functions).

17. **"Restrict private S3 bucket so only CloudFront can access it"** → Bucket policy + **Origin Access Control (OAC)** — replaces legacy OAI; required for SSE-KMS, opt-in regions, POST/PUT.

18. **"Time-limited paid video access (HLS manifest with many .ts files)"** → **CloudFront signed cookies**. Signed URLs work for single objects, but multiple files demand cookies.

19. **"Sub-millisecond URL rewrite on every viewer request"** → **CloudFront Functions** (JS, <1 ms, 600+ POPs, very low cost). Pair with **KeyValueStore** for feature flags.

20. **"Origin lookup with DynamoDB call to authorize each request"** → **Lambda@Edge** at origin-request (network calls, Node.js/Python).

21. **"Toggle feature flag globally with no redeploy"** → **CloudFront Functions + KeyValueStore**. (Not Evidently — deprecated; use AWS AppConfig for non-edge feature flags.)

22. **"Microsecond reads on DynamoDB without app code changes"** → **DAX** (API-compatible, write-through, in-VPC, eventually consistent only).

23. **"Replace Redis cache + RDS combo with single durable in-memory primary database"** → **MemoryDB** (Redis/Valkey-compatible, Multi-AZ transactional log, 99.99% availability, μs reads / single-digit ms writes).

24. **"Session store that must survive AZ failure, single-digit ms reads"** → **ElastiCache for Redis or Valkey with Multi-AZ + automatic failover** (Memcached has no replication or Multi-AZ).

25. **"Route 53 routing for compliance — block users by country"** → **Geolocation** routing. Geoproximity is for resource-distance with bias dial. Latency is for AWS region performance, not user location.

26. **"Health-check a private RDS or internal NLB"** → **Route 53 CloudWatch alarm health check** (Route 53's public checkers can't reach private resources).

27. **"Validate that our multi-AZ web tier survives an AZ failure"** → **AWS FIS — AZ Availability: Power Interruption scenario** with **stop conditions** tied to CloudWatch alarms for safety.

28. **"Track p99 latency SLO with error-budget burn rate for microservices on EKS"** → **CloudWatch Application Signals** (auto-instrumented APM, SLO definitions, burn-rate alarms).

---

## 5. QUICK-RECALL FLASHCARD FACTS (~40)

1. **SQS Standard max throughput** = nearly unlimited; **Standard message retention** default 4d, max 14d
2. **SQS FIFO max** without high-throughput = 300 msg/s without batching, 3,000 with batching
3. **SQS FIFO high-throughput** = up to 3,000 msg/s per Message Group ID, 30,000+/queue with batching
4. **SQS visibility timeout**: default 30s, max 12 hours; long polling max 20s
5. **SQS max message size** = 256 KB; Extended Client + S3 → up to 2 GB
6. **SQS DLQ** requires `maxReceiveCount` and same type as source
7. **SNS FIFO topics** can ONLY deliver to SQS queues; 100 subscriptions max per FIFO topic
8. **SNS message size** 256 KB; SSE-KMS encryption available
9. **EventBridge Pipes** launched Dec 2022; **EventBridge Scheduler** launched Nov 2022
10. **Step Functions Standard** max execution = 1 year, exactly-once; **Express** max = 5 minutes, at-least-once
11. **Step Functions Distributed Map** = up to 10,000 concurrent child executions (Inline = 40)
12. **Lambda max execution time** = 15 minutes; max memory = 10,240 MB (~6 vCPU); max /tmp = 10 GB
13. **Lambda default concurrency** = 1,000/region/account; container image max 10 GB; zip max 250 MB unzipped
14. **Lambda SnapStart**: Java free; Python/.NET have caching fee + restore fee (Nov 2024 GA)
15. **EC2 Auto Scaling Launch Configurations** — new accounts cannot create them after **Oct 1, 2024**
16. **Application Auto Scaling** scales DynamoDB, ECS services, Aurora replicas, Lambda Provisioned Concurrency, etc.
17. **API Gateway default throttle** = 10,000 RPS + 5,000 burst per region; HTTP API timeout 30s, REST API timeout 29s
18. **API Gateway HTTP API** ~71% cheaper than REST; only REST has caching, API keys+usage plans, mapping templates, request validation, private endpoint
19. **ALB cross-zone LB** = ON by default and free; **NLB cross-zone** = OFF by default (data charges when on)
20. **NLB** = required for VPC PrivateLink endpoint services; static IP per AZ
21. **GWLB** uses GENEVE on port 6081 for 3rd-party appliances
22. **ELB deregistration delay** default = 300s, range 0–3600s
23. **CloudFront ACM cert for custom domain** must be in **us-east-1**
24. **CloudFront Functions** = JS only, <1 ms, 600+ POPs, viewer events only; **Lambda@Edge** = Node/Python, 5s viewer / 30s origin, all 4 events
25. **CloudFront OAC** replaces legacy OAI; supports SSE-KMS, opt-in regions, POST/PUT
26. **Global Accelerator** = 2 static anycast IPs, Layer 4, no caching, ~30s failover
27. **ElastiCache Multi-AZ with auto-failover** = Redis/Valkey only (NOT Memcached); AOF + Multi-AZ mutually exclusive
28. **Valkey** on ElastiCache ~20% cheaper than Redis OSS (~33% on Serverless)
29. **DAX** = microsecond reads for DynamoDB, write-through, eventually consistent only
30. **MemoryDB** = 99.99% availability, durable Multi-AZ transactional log
31. **RDS Multi-AZ single-instance failover** = 60–120 seconds; standby NOT readable
32. **RDS Multi-AZ DB Cluster** = <35s failover, 2 readable standbys, MySQL/PostgreSQL ONLY
33. **RDS Proxy** = up to 66% faster failover; works with MySQL/MariaDB/PG/SQL Server + Aurora
34. **Aurora** = 6 storage copies / 3 AZs; quorum 4/6 write, 3/6 read; <30s automatic failover
35. **Aurora Global Database** = up to **10 secondary regions** (2024/2025 expansion); RPO ~1s, RTO <1 min
36. **Aurora Serverless v2** = 0–256 ACUs; **scale-to-zero** launched Nov 2024
37. **Aurora I/O-Optimized** break-even: when I/O > 25% of total Aurora bill
38. **Aurora Backtrack** = Aurora MySQL ONLY, up to 72 hours, in-place rewind
39. **DynamoDB item max** = 400 KB; **GSI** = eventually consistent, addable anytime; **LSI** = strongly consistent option, max 5, created at table creation only
40. **DynamoDB 1 RCU** = 1 strongly consistent 4 KB read/s (or 2 eventually consistent); **1 WCU** = 1 KB write/s; transactional = 2×
41. **DynamoDB Global Tables** ~1s replication, LWW conflict resolution; **MRSC** GA June 2025 for strong consistency
42. **DynamoDB PITR** = restore to any second in last 35 days; **Streams** retention = 24h; **Kinesis Data Streams for DynamoDB** = up to 365 days
43. **Kinesis Data Streams shard** = 1 MB/s write or 1,000 records/s; 2 MB/s read (shared) or 2 MB/s per consumer with EFO
44. **Kinesis on-demand** scales to 10 GB/s write / 20 GB/s read per stream (Nov 2024)
45. **Kinesis retention** = 24h default, up to 7 days standard, up to 365 days long-term
46. **Amazon Data Firehose** buffer = 1–128 MB or 60–900s (minimum 60s = near-real-time, NOT real-time)
47. **Route 53 routing policies** = 8: Simple, Failover, Geolocation, Geoproximity, Latency, Multi-Value Answer, Weighted, IP-based
48. **Route 53 Multi-Value Answer** = up to 8 healthy records returned (differs from Simple — health-aware)
49. **Alias records** = free queries, can sit at zone apex, AWS targets only
50. **S3 durability** = 99.999999999% (11 9's) all classes; **Availability**: Standard 99.99%, Standard-IA 99.9%, One Zone-IA 99.5%, Express One Zone 99.95%
51. **S3 storage class min durations**: Standard-IA / One Zone-IA = 30d; Glacier IR / Flexible = 90d; Deep Archive = 180d
52. **S3 Glacier retrieval times**: Expedited 1–5 min, Standard 3–5h (Flexible) or 12h (Deep), Bulk 5–12h (Flexible) or 48h (Deep)
53. **S3 Express One Zone** uses Directory Buckets, single AZ, up to 2M RPS, single-digit ms latency
54. **S3 Replication** requires versioning on both source and destination; **S3 RTC** = 99.99% within 15-min SLA
55. **S3 Object Lock Compliance mode** = no override even by root; **Governance mode** = override with `s3:BypassGovernanceRetention`; **Legal Hold** = indefinite
56. **AWS Backup Vault Lock Compliance mode** = once past cooling-off, even AWS cannot delete
57. **EBS Multi-Attach** = io1/io2 only, same AZ, up to 16 Nitro instances, cluster-aware filesystem required
58. **EBS Snapshot Archive** = 75% cheaper, 24–72h restore, 90-day min
59. **EC2 Placement Groups**: Cluster (single AZ, low latency, HPC); Spread (max 7/AZ, isolation); Partition (max 7 partitions/AZ, big data)
60. **EC2 Simplified Auto Recovery** default since 2022 for system status check failures
61. **EFS** classes: Standard, One Zone, Standard-IA, One Zone-IA, **Archive** (~50% cheaper than IA, requires Elastic throughput)
62. **FSx for Lustre** = single-AZ only (Scratch ephemeral or Persistent durable); FSx for Windows/ONTAP/OpenZFS = Multi-AZ option
63. **AWS DRS** RPO = seconds; RTO = 5–20 minutes; doesn't replicate RDS
64. **DR strategies RPO/RTO**: Backup&Restore = hours/hours; Pilot Light = mins/tens of mins; Warm Standby = secs/mins; Multi-Site = ~0/~0
65. **Route 53 health check standard interval** = 30s; **fast** = 10s
66. **Application Recovery Controller zonal shift** up to 3 days; **zonal autoshift** requires weekly practice runs
67. **AWS FIS** safety mechanism = **stop conditions** (CloudWatch alarms)
68. **CloudWatch Logs** default retention = **never expire** (cost trap); configurable 1 day to 10 years
69. **CloudWatch Anomaly Detection** is billed as 3 metrics internally
70. **CloudWatch Evidently DEPRECATED Oct 17, 2025** — use **AWS AppConfig** for feature flags
71. **Application Signals** GA 2024; SLO Recommendations + Service-Level SLOs added March 2026
72. **X-Ray default sampling** = 1 req/sec + 5% thereafter; X-Ray SDK in maintenance — use **AWS Distro for OpenTelemetry (ADOT)**
73. **Well-Architected Framework** = 6 pillars (Sustainability added 2021); Reliability pillar = Domain 2 home
74. **Trusted Advisor** full check set = Business/Enterprise Support; basic tier = service limits only

---

## 6. CONCLUSION / KEY TAKEAWAYS

Domain 2 is the second-largest exam domain (26%) and clusters around two overlapping competencies: **scaling/decoupling** (Task 2.1) and **HA/fault tolerance/DR** (Task 2.2). The biggest exam-relevant shifts since 2022 are: the rise of EventBridge Pipes/Scheduler as preferred integration plumbing; RDS Multi-AZ DB Cluster as the modern HA option for MySQL/PostgreSQL; Aurora Serverless v2 scale-to-zero and Aurora Global Database expanding to 10 regions; DynamoDB Global Tables MRSC for strongly consistent multi-region; the deprecation of Launch Configurations; ElastiCache Valkey replacing Redis OSS as the cost-default; the renames (Firehose, Application Recovery Controller, Health Dashboard, Flink, FIS, DRS); and the new observability stack centered on CloudWatch Application Signals plus AWS Resilience Hub + FIS for chaos engineering. Memorize the failure-time numbers (RDS 60–120s, Multi-AZ Cluster <35s, Aurora <30s), the storage-class minimums (30/90/180-day), the eight Route 53 policies, and the four DR strategies with their RPO/RTO bands — these dominate exam questions. Always favor managed, purpose-built services over self-managed alternatives, and align answers to the language of the question (e.g., "no infrastructure to manage" = Fargate/Lambda; "static IP" = NLB or Global Accelerator; "no code" SaaS sync = AppFlow; "exactly-once order processing" = SQS FIFO).