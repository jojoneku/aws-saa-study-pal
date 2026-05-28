import { Question } from "../lib/types"

export const domain4NewQuestions: Question[] = [
  // ─── d4-011 — Task 4.1 · S3 Intelligent-Tiering vs Standard-IA (difficulty 3) ───
  {
    id: "d4-011",
    domain: 4,
    taskStatement: "4.1",
    services: ["s3", "s3-intelligent-tiering"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A digital media company stores 2 million objects in Amazon Simple Storage Service (Amazon S3). Object sizes range from 50 KB to 10 MB. Access patterns are completely unpredictable — some objects are downloaded daily, others not touched for months. The team wants the MOST cost-effective single storage class without manually managing lifecycle transitions. A junior engineer proposes S3 Standard-IA. A senior engineer proposes Amazon S3 Intelligent-Tiering. Which recommendation is correct, and why?",
    options: [
      {
        id: "A",
        text: "S3 Standard-IA is correct because it is cheaper than S3 Standard and has no monitoring fee.",
        isCorrect: false,
        explanation: "Wrong — S3 Standard-IA charges a $0.01/GB retrieval fee on every GET. For objects accessed frequently, retrieval fees can exceed the storage savings. Standard-IA also has a 30-day minimum storage duration, meaning newly uploaded objects deleted or transitioned before 30 days are still billed for the full 30 days."
      },
      {
        id: "B",
        text: "S3 Intelligent-Tiering is correct because it automatically moves objects between access tiers with no retrieval fees, and the monitoring fee is negligible for objects ≥128 KB.",
        isCorrect: true,
        explanation: "Correct — S3 Intelligent-Tiering monitors access patterns and automatically moves objects to Frequent, Infrequent (30-day), Archive Instant (90-day opt-in), or Archive (90-day+ opt-in) tiers. There is NO retrieval fee for objects pulled from any tier. The only extra cost is a monitoring/automation fee of $0.0025 per 1,000 objects per month. Objects smaller than 128 KB are always stored in the Frequent tier and are NOT charged the monitoring fee. For 2 million varied-size objects with unpredictable access, Intelligent-Tiering is optimal."
      },
      {
        id: "C",
        text: "S3 Standard-IA is correct because S3 Intelligent-Tiering charges a retrieval fee when objects move out of the Archive tier.",
        isCorrect: false,
        explanation: "Wrong — This is a common trap. S3 Intelligent-Tiering does NOT charge retrieval fees for any tier, including Archive Instant and the opt-in Archive tier. S3 Standard-IA DOES charge a retrieval fee of $0.01/GB. The claim about Intelligent-Tiering charging retrieval fees is false."
      },
      {
        id: "D",
        text: "Neither — both charge retrieval fees, so S3 One Zone-IA offers the lowest total cost.",
        isCorrect: false,
        explanation: "Wrong — S3 One Zone-IA stores data in a single AZ. If that AZ fails, data is permanently lost. For 2 million objects with unknown criticality, single-AZ storage is inappropriate. Additionally, One Zone-IA still charges a retrieval fee, and S3 Intelligent-Tiering charges NO retrieval fees."
      }
    ],
    explanation: "The key exam trap is that S3 Intelligent-Tiering has NO retrieval fee, while S3 Standard-IA charges $0.01/GB on every GET. For workloads with unknown or variable access patterns, Intelligent-Tiering is always the correct recommendation. The monitoring fee ($0.0025 per 1,000 objects/month) is small for objects ≥128 KB. Objects <128 KB are stored in the Frequent tier without a monitoring charge. S3 Standard-IA is appropriate only when you know objects will be accessed infrequently and you can plan for the 30-day minimum duration.",
    keywords: ["unpredictable access patterns", "no retrieval fee", "monitoring fee", "automatic tiering", "most cost-effective"]
  },

  // ─── d4-012 — Task 4.1 · EBS gp3 vs gp2 migration (difficulty 2) ───
  {
    id: "d4-012",
    domain: 4,
    taskStatement: "4.1",
    services: ["ebs-gp3"],
    constraintType: "cost",
    difficulty: 2,
    type: "single",
    stem: "A company has 500 Amazon Elastic Block Store (Amazon EBS) gp2 volumes, each 500 GiB, attached to running Amazon EC2 instances in us-east-1. The current monthly storage cost is approximately $25,000. A cloud cost analyst recommends migrating all volumes to gp3. The workloads require 3,000 IOPS and 125 MB/s throughput. What is the PRIMARY reason this migration reduces cost WITHOUT any performance degradation?",
    options: [
      {
        id: "A",
        text: "gp3 volumes support higher IOPS than gp2, so fewer volumes are needed.",
        isCorrect: false,
        explanation: "Wrong — Both gp2 and gp3 support up to 16,000 IOPS maximum per volume. The benefit of gp3 is not that it supports more IOPS, but that the base performance (3,000 IOPS and 125 MB/s) is included at a lower price per GB."
      },
      {
        id: "B",
        text: "gp3 is priced at $0.08/GB-month versus gp2's $0.10/GB-month, and gp3 includes 3,000 IOPS and 125 MB/s throughput in the base price at no extra charge.",
        isCorrect: true,
        explanation: "Correct — gp3 is 20% cheaper per GB ($0.08 vs $0.10/GB-mo) and includes 3,000 IOPS and 125 MB/s baseline for free. Since these workloads only require 3,000 IOPS and 125 MB/s, no additional IOPS or throughput provisioning is needed. The migration saves approximately $5,000/month (500 × 500 GiB × $0.02 savings). The migration is live with zero downtime."
      },
      {
        id: "C",
        text: "gp3 volumes are automatically deduped by AWS, reducing billed capacity.",
        isCorrect: false,
        explanation: "Wrong — EBS does not perform transparent deduplication at the volume level. Storage billing is based on provisioned capacity, not actual used capacity. Deduplication is an OS-level or application-level feature."
      },
      {
        id: "D",
        text: "gp3 volumes use a different hardware tier that costs less to operate, so AWS passes the savings to customers via lower IOPS billing.",
        isCorrect: false,
        explanation: "Wrong — The reason for the cost difference is the decoupled pricing model: gp3 separates storage, IOPS, and throughput pricing, allowing customers to pay only for what they need. The hardware tier explanation is not the pricing mechanism."
      }
    ],
    explanation: "gp3 replaced gp2 as the default EBS volume type for new volumes in 2023. The two key advantages: (1) 20% lower storage price ($0.08 vs $0.10/GB-month), (2) decoupled performance — 3,000 IOPS and 125 MB/s baseline included at no extra charge. gp2 ties IOPS to capacity (3 IOPS/GB), meaning you often over-provision capacity just to get more IOPS. gp3 allows you to provision IOPS and throughput independently up to 16,000 IOPS and 1,000 MB/s. All migrations are live with no downtime.",
    keywords: ["gp3 cheaper than gp2", "20% lower cost", "3000 IOPS free baseline", "no downtime migration"]
  },

  // ─── d4-013 — Task 4.1 · S3 Glacier Instant vs Flexible Retrieval (difficulty 3) ───
  {
    id: "d4-013",
    domain: 4,
    taskStatement: "4.1",
    services: ["s3-glacier-instant", "s3-glacier-flexible"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A hospital stores radiology images (DICOM files) in Amazon Simple Storage Service (Amazon S3). Images are accessed frequently for the first 90 days after creation. After 90 days, images are accessed approximately once per quarter for follow-up appointments. When accessed after archival, the radiologist needs the image to load immediately — retrieval in milliseconds is required. Compliance requires 10-year retention. Which S3 lifecycle configuration minimizes cost while meeting the retrieval requirement?",
    options: [
      {
        id: "A",
        text: "S3 Standard for 90 days, then transition to S3 Glacier Flexible Retrieval.",
        isCorrect: false,
        explanation: "Wrong — S3 Glacier Flexible Retrieval provides retrieval in minutes to 12 hours (Expedited: 1-5 min paid, Standard: 3-5 hr, Bulk: 5-12 hr free). None of these options deliver millisecond retrieval. A radiologist needing images immediately during a patient appointment cannot wait minutes."
      },
      {
        id: "B",
        text: "S3 Standard for 90 days, then transition to Amazon S3 Glacier Instant Retrieval.",
        isCorrect: true,
        explanation: "Correct — S3 Glacier Instant Retrieval provides millisecond retrieval latency (identical to S3 Standard) at ~$0.004/GB-month, versus S3 Standard's ~$0.023/GB-month. The 90-day minimum storage duration aligns perfectly with the access pattern (active for 90 days in Standard, then transitioned). Retrieval is instant on demand. 10-year retention exceeds the 90-day minimum."
      },
      {
        id: "C",
        text: "S3 Standard for 90 days, then transition to S3 Glacier Deep Archive.",
        isCorrect: false,
        explanation: "Wrong — S3 Glacier Deep Archive provides retrieval in 12-48 hours. Millisecond retrieval for a radiologist reviewing patient images during an appointment is impossible with Deep Archive. Cost savings do not justify patient care delays."
      },
      {
        id: "D",
        text: "S3 Standard-IA for 90 days, then transition to S3 Glacier Instant Retrieval at day 90.",
        isCorrect: false,
        explanation: "Wrong — S3 Standard-IA has a 30-day minimum storage duration and a retrieval fee. Since the images are accessed frequently during the first 90 days, Standard-IA would incur retrieval fees on those frequent accesses, making it more expensive than S3 Standard for the active period. S3 Standard is the correct choice for the active 90-day window."
      }
    ],
    explanation: "S3 Glacier Instant Retrieval is purpose-built for archives that are accessed rarely but must be delivered immediately (millisecond latency) when requested. Medical images, news archives, and legal documents fit this pattern. The 90-day minimum storage duration and ~$0.004/GB-month pricing (vs ~$0.023 for Standard) make it ideal after the active access period ends. S3 Glacier Flexible Retrieval is appropriate when waiting minutes to hours is acceptable. Always match the retrieval SLA to the correct storage class.",
    keywords: ["millisecond retrieval", "quarterly access", "radiology images", "Glacier Instant Retrieval", "medical compliance"]
  },

  // ─── d4-014 — Task 4.1 · EFS storage tiers and lifecycle (difficulty 3) ───
  {
    id: "d4-014",
    domain: 4,
    taskStatement: "4.1",
    services: ["efs-ia"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A bioinformatics company stores genomic analysis results in Amazon Elastic File System (Amazon EFS) Standard across multiple Amazon EC2 instances. Monthly storage costs are $15,000 for 50 TB. A usage analysis reveals that 80% of files have not been accessed in over 30 days. The team needs continuous POSIX-compliant shared file access with no changes to application code. What is the MOST cost-effective configuration change to reduce storage costs?",
    options: [
      {
        id: "A",
        text: "Migrate the data to Amazon S3 Standard and use the AWS DataSync agent to sync files to EC2 instances on demand.",
        isCorrect: false,
        explanation: "Wrong — Migrating to S3 eliminates POSIX-compliant shared file access and requires application changes to use the S3 API. The question requires no application code changes and continuous shared access."
      },
      {
        id: "B",
        text: "Enable EFS Intelligent-Tiering with lifecycle management to automatically transition files not accessed in 30 days to the EFS Infrequent Access (IA) tier.",
        isCorrect: true,
        explanation: "Correct — EFS Intelligent-Tiering with lifecycle management (30-day threshold) automatically moves files to the IA tier at $0.016/GB-month versus EFS Standard at $0.30/GB-month — a 95% storage cost reduction for those files. When a file in IA is accessed, it is transparently served at the same POSIX path (no application changes). For 80% of files (40 TB), monthly cost drops from ~$12,000 to ~$640 — saving ~$11,360/month."
      },
      {
        id: "C",
        text: "Compress all files using gzip before storing them in EFS Standard to reduce billed storage.",
        isCorrect: false,
        explanation: "Wrong — EFS bills on actual consumed capacity. Compressing genomic data (already compressed in most formats like CRAM/BAM) would require application changes and provides marginal savings for already-compressed formats. The IA tier provides a far greater cost reduction with no application changes."
      },
      {
        id: "D",
        text: "Switch from EFS Standard to EFS One Zone to reduce per-GB pricing.",
        isCorrect: false,
        explanation: "Wrong — EFS One Zone stores data in a single AZ ($0.16/GB-month), which is cheaper than EFS Standard ($0.30/GB-month) but still 10× more expensive than EFS IA ($0.016/GB-month). One Zone also reduces durability (single-AZ vs multi-AZ) and may require architecture changes. EFS lifecycle to IA is the more impactful optimization."
      }
    ],
    explanation: "EFS Intelligent-Tiering with lifecycle management is the POSIX-transparent cost optimization for EFS. Files are automatically moved to the IA tier based on the configured inactivity threshold (7/14/30/60/90 days). Applications see no change — the file is still accessible at the same path. EFS Standard at $0.30/GB-month vs EFS IA at $0.016/GB-month represents a ~95% storage cost reduction for cold data. For 80% cold files, the savings are dramatic with zero application changes.",
    keywords: ["EFS Infrequent Access", "lifecycle management", "POSIX transparent", "80% cold files", "no code changes"]
  },

  // ─── d4-015 — Task 4.1 · EBS sc1 vs gp3 for cold data (difficulty 3) ───
  {
    id: "d4-015",
    domain: 4,
    taskStatement: "4.1",
    services: ["ebs-sc1", "ebs-st1"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A data archiving service stores cold backup snapshots on Amazon Elastic Block Store (Amazon EBS) volumes attached to Amazon EC2 instances. The data is accessed at most once per month for compliance verification and has sequential read patterns. The volumes are 2 TiB each. The team needs the LOWEST-cost EBS volume type that supports this use case. The volumes do not need to be bootable. Which EBS volume type should they choose?",
    options: [
      {
        id: "A",
        text: "EBS gp3 volumes at $0.08/GB-month.",
        isCorrect: false,
        explanation: "Wrong — gp3 is a general-purpose SSD optimized for a mix of transactional and throughput workloads. At $0.08/GB-month, it is 5× more expensive than sc1 for cold infrequent data. SSD performance is unnecessary and overpaid for monthly compliance reads."
      },
      {
        id: "B",
        text: "EBS st1 (Throughput Optimized HDD) volumes at $0.045/GB-month.",
        isCorrect: false,
        explanation: "Wrong — st1 is designed for frequently accessed, throughput-intensive sequential workloads like big data, data warehouses, and log processing. At $0.045/GB-month, it is 3× more expensive than sc1. st1 is not the cheapest EBS option — that distinction belongs to sc1 for cold infrequent data."
      },
      {
        id: "C",
        text: "EBS sc1 (Cold HDD) volumes at $0.015/GB-month.",
        isCorrect: true,
        explanation: "Correct — sc1 (Cold HDD) is the cheapest EBS volume type at $0.015/GB-month. It is designed for infrequently accessed, large sequential workloads. sc1 is not bootable (correct for data volumes). For monthly compliance verification reads, sc1's throughput-oriented HDD performance is adequate. At $0.015/GB-month vs gp3's $0.08/GB-month, the savings are 81% per GB."
      },
      {
        id: "D",
        text: "EBS io2 Block Express volumes at $0.125/GB-month for maximum durability.",
        isCorrect: false,
        explanation: "Wrong — io2 Block Express is the highest-performance, highest-durability (99.999%) EBS option at $0.125/GB-month — 8× more expensive than sc1. Mission-critical durability and high IOPS are not required for monthly compliance verification reads on cold backup data."
      }
    ],
    explanation: "EBS volume type selection for cost optimization: sc1 (Cold HDD, $0.015/GB-month) → cheapest, infrequent sequential reads, not bootable; st1 (Throughput Optimized HDD, $0.045/GB-month) → frequent sequential throughput workloads; gp3 (SSD, $0.08/GB-month) → general-purpose transactional; io2 ($0.125/GB-month) → mission-critical high-IOPS. For cold archival data accessed monthly with sequential patterns, sc1 is always the correct cost-optimal choice.",
    keywords: ["cheapest EBS", "cold HDD", "sc1", "infrequent access", "not bootable", "lowest cost block storage"]
  },

  // ─── d4-016 — Task 4.2 · Standard RI vs Convertible RI (difficulty 4) ───
  {
    id: "d4-016",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2-reserved"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company runs a steady-state financial reporting application on c5.2xlarge Amazon EC2 instances in us-east-1. The application runs 24/7 and the instance family will definitely not change during the commitment period. However, the team expects that 18 months from now they may need to change the operating system from Linux to Windows to support a new compliance tool. They want MAXIMUM discount on a 3-year commitment. Which Reserved Instance type should they purchase?",
    options: [
      {
        id: "A",
        text: "3-year Standard Reserved Instances for c5.2xlarge Linux in us-east-1.",
        isCorrect: false,
        explanation: "Wrong — Standard RIs are locked to the specific OS (Linux) at purchase time. If the team needs to switch to Windows, the Standard RI cannot be exchanged for the Windows equivalent. The Standard RI discount would be wasted on non-matching Linux instances after the OS migration."
      },
      {
        id: "B",
        text: "3-year Convertible Reserved Instances for c5.2xlarge Linux in us-east-1.",
        isCorrect: true,
        explanation: "Correct — Convertible RIs allow the OS, instance family, and tenancy to be changed via an exchange for equal-or-greater value during the term. When the team migrates to Windows 18 months in, they can exchange the Linux Convertible RI for a c5.2xlarge Windows Convertible RI (or another qualifying instance). The Convertible RI discount is up to ~54-66%, slightly lower than Standard (up to ~72%) but provides the OS flexibility needed."
      },
      {
        id: "C",
        text: "3-year Compute Savings Plans.",
        isCorrect: false,
        explanation: "Wrong — Compute Savings Plans provide up to 66% off and cover any EC2 instance family, region, OS, and tenancy, as well as Fargate and Lambda. However, the question states the instance family will not change and asks for MAXIMUM discount. If only EC2 is involved and the family is fixed, EC2 Instance Savings Plans (72%) or Convertible RIs (with OS flexibility) are better fits than Compute SP."
      },
      {
        id: "D",
        text: "3-year Standard Reserved Instances for c5.2xlarge Windows — purchase in advance to avoid the OS change.",
        isCorrect: false,
        explanation: "Wrong — Purchasing Windows RIs before the OS migration means paying the Windows instance rate (higher than Linux) for the first 18 months when the instances are running Linux. The Standard RI would not match the Linux instances initially, resulting in no discount for the first half of the term."
      }
    ],
    explanation: "The Standard RI vs Convertible RI decision hinges on flexibility needs: Standard (up to ~72%) is optimal when OS, family, and region are 100% fixed for the entire term. Convertible (up to ~54-66%) is optimal when you anticipate changes to OS, instance family, or tenancy during the term. The exchange rule: Convertible RIs can only be exchanged for equal-or-greater value — you cannot downgrade to a cheaper instance or get a cash refund. Standard RIs can be sold on the AWS Marketplace; Convertible RIs cannot.",
    keywords: ["Standard RI vs Convertible RI", "OS change", "exchange flexibility", "maximum discount", "cannot sell Convertible"]
  },

  // ─── d4-017 — Task 4.2 · EC2 Instance Savings Plan vs Compute SP (difficulty 4) ───
  {
    id: "d4-017",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2-savings-plans"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A retail company operates a stable baseline of m6g.4xlarge Amazon EC2 instances in eu-west-1 that will run 24/7 for the next 3 years. The instance family will not change, and no Fargate or Lambda workloads exist. The team wants the MAXIMUM possible discount on this specific baseline. Which purchase option achieves this?",
    options: [
      {
        id: "A",
        text: "3-year Compute Savings Plans.",
        isCorrect: false,
        explanation: "Wrong — Compute Savings Plans provide up to 66% off and cover any EC2 family, size, region, and OS, plus Fargate and Lambda. While flexible, the maximum discount is 66%. When the instance family and region are fixed and no cross-service or cross-region flexibility is needed, EC2 Instance Savings Plans provide a higher discount."
      },
      {
        id: "B",
        text: "3-year EC2 Instance Savings Plans for the M instance family in eu-west-1.",
        isCorrect: true,
        explanation: "Correct — EC2 Instance Savings Plans provide up to 72% off (3-year All Upfront) for a specific instance family in a specific region. Within the M family in eu-west-1, the discount applies regardless of instance size (m6g.4xlarge, m6g.8xlarge, m7g, etc.) and OS (Linux/Windows). This is the highest available discount at 72%, appropriate when the family and region are locked for the term."
      },
      {
        id: "C",
        text: "3-year Standard Reserved Instances for m6g.4xlarge Linux in eu-west-1 All Upfront.",
        isCorrect: false,
        explanation: "Wrong — Standard Regional RIs provide up to ~60-72% discount (3-yr All Upfront) and are size-flexible within the family/region. EC2 Instance Savings Plans provide equivalent or higher flexibility (also size-flexible within family/region) with comparable discounts AND cover OS changes. For the same commitment level, EC2 Instance SPs and Standard RIs offer similar maximum discounts, but SPs have slightly better flexibility. However, Standard RIs can offer slightly higher discounts in some cases. The key exam point is that EC2 Instance SP (72%) matches or beats Standard RI for this specific scenario."
      },
      {
        id: "D",
        text: "1-year Standard Reserved Instances for m6g.4xlarge in eu-west-1 All Upfront.",
        isCorrect: false,
        explanation: "Wrong — 1-year All Upfront Standard RIs provide approximately 40% discount. The question asks for MAXIMUM discount over a 3-year period. A 3-year commitment provides significantly higher discounts (~72%) than 1-year (~40%)."
      }
    ],
    explanation: "EC2 Instance Savings Plans vs Compute Savings Plans: EC2 Instance SP (up to 72%, locked to one family + region, flexible on size/OS/tenancy) vs Compute SP (up to 66%, flexible across all families/regions/services). When the workload is 100% EC2, single family, single region, and the team prioritizes maximum discount over flexibility, EC2 Instance Savings Plans win with up to 72% off. If any cross-family/cross-region/cross-service flexibility is needed, Compute SP is better even at a slightly lower maximum discount.",
    keywords: ["EC2 Instance Savings Plans", "maximum discount", "72% off", "single family", "locked to region"]
  },

  // ─── d4-018 — Task 4.2 · Spot for stateless web tier (difficulty 3) ───
  {
    id: "d4-018",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2-spot", "auto-scaling"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A news website uses an Amazon EC2 Auto Scaling group of m5.xlarge On-Demand instances behind an Application Load Balancer for its web tier. Traffic spikes 5× during breaking news events. The application is stateless — sessions are stored in Amazon ElastiCache. The team wants to REDUCE compute costs by at least 70% for the variable portion of the workload while maintaining availability during interruptions. Which strategy achieves this?",
    options: [
      {
        id: "A",
        text: "Purchase 3-year Standard Reserved Instances sized for peak capacity.",
        isCorrect: false,
        explanation: "Wrong — Reserved Instances sized for peak capacity would be idle 80% of the time during normal traffic. Paying for 5× capacity 24/7 via RIs would cost far more than On-Demand for average traffic levels. RIs optimize cost for steady-state utilization, not variable burst capacity."
      },
      {
        id: "B",
        text: "Configure the Auto Scaling group to use a mix of On-Demand for baseline capacity and Amazon EC2 Spot Instances for the variable burst capacity, diversified across multiple instance types and Availability Zones.",
        isCorrect: true,
        explanation: "Correct — Spot Instances provide up to 90% off On-Demand for the variable burst capacity. Diversifying across multiple instance types (m5.xlarge, m4.xlarge, m5a.xlarge, etc.) and AZs reduces interruption probability. The stateless application design (sessions in ElastiCache) means Spot interruptions only affect individual requests, which are retried by the load balancer. The mixed On-Demand/Spot fleet maintains availability while capturing 70%+ savings on the variable portion."
      },
      {
        id: "C",
        text: "Reduce the EC2 instance size to m5.small for all instances and increase instance count proportionally.",
        isCorrect: false,
        explanation: "Wrong — Smaller instances may reduce per-instance cost but require more instances to handle the same load. The total compute cost remains similar (cost scales with total vCPU/RAM), and this adds operational complexity without the significant discount that Spot Instances provide."
      },
      {
        id: "D",
        text: "Use Amazon EC2 Dedicated Hosts reserved for 3 years to consolidate workloads and reduce per-instance cost.",
        isCorrect: false,
        explanation: "Wrong — Dedicated Hosts are used for BYOL per-socket/per-core licensing requirements (Windows, Oracle, SQL Server). For standard Linux web servers, Dedicated Hosts provide no cost advantage over standard instances — they are actually more expensive for general workloads."
      }
    ],
    explanation: "The On-Demand baseline + Spot burst pattern is the canonical cost-optimization strategy for variable-traffic, stateless web workloads. EC2 Auto Scaling supports mixed instance policies (On-Demand base + Spot overflow). Key requirements for Spot eligibility: stateless application, sessions stored externally (ElastiCache/DynamoDB), ALB connection draining enabled, diverse instance types to prevent pool exhaustion. Up to 90% savings on the burst portion vs On-Demand easily exceeds the 70% target.",
    keywords: ["Spot burst capacity", "stateless", "mixed instance fleet", "70% savings", "Auto Scaling"]
  },

  // ─── d4-019 — Task 4.2 · AWS Compute Optimizer for right-sizing (difficulty 3) ───
  {
    id: "d4-019",
    domain: 4,
    taskStatement: "4.2",
    services: ["compute-optimizer"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company has 2,000 Amazon EC2 instances across 15 AWS accounts managed under AWS Organizations. A cost audit reveals that average CPU utilization across the fleet is 12%, suggesting significant over-provisioning. The cloud team wants to identify specific right-sizing recommendations for EC2, AWS Lambda functions, and Amazon Elastic Block Store (Amazon EBS) volumes without paying for a third-party tool. Which AWS service provides these recommendations at no additional cost?",
    options: [
      {
        id: "A",
        text: "AWS Trusted Advisor with Basic Support.",
        isCorrect: false,
        explanation: "Wrong — AWS Trusted Advisor with Basic Support only provides 7 core checks, which do not include detailed EC2 right-sizing recommendations, Lambda optimization, or EBS volume analysis. Full Cost Optimization checks in Trusted Advisor require Business or Enterprise Support."
      },
      {
        id: "B",
        text: "AWS Cost Explorer right-sizing recommendations.",
        isCorrect: false,
        explanation: "Wrong — AWS Cost Explorer provides EC2 right-sizing recommendations, but it only covers EC2 — not Lambda or EBS volumes. The question requires recommendations across EC2, Lambda, and EBS. AWS Compute Optimizer covers all three."
      },
      {
        id: "C",
        text: "AWS Compute Optimizer.",
        isCorrect: true,
        explanation: "Correct — AWS Compute Optimizer is FREE and uses machine learning to analyze 14 days of utilization metrics to provide right-sizing recommendations for EC2 instances, Auto Scaling groups, EBS volumes, Lambda functions, ECS Fargate tasks, and RDS instances. It works across all accounts in an AWS Organization and identifies over-provisioned and under-provisioned resources. No additional cost or support tier is required."
      },
      {
        id: "D",
        text: "Amazon CloudWatch Container Insights with anomaly detection.",
        isCorrect: false,
        explanation: "Wrong — CloudWatch Container Insights monitors containerized workloads and can detect anomalies, but it is not a right-sizing recommendation service. It does not analyze EC2, Lambda, or EBS across an organization and provide cost-optimized instance size recommendations."
      }
    ],
    explanation: "AWS Compute Optimizer is the free, ML-based right-sizing service for AWS compute and storage resources. It analyzes CloudWatch metrics over a 14-day window (default) and provides recommendations for EC2, ASGs, EBS volumes, Lambda, ECS Fargate, and RDS. It can be enabled at the AWS Organizations management account level to cover all member accounts. Enhanced Infrastructure Metrics (93-day lookback) is a paid add-on. Trusted Advisor requires Business/Enterprise Support for full Cost Optimization. Cost Explorer covers EC2 only for right-sizing.",
    keywords: ["free right-sizing", "ML-based recommendations", "EC2 Lambda EBS", "no additional cost", "multi-account"]
  },

  // ─── d4-020 — Task 4.2 · Lambda arm64 vs x86 cost (difficulty 3) ───
  {
    id: "d4-020",
    domain: 4,
    taskStatement: "4.2",
    services: ["lambda"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company runs 50 AWS Lambda functions written in Python. The functions are CPU-intensive and run for an average of 3 seconds at 1,024 MB memory allocation. The functions are invoked 10 million times per month. A cost optimization review identifies two potential changes: (1) switch from x86 architecture to arm64 (Graviton2), and (2) apply a Compute Savings Plan. Which combination achieves the GREATEST cost reduction?",
    options: [
      {
        id: "A",
        text: "Apply a Compute Savings Plan only — Savings Plans cover Lambda duration at up to 17% off.",
        isCorrect: false,
        explanation: "Wrong — Compute Savings Plans cover Lambda duration costs at up to 17% off, but do NOT cover Lambda request fees ($0.20/M requests). Switching to arm64 provides ~20% lower duration cost. Combining both provides the greatest combined savings."
      },
      {
        id: "B",
        text: "Switch to arm64 architecture only — arm64 (Graviton2) Lambda is ~20% cheaper on duration cost.",
        isCorrect: false,
        explanation: "Wrong — Switching to arm64 reduces duration cost by approximately 20% (from $0.0000166667/GB-s to $0.0000133334/GB-s). However, this alone is not the maximum reduction. Combining arm64 with a Compute Savings Plan applied to the discounted arm64 rate achieves greater total savings."
      },
      {
        id: "C",
        text: "Switch to arm64 architecture AND apply a Compute Savings Plan for maximum combined duration cost reduction.",
        isCorrect: true,
        explanation: "Correct — arm64 reduces per-GB-second duration cost by ~20% first. A Compute Savings Plan then applies up to 17% off the reduced arm64 rate. Combined savings on duration cost: ~1 - (0.80 × 0.83) ≈ 34% reduction. Additionally, arm64 Lambda functions may execute faster for Python workloads optimized for ARM, further reducing billed duration. The request fee ($0.20/M) is not covered by Savings Plans but is the same regardless of architecture."
      },
      {
        id: "D",
        text: "Increase Lambda memory to 10,240 MB — more memory allocates more CPU, potentially reducing duration cost.",
        isCorrect: false,
        explanation: "Wrong — Increasing memory allocates more CPU proportionally in Lambda, which can reduce execution time. However, billing is on GB-seconds: a 10× memory increase requires 10× faster execution just to break even on duration cost. For typical Python CPU-intensive functions, this trade-off rarely results in net savings and usually increases costs."
      }
    ],
    explanation: "Lambda cost has two components: request fees ($0.20/M, same for all architectures) and duration (GB-seconds). arm64 (Graviton2) costs ~20% less per GB-second than x86: $0.0000133334 vs $0.0000166667. Compute Savings Plans apply up to 17% off duration only (not requests). The combined effect: switching to arm64 provides the largest single change (~20%), and a Savings Plan compounds on top (~17% of the already-reduced arm64 rate). Compute Savings Plans also cover EC2 and Fargate within the same hourly commitment.",
    keywords: ["Lambda arm64", "Graviton2 Lambda", "20% cheaper duration", "Compute Savings Plans", "not request fees"]
  },

  // ─── d4-021 — Task 4.2 · Fargate Spot vs ECS on EC2 (difficulty 4) ───
  {
    id: "d4-021",
    domain: 4,
    taskStatement: "4.2",
    services: ["fargate"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company runs a large-scale batch video transcoding pipeline using Amazon ECS. Jobs are fault-tolerant — each task checkpoints progress every 5 minutes and resumes from the last checkpoint on restart. The workload runs 24/7 but each individual task runs for 30–60 minutes. The team is evaluating three options: (A) Fargate On-Demand, (B) Fargate Spot, (C) ECS on EC2 Spot Instances. Ranked by LOWEST to HIGHEST cost, which order is correct?",
    options: [
      {
        id: "A",
        text: "Fargate On-Demand < Fargate Spot < ECS on EC2 Spot",
        isCorrect: false,
        explanation: "Wrong — Fargate On-Demand is the most expensive option, not the least. Fargate Spot is up to 70% off Fargate On-Demand. ECS on EC2 Spot gives direct access to EC2 Spot discounts (up to 90%) with no Fargate management fee overhead."
      },
      {
        id: "B",
        text: "ECS on EC2 Spot < Fargate Spot < Fargate On-Demand",
        isCorrect: true,
        explanation: "Correct — ECS on EC2 Spot Instances is the cheapest option (up to 90% off On-Demand EC2, with no Fargate management overhead). Fargate Spot is next (up to 70% off Fargate On-Demand). Fargate On-Demand is the most expensive. For fault-tolerant batch workloads, ECS on EC2 Spot maximizes savings by using raw EC2 Spot pricing without the Fargate per-vCPU/GB-hr overhead."
      },
      {
        id: "C",
        text: "Fargate Spot < ECS on EC2 Spot < Fargate On-Demand",
        isCorrect: false,
        explanation: "Wrong — Fargate Spot provides up to 70% off Fargate On-Demand pricing. ECS on EC2 Spot uses raw EC2 Spot pricing (up to 90% off On-Demand EC2) without Fargate's per-resource management overhead. EC2 Spot is cheaper than Fargate Spot in absolute terms for equivalent compute."
      },
      {
        id: "D",
        text: "ECS on EC2 Spot ≈ Fargate Spot < Fargate On-Demand (approximately equal cheapest options)",
        isCorrect: false,
        explanation: "Wrong — ECS on EC2 Spot and Fargate Spot are not approximately equal. Fargate Spot has a management overhead built into its pricing (the Fargate per-vCPU-hr + per-GB-hr fee, discounted by 70%). ECS on EC2 Spot pays only for EC2 Spot capacity with no Fargate overhead. At scale and for fault-tolerant batch workloads, EC2 Spot is measurably cheaper."
      }
    ],
    explanation: "Cost hierarchy for containerized workloads: (1) ECS on EC2 Spot (cheapest — raw EC2 Spot up to 90% off, no Fargate overhead); (2) Fargate Spot (up to 70% off Fargate On-Demand, convenient but includes Fargate pricing overhead); (3) Fargate On-Demand (no discounts). For fault-tolerant batch workloads with checkpointing, EC2 Spot is the optimal choice. Fargate Spot is appropriate when operations simplicity (no EC2 cluster management) is valued over maximum cost savings.",
    keywords: ["Fargate Spot 70% off", "EC2 Spot cheaper than Fargate Spot", "fault-tolerant batch", "cost ranking", "no Fargate overhead"]
  },

  // ─── d4-022 — Task 4.3 · RDS Reserved Instances for steady-state DB (difficulty 3) ───
  {
    id: "d4-022",
    domain: 4,
    taskStatement: "4.3",
    services: ["rds-reserved"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company has an Amazon RDS for PostgreSQL Multi-AZ instance (db.r6g.2xlarge) running 24/7 in production. The instance has been running at consistent load for 14 months. The engineering team projects the same instance will be needed for at least 2 more years. Current annual cost is $24,000. A finance review shows no RI purchase has been made. What is the MOST cost-effective purchase option to reduce this cost immediately?",
    options: [
      {
        id: "A",
        text: "Purchase a 1-year No Upfront Standard Reserved Instance for db.r6g.2xlarge.",
        isCorrect: false,
        explanation: "Wrong — A 1-year No Upfront RI provides approximately 30-35% discount. While this reduces cost, it is not the maximum available discount. Given the team projects 2+ more years of use, a 3-year All Upfront RI provides the highest discount (up to 69-72%)."
      },
      {
        id: "B",
        text: "Migrate to Aurora PostgreSQL Serverless v2 with minimum 0 ACUs to pay only for actual usage.",
        isCorrect: false,
        explanation: "Wrong — Aurora Serverless v2 scale-to-zero is designed for intermittent/dev workloads. This is a production database running at consistent 24/7 load. At steady load, Aurora Serverless v2 would be more expensive than a provisioned RDS RI because ACU costs at sustained high utilization exceed provisioned instance costs."
      },
      {
        id: "C",
        text: "Purchase a 3-year All Upfront Standard Reserved Instance for db.r6g.2xlarge Multi-AZ.",
        isCorrect: true,
        explanation: "Correct — For a production RDS instance running at consistent 24/7 load projected for 2+ more years, a 3-year All Upfront Standard RI provides the highest discount (up to 69-72% off On-Demand). The upfront payment is recouped in 12-14 months, and the remaining 22+ months of committed use generates pure savings. RDS Standard RIs are size-flexible within the same instance family and region."
      },
      {
        id: "D",
        text: "Downsize the instance to db.r6g.xlarge and purchase On-Demand to avoid commitment.",
        isCorrect: false,
        explanation: "Wrong — Downsizing changes the performance profile of a production database and may cause performance issues. The question does not suggest the database is over-provisioned. Avoiding commitment on a 24/7 production database that will run for 2+ more years leaves 50-72% savings on the table."
      }
    ],
    explanation: "RDS Reserved Instances follow the same principle as EC2 RIs: for steady-state, predictable production workloads running 24/7, longer commitment terms with All Upfront payment provide the highest discounts (up to 69-72% for 3-year All Upfront). RDS Standard RIs are size-flexible within the same family and region. Note: RDS does NOT have Convertible RIs (unlike EC2). RDS only has Standard RIs. Always purchase RIs for production databases that have been running for >6 months with consistent load.",
    keywords: ["RDS Reserved Instances", "3-year All Upfront", "69-72% discount", "steady-state production", "size-flexible"]
  },

  // ─── d4-023 — Task 4.3 · DynamoDB Standard-IA table class (difficulty 3) ───
  {
    id: "d4-023",
    domain: 4,
    taskStatement: "4.3",
    services: ["dynamodb"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company has a Amazon DynamoDB table storing 500 GB of historical transaction records. The table receives fewer than 100 reads and 10 writes per day — used only for occasional regulatory audits. Monthly storage cost is $125 (500 GB × $0.25/GB). Monthly request cost is approximately $2. The team wants to MINIMIZE total cost. Which change achieves the GREATEST savings with MINIMUM operational disruption?",
    options: [
      {
        id: "A",
        text: "Export the table to Amazon S3 using DynamoDB Export to S3, then delete the table.",
        isCorrect: false,
        explanation: "Wrong — Exporting to S3 and deleting the DynamoDB table would eliminate the ability to run DynamoDB queries directly. Regulatory audits may require structured DynamoDB API queries. Recreating the table from S3 export for each audit adds significant operational overhead."
      },
      {
        id: "B",
        text: "Switch the table to DynamoDB Standard-IA table class.",
        isCorrect: true,
        explanation: "Correct — DynamoDB Standard-IA table class reduces storage cost by approximately 60% (from $0.25/GB-month to $0.10/GB-month) at the cost of approximately 25% higher per-request pricing. For this table: storage savings = $125 × 60% = $75/month; request cost increase = $2 × 25% = $0.50/month. Net savings = ~$74.50/month. When storage dominates (>50% of total bill), Standard-IA always wins. Table class can be changed up to 2 times per 30-day period."
      },
      {
        id: "C",
        text: "Enable DynamoDB TTL on all items to automatically expire records older than 7 years.",
        isCorrect: false,
        explanation: "Wrong — TTL automatically deletes items, which may violate regulatory requirements for transaction record retention. Deleting data that auditors may need is a compliance risk. TTL is appropriate for truly ephemeral data (sessions, cache), not regulated historical records."
      },
      {
        id: "D",
        text: "Switch to DynamoDB On-Demand capacity mode from Provisioned.",
        isCorrect: false,
        explanation: "Wrong — The table already has negligible request costs ($2/month). Switching capacity modes does not address the dominant cost driver — storage. The optimization must target storage, which is 98% of the total bill."
      }
    ],
    explanation: "DynamoDB Standard-IA table class is designed for tables where storage dominates the cost profile. When storage exceeds 50% of the total DynamoDB bill (here it is 98%), Standard-IA's 60% storage discount far outweighs the 25% higher request cost. The table remains fully functional with no schema changes required. Break-even: if requests were very high, Standard-IA's higher request cost could offset storage savings — but for audit-only tables with minimal traffic, Standard-IA is the optimal choice.",
    keywords: ["Standard-IA table class", "60% storage savings", "storage dominated", "regulatory audit", "minimal disruption"]
  },

  // ─── d4-024 — Task 4.3 · Aurora Serverless v2 scale-to-zero trap (difficulty 4) ───
  {
    id: "d4-024",
    domain: 4,
    taskStatement: "4.3",
    services: ["aurora-serverless"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A DevOps team wants to use Amazon Aurora Serverless v2 with scale-to-zero (minimum 0 ACUs) for four different use cases: (1) a development database with no active connections overnight and on weekends, (2) an Aurora Global Database secondary region replica, (3) a database fronted by Amazon RDS Proxy for Lambda connection pooling, (4) an Aurora cluster with a tier-0 reader instance. In which use cases will scale-to-zero ACTUALLY function as expected?",
    options: [
      {
        id: "A",
        text: "All four use cases support scale-to-zero.",
        isCorrect: false,
        explanation: "Wrong — Scale-to-zero is NOT supported for Aurora Global Database secondary regions, when RDS Proxy is attached, or when tier-0/tier-1 reader instances are present. Only use case (1) supports actual scale-to-zero."
      },
      {
        id: "B",
        text: "Only use case 1 (development database with no connections) will scale to zero.",
        isCorrect: true,
        explanation: "Correct — Aurora Serverless v2 scale-to-zero (GA November 2024) is blocked by the following conditions: (2) Aurora Global Database secondary regions cannot scale to zero because the secondary must remain available for replication continuity; (3) RDS Proxy maintains persistent connections and prevents auto-pause; (4) tier-0 and tier-1 reader instances in the same cluster prevent scale-to-zero of the writer. Only use case 1 — an isolated development database with no connected services — will actually scale to zero."
      },
      {
        id: "C",
        text: "Use cases 1 and 3 will scale to zero (development database and RDS Proxy-backed database).",
        isCorrect: false,
        explanation: "Wrong — When RDS Proxy is attached to an Aurora Serverless v2 cluster, the Proxy maintains a persistent connection pool. This prevents the Aurora cluster from detecting a period of no connections, blocking auto-pause. RDS Proxy is explicitly documented as incompatible with Aurora Serverless v2 scale-to-zero."
      },
      {
        id: "D",
        text: "Use cases 1 and 2 will scale to zero (development and secondary Global Database region).",
        isCorrect: false,
        explanation: "Wrong — Aurora Global Database secondary regions must remain continuously available to receive and apply replication from the primary region. A secondary region that scales to zero cannot receive replication transactions, violating the purpose of a Global Database. Secondary regions in Aurora Global DB do not support scale-to-zero."
      }
    ],
    explanation: "Aurora Serverless v2 scale-to-zero blockers (memorize for the exam): (1) RDS Proxy attached — Proxy maintains connections, prevents pause detection; (2) Aurora Global Database secondary — must stay available for replication; (3) Zero-ETL integration to Redshift — active data pipeline; (4) Tier-0 or tier-1 reader instances in the cluster — high-priority readers cannot tolerate the 15-second resume latency. Scale-to-zero works only for isolated clusters with no connected services requiring continuous availability.",
    keywords: ["scale-to-zero blocked", "RDS Proxy blocks auto-pause", "Global DB secondary no scale-to-zero", "tier-0 reader", "Aurora Serverless v2 limitations"]
  },

  // ─── d4-025 — Task 4.3 · ElastiCache Reserved Nodes (difficulty 3) ───
  {
    id: "d4-025",
    domain: 4,
    taskStatement: "4.3",
    services: ["elasticache-reserved"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company runs a production Amazon ElastiCache for Redis cluster (now branded Amazon ElastiCache for Valkey-compatible) with three cache.r6g.xlarge nodes in a Multi-AZ configuration. The cluster has been running continuously for 8 months and is projected to remain at this scale for 2+ more years. Monthly On-Demand cost is $900. The team wants to REDUCE cache infrastructure costs. Which option provides the GREATEST long-term discount?",
    options: [
      {
        id: "A",
        text: "Switch to ElastiCache Serverless to pay only for actual cache memory and ECPU usage.",
        isCorrect: false,
        explanation: "Wrong — ElastiCache Serverless charges per GB-hour of data and ECPU consumption. For a consistently loaded production cluster with known memory requirements and high sustained throughput, provisioned Reserved Nodes are significantly cheaper than Serverless pricing. Serverless is optimal for variable workloads where provisioned capacity is difficult to predict."
      },
      {
        id: "B",
        text: "Purchase 3-year All Upfront Reserved Nodes for the three cache.r6g.xlarge instances.",
        isCorrect: true,
        explanation: "Correct — ElastiCache Reserved Nodes provide up to approximately 55% discount versus On-Demand for 3-year All Upfront commitment. For a consistently running production cluster projected for 2+ more years, 3-year Reserved Nodes are the most cost-effective option. At $900/month On-Demand, a 55% savings = ~$495/month saved = ~$11,880 over 2 years."
      },
      {
        id: "C",
        text: "Downscale to cache.t3.medium nodes to reduce the hourly rate.",
        isCorrect: false,
        explanation: "Wrong — Downsizing a production cache cluster may cause memory pressure, cache evictions, and performance degradation. The question asks for cost reduction, not under-provisioning. Right-sizing should only be done after Compute Optimizer analysis confirms the cache is over-provisioned."
      },
      {
        id: "D",
        text: "Use AWS Compute Savings Plans to cover the ElastiCache cluster cost.",
        isCorrect: false,
        explanation: "Wrong — AWS Compute Savings Plans cover EC2, Fargate, and Lambda — NOT ElastiCache. ElastiCache has its own Reserved Node pricing model and is not covered by Compute or EC2 Instance Savings Plans."
      }
    ],
    explanation: "ElastiCache Reserved Nodes provide up to ~55% discount (1-year ~35%, 3-year All Upfront ~55%) for committed production cache clusters. Reserved Nodes are specific to ElastiCache and cannot be covered by EC2 or Compute Savings Plans. For consistently running production clusters with known node types and counts, Reserved Nodes are always the correct cost optimization. ElastiCache Serverless is better for variable or unpredictable cache workloads. Note: Valkey engine (launched October 2024) is ~20% cheaper than Redis OSS for node-based and ~33% cheaper for Serverless.",
    keywords: ["ElastiCache Reserved Nodes", "55% discount", "3-year All Upfront", "not covered by Savings Plans", "production cache"]
  },

  // ─── d4-026 — Task 4.4 · Gateway Endpoint vs Interface Endpoint trap (difficulty 5) ───
  {
    id: "d4-026",
    domain: 4,
    taskStatement: "4.4",
    services: ["vpc-gateway-endpoint", "vpc-interface-endpoint"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A financial services company operates Amazon EC2 instances in private subnets that communicate with both Amazon Simple Storage Service (Amazon S3) and Amazon Kinesis Data Streams. Currently all traffic routes through a NAT Gateway, costing $3,200/month in processing fees. A solutions architect proposes: (A) Deploy an S3 Gateway VPC Endpoint, (B) Deploy a Kinesis Interface VPC Endpoint (AWS PrivateLink). Which statement about the costs of these two endpoints is ACCURATE?",
    options: [
      {
        id: "A",
        text: "Both Gateway and Interface Endpoints are free — AWS provides all VPC Endpoints at no charge to encourage private connectivity.",
        isCorrect: false,
        explanation: "Wrong — This is a critical exam trap. Gateway VPC Endpoints (S3 and DynamoDB ONLY) are completely FREE. Interface VPC Endpoints (AWS PrivateLink) charge $0.01/hour per endpoint per Availability Zone PLUS $0.01/GB of data processed. A 3-AZ Interface Endpoint costs approximately $21.90/month in fixed hourly charges plus variable data charges."
      },
      {
        id: "B",
        text: "The S3 Gateway Endpoint is completely free; the Kinesis Interface Endpoint charges $0.01/hour per AZ plus $0.01/GB processed.",
        isCorrect: true,
        explanation: "Correct — S3 Gateway VPC Endpoints are FREE because they are route-table based (no ENI deployed, no resource consumed). Interface VPC Endpoints (PrivateLink) deploy an Elastic Network Interface (ENI) in each AZ, costing $0.01/hr per endpoint per AZ ($21.90/month for 3 AZs) plus $0.01/GB of data processed. For Kinesis, the Interface Endpoint is still much cheaper than NAT Gateway ($0.045/GB) for high-volume traffic, but is not free."
      },
      {
        id: "C",
        text: "The S3 Gateway Endpoint costs $0.01/GB; the Kinesis Interface Endpoint is free because it uses AWS backbone routing.",
        isCorrect: false,
        explanation: "Wrong — S3 Gateway Endpoints are completely free, including zero per-GB charges. Interface Endpoints cost both hourly and per-GB. This answer has both facts reversed."
      },
      {
        id: "D",
        text: "Both endpoints cost $0.01/hour per AZ plus $0.01/GB — they are both PrivateLink-based.",
        isCorrect: false,
        explanation: "Wrong — Gateway Endpoints are NOT PrivateLink-based. They work via route table entries that redirect traffic to the service without deploying an ENI. Only S3 and DynamoDB have Gateway Endpoints. All other services use Interface Endpoints (PrivateLink). Gateway Endpoints are free; Interface Endpoints charge hourly and per-GB."
      }
    ],
    explanation: "Gateway VPC Endpoints vs Interface VPC Endpoints is the most frequently tested cost trap in Domain 4: Gateway Endpoints (S3 and DynamoDB ONLY): completely FREE, route-table based, no ENI deployed, cannot be used from on-premises or peered VPCs. Interface Endpoints (PrivateLink, 100+ services): $0.01/hr per endpoint per AZ + $0.01/GB data processed. Break-even vs NAT Gateway: ~626 GB/month per service (at which point Interface Endpoint per-GB cost = NAT per-GB savings). Always deploy Gateway Endpoints for S3 and DynamoDB — there is no reason not to.",
    keywords: ["Gateway Endpoint FREE", "Interface Endpoint charged", "PrivateLink per-GB", "S3 and DynamoDB only", "route table based"]
  },

  // ─── d4-027 — Task 4.4 · NAT Gateway per-AZ cost vs single NAT (difficulty 4) ───
  {
    id: "d4-027",
    domain: 4,
    taskStatement: "4.4",
    services: ["nat-gateway"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A startup's three-tier application runs in a Amazon Virtual Private Cloud (Amazon VPC) across three Availability Zones. Currently, one Amazon NAT Gateway is deployed per AZ (3 total) to avoid cross-AZ data transfer charges. Monthly cost: 3 NAT Gateways × $32.85/AZ = $98.55 fixed + $0.045/GB processing. A cost review finds that each AZ generates only 20 GB/month of outbound internet traffic (60 GB total across all AZs). The CFO asks: would consolidating to a SINGLE NAT Gateway in one AZ save money? Which analysis is correct?",
    options: [
      {
        id: "A",
        text: "Consolidating saves money only if cross-AZ traffic exceeds 3.24 TB/month. At 60 GB/month total, the three-NAT architecture is cheaper.",
        isCorrect: true,
        explanation: "Correct — The break-even analysis: 3 NAT Gateways cost $98.55/month fixed. Single NAT Gateway costs $32.85/month fixed, but the other two AZs must route traffic cross-AZ to reach the single NAT Gateway, costing $0.01/GB each direction (in + out = $0.02/GB cross-AZ). At 60 GB total, 40 GB crosses AZ: cross-AZ cost = 40 GB × $0.02 = $0.80/month. Single NAT total = $32.85 + $0.80 = $33.65/month. Three NAT total = $98.55/month. Consolidation saves ~$65/month. The 3.24 TB break-even means: above 3.24 TB/month cross-AZ traffic, per-AZ NAT becomes cheaper than cross-AZ fees to a central NAT — at only 60 GB, single NAT wins by a wide margin."
      },
      {
        id: "B",
        text: "Consolidating always saves money because one NAT Gateway processes the same data at the same per-GB rate.",
        isCorrect: false,
        explanation: "Wrong — Consolidating to a single NAT Gateway introduces cross-AZ data transfer charges ($0.01/GB each direction) for traffic from non-local AZs routing through the single NAT. At very high cross-AZ traffic volumes (>3.24 TB/month), these cross-AZ charges could exceed the fixed NAT Gateway savings. For this specific case (60 GB/month), consolidation is correct, but the statement 'always saves money' is false."
      },
      {
        id: "C",
        text: "Consolidating does not save money because a single NAT Gateway is a single point of failure that would require redundant NAT Instances, eliminating any savings.",
        isCorrect: false,
        explanation: "Wrong — The question asks about cost analysis, not HA design. A single NAT Gateway in one AZ is a valid cost trade-off accepted by many development and low-criticality production environments. The question explicitly asks about cost savings, not HA implications."
      },
      {
        id: "D",
        text: "Consolidating saves money only if cross-AZ traffic is zero — any cross-AZ traffic makes three NATs cheaper.",
        isCorrect: false,
        explanation: "Wrong — This overstates the cost of cross-AZ transfer. The cross-AZ transfer fee is $0.01/GB each direction. NAT Gateway fixed cost savings ($32.85 × 2 = $65.70/month) from using one NAT instead of three vastly exceed the cross-AZ costs unless the cross-AZ traffic volume is very large (break-even ~3.24 TB/month)."
      }
    ],
    explanation: "NAT Gateway cost optimization involves comparing: (fixed savings from fewer NAT GWs) vs (cross-AZ transfer charges from routing to a central NAT). Break-even ≈ 3.24 TB/month cross-AZ traffic. Below this threshold, a single central NAT Gateway is cheaper. Above it, per-AZ NAT Gateways are cheaper. For low-traffic environments (development, small workloads), a single NAT Gateway is almost always the right cost decision, accepting the HA trade-off. Always combine with S3/DynamoDB Gateway Endpoints to eliminate the bulk of NAT processing fees.",
    keywords: ["NAT Gateway per-AZ vs single", "3.24 TB break-even", "cross-AZ transfer $0.01/GB", "fixed cost savings", "consolidation"]
  },

  // ─── d4-028 — Task 4.4 · CloudFront reducing origin cost (difficulty 3) ───
  {
    id: "d4-028",
    domain: 4,
    taskStatement: "4.4",
    services: ["cloudfront"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company runs a REST API on Amazon EC2 instances behind an Application Load Balancer. The API serves product catalog data that changes only once per day. Global users generate 50 million API calls per day. EC2 instance costs are $8,000/month due to the load required to serve all API requests. Data transfer out from EC2 is an additional $2,700/month. A solutions architect proposes placing Amazon CloudFront in front of the API with a 24-hour TTL cache. What is the PRIMARY cost benefit of this architecture?",
    options: [
      {
        id: "A",
        text: "CloudFront reduces EC2 data transfer costs because S3-to-CloudFront transfers are free.",
        isCorrect: false,
        explanation: "Wrong — The free S3-to-CloudFront data transfer applies to S3 as the origin, not EC2/ALB as the origin. EC2-to-CloudFront origin fetches are charged at standard EC2 data transfer rates. The primary cost benefit here is the cache hit rate reducing origin requests."
      },
      {
        id: "B",
        text: "With a 24-hour TTL and static product catalog data, CloudFront can serve >99% of requests from its edge cache, dramatically reducing the number of origin requests reaching EC2 — thereby reducing EC2 compute and data transfer costs.",
        isCorrect: true,
        explanation: "Correct — With a 24-hour TTL on data that changes once daily, CloudFront cache hit rates can reach 95-99%+. For 50 million requests/day, 99% cache hits means only ~500K requests/day reach EC2 (down from 50M). This reduces EC2 load by ~99%, enabling right-sizing the EC2 fleet (potentially reducing from $8,000/month to <$500/month for origin requests) and reducing EC2 data transfer proportionally."
      },
      {
        id: "C",
        text: "CloudFront provides WAF protection for free, eliminating the need for security EC2 instances.",
        isCorrect: false,
        explanation: "Wrong — CloudFront does not include WAF for free. AWS WAF costs $5/Web ACL/month + $1/rule/month + $0.60/million requests. The primary cost benefit of CloudFront here is the cache hit rate reducing EC2 load, not security services."
      },
      {
        id: "D",
        text: "CloudFront charges $0 for all data transfer when the origin is an AWS service.",
        isCorrect: false,
        explanation: "Wrong — Only S3-to-CloudFront origin fetches are free. EC2/ALB-to-CloudFront origin fetches incur standard EC2 data transfer rates. CloudFront egress to internet is billed at $0.085/GB for the first 10 TB. The cost benefit comes from reduced origin fetch volume via caching, not from zero-cost data transfer."
      }
    ],
    explanation: "CloudFront reduces origin compute and data transfer costs through caching. For static or rarely-changing API responses with an appropriate TTL, cache hit rates of 95%+ are achievable. Each cache hit means one less request reaching the origin — directly reducing EC2 compute load and data transfer. Note the distinction: S3-to-CloudFront origin fetches are FREE; EC2/ALB-to-CloudFront origin fetches are charged. The primary cost benefit for an API origin is the reduction in origin request volume.",
    keywords: ["cache hit rate", "reduce EC2 origin load", "24-hour TTL", "CloudFront caching API", "origin compute savings"]
  },

  // ─── d4-029 — Task 4.4 · Direct Connect vs VPN for hybrid (difficulty 4) ───
  {
    id: "d4-029",
    domain: 4,
    taskStatement: "4.4",
    services: ["direct-connect"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A manufacturing company currently uses an AWS Site-to-Site VPN connection to transfer data between its on-premises factory systems and AWS. Monthly VPN costs: $0.05/hour per connection ($36.50/month) plus data transfer out at $0.09/GB. Monthly data transferred to on-premises is 8 TB. The team is evaluating a 1 Gbps AWS Direct Connect connection at $0.30/hour port fee (~$219/month) with $0.02/GB data transfer out. Which statement about the financial comparison is MOST accurate?",
    options: [
      {
        id: "A",
        text: "Direct Connect is more expensive at 8 TB/month because the $219/month port fee exceeds VPN's $36.50/month fixed cost.",
        isCorrect: false,
        explanation: "Wrong — This compares only the fixed costs and ignores the per-GB transfer savings. VPN total at 8 TB: $36.50 + (8,192 GB × $0.09) = $36.50 + $737.28 = $773.78/month. DX total at 8 TB: $219 + (8,192 GB × $0.02) = $219 + $163.84 = $382.84/month. Direct Connect saves $390.94/month at 8 TB — significantly cheaper."
      },
      {
        id: "B",
        text: "Direct Connect saves approximately $391/month at 8 TB/month because per-GB transfer savings ($0.07/GB) more than offset the higher fixed port cost.",
        isCorrect: true,
        explanation: "Correct — VPN total: $36.50 + (8,192 × $0.09) = $773.78/month. DX total: $219 + (8,192 × $0.02) = $382.84/month. Savings = $390.94/month. The break-even point is approximately 2.6 TB/month: ($219 - $36.50) / ($0.09 - $0.02) = $182.50 / $0.07 ≈ 2,607 GB ≈ 2.55 TB. At 8 TB (3× the break-even), Direct Connect is substantially cheaper."
      },
      {
        id: "C",
        text: "VPN and Direct Connect are approximately equal at 8 TB/month after accounting for the 1-year DX commitment.",
        isCorrect: false,
        explanation: "Wrong — The calculation clearly shows a $391/month difference favoring Direct Connect at 8 TB. DX and VPN are only approximately equal near the 2.6 TB/month break-even point."
      },
      {
        id: "D",
        text: "Direct Connect is always more expensive than VPN because it requires a 1-year port commitment plus cross-connect fees.",
        isCorrect: false,
        explanation: "Wrong — Direct Connect port fees can be paid month-to-month (no mandatory 1-year commitment for the port itself, though hosted connections via AWS Partners may have commitments). More importantly, at 8 TB/month — well above the 2.6 TB break-even — Direct Connect is demonstrably cheaper than VPN on a per-month total cost basis."
      }
    ],
    explanation: "Direct Connect break-even analysis: Fixed cost delta = $219 - $36.50 = $182.50/month. Per-GB savings = $0.09 - $0.02 = $0.07/GB. Break-even = $182.50 / $0.07 = 2,607 GB ≈ 2.6 TB/month. At 8 TB/month (>3× break-even), Direct Connect saves ~$391/month vs VPN. Additional DX benefits beyond cost: consistent latency, higher bandwidth, no internet-dependent performance variability, and encrypted VPN can run over DX for additional security.",
    keywords: ["Direct Connect break-even 2.6 TB", "$0.09/GB vs $0.02/GB", "VPN vs DX", "$391 savings", "port fee vs transfer savings"]
  },

  // ─── d4-030 — Task 4.1 · S3 Lifecycle minimum duration trap (difficulty 5) ───
  {
    id: "d4-030",
    domain: 4,
    taskStatement: "4.1",
    services: ["s3-lifecycle", "s3-glacier-deep-archive"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A startup generates daily log files averaging 1 GB each. To minimize storage costs, the team configures an Amazon S3 Lifecycle policy to transition logs to Amazon S3 Glacier Deep Archive on Day 1 (immediately after upload). The team calculates their cost as 365 days × 1 GB × $0.00099/GB-month ≈ $0.36/year. A billing analyst flags that the actual bill is much higher. What is the MOST LIKELY cause of the discrepancy?",
    options: [
      {
        id: "A",
        text: "S3 Glacier Deep Archive charges a per-request fee for every lifecycle transition that adds up over 365 objects.",
        isCorrect: false,
        explanation: "Wrong — Lifecycle transition requests do cost money ($0.05 per 1,000 transitions to Glacier Deep Archive), but at 365 objects/year the cost is negligible ($0.018/year). Transition request fees are not the cause of a major billing discrepancy."
      },
      {
        id: "B",
        text: "S3 Glacier Deep Archive has a 180-day minimum storage duration. Objects deleted or transitioned before 180 days are billed for the full 180 days. Daily logs deleted or re-transitioned before 180 days incur the 180-day minimum billing period.",
        isCorrect: true,
        explanation: "Correct — S3 Glacier Deep Archive has a 180-day minimum storage duration. If objects are deleted, overwritten, or transitioned to another class before 180 days, AWS charges the remaining days of the 180-day minimum. For 365 daily log files, each file starts a 180-day clock. An object added on Day 1 must remain in Deep Archive until Day 181 to avoid the minimum charge. If the team deletes or transitions logs before 180 days, each deletion triggers a charge for the remaining minimum duration days."
      },
      {
        id: "C",
        text: "S3 Glacier Deep Archive is not available as a lifecycle target — only Glacier Flexible Retrieval can be used in lifecycle rules.",
        isCorrect: false,
        explanation: "Wrong — S3 Glacier Deep Archive is fully supported as a lifecycle transition target. This is a factually incorrect statement and does not explain the billing discrepancy."
      },
      {
        id: "D",
        text: "The 1 GB per-object size violates S3 Glacier Deep Archive's 128 KB minimum billable object size, triggering an oversized object surcharge.",
        isCorrect: false,
        explanation: "Wrong — S3 Glacier Deep Archive does have a 40 KB metadata overhead per object (not a minimum billable size of 128 KB — that applies to Standard-IA). A 1 GB object would not trigger a minimum size penalty in Deep Archive. The 180-day minimum duration is the relevant trap here."
      }
    ],
    explanation: "S3 storage class minimum duration penalties are a critical exam trap. Memorize the trio: S3 Standard-IA and S3 One Zone-IA: 30-day minimum; S3 Glacier Instant Retrieval and Glacier Flexible Retrieval: 90-day minimum; S3 Glacier Deep Archive: 180-day minimum. Immediately transitioning daily log files to Deep Archive starts a 180-day billing clock per object. If objects are deleted before completing 180 days in Deep Archive, AWS charges for the remaining minimum duration. For short-lived logs, Deep Archive may cost MORE than Standard due to minimum duration penalties.",
    keywords: ["180-day minimum", "Deep Archive minimum duration", "early deletion penalty", "lifecycle trap", "minimum storage billing"]
  },

  // ─── d4-031 — Task 4.2 · Dedicated Hosts vs Dedicated Instances (difficulty 5) ───
  {
    id: "d4-031",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2-dedicated"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A company needs to run Windows Server workloads on AWS and bring their own Windows Server DataCenter Edition licenses (BYOL) to maximize license portability. The license terms require visibility into the specific physical sockets and cores the software runs on. A cloud architect proposes two options: (A) Amazon EC2 Dedicated Hosts, (B) Amazon EC2 Dedicated Instances. Which statement CORRECTLY distinguishes between these two options for BYOL licensing compliance?",
    options: [
      {
        id: "A",
        text: "Dedicated Instances and Dedicated Hosts are functionally identical for BYOL — both provide dedicated hardware.",
        isCorrect: false,
        explanation: "Wrong — This is the primary exam trap. While both run on physically isolated hardware, Dedicated HOSTS provide visibility into physical sockets, cores, and the number of instances running per host — information required for per-socket or per-core BYOL licensing. Dedicated INSTANCES only guarantee hardware isolation at the instance level but do not expose socket/core topology. They are fundamentally different for licensing compliance."
      },
      {
        id: "B",
        text: "Dedicated Hosts provide per-host visibility into physical sockets and cores, enabling per-socket/per-core BYOL licensing. Dedicated Instances only guarantee hardware isolation but do not expose socket or core count for licensing.",
        isCorrect: true,
        explanation: "Correct — Dedicated Hosts allow you to see: number of physical sockets, physical cores per socket, and instance count per host. This information is required for Windows Server, SQL Server, Oracle, and SUSE/RHEL BYOL licenses sold on a per-socket or per-core basis. Dedicated Instances provide dedicated hardware to prevent sharing with other AWS accounts, but AWS does not expose the physical topology — insufficient for per-socket/core BYOL compliance."
      },
      {
        id: "C",
        text: "Dedicated Instances are cheaper than Dedicated Hosts and provide the same per-core licensing visibility.",
        isCorrect: false,
        explanation: "Wrong — Dedicated Instances charge an additional $2/hour per-region flat fee on top of instance-hour pricing. Dedicated Hosts bill per-host (with Reserved option up to 70% off). More critically, Dedicated Instances do NOT provide per-socket/core visibility. Dedicated Hosts are required for per-socket/core BYOL licenses."
      },
      {
        id: "D",
        text: "Dedicated Hosts can be reserved for 1-year or 3-year terms, making them cheaper than Dedicated Instances for long-running BYOL workloads.",
        isCorrect: false,
        explanation: "Wrong — While true that Dedicated Hosts can be reserved (up to 70% off), this is not the distinguishing factor for BYOL compliance. The primary distinction is the per-host socket/core visibility that Dedicated Hosts provide, enabling per-socket/per-core BYOL licensing that Dedicated Instances cannot support."
      }
    ],
    explanation: "Dedicated Hosts vs Dedicated Instances is a precision exam trap: Dedicated HOST = physical server allocation with full visibility into sockets, cores, and instance count. Enables per-socket/per-core BYOL (Windows DataCenter, SQL Server Enterprise, Oracle EE). Per-host billing with Reserved option. Dedicated INSTANCE = instances run on hardware not shared with other AWS accounts. No socket/core visibility. Charged per-instance + $2/hr per-region flat fee. Not suitable for per-socket/core BYOL. If BYOL licensing requires counting physical sockets or cores, only Dedicated Hosts satisfy the requirement.",
    keywords: ["Dedicated Host per-socket visibility", "Dedicated Instance no socket count", "BYOL per-core licensing", "physical topology", "$2/hr Dedicated Instance fee"]
  },

  // ─── d4-032 — Task 4.4 · Public IPv4 cost trap (difficulty 4) ───
  {
    id: "d4-032",
    domain: 4,
    taskStatement: "4.4",
    services: ["vpc-gateway-endpoint"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company receives an unexpected AWS bill increase of approximately $900/month starting in February 2024 with no changes to their infrastructure. After investigation, they discover they have 200 Amazon EC2 instances in public subnets, each with an attached Elastic IP address. No other infrastructure changed. What is the MOST LIKELY cause of this bill increase, and what is the MOST cost-effective remediation?",
    options: [
      {
        id: "A",
        text: "Cause: AWS increased EC2 On-Demand instance pricing in early 2024. Remediation: Purchase Reserved Instances.",
        isCorrect: false,
        explanation: "Wrong — AWS did not increase EC2 On-Demand pricing in early 2024. The February 2024 billing change was specifically the introduction of a $0.005/hour charge for all public IPv4 addresses, both attached and unattached, across all AWS services."
      },
      {
        id: "B",
        text: "Cause: AWS began charging $0.005/hour for all in-use public IPv4 addresses effective February 1, 2024. 200 EIPs × $0.005/hr × 720 hr/month ≈ $720/month. Remediation: Remove unnecessary public IPs and route outbound traffic through NAT Gateway, or migrate to IPv6.",
        isCorrect: true,
        explanation: "Correct — Effective February 1, 2024, AWS charges $0.005/hour for every public IPv4 address — attached or unattached, on EC2, RDS, ELB, NAT Gateway, or any other service. 200 EIPs × $0.005 × 720 hours = $720/month. If some instances also have auto-assigned public IPs, the total exceeds $720. The cost-effective remediations are: remove public IPs for instances that don't need them (use NAT Gateway for outbound), use IPv6 with an Egress-Only Internet Gateway (free), or release unattached EIPs."
      },
      {
        id: "C",
        text: "Cause: The 200 EC2 instances are sending outbound traffic through their public IPs, triggering $0.09/GB data transfer charges. Remediation: Add a NAT Gateway.",
        isCorrect: false,
        explanation: "Wrong — Data transfer out charges existed before 2024 and would not cause a sudden new bill in February 2024 with no traffic changes. The new charge effective February 1, 2024 is specifically for having a public IPv4 address, independent of traffic volume."
      },
      {
        id: "D",
        text: "Cause: AWS retired the EC2-Classic network in 2024, triggering migration fees. Remediation: Migrate to VPC.",
        isCorrect: false,
        explanation: "Wrong — AWS retired EC2-Classic in August 2022, not 2024. The February 2024 billing change was the public IPv4 address charge. EC2-Classic retirement is unrelated to this scenario."
      }
    ],
    explanation: "Effective February 1, 2024, AWS charges $0.005/hour for ALL public IPv4 addresses: attached Elastic IPs, unattached Elastic IPs, auto-assigned public IPs on EC2, public IPs on RDS, ELB ENIs, NAT Gateway public IPs, etc. BYOIP addresses are exempt. IPv6 addresses are FREE. Egress-Only Internet Gateways (for IPv6 outbound) are free. This change added $3.60/month per public IPv4 address. For a large fleet with many public IPs, eliminating unnecessary public IPs and migrating outbound-only traffic to NAT Gateway + private IPs is the remediation.",
    keywords: ["public IPv4 $0.005/hour", "February 1 2024", "Elastic IP charge", "attached and unattached", "IPv6 free"]
  },

  // ─── d4-033 — Task 4.2 · Reserved Instances with Consolidated Billing sharing (difficulty 5) ───
  {
    id: "d4-033",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2-reserved"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "A company with AWS Organizations has a management account (payer) and three member accounts. The operations team purchases ten 1-year Standard Reserved Instances for m5.large Linux in us-east-1 in the management account. Member Account A uses only five m5.large instances. Member Accounts B and C use zero m5.large instances. Which statement about how the RI discount is applied across the organization is ACCURATE?",
    options: [
      {
        id: "A",
        text: "RI discounts only apply to the account that purchased them (management account) — member accounts never receive RI discounts from another account.",
        isCorrect: false,
        explanation: "Wrong — This is the key exam trap. With AWS Organizations Consolidated Billing and RI sharing enabled, Reserved Instance discounts CAN be shared across all member accounts in the organization. Unused RI capacity in one account automatically applies to matching usage in other member accounts."
      },
      {
        id: "B",
        text: "With Consolidated Billing and RI sharing enabled, the ten RIs purchased in the management account will discount all matching m5.large usage across all member accounts. Unused RI hours in the management account automatically flow to Member Account A's five instances.",
        isCorrect: true,
        explanation: "Correct — AWS Organizations Consolidated Billing aggregates RI usage across all accounts. With RI sharing enabled (default), unused RI capacity from any account can be applied to matching usage in other accounts within the organization. The management account's ten RIs: five are used by Member Account A (at the RI discounted rate), and the remaining five are wasted (no matching usage in B or C). RI sharing can be disabled per account to prevent unwanted sharing."
      },
      {
        id: "C",
        text: "The RI discount is split proportionally: 5/10 applies to Member Account A, 5/10 is wasted because B and C have no matching usage.",
        isCorrect: false,
        explanation: "Partially correct but imprecisely stated — The RI discount mechanism is not a 'split' but rather automatic application of unused RI hours to matching usage in any account in the organization. The outcome (5 RIs used by Account A, 5 wasted) is correct, but the mechanism description is wrong. RIs are not 'split' — they apply to any matching On-Demand instance usage found across the consolidated billing family."
      },
      {
        id: "D",
        text: "Member Account A will receive On-Demand pricing for its five m5.large instances because it did not purchase the RIs itself.",
        isCorrect: false,
        explanation: "Wrong — With Consolidated Billing RI sharing enabled, Member Account A's five m5.large instances will automatically receive the RI discount from the management account's unused RI capacity. The RI discount is shared across the entire billing family by default. Account A does not need to have purchased the RIs to benefit from them."
      }
    ],
    explanation: "AWS Organizations Consolidated Billing RI sharing: RIs purchased in any account are shared across all member accounts in the organization (default behavior with RI sharing enabled). The billing engine first applies each account's own RIs, then shares any unused RI capacity to other accounts with matching usage. RI sharing can be disabled per account via the Billing Preferences console. This means large organizations can centralize RI purchases in a single account for economies of scale. Note: this sharing also applies to Savings Plans.",
    keywords: ["RI sharing across accounts", "Consolidated Billing", "Organizations RI discount sharing", "unused RI capacity", "management account RIs to members"]
  },

  // ─── d4-034 — Task 4.3 · Aurora I/O-Optimized decision (difficulty 4) ───
  {
    id: "d4-034",
    domain: 4,
    taskStatement: "4.3",
    services: ["aurora-serverless"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company runs Amazon Aurora MySQL Standard. The monthly bill breakdown is: instance costs $2,400, storage $300, I/O charges $1,800. The finance team asks whether switching to Aurora I/O-Optimized would reduce total costs. Aurora I/O-Optimized charges 30% more for instances and 2.25× storage cost, but $0 for I/O. Which analysis is CORRECT?",
    options: [
      {
        id: "A",
        text: "Do not switch — Aurora I/O-Optimized always costs more because of the instance surcharge.",
        isCorrect: false,
        explanation: "Wrong — While Aurora I/O-Optimized charges 30% more for instances, the benefit is eliminating I/O charges entirely. The decision depends on whether I/O charges exceed 25% of the total bill. In this case, I/O is 40% of the bill, making I/O-Optimized cost-effective."
      },
      {
        id: "B",
        text: "Switch to Aurora I/O-Optimized — I/O charges represent 40% of the total bill (exceeding the 25% threshold), and the net effect is cost savings.",
        isCorrect: true,
        explanation: "Correct — Total Standard bill: $2,400 + $300 + $1,800 = $4,500. I/O percentage: $1,800 / $4,500 = 40% > 25% threshold. I/O-Optimized calculation: Instance $2,400 × 1.30 = $3,120; Storage $300 × 2.25 = $675; I/O $0. Total: $3,795. Savings = $4,500 - $3,795 = $705/month (15.7% reduction). The 25% threshold is the break-even rule: when I/O exceeds 25% of total Aurora bill, switching to I/O-Optimized saves money."
      },
      {
        id: "C",
        text: "Switch to Aurora I/O-Optimized only if you can guarantee I/O charges will increase — otherwise wait.",
        isCorrect: false,
        explanation: "Wrong — The decision should be based on current I/O as a percentage of total bill, not future projections. I/O is currently 40% of the total bill, which already exceeds the 25% threshold. Waiting for further I/O increases is unnecessary and delays savings."
      },
      {
        id: "D",
        text: "Switch storage to Aurora I/O-Optimized but keep instances on Standard Aurora — instances and storage can be on different pricing models.",
        isCorrect: false,
        explanation: "Wrong — Aurora I/O-Optimized is a cluster-level configuration, not per-resource. When you switch a cluster to I/O-Optimized mode, all components (instances and storage) are covered under the I/O-Optimized pricing. You cannot mix Standard and I/O-Optimized within the same cluster."
      }
    ],
    explanation: "Aurora I/O-Optimized break-even rule: switch when I/O charges exceed 25% of total Aurora bill (instance + storage + I/O). Above 25%, I/O-Optimized savings exceed the instance/storage surcharges. Below 25%, stay on Standard. Here: 40% I/O → switch. Savings: $705/month. Important caveats: (1) 30-day lockout before switching back to Standard; (2) replicated I/O in Aurora Global Database is still charged on I/O-Optimized; (3) I/O-Optimized costs more for write-light, read-heavy workloads where I/O charges are minimal.",
    keywords: ["Aurora I/O-Optimized 25% threshold", "I/O charges 40% of bill", "switch saves money", "30-day lockout", "cluster-level pricing"]
  },

  // ─── d4-035 — Task 4.1 · S3 Intelligent-Tiering monitoring fee trap for small objects (difficulty 5) ───
  {
    id: "d4-035",
    domain: 4,
    taskStatement: "4.1",
    services: ["s3-intelligent-tiering", "s3-lifecycle"],
    constraintType: "cost",
    difficulty: 5,
    type: "single",
    stem: "An IoT platform generates 500 million small sensor readings per month, each stored as a separate Amazon S3 object averaging 2 KB in size. A cloud architect proposes Amazon S3 Intelligent-Tiering for all objects to automatically reduce costs for cold data. A senior engineer objects. Which concern is MOST valid?",
    options: [
      {
        id: "A",
        text: "S3 Intelligent-Tiering is unavailable for objects under 128 KB — they cannot be stored in this class.",
        isCorrect: false,
        explanation: "Wrong — S3 Intelligent-Tiering CAN store objects of any size, including objects under 128 KB. The distinction is that objects smaller than 128 KB are always kept in the Frequent Access tier and are NOT charged the monitoring/automation fee. However, they also never transition to cheaper tiers, providing no cost savings over S3 Standard."
      },
      {
        id: "B",
        text: "The S3 Intelligent-Tiering monitoring fee of $0.0025 per 1,000 objects per month on 500 million objects equals $1,250/month, which may exceed the storage cost savings from tiering 2 KB objects that never move to cheaper tiers.",
        isCorrect: true,
        explanation: "Correct — S3 Intelligent-Tiering charges $0.0025 per 1,000 objects per month as a monitoring/automation fee. For 500 million objects: 500,000,000 / 1,000 × $0.0025 = $1,250/month. However, objects under 128 KB are NEVER moved to cheaper tiers — they remain in the Frequent Access tier and are NOT eligible for the monitoring fee. If most objects are 2 KB (below 128 KB threshold), the monitoring fee is NOT charged on them, making Intelligent-Tiering comparable to Standard but with no tiering benefit. The real concern is that 2 KB objects get no cost benefit from auto-tiering regardless of access frequency."
      },
      {
        id: "C",
        text: "S3 Intelligent-Tiering charges a retrieval fee when objects are accessed from the Infrequent Access tier, eliminating the cost savings.",
        isCorrect: false,
        explanation: "Wrong — S3 Intelligent-Tiering has NO retrieval fees for any tier, including Infrequent Access, Archive Instant, and the optional Archive tier. This is a key differentiator from S3 Standard-IA (which charges $0.01/GB retrieval). Retrieval fees are not a valid objection to Intelligent-Tiering."
      },
      {
        id: "D",
        text: "S3 Intelligent-Tiering does not support bucket policies or lifecycle rules, making compliance retention impossible.",
        isCorrect: false,
        explanation: "Wrong — S3 Intelligent-Tiering fully supports bucket policies, lifecycle rules, S3 Object Lock, versioning, and all standard S3 features. There is no feature limitation affecting compliance retention."
      }
    ],
    explanation: "S3 Intelligent-Tiering has a critical limitation for small objects: objects smaller than 128 KB are stored in the Frequent Access tier and NEVER transitioned to cheaper tiers, AND they are NOT charged the monitoring fee. This means for a bucket full of sub-128 KB objects, Intelligent-Tiering provides no storage savings (identical to Standard pricing) while adding monitoring fee overhead for any objects ≥128 KB that may be mixed in. For predominantly small-object workloads (IoT telemetry, log entries), aggregate objects into larger files (using Kinesis Firehose/Glue) before applying lifecycle policies for genuine cost savings.",
    keywords: ["128 KB threshold", "small objects no tiering benefit", "monitoring fee 500M objects", "aggregate before tiering", "Intelligent-Tiering limitation"]
  },

  // ─── d4-036 — Task 4.4 · VPC Interface Endpoint break-even vs NAT (difficulty 4) ───
  {
    id: "d4-036",
    domain: 4,
    taskStatement: "4.4",
    services: ["vpc-interface-endpoint", "nat-gateway"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company's Amazon EC2 instances in private subnets send 800 GB/month of API calls to AWS Secrets Manager. Currently all Secrets Manager traffic routes through a NAT Gateway, adding $36/month in processing fees ($0.045/GB × 800 GB). A solutions architect proposes deploying an Amazon Virtual Private Cloud (Amazon VPC) Interface Endpoint (AWS PrivateLink) for Secrets Manager in a 3-AZ deployment. The Interface Endpoint costs $0.01/hour per AZ plus $0.01/GB processed. Should the team deploy the Interface Endpoint to reduce costs?",
    options: [
      {
        id: "A",
        text: "Yes — Interface Endpoints are always cheaper than routing through NAT Gateway for any AWS service.",
        isCorrect: false,
        explanation: "Wrong — Interface Endpoints have a fixed hourly cost ($0.01/hr per AZ = $21.90/month for 3 AZs) regardless of traffic. At low traffic volumes, the fixed hourly cost alone can exceed NAT Gateway processing savings. Break-even is approximately 626 GB/month per service."
      },
      {
        id: "B",
        text: "Yes — at 800 GB/month the Interface Endpoint saves money. Interface Endpoint total: $21.90 (hourly) + $8.00 (per-GB) = $29.90/month vs NAT processing of $36/month.",
        isCorrect: true,
        explanation: "Correct — Interface Endpoint 3-AZ cost: $0.01 × 3 AZs × 720 hrs = $21.60/month hourly + $0.01 × 800 GB = $8.00/month per-GB = $29.60/month total. NAT Gateway processing: $0.045 × 800 GB = $36/month. Savings: $36 - $29.60 = $6.40/month. At 800 GB, the Interface Endpoint is cheaper. Note: break-even ≈ 626 GB/month ($21.60 / ($0.045 - $0.01) = $21.60 / $0.035 ≈ 617 GB). Additional benefit: traffic stays private (never traverses internet), improving security posture."
      },
      {
        id: "C",
        text: "No — the Interface Endpoint hourly cost of $21.60/month exceeds the NAT savings. Route through NAT Gateway only.",
        isCorrect: false,
        explanation: "Wrong — This analysis only counts the hourly cost and ignores that NAT Gateway also charges $0.045/GB while Interface Endpoint charges only $0.01/GB. The differential per-GB savings ($0.035/GB) at 800 GB = $28/month savings, which exceeds the $21.60 hourly cost, yielding a net savings of ~$6.40/month."
      },
      {
        id: "D",
        text: "No — use an S3 Gateway Endpoint instead, which is free and covers Secrets Manager traffic.",
        isCorrect: false,
        explanation: "Wrong — S3 Gateway Endpoints are free but ONLY support Amazon S3 and Amazon DynamoDB. Secrets Manager requires an Interface Endpoint (PrivateLink). There is no free Gateway Endpoint for Secrets Manager."
      }
    ],
    explanation: "VPC Interface Endpoint break-even vs NAT Gateway: Fixed hourly cost per service = $0.01/hr × 3 AZs × 720 hrs = $21.60/month. Per-GB savings vs NAT = $0.045 - $0.01 = $0.035/GB. Break-even = $21.60 / $0.035 ≈ 617 GB/month. Above ~626 GB/month per service, Interface Endpoints are cheaper than NAT Gateway and provide the added security benefit of private routing. Always use free Gateway Endpoints for S3 and DynamoDB, then evaluate Interface Endpoints for high-volume traffic to other services.",
    keywords: ["Interface Endpoint break-even 626 GB", "$0.035/GB savings vs NAT", "3-AZ $21.60/month hourly", "Secrets Manager endpoint", "private routing"]
  },

  // ─── d4-037 — Task 4.1 · Snow family for offline migration (difficulty 3) ───
  {
    id: "d4-037",
    domain: 4,
    taskStatement: "4.1",
    services: ["s3-glacier-deep-archive"],
    constraintType: "migration",
    difficulty: 2,
    type: "single",
    stem: "A manufacturing company has 200 TB of archival data stored on tape drives at an on-premises facility. The facility has a 10 Mbps internet connection to AWS. The team needs to migrate all 200 TB to Amazon S3 for long-term archival. They want the MOST cost-effective and fastest migration method given the bandwidth constraint. After upload, the data will be immediately transitioned to Amazon S3 Glacier Deep Archive. Which approach is correct?",
    options: [
      {
        id: "A",
        text: "Use AWS DataSync over the existing 10 Mbps connection to transfer data online.",
        isCorrect: false,
        explanation: "Wrong — At 10 Mbps, the theoretical maximum throughput for 200 TB is 200 TB / (10 Mbps / 8 bits × 3,600 sec/hr × 24 hr/day) ≈ 185 days. This is neither fast nor cost-effective for a one-time large migration. AWS DataSync is appropriate for ongoing delta sync, not initial bulk migration with severe bandwidth constraints."
      },
      {
        id: "B",
        text: "Order an AWS Snowball Edge Storage Optimized device to physically transfer the 200 TB, then configure an S3 Lifecycle policy to transition objects to S3 Glacier Deep Archive.",
        isCorrect: true,
        explanation: "Correct — The AWS Snowball Edge Storage Optimized device holds up to 210 TB of usable capacity. For 200 TB with a 10 Mbps connection, physical transfer via Snowball Edge is dramatically faster (load to device locally at disk speed, ship to AWS, 2-5 business days turnaround) and avoids months of internet transfer. After import to S3, a Lifecycle policy immediately transitions objects to Glacier Deep Archive for minimum storage cost. Snowball Edge is the appropriate current device — Snowmobile was retired April 2024 and Snowcone was discontinued November 2024."
      },
      {
        id: "C",
        text: "Use AWS Snowmobile to transport 200 TB in a single truck shipment.",
        isCorrect: false,
        explanation: "Wrong — AWS Snowmobile was retired in April 2024. It is no longer available. For current exam questions, Snowmobile is never the correct answer. The Snowball Edge Storage Optimized (210 TB usable) can accommodate 200 TB with one or two devices."
      },
      {
        id: "D",
        text: "Use AWS Transfer Family SFTP to securely stream the data over the internet with encryption.",
        isCorrect: false,
        explanation: "Wrong — AWS Transfer Family is designed for ongoing transactional file transfers from external partners via SFTP/FTPS. At 10 Mbps, transferring 200 TB would take ~185 days, and Transfer Family charges $0.30/hour per protocol endpoint plus $0.04/GB transferred — a very expensive option for bulk migration."
      }
    ],
    explanation: "AWS Snow family for offline bulk migration: Snowball Edge Storage Optimized (210 TB usable) is the current device for TB-to-PB scale migrations where internet bandwidth is insufficient. Snowcone (discontinued Nov 2024) and Snowmobile (retired April 2024) are no longer valid answers. Rule of thumb: if internet transfer would take more than 1-2 weeks, Snowball Edge is more cost-effective and faster. After S3 import, apply a Lifecycle policy to immediately transition to Glacier Deep Archive for minimum long-term archival cost.",
    keywords: ["Snowball Edge 210TB", "10 Mbps bandwidth constraint", "offline migration", "Snowmobile retired", "Lifecycle to Deep Archive"]
  },

  // ─── d4-038 — Task 4.1 · S3 One Zone-IA appropriate use case (difficulty 3) ───
  {
    id: "d4-038",
    domain: 4,
    taskStatement: "4.1",
    services: ["s3-lifecycle"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company generates daily thumbnail images for videos by processing source videos stored in Amazon S3 Standard. Thumbnails are accessed frequently for the first 30 days, then rarely. The thumbnails can be regenerated at any time from the source videos. The team wants the MOST cost-effective storage class for thumbnails older than 30 days. Which storage class is appropriate?",
    options: [
      {
        id: "A",
        text: "S3 Standard-IA — provides multi-AZ durability for infrequently accessed data.",
        isCorrect: false,
        explanation: "Wrong — S3 Standard-IA is appropriate for data that cannot be recreated (requiring multi-AZ durability). Since thumbnails can be regenerated from source videos at any time, paying the premium for multi-AZ durability in Standard-IA is unnecessary. S3 One Zone-IA is 20% cheaper and appropriate for re-creatable data."
      },
      {
        id: "B",
        text: "Amazon S3 One Zone-IA — thumbnails are re-creatable, so single-AZ durability is acceptable at 20% lower cost than Standard-IA.",
        isCorrect: true,
        explanation: "Correct — S3 One Zone-IA stores data in a single Availability Zone (~$0.01/GB-month vs Standard-IA's ~$0.0125/GB-month, approximately 20% cheaper). The critical qualifier for One Zone-IA is that the data must be re-creatable or reproducible from another source. Thumbnails generated from source videos meet this requirement perfectly. If the single AZ hosting One Zone-IA is destroyed, thumbnails are lost — but can be regenerated from the source videos in S3 Standard."
      },
      {
        id: "C",
        text: "S3 Glacier Instant Retrieval — thumbnails need immediate access when users browse the site.",
        isCorrect: false,
        explanation: "Wrong — While Glacier Instant Retrieval provides millisecond access, it costs ~$0.004/GB-month. For thumbnails accessed 'rarely' after 30 days, this may be appropriate, but S3 One Zone-IA at ~$0.01/GB-month covers infrequent but not-quarterly access patterns better. Glacier Instant Retrieval is optimized for quarterly-or-rarer access; thumbnails may be accessed more frequently than that."
      },
      {
        id: "D",
        text: "S3 Glacier Deep Archive — cheapest storage class for cost minimization.",
        isCorrect: false,
        explanation: "Wrong — S3 Glacier Deep Archive has 12-48 hour retrieval time. For website thumbnails that users may access when browsing, a 12-48 hour delay renders them unusable for the web interface. Deep Archive is appropriate only when retrieval time measured in hours is explicitly acceptable."
      }
    ],
    explanation: "S3 One Zone-IA is the correct choice when two conditions are met: (1) data is infrequently accessed, and (2) data is re-creatable, reproducible, or non-critical. It is ~20% cheaper than Standard-IA by accepting single-AZ storage (99.5% availability vs 99.9% for Standard-IA). Common use cases: thumbnails, transcoded video formats, secondary backups, cache data. Never use One Zone-IA for primary copies of irreplaceable data. The exam frequently tests this distinction — re-creatable/reproducible data → One Zone-IA; irreplaceable/critical data → Standard-IA.",
    keywords: ["One Zone-IA re-creatable", "single AZ acceptable", "20% cheaper than Standard-IA", "thumbnails", "reproducible data"]
  },

  // ─── d4-039 — Task 4.2 · On-Demand Capacity Reservation + RI (difficulty 4) ───
  {
    id: "d4-039",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2-reserved", "ec2-on-demand"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A company runs a disaster recovery drill every quarter that requires spinning up exactly 100 m5.2xlarge Amazon EC2 instances in us-east-1 within 5 minutes of a declared DR event. The drill lasts 4 hours. Outside of drills, the instances must NOT be running (to avoid costs). The team wants both a GUARANTEED capacity reservation AND a billing discount for the 4-hour usage. Which combination achieves this?",
    options: [
      {
        id: "A",
        text: "Purchase 3-year Regional Standard Reserved Instances for 100 m5.2xlarge in us-east-1.",
        isCorrect: false,
        explanation: "Wrong — Regional Standard RIs provide billing discounts but do NOT guarantee capacity in a specific AZ. In a capacity-constrained scenario during a real disaster (when other companies are also attempting to launch instances), Regional RIs provide no capacity assurance. Additionally, you pay for On-Demand-equivalent capacity continuously even when the instances are not running."
      },
      {
        id: "B",
        text: "On-Demand Capacity Reservations (ODCR) in a specific AZ combined with Regional Standard Reserved Instances or Compute Savings Plans for the billing discount.",
        isCorrect: true,
        explanation: "Correct — On-Demand Capacity Reservations guarantee capacity in a specific AZ regardless of broader regional demand spikes. ODCRs charge On-Demand rates when unused. Combining with Regional Standard RIs or Compute Savings Plans applies the billing discount to the ODCR capacity (matching On-Demand usage). When instances are not launched, the ODCR capacity charge (at On-Demand rates) is offset by the RI/SP discount, effectively paying the discounted rate for reserved capacity. This provides both guaranteed capacity and a billing discount."
      },
      {
        id: "C",
        text: "Zonal Reserved Instances in us-east-1a — Zonal RIs both guarantee capacity AND provide a billing discount.",
        isCorrect: false,
        explanation: "Partially correct but incomplete — Zonal Standard RIs DO provide both capacity reservation AND billing discount. However, they require a 1-year or 3-year commitment — the company would pay the RI price 24/7/365 for capacity that is only used 4 hours per quarter (about 1.8% utilization). The total cost would far exceed ODCR + RI SP with a 4-hour quarterly drill. For a DR drill scenario with extremely low utilization, ODCR (cancel after drill) is more flexible than committing to a 3-year term."
      },
      {
        id: "D",
        text: "Spot Fleet with a target capacity of 100 m5.2xlarge — Spot ensures low cost during the drills.",
        isCorrect: false,
        explanation: "Wrong — Spot Instances can be interrupted at any time with a 2-minute warning. For a disaster recovery drill that requires guaranteed capacity, Spot Instances cannot provide the assurance needed. If Spot capacity is unavailable during the drill, the DR test fails. Spot is never appropriate for DR scenarios requiring guaranteed capacity."
      }
    ],
    explanation: "On-Demand Capacity Reservations (ODCR) vs Zonal RIs for DR capacity: ODCR provides guaranteed capacity with no commitment term (cancel anytime), charging On-Demand rates when unused. Combining ODCR with Regional RI or Compute SP applies billing discounts to ODCR usage. Zonal RIs also provide capacity guarantees but lock you into 1/3-year terms — expensive for occasional DR drills. Savings Plans do NOT reserve capacity (cannot combine SP for capacity reservation). Regional RIs provide NO capacity guarantee.",
    keywords: ["On-Demand Capacity Reservation", "guaranteed capacity", "no commitment term", "Regional RI no capacity guarantee", "ODCR plus RI discount"]
  },

  // ─── d4-040 — Task 4.4 · AWS Cost Explorer and Budgets for cost governance (difficulty 3) ───
  {
    id: "d4-040",
    domain: 4,
    taskStatement: "4.4",
    services: ["cloudfront"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A global SaaS company serves API responses from an Amazon EC2 origin via Amazon CloudFront. Users in Asia-Pacific complain about 400–600 ms API response times. Engineering analysis shows 95% of API requests are for the same configuration data that changes every 6 hours. The remaining 5% are personalized user requests that must not be cached. The company wants to SIMULTANEOUSLY improve performance for Asia-Pacific users AND reduce origin compute costs. Which CloudFront configuration achieves BOTH goals?",
    options: [
      {
        id: "A",
        text: "Set the CloudFront default TTL to 6 hours and forward all request headers to the origin to enable personalization.",
        isCorrect: false,
        explanation: "Wrong — Forwarding all headers to the origin defeats CloudFront caching entirely. When all headers are forwarded, CloudFront cannot cache responses because every unique header combination is treated as a separate cache key. All requests would reach the origin, providing no performance benefit for the 95% cacheable requests."
      },
      {
        id: "B",
        text: "Configure two CloudFront cache behaviors: a default behavior (matching /config/*) with a 6-hour TTL for the shared configuration, and a second behavior (matching /user/*) with a TTL of 0 and all request headers forwarded to the origin for personalized responses.",
        isCorrect: true,
        explanation: "Correct — CloudFront supports multiple cache behaviors ordered by path pattern. The default behavior for /config/* with 6-hour TTL caches the 95% of shared configuration requests at edge locations closest to Asia-Pacific users, dramatically reducing origin requests and latency. The /user/* behavior with TTL=0 bypasses caching and forwards personalized requests directly to the EC2 origin. This simultaneously reduces origin load (fewer requests to EC2) and reduces Asia-Pacific latency for the cacheable majority."
      },
      {
        id: "C",
        text: "Enable CloudFront Origin Shield in the Asia-Pacific region to reduce origin load by consolidating requests.",
        isCorrect: false,
        explanation: "Wrong — CloudFront Origin Shield consolidates origin fetches through a single regional origin-side layer, reducing origin load. However, it does not cache responses at edge locations — it only reduces the number of origin fetches for unique cache misses. It does not provide the 6-hour caching of configuration data that would serve 95% of requests from edge cache."
      },
      {
        id: "D",
        text: "Use Lambda@Edge at the origin-request event to cache configuration data in a DynamoDB Global Table near Asia-Pacific.",
        isCorrect: false,
        explanation: "Wrong — This architecture adds Lambda@Edge complexity without leveraging CloudFront's built-in caching. CloudFront's native TTL-based caching is far simpler and cheaper than a Lambda@Edge + DynamoDB solution for serving static configuration data from edge locations."
      }
    ],
    explanation: "CloudFront cache behaviors allow different caching policies for different URL paths on the same distribution. This is essential for mixed-content APIs with both cacheable and non-cacheable endpoints. Key configuration: cacheable endpoints (configuration, static data) → high TTL, serve from edge; personalized/dynamic endpoints → TTL=0, pass-through to origin. The result: majority of traffic served from nearest CloudFront PoP (millisecond latency for Asia-Pacific), origin receives only 5% of requests (reducing EC2 cost by ~95%). Both performance and cost goals are simultaneously achieved.",
    keywords: ["CloudFront multiple cache behaviors", "6-hour TTL cacheable", "TTL=0 personalized", "path pattern routing", "origin load reduction"]
  }
]
