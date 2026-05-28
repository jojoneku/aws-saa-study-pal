import { Question } from "../lib/types"

export const domain3NewQuestions: Question[] = [
  // ─── d3-011 ── 3.1 Storage ── gp3 vs gp2 ── difficulty 2 ───────────────────
  {
    id: "d3-011",
    domain: 3,
    taskStatement: "3.1",
    services: ["ebs", "ec2"],
    constraintType: "performance",
    difficulty: 2,
    type: "single",
    stem: "A development team runs 200 Amazon EC2 instances, each with a single Amazon Elastic Block Store (Amazon EBS) gp2 volume. The operations team notices that many volumes under 1 TiB frequently exhaust their burst balance, causing IO performance to drop to the baseline of 3 IOPS per GiB. The team wants to eliminate burst credit exhaustion and also reduce storage costs. What is the MOST cost-effective change?",
    options: [
      {
        id: "A",
        text: "Migrate all gp2 volumes to io2 Block Express volumes provisioned at 3,000 IOPS.",
        isCorrect: false,
        explanation: "Wrong — io2 Block Express is purpose-built for mission-critical OLTP workloads requiring 256,000 IOPS, sub-500 µs latency, and 99.999% durability. Provisioning it at 3,000 IOPS for standard dev workloads is massive over-engineering and significantly more expensive than gp3."
      },
      {
        id: "B",
        text: "Migrate all gp2 volumes to gp3 volumes.",
        isCorrect: true,
        explanation: "Correct — Amazon EBS gp3 provides a baseline of 3,000 IOPS and 125 MiB/s throughput at any volume size with NO burst credit mechanism. There is no burst balance to exhaust. gp3 is also approximately 20% cheaper per GiB than gp2. The migration is online (no downtime required via Elastic Volumes) and eliminates both the performance cliff and the cost premium."
      },
      {
        id: "C",
        text: "Increase each gp2 volume size to 1 TiB so the baseline IOPS reaches 3,000.",
        isCorrect: false,
        explanation: "Wrong — gp2 IOPS = 3 IOPS/GiB. A 1 TiB gp2 volume achieves 3,000 IOPS baseline, but this doubles storage cost (paying for unused capacity). The burst credit exhaustion problem still exists above 3,000 IOPS demand. gp3 is the correct solution."
      },
      {
        id: "D",
        text: "Enable Fast Snapshot Restore on each gp2 volume.",
        isCorrect: false,
        explanation: "Wrong — Fast Snapshot Restore pre-initializes volumes created from snapshots to eliminate lazy loading. It does not change the burst credit behavior of gp2 volumes that are already running and does not address the burst balance exhaustion problem."
      }
    ],
    explanation: "Amazon EBS gp3 replaced gp2 as the recommended general-purpose SSD volume type. The critical difference: gp3 provides a guaranteed 3,000 IOPS + 125 MiB/s baseline at ALL sizes with no burst credit system — there is no 'BurstBalance' metric on gp3. gp2 volumes smaller than 1 TiB rely on burst credits, and when credits are exhausted performance drops to 3 IOPS/GiB. gp3 is also ~20% cheaper per GiB. Additional IOPS (up to 16,000) and throughput (up to 1,000 MiB/s) can be independently provisioned on gp3. Online migration from gp2 to gp3 requires no instance stop.",
    keywords: ["burst balance", "gp2 vs gp3", "3000 IOPS baseline", "no burst credits", "cost-effective"]
  },

  // ─── d3-012 ── 3.1 Storage ── S3 Express One Zone ── difficulty 3 ──────────
  {
    id: "d3-012",
    domain: 3,
    taskStatement: "3.1",
    services: ["s3-express", "ec2"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A machine learning team runs distributed GPU training jobs on Amazon EC2 P5 instances in a single Availability Zone. Training requires reading millions of small input files repeatedly from object storage. The team currently uses Amazon S3 Standard and finds that object read latency creates a GPU utilization bottleneck. The data is transient — it does not need to survive an AZ failure. Which storage solution MOST reduces training time?",
    options: [
      {
        id: "A",
        text: "Use Amazon S3 Standard with S3 Transfer Acceleration enabled.",
        isCorrect: false,
        explanation: "Wrong — S3 Transfer Acceleration is designed for globally-distributed clients uploading to a single region via CloudFront edge ingress. It does not improve latency for EC2 instances within the same region. Training jobs co-located with the S3 bucket already use direct regional paths."
      },
      {
        id: "B",
        text: "Enable S3 Byte-Range Fetches to parallelize reads of each training file.",
        isCorrect: false,
        explanation: "Wrong — Byte-range fetches parallelize reads of large individual objects. For millions of small files, each file requires a separate HTTP request regardless. Byte-range fetches reduce per-object latency only when files are large enough to benefit from parallel chunk reads."
      },
      {
        id: "C",
        text: "Switch to Amazon S3 Express One Zone directory buckets co-located in the same Availability Zone as the training instances.",
        isCorrect: true,
        explanation: "Correct — Amazon S3 Express One Zone provides single-digit millisecond latency (10× faster than S3 Standard), up to 2 million GET/s and 200,000 PUT/s per bucket, and uses session-based authentication (CreateSession) for high-frequency access patterns. Directory buckets are designed specifically for AI/ML training data co-located with compute. Since the data is transient (tolerable AZ-level loss), the single-AZ durability model is acceptable."
      },
      {
        id: "D",
        text: "Migrate the training data to an Amazon EFS file system mounted on all training instances.",
        isCorrect: false,
        explanation: "Wrong — Amazon EFS provides shared NFS access across instances. For P5 GPU training, EFS throughput (max 3 GiB/s read with Elastic mode) becomes a bottleneck at scale. S3 Express One Zone provides 2 million GETs/s vs EFS's throughput ceiling, and eliminates NFS protocol overhead. EFS is better suited to shared POSIX file access workloads, not high-parallelism ML data loading."
      }
    ],
    explanation: "Amazon S3 Express One Zone is the purpose-built solution for AI/ML training data colocation with compute. Key characteristics: single-digit ms latency (vs 100–500 ms for S3 Standard), up to 2M GET/s per bucket, session-based auth (single CreateSession call amortizes auth overhead across millions of requests), CRC32 default checksum (MD5 not supported). Tradeoff: single-AZ only (99.95% availability). April 2025 price cuts (31% storage, 55% PUT, 85% GET) make it even more cost-competitive for training workloads.",
    keywords: ["ML training", "single-digit millisecond", "10x faster", "co-located compute", "S3 Express One Zone"]
  },

  // ─── d3-013 ── 3.1 Storage ── FSx Lustre HPC ── difficulty 3 ───────────────
  {
    id: "d3-013",
    domain: 3,
    taskStatement: "3.1",
    services: ["fsx-lustre", "s3", "efs"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A computational fluid dynamics (CFD) team runs simulations on a 200-node HPC cluster. Each job reads a 10 TB input dataset from Amazon S3, processes it with hundreds of nodes writing intermediate scratch files simultaneously, then writes results back to S3. The team needs parallel access to the scratch dataset with sub-millisecond latency and the HIGHEST possible aggregate throughput. Which storage solution satisfies these requirements?",
    options: [
      {
        id: "A",
        text: "Amazon EFS General Purpose with Elastic throughput mode, with the S3 dataset copied to EFS at job start.",
        isCorrect: false,
        explanation: "Wrong — Amazon EFS General Purpose provides up to 3 GiB/s read throughput with Elastic mode. While EFS scales well, it uses NFS protocol which has higher per-operation overhead than Lustre's native POSIX parallel I/O. For HPC simulations requiring maximum parallel throughput and sub-millisecond latency, FSx for Lustre with EFA is the correct solution."
      },
      {
        id: "B",
        text: "Amazon FSx for NetApp ONTAP with NFS access from all cluster nodes.",
        isCorrect: false,
        explanation: "Wrong — Amazon FSx for NetApp ONTAP is designed for multi-protocol enterprise workloads (NFS + SMB + iSCSI), hybrid cloud, and database use cases. It does not provide the HPC-grade parallel I/O performance of FSx for Lustre, which is purpose-built for HPC with Data Repository Association (DRA) for S3 integration."
      },
      {
        id: "C",
        text: "Amazon FSx for Lustre (Persistent 2) with a Data Repository Association to the S3 bucket and Elastic Fabric Adapter (EFA) networking.",
        isCorrect: true,
        explanation: "Correct — Amazon FSx for Lustre is purpose-built for HPC workloads: sub-millisecond SSD latency, parallel POSIX I/O, up to 1,200 Gbps aggregate throughput per client (Persistent 2 + EFA), and Data Repository Associations (DRA) that lazy-load from S3 on demand and write back via DataRepositoryTask. FSx for Lustre + Cluster Placement Group + EFA is the canonical AWS HPC pattern."
      },
      {
        id: "D",
        text: "Instance store NVMe on each cluster node with rsync-based synchronization to S3 after job completion.",
        isCorrect: false,
        explanation: "Wrong — Instance store NVMe is local to each individual node and is not shared. Hundreds of nodes writing 'intermediate scratch files simultaneously' requires a shared parallel file system, which instance store cannot provide. rsync synchronization also adds post-job overhead and does not provide the lazy-load DRA pattern."
      }
    ],
    explanation: "FSx for Lustre is the AWS answer for HPC parallel storage. The exam pattern is: HPC cluster + parallel I/O + S3 data source → FSx for Lustre + EFA + Cluster Placement Group + DRA to S3. Data Repository Associations enable lazy loading (files loaded on first access from S3) and batch write-back via DataRepositoryTask. FSx for Lustre Persistent 2 provides 125–1,000 MB/s/TiB throughput tiers on SSD. EFA + GPU Direct Storage enables near-wire-speed data paths from S3 through Lustre to GPU memory.",
    keywords: ["HPC", "parallel I/O", "sub-millisecond", "Data Repository Association", "CFD simulation"]
  },

  // ─── d3-014 ── 3.1 Storage ── FSx for Windows vs FSx ONTAP ── difficulty 3 ─
  {
    id: "d3-014",
    domain: 3,
    taskStatement: "3.1",
    services: ["fsx-windows", "fsx-ontap"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A financial services company runs SQL Server on Amazon EC2 using a Failover Cluster Instance (FCI). Both nodes must share the same block storage volume (iSCSI) for the cluster quorum and database files. The file sharing must also support SMB access for application servers querying report files from the same storage. Active Directory integration is mandatory. Which AWS managed file system satisfies all these requirements?",
    options: [
      {
        id: "A",
        text: "Amazon EFS with NFS mounts on both SQL Server nodes and SMB Proxy for Windows access.",
        isCorrect: false,
        explanation: "Wrong — Amazon EFS is a Linux NFS file system. It does not support iSCSI block access, SMB natively, or Windows Active Directory authentication. SQL Server FCI requires iSCSI shared block storage (or Continuously Available SMB shares), neither of which EFS provides."
      },
      {
        id: "B",
        text: "Amazon FSx for Windows File Server with Continuously Available (CA) shares.",
        isCorrect: false,
        explanation: "Wrong — FSx for Windows provides SMB-based Continuously Available shares that are supported by SQL Server FCI as of SQL Server 2012. However, FSx for Windows does NOT support iSCSI block storage. If the question requires both iSCSI and SMB from the same storage, ONTAP is the answer."
      },
      {
        id: "C",
        text: "Amazon FSx for NetApp ONTAP with iSCSI LUNs for SQL Server FCI and NFS/SMB for application server access.",
        isCorrect: true,
        explanation: "Correct — Amazon FSx for NetApp ONTAP is the only AWS managed file system supporting NFS v3/v4/v4.1, SMB v2/v3, AND iSCSI from the same storage system. This enables SQL Server FCI to use iSCSI LUNs for shared block storage while application servers simultaneously access report files over SMB. Active Directory integration is natively supported."
      },
      {
        id: "D",
        text: "Amazon EBS io2 Block Express with Multi-Attach enabled, accessed over NVMe from both cluster nodes.",
        isCorrect: false,
        explanation: "Wrong — EBS Multi-Attach (io2 only, up to 16 Nitro instances in same AZ) provides shared block access but requires a cluster-aware filesystem (GFS2, OCFS2, Oracle ASM). It does NOT support SMB for application server report file access, which is a hard requirement in this scenario."
      }
    ],
    explanation: "Amazon FSx for NetApp ONTAP is the only AWS storage service offering multi-protocol access (NFS + SMB + iSCSI) from a single storage system. This makes it the correct choice for mixed-workload requirements where SQL Server FCI needs iSCSI shared block storage AND Windows application servers need SMB file access simultaneously. FSx for Windows File Server only supports SMB. FSx for Lustre only supports POSIX/NFS. ONTAP also provides NetApp SnapMirror replication, FlexClone, and FlexGroup volumes.",
    keywords: ["iSCSI", "SMB", "multi-protocol", "SQL Server FCI", "Active Directory", "FSx ONTAP"]
  },

  // ─── d3-015 ── 3.2 Compute ── Lambda Provisioned Concurrency ── difficulty 3 ─
  {
    id: "d3-015",
    domain: 3,
    taskStatement: "3.2",
    services: ["lambda", "provisioned-concurrency"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A payment gateway API uses a Node.js AWS Lambda function. The function has a 300 ms average execution time and experiences cold starts of 800 ms only when new execution environments are initialized. Traffic follows a predictable weekday pattern — near zero overnight (10 PM–7 AM) and a peak of 500 concurrent requests during business hours (9 AM–5 PM). The team needs sub-100 ms response time on ALL requests including cold starts, while MINIMIZING cost. Which configuration achieves this?",
    options: [
      {
        id: "A",
        text: "Enable Lambda SnapStart on the Node.js function.",
        isCorrect: false,
        explanation: "Wrong — Lambda SnapStart is available for Java 11+, Python 3.12+, and .NET 8+ runtimes. It is NOT supported for Node.js. The question specifies a Node.js function, so SnapStart is not applicable."
      },
      {
        id: "B",
        text: "Set Lambda Reserved Concurrency to 600 to ensure enough capacity is available.",
        isCorrect: false,
        explanation: "Wrong — Lambda Reserved Concurrency sets a CAP on maximum concurrent executions and guarantees that capacity is available (reserved from the account pool). It does NOT pre-warm execution environments and does NOT eliminate cold starts. Reserved Concurrency is free but only controls throughput limits."
      },
      {
        id: "C",
        text: "Configure Lambda Provisioned Concurrency at 500 concurrent environments, scheduled to activate at 8:45 AM and deactivate at 5:15 PM on weekdays using Application Auto Scaling scheduled actions.",
        isCorrect: true,
        explanation: "Correct — Provisioned Concurrency pre-initializes execution environments, completely eliminating cold start latency (sub-ms cold start). Scheduling it only during business hours (8:45 AM–5:15 PM weekdays) via Application Auto Scaling scheduled actions avoids charging for provisioned environments during the overnight idle period. This balances zero cold-start performance with cost minimization."
      },
      {
        id: "D",
        text: "Keep 500 Provisioned Concurrency environments active 24/7 to guarantee sub-100 ms at all times.",
        isCorrect: false,
        explanation: "Wrong — 24/7 Provisioned Concurrency is unnecessary when traffic is near-zero for 9+ hours overnight. Provisioned Concurrency is billed per GB-second even when idle. Scheduling it only during business hours achieves the same performance at significantly lower cost."
      }
    ],
    explanation: "Provisioned Concurrency is the correct tool to eliminate Lambda cold starts when SnapStart is not available (e.g., Node.js). The cost optimization key is scheduling: Application Auto Scaling supports scheduled scaling actions for Provisioned Concurrency, enabling teams to activate pre-warming before peak hours and deactivate during idle periods. Reserved Concurrency (free) caps concurrent executions but does NOT warm environments. Only Provisioned Concurrency guarantees sub-ms cold start performance — the difference is purely cost vs performance tradeoff.",
    keywords: ["cold start elimination", "Provisioned Concurrency", "scheduled scaling", "sub-100ms", "Node.js"]
  },

  // ─── d3-016 ── 3.2 Compute ── Graviton + ECS ── difficulty 3 ────────────────
  {
    id: "d3-016",
    domain: 3,
    taskStatement: "3.2",
    services: ["graviton", "ecs", "fargate"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A company runs a high-throughput data processing service on Amazon ECS using AWS Fargate with x86-based container images. A performance review finds that each task consumes 4 vCPU and 8 GB memory and the workload is CPU-bound. The engineering team wants to INCREASE compute throughput for the same workload while REDUCING per-task cost. The application is written in Go and has no dependencies on x86-specific libraries. Which change achieves both goals simultaneously?",
    options: [
      {
        id: "A",
        text: "Double the Fargate task size to 8 vCPU and 16 GB memory to increase throughput.",
        isCorrect: false,
        explanation: "Wrong — Doubling task size doubles cost. While it increases per-task throughput, it does not improve price-performance — you are paying 2× for 2× throughput with no efficiency gain."
      },
      {
        id: "B",
        text: "Rebuild the container images for the ARM64 architecture and update the ECS task definition to use the ARM64 platform, running on Fargate with Graviton-based compute.",
        isCorrect: true,
        explanation: "Correct — AWS Graviton (ARM64) processors provide up to 40% better price-performance than equivalent x86 instances/Fargate configurations. For a Go application (which compiles natively to ARM64), rebuilding with GOARCH=arm64 produces a fully native binary. ECS Fargate supports ARM64 platform selection. The same 4 vCPU / 8 GB task delivers higher throughput per dollar — AWS charges less for ARM64 Fargate while Graviton delivers more CPU performance per core."
      },
      {
        id: "C",
        text: "Switch from Fargate to EC2 launch type with c6i.2xlarge instances for better CPU performance.",
        isCorrect: false,
        explanation: "Wrong — c6i.2xlarge provides 8 vCPU at high frequency for compute-optimized workloads. However, switching from Fargate to EC2 launch type introduces instance management overhead (patching, capacity planning) and does not simultaneously improve price-performance as effectively as switching to Graviton for a Go workload."
      },
      {
        id: "D",
        text: "Enable ECS capacity provider with Spot Fargate to reduce costs.",
        isCorrect: false,
        explanation: "Wrong — Fargate Spot reduces costs by up to 70% for interruption-tolerant workloads. However, the question asks for INCREASED throughput AND reduced cost simultaneously. Fargate Spot does not change the underlying compute performance — you get the same vCPU/memory spec at a discount, not higher throughput."
      }
    ],
    explanation: "AWS Graviton-based Fargate tasks deliver approximately 40% better price-performance for CPU-bound workloads vs x86 Fargate. For Go, Python, Java, and .NET workloads, ARM64 binaries run natively and often faster on Graviton's modern microarchitecture. The migration path is: (1) Add multi-arch build to CI/CD (docker buildx for linux/arm64), (2) Update ECS task definition runtimePlatform to cpuArchitecture: ARM64, (3) Update Fargate capacity provider. No infrastructure changes required. AWS charges less per Fargate ARM64 vCPU-hour while delivering higher throughput per vCPU.",
    keywords: ["Graviton", "ARM64", "price-performance", "40% better", "ECS Fargate", "Go application"]
  },

  // ─── d3-017 ── 3.2 Compute ── EC2 Placement Groups ── difficulty 4 ──────────
  {
    id: "d3-017",
    domain: 3,
    taskStatement: "3.2",
    services: ["ec2"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "An HPC research team needs to deploy a tightly-coupled MPI simulation that requires the LOWEST possible network latency between all 12 instances. A separate team needs to deploy a distributed Apache Kafka cluster across 12 instances where each broker must run on physically separate hardware to minimize correlated failure. Which placement group types should be used respectively?",
    options: [
      {
        id: "A",
        text: "Cluster placement group for MPI; Partition placement group for Kafka.",
        isCorrect: true,
        explanation: "Correct — Cluster placement group places all instances on the same rack in a single AZ, providing 10/25 Gbps single-flow bandwidth and the lowest possible network latency for tightly-coupled MPI workloads. Partition placement group logically separates instances into up to 7 partitions per AZ (max 7 partitions/AZ), where each partition maps to a separate physical server rack — ideal for Kafka brokers needing physical isolation to limit correlated rack failures."
      },
      {
        id: "B",
        text: "Spread placement group for MPI; Cluster placement group for Kafka.",
        isCorrect: false,
        explanation: "Wrong — Spread placement group puts each instance on physically separate hardware (max 7 instances per AZ) — this is for fault isolation of critical small clusters, NOT for low latency. Cluster placement group co-locates instances for low latency, which is wrong for Kafka where broker separation is the goal."
      },
      {
        id: "C",
        text: "Partition placement group for MPI; Spread placement group for Kafka.",
        isCorrect: false,
        explanation: "Wrong — Partition placement groups are designed for large distributed systems (Kafka, Cassandra, HDFS) where you want to know which partition (rack) each instance is on. They do not provide single-rack co-location for low latency. Spread limits to 7 instances per AZ — insufficient for a 12-broker Kafka deployment spanning multiple AZs."
      },
      {
        id: "D",
        text: "Cluster placement group for both MPI and Kafka.",
        isCorrect: false,
        explanation: "Wrong — A Cluster placement group co-locates all instances on the same rack. For Kafka, this creates a single point of failure (one rack failure takes down all brokers simultaneously). Kafka requires rack-aware placement for fault tolerance, which Partition placement groups provide."
      }
    ],
    explanation: "Placement group selection maps directly to the architectural goal: Cluster PG = LOWEST LATENCY (same rack, same AZ, 10/25 Gbps single-flow) for tightly coupled HPC/MPI. Partition PG = FAULT ISOLATION FOR LARGE CLUSTERS (max 7 partitions/AZ, each partition = separate rack, Kafka/HDFS/Cassandra aware of which partition/rack they're on). Spread PG = MAXIMUM ISOLATION FOR SMALL CRITICAL CLUSTERS (max 7 instances/AZ, each on separate HW). Spread is not suitable for 12+ instances unless multi-AZ.",
    keywords: ["cluster placement group", "partition placement group", "MPI low latency", "Kafka fault isolation", "7 partitions per AZ"]
  },

  // ─── d3-018 ── 3.3 Database ── Aurora Global + write forwarding ── diff 4 ───
  {
    id: "d3-018",
    domain: 3,
    taskStatement: "3.3",
    services: ["aurora-global", "aurora"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A globally distributed SaaS platform uses Amazon Aurora MySQL Global Database with a primary region in us-east-1 and a secondary region in eu-west-1. Application servers in eu-west-1 currently connect to the us-east-1 writer endpoint for all write operations, adding 90 ms of cross-region latency to every write. The data team wants eu-west-1 application servers to send writes to a eu-west-1 endpoint WITHOUT changing the application's database connection string or performing a failover. Which Aurora feature enables this?",
    options: [
      {
        id: "A",
        text: "Promote the eu-west-1 secondary cluster to the primary to make it the global writer.",
        isCorrect: false,
        explanation: "Wrong — Promoting a secondary to primary is a failover/switchover operation. It changes which region is the global primary and requires updating connection strings across all regions. The question explicitly requires no failover and no connection string change."
      },
      {
        id: "B",
        text: "Enable Aurora Global Database write forwarding on the eu-west-1 secondary cluster.",
        isCorrect: true,
        explanation: "Correct — Aurora Global Database write forwarding allows applications connected to a secondary region's writer endpoint to send write statements. The secondary cluster transparently forwards writes to the primary region (us-east-1) over the storage replication path without requiring the application to change its connection string or perform a failover. Reads are still served locally. Note: DDL statements and transactions are not forwarded."
      },
      {
        id: "C",
        text: "Deploy an RDS Proxy in eu-west-1 that routes writes to the us-east-1 Aurora writer endpoint.",
        isCorrect: false,
        explanation: "Wrong — RDS Proxy provides connection pooling and failover acceleration, but it does not reduce the 90 ms cross-region latency — it still forwards writes to us-east-1. Write forwarding is built into Aurora Global Database itself and is the purpose-built solution for this exact scenario."
      },
      {
        id: "D",
        text: "Add Aurora read replicas in eu-west-1 within the primary us-east-1 cluster for lower read latency.",
        isCorrect: false,
        explanation: "Wrong — Aurora supports up to 15 read replicas within a single region cluster. Cross-region read replicas are a different concept from Aurora Global Database secondaries. In-region replicas cannot accept write forwarding from eu-west-1 to eu-west-1. This does not address write latency from the eu-west-1 application servers."
      }
    ],
    explanation: "Aurora Global Database write forwarding is a feature that allows secondary region endpoints to accept write operations and transparently route them to the global primary — without a failover and without application changes. This reduces the operational burden of write routing in multi-region applications. Key limitations: DDL statements and certain transaction types are not forwarded. Write forwarding adds the cross-region replication round-trip to commit latency (better than direct connection to primary since the secondary's writer endpoint is closer to the app server, but still incurs cross-region latency for the forwarded write).",
    keywords: ["write forwarding", "Aurora Global Database", "secondary region writes", "no failover", "cross-region"]
  },

  // ─── d3-019 ── 3.3 Database ── ElastiCache Memcached vs Redis ── diff 4 ─────
  {
    id: "d3-019",
    domain: 3,
    taskStatement: "3.3",
    services: ["elasticache-redis", "elasticache-memcached"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "An engineering team is selecting an Amazon ElastiCache engine for two separate use cases: (A) a session store that must survive a node failure without losing any active user sessions, and (B) a simple HTML fragment cache that is CPU-bound and needs to scale horizontally across many threads as cheaply as possible and can tolerate cache misses if a node fails. Which engine should each use case select?",
    options: [
      {
        id: "A",
        text: "A: Memcached, B: Redis/Valkey",
        isCorrect: false,
        explanation: "Wrong — Memcached has no replication and no persistence. If a Memcached node fails, all data stored on that node is permanently lost. Use case A (session store that must survive node failures) requires Redis/Valkey replication, which Memcached cannot provide."
      },
      {
        id: "B",
        text: "A: Redis/Valkey, B: Memcached",
        isCorrect: true,
        explanation: "Correct — Redis/Valkey supports replication (primary + up to 5 read replicas per shard) and optional persistence (AOF/RDB snapshots), making it suitable for session data that must survive node failures. Memcached is multi-threaded (unlike Redis's single-threaded architecture) with no replication or persistence — optimal for a stateless, horizontally-scalable HTML fragment cache where cache misses are acceptable and multi-threaded CPU utilization matters."
      },
      {
        id: "C",
        text: "A: Redis/Valkey, B: Redis/Valkey with cluster mode enabled",
        isCorrect: false,
        explanation: "Wrong — Redis cluster mode enables sharding across up to 500 shards, but it is overkill for a simple HTML fragment cache. Memcached is explicitly multi-threaded and cheaper for simple key-value caching when no replication is needed. Using Redis for both is technically possible but ignores Memcached's architectural advantage for multi-threaded CPU-bound workloads."
      },
      {
        id: "D",
        text: "A: Memcached with ElastiCache Multi-AZ, B: Redis/Valkey",
        isCorrect: false,
        explanation: "Wrong — ElastiCache Memcached does NOT support Multi-AZ replication. Each Memcached node is standalone with no replica. There is no Multi-AZ or replication feature in Memcached. This is a common exam trap. Only Redis/Valkey supports replication and Multi-AZ in ElastiCache."
      }
    ],
    explanation: "The ElastiCache engine decision: Redis/Valkey when you need replication (read replicas, Multi-AZ), persistence (RDB/AOF snapshots), advanced data structures (sorted sets, streams, pub/sub), Lua scripting, or transactions. Memcached when you need multi-threaded horizontal scaling, simple key-value caching with no persistence, and the lowest possible cost/complexity. CRITICAL EXAM TRAP: ElastiCache Memcached does NOT support replication. If a Memcached node fails, all data on that node is lost with no automatic recovery.",
    keywords: ["Memcached no replication", "Redis replication", "session store", "node failure", "multi-threaded"]
  },

  // ─── d3-020 ── 3.3 Database ── MemoryDB vs ElastiCache ── difficulty 4 ──────
  {
    id: "d3-020",
    domain: 3,
    taskStatement: "3.3",
    services: ["memorydb", "elasticache-redis"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A fintech startup builds a real-time trading ledger that tracks every trade position update. The data store must provide microsecond read latency for lookups, serve as the PRIMARY database (not a cache — data cannot be lost under any single-node failure), and support Redis-compatible commands for sorted sets and list operations already built into the application. Which service satisfies all three requirements?",
    options: [
      {
        id: "A",
        text: "Amazon ElastiCache for Valkey with cluster mode enabled and Multi-AZ replication.",
        isCorrect: false,
        explanation: "Wrong — ElastiCache for Valkey provides microsecond read latency and Multi-AZ replication. However, ElastiCache is fundamentally a caching layer — it uses asynchronous replication and its persistence (AOF/RDB) is best-effort. A failover can result in a brief window where in-flight writes to the primary are lost before they replicate to the replica. This does not guarantee zero data loss for a PRIMARY trading ledger."
      },
      {
        id: "B",
        text: "Amazon MemoryDB for Valkey.",
        isCorrect: true,
        explanation: "Correct — Amazon MemoryDB is purpose-built as a durable, Redis-compatible primary database. It uses a distributed multi-AZ transaction log (similar to a write-ahead log) to persist every write before acknowledging it to the client. This guarantees zero data loss on single-node failure while still providing microsecond reads and single-digit-millisecond writes. MemoryDB supports all Redis/Valkey data structures including sorted sets and lists."
      },
      {
        id: "C",
        text: "Amazon DynamoDB with DAX caching for microsecond reads.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB + DAX provides microsecond read latency for DynamoDB key lookups. However, the application is already built with Redis-compatible commands (sorted sets, list operations). Migrating to DynamoDB requires rewriting the application query layer to use DynamoDB's API, which is not Redis-compatible."
      },
      {
        id: "D",
        text: "Amazon ElastiCache for Redis with AOF (append-only file) persistence enabled.",
        isCorrect: false,
        explanation: "Wrong — Redis AOF persistence writes each command to a log file. However, ElastiCache Redis AOF is asynchronous — there is still a window between a write acknowledgment and the AOF flush where data can be lost on a crash. AOF in ElastiCache is not a strong durability guarantee equivalent to MemoryDB's transaction log."
      }
    ],
    explanation: "Amazon MemoryDB for Valkey/Redis is designed exactly for use cases that need Redis-compatible commands AND primary database durability guarantees. Unlike ElastiCache (which is ephemeral cache with best-effort persistence), MemoryDB writes every operation to a durable multi-AZ transaction log before acknowledging. This gives: microsecond reads (data in memory), single-digit-ms writes (transaction log overhead), 99.99% availability, and zero-data-loss guarantees. Use MemoryDB as a primary database; use ElastiCache as a cache in front of a durable database.",
    keywords: ["MemoryDB", "primary database", "durable", "transaction log", "microsecond reads", "Redis-compatible"]
  },

  // ─── d3-021 ── 3.3 Database ── Aurora Serverless scale-to-zero ── diff 3 ────
  {
    id: "d3-021",
    domain: 3,
    taskStatement: "3.3",
    services: ["aurora"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A startup SaaS product runs an Amazon Aurora PostgreSQL database that handles unpredictable bursty traffic — hundreds of transactions per second during product demos and near-zero traffic overnight and on weekends. The team wants to pay nothing for database compute during idle periods while still resuming within 15 seconds when traffic arrives. Which Aurora configuration achieves this?",
    options: [
      {
        id: "A",
        text: "Aurora Provisioned with a scheduled Lambda function that stops the cluster at 10 PM and starts it at 7 AM daily.",
        isCorrect: false,
        explanation: "Wrong — Stopped Aurora provisioned instances automatically restart after 7 days regardless of schedule. A Lambda-based stop/start also requires maintaining the scheduling logic and cannot account for unscheduled demo traffic. Resume from a full stop is also slower than Aurora serverless resume (~1–2 minutes vs ~15 seconds)."
      },
      {
        id: "B",
        text: "Aurora serverless (Aurora Serverless v2) with minimum capacity set to 0 Aurora Capacity Units (ACUs) and the auto-pause threshold set to 5 minutes.",
        isCorrect: true,
        explanation: "Correct — Aurora serverless with scale-to-zero (GA November 2024) sets minimum ACUs to 0, causing the database to auto-pause after the configured idle period (5 minutes–24 hours). Compute cost is $0 when paused — only storage is billed. On the first connection after pause, the database resumes in approximately 15 seconds. This handles unpredictable burst traffic without 24/7 compute charges."
      },
      {
        id: "C",
        text: "Aurora serverless with minimum capacity set to 0.5 ACUs to avoid the cold resume latency.",
        isCorrect: false,
        explanation: "Wrong — Setting minimum ACUs to 0.5 (above zero) means the database never pauses — compute is always billed. This eliminates the scale-to-zero cost savings that the question requires. If resume latency is the concern, a pre-connection 'warm-up ping' strategy is better than keeping minimum ACUs above zero."
      },
      {
        id: "D",
        text: "Aurora MySQL Global Database in provisioned mode with a secondary region for read scaling during demos.",
        isCorrect: false,
        explanation: "Wrong — Aurora Global Database (provisioned) runs full provisioned clusters 24/7 in multiple regions. It is designed for global multi-region HA and read scaling, not for eliminating compute costs during idle periods. It would dramatically increase costs compared to serverless."
      }
    ],
    explanation: "Aurora serverless scale-to-zero (minimum 0 ACUs, GA November 2024) is the exam answer for 'pay nothing during idle periods' with a relational Aurora database. Key facts: auto-pauses after 5 min–24 h of inactivity, resumes in ~15 seconds, blocked by: RDS Proxy, zero-ETL to Redshift, Global DB secondary writer, and engine-level scheduled jobs (pg_cron, MySQL event scheduler). This replaced Aurora Serverless v1 (retired December 31, 2024). Storage continues to be billed even when paused.",
    keywords: ["scale-to-zero", "0 ACUs", "auto-pause", "15 seconds resume", "pay nothing idle"]
  },

  // ─── d3-022 ── 3.3 Database ── DynamoDB capacity modes ── difficulty 3 ──────
  {
    id: "d3-022",
    domain: 3,
    taskStatement: "3.3",
    services: ["dynamodb"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A retail company's Amazon DynamoDB table processes orders during normal operations at 500 WCU/s and 2,000 RCU/s. During flash sales (3–4 times per year, lasting 2 hours), traffic spikes to 15,000 WCU/s and 60,000 RCU/s within minutes. The spikes are not predictable with enough lead time to manually scale provisioned capacity. The team cannot tolerate any throttling during flash sales. Which capacity configuration minimizes cost while eliminating throttling risk?",
    options: [
      {
        id: "A",
        text: "Provisioned capacity at 15,000 WCU/s and 60,000 RCU/s year-round with Reserved Capacity discounts.",
        isCorrect: false,
        explanation: "Wrong — Provisioning at peak capacity 24/7 for 3–4 flash sales per year means paying for 30× over-provisioned capacity for 99%+ of the year. Even with Reserved Capacity discounts, this far exceeds the cost of On-Demand mode, which only charges for actual consumed capacity."
      },
      {
        id: "B",
        text: "Provisioned capacity at 500 WCU/s and 2,000 RCU/s with DynamoDB Adaptive Capacity to absorb spikes.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB Adaptive Capacity automatically shifts capacity between partitions within the provisioned limit, but it does NOT increase the table's total provisioned throughput above what is configured. A spike to 15,000 WCU/s on a table provisioned at 500 WCU/s will cause massive throttling regardless of Adaptive Capacity."
      },
      {
        id: "C",
        text: "On-Demand capacity mode.",
        isCorrect: true,
        explanation: "Correct — DynamoDB On-Demand mode instantly accommodates any traffic level up to the doubled-previous-peak ceiling with no throttling and no advance capacity configuration. For a workload with predictable normal traffic and rare, unpredictable spikes, On-Demand eliminates throttling risk. After the November 2024 50% price reduction, On-Demand cost at normal traffic (500 WCU/s + 2,000 RCU/s) is far lower than 24/7 provisioned peak capacity."
      },
      {
        id: "D",
        text: "Provisioned capacity at 500 WCU/s with DynamoDB Auto Scaling configured to scale up to 15,000 WCU/s.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB Auto Scaling uses CloudWatch alarms and Application Auto Scaling to adjust provisioned capacity. It reacts to sustained utilization over several minutes — it CANNOT respond to a spike that goes from 500 to 15,000 WCU/s 'within minutes.' The scaling response time (minutes) introduces a throttling window during rapid traffic increases."
      }
    ],
    explanation: "DynamoDB On-Demand mode is the correct choice for workloads with unpredictable, sudden spikes that cannot be anticipated in time for Auto Scaling to react. On-Demand instantly accommodates up to 2× the previous peak within a 30-minute window (and AWS can grant more on request). Auto Scaling responds over minutes, making it unsuitable for rapid spikes. After the Nov 2024 50% price cut, On-Demand break-even vs provisioned is approximately 40% utilization — at 500 WCU/s normal vs 15,000 WCU/s peak, On-Demand wins on cost and availability.",
    keywords: ["On-Demand", "flash sale spike", "Auto Scaling too slow", "no throttling", "unpredictable"]
  },

  // ─── d3-023 ── 3.3 Database ── RDS Multi-AZ Instance ── difficulty 5 (trap) ─
  {
    id: "d3-023",
    domain: 3,
    taskStatement: "3.3",
    services: ["aurora", "elasticache-redis"],
    constraintType: "performance",
    difficulty: 5,
    type: "single",
    stem: "A solutions architect reviews an architecture where an Amazon RDS for MySQL Multi-AZ DB Instance (NOT Multi-AZ Cluster) is used to offload read traffic to the standby instance. Query-intensive reporting tools are configured to connect to the standby endpoint to reduce load on the primary. The architect is also told that an Amazon ElastiCache for Memcached cluster is used as the session store because 'it supports Multi-AZ failover to maintain sessions on node failure.' Which TWO statements accurately identify architectural flaws?",
    options: [
      {
        id: "A",
        text: "The RDS Multi-AZ DB Instance standby cannot serve read traffic; ElastiCache Memcached does not support replication or Multi-AZ failover.",
        isCorrect: true,
        explanation: "Correct — BOTH assumptions are wrong. (1) RDS Multi-AZ DB Instance maintains a hot standby for failover only — it is NOT readable. Only RDS Multi-AZ DB Cluster (MySQL + PostgreSQL) or Aurora read replicas provide readable standby/replica endpoints. (2) ElastiCache Memcached has NO replication and NO Multi-AZ failover capability. A Memcached node failure permanently loses all data on that node. Session stores requiring durability need ElastiCache Redis/Valkey."
      },
      {
        id: "B",
        text: "The RDS Multi-AZ standby IS readable; Memcached supports Multi-AZ via ElastiCache Serverless.",
        isCorrect: false,
        explanation: "Wrong — Both statements are incorrect. Standard RDS Multi-AZ DB Instance standby is NOT readable. ElastiCache Serverless supports Memcached engine but does NOT add replication to Memcached — each Serverless Memcached cache namespace still provides no data replication guarantees equivalent to Redis."
      },
      {
        id: "C",
        text: "The RDS standby is readable with read replica endpoints; Memcached Multi-AZ requires enabling the 'replication group' feature.",
        isCorrect: false,
        explanation: "Wrong — RDS Multi-AZ DB Instance has no read replica endpoint on the standby. 'Replication group' is an ElastiCache Redis/Valkey concept — it does not apply to Memcached. Memcached has no equivalent feature."
      },
      {
        id: "D",
        text: "Only the Memcached claim is wrong; the RDS Multi-AZ DB Instance standby CAN serve reads in certain configurations.",
        isCorrect: false,
        explanation: "Wrong — There is no configuration in RDS Multi-AZ DB Instance (single standby) that enables read traffic. Read scaling requires RDS Read Replicas (separate instances), RDS Multi-AZ DB Cluster (MySQL/PostgreSQL, semi-synchronous, 2 readable standbys), or Aurora read replicas. The standard Multi-AZ DB Instance standby is always read-only from AWS's internal replication perspective."
      }
    ],
    explanation: "Two classic exam traps in one question: (1) RDS Multi-AZ DB Instance standby = HA-only, zero read traffic. Read replicas (up to 15 per engine) are separate instances that must be explicitly created. RDS Multi-AZ DB Cluster (MySQL+PG only) has 2 readable standbys as a separate feature. (2) ElastiCache Memcached = no replication, no Multi-AZ. A session store on Memcached loses all sessions when a node fails. Session stores that must survive failures require Redis/Valkey with Multi-AZ enabled.",
    keywords: ["Multi-AZ standby not readable", "Memcached no replication", "read replica vs Multi-AZ", "trap question"]
  },

  // ─── d3-024 ── 3.4 Network ── PrivateLink overlapping CIDR ── difficulty 4 ──
  {
    id: "d3-024",
    domain: 3,
    taskStatement: "3.4",
    services: ["privatelink", "nlb"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "Company A (10.0.0.0/8) has acquired Company B (10.0.0.0/8). Both companies' applications run in separate AWS accounts with overlapping VPC CIDR blocks that cannot be re-addressed. Company A needs to call a specific microservice API hosted in Company B's VPC. Company A's developers want to access the service using a private DNS hostname. Which solution works despite the overlapping CIDRs and provides the LOWEST latency private connectivity?",
    options: [
      {
        id: "A",
        text: "Create a VPC peering connection between Company A and Company B VPCs.",
        isCorrect: false,
        explanation: "Wrong — VPC peering does NOT support overlapping CIDR blocks. AWS explicitly blocks VPC peering when the IPv4 CIDR ranges of the two VPCs overlap. This is a hard technical limitation."
      },
      {
        id: "B",
        text: "Connect both VPCs to an AWS Transit Gateway and configure route tables.",
        isCorrect: false,
        explanation: "Wrong — Transit Gateway also does NOT support overlapping CIDR blocks between VPC attachments. Routing to an overlapping CIDR is ambiguous and TGW rejects the attachment configuration. Transit Gateway supports up to 5,000 VPCs but all must have non-overlapping CIDRs."
      },
      {
        id: "C",
        text: "Company B exposes the microservice behind a Network Load Balancer and creates a VPC Endpoint Service (AWS PrivateLink). Company A creates an Interface VPC Endpoint, optionally with a private DNS name, to consume the service.",
        isCorrect: true,
        explanation: "Correct — AWS PrivateLink is specifically designed to expose services across VPCs with overlapping CIDR blocks. The consumer connects to an Interface Endpoint (ENI with a private IP from the consumer's VPC CIDR) — the service's underlying IP is never exposed. Private DNS names can be attached to the endpoint. PrivateLink works regardless of CIDR overlap because it is service-based, not network-based routing."
      },
      {
        id: "D",
        text: "Set up a Site-to-Site VPN between the two VPCs using Virtual Private Gateways.",
        isCorrect: false,
        explanation: "Wrong — Site-to-Site VPN between VPCs uses a VGW (which connects to on-premises, not other VPCs directly). More importantly, VPN between overlapping CIDRs would still have routing ambiguity. VPN is not the appropriate tool for VPC-to-VPC connectivity with overlapping CIDRs."
      }
    ],
    explanation: "AWS PrivateLink (VPC Endpoint Services) is the only AWS networking service that works across VPCs with overlapping CIDR blocks. Because the consumer accesses the service through a private Interface Endpoint ENI (with an IP from its own VPC CIDR), the service provider's VPC CIDR is irrelevant to routing. Architecture: Provider creates NLB → Endpoint Service. Consumer creates Interface VPC Endpoint → gets private IP in their VPC. Optional private DNS enables consumers to use a friendly hostname. VPC peering and TGW both fail with overlapping CIDRs.",
    keywords: ["overlapping CIDR", "PrivateLink", "Interface Endpoint", "VPC peering fails", "cross-account service"]
  },

  // ─── d3-025 ── 3.4 Network ── Direct Connect encryption ── difficulty 4 ──────
  {
    id: "d3-025",
    domain: 3,
    taskStatement: "3.4",
    services: ["direct-connect"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A financial institution has a 10 Gbps AWS Direct Connect Dedicated connection between its on-premises data center and AWS. A security audit finds that the Direct Connect link is UNENCRYPTED at the physical layer. The institution requires link-layer encryption at near-line-rate speed without the overhead of IPSec VPN tunnels. Which solution satisfies this requirement?",
    options: [
      {
        id: "A",
        text: "Configure an IPSec VPN over the Direct Connect connection using a Virtual Private Gateway.",
        isCorrect: false,
        explanation: "Wrong — IPSec VPN over Direct Connect does provide encryption, but VPN tunnels have bandwidth limitations (typically 1.25 Gbps per VPN tunnel) and add CPU overhead for encryption/decryption. For a 10 Gbps link requiring near-line-rate, IPSec VPN creates a significant bottleneck and does not satisfy the 'near-line-rate without IPSec overhead' requirement."
      },
      {
        id: "B",
        text: "Enable MACsec (IEEE 802.1AE) on the 10 Gbps Dedicated Direct Connect connection.",
        isCorrect: true,
        explanation: "Correct — MACsec (Media Access Control Security) is a Layer 2 link encryption standard that operates at near-line-rate with minimal overhead using GCM-AES-256 (10 Gbps) or GCM-AES-XPN-256 (400 Gbps). It is available on 10 Gbps, 100 Gbps, and 400 Gbps Dedicated Direct Connect connections. MACsec encrypts the physical Ethernet link itself, before any IP traffic, with no bandwidth penalty."
      },
      {
        id: "C",
        text: "Enable MACsec on a 1 Gbps Hosted Direct Connect connection.",
        isCorrect: false,
        explanation: "Wrong — MACsec is NOT available on Hosted Direct Connect connections (connections via an APN Partner). MACsec is only available on 10 Gbps, 100 Gbps, and 400 Gbps Dedicated Direct Connect connections. 1 Gbps Dedicated connections also do NOT support MACsec — only 10/100/400 Gbps Dedicated."
      },
      {
        id: "D",
        text: "Upgrade the Direct Connect connection to use a Link Aggregation Group (LAG) of four connections for increased bandwidth and built-in encryption.",
        isCorrect: false,
        explanation: "Wrong — LAG bundles multiple connections for increased aggregate bandwidth and provides some redundancy within a single AWS device. However, LAG does NOT add encryption. LAG is also not a resilience strategy (all connections terminate at the same AWS device — one device failure loses all connections)."
      }
    ],
    explanation: "MACsec is the AWS answer for Direct Connect physical-layer encryption at line speed. Key facts: supported on 10 Gbps, 100 Gbps, and 400 Gbps Dedicated connections only (NOT 1 Gbps or any Hosted connections). Uses GCM-AES-256 (10G) or GCM-AES-XPN-256 (100G/400G). Encrypts at Layer 2 before IP processing — no bandwidth impact unlike IPSec. Also supported for SiteLink (DX-to-DX backbone). Requires MACsec-capable hardware on both AWS and the on-premises side.",
    keywords: ["MACsec", "link-layer encryption", "near-line-rate", "Dedicated connection", "not Hosted"]
  },

  // ─── d3-026 ── 3.4 Network ── ALB vs NLB cross-zone LB ── difficulty 5 (trap)
  {
    id: "d3-026",
    domain: 3,
    taskStatement: "3.4",
    services: ["alb", "nlb"],
    constraintType: "performance",
    difficulty: 5,
    type: "single",
    stem: "A company uses a Network Load Balancer (NLB) to distribute TCP traffic across EC2 instances in three Availability Zones with unequal instance counts: AZ-a has 8 instances, AZ-b has 2 instances, and AZ-c has 2 instances. Operations reports that AZ-b and AZ-c instances are consistently overloaded while AZ-a instances are underutilized. The NLB is set to its DEFAULT configuration. What is the MOST LIKELY cause, and what is the correct fix?",
    options: [
      {
        id: "A",
        text: "The NLB is distributing traffic equally per AZ (33% each). Since AZ-b and AZ-c have fewer instances, each instance receives proportionally more traffic. Fix: Enable cross-zone load balancing on the NLB.",
        isCorrect: true,
        explanation: "Correct — NLB distributes traffic equally across its enabled AZs by default (each AZ gets 33% of traffic). Within each AZ, traffic distributes across the available targets. AZ-b (2 instances) and AZ-c (2 instances) each receive 33% of total traffic split across 2 instances = 16.5% per instance. AZ-a (8 instances) receives 33% split across 8 = 4% per instance. Enabling cross-zone load balancing makes the NLB distribute traffic across all 12 instances evenly (8.3% each). NOTE: NLB cross-zone is OFF by default and incurs inter-AZ data transfer charges when enabled."
      },
      {
        id: "B",
        text: "The NLB routes all traffic to the AZ with the most instances (AZ-a). Fix: Add more instances to AZ-b and AZ-c.",
        isCorrect: false,
        explanation: "Wrong — NLB does NOT route traffic preferentially to the AZ with the most instances. Without cross-zone load balancing, each AZ receives an equal proportion of traffic regardless of the number of targets. The overload in AZ-b and AZ-c is caused by too FEW instances receiving equal traffic share, not by the NLB routing more traffic there."
      },
      {
        id: "C",
        text: "NLB cross-zone load balancing is ON by default; the issue is that slow-start mode is not configured. Fix: Enable slow-start mode.",
        isCorrect: false,
        explanation: "Wrong — NLB cross-zone load balancing is OFF by default (unlike ALB, where it is ON by default and free). Slow-start mode is an ALB feature that gradually ramps up traffic to newly registered targets — it does not apply to the cross-AZ distribution problem described."
      },
      {
        id: "D",
        text: "ALB and NLB both have cross-zone load balancing enabled by default, so the problem must be application-level sticky sessions causing imbalance.",
        isCorrect: false,
        explanation: "Wrong — ALB has cross-zone load balancing ON by default (and free). NLB has cross-zone load balancing OFF by default. The premise that 'both have it on by default' is factually incorrect. This is the most common confusion point in load balancer configuration."
      }
    ],
    explanation: "Critical distinction: ALB has cross-zone load balancing ENABLED by default (and free). NLB has cross-zone load balancing DISABLED by default — and when enabled, inter-AZ data transfer is CHARGED (unlike ALB). GWLB cross-zone is also disabled by default but FREE when enabled. When NLB cross-zone is off, each AZ node balances traffic only within its own AZ. Unequal instance distribution across AZs therefore creates uneven per-instance load. Enabling cross-zone allows the NLB to route any request to any healthy registered target regardless of AZ.",
    keywords: ["NLB cross-zone off by default", "ALB cross-zone on by default", "unequal AZ distribution", "inter-AZ charges"]
  },

  // ─── d3-027 ── 3.5 Data ── Kinesis shards vs MSK ── difficulty 3 ─────────────
  {
    id: "d3-027",
    domain: 3,
    taskStatement: "3.5",
    services: ["kinesis-data-streams", "msk"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A data engineering team must choose a managed streaming platform for a new real-time event pipeline. The requirements are: (A) ingest 50 MB/s of events, (B) support exactly 8 independent consumer applications each reading the full stream at its own pace, (C) retain data for 30 days for replay, and (D) minimize operational overhead. The team has no existing Apache Kafka expertise. Which service best meets all requirements?",
    options: [
      {
        id: "A",
        text: "Amazon Kinesis Data Streams in On-Demand mode with 30-day extended retention, using Enhanced Fan-Out consumers for each application.",
        isCorrect: true,
        explanation: "Correct — Kinesis Data Streams On-Demand mode auto-scales to handle 50 MB/s (well within the default 200 MB/s ceiling). Up to 20 registered Enhanced Fan-Out (EFO) consumers are supported, each receiving a dedicated 2 MB/s push per shard with sub-200 ms latency. Extended retention to 30 days is a simple configuration option. No servers or Kafka clusters to manage — fully serverless. Ideal for teams without Kafka expertise."
      },
      {
        id: "B",
        text: "Amazon Managed Streaming for Apache Kafka (MSK) Serverless with 8 consumer groups and 30-day log retention.",
        isCorrect: false,
        explanation: "Wrong — MSK Serverless works and supports consumer groups with independent offsets. However, MSK requires Kafka client knowledge (producer/consumer APIs, consumer group management, offset commits, partition assignment strategies). The question explicitly states no Kafka expertise. MSK Serverless caps at 200 MB/s write / 400 MB/s read per cluster, which meets the volume requirement, but operational complexity is higher."
      },
      {
        id: "C",
        text: "Amazon Data Firehose with 8 delivery streams, one per consumer application.",
        isCorrect: false,
        explanation: "Wrong — Amazon Data Firehose is a delivery service to destinations (S3, Redshift, OpenSearch, HTTP) with a minimum buffer of 60 seconds. It does not support multiple independent consumers reading the same stream at their own pace with replay. Firehose is near-real-time, not a replayable event log."
      },
      {
        id: "D",
        text: "Amazon SQS Standard queue with one queue per consumer application.",
        isCorrect: false,
        explanation: "Wrong — SQS does not support replay — once a message is consumed and deleted, it cannot be re-read. With 8 queues, each consumer needs its own fan-out path (requiring SNS in front). SQS also has no concept of a retained event log with configurable retention beyond 14 days."
      }
    ],
    explanation: "Kinesis Data Streams vs MSK selection for AWS-native simplicity: KDS has a fully managed serverless On-Demand mode, native AWS integration (Lambda, Firehose, Flink), extended retention up to 365 days, and Enhanced Fan-Out for low-latency multiple consumers — no Kafka expertise needed. MSK provides full Apache Kafka compatibility for teams already using Kafka. Key KDS shard math: 1 MB/s + 1,000 rec/s IN per shard, 2 MB/s OUT per shard per standard consumer; EFO gives dedicated 2 MB/s push per consumer per shard.",
    keywords: ["EFO", "8 consumers", "30-day retention", "replay", "no Kafka expertise", "On-Demand"]
  },

  // ─── d3-028 ── 3.5 Data ── Firehose near-real-time trap ── difficulty 5 (trap)
  {
    id: "d3-028",
    domain: 3,
    taskStatement: "3.5",
    services: ["firehose", "kinesis-data-streams"],
    constraintType: "performance",
    difficulty: 5,
    type: "single",
    stem: "A team is building a clickstream pipeline. A product manager states: 'Amazon Data Firehose delivers data in real-time to S3 — we will use it to trigger immediate fraud detection within 1 second of each event.' A solutions architect pushes back. Which statement CORRECTLY describes why Firehose cannot satisfy a 1-second delivery SLA to S3?",
    options: [
      {
        id: "A",
        text: "Amazon Data Firehose has a MINIMUM buffer interval of 60 seconds before delivering data to S3, making it a near-real-time service, not a real-time service.",
        isCorrect: true,
        explanation: "Correct — Amazon Data Firehose (renamed from Kinesis Data Firehose in February 2024) buffers incoming data before delivering it to destinations. For most destinations including S3, the minimum buffer interval is 60 seconds. This makes Firehose a near-real-time delivery service (typically 60–300 seconds). For 1-second fraud detection, Kinesis Data Streams with a Lambda event source mapping or Enhanced Fan-Out consumer is required."
      },
      {
        id: "B",
        text: "Amazon Data Firehose was renamed from 'Kinesis Data Firehose' in February 2024 and no longer delivers to S3.",
        isCorrect: false,
        explanation: "Wrong — Amazon Data Firehose was indeed renamed from 'Kinesis Data Firehose' in February 2024, but S3 remains one of its primary destinations. The rename is factual; the claim about S3 no longer being supported is false."
      },
      {
        id: "C",
        text: "Amazon Data Firehose uses pull-based polling from the source, adding unpredictable delivery delays.",
        isCorrect: false,
        explanation: "Wrong — Amazon Data Firehose is a push-based service. Producers call PutRecord or PutRecordBatch directly. Firehose also integrates as a Kinesis Data Streams consumer (pulling from KDS). The delay is from buffering, not polling architecture."
      },
      {
        id: "D",
        text: "Amazon Data Firehose requires the data to be in Parquet format before delivery to S3, which adds transformation latency.",
        isCorrect: false,
        explanation: "Wrong — Parquet/ORC format conversion via the Glue schema registry is an OPTIONAL feature of Firehose. Firehose delivers raw data to S3 with no format conversion by default. Format conversion adds optional latency but is not the reason for the 60-second minimum delay."
      }
    ],
    explanation: "The Firehose real-time trap is one of the most commonly tested Domain 3 concepts. Amazon Data Firehose is a near-real-time service with a minimum 60-second buffer interval for most destinations (S3, Redshift, OpenSearch). The zero-buffering feature (Dec 2023) can achieve ~5 seconds for select destinations but is still not 'real-time' in the sub-second sense. For true real-time event processing (<1 second), use Kinesis Data Streams + Lambda or KDS + Amazon Managed Service for Apache Flink. Firehose is designed for batch delivery to storage destinations, not event-by-event real-time triggers.",
    keywords: ["Firehose near-real-time", "60 second minimum buffer", "not real-time", "KDS vs Firehose", "renamed Feb 2024"]
  },

  // ─── d3-029 ── 3.5 Data ── Glue job bookmarks ── difficulty 3 ──────────────
  {
    id: "d3-029",
    domain: 3,
    taskStatement: "3.5",
    services: ["glue", "s3"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "An ETL pipeline uses AWS Glue to process log files that land in an Amazon S3 bucket throughout the day. The Glue job runs every hour on a schedule. Each run currently scans the entire S3 prefix and reprocesses all previously processed files, causing duplicate records in the target data warehouse. The team wants the hourly job to process ONLY new files added since the last successful run without changing the S3 prefix structure. Which Glue feature solves this with MINIMAL code changes?",
    options: [
      {
        id: "A",
        text: "Configure an S3 lifecycle rule to move processed files to a separate prefix after each Glue job run.",
        isCorrect: false,
        explanation: "Wrong — S3 lifecycle rules operate on age-based or tag-based transitions to different storage classes or deletion. They cannot be triggered by Glue job completion events. Moving files also changes the S3 prefix structure, which the question prohibits. This adds operational complexity."
      },
      {
        id: "B",
        text: "Enable AWS Glue job bookmarks on the existing job.",
        isCorrect: true,
        explanation: "Correct — AWS Glue job bookmarks track which S3 files (by ETag and modification timestamp) have already been successfully processed. On the next run, Glue automatically reads only files not yet processed (incremental loads). This requires no changes to the ETL logic itself — just enabling the bookmark feature in the Glue job configuration. It handles the 'process only new files' requirement natively."
      },
      {
        id: "C",
        text: "Use Amazon S3 Event Notifications to trigger the Glue job only when new files arrive.",
        isCorrect: false,
        explanation: "Wrong — S3 event notifications trigger Lambda or SQS per-object arrival, not Glue jobs directly. Even if a Lambda function starts a Glue job on each event, running one job per file is inefficient and still requires tracking which files have been processed to avoid reprocessing on job restarts. This is more complex than job bookmarks."
      },
      {
        id: "D",
        text: "Add a DynamoDB table to track processed S3 file keys and filter them in the Glue script at the beginning of each run.",
        isCorrect: false,
        explanation: "Wrong — A DynamoDB tracking table is a custom implementation of what Glue job bookmarks provide natively. This adds custom code to maintain, a separate database to provision, and potential consistency issues if the Glue job fails mid-run. Job bookmarks are the purpose-built zero-code solution."
      }
    ],
    explanation: "AWS Glue job bookmarks are the purpose-built mechanism for incremental ETL — processing only new data since the last successful run. Bookmarks track processed S3 objects (ETag + modification time), DynamoDB items, JDBC tables (by primary key), and Kinesis/Kafka offsets. Key exam pattern: 'process only new files in S3' → Glue job bookmarks. No schema changes, no prefix restructuring, no custom tracking code required. Bookmarks are stored in AWS Glue's internal state and persist between job runs.",
    keywords: ["job bookmarks", "incremental ETL", "only new files", "avoid reprocessing", "no code changes"]
  },

  // ─── d3-030 ── 3.5 Data ── Redshift Streaming Ingestion ── difficulty 4 ─────
  {
    id: "d3-030",
    domain: 3,
    taskStatement: "3.5",
    services: ["redshift", "kinesis-data-streams"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A data analytics team streams IoT sensor events into Amazon Kinesis Data Streams. They need to run SQL aggregation queries on a rolling 5-minute window of the last 500 million events directly in Amazon Redshift with the LOWEST possible end-to-end latency. The current architecture uses Amazon Data Firehose to stage events in S3, then a scheduled Redshift COPY command every 5 minutes. Which change reduces ingestion latency the MOST?",
    options: [
      {
        id: "A",
        text: "Replace Amazon Data Firehose with an AWS Lambda function that writes directly to Redshift via JDBC on each Kinesis event.",
        isCorrect: false,
        explanation: "Wrong — Lambda writing to Redshift via JDBC per-event creates thousands of single-row INSERT statements, which is highly inefficient for a columnar database like Redshift. Redshift is optimized for bulk loads (COPY command) and analytical queries, not high-frequency small inserts. This approach severely degrades Redshift performance."
      },
      {
        id: "B",
        text: "Enable Amazon Redshift Streaming Ingestion by creating a materialized view directly over the Kinesis Data Stream.",
        isCorrect: true,
        explanation: "Correct — Amazon Redshift Streaming Ingestion (available for KDS and MSK) creates a materialized view that reads directly from the stream with seconds-level latency — eliminating the S3 staging step entirely. The REFRESH MATERIALIZED VIEW command refreshes the view with the latest stream data. This bypasses Firehose's 60-second minimum buffer AND the S3 COPY command latency, reducing end-to-end latency from ~5–10 minutes to seconds."
      },
      {
        id: "C",
        text: "Configure Amazon Data Firehose to deliver to Redshift with zero-buffering enabled.",
        isCorrect: false,
        explanation: "Wrong — Zero-buffering (Dec 2023) reduces Firehose delivery to S3 to ~5 seconds. However, Firehose to Redshift delivers via S3 staging + COPY — not direct streaming. The COPY command from S3 still adds minutes of latency. Zero-buffering only applies to S3 and select other Firehose destinations."
      },
      {
        id: "D",
        text: "Use Amazon Managed Service for Apache Flink to process the Kinesis stream and write aggregated results to Redshift every 30 seconds.",
        isCorrect: false,
        explanation: "Wrong — Amazon Managed Service for Apache Flink (formerly Kinesis Data Analytics) can aggregate the stream and write results to Redshift at 30-second intervals. While this reduces latency vs the current 5-minute schedule, it requires setting up and managing a Flink application. Redshift Streaming Ingestion is simpler (just a materialized view definition) and achieves seconds-level latency without a separate processing tier."
      }
    ],
    explanation: "Amazon Redshift Streaming Ingestion eliminates the traditional S3 staging + COPY pipeline for streaming data. A materialized view is created using a SUPER data type over the stream (KDS or MSK). REFRESH MATERIALIZED VIEW updates the view in seconds. This reduces latency from the S3 staging approach (minutes) to seconds while using native SQL — no Lambda, no Firehose, no Flink required for the ingestion path. The materialized view then serves as a source for analytical queries including time-window aggregations.",
    keywords: ["Redshift Streaming Ingestion", "materialized view", "Kinesis", "seconds latency", "no S3 staging"]
  },

  // ─── d3-031 ── 3.5 Data ── Lake Formation fine-grained access ── diff 3 ──────
  {
    id: "d3-031",
    domain: 3,
    taskStatement: "3.5",
    services: ["glue", "athena"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A healthcare company stores patient data in a data lake on Amazon S3, cataloged in the AWS Glue Data Catalog. Analysts query the data via Amazon Athena. The security team requires that analysts can only query specific columns (PII must be excluded) and only rows belonging to their assigned region (row-level filtering). IAM policies alone cannot enforce column and row level restrictions on Athena queries. Which additional service provides this fine-grained access control?",
    options: [
      {
        id: "A",
        text: "Amazon Macie to discover and tag PII columns, then restrict Athena access using S3 bucket policies.",
        isCorrect: false,
        explanation: "Wrong — Amazon Macie discovers and classifies PII in S3 but cannot enforce query-level column or row restrictions on Athena. S3 bucket policies control access to entire objects (files), not individual columns or rows within objects."
      },
      {
        id: "B",
        text: "AWS Lake Formation with column-level and row-level (cell-level) permissions on the Glue Data Catalog tables.",
        isCorrect: true,
        explanation: "Correct — AWS Lake Formation provides fine-grained access control at the database, table, column, and row/cell level for the Glue Data Catalog. Athena, Redshift Spectrum, EMR (Spark/Trino/Hive), and Glue ETL all enforce Lake Formation permissions. Row-level filters restrict which rows an analyst can see. Column-level grants exclude PII columns from specific principals. LF-Tags (Tag-Based Access Control) scale this across thousands of tables."
      },
      {
        id: "C",
        text: "Enable Athena Workgroups with per-workgroup result bucket policies to separate analyst data.",
        isCorrect: false,
        explanation: "Wrong — Athena Workgroups control query result locations, cost limits, query history, and engine version per team. They do not enforce column-level or row-level data access restrictions within queries."
      },
      {
        id: "D",
        text: "Create separate S3 prefixes per region and assign IAM policies per analyst group to restrict prefix access.",
        isCorrect: false,
        explanation: "Wrong — Separate S3 prefixes per region solves data partitioning but not column-level restriction (analysts can still read all columns within their allowed partition). This approach also requires significant S3 reorganization. Lake Formation handles both row and column filtering through the query engine itself without restructuring data."
      }
    ],
    explanation: "AWS Lake Formation is the answer for fine-grained access control (column + row level) on data lake tables. It sits above the Glue Data Catalog and enforces permissions when query engines (Athena, Redshift Spectrum, EMR with Lake Formation integration, Glue ETL) access the catalog. Important: IAM permissions must also grant underlying S3 object access OR Lake Formation's UseOnlyLakeFormationPermissions setting must be applied to prevent IAM bypass of LF controls. LF-Tags (TBAC) enable scalable permission management across thousands of tables without per-table grants.",
    keywords: ["Lake Formation", "column-level", "row-level", "fine-grained access", "Athena", "PII"]
  },

  // ─── d3-032 ── 3.1 Storage ── Storage Gateway S3 File ── difficulty 3 ────────
  {
    id: "d3-032",
    domain: 3,
    taskStatement: "3.1",
    services: ["s3", "efs"],
    constraintType: "migration",
    difficulty: 3,
    type: "single",
    stem: "A manufacturing company stores CAD design files on an on-premises NFS file server. Engineers need low-latency access to recently accessed files (local cache), while older files are stored in Amazon S3 and retrieved on demand. The company wants a hybrid solution that presents a single NFS namespace to engineers without migrating the file server entirely to AWS. Which solution achieves this with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Deploy an Amazon EFS file system and mount it on the on-premises servers using EFS mount helper over Direct Connect.",
        isCorrect: false,
        explanation: "Wrong — EFS can be mounted on-premises over Direct Connect but all files are stored in AWS (no local cache). Every file access requires a round-trip to EFS in the AWS region. This does not provide local caching for recently accessed files, which is a core requirement."
      },
      {
        id: "B",
        text: "Deploy an AWS Storage Gateway S3 File Gateway on-premises.",
        isCorrect: true,
        explanation: "Correct — AWS Storage Gateway S3 File Gateway presents an NFS (and SMB) interface to on-premises clients. Frequently accessed files are cached locally on the Gateway appliance for low-latency access. All files are stored as native S3 objects (backed by S3, Glacier, etc.). This provides the hybrid NFS namespace with local caching the question requires. Lifecycle policies can tier older S3 objects to Glacier automatically."
      },
      {
        id: "C",
        text: "Use AWS DataSync to synchronize the on-premises NFS server to Amazon S3 on a schedule.",
        isCorrect: false,
        explanation: "Wrong — AWS DataSync is a data migration and scheduled transfer service, not a hybrid file system. It copies data from source to destination but does not present a live NFS mount to on-premises engineers. After a DataSync transfer, the on-premises server and S3 are separate copies, not a unified namespace."
      },
      {
        id: "D",
        text: "Deploy a Volume Gateway in Cached mode to present an iSCSI block device to the on-premises servers.",
        isCorrect: false,
        explanation: "Wrong — Volume Gateway in Cached mode presents an iSCSI block device (not NFS). The question requires an NFS namespace for engineers working with CAD files. Block storage requires formatting with a filesystem (XFS, NTFS) and does not provide the file-level S3 object storage benefits of File Gateway."
      }
    ],
    explanation: "AWS Storage Gateway S3 File Gateway is the canonical exam answer for hybrid NFS/SMB access with S3 backend and local caching. It presents a standard NFS mount, stores files as native S3 objects (enabling S3 lifecycle, versioning, replication), and caches recently accessed files locally for low-latency reads. DataSync = scheduled batch migration. EFS = cloud-native NFS without local cache. Volume Gateway = block storage (iSCSI), not file.",
    keywords: ["S3 File Gateway", "NFS", "local cache", "hybrid storage", "S3 backend", "on-premises"]
  },

  // ─── d3-033 ── 3.4 Network ── CloudFront Origin Shield ── difficulty 4 ───────
  {
    id: "d3-033",
    domain: 3,
    taskStatement: "3.4",
    services: ["cloudfront"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A company uses Amazon CloudFront with a dynamic origin (an Application Load Balancer in us-east-1). The origin handles high traffic from CloudFront's 600+ edge PoPs, each making independent cache-miss requests to the origin. During traffic spikes, the origin receives thousands of simultaneous cache-miss requests for the same uncached content, overwhelming the ALB. The team wants to COLLAPSE these redundant origin requests into as few requests as possible with MINIMUM latency overhead. Which CloudFront feature solves this?",
    options: [
      {
        id: "A",
        text: "Enable CloudFront Origin Shield, selecting the AWS Region closest to the ALB origin (us-east-1).",
        isCorrect: true,
        explanation: "Correct — CloudFront Origin Shield adds a centralized caching tier between Regional Edge Caches and the origin. When multiple edge PoPs miss on the same content, their requests are consolidated at Origin Shield — only one request goes to the ALB origin per unique cache key. For an origin in us-east-1, selecting the us-east-1 Origin Shield region minimizes the additional network hop. The trade-off is an extra per-request charge."
      },
      {
        id: "B",
        text: "Configure CloudFront with multiple origins in a failover origin group pointing to ALBs in multiple regions.",
        isCorrect: false,
        explanation: "Wrong — Origin failover groups are for high availability — if the primary origin returns a 5xx error, CloudFront retries the secondary origin. They do not collapse redundant cache-miss requests. This solves origin availability, not origin traffic amplification from multiple edge PoPs."
      },
      {
        id: "C",
        text: "Enable Origin Shield, selecting the AWS Region closest to the VIEWERS (not the origin).",
        isCorrect: false,
        explanation: "Wrong — Origin Shield should be placed in the AWS Region closest to the ORIGIN, not the viewers. The goal is to reduce the number of requests reaching the origin by collapsing them at a central tier. Placing Origin Shield far from the origin increases the hop distance for shield-to-origin traffic without reducing the number of origin requests."
      },
      {
        id: "D",
        text: "Increase the ALB's connection limit and deploy more ALB nodes across multiple AZs.",
        isCorrect: false,
        explanation: "Wrong — Scaling the ALB handles more concurrent connections but does not reduce the NUMBER of redundant requests for the same content. Thousands of edge PoPs making duplicate cache-miss requests for the same URL still hit the origin the same number of times. Request collapsing requires a central intermediary cache layer, which Origin Shield provides."
      }
    ],
    explanation: "CloudFront Origin Shield is a mid-tier caching layer that reduces origin load by consolidating cache-miss requests from all Regional Edge Caches. Without Origin Shield, each of the 13 Regional Edge Caches can independently send a cache-miss request to the origin for the same object. With Origin Shield, all RECs send their misses to the single Shield tier, which collapses them into one origin request. Key rule: choose the Origin Shield region CLOSEST TO THE ORIGIN (not viewers). When Lambda@Edge is used with Origin Shield, origin-facing functions run only in the Shield region.",
    keywords: ["Origin Shield", "request collapsing", "origin protection", "closest to origin not viewers", "mid-tier cache"]
  },

  // ─── d3-034 ── 3.2 Compute ── ECS task placement ── difficulty 3 ─────────────
  {
    id: "d3-034",
    domain: 3,
    taskStatement: "3.2",
    services: ["ecs"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "An Amazon ECS service runs 6 tasks on an EC2 cluster with instances spread across 3 Availability Zones. The team wants to MAXIMIZE fault tolerance by ensuring tasks are distributed as evenly as possible across AZs, so that losing any single AZ does not take down more than half the running tasks. Which ECS task placement strategy and constraint combination achieves this?",
    options: [
      {
        id: "A",
        text: "Placement strategy: binpack on CPU; constraint: none.",
        isCorrect: false,
        explanation: "Wrong — Binpack places tasks on instances with the MOST existing tasks to minimize the number of instances used (cost optimization). This concentrates tasks, potentially putting all 6 tasks on the fewest possible instances, which maximizes correlated failure risk — the opposite of fault tolerance."
      },
      {
        id: "B",
        text: "Placement strategy: spread by attribute:ecs.availability-zone; constraint: none.",
        isCorrect: true,
        explanation: "Correct — The spread placement strategy distributes tasks as evenly as possible across the specified attribute. Spreading by ecs.availability-zone ensures that 6 tasks are distributed as 2 per AZ. Losing one AZ takes down 2 of 6 tasks (33%), not more than half. This is the default strategy for ECS services and is explicitly designed for fault tolerance across AZs."
      },
      {
        id: "C",
        text: "Placement strategy: random; constraint: memberOf distinctInstance.",
        isCorrect: false,
        explanation: "Wrong — Random placement distributes tasks across instances randomly, not evenly across AZs. With random placement, all 6 tasks could end up in the same AZ by chance. The distinctInstance constraint ensures no two tasks run on the same instance but does not enforce AZ distribution."
      },
      {
        id: "D",
        text: "Placement strategy: spread by instanceId; constraint: none.",
        isCorrect: false,
        explanation: "Wrong — Spreading by instanceId distributes tasks evenly across instances but does NOT guarantee AZ distribution. If all instances happen to be in two AZs, tasks are spread across instances within those AZs but losing one AZ could still take down the majority of tasks. AZ-level spreading requires the ecs.availability-zone attribute."
      }
    ],
    explanation: "ECS task placement strategies: binpack = minimize instances (cost), spread = maximize distribution (HA), random = no preference. For HA across AZs, spread by ecs.availability-zone distributes tasks evenly across AZs. Note: placement strategies apply only to EC2 launch type — Fargate automatically spreads tasks across AZs without configuration. Constraints (distinctInstance, memberOf) filter which instances tasks can be placed on — they don't control distribution strategy.",
    keywords: ["ECS spread", "availability-zone", "fault tolerance", "task placement strategy", "2 per AZ"]
  },

  // ─── d3-035 ── 3.5 Data ── MSK vs KDS partitioning ── difficulty 4 ──────────
  {
    id: "d3-035",
    domain: 3,
    taskStatement: "3.5",
    services: ["msk", "kinesis-data-streams"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A company is migrating a financial transaction processing system from an on-premises Apache Kafka cluster to AWS. The existing application code uses Kafka Producer and Consumer APIs with specific configurations: exactly-once semantics (enable.idempotence=true, transactional.id), consumer group rebalancing, and custom Kafka Streams topology. The team wants to migrate with ZERO code changes. Which AWS service supports this migration path?",
    options: [
      {
        id: "A",
        text: "Amazon Kinesis Data Streams in On-Demand mode with a custom Kafka compatibility layer.",
        isCorrect: false,
        explanation: "Wrong — Kinesis Data Streams uses its own producer/consumer SDK and HTTP API. It is NOT Kafka protocol-compatible. There is no 'Kafka compatibility layer' — migrating KDS would require rewriting all producer and consumer code from Kafka APIs to Kinesis SDK calls."
      },
      {
        id: "B",
        text: "Amazon Managed Streaming for Apache Kafka (MSK) with the same Apache Kafka cluster configuration.",
        isCorrect: true,
        explanation: "Correct — Amazon MSK runs Apache Kafka natively. Existing Kafka applications connect to MSK brokers using standard Kafka Producer and Consumer APIs without modification. Exactly-once semantics (idempotent producer + transactions), consumer groups, and Kafka Streams topologies all work identically because MSK IS Apache Kafka — just fully managed. Clients update only the bootstrap.servers connection string."
      },
      {
        id: "C",
        text: "Amazon Data Firehose with a Kafka connector that translates producer API calls.",
        isCorrect: false,
        explanation: "Wrong — Amazon Data Firehose is a delivery service to storage destinations (S3, Redshift, etc.). It does not expose a Kafka broker interface, does not support consumer group semantics, and cannot run Kafka Streams topologies. There is no native Kafka API compatibility in Firehose."
      },
      {
        id: "D",
        text: "Amazon MQ with the Apache Kafka engine.",
        isCorrect: false,
        explanation: "Wrong — Amazon MQ supports Apache ActiveMQ and RabbitMQ engines only. There is no Kafka engine in Amazon MQ. Amazon MSK is the managed Kafka service on AWS."
      }
    ],
    explanation: "Amazon MSK is Apache Kafka — fully managed but protocol-identical. Existing Kafka applications migrate to MSK by changing only bootstrap.servers to the MSK broker endpoints. All Kafka features work: exactly-once semantics (idempotent producer + transactions), consumer groups, offset management, Kafka Streams, Kafka Connect, Schema Registry. MSK Serverless adds serverless capacity management. MSK Express brokers (2024) provide 3× throughput and 90% faster recovery vs standard brokers. Zero-code migration is only possible with MSK, not KDS.",
    keywords: ["MSK", "zero code changes", "Kafka API compatible", "exactly-once", "consumer groups", "Kafka migration"]
  },

  // ─── d3-036 ── 3.4 Network ── Enhanced Networking EFA ── difficulty 4 ────────
  {
    id: "d3-036",
    domain: 3,
    taskStatement: "3.4",
    services: ["ec2"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A research team runs an MPI-based molecular dynamics simulation across 128 EC2 Hpc7g instances. The simulation requires all-to-all collective communications (MPI_Allreduce) between all 128 nodes with MINIMUM latency and HIGHEST bandwidth. The team observes higher-than-expected MPI_Allreduce latency. An architect suggests enabling Elastic Fabric Adapter (EFA). Which combination of requirements must be satisfied for EFA to provide its full benefit?",
    options: [
      {
        id: "A",
        text: "EFA requires all instances to be in the same VPC, but they can span multiple Availability Zones.",
        isCorrect: false,
        explanation: "Wrong — EFA operates at Layer 2 and requires all instances using EFA to be in the SAME subnet (same Availability Zone). EFA connections cannot span multiple subnets or AZs. This is a hard technical requirement because EFA uses SRD (Scalable Reliable Datagram) which relies on same-subnet Ethernet adjacency."
      },
      {
        id: "B",
        text: "EFA requires all instances to be in the same subnet (same AZ), the Security Group must allow all traffic from itself (self-referencing rule), and the instances should be in a Cluster Placement Group for lowest intra-cluster latency.",
        isCorrect: true,
        explanation: "Correct — EFA has three key requirements: (1) All instances MUST be in the same subnet/AZ — EFA uses OS-bypass via libfabric and SRD protocol which operates at Layer 2 within the same subnet. (2) The Security Group MUST have a self-referencing inbound rule (allowing all traffic from instances with the same SG) — EFA traffic is otherwise blocked at the Security Group. (3) Cluster Placement Group co-locates instances on the same rack, achieving the 10/25 Gbps single-flow bandwidth and nanosecond-range fabric latency required for MPI collectives."
      },
      {
        id: "C",
        text: "EFA only works with p3 and p4 GPU instances and requires NVIDIA NCCL for MPI communication.",
        isCorrect: false,
        explanation: "Wrong — EFA supports a wide range of instance types beyond GPU instances, including Hpc7g (Graviton-based HPC), C6gn, Trn1, P5, and others. NCCL is used for GPU collective communications but MPI (Open MPI, Intel MPI) works with EFA's libfabric interface for CPU-based HPC without NCCL."
      },
      {
        id: "D",
        text: "EFA requires a Dedicated Host and bare-metal instances to bypass the hypervisor.",
        isCorrect: false,
        explanation: "Wrong — EFA works on standard EC2 Nitro-based instances (not just bare-metal or Dedicated Hosts). The OS-bypass in EFA uses the AWS Nitro hypervisor's EFA device — it bypasses the kernel networking stack on the GUEST side, not the hypervisor itself. Dedicated Hosts and bare-metal are not requirements."
      }
    ],
    explanation: "EFA (Elastic Fabric Adapter) requirements: (1) same subnet/AZ — EFA uses SRD (Scalable Reliable Datagram protocol) which operates at Layer 2 (Ethernet adjacency). (2) Self-referencing Security Group rule — without it, EFA traffic between instances is blocked. (3) Cluster Placement Group — co-locates instances on same rack for lowest latency (though not strictly required for EFA to function). EFA achieves 100–3,200 Gbps depending on instance type and generation, sub-microsecond latency, and supports MPI, NCCL, and libfabric-based applications.",
    keywords: ["EFA same subnet", "self-referencing security group", "Cluster Placement Group", "MPI", "OS-bypass"]
  },

  // ─── d3-037 ── 3.5 Data ── Athena partition projection ── difficulty 4 ───────
  {
    id: "d3-037",
    domain: 3,
    taskStatement: "3.5",
    services: ["athena", "glue"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "An operations team queries Amazon Athena to analyze 2 years of application logs. The S3 data is partitioned by year/month/day/hour (730 × 24 = 17,520 partitions). Queries against the Glue Data Catalog take 30–60 seconds just for partition discovery before any data is scanned, due to the Glue Metastore listing thousands of partitions. The team wants to eliminate this partition discovery overhead for time-based queries. Which feature resolves this WITHOUT requiring catalog changes?",
    options: [
      {
        id: "A",
        text: "Enable Athena query result reuse (cache) for a 7-day TTL.",
        isCorrect: false,
        explanation: "Wrong — Athena query result reuse caches the output of previously executed queries with the same SQL text and returns the cached result for identical subsequent queries. It does not help with partition discovery latency for new or varied queries (different time ranges). Result reuse only benefits repeated identical queries."
      },
      {
        id: "B",
        text: "Use Athena partition projection to define the partition schema mathematically, eliminating Glue Metastore lookups.",
        isCorrect: true,
        explanation: "Correct — Athena partition projection defines partition ranges using table properties (e.g., year=2023..2025, month=01..12, day=01..31, hour=00..23). When partition projection is configured, Athena computes valid partition paths directly without querying the Glue Metastore — eliminating the partition listing overhead entirely. This reduces partition discovery from seconds to milliseconds for time-series data."
      },
      {
        id: "C",
        text: "Run a Glue Crawler on the S3 prefix daily to keep the Glue catalog updated and pre-cache all partitions.",
        isCorrect: false,
        explanation: "Wrong — Glue Crawlers update the Data Catalog by discovering new partitions, but they don't reduce the time Athena takes to LIST and FILTER partitions from the catalog at query time. With 17,520 partitions, the catalog lookup latency persists regardless of how current the catalog is. Partition projection eliminates catalog lookups entirely."
      },
      {
        id: "D",
        text: "Upgrade to Athena engine version 3 (Trino-based) which automatically optimizes partition listing.",
        isCorrect: false,
        explanation: "Wrong — Athena engine v3 (Trino) provides query performance improvements but does not automatically optimize catalog partition listing for tables with tens of thousands of partitions. Partition projection is the specific feature designed for this problem — it is supported by all Athena engine versions."
      }
    ],
    explanation: "Athena partition projection eliminates Glue Metastore partition listing latency for tables with predictable partition schemes (dates, integers, enumerations). Instead of querying the Metastore to discover valid partitions, Athena mathematically computes partition paths from the configured projection properties. Essential for tables with thousands of time-based partitions where partition listing adds 10s–60s of overhead per query. Configured as table-level properties in the Glue Data Catalog: projection.enabled=true, projection.year.type=integer, projection.year.range=2023,2025, etc.",
    keywords: ["partition projection", "Glue Metastore", "partition discovery", "17000 partitions", "time-based queries"]
  },

  // ─── d3-038 ── 3.4 Network ── CloudFront vs Global Accelerator ── diff 2 ─────
  {
    id: "d3-038",
    domain: 3,
    taskStatement: "3.4",
    services: ["cloudfront", "global-accelerator"],
    constraintType: "performance",
    difficulty: 2,
    type: "single",
    stem: "A company operates two architectures: (X) a video streaming website that caches MP4 files at the edge and serves them to millions of global users over HTTPS, and (Y) a financial API that processes stock trades over TCP with strict latency requirements, needs two static IP addresses for client firewall whitelisting, and must automatically route to the nearest healthy region. Which service should each use case use respectively?",
    options: [
      {
        id: "A",
        text: "X: Global Accelerator, Y: CloudFront",
        isCorrect: false,
        explanation: "Wrong — Global Accelerator does not cache content — it routes traffic to the nearest healthy endpoint over the AWS backbone but does not store or serve cached files. Video streaming with caching requires CloudFront, not Global Accelerator."
      },
      {
        id: "B",
        text: "X: CloudFront, Y: Global Accelerator",
        isCorrect: true,
        explanation: "Correct — CloudFront is purpose-built for content caching and delivery over HTTPS from 600+ edge PoPs worldwide — ideal for video files. Global Accelerator provides 2 static anycast IPv4 addresses (whitelistable), routes TCP/UDP traffic over the AWS global backbone for up to 60% latency improvement, and performs health-check-based failover — ideal for low-latency financial API with static IP requirements."
      },
      {
        id: "C",
        text: "X: CloudFront, Y: Route 53 latency-based routing",
        isCorrect: false,
        explanation: "Wrong — Route 53 latency-based routing is DNS-based and provides no static IPs (DNS changes with each resolution). It also does not provide the performance benefit of routing over the AWS private backbone — it simply resolves DNS to the nearest endpoint, and clients then traverse the public internet to reach it."
      },
      {
        id: "D",
        text: "X: S3 Transfer Acceleration, Y: Global Accelerator",
        isCorrect: false,
        explanation: "Wrong — S3 Transfer Acceleration accelerates UPLOADS to S3, not downloads or streaming. CloudFront is the correct service for caching and distributing video files to end users. Option Y is correctly Global Accelerator."
      }
    ],
    explanation: "CloudFront vs Global Accelerator decision: CloudFront = HTTP/HTTPS CACHING CDN (videos, web assets, APIs with cacheable responses). Global Accelerator = Layer 4 TCP/UDP routing (static IPs, non-cacheable APIs, gaming, IoT). Key differentiators: CloudFront caches; GA does not. CloudFront dynamic IPs; GA provides 2 static anycast IPs. CloudFront terminates at edge PoP; GA TCP-terminates at AWS PoP then second TCP to region. CloudFront for HTTP; GA for any TCP/UDP protocol.",
    keywords: ["CloudFront caching", "Global Accelerator static IPs", "CDN vs routing", "TCP UDP", "anycast"]
  },

  // ─── d3-039 ── 3.3 Database ── Aurora replicas reader endpoint ── diff 5 (trap)
  {
    id: "d3-039",
    domain: 3,
    taskStatement: "3.3",
    services: ["aurora"],
    constraintType: "performance",
    difficulty: 5,
    type: "single",
    stem: "An Aurora MySQL cluster has 1 writer and 4 read replicas. A Java application uses a long-lived connection pool (HikariCP with 50 connections per instance, pool_recycle=3600 seconds) pointed at the Aurora Reader Endpoint. During a load test, engineers observe that ALL 50 connections from each application server consistently hit the SAME Aurora read replica instead of being distributed across all 4 replicas. The team assumes the reader endpoint is broken. What is the ACTUAL cause?",
    options: [
      {
        id: "A",
        text: "The Aurora reader endpoint has a maximum of 1 connection per target and needs more replicas.",
        isCorrect: false,
        explanation: "Wrong — Aurora read replicas support thousands of connections each. The reader endpoint supports all connections from all clients. The connection limit per replica is determined by the instance class (db.r5.2xlarge supports ~3,500 connections for MySQL), not by the endpoint."
      },
      {
        id: "B",
        text: "The Aurora reader endpoint performs DNS-based load balancing per NEW connection, but a long-lived connection pool keeps connections open for up to 3,600 seconds, so all 50 connections established in the same DNS resolution cycle go to the same replica and stay there.",
        isCorrect: true,
        explanation: "Correct — Aurora's reader endpoint uses DNS round-robin at connection time. The DNS TTL for the reader endpoint is approximately 1 second. HikariCP opens all 50 connections during pool initialization — all in the same DNS query cycle — so all resolve to the same replica IP. Since the pool recycles connections only every 3,600 seconds, those 50 connections stay on the same replica for an hour. This is documented Aurora behavior: the reader endpoint distributes PER NEW CONNECTION, not per query."
      },
      {
        id: "C",
        text: "Aurora reader endpoints only support 1 replica at a time and rotate targets every 5 minutes.",
        isCorrect: false,
        explanation: "Wrong — Aurora reader endpoints support all registered replicas simultaneously and load balance based on each new connection's DNS resolution. There is no 5-minute rotation cycle. The DNS record changes on replica addition/removal and load rebalancing is triggered by new connections, not a time-based rotation."
      },
      {
        id: "D",
        text: "HikariCP is incompatible with Aurora and requires a different JDBC driver.",
        isCorrect: false,
        explanation: "Wrong — HikariCP is fully compatible with Aurora MySQL (and Aurora PostgreSQL). The Aurora JDBC driver (aws-advanced-jdbc-wrapper) can improve failover behavior but is not required. The issue is connection pool architecture, not driver incompatibility."
      }
    ],
    explanation: "This is a critical exam trap about Aurora reader endpoint behavior. Aurora reader endpoint does DNS-based load balancing PER NEW CONNECTION — it does NOT continuously rebalance existing connections. If a connection pool opens many connections simultaneously (common on startup), they all resolve to the same replica IP before DNS TTL causes a new lookup. Mitigation strategies: (1) Use Aurora JDBC wrapper's reader load balancing mode, (2) Stagger connection pool startup, (3) Use shorter connection recycle times, (4) Use per-replica endpoints with application-level routing.",
    keywords: ["reader endpoint per new connection", "DNS round-robin", "connection pool", "HikariCP", "not per query"]
  },

  // ─── d3-040 ── 3.5 Data ── S3 strong consistency trap ── difficulty 5 (trap) ─
  {
    id: "d3-040",
    domain: 3,
    taskStatement: "3.5",
    services: ["s3", "athena"],
    constraintType: "performance",
    difficulty: 5,
    type: "single",
    stem: "A data engineering team designs a pipeline where Step A writes a Parquet file to Amazon S3, and Step B immediately reads the same file using Amazon Athena to verify row count. A senior engineer warns: 'You must add a 5-second sleep between Step A and Step B because S3 is eventually consistent — the file may not be immediately readable after a PUT.' Which statement about this warning is TRUE?",
    options: [
      {
        id: "A",
        text: "The warning is CORRECT — S3 requires eventual consistency propagation time, especially for new object PUTs. The 5-second sleep is necessary.",
        isCorrect: false,
        explanation: "Wrong — This was true before December 1, 2020, but S3 has provided strong read-after-write consistency for all operations (GET, LIST, HEAD after PUT or DELETE) since that date. A GET or LIST immediately after a successful PUT will always see the new object. No sleep or retry is needed."
      },
      {
        id: "B",
        text: "The warning is INCORRECT — Amazon S3 has provided strong read-after-write consistency for ALL operations including GET and LIST since December 2020, with no additional configuration required.",
        isCorrect: true,
        explanation: "Correct — AWS announced S3 strong consistency on December 1, 2020. Since that date, all S3 operations (GET, LIST, HEAD, COPY after PUT or DELETE) are strongly consistent — read-after-write is guaranteed immediately. No sleep, retry, or eventual consistency workaround is needed. No additional S3 configuration is required. This is the default behavior for all S3 buckets."
      },
      {
        id: "C",
        text: "The warning is PARTIALLY CORRECT — LIST operations are still eventually consistent in S3 even after December 2020. The 5-second sleep is needed only before LIST calls.",
        isCorrect: false,
        explanation: "Wrong — S3 strong consistency since December 2020 applies to ALL operations including LIST. A LIST call immediately after a PUT will reflect the newly written object. There is no remaining eventual consistency behavior in S3 for any standard operation."
      },
      {
        id: "D",
        text: "The warning is CORRECT for Standard S3 but incorrect for S3 Express One Zone, which provides strong consistency.",
        isCorrect: false,
        explanation: "Wrong — Both S3 Standard and S3 Express One Zone provide strong read-after-write consistency. The December 2020 consistency upgrade applied to all S3 storage classes. S3 Express One Zone additionally provides single-digit millisecond latency, but this is about performance, not consistency semantics."
      }
    ],
    explanation: "One of the highest-value Domain 3 traps: S3 strong consistency has been the default for ALL S3 operations since December 1, 2020. Any exam answer claiming 'S3 is eventually consistent' or 'you must wait after a PUT before reading' is WRONG. Read-after-write (new PUTs), read-after-update (overwrites), and LIST-after-write are all immediately consistent with no additional configuration. Also: the old guidance to 'randomize S3 key prefixes for high throughput' is OBSOLETE since 2018 — S3 auto-partitions on sustained request rates (3,500 PUT/5,500 GET per prefix per second).",
    keywords: ["S3 strong consistency", "December 2020", "read-after-write", "no eventual consistency", "trap question"]
  }
]
