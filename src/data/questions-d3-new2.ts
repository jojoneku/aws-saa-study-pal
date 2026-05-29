import { Question } from "../lib/types"

export const domain3NewQuestions2: Question[] = [
  // ─── d3-041 ── 3.1 Storage ── DataSync vs Storage Gateway ── difficulty 5 (trap)
  {
    id: "d3-041",
    domain: 3,
    taskStatement: "3.1",
    services: ["datasync", "storage-gateway"],
    constraintType: "migration",
    difficulty: 5,
    type: "single",
    stem: "A solutions architect reviews two migration proposals. Engineer A says: 'AWS DataSync and AWS Storage Gateway both keep on-premises data synchronized with AWS, so we can use either one for our ongoing hybrid file-sharing requirement — our on-premises NFS server must remain the primary access point while data is also accessible from AWS.' Engineer B disagrees and says the two services have fundamentally different purposes. Which statement MOST accurately describes the distinction that makes only ONE service appropriate for the ongoing hybrid requirement?",
    options: [
      {
        id: "A",
        text: "Engineer A is correct — DataSync and Storage Gateway are both designed for ongoing hybrid access. DataSync is preferred because it is 10× faster than Storage Gateway.",
        isCorrect: false,
        explanation: "Wrong — DataSync is a scheduled data migration and synchronization service: it copies data from a source to a destination on a schedule. Once the transfer completes, DataSync's job is done until the next scheduled run. It does NOT present an NFS/SMB mount point to on-premises clients and is NOT designed for ongoing hybrid file access where on-premises remains the primary access point."
      },
      {
        id: "B",
        text: "Engineer B is correct — AWS DataSync is designed for scheduled bulk data migration and sync (one-time or periodic batch transfers); AWS Storage Gateway S3 File Gateway is designed for ongoing hybrid access, presenting an NFS/SMB mount on-premises with S3 as the persistent backend.",
        isCorrect: true,
        explanation: "Correct — DataSync transfers data between storage systems on a schedule (agent-based, 10× faster than rsync, ~$0.0125/GB). It is ideal for one-time migrations and periodic batch syncs but does NOT provide a persistent mount point for ongoing access. Storage Gateway S3 File Gateway presents a live NFS/SMB interface backed by S3 with a local cache — applications continue to use the same mount point indefinitely. For 'on-premises NFS server must remain primary while data is also in AWS,' Storage Gateway is the correct choice."
      },
      {
        id: "C",
        text: "Engineer B is correct — DataSync is for unstructured data; Storage Gateway is for structured database data. Neither works for NFS file sharing.",
        isCorrect: false,
        explanation: "Wrong — Both DataSync and Storage Gateway handle unstructured file data. DataSync supports NFS, SMB, HDFS, S3, EFS, and FSx as sources and destinations. Storage Gateway S3 File Gateway presents NFS and SMB interfaces. The distinction is migration vs ongoing hybrid access, not data structure type."
      },
      {
        id: "D",
        text: "Engineer A is correct because AWS Transfer Family provides SFTP/FTPS access to S3, meaning DataSync and Storage Gateway serve the same hybrid NFS purpose.",
        isCorrect: false,
        explanation: "Wrong — AWS Transfer Family provides managed SFTP/FTPS/FTP/AS2 server access to S3 or EFS for file transfer clients using those protocols. It is a separate service from both DataSync and Storage Gateway. DataSync vs Storage Gateway still has the fundamental distinction: scheduled transfer vs ongoing hybrid mount."
      }
    ],
    explanation: "The DataSync vs Storage Gateway distinction is a top-5 exam trap in Domain 3: DataSync = scheduled bulk migration or sync ($0.0125/GB, agent-based, NFS/SMB/HDFS/S3 sources, 10× faster than rsync). Storage Gateway = ongoing hybrid access (File Gateway presents NFS/SMB mount backed by S3 + local cache; Volume Gateway presents iSCSI; Tape Gateway presents VTL). Use DataSync when you want to MOVE data. Use Storage Gateway when you want to CONTINUE using on-premises protocols while data lives in AWS.",
    keywords: ["DataSync scheduled transfer", "Storage Gateway ongoing hybrid", "NFS mount", "migration vs hybrid access", "not interchangeable"]
  },

  // ─── d3-042 ── 3.1 Storage ── AWS Transfer Family ── difficulty 3 ───────────
  {
    id: "d3-042",
    domain: 3,
    taskStatement: "3.1",
    services: ["transfer-family", "s3"],
    constraintType: "migration",
    difficulty: 2,
    type: "single",
    stem: "A retail company exchanges purchase order files daily with 50 external suppliers using SFTP. The company currently runs an on-premises SFTP server. The security team requires that files land directly in Amazon S3 (not on EC2 instances), that user authentication integrates with the existing AWS Secrets Manager stored credentials, and that the SFTP endpoint IP address remains stable for supplier firewall rules. Which fully managed AWS solution satisfies all requirements with MINIMUM operational overhead?",
    options: [
      {
        id: "A",
        text: "Deploy an EC2 instance running OpenSSH and configure an S3 FUSE mount for the landing directory.",
        isCorrect: false,
        explanation: "Wrong — An EC2-based SFTP server requires patching, maintenance, and HA configuration. S3 FUSE mounts have performance limitations for SFTP workloads and are not supported architectures for production use. This adds significant operational overhead vs a fully managed solution."
      },
      {
        id: "B",
        text: "Use AWS DataSync with an SFTP connector to pull files from external suppliers on a schedule.",
        isCorrect: false,
        explanation: "Wrong — AWS DataSync SFTP connector can pull files FROM an external SFTP server into S3, but it does not provide a hosted SFTP server endpoint that external parties connect TO. Suppliers need to connect to YOUR SFTP endpoint to push files — DataSync cannot serve as the server-side SFTP listener."
      },
      {
        id: "C",
        text: "Use AWS Transfer Family with an SFTP server endpoint backed by Amazon S3, authenticating users via a custom identity provider using AWS Secrets Manager.",
        isCorrect: true,
        explanation: "Correct — AWS Transfer Family provides a fully managed SFTP/FTPS/FTP/AS2 server that stores files directly in Amazon S3 or EFS. No EC2 management required. Elastic IPs can be assigned to the endpoint for stable IPs. Authentication supports Service-managed users, Active Directory via Route 53, or a custom identity provider (Lambda-based) reading from Secrets Manager. Files are stored as native S3 objects with full S3 features (versioning, lifecycle, replication)."
      },
      {
        id: "D",
        text: "Create an S3 presigned URL generator that suppliers call via HTTPS to upload files directly to S3.",
        isCorrect: false,
        explanation: "Wrong — S3 presigned URLs allow unauthenticated clients to upload objects via HTTPS PUT requests. This is not SFTP — suppliers would need to change from their existing SFTP clients to HTTPS upload tooling. The requirement is to maintain SFTP compatibility for existing supplier workflows."
      }
    ],
    explanation: "AWS Transfer Family is the managed SFTP/FTPS/FTP/AS2 solution that fronts S3 or EFS. Key capabilities: Elastic IP (stable IP for firewalls), custom identity provider via Lambda+Secrets Manager, no server management, native S3 object storage. Transfer Family is the exam answer for 'managed SFTP to S3.' Compare: DataSync = pull data from external SFTP (migration); Transfer Family = BE the SFTP server (ongoing partner integration). Protocols supported: SFTP (SSH), FTPS (TLS), FTP (plaintext, discouraged), AS2 (EDI).",
    keywords: ["Transfer Family", "SFTP managed", "S3 backend", "Secrets Manager auth", "stable IP"]
  },

  // ─── d3-043 ── 3.2 Compute ── AppStream 2.0 vs WorkSpaces ── difficulty 3 ────
  {
    id: "d3-043",
    domain: 3,
    taskStatement: "3.2",
    services: ["appstream", "workspaces"],
    constraintType: "performance",
    difficulty: 2,
    type: "single",
    stem: "A pharmaceutical company needs to provide desktop computing capabilities to two user groups: Group A — 200 lab researchers who each need a FULL Windows desktop environment with persistent profiles, personal file storage, and the ability to install software, all accessible from thin clients. Group B — 500 contract workers who need to run a single proprietary analysis application for 4-hour sessions with no need for a persistent desktop or home directory. Which combination of services BEST matches each group's requirements?",
    options: [
      {
        id: "A",
        text: "Group A: Amazon AppStream 2.0; Group B: Amazon WorkSpaces",
        isCorrect: false,
        explanation: "Wrong — AppStream 2.0 streams individual applications (not full desktops) and does not provide persistent user desktops or personal file storage for Group A. WorkSpaces provides full persistent VDI desktops but is over-provisioned for Group B (contract workers who need only one application for short sessions and don't need persistent desktops)."
      },
      {
        id: "B",
        text: "Group A: Amazon WorkSpaces; Group B: Amazon AppStream 2.0",
        isCorrect: true,
        explanation: "Correct — Amazon WorkSpaces provides full Windows or Linux virtual desktops (VDI) with persistent user profiles, personal D: drive storage, and user-installable software — ideal for Group A researchers who need a complete desktop experience. Amazon AppStream 2.0 streams specific applications (not full desktops) to users in browser sessions with no persistent state — ideal for Group B contract workers who need a single app for limited sessions, paying only for usage time."
      },
      {
        id: "C",
        text: "Group A: Amazon WorkSpaces Personal; Group B: Amazon WorkSpaces Thin Client",
        isCorrect: false,
        explanation: "Wrong — Amazon WorkSpaces Thin Client is a physical device that connects to WorkSpaces — it is hardware, not a software service for deploying desktops to Group B. Group B's requirement (single app, non-persistent, 4-hour sessions) maps directly to AppStream 2.0, not another WorkSpaces variant."
      },
      {
        id: "D",
        text: "Group A: EC2 Windows instances with Remote Desktop; Group B: Amazon AppStream 2.0",
        isCorrect: false,
        explanation: "Wrong — EC2 Windows instances with RDP can serve as virtual desktops, but managing hundreds of individual EC2 instances for user desktops (patching, AMI management, storage, identity, user profiles) adds massive operational overhead. Amazon WorkSpaces is the purpose-built managed VDI solution with persistent profiles and home directories."
      }
    ],
    explanation: "AppStream 2.0 vs WorkSpaces is a classic exam differentiation: WorkSpaces = full persistent Windows/Linux VDI desktop (user has a 'computer in the cloud' with persistent profile, home drive, can install software). AppStream 2.0 = application streaming (one or more specific apps delivered in a browser session, non-persistent by default, pay per hour of streaming). Decision: full desktop experience with persistence → WorkSpaces; specific application access for temporary/contractor users → AppStream 2.0.",
    keywords: ["WorkSpaces full VDI", "AppStream application streaming", "persistent desktop", "non-persistent sessions", "contractor access"]
  },

  // ─── d3-044 ── 3.1 Storage ── EC2 instance store vs EBS ── difficulty 4 ──────
  {
    id: "d3-044",
    domain: 3,
    taskStatement: "3.1",
    services: ["ec2", "ebs"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A data processing service runs on Amazon EC2 i4i.4xlarge instances, which include local NVMe instance store volumes. The pipeline writes large intermediate shuffle data during Spark jobs (several TB per job) that is only needed during job execution, and must achieve the HIGHEST possible shuffle write throughput. A separate requirement is that the Spark job checkpoint data (used for fault recovery and can be regenerated if lost, but impacts performance to regenerate) must survive instance stop/start. Which storage strategy correctly assigns each type of data?",
    options: [
      {
        id: "A",
        text: "Write both shuffle data and checkpoint data to Amazon EBS io2 volumes for maximum I/O performance and persistence.",
        isCorrect: false,
        explanation: "Wrong — EBS io2 Block Express provides up to 256,000 IOPS but is a network-attached volume with higher latency than local NVMe. Instance store NVMe on i4i instances delivers lower latency and higher sequential write throughput for large ephemeral workloads. Writing ephemeral shuffle data to expensive io2 volumes wastes money on persistence that is not needed."
      },
      {
        id: "B",
        text: "Write shuffle data to instance store NVMe (highest throughput, ephemeral OK); write checkpoint data to Amazon EBS gp3 (persists across stop/start).",
        isCorrect: true,
        explanation: "Correct — EC2 instance store NVMe delivers the lowest latency and highest sequential write throughput because it is physically attached to the host server (no network hop). Shuffle data is ephemeral and can be discarded when the job ends, making instance store ideal. Checkpoint data must survive instance stop/start, so an EBS volume (gp3 or io2) is required — EBS persists independently of the EC2 instance lifecycle."
      },
      {
        id: "C",
        text: "Write both shuffle and checkpoint data to instance store NVMe for maximum throughput, then sync checkpoint data to S3 every 10 minutes.",
        isCorrect: false,
        explanation: "Wrong — Instance store data is lost on instance stop, termination, or hardware failure. While periodic S3 sync provides some protection, there is an up-to-10-minute recovery gap. The question requires checkpoint data to 'survive instance stop/start' — only EBS guarantees persistence across stop/start. Syncing to S3 is an approximation, not a guarantee."
      },
      {
        id: "D",
        text: "Write shuffle data to Amazon EFS (shared across Spark executors); write checkpoint data to instance store.",
        isCorrect: false,
        explanation: "Wrong — Reverse assignment. EFS provides shared NFS access but with higher per-operation latency than local NVMe — not the highest throughput for shuffle. Checkpoint data on instance store will be lost on stop/terminate, which violates the persistence requirement."
      }
    ],
    explanation: "Instance store vs EBS decision for Spark/HPC: Instance store NVMe (i-family instances): lowest latency, highest throughput (locally attached NVMe, no network), but EPHEMERAL — lost on stop/terminate/hardware failure. EBS: persistent (survives stop/start, separate lifecycle from instance), network-attached (slightly higher latency than NVMe). Pattern: ephemeral scratch/shuffle → instance store; anything that needs to survive stop/start → EBS. Note: instance store data IS preserved across instance REBOOT (not stop or terminate).",
    keywords: ["instance store ephemeral", "EBS persistent", "NVMe local", "shuffle data", "checkpoint survives stop"]
  },

  // ─── d3-045 ── 3.1 Storage ── EBS snapshots cross-region ── difficulty 3 ─────
  {
    id: "d3-045",
    domain: 3,
    taskStatement: "3.1",
    services: ["ebs", "s3"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A company runs production workloads on Amazon EC2 with Amazon EBS volumes in us-east-1. The disaster recovery plan requires that EBS snapshots be available in ap-southeast-1 within 1 hour of creation, and that an AWS account belonging to a DR partner company (separate AWS account) can launch EC2 instances from those snapshots without receiving a copy. The solutions architect must ALSO minimize snapshot storage costs by leveraging incremental snapshots. Which approach satisfies all requirements?",
    options: [
      {
        id: "A",
        text: "Copy the full EBS volume to an S3 bucket in ap-southeast-1 every hour and share the bucket with the DR partner account.",
        isCorrect: false,
        explanation: "Wrong — Copying the full EBS volume to S3 is not a native snapshot operation and does not produce an EBS snapshot that can be used to launch EC2 instances in ap-southeast-1. The DR partner needs an EBS snapshot, not an S3 object. Full volume copies also do not benefit from incremental deduplication."
      },
      {
        id: "B",
        text: "Create EBS snapshots in us-east-1, copy them to ap-southeast-1 using snapshot copy (which is incremental), and share the snapshots in ap-southeast-1 with the DR partner's AWS account ID.",
        isCorrect: true,
        explanation: "Correct — EBS snapshot copy across regions is incremental: only changed blocks since the last copy are transferred (when copying in a chain). Cross-region snapshot copies are stored in S3 in the destination region. Snapshots can be shared with specific AWS account IDs or made public using ModifySnapshotAttribute. The DR partner can launch EC2 instances from shared snapshots without a separate copy."
      },
      {
        id: "C",
        text: "Enable EBS Multi-Attach on all production volumes so the DR partner account can mount them in ap-southeast-1.",
        isCorrect: false,
        explanation: "Wrong — EBS Multi-Attach allows up to 16 Nitro instances in the SAME Availability Zone to attach the same io1/io2 volume. It does not enable cross-region or cross-account volume access. EBS volumes are regional resources and cannot be attached from a different region."
      },
      {
        id: "D",
        text: "Use Amazon Data Lifecycle Manager (DLM) to create snapshots and copy them to ap-southeast-1. Share the snapshots via an S3 bucket policy in ap-southeast-1.",
        isCorrect: false,
        explanation: "Wrong — Amazon DLM can automate snapshot creation and cross-region copy, which is a valid management layer. However, snapshots are not shared via S3 bucket policies — EBS snapshots are shared using ModifySnapshotAttribute (grant permission to specific account IDs). Bucket policies apply to S3 objects, not EBS snapshots."
      }
    ],
    explanation: "EBS snapshot key facts: (1) Incremental — only changed blocks stored since last snapshot (saves cost). (2) Cross-region copy is also incremental when done in a chain. (3) Shared with specific AWS accounts using ModifySnapshotAttribute or shared publicly. (4) Shared snapshots can be used to launch instances without the recipient copying them first. (5) Amazon DLM or AWS Backup can automate cross-region snapshot policies. The question covers all three: incremental, cross-region, and cross-account sharing.",
    keywords: ["EBS snapshot incremental", "cross-region copy", "cross-account sharing", "ModifySnapshotAttribute", "DR"]
  },

  // ─── d3-046 ── 3.4 Network ── CloudFront Functions vs Lambda@Edge ── diff 5 (trap)
  {
    id: "d3-046",
    domain: 3,
    taskStatement: "3.4",
    services: ["cloudfront"],
    constraintType: "performance",
    difficulty: 5,
    type: "single",
    stem: "A CDN engineering team needs two separate CloudFront customizations: (P) a URL rewrite that converts `/old-path/*` to `/new-path/*` on every viewer request, running at the LOWEST possible latency with NO external service calls required; and (Q) an origin request function that fetches user preferences from an external API and adds a custom header before forwarding the request to the origin, requiring up to 5 seconds of execution time and the ability to make network calls. Which combination is CORRECT?",
    options: [
      {
        id: "A",
        text: "P: Lambda@Edge viewer-request trigger; Q: CloudFront Functions origin-request trigger",
        isCorrect: false,
        explanation: "Wrong — CloudFront Functions support ONLY viewer-request and viewer-response triggers. There is no origin-request trigger for CloudFront Functions. Also, CloudFront Functions cannot make network calls, so they cannot fetch from an external API. Lambda@Edge is required for Q."
      },
      {
        id: "B",
        text: "P: CloudFront Functions viewer-request trigger; Q: Lambda@Edge origin-request trigger",
        isCorrect: true,
        explanation: "Correct — CloudFront Functions run at edge PoPs (600+ locations), execute in <1 ms with 10 KB code size and 2 MB memory, support only viewer-request and viewer-response triggers, and CANNOT make network calls. URL rewrites require no network calls and complete in microseconds — perfect for CloudFront Functions. Lambda@Edge supports all 4 triggers including origin-request, can execute up to 30 seconds on origin triggers, can make network calls, and runs at ~13 Regional Edge Cache locations. Fetching from an external API requires Lambda@Edge."
      },
      {
        id: "C",
        text: "P: CloudFront Functions viewer-request trigger; Q: CloudFront Functions origin-request trigger",
        isCorrect: false,
        explanation: "Wrong — CloudFront Functions do NOT have an origin-request trigger. Only Lambda@Edge supports origin-request and origin-response triggers. CloudFront Functions are limited to viewer-request and viewer-response only."
      },
      {
        id: "D",
        text: "P: Lambda@Edge viewer-request trigger; Q: Lambda@Edge origin-request trigger; CloudFront Functions are not applicable because Lambda@Edge is always preferred for lower latency.",
        isCorrect: false,
        explanation: "Wrong — CloudFront Functions run at edge PoPs (<1 ms, $0.10/M invocations), which is faster and cheaper than Lambda@Edge for simple logic requiring no network calls. Lambda@Edge runs at ~13 Regional Edge Cache locations (fewer than edge PoPs), has higher per-invocation cost ($0.60/M), and has ~ms initialization overhead. For a simple URL rewrite, CloudFront Functions are strictly better. Lambda@Edge is needed only when you need network calls, longer timeout, or origin triggers."
      }
    ],
    explanation: "CloudFront Functions vs Lambda@Edge is a high-frequency exam trap. CloudFront Functions: edge PoPs (600+, closest to viewers), <1 ms timeout, 10 KB code, 2 MB memory, viewer-request/response ONLY, NO network calls, $0.10/M. Lambda@Edge: Regional Edge Caches (~13 locations), 5 s (viewer) / 30 s (origin) timeout, 1 MB/10 MB code, all 4 triggers, CAN make network calls, $0.60/M. Decision: simple header/URL manipulation → CloudFront Functions. Network calls, longer execution, origin triggers → Lambda@Edge.",
    keywords: ["CloudFront Functions no network calls", "Lambda@Edge origin-request", "viewer-request only", "edge PoP vs regional edge", "<1ms vs 30s"]
  },

  // ─── d3-047 ── 3.4 Network ── API Gateway caching ── difficulty 3 ───────────
  {
    id: "d3-047",
    domain: 3,
    taskStatement: "3.4",
    services: ["api-gateway", "lambda"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A REST API built on Amazon API Gateway and AWS Lambda returns product catalog data that changes at most once per hour. The API receives 50,000 requests per minute, and each Lambda invocation takes 200 ms. The team wants to ELIMINATE redundant Lambda invocations for identical requests while allowing clients to force a fresh response when needed. Which API Gateway feature achieves this with MINIMUM code changes?",
    options: [
      {
        id: "A",
        text: "Enable API Gateway stage-level caching with a TTL of 3,600 seconds, and allow clients to invalidate cache entries using the Cache-Control: max-age=0 header.",
        isCorrect: true,
        explanation: "Correct — API Gateway caching is configured per stage. With caching enabled, the API Gateway serves cached responses for identical requests (matching cache key: method + path + configured headers/query strings), completely bypassing Lambda invocations. TTL default is 300 seconds (max 3,600 seconds). Clients can send Cache-Control: max-age=0 (with the execute-api:InvalidateCache IAM permission) to bypass the cache and force a fresh response. This eliminates redundant Lambda calls with no application code changes."
      },
      {
        id: "B",
        text: "Configure an Amazon ElastiCache Redis cluster and add caching logic inside each Lambda function.",
        isCorrect: false,
        explanation: "Wrong — Adding ElastiCache caching inside Lambda requires code changes in every Lambda function (add cache check, handle cache miss, write to cache on miss). This adds complexity and still invokes Lambda for cache misses. API Gateway-level caching eliminates Lambda invocations entirely for cached requests without any code changes."
      },
      {
        id: "C",
        text: "Place an Amazon CloudFront distribution in front of API Gateway with a cache TTL matching the update frequency.",
        isCorrect: false,
        explanation: "Wrong — CloudFront can cache API responses, but it requires configuring cache behaviors, cache policies, and managing CloudFront invalidations. More importantly, API Gateway stage caching is the purpose-built solution that natively handles the Cache-Control invalidation pattern. CloudFront adds an additional layer of complexity for an API already served through API Gateway."
      },
      {
        id: "D",
        text: "Use API Gateway throttling to limit requests to 1 per second, reducing Lambda invocations.",
        isCorrect: false,
        explanation: "Wrong — API Gateway throttling limits the rate of requests but does NOT return cached responses — throttled requests receive 429 TooManyRequests errors. This would degrade client experience, not serve cached product catalog data to all 50,000 requests per minute."
      }
    ],
    explanation: "API Gateway caching is configured at the stage level (not method level individually, though per-method overrides exist). Key facts: TTL default 300 s, max 3,600 s; minimum capacity 0.5 GB to 237 GB; cache is per API stage; cache key includes method + path + configurable headers/query params; Cache-Control: max-age=0 forces bypass (requires execute-api:InvalidateCache permission). Cache hit = no Lambda invocation, instant response from API GW. This is the exam answer for 'eliminate Lambda calls for repeated identical API requests.'",
    keywords: ["API Gateway caching", "TTL 3600", "Cache-Control max-age=0", "eliminate Lambda invocations", "stage-level cache"]
  },

  // ─── d3-048 ── 3.3 Database ── ElastiCache lazy loading vs write-through ── diff 4
  {
    id: "d3-048",
    domain: 3,
    taskStatement: "3.3",
    services: ["elasticache-redis", "rds"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A social media platform uses Amazon ElastiCache for Redis in front of an Amazon RDS PostgreSQL database. Two engineers debate caching strategies: Engineer A proposes lazy loading (cache-aside) — only read data on a cache miss and populate the cache from the database. Engineer B proposes write-through — update both the cache and the database on every write. The platform has a read:write ratio of approximately 95:5, the data changes frequently, and stale profile data shown to users for up to 60 seconds is acceptable. Which strategy minimizes database load while avoiding unnecessary cache pollution?",
    options: [
      {
        id: "A",
        text: "Write-through only — all writes go to both cache and database, ensuring the cache is always fresh.",
        isCorrect: false,
        explanation: "Wrong — Write-through caches every written item regardless of whether it will ever be read. With a 95:5 read:write ratio, write-through caches data that is frequently written but rarely queried, wasting cache memory. It also slows write operations (write to cache + DB). For a social platform with high write volume and frequently changing data, write-through without TTL pollutes the cache."
      },
      {
        id: "B",
        text: "Lazy loading (cache-aside) with a TTL of 60 seconds — cache misses fetch from RDS and populate the cache; stale data expires within 60 seconds; only frequently READ data occupies cache memory.",
        isCorrect: true,
        explanation: "Correct — Lazy loading ensures only data that is actually requested occupies cache space (no pollution from write-only data). A 60-second TTL caps staleness within the acceptable limit. For a 95:5 read:write ratio, the vast majority of requests hit cache after initial population. The cache miss penalty (extra round-trip to RDS) only occurs on first access and after TTL expiry. Stale data tolerance of 60 seconds makes lazy loading with TTL the cost-effective, low-DB-load choice."
      },
      {
        id: "C",
        text: "Write-behind (write-back) — writes go to cache first, then asynchronously to the database, minimizing database write load.",
        isCorrect: false,
        explanation: "Wrong — Write-behind reduces database write load but introduces durability risk: if the cache node fails before async write to RDS completes, data is lost. This pattern is only appropriate for workloads that can tolerate some data loss (use Amazon MemoryDB for durable in-cache writes). A social media platform's profile data warrants synchronous database writes."
      },
      {
        id: "D",
        text: "Lazy loading without a TTL — cached data is never expired and only evicted by LRU policy when the cache is full.",
        isCorrect: false,
        explanation: "Wrong — Without a TTL, cached data never refreshes unless explicitly invalidated by the application on every write. If the application doesn't implement cache invalidation on writes, users will see indefinitely stale data. The question states stale data is acceptable for UP TO 60 seconds — meaning beyond 60 seconds it is NOT acceptable, requiring a TTL."
      }
    ],
    explanation: "ElastiCache caching strategy selection for exam: Lazy loading (cache-aside) = miss → DB → populate; only requested data cached; stale risk (TTL fixes this); cache miss adds latency. Write-through = every write to cache+DB; always fresh; wastes cache on write-heavy or write-only data. Write-back = write cache only, async DB; fastest writes; durability risk (use MemoryDB for durable). TTL + jitter prevents thundering herd (synchronized expiry). For read-heavy workloads with acceptable staleness, lazy loading + TTL is the standard exam answer.",
    keywords: ["lazy loading", "write-through", "TTL", "cache pollution", "stale data acceptable", "read-heavy"]
  },

  // ─── d3-049 ── 3.5 Data ── OpenSearch UltraWarm vs Cold storage ── diff 3 ────
  {
    id: "d3-049",
    domain: 3,
    taskStatement: "3.5",
    services: ["opensearch"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A security operations team uses Amazon OpenSearch Service to store security event logs. Logs from the last 7 days require fast interactive queries (sub-second). Logs from 8–90 days ago need to be queryable but query latency of up to 5 seconds is acceptable. Logs older than 90 days must be retained for compliance (minimum 2 years) but are almost never queried — when they are queried, it is acceptable to wait minutes for them to be accessible. The team wants to MINIMIZE storage costs. Which storage tier configuration achieves this?",
    options: [
      {
        id: "A",
        text: "Store all data on hot data nodes; use provisioned IOPS to reduce query latency.",
        isCorrect: false,
        explanation: "Wrong — Storing 2 years of logs on hot data nodes (SSD/EBS-backed) is extremely expensive and provides no cost benefit for 8–730 day-old data that is rarely queried. OpenSearch Service has purpose-built cost-efficient tiers for older data."
      },
      {
        id: "B",
        text: "Hot tier for 0–7 days; UltraWarm tier for 8–90 days; Cold storage for 90 days–2 years. Use Index State Management (ISM) to automate transitions.",
        isCorrect: true,
        explanation: "Correct — Amazon OpenSearch Service storage tiers: Hot = data node SSD/EBS (sub-second queries, highest cost). UltraWarm = S3-backed queryable tier (~90% cheaper than hot, up to 5-second query latency, no data node requirement for warm data). Cold storage = S3-only, no attached compute, cheapest, requires attaching before query (minutes delay). ISM policies automate hot→UltraWarm→cold→delete transitions by age. This maps exactly to the query latency requirements."
      },
      {
        id: "C",
        text: "Hot tier for 0–7 days; snapshot to S3 for 8–90 days; delete everything older than 90 days.",
        isCorrect: false,
        explanation: "Wrong — S3 snapshots are backups — they cannot be queried in place. Restoring a snapshot from S3 takes significant time and creates a new index on the cluster. UltraWarm is queryable directly without snapshot restore, which satisfies the 5-second query latency requirement for 8–90 day data."
      },
      {
        id: "D",
        text: "UltraWarm for all data; use WLM query priority to give recent queries faster resources.",
        isCorrect: false,
        explanation: "Wrong — UltraWarm provides acceptable 8–90 day query latency but is NOT optimal for the 0–7 day interactive sub-second requirement (UltraWarm can have 1–5 second latency). The hot tier is needed for sub-second performance on recent logs. UltraWarm is also more expensive than Cold storage for archival data."
      }
    ],
    explanation: "OpenSearch Service storage tiers: Hot (data nodes SSD/EBS) = sub-second, most expensive. UltraWarm (S3-backed) = queryable, ~90% cheaper than hot, 1–5 s typical latency. Cold (S3-only) = no query capability until attached, cheapest, minutes to make queryable. Index State Management (ISM) automates age-based transitions. This three-tier pattern (hot/warm/cold) directly maps to the exam scenario of recent interactive + historical searchable + compliance archive.",
    keywords: ["UltraWarm 90% cheaper", "Cold storage no compute", "ISM transitions", "hot 7 days", "sub-second hot", "5 second UltraWarm"]
  },

  // ─── d3-050 ── 3.5 Data ── Redshift RA3 vs Spectrum ── difficulty 4 ───────────
  {
    id: "d3-050",
    domain: 3,
    taskStatement: "3.5",
    services: ["redshift", "s3"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A data warehouse team runs Amazon Redshift with dc2.large nodes. The cluster holds 10 TB of frequently queried data. An additional 200 TB of historical data sits in Amazon S3 in Parquet format that is queried ONLY for ad-hoc year-over-year comparisons (approximately 5 times per month). The team wants to query the historical S3 data using SQL from Redshift WITHOUT loading it into the cluster. They also need to separate compute scaling from storage capacity for the frequently queried data. Which Redshift features address BOTH requirements?",
    options: [
      {
        id: "A",
        text: "Migrate to Redshift RA3 nodes (decoupled compute and managed storage) for the 10 TB dataset; use Redshift Spectrum to query the 200 TB historical S3 data in place.",
        isCorrect: true,
        explanation: "Correct — RA3 nodes use managed storage (RMS) that separates compute from storage. Data beyond the local SSD cache automatically tiers to S3-backed managed storage — you scale compute and storage independently. DC2 nodes couple compute and storage tightly (can't scale one without the other). Redshift Spectrum enables SQL queries against external tables in S3 (Parquet, ORC, CSV, JSON) directly from Redshift without loading the data into the cluster. Bills per TB scanned, like Athena."
      },
      {
        id: "B",
        text: "Use Redshift Concurrency Scaling to handle the historical queries on dc2 nodes; use Redshift Materialized Views to cache the 200 TB S3 data.",
        isCorrect: false,
        explanation: "Wrong — Concurrency Scaling adds transient clusters to handle read bursts on the PRIMARY cluster's data — it does not help with querying S3 external data or decoupling storage from compute. Materialized Views can reference external tables, but materializing 200 TB of historical data into Redshift's storage defeats the purpose of not loading it into the cluster."
      },
      {
        id: "C",
        text: "Use Amazon Athena to query both the Redshift data and the S3 historical data via Athena Federated Query.",
        isCorrect: false,
        explanation: "Wrong — Athena Federated Query can query Redshift via the Redshift connector, but this adds an extra hop and doesn't address compute/storage decoupling in Redshift itself. The question asks for Redshift to query S3 in place and for the Redshift cluster's own architecture to decouple compute and storage — requirements that point to Spectrum + RA3 nodes."
      },
      {
        id: "D",
        text: "Use Redshift Serverless for the 10 TB dataset and store the 200 TB in S3 Tables (Iceberg) queried via Glue.",
        isCorrect: false,
        explanation: "Wrong — Redshift Serverless does decouple compute and storage (RPU-based), but the question also requires querying the S3 historical data SQL in Redshift. Using Glue (Spark) for the S3 data is a separate compute system, not a Redshift SQL query. Redshift Spectrum is the correct answer for SQL-on-S3 from within Redshift."
      }
    ],
    explanation: "Two Redshift capabilities tested here: RA3 nodes = managed storage (Redshift Managed Storage, RMS) that decouples compute from storage. Hot data in local NVMe, cool data in S3-backed RMS. Scale compute nodes without changing storage. NOTE: DC2 EOL April 24, 2026 — migrate to RA3 or Serverless. Redshift Spectrum = external tables over S3 (Parquet/ORC/CSV), pay per TB scanned, no data loading required, uses Redshift SQL, runs in parallel across the cluster's compute nodes. Together: RA3 + Spectrum is the full answer for decoupled compute/storage + ad-hoc S3 querying.",
    keywords: ["RA3 managed storage", "Redshift Spectrum S3", "decoupled compute storage", "ad-hoc S3 query", "DC2 EOL"]
  },

  // ─── d3-051 ── 3.5 Data ── Redshift Concurrency Scaling ── difficulty 3 ──────
  {
    id: "d3-051",
    domain: 3,
    taskStatement: "3.5",
    services: ["redshift"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A business intelligence team uses Amazon Redshift to serve dashboards to 300 internal users. During business hours (9 AM–5 PM), all 300 users query simultaneously, causing query queue depths of 50+ and response times exceeding 2 minutes. Outside business hours, the cluster is idle. The team needs to REDUCE query wait time during business hours while MINIMIZING cost for the idle overnight period. Which Redshift feature addresses the business-hours concurrency problem with the LOWEST additional cost?",
    options: [
      {
        id: "A",
        text: "Enable Redshift Concurrency Scaling — automatic transient clusters handle query bursts during business hours, with 1 free credit hour per day.",
        isCorrect: true,
        explanation: "Correct — Amazon Redshift Concurrency Scaling automatically adds transient read clusters when the main cluster's query queue depth exceeds a threshold. Queries are routed to the scaling clusters transparently. Critically, Redshift provides 1 free hour of Concurrency Scaling credit per day per cluster. For a cluster that is busy only during business hours (8 hours/day), the free credit covers a significant portion of the scaling cost. After the free credit, additional Concurrency Scaling time is billed per second."
      },
      {
        id: "B",
        text: "Resize the Redshift cluster to 4× its current node count permanently to handle the 300 concurrent users.",
        isCorrect: false,
        explanation: "Wrong — Permanently increasing cluster size means paying for 4× nodes 24/7, including the overnight idle period. For a workload that is only busy 8 hours per day (33% of the time), this wastes ~67% of compute spend on idle capacity. Concurrency Scaling adds compute only when needed and bills per second of actual use."
      },
      {
        id: "C",
        text: "Enable Redshift Automatic WLM with query priority and set query timeout of 30 seconds to cancel slow queries.",
        isCorrect: false,
        explanation: "Wrong — Automatic WLM manages queue priority and resource allocation within the existing cluster but does not add additional compute capacity. Canceling slow queries with timeouts degrades user experience without solving the concurrency bottleneck. More concurrent capacity is needed, not better queue management within fixed capacity."
      },
      {
        id: "D",
        text: "Switch to Redshift Serverless, which automatically scales compute to handle 300 concurrent users.",
        isCorrect: false,
        explanation: "Wrong — Redshift Serverless is a valid option for variable workloads and does auto-scale RPUs. However, the question specifically asks for the feature that addresses concurrency on an EXISTING Redshift provisioned cluster with MINIMUM additional cost — and highlights the free credit. Concurrency Scaling is the specific feature that answers the concurrency question with a free tier."
      }
    ],
    explanation: "Redshift Concurrency Scaling: automatically adds transient read clusters when queue depth exceeds threshold; 1 free hour/day credit per cluster; additional usage billed per second. This is the exam answer for 'Redshift query queuing during peak hours.' Contrast: Elastic Resize = change node type/count (minutes, permanent change); Classic Resize = full cluster rebuild (hours); Concurrency Scaling = dynamic burst capacity (seconds, per-use billing). For predictable business-hours peak with overnight idle, Concurrency Scaling wins on cost.",
    keywords: ["Concurrency Scaling", "1 free hour per day", "transient cluster", "query queue", "burst read capacity"]
  },

  // ─── d3-052 ── 3.5 Data ── AWS Glue job types and bookmarks ── difficulty 3 ──
  {
    id: "d3-052",
    domain: 3,
    taskStatement: "3.5",
    services: ["glue"],
    constraintType: "performance",
    difficulty: 3,
    type: "multi-select",
    stem: "A data engineering team is building a serverless ETL pipeline using AWS Glue. They have two jobs: Job X transforms a 50 GB daily batch of JSON files using distributed computation (PySpark), and Job Y performs a lightweight Python script that runs SQL against an external API to load lookup tables (< 100 MB, no distributed computation needed). They also need Job X to process ONLY newly arrived files without reprocessing files from previous runs. Which TWO statements reflect correct Glue configuration choices? (Select TWO)",
    options: [
      {
        id: "A",
        text: "Job X should use a Spark job type with G.1X or G.2X worker types for distributed PySpark transformation.",
        isCorrect: true,
        explanation: "Correct — AWS Glue Spark jobs execute distributed PySpark/Scala on managed Spark clusters. Worker types G.1X (4 vCPU/16 GB), G.2X (8 vCPU/32 GB) are appropriate for 50 GB distributed transformation. The Spark engine handles parallelism, fault tolerance, and data shuffling automatically."
      },
      {
        id: "B",
        text: "Job Y should use a Spark job type to ensure it has the same runtime as Job X for operational consistency.",
        isCorrect: false,
        explanation: "Wrong — Python shell jobs are purpose-built for lightweight Python scripts (<100 MB data, no Spark needed). A Python shell job uses 1 DPU (or 0.0625 DPU) and runs single-node Python. Using a Spark job for a lightweight lookup script wastes resources (minimum 2 DPUs for Spark), adds cold start overhead, and increases cost unnecessarily."
      },
      {
        id: "C",
        text: "Job Y should use a Python shell job type since it performs lightweight Python computation without distributed processing.",
        isCorrect: true,
        explanation: "Correct — AWS Glue Python shell jobs run single-node Python scripts with up to 1 DPU (or 0.0625 DPU for lightweight scripts). They are ideal for tasks that don't need Spark: SQL against external APIs, small data transformations, orchestration scripts, or data loading under 100 MB. Python shell jobs start faster and cost significantly less than Spark jobs for small workloads."
      },
      {
        id: "D",
        text: "Job X should use S3 event notifications to trigger per-file processing and avoid reprocessing.",
        isCorrect: false,
        explanation: "Wrong — S3 event notifications can trigger individual Glue job runs per file, but this creates many small Spark jobs (inefficient) and doesn't provide built-in tracking of which files have been processed. AWS Glue job bookmarks are the native solution for incremental processing — they track processed files across runs so the next run only processes new files."
      }
    ],
    explanation: "AWS Glue job types: Spark (G.1X–G.16X workers, distributed PySpark/Scala, batch or streaming ETL). Python shell (1 DPU max, single-node Python, lightweight scripts, fast startup). Ray (Z.2X workers, Python-native distributed ML/data). Key exam pattern: '50 GB distributed PySpark' → Spark job; 'lightweight Python script' → Python shell. Glue job bookmarks track processed files (ETag + timestamp) to enable incremental ETL — the standard answer for 'process only new files without reprocessing.'",
    keywords: ["Spark job type", "Python shell job", "lightweight script", "G.1X workers", "job bookmarks incremental"]
  },

  // ─── d3-053 ── 3.5 Data ── Athena Parquet vs CSV cost ── difficulty 4 (trap) ──
  {
    id: "d3-053",
    domain: 3,
    taskStatement: "3.5",
    services: ["athena", "s3"],
    constraintType: "performance",
    difficulty: 5,
    type: "single",
    stem: "A finance team queries a 50 TB dataset of transaction logs stored in Amazon S3 using Amazon Athena. The data is currently in gzip-compressed CSV format. Queries typically select only 5 of 200 columns and filter by a date partition. An architect claims: 'Athena charges $5 per TB scanned regardless of how you store the data, so converting to Parquet format and re-partitioning won't reduce costs.' A data engineer disagrees. Which statement ACCURATELY describes how storage format affects Athena query costs?",
    options: [
      {
        id: "A",
        text: "The architect is correct — Athena always scans the full file regardless of column selection. Format conversion only affects query speed, not cost.",
        isCorrect: false,
        explanation: "Wrong — This is the classic Athena cost trap. Columnar formats like Parquet and ORC allow Athena to use COLUMN PRUNING — it reads only the byte ranges of the 5 requested columns, skipping all other column data. Parquet/ORC also have built-in statistics (min/max per row group) enabling row group skipping. CSV is row-oriented: selecting 5 of 200 columns still requires scanning the entire row. Format matters enormously for cost."
      },
      {
        id: "B",
        text: "The data engineer is correct — Athena charges per TB scanned, and columnar formats (Parquet/ORC) with partitioning dramatically reduce the bytes scanned per query. Converting from CSV to Parquet can reduce scan costs by 85–99% depending on column selectivity and partition pruning.",
        isCorrect: true,
        explanation: "Correct — Athena's $5/TB is charged on BYTES SCANNED per query. Parquet/ORC are columnar: selecting 5 of 200 columns reads only ~2.5% of column data. Adding Snappy compression further reduces file sizes. Date partitioning means Athena reads only the relevant date directories (partition pruning). Together, these optimizations reduce bytes scanned by 85–99%+ vs full CSV scans. A query costing $250 on CSV might cost ~$2–3 on partitioned Parquet."
      },
      {
        id: "C",
        text: "The architect is partially correct — Athena charges per TB scanned, and columnar formats reduce cost only when ALL columns are selected, not for partial column queries.",
        isCorrect: false,
        explanation: "Wrong — The opposite is true. Columnar formats provide the MOST cost reduction when FEWER columns are selected (high selectivity). If you select all 200 columns, columnar and row-oriented formats must read similar data volumes. The cost advantage of Parquet/ORC is maximized when selecting a small subset of columns from a wide table."
      },
      {
        id: "D",
        text: "Both are wrong — Athena pricing has changed to per-query flat fee. Data format no longer affects cost.",
        isCorrect: false,
        explanation: "Wrong — As of knowledge cutoff, Athena pricing remains approximately $5/TB scanned (exact price varies by region). There is no flat per-query fee. The bytes-scanned pricing model directly incentivizes columnar formats, compression, and partitioning."
      }
    ],
    explanation: "Athena cost optimization is a mandatory topic: Athena charges ~$5/TB scanned. Columnar formats (Parquet, ORC) enable column pruning (read only selected columns) AND row group statistics skip (min/max). Partitioning enables partition pruning (read only matching prefixes). Compression (Snappy, ZSTD for Parquet; ZLIB/Snappy for ORC) reduces file sizes. Combined, partitioned Parquet/ORC can reduce Athena costs 85–99% vs unpartitioned CSV. Always use Parquet/ORC for analytics queries on Athena.",
    keywords: ["Athena $5 per TB", "columnar Parquet ORC", "column pruning", "partition pruning", "85% cost reduction"]
  },

  // ─── d3-054 ── 3.5 Data ── Kinesis Video Streams vs KDS ── difficulty 5 (trap) ─
  {
    id: "d3-054",
    domain: 3,
    taskStatement: "3.5",
    services: ["kinesis-data-streams"],
    constraintType: "performance",
    difficulty: 5,
    type: "single",
    stem: "A smart factory deploys 500 IP cameras that continuously capture video footage for safety monitoring. An architect states: 'We can use Amazon Kinesis Data Streams to ingest the video streams from all 500 cameras — it's the same Kinesis family, just configure 500 shards for the 500 cameras.' A senior architect disagrees. Which statement CORRECTLY explains why Amazon Kinesis Data Streams is NOT appropriate for video camera ingestion and which service is correct?",
    options: [
      {
        id: "A",
        text: "The first architect is correct — Kinesis Data Streams supports video data as binary records and 500 shards provides sufficient throughput for 500 cameras.",
        isCorrect: false,
        explanation: "Wrong — While KDS can technically ingest binary data, it is designed for application event records (JSON, CSV, application logs) with a 1 MB/s per shard ingestion limit and a maximum record size of 1 MB. A single HD video stream at 2 Mbps would require 2 shards per camera, still without any of the video-specific capabilities needed. KDS has no concept of video fragments, playback APIs, or HLS/DASH streaming output."
      },
      {
        id: "B",
        text: "Amazon Kinesis Video Streams (KVS) is the correct service — it is purpose-built to ingest, store, and process video/audio streams from devices such as cameras and IoT sensors. KVS and Kinesis Data Streams are completely different services despite the shared 'Kinesis' branding.",
        isCorrect: true,
        explanation: "Correct — Amazon Kinesis Video Streams is a completely separate service from Kinesis Data Streams. KVS ingests video/audio/radar data from media devices and cameras using the KVS Producer SDK or WebRTC. It stores fragments durably, supports HLS/DASH playback APIs, integrates with Amazon Rekognition Video for ML analysis, and can trigger Batch processing. KDS is an event record streaming service for application-generated records — not video/audio media. The shared 'Kinesis' prefix does NOT mean they are the same service or interchangeable."
      },
      {
        id: "C",
        text: "Amazon MSK (Managed Streaming for Kafka) is the correct service because it supports binary blob messages up to 10 MB which can hold video frames.",
        isCorrect: false,
        explanation: "Wrong — MSK/Kafka can transport binary data including video frames, but it is an event streaming message bus without video-specific features (no playback APIs, no HLS/DASH output, no native Rekognition integration, no time-indexed video storage). MSK maximum record size is 10 MB per partition per second limitation). Amazon Kinesis Video Streams is specifically designed for video ingestion and processing."
      },
      {
        id: "D",
        text: "Amazon S3 with Multipart Upload is the correct service — cameras upload video to S3 and Kinesis Data Streams is used to signal when uploads complete.",
        isCorrect: false,
        explanation: "Wrong — S3 multipart upload is for object storage (completed files), not continuous live video streaming. Live video streams generate a continuous byte stream that cannot be stored as a single S3 object in real time. Kinesis Video Streams is designed for live continuous video ingestion from streaming sources."
      }
    ],
    explanation: "Kinesis Video Streams vs Kinesis Data Streams is a top exam trap. They share the brand name but are completely different: KVS = video/audio/radar ingestion from cameras/devices (Producer SDK, WebRTC), fragment-based storage, HLS/DASH playback APIs, Rekognition integration, time-indexed retrieval. KDS = application event records (JSON, binary), 1 MB max record, 1 MB/s per shard, Lambda/Flink/custom consumers. Never use KDS for video. KVS has its own storage (not shards) and its own API set.",
    keywords: ["Kinesis Video Streams not KDS", "video camera ingestion", "HLS DASH playback", "Producer SDK", "completely different services"]
  },

  // ─── d3-055 ── 3.5 Data ── Amazon Managed Service for Apache Flink ── diff 3 ──
  {
    id: "d3-055",
    domain: 3,
    taskStatement: "3.5",
    services: ["kinesis-data-streams", "managed-flink"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A fraud detection team needs to detect suspicious patterns in credit card transactions in real time. The pipeline must: (A) consume transaction events from Amazon Kinesis Data Streams, (B) perform stateful windowed aggregations (detect 3+ transactions from the same card in any 60-second sliding window), (C) apply ML scoring, and (D) emit fraud alerts within 500 ms. Which AWS service provides stateful real-time stream processing with sliding window support on Kinesis Data Streams?",
    options: [
      {
        id: "A",
        text: "Amazon Data Firehose with Lambda transformation",
        isCorrect: false,
        explanation: "Wrong — Amazon Data Firehose has a minimum buffering interval of 60 seconds and does not support stateful windowed aggregations. Lambda transformations in Firehose run per-batch (per buffer flush), not as a continuous sliding window processor with state. Firehose is a delivery service, not a stream processor."
      },
      {
        id: "B",
        text: "Amazon Managed Service for Apache Flink (formerly Amazon Kinesis Data Analytics for Apache Flink)",
        isCorrect: true,
        explanation: "Correct — Amazon Managed Service for Apache Flink provides fully managed real-time stream processing using Apache Flink on KDS or MSK inputs. It supports stateful computations (keyed state, operator state), sliding/tumbling/session windows, exactly-once semantics, sub-second latency, and auto-scaling. It directly reads from Kinesis Data Streams and can write to S3, DynamoDB, OpenSearch, Kinesis, or custom sinks. This is the AWS-native answer for stateful windowed stream analytics."
      },
      {
        id: "C",
        text: "AWS Lambda with a Kinesis Data Streams event source mapping and DynamoDB for state storage",
        isCorrect: false,
        explanation: "Wrong — Lambda can consume KDS events and store state in DynamoDB, but implementing sliding window aggregations manually in Lambda/DynamoDB requires custom timer management, DynamoDB query patterns for time windows, and careful handling of late arrivals. This works but is far more complex than Apache Flink's built-in windowing operators. Managed Flink is purpose-built for this use case."
      },
      {
        id: "D",
        text: "Amazon EMR with Spark Structured Streaming reading from Kinesis",
        isCorrect: false,
        explanation: "Wrong — EMR Spark Structured Streaming can process KDS data in micro-batches (~seconds latency). However, EMR requires cluster management (provisioning, scaling, patching), has higher startup latency, and is more operationally complex than Amazon Managed Service for Apache Flink, which is fully serverless and specifically designed for low-latency KDS analytics."
      }
    ],
    explanation: "Amazon Managed Service for Apache Flink (rebranded from Kinesis Data Analytics for Apache Flink) is the exam answer for: stateful real-time stream processing, sliding/tumbling/session windows, complex event processing, sub-second latency, and KDS/MSK input. Key facts: runs Apache Flink natively; exactly-once processing with checkpointing; auto-scaling based on KPU (Kinesis Processing Units); direct KDS/MSK source connectors; output to S3, DynamoDB, OpenSearch, Kinesis, etc. Distinguish from Firehose (delivery, not processing) and Lambda (event-driven, not stateful windowing).",
    keywords: ["Managed Flink", "stateful windowed aggregation", "sliding window", "real-time stream processing", "KDS analytics"]
  },

  // ─── d3-056 ── 3.5 Data ── AWS Lake Formation column/row security ── diff 4 ──
  {
    id: "d3-056",
    domain: 3,
    taskStatement: "3.5",
    services: ["glue", "athena"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A financial institution stores customer transaction data in an Amazon S3 data lake cataloged in the AWS Glue Data Catalog. Three user groups need different access levels: (1) Data Scientists — can query all columns except SSN and credit_card_number; (2) Auditors — can query all columns but only rows where transaction_type = 'audit'; (3) Executives — can query only aggregate views with no individual customer data. IAM S3 bucket policies cannot enforce column-level restrictions. The SECURITY team mandates that access control be CENTRALLY managed. Which service provides all three levels of control?",
    options: [
      {
        id: "A",
        text: "Configure separate S3 prefixes per user group and use IAM policies to restrict prefix access.",
        isCorrect: false,
        explanation: "Wrong — Separate S3 prefixes per group requires physically partitioning data differently for each group, duplicating data, and applying separate prefix policies. This does not support column-level restriction (all files in a prefix still contain all columns), and changes to group permissions require data reorganization. This is neither scalable nor centrally managed."
      },
      {
        id: "B",
        text: "Use Amazon Macie to classify sensitive columns and apply S3 object tags; restrict access by tag using S3 bucket policies.",
        isCorrect: false,
        explanation: "Wrong — Amazon Macie discovers and classifies PII but cannot enforce query-level column or row restrictions. S3 object tags and bucket policies operate at the S3 object (file) level, not at the column or row level within a file. A policy that grants access to a Parquet file grants access to ALL columns in that file."
      },
      {
        id: "C",
        text: "AWS Lake Formation with column-level grants (excluding SSN/credit_card_number for Data Scientists), row-level filters (transaction_type='audit' for Auditors), and table-level grants on aggregate views for Executives.",
        isCorrect: true,
        explanation: "Correct — AWS Lake Formation enforces fine-grained access control at the column level (exclude specific columns from principals), row level (row-level filters based on column values), and table/view level. These are enforced by query engines that honor Lake Formation permissions: Athena, Redshift Spectrum, EMR (Spark/Trino/Hive), and Glue ETL. Central management via Lake Formation console/CLI with LF-Tags for scalable permission management. No data movement required."
      },
      {
        id: "D",
        text: "Create separate Glue Data Catalog databases per user group with views exposing only allowed columns.",
        isCorrect: false,
        explanation: "Wrong — Creating separate databases per group with column-filtered views is a manual workaround. Without Lake Formation enforcement, a user with catalog access could still bypass the view and query the underlying table directly. Lake Formation's enforcement is at the query engine level — it prevents bypassing column/row restrictions regardless of which query path is used."
      }
    ],
    explanation: "AWS Lake Formation fine-grained access control hierarchy: Table-level (grant/revoke SELECT on table), Column-level (include/exclude specific columns per principal), Row-level (filter rows matching a condition per principal), Cell-level (both column and row). LF-Tags (Tag-Based Access Control) apply permissions across thousands of tables via tag inheritance. CRITICAL: IAM permissions are also checked — to prevent IAM bypass of LF controls, administrators should use `UseOnlyLakeFormationPermissions` resource link or ensure S3 bucket policies don't grant access beyond LF grants.",
    keywords: ["Lake Formation", "column-level grant", "row-level filter", "centralized data governance", "Athena enforcement"]
  },

  // ─── d3-057 ── 3.5 Data ── QuickSight SPICE ── difficulty 3 ───────────────────
  {
    id: "d3-057",
    domain: 3,
    taskStatement: "3.5",
    services: ["quicksight"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A company's business intelligence team creates Amazon QuickSight dashboards backed by a 5 TB Amazon Redshift data warehouse. Currently, every dashboard interaction (filter change, drill-down) executes a live SQL query against Redshift, causing 10–30 second response times during business hours when Redshift is under heavy ETL load. The team wants dashboards to respond in under 1 second and to reduce the query load on Redshift. Which QuickSight capability achieves this with the LEAST architectural complexity?",
    options: [
      {
        id: "A",
        text: "Switch to Amazon QuickSight Q (AI-powered natural language querying) which uses a faster query path.",
        isCorrect: false,
        explanation: "Wrong — Amazon QuickSight Q (now part of Amazon Quick Suite as Q in QuickSight) provides natural language querying but still executes queries against the underlying data source (Redshift or SPICE). It does not inherently reduce Redshift query load or improve response time without importing data into SPICE."
      },
      {
        id: "B",
        text: "Import the Redshift dataset into Amazon QuickSight SPICE (Super-fast Parallel In-memory Calculation Engine) and schedule periodic refreshes.",
        isCorrect: true,
        explanation: "Correct — SPICE is QuickSight's in-memory columnar calculation engine that stores datasets in AWS-managed memory (~10× faster than direct query). Once data is imported into SPICE, dashboard interactions query the in-memory dataset instead of Redshift — achieving sub-second response times regardless of Redshift load. SPICE datasets are refreshed on a schedule (or manually) to keep data current. This requires no changes to the Redshift cluster or ETL pipelines."
      },
      {
        id: "C",
        text: "Enable Redshift Concurrency Scaling to handle the QuickSight query load without changing the QuickSight configuration.",
        isCorrect: false,
        explanation: "Wrong — Concurrency Scaling adds transient clusters to handle read bursts but still executes queries against Redshift. This reduces query latency under concurrent load but does not achieve sub-second dashboard response times (each query still requires SQL execution, optimizer, I/O). SPICE moves the data out of Redshift entirely for dashboard queries."
      },
      {
        id: "D",
        text: "Configure QuickSight with paginated reports to pre-compute dashboard results nightly.",
        isCorrect: false,
        explanation: "Wrong — QuickSight Paginated Reports are pixel-perfect printable/exportable reports, not a caching mechanism for interactive dashboards. They don't reduce live query latency for interactive filtering and drill-down in dashboards."
      }
    ],
    explanation: "Amazon QuickSight SPICE (Super-fast Parallel In-memory Calculation Engine) is the exam answer for 'reduce database query load and achieve sub-second QuickSight dashboard response.' SPICE imports data into QuickSight's managed in-memory storage, enabling query-at-rest speeds of ~10× faster than live database queries. Data is refreshed on schedule (hourly, daily, etc.) or via API. SPICE capacity is per QuickSight Author (default allocation per user). Trade-off: SPICE data has a refresh lag — not suitable for real-time dashboards requiring the latest data.",
    keywords: ["SPICE in-memory", "sub-second dashboard", "reduce Redshift load", "scheduled refresh", "10x faster"]
  },

  // ─── d3-058 ── 3.3 Database ── DynamoDB Streams vs Kinesis Data Streams ── diff 5 (trap)
  {
    id: "d3-058",
    domain: 3,
    taskStatement: "3.3",
    services: ["dynamodb", "kinesis-data-streams"],
    constraintType: "performance",
    difficulty: 5,
    type: "single",
    stem: "An architect designs a real-time notification system. When DynamoDB table items are created or updated, the changes must trigger downstream processing. A colleague suggests: 'DynamoDB Streams and Amazon Kinesis Data Streams for DynamoDB are interchangeable — use whichever is cheaper since both give you ordered item-level changes with unlimited retention.' Which statement CORRECTLY identifies a critical difference between these two options?",
    options: [
      {
        id: "A",
        text: "The colleague is correct — DynamoDB Streams and Kinesis Data Streams for DynamoDB are interchangeable with different retention policies only.",
        isCorrect: false,
        explanation: "Wrong — The two options have significantly different capabilities beyond retention. DynamoDB Streams: 24-hour fixed retention, up to 2 Lambda consumers per stream, 4 stream view types (KEYS_ONLY/NEW_IMAGE/OLD_IMAGE/NEW_AND_OLD_IMAGES), managed by DynamoDB service. Kinesis Data Streams for DynamoDB: up to 365-day retention, supports multiple consumers (up to 20 Enhanced Fan-Out consumers), standard KDS consumer ecosystem (Flink, Firehose, Lambda, custom), configurable shard count."
      },
      {
        id: "B",
        text: "DynamoDB Streams has a FIXED 24-hour retention and supports at most 2 Lambda triggers per stream; Kinesis Data Streams for DynamoDB has configurable retention up to 365 days, supports more consumers, and integrates with the full KDS ecosystem — making them NOT interchangeable for use cases requiring longer retention or more consumers.",
        isCorrect: true,
        explanation: "Correct — DynamoDB Streams: 24-hour (fixed) retention, up to 2 simultaneous Lambda consumers (per stream), useful for simple change-driven automation. KDS for DynamoDB: configurable retention (24 hours to 365 days), supports the full KDS consumer ecosystem (Lambda, Managed Flink, Firehose, Enhanced Fan-Out up to 20 consumers), supports fan-out to multiple systems. The choice depends on retention requirements and consumer count. They are NOT interchangeable."
      },
      {
        id: "C",
        text: "DynamoDB Streams captures only INSERT events; Kinesis Data Streams for DynamoDB captures INSERT, MODIFY, and DELETE events.",
        isCorrect: false,
        explanation: "Wrong — Both DynamoDB Streams and Kinesis Data Streams for DynamoDB capture INSERT, MODIFY, and DELETE events on the DynamoDB table. DynamoDB Streams supports view types including NEW_AND_OLD_IMAGES to see both before and after values. The difference is retention and consumer ecosystem, not event types."
      },
      {
        id: "D",
        text: "DynamoDB Streams requires Kinesis Client Library (KCL); Kinesis Data Streams for DynamoDB uses the native DynamoDB Streams API.",
        isCorrect: false,
        explanation: "Wrong — It's the reverse. DynamoDB Streams uses the DynamoDB Streams API (GetRecords, GetShardIterator) or Lambda triggers. Kinesis Data Streams for DynamoDB uses the standard KDS API (GetRecords, SubscribeToShard) and KCL. The APIs are different, which is part of why the two options are not interchangeable."
      }
    ],
    explanation: "DynamoDB Streams vs Kinesis Data Streams for DynamoDB: DDB Streams = 24h retention (fixed), DynamoDB Streams API, max 2 Lambda consumers per stream, no KDS consumer support, view types: KEYS_ONLY/NEW_IMAGE/OLD_IMAGE/NEW_AND_OLD_IMAGES. KDS for DynamoDB = 24h–365d retention (configurable), standard KDS API, up to 20 EFO consumers, works with Flink, Firehose, full KDS ecosystem. Use DDB Streams for simple Lambda triggers; use KDS for DynamoDB when you need longer retention, multiple consumers, or KDS ecosystem integration.",
    keywords: ["DynamoDB Streams 24h fixed", "KDS configurable retention", "2 Lambda consumers limit", "365 days", "not interchangeable"]
  },

  // ─── d3-059 ── 3.3 Database ── Aurora Parallel Query ── difficulty 3 ──────────
  {
    id: "d3-059",
    domain: 3,
    taskStatement: "3.3",
    services: ["aurora"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A SaaS company runs an Amazon Aurora MySQL operational database for transactional workloads. A new requirement is to run ANALYTICAL queries (large table scans, aggregations over 100 million rows) directly against the same Aurora cluster to avoid the latency of ETL to a separate data warehouse. Without any changes, these analytical queries cause high CPU and I/O on the writer instance, impacting transactional performance. Which Aurora MySQL feature pushes analytical query processing to the storage layer, reducing the impact on the primary writer?",
    options: [
      {
        id: "A",
        text: "Aurora read replicas — route analytical queries to a dedicated read replica endpoint.",
        isCorrect: false,
        explanation: "Wrong — Aurora read replicas do offload queries from the writer, which is a valid approach. However, read replicas still perform full query processing (CPU, filtering, aggregation) in the replica's compute layer. For large analytical scans, the replica still consumes significant CPU. The question specifically asks for a feature that pushes query processing to the STORAGE LAYER."
      },
      {
        id: "B",
        text: "Aurora Parallel Query — pushes filters, aggregations, and projections down to the Aurora distributed storage layer, reducing data transferred to the query node.",
        isCorrect: true,
        explanation: "Correct — Aurora Parallel Query (MySQL only) is a feature that pushes row filtering, column projection, and aggregation computations down to the storage layer nodes instead of the DB instance compute layer. This reduces the volume of data transmitted from storage to the query node and parallelizes processing across storage nodes. AWS claims up to 2 orders of magnitude faster analytical queries on operational data. Available on Aurora MySQL 5.6.10a+ and certain r* instance classes."
      },
      {
        id: "C",
        text: "Aurora Serverless v2 — the serverless compute automatically scales to handle analytical query CPU spikes.",
        isCorrect: false,
        explanation: "Wrong — Aurora serverless (v2) automatically scales compute ACUs based on workload, which can handle analytical query spikes by adding CPU. However, scaling up does not push processing to the storage layer — it still runs all filtering and aggregation in the compute layer. Parallel Query specifically uses storage-layer processing, which is architecturally different from simply adding more compute."
      },
      {
        id: "D",
        text: "Aurora I/O-Optimized — eliminates per-I/O charges for large analytical scans, reducing cost but not CPU usage.",
        isCorrect: false,
        explanation: "Wrong — Aurora I/O-Optimized eliminates per-I/O charges (up to 40% cost savings when I/O >25% of bill), which reduces the COST of analytical scans but does not reduce CPU usage or change query execution architecture. Parallel Query is the feature that addresses performance impact by offloading processing to storage."
      }
    ],
    explanation: "Aurora Parallel Query (MySQL only) is the exam answer for 'run analytics on Aurora without impacting transactional performance via storage-layer processing.' Key details: available for Aurora MySQL (not PostgreSQL). Pushes WHERE clause filters, column projection, and partial aggregation to the distributed storage layer. Reduces data shipped from storage to compute node. Works alongside read replicas (can enable on replica instances). Best for queries scanning large fractions of a table with selective filters. Not all query plans use parallel query — optimizer decides.",
    keywords: ["Aurora Parallel Query", "storage-layer processing", "MySQL only", "analytical on operational", "reduce writer impact"]
  },

  // ─── d3-060 ── 3.3 Database ── Aurora zero-ETL with Redshift ── difficulty 4 ──
  {
    id: "d3-060",
    domain: 3,
    taskStatement: "3.3",
    services: ["aurora", "redshift"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A company uses Amazon Aurora PostgreSQL for its OLTP application and Amazon Redshift for analytics. The current ETL pipeline extracts data from Aurora nightly, transforms it, and loads it into Redshift — causing analytics to always be at least 12 hours stale. The data team wants near-real-time analytics (seconds-level replication from Aurora to Redshift) without maintaining a custom ETL pipeline. The Aurora cluster must continue serving OLTP transactions without interruption. Which AWS capability achieves this with MINIMUM operational overhead?",
    options: [
      {
        id: "A",
        text: "Configure Amazon Data Firehose to read from Aurora's binary log and deliver records to Redshift every 60 seconds.",
        isCorrect: false,
        explanation: "Wrong — Firehose does not natively read Aurora binlogs. A custom solution using DMS + Firehose could work but requires infrastructure management (DMS replication instance, Firehose stream, schema mapping). This is a custom ETL pipeline with operational overhead, not a native zero-ETL solution."
      },
      {
        id: "B",
        text: "Enable Aurora PostgreSQL zero-ETL integration with Amazon Redshift — replication is automatic, seconds-level, requires no ETL code, and does not impact Aurora performance.",
        isCorrect: true,
        explanation: "Correct — Aurora zero-ETL integration with Redshift (Aurora PostgreSQL GA October 2024) replicates data changes from Aurora to Redshift with seconds-level latency. No ETL pipelines to build or maintain. Replication uses Aurora's log-based change capture and does not require additional compute on the Aurora cluster. Target can be Redshift Serverless or RA3 provisioned. Up to 5 integrations per source DB. NOTE: auto-pause (scale-to-zero) on Aurora serverless is incompatible with zero-ETL."
      },
      {
        id: "C",
        text: "Use AWS Database Migration Service (DMS) with Change Data Capture (CDC) to continuously replicate Aurora changes to Redshift.",
        isCorrect: false,
        explanation: "Wrong — DMS CDC can replicate Aurora changes to Redshift in near-real-time, but it requires provisioning and managing a DMS replication instance, configuring endpoints, monitoring replication lag, and handling schema changes. This is a valid approach but has more operational overhead than Aurora's native zero-ETL integration."
      },
      {
        id: "D",
        text: "Enable Aurora read replica in the Redshift region and run analytical queries directly against the read replica.",
        isCorrect: false,
        explanation: "Wrong — Aurora cross-region read replicas enable reading OLTP data from Aurora in another region, but Redshift cannot query Aurora replicas directly via SQL. Analytical workloads on Aurora replicas don't benefit from Redshift's columnar storage, sort keys, distribution keys, or WLM for mixed analytics."
      }
    ],
    explanation: "Aurora zero-ETL integrations with Redshift eliminate the traditional extract-transform-load pipeline for operational-to-analytical data movement. Aurora MySQL (GA Nov 2023), Aurora PostgreSQL (GA Oct 2024), RDS MySQL (GA Sep 2024). Replication: seconds-level CDC from Aurora's log. Target: Redshift Serverless or RA3 provisioned clusters. Up to 5 integrations per source. Incompatible with: Aurora auto-pause (scale-to-zero), tables without primary keys. No DMS, no Glue, no Lambda required.",
    keywords: ["Aurora zero-ETL Redshift", "seconds-level replication", "no ETL pipeline", "Aurora PostgreSQL GA Oct 2024", "5 integrations per source"]
  },

  // ─── d3-061 ── 3.3 Database ── RDS Proxy connection pooling math ── diff 4 ────
  {
    id: "d3-061",
    domain: 3,
    taskStatement: "3.3",
    services: ["rds", "lambda"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A serverless application uses AWS Lambda functions that connect directly to an Amazon RDS for PostgreSQL database. During traffic peaks, 2,000 concurrent Lambda executions each open a connection to RDS, resulting in 2,000 simultaneous database connections. The RDS instance (db.r6g.large, max_connections ~1,700) crashes with 'too many connections' errors. The solutions architect needs to REDUCE the number of database connections from Lambda without limiting Lambda concurrency. Which solution resolves this?",
    options: [
      {
        id: "A",
        text: "Increase the RDS instance size to db.r6g.4xlarge which supports more connections.",
        isCorrect: false,
        explanation: "Wrong — Increasing instance size raises the max_connections ceiling, but as Lambda concurrency continues to grow (auto-scaling), the connection count will eventually exceed any instance's max_connections. This is an arms race, not a structural fix. The root problem is 1-connection-per-Lambda-invocation architecture."
      },
      {
        id: "B",
        text: "Deploy Amazon RDS Proxy between Lambda and RDS — RDS Proxy pools and multiplexes database connections, reducing the actual number of RDS connections from N×Lambda to a pool size that fits within RDS max_connections.",
        isCorrect: true,
        explanation: "Correct — Amazon RDS Proxy maintains a persistent connection pool to RDS. Lambda functions connect to the RDS Proxy endpoint (not directly to RDS). The Proxy multiplexes thousands of Lambda connections onto a small pool of actual database connections using transaction-level multiplexing. In this scenario, 2,000 concurrent Lambda executions might map to only 50–100 actual RDS connections. RDS Proxy also handles failover faster (up to 66% reduction in failover time) and supports IAM authentication + Secrets Manager credential rotation."
      },
      {
        id: "C",
        text: "Enable RDS Multi-AZ DB Cluster (MySQL/PostgreSQL with 2 readable standbys) and route Lambda to separate standbys.",
        isCorrect: false,
        explanation: "Wrong — Multi-AZ DB Cluster adds 2 readable standbys, roughly tripling connection capacity (3× max_connections). However, 2,000+ Lambda connections will still exceed this capacity as concurrency scales. Multi-AZ is an HA feature, not a connection pooling solution. RDS Proxy's multiplexing is the structural fix."
      },
      {
        id: "D",
        text: "Set Lambda reserved concurrency to 1,700 to match the max_connections limit.",
        isCorrect: false,
        explanation: "Wrong — Capping Lambda at 1,700 concurrent executions prevents the crash, but it also caps throughput and can cause throttling (429 errors) during traffic peaks. This throttles the application to protect the database instead of solving the connection problem. RDS Proxy eliminates the problem without limiting Lambda throughput."
      }
    ],
    explanation: "RDS Proxy is the exam answer for Lambda-to-RDS connection exhaustion. Key mechanism: transaction-level multiplexing — many application connections share a small pool of actual DB connections. A 2,000-Lambda application might use only 50–100 real DB connections via Proxy. Additional benefits: Aurora failover reduction by 66%, IAM authentication for Lambda → RDS without DB passwords, automatic Secrets Manager rotation for credentials. RDS Proxy adds ~5 ms latency per query. Compatible with MySQL, PostgreSQL, MariaDB, SQL Server, and Aurora.",
    keywords: ["RDS Proxy connection pooling", "Lambda too many connections", "multiplexing", "2000 Lambda 100 DB connections", "transaction-level"]
  },

  // ─── d3-062 ── 3.4 Network ── CloudFront signed URLs vs signed cookies ── diff 3
  {
    id: "d3-062",
    domain: 3,
    taskStatement: "3.4",
    services: ["cloudfront"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A media company delivers premium video content through Amazon CloudFront. Two distribution requirements exist: (X) Individual video files where each paying customer should receive a unique time-limited access link for a single file that can be shared and used without browser cookies; (Y) A video library portal where authenticated members should access HUNDREDS of protected files during their session without receiving individual URLs for each file. Which CloudFront authorization mechanism is appropriate for each requirement?",
    options: [
      {
        id: "A",
        text: "X: CloudFront signed cookies; Y: CloudFront signed URLs",
        isCorrect: false,
        explanation: "Wrong — Reversed. Signed URLs are for individual file access (one URL per file, embeddable in emails, shareable links, works without cookies). Signed cookies are for authorizing access to multiple files at once (set a cookie once, access all files in the session). Giving 'hundreds of files' individual signed URLs (Y) would be impractical."
      },
      {
        id: "B",
        text: "X: CloudFront signed URLs; Y: CloudFront signed cookies",
        isCorrect: true,
        explanation: "Correct — Signed URLs are ideal for individual file access: one URL grants access to one specific file, includes expiry and policy, works in email links, download managers, and environments where cookies may not be supported. Signed cookies authorize a principal to access multiple CloudFront resources matching a pattern (e.g., /videos/*) during a session — perfect for a logged-in member portal where setting one cookie grants access to hundreds of files without generating individual URLs."
      },
      {
        id: "C",
        text: "X: CloudFront OAC (Origin Access Control); Y: CloudFront signed URLs",
        isCorrect: false,
        explanation: "Wrong — OAC restricts S3 origin access to CloudFront only (prevents direct S3 URL access) — it is a distribution-level configuration, not a per-user authorization mechanism. OAC does not generate user-specific time-limited access tokens."
      },
      {
        id: "D",
        text: "X: CloudFront Lambda@Edge to verify JWT tokens; Y: CloudFront signed cookies",
        isCorrect: false,
        explanation: "Wrong — Lambda@Edge can verify JWT tokens for custom auth, but signed URLs are the native, simpler solution for individual time-limited file access without requiring custom Lambda code. The question asks which native CloudFront mechanism is appropriate."
      }
    ],
    explanation: "CloudFront signed URLs vs signed cookies: Signed URL = per-object authorization (1 URL per resource); best for single files, email links, download managers, clients that don't support cookies. Signed Cookies = per-session authorization (1 cookie grants access to a URL pattern like /videos/*); best for authenticated portals accessing many protected resources. Both support the same policy features: expiry time, IP restriction, custom policy statements. Use signed cookies when issuing per-file signed URLs would be impractical.",
    keywords: ["signed URL individual file", "signed cookie session access", "multiple files", "email shareable link", "CloudFront authorization"]
  },

  // ─── d3-063 ── 3.1 Storage ── DataSync scheduled transfer ── difficulty 3 ──────
  {
    id: "d3-063",
    domain: 3,
    taskStatement: "3.1",
    services: ["datasync", "s3"],
    constraintType: "migration",
    difficulty: 3,
    type: "single",
    stem: "A media company has 500 TB of video archive files on an on-premises NFS file server that must be migrated to Amazon S3 over an existing 10 Gbps AWS Direct Connect connection. After the initial migration, new files are added to the on-premises server daily (5–10 GB/day) and must be synchronized to S3 within 2 hours of creation. The operations team wants AUTOMATED incremental synchronization with data integrity verification and MINIMAL custom scripting. Which service satisfies both the initial migration and ongoing sync?",
    options: [
      {
        id: "A",
        text: "Use AWS Snowball Edge for the initial 500 TB migration, then use a custom rsync cron job for daily incremental sync over Direct Connect.",
        isCorrect: false,
        explanation: "Wrong — rsync is 10× slower than AWS DataSync for the same bandwidth and requires custom scripting, error handling, and verification logic. DataSync provides built-in integrity verification, encryption in transit, and scheduling — eliminating the need for custom rsync scripts."
      },
      {
        id: "B",
        text: "Use AWS DataSync with a DataSync agent on-premises connected to the NFS source, configured with both an initial transfer task and a scheduled recurring task for ongoing sync over Direct Connect.",
        isCorrect: true,
        explanation: "Correct — AWS DataSync is purpose-built for exactly this use case: (1) Initial bulk transfer of 500 TB at up to 10 Gbps utilizing the full Direct Connect bandwidth (DataSync can use multiple parallel streams). (2) Scheduled incremental tasks run on a configurable schedule, transferring only new/modified files since the last run using file metadata comparison. Built-in features: data integrity verification (checksum), encryption in transit (TLS), bandwidth throttling, CloudWatch metrics, PrivateLink support. No custom scripting required."
      },
      {
        id: "C",
        text: "Use AWS Storage Gateway Volume Gateway in Cached mode to replicate the on-premises volume to S3.",
        isCorrect: false,
        explanation: "Wrong — Volume Gateway Cached mode stores the primary data in S3 and caches frequently accessed data on-premises, exposing an iSCSI block device. This is for block storage extension, not NFS file migration. It also does not automatically sync a pre-existing on-premises NFS file server to S3 — it would require moving from NFS to iSCSI first."
      },
      {
        id: "D",
        text: "Use Amazon S3 Transfer Acceleration to upload files directly from the on-premises server to S3 via edge ingress.",
        isCorrect: false,
        explanation: "Wrong — S3 Transfer Acceleration uses CloudFront edge locations to route uploads over the AWS backbone for globally-distributed upload clients. It does not provide scheduling, incremental detection, integrity verification, or agent-based source access to an NFS server. For a Direct Connect-connected on-premises server, DataSync over the DX connection is more efficient than Transfer Acceleration (which uses the internet edge)."
      }
    ],
    explanation: "AWS DataSync for NFS migration: deploy DataSync agent (VMware/Hyper-V/KVM/EC2/Snowcone) on-premises, configure NFS/SMB source location, configure S3/EFS/FSx destination, run task (scheduled or one-time). DataSync: 10× faster than rsync, integrity verified (checksum), TLS encrypted, bandwidth throttling, CloudWatch metrics, PrivateLink-capable, ~$0.0125/GB. For ongoing sync, set a task schedule (cron-like). Incremental: DataSync compares file metadata (size + modification time) to identify changed files. No custom scripting required.",
    keywords: ["DataSync NFS to S3", "scheduled incremental sync", "integrity verification", "no custom scripting", "Direct Connect"]
  },

  // ─── d3-064 ── 3.5 Data ── Athena Federated Query ── difficulty 4 ─────────────
  {
    id: "d3-064",
    domain: 3,
    taskStatement: "3.5",
    services: ["athena", "rds", "dynamodb"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A data analyst team needs to run a single SQL JOIN query that combines: order data from Amazon DynamoDB, customer profiles from Amazon RDS for PostgreSQL, and historical transaction data from Amazon S3 (Parquet). Moving all data into a single store would require a multi-week migration project. The team needs a solution to query all three sources with a single SQL statement TODAY with MINIMUM data movement. Which capability enables this?",
    options: [
      {
        id: "A",
        text: "Amazon Redshift Spectrum — define all three as external tables and run federated joins in Redshift.",
        isCorrect: false,
        explanation: "Wrong — Redshift Spectrum queries S3 external tables (Parquet, ORC, etc.) but does NOT natively federate to DynamoDB or live RDS PostgreSQL at query time via Spectrum. Redshift does have federated queries to RDS/Aurora and DynamoDB, but Redshift Spectrum specifically refers to S3 external table querying."
      },
      {
        id: "B",
        text: "Amazon Athena Federated Query — use Lambda-based connectors for DynamoDB and RDS PostgreSQL, and native Glue Data Catalog for the S3 Parquet table, then join all three in a single Athena SQL query.",
        isCorrect: true,
        explanation: "Correct — Athena Federated Query uses Lambda-based data source connectors to query external data stores (DynamoDB, RDS, DocumentDB, Redshift, OpenSearch, HBase, CloudWatch Logs, on-premises databases, etc.) alongside S3 data cataloged in the Glue Data Catalog. A single Athena SQL query can JOIN tables from DynamoDB, RDS PostgreSQL, and S3 Parquet in one statement. AWS provides pre-built connectors for common sources. No data migration required."
      },
      {
        id: "C",
        text: "AWS Glue Spark job — use Glue dynamic frames to read all three sources and perform the JOIN in Spark, writing results to S3.",
        isCorrect: false,
        explanation: "Wrong — A Glue Spark job can read from all three sources, perform the JOIN, and write results to S3, which is a valid ETL approach. However, it does not allow the analyst to run 'a single SQL query TODAY' interactively — Glue jobs are batch processes with startup overhead (minutes). Athena Federated Query provides interactive SQL across sources without pre-defining a Spark job."
      },
      {
        id: "D",
        text: "Amazon EMR with Hive — configure Hive metastore tables pointing to DynamoDB, RDS, and S3, and run HiveQL joins.",
        isCorrect: false,
        explanation: "Wrong — EMR Hive can federate to some sources, but requires provisioning an EMR cluster, configuring Hive metastore, and writing HiveQL. This has higher operational overhead than Athena Federated Query, which is serverless and available immediately via the Athena console or SDK."
      }
    ],
    explanation: "Athena Federated Query is the exam answer for 'single SQL JOIN across multiple heterogeneous data sources without migration.' Architecture: Lambda functions act as connectors to external sources (DynamoDB, RDS, DocumentDB, Redshift, OpenSearch, HBase, custom). Each connector runs in the query submitter's account. Results are written to Athena's result S3 bucket and joined server-side. AWS provides the Amazon Athena Query Federation SDK for custom connectors. Pay per TB scanned (applies to both S3 and federated sources).",
    keywords: ["Athena Federated Query", "Lambda connector", "cross-source JOIN", "DynamoDB RDS S3", "no data migration"]
  },

  // ─── d3-065 ── 3.2 Compute ── EC2 Auto Scaling predictive ── difficulty 3 ──────
  {
    id: "d3-065",
    domain: 3,
    taskStatement: "3.2",
    services: ["ec2", "autoscaling"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "An e-commerce platform experiences highly predictable traffic patterns: low overnight, ramps up starting at 8 AM, peaks at noon, and tapers off by 10 PM. The existing Auto Scaling group uses target tracking on CPU utilization. The operations team observes that the group consistently scales OUT 10–15 minutes AFTER the morning ramp-up begins, causing elevated latency during the initial peak. The team wants capacity to be ready BEFORE the load arrives, without manual scheduled actions for every day. Which Auto Scaling policy type solves this?",
    options: [
      {
        id: "A",
        text: "Switch to step scaling to react more aggressively when CPU threshold is breached.",
        isCorrect: false,
        explanation: "Wrong — Step scaling reacts more aggressively than simple scaling when metrics breach thresholds, but it is still REACTIVE — it only triggers after CPU rises above the threshold. The problem is that traffic ramps up before scaling can respond. Any reactive policy (target tracking, step, simple) has this inherent lag."
      },
      {
        id: "B",
        text: "Enable Predictive Scaling on the Auto Scaling group — it uses machine learning to forecast traffic and proactively adds capacity before demand increases.",
        isCorrect: true,
        explanation: "Correct — Predictive Scaling uses ML-based forecasting on the last 14 days of traffic patterns (requires at least 24 hours of history) to predict load 48 hours ahead. It pre-scales the group BEFORE demand arrives (typically 5–10 minutes before predicted peak). This solves the morning ramp-up lag without manually creating scheduled actions for each day. Start in ForecastOnly mode to validate predictions before enabling ForecastAndScale."
      },
      {
        id: "C",
        text: "Add a warm pool to the Auto Scaling group with pre-initialized Stopped instances that can be activated quickly.",
        isCorrect: false,
        explanation: "Wrong — Warm pools reduce instance launch latency (Stopped instances resume faster than cold launches). However, warm pools do not predict when instances will be needed — they simply make scale-out faster when reactive policies trigger. The lag is not about launch time but about when the scaling policy DECIDES to scale — reactive policies still wait for the CPU breach."
      },
      {
        id: "D",
        text: "Create CloudWatch alarms with a 5-minute evaluation period instead of 10 minutes to trigger scaling sooner.",
        isCorrect: false,
        explanation: "Wrong — Reducing the CloudWatch evaluation period makes reactive scaling faster to respond to a breach, but it does not anticipate the breach before it happens. Predictive Scaling is the only Auto Scaling policy that proactively scales before demand — reactive policies always lag behind traffic increases regardless of alarm period."
      }
    ],
    explanation: "EC2 Auto Scaling policy types: Target Tracking = maintain metric at target (reactive). Step Scaling = varying magnitude at different breach levels (reactive). Simple = single scaling action per alarm (reactive, legacy). Scheduled = fixed times (manual cron). Predictive = ML-based 2-day forecast, proactive pre-scaling (requires ≥24 h history, ideally ≥14 days). Only Predictive Scaling addresses 'scale before traffic arrives.' Start in ForecastOnly mode to validate, then switch to ForecastAndScale. Predictive + Target Tracking together is a common exam answer: predictive handles the anticipated ramp, target tracking handles unexpected spikes.",
    keywords: ["Predictive Scaling", "proactive pre-scaling", "ML forecast", "morning ramp-up lag", "ForecastAndScale"]
  },

  // ─── d3-066 ── 3.3 Database ── ElastiCache Valkey multi-threaded ── diff 4 ────
  {
    id: "d3-066",
    domain: 3,
    taskStatement: "3.3",
    services: ["elasticache-redis"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A gaming company uses Amazon ElastiCache for Redis to store leaderboard data (sorted sets). The current Redis 7 cluster handles 80,000 requests per second but is approaching CPU saturation on the primary node because Redis uses a SINGLE-THREADED event loop. The team wants to INCREASE throughput and REDUCE latency on the SAME cluster configuration (same number of nodes, same memory) without migrating to a different caching technology. Which upgrade path best achieves this?",
    options: [
      {
        id: "A",
        text: "Enable ElastiCache cluster mode with 500 shards to distribute operations across more nodes.",
        isCorrect: false,
        explanation: "Wrong — ElastiCache cluster mode enables horizontal sharding, but the question specifies the SAME cluster configuration (same number of nodes). Adding 500 shards would increase the number of nodes significantly. The question asks for improvement on the same node configuration — specifically addressing the single-threaded bottleneck."
      },
      {
        id: "B",
        text: "Upgrade from ElastiCache for Redis OSS 7 to ElastiCache for Valkey 8 (Valkey 8.0/8.1 adds I/O threading that achieves up to 230% higher throughput and 70% lower latency with no topology changes).",
        isCorrect: true,
        explanation: "Correct — Amazon ElastiCache for Valkey is the AWS-recommended Redis OSS alternative (Valkey is a Redis 7.2.4 fork, drop-in API compatible). Valkey 8.0/8.1 adds I/O threading, which addresses the single-threaded bottleneck: up to 230% higher throughput, 70% lower latency, and ~20% memory savings compared to Redis OSS. In-place zero-downtime upgrade from Redis OSS is supported. Same cluster topology, same sorted set API, same client code."
      },
      {
        id: "C",
        text: "Switch to ElastiCache Memcached which is multi-threaded, providing better CPU utilization for high-throughput workloads.",
        isCorrect: false,
        explanation: "Wrong — Memcached is multi-threaded and does handle higher CPU concurrency, but Memcached does NOT support sorted sets (or any Redis data structures beyond simple key-value). The leaderboard use case requires sorted sets with ZADD/ZRANGE/ZRANK operations — Memcached cannot replicate this functionality."
      },
      {
        id: "D",
        text: "Enable ElastiCache Data Tiering (R6gd instances) to move cold data to NVMe SSD, freeing RAM for hot leaderboard data.",
        isCorrect: false,
        explanation: "Wrong — Data tiering (R6gd instances) moves ~80% of data to local NVMe SSD to reduce RAM costs, but data on SSD has higher access latency than RAM. For a leaderboard with high read/write throughput, tiering active sorted set data to SSD increases latency rather than reducing it. This doesn't address the single-threaded CPU bottleneck."
      }
    ],
    explanation: "ElastiCache for Valkey is the evolution path for Redis OSS on AWS. Valkey 8.0/8.1 I/O threading addresses the classic Redis single-threaded CPU bottleneck: up to 230% higher throughput, 70% lower latency, ~20% memory savings. Drop-in compatibility with Redis APIs (sorted sets, hashes, streams, pub/sub all work). 33% cheaper Serverless, 20% cheaper node-based vs Redis OSS. Zero-downtime in-place upgrade from Redis OSS. The exam answer for 'increase Redis throughput on same hardware without changing topology.'",
    keywords: ["Valkey I/O threading", "230% higher throughput", "Redis single-threaded bottleneck", "drop-in compatible", "in-place upgrade"]
  },

  // ─── d3-067 ── 3.4 Network ── Global Accelerator failover ── difficulty 3 ──────
  {
    id: "d3-067",
    domain: 3,
    taskStatement: "3.4",
    services: ["global-accelerator"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A financial trading platform exposes a global TCP API that processes real-time stock orders. Requirements: (1) Client firewall teams require TWO static, persistent IP addresses that never change; (2) If the primary region (us-east-1) becomes unhealthy, traffic must automatically failover to the DR region (eu-west-1) within 30 seconds; (3) The API does not serve cacheable content — every request requires reaching a live regional endpoint. Which service provides all three capabilities?",
    options: [
      {
        id: "A",
        text: "Amazon CloudFront with origin failover groups — primary origin in us-east-1 and secondary in eu-west-1.",
        isCorrect: false,
        explanation: "Wrong — CloudFront provides dynamic IP addresses (not static) at edge PoPs, which changes over time. Client firewall teams cannot whitelist dynamic CloudFront IPs. CloudFront origin failover also uses HTTP health checks with DNS-based routing, not the sub-30-second anycast failover of Global Accelerator."
      },
      {
        id: "B",
        text: "AWS Global Accelerator with two static anycast IPv4 addresses, endpoint groups in us-east-1 and eu-west-1, and health-check-based traffic dials.",
        isCorrect: true,
        explanation: "Correct — AWS Global Accelerator provides exactly 2 static anycast IPv4 addresses that never change (client firewalls can whitelist these permanently). Endpoint groups in multiple regions perform health checks on the regional endpoints. If us-east-1 becomes unhealthy, Global Accelerator automatically reroutes to eu-west-1 within approximately 30 seconds (sub-minute failover). Since Global Accelerator routes TCP traffic to the live endpoint without caching, every request reaches the regional application."
      },
      {
        id: "C",
        text: "Amazon Route 53 latency-based routing with health checks on the us-east-1 and eu-west-1 endpoints.",
        isCorrect: false,
        explanation: "Wrong — Route 53 provides DNS-based routing with no static IPs (DNS resolves dynamically). Client firewall teams cannot whitelist Route 53 IPs. Additionally, DNS TTLs mean failover takes minutes, not sub-30 seconds, as clients must wait for cached DNS entries to expire."
      },
      {
        id: "D",
        text: "An NLB with Elastic IPs in us-east-1 and a Route 53 health check to update the DNS record to eu-west-1 on failure.",
        isCorrect: false,
        explanation: "Wrong — NLB Elastic IPs provide static IPs within a single region, but client firewall teams would need separate IP whitelists for each region. DNS-based failover adds latency (DNS propagation + TTL expiry). Global Accelerator anycast IPs serve BOTH regions from the SAME 2 IPs, with routing handled at the network layer without DNS changes."
      }
    ],
    explanation: "AWS Global Accelerator is the exam answer for: static IPs + TCP/UDP global routing + health-check failover. Two static anycast IPv4 addresses serve all regions — clients whitelist 2 IPs once, forever. Anycast routing directs users to the nearest healthy endpoint group. Health checks per endpoint group enable automatic regional failover in ~30 seconds. Contrast with CloudFront: CloudFront = HTTP caching CDN (dynamic IPs, cacheable content); Global Accelerator = TCP/UDP routing (static IPs, non-cacheable, faster failover for latency-sensitive apps).",
    keywords: ["Global Accelerator static IPs", "anycast", "sub-30 second failover", "TCP non-cacheable", "two static IPv4"]
  },

  // ─── d3-068 ── 3.5 Data ── MSK KRaft vs ZooKeeper ── difficulty 4 ─────────────
  {
    id: "d3-068",
    domain: 3,
    taskStatement: "3.5",
    services: ["msk"],
    constraintType: "ops",
    difficulty: 4,
    type: "single",
    stem: "A data platform team runs an Amazon MSK cluster with Apache Kafka 3.7 using ZooKeeper mode. They want to migrate to KRaft mode (which eliminates ZooKeeper, supports more brokers per cluster, and is required for Kafka 4.0+). The team asks whether they can perform an in-place ZooKeeper-to-KRaft migration on the existing MSK cluster. Which statement accurately describes the migration path?",
    options: [
      {
        id: "A",
        text: "MSK supports in-place ZooKeeper-to-KRaft migration — apply the KRaft configuration setting in the console and MSK performs a rolling upgrade.",
        isCorrect: false,
        explanation: "Wrong — Amazon MSK does NOT support in-place ZooKeeper-to-KRaft migration. This is a documented limitation. To migrate from ZooKeeper to KRaft mode on MSK, a new MSK cluster must be created in KRaft mode and data must be migrated (via MSK Replicator or producer/consumer replay). There is no rolling in-place upgrade path."
      },
      {
        id: "B",
        text: "Amazon MSK does NOT support in-place ZooKeeper-to-KRaft migration — a new KRaft-mode MSK cluster must be created and data migrated separately.",
        isCorrect: true,
        explanation: "Correct — AWS documented that MSK does not support in-place ZK→KRaft migration. Teams must create a new MSK cluster configured for KRaft mode and migrate workloads (using MSK Replicator for topic replication or redirecting producers/consumers). KRaft mode benefits: eliminates ZooKeeper dependency, up to 60 brokers per cluster (vs 30 in ZooKeeper mode), available from Kafka 3.7+, required from Kafka 4.0+. Kafka 3.9 supports both ZK and KRaft; Kafka 4.0 is KRaft-only."
      },
      {
        id: "C",
        text: "KRaft mode is not yet available on Amazon MSK — it is only available for self-managed Apache Kafka.",
        isCorrect: false,
        explanation: "Wrong — Amazon MSK supports KRaft mode as of Kafka 3.7+ (GA May 2024). MSK customers can create NEW clusters with KRaft mode. The constraint is that you cannot migrate an EXISTING ZooKeeper cluster in-place — new clusters must be created."
      },
      {
        id: "D",
        text: "ZooKeeper mode is deprecated and MSK automatically converts all existing clusters to KRaft mode on the next maintenance window.",
        isCorrect: false,
        explanation: "Wrong — MSK does not automatically convert existing ZooKeeper clusters to KRaft mode. Automatic conversion would risk breaking existing workloads. Customers must explicitly create new KRaft clusters and migrate. ZooKeeper support ends with Kafka 4.0 (KRaft-only), but existing ZK-mode MSK clusters on Kafka 3.x continue to operate."
      }
    ],
    explanation: "MSK KRaft mode: available for Kafka 3.7+ on new MSK clusters. Benefits: no ZooKeeper nodes (reduces cluster complexity and cost), up to 60 brokers/cluster (vs 30 ZK), faster recovery. Critical exam fact: NO in-place ZK→KRaft migration on MSK — must create new cluster. Kafka 3.9 supports both modes. Kafka 4.0 = KRaft-only (no ZooKeeper). Migration tools: MSK Replicator (cross-cluster replication for topic data migration), Kafka MirrorMaker 2.",
    keywords: ["KRaft no in-place migration", "ZooKeeper to KRaft new cluster", "60 brokers KRaft", "Kafka 4.0 KRaft only", "MSK 3.7+"]
  },

  // ─── d3-069 ── 3.2 Compute ── Lambda memory CPU relationship ── difficulty 4 ──
  {
    id: "d3-069",
    domain: 3,
    taskStatement: "3.2",
    services: ["lambda"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A Lambda function performs CPU-intensive image thumbnail generation. Profiling shows the function runs for 3,000 ms at the current 512 MB memory setting. The Lambda is invoked 5 million times per month. A developer suggests: 'Increasing memory to 1,769 MB will give us a full vCPU which should halve the execution time to ~1,500 ms. Let's calculate whether the cost increases.' Assuming the halved execution time estimate is accurate, which statement correctly analyzes the cost impact of this memory increase?",
    options: [
      {
        id: "A",
        text: "Total cost always increases proportionally when memory doubles — the 3.45× memory increase always outweighs execution time savings.",
        isCorrect: false,
        explanation: "Wrong — Lambda billing is duration × memory (GB-seconds). Increasing memory increases the per-GB-second cost but also increases CPU (reducing duration). The net cost depends on the ratio of memory increase to execution time reduction. If memory increases 3.45× and duration halves, the GB-second product is: 3.45 × 0.5 = 1.725× — cost actually INCREASES by 72.5%. But this math is scenario-specific, not a universal rule."
      },
      {
        id: "B",
        text: "Lambda cost = GB-seconds = (memory in GB) × (duration in seconds) × (invocations). Going from 512 MB / 3,000 ms to 1,769 MB / 1,500 ms: GB-seconds change from (0.5 × 3.0) = 1.5 to (1.769 × 1.5) = 2.65 per invocation — a 77% cost INCREASE despite halving execution time.",
        isCorrect: true,
        explanation: "Correct — Lambda is priced per GB-second. Math: Before: 512 MB = 0.5 GB × 3.0 s = 1.5 GB-s per invocation. After: 1,769 MB ≈ 1.769 GB × 1.5 s = 2.65 GB-s per invocation. Cost increases ~77% per invocation. The key insight: to REDUCE Lambda cost, you need execution time to drop MORE than the proportional memory increase. At 1,769 MB (1 vCPU = 1,769 MB), you need <1,500 ms to break even. Use AWS Compute Optimizer or Lambda Power Tuning tool to find the optimal memory setting."
      },
      {
        id: "C",
        text: "Lambda cost is fixed per invocation regardless of memory and duration settings.",
        isCorrect: false,
        explanation: "Wrong — Lambda pricing has two components: (1) Number of requests ($0.20 per million), and (2) Duration (GB-seconds: memory × time). Duration-based billing makes memory and execution time directly impact cost. Higher memory = higher per-second billing rate."
      },
      {
        id: "D",
        text: "Going from 512 MB to 1,769 MB (3.45× more memory) always reduces Lambda cost by improving throughput per invocation.",
        isCorrect: false,
        explanation: "Wrong — Memory increase improves performance (more CPU) but does not automatically reduce cost. Lambda billing is GB-seconds. Unless the execution time reduction exceeds the memory increase ratio, cost goes up. The break-even: if memory increases 3.45×, duration must decrease by more than 71% (to below ~870 ms) for cost to decrease."
      }
    ],
    explanation: "Lambda cost optimization requires understanding GB-second billing: cost = (memory GB) × (duration seconds) × (invocations) × (price per GB-s). More memory = more CPU = faster execution, but net cost depends on the efficiency gain. If 3.45× memory gives only 2× speed, cost increases. Tools: AWS Lambda Power Tuning (open-source Step Functions state machine that tests multiple memory settings and finds the cost/perf optimum). Key: at 1,769 MB = 1 full vCPU. Performance gain is often non-linear — a function at 512 MB may be primarily I/O-bound, so more CPU doesn't help proportionally.",
    keywords: ["Lambda GB-seconds", "memory CPU proportional", "1769 MB 1 vCPU", "cost calculation", "Power Tuning"]
  },

  // ─── d3-070 ── 3.4 Network ── NAT Gateway vs Gateway VPC Endpoint ── diff 3 ───
  {
    id: "d3-070",
    domain: 3,
    taskStatement: "3.4",
    services: ["s3", "dynamodb"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company runs hundreds of Amazon EC2 instances in private subnets that write application logs directly to Amazon S3 and read configuration data from Amazon DynamoDB. The current architecture routes all S3 and DynamoDB traffic through a NAT Gateway, generating $18,000/month in NAT Gateway data processing fees (~$0.045/GB). A cost optimization review identifies this as a primary savings opportunity. The company wants to ELIMINATE the NAT Gateway data processing charges for S3 and DynamoDB traffic while keeping the EC2 instances in private subnets with no public IP addresses. Which change achieves this?",
    options: [
      {
        id: "A",
        text: "Move the EC2 instances to public subnets and assign Elastic IPs so they can reach S3 and DynamoDB directly.",
        isCorrect: false,
        explanation: "Wrong — Moving EC2 to public subnets and assigning Elastic IPs changes the security posture (instances become publicly addressable) and does not align with 'keeping EC2 instances in private subnets with no public IPs.' This is a security-architecture change, not a cost optimization."
      },
      {
        id: "B",
        text: "Create Gateway VPC Endpoints for S3 and DynamoDB in the VPC — traffic routes directly to these services via the VPC endpoint without leaving the AWS network and without incurring NAT Gateway data processing fees. Gateway VPC Endpoints are free.",
        isCorrect: true,
        explanation: "Correct — Gateway VPC Endpoints for S3 and DynamoDB are the only VPC endpoint type that is completely FREE (no hourly charge, no data processing charge). Traffic to S3 and DynamoDB from private subnets routes through the Gateway Endpoint directly to the service without traversing the NAT Gateway — eliminating all NAT data processing fees for those services. EC2 instances stay in private subnets. Update subnet route tables to add the S3/DynamoDB prefix list routes pointing to the Gateway Endpoint."
      },
      {
        id: "C",
        text: "Replace the NAT Gateway with a NAT instance (EC2-based) to eliminate per-GB data processing fees.",
        isCorrect: false,
        explanation: "Wrong — A NAT instance (EC2-based NAT) requires managing EC2 patching and HA configuration. More importantly, S3 and DynamoDB traffic through a NAT instance still incurs the NAT instance's bandwidth costs (EC2 data transfer + the instance hourly cost). Gateway VPC Endpoints eliminate the network path through any NAT, which is the structurally correct solution."
      },
      {
        id: "D",
        text: "Create Interface VPC Endpoints for S3 and DynamoDB in each AZ.",
        isCorrect: false,
        explanation: "Wrong — Interface VPC Endpoints for S3 and DynamoDB exist (S3 Interface Endpoint is useful for on-premises access via DX/VPN, where Gateway Endpoints don't work). However, Interface Endpoints charge hourly per-AZ ($0.01/AZ-hour) plus per-GB processing. For eliminating NAT costs on S3/DynamoDB for VPC-internal EC2, Gateway Endpoints are free and the cost-optimal answer. Interface Endpoints for S3 cost MORE than the NAT charges they replace for pure EC2→S3 intra-VPC traffic."
      }
    ],
    explanation: "Gateway VPC Endpoints for S3 and DynamoDB are the #1 AWS cost optimization for NAT Gateway charges: completely FREE (no per-hour, no per-GB), route traffic via route table prefix list (not ENI), works only within the VPC (cannot extend over peering/VPN/DX to on-premises — use S3 Interface Endpoint for that). Prevents S3/DynamoDB traffic from leaving the AWS network via NAT. Setup: create Gateway Endpoint → update route tables in private subnets to add the S3/DynamoDB managed prefix list. This is one of the fastest and easiest AWS cost optimizations available.",
    keywords: ["Gateway VPC Endpoint free", "S3 DynamoDB no NAT charges", "prefix list route table", "eliminate data processing fees", "private subnet"]
  }
]
