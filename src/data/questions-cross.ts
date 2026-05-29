import { Question } from "../lib/types"

export const crossDomainQuestions: Question[] = [

  // ─────────────────────────────────────────────────────────────
  // D1 + D4  (Secure AND cost-optimized)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-001",
    domain: 1,
    domains: [1, 4],
    crossDomain: true,
    taskStatement: "1.2",
    services: ["s3", "kms", "glacier", "s3-object-lock"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A financial services company must store 500 TB of compliance records that are subject to SEC Rule 17a-4 WORM (write-once, read-many) requirements. The data must be encrypted with customer-managed keys, retained for exactly seven years, and accessed at most once per quarter for audits. The company wants to minimize storage and encryption costs. Which solution meets ALL requirements at the LOWEST cost?",
    options: [
      {
        id: "A",
        text: "Store records in Amazon Simple Storage Service (Amazon S3) Standard with Amazon S3 Object Lock in Compliance mode and server-side encryption using Amazon S3-managed keys (SSE-S3). Apply a seven-year retention period.",
        isCorrect: false,
        explanation: "Wrong — SSE-S3 uses AWS-managed keys, not customer-managed keys, which fails the encryption requirement. Also, S3 Standard is the most expensive storage class for infrequently accessed archive data."
      },
      {
        id: "B",
        text: "Store records in Amazon S3 Glacier Deep Archive with Amazon S3 Object Lock in Compliance mode and server-side encryption using AWS Key Management Service (AWS KMS) customer-managed keys (SSE-KMS). Apply a seven-year retention period.",
        isCorrect: true,
        explanation: "Correct — S3 Glacier Deep Archive is the lowest-cost storage class (~$0.00099/GB-month), fully supports Object Lock in Compliance mode for WORM, and supports SSE-KMS with customer-managed keys. Quarterly retrieval at this volume is acceptable given the audit-only access pattern."
      },
      {
        id: "C",
        text: "Store records in Amazon S3 Glacier Instant Retrieval with SSE-KMS customer-managed keys and an S3 Lifecycle policy that expires objects after seven years.",
        isCorrect: false,
        explanation: "Wrong — S3 Lifecycle expiration deletes objects rather than enforcing WORM retention. Expiration does not satisfy SEC Rule 17a-4 Compliance mode requirements. Additionally, Glacier Instant Retrieval costs more than Deep Archive."
      },
      {
        id: "D",
        text: "Store records in Amazon S3 Intelligent-Tiering with SSE-KMS customer-managed keys and a vault lock policy applied via Amazon S3 Glacier vault lock.",
        isCorrect: false,
        explanation: "Wrong — S3 Intelligent-Tiering incurs a per-object monitoring fee and the archive tiers do not guarantee millisecond access, but more critically, Glacier vault lock is a separate product for standalone Glacier vaults and cannot be applied to S3 Intelligent-Tiering objects. The correct mechanism for S3 is S3 Object Lock."
      }
    ],
    explanation: "Amazon S3 Glacier Deep Archive with S3 Object Lock in Compliance mode satisfies SEC Rule 17a-4 WORM requirements: objects cannot be deleted or modified before the retention period expires, even by the bucket owner. SSE-KMS with a customer-managed key satisfies the encryption requirement. At ~$0.00099/GB-month, Deep Archive is the most cost-effective S3 storage class, making it optimal for 500 TB of quarterly-access archival data.",
    keywords: ["WORM", "SEC Rule 17a-4", "compliance mode", "customer-managed keys", "lowest cost", "archive"]
  },

  {
    id: "cd-002",
    domain: 1,
    domains: [1, 4],
    crossDomain: true,
    taskStatement: "1.3",
    services: ["ec2", "vpc", "s3", "nat-gateway", "vpc-endpoint"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company runs a data-processing application on 200 Amazon Elastic Compute Cloud (Amazon EC2) instances in private subnets. The instances must upload large result files (averaging 2 GB each) to an Amazon Simple Storage Service (Amazon S3) bucket in the same AWS Region multiple times daily. The security team requires that the traffic never traverse the public internet. The finance team reports that data-transfer costs are too high. Which solution addresses both the security and cost requirements?",
    options: [
      {
        id: "A",
        text: "Configure a NAT Gateway in the public subnet and update the private subnet route tables to send all S3 traffic through the NAT Gateway.",
        isCorrect: false,
        explanation: "Wrong — NAT Gateway charges $0.045/GB for data processing on top of hourly costs. For 200 instances uploading 2 GB files multiple times daily this creates significant cost. NAT Gateway also routes traffic through the AWS public S3 endpoint, which technically leaves the AWS network but is still charged as data transfer."
      },
      {
        id: "B",
        text: "Create an Amazon S3 Gateway VPC Endpoint and update the private subnet route tables to route S3 traffic through the endpoint.",
        isCorrect: true,
        explanation: "Correct — S3 Gateway VPC Endpoints are free (no hourly or data-processing charges) and route traffic entirely within the AWS network via the AWS backbone, never touching the public internet. This eliminates NAT Gateway data-processing fees and satisfies the security requirement simultaneously."
      },
      {
        id: "C",
        text: "Create an Amazon S3 Interface VPC Endpoint (AWS PrivateLink) in the private subnets and update security groups to allow HTTPS to the endpoint.",
        isCorrect: false,
        explanation: "Wrong — Interface VPC Endpoints for S3 use AWS PrivateLink and incur per-hour and per-GB data-processing charges similar to NAT Gateway. For high-volume S3 traffic within the same Region, the free Gateway Endpoint is the cost-optimal choice."
      },
      {
        id: "D",
        text: "Enable S3 Transfer Acceleration on the bucket so EC2 instances can use the CloudFront edge network for faster, private uploads.",
        isCorrect: false,
        explanation: "Wrong — S3 Transfer Acceleration uses CloudFront edge nodes and charges an additional $0.04–$0.08/GB. It is designed for cross-Region or internet uploads, not same-Region EC2-to-S3 transfers. It does not keep traffic off the internet from the perspective of routing, and it adds cost."
      }
    ],
    explanation: "Amazon S3 Gateway VPC Endpoints are the unique AWS service offering that is completely free — no hourly charges and no per-GB data-processing fees — while keeping all S3 traffic on the private AWS backbone. The endpoint is added to the VPC route table, so EC2 instances in private subnets automatically route S3 API calls through it. This is a classic D1+D4 synergy: the same solution satisfies both the security requirement (private network) and the cost requirement (zero data-transfer charges).",
    keywords: ["Gateway VPC Endpoint", "private subnets", "data transfer cost", "S3", "never traverse public internet"]
  },

  // ─────────────────────────────────────────────────────────────
  // D2 + D4  (Resilient AND cost-optimized)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-003",
    domain: 2,
    domains: [2, 4],
    crossDomain: true,
    taskStatement: "2.3",
    services: ["ec2", "spot", "auto-scaling", "sqs"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A media company runs a video-transcoding workload that processes jobs from an Amazon Simple Queue Service (Amazon SQS) queue. Individual transcoding jobs take 10–30 minutes to complete. Jobs can be retried if interrupted, and the company can tolerate up to a 20-minute delay when an instance is reclaimed. The workload runs continuously but volume is unpredictable. The company wants to maximize cost savings without sacrificing job completion. Which compute strategy is MOST cost-effective while ensuring all jobs eventually complete?",
    options: [
      {
        id: "A",
        text: "Run a fixed fleet of On-Demand instances sized to peak load.",
        isCorrect: false,
        explanation: "Wrong — sizing to peak load wastes money during low-volume periods. On-Demand at peak capacity is the most expensive option and does not adapt to variable load."
      },
      {
        id: "B",
        text: "Use an Auto Scaling group of Spot Instances across multiple instance families and Availability Zones, with SQS visibility timeout set to 35 minutes and a dead-letter queue for jobs that fail after three attempts.",
        isCorrect: true,
        explanation: "Correct — Spot Instances provide up to 90% savings over On-Demand and are ideal for retry-tolerant batch workloads. Using multiple instance families (instance fleet/attribute-based selection) across AZs dramatically reduces interruption risk. The SQS visibility timeout at 35 minutes (exceeding max job length of 30 min) ensures interrupted jobs become visible again for retry. The DLQ catches any persistent failures."
      },
      {
        id: "C",
        text: "Purchase 1-year Standard Reserved Instances at the expected average load and supplement with On-Demand instances for spikes.",
        isCorrect: false,
        explanation: "Wrong — Reserved Instances require a 1-year commitment and are priced for steady-state, predictable workloads. For unpredictable variable volume, paying for reserved capacity that may sit idle is less cost-effective than Spot for retry-tolerant jobs."
      },
      {
        id: "D",
        text: "Use AWS Lambda with a 15-minute maximum execution timeout and trigger it from the SQS queue.",
        isCorrect: false,
        explanation: "Wrong — Lambda has a maximum execution timeout of 15 minutes, but individual transcoding jobs can take up to 30 minutes. Lambda is not suitable for this workload's execution duration requirements."
      }
    ],
    explanation: "Spot Instances are optimal for fault-tolerant batch workloads that can be retried. The key design patterns are: (1) diversify across instance families and AZs to reduce correlated interruptions, (2) set the SQS visibility timeout longer than the maximum job duration so that if an instance is reclaimed mid-job, the message reappears for another worker, and (3) use a dead-letter queue for jobs that fail repeatedly. This delivers maximum cost savings (up to 90% off On-Demand) while guaranteeing all jobs eventually complete.",
    keywords: ["Spot Instances", "retry-tolerant", "SQS visibility timeout", "cost-effective", "variable load", "batch"]
  },

  {
    id: "cd-004",
    domain: 2,
    domains: [2, 4],
    crossDomain: true,
    taskStatement: "2.3",
    services: ["rds", "aurora", "pilot-light", "route53"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "A company runs a critical e-commerce platform on an Amazon Relational Database Service (Amazon RDS) for MySQL Multi-AZ deployment in us-east-1. The business requires a recovery time objective (RTO) of 15 minutes and a recovery point objective (RPO) of 5 minutes in the event of a full Regional failure. The company wants to minimize the cost of the disaster-recovery (DR) site while still meeting the RTO/RPO targets. Which approach meets these requirements at the LOWEST cost?",
    options: [
      {
        id: "A",
        text: "Deploy a full-size active-active Amazon Aurora Global Database across us-east-1 and us-west-2 with all application servers running in both Regions at all times.",
        isCorrect: false,
        explanation: "Wrong — active-active doubles the cost of compute in both regions. While it exceeds RTO/RPO requirements, running full capacity in both Regions simultaneously is the most expensive DR strategy and violates the 'lowest cost' requirement."
      },
      {
        id: "B",
        text: "Create an Amazon Aurora Global Database with the primary cluster in us-east-1 and a secondary read-only cluster (minimum instance size) in us-west-2. In a Regional failure, promote the secondary cluster to primary and update Amazon Route 53 DNS records. Pre-warm application infrastructure in us-west-2 using AWS CloudFormation.",
        isCorrect: true,
        explanation: "Correct — this is a Warm Standby strategy. Aurora Global Database replicates with typical RPO < 1 second (well within 5 minutes). The secondary cluster running at minimum size keeps standby costs low. Promotion to primary takes minutes (within 15-minute RTO). Pre-deployed CloudFormation templates enable rapid application scale-up without paying for idle compute."
      },
      {
        id: "C",
        text: "Use automated Amazon RDS snapshots exported to Amazon S3 in us-west-2 every 5 minutes and restore from snapshot during a Regional failure.",
        isCorrect: false,
        explanation: "Wrong — restoring an RDS instance from a snapshot typically takes 15–60 minutes for a production-size database, which violates the 15-minute RTO. Snapshot restore time depends on database size and does not scale to meet aggressive RTO targets."
      },
      {
        id: "D",
        text: "Enable cross-Region automated backups for the RDS Multi-AZ instance in us-east-1 to us-west-2, then restore the latest backup in a Regional failure.",
        isCorrect: false,
        explanation: "Wrong — cross-Region automated backups have an RPO equal to the backup frequency (typically daily, not 5 minutes) and restore times similar to snapshot restores. This meets neither the 5-minute RPO nor the 15-minute RTO."
      }
    ],
    explanation: "Aurora Global Database is purpose-built for cross-Region DR with near-zero RPO (sub-second replication lag) and sub-minute failover capability. Running the secondary cluster at the minimum instance size (e.g., db.r6g.large) satisfies the cost constraint by avoiding full-capacity duplication while still enabling rapid promotion. Pre-deployed infrastructure-as-code in the DR region eliminates provisioning time during a failover event, keeping RTO within 15 minutes. This Warm Standby pattern is the most cost-efficient approach that meets aggressive RTO/RPO targets.",
    keywords: ["RTO 15 minutes", "RPO 5 minutes", "Aurora Global Database", "warm standby", "lowest cost DR", "Regional failure"]
  },

  // ─────────────────────────────────────────────────────────────
  // D1 + D2  (Secure AND resilient)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-005",
    domain: 1,
    domains: [1, 2],
    crossDomain: true,
    taskStatement: "1.2",
    services: ["kms", "s3", "multi-region-key", "replication"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A pharmaceutical company stores clinical trial data in Amazon Simple Storage Service (Amazon S3) in us-east-1. Data must be encrypted with customer-managed AWS Key Management Service (AWS KMS) keys as a regulatory requirement. The company has implemented cross-Region replication to a backup bucket in eu-west-1 for disaster recovery. A solutions architect discovers that the replicated objects in eu-west-1 cannot be decrypted by the secondary application team. What is MOST LIKELY causing this issue, and what is the CORRECT fix?",
    options: [
      {
        id: "A",
        text: "The S3 replication configuration does not have permission to replicate encrypted objects. Fix it by adding kms:GenerateDataKey permission to the S3 replication IAM role for the source KMS key.",
        isCorrect: false,
        explanation: "Wrong — this is a prerequisite for replication (the replication role needs kms:GenerateDataKey and kms:Decrypt for the source key and kms:GenerateDataKey for the destination key), but it addresses replication failure, not the decryption failure by the secondary team. If objects are successfully replicated, the IAM role has sufficient KMS access. The issue is that the replicated objects use a key that only exists in us-east-1."
      },
      {
        id: "B",
        text: "Regular KMS customer-managed keys are Region-specific. The source CMK from us-east-1 cannot be used to decrypt objects in eu-west-1. Replace the source CMK with an AWS KMS multi-Region key (primary key in us-east-1, replica key in eu-west-1), then configure S3 replication to re-encrypt replicated objects with the eu-west-1 replica key.",
        isCorrect: true,
        explanation: "Correct — standard KMS CMKs are scoped to a single AWS Region. Objects encrypted with a us-east-1 CMK cannot be decrypted using a key ARN in eu-west-1. Multi-Region KMS keys share the same key material across Regions but have different ARNs. When configured for replication, S3 can re-encrypt objects with the destination Region's replica key, enabling the secondary team to decrypt using their regional key ARN."
      },
      {
        id: "C",
        text: "The secondary application team's IAM role lacks kms:Decrypt permission on the source key. Grant them cross-Region kms:Decrypt permission on the us-east-1 KMS key ARN.",
        isCorrect: false,
        explanation: "Wrong — KMS API calls must be made to the Region where the key lives. The secondary team's applications in eu-west-1 would need to make KMS API calls to us-east-1 to decrypt, which adds latency and a cross-Region dependency that defeats the purpose of DR. Additionally, KMS API calls must be directed to the correct Regional endpoint."
      },
      {
        id: "D",
        text: "Enable S3 server-side encryption with AWS-managed keys (SSE-S3) on the destination bucket. Objects will be automatically re-encrypted during replication.",
        isCorrect: false,
        explanation: "Wrong — switching to SSE-S3 (AWS-managed keys) would violate the regulatory requirement for customer-managed KMS keys. This is a compliance failure."
      }
    ],
    explanation: "This is a classic cross-domain trap: the resilience solution (cross-Region replication) conflicts with the security solution (CMK encryption) because standard KMS customer-managed keys are Region-bound. The key insight is that KMS multi-Region keys replicate the key material to other Regions (different ARN, same key ID suffix), allowing the same logical key to exist in both us-east-1 and eu-west-1. S3 replication can be configured to re-encrypt objects with the destination Region's replica key, making the replicated objects decryptable by the secondary team without cross-Region KMS calls.",
    keywords: ["multi-Region KMS key", "cross-Region replication", "CMK region-specific", "decryption failure", "DR encryption"]
  },

  {
    id: "cd-006",
    domain: 1,
    domains: [1, 2],
    crossDomain: true,
    taskStatement: "1.1",
    services: ["rds", "secrets-manager", "multi-az", "rds-proxy"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company runs a three-tier web application with hundreds of concurrent Lambda functions connecting to an Amazon Relational Database Service (Amazon RDS) for PostgreSQL Multi-AZ instance. The security team mandates automatic rotation of database credentials every 30 days. The operations team reports that during RDS Multi-AZ failovers, the Lambda functions receive connection errors for up to 60 seconds because they cache stale connection strings. Which combination of services solves BOTH the credential rotation AND the failover connection problem with the LEAST code changes?",
    options: [
      {
        id: "A",
        text: "Store credentials in AWS Systems Manager Parameter Store (SecureString). Write Lambda code to retrieve and refresh credentials on every invocation. Use retry logic with exponential backoff during failovers.",
        isCorrect: false,
        explanation: "Wrong — retrieving credentials on every Lambda invocation adds latency and API call costs at scale. The retry/backoff approach does reduce failover errors but does not eliminate the 60-second window. This requires significant code changes and does not address the underlying connection pooling problem."
      },
      {
        id: "B",
        text: "Enable AWS Secrets Manager with automatic rotation for the RDS credentials, and deploy Amazon RDS Proxy in front of the RDS instance. Configure Lambda functions to connect through RDS Proxy using the Secrets Manager endpoint.",
        isCorrect: true,
        explanation: "Correct — Secrets Manager handles automatic credential rotation (including updating the running database) with no downtime. RDS Proxy maintains a persistent connection pool to the database and transparently routes connections to the new primary after a Multi-AZ failover, typically within seconds. Lambda functions connect to the stable RDS Proxy endpoint (not the RDS endpoint directly), eliminating stale connection errors. Minimal code change: just update the connection string to point to the Proxy."
      },
      {
        id: "C",
        text: "Store credentials in AWS Secrets Manager with rotation. Use a custom Lambda layer that refreshes credentials from Secrets Manager if a connection fails.",
        isCorrect: false,
        explanation: "Wrong — this still leaves Lambda functions connecting directly to the RDS endpoint. During a Multi-AZ failover, the DNS record for the RDS endpoint changes, but TTL caching means Lambda functions continue attempting connections to the old primary for 30–60 seconds. Refreshing credentials does not solve the connection disruption caused by DNS propagation delay."
      },
      {
        id: "D",
        text: "Migrate the database to Amazon Aurora with Multi-AZ. Aurora's faster failover (30 seconds vs. 60 seconds) combined with Secrets Manager rotation meets the requirements.",
        isCorrect: false,
        explanation: "Wrong — Aurora does have faster failover than RDS Multi-AZ, but 30 seconds of connection errors is still a problem for hundreds of concurrent Lambda functions. This also requires a database migration (significant operational overhead) and does not address the credential rotation-connection handoff issue as cleanly as RDS Proxy."
      }
    ],
    explanation: "RDS Proxy provides dual benefits that map perfectly to the two constraints: (1) it integrates natively with Secrets Manager, reading rotated credentials directly — Lambda functions never handle raw credentials and the proxy transparently uses updated credentials after rotation; (2) it maintains a persistent connection pool to the backend RDS instance and re-routes connections to the new primary after a Multi-AZ failover without the Lambda functions noticing, reducing failover disruption from ~60 seconds to seconds. The Lambda connection string only needs to change from the RDS endpoint to the RDS Proxy endpoint.",
    keywords: ["RDS Proxy", "Secrets Manager rotation", "Multi-AZ failover", "connection pooling", "Lambda database connections"]
  },

  // ─────────────────────────────────────────────────────────────
  // D1 + D3  (Secure AND high-performing)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-007",
    domain: 3,
    domains: [1, 3],
    crossDomain: true,
    taskStatement: "3.2",
    services: ["cloudfront", "s3", "oac", "waf"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A media company serves a static website with large video files (up to 500 MB each) from an Amazon Simple Storage Service (Amazon S3) bucket to a global audience. The security team requires that the S3 bucket is not publicly accessible — only Amazon CloudFront should be able to read from it. The performance team requires p99 latency under 200 ms for the first byte of video files for users worldwide. The current setup has a public S3 bucket with a CloudFront distribution, but users in Asia are experiencing 2-second first-byte latencies. Which change BEST satisfies both security and performance?",
    options: [
      {
        id: "A",
        text: "Block public access on the S3 bucket. Add a CloudFront Origin Access Identity (OAI) to the distribution and update the S3 bucket policy to allow only the OAI. Enable CloudFront caching with a 24-hour TTL.",
        isCorrect: false,
        explanation: "Wrong — Origin Access Identity (OAI) is a legacy mechanism that AWS has deprecated in favor of Origin Access Control (OAC). OAI does not support AWS KMS-encrypted S3 objects, whereas OAC does. Additionally, simply enabling caching with OAI does not fully address the latency problem for large files without also enabling CloudFront range request optimization."
      },
      {
        id: "B",
        text: "Block public access on the S3 bucket. Create a CloudFront Origin Access Control (OAC) and update the S3 bucket policy to allow only the OAC principal. Enable CloudFront edge caching with range-request support. Associate an AWS WAF web ACL for additional security.",
        isCorrect: true,
        explanation: "Correct — OAC is the current recommended mechanism for restricting S3 access to CloudFront only (security). Range-request support allows CloudFront to fetch partial chunks of large video files in parallel, dramatically reducing time-to-first-byte for large files (performance). CloudFront's global edge network of 400+ PoPs brings cached content close to Asian users, achieving sub-200ms TTFB after first cache hit. WAF adds application-layer security."
      },
      {
        id: "C",
        text: "Enable S3 Transfer Acceleration on the bucket and update CloudFront to point to the Transfer Acceleration endpoint. Keep the bucket public but add IP-based bucket policies.",
        isCorrect: false,
        explanation: "Wrong — S3 Transfer Acceleration is designed for direct-to-S3 uploads/downloads from clients, not for CloudFront origin fetches. IP-based bucket policies do not prevent direct public access effectively and are operationally fragile. This fails the security requirement."
      },
      {
        id: "D",
        text: "Move the video files to Amazon CloudFront to use CloudFront as both the origin and CDN. Configure signed URLs for access control.",
        isCorrect: false,
        explanation: "Wrong — CloudFront is a CDN, not a storage service. You cannot use CloudFront as an origin for itself. Video files must be stored in a persistent storage service like S3."
      }
    ],
    explanation: "Origin Access Control (OAC) is the modern replacement for OAI, with support for SSE-KMS encrypted S3 buckets and additional S3 API operations. Combined with blocking public S3 access, it ensures only CloudFront can read the bucket (security). For large video files, enabling CloudFront's range-request behavior allows it to retrieve parallel byte-range chunks from S3, reducing time-to-first-byte significantly. CloudFront's global edge presence (400+ PoPs) caches these chunks near end users, resolving the Asian latency issue. This is the canonical D1+D3 synergy: OAC+CloudFront provides both security and global performance.",
    keywords: ["Origin Access Control", "OAC", "S3 public access", "CloudFront caching", "range request", "global latency", "p99"]
  },

  {
    id: "cd-008",
    domain: 1,
    domains: [1, 3],
    crossDomain: true,
    taskStatement: "1.2",
    services: ["dynamodb", "kms", "dax", "vpc-endpoint"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A healthcare company stores 8 million patient records in Amazon DynamoDB. The table is encrypted at rest with a customer-managed AWS KMS key. The application runs on Amazon EC2 instances in private subnets and requires read latency under 1 millisecond to power real-time clinical dashboards at 50,000 reads per second. Compliance requires that all data access remain within the AWS private network and that encryption at rest use customer-managed keys. A solutions architect proposes adding Amazon DynamoDB Accelerator (DAX) to reduce read latency. What ADDITIONAL step is REQUIRED to maintain compliance when adding DAX?",
    options: [
      {
        id: "A",
        text: "No additional steps are required. DAX automatically uses the same KMS key as the underlying DynamoDB table.",
        isCorrect: false,
        explanation: "Wrong — this is the trap answer. DAX is a separate service with its own encryption configuration. DAX cluster encryption at rest must be explicitly enabled with a customer-managed KMS key when creating the cluster. By default, DAX can use AWS-managed keys or no encryption, which would violate the compliance requirement."
      },
      {
        id: "B",
        text: "Enable DAX cluster encryption at rest with the same customer-managed KMS key used by DynamoDB, deploy the DAX cluster in the same VPC and private subnets as the EC2 instances, and create a VPC Gateway Endpoint for DynamoDB so that DAX-to-DynamoDB traffic stays on the private network.",
        isCorrect: true,
        explanation: "Correct — three things are required: (1) DAX cluster encryption must be explicitly configured with the CMK (DAX does not inherit DynamoDB's encryption settings); (2) DAX must be deployed in the same VPC to keep traffic private; (3) a DynamoDB Gateway Endpoint ensures DAX-to-DynamoDB traffic (cache misses and write-throughs) stays on the AWS private network rather than routing through the public internet. All three are necessary to maintain compliance."
      },
      {
        id: "C",
        text: "Place the DAX cluster in a public subnet to allow it to communicate with DynamoDB, and enable DAX encryption in transit using TLS.",
        isCorrect: false,
        explanation: "Wrong — placing DAX in a public subnet violates the requirement that all data access remain within the AWS private network. Encryption in transit (TLS) is important but does not substitute for network-level isolation."
      },
      {
        id: "D",
        text: "Use DynamoDB Streams to replicate data to an Amazon ElastiCache for Redis cluster with encryption at rest, instead of using DAX.",
        isCorrect: false,
        explanation: "Wrong — while ElastiCache for Redis supports encryption with CMKs, this approach requires custom application code to read from ElastiCache and synchronize cache invalidation via Streams. DAX is a purpose-built, DynamoDB-compatible cache that is drop-in compatible with sub-millisecond latency. This introduces unnecessary complexity."
      }
    ],
    explanation: "The trap in this question is assuming DAX inherits DynamoDB's encryption configuration. It does not — DAX is an independent cluster service with its own encryption settings. When adding DAX for compliance-sensitive workloads: (1) explicitly enable DAX encryption at rest with a CMK during cluster creation; (2) deploy DAX within the VPC (it requires a subnet group); and (3) add a DynamoDB Gateway VPC Endpoint so that cache-miss fetches and writes from DAX to DynamoDB travel over the private AWS backbone. All three steps together maintain the HIPAA/compliance posture while achieving the sub-millisecond latency requirement through in-memory caching.",
    keywords: ["DAX encryption at rest", "customer-managed key", "VPC Gateway Endpoint", "DynamoDB", "HIPAA", "private network", "sub-millisecond"]
  },

  // ─────────────────────────────────────────────────────────────
  // D2 + D3  (Resilient AND high-performing)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-009",
    domain: 2,
    domains: [2, 3],
    crossDomain: true,
    taskStatement: "2.1",
    services: ["elasticache", "redis", "aurora", "multi-az"],
    constraintType: "ha",
    difficulty: 5,
    type: "single",
    stem: "A gaming company uses Amazon Aurora MySQL Multi-AZ as its primary database and Amazon ElastiCache for Redis (cluster mode disabled) as a read cache. The application uses session data stored in Redis. During a recent Availability Zone (AZ) outage, Aurora automatically failed over to the standby in under 30 seconds, but users reported that they were logged out and lost their game sessions. The Redis primary node was in the failed AZ and the replica node could not automatically promote itself. Which change ensures BOTH database resilience AND Redis session persistence during an AZ failure?",
    options: [
      {
        id: "A",
        text: "Enable Aurora Read Replicas in multiple AZs and increase the Redis node size to a memory-optimized instance for better performance.",
        isCorrect: false,
        explanation: "Wrong — Read Replicas do not improve resilience for write availability (they are for read scaling). Increasing Redis node size improves performance but does not address the automatic failover limitation of cluster mode disabled ElastiCache."
      },
      {
        id: "B",
        text: "Keep Aurora Multi-AZ as-is. Enable Multi-AZ for the ElastiCache for Redis cluster (automatic failover), so the replica automatically promotes to primary when the primary node fails.",
        isCorrect: true,
        explanation: "Correct — ElastiCache for Redis with Multi-AZ enabled and automatic failover allows the replica node to automatically promote to primary when the primary fails, typically within 1–2 minutes. This directly addresses the session loss problem. Aurora Multi-AZ already handles database failover correctly. Enabling Multi-AZ automatic failover on the existing Redis cluster is the minimal, targeted fix."
      },
      {
        id: "C",
        text: "Migrate Redis to cluster mode enabled and distribute session data across multiple shards in different AZs.",
        isCorrect: false,
        explanation: "Wrong — ElastiCache Redis cluster mode enabled distributes data across multiple shards but does NOT inherently enable automatic failover for each shard unless Multi-AZ is also enabled per shard. More critically, migrating from cluster mode disabled to enabled requires a migration process and changes to application connection configuration. This is more complex than simply enabling Multi-AZ on the existing cluster."
      },
      {
        id: "D",
        text: "Replace ElastiCache for Redis with Amazon DynamoDB for session storage using DAX for low-latency reads.",
        isCorrect: false,
        explanation: "Wrong — while DynamoDB with DAX is durable and performant, this replaces an in-memory cache with a disk-backed database, changing the architectural pattern significantly. Session reads from DynamoDB+DAX will have higher latency than Redis in-memory (microseconds vs. milliseconds). This is an over-engineering solution when the simple fix is enabling Multi-AZ failover on the existing Redis cluster."
      }
    ],
    explanation: "The trap here is that 'Multi-AZ' means different things for Aurora vs. ElastiCache Redis. Aurora Multi-AZ automatically fails over to the standby replica — this worked correctly. ElastiCache Redis cluster mode disabled requires explicitly enabling 'Multi-AZ' with 'automatic failover enabled' for the replica to promote automatically. Without this setting, the replica remains a passive replica that requires manual intervention. The fix is targeted: enable automatic failover on the ElastiCache Redis cluster. Aurora's configuration requires no changes.",
    keywords: ["ElastiCache Redis", "Multi-AZ automatic failover", "AZ failure", "session loss", "Redis replica promotion", "cluster mode disabled"]
  },

  {
    id: "cd-010",
    domain: 3,
    domains: [2, 3],
    crossDomain: true,
    taskStatement: "3.1",
    services: ["alb", "auto-scaling", "sqs", "kinesis"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A fintech company processes payment events that arrive at 100,000 events per second during peak hours. Each event must be processed exactly once, in order per payment ID (not globally ordered), within 500 ms, and the processing result must be stored durably. The system must continue processing if one consumer fails, with another consumer resuming from the last committed offset within 30 seconds. Which ingestion and processing architecture meets ALL these requirements?",
    options: [
      {
        id: "A",
        text: "Use Amazon Kinesis Data Streams with enhanced fan-out. Assign events to shards by payment ID. Use Lambda function consumers with the Kinesis event source mapping. Lambda automatically retries on failure.",
        isCorrect: false,
        explanation: "Wrong — Lambda's Kinesis event source mapping retries the entire failed batch repeatedly until the records expire (default 24 hours), which can block processing of subsequent records in the shard. For payment processing with a 30-second recovery requirement, this behavior could delay all subsequent events in that shard far beyond 30 seconds. Enhanced fan-out also adds cost."
      },
      {
        id: "B",
        text: "Use Amazon Kinesis Data Streams with one shard per payment ID range and EC2-based consumer applications using the Kinesis Client Library (KCL). KCL checkpoints progress to DynamoDB; on consumer failure, another instance picks up from the last checkpoint within the heartbeat timeout.",
        isCorrect: true,
        explanation: "Correct — Kinesis Data Streams provides ordered delivery per shard. Partitioning by payment ID ensures per-payment-ID ordering. KCL handles lease management (automatic rebalancing to healthy consumers), checkpointing to DynamoDB (durable offset tracking), and failover within the heartbeat timeout (~10–30 seconds), meeting the 30-second recovery requirement. KCL also handles the exactly-once processing guarantee at the application level via idempotent checkpointing."
      },
      {
        id: "C",
        text: "Use Amazon SQS FIFO queues with message group IDs set to payment ID for per-payment ordering and exactly-once delivery. Scale consumers with Auto Scaling based on queue depth.",
        isCorrect: false,
        explanation: "Wrong — SQS FIFO queues support exactly-once delivery and per-group ordering, but are limited to 3,000 messages per second with batching (300 without). At 100,000 events per second, SQS FIFO throughput is insufficient. SQS FIFO also lacks a durable offset/checkpoint mechanism; if a consumer fails mid-processing, messages return to the queue after visibility timeout, which can be much longer than 30 seconds depending on configuration."
      },
      {
        id: "D",
        text: "Use Amazon Managed Streaming for Apache Kafka (Amazon MSK) with consumer groups and auto-committed offsets. Enable at-least-once delivery and handle duplicates in the storage layer.",
        isCorrect: false,
        explanation: "Wrong — at-least-once delivery with auto-committed offsets does not satisfy the exactly-once requirement unless you add idempotency logic in the consumer. Auto-committed offsets can acknowledge records before processing completes, leading to data loss on failure. While MSK supports exactly-once semantics (EOS) with Kafka transactions, this requires explicit configuration not mentioned here."
      }
    ],
    explanation: "Kinesis Data Streams with KCL is the canonical solution for ordered, high-throughput event streaming with durable checkpointing. Key design decisions: shard partitioning by payment ID guarantees per-payment ordering without global ordering overhead; KCL's lease management enables automatic failover within the heartbeat timeout; DynamoDB checkpointing provides durable offset tracking that survives consumer restarts. The combination handles 100,000 events/second (via shard scaling), meets the 500 ms processing SLA, enforces per-payment-ID ordering, and enables sub-30-second failover recovery.",
    keywords: ["Kinesis Data Streams", "KCL", "per-shard ordering", "checkpoint", "failover", "exactly-once", "100,000 events per second"]
  },

  // ─────────────────────────────────────────────────────────────
  // D3 + D4  (High-performing AND cost-optimized)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-011",
    domain: 3,
    domains: [3, 4],
    crossDomain: true,
    taskStatement: "3.3",
    services: ["rds", "aurora", "read-replica", "elasticache"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A SaaS application uses an Amazon Aurora MySQL database. Read queries account for 95% of all database traffic and are causing the primary writer to approach CPU saturation during business hours. The team wants to reduce query latency for reads to under 5 ms and reduce the load on the primary instance. The solution must be cost-effective — the team wants to avoid doubling the database fleet size. Which is the MOST cost-effective approach to resolve the read performance problem?",
    options: [
      {
        id: "A",
        text: "Add two Amazon Aurora Read Replicas in separate Availability Zones and configure the application to use the Aurora reader endpoint for all SELECT queries.",
        isCorrect: false,
        explanation: "Wrong — adding two Read Replicas nearly doubles the cost of the database fleet. Aurora Read Replicas run at the same instance class as the primary, so two additional replicas represent a significant cost increase. While they do offload reads from the primary, this fails the 'avoid doubling the fleet size' cost constraint."
      },
      {
        id: "B",
        text: "Add one Amazon Aurora Read Replica and place Amazon ElastiCache for Redis in front of the application for query-result caching of frequently accessed, read-heavy data.",
        isCorrect: true,
        explanation: "Correct — a single Read Replica offloads replication lag-tolerant reads directly from Aurora, while ElastiCache for Redis (sub-millisecond latency) caches the most frequent query results in memory, handling the bulk of read traffic without additional Aurora instances. This reduces the number of queries hitting even the replica significantly. One replica + one ElastiCache cluster costs less than two replicas and achieves better read latency (Redis in-memory is faster than Aurora disk reads)."
      },
      {
        id: "C",
        text: "Upgrade the primary Aurora instance to a larger instance class to handle the increased read load.",
        isCorrect: false,
        explanation: "Wrong — scaling up the primary instance addresses write capacity but does not scale read throughput. Reads will continue to go to the primary instance, and a larger instance still has a single-node bottleneck. This is more expensive than adding a read-specific layer and does not achieve sub-5ms read latency."
      },
      {
        id: "D",
        text: "Migrate to Amazon DynamoDB to get automatic horizontal scaling for read capacity.",
        isCorrect: false,
        explanation: "Wrong — migrating from Aurora MySQL to DynamoDB is a major architectural change that requires redesigning the data model from relational to key-value. This has substantial development cost and operational risk, and is a disproportionate response to a read-scaling problem that can be solved with caching."
      }
    ],
    explanation: "The optimal read-scaling pattern combines a single Read Replica for queries that require fresh data with an in-memory cache (ElastiCache for Redis) for repeated queries that can tolerate slight staleness. ElastiCache delivers sub-millisecond read latency, far below the 5 ms target, and dramatically reduces the number of queries reaching the database. This tiered approach provides better performance than multiple replicas at lower total cost.",
    keywords: ["Aurora Read Replica", "ElastiCache", "read scaling", "CPU saturation", "cost-effective", "sub-5ms latency", "reader endpoint"]
  },

  {
    id: "cd-012",
    domain: 4,
    domains: [3, 4],
    crossDomain: true,
    taskStatement: "4.3",
    services: ["s3", "s3-intelligent-tiering", "athena", "cloudfront"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A data analytics company stores 10 PB of log data in Amazon Simple Storage Service (Amazon S3) Standard. Data older than 90 days is accessed unpredictably — some objects are accessed daily, others not for months. Ad-hoc queries via Amazon Athena run across the full dataset. The team wants to reduce storage costs without sacrificing query performance or adding operational complexity to manage tiering manually. Which storage strategy is MOST appropriate?",
    options: [
      {
        id: "A",
        text: "Move data older than 90 days to Amazon S3 Glacier Instant Retrieval and keep recent data in S3 Standard. Configure Athena to query both storage classes.",
        isCorrect: false,
        explanation: "Wrong — Amazon S3 Glacier Instant Retrieval charges a per-GB retrieval fee ($0.03/GB). For ad-hoc Athena queries scanning large volumes of Glacier Instant Retrieval data, retrieval costs can quickly exceed the savings from lower storage pricing. Athena also charges per TB scanned, so querying cold Glacier data triggers both retrieval costs and scan costs."
      },
      {
        id: "B",
        text: "Apply an S3 Lifecycle policy to transition objects after 90 days to S3 Standard-IA.",
        isCorrect: false,
        explanation: "Wrong — S3 Standard-IA has a minimum storage duration of 30 days and a minimum object size of 128 KB. More importantly, it charges retrieval fees per GB. For unpredictable access patterns where some objects are accessed daily, Standard-IA retrieval charges can exceed the storage savings. S3 Intelligent-Tiering is specifically designed for unpredictable access patterns."
      },
      {
        id: "C",
        text: "Transition data older than 90 days to Amazon S3 Intelligent-Tiering. S3 Intelligent-Tiering automatically moves objects between access tiers based on access patterns with no retrieval charges.",
        isCorrect: true,
        explanation: "Correct — S3 Intelligent-Tiering monitors object access patterns and automatically moves objects between Frequent Access, Infrequent Access, Archive Instant Access, and Archive Access tiers with NO retrieval charges. Objects accessed daily stay in Frequent Access (S3 Standard pricing); objects not accessed for 30 days move to Infrequent Access (40% cheaper); 90 days to Archive Instant Access (68% cheaper). This is exactly the right storage class for unpredictable access at scale, and Athena queries work natively against all Intelligent-Tiering access tiers."
      },
      {
        id: "D",
        text: "Enable Amazon S3 Storage Lens to identify infrequently accessed objects and manually move them to S3 Glacier Deep Archive.",
        isCorrect: false,
        explanation: "Wrong — S3 Storage Lens is an analytics tool that provides visibility into usage patterns, but manual tiering based on its reports adds significant operational overhead. Moving data to Glacier Deep Archive also means retrieval times of 12 hours (standard) or 48 hours (bulk), making ad-hoc Athena queries impractical for that data."
      }
    ],
    explanation: "S3 Intelligent-Tiering is purpose-built for large datasets with unpredictable or changing access patterns. It charges a small per-object monitoring fee but has NO retrieval fees, which makes it uniquely cost-effective compared to Standard-IA or Glacier Instant Retrieval for datasets with mixed access frequency. For Athena queries, all S3 Intelligent-Tiering tiers (except the optional async archive tiers) are immediately accessible, maintaining query performance. At 10 PB, even a 20-40% storage cost reduction represents substantial savings.",
    keywords: ["S3 Intelligent-Tiering", "unpredictable access", "no retrieval fees", "Athena", "storage cost", "10 PB"]
  },

  // ─────────────────────────────────────────────────────────────
  // D1 + D2 + D4  (Secure + resilient + cost-optimized)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-013",
    domain: 1,
    domains: [1, 2, 4],
    crossDomain: true,
    taskStatement: "1.2",
    services: ["vpc", "transit-gateway", "private-link", "nat-gateway"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company has 15 AWS accounts managed through AWS Organizations. Each account runs workloads in its own VPC, and all VPCs need to access a shared centralized service (a compliance-scanning API) hosted in a dedicated Services VPC. All inter-VPC traffic must remain on the AWS private network. The networking team reports that the current solution (VPC peering mesh) is becoming difficult to manage at scale. The finance team wants to reduce data-transfer costs. Which architecture BEST addresses security, manageability, and cost while keeping traffic private?",
    options: [
      {
        id: "A",
        text: "Replace VPC peering with AWS Transit Gateway. Attach all 16 VPCs to the Transit Gateway and use route tables to control connectivity. Enable centralized flow logging for all attachments.",
        isCorrect: false,
        explanation: "Wrong — AWS Transit Gateway solves the manageability problem (hub-and-spoke vs. mesh) but Transit Gateway charges per attachment ($0.05/hour per attachment) AND per GB of data processed ($0.02/GB). For 15 accounts plus the Services VPC, the hourly attachment cost alone is 16 × $0.05 × 720 = $576/month before data transfer costs. More importantly, Transit Gateway allows full mesh connectivity between all VPCs, which violates the principle of least-privilege network access to the shared service."
      },
      {
        id: "B",
        text: "Keep VPC peering for the most-used connections and add NAT Gateways in each spoke VPC to allow internet access to the compliance API endpoint over HTTPS.",
        isCorrect: false,
        explanation: "Wrong — routing traffic through NAT Gateways to reach a shared internal service sends traffic over the public internet (or at minimum charges NAT processing fees), violating the private-network requirement. This is also more expensive than a purpose-built private connectivity solution."
      },
      {
        id: "C",
        text: "Deploy an AWS PrivateLink interface endpoint in each spoke VPC to consume the compliance-scanning API from the Services VPC. The Services VPC exposes the API through a Network Load Balancer as a VPC Endpoint Service.",
        isCorrect: true,
        explanation: "Correct — AWS PrivateLink is specifically designed for this pattern: a service provider (Services VPC) exposes a service via NLB, and consumers create interface endpoints in their own VPCs. Traffic never leaves the AWS backbone. Unlike Transit Gateway, PrivateLink is unidirectional (consumers call the service; they cannot reach other spoke VPCs), enforcing least-privilege connectivity. Cost: interface endpoint ($0.01/hour per AZ) + data processing ($0.01/GB) — often cheaper than Transit Gateway for asymmetric hub-and-spoke service consumption."
      },
      {
        id: "D",
        text: "Upgrade to a full-mesh VPC peering configuration using AWS Resource Access Manager (RAM) to automate peering across all 15 accounts.",
        isCorrect: false,
        explanation: "Wrong — full-mesh VPC peering with 16 VPCs requires n(n-1)/2 = 120 peering connections. While peering itself is free, this is exactly the manageability problem the team is trying to solve. RAM simplifies sharing resources across accounts but does not reduce the number of peering connections needed."
      }
    ],
    explanation: "AWS PrivateLink provides the optimal combination: (1) Security — traffic stays on the AWS private network, never touching the internet; (2) Least-privilege network access — consumers can only reach the specific endpoint service, not each other's VPCs; (3) Manageability — each new account just creates an interface endpoint, no complex route table management; (4) Cost — typically cheaper than Transit Gateway for unidirectional service consumption. The NLB in the Services VPC is the service provider component; interface endpoints in each spoke VPC are the consumer components.",
    keywords: ["AWS PrivateLink", "VPC Endpoint Service", "private connectivity", "hub-and-spoke", "least privilege", "Transit Gateway vs PrivateLink"]
  },

  {
    id: "cd-014",
    domain: 2,
    domains: [1, 2, 4],
    crossDomain: true,
    taskStatement: "2.3",
    services: ["s3", "cross-region-replication", "kms", "lifecycle"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "A legal firm stores contract documents (average 200 KB, 50 million objects) in Amazon Simple Storage Service (Amazon S3) in us-east-1 with server-side encryption using AWS KMS customer-managed keys. Regulatory requirements mandate that a copy exist in a second AWS Region at all times. The firm must be able to read the replicated documents within seconds of a regional failure. The finance team wants to minimize ongoing replication and storage costs. Which configuration achieves compliance with the LOWEST cost?",
    options: [
      {
        id: "A",
        text: "Enable S3 Cross-Region Replication (CRR) to a destination bucket in us-west-2. Use S3 Standard storage class in both buckets. Apply a bucket key to reduce AWS KMS API request costs. Use the same customer-managed key (with a multi-Region replica in us-west-2).",
        isCorrect: false,
        explanation: "Wrong — using S3 Standard in the destination bucket charges full Standard pricing for 50 million objects (10 TB total). Since the replicated copy is a DR standby accessed only after a Regional failure, Standard storage pricing is unnecessarily expensive for infrequent-access replicas."
      },
      {
        id: "B",
        text: "Enable S3 Cross-Region Replication to a destination bucket in us-west-2. Configure replication to use S3 Standard-IA as the destination storage class. Enable S3 Bucket Key on both buckets to reduce per-object KMS API costs. Use a multi-Region KMS key for seamless decryption in us-west-2.",
        isCorrect: true,
        explanation: "Correct — four cost optimizations combine: (1) S3 Standard-IA in the destination reduces storage cost by ~58% vs. Standard for infrequently accessed DR copies; (2) S3 Bucket Key reduces KMS API request costs by ~99% by generating one data key per bucket-level key rather than per-object (critical at 50 million objects); (3) Multi-Region KMS key enables the destination Region to decrypt without cross-Region KMS API calls; (4) Standard-IA still provides millisecond access for fast recovery after a Regional failure."
      },
      {
        id: "C",
        text: "Enable S3 Cross-Region Replication with S3 Glacier Instant Retrieval as the destination storage class. Use S3 Bucket Key to reduce KMS costs.",
        isCorrect: false,
        explanation: "Wrong — S3 Glacier Instant Retrieval has millisecond access but charges a $0.03/GB retrieval fee. Reading 10 TB of contract documents after a Regional failure would incur ~$300 in retrieval fees per full read, plus the per-request retrieval cost for 50 million small objects. For a DR scenario requiring full dataset access, Standard-IA is more cost-effective."
      },
      {
        id: "D",
        text: "Use AWS Backup with cross-Region copy enabled to create daily backups in us-west-2. Restore from backup during a Regional failure.",
        isCorrect: false,
        explanation: "Wrong — daily backups create a maximum RPO of 24 hours. The requirement states 'a copy must exist at all times,' implying continuous replication, not periodic backup. S3 CRR provides continuous, object-level replication with near-zero RPO."
      }
    ],
    explanation: "The key insight is that the replicated bucket is a DR standby, not a frequently accessed production bucket. S3 Standard-IA is appropriate for data accessed less than once a month and provides immediate (millisecond) access at ~58% lower storage cost. S3 Bucket Key is critical at 50 million objects: without it, each object PUT and GET generates a KMS API call, resulting in enormous KMS request costs at scale. With Bucket Key, the cost per S3 request for KMS is reduced by approximately 99%. The multi-Region KMS key ensures the DR team can decrypt objects in us-west-2 without cross-Region KMS dependency.",
    keywords: ["S3 Cross-Region Replication", "S3 Bucket Key", "KMS cost", "Standard-IA", "multi-Region key", "50 million objects", "DR storage class"]
  },

  {
    id: "cd-015",
    domain: 1,
    domains: [1, 2, 4],
    crossDomain: true,
    taskStatement: "1.1",
    services: ["organizations", "scp", "config", "security-hub"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company with 50 AWS accounts in AWS Organizations needs a centralized security governance solution. Requirements: (1) Prevent member accounts from disabling AWS CloudTrail or Amazon GuardDuty. (2) Detect and auto-remediate unencrypted S3 buckets within 1 hour. (3) Aggregate all security findings into a single pane of glass. (4) Minimize per-account cost. Which combination of services and configurations meets ALL requirements at the lowest cost?",
    options: [
      {
        id: "A",
        text: "Deploy AWS Security Hub (with auto-enable for new accounts), enable AWS Config with the S3 encryption conformance pack and Auto Remediation using AWS Systems Manager Automation, and apply SCPs at the root OU to deny cloudtrail:StopLogging and guardduty:DisableOrganizationAdminAccount. Delegate Security Hub administration to a security account.",
        isCorrect: true,
        explanation: "Correct — each service addresses a distinct requirement: SCPs (free) prevent CloudTrail/GuardDuty disablement as a preventive control; AWS Config with the S3 encryption conformance pack and SSM Automation remediation detects and fixes unencrypted buckets within minutes (detective + remediation); Security Hub with organization integration aggregates findings from all accounts into the delegated admin account (single pane of glass) and supports per-account pricing with volume discounts. This combination covers all four requirements at optimized cost."
      },
      {
        id: "B",
        text: "Deploy Amazon Macie in all accounts to detect encryption issues, use AWS Lambda functions scheduled with Amazon EventBridge to check CloudTrail and GuardDuty status, and build a custom dashboard in Amazon CloudWatch.",
        isCorrect: false,
        explanation: "Wrong — Amazon Macie is designed for sensitive data discovery (PII, credentials), not general S3 encryption compliance. Lambda + EventBridge scheduled checks are detective but not preventive (someone can disable CloudTrail between check intervals). Building a custom security dashboard in CloudWatch is significantly more costly and operationally complex than using Security Hub's purpose-built aggregation."
      },
      {
        id: "C",
        text: "Use AWS Control Tower with pre-packaged guardrails to handle all requirements. Control Tower provides detective and preventive guardrails and a built-in dashboard.",
        isCorrect: false,
        explanation: "Wrong — AWS Control Tower is an excellent landing zone solution, but its built-in guardrails for S3 encryption are detective (Config rules), not remediation-capable. Control Tower does not include automatic remediation of non-compliant S3 buckets out of the box. Additionally, Control Tower's 'single pane of glass' for security findings is not equivalent to Security Hub's cross-account findings aggregation. Control Tower also adds per-account cost for its managed services."
      },
      {
        id: "D",
        text: "Enable Amazon Inspector in all accounts for vulnerability scanning and compliance checking, use AWS Trusted Advisor for cost and security recommendations, and use IAM permission boundaries to restrict account administrators from disabling CloudTrail.",
        isCorrect: false,
        explanation: "Wrong — Amazon Inspector focuses on EC2 instance and container vulnerability scanning, not S3 encryption compliance or CloudTrail monitoring. IAM permission boundaries only apply to principals they are explicitly attached to; an account administrator can create new IAM roles without permission boundaries. This combination does not meet the preventive control or centralized findings requirements."
      }
    ],
    explanation: "This is a governance architecture question with four distinct requirements that map to three services: (1) Preventive controls → SCPs (free, in Organizations); (2) Detective + remediation → AWS Config conformance packs + SSM Automation; (3) Aggregated findings → Security Hub delegated admin; (4) Cost minimization → all three services offer organization-level pricing with per-account charges that are lower than building equivalent custom solutions. The key insight is matching the right AWS service to each requirement type: preventive (SCP), detective+remediation (Config+SSM), and aggregation (Security Hub).",
    keywords: ["SCP", "AWS Config", "Security Hub", "auto-remediation", "SSM Automation", "centralized security", "preventive detective"]
  },

  // ─────────────────────────────────────────────────────────────
  // D1 + D3 + D4  (Secure + high-performing + cost-optimized)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-016",
    domain: 3,
    domains: [1, 3, 4],
    crossDomain: true,
    taskStatement: "3.2",
    services: ["api-gateway", "lambda", "cloudfront", "waf", "cognito"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A startup runs a REST API built on Amazon API Gateway (HTTP API) and AWS Lambda in us-east-1. The API serves authenticated users globally, with 80% of traffic concentrated on 10% of endpoints that return relatively static data (updated every 5 minutes). API response latency for users in Asia and Europe is 800–1200 ms. The company wants to reduce latency to under 100 ms for authenticated users, add DDoS protection, and keep costs under the current API Gateway spend. Which architecture achieves all three goals?",
    options: [
      {
        id: "A",
        text: "Migrate from API Gateway HTTP API to REST API to use API Gateway caching. Add an AWS WAF web ACL to the REST API. Enable usage plans with API keys.",
        isCorrect: false,
        explanation: "Wrong — API Gateway REST API caching only caches responses at the API Gateway layer in us-east-1. Users in Asia and Europe still experience the full round-trip to us-east-1, so latency remains high. Additionally, API Gateway REST API is significantly more expensive than HTTP API. API keys are not equivalent to authenticated user identity (Cognito). WAF on REST API adds cost per million requests."
      },
      {
        id: "B",
        text: "Place Amazon CloudFront in front of the API Gateway HTTP API with cache behaviors configured for the high-traffic endpoints (TTL 5 minutes). Add an AWS WAF web ACL to the CloudFront distribution. Configure CloudFront to forward the Authorization header for cache bypass on sensitive endpoints.",
        isCorrect: true,
        explanation: "Correct — CloudFront's 400+ edge PoPs serve cached API responses from locations near users in Asia and Europe, reducing latency from 800–1200 ms to under 50 ms for cache hits. TTL of 5 minutes matches the data freshness requirement. AWS WAF at the CloudFront layer provides DDoS protection and is cheaper than WAF at the API Gateway level for high-request volumes (CloudFront+WAF billing is per-WebACL + per-million requests, often cheaper than REST API). CloudFront edge caching can reduce origin Lambda invocations by up to 80% (matching the access pattern), significantly reducing Lambda and API Gateway costs."
      },
      {
        id: "C",
        text: "Deploy the Lambda functions in multiple Regions using Lambda@Edge and replicate the API Gateway to each Region with Amazon Route 53 latency-based routing.",
        isCorrect: false,
        explanation: "Wrong — deploying API Gateway to multiple Regions increases cost (multiple Regional deployments, multiple NAT Gateways if using VPC, multiple certificates). Lambda@Edge has limitations (max 5 MB response size, max 30 seconds timeout, no VPC support, limited AWS SDK support in viewer-request/response functions) that make it unsuitable for full API logic. Latency-based routing adds DNS TTL delays. This is over-engineered and more expensive."
      },
      {
        id: "D",
        text: "Enable API Gateway Edge-Optimized endpoint type (instead of Regional) and add AWS Shield Advanced for DDoS protection.",
        isCorrect: false,
        explanation: "Wrong — API Gateway Edge-Optimized uses CloudFront internally but does not support CloudFront caching behaviors for API responses (it routes to the Regional API endpoint without caching). AWS Shield Advanced costs $3,000/month — far more expensive than WAF alone for a startup budget. Neither change achieves sub-100ms latency for authenticated API calls."
      }
    ],
    explanation: "CloudFront in front of API Gateway HTTP API is the correct architecture for this scenario. CloudFront provides three simultaneous benefits: (1) Security — WAF integration for DDoS/application-layer protection at the edge, before traffic reaches the origin; (2) Performance — global PoP caching brings static API responses within 50 ms of users worldwide; (3) Cost — caching the 80% of traffic hitting static endpoints reduces Lambda invocations, API Gateway requests, and downstream service calls, typically lowering total spend vs. un-cached API calls. The Authorization header forwarding configuration allows per-user cache bypass when needed for sensitive endpoints.",
    keywords: ["CloudFront", "API Gateway", "WAF", "edge caching", "latency reduction", "global users", "TTL", "cost reduction"]
  },

  {
    id: "cd-017",
    domain: 1,
    domains: [1, 3, 4],
    crossDomain: true,
    taskStatement: "1.2",
    services: ["rds", "aurora", "kms", "performance-insights", "reserved-instances"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A company is migrating a HIPAA-regulated application to AWS. The database tier requires: (1) encryption at rest with customer-managed keys that the company controls and can rotate, (2) read latency under 2 ms for 10,000 concurrent read queries, (3) the ability to scale read capacity without downtime, and (4) a 40% cost reduction compared to the current on-premises Oracle database annual spend. A solutions architect proposes Amazon Aurora PostgreSQL with customer-managed KMS keys and up to five Read Replicas. The finance team objects that five replicas are too expensive. What is the MOST cost-effective Aurora configuration that still meets all four requirements?",
    options: [
      {
        id: "A",
        text: "Deploy Aurora PostgreSQL with one writer instance and one reader instance using db.r6g.8xlarge instances. Purchase 1-year Reserved Instances for both. Enable encryption with a customer-managed KMS key.",
        isCorrect: false,
        explanation: "Wrong — two large instances may not handle 10,000 concurrent read queries at sub-2ms latency depending on query complexity. More critically, the Reserved Instance commitment for oversized instances may cost more than right-sized instances with Aurora Auto Scaling. This approach sizes for peak without considering the elasticity options available."
      },
      {
        id: "B",
        text: "Use Amazon Aurora PostgreSQL Serverless v2 with encryption using a customer-managed KMS key. Aurora Serverless v2 automatically scales read and write capacity and costs less than provisioned instances.",
        isCorrect: false,
        explanation: "Wrong — Aurora Serverless v2 scales ACUs but does not automatically add Reader instances or Read Replicas. For 10,000 concurrent read connections requiring sub-2ms latency, the connection overhead and ACU scaling may not be as predictable as provisioned readers with a fixed connection pool. Aurora Serverless v2 is generally better for variable workloads with quieter periods, not sustained high-concurrency reads."
      },
      {
        id: "C",
        text: "Deploy Aurora PostgreSQL with one writer (right-sized, 1-year Reserved Instance) and use Aurora Auto Scaling to manage a fleet of Reader instances between a minimum of 1 and maximum of 5, right-sized based on actual load. Encrypt with a customer-managed KMS key.",
        isCorrect: true,
        explanation: "Correct — Aurora Auto Scaling adds/removes read replicas based on CPU or connections metrics, ensuring sub-2ms read latency under peak load while minimizing idle replica costs during off-peak hours. Reserving the writer (predictable 24/7 usage) saves 40–60% vs. On-Demand. Auto Scaling replicas can remain On-Demand since they are ephemeral. Customer-managed KMS key satisfies HIPAA encryption requirements. This achieves the 40% cost reduction vs. on-premises through right-sizing, reserved pricing, and elastic scaling."
      },
      {
        id: "D",
        text: "Use Amazon RDS for PostgreSQL Multi-AZ with Read Replicas and encrypt with an AWS-managed KMS key. AWS-managed keys are compliant with HIPAA requirements.",
        isCorrect: false,
        explanation: "Wrong — while AWS-managed keys (aws/rds) are technically acceptable for HIPAA, the requirement explicitly states customer-managed keys that the company controls and can rotate. AWS-managed keys rotate automatically on AWS's schedule; customer-managed keys can be rotated on demand and give the company direct control over key policy. This fails the specific encryption requirement."
      }
    ],
    explanation: "This question traps candidates who conflate HIPAA-acceptable encryption (AWS-managed keys technically qualify) with the explicit requirement for customer-controlled, rotateable keys. The optimal Aurora configuration balances all four constraints: Aurora's native replication layer provides sub-2ms read latency from replicas; Auto Scaling ensures read capacity scales with demand without pre-provisioning five replicas; Reserved pricing for the writer provides predictable cost savings; customer-managed KMS keys satisfy HIPAA key control requirements. The combination achieves the target cost reduction while maintaining compliance and performance.",
    keywords: ["Aurora Auto Scaling", "Read Replicas", "customer-managed KMS", "HIPAA", "Reserved Instances", "right-sizing", "10,000 concurrent reads"]
  },

  // ─────────────────────────────────────────────────────────────
  // D2 + D3 + D4  (Resilient + high-performing + cost-optimized)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-018",
    domain: 2,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "2.1",
    services: ["ec2", "auto-scaling", "savings-plans", "spot", "alb"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "A company runs a stateless web application on Amazon EC2 instances behind an Application Load Balancer. The application has a predictable 70% baseline load 24/7 and a variable peak of up to 3× baseline during business hours. The instances cannot be interrupted during active user requests. The company wants to maximize cost savings while maintaining availability across multiple Availability Zones. Which compute purchasing strategy BEST meets these requirements?",
    options: [
      {
        id: "A",
        text: "Purchase 1-year Standard Reserved Instances to cover the full peak capacity across all AZs.",
        isCorrect: false,
        explanation: "Wrong — covering full peak capacity (3× baseline) with Reserved Instances means paying for reserved capacity that sits idle 30% of the time (off-peak). Reserved Instances at peak sizing is over-provisioning and wastes the cost savings advantage of Reserved Instances, which are best for steady baseline usage."
      },
      {
        id: "B",
        text: "Use Compute Savings Plans to cover 70% of baseline at the committed spend level. Add an Auto Scaling group configured with a mix of On-Demand (20%) and Spot Instances (80%) to handle the variable peak, using Spot capacity rebalancing and instance diversification.",
        isCorrect: false,
        explanation: "Wrong — Spot Instances can be interrupted at any time with a 2-minute warning. Although the application is stateless, if a Spot instance is interrupted mid-request, that user request fails. The problem states instances cannot be interrupted during active requests. Using 80% Spot for peak traffic creates unacceptable interruption risk for in-flight requests."
      },
      {
        id: "C",
        text: "Use Compute Savings Plans to cover 70% baseline compute spend. Configure Auto Scaling with On-Demand instances (launch template using current-generation instance types) to handle the variable peak. Deploy across 3 AZs with minimum 1 instance per AZ.",
        isCorrect: true,
        explanation: "Correct — Compute Savings Plans provide up to 66% savings on the predictable 70% baseline without committing to specific instance types or AZs. On-Demand instances for the variable peak (0–2× baseline above the savings plan coverage) provide full availability without interruption risk. Multi-AZ deployment with minimum 1 instance per AZ ensures fault tolerance. The combination maximizes savings on the known baseline while maintaining flexibility and reliability for the peak."
      },
      {
        id: "D",
        text: "Use EC2 Instance Savings Plans for the full 70% baseline matched to a specific instance family and size, and Reserved Instances for the additional 30% variable peak.",
        isCorrect: false,
        explanation: "Wrong — EC2 Instance Savings Plans are tied to a specific instance family and Region, reducing flexibility. Purchasing Reserved Instances for variable peak capacity is inefficient: you pay for peak-sized reserved capacity that is unused during off-peak hours. Compute Savings Plans offer more flexibility and similar (or better) discounts for the baseline workload."
      }
    ],
    explanation: "The optimal cost/reliability strategy for a predictable-baseline + variable-peak workload: (1) Commit to baseline usage with Compute Savings Plans — these provide ~66% savings with maximum flexibility (any EC2 family, size, Region, OS); (2) Use On-Demand for peak burst — On-Demand instances have no interruption risk, satisfying the 'cannot be interrupted during active requests' constraint; (3) Multi-AZ deployment with Auto Scaling ensures HA and fault tolerance. Spot Instances are explicitly ruled out because they can receive a 2-minute interruption notice, which would drop active user connections.",
    keywords: ["Compute Savings Plans", "On-Demand", "Auto Scaling", "multi-AZ", "baseline vs peak", "cannot be interrupted", "stateless"]
  },

  {
    id: "cd-019",
    domain: 3,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "3.1",
    services: ["aurora", "global-database", "read-replica", "elasticache"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A global e-commerce company serves customers from North America, Europe, and Asia-Pacific. The application uses Amazon Aurora MySQL and requires: read latency under 10 ms for product catalog queries (90% of traffic), automatic failover within 60 seconds for write availability, and the ability to accept writes from any Region during normal operations. The company wants to achieve this with the minimum number of Aurora instances. Which configuration meets all requirements with the fewest instances?",
    options: [
      {
        id: "A",
        text: "Deploy Amazon Aurora Global Database with a primary cluster in us-east-1, secondary clusters in eu-west-1 and ap-southeast-1 (read-only). Use ElastiCache for Redis in each Region for product catalog caching. Accept that writes always go to us-east-1.",
        isCorrect: false,
        explanation: "Wrong — an Aurora Global Database secondary cluster cannot accept writes during normal operations (it is read-only until promoted). This fails the 'accept writes from any Region' requirement. Also, global database secondaries do have low-latency reads but adding ElastiCache in each Region increases both cost and instance count."
      },
      {
        id: "B",
        text: "Deploy separate Aurora MySQL clusters in each Region (us-east-1, eu-west-1, ap-southeast-1) with binlog-based replication between them. Each Region accepts writes and replicates to the others.",
        isCorrect: false,
        explanation: "Wrong — Aurora does not natively support multi-master binlog replication between clusters in different Regions with automatic conflict resolution. This would require a custom replication solution, which has high operational complexity and conflict-resolution challenges. Aurora Multi-Master was limited to a single Region and has been discontinued."
      },
      {
        id: "C",
        text: "Use Amazon Aurora Global Database and enable write forwarding on the secondary clusters. Secondary clusters can forward write requests to the primary, and ElastiCache for Redis in the primary Region handles catalog caching.",
        isCorrect: false,
        explanation: "Wrong — Aurora Global Database write forwarding routes secondary-Region writes to the primary Region over the network, meaning write latency from Asia to us-east-1 is still high (150+ ms). Under this architecture, writes from secondary Regions are not truly 'local' writes and cannot provide the same performance. This also does not meet the requirement to 'accept writes from any Region during normal operations' in the low-latency sense expected by a global e-commerce application."
      },
      {
        id: "D",
        text: "Deploy Amazon Aurora Global Database with one writer instance in us-east-1 and Aurora Auto Scaling reader instances (minimum 1) in each secondary cluster in eu-west-1 and ap-southeast-1. Use Aurora Global Database's managed failover (RPO < 1 second, RTO < 60 seconds) for write availability. Use the Regional reader endpoint in each Region for product catalog reads.",
        isCorrect: true,
        explanation: "Correct — Aurora Global Database achieves: (1) sub-10ms catalog read latency from local reader instances in each Region; (2) managed planned/unplanned failover within 60 seconds (Global Database managed failover promotes a secondary to new primary within ~60 seconds RTO); (3) minimum instances — one writer + auto-scaled readers in each Region is the minimum viable configuration. Write forwarding is not needed because the architecture accepts that writes go to the primary Region (the question says 'accept writes FROM any Region' which write forwarding supports, but the real performance concern is reads). Managed failover satisfies the 60-second write recovery requirement."
      }
    ],
    explanation: "Aurora Global Database is purpose-built for global applications requiring low-latency reads and cross-region resilience. Secondary cluster readers serve catalog queries with sub-10ms latency from local endpoints. The Global Database managed failover capability (distinct from the self-managed promotion in earlier Aurora versions) achieves near-zero RPO and sub-60 second RTO for write availability. Auto Scaling readers in secondary clusters handle read traffic while minimizing idle instances. This is the minimum-instance configuration that satisfies all three requirements.",
    keywords: ["Aurora Global Database", "managed failover", "secondary cluster", "read latency", "global writes", "minimum instances", "RTO 60 seconds"]
  },

  {
    id: "cd-020",
    domain: 4,
    domains: [2, 3, 4],
    crossDomain: true,
    taskStatement: "4.2",
    services: ["sqs", "lambda", "ecs", "fargate", "spot"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A data engineering team runs nightly batch jobs that process 10 TB of data each night. Jobs are broken into 500 independent tasks submitted to an Amazon SQS queue. Each task takes approximately 10 minutes and uses 4 vCPU and 16 GB RAM. Tasks are idempotent. The current solution uses 500 dedicated Amazon EC2 On-Demand instances (m5.xlarge) that run for 20 minutes each night (10 minutes of task processing + 10 minutes startup/shutdown) and then terminate. The team wants to cut compute costs by at least 60% without adding management overhead or increasing total job completion time. Which approach achieves this?",
    options: [
      {
        id: "A",
        text: "Switch to AWS Lambda with 10,240 MB memory and 10-minute maximum timeout to process each SQS message. Lambda scales automatically and charges only for duration.",
        isCorrect: false,
        explanation: "Wrong — Lambda's maximum execution timeout is 15 minutes, but the task processing plus Lambda cold start and initialization must complete within 15 minutes — this is tight. More critically, Lambda at 10,240 MB provides 6 vCPU maximum, but the tasks require 4 vCPU and 16 GB RAM. The real problem is cost: Lambda at 10,240 MB for 10 minutes × 500 tasks = approximately $0.01667 × 500 = $8.34 per night. This may not achieve 60% savings over current On-Demand costs depending on instance pricing, and Lambda has architectural differences from container-based compute."
      },
      {
        id: "B",
        text: "Replace On-Demand EC2 instances with AWS Fargate Spot tasks triggered by Amazon EventBridge Scheduler. Fargate Spot provides up to 70% savings over Fargate On-Demand and tasks are idempotent so interruptions are handled via SQS requeue.",
        isCorrect: true,
        explanation: "Correct — Fargate Spot provides up to 70% discount over Fargate On-Demand with no EC2 instance management overhead (satisfying the 'no management overhead' constraint). Tasks are idempotent, so Spot interruptions simply return the SQS message to the queue for retry. The SQS queue handles task distribution; ECS with Fargate Spot processes tasks from the queue. Starting 500 Fargate Spot tasks concurrently maintains the same total job completion time. This exceeds the 60% cost-reduction target with zero infrastructure management."
      },
      {
        id: "C",
        text: "Purchase 1-year EC2 Reserved Instances (m5.xlarge) sized for 500 concurrent instances. Reserved pricing saves approximately 40% vs. On-Demand.",
        isCorrect: false,
        explanation: "Wrong — Reserved Instances are billed for the full year regardless of usage. These instances run only 20 minutes per night (1/72 of a day) for approximately 365 nights. Paying for 24/7 reserved capacity for instances that run 0.014% of the time is extremely wasteful. The effective utilization is under 1.5%, making Reserved Instances the worst possible pricing model for this workload."
      },
      {
        id: "D",
        text: "Use EC2 Spot Instances (m5.xlarge) with a Spot Fleet to replace On-Demand instances. Configure the Spot Fleet with multiple instance types and use a lowest-price allocation strategy.",
        isCorrect: false,
        explanation: "Wrong — EC2 Spot Instances would achieve cost savings but still require EC2 fleet management (launch configurations, capacity provisioning, instance type selection, Spot Instance request management). The question explicitly states 'without adding management overhead.' Fargate removes all EC2 infrastructure management while Spot pricing provides equivalent or better savings."
      }
    ],
    explanation: "The trap in this question is recognizing that Reserved Instances are terrible for short-burst nightly workloads (only 20 min/night utilization = <1.5% utilization of reserved capacity). The correct solution — Fargate Spot — achieves the cost target while eliminating EC2 fleet management. Fargate Spot interruptions are handled gracefully because: (1) tasks are idempotent; (2) SQS visibility timeout returns interrupted messages to the queue; (3) other running Fargate Spot tasks continue processing. The result is a fully managed, serverless container platform with Spot-level pricing.",
    keywords: ["Fargate Spot", "SQS", "idempotent tasks", "batch processing", "nightly jobs", "no management overhead", "60% cost reduction"]
  },

  // ─────────────────────────────────────────────────────────────
  // D1 + D2 + D3 + D4  (All four domains)
  // ─────────────────────────────────────────────────────────────
  {
    id: "cd-021",
    domain: 1,
    domains: [1, 2, 3, 4],
    crossDomain: true,
    taskStatement: "1.2",
    services: ["s3", "cloudfront", "kms", "oac", "savings-plans"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A global media streaming platform delivers 4K video content to 50 million users worldwide. Content files (average 20 GB) are stored in Amazon Simple Storage Service (Amazon S3) in us-east-1, encrypted with customer-managed AWS Key Management Service (AWS KMS) keys for DRM compliance. Users in Asia experience 4-second buffering delays. The platform must prevent direct S3 URL access (only CloudFront signed URLs should work), maintain 99.99% availability, and reduce CDN costs by 30%. Which configuration addresses ALL four requirements?",
    options: [
      {
        id: "A",
        text: "Configure Amazon CloudFront with Origin Access Control (OAC) and signed URLs. Enable CloudFront continuous caching with a 24-hour TTL. Commit to a 1-year CloudFront Security Savings Bundle. Use S3 Intelligent-Tiering for original content files.",
        isCorrect: false,
        explanation: "Wrong — S3 Intelligent-Tiering incurs a per-object monitoring fee and may move content to Archive tiers if not accessed for 90+ days. For 4K video masters that are source files (not frequently accessed but needed on-demand for transcoding), Intelligent-Tiering monitoring costs at 20 GB average objects would be minimal, but the potential archival of source files could cause retrieval delays. More critically, this option does not address CloudFront cost reduction through origin shield."
      },
      {
        id: "B",
        text: "Configure Amazon CloudFront with Origin Access Control (OAC) to restrict S3 access, use CloudFront signed URLs for content authorization, enable CloudFront Origin Shield in a Region near us-east-1 to reduce S3 origin fetches, commit to a 1-year CloudFront Security Savings Bundle for cost reduction, and configure multi-origin failover (S3 primary + S3 in us-west-2 replica as failover) for 99.99% availability.",
        isCorrect: true,
        explanation: "Correct — OAC ensures only CloudFront can read from S3 (security, satisfying DRM/direct access prevention). Signed URLs restrict per-user content access. Origin Shield acts as a caching layer between edge PoPs and the S3 origin, reducing origin fetches by 60–80% (lowers S3 request costs and CDN-origin transfer costs, helping achieve 30% cost reduction). CloudFront Security Savings Bundle reduces CloudFront costs 30–35% for committed usage. Multi-origin failover with a replicated S3 bucket in us-west-2 provides origin redundancy for 99.99% availability. OAC supports SSE-KMS, satisfying the encryption requirement."
      },
      {
        id: "C",
        text: "Use S3 presigned URLs (1-hour expiration) directly from the application, bypass CloudFront to reduce CDN costs, and replicate S3 to multiple Regions for availability.",
        isCorrect: false,
        explanation: "Wrong — removing CloudFront eliminates the primary mechanism for global content delivery, dramatically worsening latency for Asian users (4-second buffering would become worse). S3 presigned URLs do not provide CDN caching, edge delivery, or DDoS protection. Origin-to-user latency for 20 GB 4K video files directly from S3 in us-east-1 to Asia would be severely degraded."
      },
      {
        id: "D",
        text: "Enable CloudFront Edge-Optimized API Gateway in front of S3, use Lambda@Edge for signed URL validation, and deploy S3 Cross-Region Replication to 3 Regions for availability.",
        isCorrect: false,
        explanation: "Wrong — API Gateway in front of S3 for video streaming is an anti-pattern: API Gateway has a maximum response size of 10 MB (REST API) or 10 MB (HTTP API), which is far below the 20 GB average video file size. Lambda@Edge for URL validation adds latency and compute cost at every edge invocation. This architecture cannot stream large video files through API Gateway."
      }
    ],
    explanation: "This full four-domain question requires understanding that each component serves multiple constraints simultaneously: (1) OAC → Security (S3 lockdown) + works with KMS; (2) Signed URLs → Security (per-user authorization); (3) Origin Shield → Performance (fewer cache misses for Asian users) + Cost (fewer S3 origin fetch charges); (4) CloudFront Savings Bundle → Cost (30% reduction on committed CDN spend); (5) Multi-origin S3 failover → Resilience (99.99% availability). CloudFront Origin Shield is the often-overlooked service that provides both a performance and cost benefit for high-traffic streaming workloads.",
    keywords: ["CloudFront Origin Shield", "OAC", "signed URLs", "KMS", "99.99% availability", "multi-origin failover", "CloudFront Savings Bundle", "DRM"]
  },

  {
    id: "cd-022",
    domain: 2,
    domains: [1, 2, 3, 4],
    crossDomain: true,
    taskStatement: "2.2",
    services: ["aurora", "global-database", "kms", "rds-proxy", "savings-plans"],
    constraintType: "ha",
    difficulty: 5,
    type: "single",
    stem: "A multinational bank runs a core banking application on Amazon Aurora PostgreSQL. Regulatory requirements: (1) Data must be encrypted with customer-managed KMS keys that are independently auditable per Region. (2) The database must survive a full AWS Region failure with RTO under 15 minutes and RPO under 1 minute. (3) The primary Region database must handle 20,000 concurrent connections from Lambda functions without degrading query performance. (4) Total database infrastructure cost must be reduced by 25% from the current Multi-AZ-only setup. A solutions architect recommends Aurora Global Database with multi-Region KMS keys and RDS Proxy. Which option correctly describes the COMPLETE solution?",
    options: [
      {
        id: "A",
        text: "Deploy Aurora Global Database (primary in us-east-1, secondary in eu-west-1). Use a single KMS key replicated via AWS KMS multi-Region keys to both Regions. Deploy RDS Proxy in front of the Aurora primary to manage Lambda connections. Purchase Aurora Reserved Instances for the primary cluster writer.",
        isCorrect: false,
        explanation: "Wrong — this is almost correct but uses a single multi-Region key replicated to both Regions. While multi-Region keys have the same key material, the requirement states 'independently auditable per Region.' A single key with a replica has a single key policy. Truly independent per-Region audit trails and key policies require separate customer-managed CMKs in each Region (configured as the encryption key for each Aurora cluster independently). The distinction matters for regulatory compliance."
      },
      {
        id: "B",
        text: "Deploy Aurora Global Database (primary in us-east-1, secondary in eu-west-1). Use separate customer-managed KMS keys in each Region (us-east-1 CMK for primary cluster, eu-west-1 CMK for secondary cluster). Deploy RDS Proxy in front of the primary Aurora cluster. Purchase Compute Savings Plans to cover Aurora instance costs. Enable Aurora Auto Scaling for reader instances in both Regions.",
        isCorrect: true,
        explanation: "Correct — separate CMKs per Region provides independent key policies, independent CloudTrail audit trails, and independent key rotation schedules (satisfying regulatory requirement 1). Aurora Global Database managed failover achieves RTO < 15 minutes and RPO < 1 minute (requirement 2). RDS Proxy handles 20,000 concurrent Lambda connections by multiplexing them into a smaller Aurora connection pool (requirement 3 — Aurora has a maximum connection limit based on instance memory; without Proxy, 20,000 connections would exhaust resources). Compute Savings Plans + Aurora Auto Scaling (scale in readers when not needed) reduces idle infrastructure costs by 25%+ (requirement 4)."
      },
      {
        id: "C",
        text: "Deploy Aurora Global Database with write forwarding enabled. Use the same CMK in both Regions by sharing the key ARN. Lambda functions connect directly to Aurora without a proxy. Use 1-year Reserved Instances for all Aurora instances.",
        isCorrect: false,
        explanation: "Wrong — sharing a CMK ARN across Regions is not directly possible for standard CMKs (they are Region-specific). Write forwarding routes writes from secondary to primary over the network, adding latency for write operations. Lambda connecting directly to Aurora at 20,000 concurrent connections will exhaust Aurora's connection limit, causing connection refused errors (no RDS Proxy). Reserved Instances for all Aurora instances (including auto-scaled readers) over-provisions for variable load."
      },
      {
        id: "D",
        text: "Deploy Aurora Multi-AZ in us-east-1 (primary) and us-west-2 (secondary) as two separate clusters with cross-Region automated backups. Use separate CMKs per Region. RDS Proxy manages Lambda connections. Reserved Instances cover both clusters.",
        isCorrect: false,
        explanation: "Wrong — two separate Aurora Multi-AZ clusters with cross-Region backup is not equivalent to Aurora Global Database. Cross-Region automated backup RPO is limited by backup frequency (not sub-minute) and RTO for restore is 15–60+ minutes for large databases. This fails both the RTO (<15 min) and RPO (<1 min) requirements. Aurora Global Database is required for these targets."
      }
    ],
    explanation: "This all-four-domain question has a subtle trap on the KMS requirement: 'independently auditable per Region' means separate CMKs with separate key policies and separate CloudTrail audit trails — a multi-Region key replica (same key material, different ARN) may or may not satisfy this depending on regulatory interpretation, but separate CMKs definitively do. The other three requirements map cleanly to well-known services: Aurora Global Database for DR, RDS Proxy for connection management at scale, and Compute Savings Plans + Aurora Auto Scaling for cost reduction.",
    keywords: ["Aurora Global Database", "independent KMS keys per Region", "RDS Proxy", "20,000 connections", "Compute Savings Plans", "RTO RPO", "regulatory compliance"]
  },

  {
    id: "cd-023",
    domain: 3,
    domains: [1, 2, 3, 4],
    crossDomain: true,
    taskStatement: "3.3",
    services: ["dynamodb", "dax", "kms", "vpc-endpoint", "on-demand-capacity"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A real-time fraud detection system uses Amazon DynamoDB to store and query transaction records. Requirements: (1) Read latency must be under 1 ms for single-item lookups. (2) The table processes irregular bursts of up to 500,000 read capacity units per second during fraud events. (3) All data must be encrypted with customer-managed KMS keys. (4) The system must minimize read costs given that fraud events are unpredictable and 95% of time the read load is under 10,000 RCU/second. Which architecture meets ALL requirements at the lowest cost?",
    options: [
      {
        id: "A",
        text: "Configure DynamoDB with Provisioned capacity at 500,000 RCU with Auto Scaling. Enable encryption with a customer-managed KMS key. Use DynamoDB Accelerator (DAX) for sub-millisecond reads.",
        isCorrect: false,
        explanation: "Wrong — provisioning 500,000 RCU at all times (even with Auto Scaling with a minimum of 500,000) is extremely costly for a system that operates under 10,000 RCU 95% of the time. Auto Scaling has a cooldown period and does not instantly scale to 500,000 RCU from a low baseline. DynamoDB On-Demand handles instant bursts better than provisioned + Auto Scaling for unpredictable spikes."
      },
      {
        id: "B",
        text: "Configure DynamoDB with On-Demand capacity mode. Deploy a DAX cluster in the application's VPC with encryption at rest using the same customer-managed KMS key. Create a DynamoDB VPC Gateway Endpoint to keep DAX-to-DynamoDB traffic private.",
        isCorrect: true,
        explanation: "Correct — On-Demand mode handles instant bursts to 500,000 RCU without pre-provisioning, paying only for actual reads consumed. At 95% low-load utilization, On-Demand is more cost-effective than provisioning for peak (no idle capacity charges). DAX provides sub-millisecond (<1 ms) single-item lookup latency. DAX with customer-managed KMS key encryption satisfies requirement 3. VPC Gateway Endpoint ensures DAX-to-DynamoDB traffic (cache misses) stays on the private AWS network, adding a free security and performance benefit."
      },
      {
        id: "C",
        text: "Configure DynamoDB with Provisioned capacity at 10,000 RCU (average load) and enable DynamoDB Auto Scaling. During fraud events, Auto Scaling will increase capacity. Use DAX for caching.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB Auto Scaling responds to sustained utilization over time (typically 2–5 minutes to scale up). Instantaneous bursts to 500,000 RCU during fraud events will exceed provisioned capacity immediately, causing throttling before Auto Scaling can react. On-Demand mode eliminates this problem by handling any burst instantly."
      },
      {
        id: "D",
        text: "Use Amazon ElastiCache for Redis instead of DAX for caching transaction records. Redis supports more data structures and can handle the read load. Configure DynamoDB with On-Demand capacity.",
        isCorrect: false,
        explanation: "Wrong — while ElastiCache for Redis with On-Demand DynamoDB would work, it introduces custom cache population logic, cache invalidation code, and data synchronization overhead. DAX is a drop-in DynamoDB-compatible cache with minimal code changes. For a fraud detection system querying DynamoDB directly, DAX is purpose-built for this use case and simpler to operate."
      }
    ],
    explanation: "On-Demand DynamoDB is the correct capacity mode for workloads with unpredictable, extreme bursts combined with long periods of low utilization. On-Demand charges per request (not per provisioned capacity), so 95% of time at low load is inexpensive. During fraud bursts, On-Demand scales instantly to accommodate the load. DAX adds the sub-millisecond cache layer for repeated single-item lookups. The VPC Gateway Endpoint is a free addition that improves both security and network performance. The combination is optimized for all four constraints: performance (DAX), resilience (DynamoDB's built-in HA), security (CMK encryption), and cost (On-Demand pays for what you use).",
    keywords: ["DynamoDB On-Demand", "DAX", "customer-managed KMS", "VPC Gateway Endpoint", "unpredictable bursts", "sub-millisecond", "fraud detection"]
  },

  {
    id: "cd-024",
    domain: 4,
    domains: [1, 2, 3, 4],
    crossDomain: true,
    taskStatement: "4.1",
    services: ["ec2", "spot", "savings-plans", "alb", "auto-scaling"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A company runs a microservices e-commerce platform with 12 services on Amazon EC2 instances behind Application Load Balancers. Historical data shows: 60% of compute is used 24/7 (always-on baseline), 30% is used only during business hours (predictable), and 10% handles sudden traffic spikes (unpredictable, cannot be interrupted once serving a request). The engineering team has identified that certain services handle database write operations and require exactly the same instance type for driver compatibility. The company wants to reduce EC2 costs by at least 55%. Which purchasing strategy achieves the HIGHEST savings while meeting all constraints?",
    options: [
      {
        id: "A",
        text: "Purchase EC2 Instance Savings Plans at 60% commit level for the baseline. Use Spot Instances for the business-hours predictable component. Use On-Demand for spikes.",
        isCorrect: false,
        explanation: "Wrong — Spot Instances for the business-hours predictable component can be interrupted, including mid-request if a Spot interruption occurs. The question states the 10% spike traffic cannot be interrupted, but the 30% predictable component also represents serving active requests. Using Spot for a substantial portion of request-serving traffic creates unacceptable interruption risk and may violate SLAs."
      },
      {
        id: "B",
        text: "Purchase Compute Savings Plans at the 60% baseline commit level. Use Scheduled Reserved Instances for the 30% predictable business-hours component. Use On-Demand for the 10% spike traffic.",
        isCorrect: false,
        explanation: "Wrong — AWS no longer sells new Scheduled Reserved Instances. This is a deprecated offering. The concept of scheduled capacity is now addressed by capacity reservations or instance scheduling, but Scheduled RIs are not a current purchasing option on the SAA-C03 exam's current service roster."
      },
      {
        id: "C",
        text: "Purchase EC2 Instance Savings Plans for the 60% always-on baseline (matched to the specific instance types required for database write services). Purchase Compute Savings Plans for the remaining 30% predictable business-hours workload. Use On-Demand for the 10% unpredictable spike traffic.",
        isCorrect: true,
        explanation: "Correct — EC2 Instance Savings Plans (up to 72% savings) are appropriate for the database write services that require a specific instance type and cannot flex to other families. The remaining baseline workload uses Compute Savings Plans (66% savings) for flexibility across instance families. The predictable 30% business-hours component is covered by extending Compute Savings Plans commitment to cover that usage (since Savings Plans apply to any usage regardless of time of day). On-Demand for the 10% spike traffic ensures zero interruption risk. Combined savings: ~66-72% on 90% of compute = well over 55% total reduction."
      },
      {
        id: "D",
        text: "Purchase 3-year Standard Reserved Instances for all 12 services sized for peak load. Three-year Reserved Instances provide the maximum 72% discount.",
        isCorrect: false,
        explanation: "Wrong — sizing all 12 services at peak load for a 3-year commitment means paying for peak capacity during the 70% of time when demand is below peak. The effective utilization of the reserved capacity would be low, and the 3-year lock-in removes flexibility for architecture changes. Total effective savings are lower than a Savings Plans + On-Demand mix when accounting for idle reserved capacity."
      }
    ],
    explanation: "The trap here requires knowing the difference between Compute Savings Plans and EC2 Instance Savings Plans: Compute SPs are flexible (any family, Region, OS) but max 66% discount; Instance SPs are tied to a family and Region but provide up to 72% discount. For services with driver-compatibility constraints (requiring a specific instance type), Instance SPs are appropriate and provide higher savings. For flexible services, Compute SPs maximize flexibility. The key insight: Savings Plans apply to usage 24/7, so the combined commitment can cover both the always-on baseline AND a portion of predictable business-hours usage. On-Demand for the spike 10% maintains availability. This tiered approach achieves 55%+ savings.",
    keywords: ["EC2 Instance Savings Plans", "Compute Savings Plans", "On-Demand", "specific instance type", "driver compatibility", "55% savings", "tiered purchasing"]
  },

  {
    id: "cd-025",
    domain: 1,
    domains: [1, 2, 3, 4],
    crossDomain: true,
    taskStatement: "1.1",
    services: ["iam", "organizations", "control-tower", "config", "cost-explorer"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "An enterprise with 200 AWS accounts wants to enforce the following simultaneously: (1) No account can deploy resources outside of approved AWS Regions (us-east-1, eu-west-1, ap-southeast-1) for data sovereignty. (2) All new EC2 instances must be tagged with 'CostCenter' or they cannot launch. (3) All S3 buckets must have server-side encryption enabled, and non-compliant buckets must be auto-remediated within 30 minutes. (4) The security team must review and approve all changes to IAM policies in production accounts before they take effect. Which combination of AWS services and configurations implements ALL four requirements?",
    options: [
      {
        id: "A",
        text: "(1) SCP with Deny for all actions where aws:RequestedRegion not in approved list. (2) SCP with Deny for ec2:RunInstances unless aws:RequestTag/CostCenter is present. (3) AWS Config rule 's3-bucket-server-side-encryption-enabled' with SSM Automation remediation. (4) AWS IAM Access Analyzer with notifications to the security team.",
        isCorrect: false,
        explanation: "Wrong — (4) fails. IAM Access Analyzer identifies external or cross-account access findings and generates findings for overly permissive policies, but it is a detective and advisory tool. It does not prevent IAM policy changes from taking effect or enforce a human review/approval gate before changes are applied. Access Analyzer cannot create a 'change freeze' on IAM policies."
      },
      {
        id: "B",
        text: "(1) AWS Config managed rule 'approved-amis-by-region' to flag out-of-region resources. (2) AWS Config rule to check for missing 'CostCenter' tags on EC2 instances. (3) AWS Config rule with Lambda auto-remediation for S3 encryption. (4) AWS CloudTrail with CloudWatch alarms for IAM API calls.",
        isCorrect: false,
        explanation: "Wrong — (1) and (2) fail. AWS Config rules are detective: they identify non-compliance after resources are created but do not prevent deployment. The question requires preventing resource creation outside approved Regions and preventing EC2 launch without the required tag. Only SCPs (preventive controls) can block API calls before they execute."
      },
      {
        id: "C",
        text: "(1) SCP Deny for all actions with aws:RequestedRegion condition not matching approved Regions. (2) SCP Deny for ec2:RunInstances where aws:RequestTag/CostCenter key is missing. (3) AWS Config 's3-bucket-server-side-encryption-enabled' rule with AWS Systems Manager Automation remediation on NON_COMPLIANT findings, targeting 30-minute evaluation frequency. (4) AWS CloudFormation Hooks (pre-provision hook) that calls a Lambda function to validate IAM policy changes and pause for approval via AWS Step Functions human approval task.",
        isCorrect: true,
        explanation: "Correct — (1) Region restriction SCP uses aws:RequestedRegion global condition key as a preventive control; (2) Tag enforcement SCP uses aws:RequestTag condition to deny EC2 launch without required tag; (3) Config rule + SSM Automation provides detective + remediation for S3 encryption within the evaluation window; (4) CloudFormation Hooks intercept resource creation/update API calls in CloudFormation templates and can call a Lambda that triggers a Step Functions workflow with a human approval task — this creates the required pre-change approval gate for IAM policies deployed via IaC."
      },
      {
        id: "D",
        text: "(1) Deploy AWS Control Tower and enable the 'Disallow resource creation in non-approved Regions' detective guardrail. (2) Use AWS Service Catalog with launch constraints that enforce tagging. (3) Enable Amazon Macie on all S3 buckets to detect unencrypted data. (4) Use AWS Config Advanced Queries to monitor IAM policy changes.",
        isCorrect: false,
        explanation: "Wrong — (1) Control Tower detective guardrails detect but do not prevent resource creation. (2) Service Catalog launch constraints apply only to resources provisioned through Service Catalog, not all EC2 launches. (3) Amazon Macie identifies sensitive data classifications, not encryption configuration compliance. (4) AWS Config Advanced Queries is a reporting tool, not a pre-change approval mechanism. None of requirements (1), (2), or (4) are met with preventive or approval controls."
      }
    ],
    explanation: "This enterprise governance question tests the distinction between preventive controls (SCPs, CloudFormation Hooks) and detective/remediation controls (Config rules + SSM Automation). Requirements 1 and 2 explicitly require preventing resource creation — only SCPs can do this as guardrails evaluated before the API call executes. Requirement 3 is satisfied by detective + auto-remediation (Config + SSM). Requirement 4 is the hardest: creating a pre-change human approval gate for IAM policies requires an IaC-native mechanism — CloudFormation Hooks intercept AWS CloudFormation resource operations and can enforce approval workflows. This is an advanced architecture pattern tested at the top end of SAA-C03 difficulty.",
    keywords: ["SCP region restriction", "aws:RequestedRegion", "tag enforcement", "CloudFormation Hooks", "Step Functions approval", "Config SSM remediation", "preventive vs detective"]
  }
]
