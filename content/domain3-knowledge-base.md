# AWS SAA-C03 Domain 3: High-Performing Architectures — Complete Research Reference (May 2026)

This document compiles deep research across all 5 task statements for SAA-C03 Domain 3 (24% of exam), focused on **high-performance angles** with 2024–2026 updates verified. Use 🔴 for recently changed/uncertain claims, 🟡 for verified-recent facts.

---

# TASK 3.1 — HIGH-PERFORMING STORAGE

## S3 Performance

**Request rate scaling per partitioned prefix:** 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD per second. Prefixes per bucket are unlimited; 10 prefixes ⇒ 55,000 GETs/s, 100 ⇒ 550,000 GETs/s. S3 auto-partitions on sustained traffic (gradual, not instant). Old guidance to randomize/hash prefixes is **obsolete since 2018** — sequential/date prefixes are fine. On 503 SlowDown, retry with backoff while S3 scales.

**Multipart upload:** Recommended ≥100 MB, required >5 GB. Max object 5 TB. Parts 5 MB–5 GB; max 10,000 parts. **Always enable Lifecycle rule `AbortIncompleteMultipartUpload`** (typically 7 days) — otherwise abandoned parts silently bill storage.

**Byte-range fetches:** parallel `Range:` GETs (~8–16 MB ranges) to parallelize downloads and cheap retries. ~15 concurrent requests saturate 10 Gbps.

**S3 Transfer Acceleration:** uses CloudFront edge ingress + AWS backbone to bucket region. For globally-distributed clients uploading to one region. Endpoint `bucket.s3-accelerate.amazonaws.com`. Cannot use with VPC endpoints or cross-Region CopyObject.

**S3 Select / Glacier Select:** SQL on subset of CSV/JSON/Parquet objects; returns matching rows/columns; up to ~400% perf improvement vs full GET.

**🟡 S3 Express One Zone:** **Single-digit ms latency, 10× faster than S3 Standard**. Directory bucket (hierarchical, bucket-name format `name--azid--x-s3`). Up to **2M GET/s, 200K PUT/s** per bucket. **Single-AZ only**, 99.95% availability. Session-based auth via `CreateSession`. Use for AI/ML training, HPC, real-time logs co-located with compute. April 2025: 31% storage, 55% PUT, 85% GET price cuts. CRC32 default checksum (MD5 not supported).

**S3 Multi-Region Access Points (MRAP):** single global endpoint across up to 17 regions; uses Global Accelerator under the hood (~60% faster); active-active or active-passive with failover in minutes. Pair with CRR for DR.

**Strong read-after-write consistency** since Dec 2020 — all operations including LIST. Old eventual-consistency caveats are dead.

**🟡 S3 Tables (re:Invent 2024):** Native Apache Iceberg table buckets; **3× faster query, 10× higher TPS** vs self-managed Iceberg; automatic compaction, snapshot management, unreferenced file cleanup; integration with Glue Catalog, Athena, Redshift, EMR, QuickSight/Quick Sight, Data Firehose.

**🟡 S3 Metadata (re:Invent 2024; live inventory tables GA 2025):** Auto, near-real-time queryable metadata as Iceberg tables. **Journal table** (PUT/DELETE/metadata events, <1 hour) + **Live inventory table** (full current snapshot including custom tags + user metadata). Replaces S3 Inventory + custom ListObject pipelines.

**Storage classes (exam-critical):**
| Class | Latency | Min duration | Min size | AZs |
|---|---|---|---|---|
| Standard | ms | none | none | ≥3 |
| Intelligent-Tiering | ms→hours | none | none | ≥3 |
| Standard-IA | ms | 30 d | 128 KB | ≥3 |
| One Zone-IA | ms | 30 d | 128 KB | 1 |
| **Glacier Instant Retrieval** | **ms** | 90 d | 128 KB | ≥3 |
| Glacier Flexible Retrieval | 1–5 min/3–5 h/5–12 h | 90 d | 40 KB | ≥3 |
| Glacier Deep Archive | 12 h/48 h | 180 d | 40 KB | ≥3 |
| Express One Zone | single-digit ms | 1 h | none | 1 |

Common traps: "ms access to archive" → **Glacier Instant Retrieval** (not Flexible). "Single AZ acceptable, cool" → One Zone-IA. "Cheapest archive, hours OK" → Deep Archive.

## EBS Volume Types

| Type | Max IOPS | Max throughput | Max size | Durability | Latency |
|---|---|---|---|---|---|
| **gp3** | 16,000 | 1,000 MiB/s | 16 TiB | 99.8–99.9% | ms |
| gp2 (legacy) | 16,000 (at 5,334 GiB) | 250 MB/s | 16 TiB | 99.8–99.9% | ms |
| **io2 Block Express** | **256,000** | **4,000 MiB/s** | **64 TiB** | **99.999%** | **<500 µs** |
| io1 (legacy) | 64,000 | 1,000 MiB/s | 16 TiB | 99.8–99.9% | ms |
| st1 (HDD throughput) | 500 | 500 MB/s | 16 TiB | 99.8–99.9% | ms |
| sc1 (HDD cold) | 250 | 250 MB/s | 16 TiB | 99.8–99.9% | ms |

**gp3:** baseline 3,000 IOPS + 125 MiB/s free at any size; pay separately above (IOPS $0.005/mo, throughput $0.04/MiB-mo). 20% cheaper per GiB than gp2, no burst credits. Online migration from gp2 → gp3 almost always saves.

**gp2:** IOPS = 3 IOPS/GiB; volumes <1 TiB burst to 3,000 via credits (monitor `BurstBalance`). **Silent perf cliff** when credits exhausted.

**🟡 io2 Block Express:** All io2 volumes are now Block Express by default (April 30, 2025). Max 256K IOPS only on **Nitro instances** (non-Nitro caps at 32K). Uses SRD networking. SAP HANA, Oracle, MS SQL, Db2, large OLTP.

**EBS Multi-Attach:** io1/io2 only; up to **16 Nitro instances in same AZ**; **MUST use cluster-aware FS** (GFS2, OCFS2, Veritas) — XFS/EXT4 will corrupt. io2 supports NVMe reservations. **No boot volumes.** Trap: "shared storage between EC2" without cluster awareness → **EFS** (not Multi-Attach).

**Fast Snapshot Restore (FSR):** Eliminates lazy-load — pre-initialized, full perf immediately. **Per-snapshot, per-AZ** ($0.75/hour); ~60 min/TiB optimization time; 10 initialized volumes/hour/AZ credit bucket.

**EBS Snapshot Archive:** $0.0125/GB-mo, 90-day min, 24–72 hour restore.

## EFS Performance

**Performance modes:**
- **General Purpose (default, recommended):** lowest per-op latency; now supports up to 35K read ops/s and 7K write ops/s.
- **Max I/O:** previous-generation; higher per-op latency, AWS recommends GP for all new file systems. 🔴 Not formally deprecated but the modern exam answer is GP.

**Throughput modes (independent from perf mode):**
- **Elastic** (recommended): scales automatically; up to 3 GiB/s read, 1 GiB/s write (Regional).
- **Bursting:** 50 MB/s/TiB baseline, burst to 100 MB/s/TiB via credits.
- **Provisioned:** fixed throughput.

**Storage classes:** Standard / Standard-IA / One Zone / One Zone-IA / **Archive** (requires Elastic throughput). Lifecycle Management auto-tiers by last-access.

**EFS Replication:** cross-region or same-region, automatic; RPO ~15 min. Destination perf mode must match source (except One Zone → always GP).

## FSx Family

**FSx for Lustre:**
- **Scratch** (data lost on failure, cheapest, 200 MB/s/TiB fixed) vs **Persistent 1/2** (replicated within AZ, file servers auto-replaced).
- SSD (Persistent 2: 125/250/500/1000 MB/s/TiB) or HDD (12/40 MB/s/TiB with optional 20% SSD cache).
- **🟡 Intelligent-Tiering (GA May 2025):** elastic, scales to TB/s and millions of IOPS; Frequent (≤30d) / Infrequent (30–90d) / Archive (>90d) tiers; from <$0.005/GB-mo. **Does NOT support S3 DRA.**
- **Data Repository Associations (DRA):** lazy-load from S3, write back via DataRepositoryTask, auto-sync.
- Sub-ms latency SSD; EFA + GPU Direct Storage; up to 1,200 Gbps per client (Persistent 2 + EFA).
- HPC, ML training pattern: Lustre + Cluster Placement Group + EFA + DRA to S3.

**FSx for NetApp ONTAP:** NFS v3/v4/v4.1 + SMB v2/v3 + iSCSI on same data; SnapMirror (RPO 5 min), FlexClone, multi-AZ HA, multi-protocol enterprise file share, SAP HANA, VMware Cloud on AWS datastore, SQL Server FCI. **Multi-AZ requires Transit Gateway for on-prem access** (floating IPs).

**FSx for Windows File Server:** **SMB only**, AD required (Managed or self-managed). Single-AZ or Multi-AZ (active/standby sync). Up to 2 GB/s + 80K IOPS most regions; **12 GB/s + 400K IOPS in major regions**. CA shares for SQL Server FCI.

**FSx for OpenZFS:** NFS v3/v4.0–4.2; ZFS snapshots + instant clones + compression; Multi-AZ; 🟡 Intelligent-Tiering option.

