# SAA-C03 Domain 4: Cost-Optimized Architectures — Comprehensive Study Reference (May 2026)

Domain 4 represents 20% of the SAA-C03 exam and tests cost-optimization decisions across storage (4.1), compute (4.2), database (4.3), and network (4.4) architectures. This reference is organized into the seven research deliverables: service cards, recent updates, decision frameworks, scenario questions, identification flashcards, gotchas, and out-of-scope services. All prices are us-east-1 unless noted.

---

## 1. SERVICE REFERENCE CARDS

### A. STORAGE (Task 4.1)

**S3 Standard** (Storage) — Baseline at $0.023/GB-mo (first 50 TB), no minimums, no retrieval fees. 11 9s durability, 99.99% availability across ≥3 AZs. PUT $0.005/1K, GET $0.0004/1K. **Cost angle:** Default for frequently-accessed data — anti-pattern is leaving cold data in Standard >30 days. **Exam trigger:** "active website content, data lake hot tier."

**S3 Intelligent-Tiering** (Storage) — Auto-tiers between Frequent, Infrequent (30d), Archive Instant (90d), Archive (90d+ opt-in), Deep Archive (180d+ opt-in). **Monitoring fee $0.0025/1000 objects/month** (the killer for tiny-object buckets — small objects <128KB stay in Frequent and are NOT charged monitoring). No retrieval/transition fees. **Best for:** unknown or changing access patterns. **Anti-pattern:** millions of <128KB objects; predictable patterns.

**S3 Standard-IA** (Storage) — ~$0.0125/GB-mo + $0.01/GB retrieval. **30-day minimum duration**, **128 KB minimum billable size**. Same multi-AZ durability as Standard. **Exam trigger:** "monthly DR copy", "backups accessed 1–2× per month."

**S3 One Zone-IA** (Storage) — ~$0.01/GB-mo (~20% cheaper than Std-IA), **single AZ** (99.5% availability, data lost if AZ destroyed). Same 30-day/128KB minimums. **Exam trigger:** "re-creatable secondary backup, single AZ acceptable."

**S3 Glacier Instant Retrieval (GIR)** (Storage) — ~$0.004/GB-mo, $0.03/GB retrieval, **90-day min**, **128 KB min**, **millisecond retrieval**. **Exam trigger:** "quarterly access but when needed must be immediate" (medical images, news archives).

**S3 Glacier Flexible Retrieval** (Storage) — ~$0.0036/GB-mo, **90-day min**, retrieval options Expedited (1–5 min, paid), Standard (3–5 hr), **Bulk 5–12 hr (FREE retrieval bytes, only $0.025/1K req)**. 40KB metadata overhead per object. **Exam trigger:** "compliance archive, retrieval in hours acceptable, free bulk preferred."

**S3 Glacier Deep Archive** (Storage) — **~$0.00099/GB-mo** (cheapest cloud storage, ~$1/TB/mo), **180-day min**, retrieval Standard 12hr or Bulk 48hr. **Exam trigger:** "7-year compliance retention with 12-hour retrieval OK," "tape replacement."

**S3 Express One Zone** (Storage) — Directory bucket type, single-AZ, single-digit-ms latency, 2M GET / 200K PUT TPS. **April 2025 price cut:** storage $0.16→$0.11/GB-mo (−31%), PUT −55%, GET −85%, per-GB transfer −60% (now on all bytes, not just >512KB). Higher storage cost but **far cheaper request pricing**. **Exam trigger:** "ML training," "interactive analytics," "millions of small reads at lowest latency." **Anti-pattern:** write-once-read-rarely; needs multi-AZ durability.

**S3 Lifecycle Policies** (Storage feature) — Free policy, but **transition requests cost $0.01–$0.05/1000** depending on target class. **Exam trap:** transitioning millions of tiny objects to Glacier — transition fees + 40KB overhead can cost more than just leaving in Standard.

**S3 Storage Lens** (Cost mgmt for S3) — Free tier (28–62 metrics, 14d history). Advanced: $0.20/M objects monitored. **Exam trigger:** "organization-wide visibility into S3 cost-saving recommendations."

**S3 Requester Pays** (Storage feature) — Bucket-level toggle; requester pays for requests + data transfer out, owner pays storage. **Exam trigger:** "publish dataset publicly without paying egress."

**S3 Transfer Acceleration** (Storage feature) — **$0.04/GB premium** (US/EU/JP edges); $0.08/GB elsewhere; ON TOP of standard transfer. AWS auto-checks: if not faster, no charge. **Exam trigger:** "global users uploading long-distance to one regional bucket."

**S3 Inventory** (Storage feature) — $0.0025/M objects listed. **Exam trigger:** "audit encryption/replication status of billions of objects" (cheaper than LIST loops).

**S3 Batch Operations** (Storage feature) — $0.25/job + $1.00/M objects + Lambda invocations. **Exam trigger:** "re-encrypt/copy/tag/restore millions of objects."

**S3 Replication (CRR/SRR)** (Storage feature) — Pay destination storage + replication PUTs + inter-region DTO (CRR). **Replication Time Control (RTC):** +$0.015/GB, 15-min SLA. **Batch Replication:** $0.25/job + $1/M for existing objects.

**EBS gp3** (Storage) — **$0.08/GB-mo + 3000 IOPS / 125 MB/s free baseline**; $0.005/IOPS-mo and $0.04/MB/s-mo beyond. **20% cheaper than gp2 with decoupled performance.** Live migration with zero downtime. **Default exam answer** for "reduce cost without performance impact" on EBS.

**EBS gp2** (Storage, legacy) — $0.10/GB-mo, IOPS tied to size (3 IOPS/GB burst). Migrate to gp3.

**EBS io2 / io2 Block Express** (Storage) — $0.125/GB-mo + tiered IOPS pricing ($0.065/IOPS first 32K, $0.046 next 32K). **All io2 auto-upgraded to Block Express April 30, 2025.** 256K max IOPS, 99.999% durability, supports Multi-Attach (16 Nitro instances). **Exam trigger:** SAP HANA, sub-ms latency, mission-critical Oracle/SQL Server.

**EBS st1** (Storage) — **$0.045/GB-mo**, throughput-optimized HDD, max 500 MB/s. **Min 125 GiB**, not bootable. **Exam trigger:** big-data/Kafka/EMR sequential workloads.

**EBS sc1** (Storage) — **$0.015/GB-mo (cheapest EBS)**, cold HDD. Min 125 GiB, not bootable. **Exam trigger:** cheapest block storage for cold infrequent data.

**EBS Snapshots Standard** (Storage feature) — **$0.05/GB-mo**, incremental, stored in S3 (not visible). Free restores. Orphan snapshots are #1 EBS waste source.

**EBS Snapshots Archive** (Storage feature) — **$0.0125/GB-mo (75% cheaper)**, **90-day minimum**, $0.03/GB retrieval, **up to 72 hr restore**. Stores a full snapshot (not incremental). **Exam trigger:** "end-of-project snapshot for compliance, infrequent retrieval."

**EBS Data Lifecycle Manager (DLM)** (Storage feature) — **FREE.** Automates snapshot/AMI create/copy/archive/delete.

**Fast Snapshot Restore (FSR)** (Storage feature) — **$0.75 per DSU-hour per AZ per snapshot.** Only for DR-critical AMIs.

**EFS Standard** (Storage) — $0.30/GB-mo regional multi-AZ. Elastic throughput mode pays per-GB read/write ($0.03/$0.06).

**EFS Standard-IA / One Zone / One Zone-IA / Archive** — IA $0.016/GB-mo, One Zone $0.16, One Zone-IA $0.0086, **EFS Archive $0.008/GB-mo** (90-day min, 50% cheaper than IA, 97% cheaper than Standard, released re:Invent 2023). All have 128 KiB min size for IA tiers. Lifecycle transitions cost $0.01/GB Std↔IA and $0.03/GB IA↔Archive.

**EFS Throughput Modes** (Storage feature) — Bursting (legacy, free), **Elastic** (new default, pay-per-byte), Provisioned (~$6/MB/s-mo flat). **Exam trigger:** "predictable known throughput" → Provisioned; "spiky/unknown" → Elastic.

**FSx for Windows File Server** (Storage) — Single-AZ SSD $0.130/GB-mo, Multi-AZ SSD $0.230, HDD options 10× cheaper. Min 32 GiB. Built-in dedup ~50–60% savings. **Exam trigger:** SMB/NTFS, Active Directory integration.

**FSx for Lustre** (Storage) — Scratch (no replication, cheapest, 6× burst), Persistent SSD ($0.14–$0.30/GB-mo), Persistent HDD. **NEW (2025): FSx for Lustre Intelligent-Tiering** starts <$0.005/GB-mo, up to 96% savings via auto-tiering. **Exam trigger:** HPC/ML POSIX file system, millions of IOPS for GPU clusters.

**FSx for NetApp ONTAP** (Storage) — 5 billing dimensions (SSD storage, SSD IOPS, capacity pool tier, throughput, backups). Capacity pool auto-tiers cold data (~$0.025/GB-mo). **Exam trigger:** NFS+SMB+iSCSI multi-protocol, on-prem NetApp migration.

**FSx for OpenZFS** (Storage) — Similar dimensional model; new Intelligent-Tiering tier available. **Exam trigger:** ZFS snapshots/clones, NFS for Linux/macOS.

**AWS Storage Gateway** (Hybrid storage) — All gateways: $0.01/GB written to AWS (capped $125/gateway/mo). **File Gateway:** S3-backed NFS/SMB. **FSx File Gateway:** SMB via FSx. **Volume Gateway:** iSCSI (cached or stored mode, S3-backed). **Tape Gateway:** Virtual tape library backed by Glacier/Deep Archive. **Exam triggers:** NFS/SMB hybrid access (File GW); iSCSI block with cloud backup (Volume GW); tape library replacement (Tape GW).

