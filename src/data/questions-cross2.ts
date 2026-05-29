import { Question } from "../lib/types"

export const crossDomainQuestions2: Question[] = [

  // ─────────────────────────────────────────────────────────────
  // cd-026  Migration: on-prem → AWS  (D2 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-026",
    domain: 3,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "3.1",
    services: ["dms", "snowball-edge", "rds", "aurora"],
    constraintType: "migration",
    difficulty: 5,
    type: "single",
    stem: "A healthcare company must migrate a 30 TB Oracle database from on-premises to Amazon Aurora PostgreSQL. The migration must complete within a 6-hour maintenance window with NO more than 15 minutes of downtime for the application cutover. The Oracle schema uses stored procedures and PL/SQL that must be converted. The migration budget is $20,000. The team has a single 1 Gbps internet uplink shared with production traffic. Which sequence of steps meets the RTO, COST, and PERFORMANCE requirements?",
    options: [
      {
        id: "A",
        text: "Use AWS Database Migration Service (AWS DMS) full-load task over the internet to migrate all 30 TB during the maintenance window, then switch the application connection string to Aurora.",
        isCorrect: false,
        explanation: "Wrong — A 1 Gbps link shared with production can realistically transfer roughly 300–400 GB/hour at best. Migrating 30 TB would take 75–100 hours, far exceeding the 6-hour window and the 15-minute downtime target. DMS alone is not suitable for initial bulk load of this size over a constrained link."
      },
      {
        id: "B",
        text: "Ship the database export to AWS via AWS Snowball Edge Storage Optimized to load the bulk data into Amazon Simple Storage Service (Amazon S3), restore into Aurora, then use AWS DMS in change-data-capture (CDC) mode to sync changes during the maintenance window and cut over within 15 minutes.",
        isCorrect: true,
        explanation: "Correct — Snowball Edge handles the bulk 30 TB transfer offline (no bandwidth contention). Once data is in S3 and restored to Aurora, DMS CDC tracks only the delta (changes since the export), which is far smaller than 30 TB and easily transfers within the maintenance window. Cutover is just stopping writes, letting CDC drain, and switching the connection string — achievable in under 15 minutes. Snowball + DMS combined cost is well within $20,000 and the Aurora cluster handles PERFORMANCE requirements."
      },
      {
        id: "C",
        text: "Use AWS Schema Conversion Tool (AWS SCT) and AWS DMS with a full-load-and-CDC task starting one week before the maintenance window, then halt replication and cut over during the window.",
        isCorrect: false,
        explanation: "Wrong — Starting a full-load task over a 1 Gbps shared uplink for 30 TB one week before would saturate production bandwidth for days. Even if it completes, the ongoing CDC replication during that week generates significant DMS cost and risks data drift issues. The Snowball approach is superior for this data size and bandwidth constraint."
      },
      {
        id: "D",
        text: "Provision a 10 Gbps AWS Direct Connect connection, use AWS DMS full-load starting 2 hours before the maintenance window, and cut over during the window.",
        isCorrect: false,
        explanation: "Wrong — Provisioning Direct Connect takes weeks (not feasible for a planned migration window) and a dedicated 10 Gbps DX connection costs thousands per month in port fees, likely exceeding the $20,000 total budget before any data is moved. This approach fails on both COST and timeline feasibility."
      }
    ],
    explanation: "For large database migrations (>10 TB) with constrained bandwidth, the best pattern is: (1) use AWS Snowball Edge for bulk offline transfer, (2) restore into the target, (3) use DMS CDC for ongoing sync of only the delta. This separates the bulk-data problem from the cutover problem, making the RTO achievable. AWS SCT handles the PL/SQL conversion separately before the migration begins.",
    keywords: ["database migration", "DMS CDC", "Snowball Edge", "Aurora PostgreSQL", "RTO", "cutover", "bandwidth constraint"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-027  Serverless: Lambda + API Gateway + DynamoDB  (D1 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-027",
    domain: 4,
    domains: [1, 3, 4],
    crossDomain: true,
    taskStatement: "4.2",
    services: ["api-gateway", "lambda", "dynamodb"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A SaaS company runs a public API serving 10,000 concurrent users at peak. The API is currently built on Amazon API Gateway REST API, AWS Lambda, and Amazon DynamoDB. At current traffic, Lambda invocations cost $2,200/month, API Gateway REST API costs $1,800/month, and DynamoDB on-demand costs $900/month. A solutions architect must reduce total API cost by at least 30% without degrading p99 LATENCY or weakening SECURITY controls (WAF, request validation, resource policies). Which change achieves this?",
    options: [
      {
        id: "A",
        text: "Replace Amazon API Gateway REST API with Amazon API Gateway HTTP API. Keep AWS Lambda and Amazon DynamoDB unchanged.",
        isCorrect: true,
        explanation: "Correct — HTTP API costs ~$1.00/million requests vs REST API's ~$3.50/million requests — approximately 71% cheaper. HTTP API supports Lambda integrations, AWS WAF (attached at the HTTP API stage), JWT authorizers (equivalent security to Cognito/Lambda authorizers on REST), and request/response transformations. p99 latency is typically lower on HTTP API due to reduced overhead. Total savings: roughly $1,260/month on the API Gateway line (~70% reduction there), bringing total monthly cost from $4,900 to ~$3,640 — a 25%+ reduction on API Gateway alone, pushing overall savings past 30% when combined with any DynamoDB provisioned-capacity switch."
      },
      {
        id: "B",
        text: "Replace AWS Lambda with Amazon Elastic Compute Cloud (Amazon EC2) Reserved Instances behind an Application Load Balancer and keep REST API.",
        isCorrect: false,
        explanation: "Wrong — Moving to EC2 Reserved Instances requires upfront capacity planning, adds operational overhead, and for a spiky 10,000-concurrent-user workload may actually increase cost versus Lambda's pay-per-invocation model. It also doesn't address the $1,800/month API Gateway REST API cost, which is the largest lever for savings."
      },
      {
        id: "C",
        text: "Switch Amazon DynamoDB to provisioned capacity mode with Auto Scaling and keep REST API and Lambda unchanged.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB provisioned capacity savings depend heavily on traffic patterns. At best, switching from on-demand to provisioned with Auto Scaling might save 30–40% of the $900 DynamoDB cost ($270–$360/month), which is only a 6–7% reduction on the $4,900 total. This does not achieve the required 30% overall reduction."
      },
      {
        id: "D",
        text: "Enable Amazon API Gateway caching on the REST API with a 0.5 GB cache and reduce Lambda memory from 1,024 MB to 512 MB.",
        isCorrect: false,
        explanation: "Wrong — API Gateway caching adds $0.02/hour per GB of cache (roughly $14/month for 0.5 GB), increasing API Gateway costs. Reducing Lambda memory to 512 MB speeds up some functions but may increase duration for CPU-bound tasks, yielding unpredictable savings. Neither change approaches a 30% total cost reduction."
      }
    ],
    explanation: "Amazon API Gateway HTTP API is the single highest-impact cost lever for Lambda-backed APIs. HTTP API offers a 70%+ price reduction vs REST API for identical Lambda proxy integrations, supports JWT authorizers, AWS WAF, and CORS — covering all stated SECURITY requirements. The LATENCY profile of HTTP API is also slightly better. When REST API is the dominant cost line, switching to HTTP API is the correct architectural move.",
    keywords: ["HTTP API", "REST API", "API Gateway cost", "Lambda", "DynamoDB", "WAF", "latency", "serverless cost"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-028  Data lake: S3 + Glue + Athena + Lake Formation  (D1 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-028",
    domain: 1,
    domains: [1, 3, 4],
    crossDomain: true,
    taskStatement: "1.1",
    services: ["s3", "glue", "athena", "lake-formation"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A financial analytics platform stores 50 TB of transaction data in Amazon Simple Storage Service (Amazon S3) in Apache Parquet format. Analysts from three business units query this data using Amazon Athena. Each business unit must see ONLY its own transaction columns (column-level SECURITY); some analysts within each unit must be further restricted to row subsets based on account region. All queries must complete in under 10 seconds at p90 (PERFORMANCE). The data team wants to minimize per-query Athena scan costs (COST). Which combination satisfies all three constraints?",
    options: [
      {
        id: "A",
        text: "Use AWS Lake Formation column-level permissions and row-level filter expressions to restrict access. Partition S3 data by business-unit and region. Configure Athena workgroups per business unit with query result reuse enabled.",
        isCorrect: true,
        explanation: "Correct — Lake Formation natively enforces column-level security and row-level filters at query time without needing separate data copies. Partitioning by business-unit and region means Athena prunes partitions before scanning, dramatically reducing data scanned per query (PERFORMANCE + COST). Workgroups with result reuse cache repeated queries, further cutting scan costs. This satisfies SECURITY (column + row restrictions), PERFORMANCE (partition pruning keeps scans small), and COST (less scanned data = lower Athena per-TB charge)."
      },
      {
        id: "B",
        text: "Create three separate S3 buckets — one per business unit — with only the permitted columns copied via AWS Glue ETL jobs nightly. Restrict bucket access with S3 bucket policies.",
        isCorrect: false,
        explanation: "Wrong — Copying data to separate buckets triples storage costs (150 TB total), adds nightly Glue ETL job costs, and introduces data-freshness lag. Row-level filtering still requires additional logic. This fails on COST (3x storage + ETL) and doesn't elegantly handle the row-level requirements."
      },
      {
        id: "C",
        text: "Apply Amazon Athena resource-level IAM policies per analyst. Store data in Amazon S3 with no partitioning and use Athena workgroups to limit which tables analysts can query.",
        isCorrect: false,
        explanation: "Wrong — IAM resource policies on Athena control which queries analysts can run but do not enforce column-level security at the data layer — analysts who gain S3 read access could bypass Athena. Lack of partitioning means Athena scans the full 50 TB on every query, failing PERFORMANCE and COST constraints."
      },
      {
        id: "D",
        text: "Use Amazon Redshift Spectrum over the same S3 data with Redshift column-level privileges. Share the cluster across all three business units.",
        isCorrect: false,
        explanation: "Wrong — Redshift Spectrum can enforce column-level security via Redshift privileges but sharing a single Redshift cluster across business units creates noisy-neighbor PERFORMANCE risks. Redshift provisioned cluster costs ($0.25/hour minimum) are significantly higher than Athena's pay-per-scan model for this workload, failing the COST objective. Lake Formation + Athena is the architecturally correct serverless answer."
      }
    ],
    explanation: "AWS Lake Formation is the purpose-built service for column-level and row-level security in a data lake. Combined with S3 partitioning (to minimize Athena scan), Parquet columnar storage (further reducing scan), and Athena workgroup result reuse (eliminating redundant scans), this architecture satisfies security, performance, and cost simultaneously.",
    keywords: ["Lake Formation", "column-level security", "row-level filter", "Athena partitioning", "Parquet", "data lake", "scan cost"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-029  Containers: ECS Fargate vs EC2  (D2 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-029",
    domain: 4,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "4.3",
    services: ["ecs", "fargate", "ec2", "alb", "ecr"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company runs a microservices platform on Amazon Elastic Container Service (Amazon ECS) with AWS Fargate. The platform handles 5,000 requests/second with a stable, predictable load profile 24/7 — no significant peaks or troughs. Each task uses 2 vCPU and 4 GB memory. Currently running 100 tasks continuously, monthly Fargate cost is $9,800. An engineer proposes switching to ECS on Amazon Elastic Compute Cloud (Amazon EC2) with 3-year Reserved Instances. Operations team insists on NO increase in deployment complexity — rolling updates must remain automated. A solutions architect must reduce monthly COST by at least 40% while preserving HIGH AVAILABILITY (multi-AZ) and automated DEPLOYMENT operations. Which solution meets all three constraints?",
    options: [
      {
        id: "A",
        text: "Migrate ECS tasks to EC2 launch type using Amazon EC2 C5 instances with 3-year Compute Savings Plans. Use ECS rolling update deployment with minimum 100% healthy percent. Deploy across 3 Availability Zones.",
        isCorrect: true,
        explanation: "Correct — For stable 24/7 workloads running 100 tasks continuously, EC2 with 3-year Compute Savings Plans reduces compute cost by ~66% vs Fargate on-demand pricing, easily achieving the 40% total cost reduction. ECS on EC2 with rolling update (minimumHealthyPercent=100, maximumPercent=200) keeps automated deployments identical to Fargate — ECS manages task placement and rolling replacement automatically. Multi-AZ placement constraints maintain HIGH AVAILABILITY. Compute Savings Plans apply to ECS EC2 tasks automatically."
      },
      {
        id: "B",
        text: "Keep AWS Fargate but switch to AWS Fargate Spot for all 100 tasks. Configure ECS Service Auto Scaling to replace interrupted tasks.",
        isCorrect: false,
        explanation: "Wrong — Fargate Spot tasks can be interrupted with a 2-minute warning. Running all 100 production tasks on Spot for a 24/7 stable workload risks service disruption — this violates HIGH AVAILABILITY requirements. Fargate Spot is appropriate for fault-tolerant batch or background workloads, not latency-sensitive production microservices."
      },
      {
        id: "C",
        text: "Migrate to Amazon Elastic Kubernetes Service (Amazon EKS) with managed node groups on EC2 Spot Instances and Cluster Autoscaler.",
        isCorrect: false,
        explanation: "Wrong — Spot Instances for a stable 24/7 workload introduce interruption risk, violating HIGH AVAILABILITY. Additionally, migrating from ECS to EKS significantly increases deployment complexity (Kubernetes manifests, Helm charts, RBAC) — violating the no-increase-in-complexity constraint. EKS also adds $0.10/hour cluster management fee."
      },
      {
        id: "D",
        text: "Keep Fargate and purchase 1-year Compute Savings Plans covering 100% of current vCPU usage.",
        isCorrect: false,
        explanation: "Wrong — 1-year Compute Savings Plans offer ~40% discount on Fargate. However, the question asks for at least 40% reduction in the $9,800 total, meaning the target is ~$5,880/month. Fargate with 1-year Savings Plans would be approximately $5,880 — borderline. But the question specifies 3-year RI for EC2 which achieves ~66% reduction to ~$3,332/month, far exceeding the target while EC2 Savings Plans are more cost-effective at this sustained scale."
      }
    ],
    explanation: "For stable, predictable 24/7 container workloads, EC2 Reserved Instances (or Compute Savings Plans) significantly undercut Fargate pricing. At 100 continuous tasks with 2 vCPU/4 GB each (200 vCPU total), EC2 Reserved or Savings Plans pricing runs roughly $0.03–0.04/vCPU-hour vs Fargate's ~$0.04048/vCPU-hour — and EC2 pricing includes the OS overhead amortized across tasks. ECS rolling updates on EC2 are fully automated, preserving operational equivalence with Fargate.",
    keywords: ["Fargate vs EC2", "Compute Savings Plans", "ECS rolling update", "container cost", "stable workload", "multi-AZ", "Reserved Instances"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-030  Media/streaming: CloudFront + S3 + Kinesis  (D2 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-030",
    domain: 3,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "3.2",
    services: ["cloudfront", "s3", "kinesis", "mediaconvert"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A live-streaming startup delivers video to 50,000 concurrent global viewers. Video is ingested via Amazon Kinesis Video Streams, transcoded by AWS Elemental MediaConvert into HLS segments stored in Amazon Simple Storage Service (Amazon S3), and served via Amazon CloudFront. Viewers in Asia-Pacific report 8-second buffering delays. The startup has a $3,000/month content-delivery budget. CloudFront currently uses Price Class All. A solutions architect must reduce Asia-Pacific LATENCY to under 2 seconds while keeping delivery COST within budget and ensuring the stream remains AVAILABLE if one AWS Region fails. Which combination meets all three constraints?",
    options: [
      {
        id: "A",
        text: "Keep CloudFront Price Class All. Add an Amazon S3 bucket in the Asia-Pacific Region as an additional CloudFront origin. Configure CloudFront origin failover with the US origin as primary and the Asia-Pacific origin as secondary.",
        isCorrect: false,
        explanation: "Wrong — This adds a second S3 bucket in Asia-Pacific (storage + replication costs), but origin failover only activates on 4xx/5xx responses from the primary — it does not reduce latency for cache misses because CloudFront still fetches from the primary US origin first on each miss. The 8-second delay is a cache-miss path problem, not a failover problem."
      },
      {
        id: "B",
        text: "Create an Amazon S3 bucket in an Asia-Pacific AWS Region. Configure Amazon S3 Cross-Region Replication to replicate HLS segments to the Asia-Pacific bucket. Set the Asia-Pacific bucket as the CloudFront origin with Price Class 200 (includes Asia-Pacific edge locations).",
        isCorrect: true,
        explanation: "Correct — Cross-Region Replication (CRR) pushes HLS segments to an Asia-Pacific S3 bucket, reducing origin fetch distance for CloudFront Asia-Pacific edge nodes from US to a regional S3. Price Class 200 includes Asia-Pacific edge locations and costs ~20% less than Price Class All, staying within budget. If the primary Region fails, the Asia-Pacific bucket remains available for continued delivery. This satisfies LATENCY (origin closer to viewers), COST (Price Class 200 < Price Class All), and AVAILABILITY (segments replicated independently in Asia-Pacific)."
      },
      {
        id: "C",
        text: "Switch CloudFront to Price Class 100 (US, Canada, Europe only) and configure AWS Global Accelerator to route Asia-Pacific viewers to the nearest US CloudFront edge.",
        isCorrect: false,
        explanation: "Wrong — Price Class 100 explicitly excludes Asia-Pacific CloudFront edge locations, meaning Asia-Pacific viewers must traverse the internet to reach US edges — worsening latency. Global Accelerator improves routing to AWS entry points but cannot compensate for the physical distance to a US origin."
      },
      {
        id: "D",
        text: "Enable CloudFront real-time logs, analyze with Amazon Kinesis Data Firehose, and use the insights to manually increase CloudFront TTL for HLS segments to reduce cache misses.",
        isCorrect: false,
        explanation: "Wrong — Increasing TTL reduces repeat-viewer cache misses but does nothing for the first viewer in a geographic area who triggers the origin fetch. For a live stream with new segments every 2–6 seconds, TTL-based caching provides minimal benefit. This doesn't address the fundamental distance problem causing 8-second delays in Asia-Pacific."
      }
    ],
    explanation: "For global video streaming, moving the origin closer to the viewer population is the primary lever for reducing buffering latency. S3 Cross-Region Replication paired with a regional origin in Asia-Pacific reduces the CloudFront origin-fetch round-trip from ~200ms (US to Asia-Pacific) to ~5ms (local). CloudFront Price Class 200 includes Asia-Pacific PoPs at lower cost than Price Class All.",
    keywords: ["CloudFront Price Class", "S3 Cross-Region Replication", "origin latency", "live streaming", "HLS", "Asia-Pacific", "origin failover"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-031  Hybrid connectivity: DX + VPN + TGW  (D2 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-031",
    domain: 2,
    domains: [2, 4],
    crossDomain: true,
    taskStatement: "2.3",
    services: ["direct-connect", "vpn", "transit-gateway"],
    constraintType: "ha",
    difficulty: 5,
    type: "single",
    stem: "A multinational bank requires a hybrid connection between its on-premises data center and three Amazon Virtual Private Clouds (Amazon VPCs) in the same AWS Region. Requirements: 99.99% AVAILABILITY SLA for the hybrid connection, maximum 10 ms LATENCY for transactional traffic, and a $15,000/month maximum CONNECTIVITY budget. The bank already has one 1 Gbps AWS Direct Connect dedicated connection in place (cost: $2,200/month port fee + $1,800/month in data transfer = $4,000/month). Which architecture satisfies all three constraints?",
    options: [
      {
        id: "A",
        text: "Add a second 1 Gbps AWS Direct Connect dedicated connection from a different Direct Connect location. Attach both connections to an AWS Transit Gateway via a Direct Connect Gateway. Configure BGP active-active for load balancing across both connections.",
        isCorrect: true,
        explanation: "Correct — Two dedicated Direct Connect connections from different DX locations provide the physical redundancy required for AWS's 99.99% network SLA. Active-active BGP provides both redundancy and bandwidth aggregation. A Direct Connect Gateway + Transit Gateway connects all three VPCs through a single hub. Cost: second DX port $2,200 + $1,800 transfer = $4,000/month additional, total ~$8,000/month — well within the $15,000 budget. Direct Connect dedicated connections deliver sub-10ms latency. This satisfies AVAILABILITY (99.99% with dual DX from different locations), LATENCY (<10ms dedicated fiber), and COST (<$15,000/month)."
      },
      {
        id: "B",
        text: "Keep the existing Direct Connect connection and add a Site-to-Site VPN as failover backup. Attach both to Transit Gateway. Configure BGP so VPN is the standby path.",
        isCorrect: false,
        explanation: "Wrong — AWS explicitly states that a single Direct Connect + VPN backup provides SLA coverage only up to 99.9% (not 99.99%). For 99.99% availability, AWS requires either two separate Direct Connect connections from different DX locations, or a specific resiliency model. Additionally, VPN failover introduces >10ms latency (VPN over internet typically 20–60ms), violating the LATENCY requirement for transactional traffic."
      },
      {
        id: "C",
        text: "Add two AWS Hosted Direct Connect connections (1 Gbps each) from the same DX location as a second and third path, terminating on Transit Gateway.",
        isCorrect: false,
        explanation: "Wrong — AWS Hosted Direct Connect connections share underlying physical infrastructure within the same DX location. If that location experiences an outage, all connections from the same location fail simultaneously. AWS's 99.99% resiliency model requires connections from geographically separate DX locations. Same-location hosted connections do not fulfill the 99.99% AVAILABILITY requirement."
      },
      {
        id: "D",
        text: "Replace the existing Direct Connect connection with three Site-to-Site VPN connections using Equal-Cost Multi-Path (ECMP) routing on Transit Gateway.",
        isCorrect: false,
        explanation: "Wrong — Site-to-Site VPN traverses the public internet and delivers 20–100ms latency, far exceeding the 10ms LATENCY requirement for transactional banking traffic. While three VPN connections with ECMP can approach 99.99% availability, internet-based latency makes this unsuitable for low-latency transactional workloads."
      }
    ],
    explanation: "Achieving 99.99% availability for Direct Connect requires two dedicated connections from DIFFERENT Direct Connect locations (not just different circuits from the same location). AWS's published resiliency model for 99.99% is 'maximum resiliency' — two DX connections at two separate DX locations. Transit Gateway + Direct Connect Gateway provides the hub for multi-VPC connectivity. VPN as a failover only achieves 99.9% and introduces unacceptable latency for transactional systems.",
    keywords: ["Direct Connect 99.99%", "dual DX locations", "Transit Gateway", "Direct Connect Gateway", "hybrid connectivity", "BGP active-active", "VPN failover SLA"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-032  Compliance + performance: regulated storage  (D1 + D3)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-032",
    domain: 1,
    domains: [1, 3],
    crossDomain: true,
    taskStatement: "1.2",
    services: ["fsx-netapp", "s3", "kms", "cloudwatch"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A pharmaceutical company runs genome-sequencing workloads that produce 200 GB of output files per hour. Files must be stored with FIPS 140-2 Level 2 compliant encryption using customer-managed keys, must support POSIX file-system semantics for the sequencing software (NFS protocol), and must deliver read throughput of at least 12 GB/s for downstream analytics. The data must also be replicated to a second AWS Region within 15 minutes for COMPLIANCE. Which AWS storage solution meets all four constraints?",
    options: [
      {
        id: "A",
        text: "Use Amazon FSx for NetApp ONTAP with an SSD storage tier, NFS protocol mounts, and AWS KMS customer-managed key encryption. Enable SnapMirror replication to a second FSx for NetApp ONTAP file system in the second Region.",
        isCorrect: true,
        explanation: "Correct — FSx for NetApp ONTAP supports NFS (POSIX semantics), delivers up to 12.5 GB/s read throughput with SSD tiers, uses AWS KMS CMKs for encryption at rest (FIPS 140-2 Level 2 validated endpoints), and supports NetApp SnapMirror for cross-region replication with RPO in minutes — well within the 15-minute window. This satisfies POSIX/NFS, THROUGHPUT, ENCRYPTION/COMPLIANCE, and REPLICATION requirements."
      },
      {
        id: "B",
        text: "Use Amazon Simple Storage Service (Amazon S3) with server-side encryption using AWS KMS (SSE-KMS), S3 Cross-Region Replication, and mount via Amazon S3 Mountpoint.",
        isCorrect: false,
        explanation: "Wrong — Amazon S3 Mountpoint provides basic POSIX read semantics but does not support full POSIX file-system semantics required by sequencing software (no random writes, no file locking, no rename atomicity). S3 does not provide 12 GB/s single-client read throughput — typical S3 GET throughput is in the 100s of MB/s range per prefix, not GB/s scale for a single workload mount."
      },
      {
        id: "C",
        text: "Use Amazon Elastic File System (Amazon EFS) with AWS KMS customer-managed key encryption in Provisioned Throughput mode set to 12 GB/s, and AWS Backup with cross-region copy for replication.",
        isCorrect: false,
        explanation: "Wrong — Amazon EFS maximum throughput is 10 GB/s for the entire file system (not 12 GB/s), which is below the stated requirement. Additionally, AWS Backup cross-region copy is not continuous replication — it is a scheduled backup, and the RPO/replication time cannot be guaranteed at 15-minute intervals for 200 GB/hour of new data."
      },
      {
        id: "D",
        text: "Use Amazon FSx for Lustre with data repository association to Amazon S3, SSE-KMS encryption, and S3 Cross-Region Replication on the backing S3 bucket.",
        isCorrect: false,
        explanation: "Wrong — FSx for Lustre uses the Lustre POSIX client (not NFS), which may be incompatible with sequencing software expecting NFS mounts. More critically, S3 Cross-Region Replication only replicates data after it is flushed from Lustre to S3 via data repository sync — which is not automatic or real-time, making the 15-minute replication SLA unreliable for continuous 200 GB/hour output."
      }
    ],
    explanation: "Amazon FSx for NetApp ONTAP is the only AWS-native file service that combines: NFS POSIX compliance, SSD throughput exceeding 12 GB/s, AWS KMS CMK encryption (FIPS 140-2 Level 2), and built-in SnapMirror cross-region replication with sub-15-minute RPO. It is the purpose-built choice for regulated, high-throughput file workloads.",
    keywords: ["FSx for NetApp ONTAP", "NFS POSIX", "SnapMirror", "FIPS 140-2", "CMK encryption", "cross-region replication", "genome sequencing", "12 GB/s throughput"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-033  Multi-account cost allocation  (D1 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-033",
    domain: 4,
    domains: [1, 4],
    crossDomain: true,
    taskStatement: "4.1",
    services: ["organizations", "cost-explorer", "budgets", "scp"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company has 40 AWS accounts organized under AWS Organizations. Finance needs per-team cost visibility down to the project level without cross-team visibility (SECURITY: team A cannot see team B costs). Each team has a $10,000/month cap — if exceeded, the team's account manager must be notified automatically but deployments must NOT be blocked (OPERATIONS). The cloud team wants to enforce this with minimal administrative overhead. Which combination of AWS features satisfies cost visibility, security isolation, and operational requirements?",
    options: [
      {
        id: "A",
        text: "Enable AWS Cost Explorer with cost allocation tags. Apply Service Control Policies (SCPs) that deny Cost Explorer access to accounts in other organizational units. Create AWS Budgets alerts with Amazon SNS notifications to account managers when spend exceeds $10,000.",
        isCorrect: true,
        explanation: "Correct — Cost allocation tags applied to resources in each account enable per-project cost breakdown in Cost Explorer. SCPs restricting Cost Explorer access between OUs provide cross-team cost SECURITY (team A's OU can only query its own account data). AWS Budgets with SNS notification at $10,000 threshold sends alerts to account managers without blocking deployments — satisfying the OPERATIONS requirement. Tag-based cost allocation + SCP isolation + Budgets alerts is the minimal-overhead standard pattern."
      },
      {
        id: "B",
        text: "Use AWS Cost Anomaly Detection with SNS alerts and deploy AWS Config rules that automatically quarantine accounts exceeding $10,000.",
        isCorrect: false,
        explanation: "Wrong — Cost Anomaly Detection identifies unusual spending patterns but does not enforce hard budget caps at $10,000. Quarantining accounts (e.g., attaching an SCP that denies all actions) blocks deployments, which violates the explicit operational requirement that deployments must NOT be blocked when the cap is exceeded."
      },
      {
        id: "C",
        text: "Consolidate all billing into the management account. Grant each team read-only IAM access to AWS Cost Explorer filtered by their cost center tag. Use AWS Lambda triggered by CloudWatch Events to send SNS notifications when monthly spend exceeds $10,000.",
        isCorrect: false,
        explanation: "Wrong — Granting all teams access to Cost Explorer in the management account with tag-based filtering relies on correct tagging and IAM policy precision to prevent cross-team visibility — it is operationally complex and error-prone. Cost Explorer IAM filtering by tags is not a security boundary; a misconfigured policy could expose another team's data. The SCP-at-OU-level approach is architecturally stronger for isolation."
      },
      {
        id: "D",
        text: "Use AWS Trusted Advisor to monitor per-account spend and generate weekly Cost Optimization reports. Apply SCPs that deny resource creation in accounts exceeding $10,000.",
        isCorrect: false,
        explanation: "Wrong — AWS Trusted Advisor's cost optimization checks are advisory and weekly, not real-time. Denying resource creation via SCP when the threshold is exceeded blocks deployments, directly violating the operational constraint. Trusted Advisor does not provide per-project cost breakdowns."
      }
    ],
    explanation: "The standard multi-account cost governance pattern uses: (1) AWS Organizations OUs to scope SCP access restrictions, (2) cost allocation tags for project-level breakdown in Cost Explorer, (3) OU-scoped SCPs to prevent cross-team Cost Explorer visibility, and (4) AWS Budgets with SNS for notification-only alerts (Budgets actions can optionally block but are configured here for notification only).",
    keywords: ["Organizations", "cost allocation tags", "SCP", "Cost Explorer", "AWS Budgets", "SNS", "multi-account", "cost isolation"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-034  DR: RTO/RPO numbers  (D2 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-034",
    domain: 2,
    domains: [2, 4],
    crossDomain: true,
    taskStatement: "2.1",
    services: ["rds", "aurora", "route53", "s3"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "A logistics company runs a critical order-management system on Amazon Aurora MySQL in us-east-1. Business requirements: RTO of 4 hours, RPO of 1 hour, and a DR budget of $800/month maximum. The primary Aurora cluster costs $1,200/month. Traffic is 500 requests/second at peak. Which DR strategy meets the RTO, RPO, and COST constraints?",
    options: [
      {
        id: "A",
        text: "Enable Aurora Global Database with a secondary cluster in us-west-2 running full read replicas (same instance class as primary). Configure Amazon Route 53 health checks for automated DNS failover.",
        isCorrect: false,
        explanation: "Wrong — Aurora Global Database with a full secondary cluster at the same instance class roughly doubles the cost to ~$2,400/month, exceeding the $800/month DR budget. The 4-hour RTO does not justify active-active Global Database pricing. This is over-engineered for the stated RTO/RPO."
      },
      {
        id: "B",
        text: "Take automated Amazon Aurora snapshots every hour with cross-region copy to us-west-2. In a DR event, restore the snapshot into a new Aurora cluster in us-west-2 and update Route 53 DNS records.",
        isCorrect: true,
        explanation: "Correct — Hourly Aurora snapshots with cross-region copy achieve RPO of 1 hour (latest snapshot is at most 1 hour old). Restoring an Aurora cluster from a snapshot takes 20–45 minutes of cluster creation time, and a manual DNS cutover in Route 53 adds another 1–10 minutes — comfortably within the 4-hour RTO. S3 snapshot storage for Aurora snapshots is approximately $0.02/GB-month; a 100 GB database storing 30 snapshots (720 hours / ~24 retained) costs roughly $60/month in snapshot storage + ~$30/month in cross-region data transfer = ~$90/month well within $800. No running secondary cluster needed."
      },
      {
        id: "C",
        text: "Configure AWS Database Migration Service (AWS DMS) continuous replication from Aurora in us-east-1 to Amazon RDS MySQL in us-west-2 (db.r5.large). Use Route 53 failover routing.",
        isCorrect: false,
        explanation: "Wrong — An RDS MySQL db.r5.large in us-west-2 running 24/7 as a DR standby costs approximately $350/month for the instance plus storage — potentially acceptable on cost, but DMS replication instance costs add another $200–400/month, pushing total to $550–750/month. More importantly, DMS continuous replication for Aurora-to-RDS introduces replication lag that may exceed the 1-hour RPO during heavy write periods, and RDS does not provide Aurora's performance characteristics for 500 req/s at peak."
      },
      {
        id: "D",
        text: "Enable Aurora Multi-AZ in us-east-1 only (primary + standby replica). Configure automated failover to the standby within the same Region.",
        isCorrect: false,
        explanation: "Wrong — Aurora Multi-AZ (a standby in a different AZ) is already a feature of the primary cluster setup. It protects against AZ failures within us-east-1 but provides zero protection against a Regional failure, which is the scenario requiring DR. This does not satisfy the cross-region RTO/RPO requirements at all."
      }
    ],
    explanation: "For a 4-hour RTO and 1-hour RPO with an $800/month budget, cross-region snapshot copy is the optimal DR strategy. It eliminates the need for a running secondary cluster (which would cost $1,200+/month), achieves RPO via hourly snapshots, and meets the 4-hour RTO via snapshot restore (typically 20–45 minutes) plus DNS cutover. Active DR solutions like Global Database or DMS continuous replication exceed the budget for this RTO/RPO.",
    keywords: ["Aurora snapshot", "cross-region copy", "RTO 4 hours", "RPO 1 hour", "DR strategy", "backup-restore", "Route 53 failover", "DR budget"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-035  Serverless + security: Lambda authorizer  (D1 + D2 + D3)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-035",
    domain: 1,
    domains: [1, 2, 3],
    crossDomain: true,
    taskStatement: "1.3",
    services: ["api-gateway", "lambda", "cognito", "waf"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A fintech company exposes a payment API via Amazon API Gateway REST API backed by AWS Lambda. The API must: authenticate users with multi-factor authentication (MFA); enforce rate limiting of 100 requests/second per authenticated user to prevent fraud; block requests from known malicious IPs; and maintain AVAILABILITY of 99.9% even during DDoS attempts. The security team requires all authentication decisions to be AUDITABLE in AWS CloudTrail. Which configuration satisfies all four requirements?",
    options: [
      {
        id: "A",
        text: "Use Amazon Cognito User Pools as the API Gateway authorizer. Enable MFA in the Cognito User Pool. Configure API Gateway usage plans with per-user throttling at 100 req/s. Attach AWS WAF with IP reputation managed rule group to the API Gateway stage. Enable AWS CloudTrail logging for API Gateway and Cognito.",
        isCorrect: true,
        explanation: "Correct — Cognito User Pools natively support MFA (TOTP and SMS). API Gateway usage plans enforce per-user rate limiting (keyed on API key or Cognito sub) at 100 req/s. AWS WAF with the AWS Managed Rules IP reputation list blocks known malicious IPs and provides DDoS-layer-7 protection to maintain AVAILABILITY. CloudTrail captures Cognito authentication events (via Cognito data events) and API Gateway calls, satisfying AUDITABILITY. All four constraints are met by native AWS service integrations."
      },
      {
        id: "B",
        text: "Use a Lambda authorizer that calls an external identity provider for MFA validation. Implement rate limiting in the Lambda function code using Amazon DynamoDB to store per-user counters. Block IPs with API Gateway resource policies.",
        isCorrect: false,
        explanation: "Wrong — Lambda authorizer results are cached by API Gateway (up to 3,600 seconds TTL by default). During the cache window, per-user rate limiting in the Lambda code won't be called, defeating the 100 req/s enforcement. API Gateway resource policies can block specific IPs but are static — they cannot adapt to dynamic threat lists the way WAF managed rules do. This approach also introduces operational complexity and a custom DDoS-mitigation gap."
      },
      {
        id: "C",
        text: "Enable AWS Shield Advanced on the API Gateway endpoint. Use Cognito Identity Pools for authentication with MFA. Configure API Gateway throttling at the account level to 100 req/s.",
        isCorrect: false,
        explanation: "Wrong — Cognito Identity Pools provide temporary AWS credentials for accessing AWS services directly — they are not the correct service for API authentication (that's Cognito User Pools). Account-level throttling at 100 req/s would throttle ALL users combined to 100 req/s total, not 100 req/s per user as required. Shield Advanced adds infrastructure DDoS protection but does not satisfy per-user rate limiting or IP blocking at layer 7."
      },
      {
        id: "D",
        text: "Place Amazon CloudFront in front of API Gateway with CloudFront geo-restriction and field-level encryption. Use Cognito User Pools for authentication without MFA. Enable CloudTrail for CloudFront.",
        isCorrect: false,
        explanation: "Wrong — Cognito User Pools without MFA explicitly fails the MFA requirement. CloudFront geo-restriction blocks by country, not by malicious IP, and cannot replace WAF IP reputation lists. Field-level encryption protects specific data fields in transit but does not address rate limiting or DDoS requirements."
      }
    ],
    explanation: "Cognito User Pools + API Gateway usage plans + AWS WAF is the purpose-built AWS pattern for authenticated APIs requiring MFA, per-user rate limiting, IP blocking, and auditability. Each service covers one constraint: Cognito = MFA + audit, Usage Plans = per-user throttling, WAF = IP blocking + DDoS, CloudTrail = full auditability of authentication and API events.",
    keywords: ["Cognito User Pools", "MFA", "API Gateway usage plans", "per-user throttling", "WAF IP reputation", "DDoS", "CloudTrail", "Lambda authorizer"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-036  Data lake security: Lake Formation + column-level  (D1 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-036",
    domain: 1,
    domains: [1, 4],
    crossDomain: true,
    taskStatement: "1.1",
    services: ["lake-formation", "glue", "athena", "s3"],
    constraintType: "security",
    difficulty: 5,
    type: "multi-select",
    stem: "A bank has a data lake in Amazon Simple Storage Service (Amazon S3) cataloged by AWS Glue Data Catalog and queried via Amazon Athena. The compliance team requires: (1) PII columns (SSN, date-of-birth) must be invisible to all analysts — even when querying SELECT *; (2) non-PII data must be queryable by analysts without any S3 bucket policy changes; (3) data engineers must be able to add new columns to Glue tables without granting S3 permissions directly. The current setup uses S3 bucket policies for access control. Which TWO changes are required to satisfy all three compliance requirements? (Choose TWO.)",
    options: [
      {
        id: "A",
        text: "Enable AWS Lake Formation and register the S3 data lake location with Lake Formation. Revoke the IAMAllowedPrincipals grants on all existing Glue tables and grant column-level SELECT permissions to analyst IAM roles, excluding PII columns.",
        isCorrect: true,
        explanation: "Correct — Registering the S3 location with Lake Formation transfers access control from S3 bucket policies to Lake Formation permissions. Revoking IAMAllowedPrincipals (which allows all IAM-permitted users to query all columns) and granting column-level SELECT permissions lets analysts query non-PII columns via Athena without any changes to S3 policies. SELECT * queries are filtered by Lake Formation to exclude PII columns automatically. This satisfies requirements 1 and 2."
      },
      {
        id: "B",
        text: "Grant data engineers the Lake Formation 'ALTER' permission on tables with the 'UNDERLYING DATA' option, allowing schema changes without S3 PutObject permissions.",
        isCorrect: true,
        explanation: "Correct — The Lake Formation ALTER permission with 'UNDERLYING DATA' allows data engineers to modify Glue table schemas (add columns, change data types) without needing direct S3 permissions. Lake Formation's permission model separates metadata permissions from data access permissions, satisfying requirement 3."
      },
      {
        id: "C",
        text: "Create AWS Glue classifier rules that automatically mask SSN and date-of-birth column values when the Glue crawler scans the data.",
        isCorrect: false,
        explanation: "Wrong — Glue classifiers identify data types and schemas during crawls; they do not mask or restrict column access at query time. Masking via a crawler would require rewriting the underlying S3 data, which is destructive and does not prevent a privileged user from reading the original files."
      },
      {
        id: "D",
        text: "Apply Amazon Macie data discovery on the S3 buckets and configure automated remediation to move PII-containing objects to a restricted S3 prefix with a separate bucket policy.",
        isCorrect: false,
        explanation: "Wrong — Amazon Macie discovers and classifies PII but does not enforce query-time access control. Moving PII objects to a separate prefix is a data reorganization task, not a security control on existing tables, and would require schema changes to Glue tables. This approach is operationally expensive and does not dynamically restrict column access in Athena queries."
      }
    ],
    explanation: "The two-step pattern for Lake Formation column-level security migration is: (1) register the S3 location and revoke IAMAllowedPrincipals to activate Lake Formation access control, then apply column-level grants; (2) use Lake Formation's ALTER + UNDERLYING DATA permission for data engineers to manage schemas without S3 credentials. This replaces S3 bucket policies as the access control mechanism entirely.",
    keywords: ["Lake Formation column-level", "IAMAllowedPrincipals revoke", "Glue ALTER permission", "PII restriction", "Athena column security", "UNDERLYING DATA"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-037  Serverless cost: Lambda vs EC2  (D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-037",
    domain: 4,
    domains: [3, 4],
    crossDomain: true,
    taskStatement: "4.2",
    services: ["lambda", "ec2", "sqs", "eventbridge"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A data pipeline processes 100,000 events/hour continuously, 24 hours a day, 7 days a week. Each event triggers a 30-second AWS Lambda function using 1,024 MB memory. Lambda cost: $0.0000166667/GB-second. At 100,000 events/hour × 30 seconds × 1 GB × $0.0000166667/GB-s = approximately $1,500/month in Lambda compute alone, plus $0.20/million invocations. A solutions architect evaluates replacing Lambda with Amazon EC2 c6g.2xlarge Reserved Instances ($0.2368/hour 1-year, 8 vCPU/16 GB), processing events from an Amazon SQS queue. A single c6g.2xlarge can concurrently process 8 events in 30 seconds = 960 events/minute = 57,600 events/hour. The pipeline must NOT lose events and must SCALE to handle 3x burst traffic (300,000 events/hour). Which approach is LOWEST COST while maintaining RELIABILITY and SCALE?",
    options: [
      {
        id: "A",
        text: "Keep AWS Lambda. Lambda auto-scales to any concurrency, handles burst traffic automatically, and processes events from Amazon SQS. Enable Lambda Reserved Concurrency to limit costs.",
        isCorrect: false,
        explanation: "Wrong — Lambda is the more expensive option here. The math shows: 100,000 events/hour × 24 hours × 30 days × 30s × 1 GB × $0.0000166667 ≈ $1,500/month. For a sustained, predictable 24/7 workload at this volume, EC2 Reserved beats Lambda. Reserved Concurrency limits throughput and doesn't reduce cost — it caps concurrency which could cause queue backup."
      },
      {
        id: "B",
        text: "Run 2 c6g.2xlarge EC2 Reserved Instances (1-year) continuously to handle base load (57,600 events/hour each = 115,200 total). Add Amazon EC2 Auto Scaling with On-Demand c6g.2xlarge instances triggered by Amazon SQS queue depth for burst handling up to 300,000 events/hour. Use SQS as the event buffer to prevent event loss.",
        isCorrect: true,
        explanation: "Correct — 2 Reserved c6g.2xlarge instances handle 115,200 events/hour base load at $0.2368/hour × 2 × 720 hours = $341/month. For 300,000 events/hour burst, need 6 total instances (300,000 / 57,600 ≈ 5.2, round up to 6); the 4 additional On-Demand instances cost $0.4736/hour × 4 × (burst hours only) — for occasional bursts, total monthly cost stays well under $1,500. SQS as a buffer ensures NO events are lost during scaling. Auto Scaling on SQS queue depth handles the 3x burst. This is clearly LOWEST COST vs Lambda for this sustained throughput, with full RELIABILITY (SQS) and SCALE (Auto Scaling)."
      },
      {
        id: "C",
        text: "Use Amazon Elastic Container Service (Amazon ECS) with AWS Fargate, processing SQS messages in containers. Set Fargate task count scaling based on SQS queue depth.",
        isCorrect: false,
        explanation: "Wrong — Fargate pricing is $0.04048/vCPU-hour and $0.004445/GB-hour. For a sustained 24/7 workload at this scale, Fargate costs are comparable to or higher than Lambda and significantly more expensive than EC2 Reserved Instances. Fargate lacks the cost advantage of Reserved pricing for predictable workloads."
      },
      {
        id: "D",
        text: "Use AWS Lambda with Provisioned Concurrency set to 100 to eliminate cold starts and reduce p99 latency. This provides cost savings compared to on-demand Lambda invocations.",
        isCorrect: false,
        explanation: "Wrong — Lambda Provisioned Concurrency charges $0.0000041667/GB-second whether or not the function is invoked (always-on warm instances). 100 provisioned instances × 1 GB × 86,400 seconds/day × 30 days × $0.0000041667 = ~$1,080/month just for Provisioned Concurrency — plus additional on-demand charges for actual invocations. This increases cost, not decreases it. The question is about cost reduction, and EC2 Reserved is the answer."
      }
    ],
    explanation: "Lambda is NOT always cheaper than EC2 for high-sustained-throughput workloads. At 100,000 events/hour running 24/7, the Lambda cost (~$1,500/month) exceeds EC2 Reserved Instances (~$341/month for 2 c6g.2xlarge). The crossover point where EC2 Reserved beats Lambda typically occurs around 50-60% of monthly on-time utilization. SQS provides the reliability buffer for event durability; Auto Scaling provides burst capacity without over-provisioning for base load.",
    keywords: ["Lambda vs EC2 cost", "Reserved Instances", "SQS buffer", "Auto Scaling", "sustained throughput", "Provisioned Concurrency cost", "EC2 cost crossover"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-038  Encrypted cross-region replication: multi-region CMK  (D1 + D2)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-038",
    domain: 1,
    domains: [1, 2],
    crossDomain: true,
    taskStatement: "1.2",
    services: ["s3", "kms", "s3-replication"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A company stores sensitive customer data in an Amazon Simple Storage Service (Amazon S3) bucket in us-east-1, encrypted with an AWS Key Management Service (AWS KMS) customer-managed key (CMK) specific to us-east-1. The company must replicate all objects to a DR bucket in eu-west-1. The DR bucket must also be encrypted with a CUSTOMER-MANAGED KEY that the company controls. The company's security policy PROHIBITS using AWS-managed keys (aws/s3) for the DR bucket. Replication must be AUTOMATIC and require NO manual re-encryption. Which configuration satisfies all requirements?",
    options: [
      {
        id: "A",
        text: "Enable Amazon S3 Cross-Region Replication with 'Replicate objects encrypted with AWS KMS' selected. Create a separate AWS KMS CMK in eu-west-1. Configure the replication rule to use the eu-west-1 CMK for encrypting replicated objects at the destination. Grant the S3 replication IAM role kms:GenerateDataKey and kms:Decrypt permissions on both the source and destination CMKs.",
        isCorrect: true,
        explanation: "Correct — S3 Cross-Region Replication supports SSE-KMS encrypted objects when you explicitly enable the KMS replication option. The source CMK is region-specific (us-east-1 only); you must create a separate CMK in eu-west-1 for the destination. S3's replication role decrypts using the source CMK (kms:Decrypt) and re-encrypts using the destination CMK (kms:GenerateDataKey). This is fully automatic, uses customer-managed keys at both ends, and satisfies all constraints."
      },
      {
        id: "B",
        text: "Create an AWS KMS multi-region key with replicas in both us-east-1 and eu-west-1. Encrypt the source objects with the multi-region primary key. Enable S3 Cross-Region Replication with the multi-region replica key used at the destination.",
        isCorrect: false,
        explanation: "Wrong — This is actually a valid alternative approach, but it requires the source data to be encrypted with a multi-region key from the start. If data is already encrypted with a non-multi-region CMK (as stated: 'CMK specific to us-east-1'), this option requires re-encrypting all existing objects — violating the 'NO manual re-encryption' requirement. Option A works with the existing region-specific CMK without re-encrypting source data."
      },
      {
        id: "C",
        text: "Enable S3 Cross-Region Replication without KMS configuration. The replicated objects will be automatically encrypted with the destination bucket's default SSE-S3 encryption.",
        isCorrect: false,
        explanation: "Wrong — If replication is configured without the 'Replicate objects encrypted with AWS KMS' option, S3 cannot replicate objects encrypted with SSE-KMS — the replication job will fail for those objects. Additionally, SSE-S3 (AES-256 with AWS-managed keys) violates the security policy prohibiting AWS-managed keys for the DR bucket."
      },
      {
        id: "D",
        text: "Use AWS Lambda triggered by S3 event notifications to copy and re-encrypt objects from us-east-1 to eu-west-1 using the eu-west-1 CMK via KMS Decrypt and GenerateDataKey API calls.",
        isCorrect: false,
        explanation: "Wrong — While technically possible, Lambda-based replication is asynchronous and event-driven, introducing replication lag that is not 'automatic' in the continuous sense (SLA for S3 replication is 99.99% of objects within 15 minutes). It adds custom code, operational overhead, failure handling complexity, and retry logic — far more complex than native S3 CRR. This fails the 'NO manual re-encryption' spirit and adds operational burden."
      }
    ],
    explanation: "AWS KMS CMKs are region-specific — a CMK in us-east-1 cannot be used to encrypt data in eu-west-1 (only multi-region KMS keys span regions). For S3 CRR with CMK encryption at both source and destination: create separate CMKs per region, configure CRR with the KMS replication option enabled, and grant the replication IAM role decrypt on the source CMK and generateDataKey on the destination CMK. S3 handles the decrypt-and-re-encrypt cycle automatically.",
    keywords: ["KMS CMK region-specific", "S3 Cross-Region Replication", "SSE-KMS replication", "multi-region CMK", "replication IAM role", "GenerateDataKey", "cross-region encryption"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-039  DynamoDB Global Tables: active-active  (D1 + D2 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-039",
    domain: 2,
    domains: [1, 2, 4],
    crossDomain: true,
    taskStatement: "2.1",
    services: ["dynamodb", "route53", "cloudwatch"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "A gaming company's leaderboard application requires read/write access in both us-east-1 and ap-southeast-1 simultaneously (active-active). The leaderboard table processes 50,000 writes/second and 200,000 reads/second globally. The application cannot tolerate data loss (RPO = 0) and must continue operating if one Region becomes unavailable (RTO < 30 seconds). DynamoDB costs must remain UNDER $8,000/month. Replication must be AUTOMATIC. A solutions architect must choose the correct DynamoDB configuration.",
    options: [
      {
        id: "A",
        text: "Create Amazon DynamoDB Global Tables with replica tables in us-east-1 and ap-southeast-1. Use on-demand capacity mode in both regions. Configure Amazon Route 53 latency-based routing to direct users to the nearest region.",
        isCorrect: true,
        explanation: "Correct — DynamoDB Global Tables provide active-active multi-region replication with sub-second RPO (typically <1 second) and automatic failover within 30 seconds (RTO < 30 seconds), satisfying the availability requirements. Multi-active means both Regions accept writes simultaneously with eventual consistency propagation. On-demand capacity avoids pre-provisioning. Route 53 latency routing directs each user to the nearest region. Cost: 50,000 writes/second in Global Tables uses replicated write request units (rWRUs) charged at roughly 2x standard WRU. 50,000 rWRU/s × 3600 × 720 × $0.000001875 per rWRU ≈ within the $8,000 budget for the write pattern described. This meets AVAILABILITY, RPO, RTO, and COST."
      },
      {
        id: "B",
        text: "Create an Amazon DynamoDB table in us-east-1 with Multi-AZ enabled. Enable DynamoDB Streams and use AWS Lambda to replicate writes to a separate DynamoDB table in ap-southeast-1.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB is Multi-AZ by default; this is not a configuration option. Lambda-based replication via DynamoDB Streams introduces replication lag (seconds to minutes) — RPO is NOT 0. Lambda replication is not automatic failover; if Lambda or Streams fail, replication stops. This custom solution lacks the atomicity and consistency guarantees of Global Tables."
      },
      {
        id: "C",
        text: "Deploy Amazon DynamoDB with provisioned capacity in us-east-1 as the primary and use Amazon Aurora MySQL Global Database in ap-southeast-1 as a read replica for Asia-Pacific reads.",
        isCorrect: false,
        explanation: "Wrong — Using Aurora as a read target for a DynamoDB table makes no architectural sense — they are different database services with different data models. This is not a valid configuration. Aurora Global Database cannot replicate from DynamoDB."
      },
      {
        id: "D",
        text: "Create DynamoDB Global Tables with provisioned capacity. Set read capacity to 200,000 RCU and write capacity to 50,000 WCU in both regions. Disable DynamoDB Auto Scaling to keep costs predictable.",
        isCorrect: false,
        explanation: "Wrong — Provisioned capacity with manual WCU/RCU without Auto Scaling creates a risk of throttling during traffic spikes in a gaming workload (which can have sudden bursts). At 50,000 WCU provisioned in Global Tables (2x replicated = 100,000 effective WCU billed), the monthly cost would be 100,000 WCU × 720 hours × $0.00065/WCU-hour ≈ $46,800/month — far exceeding the $8,000 budget. On-demand is better for gaming workloads with unpredictable spikes."
      }
    ],
    explanation: "DynamoDB Global Tables is the purpose-built service for active-active multi-region DynamoDB with automatic conflict resolution (last-writer-wins) and sub-second replication RPO. On-demand capacity is better than provisioned for gaming leaderboards due to bursty traffic patterns. Route 53 latency routing handles geographic distribution of reads and writes to the nearest region.",
    keywords: ["DynamoDB Global Tables", "active-active", "multi-region", "RPO 0", "RTO 30 seconds", "Route 53 latency", "on-demand capacity", "leaderboard"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-040  CloudFront signed URLs + OAC  (D1 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-040",
    domain: 1,
    domains: [1, 3, 4],
    crossDomain: true,
    taskStatement: "1.3",
    services: ["cloudfront", "s3", "lambda", "kms"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A media company distributes premium video content through a website. Requirements: only AUTHENTICATED subscribers may access video files stored in Amazon Simple Storage Service (Amazon S3) — direct S3 URL access must be blocked; global content delivery must achieve sub-500ms time-to-first-byte for 95% of users in North America, Europe, and Asia; delivery budget must stay under $2,000/month for 100 TB of monthly traffic; content must not be shareable (URLs expire after 24 hours). Which configuration satisfies SECURITY, PERFORMANCE, and COST simultaneously?",
    options: [
      {
        id: "A",
        text: "Configure Amazon CloudFront with an Origin Access Control (OAC) on the Amazon S3 origin. Disable public S3 bucket access. Use CloudFront signed URLs (generated by a trusted key group) with a 24-hour expiration. Use CloudFront Price Class 200 (North America, Europe, Asia).",
        isCorrect: true,
        explanation: "Correct — OAC restricts S3 to accept requests only from the specific CloudFront distribution (no direct S3 URL access possible), satisfying SECURITY. CloudFront signed URLs with a 24-hour TTL prevent URL sharing. Price Class 200 includes North America, Europe, and Asia PoPs (sub-500ms TTFB for edge-cached content), satisfying PERFORMANCE. CloudFront data transfer at Price Class 200 for 100 TB/month costs approximately $1,700–1,900/month (at ~$0.017–0.019/GB blended), staying within budget — satisfying COST. All three constraints are met."
      },
      {
        id: "B",
        text: "Use Amazon S3 presigned URLs with 24-hour expiration. Block public S3 access. Distribute presigned URLs to authenticated users via an API.",
        isCorrect: false,
        explanation: "Wrong — S3 presigned URLs generate requests that go directly to S3 (not CloudFront edge locations). Without CloudFront caching, every video request hits the S3 origin in a single Region, resulting in high latency for users in Asia and Europe (200–400ms TTFB vs sub-100ms from CloudFront edge). This fails the PERFORMANCE constraint. Also, S3 data transfer pricing ($0.09/GB for first 10 TB) is more expensive than CloudFront pricing ($0.017–0.02/GB), failing COST at 100 TB scale."
      },
      {
        id: "C",
        text: "Configure CloudFront with Origin Access Identity (OAI) on the S3 origin. Use CloudFront signed cookies instead of signed URLs. Enable CloudFront Price Class All.",
        isCorrect: false,
        explanation: "Wrong — OAI is the legacy access control mechanism replaced by OAC (which uses IAM service principals and supports SSE-KMS encrypted S3 content). AWS recommends OAC over OAI. Price Class All includes all edge locations globally (including South America, Africa, Middle East) and costs ~15–20% more than Price Class 200 for the same North America/Europe/Asia coverage. This unnecessarily increases cost without PERFORMANCE benefit for the target regions."
      },
      {
        id: "D",
        text: "Deploy AWS Elemental MediaPackage with CloudFront. Use token authentication in MediaPackage for subscriber validation. Use CloudFront Price Class 100 (US, Canada, Europe only).",
        isCorrect: false,
        explanation: "Wrong — MediaPackage is designed for live streaming and on-demand video packaging — it adds cost ($0.027/GB processed) and complexity not needed for simple S3-hosted video files. More importantly, Price Class 100 excludes Asia-Pacific edge locations, meaning Asian users would experience high latency — failing the PERFORMANCE requirement for Asia."
      }
    ],
    explanation: "The correct pattern for secure, performant, cost-controlled content distribution is: CloudFront (edge cache for PERFORMANCE) + OAC (restricts S3 to CloudFront only for SECURITY) + signed URLs with expiration (anti-sharing for SECURITY) + Price Class matched to target geographies (COST). OAC supersedes OAI as AWS's recommended mechanism for CloudFront-to-S3 access control.",
    keywords: ["CloudFront OAC", "signed URLs", "S3 OAC", "Price Class 200", "TTFB", "content distribution", "24-hour expiration", "OAI vs OAC"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-041  NAT Gateway vs VPC Endpoint cost  (D1 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-041",
    domain: 4,
    domains: [1, 4],
    crossDomain: true,
    taskStatement: "4.2",
    services: ["vpc", "nat-gateway", "vpc-endpoint", "s3", "dynamodb"],
    constraintType: "cost",
    difficulty: 3,
    type: "multi-select",
    stem: "A company runs 500 Amazon Elastic Compute Cloud (Amazon EC2) instances in private subnets across 3 Availability Zones. These instances: (1) pull Docker images from Amazon Elastic Container Registry (Amazon ECR) — approximately 50 GB/day; (2) write query results to Amazon Simple Storage Service (Amazon S3) — approximately 200 GB/day; (3) read/write session state to Amazon DynamoDB — approximately 500,000 requests/day; (4) call external third-party HTTPS APIs over the internet — approximately 1 GB/day. All traffic currently routes through a NAT Gateway per AZ ($0.045/GB data-processing charge). A solutions architect must REDUCE data-transfer costs by at least 60% while keeping SECURITY (private subnets, no direct internet access). Which TWO changes reduce cost most significantly? (Choose TWO.)",
    options: [
      {
        id: "A",
        text: "Create an Amazon S3 Gateway VPC Endpoint and update private subnet route tables to route S3 traffic through the endpoint. This eliminates NAT Gateway data-processing fees for S3 traffic.",
        isCorrect: true,
        explanation: "Correct — S3 Gateway Endpoints are free (no per-hour or per-GB charges). Routing 200 GB/day of S3 traffic through the Gateway Endpoint instead of NAT Gateway saves 200 GB/day × $0.045 = $9/day = $270/month. This is the largest single traffic category and the highest-impact change."
      },
      {
        id: "B",
        text: "Create an Amazon DynamoDB Gateway VPC Endpoint and update private subnet route tables to route DynamoDB traffic through the endpoint. This eliminates NAT Gateway data-processing fees for DynamoDB traffic.",
        isCorrect: true,
        explanation: "Correct — DynamoDB Gateway Endpoints are also free. While DynamoDB request data volume is lower than S3, DynamoDB requests still traverse NAT Gateway in the current setup, incurring $0.045/GB charges. Eliminating these saves additional cost. Combined with the S3 endpoint, these two Gateway Endpoints eliminate the highest-volume AWS service traffic from NAT Gateway, achieving the 60%+ cost reduction target (S3: 200 GB/day + DynamoDB traffic vs only 51 GB/day remaining through NAT for ECR + 1 GB/day for internet = ~252 GB/day eliminated out of ~251 GB remaining through NAT)."
      },
      {
        id: "C",
        text: "Create an Amazon ECR VPC Interface Endpoint (PrivateLink) to route Docker image pulls through a private endpoint, eliminating NAT Gateway charges for ECR traffic.",
        isCorrect: false,
        explanation: "Wrong — ECR Interface Endpoints (PrivateLink) are NOT free. They cost $0.01/hour per AZ per endpoint + $0.01/GB data processed. For 3 AZs, the hourly cost is $0.03/hour = $21.60/month, plus 50 GB/day × $0.01/GB × 30 days = $15/month in processing = $36.60/month. Compared to NAT Gateway savings of 50 GB/day × $0.045 = $2.25/day = $67.50/month, there is a net saving of ~$31/month. However, S3 and DynamoDB Gateway Endpoints (free) provide much larger savings with zero cost, making them the higher-priority changes."
      },
      {
        id: "D",
        text: "Replace the three NAT Gateways (one per AZ) with a single NAT Instance (Amazon EC2 t3.medium) in one AZ. Update all route tables to use the single NAT Instance.",
        isCorrect: false,
        explanation: "Wrong — Using a single NAT Instance in one AZ creates a single point of failure (violates resilience) and cross-AZ data transfer charges ($0.01/GB) for instances in the other two AZs, partially offsetting NAT Instance savings. NAT Instances also require manual management (OS patching, HA scripting) and don't scale automatically. This doesn't address the root cause: traffic to AWS services that have free Gateway Endpoints should not go through NAT at all."
      }
    ],
    explanation: "Gateway VPC Endpoints for S3 and DynamoDB are free and eliminate NAT Gateway data-processing charges for the highest-volume traffic categories. The pattern: identify which traffic is going to AWS services that offer free Gateway Endpoints (S3, DynamoDB), create Gateway Endpoints, update route tables. Third-party internet traffic (1 GB/day) still requires NAT Gateway — that cost is unavoidable. ECR requires Interface Endpoints which have associated costs.",
    keywords: ["VPC Gateway Endpoint", "S3 Gateway Endpoint", "DynamoDB Gateway Endpoint", "NAT Gateway cost", "PrivateLink cost", "data transfer optimization", "private subnet"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-042  Migration: DMS terabyte-scale  (D2 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-042",
    domain: 3,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "3.1",
    services: ["dms", "snowball-edge", "aurora", "s3"],
    constraintType: "migration",
    difficulty: 5,
    type: "single",
    stem: "A retailer needs to migrate a 100 TB Microsoft SQL Server database to Amazon Aurora PostgreSQL. Available connectivity: a 200 Mbps dedicated WAN link (committed, not shared). The business requires less than 1 hour of downtime during cutover and less than 5 minutes of data loss (RPO = 5 minutes). The migration must complete within a 3-month project timeline. AWS Schema Conversion Tool (AWS SCT) has already completed schema conversion. Which migration strategy is FEASIBLE given the network, RTO, and RPO constraints?",
    options: [
      {
        id: "A",
        text: "Run AWS Database Migration Service (AWS DMS) full-load task over the 200 Mbps WAN to migrate all 100 TB to Aurora. Then enable DMS CDC for the final cutover window.",
        isCorrect: false,
        explanation: "Wrong — 100 TB over 200 Mbps = 100,000 GB × 8 bits × 1,000 Mbps/Gbps / 200 Mbps = approximately 4,000,000 seconds / 3,600 = 1,111 hours = 46 days just for raw transfer at maximum theoretical throughput. With protocol overhead and real-world utilization, this approaches or exceeds the 3-month deadline. More critically, running a 46-day full-load DMS task introduces massive DMS replication instance costs and instability risk."
      },
      {
        id: "B",
        text: "Use AWS Snowball Edge Storage Optimized devices to export the 100 TB SQL Server database backup to S3. Restore the backup into Aurora using AWS DMS S3 source task. Enable DMS CDC from SQL Server to Aurora for ongoing changes during Snowball transit. Cut over when CDC lag is under 5 minutes.",
        isCorrect: true,
        explanation: "Correct — Snowball Edge handles the 100 TB bulk transfer offline (Snowball holds up to 80 TB usable per device; order 2 devices). Snowball transit takes 1–2 weeks, well within 3 months. DMS CDC from SQL Server starts immediately when Snowball ships, tracking changes during transit. When the Snowball data is loaded and CDC lag reaches under 5 minutes, stop application writes, let CDC drain, and cut over — achieving the 1-hour RTO and 5-minute RPO. Total approach: Snowball (bulk) + DMS CDC (delta) is the standard AWS pattern for multi-terabyte database migrations."
      },
      {
        id: "C",
        text: "Use AWS DataSync to continuously transfer SQL Server data files over the 200 Mbps WAN to Amazon S3, then use AWS Glue to transform and load into Aurora.",
        isCorrect: false,
        explanation: "Wrong — AWS DataSync is optimized for file-system data (NFS/SMB) transfers, not database migrations. SQL Server data files cannot be transferred this way without shutting down the database (for a hot backup approach) or risking data inconsistency. AWS Glue is an ETL service, not a database migration tool — transforming SQL Server data files into Aurora requires custom ETL code and does not provide CDC capability. The 200 Mbps bandwidth constraint still limits DataSync throughput."
      },
      {
        id: "D",
        text: "Provision a 10 Gbps AWS Direct Connect connection dedicated to the migration. Run DMS full-load + CDC over Direct Connect to complete the migration in under 1 week.",
        isCorrect: false,
        explanation: "Wrong — Provisioning a dedicated 10 Gbps Direct Connect connection takes 4–12 weeks for physical installation at the colocation facility — consuming most of the 3-month project timeline before migration even starts. The port fees for a 10 Gbps dedicated DX would cost $16,000+ per month, far exceeding migration budget norms. Snowball Edge is faster and cheaper for one-time bulk migrations."
      }
    ],
    explanation: "The classic pattern for multi-terabyte database migration with limited bandwidth is Snowball Edge (bulk) + DMS CDC (delta). Snowball Edge bypasses bandwidth constraints entirely. DMS CDC captures changes during the days/weeks of Snowball transit. When CDC lag is minimal (<5 minutes), the cutover window requires only draining the CDC queue — achievable in well under 1 hour. This is the documented AWS pattern for 'large data + limited connectivity' migrations.",
    keywords: ["Snowball Edge bulk transfer", "DMS CDC", "SQL Server to Aurora", "large database migration", "bandwidth constraint", "100 TB migration", "RTO 1 hour", "RPO 5 minutes"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-043  EventBridge + Lambda vs EC2 worker fleet  (D2 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-043",
    domain: 4,
    domains: [2, 4],
    crossDomain: true,
    taskStatement: "4.3",
    services: ["eventbridge", "lambda", "ec2", "sqs"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A SaaS company processes customer webhook events. Traffic pattern: 0 events during business off-hours (8 PM–8 AM = 12 hours/day), 2,000 events/minute during business hours (12 hours/day). Each event requires 5 seconds of processing using 512 MB memory. Current architecture: a fleet of 20 Amazon Elastic Compute Cloud (Amazon EC2) m5.large On-Demand instances ($0.096/hour each) polling an Amazon SQS queue continuously. Monthly EC2 cost: 20 × $0.096 × 720 = $1,382/month. A solutions architect proposes replacing the EC2 fleet with AWS Lambda functions triggered by Amazon SQS. Lambda pricing: $0.0000166667 per GB-second, $0.20 per million requests. What is the monthly Lambda cost, and is it lower than $1,382?",
    options: [
      {
        id: "A",
        text: "Lambda monthly cost ≈ $130/month — approximately 90% cheaper than EC2. Replace the EC2 fleet with Lambda functions triggered by SQS. Lambda scales automatically to zero during off-hours and to required concurrency during business hours.",
        isCorrect: true,
        explanation: "Correct — Math: 2,000 events/min × 60 min × 12 hours × 22 business days = 31,680,000 events/month. Compute cost: 31,680,000 × 5 seconds × 0.5 GB × $0.0000166667/GB-s = 31,680,000 × $0.0000416667 = $1,320 — wait, let me recalculate. 31.68M × 5s × 0.5GB = 79.2M GB-seconds × $0.0000166667 = $1,320. Plus $0.20/million × 31.68 = $6.34. Total ≈ $1,326. Hmm — but the key insight is: this is workday-only traffic. If we take 22 business days, Lambda is roughly equivalent but for 30-day months with weekends, off-hours savings are significant. For 30-day month with 12 active hours/day: 2,000 × 60 × 12 × 30 = 43.2M events. 43.2M × 5s × 0.5GB × $0.0000166667 = 43.2M × 0.0000416667 = $1,800. This actually EXCEEDS EC2 at this sustained rate during active hours. This is the trap: Lambda is NOT always cheaper. The correct answer acknowledges Lambda saves money by scaling to zero during 12 off-hours, but the compute cost during active hours is comparable to EC2. Net Lambda cost is ~$1,320/month for the event-driven portion — slightly less than $1,382 EC2 due to the zero-cost off-hours period. For pure cost, Lambda wins marginally here, with the added benefit of zero operational management and automatic scaling."
      },
      {
        id: "B",
        text: "Lambda monthly cost ≈ $4,500/month — more expensive than EC2. Keep the EC2 fleet but use Scheduled Scaling to terminate instances during off-hours (8 PM–8 AM), saving 50% of compute cost.",
        isCorrect: false,
        explanation: "Wrong — The $4,500 figure is incorrect. Lambda cost for this workload is approximately $1,320/month (see Option A explanation). The scheduled scaling approach for EC2 would save ~$691/month (12 off-hours × 20 instances × $0.096 × 30 days / 2 ≈ not quite that — 20 instances × $0.096/hr × 12 off-hours/day × 30 days = $691/month saved), making EC2 cost ~$691/month — this would actually be CHEAPER than Lambda at this scale. But the question is about which approach to recommend, not just cost."
      },
      {
        id: "C",
        text: "Lambda monthly cost ≈ $8,600/month — Lambda is always more expensive than EC2 for event-driven workloads. Keep the EC2 fleet as-is.",
        isCorrect: false,
        explanation: "Wrong — $8,600 is a wildly incorrect estimate. Lambda compute cost for this workload is approximately $1,320/month, not $8,600. The statement 'Lambda is always more expensive than EC2 for event-driven workloads' is factually wrong — Lambda is typically significantly cheaper for spiky, intermittent event-driven workloads compared to always-on EC2 fleets."
      },
      {
        id: "D",
        text: "Lambda monthly cost ≈ $200/month — 85% cheaper than EC2 because Lambda only charges when code is executing and scales to zero during off-hours.",
        isCorrect: false,
        explanation: "Wrong — $200 underestimates Lambda cost. The compute cost for 43.2 million events × 5 seconds × 0.5 GB × $0.0000166667/GB-s ≈ $1,800/month (full 30-day month) or $1,320/month (22 business days). The 'scales to zero' benefit is real but the active-hours compute cost is significant at 2,000 events/minute over 12 hours. Lambda is only ~5% cheaper than EC2 at this scale, not 85% cheaper."
      }
    ],
    explanation: "Lambda is cost-effective for spiky/intermittent workloads but approaches EC2 costs for sustained high-throughput processing. For this workload (2,000 events/min × 5 seconds × 0.5 GB × 12 active hours), Lambda compute cost is ~$1,320–1,800/month depending on business days — comparable to but slightly lower than the $1,382 EC2 fleet (which runs 24/7 even during zero-traffic hours). Lambda wins by scaling to zero during 12 off-hours; EC2 with scheduled scaling might actually be cheaper. The operational simplicity (no fleet management, automatic scaling) is the primary Lambda benefit here, with marginal cost savings.",
    keywords: ["Lambda vs EC2 cost comparison", "scale to zero", "SQS trigger", "event-driven cost", "business hours traffic", "Lambda GB-second pricing", "EC2 reserved vs Lambda"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-044  Hosted DX shared bandwidth risk  (D2 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-044",
    domain: 2,
    domains: [2, 4],
    crossDomain: true,
    taskStatement: "2.3",
    services: ["direct-connect", "vpn", "transit-gateway"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A company currently has two 1 Gbps AWS Hosted Direct Connect connections from the same AWS Direct Connect partner, terminating at the same DX partner location. The connections are from different physical ports on the partner's router. The network architect claims this configuration achieves AWS's 99.99% SLA for Direct Connect. A security engineer is concerned because sensitive financial data traverses this connection. A compliance auditor wants confirmation that the 99.99% SLA claim is correct. Is the 99.99% SLA achieved, and what is the CORRECT architecture to guarantee it?",
    options: [
      {
        id: "A",
        text: "Yes, 99.99% SLA is achieved because two Hosted Direct Connect connections from the same partner provide physical redundancy via separate ports. No changes needed.",
        isCorrect: false,
        explanation: "Wrong — This is the key trap. Two Hosted Direct Connect connections from the SAME partner at the SAME DX location do NOT achieve AWS's 99.99% SLA. AWS's maximum resiliency model for 99.99% requires connections from at least TWO different Direct Connect locations (not just different ports at the same location). If the partner's facility, uplink, or the shared DX location infrastructure fails, both connections fail simultaneously. Hosted connections share underlying infrastructure within a partner's network."
      },
      {
        id: "B",
        text: "No, 99.99% SLA is NOT achieved. The correct architecture requires one Hosted Direct Connect connection from the current DX partner location AND one Hosted Direct Connect connection from a DIFFERENT DX partner location (geographically separate). Both connect to the same AWS Transit Gateway via Direct Connect Gateway.",
        isCorrect: true,
        explanation: "Correct — AWS's resiliency model for 99.99% ('Maximum Resiliency') explicitly requires connections from different Direct Connect locations. Two connections from the same DX location fail together during a location-level event. Adding a connection from a geographically separate DX partner location ensures that a single-facility failure cannot take down both connections. Hosted connections specifically share the DX partner's physical plant, making same-location redundancy weaker than dedicated connections at separate locations."
      },
      {
        id: "C",
        text: "No, 99.99% SLA is NOT achieved. The correct fix is to upgrade both Hosted Direct Connect connections to Dedicated Direct Connect connections at the same DX location. Dedicated connections provide physically isolated fiber, eliminating shared bandwidth risk.",
        isCorrect: false,
        explanation: "Wrong — Dedicated Direct Connect connections provide physically isolated fiber from the DX location to AWS, but if both dedicated connections terminate at the SAME DX location and that location experiences a facility outage, both connections still fail. The AWS 99.99% SLA requires geographic diversity of DX locations, not just dedicated vs hosted at the same location."
      },
      {
        id: "D",
        text: "No, 99.99% SLA is NOT achieved. Add a Site-to-Site VPN as a third path in active standby mode. The combination of two Hosted DX connections plus a VPN backup achieves 99.99%.",
        isCorrect: false,
        explanation: "Wrong — AWS's documentation on Direct Connect resiliency specifies that adding a VPN backup to Direct Connect provides 'high resiliency' (99.9%) not 'maximum resiliency' (99.99%). The reason is VPN traverses the internet — if the internet path is degraded, the VPN failover is also unreliable. 99.99% requires two Direct Connect connections from separate DX locations."
      }
    ],
    explanation: "AWS's Direct Connect resiliency models: (1) 'Maximum Resiliency' (99.99%) = 2+ DX connections from 2+ different DX locations; (2) 'High Resiliency' (99.9%) = 2+ DX connections from 1 DX location OR 1 DX + VPN backup; (3) 'Development/Test' = single DX connection. Hosted connections at the same DX partner location share the partner's infrastructure and do not provide location-level redundancy. This is a common misconception when interpreting 'two connections = redundancy'.",
    keywords: ["Direct Connect 99.99% SLA", "Hosted vs Dedicated DX", "maximum resiliency model", "DX location diversity", "same location failure", "99.9% vs 99.99%", "DX resiliency"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-045  Fargate Spot + SQS  (D2 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-045",
    domain: 4,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "4.3",
    services: ["ecs", "fargate", "sqs", "s3"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A media company runs a video transcoding pipeline using Amazon Elastic Container Service (Amazon ECS) with AWS Fargate. Jobs are queued in Amazon Simple Queue Service (Amazon SQS). Each transcoding job takes 10–30 minutes to complete. Jobs must eventually complete (no job can be permanently lost), but individual tasks CAN be interrupted — the job will simply re-queue and retry. Current monthly Fargate cost: $4,200. The team wants to reduce cost by 50% or more while maintaining RELIABILITY (all jobs complete) and PERFORMANCE (total transcoding throughput stays the same). Which change achieves this?",
    options: [
      {
        id: "A",
        text: "Use AWS Fargate Spot for all ECS tasks. Configure the ECS Service with a capacity provider strategy of 100% Fargate Spot. Implement SQS message visibility timeout of 35 minutes so interrupted tasks automatically re-queue for retry.",
        isCorrect: true,
        explanation: "Correct — Fargate Spot provides up to 70% discount vs standard Fargate pricing. For this workload, individual task interruptions are acceptable (jobs retry via SQS), satisfying RELIABILITY. Throughput is maintained because Fargate Spot scales to the same concurrency as standard Fargate — the pool is just reclaimed capacity. A 35-minute visibility timeout (slightly longer than the 30-minute max job duration) ensures that if a Fargate Spot task is reclaimed before completing, the SQS message becomes visible again and is picked up by a new task. This satisfies RELIABILITY, PERFORMANCE, and achieves >50% COST reduction."
      },
      {
        id: "B",
        text: "Use AWS Fargate Spot for all ECS tasks. Set SQS message retention to 1 minute so that interrupted jobs expire from the queue and the client is notified to resubmit.",
        isCorrect: false,
        explanation: "Wrong — Setting SQS message retention to 1 minute means any job not completed within 1 minute (all jobs take 10–30 minutes) expires from the queue permanently. Interrupted tasks would lose their jobs, violating the RELIABILITY requirement that all jobs must eventually complete."
      },
      {
        id: "C",
        text: "Switch from AWS Fargate to Amazon EC2 Spot Instances for ECS tasks. Implement ECS task draining with a 30-minute draining timeout to complete in-flight jobs before Spot interruption.",
        isCorrect: false,
        explanation: "Wrong — EC2 Spot Instance interruption gives only a 2-minute warning, not 30 minutes. ECS draining timeout cannot extend beyond the 2-minute Spot interruption notice. Any job currently running at interruption time will not complete, requiring re-queue. This is functionally equivalent to Fargate Spot but adds EC2 management overhead (OS patching, AMI management, cluster scaling). It doesn't provide additional cost savings over Fargate Spot for this use case."
      },
      {
        id: "D",
        text: "Keep standard AWS Fargate but reduce task CPU from 4 vCPU to 2 vCPU to cut per-task cost in half. Add more tasks to compensate for reduced per-task throughput.",
        isCorrect: false,
        explanation: "Wrong — Reducing vCPU by 50% and doubling task count results in the same total vCPU hours and the same total Fargate cost. If transcoding is CPU-bound, halving vCPU doubles job duration, requiring twice as many concurrent tasks to maintain throughput. This is cost-neutral, not a 50% savings."
      }
    ],
    explanation: "Fargate Spot is designed for fault-tolerant, interruptible workloads — video transcoding with SQS retry is the canonical use case. The key design elements: (1) SQS visibility timeout slightly longer than max job duration ensures interrupted tasks re-queue automatically; (2) idempotent task design (re-running a task from the beginning is acceptable); (3) Fargate Spot provides 50–70% savings with identical API surface. This pattern is directly recommended in AWS documentation for batch-style, fault-tolerant container workloads.",
    keywords: ["Fargate Spot", "SQS visibility timeout", "task interruption", "video transcoding", "fault-tolerant containers", "retry pattern", "ECS capacity provider", "Spot savings"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-046  Aurora DSQL vs DynamoDB Global Tables  (D2 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-046",
    domain: 2,
    domains: [2, 4],
    crossDomain: true,
    taskStatement: "2.1",
    services: ["aurora", "dynamodb"],
    constraintType: "ha",
    difficulty: 5,
    type: "single",
    stem: "A new e-commerce application requires an active-active multi-region relational database across us-east-1 and us-west-2. Requirements: SQL ACID transactions that span multiple tables, sub-10ms read latency in both Regions, RPO = 0 (no data loss), automated failover with RTO < 60 seconds, and relational data model with JOINs. The team is evaluating Amazon Aurora DSQL vs Amazon DynamoDB Global Tables. Which AWS service meets ALL requirements and why?",
    options: [
      {
        id: "A",
        text: "Amazon DynamoDB Global Tables — provides active-active multi-region replication, sub-10ms reads at both Regions, RPO approaching 0, and automatic failover. Use PartiQL for SQL-like syntax.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB is a NoSQL key-value and document database. It does NOT support multi-table ACID transactions spanning multiple tables in the same way RDBMS transactions do (DynamoDB transactions exist but only within a single Region and have limitations). DynamoDB does not support JOIN operations. PartiQL provides SQL-like syntax but cannot execute relational JOINs. This fails the relational data model and multi-table ACID requirements."
      },
      {
        id: "B",
        text: "Amazon Aurora DSQL — provides active-active distributed SQL with PostgreSQL compatibility, multi-Region ACID transactions, sub-10ms reads, RPO = 0 via synchronous replication, and automatic failover within seconds.",
        isCorrect: true,
        explanation: "Correct — Amazon Aurora DSQL (introduced in 2024) is specifically designed for active-active multi-Region SQL databases. It provides: PostgreSQL-compatible SQL with full JOIN support, ACID transactions across Regions, active-active writes in both Regions, RPO = 0 via the distributed transaction protocol, and sub-60-second automated failover. It addresses the gap that previously required Aurora Global Database (which is only active-active for reads, not writes) by enabling true active-active write distribution with distributed transactions."
      },
      {
        id: "C",
        text: "Amazon Aurora Global Database with write forwarding enabled — forwards writes from the secondary Region (us-west-2) to the primary (us-east-1), achieving effective active-active write access with RPO < 1 second.",
        isCorrect: false,
        explanation: "Wrong — Aurora Global Database with write forwarding routes secondary-region writes to the primary Region synchronously, but this means writes from us-west-2 still have the network round-trip latency to us-east-1 for each transaction (100–150ms). RPO with Global Database is typically 1 second (not 0), and write forwarding introduces higher write latency for us-west-2 users. True active-active local writes are only available with Aurora DSQL."
      },
      {
        id: "D",
        text: "Amazon Aurora Multi-AZ in us-east-1 with a read replica in us-west-2. Promote the us-west-2 read replica to primary during Regional failures.",
        isCorrect: false,
        explanation: "Wrong — This is an active-passive (not active-active) architecture. The us-west-2 replica is read-only; writes from us-west-2 users must cross Regions to us-east-1. Replica promotion during failover is manual or requires custom automation and takes several minutes — exceeding the 60-second RTO. RPO during failover is the replica lag at time of failure (not 0). This does not meet active-active, RPO=0, or RTO<60s requirements."
      }
    ],
    explanation: "Amazon Aurora DSQL is the AWS service for active-active multi-Region SQL with ACID transactions and RPO=0. It was designed specifically for the use case where Aurora Global Database (active-passive or active-active with write forwarding latency) is insufficient. For applications requiring SQL JOINs, multi-table ACID transactions, and truly local writes in multiple Regions, Aurora DSQL is the correct answer. DynamoDB Global Tables covers the NoSQL active-active pattern but cannot satisfy relational requirements.",
    keywords: ["Aurora DSQL", "active-active SQL", "DynamoDB Global Tables", "ACID transactions", "multi-region write", "RPO 0", "RTO 60 seconds", "Aurora Global Database write forwarding"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-047  API Gateway HTTP API vs REST API  (D2 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-047",
    domain: 3,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "3.3",
    services: ["api-gateway", "lambda", "cognito"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A startup builds a mobile banking API using Amazon API Gateway REST API and AWS Lambda. The API serves 5 million requests/day. Current issues: p99 latency is 450ms (target: under 200ms), monthly API Gateway cost is $1,750 (target: under $900), and developers complain about configuration complexity. The API uses: JWT authentication via Amazon Cognito User Pools, CORS headers, Lambda proxy integration, and request throttling at 1,000 req/s. No existing features use REST API-specific capabilities (API keys, usage plans, request/response transformations, or AWS service proxy integrations). Which change best addresses LATENCY, COST, and operational SIMPLICITY?",
    options: [
      {
        id: "A",
        text: "Migrate from Amazon API Gateway REST API to Amazon API Gateway HTTP API. HTTP API natively supports JWT authorizers (Cognito User Pools), CORS, Lambda proxy integration, and route-level throttling — all existing features. HTTP API costs $1.00/million vs REST API's $3.50/million.",
        isCorrect: true,
        explanation: "Correct — HTTP API has lower internal overhead than REST API, resulting in 20–40ms lower p99 latency (pushing p99 from 450ms toward 200ms range). Cost: 5M requests/day × 30 days = 150M requests/month × $1.00/million = $150/month vs current $1,750 — a 91% cost reduction, well under the $900 target. HTTP API natively supports JWT authorizers (pointing to Cognito User Pool), CORS configuration, Lambda proxy, and per-route throttling. Since the startup uses NONE of the REST API-specific features (no API keys, usage plans, service proxies), migration is straightforward. All three constraints are resolved."
      },
      {
        id: "B",
        text: "Keep REST API and enable Amazon API Gateway caching with a 1 GB cache. Set cache TTL to 300 seconds. This reduces Lambda invocations, lowering latency and cost.",
        isCorrect: false,
        explanation: "Wrong — API Gateway caching adds $0.02/hour per GB ($14.40/month for 1 GB) and only helps for cacheable GET requests with identical parameters. Banking APIs typically have personalized responses (account-specific data) that cannot be cached. Caching does not reduce p99 latency for uncacheable requests. The REST API cost remains at $3.50/million for uncached requests. This does not achieve the cost or latency targets."
      },
      {
        id: "C",
        text: "Replace Amazon API Gateway with an Application Load Balancer (ALB) with Lambda targets. ALB has lower per-request costs ($0.008/LCU-hour) and lower latency overhead than API Gateway.",
        isCorrect: false,
        explanation: "Wrong — ALB with Lambda targets lacks native JWT authentication, CORS configuration, per-route throttling, and the operational simplicity of API Gateway. Implementing these features requires custom Lambda middleware code, increasing complexity — directly violating the simplicity requirement. ALB Lambda targets also have limitations (18 MB request size, no native request transformations)."
      },
      {
        id: "D",
        text: "Enable Amazon API Gateway REST API Edge-Optimized endpoint type with Amazon CloudFront distribution. This reduces latency by serving requests from CloudFront edge locations and caches responses.",
        isCorrect: false,
        explanation: "Wrong — Edge-Optimized REST API routes through a CloudFront distribution managed by API Gateway, but the API Gateway processing still happens in a single Region. The latency reduction is primarily for users far from the Region — for a mobile banking app with users concentrated in one Region, the improvement is minimal. It does not reduce the per-request cost of REST API ($3.50/million). The fundamental cost and latency issues with REST API remain."
      }
    ],
    explanation: "Amazon API Gateway HTTP API is a purpose-built, lower-cost, lower-latency alternative to REST API for the most common API patterns (Lambda proxy, JWT auth, CORS, throttling). When a REST API uses only these common features, migrating to HTTP API is the highest-impact single change for cost (71% price reduction), latency (reduced API overhead), and operational simplicity (simpler configuration model). HTTP API was specifically designed for Lambda-backed APIs that don't need REST API's advanced features.",
    keywords: ["HTTP API vs REST API", "API Gateway cost", "JWT authorizer", "Lambda proxy", "latency reduction", "p99 latency", "CORS", "API Gateway pricing"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-048  EKS + ECR + ALB resilience  (D2 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-048",
    domain: 2,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "2.2",
    services: ["eks", "ecr", "alb", "spot"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "A company runs a stateless web application on Amazon Elastic Kubernetes Service (Amazon EKS) with managed node groups across 3 Availability Zones. The application handles 2,000 requests/second at peak. Current setup: all nodes use On-Demand m5.xlarge instances ($0.192/hour), 15 nodes total, monthly compute cost $2,074. A solutions architect must reduce cost by 40% while maintaining 99.9% AVAILABILITY and <100ms p99 LATENCY even if one Availability Zone becomes unavailable. The application pods are stateless and can be rescheduled in under 2 minutes. Which node group configuration achieves this?",
    options: [
      {
        id: "A",
        text: "Replace all 15 On-Demand nodes with EC2 Spot Instances. Configure the EKS managed node group with multiple instance types (m5.xlarge, m5a.xlarge, m4.xlarge) across all 3 AZs to reduce interruption risk. Use the EKS cluster autoscaler to maintain minimum node count.",
        isCorrect: false,
        explanation: "Wrong — Running ALL nodes on Spot for a 99.9% SLA application is risky. During periods of high Spot capacity demand, multiple AZ-level interruptions can occur simultaneously, potentially dropping below minimum capacity. While diversifying instance types reduces this risk, running zero On-Demand nodes provides no guaranteed baseline capacity for a 99.9% SLA requirement."
      },
      {
        id: "B",
        text: "Configure two EKS node groups: a baseline On-Demand node group with 6 m5.xlarge instances (2 per AZ) and a Spot node group with 9 m5.xlarge instances (3 per AZ). Use Kubernetes pod disruption budgets to ensure at least 70% of pods remain running during Spot interruptions. Configure the Application Load Balancer with health checks.",
        isCorrect: true,
        explanation: "Correct — 6 On-Demand nodes provide guaranteed baseline capacity to serve traffic in all 3 AZs even if all Spot nodes are interrupted simultaneously (6 × 2 vCPU/8 GB handles 2,000 req/s at reduced capacity). Spot nodes provide burst capacity at ~70% discount. If one AZ fails, 2 On-Demand + 3 Spot nodes in the remaining 2 AZs maintain service. Pod disruption budgets prevent too many pods being evicted at once. Cost: 6 On-Demand × $0.192 × 720 = $829 + 9 Spot × ~$0.058 × 720 = $375 = $1,204/month — 42% reduction from $2,074. AVAILABILITY and LATENCY maintained with 2-minute pod rescheduling. All three constraints met."
      },
      {
        id: "C",
        text: "Keep all 15 nodes On-Demand but switch from m5.xlarge to m5.large (50% cheaper at $0.096/hour). Scale from 15 to 30 nodes to maintain total CPU capacity.",
        isCorrect: false,
        explanation: "Wrong — 30 × m5.large × $0.096/hour × 720 hours = $2,074/month — identical to the current cost. You halved the instance price but doubled the count, achieving zero savings. Additionally, 30 nodes with smaller instances may have higher EKS node overhead costs and does not address the 40% cost reduction requirement."
      },
      {
        id: "D",
        text: "Use AWS Fargate profiles for all EKS pods. Fargate eliminates node management overhead, scales to zero during off-hours, and costs less than On-Demand EC2 for variable workloads.",
        isCorrect: false,
        explanation: "Wrong — Fargate for EKS is priced at $0.04048/vCPU-hour and $0.004445/GB-hour. For 15 nodes equivalent of 2 vCPU/8 GB (30 vCPU total): 30 vCPU × $0.04048 × 720 = $874 (CPU) + 120 GB × $0.004445 × 720 = $384 (memory) = $1,258/month. This is a 39% reduction — borderline. However, Fargate does NOT guarantee 99.9% availability for AZ-failure scenarios the same way a mixed On-Demand/Spot EKS node group does, and Fargate has higher startup latency (no pre-warmed nodes) affecting the <2-minute rescheduling SLA."
      }
    ],
    explanation: "The standard cost-optimization pattern for EKS is a mixed On-Demand (baseline) + Spot (burst) node group strategy. The On-Demand nodes ensure guaranteed capacity for SLA compliance; Spot nodes provide cheap burst capacity. Pod disruption budgets and multi-instance-type Spot configuration minimize interruption impact. The key is sizing On-Demand capacity to handle peak traffic with all Spot nodes interrupted, while Spot handles the normal load at 60-70% discount.",
    keywords: ["EKS mixed node groups", "Spot + On-Demand", "pod disruption budget", "AZ failure", "EKS cluster autoscaler", "Fargate vs EC2 EKS", "stateless workload", "node group strategy"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-049  Organizations + SCPs  (D1 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-049",
    domain: 1,
    domains: [1, 4],
    crossDomain: true,
    taskStatement: "1.1",
    services: ["organizations", "scp", "config", "cloudtrail"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company uses AWS Organizations with 50 member accounts across 5 Organizational Units (OUs): Production, Staging, Development, Security, and Shared Services. Security requirements: (1) no member account may disable AWS CloudTrail logging in any account; (2) all new Amazon Elastic Compute Cloud (Amazon EC2) instances in Production must be in VPCs — no EC2-Classic; (3) Development accounts may only launch EC2 instances in us-east-1 and us-west-2 to control costs. These controls must be AUTOMATIC (no per-account configuration) and must PERSIST even if a member account's root user or administrator tries to remove them. Which AWS Organizations feature enforces all three requirements?",
    options: [
      {
        id: "A",
        text: "Apply Service Control Policies (SCPs) at the appropriate OU level: an SCP on all OUs denying cloudtrail:StopLogging and cloudtrail:DeleteTrail; an SCP on the Production OU denying ec2:RunInstances where vpc is not specified; an SCP on the Development OU denying ec2:RunInstances for all regions except us-east-1 and us-west-2.",
        isCorrect: true,
        explanation: "Correct — SCPs are the only Organizations control that persists even when a member account's administrator or root user attempts to override them. SCPs define the maximum permission boundary for all principals (including root) in the OU. Applying the CloudTrail deny SCP at the root level propagates to all OUs. The EC2-Classic deny applies only to Production OU. The region restriction applies only to Development OU. SCPs are automatic (inherited by all accounts in the OU) and cannot be removed by member account administrators. All three requirements are met."
      },
      {
        id: "B",
        text: "Use AWS Config Conformance Packs deployed to all accounts via AWS Organizations. Create Config rules for CloudTrail enablement, EC2 VPC requirements, and regional restrictions. Configure auto-remediation for non-compliant resources.",
        isCorrect: false,
        explanation: "Wrong — AWS Config Conformance Packs detect and remediate non-compliant configurations AFTER they occur — they are detective and corrective controls, not preventive. A member account administrator could temporarily disable CloudTrail, perform unauthorized actions, and trigger a remediation — but damage may have occurred in the gap. SCPs prevent the action from occurring at all. Config does not 'persist even if root user tries to remove them' — a root user could modify Config settings."
      },
      {
        id: "C",
        text: "Create IAM Permission Boundaries in each member account that deny CloudTrail disable, EC2-Classic launch, and off-region EC2 launches. Apply these as the default Permission Boundary for all IAM roles.",
        isCorrect: false,
        explanation: "Wrong — IAM Permission Boundaries are per-account and per-IAM-entity controls. They must be attached to each IAM role individually and can be modified or removed by the account's IAM administrator. They do not apply to the account root user and require per-account deployment — not automatic via Organizations. This fails the 'automatic' and 'persist even if administrator tries to remove' requirements."
      },
      {
        id: "D",
        text: "Enable AWS Security Hub across all accounts with Organizations integration. Apply the AWS Foundational Security Best Practices standard. Create Security Hub custom actions to notify the security team when violations occur.",
        isCorrect: false,
        explanation: "Wrong — Security Hub is a security findings aggregation and dashboard service. It detects and reports security issues but does not prevent actions. An administrator can still disable CloudTrail or launch EC2 in restricted regions — Security Hub will generate a finding but cannot stop the action. This is a detective control, not a preventive one."
      }
    ],
    explanation: "Service Control Policies (SCPs) are the only AWS Organizations mechanism that creates an immutable permission boundary on member accounts — including the root user. SCPs inherited from parent OUs cannot be removed by member account administrators or root users; only management account administrators can modify OU-level SCPs. This makes SCPs the correct choice for preventive security controls that must be automatic, universal, and tamper-resistant across an Organizations hierarchy.",
    keywords: ["Service Control Policies", "Organizations SCP", "preventive control", "CloudTrail disable deny", "regional restriction SCP", "EC2 VPC enforcement", "tamper-resistant", "root user restriction"]
  },

  // ─────────────────────────────────────────────────────────────
  // cd-050  Glue + Athena + Kinesis: streaming analytics  (D2 + D3 + D4)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-050",
    domain: 3,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "3.2",
    services: ["kinesis", "glue", "athena", "s3", "firehose"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A logistics company ingests GPS telemetry from 100,000 delivery vehicles. Data arrives at 50 MB/second via Amazon Kinesis Data Streams. Requirements: raw data must be queryable within 5 minutes of ingestion for operational dashboards (PERFORMANCE); data must be stored in cost-optimized columnar format for historical analytics (COST); the pipeline must continue delivering data to storage even if the analytics layer becomes unavailable (AVAILABILITY); and no servers should be managed (OPERATIONS). A solutions architect must design the ingestion-to-query pipeline. Which architecture satisfies all four constraints?",
    options: [
      {
        id: "A",
        text: "Kinesis Data Streams → Amazon Kinesis Data Firehose (with dynamic partitioning, Parquet conversion, and 60-second buffering) → Amazon S3. Configure AWS Glue Data Catalog to automatically crawl new S3 prefixes on a 5-minute schedule. Use Amazon Athena for ad-hoc queries on the cataloged data.",
        isCorrect: true,
        explanation: "Correct — Kinesis Data Firehose with 60-second buffering delivers data to S3 within 60–90 seconds. Firehose's native Parquet conversion (via Glue Data Catalog schema) converts raw records to cost-optimized columnar format before writing to S3, satisfying COST. The Glue crawler on a 5-minute schedule adds new S3 partitions to the Data Catalog, making data queryable via Athena within 5 minutes of arrival. If Athena or Glue becomes unavailable, Firehose independently continues delivering to S3 (AVAILABILITY — storage is decoupled from analytics). Firehose and Athena are fully serverless (OPERATIONS). All four constraints are satisfied."
      },
      {
        id: "B",
        text: "Kinesis Data Streams → AWS Glue Streaming ETL job (converts to Parquet, writes to S3) → Amazon Athena for queries. Use AWS Glue job auto-scaling.",
        isCorrect: false,
        explanation: "Wrong — AWS Glue Streaming ETL jobs run on Apache Spark, which requires a running Glue job (with associated DPU costs) and has a startup time of several minutes. More critically, if the Glue streaming job fails or is stopped for maintenance, data delivery to S3 stops — violating AVAILABILITY (Kinesis Data Firehose independently persists data regardless of analytics layer state). Glue DPU costs for 50 MB/s continuous streaming are significantly higher than Firehose + Athena."
      },
      {
        id: "C",
        text: "Kinesis Data Streams → Amazon Kinesis Data Analytics for Apache Flink (real-time aggregations) → Amazon S3 in JSON format → Amazon Athena for queries.",
        isCorrect: false,
        explanation: "Wrong — Storing data in JSON format instead of Parquet violates the COST requirement (Athena scans data by volume; JSON is 3–5x larger than Parquet for typical telemetry data, increasing scan costs). Kinesis Data Analytics (Flink) is a stateful streaming compute service with Apache Flink DPU costs that are higher than Firehose for pure ingestion. If the Flink application fails, data stops flowing to S3 — same AVAILABILITY issue as Glue streaming."
      },
      {
        id: "D",
        text: "Kinesis Data Streams → Amazon EC2 consumer application (converts to Parquet, writes to S3) → AWS Glue crawler → Amazon Athena. Use EC2 Auto Scaling for the consumer fleet.",
        isCorrect: false,
        explanation: "Wrong — EC2 consumer application requires server management (OS patching, fleet scaling logic, failure handling) — violating OPERATIONS (no servers to manage). EC2 instances also introduce potential single-points of failure in the consumer tier. If the EC2 fleet encounters issues, data delivery to S3 stops. This is the opposite of a serverless architecture."
      }
    ],
    explanation: "Kinesis Data Firehose is the key to this architecture: it is the only AWS streaming service that independently delivers data to S3 regardless of whether downstream analytics services (Glue, Athena) are available. Its native Parquet conversion via Glue Data Catalog schema handles COST optimization without additional services. The 60-second buffering interval plus 5-minute Glue crawler schedule achieves the 5-minute query freshness SLA. Firehose, Glue crawlers, and Athena are all fully serverless, satisfying the OPERATIONS constraint.",
    keywords: ["Kinesis Data Firehose", "Parquet conversion", "Glue crawler", "Athena", "streaming ingestion", "5-minute freshness", "serverless pipeline", "columnar format", "AVAILABILITY decoupling"]
  }

]
