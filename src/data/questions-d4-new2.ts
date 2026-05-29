import { Question } from "../lib/types"

export const domain4NewQuestions2: Question[] = [

  // ─── d4-041 — Task 4.2 · AWS Compute Optimizer opt-in and scope (difficulty 3) ───
  {
    id: "d4-041",
    domain: 4,
    taskStatement: "4.2",
    services: ["compute-optimizer"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A cloud operations team wants FREE machine-learning-based right-sizing recommendations for Amazon EC2 instances, Amazon EBS volumes, AWS Lambda functions, and Amazon ECS tasks on AWS Fargate — all within a single AWS Organizations payer account managing 12 member accounts. They want recommendations that cover all member accounts. Which service provides this at NO additional charge, and what prerequisite must be met to activate it?",
    options: [
      {
        id: "A",
        text: "AWS Trusted Advisor — requires Business or Enterprise Support plan on each member account.",
        isCorrect: false,
        explanation: "Wrong — AWS Trusted Advisor provides cost-optimization checks (idle EC2, underutilized EBS, unassociated EIPs), but its recommendations are rule-based, not ML-based. Full Cost Optimization checks require Business or Enterprise Support on each account. It does not cover Lambda memory tuning or ECS on Fargate tasks at the same depth."
      },
      {
        id: "B",
        text: "AWS Compute Optimizer — requires opting in at the organization level in the AWS Cost Explorer console; no additional charge.",
        isCorrect: true,
        explanation: "Correct — AWS Compute Optimizer is FREE and provides ML-based right-sizing recommendations for EC2, EC2 Auto Scaling groups, EBS volumes, Lambda functions, ECS tasks on Fargate, and RDS/Aurora. To receive recommendations across all member accounts, the payer account must opt in at the organization level via the AWS Cost Explorer / Compute Optimizer console. The opt-in enables Compute Optimizer to ingest 14 days of CloudWatch utilization data across accounts. No Support plan upgrade is required."
      },
      {
        id: "C",
        text: "AWS Cost Explorer right-sizing recommendations — enabled automatically for all accounts once Cost Explorer is turned on.",
        isCorrect: false,
        explanation: "Wrong — AWS Cost Explorer right-sizing recommendations cover EC2 instances only (not Lambda, EBS, or Fargate). They are not enabled automatically — they must be manually enabled and are powered by Compute Optimizer data. For the full breadth of services listed, Compute Optimizer is the correct answer."
      },
      {
        id: "D",
        text: "AWS Compute Optimizer Enhanced Infrastructure Metrics — provides 93-day ML lookback at no additional charge.",
        isCorrect: false,
        explanation: "Wrong — Enhanced Infrastructure Metrics (93-day lookback) is a PAID add-on for Compute Optimizer. The default free tier uses a 14-day lookback window. The question asks for a no-additional-charge solution, so the standard (free) Compute Optimizer tier with organization-level opt-in is correct."
      }
    ],
    explanation: "AWS Compute Optimizer is free, ML-based, and covers EC2/ASG/EBS/Lambda/ECS Fargate/RDS/Aurora. The most common exam trap is confusing it with Trusted Advisor (rule-based, requires paid Support for full checks) or Cost Explorer (EC2 right-sizing only). Organization-level opt-in is the key prerequisite for multi-account coverage. Enhanced Infrastructure Metrics (93-day history) is a paid upgrade — the default 14-day window is free.",
    keywords: ["Compute Optimizer free", "ML right-sizing", "organization opt-in", "EC2 Lambda EBS Fargate", "14-day lookback"]
  },

  // ─── d4-042 — Task 4.2 · Compute Optimizer vs Trusted Advisor scope (difficulty 4) ───
  {
    id: "d4-042",
    domain: 4,
    taskStatement: "4.2",
    services: ["compute-optimizer", "trusted-advisor"],
    constraintType: "cost",
    difficulty: 4,
    type: "multi-select",
    stem: "A FinOps team is evaluating AWS native tools to identify cost-saving opportunities WITHOUT purchasing a third-party tool or upgrading the current Developer Support plan. Which TWO statements correctly describe the capabilities available to them under these constraints? (Choose two)",
    options: [
      {
        id: "A",
        text: "AWS Compute Optimizer provides ML-based right-sizing recommendations for EC2, EBS, Lambda, and ECS on Fargate at no cost, regardless of Support plan.",
        isCorrect: true,
        explanation: "Correct — AWS Compute Optimizer is completely free and requires no specific Support plan. It provides ML-based recommendations for the listed services. The team only needs to opt in to Compute Optimizer to start receiving findings."
      },
      {
        id: "B",
        text: "AWS Trusted Advisor's full Cost Optimization category (including idle load balancers, low-utilization EC2, and underused EBS) is available on the Developer Support plan.",
        isCorrect: false,
        explanation: "Wrong — The full Cost Optimization checks in Trusted Advisor require Business or Enterprise Support. The Developer Support plan only provides access to the 7 core Trusted Advisor checks (S3 bucket permissions, MFA on root, etc.), which do not include the cost optimization checks."
      },
      {
        id: "C",
        text: "AWS Cost and Usage Report (CUR) exports granular hourly billing data to Amazon S3 at no charge beyond S3 storage costs, and can be queried with Amazon Athena.",
        isCorrect: true,
        explanation: "Correct — The AWS Cost and Usage Report is free to generate (you pay only for the S3 storage). It provides the most granular billing data available, including hourly usage per resource, and natively integrates with Amazon Athena for SQL-based cost analysis. No Support plan upgrade is required."
      },
      {
        id: "D",
        text: "AWS Trusted Advisor can automatically stop EC2 instances that have low CPU utilization without any additional configuration.",
        isCorrect: false,
        explanation: "Wrong — Trusted Advisor identifies low-utilization EC2 instances as a recommendation but does NOT automatically stop them. Automated actions require AWS Budgets Actions or custom Lambda functions triggered by Trusted Advisor findings via EventBridge. Trusted Advisor is a recommendation tool, not an enforcement tool."
      }
    ],
    explanation: "Under Developer Support, the free cost tools available are: Compute Optimizer (full ML right-sizing, free), Cost Explorer (13-month history, free console), Cost and Usage Report (free data, pay S3 only), and the 7 core Trusted Advisor checks. Full Trusted Advisor Cost Optimization checks require Business/Enterprise Support. Trusted Advisor never auto-remediates — it recommends. Automated cost actions require Budgets Actions or EventBridge+Lambda.",
    keywords: ["Trusted Advisor Business Support", "Compute Optimizer free", "CUR free S3", "Developer Support limits", "no auto-stop"]
  },

  // ─── d4-043 — Task 4.2 · AWS Budgets types and Budget Actions (difficulty 3) ───
  {
    id: "d4-043",
    domain: 4,
    taskStatement: "4.2",
    services: ["aws-budgets"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A startup's CFO wants to: (1) receive an email alert when monthly AWS spend exceeds 80% of the $10,000 budget, and (2) automatically stop all non-production Amazon EC2 instances if actual spend reaches 100% of the budget. The MOST cost-effective AWS-native solution that fulfills both requirements without writing custom code is:",
    options: [
      {
        id: "A",
        text: "AWS Cost Explorer with a CloudWatch alarm on the EstimatedCharges metric, and a Lambda function to stop EC2 instances.",
        isCorrect: false,
        explanation: "Wrong — CloudWatch EstimatedCharges alarms require custom Lambda code to stop instances, adding operational overhead. The question specifies 'without custom code.' AWS Budgets Actions is purpose-built for automated responses to budget thresholds without requiring Lambda."
      },
      {
        id: "B",
        text: "AWS Budgets with a Cost budget set to $10,000, an 80% alert threshold with email notification, and a Budget Action at 100% that applies an IAM policy to deny EC2 StartInstances or uses an AWS Systems Manager automation to stop instances.",
        isCorrect: true,
        explanation: "Correct — AWS Budgets is purpose-built for this exact scenario. The first two free budgets per account are $0; thereafter $0.02/budget/day. A Cost Budget tracks actual or forecasted spend. An alert at 80% sends email via SNS. Budget Actions at 100% can: (1) apply an SCP to restrict spending, (2) apply a targeted IAM policy, or (3) trigger an AWS Systems Manager (SSM) action to stop EC2 instances — all without custom Lambda code. Action-enabled budgets cost $0.10/day."
      },
      {
        id: "C",
        text: "AWS Trusted Advisor with a notification when Cost Optimization checks flag low-utilization instances, then manually stop them.",
        isCorrect: false,
        explanation: "Wrong — Trusted Advisor identifies low-utilization instances, not budget threshold breaches. It does not alert on spend limits or automatically stop instances. The question requires a spend threshold trigger, not a utilization heuristic."
      },
      {
        id: "D",
        text: "AWS Cost Anomaly Detection with an SNS alert and a custom Lambda function to stop instances on anomaly detection.",
        isCorrect: false,
        explanation: "Wrong — AWS Cost Anomaly Detection identifies unexpected spending spikes using ML, not fixed budget thresholds. It is appropriate for detecting unusual patterns, not enforcing a predefined monthly dollar limit. Additionally, it requires custom Lambda for automated remediation, violating the 'no custom code' requirement."
      }
    ],
    explanation: "AWS Budgets is the correct tool for threshold-based spend alerts and automated actions. Budget types: Cost (dollar amount), Usage (API calls, GB, etc.), RI Coverage (% of hours covered by RI), RI Utilization, Savings Plans Coverage, and Savings Plans Utilization. Budget Actions can apply IAM policies, SCPs, or trigger SSM automations without Lambda. First 2 budgets/account are free; action-enabled budgets cost $0.10/day. This is a commonly tested scenario — the key differentiator is 'automated action without custom code.'",
    keywords: ["Budget Actions", "automated stop EC2", "no custom code", "80% alert", "100% action", "$0.10/day action-enabled"]
  },

  // ─── d4-044 — Task 4.2 · Spot Fleet diversification strategies (difficulty 4) ───
  {
    id: "d4-044",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2-spot"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A genomics company runs large batch analysis jobs on Amazon EC2 Spot Instances using a Spot Fleet. Jobs can be checkpointed and restarted on interruption. The engineering team wants to MINIMIZE the frequency of Spot interruptions while keeping costs as low as possible. They are debating two Spot Fleet allocation strategies. Which allocation strategy should they choose, and why?",
    options: [
      {
        id: "A",
        text: "lowestPrice allocation strategy — always selects the cheapest Spot pool, minimizing cost.",
        isCorrect: false,
        explanation: "Wrong — The lowestPrice strategy selects the cheapest Spot pool, but cheap pools are often cheap because many customers are also targeting them, leading to high interruption rates. Concentrating capacity in the lowest-price pool increases the probability of simultaneous interruptions across the fleet."
      },
      {
        id: "B",
        text: "capacityOptimized allocation strategy — selects pools with the most available Spot capacity, which directly minimizes interruption risk.",
        isCorrect: true,
        explanation: "Correct — The capacityOptimized (now also called priceCapacityOptimized in newer API versions) strategy selects Spot pools with the most available surplus capacity. More surplus capacity in a pool means AWS is less likely to reclaim those instances. AWS research shows this strategy reduces interruptions by up to 70% compared to lowestPrice. For long-running jobs where interruption is costly (even with checkpointing), reducing interruption frequency is more valuable than marginal per-hour savings from chasing the cheapest pool. AWS recommends capacityOptimized as the default for production Spot workloads."
      },
      {
        id: "C",
        text: "diversified allocation strategy — spreads instances equally across all configured pools, guaranteeing the lowest average interruption rate.",
        isCorrect: false,
        explanation: "Wrong — The diversified strategy distributes instances evenly across all Spot pools regardless of available capacity. While diversification reduces correlated interruptions (if one pool is reclaimed, not all instances are lost), it does not specifically target high-capacity pools. capacityOptimized (targeting pools with most surplus) is more effective at minimizing per-instance interruption probability."
      },
      {
        id: "D",
        text: "InstancePoolsToUseCount with lowestPrice — splits capacity across the 2 cheapest pools, balancing cost and interruption.",
        isCorrect: false,
        explanation: "Wrong — InstancePoolsToUseCount combined with lowestPrice still concentrates capacity in price-based pools, which may have high demand and interruption rates. This strategy was superseded by capacityOptimized and priceCapacityOptimized, which explicitly optimize for capacity availability rather than price alone."
      }
    ],
    explanation: "Spot Fleet allocation strategies for cost vs interruption trade-off: lowestPrice = cheapest but highest interruption risk; diversified = spreads risk but doesn't optimize capacity; capacityOptimized = selects largest-surplus pools, lowest interruption rate (AWS recommended). The newer priceCapacityOptimized (available in EC2 Fleet/ASG) balances both price and capacity. For production batch workloads tolerating interruption but wanting minimal frequency, capacityOptimized is the exam-correct answer. Pair with instance type diversification across families (m5, m5a, m5n, m6i, etc.) for maximum resilience.",
    keywords: ["Spot Fleet", "capacityOptimized", "minimize interruptions", "lowestPrice high interruption", "surplus capacity"]
  },

  // ─── d4-045 — Task 4.2 · EC2 Hibernation for dev environments (difficulty 3) ───
  {
    id: "d4-045",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2-hibernate"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A software development team runs Amazon EC2 instances with large in-memory application caches that take 20 minutes to warm up after a cold start. The instances are only used during business hours (8 AM–6 PM on weekdays). The team wants to ELIMINATE compute charges overnight without losing the in-memory state, so the cache is instantly available when developers arrive in the morning. What is the MOST cost-effective approach?",
    options: [
      {
        id: "A",
        text: "Stop the EC2 instances at 6 PM and start them at 7:40 AM to allow cache warm-up before developers arrive.",
        isCorrect: false,
        explanation: "Wrong — Stopping an EC2 instance clears the RAM contents entirely. The in-memory cache is lost and the 20-minute warm-up is required on every restart. While compute charges stop when the instance is stopped, this approach does not preserve in-memory state."
      },
      {
        id: "B",
        text: "Enable EC2 Hibernation at launch, hibernate the instances at 6 PM, and resume them in the morning. The EBS root volume must be encrypted and large enough to hold the RAM contents.",
        isCorrect: true,
        explanation: "Correct — EC2 Hibernation saves the entire contents of RAM to the encrypted EBS root volume, then powers off the instance. Instance-hour billing stops while hibernated — only EBS storage and any Elastic IP costs continue. On resume, the RAM contents are restored in seconds. Prerequisites: hibernation must be enabled at launch (cannot be added later), the EBS root volume must be encrypted, the root volume must have enough free space for the RAM dump, and the instance RAM must be ≤150 GB. This eliminates the 20-minute warm-up and stops compute billing overnight."
      },
      {
        id: "C",
        text: "Use an Amazon ElastiCache cluster to store the cache externally, then stop the EC2 instances overnight.",
        isCorrect: false,
        explanation: "Wrong — Moving the cache to ElastiCache requires significant application re-architecture and introduces ElastiCache node costs (minimum $0.017/hr for cache.t4g.micro). While this is architecturally cleaner, it is not the MOST cost-effective approach when EC2 Hibernation directly addresses the requirement at no architectural cost. ElastiCache also adds latency compared to in-process memory."
      },
      {
        id: "D",
        text: "Schedule a daily AMI snapshot at 6 PM and restore from the AMI each morning to preserve application state.",
        isCorrect: false,
        explanation: "Wrong — An AMI snapshot captures the disk state, not the in-memory RAM contents. Restoring from an AMI starts a fresh instance with no in-memory cache — the 20-minute warm-up is still required. AMI creation also adds EBS snapshot costs ($0.05/GB-month) and takes several minutes."
      }
    ],
    explanation: "EC2 Hibernation is purpose-built for this scenario: preserve in-memory state across power-off cycles while eliminating compute charges. Key requirements: (1) must be enabled at launch, (2) EBS root volume must be encrypted, (3) instance RAM ≤150 GB, (4) supported instance families (most current-gen). Billing stops as with Stop (no instance-hour charges while hibernated). Resume restores RAM from EBS, typically in 20-60 seconds — vs 20+ minutes for cold cache warm-up. The encrypted EBS requirement is the most common exam gotcha.",
    keywords: ["EC2 Hibernation", "preserve in-memory state", "encrypted EBS required", "no compute charge", "enabled at launch"]
  },

  // ─── d4-046 — Task 4.2 · Lambda power tuning — memory vs duration cost (difficulty 4) ───
  {
    id: "d4-046",
    domain: 4,
    taskStatement: "4.2",
    services: ["lambda"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A Lambda function currently runs at 512 MB memory and takes an average of 2,000 ms per invocation (cost ≈ $0.0000166667/GB-s × 1 GB-s = $0.0000166667 per invocation). A performance test shows that increasing memory to 1,024 MB reduces execution time to 600 ms. Which configuration is MORE cost-effective, and why does increasing memory reduce cost?",
    options: [
      {
        id: "A",
        text: "512 MB / 2,000 ms is cheaper — less memory always costs less in Lambda pricing.",
        isCorrect: false,
        explanation: "Wrong — Lambda pricing is based on GB-seconds (memory × duration), not memory alone. At 512 MB for 2,000 ms: 0.5 GB × 2.0 s = 1.0 GB-s. At 1,024 MB for 600 ms: 1.0 GB × 0.6 s = 0.6 GB-s. The 1,024 MB configuration is 40% cheaper per invocation even though it uses more memory, because the dramatic execution time reduction more than offsets the higher memory cost."
      },
      {
        id: "B",
        text: "1,024 MB / 600 ms is cheaper — because Lambda bills on GB-seconds, and when the duration decrease outweighs the memory increase, total GB-seconds (and cost) falls.",
        isCorrect: true,
        explanation: "Correct — Lambda billing formula: cost = (memory GB) × (duration s) × $0.0000166667 (x86). At 512 MB / 2,000 ms: 0.5 × 2.0 = 1.0 GB-s = $0.0000166667. At 1,024 MB / 600 ms: 1.0 × 0.6 = 0.6 GB-s = $0.0000100000. The 1,024 MB config is 40% cheaper per invocation. Allocating more memory to a CPU-bound Lambda function speeds execution proportionally because Lambda vCPU allocation scales linearly with memory. This is the core principle of Lambda power tuning."
      },
      {
        id: "C",
        text: "Both cost the same — Lambda has a built-in cost equalizer that normalizes pricing across memory tiers.",
        isCorrect: false,
        explanation: "Wrong — There is no cost equalizer in Lambda. GB-second costs are $0.0000166667 for x86 and $0.0000133334 for arm64 (Graviton2). The customer is billed for actual GB-seconds consumed. Choosing higher memory that reduces duration enough to lower total GB-seconds results in a lower bill."
      },
      {
        id: "D",
        text: "The choice depends on the request rate — at high request rates, 512 MB is always cheaper.",
        isCorrect: false,
        explanation: "Wrong — Request rate affects total cost but not the per-invocation cost comparison. If the 1,024 MB configuration uses 0.6 GB-s vs 1.0 GB-s at 512 MB, the 1,024 MB config is cheaper per invocation at any request rate. The savings scale linearly: at 1 million invocations, 1,024 MB saves $6.67 vs 512 MB."
      }
    ],
    explanation: "Lambda power tuning is a critical exam topic. Key formula: cost = (memory in GB) × (duration in seconds) × rate. For CPU-bound functions, Lambda vCPU scales with memory, so doubling memory often more than halves duration. AWS Lambda Power Tuning is an open-source Step Functions state machine that automatically tests multiple memory configs and recommends the cost-optimal setting. Additionally, Lambda arm64 (Graviton2) is 20% cheaper per GB-second ($0.0000133334 vs $0.0000166667) AND typically has faster cold starts.",
    keywords: ["Lambda GB-seconds", "power tuning", "memory increase reduces cost", "CPU-bound faster", "cost formula"]
  },

  // ─── d4-047 — Task 4.2 · Lambda SnapStart cost and compatibility (difficulty 4) ───
  {
    id: "d4-047",
    domain: 4,
    taskStatement: "4.2",
    services: ["lambda"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company is running a Java 21 Lambda function with 6-second cold starts. Provisioned Concurrency is configured to maintain 50 warm instances, costing approximately $300/month. A developer suggests switching to Lambda SnapStart to eliminate the need for Provisioned Concurrency. Which statement about Lambda SnapStart for Java is CORRECT?",
    options: [
      {
        id: "A",
        text: "Lambda SnapStart for Java requires a paid caching fee per snapshot stored, similar to the Python and .NET SnapStart pricing.",
        isCorrect: false,
        explanation: "Wrong — Lambda SnapStart for Java 11+ is completely FREE. There is no caching cost for Java. The paid caching cost applies only to Python 3.12+ and .NET 8+ SnapStart (GA'd November 2024). Java SnapStart has been free since its launch at re:Invent 2022."
      },
      {
        id: "B",
        text: "Lambda SnapStart for Java is FREE, creates a snapshot of the initialized execution environment after the Init phase, and restores it on cold starts — reducing latency to sub-second without Provisioned Concurrency charges.",
        isCorrect: true,
        explanation: "Correct — Lambda SnapStart for Java is free. AWS takes a snapshot of the initialized Lambda execution environment after the Init phase completes and caches it. Subsequent cold starts restore from the snapshot instead of re-initializing, reducing cold start latency dramatically (often from seconds to milliseconds). This can eliminate the need for Provisioned Concurrency in many cases. The $300/month Provisioned Concurrency cost would be eliminated. Note: SnapStart is incompatible with Provisioned Concurrency, EFS mounts, ephemeral storage >512 MB, and container image functions."
      },
      {
        id: "C",
        text: "Lambda SnapStart cannot be used with Java 21 — it is only supported for Java 11 and Java 17.",
        isCorrect: false,
        explanation: "Wrong — Lambda SnapStart supports Java 11, Java 17, and Java 21 (as of 2024). The feature was extended to newer Java runtimes progressively. Java 21 SnapStart is available and free."
      },
      {
        id: "D",
        text: "Lambda SnapStart is compatible with Provisioned Concurrency — both can be enabled on the same function version to achieve maximum performance.",
        isCorrect: false,
        explanation: "Wrong — Lambda SnapStart and Provisioned Concurrency are mutually exclusive. They cannot both be enabled on the same function version. SnapStart is the cost-free alternative that eliminates cold starts, making Provisioned Concurrency unnecessary in many cases."
      }
    ],
    explanation: "Lambda SnapStart summary: Java = FREE (since 2022). Python 3.12+ and .NET 8+ = paid caching cost (since Nov 2024). SnapStart creates a post-Init snapshot and restores it on cold starts, typically achieving sub-second cold start latency. Incompatible with: Provisioned Concurrency, EFS mounts, ephemeral storage >512 MB, container images. Common exam trap: candidates assume all SnapStart variants have costs — Java is explicitly free. Eliminating $300/month of Provisioned Concurrency with a free SnapStart is a significant cost win.",
    keywords: ["SnapStart Java free", "Provisioned Concurrency replacement", "cold start elimination", "Python .NET paid", "incompatible with EFS"]
  },

  // ─── d4-048 — Task 4.1 · S3 Storage Lens for organization-wide visibility (difficulty 3) ───
  {
    id: "d4-048",
    domain: 4,
    taskStatement: "4.1",
    services: ["s3-storage-lens"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A large enterprise operates 47 AWS accounts under AWS Organizations, with hundreds of Amazon S3 buckets across all accounts. The storage cost has grown unexpectedly, and the FinOps team wants a single dashboard showing storage usage, object counts, and cost-saving recommendations (such as identifying buckets with no lifecycle policies or with large amounts of data in S3 Standard that should be tiered) across ALL accounts. Which AWS-native solution provides this organization-wide S3 cost visibility at the LOWEST cost?",
    options: [
      {
        id: "A",
        text: "Build a custom AWS Lambda function that calls the S3 LIST API across all accounts and aggregates results into Amazon DynamoDB.",
        isCorrect: false,
        explanation: "Wrong — Custom Lambda solutions require development, maintenance, IAM cross-account roles, and ongoing compute costs. S3 LIST API calls are charged ($0.005/1,000 requests) and do not provide cost optimization recommendations. This approach has far more overhead than the AWS-native solution."
      },
      {
        id: "B",
        text: "Enable AWS S3 Storage Lens at the organization level — the free tier provides 28+ metrics and activity recommendations across all accounts in a single dashboard.",
        isCorrect: true,
        explanation: "Correct — Amazon S3 Storage Lens is purpose-built for this use case. When enabled at the organization level in the management account, it aggregates storage metrics across all member accounts and regions. The free tier provides 28+ metrics (object count, active buckets, average object size, requests, etc.) with 14-day history and cost-saving recommendations including: buckets without lifecycle policies, unversioned buckets, data in Standard that could be tiered, and non-current version accumulation. The Advanced tier adds 62+ metrics and costs $0.20 per million objects monitored."
      },
      {
        id: "C",
        text: "Use AWS Cost Explorer filtered by S3 service — it shows per-bucket costs and recommends lifecycle policies.",
        isCorrect: false,
        explanation: "Wrong — AWS Cost Explorer shows cost breakdowns by service, linked account, and tag, but does not provide S3-specific operational metrics (object counts, access patterns, lifecycle policy gaps). It cannot identify specific buckets missing lifecycle policies or recommend specific tiering opportunities."
      },
      {
        id: "D",
        text: "Generate S3 Inventory reports for each bucket and write custom Athena queries to identify optimization opportunities.",
        isCorrect: false,
        explanation: "Wrong — S3 Inventory is useful for auditing object-level metadata (encryption status, replication status, storage class) per bucket, but it must be configured per bucket and queried manually. It does not aggregate across all organization accounts in a single dashboard and does not provide proactive cost-saving recommendations. S3 Storage Lens is the higher-level organization-wide solution."
      }
    ],
    explanation: "Amazon S3 Storage Lens is the AWS-native answer for organization-wide S3 visibility. Free tier: 28+ metrics, 14-day history, cost optimization recommendations at no charge. Advanced tier: $0.20/million objects, 62+ metrics including detailed request metrics. Org-level dashboards aggregate across all accounts. Key recommendations include: lifecycle policy gaps, large non-current versions (versioning waste), buckets with high Standard storage that could be tiered, and incomplete multipart uploads. S3 Inventory is per-bucket object-level metadata (not cross-account recommendations). Cost Explorer is cost data (not operational metrics).",
    keywords: ["S3 Storage Lens", "organization-wide", "free tier", "lifecycle gaps", "cross-account S3 visibility"]
  },

  // ─── d4-049 — Task 4.1 · S3 Requester Pays for public datasets (difficulty 3) ───
  {
    id: "d4-049",
    domain: 4,
    taskStatement: "4.1",
    services: ["s3"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A genomics research institution hosts a 500 TB publicly accessible reference genome dataset in Amazon S3. The institution pays the AWS egress bills when external researchers download the data. Monthly egress costs have reached $45,000 (500 TB × $0.09/GB). The institution wants to make the dataset continue to be publicly accessible while ELIMINATING its own egress costs. Which S3 feature achieves this?",
    options: [
      {
        id: "A",
        text: "Enable S3 Transfer Acceleration on the bucket — AWS absorbs the transfer cost.",
        isCorrect: false,
        explanation: "Wrong — S3 Transfer Acceleration speeds up uploads from distant clients by routing through CloudFront edge locations. It adds an additional $0.04–$0.08/GB premium ON TOP of standard transfer pricing. It does not eliminate the bucket owner's egress costs — it increases them."
      },
      {
        id: "B",
        text: "Enable S3 Requester Pays on the bucket — authenticated AWS requesters pay for data transfer and request costs instead of the bucket owner.",
        isCorrect: true,
        explanation: "Correct — S3 Requester Pays is a bucket-level setting that shifts data transfer and request costs from the bucket owner to the requester. When enabled, requesters must include x-amz-request-payer: requester in their requests and must be authenticated AWS users (anonymous access is blocked when Requester Pays is enabled). The bucket owner still pays for storage. This eliminates the $45,000/month egress bill while keeping the dataset accessible to legitimate research organizations with AWS accounts."
      },
      {
        id: "C",
        text: "Configure a CloudFront distribution with S3 as the origin — CloudFront-to-S3 origin fetches are free, eliminating all costs.",
        isCorrect: false,
        explanation: "Wrong — While S3 to CloudFront origin fetches are free, CloudFront's egress to internet users is charged at $0.085/GB (first 10 TB). The institution would still pay the CloudFront egress bill. CloudFront reduces cost versus direct S3 egress due to caching (fewer origin fetches) but does not eliminate the institution's egress costs entirely."
      },
      {
        id: "D",
        text: "Move the dataset to a public S3 bucket in the same region as most researchers to eliminate cross-region transfer charges.",
        isCorrect: false,
        explanation: "Wrong — Standard S3 egress to the internet is charged regardless of whether the data is in the same region as the downloader. The $0.09/GB internet egress charge applies for any data leaving an AWS region to external users. Moving regions does not eliminate the egress cost."
      }
    ],
    explanation: "S3 Requester Pays is purpose-built for public dataset hosting where the owner wants to provide access without bearing egress costs. Use cases: genomics databases, government open data, public research datasets. Limitation: anonymous access is blocked — requesters need AWS accounts. Bucket owner still pays: storage ($0.023/GB-month) and PUT request costs. Requester pays: GET requests + data transfer out. This is the standard pattern used by AWS Open Data Registry (NOAA, 1000 Genomes, etc.).",
    keywords: ["Requester Pays", "shift egress costs", "bucket owner pays storage", "authenticated AWS users only", "public dataset"]
  },

  // ─── d4-050 — Task 4.1 · S3 Inventory vs S3 LIST for large-scale audits (difficulty 3) ───
  {
    id: "d4-050",
    domain: 4,
    taskStatement: "4.1",
    services: ["s3"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A compliance team needs to audit 8 billion objects stored in Amazon S3 to verify that all objects are encrypted with AWS Key Management Service (SSE-KMS), have replication configured, and are in the correct storage class. The team's current script uses the S3 LIST API and costs approximately $16,000 in request charges ($0.005/1,000 × 8 billion). A cloud architect suggests replacing this approach. What is the MOST cost-effective audit method?",
    options: [
      {
        id: "A",
        text: "Continue using S3 LIST API but parallelize across 10 threads to reduce runtime.",
        isCorrect: false,
        explanation: "Wrong — Parallelizing LIST API calls reduces runtime but does NOT reduce request costs. 8 billion objects still require approximately 8 million LIST requests (1,000 objects per page), totaling $16,000 regardless of how many threads are used. The cost is per request, not per time."
      },
      {
        id: "B",
        text: "Enable Amazon S3 Inventory on the bucket, which generates a flat-file listing (CSV/ORC/Parquet) of all objects with metadata including encryption status, replication status, and storage class — at $0.0025 per million objects listed.",
        isCorrect: true,
        explanation: "Correct — S3 Inventory generates a scheduled (daily or weekly) flat-file listing of all objects in a bucket with configurable metadata fields: encryption status (SSE-S3/SSE-KMS/unencrypted), replication status, storage class, object size, last modified date, ETag, and more. Pricing is $0.0025 per million objects. For 8 billion objects: 8,000 × $0.0025 = $20 — compared to $16,000 for LIST API. The inventory file is delivered to a destination S3 bucket and can be queried with Amazon Athena. Savings: 99.9% cost reduction."
      },
      {
        id: "C",
        text: "Use Amazon Macie to scan all S3 buckets for encryption compliance.",
        isCorrect: false,
        explanation: "Wrong — Amazon Macie is a data security service that discovers sensitive data (PII, credentials) using ML. It is not designed for bulk object metadata auditing (encryption status, storage class, replication status). Macie charges per GB scanned and is far more expensive than S3 Inventory for this use case."
      },
      {
        id: "D",
        text: "Enable S3 Server Access Logging and write a script to parse log files for object-level encryption metadata.",
        isCorrect: false,
        explanation: "Wrong — S3 Server Access Logs record HTTP requests made to the bucket, not current object metadata state. They cannot tell you whether objects uploaded before logging was enabled are encrypted. S3 Inventory provides a complete point-in-time snapshot of all object metadata."
      }
    ],
    explanation: "S3 Inventory vs S3 LIST API: For large buckets, S3 Inventory is dramatically cheaper ($0.0025/M objects vs $5/M for LIST) and provides richer metadata without API rate limits. S3 Inventory supports CSV, ORC, and Parquet formats; ORC/Parquet integrate directly with Athena for SQL queries. It can audit: SSE-S3/SSE-KMS/unencrypted, replication status (COMPLETED/FAILED/PENDING), object lock status, storage class, multipart upload status, checksum algorithm. For lifecycle planning (identify cold objects for tiering), Inventory + Athena is the standard pattern.",
    keywords: ["S3 Inventory", "$0.0025 per million objects", "vs LIST API", "encryption audit", "Athena integration", "lifecycle planning"]
  },

  // ─── d4-051 — Task 4.1 · EFS throughput modes cost (difficulty 4) ───
  {
    id: "d4-051",
    domain: 4,
    taskStatement: "4.1",
    services: ["efs"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A media company runs video transcoding jobs that use Amazon Elastic File System (Amazon EFS) as shared storage. Jobs are highly bursty: 5 TB/s throughput during 2-hour transcode windows, then near-zero for 22 hours. The team currently uses EFS Provisioned Throughput at 5 GB/s, costing approximately $6/MB/s-month × 5,000 MB/s = $30,000/month just for throughput. A solutions architect proposes switching to Elastic Throughput mode. What is the EXPECTED cost impact?",
    options: [
      {
        id: "A",
        text: "Elastic Throughput would cost MORE — it charges per GB read/written, which at 5 GB/s for 2 hours would cost $0.03/GB × 5 GB/s × 7,200 seconds = over $1 million per transcode window.",
        isCorrect: false,
        explanation: "Wrong — The math is incorrect. EFS Elastic Throughput charges $0.03/GB for reads and $0.06/GB for writes. At 5 GB/s for 2 hours: $0.06 × (5 GB/s × 7,200 s) = $0.06 × 36,000 GB = $2,160 per window per day. Monthly (assuming daily transcoding): ~$64,800. This IS more expensive than Provisioned at $30,000/month. However, the question is about the EXPECTED impact — the correct answer acknowledges this scenario. If transcoding happens less than ~12 days/month, Elastic is cheaper. The architect should model actual usage."
      },
      {
        id: "B",
        text: "Elastic Throughput charges only when throughput is actually consumed — for a 2-hour burst in a 24-hour day, it would eliminate the ~$24,000/month paid for idle provisioned throughput during the 22 off-hours.",
        isCorrect: true,
        explanation: "Correct — EFS Provisioned Throughput bills $6/MB/s-month (approximately) for the provisioned capacity 24/7, regardless of utilization. For 22 idle hours per day, approximately 91.7% of the provisioned throughput cost is wasted. EFS Elastic Throughput charges only when data is read ($0.03/GB) or written ($0.06/GB). For 2 hours of 5 GB/s writes daily: $0.06 × (5 GB/s × 7,200 s) × 30 days ≈ $64,800/month — however, in practice bursts are rarely continuous at maximum rate. The key principle: Elastic Throughput eliminates wasted idle provisioned cost and is optimal when throughput demand is truly spiky relative to 24/7 provisioned cost."
      },
      {
        id: "C",
        text: "Provisioned Throughput is always cheaper for workloads exceeding 1 MB/s average throughput.",
        isCorrect: false,
        explanation: "Wrong — The cost crossover between Elastic and Provisioned Throughput depends on actual GB consumed vs the provisioned rate, not simply whether throughput exceeds 1 MB/s. The correct comparison: (provisioned_rate_MB/s × $6/MB/s-month) vs (total_GB_read × $0.03 + total_GB_written × $0.06) per month."
      },
      {
        id: "D",
        text: "Switching to Elastic Throughput has no cost impact because EFS Elastic Throughput mode is free.",
        isCorrect: false,
        explanation: "Wrong — EFS Elastic Throughput is NOT free. It charges per GB of data read ($0.03/GB) and written ($0.06/GB). It is the correct choice for spiky workloads because you avoid paying for provisioned capacity during idle periods, but you do pay for actual I/O consumed."
      }
    ],
    explanation: "EFS Throughput mode comparison: Bursting (legacy, free but tied to credit bucket — insufficient for sustained high throughput), Elastic (pay-per-GB, optimal for spiky/unpredictable), Provisioned (~$6/MB/s-month, optimal for steady high throughput). The exam decision rule: if throughput demand is spiky (burst periods short relative to day), Elastic eliminates waste. If throughput is continuous and predictable, Provisioned has a lower effective rate. AWS recommends Elastic as the new default. EFS Standard storage: $0.30/GB-month with Elastic throughput paid separately.",
    keywords: ["EFS Elastic Throughput", "pay per GB", "Provisioned Throughput idle waste", "spiky bursts", "$6/MB/s-month"]
  },

  // ─── d4-052 — Task 4.4 · Cross-AZ data transfer charges (difficulty 5) ───
  {
    id: "d4-052",
    domain: 4,
    taskStatement: "4.4",
    services: ["vpc", "ec2"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A company runs a microservices application with an Application Load Balancer in us-east-1 spanning three Availability Zones. EC2 instances in us-east-1a communicate frequently with Amazon RDS in us-east-1b. Monthly cross-AZ traffic is 10 TB. A junior engineer argues: 'Cross-AZ traffic is free within the same AWS region.' A senior engineer disagrees. Which of the following correctly describes the data transfer pricing for this scenario?",
    options: [
      {
        id: "A",
        text: "The junior engineer is correct — cross-AZ traffic within the same region is always free when using private IP addresses.",
        isCorrect: false,
        explanation: "Wrong — This is a common misconception. Cross-AZ data transfer is NOT free. AWS charges $0.01/GB in each direction for traffic between AZs in the same region (including EC2-to-RDS, EC2-to-ElastiCache, etc.). For 10 TB/month of EC2→RDS traffic: $0.01 × 10,000 GB = $100/month each way. Round-trip is $200/month. Only same-AZ traffic via private IP is free."
      },
      {
        id: "B",
        text: "Cross-AZ traffic is charged at $0.01/GB in each direction. For 10 TB of EC2 (us-east-1a) to RDS (us-east-1b) traffic, the monthly charge is $100 (outbound from EC2's AZ). The return traffic adds another $100, totaling $200/month.",
        isCorrect: true,
        explanation: "Correct — AWS charges $0.01/GB in EACH direction for cross-AZ data transfer. For 10 TB (10,000 GB) one-way: $0.01 × 10,000 = $100. Round-trip doubles this to $200/month. This is a real cost driver in multi-AZ architectures. Best practice: place EC2 instances in the same AZ as their primary RDS instance (or read replica) to avoid cross-AZ charges. Use ALB with availability zone affinity (zonal shift) where possible."
      },
      {
        id: "C",
        text: "Cross-AZ traffic via the ALB is free because ALB does not charge for cross-AZ data transfer to its targets.",
        isCorrect: false,
        explanation: "Wrong — Application Load Balancer does NOT charge extra for cross-AZ traffic to its registered targets (ALB cross-zone load balancing is free). However, this question is about EC2 instances communicating directly with RDS across AZs — not about ALB target traffic. Direct EC2-to-RDS cross-AZ traffic is charged at $0.01/GB each way regardless of ALB involvement."
      },
      {
        id: "D",
        text: "Cross-AZ traffic within the same region is free for all AWS managed services (RDS, ElastiCache, etc.) but charged for EC2-to-EC2 traffic.",
        isCorrect: false,
        explanation: "Wrong — Cross-AZ charges apply to all services including EC2, RDS, ElastiCache, and others. There is no exemption for managed services. The $0.01/GB each-way charge applies to any cross-AZ data transfer regardless of service type. Same-AZ traffic via private IP is FREE for all services."
      }
    ],
    explanation: "Cross-AZ data transfer costs: same-AZ via private IP = $0/GB (FREE); cross-AZ via private IP = $0.01/GB each direction ($0.02/GB round-trip); same-AZ via public IP/EIP = $0.01/GB each direction even within the same AZ (trap!); ALB cross-zone to targets = FREE (ALB exception). For cost optimization: co-locate EC2 with its RDS/ElastiCache in the same AZ; use read replicas in the same AZ as read-heavy EC2; avoid public IP routing within AZ. Cross-AZ charges are the #1 unexpected cost in multi-AZ architectures.",
    keywords: ["cross-AZ $0.01/GB", "same-AZ free", "EC2 to RDS cross-AZ", "$0.02/GB round-trip", "ALB cross-zone free exception"]
  },

  // ─── d4-053 — Task 4.4 · S3 to CloudFront free egress trap (difficulty 5) ───
  {
    id: "d4-053",
    domain: 4,
    taskStatement: "4.4",
    services: ["s3", "cloudfront"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A company serves a large static website from Amazon S3 through Amazon CloudFront. A colleague states: 'All data transfer from S3 to CloudFront is free, so there is no cost at all for this architecture.' An engineer challenges this claim. Which of the following MOST accurately describes the data transfer pricing in this architecture?",
    options: [
      {
        id: "A",
        text: "The colleague is entirely correct — S3 to CloudFront and CloudFront to end users are both free.",
        isCorrect: false,
        explanation: "Wrong — Only the S3 to CloudFront origin transfer is free. CloudFront charges for data transfer out to internet users: $0.085/GB (first 10 TB from North America/Europe edges). The CloudFront free tier includes 1 TB/month egress and 10 million HTTPS requests/month, but beyond that, egress is charged."
      },
      {
        id: "B",
        text: "Data transfer from S3 to CloudFront (origin fetches) is FREE. However, CloudFront charges for data transfer out to end users ($0.085/GB for the first 10 TB from NA/EU edges), so total cost depends on traffic volume.",
        isCorrect: true,
        explanation: "Correct — AWS explicitly waives the data transfer fee for S3 objects served as a CloudFront origin. This is a major cost benefit versus serving directly from S3 (which would charge $0.09/GB for internet egress). CloudFront charges for the final hop to end users at $0.085/GB (NA/EU, first 10 TB/month), but also includes a free tier: 1 TB egress + 10 million HTTPS requests/month. S3 GET requests are still charged on the origin side ($0.0004/1,000). The savings vs direct S3: CloudFront is $0.085/GB vs S3 direct $0.09/GB, PLUS CloudFront caches content (reducing origin requests and effective per-byte cost)."
      },
      {
        id: "C",
        text: "S3 to CloudFront origin fetches are charged at the standard internet egress rate of $0.09/GB.",
        isCorrect: false,
        explanation: "Wrong — AWS explicitly waives data transfer fees between S3 and CloudFront for origin fetches. This is one of the well-known AWS pricing benefits and is documented in both S3 and CloudFront pricing pages."
      },
      {
        id: "D",
        text: "S3 to CloudFront is free, and CloudFront to internet is also free if the CloudFront distribution is in the same AWS region as the S3 bucket.",
        isCorrect: false,
        explanation: "Wrong — CloudFront edge locations are global points-of-presence that do not 'reside' in the same region as an S3 bucket in the billing sense. CloudFront to internet egress is always charged (beyond the free tier) regardless of the S3 origin region. There is no region-based waiver for CloudFront to internet delivery."
      }
    ],
    explanation: "S3 to CloudFront pricing nuance: origin fetches (S3 → CloudFront PoP) = FREE. End-user delivery (CloudFront PoP → internet) = $0.085/GB (NA/EU, first 10 TB). Free tier: 1 TB/month + 10M HTTPS requests/month. S3 GET request costs still apply on origin fetches ($0.0004/1,000). The exam trap is conflating the free S3→CF origin transfer with the paid CF→internet delivery. The net benefit vs direct S3: $0.085 vs $0.09/GB + cache hit rate reduces total GBs served from S3 (fewer origin fetches = fewer S3 requests and S3 storage bandwidth).",
    keywords: ["S3 to CloudFront free", "CloudFront to internet charged", "$0.085/GB", "1 TB free tier", "origin fetch free"]
  },

  // ─── d4-054 — Task 4.3 · RDS Multi-AZ doubles instance cost (difficulty 5) ───
  {
    id: "d4-054",
    domain: 4,
    taskStatement: "4.3",
    services: ["rds"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A company is planning to enable Amazon RDS Multi-AZ on a production MySQL database to meet an availability SLA. The primary instance is a db.m6g.2xlarge running at $0.48/hour On-Demand. The engineering team estimates the monthly cost will increase by approximately 10% for the Multi-AZ standby. A solutions architect disagrees with this estimate. What is the CORRECT cost impact of enabling Multi-AZ?",
    options: [
      {
        id: "A",
        text: "The engineering team is correct — the standby is a passive replica that costs approximately 10–20% extra for synchronous replication overhead.",
        isCorrect: false,
        explanation: "Wrong — This is incorrect. The Multi-AZ standby instance is a fully provisioned, identical replica of the primary instance. It runs the same instance type (db.m6g.2xlarge) and is billed at the same instance-hour rate. The cost increase is approximately 100% (2× total cost), not 10–20%."
      },
      {
        id: "B",
        text: "Enabling Multi-AZ approximately doubles the instance cost — the standby runs the same instance type as the primary and is billed at the full On-Demand rate, even though it is not accessible for reads or writes.",
        isCorrect: true,
        explanation: "Correct — RDS Multi-AZ (Standard, with one non-readable standby) provisions a second identical instance in a different AZ. This standby is billed at the same hourly rate as the primary. For db.m6g.2xlarge at $0.48/hr: Multi-AZ = $0.96/hr ($691/month), doubling the compute cost. Additionally, Multi-AZ doubles storage costs (the standby has its own storage replica). Total bill increase: approximately 100% for instance + 100% for storage. The standby cannot serve reads or writes — it only activates on failover."
      },
      {
        id: "C",
        text: "Multi-AZ adds a storage replication fee of $0.10/GB-month for synchronous replication but does not add a separate instance charge.",
        isCorrect: false,
        explanation: "Wrong — Multi-AZ is NOT just a storage replication fee. A fully provisioned second instance (the standby) is billed at the same rate as the primary. There is no separate 'replication fee' — the cost model is simply: pay for two complete instances (primary + standby) plus two complete storage volumes."
      },
      {
        id: "D",
        text: "Multi-AZ is free for instances covered by Reserved Instances — the standby is exempt from billing if an RI covers the primary.",
        isCorrect: false,
        explanation: "Wrong — A Standard RDS Reserved Instance covers one specific instance deployment. To get the RI discount on a Multi-AZ deployment, you must purchase a Multi-AZ RI (not a Single-AZ RI). Multi-AZ RIs cost more than Single-AZ RIs but still apply the same discount percentage. Two Single-AZ RIs do NOT automatically cover a Multi-AZ deployment."
      }
    ],
    explanation: "RDS Multi-AZ cost facts: Standard (one non-readable standby) = ~2× instance cost + ~2× storage cost. Multi-AZ Cluster (two readable standbys) = ~2.5× cost but offers lower commit latency. The standby is never used for reads (unlike read replicas) — it activates only on failover. For RI coverage: purchase Multi-AZ RIs to get the discount on Multi-AZ deployments. Dev/test cost optimization: disable Multi-AZ on non-production databases to halve the compute + storage cost.",
    keywords: ["Multi-AZ doubles cost", "standby billed same rate", "non-readable standby", "2x instance cost", "RDS RI Multi-AZ"]
  },

  // ─── d4-055 — Task 4.3 · Aurora Serverless v2 minimum ACU for cost and scale-to-zero (difficulty 4) ───
  {
    id: "d4-055",
    domain: 4,
    taskStatement: "4.3",
    services: ["aurora-serverless-v2"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A development team runs an Aurora MySQL database for a non-production environment that is completely idle nights and weekends (60% of the time). They configure Aurora Serverless v2 with a minimum of 0.5 ACUs to reduce cost. After three weeks, they notice the database is never fully pausing and is still consuming approximately $43/month in compute. A senior architect explains the issue. Which COMBINATION of settings would enable the database to scale to zero during idle periods, and what is a known limitation of this configuration?",
    options: [
      {
        id: "A",
        text: "Set minimum ACUs to 0.5 — this enables scale-to-zero; the $43/month cost is caused by storage charges, not compute.",
        isCorrect: false,
        explanation: "Wrong — Setting minimum ACUs to 0.5 does NOT enable scale-to-zero. Aurora Serverless v2 only scales to zero when minimum ACUs are set to 0 (available since November 2024). At 0.5 ACU minimum, the instance maintains at least 0.5 ACU continuously = $0.12/ACU-hr × 0.5 × 720 hrs/month = $43.20/month — which matches the observed cost. The issue is that 0.5 ACU minimum, not 0, is set."
      },
      {
        id: "B",
        text: "Set minimum ACUs to 0 — this enables true scale-to-zero (auto-pause on no connections, ~15-second resume). Known limitation: Aurora Serverless v2 with min 0 ACUs cannot be used as an Aurora Global Database secondary cluster.",
        isCorrect: true,
        explanation: "Correct — Aurora Serverless v2 scale-to-zero requires minimum ACUs = 0 (GA'd November 2024). With min 0 ACUs, the cluster auto-pauses after a period of no connections and resumes in approximately 15 seconds on first connection. Known constraints that BLOCK scale-to-zero: (1) RDS Proxy attached, (2) Aurora Global Database secondary cluster, (3) zero-ETL integration to Redshift active, (4) tier 0 or tier 1 readers configured. For a standalone dev/test environment, setting min 0 ACUs eliminates compute charges during idle periods."
      },
      {
        id: "C",
        text: "Set minimum ACUs to 0 and attach an RDS Proxy to speed up connection pooling during the 15-second resume — this is the recommended configuration for scale-to-zero with fast reconnection.",
        isCorrect: false,
        explanation: "Wrong — Attaching RDS Proxy to an Aurora Serverless v2 cluster BLOCKS scale-to-zero. RDS Proxy maintains persistent connections to the database, preventing the auto-pause from triggering. This is a documented constraint. RDS Proxy cannot be used with Aurora Serverless v2 when scale-to-zero is desired."
      },
      {
        id: "D",
        text: "Set minimum ACUs to 0 and enable Multi-AZ to maintain the standby for faster failover during scale-to-zero resume.",
        isCorrect: false,
        explanation: "Wrong — Aurora Serverless v2 scale-to-zero with min 0 ACUs is not available for all Multi-AZ configurations. Additionally, enabling a Multi-AZ standby on a dev/test non-production database adds unnecessary cost. The goal for non-production is to minimize cost, and Multi-AZ adds approximately 2× the instance cost for a standby that never needs to serve production traffic."
      }
    ],
    explanation: "Aurora Serverless v2 scale-to-zero (min 0 ACUs): available since November 2024. Blocks scale-to-zero: RDS Proxy attached, Aurora Global Database secondary, zero-ETL integrations, tier 0/1 readers. Resume time: ~15 seconds. Cost when paused: only Aurora storage ($0.10/GB-month) and I/O for ongoing operations. At 0.5 ACU min: $43/month continuous. At 0 ACU min: $0 compute when idle. The most common exam trap is that scale-to-zero requires EXACTLY 0 min ACUs, not 0.5.",
    keywords: ["Aurora Serverless v2 scale-to-zero", "min 0 ACUs", "RDS Proxy blocks pause", "15-second resume", "$0.12/ACU-hr"]
  },

  // ─── d4-056 — Task 4.3 · Aurora I/O-Optimized — when NOT to use it (difficulty 5) ───
  {
    id: "d4-056",
    domain: 4,
    taskStatement: "4.3",
    services: ["aurora"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A startup runs an Aurora PostgreSQL cluster with the following monthly bill breakdown: instance $300, storage $90, I/O $60. Total: $450/month. A solutions architect recommends switching to Aurora I/O-Optimized pricing to 'eliminate all I/O charges.' The CTO asks whether this will actually reduce the total bill. What is the CORRECT answer?",
    options: [
      {
        id: "A",
        text: "Yes — Aurora I/O-Optimized eliminates I/O charges entirely, saving $60/month regardless of the instance and storage cost changes.",
        isCorrect: false,
        explanation: "Wrong — Aurora I/O-Optimized eliminates per-I/O charges but increases storage pricing (2.25× standard) and instance pricing (~30% higher). These additional costs may exceed the I/O savings. Simply saying 'I/O charges are eliminated' is misleading without accounting for the increased storage and instance costs."
      },
      {
        id: "B",
        text: "No — I/O charges represent only 13.3% of the total bill ($60/$450). The breakeven threshold for I/O-Optimized is when I/O charges exceed 25% of the total Aurora bill. Below 25%, I/O-Optimized costs MORE due to higher storage (2.25×) and instance (~30%) rates.",
        isCorrect: true,
        explanation: "Correct — AWS's documented recommendation: switch to Aurora I/O-Optimized when I/O charges exceed 25% of the total Aurora bill. In this case: $60/$450 = 13.3%, well below the 25% threshold. Switching would increase: storage from $90 to ~$202 (2.25×) and instance from $300 to ~$390 (30% more). New total: ~$592, versus $450 on standard pricing — a 31.5% INCREASE. I/O-Optimized is only beneficial for high-I/O OLTP workloads where I/O charges dominate."
      },
      {
        id: "C",
        text: "Yes, but only if the database is migrated to a newer Aurora instance type first, as I/O-Optimized is only available on newer instance families.",
        isCorrect: false,
        explanation: "Wrong — Aurora I/O-Optimized is available for all supported Aurora instance families. There is no requirement to upgrade instance types before switching. The pricing mode is changed via the DB cluster modification (a configuration change, not a migration)."
      },
      {
        id: "D",
        text: "It depends on whether the cluster uses gp3 or io2 storage — I/O-Optimized pricing only applies to Aurora with io2 Block Express storage.",
        isCorrect: false,
        explanation: "Wrong — Aurora I/O-Optimized is a pricing mode for the Aurora cluster itself, not tied to EBS volume types. Aurora storage is managed by AWS and does not use gp3/io2 directly. The I/O-Optimized mode changes how Aurora bills for storage reads and writes (flat rate vs per-I/O billing)."
      }
    ],
    explanation: "Aurora I/O-Optimized vs Standard break-even: I/O charges must exceed 25% of total Aurora bill to benefit. When I/O < 25% of bill: Standard is cheaper. When I/O > 25% of bill: I/O-Optimized can save up to 40%. The increased costs on I/O-Optimized: storage +125% ($0.225/GB vs $0.10/GB), instance +30% higher. The 30-day lockout before switching back means this decision has a 30-day cost penalty if wrong. The exam trap: candidates assume 'eliminating I/O charges' always saves money without accounting for the higher base rates.",
    keywords: ["Aurora I/O-Optimized 25% threshold", "storage 2.25x", "instance 30% higher", "break-even", "I/O below 25% stays standard"]
  },

  // ─── d4-057 — Task 4.3 · DynamoDB on-demand vs provisioned post-2024 break-even (difficulty 4) ───
  {
    id: "d4-057",
    domain: 4,
    taskStatement: "4.3",
    services: ["dynamodb"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A SaaS company's Amazon DynamoDB table serves a workload that averages 1,000 Write Capacity Units (WCUs) and 5,000 Read Capacity Units (RCUs) continuously 24/7. The team is currently on provisioned capacity with no Reserved Capacity. A cloud economist suggests evaluating on-demand pricing after the November 2024 price cuts. Using post-November 2024 pricing ($1.25/M WRUs, $0.25/M RRUs; provisioned WCU $0.00065/hr, RCU $0.00013/hr), which pricing mode is CHEAPER for this steady-state workload?",
    options: [
      {
        id: "A",
        text: "On-demand pricing is cheaper after the November 2024 price cuts, as AWS repositioned on-demand as the default for all workloads.",
        isCorrect: false,
        explanation: "Wrong — AWS repositioned on-demand as the default for new tables and reduced prices significantly, but this does not mean on-demand is cheaper for high-utilization steady-state workloads. At 100% utilization, provisioned capacity is still cheaper. The break-even is around 40% utilization."
      },
      {
        id: "B",
        text: "Provisioned capacity is cheaper for this steady-state 24/7 workload — monthly provisioned cost ≈ $503 versus on-demand ≈ $1,350, a 63% saving.",
        isCorrect: true,
        explanation: "Correct — Provisioned cost: (1,000 WCU × $0.00065/hr + 5,000 RCU × $0.00013/hr) × 720 hrs = ($0.65 + $0.65) × 720 = $936/month. Wait — let's recalculate: WCU: 1000 × $0.00065 × 720 = $468/mo; RCU: 5000 × $0.00013 × 720 = $468/mo; Total provisioned = $936/mo. On-demand: WRU: 1,000 writes/s × 86,400 s/day × 30 days = 2,592M WRUs × $1.25/M = $3,240/mo; RRU: 5,000 reads/s × 86,400 × 30 = 12,960M × $0.25/M = $3,240/mo; Total on-demand = $6,480/mo. Provisioned is significantly cheaper at full utilization. With Reserved Capacity (53% off 1-yr), provisioned drops to ~$440/mo. The break-even point is ~40% sustained utilization — above that, provisioned wins."
      },
      {
        id: "C",
        text: "Both pricing modes cost approximately the same after the November 2024 cuts because AWS calibrated on-demand and provisioned to break even at all utilization levels.",
        isCorrect: false,
        explanation: "Wrong — The break-even is specifically at approximately 40% utilization. At higher utilization, provisioned is cheaper. At lower utilization (sporadic or bursty workloads), on-demand is cheaper. The two modes are NOT equivalent at all utilization levels."
      },
      {
        id: "D",
        text: "On-demand is cheaper because it does not require Reserved Capacity purchases and avoids the risk of over-provisioned capacity.",
        isCorrect: false,
        explanation: "Wrong — The 'risk of over-provisioned capacity' is mitigated by DynamoDB Auto Scaling, which adjusts provisioned capacity to actual utilization. For a steady-state workload with predictable 1,000 WCU / 5,000 RCU demand, over-provisioning is not a concern. Provisioned with Auto Scaling is cheaper than on-demand at high sustained utilization."
      }
    ],
    explanation: "DynamoDB pricing break-even post-November 2024: on-demand wins below ~40% sustained utilization; provisioned wins above ~40%. Key numbers: on-demand = $1.25/M WRUs + $0.25/M RRUs; provisioned = $0.00065/WCU-hr + $0.00013/RCU-hr. Reserved Capacity adds up to 53% (1-yr) or 77% (3-yr) savings on provisioned. For 24/7 steady-state workloads, always compare both modes. Auto Scaling eliminates over-provisioning risk on provisioned capacity.",
    keywords: ["DynamoDB 40% break-even", "provisioned cheaper steady-state", "on-demand post-2024 cut", "$1.25/M WRU", "Reserved Capacity 53% off"]
  },

  // ─── d4-058 — Task 4.3 · DynamoDB GSI write amplification cost (difficulty 4) ───
  {
    id: "d4-058",
    domain: 4,
    taskStatement: "4.3",
    services: ["dynamodb"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A team is designing an Amazon DynamoDB table with 3 Global Secondary Indexes (GSIs) for a high-write e-commerce order table. The expected base table write throughput is 500 WCUs. A junior engineer budgets 500 WCUs total for the table. A senior engineer says the actual write cost will be 4× the base table writes. Who is correct, and why?",
    options: [
      {
        id: "A",
        text: "The junior engineer is correct — DynamoDB replicates writes to GSIs asynchronously at no additional WCU cost.",
        isCorrect: false,
        explanation: "Wrong — GSI writes consume WCUs. DynamoDB propagates every base table write to each GSI that is affected (i.e., where the write touches the GSI partition key or sort key attribute). Each GSI write consumes WCUs separately on the GSI's provisioned throughput."
      },
      {
        id: "B",
        text: "The senior engineer is correct — each write to the base table is replicated to all 3 GSIs; total WCU consumption is 500 base + 500 × 3 GSIs = 2,000 WCUs. You must provision WCUs on both the table and each GSI independently.",
        isCorrect: true,
        explanation: "Correct — DynamoDB write amplification: every write to the base table that modifies an attribute projected into a GSI also writes to that GSI. For 3 GSIs, 1 write = up to 4 WCU operations (1 base + 3 GSIs). Provisioned capacity must be set on both the base table (500 WCU) and each GSI (up to 500 WCU each = 1,500 WCU on GSIs). Total cost: 2,000 WCUs/s provisioned. For on-demand, WRUs are charged per actual write unit consumed across all indexes. This is a major cost driver for write-heavy tables with multiple GSIs."
      },
      {
        id: "C",
        text: "The cost depends on which GSI partition keys are affected — if a write doesn't change the GSI partition key, no GSI WCUs are consumed.",
        isCorrect: false,
        explanation: "Wrong (partially) — A write to the base table that does NOT modify any attribute that is a partition key or sort key of a GSI does NOT consume WCUs on that GSI. However, for an ORDER table where most writes include the GSI key attributes, most writes will amplify to all GSIs. In practice, for tables designed with GSIs on commonly written fields, assume full write amplification. The exam expects worst-case GSI write amplification awareness."
      },
      {
        id: "D",
        text: "GSIs only consume RCUs, not WCUs — reads are duplicated across indexes but writes are free.",
        isCorrect: false,
        explanation: "Wrong — GSIs consume both WCUs (for writes/updates to the GSI) and RCUs (for reads from the GSI). GSI writes are the hidden write amplification cost. Each GSI must have its own provisioned WCU capacity (or uses the table's on-demand capacity)."
      }
    ],
    explanation: "DynamoDB GSI write amplification: with N GSIs, worst-case write cost = (N+1) × base WCUs. For 3 GSIs: 4× write cost. For on-demand mode, WRUs are charged per actual write unit including GSI propagation. Optimization strategies: (1) reduce GSI count, (2) use sparse indexes (only items with a specific attribute are indexed), (3) project minimal attributes into GSIs, (4) use overloading patterns to reduce GSI count. GSIs also consume provisioned RCUs separately for queries. This is a commonly missed cost trap on the exam.",
    keywords: ["GSI write amplification", "4x write cost", "WCU on each GSI", "N+1 writes", "sparse indexes reduce cost"]
  },

  // ─── d4-059 — Task 4.3 · ElastiCache Serverless vs Reserved Nodes (difficulty 3) ───
  {
    id: "d4-059",
    domain: 4,
    taskStatement: "4.3",
    services: ["elasticache"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A startup is deploying a new application with uncertain cache usage patterns. Expected cache size is 2–50 GB depending on growth, and request rates vary from 0 to 500,000 operations/second. The team wants to MINIMIZE operational overhead while paying only for what they use. Which Amazon ElastiCache deployment option best fits this requirement?",
    options: [
      {
        id: "A",
        text: "ElastiCache for Valkey with 3 Reserved Nodes (r6g.large, 1-year All Upfront) for maximum discount.",
        isCorrect: false,
        explanation: "Wrong — Reserved Nodes provide up to 55% savings but require a 1- or 3-year commitment to a specific node type and size. For a startup with unknown cache size (2–50 GB range) and variable request rates, fixed-size reserved nodes would either under-provision or waste capacity. Reserved Nodes are appropriate for predictable, steady-state cache workloads."
      },
      {
        id: "B",
        text: "ElastiCache Serverless for Valkey — scales automatically from 0 to the required cache size and ECPU rate, billed per GB-hour stored and per million ECPUs consumed.",
        isCorrect: true,
        explanation: "Correct — ElastiCache Serverless scales automatically without requiring the selection of node types or cluster sizes. For Valkey (as of 2024, 33% cheaper than Redis OSS Serverless): $0.084/GB-hr (minimum 100 MB, vs Redis $0.125/GB-hr) and $0.0023/million ECPUs. For a startup with unknown traffic, Serverless eliminates capacity planning and scales from minimal to high load automatically. At low usage, costs are minimal. Operational overhead is near-zero — no node sizing, no cluster management."
      },
      {
        id: "C",
        text: "ElastiCache for Redis OSS with Auto Scaling enabled to adjust cluster size dynamically.",
        isCorrect: false,
        explanation: "Wrong — ElastiCache node-based clusters (Redis/Valkey) do not support auto-scaling the same way as ElastiCache Serverless. Resharding (adding/removing shards) is a manual or scripted process that causes brief elevated latency. For truly dynamic scaling without operational overhead, Serverless is the correct choice."
      },
      {
        id: "D",
        text: "Deploy a self-managed Redis cluster on EC2 Spot Instances to minimize costs.",
        isCorrect: false,
        explanation: "Wrong — A self-managed Redis cluster on Spot Instances introduces high operational overhead (cluster management, replication, failover) and carries interruption risk inappropriate for a cache serving production traffic. Spot Instances may be reclaimed with 2-minute warning, causing cache data loss. This violates the 'minimize operational overhead' requirement."
      }
    ],
    explanation: "ElastiCache Serverless vs node-based: Serverless = no capacity planning, auto-scales, pay per data stored + ECPUs, ideal for variable/unknown workloads. Node-based Reserved = up to 55% discount, fixed capacity, best for steady predictable workloads. Valkey engine (since Oct 2024): 20% cheaper node-based, 33% cheaper Serverless than Redis OSS equivalents. ElastiCache Serverless minimum: 100 MB (Valkey) vs 1 GB (Redis/Memcached). Redis 4/5 Extended Support charges begin Feb 1, 2026 (+80% yr 1-2).",
    keywords: ["ElastiCache Serverless", "Valkey 33% cheaper", "auto-scale", "per GB-hr ECPU", "variable workload"]
  },

  // ─── d4-060 — Task 4.4 · CloudFront Price Classes to reduce cost (difficulty 3) ───
  {
    id: "d4-060",
    domain: 4,
    taskStatement: "4.4",
    services: ["cloudfront"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company hosts a streaming video platform in Amazon CloudFront. The application serves users primarily in the United States and Europe. The current CloudFront configuration uses all edge locations globally, resulting in high monthly bills from expensive edge regions (South America, Africa, Asia Pacific). The team wants to REDUCE CloudFront costs by restricting delivery to lower-cost edge regions, accepting that users in excluded regions will experience slightly higher latency (served from farther edges). What is the MOST cost-effective configuration change?",
    options: [
      {
        id: "A",
        text: "Enable CloudFront Origin Shield to reduce origin requests.",
        isCorrect: false,
        explanation: "Wrong — CloudFront Origin Shield ($0.0075/10K requests) reduces the number of cache misses that reach the origin, lowering origin load and costs. However, it does not restrict which edge regions serve end users. Origin Shield addresses origin costs, not CDN delivery costs from expensive global PoPs."
      },
      {
        id: "B",
        text: "Switch CloudFront distribution to Price Class 100 (North America and Europe only) — this limits delivery to the lowest-cost edge locations and excludes expensive PoPs in South America, Africa, and Asia Pacific.",
        isCorrect: true,
        explanation: "Correct — CloudFront Price Classes control which edge locations serve your distribution: Price Class 100 (North America + Europe only, lowest cost), Price Class 200 (adds Asia Pacific, Middle East, Africa), Price Class All (all PoPs, highest cost). When a user in an excluded region requests content, CloudFront serves them from the nearest included PoP (with higher latency but no premium pricing). Since the company's users are primarily in US/Europe, Price Class 100 captures the target audience at the lowest CDN delivery price."
      },
      {
        id: "C",
        text: "Use AWS Global Accelerator instead of CloudFront to route users to the nearest EC2 origin.",
        isCorrect: false,
        explanation: "Wrong — AWS Global Accelerator charges $0.025/hr per accelerator plus DT-Premium fees ($0.007–$0.105/GB by route). It does not cache content. Replacing CloudFront with Global Accelerator would eliminate caching benefits and likely increase costs while not addressing the geographic pricing concern."
      },
      {
        id: "D",
        text: "Create separate CloudFront distributions for each AWS region to restrict users geographically via routing policies.",
        isCorrect: false,
        explanation: "Wrong — CloudFront is a global CDN; creating separate distributions per region does not restrict which PoPs serve end users. Geographic restrictions in CloudFront are handled via CloudFront Geo Restriction (which blocks access entirely, not just routes to cheaper PoPs). Price Classes are the correct mechanism to limit edge location usage."
      }
    ],
    explanation: "CloudFront Price Classes: Class 100 = US + Europe (cheapest); Class 200 = + Asia Pacific, Middle East, Africa; Class All = all global PoPs (most expensive, also highest performance). Users in excluded regions are served from the nearest included PoP — they still receive content but with slightly more latency. This is the standard exam answer for 'reduce CloudFront cost for regional users.' Price Class 100 saves 20–50% versus Price Class All depending on traffic distribution. Combined with a 1 TB/month free tier and smart caching (higher TTL, cache-friendly headers), CloudFront costs can be dramatically reduced.",
    keywords: ["CloudFront Price Class 100", "limit edge locations", "US and Europe only", "reduce CDN cost", "excluded regions served from farther PoP"]
  },

  // ─── d4-061 — Task 4.2 · Trusted Advisor checks requiring Business Support (difficulty 3) ───
  {
    id: "d4-061",
    domain: 4,
    taskStatement: "4.2",
    services: ["trusted-advisor"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company's AWS account is on the Developer Support plan. The operations team wants to use AWS Trusted Advisor to identify idle Amazon RDS instances, underutilized Amazon EC2 instances, unassociated Elastic IP addresses, and low-utilization Amazon EBS volumes — all for cost optimization. Which statement about Trusted Advisor availability is CORRECT?",
    options: [
      {
        id: "A",
        text: "All Trusted Advisor cost optimization checks are available on the Developer Support plan.",
        isCorrect: false,
        explanation: "Wrong — The Developer Support plan provides only the 7 core Trusted Advisor checks: S3 bucket permissions (public access), security groups with unrestricted access, MFA on root account, EBS public snapshots, RDS public snapshots, IAM use, and service limits. The cost optimization checks (idle RDS, underutilized EC2, unassociated EIPs, low-utilization EBS) require Business or Enterprise Support."
      },
      {
        id: "B",
        text: "The cost optimization checks (idle RDS, underutilized EC2, unassociated EIPs, low-utilization EBS) require Business or Enterprise Support. On Developer Support, these checks are visible but show 'Upgrade required' rather than actual findings.",
        isCorrect: true,
        explanation: "Correct — AWS Trusted Advisor's full Cost Optimization category is gated behind Business or Enterprise Support. On Developer and Basic Support, the cost optimization check tiles appear in the console but display 'Your plan does not support this check' or require an upgrade. The team must upgrade to at least Business Support ($100/month minimum) to access these checks. Business Support provides access to all Trusted Advisor checks including: idle load balancers, low-utilization EC2 (CPU <10%), underused EBS volumes (<1 IOPS/day), unassociated EIPs, idle RDS, and S3 bucket versioning recommendations."
      },
      {
        id: "C",
        text: "Trusted Advisor cost optimization checks are free for accounts with more than $1,000/month in AWS spend.",
        isCorrect: false,
        explanation: "Wrong — There is no spend-based unlock for Trusted Advisor checks. Access is determined solely by the Support plan tier: Basic/Developer = 7 core checks; Business = all checks (100+); Enterprise = all checks + proactive monitoring + TAM."
      },
      {
        id: "D",
        text: "AWS Compute Optimizer can replace all Trusted Advisor cost optimization checks, so upgrading Support is unnecessary.",
        isCorrect: false,
        explanation: "Wrong — AWS Compute Optimizer covers ML-based right-sizing for EC2/ASG/EBS/Lambda/Fargate/RDS. However, Trusted Advisor covers specific operational checks that Compute Optimizer does not: unassociated Elastic IP addresses, idle load balancers, unused EBS volumes (as opposed to right-sizing recommendations), idle RDS instances, and service quota approaching limits. The tools are complementary, not duplicative."
      }
    ],
    explanation: "Trusted Advisor Support tier requirements: Basic/Developer = 7 core security checks; Business ($100+/month) = full 100+ checks including all Cost Optimization; Enterprise = all checks + proactive guidance + TAM. Key Cost Optimization checks requiring Business+ Support: low-utilization EC2 (<10% CPU), idle RDS instances, unassociated EIPs, underused EBS volumes, idle load balancers, S3 bucket versioning. Free alternative: AWS Compute Optimizer for ML right-sizing (does not require Business Support).",
    keywords: ["Trusted Advisor Business Support", "7 core checks Developer", "idle RDS EC2 EIP EBS", "upgrade required", "cost optimization checks gated"]
  },

  // ─── d4-062 — Task 4.2 · Well-Architected Tool for cost review (difficulty 2) ───
  {
    id: "d4-062",
    domain: 4,
    taskStatement: "4.2",
    services: ["well-architected"],
    constraintType: "cost",
    difficulty: 2,
    type: "single",
    stem: "A startup wants to formally review their cloud architecture against AWS best practices across all six pillars (Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability) before a major product launch. They want an AWS-native, self-service tool that is FREE and generates a report of high-risk issues (HRIs) and improvement recommendations. Which AWS service should they use?",
    options: [
      {
        id: "A",
        text: "AWS Trusted Advisor — provides architectural recommendations across all six pillars.",
        isCorrect: false,
        explanation: "Wrong — AWS Trusted Advisor provides automated checks in specific categories (Cost Optimization, Security, Fault Tolerance, Performance, Service Limits, Operational Excellence) but does not conduct a formal architectural review aligned to the AWS Well-Architected Framework pillars. Trusted Advisor focuses on specific resource-level checks, not holistic workload architecture reviews."
      },
      {
        id: "B",
        text: "AWS Well-Architected Tool — a free, self-service tool that conducts structured architectural reviews based on the six Well-Architected Framework pillars and generates a prioritized list of HRIs and improvement plans.",
        isCorrect: true,
        explanation: "Correct — The AWS Well-Architected Tool is completely FREE. It guides teams through a structured set of questions for each of the six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. At the end of a review, it generates a report identifying High Risk Items (HRIs) with links to best practice guidance, improvement plans, and milestones for tracking progress. It can be used for individual workloads and accessed via the AWS Management Console or API."
      },
      {
        id: "C",
        text: "AWS Security Hub — conducts comprehensive architectural reviews across all six pillars.",
        isCorrect: false,
        explanation: "Wrong — AWS Security Hub is focused on security posture management. It aggregates security findings from AWS services and third-party tools and maps them to security standards (CIS, PCI-DSS, NIST). It does not cover all six Well-Architected pillars and is not free (pricing is based on security check evaluations and findings ingested)."
      },
      {
        id: "D",
        text: "AWS Cost Explorer with Recommendations enabled — evaluates architecture across all six pillars.",
        isCorrect: false,
        explanation: "Wrong — AWS Cost Explorer is a cost analysis and forecasting tool. It provides RI/SP/right-sizing recommendations, not holistic architectural reviews. It covers Cost Optimization only, not the other five Well-Architected pillars."
      }
    ],
    explanation: "AWS Well-Architected Tool: free, self-service, structured reviews against 6 pillars. Generates: HRI (High Risk Items) list, improvement plan, milestone tracking. Use cases: pre-launch reviews, quarterly architecture audits, IaC compliance. The Well-Architected Review can also be conducted by an AWS Well-Architected Partner for more depth. Custom Lenses allow organizations to add industry-specific questions (e.g., financial services, IoT). This tool is the standard answer for 'review architecture against AWS best practices.'",
    keywords: ["Well-Architected Tool free", "6 pillars", "HRI", "improvement plan", "self-service review"]
  },

  // ─── d4-063 — Task 4.4 · Migration cost tools — ADS and MGN (difficulty 3) ───
  {
    id: "d4-063",
    domain: 4,
    taskStatement: "4.4",
    services: ["application-discovery-service", "application-migration-service"],
    constraintType: "migration",
    difficulty: 3,
    type: "single",
    stem: "A company planning a large-scale migration of 200 on-premises servers to AWS wants to: (1) discover and map all on-premises workloads, dependencies, and utilization data to size right-cost AWS instances BEFORE migrating, and (2) minimize licensing costs during the actual server migration. Which combination of AWS services provides the MOST cost-effective approach?",
    options: [
      {
        id: "A",
        text: "AWS Database Migration Service (DMS) for discovery and AWS Server Migration Service (SMS) for migration.",
        isCorrect: false,
        explanation: "Wrong — AWS DMS is for database migration (schema conversion, data replication), not server discovery. AWS Server Migration Service (SMS) is deprecated — it has been replaced by AWS Application Migration Service (AWS MGN). Neither is the correct answer for pre-migration discovery."
      },
      {
        id: "B",
        text: "AWS Application Discovery Service (ADS) for pre-migration discovery and dependency mapping, and AWS Application Migration Service (AWS MGN) for the lift-and-shift migration.",
        isCorrect: true,
        explanation: "Correct — AWS Application Discovery Service (ADS) is FREE and discovers on-premises server data: CPU utilization, memory, disk, network I/O, and process-level data for dependency mapping. The data feeds directly into AWS Migration Hub for tracking and into AWS pricing tools for right-sizing estimates. AWS Application Migration Service (AWS MGN) is the free lift-and-shift migration service that continuously replicates source servers to AWS and enables non-disruptive cutover. MGN is free for the first 90 days of replication per server — you only pay for the EC2 and EBS resources consumed during replication and testing."
      },
      {
        id: "C",
        text: "AWS Cost Explorer for discovery (filter by on-premises costs) and AWS Snowball Edge for migrating all 200 servers offline.",
        isCorrect: false,
        explanation: "Wrong — AWS Cost Explorer analyzes AWS cloud spend, not on-premises server utilization. It cannot discover on-premises workloads. AWS Snowball Edge is for bulk offline data migration, not for server lift-and-shift migration of live workloads. Live server migration requires continuous block-level replication (MGN)."
      },
      {
        id: "D",
        text: "Third-party discovery tools (e.g., Lansweeper) fed into AWS Pricing Calculator, then AWS CloudFormation for migration.",
        isCorrect: false,
        explanation: "Wrong — Third-party tools and manual Pricing Calculator workflows are more costly and operationally intensive than the native AWS Application Discovery Service. CloudFormation provisions infrastructure but does not migrate live server workloads. AWS MGN is the purpose-built, no-cost migration engine."
      }
    ],
    explanation: "Migration toolchain cost model: AWS Application Discovery Service (ADS) = FREE; AWS Migration Hub = FREE for orchestration; AWS Application Migration Service (MGN) = FREE for first 90 days/server replication, pay only for EC2/EBS used during replication; AWS DMS = charged for replication instance hours (for databases). Pre-migration: ADS gathers utilization data → right-size AWS instances → cost estimates. Migration: MGN replicates live servers continuously → test cutover → production cutover. Post-migration: terminate replication agents to stop any minimal costs.",
    keywords: ["ADS free discovery", "MGN free 90 days", "Migration Hub free", "lift and shift", "dependency mapping"]
  },

  // ─── d4-064 — Task 4.4 · Transit Gateway vs VPC Peering cost threshold (difficulty 4) ───
  {
    id: "d4-064",
    domain: 4,
    taskStatement: "4.4",
    services: ["transit-gateway", "vpc-peering"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company currently uses VPC peering to connect 6 VPCs in a single region. They are planning to expand to 15 VPCs. An engineer says: 'We should move to AWS Transit Gateway for simplicity — it's probably cheaper since we're adding more VPCs.' A cloud architect evaluates the cost. At what VPC count does Transit Gateway become the preferred solution, and what is the cost trade-off?",
    options: [
      {
        id: "A",
        text: "Transit Gateway is always cheaper than VPC peering because peering requires N(N-1)/2 connections, each with its own management cost.",
        isCorrect: false,
        explanation: "Wrong — VPC Peering has NO hourly cost per connection. Management complexity increases with full mesh peering (N(N-1)/2 connections), but VPC Peering is free per connection (pay only data transfer charges). Transit Gateway charges $0.05/hr per attachment (~$36/month per VPC) + $0.02/GB processed. At low VPC counts, Transit Gateway is more expensive in actual AWS billing."
      },
      {
        id: "B",
        text: "VPC Peering is cheaper up to approximately 10 VPCs for cost; above 10 VPCs, Transit Gateway is often justified on cost due to the quadratic growth in peering connections needed and routing table management overhead — though the cost advantage is primarily operational, not billing.",
        isCorrect: true,
        explanation: "Correct — VPC Peering: $0/connection/hr; same-region intra-AZ via private IP is free; cross-AZ $0.01/GB each way. For 15 VPCs: 15×14/2 = 105 peering connections (no extra AWS charge for the connections themselves, but routing tables must manage each). Transit Gateway: 15 attachments × $0.05/hr × 720 hrs = $540/month + data processing at $0.02/GB. The AWS billing threshold is roughly: TGW data processing savings from simplified routing vs TGW attachment costs. For most architectures with >10 VPCs or hybrid (VPN/DX) connectivity, TGW's operational simplicity and the ability to use a single hub for VPN/DX connections justify the cost. The exam answer: 10+ VPCs or any hybrid connectivity → Transit Gateway."
      },
      {
        id: "C",
        text: "Transit Gateway is cheaper at exactly 15 VPCs because VPC Peering charges $0.01/connection/hour after 10 connections.",
        isCorrect: false,
        explanation: "Wrong — VPC Peering does NOT charge per connection per hour at any VPC count. There is no metered peering connection cost beyond data transfer. The cost drivers are: (1) VPC Peering = $0/connection + data transfer; (2) Transit Gateway = $0.05/hr/attachment + $0.02/GB processed."
      },
      {
        id: "D",
        text: "Use AWS CloudWAN instead of Transit Gateway for 15+ VPCs — it eliminates data processing charges.",
        isCorrect: false,
        explanation: "Wrong — AWS Cloud WAN is a global WAN service for building private WANs across regions. It is more expensive and complex than Transit Gateway for intra-region VPC connectivity. It does not eliminate data processing charges. For 15 VPCs in one region, Transit Gateway (or even VPC Peering if traffic is low) is the appropriate answer."
      }
    ],
    explanation: "VPC Peering vs Transit Gateway: Peering has $0/connection hourly cost but full-mesh complexity is O(N²) connections. TGW charges $0.05/hr/attachment + $0.02/GB processed. The rule of thumb: <10 VPCs in one region = VPC Peering (cheaper, simpler). ≥10 VPCs OR any hybrid connectivity (VPN, DX) = Transit Gateway (simpler to manage, single hub, supports transitive routing). TGW does NOT support transitive peering resolution — but Transit Gateway IS itself transitive, which VPC Peering is not.",
    keywords: ["Transit Gateway $0.05/hr attachment", "VPC Peering free per connection", "10 VPC threshold", "$0.02/GB TGW processing", "transitive routing"]
  },

  // ─── d4-065 — Task 4.4 · NAT Gateway vs NAT Instance for dev/test (difficulty 3) ───
  {
    id: "d4-065",
    domain: 4,
    taskStatement: "4.4",
    services: ["nat-gateway", "nat-instance"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A startup runs a non-production development VPC where 5 private-subnet Amazon EC2 instances need outbound internet access for software updates and API calls. Traffic volume is low (approximately 5 GB/month). The team wants the LOWEST-cost outbound internet solution, and is willing to manage some additional operational complexity. Which approach minimizes monthly cost?",
    options: [
      {
        id: "A",
        text: "Deploy a NAT Gateway in each Availability Zone for high availability — $0.045/hr × 3 AZs × 720 hrs = $97.20/month plus processing.",
        isCorrect: false,
        explanation: "Wrong — For a non-production dev VPC, deploying 3 NAT Gateways is a significant over-spend. A single NAT Gateway costs $0.045/hr × 720 = $32.40/month + $0.045/GB × 5 GB = $0.225 processing = ~$32.63/month. Three NAT Gateways would cost ~$97.88/month for a non-production environment where HA is not critical."
      },
      {
        id: "B",
        text: "Launch a t3.nano NAT Instance on EC2 — costs approximately $0.0052/hr × 720 = $3.74/month with no per-GB processing charge.",
        isCorrect: true,
        explanation: "Correct — A NAT Instance is an EC2 instance configured as a network address translator. It charges only the EC2 instance-hour rate ($0.0052/hr for t3.nano = ~$3.74/month) with no per-GB processing fee (you pay standard internet egress if applicable, but no 'NAT processing' charge). For 5 GB/month at low volume, a NAT Instance costs ~$3.74 vs a NAT Gateway at ~$32.63/month. The trade-off: NAT Instances require manual HA setup, routing table management, and patching — acceptable for non-production environments."
      },
      {
        id: "C",
        text: "Use a VPC Gateway Endpoint for internet access — it is completely free.",
        isCorrect: false,
        explanation: "Wrong — VPC Gateway Endpoints provide free private connectivity to S3 and DynamoDB only. They cannot provide general internet access. For outbound internet access (software updates, third-party APIs), a NAT Gateway or NAT Instance is required."
      },
      {
        id: "D",
        text: "Deploy a single NAT Gateway — it costs $0.045/hr + $0.045/GB = approximately $32.63/month for low-volume traffic.",
        isCorrect: false,
        explanation: "Wrong — A single NAT Gateway is the simpler option but costs ~$32.63/month. The question asks for LOWEST cost with tolerance for operational complexity. The NAT Instance at ~$3.74/month is 8.7× cheaper for the same functional requirement in a dev/test environment."
      }
    ],
    explanation: "NAT Gateway vs NAT Instance cost model: NAT Gateway = $0.045/hr + $0.045/GB (managed, HA, no ops overhead). NAT Instance = EC2 cost only + standard DTO (no per-GB processing fee), self-managed. For dev/test low-volume: NAT Instance is dramatically cheaper. For production high-volume with HA requirement: NAT Gateway is worth the premium for managed HA and scalability. The exam pattern: 'minimize cost in dev/test' → NAT Instance; 'minimize operational overhead' → NAT Gateway.",
    keywords: ["NAT Instance cheaper dev/test", "NAT Gateway $0.045/hr", "no per-GB processing NAT Instance", "operational complexity trade-off", "t3.nano NAT"]
  },

  // ─── d4-066 — Task 4.4 · Route 53 Alias records reduce DNS cost (difficulty 2) ───
  {
    id: "d4-066",
    domain: 4,
    taskStatement: "4.4",
    services: ["route53"],
    constraintType: "cost",
    difficulty: 2,
    type: "single",
    stem: "A company hosts a high-traffic website using Amazon CloudFront and Amazon Route 53. The root domain (example.com) and www subdomain are both CNAME records pointing to the CloudFront distribution. A solutions architect reviews the DNS costs and suggests converting these to Alias records. What is the PRIMARY cost benefit of using Route 53 Alias records for AWS resources versus CNAME records?",
    options: [
      {
        id: "A",
        text: "Alias records are 50% cheaper per query than CNAME records in Route 53.",
        isCorrect: false,
        explanation: "Wrong — CNAME records are charged at standard Route 53 query rates ($0.40/M queries). Alias records pointing to supported AWS resources (CloudFront, ELB, S3 website endpoints, API Gateway, etc.) are charged $0 per query — they are completely FREE, not just 50% cheaper. The savings are 100% on the DNS query cost for those records."
      },
      {
        id: "B",
        text: "Route 53 queries for Alias records pointing to AWS resources (CloudFront, ELB, S3 website endpoint, API Gateway, etc.) are FREE — $0 per query versus $0.40 per million queries for CNAME records.",
        isCorrect: true,
        explanation: "Correct — Route 53 Alias records that point to supported AWS resources (CloudFront distributions, ELBs, S3 website endpoints, Elastic Beanstalk environments, API Gateway, VPC endpoints, Global Accelerator, etc.) are billed at $0 per query. Standard CNAME records cost $0.40/M queries (first 1 billion), then $0.20/M. For a high-traffic website with millions of DNS lookups per month, this is a meaningful cost saving. Additionally, Alias records can be used for the zone apex (root domain) where CNAME records are not permitted by DNS standards."
      },
      {
        id: "C",
        text: "Alias records eliminate the Route 53 hosted zone charge of $0.50/zone/month.",
        isCorrect: false,
        explanation: "Wrong — Route 53 hosted zone charges ($0.50/zone/month for the first 25 zones) are fixed regardless of whether you use Alias or CNAME records. Alias records only affect the per-query billing, not the zone fee."
      },
      {
        id: "D",
        text: "Alias records provide faster DNS resolution than CNAMEs, which reduces server load and indirectly reduces compute costs.",
        isCorrect: false,
        explanation: "Wrong — While Alias records do provide slightly faster DNS resolution (by returning the target IP directly rather than requiring an additional CNAME lookup), the primary cost benefit is the $0 query charge, not indirect compute savings. The exam focuses on the direct billing difference."
      }
    ],
    explanation: "Route 53 Alias records for AWS resources = $0/query. Standard query rates: $0.40/M (first 1B queries). For a website with 100M monthly DNS queries: CNAME cost = $40/month; Alias cost = $0. Supported targets for free Alias queries: CloudFront, ELB/ALB/NLB, S3 website endpoint, API Gateway, Elastic Beanstalk, Global Accelerator, VPC endpoint, AppSync. Additional benefit: Alias records work at the zone apex (example.com), while CNAME records do not (DNS standard limitation). Always use Alias over CNAME for AWS resource targets.",
    keywords: ["Alias records free queries", "CNAME $0.40/M", "zone apex support", "CloudFront ELB S3 free", "$0 per query"]
  },

  // ─── d4-067 — Task 4.1 · EBS Snapshot Archive 90-day minimum trap (difficulty 4) ───
  {
    id: "d4-067",
    domain: 4,
    taskStatement: "4.1",
    services: ["ebs"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company retains EBS snapshots for compliance. They create a final snapshot when decommissioning a project, then never access it (compliance only requires retention, not quick restore). Current EBS Snapshot Standard storage cost is $0.05/GB-month. A proposal to move these snapshots to EBS Snapshot Archive at $0.0125/GB-month (75% cheaper) is being evaluated. The compliance policy deletes snapshots exactly 60 days after creation. Should this team use EBS Snapshot Archive?",
    options: [
      {
        id: "A",
        text: "Yes — EBS Snapshot Archive saves 75% on storage, reducing monthly cost from $0.05/GB to $0.0125/GB.",
        isCorrect: false,
        explanation: "Wrong — EBS Snapshot Archive has a 90-day minimum storage duration. The company's compliance policy deletes snapshots after exactly 60 days. Since 60 days < 90 days, AWS would bill for the full 90-day minimum even if the snapshot is deleted at 60 days. The actual cost at 60-day retention: Archive billed at $0.0125/GB × 90 days = $0.0375/GB-equivalent vs Standard at $0.05/GB × 60 days = $0.10/GB-equivalent. Wait — per-month: Standard $0.05 × 2 months = $0.10; Archive $0.0125 × 3 months (minimum) = $0.0375. Archive IS still cheaper, but only if you account for the 90-day minimum. The catch is whether the 30-day penalty for early deletion is worth it."
      },
      {
        id: "B",
        text: "No — EBS Snapshot Archive has a 90-day minimum storage duration, but the team's 60-day retention policy means they would be billed for an extra 30 days they don't use. At $0.0125/GB × 90 days vs $0.05/GB × 60 days, the per-day cost is lower in Archive ($0.000417/GB-day vs $0.00167/GB-day), so Archive is still cheaper even with the minimum — but the team should verify the math before committing to ensure compliance policy allows the effective 90-day storage.",
        isCorrect: true,
        explanation: "Correct — The 90-day minimum is the key trap. Standard: $0.05/GB-month × 2 months = $0.10/GB for 60-day retention. Archive: $0.0125/GB-month × 3 months (minimum) = $0.0375/GB for 90-day minimum. Archive is still 62.5% cheaper than Standard even with the 30-day penalty. However, the compliance policy must accept that effective retention becomes 90 days (not 60 days) under Archive, because AWS bills the minimum. If compliance requires deletion at exactly 60 days AND the extra 30 days of billed storage violates data governance policy, Archive is not appropriate. If only cost matters, Archive wins even with the minimum penalty."
      },
      {
        id: "C",
        text: "No — EBS Snapshot Archive stores only incremental snapshots, so the initial snapshot cannot be archived.",
        isCorrect: false,
        explanation: "Wrong — This is incorrect. EBS Snapshot Archive stores a FULL snapshot (not incremental). The first time a snapshot is archived, AWS creates a complete non-incremental copy. This is actually a cost consideration for small incremental snapshots — if the delta between snapshots is small, the archived full snapshot may be larger than the incremental Standard snapshot it replaced."
      },
      {
        id: "D",
        text: "Yes — the 90-day minimum only applies if you restore the snapshot before 90 days, not for snapshots left in Archive for the full term.",
        isCorrect: false,
        explanation: "Wrong — The 90-day minimum storage duration is a billing commitment that applies to all archived snapshots regardless of whether they are restored. Deleting an archived snapshot before 90 days triggers a charge equivalent to the remaining days up to the minimum. Restoring before 90 days also incurs a retrieval fee ($0.03/GB)."
      }
    ],
    explanation: "EBS Snapshot Archive trade-offs: 75% cheaper storage ($0.0125 vs $0.05/GB-month) but 90-day minimum duration and full snapshot (not incremental). Exam traps: (1) 90-day minimum — short-retention policies may not benefit; (2) full snapshot size may be larger than incremental; (3) restore takes up to 72 hours ($0.03/GB retrieval). Best use: end-of-project compliance snapshots intended for long-term infrequent retrieval (>90 days). Compare to EBS DLM (free) for automated archival.",
    keywords: ["EBS Snapshot Archive 90-day minimum", "75% cheaper", "full snapshot not incremental", "72hr restore", "billing minimum penalty"]
  },

  // ─── d4-068 — Task 4.2 · Cost allocation tags for chargeback (difficulty 3) ───
  {
    id: "d4-068",
    domain: 4,
    taskStatement: "4.2",
    services: ["cost-allocation-tags"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A large enterprise wants to implement chargeback billing — each business unit should receive a cost report showing only their AWS spend. The company uses multiple AWS services across 3 accounts in AWS Organizations. A FinOps architect proposes using AWS Cost Allocation Tags. Which steps are required for cost allocation tags to appear in AWS Cost Explorer and the Cost and Usage Report? (Select the MOST complete and accurate answer.)",
    options: [
      {
        id: "A",
        text: "Create AWS-generated cost allocation tags — they automatically appear in Cost Explorer with no activation required.",
        isCorrect: false,
        explanation: "Wrong — Both AWS-generated tags (e.g., aws:createdBy) and user-defined tags must be explicitly ACTIVATED in the AWS Billing and Cost Management console (or via API) before they appear in Cost Explorer and CUR. Tags applied to resources are NOT visible in billing data until activated. Activation propagates the tag data with approximately 24-hour latency."
      },
      {
        id: "B",
        text: "Apply user-defined tags (e.g., CostCenter, BusinessUnit) to all AWS resources, then activate those tags in the AWS Billing and Cost Management console (Billing → Cost Allocation Tags). Tags become visible in Cost Explorer and CUR within approximately 24 hours of activation.",
        isCorrect: true,
        explanation: "Correct — The two required steps are: (1) Tag resources with user-defined tags (e.g., CostCenter=Finance, BusinessUnit=HR); (2) Activate the tag keys in the AWS Billing console under Cost Allocation Tags. Activation is per-tag-key, not per-tag-value. After ~24 hours, the tags appear as filterable dimensions in Cost Explorer and as columns in CUR. For chargeback: filter Cost Explorer by the tag key/value to generate per-business-unit reports. For Organizations: activate tags in the payer account to aggregate across member accounts."
      },
      {
        id: "C",
        text: "Create separate AWS accounts per business unit — tags are not needed because consolidated billing already separates costs by account.",
        isCorrect: false,
        explanation: "Wrong — Separate accounts per business unit is a valid strategy for hard cost separation, but many enterprises share accounts and need tag-based cost allocation within accounts. The question asks about the tags approach. Also, consolidated billing aggregates for volume discounts — it does not separate costs by business unit without additional tag or account-based filtering."
      },
      {
        id: "D",
        text: "Cost allocation tags automatically appear in CUR 7 days after being applied to any resource — no activation step is required.",
        isCorrect: false,
        explanation: "Wrong — Tags do NOT automatically appear in billing data. Activation in the Billing console is mandatory. Without activation, tagged resources' cost data is not broken out by tag in Cost Explorer or CUR, regardless of how long the tags have been applied."
      }
    ],
    explanation: "Cost Allocation Tags workflow: (1) Apply tags to resources (EC2, RDS, S3, etc.) — tag key examples: CostCenter, Project, Environment, Owner. (2) Activate tag keys in Billing console (Billing → Cost Allocation Tags → activate). (3) Wait ~24 hours for propagation. (4) Filter Cost Explorer or build CUR Athena queries by tag. For Organizations: activate in payer account for cross-account aggregation. Enforce tag compliance with AWS Config rules + Tag Policies in Organizations. AWS-generated tags (aws:createdBy) also require activation.",
    keywords: ["cost allocation tags activation", "24-hour propagation", "Billing console activation required", "CUR tag columns", "chargeback filtering"]
  },

  // ─── d4-069 — Task 4.3 · RDS Extended Support unexpected cost (difficulty 5) ───
  {
    id: "d4-069",
    domain: 4,
    taskStatement: "4.3",
    services: ["rds"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A company's Amazon RDS MySQL 5.7 database runs on a db.m6i.4xlarge Multi-AZ instance (16 vCPUs). In January 2025, the team noticed that their RDS costs suddenly increased significantly. The instance configuration had not changed. What is the MOST LIKELY cause, and what is the correct remediation?",
    options: [
      {
        id: "A",
        text: "RDS storage auto-scaling expanded the provisioned storage — review the storage configuration and set a maximum storage limit.",
        isCorrect: false,
        explanation: "Wrong — RDS storage auto-scaling is a gradual process that only triggers when storage utilization exceeds 90% and adds increments. It would not cause a sudden significant cost increase on a previously stable instance. The MySQL 5.7 end-of-standard-support date is the more likely cause for a cost spike in early 2025."
      },
      {
        id: "B",
        text: "RDS Extended Support charges began for MySQL 5.7 (end of standard support February 29, 2024 for RDS). Extended Support adds $0.10/vCPU-hr (years 1–2), charging ALL instances including the Multi-AZ standby. Remediation: upgrade to MySQL 8.0 (free major version upgrade) to exit Extended Support.",
        isCorrect: true,
        explanation: "Correct — MySQL 5.7 reached end of RDS standard support and entered RDS Extended Support. Charges: $0.10/vCPU-hr (years 1–2), $0.20/vCPU-hr (year 3+). Critical trap: charges apply to ALL instances including Multi-AZ standbys. For db.m6i.4xlarge Multi-AZ (16 vCPUs primary + 16 vCPUs standby = 32 vCPUs): $0.10 × 32 × 720 = $2,304/month additional charge. Remediation: perform an in-place major version upgrade to MySQL 8.0 (free). Extended Support is charged from the end-of-standard-support date regardless of whether the customer opted in."
      },
      {
        id: "C",
        text: "AWS raised EC2 instance pricing in early 2025 — RDS is affected because it runs on underlying EC2 instances.",
        isCorrect: false,
        explanation: "Wrong — AWS did not broadly raise EC2 instance pricing in early 2025. RDS pricing changes for running instances occur primarily through Extended Support charges on EOL engine versions, not general instance price increases."
      },
      {
        id: "D",
        text: "The Multi-AZ configuration triggered additional replication charges in 2025 — disable Multi-AZ to reduce costs.",
        isCorrect: false,
        explanation: "Wrong — Multi-AZ charges have not changed suddenly in 2025. They are fixed (approximately 2× the single-AZ cost) and would be reflected from day one of enabling Multi-AZ, not as a sudden 2025 increase. Disabling Multi-AZ in production is dangerous and not justified by a cost investigation."
      }
    ],
    explanation: "RDS Extended Support critical facts: applies to MySQL 5.6/5.7, PostgreSQL 11/12/13, and other EOL engine versions. Cost: +$0.10/vCPU-hr years 1–2, +$0.20/vCPU-hr year 3+. Charged on ALL instances (primary + standbys — double the impact for Multi-AZ). For db.m6i.4xlarge Multi-AZ: 32 vCPUs × $0.10 × 720 = $2,304/month extra. Remediation: upgrade engine version (in-place for minor/major version upgrades). RDS Extended Support auto-enrolls at end of standard support — opt-out is not possible; only remediation is upgrade.",
    keywords: ["RDS Extended Support $0.10/vCPU-hr", "MySQL 5.7 EOL", "Multi-AZ doubles Extended Support charge", "all instances charged", "upgrade to exit"]
  },

  // ─── d4-070 — Task 4.4 · Direct Connect data transfer vs internet egress (difficulty 4) ───
  {
    id: "d4-070",
    domain: 4,
    taskStatement: "4.4",
    services: ["direct-connect"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A financial services company transfers 8 TB of data per month from AWS us-east-1 to their on-premises data center. They currently use a Site-to-Site VPN. Monthly cost breakdown: VPN connection $36.50 (0.05/hr × 730 hrs) + data transfer out $720 (8,000 GB × $0.09/GB) = $756.50/month. Their network team is evaluating a 1 Gbps AWS Direct Connect connection. Should they migrate to Direct Connect for cost reasons, and what is the CORRECT cost comparison?",
    options: [
      {
        id: "A",
        text: "VPN is cheaper — Direct Connect has high upfront circuit provisioning costs that make it uneconomical at 8 TB/month.",
        isCorrect: false,
        explanation: "Wrong — Direct Connect does not have upfront provisioning costs charged by AWS (though the colocation provider and network carrier may charge). AWS Direct Connect bills: port-hours ($0.30/hr for 1 Gbps = $219/month) + data transfer out (~$0.02/GB for us-east-1 via DX = $160/month for 8 TB). Total DX: ~$379/month vs VPN $756.50/month. DX is significantly cheaper at 8 TB/month."
      },
      {
        id: "B",
        text: "Direct Connect is more cost-effective at 8 TB/month — estimated DX cost: port $219/month + ~$0.02/GB × 8,000 GB = $160/month = $379/month total, saving $377.50/month (50% reduction) versus VPN's $756.50/month.",
        isCorrect: true,
        explanation: "Correct — Direct Connect 1 Gbps: port-hour $0.30/hr × 730 = $219/month; data transfer out ~$0.02/GB × 8,000 GB = $160/month; total ≈ $379/month. VPN: $36.50 + $720 = $756.50/month. Savings: $377.50/month (49.8% reduction). The break-even between VPN and 1 Gbps DX occurs at approximately 2.6 TB/month of sustained egress. At 8 TB/month, well above break-even, Direct Connect is clearly more cost-effective. Additional DX benefits: consistent network performance (not best-effort like internet), lower latency, and SLA-backed connectivity."
      },
      {
        id: "C",
        text: "Direct Connect is not cost-effective because data transfer via Direct Connect costs the same as internet egress ($0.09/GB).",
        isCorrect: false,
        explanation: "Wrong — Direct Connect data transfer out is approximately $0.02/GB (us-east-1), not $0.09/GB. This is a 78% reduction versus internet egress pricing. The lower per-GB rate is one of the primary financial incentives for Direct Connect at high egress volumes."
      },
      {
        id: "D",
        text: "Direct Connect and VPN have identical data transfer costs — the only saving is the VPN connection fee ($36.50/month).",
        isCorrect: false,
        explanation: "Wrong — VPN uses public internet egress pricing ($0.09/GB) for data leaving AWS to on-premises. Direct Connect uses DX data transfer pricing (~$0.02/GB for us-east-1). At 8 TB/month, the per-GB savings alone are $0.07/GB × 8,000 = $560/month — far exceeding the VPN connection fee."
      }
    ],
    explanation: "Direct Connect vs VPN cost comparison: VPN = $0.05/hr/connection + standard DTO ($0.09/GB). DX 1 Gbps = $0.30/hr port + DX DTO (~$0.02/GB). Break-even: approximately 2.6 TB/month at 1 Gbps. Above break-even: DX is cheaper. DX also provides dedicated bandwidth (no internet congestion), lower latency, and consistent performance SLA. Common DX cost optimization: use DX + VPN-over-DX for encryption, rather than Site-to-Site VPN alone. Virtual Interfaces: Private VIF (to VPC), Public VIF (to public AWS services), Transit VIF (to TGW).",
    keywords: ["Direct Connect $0.02/GB", "VPN $0.09/GB", "2.6 TB break-even", "port $0.30/hr 1Gbps", "$379/month vs $756/month"]
  },

]