**AWS DataSync** (Migration) — **Basic $0.0125/GB**, Enhanced $0.015/GB + $0.55/task. Adds S3 request charges on top. Online migration via agent. **Exam trigger:** "online migration TBs from NAS to S3/EFS/FSx, scheduled, ongoing replication."

**AWS Transfer Family** (Hybrid/Migration) — **$0.30/hr per protocol endpoint** (SFTP/FTPS/FTP/AS2) + $0.04/GB transferred. **Exam trigger:** "external partners send files via SFTP" — NOT bulk migration.

**AWS Snow Family** (Migration) — Snowball Edge **Storage Optimized 210TB** and **Compute Optimized 104 vCPU/28TB** are the only currently shipping devices. **Snowmobile retired April 2024.** **Snowcone discontinued Nov 12, 2024.** Snowball Edge legacy models also discontinued. Not available to new customers in many regions. **Exam trigger:** TB/PB-scale offline transfer in bandwidth-constrained location.

**AWS Backup** (Storage feature) — Warm $0.05/GB-mo, **Cold $0.01/GB-mo (90-day min)** for supported sources (EBS/EFS/DDB/Timestream/FSx OpenZFS). Restores $0.02–$0.03/GB. **NEW Nov 2025: S3 low-cost warm tier (~$0.035/GB-mo).** Air-gapped vaults +15%. **Exam trigger:** "centralized cross-service backup with cold tier compliance."

---

### B. COMPUTE (Task 4.2)

**EC2 On-Demand** (Compute) — Per-second billing (60-sec min Linux). m5.large ≈ $0.096/hr. **Use:** spiky/unpredictable/POC. **Anti-pattern:** steady-state 24/7 (leaving 50–72% on table).

**Standard Reserved Instances** (Compute purchase) — Up to **72% off** (3-yr All Upfront). 1- or 3-yr term. Size-flexible within family/region. Can sell on Marketplace. Cannot exchange family/OS/tenancy. **Exam trigger:** "predictable workload, fixed instance family."

**Convertible RIs** (Compute purchase) — Up to **66% off**. Can exchange family/OS/tenancy for equal-or-greater value. Cannot sell on Marketplace. **Exam trigger:** "workload may shift instance family long-term."

**Zonal vs Regional RIs** — Zonal: locked to AZ + **capacity reservation**. Regional: discount only, AZ-flexible.

**Compute Savings Plans** (Compute purchase) — Up to **66% off**, $/hr commit. **Most flexible — covers EC2/Fargate/Lambda across family/size/region/OS/tenancy.** Lambda coverage up to 17% off duration only. Does NOT reserve capacity. **Exam trigger:** "steady compute spend, flexibility across services/regions."

**EC2 Instance Savings Plans** (Compute purchase) — Up to **72% off**. Locked to single instance family in single region (OS/tenancy flexible within family). **Exam trigger:** "max discount on specific family long-term."

**SageMaker Savings Plans** (Compute purchase) — Up to **64% off** SageMaker compute. Family/size/region flexible within SageMaker.

**Database Savings Plans** (Database, **NEW Dec 2, 2025**) — 1-year No Upfront only. Up to 35% off serverless, 20% provisioned, 18% DynamoDB on-demand, 12% DynamoDB provisioned. Covers Aurora/RDS/DynamoDB/ElastiCache/DocumentDB/Neptune/Keyspaces/Timestream/DMS. Gen 7+ provisioned only.

**Spot Instances** (Compute purchase) — Up to **90% off**. **2-min interruption warning** via metadata + EventBridge. Use capacity-optimized allocation in Spot Fleet/EC2 Fleet. **Spot Blocks DISCONTINUED for new customers since July 2021.** **Exam trigger:** stateless/batch/fault-tolerant. **Never the answer if "cannot tolerate interruption."**

**Dedicated Hosts** (Compute purchase) — Per-host billing, supports BYOL per-socket/core (Windows, SQL, Oracle, SUSE, RHEL). Reserved up to 70% off. **Exam trigger:** BYOL per-core licensing.

**Dedicated Instances** (Compute purchase) — Per-instance + **$2/hr per-region flat fee NOT covered by SP/RI**. **Exam trigger:** compliance/no shared hardware without licensing requirements.

**On-Demand Capacity Reservations (ODCR)** (Compute) — **NO discount** but guarantees capacity in AZ. Cancel anytime. Combine with Regional RI/SP for billing discount + capacity. **Exam trigger:** DR readiness, scheduled launches, regulated workloads.

**EC2 Capacity Blocks for ML** (Compute, expanded Nov 2024) — Reserve GPU/Trainium capacity 1–14 days (up to 6 months as of Nov 2024); ~40–50% lower than On-Demand for GPUs. P5/P6/Trn instances. **Jan 2026 price hike ~15%.** **Exam trigger:** short-term guaranteed GPU training.

**EC2 T-series (Burstable)** (Compute family) — T3/T3a/T4g. CPU credit model; unlimited mode (default) burst surcharge ~$0.05/vCPU-hr. **Cost trap:** sustained CPU on T-series may cost more than M-series. **Exam trigger:** low average CPU with occasional bursts.

**EC2 M/C/R/X/I/P/G Families** — M general purpose; C compute-optimized; R memory; X1/X2/X8g/X8aedz high-memory (SAP HANA); I storage-optimized; P/G/Inf/Trn accelerated. Most expensive: p5.48xlarge ≈ $55/hr On-Demand.

**Graviton (ARM)** (Compute family) — Up to **40% better price-performance** vs x86. T4g/M7g/M8g/M9g, C7g/C8g, R7g/R8g, X8g. **Graviton4 GA: R8g Jul 2024, M8g/C8g Sep 2024.** **Graviton5 (M9g) announced re:Invent 2025.** Also Lambda arm64, Fargate ARM, RDS Graviton, Aurora Graviton, ElastiCache Graviton. **Exam trigger:** "cheaper compute, same/better performance," "ARM-compatible."

**EC2 Hibernation** (Compute feature) — Saves RAM to encrypted EBS root. No instance-hour charges while hibernated, only EBS + EIPs. Supports Graviton (Aug 2024). **Exam trigger:** "dev environments overnight, pre-warmed long-init instances."

**EC2 Auto Scaling** (Compute feature) — All policies FREE (Target Tracking, Step, Simple, Scheduled, **Predictive**). Predictive scaling uses 14d history for 48hr forecast, scale-out only — pair with target tracking. Up to ~15% EC2 savings via predictive.

**AWS Auto Scaling** (Compute, cross-service) — Free; scaling plan across ASG/ECS/DDB/Aurora replicas/Spot Fleet/SageMaker.

**AWS Lambda** (Serverless compute) — $0.20/M requests + $0.0000166667/GB-s (x86) or $0.0000133334/GB-s (arm64, ~20% cheaper). Free tier: 1M req + 400K GB-s/mo. **Compute SP covers 17% off duration + Provisioned Concurrency; NOT request fees.**

**Lambda Provisioned Concurrency** (Serverless feature) — Bills separately; $0.0000041667/GB-s provisioned + $0.0000097222 exec (x86). Free tier doesn't apply. **Compute SP covers.**

**Lambda SnapStart** (Serverless feature) — **FREE for Java (2022).** **Python 3.12+ / .NET 8+ (GA Nov 2024) have caching + restoration cost.** Incompatible with Provisioned Concurrency, EFS, ephemeral >512MB, container images. **Exam trigger:** reduce cold-start latency without Provisioned Concurrency.

**Lambda Managed Instances** (Serverless, re:Invent 2025) — Run Lambda functions on chosen EC2 instances; EC2 Savings Plans / Spot apply.

**AWS Fargate** (Containers serverless) — $0.04048/vCPU-hr + $0.004445/GB-hr (Linux x86); ARM ~20% cheaper. Per-second billing, 1-min min. Windows includes OS license surcharge.

**Fargate Spot** (Containers) — Up to **70% off Fargate** (ECS only, Linux). 2-min interruption.

**ECS on EC2** (Containers) — Pay underlying EC2 with full Spot/RI/SP access. **Exam trigger:** steady high utilization, max cost efficiency.

**Amazon EKS** (Kubernetes) — Control plane **$0.10/hr/cluster** (standard support). **Extended Support $0.60/hr** after K8s version goes EOL — strong upgrade incentive. Worker nodes via EC2 (any purchase option) or Fargate.

**EKS Auto Mode** (Kubernetes, re:Invent 2024 GA) — AWS-managed Karpenter/AMIs/scaling. Cluster fee + EC2 + **~12% Auto Mode management fee on EC2 hours**. Fee NOT discounted by Spot/RI/SP. 110 pods/node, 21-day node refresh. **Exam trigger:** "AWS-managed Kubernetes compute, no Karpenter setup."

**AWS Compute Optimizer** (Cost mgmt) — **FREE** ML-based right-sizing for EC2/ASG/EBS/Lambda/ECS Fargate/RDS/Aurora. 14-day default lookback. Enhanced Infrastructure Metrics (93d) is paid. **Re:Invent 2025:** automated EBS optimization rules, **unused NAT Gateway recommendations**.

**AWS Outposts** (Hybrid compute) — 3-year commitment, rack or 1U/2U server form factor. Highest TCO; only for data residency / low-latency on-prem / regulated. Outpost↔Region data transfer FREE.

**AWS Local Zones** (Edge compute) — No charge to enable; resources priced **higher than parent region**. Supports On-Demand/SP/Spot.

**AWS Wavelength** (Edge compute) — Telco 5G edge; premium pricing. Niche (AR/VR, connected vehicles).

---

### C. DATABASE (Task 4.3)

**RDS On-Demand** (Database) — Per-engine pricing: MySQL/MariaDB/PostgreSQL baseline; Oracle BYOL ≈ open-source; **Oracle License Included ~3–5× more**; SQL Server LI similar. **Exam trigger:** "reduce license cost" → BYOL or migrate to Aurora PostgreSQL (Babelfish).