**Decision matrix:**
| Workload | Pick |
|---|---|
| HPC, ML, PB-scale parallel I/O | **FSx for Lustre** |
| Windows + AD + SMB | **FSx for Windows** |
| Multi-protocol (NFS+SMB+iSCSI), NetApp features | **FSx for NetApp ONTAP** |
| Linux NFS w/ ZFS features | **FSx for OpenZFS** |
| Generic Linux NFS shared, elastic | **EFS** |

## Hybrid Storage / Data Transfer

**Storage Gateway:**
- **S3 File Gateway** (NFS/SMB → S3 native objects + local cache)
- **FSx File Gateway** (SMB cache for FSx Windows)
- **Volume Gateway Cached** (primary in S3, local cache; up to 1 PB)
- **Volume Gateway Stored** (primary on-prem, async snapshots to S3 as EBS snapshots; up to 512 TB)
- **Tape Gateway** (VTL → S3 + Glacier; up to 1,500 tapes / 1 PB)

**DataSync:** **10× faster than rsync**; agent-based (VMware/Hyper-V/KVM/EC2/Snowcone). Sources NFS/SMB/HDFS/S3/Azure/GCP/EFS/FSx; destinations S3/EFS/FSx. Encrypted, integrity-verified, scheduled, PrivateLink-capable. ~$0.0125/GB.

**🟡 Snow Family May 2026 state:**
- **Snowmobile retired April 2024**.
- Effective Nov 12, 2024: Snowball Edge Storage Optimized 80 TB, Compute Optimized 52 vCPU + GPU, and **Snowcone discontinued** (existing customers supported until Nov 12, 2025).
- **Snowball Edge closed to new customers Nov 7, 2025** — AWS now points to DataSync, Data Transfer Terminal, Outposts, or partners.
- Current devices for existing customers: Snowball Edge Storage Optimized 210 TB NVMe and Compute Optimized 104 vCPU/416 GB.

**Decision: Snow vs DataSync vs DX vs Internet:**
- <10 TB + decent bandwidth → DataSync over internet/VPN.
- 10–100 TB + limited bandwidth → Snowball Edge or DataSync over DX.
- 100 TB – multi-PB → multiple Snow devices or DX + DataSync.
- Ongoing replication → DataSync scheduled / DMS / Storage Gateway.
- Continuous dedicated → **Direct Connect** + DataSync over it.

---

# TASK 3.2 — HIGH-PERFORMING COMPUTE

## EC2 Instance Families

**Naming decoder:** family + generation + modifiers + size (e.g., `c7gn.16xlarge`). Modifiers: **i**=Intel, **a**=AMD, **g**=Graviton, **n**=network optimized, **d**=NVMe, **z**=high freq, **e**=extended memory, **en**=enhanced network, **b**=EBS-optimized, **flex**=burstable variant.

**General Purpose:** T (burstable; T3/T3a/T4g), M (M6i/M6a/M6g/M7i/M7a/M7g/M7i-flex, **M8g/M8gn/M8gb** Graviton4 Sep 2024 — 600 Gbps net on M8gn, 150 Gbps EBS on M8gb). 🔴 **M9g Graviton5 preview Dec 2025** — not yet GA, don't assume on exam.

**Compute Optimized:** C6i/C6g/C6gn (100 Gbps), C7i/C7g/C7gn (200 Gbps), **C8g/C8gb/C8gn (600 Gbps Graviton4, Sep 2024)** — HPC, gaming, batch, ad serving.