**RDS Reserved Instances** (Database, Standard only) — Up to **69–72% off** (3-yr All Upfront, Aurora). NOT for SQL Server LI / Oracle LI. Size-flexible within family/engine. 3-yr breaks even vs three 1-yr renewals at ~25 months.

**RDS Multi-AZ Deployments** (Database) — Standard (1 non-readable standby): **~2× cost**. Multi-AZ Cluster (2 readable standbys, MySQL/PostgreSQL): **~2.5× cost**, lower commit latency.

**RDS Read Replicas** (Database) — Per-instance + storage; cross-region adds DT. Async. **Exam trigger:** "scale READS" → read replica vs "HA + failover" → Multi-AZ.

**RDS Storage** (Database) — **gp3 default new (2024+)** $0.115/GB-mo + 3K IOPS/125 MB/s free baseline; gp3 IOPS $0.02 vs io1 $0.10 (80% cheaper at high IOPS). Multi-AZ doubles storage cost. Storage auto-scaling free.

**RDS Proxy** (Database) — **$0.015/vCPU-hr** of underlying DB (min 2 vCPU). **Blocks Aurora Serverless v2 auto-pause.** **Exam trigger:** Lambda connection storms.

**RDS Extended Support** (Database) — **+$0.10/vCPU-hr yr 1–2; +$0.20/vCPU-hr yr 3** on EOL MySQL/PostgreSQL versions. Charged on ALL instances including standbys. **Exam trigger:** unexpected RDS cost increase → check engine version.

**Aurora Standard** (Database) — Instance + $0.10/GB-mo storage + **$0.20/M I/O**. **Exam trigger:** low/moderate I/O workloads.

**Aurora I/O-Optimized** (Database) — Storage $0.225/GB-mo (2.25×) + **$0 I/O** + ~30% higher instance. **Switch when I/O charges > 25% of total Aurora bill**; up to 40% savings. 30-day lockout before switching back. **Exam trigger:** high-I/O OLTP.

**Aurora Serverless v2** (Database) — **$0.12/ACU-hr Standard, $0.156/ACU-hr I/O-Optimized.** 1 ACU ≈ 2 GiB RAM. **NEW Nov 2024: scale-to-zero (min 0 ACUs)** — auto-pauses on no connections, ~15s resume. **Excluded from auto-pause:** RDS Proxy attached, Aurora Global DB secondary, zero-ETL to Redshift, tier 0/1 readers. **Exam trigger:** dev/test, intermittent workloads.

**Aurora Global Database** (Database) — 1 primary + up to 5 secondary regions. Cost = replicas + storage + replicated write I/O ($0.20/M, still charged on I/O-Optimized). **Exam trigger:** <1s RPO global DR.

**Aurora Limitless Database** (Database, GA Oct 31, 2024) — Sharded PostgreSQL 16.4; **I/O-Optimized only, min 16 ACUs (no scale-to-zero).** Use for millions of writes/sec.

**Aurora DSQL** (Database, 2024 GA) — Active-active multi-region serverless PostgreSQL; **$8/M DPUs + $0.33/GB-mo storage**, scales to zero.

**DynamoDB On-Demand** (Database) — Post Nov 2024 50% cut: **$1.25/M WRUs, $0.25/M RRUs (strongly consistent), $0.125/M (eventually consistent)**. **AWS now positions on-demand as default.** **Exam trigger:** unpredictable/spiky traffic.

**DynamoDB Provisioned** (Database) — $0.00065/WCU-hr, $0.00013/RCU-hr. **Reserved Capacity up to 53% off 1-yr, 77% off 3-yr.** **Break-even post-2024 cut:** provisioned wins above **~40% sustained utilization**. **Exam trigger:** steady 24/7 high-utilization.

**DynamoDB Auto Scaling** (Database feature) — Free; target-tracking on provisioned.

**DynamoDB Standard-IA Table Class** (Database) — Storage $0.10/GB-mo (60% cheaper) + ~25% higher request cost. **Switch when storage > 50% of total table cost.** 2 class changes per 30 days.

**DynamoDB Global Tables** (Database) — Post Nov 2024: **rWRU −67% to $0.625/M (matches single-region WRU per region)**; provisioned rWCU −33%. Cross-region DT $0.09/GB. MRSC (Multi-Region Strong Consistency) GA Jan 2025.

**DynamoDB Streams** (Database feature) — First 2.5M reads free/shard, then $0.02/100K. Use for Lambda triggers.

**DynamoDB Accelerator (DAX)** (Database cache) — Per-node-hour, **3-node min for prod**, **no Reserved**, **no scale-to-zero**. Post-2024 break-even shifted — 3× t3.small needs ~166 RPS @ 80% hit; 3× r5.large ~1,121 RPS. **Cost angle:** performance tool, harder cost case now. **Exam trigger:** microsecond DynamoDB reads.

**DynamoDB PITR & Backups** (Database) — PITR $0.20/GB-mo continuous; on-demand backup $0.10/GB-mo; restore $0.15/GB. Export to S3 $0.10/GB (no read units consumed).

**ElastiCache** (Database cache) — **Valkey engine (Oct 2024): 20% cheaper node-based / 33% cheaper Serverless vs Redis OSS.** Reserved Nodes up to ~55% off (1/3-yr). **Redis 4/5 Extended Support starts Feb 1, 2026: +80% yr 1-2, +160% yr 3.**

**ElastiCache Serverless** (Database, Nov 2023 GA) — Data $0.125/GB-hr (Redis/Memcached, min 1 GB); ECPUs $0.0034/M. **Valkey:** $0.084/GB-hr, $0.0023/M ECPU, 100 MB min.

**ElastiCache vs MemoryDB** — MemoryDB ~2× ElastiCache for equivalent memory (multi-AZ durability). **Exam trigger:** in-memory primary DB with durability → MemoryDB; cache layer → ElastiCache.

**Redshift Provisioned** (Database/analytics) — RA3 nodes (managed storage separation) + RMS storage $0.024/GB-mo. **Reserved Instances up to 75% off 3-yr.**

**Redshift Serverless** (Database, **June 2025 min 4 RPU = $1.50/hr**) — **$0.36/RPU-hr**, per-second 60-sec min. Auto-pauses idle. **Serverless Reservations (2024): 45% off 3-yr, 24% off 1-yr.** Spectrum + Concurrency Scaling included.

**Redshift Spectrum** (Database, provisioned only) — $5/TB scanned. Use Parquet/ORC + partitioning + compression to slash costs.

**DocumentDB Standard / I/O-Optimized** (Database) — Same 25% I/O break-even rule as Aurora. **DocumentDB Serverless:** $0.10/DCU-hr Standard / $0.13 I/O-Opt, min 0.5 DCUs.

**Neptune** (Database, graph) — Provisioned + Neptune Serverless (~$0.1608/NCU-hr, **min 1 NCU = $110/mo floor, no scale-to-zero**). Neptune Analytics graphs pause to 10% rate.

**Keyspaces** (Database, Cassandra) — Post Nov 2024 cuts: on-demand −56% single / −65% multi-region; provisioned −13–20%; TTL deletes −75%. Storage ~$0.30/GB-mo.

**Timestream** (Database, time-series) — LiveAnalytics: ~$0.50/M writes; memory store $0.036/GB-hr; **magnetic store $0.03/GB-mo (100 GB min/region)**; queries $0.50/TCU-hr. Timestream for InfluxDB managed.

**AWS DMS** (Database migration) — Replication instance hours + storage + cross-region DT. SCT (schema conversion) free. DMS Serverless available.

**QLDB** — **DEPRECATED. End-of-support July 31, 2025.** Never the right answer. Migrate to Aurora PostgreSQL.

---

### D. NETWORK (Task 4.4)

**Data Transfer Out (DTO)** (Network) — First **100 GB/mo FREE** (aggregated, raised from 1 GB in 2024); then $0.09/GB tiered down to $0.05 at >150TB. Inbound always FREE.

**Cross-AZ Data Transfer** (Network) — $0.01/GB each direction = **$0.02/GB round-trip** for EC2/RDS/ElastiCache cross-AZ traffic. **Same-AZ via private IP = FREE.** **Same-AZ via public/EIP = $0.01/GB+$0.01/GB even within AZ** (classic exam trap).

**Region-to-Region Transfer** (Network) — Typically $0.02/GB (us-east-1↔us-east-2 = $0.01/GB). Charged on source region only.

**NAT Gateway** (Network) — **$0.045/hr per NAT GW + $0.045/GB data processed** + standard DTO. True internet cost = $0.135/GB. Per-AZ HA pattern multiplies hourly cost. **Single-AZ centralized:** save hourly but pay $0.01/GB cross-AZ. Break-even ~3.24 TB/mo cross-AZ traffic. **Regional NAT Gateway (Nov 2025):** auto-expands per AZ. **Exam trap:** route to S3/DynamoDB via NAT → use Gateway endpoint instead.

**NAT Instance** (Network) — EC2 hourly only, no per-GB processing. Self-managed HA, bandwidth-limited. **Exam trigger:** "minimize cost in dev/test" → NAT Instance; "minimize ops" → NAT Gateway.

**Gateway VPC Endpoints (S3, DynamoDB)** (Network) — **COMPLETELY FREE.** Always deploy by default to bypass NAT processing fees. Cannot be used from on-prem/peered VPC/Transit Gateway.

**Interface VPC Endpoints (PrivateLink)** (Network) — **$0.01/hr per endpoint per AZ + $0.01/GB processed.** Cross-AZ traffic FREE since April 2022. 3-AZ deployment ≈ $21.90/mo fixed. **Break-even vs NAT:** ~626 GB/mo per service.

**Transit Gateway** (Network) — **$0.05/hr per attachment + $0.02/GB processed** (charged to sender). **NEW Nov 2025: Flexible Cost Allocation (FCA)** — allocate processing/DTO to sender/receiver/central account. **Exam trigger:** >10 VPCs or hybrid hub-and-spoke; otherwise VPC peering.

**VPC Peering** (Network) — **No hourly fee.** Same-region intra-AZ via private IP = FREE; cross-AZ $0.01/GB each way. Cross-region = standard inter-region DTO. Non-transitive.

**Direct Connect** (Network) — Port hours: 1Gbps ~$0.30/hr (~$219/mo), 10Gbps ~$2.25/hr, 100Gbps ~$22.50/hr. **DTO via DX ~$0.02/GB (78% cheaper than internet $0.09).** Virtual Interfaces: Private/Public/Transit. **DX vs VPN break-even:** ~2.6 TB/mo sustained egress at 1Gbps.

**Site-to-Site VPN** (Network) — **$0.05/hr per connection** + standard DTO. 5 Gbps Large Bandwidth VPN $0.60/hr. **Exam trigger:** quick setup, low/moderate volume, encrypted hybrid.

**Client VPN** (Network) — **$0.10/hr per subnet association + $0.05/hr per active client connection** + standard DTO.

**CloudFront** (Network/CDN) — DTO $0.085/GB first 10 TB (NA/EU); HTTPS $0.0100/10K req. **Free tier: 1 TB DTO + 10M HTTPS req/mo (since Dec 2021).** Origin → CloudFront = FREE (S3 or any AWS origin). Price Classes 100/200/All cap rate by edge region. Invalidations $0.005/path after 1000 free. **NEW Nov 18, 2025: Flat-rate plans** Free / Pro $15 / Business $200 / Premium $1000 — bundles CDN+WAF+DDoS+R53+TLS, throttles instead of overage.

**CloudFront Origin Shield** (Network/CDN) — ~$0.0075/10K requests; cuts duplicate origin fetches. **Exam trigger:** "reduce origin load" when origin compute expensive.

**CloudFront Functions vs Lambda@Edge** — Functions $0.10/M invocations (lightweight); Lambda@Edge $0.60/M + compute. **Exam trigger:** lightweight header/URL manipulation → CF Functions.

**Origin Access Control (OAC)** (Network/CDN) — FREE; replaces OAI; supports SigV4, KMS-SSE, all regions, Lambda Function URL origins (Apr 2024).

**AWS Global Accelerator** (Network) — **$0.025/hr per accelerator** + DT-Premium $0.007–$0.105/GB by source→edge pair. **Exam trigger:** static anycast IPs, TCP/UDP gaming/VoIP, multi-region failover for non-HTTP. **Not** for typical HTTP — use CloudFront.

**Route 53** (Network/DNS) — **$0.50/zone/mo (first 25)**; queries $0.40/M first 1B; **Alias to AWS resource = FREE queries**. Health checks: AWS endpoint free, non-AWS $0.50/mo + $1/feature. Latency-based routing $0.60/M; Geolocation/IP-based $0.70/M. **Exam trigger:** "reduce DNS cost for AWS resources" → Alias records.

**Application Load Balancer (ALB)** (Network) — $0.0225/hr + $0.008/LCU-hour. LCU = max of new connections (25/sec), active (3000/min), bandwidth (1 GB/hr), rule evaluations (1000/sec, first 10 rules free). **No cross-AZ charges** to targets. **Exam trigger:** consolidate microservices behind one ALB with host/path routing.

**Network Load Balancer (NLB)** (Network) — $0.0225/hr + $0.006/NLCU-hr. Cross-AZ to targets DOES charge by default. **Exam trigger:** TCP/UDP extreme throughput.

**Classic Load Balancer (CLB)** (Network, legacy) — $0.025/hr + $0.008/GB. Migrate to ALB.

**Gateway Load Balancer (GWLB)** (Network) — $0.0125/hr + $0.004/GLCU-hr. For 3rd-party appliances (firewalls/IDS).

**AWS WAF** (Network/security) — **$5/Web ACL/mo + $1/rule/mo + $0.60/M requests.** Body inspection beyond 16KB +$0.30/M. Bot Control / Fraud Control add $10+/mo each.

**AWS Shield Standard** (Network/security) — **FREE**, auto-enabled L3/L4 DDoS.

**AWS Shield Advanced** (Network/security) — **$3000/mo (1-yr commit per org)** + DTO. Includes WAF charges for protected resources. DDoS Response Team + cost protection credits.

**Public IPv4 Address Charge** (Network) — **$0.005/hr per IP since Feb 1, 2024**, attached OR unattached, ALL services (EC2/RDS/EKS/ELB/NAT GW/Global Accelerator/VPN tunnels). BYOIP exempt. **IPv6 = FREE.** Egress-Only IGW (IPv6) = FREE.

---

### E. COST MANAGEMENT (Cross-cutting, all tasks)

**AWS Cost Explorer** (Cost mgmt) — **Console FREE; API $0.01/request.** 13-mo default history (38mo with extended). 12-mo forecasts (**18-mo with AI re:Invent 2025**). Surfaces RI/SP/Database SP recommendations. **Exam trigger:** "analyze past spend, forecast, recommend RIs/SPs."

**AWS Budgets** (Cost mgmt) — **First 2 free; $0.02/budget/day after.** Action-enabled $0.10/day. Types: Cost, Usage, RI util/coverage, SP util/coverage. **Budget Actions:** auto-apply IAM/SCP, stop EC2/RDS. **Exam trigger:** "alert when costs > X, auto-stop."

**AWS Cost and Usage Report (CUR)** (Cost mgmt) — **FREE** (pay S3 storage only). Hourly/daily, CSV/Parquet, Athena/Redshift/QuickSight. **CUR 2.0 / Data Exports (2023):** fixed schema, nested columns, SQL row filtering, FOCUS 1.0/1.2 format export. **Exam trigger:** "most granular billing, SQL queries."

**AWS Trusted Advisor** (Cost mgmt) — Basic: 7 core checks. **Business/Enterprise Support: full Cost Optimization category** (idle ELB, low-util EC2, underused EBS, unassociated EIPs, idle RDS). **Exam trigger:** "identify idle/underutilized resources, Business Support."

**AWS Compute Optimizer** (Cost mgmt) — **FREE**, ML right-sizing for EC2/ASG/EBS/Lambda/Fargate ECS/RDS/Aurora. 14d default lookback. Enhanced metrics (93d) paid. **Re:Invent 2025: auto EBS optimization rules; unused NAT Gateway recommendations.** **Exam trigger:** "no-cost ML right-sizing."

**AWS Cost Anomaly Detection** (Cost mgmt, NOT in scope) — Free; ML alerts via SNS/email.

**Cost Allocation Tags** (Cost mgmt) — AWS-generated vs user-defined; must be **activated** in Billing console; ~24-hr propagation. **Exam trigger:** "track costs per dept/project/env."

**AWS Organizations Consolidated Billing** (Cost mgmt) — Free. Volume discount aggregation, RI/SP sharing across accounts (configurable per OU). Pair with SCPs + Budget Actions for guardrails.

**AWS License Manager** (Cost mgmt) — Tracks BYOL software; Dedicated Hosts integration. **Exam trigger:** "BYOL Windows/SQL Server tracking across accounts."

**AWS Cost Optimization Hub** (Cost mgmt, NOT in scope but recent feature) — Free; aggregates recs from Cost Explorer/Compute Optimizer/Trusted Advisor. **Re:Invent 2025: Cost Efficiency metric.**

---

## 2. CURRENT AWS UPDATES (2024–2026) IMPACTING DOMAIN 4