**Memory Optimized:** R6/7/8 (8 GiB/vCPU); X2idn/X2iedn/**X8g** (extreme memory, up to 3 TB on X8g); u-* High Memory (24–32 TB bare-metal for SAP HANA); **z1d** (sustained 4.0 GHz, EDA/gaming/financial); **R7iz** (high-freq SQL/EDA).

**Storage Optimized:** I3/I4i (NVMe), I4g/Im4gn/Is4gen (Graviton + NVMe), **I7i/I7ie/I8g** (latest), D3/D3en (dense HDD up to 336 TB), H1 (HDD throughput, legacy). **Local NVMe is ephemeral.**

**Accelerated:** P4d/P4de (8× A100), P5/P5e/P5en (8× H100/H200 + 3200 Gbps EFA on P5en), **P6-B200 (GA May 15, 2025)** with 8× Blackwell B200, 1440 GB HBM, 3.2 Tbps EFAv4, 30 TB NVMe — 2× P5en. **P6-B300** (Blackwell Ultra: 2.1 TB HBM, 6.4 Tbps EFA). **P6e-GB200 UltraServers (GA Jul 2025)** — 72 Grace-Blackwell GPUs in one NVLink domain, 360 PFLOPS FP8, Dallas Local Zone via Capacity Blocks. G5/G6/G6e (inference/graphics). Inf2 (Inferentia2). **Trn1/Trn2** (Trainium; Trn2 UltraServer at re:Invent 2024 ties 4 Trn2 via NeuronLink). F1/F2 (FPGA). VT1 (transcoding).

**HPC:** Hpc6a (96-core AMD), Hpc6id (64-core Intel + 1 TB), **Hpc7g** (64-core Graviton3E + 200 Gbps EFA — CFD, weather), **Hpc7a** (192-core 4th-gen EPYC + 300 Gbps EFA). **SMT disabled, single-AZ, 500 Mbps cap outside VPC/S3** (big gotcha given internal 200–300 Gbps).

**Graviton:** 40% better price/perf vs x86; **Graviton4** = +30% perf, +40% databases, +45% Java vs Graviton3. ARM64 binary compatibility required.

**Nitro System:** hypervisor offload, Nitro Security Chip (HW root of trust), **Nitro Enclaves** (isolated CPU/memory, no persistent storage/networking, KMS-attested for PII processing/key management), Nitro SSDs, 6th-gen Nitro Cards = 600 Gbps networking on M8gn/C8gn.

## Purchasing Options

| Option | Discount | Commit | Capacity | Flexibility |
|---|---|---|---|---|
| On-Demand | 0 | none | no | total |
| Standard RI | up to 72% | 1/3 yr | Zonal RI only | size flex Linux only; resellable |
| Convertible RI | up to 66% | 1/3 yr | optional | exchange family/OS/tenancy |
| **Compute SP** | up to 66% | 1/3 yr | no | **EC2 + Fargate + Lambda**, all regions/families |
| EC2 Instance SP | up to 72% | 1/3 yr | no | family + region locked |
| SageMaker SP | up to 64% | 1/3 yr | no | all SageMaker ML usage |
| **Database SP** (newer) | varies | 1/3 yr | no | RDS/Aurora/DDB/ElastiCache/etc. |
| Spot | up to 90% | none | no | 2-min interruption notice |
| Dedicated Host | n/a | OD or 1/3 | whole HW | BYOL (Windows/Oracle/SQL), compliance |
| Dedicated Instance | n/a | n/a | HW-isolated | no BYOL |

**Spot:** 2-min notice via metadata + EventBridge. Interruption behaviors: terminate (default), stop, hibernate. **Rebalance Recommendation** earlier signal. **Spot Blocks deprecated**. Allocation: `capacity-optimized` (recommended), `price-capacity-optimized`. ECS Spot draining via `ECS_ENABLE_SPOT_INSTANCE_DRAINING=true`.

**Capacity Blocks for ML (2024–2025 expansion):** P6-B200, P6e-GB200, P5/P5e/P5en, P4d/P4de, Trn1, Trn2. 1–64 instances (up to 512 GPUs); **1–14 days standard, 21/28/multiples up to 182 days** (Nov 2024). Reserve up to 8 weeks in advance. **Instant start (Nov 2024)**. Non-cancelable. Co-located in EC2 UltraClusters.

## Auto Scaling

| Policy | Use case |
|---|---|
| **Target tracking** (recommended) | Metric proportional to capacity (CPU %, ALBRequestCountPerTarget) — auto-creates CW alarms (can't delete independently) |
| Step scaling | Different magnitudes at different breach levels |
| Simple (legacy) | Has cooldown; backward compat only |
| Scheduled | Predictable time pattern (cron, set TZ) |
| **Predictive** | ML 2-day forecast; requires ≥24 hr history (≥14 d ideal); start in ForecastOnly → ForecastAndScale |

**Lifecycle hooks:** `Pending:Wait` (bootstrap) / `Terminating:Wait` (drain, dump logs). Targets: EventBridge (recommended), SNS, SQS, Lambda. 1-hour default timeout. Don't prevent Spot interruption.

**Warm pools:** pre-initialized Stopped/Running/Hibernated instances for fast scale-out. Instance Reuse Policy (CLI-only) to return scaled-in to pool. Best for slow-boot AMIs, JVM warm-up.

**Mixed instances policy:** multi-type + Spot/On-Demand + weights. `OnDemandBaseCapacity` + `OnDemandPercentageAboveBaseCapacity`. Pattern: 20% OD baseline + 80% Spot.

**Instance Refresh** = rolling AMI/template replacement. **Maximum Instance Lifetime** = compliance patching. **Launch Configurations are deprecated** — use Launch Templates.

**Cooldown vs warmup:** cooldown = pause between simple-scaling actions; warmup = exclude new instance from metric aggregation in target/step/predictive.

## Lambda Performance

**Memory↔CPU:** 128 MB–10,240 MB; CPU/network/disk scale with memory; **1,769 MB = 1 full vCPU**. Use Compute Optimizer for tuning.

**Cold start mitigation:**
| Strategy | Cost | Effect |
|---|---|---|
| **Provisioned Concurrency** | per GB-hr | sub-ms cold |
| **SnapStart** | cache + restore fee | sub-second |
| ARM/Graviton2 | none | ~13–24% faster init |
| Minimize deps | free | always do |

**Reserved vs Provisioned Concurrency (commonly confused):**
- **Reserved** = cap/guarantee on concurrent executions (free; deducts from account quota).
- **Provisioned** = pre-warmed environments (extra GB-hr charge).
- Both can combine. **If Provisioned == Reserved → $LATEST throttled.**

**🟡 SnapStart expansion (Nov 2024):** Now supports **Python 3.12+ and .NET 8+** in addition to Java 11+. Firecracker microVM snapshot. **Not compatible with** provisioned concurrency, EFS, ephemeral >512 MB, container images, Node.js, Ruby. **Uniqueness gotcha**: unique IDs/secrets/entropy must regen in `after-restore` hook. Expanded to 23 more regions Jun 2025.

**Hard limits:** **15-min timeout, 10 GB memory, 6 MB sync payload, 256 KB async payload**, /tmp 512 MB → 10 GB, 250 MB unzipped package (function + layers), max **5 layers**, container images up to **10 GB**, 1000 concurrency default, RPS = 10× concurrency.

**🟡 Response streaming raised to 200 MB (Jul 2025)** from 20 MB; Function URLs only; Node.js native; first 6 MB no cap, then 16 Mbps.

**ARM/Graviton2:** 20% cheaper, 34% better price/perf, 45–65% faster cold start.

**ESM tunables:** SQS (BatchSize 1–10,000, BatchingWindow 0–300s, scales 60 concurrent/min); Kinesis (BatchSize, **ParallelizationFactor 1–10**, BisectBatchOnFunctionError); MQ ActiveMQ max 5 concurrent, RabbitMQ max 1.

**When NOT Lambda:** sustained high traffic, >15 min, persistent connections (use API Gateway WebSocket), GPU workloads, package >250 MB or >10 GB container.

## Container Orchestration

**ECS task placement (up to 5 chained):** **binpack** (cost), **spread** (HA), **random**. Constraints: `distinctInstance`, `memberOf`. **Default service** = spread on AZ. **Doesn't apply to Fargate** (auto-spreads).

**🟡 EKS Auto Mode (GA Dec 2024):** AWS fully manages compute, storage, networking, addons. Built on **Karpenter** + EC2 Managed Instances. Bottlerocket OS; AWS handles patching, repair, full lifecycle. Two default pools: General Purpose + System. Requires K8s 1.29+. **No custom AMIs.**

**🟡 EKS Hybrid Nodes (GA Dec 2024):** on-prem/edge servers as EKS nodes; control plane in AWS. Requires DX/VPN. IAM Roles Anywhere or SSM hybrid activation. Cilium/Calico CNI. **Not for disconnected envs** (use EKS Anywhere). Hourly per-vCPU fee.

**Karpenter:** open-source autoscaler; provisions EC2 directly via EC2 Fleet API; **sub-minute scale-up** (vs Cluster Autoscaler ~3–4 min); instance-type flexibility; built-in Spot/OD mix; consolidation. Don't run alongside CA.

**Pod Identity vs IRSA:** Pod Identity (newer, 2023) = simpler, cross-cluster, no OIDC per cluster.

**Fargate:** 0.25–16 vCPU, 0.5–120 GB; ephemeral storage 20 GB default → 200 GB. **Fargate Spot ECS-only** (not EKS Fargate). Always awsvpc network mode. Cold starts ~30–60s (longer than Lambda). No multi-node parallel jobs.

**App Runner:** managed containerized web apps; auto-scale 0–N; VPC connector.

## HPC

**Placement groups:**
| Type | Scope | Best for | Limits |
|---|---|---|---|
| **Cluster** | Single AZ, single rack | HPC, low latency (10/25 Gbps single-flow inside) | Same instance family; **5 Gbps cap to internet/DX** |
| **Partition** | Multi-AZ | Distributed DBs (HDFS, Cassandra, Kafka) | **Max 7 partitions/AZ**; Dedicated max 2 |
| **Spread** | Multi-AZ | Critical small clusters | **Max 7 instances/AZ** (rack); each distinct HW |

Cannot move into PG post-launch. Account limit 500 PGs per Region.

**EFA:** ENA + OS-bypass via libfabric; **SRD protocol** (multipath, hardware retransmit, congestion control). Supports Open MPI, Intel MPI, MVAPICH, NCCL, NIXL. **Single subnet/AZ only.** RDMA write/read on Nitro v4+. SG must allow self-traffic. Not all instances support EFA.

**ENA / ENA Express:** ENA up to 100/200 Gbps (600 on M8gn). **ENA Express** adds SRD to TCP/UDP within same AZ: single-flow 5 → **25 Gbps**, P99 latency -50%, P99.9 -85%.

**ParallelCluster:** open-source HPC orchestration with Slurm + EFA + FSx Lustre. **AWS PCS** = managed Slurm (re:Invent 2024).

**AWS Batch:** job queues, compute environments (EC2/Fargate/Spot), job definitions. Allocation: BEST_FIT, BEST_FIT_PROGRESSIVE, SPOT_CAPACITY_OPTIMIZED, SPOT_PRICE_CAPACITY_OPTIMIZED. **Multi-node parallel jobs** (gang-scheduled MPI, distributed GPU) — **not supported on Fargate**. **Fair-share scheduling** with `shareIdentifier` + `weightFactor` + `shareDecaySeconds` + `computeReservation`. Capacity Blocks supported.

## Decoupling/Messaging (D3 angles)

**SQS:** Standard nearly unlimited TPS; FIFO 300 TPS, **high-throughput FIFO 3000 TPS** with batching. Long polling 0–20s.

**SNS fan-out** to SQS/Lambda/Firehose/HTTP. FIFO topics → SQS FIFO only. Message filtering, archive+replay, 3000 TPS high-throughput FIFO.

**EventBridge Pipes (GA 2022):** 4 stages **Source → Filter → Enrich → Target**. Sources: SQS, Kinesis, DDB Streams, MSK/self-managed Kafka, MQ. Enrich: Lambda, Step Functions Express (sync), API destinations, API Gateway. 15+ target services.

**Step Functions Standard vs Express:**
| | Standard | Express |
|---|---|---|
| Duration | 1 yr | 5 min |
| Model | Exactly-once | At-least-once |
| History | 90 days | CloudWatch only |
| Price | $25/M state transitions | $1/M + $0.06/GB-hr |
| Sync invoke | no | yes |
| Distributed Map parent | **yes** | no |

**Distributed Map:** 10,000 parallel iterations, S3 dataset (millions of items); child Standard or Express. For million-item S3 batch (CSV/JSONL/Parquet/Inventory).

**Amazon MQ:** managed ActiveMQ/RabbitMQ for JMS/AMQP/STOMP/MQTT lift-and-shift.

---

# TASK 3.3 — HIGH-PERFORMING DATABASES

## RDS

**Engines (6):** MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, **🟡 Db2 (GA Nov 27, 2023)** — LUW only.

**Instance classes:** db.t (burstable), db.m (general), db.r/x (memory). **d-suffix** (db.m6gd, r6gd, r8gd) = local NVMe required for **RDS Optimized Reads**.

**Storage:** gp3 (3K IOPS / 125 MB/s baseline); io1 legacy (64K); **🟡 io2 Block Express GA for RDS Mar 2024** — 256K IOPS, 4 GB/s, 64 TiB, 99.999% durability, IOPS:GiB 1000:1 (Nitro). RDS SQL Server 64 TiB / 256K IOPS Jun 2024.

**Storage auto-scaling:** triggers at <10% free >5 min and last scaling >6 hr. Only grows; to shrink → Blue/Green.

**🟡 RDS Optimized Reads:** Up to **50% faster** (2× MySQL/MariaDB) — routes temp tables/sorts/hash aggregations to **local NVMe** instead of EBS. MySQL 8.0.28+, MariaDB 10.4.25+, PostgreSQL 13.10+. Needs d-suffix instance.

**🟡 RDS Optimized Writes:** **2× write throughput** by eliminating MySQL doublewrite buffer (uses durable Nitro storage). MySQL 8.0.30+ / MariaDB only; **must be enabled at instance creation** on Nitro storage; can't retrofit.

**Multi-AZ DB Instance vs Multi-AZ DB Cluster:**
- **Instance** (all 6 engines): synchronous standby, **failover ≤60s, standby NOT readable**, HA only.
- **Cluster** (MySQL + PG only): 1 writer + **2 readable standbys** across 3 AZs; semi-synchronous (quorum-of-1); **2× faster commits**, failover typically <35s.

Multi-AZ Instance = HA only, **NOT read scaling** — use Read Replicas (up to 15; engine-dependent).

**RDS Proxy:** connection pooling for Lambda/many-client apps; IAM auth + Secrets Manager + TLS; reduces failover time up to 66%. Adds ~5 ms latency. **Blocks Aurora serverless auto-pause.**

**🟡 RDS Blue/Green Deployments:** Near-zero-downtime upgrades; switchover **<1 min typical**; **Jan 2026 update: ≤5 sec direct endpoint, ≤2 sec with AWS Advanced JDBC Driver** (single-Region). DDL on Blue not replicated to Green (replication degraded). Cost = both envs during testing.

## Aurora

**Storage:** 6 copies across 3 AZs, log-structured, 10 GB → 128 TiB. Claim: 5× MySQL / 3× PostgreSQL throughput.

**Replicas:** up to **15 Aurora replicas** with single-digit-ms lag (shared storage, no log shipping). Failover ~30 s. **Reader endpoint round-robins per NEW connection only**; long-lived pools won't rebalance.

**Aurora Global Database:** **RPO ~1s typical, RTO ~1 min unplanned; managed switchover RPO 0**. Up to 5 secondary Regions. **Write forwarding** from secondaries to primary. Some statements (DDL, transactions) not forwarded.

**🔴 Aurora Serverless v2 → renamed "Aurora serverless" April 2026.** **🟡 Scale-to-zero GA Nov 20, 2024**: min capacity 0 ACUs, auto-pause 5 min–24 h idle, resume ~15 s. **Auto-pause blocked by**: RDS Proxy, zero-ETL to Redshift, Global DB secondary writer, engine-level scheduled jobs (pg_cron, MySQL event scheduler). **Aurora Serverless v1 retired Dec 31, 2024.**

**Aurora Parallel Query (MySQL only):** pushes filters/aggregations/projections to storage layer; up to 2 orders of magnitude faster analytical queries on operational data.

**🟡 Aurora I/O-Optimized:** up to **40% cost savings** when I/O charges >25% of bill; no per-I/O charges; switchable Standard ↔ I/O-Optimized, lock-in 30 days.

**🟡 Aurora Limitless Database (Postgres):** **GA Oct 31, 2024** — automated horizontal sharding; PostgreSQL 16.4-compatible; millions of write TPS, petabytes per logical DB. 2-layer architecture: Routers + Shards (Aurora Serverless v2). Requires I/O-Optimized. Sharded tables (with shard key) or Reference tables. **Single-Region** (different from DSQL).

**🟡 Aurora DSQL:** Preview Dec 2024 → **GA May 27, 2025**. Serverless, **distributed, active-active multi-Region with strong consistency**. 99.99% single-region / **99.999% multi-region**. Multi-region cluster = 2 regional endpoints + log-only witness in 3rd. Up to 4× faster reads/writes than Spanner/CockroachDB (AWS claim). Subset of PostgreSQL (no triggers, FKs, sequences early; views added at GA). OCC contention can abort high-contention writes. Billed in DPUs. Initially 8 single-Region; multi-region across us-east-1/us-east-2/us-west-2 + EU/APAC.

**🟡 Aurora Zero-ETL with Redshift:** Aurora MySQL (GA Nov 2023), **Aurora PG (GA Oct 2024), RDS MySQL (GA Sep 2024)**, RDS PG (2024 staggered), **DynamoDB → Redshift (GA Oct 2024)**, DynamoDB → SageMaker Lakehouse (preview Dec 2024), DynamoDB → OpenSearch. Replication seconds-level. Target Redshift Serverless or RA3. Up to **5 integrations per source DB**. Auto-pause incompatible.

**Backtrack** = MySQL only, in-place rewind up to 72 h. **Cloning** = copy-on-write, in-region only.

**Babelfish for Aurora PG:** T-SQL/TDS protocol compat — SQL Server apps work with minimal change. **NOT for RDS PostgreSQL.**

## DynamoDB

**Capacity modes:** Provisioned (auto-scaling, reserved capacity 1/3 yr) vs **On-Demand**. **🟡 On-Demand pricing reduced 50% Nov 1, 2024.** On-Demand doubles previous peak per 30-min window.

**Adaptive Capacity:** instant, automatic, no enable required.

**Burst Capacity:** up to 300 s unused capacity reserved per partition.

**Math (memorize):** 1 RCU = 1 strong read of 4 KB/s; eventual = 0.5 RCU; **transactional = 2 RCU**. 1 WCU = 1 KB/s write; **transactional = 2 WCU**. Partition limit: 3,000 RCU + 1,000 WCU.

**Indexes:**
- **LSI**: same PK, alt SK; **must be created at table creation**; max 5; shares table throughput; strong reads supported; **10 GB collection limit per PK value**.
- **GSI**: different PK+SK; **add anytime**; max 20; separate throughput; **eventually consistent only**. GSI throttling can throttle base table writes.

**Operations:** BatchGetItem (100/16 MB), BatchWriteItem (25/16 MB), Transact ops (100/4 MB). Parallel Scan via Segment/TotalSegments.

**DynamoDB Streams:** 24-hour log; KEYS_ONLY/NEW_IMAGE/OLD_IMAGE/NEW_AND_OLD; Lambda trigger. **Kinesis Data Streams for DynamoDB** = alternative with longer retention.

**Global Tables:**
- **MREC (eventual, default):** <1s lag, last-writer-wins, any number of Regions.
- **🟡 MRSC (strong consistency):** Preview Dec 2024 → **GA Jun 2025** in 10 Regions. **Exactly 3 Regions** (or 2 + witness). Synchronous; RPO 0; strong reads from any Region. **Restrictions: no TTL, no LSI, table must be empty at conversion, write conflicts → ReplicatedWriteConflictException.**

**🟡 Warm Throughput (GA Nov 13, 2024):** Visibility into min instant read/write capacity; pre-warm before known peak (product launch). **Cannot decrease after increase.** Applies to tables, GSIs, Global Tables v2019.11.21. Even on on-demand, exceeding 2× previous peak within 30 min can throttle.

**🟡 Import from S3:** **50,000 objects per import** (raised Mar 27, 2024); creates **new** table only; 0 WCUs consumed; $0.15/GB. Max 15 TB in major regions.

**🟡 Configurable max throughput on on-demand (May 2024):** cost guardrails.

**DAX:** **Microsecond** reads via write-through cache for DynamoDB. Up to **11 nodes** (1 primary + 10 replicas), multi-AZ. **Item cache + Query cache.** **DynamoDB-only.** **Strong reads bypass the cache.** vs ElastiCache for DynamoDB: DAX = zero-code, DDB-aware; ElastiCache = more control, broader use.

## ElastiCache

**🟡 Valkey** (ElastiCache Oct 2024): Redis 7.2.4 fork, drop-in API-compatible. **33% cheaper Serverless, 20% cheaper node-based** vs Redis OSS. Serverless minimum **100 MB** (vs Redis OSS 1 GB). In-place zero-downtime upgrade from Redis. Valkey 8.0/8.1 adds I/O threading: up to **230% higher throughput, 70% lower latency, ~20% memory savings**.

**Topology:**
- Cluster mode **disabled**: 1 shard, up to 5 replicas.
- Cluster mode **enabled**: up to **500 shards**; **multi-key ops require `{hashtag}`** so keys map to same slot.
- Memcached: multi-threaded, no persistence, no replication.

**🟡 ElastiCache Serverless (GA Nov 27, 2023):** <1 min setup; 99.99% SLA; multi-AZ default; ECPU billing. Engines: Redis OSS 7.1+, Memcached, **Valkey**. Always-encrypted; cluster mode always on; can scale **2× every 10 min**. Min cost ~$90/mo Redis OSS or **$6/mo Valkey**.

**Data tiering** (R6gd): ~20% RAM + 80% NVMe SSD → ~$ /60% reduction for ~500 GB/node.

**Global Datastore** (Redis/Valkey): 1 primary + up to 2 secondary regions; **<1s** typical cross-region replication; read-only secondaries.

## Caching Strategies

- **Cache-aside (lazy loading):** miss → DB → populate cache. Only requested data cached; stale risk.
- **Read-through:** cache fetches DB transparently on miss.
- **Write-through:** every write to cache + DB sync. Cache fresh; writes slower; caches unread data.
- **Write-back / write-behind:** write cache then async DB. Fast writes; durability risk → use **MemoryDB**.
- **Refresh-ahead:** proactive refresh before TTL expiry.
- **TTL + jitter:** prevents synchronized expirations.
- **Thundering herd:** locks (single-flight), request coalescing, probabilistic early expiration, serve-stale-while-refresh.
- **Multi-tier:** CloudFront → API Gateway cache → ElastiCache → DB.

Exam quickpicks: "microsecond + durable" → MemoryDB; "microsecond DDB" → DAX; "sub-ms ephemeral cache" → ElastiCache Redis/Valkey; "cross-region cache" → ElastiCache Global Datastore or MemoryDB multi-region.

## Specialized Databases

**MemoryDB for Redis/Valkey:** Durable Redis with multi-AZ transaction log; **microsecond reads, single-digit-ms writes** (transaction log overhead); 99.99%; vector search; multi-Region active-active with CRDT. **🟡 MemoryDB for Valkey Oct 2024:** 30% cheaper, no data-write charges up to 10 TB/mo.

**DocumentDB:** MongoDB-compatible up to 5.0; Aurora-style storage; up to 15 replicas; Global Clusters; vector search (2024). NOT MongoDB Atlas — feature gaps.

**Neptune:** Gremlin/SPARQL/openCypher; Serverless (NCU); **Neptune Analytics** (in-memory graph algos); **Neptune ML** (SageMaker-driven).

**Timestream + Timestream for InfluxDB** (managed InfluxDB OSS, 2024).

**Keyspaces:** Cassandra-compatible, serverless option.

**🔴 QLDB DISCONTINUED: End of support Jul 31, 2025.** New signups closed Jul 2024. AWS recommends Aurora PostgreSQL + pgAudit (no cryptographic verifiability replacement). On exam, treat QLDB as legacy/no-go.

## Redshift

**RA3 with managed storage:** compute + storage decoupled; hot SSD cache. **🔴 DC2 EOL April 24, 2026** — migrate to RA3 or Serverless.

**🟡 Redshift Serverless (GA Jul 2022):** RPU-based; AI-driven scaling (re:Invent 2023).

**🔴 AQUA:** API parameter `AquaConfigurationStatus` retired; no longer customer-toggled; Redshift auto-determines. Treat as "auto-managed/effectively retired."

**Concurrency Scaling:** transient clusters for read bursts; **1 hr/day free**.

**Materialized Views:** auto-refresh + **incremental refresh**; AutoMV picks them.

**WLM:** **Automatic WLM** (recommended) or manual queues; query priority.

**Redshift Spectrum:** query S3 external tables; bills per TB scanned (like Athena).

**Streaming Ingestion:** materialized view directly off KDS or MSK; no S3 staging; seconds latency.

**Zero-ETL targets** (see Aurora section). **Salesforce Data Cloud** also a source.

**Sort key + dist key** = #1 perf lever. Wrong DISTKEY = data skew = slow joins.

## DMS / Migration

**DMS:** homogeneous + heterogeneous + CDC. **Serverless DMS** (DCU-based, no instance). Targets include Db2 (2023).

**SCT / DMS Schema Conversion** (managed service version).

**Common paths:** Oracle → Aurora PG (DMS + SCT); SQL Server → Aurora PG + Babelfish; MongoDB → DocumentDB or DynamoDB; MySQL → Aurora MySQL.

---

# TASK 3.4 — HIGH-PERFORMING NETWORKING

## CloudFront

**Cache hierarchy:** Edge PoP (600+) → Regional Edge Cache (~13 locations) → **Origin Shield** (optional, mid-tier) → Origin. **PUT/POST/PATCH/DELETE/OPTIONS bypass REC.** HTTP/3 (QUIC) supported (~10% TTFB / 15% page load improvement).

**TTL strategy:** Min TTL (floor overriding Cache-Control), Max TTL (ceiling), Default TTL. 0 = pass-through dynamic.

**Origin Shield:** mid-tier cache between RECs and origin; centralized request collapse. **Pick AWS Region closest to ORIGIN, not viewers.** Charged per request. Lambda@Edge origin functions run only in Shield region when enabled.

**Lambda@Edge:** runs at REC (not edge PoP); Node.js 22 / Python 3.13; **4 triggers** (viewer-request, origin-request, origin-response, viewer-response); **timeouts 5s viewer / 30s origin**; supports network calls, request body, file system; replicates globally (deploy takes minutes). $0.60/M invocations + GB-sec.

**CloudFront Functions:** **JS only, <1 ms, 10 KB code, 2 MB memory**; **only viewer-request/response triggers**; cannot make network calls; cannot modify response body. $0.10/M invocations. **🟡 KeyValueStore (GA Nov 2023):** 5 MB per KVS, 1 per function, key ≤512 B, value ≤1 KB; requires cloudfront-js-2.0; for A/B flags, URL rewrites, env vars.

**OAC vs OAI:** **OAC required for SSE-KMS, new opt-in S3 regions, dynamic methods (PUT/POST), per-distribution restriction via `AWS:SourceArn`**. OAI legacy. **OAC + S3 website endpoint NOT supported** (use REST endpoint). S3 must be Bucket Owner Enforced (no ACLs).

**Signed URLs/cookies, field-level encryption, real-time logs (Kinesis), origin failover (groups with failover codes), 🔴 VPC Origins (2024)** — private CF → internal ALB/NLB/EC2.

## Global Accelerator

**Standard Accelerator:** **2 static anycast IPv4** (or +2 IPv6). Up to **60% latency improvement** vs internet. **TCP termination at edge** (3-way handshake at nearest PoP, second TCP to regional endpoint). Sub-second failover (~30 s).

Endpoints: ALB, NLB, EC2, EIP. **Endpoint groups** = per-Region. **Traffic dials 0–100% per group** for maintenance/canary. **Weights 0–255 per endpoint** for blue/green. **Client affinity:** NONE (5-tuple) or SOURCE_IP (2-tuple, sticky). BYOIP supported. Preserves client IP on NLB targets / EC2-by-IP. **NOT a CDN.**

**vs CloudFront:** CF = HTTP caching. GA = static IPs + TCP/UDP + IP preservation + non-cacheable.

**Custom Routing Accelerator:** deterministic port-to-EC2 mapping (gaming, VoIP). Endpoints = VPC subnets. No health checks; you control routing.

## Transit Gateway

**Scale:** up to 5,000 VPC attachments; ~50 per VPC. **Bandwidth: up to 50 Gbps burst per VPC attachment per AZ.** Per-flow cap ~5 Gbps (10 Gbps within placement group). 🔴 Verify aggregate per attachment.

**Multiple route tables** per TGW for segmentation. Peering attachments don't support route propagation (use static). **TGW is the only AWS service with native multicast across VPCs.**

**Connect attachment:** GRE + BGP for SD-WAN — up to 5 Gbps per Connect peer, 4 peers/attachment = 20 Gbps total.

**Appliance mode:** pins bidirectional flows to same AZ (required for stateful firewalls behind TGW).

**Shared via RAM** for multi-account central network.

**Cost:** per-attachment-hour + per-GB processed.

**Gotchas:** no SGs on TGW itself; overlapping CIDRs unsupported; each Region needs its own TGW; PMTU Discovery only on VPC and Connect ingress (not VPN/DX/peering).

## VPC Peering vs TGW vs PrivateLink

| Feature | Peering | TGW | PrivateLink |
|---|---|---|---|
| Topology | 1:1 mesh | hub-spoke | service-consumer |
| Transitive | ❌ | ✅ | n/a |
| Scale | hundreds (n²) | 5,000 | per-endpoint |
| Cost | free (cross-AZ/region data only) | attachment-hr + per-GB | endpoint-hr + per-GB (Interface) or **FREE (Gateway)** |
| Overlapping CIDRs | ❌ | ❌ | ✅ |
| Use case | few VPCs, simple | many VPCs, hybrid, transitive | one-way service exposure |

## PrivateLink / VPC Endpoints

**Interface Endpoint:** ENI w/ private IP. $/hour per AZ + $/GB processed. Endpoint policies, SGs, private DNS. **🟡 Cross-region (Nov 2024)** native support.

**Gateway Endpoint:** **S3 + DynamoDB only**; route table prefix list; **FREE**. **Cannot extend over peering/VPN/DX to on-prem** — use S3 Interface Endpoint for that.

**Gateway Load Balancer Endpoint (GWLBe):** **GENEVE encapsulation** to 3rd-party appliances (firewall, IDS/IPS, DPI). Central inspection VPC pattern.

**Endpoint Services:** backed by **NLB or GWLB** (ALB only indirectly via NLB target group).

## Direct Connect

**Dedicated:** 1, 10, 100, or **🟡 native 400 Gbps (Jul 2024)** at select PoPs. Takes weeks. **NOT encrypted by default.**

**Hosted Connection:** 50 Mbps – 25 Gbps via partner.

**VIFs:** Public (AWS public services), Private (VPC via VGW or DXGW), Transit (TGW via DXGW).

**🟡 MACsec:** link-layer encryption near line-rate; **10/100/400 Gbps Dedicated only**; **NOT on 1 Gbps or Hosted Connections**. GCM-AES-256 (10G) or GCM-AES-XPN-256. SiteLink supports MACsec.

**DX Gateway (DXGW):** associate one DX VIF with VPCs/TGWs across multiple Regions globally (excl. China). Private VIF → up to 20 VPCs; Transit VIF → up to 6 TGWs.

**SiteLink:** DX-to-DX private backbone, bypass Regions for site-to-site WAN. Hourly per-VIF + per-GB.

**LAG:** bundle 2–4 dedicated connections same speed on same AWS device. **NOT a resilience strategy** (single AWS device) — use 2 separate DX locations for HA.

**BGP + BFD** (sub-second failover). HA models: Max Resiliency 99.99% = 2 locations + 2+ connections; High Resiliency 99.9% = 2 locations + 1 each. **DX + VPN over Internet** as backup is most cost-effective HA.

## Enhanced Networking

**ENA:** SR-IOV; 100 Gbps typical, **200 Gbps on m6in/m7in, 600 Gbps on M8gn (2025)**, **3200 Gbps on P5/P6**. **ENA Express** adds SRD within same AZ.

**EFA:** OS-bypass libfabric + SRD. 100 Gbps gen-1, **200 Gbps gen-2 (Nitro v5)**, P5/P5e ~3200 Gbps. **Same subnet/AZ only.** Pair with Cluster PG.

## Route 53

**Routing policies:** Simple, Weighted, Latency (uses resolver IP not necessarily end-user), Failover (health-check), Geolocation (strict by continent/country/state), **Geoproximity (with bias, requires Traffic Flow — extra cost)**, Multivalue Answer (cheap client-side LB), IP-based.

**Health checks:** endpoint (HTTP/HTTPS/TCP), calculated (composite), CloudWatch alarm-driven.

**Route 53 Resolver:** Inbound Endpoint (on-prem → AWS DNS), Outbound Endpoint (AWS → on-prem DNS), Resolver Rules, DNS Firewall.

**🟡 Route 53 Profiles (Apr 2024):** define DNS config (private hosted zones, resolver rules, DNS Firewall, interface VPC endpoints) once, apply to many VPCs in a Region. **Shared via AWS RAM** (read-only for recipients). GovCloud Jun 2024.

**Route 53 ARC:** 5 redundant regional endpoints; readiness checks + manual on/off routing controls for multi-region apps. $2.50/hr cluster.

**DNSSEC** signing for public hosted zones; Resolver supports validation.

## ALB / NLB / GWLB (D3 angles)

**ALB (L7):** **🟡 mTLS Nov 2023** (verify-with-trust-store or passthrough), target weighting (blue/green), slow start mode, Cognito/OIDC auth, HTTP/2 + WebSocket native, gRPC. **Cross-zone LB ON by default, FREE.** Targets: Instance, IP (incl. on-prem via DX/VPN), Lambda, ALB-as-NLB-target.

**NLB (L4):** millions of req/sec, sub-ms latency, static IP per AZ (or EIP), AWS HyperPlane. **TCP/UDP/TLS** listeners, QUIC, source IP preserved (unique vs ALB for instance-ID/UDP targets), sticky sessions (source-IP). **Cross-zone OFF by default; charged per-GB inter-AZ when enabled.**

**GWLB (L3):** GENEVE (port 6081); transparent bump-in-the-wire for appliances; flow stickiness (5-tuple); always paired with GWLBe. **Cross-zone FREE when enabled.**

## NAT Gateway

**Bandwidth:** 5 Gbps → 100 Gbps auto-scale. Up to 8 IPv4 addresses (1 primary + 7 secondary) for higher port range.

**Cost:** ~$0.045/hour + **~$0.045 per GB processed** — often huge bill. **Cost optimization: Gateway VPC Endpoint (FREE) for S3/DynamoDB traffic.**

**Per-AZ for HA.** No SGs on NAT GW (use NACL on subnet). 🔴 **Provisioned NAT Gateway (2024)** — fixed bandwidth pricing, no data-processing fee.

## 2024–2026 Networking Updates

- 🟡 Route 53 Profiles (Apr 2024)
- 🟡 DX 400 Gbps Dedicated (Jul 2024)
- 🟡 PrivateLink cross-region (XRPL, Nov 2024)
- 🟡 **VPC Block Public Access (BPA, Nov 2024)** — account/Region-wide declarative block of IGW/EIGW traffic; bidirectional or ingress-only; per-VPC/subnet exclusions. Does **NOT** block PrivateLink, TGW, DX, peering.
- 🟡 **Security Group VPC Associations + RAM sharing (Oct 2024)** — single SG across multiple VPCs in same Region; share to participant accounts.
- 🟡 CloudFront KeyValueStore (Nov 2023)
- 🟡 ALB mTLS (Nov 2023)
- 🔴 CloudFront VPC Origins (2024)
- 🔴 Route 53 Global Resolver (2025 preview) — anycast DNS for hybrid

---

# TASK 3.5 — DATA INGESTION / TRANSFORMATION / ANALYTICS

## Kinesis Data Streams

**Shard math (memorize):** **1 MB/s and 1,000 rec/s IN per shard; 2 MB/s OUT per shard (shared standard consumers).**

**On-Demand mode (2021):** default 4 MB/s + 4,000 rec/s; auto-scales **up to 200 MB/s + 200,000 rec/s** per stream by default (scales when 30-day peak doubles). **🟡 2024: scales to 1 GB/s with support request. On-Demand Advantage** (2025) adds configurable warm throughput up to 10 GiB/s, ~60% lower per-GB pricing.

**Enhanced Fan-Out (EFO):** dedicated **2 MB/s per consumer per shard** via push HTTP/2 SubscribeToShard; **sub-200 ms latency**.

**Standard consumers = pull** (max 5 TPS per shard, share 2 MB/s).

**Retention:** default 24 h → up to **365 days**.

**Hot shard mitigation:** better PK distribution; on-demand auto-splits at >50% utilization; manual split/merge for provisioned. **On-Demand still has per-PK 1 MB/s + 1,000 rec/s ceiling.**

**Replay capability** differentiates KDS from SQS.

## Amazon Data Firehose

**🔴 Renamed from "Kinesis Data Firehose" Feb 9, 2024.** Namespace `firehose:`.

**No shards; near-real-time** (60 s minimum buffer typical; **🟡 zero-buffering (Dec 2023) → ~5 s** for S3/OpenSearch/Redshift/HTTP).

**Buffer hints:** size 1–128 MiB, interval 60–900 s (Iceberg + some 0–900 s).

**Destinations:** S3, Redshift (via S3 + COPY — not direct), OpenSearch + Serverless, HTTP (Datadog, NewRelic, MongoDB, Coralogix, Elastic, Dynatrace, Logz.io), Splunk, Snowflake, **🟡 Apache Iceberg incl. S3 Tables (GA Oct/Nov 2024)**, **🔴 MySQL/PostgreSQL CDC → Iceberg (preview Nov 2024)**.

**Format conversion:** JSON → **Parquet or ORC** via Glue schema. **Dynamic partitioning** (JQ expressions or Lambda) — additional charge.

## Amazon MSK

**Provisioned (Standard) brokers** (kafka.t3/m5/m7g) vs **🟡 Express brokers (2024)** = 3× throughput, 20× faster scaling, 90% faster recovery.

**MSK Serverless (GA Apr 2022):** **200 MB/s write / 400 MB/s read per cluster**; 5 MB/s write / 10 MB/s read per partition; 120 default partitions / 2,400 leader partition limit; 3 replicas free; **IAM auth + PrivateLink only**.

**MSK Connect:** managed Kafka Connect; up to 60 workers/account; Debezium, S3 sinks.

**🟡 KRaft mode (Apache Kafka 3.7+, May 2024):** replaces ZooKeeper; up to **60 brokers/cluster** vs 30 ZK. **No in-place ZK→KRaft on MSK** — must migrate to new cluster. 3.9 supports both; 4.0+ KRaft-only.

**MSK Tiered Storage:** older data auto-tiered to S3, queryable transparently — Apache Kafka 3.6.x+ / MSK 3.8/3.9.

**MSK Replicator:** cross-region replication; max 1 GB/s ingress; 10 MB max record; 15 replicators/account.

## Streaming Comparison

| Feature | KDS | SQS Std/FIFO | MSK |
|---|---|---|---|
| Ordering | per-shard (per PK) | Std best-effort / FIFO per group | per-partition |
| Retention | 24 h → 365 d | 4 d default → 14 d max | configurable, with Tiered Storage forever |
| Replay | yes | **no** | yes |
| Fan-out | multi-consumer + EFO | one msg → one consumer (SNS for fan-out) | consumer groups w/ own offsets |
| Latency | sub-200 ms (EFO) → ~1 s | ms–s | ms |
| Exactly-once | at-least-once natively | at-least-once Std, exactly-once FIFO | with idempotent producers + transactions |

SQS = work queue (decoupling, no replay). KDS/MSK = event log (replayable).

## AWS Glue

**Job types:** Spark (batch + streaming), Python shell, **Ray**.

**Worker types (Spark):** G.1X (4 vCPU/16 GB), G.2X (8/32), G.4X (16/64, Glue 3.0+), G.8X (32/128, Glue 3.0+), **🟡 G.12X / G.16X + R.1X–R.8X memory-optimized (Glue 4.0+)**, G.025X streaming low-volume, Z.2X Ray.

**🟡 Flex execution class:** ~50% cheaper for non-urgent batch (G.1X/G.2X only, Glue 3.0+).

**🟡 Auto Scaling (Glue 3.0+):** dynamic worker count based on stage parallelism.

**Versions:** Glue 4.0 (Dec 2022, Spark 3.3.0); **🟡 Glue 5.0 (GA Dec 2024 / re:Invent 2024)** = Spark 3.5.x + Python 3.11 + Java 17; **32% faster, 22% cheaper** than 4.0; Lake Formation native FGAC for Spark (incl. Iceberg/Hudi/Delta); S3 Access Grants; SageMaker Lakehouse/Unified Studio; DataZone lineage. 🔴 **Glue 5.1 (Nov 2025):** Spark 3.5.6; Iceberg 1.10.0 / v3 format; MV in Catalog; Hudi/Delta FGAC write support; Spark troubleshooting agent.

**Crawlers** auto-discover schemas (cost per DPU-hour — don't run too often).

**DataBrew** = visual no-code prep (250+ transformations).

**Job bookmarks** for incremental ETL (the exam answer for "process new files only").

**Schema Registry:** Avro, JSON, Protobuf; compatibility checks for Kafka/KDS producers.

**Glue Streaming ETL:** continuous Structured Streaming from KDS/MSK/Kafka.

## Lake Formation

Built on Glue Data Catalog; **fine-grained access control: database/table/column/row/cell**. **LF-Tags (TBAC)** scale permissions across thousands of tables. **Cross-account sharing via AWS RAM** (no data copy). **Governed Tables** (ACID on S3) — limited adoption; many use Iceberg/Hudi/Delta (Glue 5.0 brought Spark-native FGAC for OTFs).

Engines enforcing LF: Athena, Redshift Spectrum, EMR (Spark/Trino/Hive), Glue ETL, QuickSight, SageMaker.

LF governs the **Catalog** (metadata). IAM still must be locked-down (use `UseOnlyLakeFormationPermissions` to prevent IAM bypass).

## Athena

**Presto/Trino-based; engine v3 = Trino (GA Oct 2022).** Price: ~$5/TB scanned. Reduce via columnar (Parquet/ORC) + partitioning + compression + SELECT only needed cols + **query result reuse (cache up to 7 days, Feb 2024+)**.

**Partition projection** for tables with millions of partitions (avoids Glue metastore calls).

**CTAS:** create new tables with format conversion + partitioning + bucketing; max 100 unique partition+bucket combos per run.

**Federated queries** via Lambda-based connectors to RDS, DynamoDB, DocumentDB, Redshift, OpenSearch, HBase, Snowflake, CloudWatch Logs, etc.

**Workgroups:** per-workgroup result location, query cost limits, engine version, encryption.

**Iceberg/Hudi/Delta** supported in engine v3 SQL.

**Athena for Apache Spark (Dec 2022):** PySpark notebooks, sub-second startup.

## EMR

**EMR on EC2** (classic, persistent or transient).

**EMR Serverless (GA Jun 2022):** no cluster mgmt; pay per second of vCPU/memory/storage; pre-initialized capacity option for sub-second start.

**EMR on EKS:** Spark on existing EKS; up to 40% better price-perf with Graviton.

**EMR on Outposts:** data residency.

**Instance Fleets:** mix instance types + Spot/On-Demand with weighted capacity. Spot allocation: capacity-optimized, price-capacity-optimized, lowest-price, diversified.

**Managed Scaling:** auto-add/remove core + task nodes based on YARN metrics.

**EMR Studio:** web IDE with Jupyter + Git.

**EMRFS:** S3 as Hadoop FS.

## Redshift (see Task 3.3 above for engine-level performance)

## OpenSearch Service

**Provisioned** (data nodes: r6g/c6g/m6g/m7g/**OR1** indexing-optimized) + **dedicated master nodes** + **UltraWarm nodes**.

**🟡 OpenSearch Serverless (GA Jan 2023):** **OCU billing** (1 OCU = 6 GiB RAM + vCPU + GP3 + S3 transfer). Collections: search / time series / **vector search**. Baseline 4 OCUs prod (~$350/mo) — billing floor. Vector collections can't share OCUs with other types.

**Storage tiers:**
- **Hot:** data nodes' SSD/EBS.
- **UltraWarm:** S3-backed, queryable directly, **~90% cheaper than hot** (~$0.024/GB-mo).
- **Cold:** S3-only, no compute; cheapest; must warm/attach before query.

**Index State Management (ISM):** policy automation (rollover, snapshot, transition hot→UltraWarm→cold→delete).

**Multi-AZ with Standby:** 99.99%; no extra cost for standby nodes.

**OpenSearch ML:** anomaly detection, k-NN/vector search (RAG), neural search.

**🟡 OpenSearch Ingestion (GA Apr 2023):** managed Data Prepper; OCU-billed.

**Dashboards = Kibana fork.**

## 🔴 QuickSight → Amazon Quick Suite (rebrand Oct 9, 2025)

On **Oct 9, 2025** AWS announced **Amazon Quick Suite** — agentic AI workspace bundling BI (now "Quick Sight"), Quick Research, Quick Flows, Quick Automate, Q Business. **Existing QuickSight APIs/SDKs/dashboards/permissions migrate seamlessly.** Pricing: Author Pro $50→$40/mo, Reader Pro $20/mo, Reader $3, Author $24.

**SPICE:** in-memory columnar engine, ~10× faster than direct query; per-user GB allocation; incremental refresh.

**Q in QuickSight / Quick Sight Q:** natural-language analytics; ML insights (anomaly, forecasting).

**Paginated Reports (Nov 2022):** pixel-perfect printable.

**Embedded analytics:** anonymous + per-user; SDK/APIs.

**🟡 Generative BI with Amazon Q (2024):** generate visuals/dashboards from prompts.

**Pricing:** per-session reader ($0.30, capped $5/user/mo) or **capacity pricing**.

## S3 Tables (re:Invent 2024)

See Task 3.1 section. **3× faster queries, 10× higher TPS** vs self-managed Iceberg; auto-compaction/snapshot/cleanup; Iceberg V2 features; integration with Glue Catalog, Athena, Redshift, EMR, Spark, QuickSight, **Data Firehose**.

## S3 Metadata (re:Invent 2024)

See Task 3.1 section. **Journal table** (changes <1 hr) + **🟡 Live inventory table (GA 2025)** (full snapshot + custom tags + user metadata). Queryable via Athena, Redshift, EMR, Spark, Trino.

## MWAA / Data Exchange / AppFlow

**MWAA (Managed Airflow):** environment sizes mw1.small → mw1.2xlarge. DAGs from S3. 🟡 Airflow 2.10+ in 2024.

**AWS Data Exchange:** subscribe to third-party datasets; delivery to S3, API Gateway, **Redshift (data sharing under the hood)**, Lake Formation tables, S3 data sets. EventBridge for revision notifications.

**AppFlow:** SaaS↔AWS no-code bi-directional transfer; connectors for Salesforce, ServiceNow, Slack, Google Analytics, Marketo, etc.; targets S3, Redshift, EventBridge, Snowflake. Field-level transforms.

## Zero-ETL Integrations (verified May 2026)

| Source | Target | Status |
|---|---|---|
| Aurora MySQL | Redshift | GA Nov 2023 |
| Aurora PostgreSQL | Redshift | GA 2024 |
| RDS MySQL | Redshift | GA Sep 2024 |
| RDS PostgreSQL | Redshift | GA 2024 (staggered) |
| DynamoDB | Redshift | GA 2024 |
| DynamoDB | OpenSearch | GA 2024 |
| Aurora/RDS | SageMaker Lakehouse | 2024+ |
| SaaS via Glue/AppFlow | Redshift | 2024 |

Target Redshift Serverless or RA3; up to 5 integrations per source; data filtering supported; PKs required on source.

---

# CROSS-CUTTING EXAM PATTERNS

## Common scenario quickpicks

| Scenario | Answer |
|---|---|
| HPC simulation, parallel reads | **FSx Lustre + Cluster PG + EFA + DRA to S3** |
| SAP HANA / mission-critical OLTP | **EBS io2 Block Express** or u-* High Memory |
| AI/ML training data co-located | **S3 Express One Zone** or **FSx Lustre Intelligent-Tiering** |
| Hybrid SMB file share with cloud | **S3 File Gateway** |
| Multi-region active-active SQL strong consistency | **Aurora DSQL** |
| Multi-active NoSQL strong consistency | **DynamoDB Global Tables MRSC** |
| Microsecond DDB reads | **DAX** |
| Microsecond durable | **MemoryDB** |
| Sub-ms ephemeral cache | **ElastiCache Valkey** |
| Variable / spiky relational | **Aurora serverless** (scale-to-zero) |
| Commercial Oracle/SQL Server → cheap modern | **Aurora PostgreSQL + Babelfish + DMS+SCT** |
| Real-time OLTP → analytics | **Zero-ETL to Redshift** |
| Lambda → Aurora connection storm | **RDS Proxy** (blocks Aurora serverless auto-pause) |
| Million-item S3 batch | **Step Functions Distributed Map** w/ Express children |
| Bursty K8s spiky workloads | **EKS Auto Mode** (Karpenter under hood) |
| 64 P5 instances for ML training 2 weeks | **EC2 Capacity Block for ML** + EFA + Cluster PG |
| Long Java cold starts on Lambda | **SnapStart** + ARM |
| Lambda response 50 MB payload | **Response streaming** (200 MB max as of Jul 2025) |
| Global low-latency HTTP | **CloudFront** |
| Global low-latency TCP/UDP + static IPs | **Global Accelerator** |
| Multi-region active-active web app | Route 53 latency/geo + ALBs + Aurora Global DB |
| Hybrid HA | 2× DX (different locations) + VPN backup |
| Cost-optimize S3/DDB private traffic | **Gateway VPC Endpoint (FREE)** |
| Microservice mesh, SaaS expose | **PrivateLink Interface Endpoints + NLB-backed Endpoint Services** |
| Multi-account hub network | **TGW + RAM + central inspection VPC + GWLB + appliances** |
| Real-time clickstream <1s | **KDS + Lambda or EFO** |
| Near-real-time S3 in Parquet | **Amazon Data Firehose** + format conversion + dynamic partitioning |
| Op data lake | S3 + Glue Crawler + Catalog + Lake Formation + Athena |
| Hot+cold log search for years | **OpenSearch + UltraWarm + Cold + ISM** |
| Lake house | S3 Tables + Glue + Lake Formation + Athena + Redshift Spectrum |
| Stream-to-warehouse | **Redshift Streaming Ingestion** from KDS/MSK |
| Multi-step ETL orchestration | **MWAA** |
| Bulk on-prem → S3 migration | **DataSync** (online) or Snowball (offline PBs, existing customers) |
| Find S3 objects matching tags | **S3 Metadata** + Athena |
| Visual BI sub-second | **QuickSight/Quick Sight + SPICE** |
| Ask data in English | **Q in QuickSight / Quick Sight Q** |

## Master gotcha list

1. **DAX is DynamoDB-only**; strong reads bypass cache.
2. **RDS Multi-AZ Instance = HA only**; standby not readable. Only Multi-AZ Cluster (MySQL/PG) has readable standbys.
3. **Reader endpoint round-robins per new connection**; long-lived pools won't balance.
4. **LSI must be created at table creation**; cannot add later.
5. **DDB transactions cost 2× RCU/WCU**; strong reads cost 2× and same-AZ only.
6. **DDB MRSC requires exactly 3 Regions** (or 2 + witness), no TTL, no LSI, empty table at conversion.
7. **DDB Import from S3** creates new table only; 50K objects max.
8. **Aurora Serverless v1 retired Dec 31, 2024.**
9. **Aurora serverless auto-pause blocked by RDS Proxy, zero-ETL, Global DB secondary writer.**
10. **Redis cluster-mode multi-key ops need `{hashtag}`.**
11. **RDS storage auto-scaling triggers at <10% free** with 6-hr cooldown; only grows.
12. **RDS Optimized Writes MySQL/MariaDB only**, must enable at creation, Nitro-only.
13. **io2 Block Express 256K IOPS needs Nitro + ≥256 GiB volume.**
14. **QLDB retired Jul 31, 2025.**
15. **AQUA auto-managed/effectively retired** — don't pick "enable AQUA."
16. **Aurora Limitless ≠ Aurora DSQL** (Limitless = sharded single-region PG; DSQL = active-active multi-region).
17. **MemoryDB writes are single-digit-ms** (not microseconds) due to transaction log durability.
18. **Babelfish is Aurora PostgreSQL only**, not RDS PG.
19. **T-instance Unlimited mode silently surges charges** when credits exhausted.
20. **Lambda concurrency = simultaneous invocations** (not RPS); RPS cap = 10× concurrency.
21. **SnapStart breaks uniqueness** — regen IDs/secrets in `after-restore` hook.
22. **Cluster PG single-flow caps at 10 Gbps inside, 5 Gbps internet/DX egress.**
23. **EFA only same subnet/AZ + self-referencing SG required.**
24. **Hpc instances external network capped at 500 Mbps** (despite 200–300 Gbps internal).
25. **TGW transitive; VPC peering NOT.**
26. **Gateway Endpoint FREE; Interface Endpoint $/hr + $/GB.**
27. **Gateway Endpoint S3+DDB only**; not extendable to on-prem.
28. **NAT Gateway costs ~$0.045/GB processed** — Gateway Endpoint avoids for S3/DDB.
29. **NLB cross-zone LB OFF by default + charged**; ALB ON + free.
30. **DX provisioning weeks**, NOT for emergencies.
31. **DX not encrypted by default** (MACsec or VPN-over-DX).
32. **MACsec NOT on 1 Gbps or Hosted Connections.**
33. **LAG is NOT a resilience strategy** (single AWS device).
34. **OAC required (not OAI) for SSE-KMS, opt-in regions, dynamic methods.**
35. **OAC + S3 website endpoint not supported.**
36. **CloudFront Functions cannot make network calls**; Lambda@Edge can.
37. **Origin Shield Region = closest to ORIGIN.**
38. **Firehose minimum buffer 60s = near-real-time** (not real-time; use KDS or zero-buffering).
39. **KDS On-Demand still has per-PK 1 MB/s + 1,000 rec/s ceiling** — uneven keys throttle.
40. **Standard consumer = pull; EFO = push HTTP/2 sub-200 ms.**
41. **Athena cost** = bytes scanned. Columnar + partitions + projection + result reuse.
42. **Lake Formation governs Glue Catalog**; IAM still must allow it.
43. **Redshift sort/dist keys** = #1 perf lever.
44. **MSK Serverless caps 200 MB/s write / 400 MB/s read per cluster.**
45. **MSK KRaft no in-place migration on MSK** (build new cluster).
46. **Firehose to Redshift goes through S3 + COPY** (not direct).
47. **OpenSearch Serverless billing floor ~4 OCUs ~$350/mo** even idle.
48. **DataSync vs Storage Gateway:** DataSync = batch/scheduled; SGW = ongoing hybrid mount.
49. **S3 strong consistency since Dec 2020** — old "eventual consistency" exam options are wrong.
50. **S3 prefix randomization obsolete since 2018** — sequential/date prefixes are fine.

## 2024–2026 high-impact rename/deprecation cheat sheet

- **Kinesis Data Firehose → Amazon Data Firehose** (Feb 9, 2024)
- **Kinesis Data Analytics → Amazon Managed Service for Apache Flink** (Aug 2023)
- **QuickSight → Amazon Quick Suite** (Oct 9, 2025; BI core = "Quick Sight")
- **Aurora Serverless v2 → "Aurora serverless"** (April 2026)
- **Aurora Serverless v1 retired** (Dec 31, 2024)
- **QLDB end of support** (Jul 31, 2025)
- **Redshift DC2 EOL** (Apr 24, 2026)
- **AQUA** auto-managed/effectively retired (no formal EOL)
- **Snowmobile retired** (April 2024)
- **Snowcone + legacy Snowball Edge models discontinued** (Nov 12, 2024)
- **Snowball Edge closed to new customers** (Nov 7, 2025)
- **Lambda Spot Blocks deprecated**
- **EC2 Launch Configurations deprecated** (use Launch Templates)
- **Origin Access Identity (OAI) legacy** — use OAC for new builds
- **EFS Max I/O previous-generation** (not deprecated, but use General Purpose)

## Key official doc URLs

- S3 performance: https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html
- S3 Express One Zone: https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-one-zone.html
- S3 Tables: https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-s3-tables-apache-iceberg-tables-analytics-workloads/
- EBS volume types: https://aws.amazon.com/ebs/volume-types/
- FSx Lustre: https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-fsx-lustre.html
- EFS performance: https://docs.aws.amazon.com/efs/latest/ug/performance.html
- EC2 placement groups: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html
- EFA: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html
- Capacity Blocks for ML: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html
- EKS Auto Mode: https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-eks-auto-mode/
- EKS Hybrid Nodes: https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-overview.html
- Lambda SnapStart: https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html
- ECS task placement: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html
- Step Functions Distributed Map: https://docs.aws.amazon.com/step-functions/latest/dg/state-map-distributed.html
- Aurora DSQL GA: https://aws.amazon.com/about-aws/whats-new/2025/05/amazon-aurora-dsql-generally-available/
- Aurora Limitless: https://aws.amazon.com/about-aws/whats-new/2024/10/amazon-aurora-postgresql-limitless-database-generally-available/
- Aurora Serverless scale-to-zero: https://aws.amazon.com/about-aws/whats-new/2024/11/amazon-aurora-serverless-v2-scaling-zero-capacity/
- DynamoDB Warm Throughput: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/warm-throughput.html
- DynamoDB MRSC: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/V2globaltables_HowItWorks.html
- ElastiCache Valkey: https://aws.amazon.com/about-aws/whats-new/2024/10/amazon-elasticache-valkey/
- MemoryDB Valkey: https://aws.amazon.com/about-aws/whats-new/2024/10/amazon-memorydb-valkey/
- TGW quotas: https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-quotas.html
- CloudFront caching: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ConfiguringCaching.html
- OAC: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
- Global Accelerator: https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html
- DX FAQs: https://aws.amazon.com/directconnect/faqs/
- DX MACsec: https://docs.aws.amazon.com/directconnect/latest/UserGuide/MACsec.html
- Route 53 Profiles: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/profiles.html
- VPC Block Public Access: https://docs.aws.amazon.com/vpc/latest/userguide/security-vpc-bpa.html
- ALB mTLS: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/configuring-mtls-with-elb.html
- KDS concepts: https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html
- Data Firehose Iceberg: https://docs.aws.amazon.com/firehose/latest/dev/apache-iceberg-destination.html
- MSK serverless: https://docs.aws.amazon.com/msk/latest/developerguide/serverless.html
- Glue 5.0: https://aws.amazon.com/blogs/big-data/introducing-aws-glue-5-0-for-apache-spark/
- Redshift zero-ETL: https://docs.aws.amazon.com/redshift/latest/mgmt/zero-etl-using.html
- OpenSearch UltraWarm: https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ultrawarm.html
- S3 Metadata: https://docs.aws.amazon.com/AmazonS3/latest/userguide/metadata-tables-overview.html
- Quick Suite announcement: https://aws.amazon.com/blogs/business-intelligence/reimagine-business-intelligence-amazon-quicksight-evolves-to-amazon-quick-suite/

## Uncertainty/verification flags

🔴 **EFS Max I/O** — labeled "previous generation," not formally deprecated. Modern answer = General Purpose.
🔴 **Snowball Edge no new customers (Nov 2025)** — exam content may lag; for new-customer scenarios AWS now pushes DataSync/Data Transfer Terminal/Outposts.
🔴 **AQUA** — API marked retired but no formal EOL announcement; treat as auto-managed.
🔴 **Quick Suite rebrand (Oct 2025)** — APIs unchanged; old "QuickSight" exam wording still valid.
🔴 **Aurora serverless rename April 2026** — many older docs/exam options still say "v2."
🔴 **TGW per-attachment aggregate bandwidth** — official quotas state 50 Gbps; some sources cite 100 Gbps aggregate per AZ — verify near exam.
🔴 **Graviton5 (M9g)** — preview Dec 2025; don't assume GA on exam.
🔴 **P6-B300 / P6e-GB200** — GA via Capacity Blocks only; limited regions.
🔴 **CloudFront VPC Origins (2024)** — confirm GA status.
🔴 **Route 53 Global Resolver** — 2025 preview only.
🔴 **Provisioned NAT Gateway (2024)** — verify GA.

This document is comprehensive and ready to drive 50–60 service reference cards, 30 scenario quiz questions, and 40 identification flashcards across Domain 3.5 task statements with verified 2024–2026 updates and the high-performance angle the user requested.