| Date | Update | D4 implication |
|---|---|---|
| **Feb 1, 2024** | **Public IPv4 $0.005/hr** charge for ALL IPv4 addresses, attached or not, all services | Major cost hit; IPv6 + Egress-Only IGW becomes attractive |
| Mar 2024 | Free DTO for migrations OUT of AWS (EU Data Act) | Not directly tested |
| Apr 2024 | **Snowmobile retired** | Never a valid answer; Snowball Edge + DataSync replaces |
| Apr 2024 | CloudFront OAC supports Lambda Function URL origins | Replaces OAI in scenarios |
| Sep 2024 | AWS Application Cost Profiler discontinued | Skip entirely |
| Jul 2024 | **Graviton4 R8g GA** | Most cost-efficient memory instances |
| Sep–Oct 2024 | **Graviton4 M8g/C8g GA**, X8g | Cheaper compute/general purpose |
| **Nov 1, 2024** | **DynamoDB on-demand 50% cut** ($1.25/M WRU, $0.25/M RRU); **Global Tables rWRU −67%, rWCU −33%** | On-demand is new default; break-even shifted to 40% utilization |
| **Nov 12, 2024** | **Snowcone discontinued**; legacy Snowball Edge models discontinued | Only 210TB Storage Optimized and 104vCPU Compute Optimized remain |
| **Nov 20, 2024** | **Aurora Serverless v2 scale-to-zero** (min 0 ACUs) | Dev/test/intermittent DB cost killer feature |
| Nov 2024 | **Lambda SnapStart for Python 3.12+ / .NET 8+ GA** (paid caching cost; Java still free) | New cost trade-off vs Provisioned Concurrency |
| Nov 2024 | **EKS Auto Mode GA** (+12% management fee on EC2 hours) | Premium-for-simplicity Kubernetes |
| Nov 2024 | **EC2 Capacity Blocks for ML expanded** to 6 months, instant start | Short-term GPU reservations |
| Oct 31, 2024 | **Aurora Limitless Database GA** (PostgreSQL 16.4, I/O-Optimized only, min 16 ACUs) | Sharded high-write workloads |
| Oct 2024 | **ElastiCache Valkey** (20% cheaper nodes, 33% cheaper Serverless) | Cheapest cache engine |
| 2024 | **Keyspaces price cuts up to 75%** | Cassandra workloads cheaper |
| 2024 | **QLDB deprecated; end-of-support July 31, 2025** | Never the right answer |
| Dec 2024 | S3 Tables, S3 Metadata (re:Invent 2024) | Iceberg-native bucket type |
| Jan 2025 | **DynamoDB Multi-Region Strong Consistency (MRSC)** | Zero RPO Global Tables |
| Apr 30, 2025 | **EBS io2 auto-upgraded to Block Express** (256K IOPS, 99.999% durability standard) | All io2 customers benefit |
| Apr 10, 2025 | **S3 Express One Zone price cuts** (storage −31%, PUT −55%, GET −85%, transfer −60%) | Repositions Express for broader workloads |
| Jun 2025 | **Redshift Serverless min 4 RPU = $1.50/hr** (was 8 RPU = $3/hr) | Lower entry cost for small analytics |
| **Jul 15, 2025** | **AWS Free Tier overhaul** — new accounts get $100+$100 credits over 6 months; legacy 12-mo free tier discontinued for NEW accounts only | Affects exam wording: 12-mo free tier only valid for older accounts |
| 2025 | **FSx for Lustre Intelligent-Tiering** (<$0.005/GB-mo entry, up to 96% savings) | Cheapest high-performance file storage |
| Nov 2025 | **Regional NAT Gateway** (auto-expand per AZ) | Operational simplification |
| Nov 2025 | **Transit Gateway Flexible Cost Allocation (FCA)** | Allocate DT to sender/receiver |
| Nov 18, 2025 | **CloudFront flat-rate plans** (Free/$15/$200/$1000) | Predictable CDN spend with WAF/DDoS/R53 bundled |
| Nov 2025 | **AWS Backup S3 low-cost warm tier** (~$0.035/GB-mo) | 30% off warm for S3 backups |
| **Dec 2, 2025** | **Database Savings Plans** — up to 35% off, 1-yr No Upfront only, covers Aurora/RDS/DDB/ElastiCache/DocumentDB/Neptune/Keyspaces/Timestream/DMS | New 4th SP type |
| Re:Invent 2025 | **Lambda Managed Instances**, **Graviton5 (M9g)**, **Cost Explorer 18-mo AI forecasts**, **Compute Optimizer NAT GW recommendations**, **Trainium3 UltraServers** | Watch as exam refreshes |
| Jan 2026 | EC2 Capacity Blocks ~15% price hike | GPU reservation cost up |
| Feb 1, 2026 | **ElastiCache Redis 4/5 Extended Support** (+80% yr 1-2, +160% yr 3) | Strong migration incentive to Valkey |
| Apr 2026 | "Aurora Serverless v2" → "Aurora serverless" (branding) | Same service |

---

## 3. EXAM-FOCUSED COST PATTERNS AND DECISION FRAMEWORKS

### RI vs SP vs Spot decision matrix

| Workload | Best choice |
|---|---|
| Predictable 24/7, fixed instance family, max discount | EC2 Instance Savings Plan or 3-yr Standard RI |
| Predictable 24/7, may shift family/region/Lambda/Fargate | Compute Savings Plan |
| Need capacity guarantee in specific AZ + discount | Zonal Standard RI |
| Need capacity guarantee, no commitment | On-Demand Capacity Reservation (no discount) |
| Capacity guarantee + billing discount | Regional RI + ODCR, or SP + ODCR |
| Stateless / fault-tolerant / batch | Spot (up to 90%) via Spot Fleet capacity-optimized |
| Short-term GPU training | EC2 Capacity Blocks for ML |
| BYOL Windows/SQL Server/Oracle per-core | Dedicated Hosts |

### Compute SP vs EC2 Instance SP

- **Compute SP wins:** when workload may shift across families (m5→m7g→c8g), across regions, between EC2/Fargate/Lambda, or you want to migrate to Graviton mid-term. Max 66%.
- **EC2 Instance SP wins:** when locked to a single family/region for entire term and you want max discount (72%). No flexibility for OS/region/service migration.
- **Mixed strategy:** EC2 Instance SP for baseline stable workload + Compute SP for flexible portion + Spot for burst.

### S3 storage class selection decision tree

1. Access pattern unknown / changing → **Intelligent-Tiering** (objects ≥128 KB).
2. Frequently accessed → **Standard**.
3. Infrequent (monthly), ms retrieval, multi-AZ → **Standard-IA**.
4. Same as #3 but single-AZ acceptable, re-creatable → **One Zone-IA**.
5. Quarterly access, ms retrieval needed → **Glacier Instant Retrieval**.
6. Archive, hours OK for retrieval, want free bulk → **Glacier Flexible Retrieval**.
7. Compliance archive, 12hr/48hr retrieval OK, cheapest → **Glacier Deep Archive**.
8. ML training / high-TPS small reads / single AZ OK → **S3 Express One Zone**.

### Aurora Standard vs I/O-Optimized

- If `(I/O charges) / (total Aurora bill) > 25%` → switch to I/O-Optimized; up to 40% savings.
- Below 25% → stay on Standard. Existing RIs carry over. 30-day lockout before switching back.

### DynamoDB on-demand vs provisioned

- **Post Nov 2024 cut:** provisioned wins above **~40% sustained utilization**.
- Spiky, new, unknown → on-demand.
- Predictable steady-state, high utilization → provisioned + Reserved Capacity.

### NAT Gateway vs VPC Endpoint cost analysis

- Traffic to S3 or DynamoDB → **always use Gateway Endpoint (free)**.
- Traffic to other AWS service: Interface Endpoint break-even ~626 GB/mo vs NAT processing.
- High-availability NAT: per-AZ deployment vs single-NAT-with-cross-AZ — break-even ~3.24 TB/mo cross-AZ traffic.

### Direct Connect vs VPN break-even

- 1 Gbps DX ($219/mo + $0.02/GB) beats VPN ($36.50/mo + $0.09/GB) at **~2.6 TB/mo** sustained egress.
- Use VPN-over-DX for encrypted hybrid at high volume.
- Use VPN as failover for DX.

### Lambda vs Fargate vs EC2 cost trade-offs

- **Lambda:** event-driven, ≤15 min, intermittent. Compute SP covers 17%. Anti-pattern: 24/7 high-throughput sustained load.
- **Fargate:** containers, bursty/variable, ops simplicity. Fargate Spot up to 70%. Compute SP up to 50%.
- **ECS on EC2:** steady high utilization, max efficiency, full Spot/RI/SP access. Best at >70% utilization.
- **Lambda Managed Instances (2025):** Lambda model with EC2 SP/Spot pricing.

### Right-sizing strategy
Use Compute Optimizer (free) → Cost Explorer right-sizing → Trusted Advisor idle/low-util → Cost Optimization Hub aggregate view. Look for low-CPU EC2, oversized Lambda memory, unattached EBS, unused EIPs, idle ELBs, unused NAT Gateways (new Compute Optimizer rec).

### Multi-AZ vs single-AZ trade-offs
- Production HA → Multi-AZ for RDS/Aurora/ELB/NAT GW (2× or 2.5× cost).
- Dev/test → single-AZ to halve cost.
- DynamoDB/S3 Standard/Aurora already multi-AZ by design.
- One Zone storage classes (S3 One Zone-IA, EFS One Zone, S3 Express One Zone): single-AZ savings, **never for primary data**.

### Cross-region replication cost considerations
- DR-only: S3 CRR + Glacier on destination side; or Aurora cross-region read replica vs Global Database (Global DB faster failover but adds replicated I/O cost).
- DynamoDB Global Tables now cheap (post Nov 2024 67% cut).
- Cross-region DT $0.02/GB always applies.

### Backup retention cost optimization
- AWS Backup warm $0.05/GB-mo → cold $0.01 after retention threshold (90-day min).
- RDS automated backups free up to provisioned DB size; trim retention period.
- EBS Snapshot Archive (EBS-only) $0.0125/GB-mo, 90-day min, vs AWS Backup cold $0.01.

### Tag-based cost allocation strategy
1. Define org tag schema (Environment, Project, Owner, CostCenter).
2. Enforce via SCPs + Tag Policies in AWS Organizations.
3. Activate tags in Billing console (24hr propagation).
4. Filter Cost Explorer / build CUR Athena queries by tag.
5. Set per-tag Budgets with anomaly alerts.

### Centralized vs decentralized billing in Organizations
- Payer account aggregates volume discounts (S3, DTO tiers) and shares RI/SP discounts across linked accounts.
- Can toggle RI/SP sharing per OU/account.
- Pair with consolidated billing + SCPs + Budget Actions for cost guardrails.

---

## 4. SCENARIO QUESTIONS (33 scenarios)

### Storage scenarios (4.1)

**Q1 [Medium].** A media company stores 500 TB of post-production video. After 30 days, files are accessed maybe once per year for re-licensing, with retrieval needed within 6 hours. Files must be retrievable 7+ years for compliance. Cheapest solution?
**A.** S3 lifecycle policy: Standard → Glacier Deep Archive after 30 days.
**Why:** Deep Archive at ~$0.00099/GB-mo costs ~$495/mo for 500TB; standard retrieval is 12hr but bulk is 48hr — 6hr is achievable with Standard tier retrieval. 7yr retention exceeds 180-day min.
**Distractors:** (1) Glacier Flexible Retrieval — 3× more expensive at $0.0036/GB-mo. (2) Glacier Instant Retrieval — overkill (ms retrieval) at 4× cost. (3) S3 Intelligent-Tiering with Deep Archive Access opt-in — monitoring fee on 500TB ≈ depends on object count; works but more complex than direct lifecycle.

**Q2 [Easy].** A team has unknown access patterns on millions of small (>500 KB) and large objects. Cheapest single answer?
**A.** S3 Intelligent-Tiering.
**Why:** Auto-tiers between Frequent/IA/Archive Instant with no retrieval fees; objects >128 KB qualify for auto-tiering. Monitoring fee small relative to misallocation savings.
**Distractors:** Standard (overpays for cold), Standard-IA (retrieval fees on frequently-accessed portion), One Zone-IA (single AZ unacceptable for unknown criticality).

**Q3 [Hard].** A bucket has 50 million 5 KB IoT telemetry objects per month accessed weekly during the first month, then rarely. Lifecycle policy to Standard-IA after 30 days reduced costs by only 10%. Why? What's the better fix?
**A.** S3 Standard-IA minimum billable object size is **128 KB**, so each 5 KB object bills as 128 KB (25× overhead). Lifecycle transition fees add up. **Better:** aggregate objects into larger Parquet files via Kinesis Firehose / S3 Batch Operations / Glue, THEN lifecycle to IA or Glacier; or use S3 Intelligent-Tiering Archive Instant tier (no min size for the auto-tiers' billing penalty in Intelligent-Tiering, though same 128KB rule applies to auto-tier eligibility).
**Distractors:** (1) Use Glacier Deep Archive — still has 40 KB metadata overhead and worse per-object math. (2) Use One Zone-IA — still 128 KB min. (3) Replace with EFS — drastically more expensive at $0.30/GB-mo.

**Q4 [Medium].** A SaaS company runs ML inference reading 200M small features per minute from S3. Latency-sensitive but per-AZ deployment is fine. Cheapest performant option?
**A.** S3 Express One Zone (directory bucket).
**Why:** Post April 2025 cuts: 85% cheaper GET, 60% cheaper transfer; single-digit-ms latency; 2M GET TPS. Single-AZ acceptable for stateless inference.
**Distractors:** S3 Standard with CloudFront (CF adds request fees and TTL complexity for ephemeral features), DAX (DynamoDB only), ElastiCache (different storage model, expensive at TB scale).

**Q5 [Medium].** A team needs to migrate 80 TB of NAS files from on-prem to S3 over a 1 Gbps internet link, with delta updates ongoing afterwards. Cheapest fully-managed option?
**A.** AWS DataSync.
**Why:** $0.0125/GB ($1,000 for initial 80 TB) + scheduled deltas via single agent. 1 Gbps adequate for ~7 days initial transfer.
**Distractors:** Snowball Edge (~$300 device fee + 4–6 weeks turnaround, no ongoing delta), Transfer Family SFTP (designed for ongoing transactional file exchange, $0.30/hr endpoint + $0.04/GB), S3 Transfer Acceleration (premium per-GB; not for on-prem-to-S3).

**Q6 [Easy].** A workload uses EBS gp2 volumes with 3000 IOPS. CFO wants 20% cost reduction without performance loss.
**A.** Migrate gp2 to gp3.
**Why:** gp3 at $0.08/GB-mo vs gp2 $0.10 (20% cheaper); 3000 IOPS + 125 MB/s free baseline; live migration with zero downtime.
**Distractors:** io2 (more expensive), sc1 (HDD, won't match IOPS), Snapshot Archive (different concept).

### Compute scenarios (4.2)

**Q7 [Medium].** A company runs a batch image-processing job 6 hours daily on 200 EC2 instances. Tolerates interruption (results re-checkpointed). Cheapest purchase option?
**A.** Spot Instances via EC2 Fleet with capacity-optimized allocation, diversified across families.
**Why:** Up to 90% off; 2-min warning enables checkpointing; capacity-optimized minimizes interruption.
**Distractors:** On-Demand (3–5× more), Reserved 1-yr (only 6/24 hr usage = 75% waste), Compute SP (commits 24/7 spend on partial workload).

**Q8 [Hard].** A team commits to a 3-yr SP on an `m5.xlarge` baseline. Six months later they migrate to Graviton `m7g.xlarge` and want the discount to apply. Which SP type should they have chosen?
**A.** Compute Savings Plan.
**Why:** Covers any family/size/region/OS, plus Fargate and Lambda. EC2 Instance SP would have been locked to m5 family.
**Distractors:** EC2 Instance SP (locked to family/region), Standard RI (size-flex within m5 family, can't migrate to m7g), SageMaker SP (wrong service).

**Q9 [Medium].** A SaaS app has predictable steady traffic at 24/7 base load + 2x spikes during business hours. Cheapest hybrid strategy?
**A.** Reserved Instances or EC2 Instance SP for the base load + Spot/On-Demand for spike capacity in an ASG with target tracking.
**Why:** RI/SP locks in 60–72% on stable baseline; ASG adds Spot for bursty + interruptible spike capacity.
**Distractors:** 100% Spot (risky for steady load), 100% On-Demand (overpays on baseline), 100% 3-yr All Upfront RI sized for peak (overpays on idle peak capacity).

**Q10 [Medium].** A Java-based Lambda function has 8-second cold starts hurting UX. Provisioned Concurrency would cost $200/mo. Cheapest fix?
**A.** Lambda SnapStart (Java, FREE since 2022).
**Why:** Sub-second cold starts via snapshot; no charge for Java. Compatible with most non-special Java functions.
**Distractors:** Provisioned Concurrency ($200/mo), increase memory (helps slightly but doesn't fix init), migrate to Fargate (overkill).

**Q11 [Easy].** A company wants to run x86-compatible workload at lowest cost with same/better performance.
**A.** Graviton instances (M7g/M8g/C7g/C8g/R7g/R8g) — up to 40% better price-performance.
**Why:** Recompile or use multi-arch container images; AWS Graviton Fast Start + Porting Advisor.
**Distractors:** AMD variants (~10% cheaper than Intel but not as efficient as Graviton), Spot only (interruption risk if workload not fault-tolerant), keep on x86 with RI (still more expensive than Graviton+RI).

**Q12 [Medium].** Dev environments run nightly batch jobs lasting 4 hours; engineers are gone overnight. Need same instance state preserved between runs (large in-memory cache).
**A.** EC2 Hibernation + scheduled scaling.
**Why:** No instance-hour charges while hibernated; only EBS billed; RAM state preserved; resume in seconds.
**Distractors:** Stop/Start (loses RAM state, slow re-init), Spot Hibernate (interruption risk), AMI snapshot daily (loses live state, slow).

**Q13 [Hard].** A company runs a 50-node EKS cluster with mixed workloads. They've adopted Karpenter and want to switch to EKS Auto Mode for simplicity. Cost impact?
**A.** EKS Auto Mode adds ~12% management fee on EC2 hours, NOT discounted by Spot/RI/SP. Cluster fee $0.10/hr unchanged. May be offset by tighter bin-packing and reduced operational burden.
**Distractors:** "Free" (wrong — 12% premium), "Discounted by Spot" (wrong — Spot still applies to underlying EC2 but not the management fee), "Replaces cluster fee" (wrong, additive).

**Q14 [Medium].** A team trains ML models on GPUs for 7-day jobs intermittently. They cannot afford On-Demand pricing (p5.48xlarge ~$55/hr) and Spot is too unstable for 7-day training. What option?
**A.** EC2 Capacity Blocks for ML.
**Why:** Reserve guaranteed GPU for up to 6 months in 1-day increments; ~40–50% lower hourly than On-Demand; no interruption risk like Spot.
**Distractors:** 3-yr P5 RI (overcommits), On-Demand (too expensive), Spot (interruption kills 7-day training).

### Database scenarios (4.3)

**Q15 [Medium].** A serverless dev/test PostgreSQL Aurora DB sits idle most nights and weekends. Cheapest option that survives daily use?
**A.** Aurora Serverless v2 with min 0 ACU and 5-min auto-pause (post Nov 2024).
**Why:** Compute = $0 when idle; ~15s resume; only storage billed. Suitable for non-production tolerant of brief resume latency.
**Distractors:** Aurora provisioned + RI (overcommits idle periods), Aurora Serverless v1 (deprecated), Aurora provisioned + stop/start (manual, 7-day max stop).

**Q16 [Hard].** A DynamoDB table has 800K writes/hour predictable, 24/7. Currently on on-demand at $1.25/M WRU = ~$876/mo just for writes. Cheaper option?
**A.** Switch to Provisioned with Reserved Capacity (1-yr or 3-yr).
**Why:** At consistent ~220 WCU steady-state ($0.00065/WCU-hr = $103/mo undiscounted; ~$47/mo with 1-yr RC at 53% off). Post-Nov 2024 cut, break-even is ~40% utilization; 24/7 steady is well above.
**Distractors:** Standard-IA table class (only saves storage, makes writes ~25% more expensive), on-demand with reserved capacity (RC doesn't apply to on-demand), DAX (caching, doesn't reduce writes).

**Q17 [Medium].** Aurora MySQL cluster shows $4,000/mo with $1,500 of that being I/O charges. Should switch to I/O-Optimized?
**A.** Yes — I/O charges are 37.5% of bill (>25% threshold). Switch to I/O-Optimized; storage 2.25× and instance ~30% more but $0 I/O, net 25–40% savings.
**Why:** Calculate: instance increase ($X × 1.30) + storage increase ($Y × 2.25) − $1,500 I/O. If I/O share >25%, math always favors I/O-Optimized.
**Distractors:** Stay on Standard (overpays), switch to Aurora Serverless v2 (different model, not necessarily cheaper at this scale), migrate to RDS PostgreSQL (different engine, doesn't address I/O cost specifically).

**Q18 [Easy].** A company has 100GB DynamoDB table with logs accessed only for audit (1 read per day). Storage dominates cost. Best option?
**A.** Switch to DynamoDB Standard-IA table class.
**Why:** Storage $0.10/GB-mo vs Standard $0.25 (60% cheaper); request premium offset by very low access volume.
**Distractors:** Export to S3 Glacier (loses query capability), keep on Standard (overpays storage), PITR backup (doesn't change storage tier).

**Q19 [Hard].** A finance team needs <1 second RPO and globally distributed reads for a relational DB. Cheapest architecture?
**A.** Aurora Global Database with Standard storage (unless I/O >25%).
**Why:** Storage-level replication, typically <1s RPO, sub-minute RTO failover. Cross-region replicated I/O is paid but cheaper than 3rd-party multi-master setups.
**Distractors:** DynamoDB Global Tables (NoSQL, not relational), RDS cross-region read replicas (lower RPO not guaranteed), Aurora DSQL (active-active but multi-region SQL, may be too new and ACU floor adds cost).

**Q20 [Medium].** A Lambda-driven app has connection storms hitting RDS PostgreSQL during traffic spikes. Cheapest fix maintaining DB performance?
**A.** RDS Proxy at $0.015/vCPU-hr.
**Why:** Pools connections, prevents overwhelming DB, cheaper than upsizing DB.
**Distractors:** Aurora Serverless v2 with min 0 ACU (RDS Proxy blocks auto-pause), increase DB instance size (more expensive, addresses symptom), ElastiCache (different layer).

**Q21 [Medium].** ElastiCache Redis 4 cluster is approaching Feb 1, 2026. CFO sees Extended Support cost projections. Cheapest mitigation?
**A.** Migrate to Valkey 8.1 (free, in-place engine swap).
**Why:** Valkey 20% cheaper node-based, 33% cheaper Serverless vs Redis OSS; avoids +80% Extended Support yr 1–2.
**Distractors:** Pay Extended Support (+80%), migrate to MemoryDB (2× cost), migrate to DynamoDB (different model).

### Network scenarios (4.4)

**Q22 [Easy].** EC2 in private subnet calls S3 (same region) through NAT Gateway. NAT processing fee is huge. Fix?
**A.** Add S3 Gateway VPC Endpoint (FREE).
**Why:** Routes S3 traffic via free endpoint, bypassing NAT GW $0.045/GB processing.
**Distractors:** Interface Endpoint for S3 (paid, unnecessary when Gateway works), CloudFront (overkill for intra-region), public IP on EC2 (still routes via internet, worse).

**Q23 [Medium].** A 3-AZ VPC has 1 NAT Gateway per AZ. Workload generates 50 GB/mo cross-AZ to NAT. Should consolidate to single NAT GW?
**A.** Calculate: 3× NAT GW = $98.55/mo base. Single NAT = $32.85/mo, but 2/3 of traffic crosses AZ at $0.01/GB each way. At 50 GB/mo cross-AZ, cross-AZ cost = ~$0.67/mo. Single NAT GW saves ~$65/mo. **Below the ~3.24 TB/mo break-even threshold, consolidate.** Trade-off: lose per-AZ HA.
**Distractors:** Keep per-AZ for HA, replace with NAT instance (different ops profile), Transit Gateway (different problem).

**Q24 [Medium].** A company has 6 VPCs in one region needing full mesh connectivity. Cheapest?
**A.** VPC Peering full mesh (15 connections, no hourly fee). Below ~10 VPCs threshold.
**Why:** Peering has no hourly charge; intra-AZ private IP traffic FREE.
**Distractors:** Transit Gateway (charges $0.05/hr per attachment × 6 = $219/mo + processing), VPN mesh (encryption overhead unnecessary intra-region), CloudWAN (overkill).

**Q25 [Hard].** Hybrid workload sends 5 TB/mo to on-prem via VPN. Cost analysis vs Direct Connect 1 Gbps?
**A.** VPN: $36.50/mo + 5000 × $0.09 = $486.50/mo. DX 1 Gbps: $219/mo + 5000 × $0.02 = $319/mo. **DX saves $167/mo.** Above 2.6 TB/mo break-even.
**Why:** DX egress $0.02/GB beats VPN egress $0.09/GB at high volume.
**Distractors:** Keep VPN (overpays at this volume), DX 10 Gbps (overprovisioned), VPN+CloudFront (CF doesn't help hybrid traffic to on-prem).

**Q26 [Medium].** A global website serves 50 TB/mo to internet from S3. CFO wants to cut egress cost.
**A.** Put CloudFront in front of S3.
**Why:** S3→CloudFront is FREE; CF egress $0.085/GB (NA/EU) vs S3 direct $0.09/GB + 1 TB/mo free tier. Cache hits reduce origin requests too.
**Distractors:** S3 Transfer Acceleration (for uploads to S3, not downloads), Global Accelerator (no caching benefit for HTTP static content), Multi-Region S3 (replicates storage cost without reducing egress).

**Q27 [Medium].** A company has 50 EC2 instances with attached public IPv4 addresses they use for outbound API calls only. Feb 1, 2024 charges added ~$182/mo. Cheapest fix?
**A.** Remove public IPv4, route outbound via shared NAT Gateway. Or move to IPv6 + Egress-Only IGW (free).
**Why:** Public IPv4 charge $0.005/hr applies even to attached EIPs since Feb 2024.
**Distractors:** Keep paying (no optimization), use Spot (unrelated), Direct Connect (unrelated to outbound internet).

**Q28 [Hard].** An ALB serves 10 microservices each with their own ALB ($16.43/mo × 10 = $164.30/mo). Cheaper architecture?
**A.** Consolidate to one ALB with host-based or path-based routing rules (first 10 rules included free in LCU pricing). Saves ~$148/mo.
**Why:** ALB supports up to 100 rules per listener; rule evaluations counted in LCU but first 10 free.
**Distractors:** NLB (no L7 routing), CloudFront (not a load balancer replacement), API Gateway (different cost model, higher per-request).

### Cost Mgmt + Cross-cutting scenarios

**Q29 [Easy].** CFO wants alert when monthly EC2 spend exceeds $5000 AND auto-stop dev instances if it reaches $7000.
**A.** AWS Budgets with Budget Actions (auto-stop EC2 via IAM policy or Lambda).
**Why:** Native feature; first 2 budgets free.
**Distractors:** Cost Explorer (analysis only), Trusted Advisor (recommendations, no actions), CloudWatch (no native cost-based stop).

**Q30 [Medium].** A 4-account AWS Organization wants to share RI/SP discounts across all accounts and aggregate volume discounts.
**A.** Enable consolidated billing in AWS Organizations with RI/SP sharing turned on.
**Why:** Free; aggregates DT/S3 tiers; member accounts share unused RI/SP capacity.
**Distractors:** Billing Conductor (custom chargeback for MSPs, doesn't aggregate discounts), separate RI per account (loses sharing benefit), Cost Categories (organizes view, doesn't share discounts).

**Q31 [Medium].** A platform team needs free ML-based right-sizing recommendations across EC2, EBS, Lambda, and RDS.
**A.** AWS Compute Optimizer (free).
**Why:** Covers all those resource types; 14-day default lookback; ML-based.
**Distractors:** Trusted Advisor (requires Business/Enterprise Support for full Cost Optimization checks), Cost Explorer (right-sizing limited to EC2), third-party (paid).

**Q32 [Hard].** Finance needs row-level billing data exported to S3 for Athena queries and Power BI dashboards.
**A.** AWS Cost and Usage Report (CUR), preferably CUR 2.0 / Data Exports with Parquet format.
**Why:** Most granular billing data; hourly/daily; native Athena integration; free (pay S3 storage).
**Distractors:** Cost Explorer (visualizes, doesn't export raw rows; API costs $0.01/req), Budgets (alerting), CloudTrail (API audit, not cost).

**Q33 [Hard].** An e-commerce company expects 5× traffic spike for Black Friday over 4 days, needs guaranteed EC2 capacity, and wants any available discount.
**A.** On-Demand Capacity Reservation (ODCR) for guaranteed capacity + Regional Standard RI or Compute SP for billing discount applied to the reserved capacity.
**Why:** ODCR alone gives no discount but guarantees capacity; pairing with Regional RI/SP applies the billing discount even on idle reservation. No long-term commitment for ODCR (cancel anytime).
**Distractors:** Spot Fleet (capacity-optimized) (interruption risk during peak), 3-yr Standard RI (term overcommitment), wait for available capacity at peak (high risk).

---

## 5. IDENTIFICATION FLASHCARDS (45 items)

1. **Cheapest S3 storage class for archival, 12hr retrieval OK** → S3 Glacier Deep Archive.
2. **Cheapest S3 archive with ms retrieval** → S3 Glacier Instant Retrieval.
3. **S3 Standard-IA minimum storage duration** → 30 days.
4. **S3 Standard-IA minimum billable object size** → 128 KB.
5. **S3 Glacier Flexible/Instant Retrieval minimum duration** → 90 days.
6. **S3 Glacier Deep Archive minimum duration** → 180 days.
7. **S3 Intelligent-Tiering monitoring fee** → $0.0025 per 1000 objects/month.
8. **VPC endpoint types that are FREE** → Gateway Endpoints (S3 and DynamoDB only).
9. **Spot Instance maximum discount** → up to 90% off On-Demand.
10. **Standard RI maximum discount** → up to 72% (3-yr All Upfront).
11. **Convertible RI maximum discount** → up to 66%.
12. **Savings Plan covering EC2 + Fargate + Lambda** → Compute Savings Plans.
13. **Most discount-flexible SP with up to 72% off, family-locked** → EC2 Instance Savings Plans.
14. **Lambda Compute Savings Plan max savings** → up to 17% off duration (NOT request fees).
15. **Reserved Instance terms available** → 1 year or 3 years.
16. **EC2 Capacity Block max duration (post Nov 2024)** → 6 months.
17. **NAT Gateway hourly + per-GB rate** → $0.045/hr + $0.045/GB processed.
18. **Public IPv4 charge effective Feb 1, 2024** → $0.005/hr per address (attached or not).
19. **Aurora Standard vs I/O-Optimized break-even** → ~25% of total bill on I/O.
20. **DynamoDB on-demand WRU price post Nov 2024** → $1.25 per million.
21. **DynamoDB Standard-IA storage discount** → 60% off Standard storage.
22. **DynamoDB on-demand vs provisioned break-even (post 2024)** → ~40% utilization.
23. **Aurora Serverless v2 min ACUs (post Nov 2024)** → 0 ACUs (scale-to-zero).
24. **Aurora Limitless minimum ACUs** → 16 (no scale-to-zero).
25. **Aurora Serverless v2 ACU cost (Standard)** → $0.12/ACU-hour.
26. **CloudFront free tier (since Dec 2021)** → 1 TB egress + 10M HTTPS requests/mo.
27. **S3 to CloudFront data transfer cost** → FREE.
28. **Transit Gateway attachment cost** → $0.05/hr + $0.02/GB processed.
29. **Direct Connect data transfer out** → ~$0.02/GB (vs internet $0.09).
30. **VPN-vs-DX break-even at 1 Gbps** → ~2.6 TB/month sustained egress.
31. **CloudFront Functions vs Lambda@Edge cost** → $0.10/M vs $0.60/M invocations.
32. **AWS Compute Optimizer cost** → FREE.
33. **AWS Trusted Advisor full Cost Optimization checks require** → Business or Enterprise Support.
34. **First N AWS Budgets free** → 2 per account.
35. **EBS gp3 baseline included free** → 3000 IOPS + 125 MB/s.
36. **EBS Snapshot Archive savings vs Standard** → 75% (min 90 days).
37. **Lambda SnapStart cost for Java** → FREE.
38. **Lambda arm64 (Graviton2) savings vs x86** → ~20% lower duration cost.
39. **EKS Auto Mode management fee** → ~12% on EC2 hours (not discounted by Spot/RI/SP).
40. **Fargate Spot maximum discount** → up to 70%.
41. **Graviton price-performance improvement claim** → up to 40% better than x86.
42. **AWS Snowmobile current status** → Retired April 2024.
43. **Snowcone current status** → Discontinued November 12, 2024.
44. **QLDB end-of-support date** → July 31, 2025 (deprecated).
45. **Database Savings Plans launched** → December 2, 2025; 1-year No Upfront only; up to 35% off.

---

## 6. KEY GOTCHAS, TRAPS, AND COMMON CONFUSIONS

**Public IP vs Private IP traffic** — Same-AZ EC2-to-EC2 via private IP is FREE; via public IP/EIP it's $0.01/GB in + $0.01/GB out even in the same AZ. Always prefer private DNS / private IP.

**S3 IA 30-day vs Glacier 90-day vs Deep Archive 180-day minimums** — Easy confusion. Memorize the trio: 30/90/180.

**S3-IA min size 128 KB applies, Glacier Flexible/Deep have 40 KB metadata overhead** — Small-object archival to Glacier can cost MORE than Standard due to overhead.

**S3 Intelligent-Tiering monitoring fee for tiny objects** — $0.0025/1000 objects/month. Bucket with billions of tiny objects = huge fee. Aggregate first.

**Savings Plans do NOT reserve capacity** — Pair with ODCR or Zonal RI if capacity guarantee needed.

**Spot Blocks discontinued for new customers since July 2021** — Never the right answer on current exam.

**Dedicated Instance $2/hr per-region fee NOT covered by any SP or RI** — Cost trap.

**EKS Auto Mode 12% management fee NOT discounted by Spot/RI/SP** — Premium for managed Karpenter.

**EKS control plane $0.10/hr NOT covered by SPs** — Only worker EC2/Fargate covered.

**Lambda request fee ($0.20/M) NEVER covered by Compute SP** — Only duration + Provisioned Concurrency.

**ODCR costs same as On-Demand whether used or not** — Combine with Regional RI for billing discount on idle reservation. **Zonal RI does NOT discount idle ODCR.**

**Convertible RI exchange must be equal-or-greater value** — Can't downgrade for refund.

**Spot is wrong if "any interruption is unacceptable"** even when "lowest cost" is the goal.

**Aurora Serverless v2 scale-to-zero blocked by:** RDS Proxy attached, Aurora Global DB secondary, zero-ETL integrations, tier 0/1 readers. Common exam trap.

**Aurora I/O-Optimized 30-day lockout** before switching back to Standard.

**Aurora Global Database replicated write I/O is still charged on I/O-Optimized** — Common assumption error.

**RDS Convertible RIs do NOT exist** — RDS only has Standard RIs (size-flexible). Aurora and other RDS engines: Standard only.

**RDS Extended Support charges apply to ALL instances** including Multi-AZ standbys, doubling unexpected cost on legacy MySQL/PostgreSQL.

**DAX has no Reserved pricing and no scale-to-zero** — 3-node min for prod = floor ~$86/mo even at idle.

**DynamoDB GSI write amplification** — Every base write replicates to each GSI (1 base + 3 GSIs = 4× write cost).

**Multi-AZ Cluster (2 readable standbys, ~2.5×) vs Multi-AZ standard (1 standby, ~2×)** — Cluster only worth it if you need readable standbys AND lower commit latency.

**NLB DOES charge cross-AZ to targets by default** when cross-zone load balancing is enabled. ALB does NOT.

**CloudFront → S3 (origin fetch) is FREE** but S3 GET requests still apply on the origin side.

**ALB vs NLB LCU/NLCU billing on MAX of dimensions** — A connection-heavy NLB workload may bill far higher than expected if you compute only by bandwidth.

**Transfer Family endpoint is $0.30/hr per PROTOCOL** — Adding FTPS to existing SFTP doubles base cost.

**Storage Gateway Volume Cached vs Stored**: Cached = primary in S3 with local cache (offload). Stored = primary on-prem, async backup to S3 (DR).

**EBS Snapshot Archive stores full snapshots (not incremental)** — Math only works when snapshot's unique block delta is large.

**Fast Snapshot Restore (FSR) costs $0.75/DSU-hour per AZ per snapshot** — Massive cost if accidentally enabled globally. 1 snapshot × 3 AZs ≈ $1,620/mo.

**S3 Transfer Acceleration applies ON TOP of standard DT pricing** — Not a replacement; only $0 if AWS detects no acceleration benefit.

**Trusted Advisor full Cost Optimization checks require Business/Enterprise Support** — Basic only has 7 core checks. Common exam scenario: "without third-party tools and have appropriate support" → Trusted Advisor.

**Cost Anomaly Detection, Cost Optimization Hub, Billing Conductor, Application Cost Profiler, Pricing Calculator** — NOT in SAA-C03 in-scope list. If they appear in answer choices, likely distractor.

**Orphan EBS snapshots and unattached EIPs/EBS volumes are #1 waste sources** — Common Trusted Advisor / Compute Optimizer recommendations.

**CloudFront Price Class 100 vs 200 vs All** — Caps DTO rate by excluding expensive edges; users outside still served from farther PoPs.

**Snowmobile retired April 2024 + Snowcone Nov 2024** — Never answer "Snowmobile" or "Snowcone" on a current exam.

---

## 7. OUT-OF-SCOPE SERVICES (Do NOT include in study app)

Per SAA-C03 Exam Guide (v1.1) Appendix — these cost-adjacent services are NOT in the official in-scope list and should be excluded from question banks (treat as awareness-only if needed):

- **AWS Application Cost Profiler** — Also discontinued September 30, 2024.
- **AWS Billing Conductor** — MSP/chargeback niche.
- **AWS Cost Optimization Hub** — Useful in practice but not in in-scope category.
- **AWS Cost Anomaly Detection** — Not in in-scope category.
- **CUR 2.0 / AWS Data Exports** — Treat as a CUR feature, not a separate service.
- **AWS Pricing Calculator** — Not listed as in-scope service.
- **AWS Marketplace** — Not listed.
- **Service Quotas** — Not in cost category.
- **AWS Free Tier API** — Not in-scope.
- **AWS Snowmobile** — Retired April 2024.
- **AWS Snowcone** — Discontinued Nov 12, 2024.
- **Amazon QLDB** — End-of-support July 31, 2025; never a right answer.
- **Spot Blocks** — Discontinued for new customers since July 2021.
- **AWS Compute Optimizer Enhanced Infrastructure Metrics** — Paid feature, awareness only.
- **Database Savings Plans (Dec 2, 2025)** — Too new to be in current question pool; awareness only.
- **Aurora DSQL, Aurora Limitless** — Likely not yet tested at depth; awareness.
- **S3 Tables, S3 Metadata** — re:Invent 2024; awareness only.
- **EKS Hybrid Nodes, Outposts for telco** — Niche, awareness only.
- **VPC Lattice** — Newer service, not yet heavily tested.
- **AWS Verified Access** — Not heavily tested in D4.
- **AWS Lambda Managed Instances** — re:Invent 2025, too new.
- **Trainium3 UltraServers, Graviton5 / M9g** — Future awareness.
- **CloudFront flat-rate plans (Nov 2025)** — Awareness; pay-as-you-go still primary on exam.

**Tier-1 (heavily tested):** S3 storage classes/lifecycle, EBS volume types, NAT GW vs VPC Endpoints, RI/SP/Spot decision matrix, Cost Explorer / Budgets / CUR / Trusted Advisor / Compute Optimizer, Organizations consolidated billing, cost allocation tags, Aurora Serverless v2 scale-to-zero, DynamoDB on-demand vs provisioned, Graviton trade-offs, data transfer cost matrix.

**Tier-2 (awareness):** Snow family (Snowball Edge only), Storage Gateway, DataSync, Direct Connect vs VPN, Lambda/Fargate pricing, License Manager, Public IPv4 charge (Feb 2024), EFS Archive class, EBS Snapshot Archive, AWS Backup.

This reference is exam-decision-oriented; verify pricing on AWS pricing pages before production budgeting.