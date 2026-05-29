export interface ServiceEntry {
  id: string
  name: string
  shortName: string
  abbr: string
  category:
    | "compute"
    | "storage"
    | "database"
    | "networking"
    | "security"
    | "integration"
    | "analytics"
    | "management"
  domains: (1 | 2 | 3 | 4)[]
  tagline: string
  whatItDoes: string
  whenToUse: string
  keyFacts: string[]
  examTraps: string[]
  relatedServices: string[]
}

export const services: ServiceEntry[] = [
  // ─── COMPUTE ────────────────────────────────────────────────────────────────

  {
    id: "ec2",
    name: "Amazon Elastic Compute Cloud (Amazon EC2)",
    shortName: "Amazon EC2",
    abbr: "EC2",
    category: "compute",
    domains: [1, 2, 3, 4],
    tagline: "Rent virtual servers in the cloud that you can size and configure yourself.",
    whatItDoes:
      "Amazon EC2 lets you launch virtual machines (called instances) in minutes. You choose the CPU, memory, storage, and network settings. You can run any operating system and install any software, just like a physical server.",
    whenToUse:
      "Use when you need full control over the operating system and software stack, when you're lifting and shifting on-premises applications, or when your workload doesn't fit serverless constraints (runtime, memory, or execution time).",
    keyFacts: [
      "On-Demand, Reserved (1- or 3-year), Spot, and Savings Plans pricing models available",
      "Spot Instances can be up to 90% cheaper than On-Demand but can be interrupted with a 2-minute warning",
      "Placement Groups: Cluster (low latency, same rack), Spread (different racks, max 7 instances per AZ), Partition (separate partitions per AZ, good for HDFS/Cassandra)",
      "Instance store (ephemeral) storage is lost when the instance stops; Amazon EBS volumes persist",
      "EC2 Auto Scaling can launch or terminate instances based on CPU, memory, or custom CloudWatch metrics",
    ],
    examTraps: [
      "Trap: Reserved Instances must be used in the exact AZ you purchased. Reality: Regional Reserved Instances apply to any AZ in the region; only Zonal Reserved Instances are AZ-specific.",
      "Trap: Spot Instances are terminated immediately without warning. Reality: AWS gives a 2-minute interruption notice via instance metadata and EventBridge.",
      "Trap: You can use a Cluster Placement Group across multiple Availability Zones. Reality: Cluster Placement Groups are confined to a single AZ.",
    ],
    relatedServices: ["EBS", "ELB", "ALB", "NLB", "VPC", "IAM"],
  },

  {
    id: "lambda",
    name: "AWS Lambda",
    shortName: "AWS Lambda",
    abbr: "Lambda",
    category: "compute",
    domains: [1, 2, 3, 4],
    tagline: "Run your code without managing any servers — you just upload the function.",
    whatItDoes:
      "AWS Lambda runs your code in response to events (an API call, a file upload, a database change, a scheduled timer, etc.) and automatically scales from zero to thousands of concurrent executions. You pay only for the milliseconds your code actually runs. AWS manages all the underlying servers.",
    whenToUse:
      "Use when your workload is event-driven, short-lived, and doesn't need a persistent server. Good for API backends, data processing pipelines, scheduled jobs, and glue code between AWS services.",
    keyFacts: [
      "Maximum execution timeout: 15 minutes per invocation",
      "Maximum memory per function: 10,240 MB (10 GB); CPU scales proportionally with memory",
      "Synchronous (RequestResponse) payload limit: 6 MB request, 6 MB response",
      "Asynchronous (Event) payload limit: 256 KB",
      "Default concurrent execution limit: 1,000 per AWS Region (can be increased via quota request)",
      "Lambda@Edge functions run at CloudFront edge locations; timeout is 5 seconds (viewer triggers) or 30 seconds (origin triggers)",
    ],
    examTraps: [
      "Trap: Lambda can run for up to 1 hour. Reality: The hard maximum timeout is 15 minutes.",
      "Trap: Lambda scales instantly and infinitely. Reality: There is a default concurrency limit of 1,000 per region; burst scaling also has per-region limits (e.g., 3,000 initial burst in us-east-1).",
    ],
    relatedServices: ["API Gateway", "SQS", "SNS", "EventBridge", "S3", "DynamoDB"],
  },

  {
    id: "ecs",
    name: "Amazon Elastic Container Service (Amazon ECS)",
    shortName: "Amazon ECS",
    abbr: "ECS",
    category: "compute",
    domains: [1, 2, 3],
    tagline: "Run Docker containers on AWS without building your own container orchestration platform.",
    whatItDoes:
      "Amazon ECS is a fully managed container orchestration service. You define your containers in a Task Definition (similar to a Docker Compose file), and ECS handles scheduling, running, and health-checking them. You choose whether to run containers on EC2 instances you manage or on serverless Fargate.",
    whenToUse:
      "Use when you want to run containerized applications on AWS with AWS-native tooling. Good for microservices, batch jobs, and web APIs. Choose ECS over EKS when you don't need Kubernetes-specific features and want simpler operations.",
    keyFacts: [
      "Two launch types: EC2 (you manage the underlying instances) and Fargate (serverless, AWS manages infrastructure)",
      "Tasks are the running unit; Services maintain a desired number of running tasks and integrate with load balancers",
      "ECS tasks can be assigned IAM roles (Task Roles) for fine-grained AWS API permissions",
      "Supports both awsvpc networking mode (each task gets its own Elastic Network Interface) and bridge/host modes",
      "Integrates with Application Load Balancer for dynamic port mapping across multiple containers",
    ],
    examTraps: [
      "Trap: ECS and EKS are interchangeable — just pick either one. Reality: ECS uses AWS-proprietary orchestration; EKS uses Kubernetes. If the question mentions Kubernetes workloads or Helm charts, the answer is EKS.",
    ],
    relatedServices: ["Fargate", "EKS", "ECR", "ALB", "IAM", "CloudWatch"],
  },

  {
    id: "eks",
    name: "Amazon Elastic Kubernetes Service (Amazon EKS)",
    shortName: "Amazon EKS",
    abbr: "EKS",
    category: "compute",
    domains: [1, 2, 3],
    tagline: "Run managed Kubernetes clusters on AWS without operating the Kubernetes control plane yourself.",
    whatItDoes:
      "Amazon EKS runs the Kubernetes control plane (API server, etcd, scheduler) for you across multiple Availability Zones. You bring your workloads as standard Kubernetes manifests and Helm charts. Worker nodes can be EC2 instances (managed or self-managed) or Fargate.",
    whenToUse:
      "Use when you're already running Kubernetes on-premises and want to migrate to AWS, when your team has Kubernetes expertise, or when you need Kubernetes-specific features like custom resource definitions, Helm, or a specific Kubernetes API.",
    keyFacts: [
      "Control plane is managed by AWS across 3 Availability Zones; you are not charged per API server",
      "EKS cluster pricing: $0.10 per hour per cluster (plus EC2/Fargate costs for worker nodes)",
      "EKS Anywhere lets you run EKS on your own on-premises hardware",
      "EKS supports both EC2 node groups and Fargate profiles in the same cluster",
      "IAM Roles for Service Accounts (IRSA) gives individual Kubernetes pods AWS IAM permissions without sharing node credentials",
    ],
    examTraps: [
      "Trap: EKS is always more expensive than ECS. Reality: For large Kubernetes-native workloads with existing expertise, EKS can be cost-effective. The exam question is about fit, not always cost.",
    ],
    relatedServices: ["ECS", "Fargate", "EC2", "IAM", "ALB"],
  },

  {
    id: "fargate",
    name: "AWS Fargate",
    shortName: "AWS Fargate",
    abbr: "Fargate",
    category: "compute",
    domains: [1, 2, 3, 4],
    tagline: "Run containers without managing any underlying EC2 instances.",
    whatItDoes:
      "AWS Fargate is a serverless compute engine for containers that works with both Amazon ECS and Amazon EKS. You specify CPU and memory for each task or pod, and AWS provisions and manages the underlying server infrastructure. You never SSH into a node or patch an AMI.",
    whenToUse:
      "Use when you want container workloads without the operational overhead of managing EC2 instances — no patching, no capacity planning, no cluster node management. Best for variable or unpredictable workloads.",
    keyFacts: [
      "Pricing is per vCPU and GB of memory per second (no charge for idle time unlike reserved EC2 nodes)",
      "Each Fargate task gets its own isolated compute environment (kernel-level isolation, not just container-level)",
      "Supports ECS task networking via awsvpc mode — each task gets its own Elastic Network Interface and private IP",
      "Fargate Spot is available for ECS tasks (not EKS pods) and can be interrupted like EC2 Spot",
      "Maximum task size: 16 vCPU and 120 GB memory",
    ],
    examTraps: [
      "Trap: Fargate is just ECS with automatic scaling. Reality: Fargate is a compute platform — it removes the need to manage EC2 worker nodes entirely. It works with both ECS and EKS.",
    ],
    relatedServices: ["ECS", "EKS", "EC2", "ALB"],
  },

  {
    id: "elastic-beanstalk",
    name: "AWS Elastic Beanstalk",
    shortName: "Elastic Beanstalk",
    abbr: "Beanstalk",
    category: "compute",
    domains: [2, 3, 4],
    tagline: "Deploy web applications without worrying about the underlying infrastructure.",
    whatItDoes:
      "AWS Elastic Beanstalk is a platform-as-a-service (PaaS) tool. You upload your application code (Java, Node.js, Python, Ruby, PHP, .NET, Go, or Docker), and Beanstalk automatically sets up the load balancer, Auto Scaling group, EC2 instances, and monitoring. You retain full access to the underlying resources.",
    whenToUse:
      "Use when you want the convenience of a managed platform but still want visibility into (and control over) the underlying EC2 instances, load balancers, and Auto Scaling groups. Good for teams migrating from traditional hosting to AWS.",
    keyFacts: [
      "No additional charge for Beanstalk itself — you pay only for the underlying resources it creates (EC2, RDS, etc.)",
      "Supports multiple deployment policies: All at once, Rolling, Rolling with additional batch, Immutable, Blue/Green",
      "Immutable deployments create a new set of instances, route traffic, then terminate old ones — safest for production",
      "Configuration files (.ebextensions) in your app bundle let you customize the environment",
      "Managed platform updates handle OS and runtime patches automatically on a schedule",
    ],
    examTraps: [
      "Trap: Elastic Beanstalk is serverless like Lambda. Reality: Beanstalk provisions EC2 instances; it's PaaS, not serverless. You can see and modify the underlying EC2 instances.",
    ],
    relatedServices: ["EC2", "RDS", "ALB", "S3", "CloudWatch"],
  },

  // ─── STORAGE ────────────────────────────────────────────────────────────────

  {
    id: "s3",
    name: "Amazon Simple Storage Service (Amazon S3)",
    shortName: "Amazon S3",
    abbr: "S3",
    category: "storage",
    domains: [1, 2, 3, 4],
    tagline: "Store any amount of files in the cloud and retrieve them from anywhere.",
    whatItDoes:
      "Amazon S3 is an object storage service. You store files (objects) in containers called buckets. Each object can be up to 5 TB and is accessed via a URL or AWS SDKs. S3 automatically replicates your data across at least three Availability Zones within a region.",
    whenToUse:
      "Use for storing static website files, backups, data lake raw files, application assets, logs, and any data you want to access over HTTP. Also the foundation for many data pipeline architectures.",
    keyFacts: [
      "Durability: 99.999999999% (11 nines) — S3 is designed so that if you store 10 million objects, you'd expect to lose one object every 10,000 years",
      "Strong read-after-write consistency for all operations (including overwrite PUTs and DELETEs) since December 2020",
      "Maximum object size: 5 TB; objects over 5 GB must use Multipart Upload",
      "Request rate per prefix: 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD per second — no prefix randomization needed since 2018",
      "Storage classes: S3 Standard, S3 Intelligent-Tiering, S3 Standard-IA, S3 One Zone-IA, S3 Glacier Instant Retrieval, S3 Glacier Flexible Retrieval, S3 Glacier Deep Archive",
      "S3 Glacier Deep Archive is the cheapest storage class — retrieval time is 12–48 hours",
    ],
    examTraps: [
      "Trap: S3 is eventually consistent, so you need to wait after a PUT before reading. Reality: S3 has been strongly consistent for all operations since December 2020.",
      "Trap: You need to randomize key prefixes to avoid S3 request throttling. Reality: Since 2018, S3 can handle high request rates on any prefix without randomization.",
    ],
    relatedServices: ["CloudFront", "Glacier", "Athena", "Glue", "Lambda", "KMS"],
  },

  {
    id: "ebs",
    name: "Amazon Elastic Block Store (Amazon EBS)",
    shortName: "Amazon EBS",
    abbr: "EBS",
    category: "storage",
    domains: [1, 2, 3, 4],
    tagline: "Attach persistent disk drives to your EC2 instances, like a hard drive for the cloud.",
    whatItDoes:
      "Amazon EBS provides block-level storage volumes that you attach to EC2 instances. They behave like raw, unformatted block devices — you format them and mount them like a regular disk. Data persists independently of the EC2 instance lifecycle.",
    whenToUse:
      "Use for any EC2 workload that needs a persistent file system, database storage, or high-IOPS storage. Use gp3 for general workloads, io2 for databases requiring guaranteed IOPS, st1 for sequential big-data workloads, and sc1 for cold archives.",
    keyFacts: [
      "gp3 (General Purpose SSD): 3,000 IOPS and 125 MB/s included for free (no extra cost), scalable up to 16,000 IOPS and 1,000 MB/s independently of volume size",
      "io2 Block Express (Provisioned IOPS SSD, Nitro instances only): up to 256,000 IOPS and 4,000 MB/s throughput",
      "Multi-Attach: an io1/io2 volume can be attached to up to 16 Nitro-based EC2 instances simultaneously, but all must be in the same Availability Zone, and you must use a cluster-aware file system",
      "EBS volumes are automatically replicated within their Availability Zone for hardware failure protection",
      "EBS snapshots are stored in S3 (managed by AWS) and can be copied across regions for disaster recovery",
      "EBS encryption uses AWS KMS keys; once encrypted, snapshots, and volumes created from those snapshots are also encrypted",
    ],
    examTraps: [
      "Trap: You can attach an EBS volume to multiple EC2 instances like a shared network drive. Reality: Standard EBS volumes attach to exactly one instance at a time. Multi-Attach is limited to io1/io2, max 16 instances, same AZ, and requires a cluster-aware file system.",
      "Trap: EBS gp2 and gp3 offer the same performance characteristics. Reality: gp3 decouples IOPS from volume size (you can get 3,000 IOPS on a 1 GB volume), while gp2 ties IOPS to volume size (3 IOPS/GB, minimum 100 IOPS).",
    ],
    relatedServices: ["EC2", "EFS", "S3", "KMS", "Backup"],
  },

  {
    id: "efs",
    name: "Amazon Elastic File System (Amazon EFS)",
    shortName: "Amazon EFS",
    abbr: "EFS",
    category: "storage",
    domains: [2, 3, 4],
    tagline: "A shared network file system that multiple EC2 instances can read and write at the same time.",
    whatItDoes:
      "Amazon EFS is a fully managed NFS (Network File System) that scales automatically. Unlike EBS, you don't provision a fixed size — it grows and shrinks as you add or delete files. Multiple EC2 instances (even across different Availability Zones) can mount the same EFS file system simultaneously.",
    whenToUse:
      "Use when multiple EC2 instances need to share the same file system simultaneously — for example, shared application logs, content management systems, home directories for users, or machine learning training data.",
    keyFacts: [
      "Scales automatically from 0 to petabytes without provisioning storage",
      "Supports thousands of concurrent NFS connections from EC2, ECS, EKS, and Lambda",
      "Two performance modes: General Purpose (lower latency) and Max I/O (higher aggregate throughput, higher latency)",
      "Two throughput modes: Bursting (throughput scales with file system size) and Provisioned (fixed throughput regardless of size)",
      "Storage classes: EFS Standard and EFS Infrequent Access (IA); lifecycle policies automatically move files to IA after 7–90 days",
      "EFS is Linux-only (NFS protocol); it cannot be mounted on Windows EC2 instances without special configuration",
    ],
    examTraps: [
      "Trap: EFS and EBS are interchangeable for shared storage. Reality: EBS standard volumes cannot be shared across instances. EFS is the right answer for multi-instance shared file storage on Linux.",
      "Trap: EFS works with Windows EC2 instances. Reality: EFS uses NFS and is designed for Linux/Unix workloads. For Windows shared storage, use Amazon FSx for Windows File Server.",
    ],
    relatedServices: ["EC2", "EBS", "FSx", "DataSync"],
  },

  {
    id: "fsx-lustre",
    name: "Amazon FSx for Lustre",
    shortName: "Amazon FSx for Lustre",
    abbr: "FSx-Lustre",
    category: "storage",
    domains: [3],
    tagline: "An extremely fast shared file system built for high-performance computing and machine learning workloads.",
    whatItDoes:
      "Amazon FSx for Lustre provides a fully managed high-performance file system based on the Lustre open-source parallel file system. It delivers sub-millisecond latency and hundreds of gigabytes per second of throughput. It can transparently link to an S3 bucket so your data appears as files.",
    whenToUse:
      "Use for HPC (high-performance computing), machine learning training, financial modeling, electronic design automation (EDA), and any workload that needs extremely fast parallel reads from a shared file system. Also use when you need to present S3 data as a POSIX file system.",
    keyFacts: [
      "Can deliver hundreds of GB/s throughput and sub-millisecond latency",
      "Natively integrates with S3 — objects in the linked S3 bucket appear as files, writes back to S3 on release",
      "Scratch file systems: temporary, no data replication, optimized for short-term processing",
      "Persistent file systems: replicated within an AZ, designed for long-term storage",
      "Supports POSIX-compliant access from Linux EC2, ECS, and EKS",
    ],
    examTraps: [
      "Trap: Use EFS for machine learning training on large datasets. Reality: EFS is good for general shared storage, but FSx for Lustre is the exam answer when performance is the priority for compute-intensive workloads like ML training.",
    ],
    relatedServices: ["S3", "EFS", "EC2", "SageMaker"],
  },

  {
    id: "fsx-windows",
    name: "Amazon FSx for Windows File Server",
    shortName: "Amazon FSx for Windows File Server",
    abbr: "FSx-Windows",
    category: "storage",
    domains: [2, 3],
    tagline: "A fully managed Windows-native shared file system using the SMB protocol.",
    whatItDoes:
      "Amazon FSx for Windows File Server provides fully managed native Microsoft Windows file systems. It uses the Server Message Block (SMB) protocol and integrates with Microsoft Active Directory (both AWS Managed AD and self-managed AD). Windows applications that use SMB shares work without modification.",
    whenToUse:
      "Use when you need to lift and shift Windows applications that rely on shared network drives (SMB), Active Directory authentication, or Windows NTFS file system features. Good for home directories, departmental file shares, and Windows-based application servers.",
    keyFacts: [
      "Supports SMB protocol versions 2.0 through 3.1.1",
      "Integrates with Microsoft Active Directory for user authentication and access control",
      "Supports Windows DFS (Distributed File System) namespaces and replication",
      "Deployed as Single-AZ or Multi-AZ (Multi-AZ has a standby file server in a second AZ for failover)",
      "Backed by SSD storage with automatic daily backups to S3",
    ],
    examTraps: [
      "Trap: Use EFS for Windows shared storage. Reality: EFS uses NFS and does not support SMB or Windows Active Directory integration. FSx for Windows File Server is the correct choice for Windows workloads needing shared storage.",
    ],
    relatedServices: ["EFS", "FSx-Lustre", "EC2", "DirectoryService"],
  },

  {
    id: "storage-gateway",
    name: "AWS Storage Gateway",
    shortName: "Storage Gateway",
    abbr: "StorageGateway",
    category: "storage",
    domains: [1, 2, 4],
    tagline: "Bridge your on-premises servers to AWS cloud storage using familiar protocols.",
    whatItDoes:
      "AWS Storage Gateway is a hybrid cloud storage service. You install a virtual appliance (or buy a hardware appliance) in your data center, and it presents local interfaces (NFS, SMB, iSCSI) to your on-premises applications while storing the actual data in AWS (S3, EBS snapshots, or Glacier). Your apps see local storage; the data lives in the cloud.",
    whenToUse:
      "Use when you need to extend on-premises storage to AWS without changing applications, when you want to back up on-premises data to AWS, or when you're migrating data to AWS gradually.",
    keyFacts: [
      "Three gateway types: S3 File Gateway (NFS/SMB → S3), Tape Gateway (iSCSI VTL → S3/Glacier), Volume Gateway (iSCSI → S3 snapshots as EBS volumes)",
      "Volume Gateway modes: Stored (primary data on-premises, asynchronous backup to S3) vs. Cached (primary data in S3, frequently accessed data cached locally)",
      "S3 File Gateway is the most commonly tested type on the exam — it translates NFS/SMB file access into S3 object PUT/GET calls",
      "Low-latency access to frequently used data via local cache",
      "Data is encrypted in transit (TLS) and at rest (using SSE-S3 or SSE-KMS)",
    ],
    examTraps: [
      "Trap: Storage Gateway replaces Direct Connect for hybrid access to AWS. Reality: Storage Gateway is about extending storage protocols (file, block, tape) to the cloud. Direct Connect is about network connectivity. They can work together.",
    ],
    relatedServices: ["S3", "EBS", "Glacier", "DirectConnect", "Backup"],
  },

  {
    id: "snowball-edge",
    name: "AWS Snowball Edge",
    shortName: "Snowball Edge",
    abbr: "SnowballEdge",
    category: "storage",
    domains: [1, 4],
    tagline: "A physical device AWS ships to your location so you can transfer petabytes of data without using the internet.",
    whatItDoes:
      "AWS Snowball Edge is a ruggedized physical device with storage and compute that AWS ships to you. You load your data onto it, ship it back to AWS, and AWS imports the data into S3. It solves the problem of transferring massive datasets where network transfer would take weeks or months.",
    whenToUse:
      "Use when you need to migrate large amounts of data (tens of terabytes to petabytes) to AWS and the network bandwidth would make it impractical — typically when migration would take more than a week over your available connection. Also used for edge computing in locations with limited or no internet.",
    keyFacts: [
      "Snowball Edge Storage Optimized: 80 TB usable storage, 40 vCPU compute",
      "Snowball Edge Compute Optimized: 28 TB NVMe SSD, 52 vCPU, 208 GB RAM — for local compute needs",
      "Data transfer to AWS: Snowball is cheaper than internet transfer for datasets above ~10 TB given typical bandwidth costs",
      "AWS Snowmobile is a 100 PB capacity truck for truly massive migrations (above ~10 PB)",
      "Uses 256-bit encryption automatically; encryption keys managed by AWS KMS",
    ],
    examTraps: [
      "Trap: Snowball Edge is only for data transfer. Reality: Snowball Edge also runs EC2 instances and Lambda functions locally at the edge — useful for remote sites with poor connectivity that still need compute.",
    ],
    relatedServices: ["S3", "KMS", "DataSync"],
  },

  {
    id: "backup",
    name: "AWS Backup",
    shortName: "AWS Backup",
    abbr: "Backup",
    category: "storage",
    domains: [1, 2, 4],
    tagline: "Centrally manage and automate backups across all your AWS services from one place.",
    whatItDoes:
      "AWS Backup is a fully managed centralized backup service. You create backup plans that define schedules, retention periods, and lifecycle rules, then assign AWS resources (EC2, EBS, RDS, DynamoDB, EFS, FSx, etc.) to those plans. AWS Backup takes the backups and stores them in a Backup Vault.",
    whenToUse:
      "Use when you need to enforce consistent backup policies across multiple AWS services, meet compliance requirements for backup retention, or copy backups to another AWS region for disaster recovery.",
    keyFacts: [
      "Supports EC2, EBS, RDS, Aurora, DynamoDB, EFS, FSx, Storage Gateway, and more",
      "Backup Vault Lock prevents anyone (including the root account) from deleting backups before the retention period expires — useful for compliance",
      "Cross-region backup copies allow you to meet RPO requirements in a disaster recovery region",
      "Backup plans can use lifecycle rules to move backups to cold storage and delete them after a retention period",
      "AWS Organizations integration lets you enforce backup policies across all accounts in your organization",
    ],
    examTraps: [
      "Trap: You must configure backups separately in each AWS service (RDS snapshots, EBS snapshots, etc.). Reality: AWS Backup centralizes all of this. One backup plan can cover resources across multiple services and regions.",
    ],
    relatedServices: ["EBS", "RDS", "DynamoDB", "EFS", "S3"],
  },

  // ─── DATABASE ───────────────────────────────────────────────────────────────

  {
    id: "rds",
    name: "Amazon Relational Database Service (Amazon RDS)",
    shortName: "Amazon RDS",
    abbr: "RDS",
    category: "database",
    domains: [1, 2, 3, 4],
    tagline: "Run MySQL, PostgreSQL, Oracle, or SQL Server databases without managing the underlying server.",
    whatItDoes:
      "Amazon RDS is a managed relational database service. AWS handles OS patching, backups, software updates, and hardware provisioning. You choose the database engine (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, or Db2), instance size, and storage. You connect to it just like a regular database.",
    whenToUse:
      "Use for traditional relational database workloads (transactions, joins, complex queries) where you want managed operations. Not a good fit for workloads requiring >64 TB storage or single-digit millisecond performance — use Aurora for those.",
    keyFacts: [
      "Multi-AZ deployment: AWS maintains a synchronous standby replica in a different AZ; automatic failover takes 60–120 seconds",
      "Multi-AZ DB Cluster (MySQL and PostgreSQL only): 2 readable standby instances across 3 AZs, failover in approximately 35 seconds",
      "Read Replicas use asynchronous replication and CAN be read from; they can be in the same AZ, different AZ, or different region",
      "Automated backups: daily snapshots + transaction logs, enabling point-in-time recovery within a retention window (1–35 days)",
      "Maximum storage: 64 TB (most engines); Storage Auto Scaling expands storage automatically when low",
    ],
    examTraps: [
      "Trap: The Multi-AZ standby instance handles read traffic to improve performance. Reality: The Multi-AZ standby is NOT readable — it exists only for failover. Use Read Replicas for read scaling.",
      "Trap: Read Replicas provide automatic failover. Reality: Read Replicas are NOT automatic failover targets. You must manually promote a Read Replica to a standalone DB in a failure scenario (unless using Aurora).",
    ],
    relatedServices: ["Aurora", "EC2", "VPC", "KMS", "Backup", "SecretsManager"],
  },

  {
    id: "aurora",
    name: "Amazon Aurora",
    shortName: "Amazon Aurora",
    abbr: "Aurora",
    category: "database",
    domains: [1, 2, 3, 4],
    tagline: "A MySQL- and PostgreSQL-compatible database that is 5x faster than MySQL and built for the cloud.",
    whatItDoes:
      "Amazon Aurora is a cloud-native relational database engine built by AWS, compatible with MySQL (5x faster) and PostgreSQL (3x faster). Aurora separates compute from storage — a single cluster storage volume automatically replicates data 6 ways across 3 Availability Zones. Aurora Serverless v2 can scale from 0.5 ACUs to 128 ACUs in seconds.",
    whenToUse:
      "Use Aurora instead of RDS when you need higher throughput, lower replication lag, faster failover, or a storage layer that scales automatically up to 128 TB. Aurora Global Database spans multiple regions.",
    keyFacts: [
      "Storage automatically grows in 10 GB increments up to 128 TB; no manual resizing needed",
      "Up to 15 Aurora Replicas per cluster, with single-digit millisecond replication lag",
      "Automatic failover to a replica in under 30 seconds (typically 10–15 seconds) — faster than RDS Multi-AZ",
      "Aurora Global Database: primary region + up to 5 secondary read-only regions; RPO (recovery point objective) of approximately 1 second; RTO (recovery time objective) under 1 minute",
      "Aurora Serverless v2: scales capacity automatically in fine-grained increments; you pay per second based on Aurora Capacity Units (ACUs)",
    ],
    examTraps: [
      "Trap: Aurora Global Database writes to all regions simultaneously like DynamoDB Global Tables. Reality: Aurora Global Database has ONE primary region for writes; secondary regions are read-only. Failover requires manual or planned promotion.",
    ],
    relatedServices: ["RDS", "DynamoDB", "ElastiCache", "RDS Proxy", "KMS"],
  },

  {
    id: "dynamodb",
    name: "Amazon DynamoDB",
    shortName: "Amazon DynamoDB",
    abbr: "DynamoDB",
    category: "database",
    domains: [1, 2, 3, 4],
    tagline: "A serverless key-value and document database that delivers single-digit millisecond performance at any scale.",
    whatItDoes:
      "Amazon DynamoDB is a fully managed NoSQL database. You don't manage servers, storage, or replication. DynamoDB automatically partitions your data across enough servers to handle your traffic. It supports key-value and document data models, and can handle millions of requests per second.",
    whenToUse:
      "Use for applications that need consistent low-latency reads and writes at any scale, with simple access patterns (lookups by key). Good for session stores, shopping carts, gaming leaderboards, IoT data, and any workload where you know the access patterns upfront.",
    keyFacts: [
      "Single-digit millisecond read and write latency at any scale",
      "DynamoDB Accelerator (DAX): an in-memory cache in front of DynamoDB that reduces read latency to microseconds (not milliseconds)",
      "Global Tables: multi-region, multi-active (active-active) replication — writes can go to any region and are replicated to all other regions within seconds",
      "DynamoDB Streams captures item-level changes in order, with a 24-hour retention window; can trigger Lambda",
      "On-Demand capacity mode: pay per request, no capacity planning; Provisioned mode: set read/write capacity units in advance (cheaper at predictable load)",
      "Partition key design is critical: high cardinality keys distribute load evenly; 'hot' partition keys can throttle requests",
    ],
    examTraps: [
      "Trap: DynamoDB Global Tables is active-passive like RDS Multi-AZ. Reality: Global Tables is active-active — every replica region can accept writes, making it different from Aurora Global Database (which is active-passive).",
      "Trap: DAX caches both reads and writes, making writes faster too. Reality: DAX primarily accelerates reads (both eventual and strongly consistent). Writes go to DynamoDB first and are reflected in DAX.",
    ],
    relatedServices: ["DAX", "Lambda", "S3", "Streams", "ElastiCache"],
  },

  {
    id: "elasticache",
    name: "Amazon ElastiCache",
    shortName: "Amazon ElastiCache",
    abbr: "ElastiCache",
    category: "database",
    domains: [1, 3, 4],
    tagline: "Add an in-memory cache in front of your database to serve frequently accessed data in under a millisecond.",
    whatItDoes:
      "Amazon ElastiCache is a fully managed in-memory data store service supporting two open-source engines: Redis (now also called Valkey) and Memcached. You use it to cache database query results, session data, or computed values so your application doesn't have to hit the database every time.",
    whenToUse:
      "Use in front of RDS or DynamoDB when read-heavy workloads are creating database load and query results are repeated. Also good for session management, leaderboards, pub/sub messaging, and real-time analytics.",
    keyFacts: [
      "Memcached: simple, multi-threaded, no replication, no persistence, no cluster failover — data is lost if a node fails",
      "Redis/Valkey: supports replication (primary + up to 5 replicas per shard), persistence (RDB snapshots + AOF logs), cluster mode, pub/sub, sorted sets, transactions",
      "Redis Cluster Mode Enabled: data is sharded across up to 500 shards for horizontal scaling",
      "ElastiCache for Redis supports Multi-AZ with automatic failover (similar to RDS Multi-AZ)",
      "Sub-millisecond read latency for cached data",
    ],
    examTraps: [
      "Trap: Memcached and Redis are functionally equivalent — just pick either. Reality: If the question mentions replication, persistence, failover, or complex data structures (sorted sets, pub/sub), the answer is Redis. Memcached has none of those features.",
    ],
    relatedServices: ["RDS", "Aurora", "DynamoDB", "EC2", "Lambda"],
  },

  {
    id: "memorydb",
    name: "Amazon MemoryDB for Redis",
    shortName: "Amazon MemoryDB",
    abbr: "MemoryDB",
    category: "database",
    domains: [2, 3],
    tagline: "A Redis-compatible in-memory database with full durability — use it as your primary database, not just a cache.",
    whatItDoes:
      "Amazon MemoryDB for Redis is a durable, in-memory database service that is fully compatible with the Redis API. Unlike ElastiCache, MemoryDB uses a durable transaction log stored in Multi-AZ to ensure data is never lost, even if all nodes fail. It combines the speed of Redis with the durability of a traditional database.",
    whenToUse:
      "Use MemoryDB when you need Redis-speed reads and writes AND require durability (data must not be lost on failure). Good for microservices needing a fast, consistent primary data store. If you only need a cache in front of another DB, use ElastiCache.",
    keyFacts: [
      "Microsecond read latency, single-digit millisecond write latency",
      "Data is stored durably in a Multi-AZ transaction log — zero data loss on node failure",
      "Fully compatible with open-source Redis APIs, data structures, and commands",
      "Supports cluster mode with up to 500 shards",
      "More expensive than ElastiCache because of the added durability layer",
    ],
    examTraps: [
      "Trap: MemoryDB and ElastiCache for Redis are the same service. Reality: ElastiCache is a cache — data can be lost if all nodes fail. MemoryDB is a durable primary database with full persistence; data is never lost.",
    ],
    relatedServices: ["ElastiCache", "DynamoDB", "Aurora", "EC2"],
  },

  {
    id: "redshift",
    name: "Amazon Redshift",
    shortName: "Amazon Redshift",
    abbr: "Redshift",
    category: "database",
    domains: [3, 4],
    tagline: "A cloud data warehouse for running complex analytical queries against petabytes of data.",
    whatItDoes:
      "Amazon Redshift is a fully managed, petabyte-scale data warehouse service. It stores data in columns (columnar storage) instead of rows, which makes it much faster for analytical queries that only read a few columns from billions of rows. Redshift integrates with S3, Glue, QuickSight, and other analytics services.",
    whenToUse:
      "Use for business intelligence (BI), reporting, analytics, and any SQL query that aggregates or analyzes large historical datasets. Not suited for OLTP (online transaction processing — use RDS for that) or sub-millisecond lookups.",
    keyFacts: [
      "Columnar storage and data compression reduce storage and dramatically speed up analytical queries",
      "Redshift Spectrum: queries data directly in S3 without loading it into Redshift — extends the data warehouse to your data lake",
      "Redshift Serverless: auto-scales compute capacity; you pay per second of query execution, no cluster management",
      "Massively Parallel Processing (MPP): queries are distributed across all compute nodes simultaneously",
      "Supports up to petabytes of structured data; integrates natively with S3, Kinesis, and DynamoDB",
    ],
    examTraps: [
      "Trap: Use Redshift for real-time lookups (e.g., checking a single user record). Reality: Redshift is optimized for large analytical queries, not point lookups. For real-time single-record access, use DynamoDB or RDS.",
    ],
    relatedServices: ["S3", "Glue", "Athena", "QuickSight", "Kinesis"],
  },

  {
    id: "documentdb",
    name: "Amazon DocumentDB (with MongoDB Compatibility)",
    shortName: "Amazon DocumentDB",
    abbr: "DocumentDB",
    category: "database",
    domains: [2, 3],
    tagline: "A managed document database compatible with MongoDB, storing data as flexible JSON documents.",
    whatItDoes:
      "Amazon DocumentDB is a fully managed document database service that implements the MongoDB API. You can run MongoDB applications against DocumentDB with few or no code changes. Like Aurora, it separates compute from storage — data is replicated 6 ways across 3 Availability Zones.",
    whenToUse:
      "Use when you're migrating MongoDB workloads to AWS and want a managed service, or when your application stores data as JSON documents with flexible, evolving schemas. Not ideal if you need all MongoDB features (some are not supported).",
    keyFacts: [
      "Storage automatically grows in 10 GB increments up to 64 TB, like Aurora",
      "Up to 15 read replicas per cluster",
      "Supports MongoDB API versions 3.6, 4.0, and 5.0",
      "Does NOT support all MongoDB features — for example, multi-document ACID transactions have limitations compared to native MongoDB",
      "Data is automatically replicated 6 ways across 3 Availability Zones",
    ],
    examTraps: [
      "Trap: Amazon DocumentDB is built on the MongoDB codebase. Reality: DocumentDB emulates the MongoDB API but is built entirely on AWS's own storage engine. It is NOT a fork or derivative of MongoDB.",
    ],
    relatedServices: ["DynamoDB", "Aurora", "MongoDB", "ElastiCache"],
  },

  {
    id: "neptune",
    name: "Amazon Neptune",
    shortName: "Amazon Neptune",
    abbr: "Neptune",
    category: "database",
    domains: [1, 2, 3],
    tagline: "A managed graph database for storing and querying highly connected data like social networks or fraud detection graphs.",
    whatItDoes:
      "Amazon Neptune is a fully managed graph database. It stores data as nodes and edges (relationships), making it natural to answer questions like 'find all friends of friends who also bought product X' or 'what is the shortest path between two nodes'. Neptune supports both Apache TinkerPop Gremlin and W3C SPARQL query languages.",
    whenToUse:
      "Use for use cases where relationships between data points are as important as the data itself: social networks, recommendation engines, fraud detection, knowledge graphs, network topology, and identity resolution.",
    keyFacts: [
      "Supports Property Graph (queried with Gremlin) and RDF (queried with SPARQL) data models",
      "Storage automatically replicates 6 ways across 3 Availability Zones, like Aurora",
      "Up to 15 read replicas for read scaling",
      "Neptune ML uses Graph Neural Networks (GNNs) to make predictions on graph data without exporting to a separate ML platform",
      "Fully ACID-compliant with consistent reads",
    ],
    examTraps: [
      "Trap: Use DynamoDB for a social network graph with complex relationship queries. Reality: DynamoDB is a key-value/document store and is not optimized for complex graph traversals. Neptune is the purpose-built choice for graph workloads.",
    ],
    relatedServices: ["DynamoDB", "Aurora", "SageMaker"],
  },

  // ─── NETWORKING ─────────────────────────────────────────────────────────────

  {
    id: "vpc",
    name: "Amazon Virtual Private Cloud (Amazon VPC)",
    shortName: "Amazon VPC",
    abbr: "VPC",
    category: "networking",
    domains: [1, 2, 3],
    tagline: "Your own private, isolated section of the AWS cloud where you define your own network.",
    whatItDoes:
      "Amazon VPC lets you create an isolated virtual network inside AWS. You define an IP address range, divide it into subnets (public subnets have internet access; private subnets do not), control inbound and outbound traffic with security groups and network ACLs, and connect to your on-premises network via VPN or Direct Connect.",
    whenToUse:
      "Every AWS resource you deploy runs inside a VPC (or the default VPC). You customize VPCs when you need custom IP ranges, network isolation between tiers (web, app, database), or hybrid connectivity to on-premises networks.",
    keyFacts: [
      "VPC Gateway Endpoints are FREE and support only two services: Amazon S3 and Amazon DynamoDB — traffic stays on the AWS network, not the internet",
      "VPC Interface Endpoints (powered by AWS PrivateLink) support most other AWS services and have an hourly charge plus per-GB data processing fee",
      "Security Groups are stateful (return traffic is automatically allowed); Network ACLs (NACLs) are stateless (you must explicitly allow return traffic in both directions)",
      "VPC Peering connects two VPCs; it is non-transitive (VPC A peered with B and B peered with C does NOT mean A can reach C)",
      "NAT Gateway enables private subnet instances to initiate outbound internet connections; it does not allow inbound connections from the internet",
    ],
    examTraps: [
      "Trap: VPC Gateway Endpoints work with all AWS services for free. Reality: Gateway Endpoints are free but only support S3 and DynamoDB. All other services require Interface Endpoints, which have a cost.",
      "Trap: VPC Peering is transitive — if A peers with B and B peers with C, A can reach C. Reality: VPC Peering is NOT transitive. You need explicit peering between A and C, or use Transit Gateway.",
    ],
    relatedServices: ["TransitGateway", "DirectConnect", "VPN", "Route53", "NLB", "ALB"],
  },

  {
    id: "route53",
    name: "Amazon Route 53",
    shortName: "Amazon Route 53",
    abbr: "Route53",
    category: "networking",
    domains: [1, 2, 3],
    tagline: "A global DNS service that also provides health checks and traffic routing policies.",
    whatItDoes:
      "Amazon Route 53 is AWS's scalable DNS (Domain Name System) service. It translates domain names (like example.com) into IP addresses, routes traffic to AWS resources or on-premises servers, and can monitor the health of endpoints. Route 53 is the only AWS service with a 100% availability SLA.",
    whenToUse:
      "Use for all DNS needs on AWS: registering domains, routing users to the nearest or healthiest endpoint, implementing blue/green deployments with weighted routing, and failover between primary and secondary sites.",
    keyFacts: [
      "Routing policies: Simple, Weighted, Latency-based, Failover, Geolocation, Geoproximity, Multi-Value Answer, IP-based",
      "Latency-based routing uses AWS measurements of network latency to route to the region with lowest latency — it is NOT based on the user's geographic location",
      "Geolocation routing IS based on the user's geographic location (country, continent) — different from Latency routing",
      "Alias records (Route 53-specific) can point to AWS resources (ALB, CloudFront, S3 website) at the zone apex (e.g., example.com); regular CNAME records cannot",
      "Health checks can monitor endpoints, and Failover routing automatically switches to a healthy secondary record when the primary is unhealthy",
    ],
    examTraps: [
      "Trap: Latency routing routes users to the geographically closest region. Reality: Latency routing routes to the region with the lowest measured network latency — the closest region geographically is not always the lowest-latency option.",
      "Trap: You can use a CNAME record for a zone apex domain (example.com). Reality: CNAME records cannot be used at the zone apex. Use Route 53 Alias records instead.",
    ],
    relatedServices: ["CloudFront", "ALB", "NLB", "GlobalAccelerator", "VPC"],
  },

  {
    id: "cloudfront",
    name: "Amazon CloudFront",
    shortName: "Amazon CloudFront",
    abbr: "CloudFront",
    category: "networking",
    domains: [1, 2, 3, 4],
    tagline: "Deliver your website, APIs, and videos to users worldwide with low latency by caching content at edge locations.",
    whatItDoes:
      "Amazon CloudFront is a Content Delivery Network (CDN). It caches copies of your content (images, CSS, JavaScript, video, even API responses) at over 600 edge locations around the world, so users can download content from a nearby server instead of traveling to your origin server every time. It also provides DDoS protection via AWS Shield.",
    whenToUse:
      "Use when you need to serve content to a global audience with low latency, when your origin server is in one region and users are worldwide, or when you want to reduce load on your origin and cut data transfer costs.",
    keyFacts: [
      "600+ edge locations (Points of Presence) worldwide",
      "Supports caching HTTP and HTTPS content; dynamic content (cache-control: no-cache) is forwarded to the origin but still benefits from the optimized AWS backbone network path",
      "CloudFront uses dynamic IP addresses — you cannot whitelist specific CloudFront IPs in firewall rules (use AWS-managed prefix lists or security group referencing for that)",
      "Origin can be S3, ALB, EC2, API Gateway, or any HTTP server",
      "CloudFront Functions and Lambda@Edge allow running code at the edge to modify requests/responses",
      "Signed URLs and Signed Cookies restrict access to private content",
    ],
    examTraps: [
      "Trap: CloudFront and Global Accelerator solve the same problem. Reality: CloudFront caches content and is best for HTTP/HTTPS workloads. Global Accelerator uses anycast IPs and routes TCP/UDP traffic without caching — better for non-HTTP or latency-sensitive dynamic requests.",
    ],
    relatedServices: ["S3", "ALB", "Lambda", "WAF", "Shield", "Route53", "GlobalAccelerator"],
  },

  {
    id: "global-accelerator",
    name: "AWS Global Accelerator",
    shortName: "Global Accelerator",
    abbr: "GlobalAccelerator",
    category: "networking",
    domains: [2, 3],
    tagline: "Route your users' traffic over AWS's global network backbone to your application, cutting latency and jitter.",
    whatItDoes:
      "AWS Global Accelerator gives you two static anycast IPv4 addresses that act as fixed entry points to your application. When a user connects, their traffic enters the AWS global network at the nearest edge location and travels over AWS's private fiber backbone to your endpoint (EC2, ALB, NLB, or Elastic IP) — avoiding the congested public internet for most of the journey.",
    whenToUse:
      "Use for applications that need consistent low latency globally and cannot use caching: multiplayer gaming, IoT, VoIP, financial trading, and any TCP/UDP workload. Also useful when you need two static IPs for whitelisting in firewalls.",
    keyFacts: [
      "Provides exactly 2 static anycast IPv4 addresses globally — they never change",
      "Does NOT cache content (unlike CloudFront) — it is a network acceleration service",
      "Supports TCP and UDP protocols; not limited to HTTP",
      "Automatically reroutes traffic to healthy endpoints in under 30 seconds on health check failure",
      "Cross-region routing: can route to endpoints in multiple regions with traffic dial and endpoint weights",
    ],
    examTraps: [
      "Trap: Use Global Accelerator when you need to cache static assets globally. Reality: Global Accelerator does not cache anything. Use CloudFront for content caching. Use Global Accelerator for dynamic, latency-sensitive TCP/UDP workloads.",
    ],
    relatedServices: ["CloudFront", "ALB", "NLB", "Route53", "EC2"],
  },

  {
    id: "transit-gateway",
    name: "AWS Transit Gateway",
    shortName: "Transit Gateway",
    abbr: "TransitGateway",
    category: "networking",
    domains: [1, 2],
    tagline: "A central hub that connects all your VPCs and on-premises networks together without complex peering meshes.",
    whatItDoes:
      "AWS Transit Gateway acts as a cloud router. Instead of creating individual peering connections between every pair of VPCs (which doesn't scale), you attach each VPC and your VPN/Direct Connect connections to the Transit Gateway. The Transit Gateway then routes traffic between all attached networks using routing tables.",
    whenToUse:
      "Use when you have more than a few VPCs and need them to communicate with each other, or when you need to connect both VPCs and on-premises networks through a single managed hub. Transit Gateway is the scalable replacement for a full mesh of VPC peering connections.",
    keyFacts: [
      "Transitive routing: if VPC A and VPC B are both attached to the same Transit Gateway, they can communicate — unlike VPC Peering",
      "Supports VPN attachments, Direct Connect Gateway attachments, and VPC attachments",
      "Can be shared across AWS accounts using AWS Resource Access Manager (RAM)",
      "Transit Gateway Network Manager provides a global view of your network including on-premises connections",
      "Charges: per attachment per hour + per GB of data processed",
    ],
    examTraps: [
      "Trap: VPC Peering is the best solution for connecting 10+ VPCs. Reality: A full mesh of VPC peering connections between N VPCs requires N×(N-1)/2 peering relationships. Transit Gateway is the scalable solution for hub-and-spoke or full-mesh topologies.",
    ],
    relatedServices: ["VPC", "DirectConnect", "VPN", "RAM"],
  },

  {
    id: "direct-connect",
    name: "AWS Direct Connect",
    shortName: "Direct Connect",
    abbr: "DirectConnect",
    category: "networking",
    domains: [1, 2, 3],
    tagline: "A dedicated private network connection from your on-premises data center to AWS, bypassing the public internet.",
    whatItDoes:
      "AWS Direct Connect establishes a private, dedicated network connection between your data center (or colocation facility) and an AWS Direct Connect location. The connection runs over dedicated 1 Gbps, 10 Gbps, or 100 Gbps fiber and never traverses the public internet, giving you more consistent network performance and lower data transfer costs.",
    whenToUse:
      "Use when you need consistent, predictable network performance between on-premises and AWS (especially for latency-sensitive workloads), when you're transferring large amounts of data regularly and want to reduce egress costs, or when compliance requires private connectivity.",
    keyFacts: [
      "Connection speeds: 50 Mbps, 100 Mbps, 500 Mbps, 1 Gbps, 10 Gbps, 100 Gbps",
      "Hosted Connections (via Direct Connect Partners): 50 Mbps to 10 Gbps, provisioned more quickly than Dedicated Connections",
      "Direct Connect does NOT encrypt traffic by default — to encrypt, run a VPN over the Direct Connect connection",
      "Direct Connect Gateway: enables a single Direct Connect connection to access VPCs in multiple AWS regions",
      "Provisioning a new Dedicated Connection typically takes several weeks due to physical circuit provisioning",
    ],
    examTraps: [
      "Trap: Direct Connect provides encrypted traffic because it's private. Reality: Direct Connect traffic is private (not on the public internet) but is NOT encrypted. If encryption is required, layer a Site-to-Site VPN over the Direct Connect link.",
    ],
    relatedServices: ["VPC", "TransitGateway", "VPN", "StorageGateway"],
  },

  {
    id: "alb",
    name: "Application Load Balancer (ALB)",
    shortName: "Application Load Balancer",
    abbr: "ALB",
    category: "networking",
    domains: [1, 2, 3],
    tagline: "Distribute incoming HTTP and HTTPS requests across multiple servers, with smart routing based on URL paths and headers.",
    whatItDoes:
      "Application Load Balancer (ALB) operates at Layer 7 (the application layer) of the OSI model. It inspects HTTP/HTTPS requests and can route them to different target groups based on the URL path (path-based routing), the host header (host-based routing), HTTP headers, query strings, or request method. It integrates natively with ECS, EKS, Lambda, and WAF.",
    whenToUse:
      "Use for HTTP/HTTPS workloads, especially microservices architectures where different URL paths should route to different services (e.g., /api/* to one service, /images/* to another). Required for containerized applications that use dynamic port mapping.",
    keyFacts: [
      "Layer 7 load balancing: routes based on HTTP content (paths, headers, query strings, HTTP methods)",
      "Cross-zone load balancing is enabled by default for ALB and there is no additional charge for it",
      "Supports WebSocket and HTTP/2 natively",
      "Can route directly to Lambda functions as targets (no EC2 instance needed)",
      "Sticky sessions (session affinity) use cookies to ensure a client always goes to the same target",
      "WAF (Web Application Firewall) can be attached directly to an ALB",
    ],
    examTraps: [
      "Trap: ALB and NLB both have cross-zone load balancing enabled by default. Reality: ALB has cross-zone load balancing ON by default at no charge. NLB has it OFF by default, and enabling it incurs inter-AZ data transfer charges.",
    ],
    relatedServices: ["NLB", "EC2", "ECS", "Lambda", "WAF", "Route53", "CloudFront"],
  },

  {
    id: "nlb",
    name: "Network Load Balancer (NLB)",
    shortName: "Network Load Balancer",
    abbr: "NLB",
    category: "networking",
    domains: [2, 3],
    tagline: "Handle millions of TCP and UDP connections per second with extremely low latency and static IP addresses.",
    whatItDoes:
      "Network Load Balancer (NLB) operates at Layer 4 (transport layer) of the OSI model. It routes TCP, UDP, and TLS traffic based on IP protocol data alone — it does not inspect the HTTP content. NLB provides one static IP address (or Elastic IP) per Availability Zone, enabling clients to whitelist specific IPs.",
    whenToUse:
      "Use for TCP/UDP workloads where you need extreme performance, when clients need to whitelist IP addresses (NLB provides static IPs; ALB does not), when you're handling non-HTTP traffic (gaming, IoT, SMTP), or when you need TLS termination with a static IP.",
    keyFacts: [
      "Layer 4 load balancing: forwards TCP/UDP packets without inspecting HTTP headers",
      "Capable of handling millions of requests per second with ultra-low latency",
      "Cross-zone load balancing is OFF by default for NLB; enabling it adds inter-AZ data transfer charges",
      "Each NLB AZ subnet gets a static IP (you can assign Elastic IPs for fixed, predictable IPs clients can whitelist)",
      "Source IP preservation: targets receive the original client IP by default (unlike ALB, which uses the load balancer's IP)",
    ],
    examTraps: [
      "Trap: NLB has cross-zone load balancing enabled by default like ALB. Reality: NLB cross-zone load balancing is OFF by default, and enabling it has a cost. ALB has it ON by default at no charge.",
    ],
    relatedServices: ["ALB", "EC2", "ECS", "VPC", "Route53", "PrivateLink"],
  },

  {
    id: "api-gateway",
    name: "Amazon API Gateway",
    shortName: "Amazon API Gateway",
    abbr: "API Gateway",
    category: "networking",
    domains: [1, 2, 3],
    tagline: "Create, publish, and manage HTTP and WebSocket APIs that connect clients to your backend services.",
    whatItDoes:
      "Amazon API Gateway is a fully managed service for building and operating APIs. It acts as the 'front door' for your backend — receiving client requests, optionally authenticating them, optionally caching responses, then forwarding them to Lambda, EC2, ECS, or any HTTP endpoint. It handles traffic management, authorization, throttling, and monitoring.",
    whenToUse:
      "Use as the entry point for serverless APIs (API Gateway + Lambda is the canonical serverless pattern), when you need request throttling, API keys, usage plans, or response caching, and when you want to expose internal services as managed public APIs.",
    keyFacts: [
      "Three types: REST API, HTTP API (simpler, cheaper, ~70% cheaper than REST API for basic use cases), and WebSocket API",
      "Integrates natively with Lambda, HTTP endpoints, AWS services, and VPC links",
      "Edge-optimized endpoint: deploys API to CloudFront edge locations globally",
      "Regional endpoint: deployed in a single region, intended for same-region clients or when you add CloudFront yourself",
      "API caching: responses cached by TTL (time to live) to reduce calls to the backend and improve latency",
      "Throttling defaults: 10,000 requests per second (steady-state) and 5,000 request burst per account per region",
    ],
    examTraps: [
      "Trap: API Gateway and ALB are interchangeable for all use cases. Reality: API Gateway adds auth, throttling, API keys, caching, and usage plans. ALB is a simpler Layer 7 load balancer without these features. For serverless architectures, API Gateway is the canonical answer.",
    ],
    relatedServices: ["Lambda", "ALB", "VPC", "Cognito", "WAF", "CloudFront"],
  },

  // ─── SECURITY ───────────────────────────────────────────────────────────────

  {
    id: "iam",
    name: "AWS Identity and Access Management (AWS IAM)",
    shortName: "AWS IAM",
    abbr: "IAM",
    category: "security",
    domains: [1, 2],
    tagline: "Control who can access your AWS account and what they are allowed to do.",
    whatItDoes:
      "AWS IAM lets you create and manage users, groups, roles, and policies that control access to AWS resources. You grant least-privilege access by writing JSON policies that specify which AWS services and actions are allowed or denied. IAM roles can be assumed by AWS services (like EC2 or Lambda) to access other services without embedding credentials.",
    whenToUse:
      "Use IAM for everything related to AWS access control: creating users for team members, assigning roles to EC2 instances or Lambda functions, setting up cross-account access, and implementing the principle of least privilege.",
    keyFacts: [
      "IAM is global (not region-specific) — users, groups, and roles exist across all regions",
      "IAM Roles are temporary credentials; IAM Users are long-term credentials — prefer Roles for applications and services",
      "Evaluation order: explicit Deny always overrides any Allow; if no explicit allow exists, the default is Deny",
      "IAM Permission Boundaries: a permissions boundary sets the maximum permissions an IAM user or role can have, even if their policy grants more",
      "AWS Organizations Service Control Policies (SCPs) override IAM policies at the account level — they set the maximum permissions for all IAM entities in an account",
    ],
    examTraps: [
      "Trap: A permission boundary grants permissions — if you set a boundary, the entity gets those permissions. Reality: Permission boundaries only restrict the maximum permissions; they do not grant permissions. Both the identity policy AND the boundary must allow an action.",
    ],
    relatedServices: ["KMS", "CloudTrail", "Organizations", "Cognito", "STS"],
  },

  {
    id: "kms",
    name: "AWS Key Management Service (AWS KMS)",
    shortName: "AWS KMS",
    abbr: "KMS",
    category: "security",
    domains: [1],
    tagline: "Create and manage the encryption keys used to protect your data across AWS services.",
    whatItDoes:
      "AWS KMS is a managed service for creating and controlling cryptographic keys. Most AWS services (S3, EBS, RDS, Lambda, etc.) integrate with KMS to encrypt data at rest. You control who can use each key via key policies. KMS uses FIPS 140-2 validated hardware security modules (HSMs).",
    whenToUse:
      "Use KMS whenever a question mentions encrypting data at rest in any AWS service. Use Customer Managed Keys (CMKs) when you need audit control, custom rotation schedules, or cross-account key sharing.",
    keyFacts: [
      "Three key types: AWS Managed Keys (free, rotate every year automatically, you cannot manage them), Customer Managed Keys (you control rotation and policies, $1/month/key), and Customer-Provided Keys (you supply the raw key material)",
      "Automatic key rotation: when enabled on a CMK, AWS generates new key material every year — but existing ciphertext is NOT re-encrypted; the old key material is retained to decrypt older data",
      "KMS key policies are resource-based policies — unlike IAM, a KMS key must explicitly allow access in its key policy (IAM alone is not sufficient unless the key policy delegates to IAM)",
      "Envelope encryption: KMS generates a data encryption key (DEK), encrypts your data locally with the DEK, then encrypts the DEK with the KMS key — only the encrypted DEK is stored with the data",
      "KMS API calls are logged in AWS CloudTrail for auditability",
    ],
    examTraps: [
      "Trap: Enabling automatic key rotation on a KMS key re-encrypts all existing ciphertext with the new key. Reality: Rotation only generates new key material for future encryptions. Existing ciphertext is NOT re-encrypted and can still be decrypted because the old material is kept.",
    ],
    relatedServices: ["IAM", "CloudTrail", "S3", "EBS", "SecretsManager", "CloudHSM"],
  },

  {
    id: "waf",
    name: "AWS WAF (Web Application Firewall)",
    shortName: "AWS WAF",
    abbr: "WAF",
    category: "security",
    domains: [1],
    tagline: "Block malicious web requests like SQL injection, cross-site scripting, and bot traffic before they reach your application.",
    whatItDoes:
      "AWS WAF is a web application firewall that filters HTTP/HTTPS requests at Layer 7. You create rules that inspect the content of requests (IP addresses, HTTP headers, body, query strings, URI) and allow, block, or count them. It integrates with CloudFront, ALB, API Gateway, and AppSync.",
    whenToUse:
      "Use to protect web applications from common exploits: SQL injection, cross-site scripting (XSS), HTTP floods (Layer 7 DDoS), bad bots, and content scraping. Use AWS Managed Rules for fast protection without writing rules from scratch.",
    keyFacts: [
      "Can be attached to CloudFront (global), ALB (regional), API Gateway (regional), and AppSync",
      "Web ACLs (Access Control Lists) contain rules and rule groups; you can use AWS Managed Rule Groups, vendor-provided rules from AWS Marketplace, or your own custom rules",
      "Rate-based rules: automatically block IPs that exceed a specified number of requests in 5 minutes — protects against web scrapers and Layer 7 DDoS",
      "AWS Managed Rules include protections for OWASP Top 10, known bad IPs, and specific applications (WordPress, PHP, etc.)",
      "WAF does NOT protect against volumetric/network-layer DDoS attacks — use AWS Shield for that",
    ],
    examTraps: [
      "Trap: WAF and Shield do the same thing. Reality: WAF filters application-layer (Layer 7) attacks using content inspection rules. Shield (especially Shield Advanced) protects against network/transport-layer (Layer 3/4) volumetric DDoS attacks.",
    ],
    relatedServices: ["Shield", "CloudFront", "ALB", "API Gateway", "FirewallManager"],
  },

  {
    id: "shield",
    name: "AWS Shield",
    shortName: "AWS Shield",
    abbr: "Shield",
    category: "security",
    domains: [1],
    tagline: "Automatic protection against DDoS (Distributed Denial of Service) attacks for your AWS resources.",
    whatItDoes:
      "AWS Shield protects your AWS resources against Distributed Denial of Service (DDoS) attacks. Shield Standard is automatically enabled on all AWS accounts at no charge and defends against common Layer 3 and Layer 4 (network and transport layer) attacks. Shield Advanced adds enhanced protections and a 24/7 DDoS Response Team (DRT) for an additional monthly cost.",
    whenToUse:
      "Shield Standard is always on. Use Shield Advanced for applications that cannot tolerate any downtime from DDoS attacks and need the DRT, cost protection (credits for scaling costs during an attack), and enhanced detection on CloudFront, Route 53, ELB, EC2, and Global Accelerator.",
    keyFacts: [
      "Shield Standard: free, automatic, protects against common Layer 3 and Layer 4 attacks (SYN floods, UDP reflection, etc.)",
      "Shield Advanced: $3,000/month per organization, 24/7 DDoS Response Team, AWS cost protection during attacks, advanced detection and mitigation",
      "Shield Advanced can be applied to CloudFront, Route 53, ELB (ALB/NLB/CLB), EC2 Elastic IPs, and Global Accelerator",
      "Shield Advanced includes AWS WAF at no additional charge for protected resources",
    ],
    examTraps: [
      "Trap: Shield protects against application-layer (Layer 7) attacks like HTTP floods. Reality: Shield primarily defends against network and transport-layer DDoS. Layer 7 application attacks are handled by WAF.",
    ],
    relatedServices: ["WAF", "CloudFront", "Route53", "ALB", "GlobalAccelerator"],
  },

  {
    id: "guardduty",
    name: "Amazon GuardDuty",
    shortName: "Amazon GuardDuty",
    abbr: "GuardDuty",
    category: "security",
    domains: [1],
    tagline: "Continuously monitors your AWS account for suspicious activity and potential threats using machine learning.",
    whatItDoes:
      "Amazon GuardDuty is a threat detection service that continuously analyzes event data across your AWS account to find malicious behavior. It analyzes VPC Flow Logs, AWS CloudTrail management events, CloudTrail S3 data events, DNS logs, and Kubernetes audit logs. It uses machine learning, anomaly detection, and known threat intelligence to identify threats.",
    whenToUse:
      "Use to get immediate visibility into potential threats — compromised EC2 instances, unusual API calls, cryptocurrency mining, credential theft attempts, and data exfiltration. Enable it in every account as a baseline security monitoring tool.",
    keyFacts: [
      "GuardDuty pulls VPC Flow Logs, CloudTrail logs, and DNS query logs on its own — you do NOT need to manually enable those logs or send them to GuardDuty",
      "Findings are sent to GuardDuty console, EventBridge, and Security Hub",
      "Multi-account support via AWS Organizations: a designated administrator account can manage GuardDuty across all member accounts",
      "Malware Protection for EC2: GuardDuty can scan EBS volumes attached to EC2 instances for malware when suspicious activity is detected",
      "Free 30-day trial; pricing is based on volume of events analyzed",
    ],
    examTraps: [
      "Trap: You need to enable VPC Flow Logs and CloudTrail before GuardDuty can work. Reality: GuardDuty has its own access to these data sources independent of whether you've enabled the logs for your own use. Enabling GuardDuty is sufficient.",
    ],
    relatedServices: ["CloudTrail", "SecurityHub", "Macie", "Inspector", "EventBridge"],
  },

  {
    id: "macie",
    name: "Amazon Macie",
    shortName: "Amazon Macie",
    abbr: "Macie",
    category: "security",
    domains: [1],
    tagline: "Automatically discover and protect sensitive data (like credit cards or personal information) stored in Amazon S3.",
    whatItDoes:
      "Amazon Macie uses machine learning to automatically discover, classify, and protect sensitive data in Amazon S3 buckets. It identifies Personally Identifiable Information (PII), financial data, healthcare records, credentials, and other sensitive data types. Macie also identifies S3 buckets that are publicly accessible or unencrypted.",
    whenToUse:
      "Use when you need to find and protect sensitive data stored in S3 — for compliance with GDPR, HIPAA, PCI-DSS, or any regulation requiring you to know where sensitive data lives and whether it's properly protected.",
    keyFacts: [
      "Analyzes only Amazon S3 — it does not scan other storage services like EBS or RDS",
      "Detects over 80 sensitive data types including credit card numbers, AWS secret keys, PII, and healthcare identifiers",
      "Generates findings for sensitive data discovered and for S3 security issues (public access, unencrypted buckets, etc.)",
      "Findings sent to Security Hub and EventBridge for automated remediation",
      "Managed data identifiers (built-in) and Custom data identifiers (regex + keywords you define)",
    ],
    examTraps: [
      "Trap: Use Macie to scan EBS volumes or RDS databases for sensitive data. Reality: Macie only analyzes S3. For other data stores, you'd need custom solutions.",
    ],
    relatedServices: ["S3", "GuardDuty", "SecurityHub", "EventBridge", "KMS"],
  },

  {
    id: "inspector",
    name: "Amazon Inspector",
    shortName: "Amazon Inspector",
    abbr: "Inspector",
    category: "security",
    domains: [1],
    tagline: "Automatically scan your EC2 instances and container images for known software vulnerabilities.",
    whatItDoes:
      "Amazon Inspector automatically scans your EC2 instances, Lambda functions, and container images in Amazon ECR for software vulnerabilities (CVEs — Common Vulnerabilities and Exposures) and unintended network exposure. It continuously monitors for new CVEs and reassesses your resources when new vulnerabilities are published.",
    whenToUse:
      "Use to maintain a continuously updated view of software vulnerabilities in your compute resources. Good for DevSecOps pipelines where you want to catch vulnerabilities before deploying containers or immediately when new CVEs are disclosed.",
    keyFacts: [
      "Continuously scans — when a new CVE is published, Inspector automatically reassesses affected resources without you triggering a new scan",
      "Scans EC2 instances (via SSM Agent), Lambda function code/layers, and ECR container images",
      "Each finding includes a risk score and prioritized remediation steps",
      "Inspector v2 is the current version — the original Inspector v1 has been deprecated",
      "Findings are sent to Security Hub for centralized management",
    ],
    examTraps: [
      "Trap: Inspector monitors for suspicious runtime behavior and threats like GuardDuty. Reality: Inspector scans for known vulnerabilities (CVEs) in software packages. GuardDuty monitors for malicious behavior in real time. They are complementary, not overlapping.",
    ],
    relatedServices: ["GuardDuty", "SecurityHub", "ECR", "EC2", "Lambda"],
  },

  {
    id: "secrets-manager",
    name: "AWS Secrets Manager",
    shortName: "Secrets Manager",
    abbr: "SecretsManager",
    category: "security",
    domains: [1, 2],
    tagline: "Securely store database passwords and API keys, and automatically rotate them on a schedule.",
    whatItDoes:
      "AWS Secrets Manager stores, rotates, and retrieves credentials (database passwords, API keys, OAuth tokens, etc.). Your application calls the Secrets Manager API to get the current secret value instead of hardcoding credentials. Secrets Manager can automatically rotate secrets for supported databases (RDS, Aurora, Redshift, DocumentDB) on a schedule, with no application downtime.",
    whenToUse:
      "Use whenever you need to store credentials that applications use to access databases or external APIs. Especially valuable when you need automatic rotation so database passwords change regularly without code changes.",
    keyFacts: [
      "Automatic rotation using Lambda functions (built-in rotation for RDS, Aurora, Redshift, DocumentDB, or custom Lambda for anything else)",
      "Secrets are encrypted with AWS KMS; you can use the default aws/secretsmanager key or a customer-managed key",
      "Pricing: $0.40 per secret per month + $0.05 per 10,000 API calls",
      "Supports cross-account access and resource-based policies",
      "Integrates directly with RDS — when you create an RDS database, you can enable Secrets Manager to manage and rotate the master password",
    ],
    examTraps: [
      "Trap: AWS Systems Manager Parameter Store and Secrets Manager are equivalent for all use cases. Reality: Parameter Store is cheaper (free for standard parameters) but does NOT support automatic rotation. Secrets Manager supports automatic rotation and is the correct answer when rotation is required.",
    ],
    relatedServices: ["KMS", "RDS", "Lambda", "IAM", "ParameterStore"],
  },

  {
    id: "cloudtrail",
    name: "AWS CloudTrail",
    shortName: "AWS CloudTrail",
    abbr: "CloudTrail",
    category: "security",
    domains: [1],
    tagline: "Keep a record of every API call made in your AWS account — who did what, when, and from where.",
    whatItDoes:
      "AWS CloudTrail logs every API call made to AWS services in your account, including calls from the AWS Console, CLI, SDKs, and other AWS services. Each log entry captures who made the call (user/role), what action they took, what resource was affected, when it happened, and from which IP address.",
    whenToUse:
      "Use for security auditing (who deleted that S3 bucket?), compliance (prove that access controls were enforced), operational troubleshooting (what API calls preceded an error?), and as input to GuardDuty and Security Hub for threat detection.",
    keyFacts: [
      "CloudTrail is enabled by default for all AWS accounts and retains management event history for 90 days in the console",
      "To retain logs longer than 90 days or to enable S3 data events/Lambda events, create a Trail that stores logs to S3",
      "Two event types: Management events (control-plane actions like CreateBucket, RunInstances) and Data events (data-plane actions like S3 GetObject, Lambda Invoke — extra cost and must be explicitly enabled)",
      "CloudTrail Insights: automatically detects unusual patterns in API call volume (e.g., a spike in TerminateInstances calls)",
      "Multi-region trails log events from all regions into a single S3 bucket",
    ],
    examTraps: [
      "Trap: CloudTrail detects threats and anomalies in real time, like GuardDuty. Reality: CloudTrail is a log — it records what happened. GuardDuty analyzes those logs in real time to detect threats. Config records resource configuration changes. These three services are distinct and complementary.",
    ],
    relatedServices: ["GuardDuty", "Config", "SecurityHub", "S3", "KMS", "IAM"],
  },

  // ─── INTEGRATION ────────────────────────────────────────────────────────────

  {
    id: "sqs",
    name: "Amazon Simple Queue Service (Amazon SQS)",
    shortName: "Amazon SQS",
    abbr: "SQS",
    category: "integration",
    domains: [1, 2, 3, 4],
    tagline: "A message queue that lets one service send messages to another without both needing to be available at the same time.",
    whatItDoes:
      "Amazon SQS is a fully managed message queuing service. A producer sends messages to a queue; one or more consumers poll the queue and process messages. The queue buffers messages so if the consumer is slow or offline, messages are not lost. SQS decouples the sender from the receiver.",
    whenToUse:
      "Use to decouple application components — for example, a web tier that accepts orders sends them to a queue, and a processing tier reads from the queue at its own pace. Also use for load leveling (preventing a sudden burst from overwhelming the backend) and for fan-out with SNS.",
    keyFacts: [
      "Standard Queue: at-least-once delivery (a message may be delivered more than once), best-effort ordering — NOT exactly-once, NOT ordered",
      "FIFO Queue: exactly-once processing, strict ordering, up to 300 messages/second (3,000 with batching in groups of 10)",
      "Default visibility timeout: 30 seconds — a message is hidden from other consumers while one consumer is processing it",
      "Long polling: consumer waits up to 20 seconds for messages to arrive before returning an empty response — reduces empty receive calls and costs",
      "Dead Letter Queue (DLQ): messages that fail processing more than the configured number of times are moved to the DLQ for inspection",
      "Maximum message size: 256 KB; for larger payloads, store the data in S3 and put a reference in the SQS message",
    ],
    examTraps: [
      "Trap: SQS Standard Queue guarantees each message is delivered exactly once. Reality: Standard Queue guarantees at-least-once delivery — messages CAN be delivered more than once. Your consumer must be idempotent, or use FIFO Queue for exactly-once processing.",
    ],
    relatedServices: ["SNS", "Lambda", "EventBridge", "EC2", "S3"],
  },

  {
    id: "sns",
    name: "Amazon Simple Notification Service (Amazon SNS)",
    shortName: "Amazon SNS",
    abbr: "SNS",
    category: "integration",
    domains: [1, 2, 3],
    tagline: "Send one message to many recipients at the same time using a publish-subscribe model.",
    whatItDoes:
      "Amazon SNS is a fully managed publish-subscribe (pub/sub) messaging service. A publisher sends a message to an SNS Topic, and SNS immediately delivers that message to all subscribers — which can be SQS queues, Lambda functions, HTTP endpoints, email addresses, SMS recipients, or mobile push notifications.",
    whenToUse:
      "Use when you need to fan out a single event to multiple systems simultaneously — for example, when an order is placed, notify the fulfillment system (SQS), send a confirmation email (email subscription), and trigger analytics (Lambda). The SNS + SQS fan-out pattern is extremely common on the exam.",
    keyFacts: [
      "Push-based: SNS pushes messages to subscribers immediately (vs. SQS, which consumers poll)",
      "SNS FIFO Topic: strict ordering and deduplication, can only have SQS FIFO queues as subscribers",
      "Message filtering: subscribers can add a filter policy so they only receive messages matching certain attributes — avoids each subscriber processing irrelevant messages",
      "SNS Fan-out to SQS: send one SNS message, deliver it to many SQS queues simultaneously — standard fan-out pattern",
      "Maximum message size: 256 KB",
    ],
    examTraps: [
      "Trap: SQS and SNS are interchangeable — both deliver messages to consumers. Reality: SQS is a queue (consumers pull); SNS is a pub/sub system (messages are pushed to all subscribers). They solve different problems and are often combined (SNS → SQS fan-out).",
    ],
    relatedServices: ["SQS", "Lambda", "EventBridge", "SMS", "Email"],
  },

  {
    id: "eventbridge",
    name: "Amazon EventBridge",
    shortName: "Amazon EventBridge",
    abbr: "EventBridge",
    category: "integration",
    domains: [1, 2, 3],
    tagline: "Route events from AWS services, your own applications, or SaaS tools to the right targets using rules.",
    whatItDoes:
      "Amazon EventBridge is a serverless event bus. It receives events from AWS services (like an S3 upload, an EC2 state change, or a CodePipeline stage completion), your custom applications, or third-party SaaS applications. You write rules with patterns to match specific events and route them to targets like Lambda, SQS, SNS, Step Functions, or API Gateway.",
    whenToUse:
      "Use when you want to build event-driven architectures where AWS service events trigger automated workflows — for example, automatically remediate security findings, trigger pipelines on code changes, or schedule tasks using cron expressions.",
    keyFacts: [
      "Default event bus receives events from AWS services automatically",
      "Custom event buses for your application events",
      "Partner event buses for SaaS integrations (Zendesk, Datadog, PagerDuty, etc.)",
      "Scheduled rules: cron and rate expressions for running targets on a schedule (replaces CloudWatch Events scheduled rules, which are now EventBridge)",
      "EventBridge Pipes: point-to-point integration with filtering and enrichment — simpler than full event bus for one-to-one integrations",
    ],
    examTraps: [
      "Trap: SNS and EventBridge are the same. Reality: SNS is for fan-out messaging to multiple subscribers. EventBridge is for event routing with content-based filtering, scheduling, and SaaS integration. EventBridge is more capable but SNS is simpler for straightforward pub/sub.",
    ],
    relatedServices: ["Lambda", "SQS", "SNS", "StepFunctions", "CloudWatch"],
  },

  {
    id: "kinesis-data-streams",
    name: "Amazon Kinesis Data Streams",
    shortName: "Kinesis Data Streams",
    abbr: "KDS",
    category: "integration",
    domains: [1, 2, 3],
    tagline: "Ingest and process real-time data streams from thousands of sources simultaneously, with the ability to replay data.",
    whatItDoes:
      "Amazon Kinesis Data Streams is a real-time data streaming service. Producers (applications, IoT devices, log agents) write records to the stream. Multiple consumer applications can read from the same stream independently, each maintaining their own position (sequence number). You can replay data within the retention window.",
    whenToUse:
      "Use for real-time analytics, clickstream analysis, application log processing, IoT telemetry, and any workload where you need multiple independent consumers to process the same stream at their own pace, or where you need to replay past data.",
    keyFacts: [
      "Each shard supports: 1 MB/s or 1,000 records/s write throughput; 2 MB/s read throughput",
      "Data retention: minimum 24 hours (default), configurable up to 365 days — records can be replayed within this window",
      "Unlike SQS, Kinesis Data Streams preserves the order of records within a shard, and data is NOT deleted after being consumed",
      "Enhanced fan-out: each consumer gets a dedicated 2 MB/s read throughput per shard (vs. shared 2 MB/s for standard consumers)",
      "Kinesis Client Library (KCL) handles shard management, checkpointing, and re-processing for consumer applications",
    ],
    examTraps: [
      "Trap: Kinesis Data Streams and Amazon Data Firehose both process real-time data the same way. Reality: Kinesis Data Streams is for custom real-time processing with consumer applications; Firehose is a managed delivery pipeline to S3/Redshift/OpenSearch — it is near-real-time (minimum 60-second buffer), not real-time.",
    ],
    relatedServices: ["Firehose", "Lambda", "SQS", "MSK", "Glue"],
  },

  {
    id: "firehose",
    name: "Amazon Data Firehose",
    shortName: "Amazon Data Firehose",
    abbr: "Firehose",
    category: "integration",
    domains: [3, 4],
    tagline: "Load streaming data into S3, Redshift, or OpenSearch automatically, without writing any consumer code.",
    whatItDoes:
      "Amazon Data Firehose (formerly called Kinesis Data Firehose, renamed in February 2024) is a fully managed data delivery service. You write records to it, and Firehose buffers them, optionally transforms them (using Lambda), and delivers batches to a destination: Amazon S3, Amazon Redshift, Amazon OpenSearch Service, Splunk, or other HTTP endpoints.",
    whenToUse:
      "Use when you want to ingest streaming data into a data store (S3, Redshift, OpenSearch) without writing consumer code or managing the pipeline. Good for log ingestion, clickstream data, and ETL pipelines where near-real-time (within a minute or two) delivery is acceptable.",
    keyFacts: [
      "Near-real-time delivery: minimum buffer time is 60 seconds (not instant, not real-time)",
      "Renamed from 'Kinesis Data Firehose' to 'Amazon Data Firehose' in February 2024",
      "Fully managed, serverless — no shards to provision, no consumers to write",
      "Can transform records with an AWS Lambda function before delivery",
      "Destinations: Amazon S3, Amazon Redshift (via S3 COPY), Amazon OpenSearch Service, Splunk, HTTP endpoints, and more",
      "Does NOT support replay — unlike Kinesis Data Streams, once data is delivered, it cannot be re-read from Firehose",
    ],
    examTraps: [
      "Trap: Amazon Data Firehose delivers data in real time. Reality: Firehose is NEAR-real-time. The minimum buffer interval is 60 seconds. For true real-time processing (sub-second), use Kinesis Data Streams with a consumer application.",
    ],
    relatedServices: ["KDS", "S3", "Redshift", "OpenSearch", "Lambda"],
  },

  // ─── ANALYTICS ──────────────────────────────────────────────────────────────

  {
    id: "athena",
    name: "Amazon Athena",
    shortName: "Amazon Athena",
    abbr: "Athena",
    category: "analytics",
    domains: [3, 4],
    tagline: "Run SQL queries directly on files in Amazon S3 without loading data into a database first.",
    whatItDoes:
      "Amazon Athena is a serverless interactive query service. You point it at files stored in S3 (CSV, JSON, Parquet, ORC, Avro, etc.), define a schema in the Glue Data Catalog, and run standard SQL queries. Athena handles the compute automatically — you pay per query based on the amount of data scanned.",
    whenToUse:
      "Use for ad hoc analysis of data in S3 — log analysis, security investigation, one-time data transformations, and querying data lake files. Also used to query AWS service logs (CloudTrail, ALB access logs, VPC Flow Logs) without loading them into a database.",
    keyFacts: [
      "Serverless — no infrastructure to provision or manage",
      "Pricing: $5 per TB of data scanned; using Parquet or ORC compressed formats can reduce scanned data by 30–90%, significantly cutting costs",
      "Federated queries: Athena can query data sources beyond S3 (RDS, DynamoDB, on-premises databases) using Lambda-based connectors",
      "Athena is backed by Apache Presto (now Trino) under the hood",
      "Results are stored in an S3 bucket you specify",
    ],
    examTraps: [
      "Trap: You need to move data from S3 into a database before you can query it with SQL. Reality: Athena queries data directly in S3 — no ETL or data loading required.",
    ],
    relatedServices: ["S3", "Glue", "QuickSight", "Redshift", "CloudTrail"],
  },

  {
    id: "glue",
    name: "AWS Glue",
    shortName: "AWS Glue",
    abbr: "Glue",
    category: "analytics",
    domains: [3, 4],
    tagline: "A managed ETL service that discovers, prepares, and moves data between data stores automatically.",
    whatItDoes:
      "AWS Glue is a fully managed serverless ETL (Extract, Transform, Load) service. The Glue Data Catalog stores metadata (table schemas, locations) about your data stored in S3, RDS, Redshift, and other sources. Glue Crawlers automatically scan data sources and populate the catalog. Glue Jobs run PySpark or Python scripts to transform and move data.",
    whenToUse:
      "Use to prepare and transform data for analytics — converting raw CSV logs to Parquet, joining tables from different sources, deduplicating records, and loading clean data into Redshift or S3. The Glue Data Catalog is used by Athena, Redshift Spectrum, and EMR as a shared metadata store.",
    keyFacts: [
      "Glue Data Catalog: central metadata repository — stores database and table definitions, used by Athena, Redshift Spectrum, and Lake Formation",
      "Glue Crawlers: automatically discover data in S3 or JDBC sources and infer schemas to populate the Data Catalog",
      "Glue ETL jobs run on a serverless Apache Spark engine; you write PySpark or Python scripts",
      "Glue DataBrew: visual data preparation tool — no code required for common transformations",
      "Glue Elastic Views: create materialized views that combine data from multiple sources (currently in limited availability)",
    ],
    examTraps: [
      "Trap: You need a separate database to hold metadata about your S3 data lake. Reality: The Glue Data Catalog IS that metadata repository — Athena, Redshift Spectrum, and EMR all use it natively.",
    ],
    relatedServices: ["Athena", "S3", "Redshift", "EMR", "LakeFormation"],
  },

  {
    id: "opensearch",
    name: "Amazon OpenSearch Service",
    shortName: "Amazon OpenSearch Service",
    abbr: "OpenSearch",
    category: "analytics",
    domains: [1, 3],
    tagline: "Search and analyze large volumes of text data, logs, and metrics in near real time.",
    whatItDoes:
      "Amazon OpenSearch Service is a managed service for deploying and running OpenSearch (formerly Elasticsearch) and Kibana (now OpenSearch Dashboards). It's used for full-text search, log analytics, real-time application monitoring, and clickstream analysis. Data is ingested from Kinesis Firehose, CloudWatch Logs, S3, or direct API calls.",
    whenToUse:
      "Use for full-text search applications (search bars, product search), log analytics and operational dashboards, security analytics (SIEM), and any use case requiring near-real-time indexing and complex search queries across large text datasets.",
    keyFacts: [
      "OpenSearch is the AWS-maintained fork of Elasticsearch 7.10 and Kibana 7.10",
      "Supports full-text search, fuzzy search, aggregations, and geospatial queries",
      "Multiple instance types and storage options; supports UltraWarm (tiered warm storage in S3) and Cold Storage for older data",
      "Integrates with Kinesis Data Firehose, CloudWatch Logs subscription filters, Lambda, and S3 via Glue",
      "OpenSearch Serverless: capacity auto-scales; you pay per OpenSearch Compute Unit (OCU) consumed",
    ],
    examTraps: [
      "Trap: Use Redshift for log searching and full-text search. Reality: Redshift is optimized for analytical queries on structured columnar data. OpenSearch Service is designed for full-text search and log analytics with inverted indexes.",
    ],
    relatedServices: ["Firehose", "CloudWatch", "Lambda", "S3", "Athena"],
  },

  // ─── MANAGEMENT ─────────────────────────────────────────────────────────────

  {
    id: "cloudwatch",
    name: "Amazon CloudWatch",
    shortName: "Amazon CloudWatch",
    abbr: "CloudWatch",
    category: "management",
    domains: [1, 2, 3, 4],
    tagline: "Monitor your AWS resources and applications with metrics, logs, dashboards, and automated alarms.",
    whatItDoes:
      "Amazon CloudWatch is AWS's observability service. It collects metrics from AWS services (CPU utilization, network bytes, request counts, etc.) and custom metrics from your applications. CloudWatch Logs ingests and stores log files from EC2, Lambda, API Gateway, ECS, and more. You create Alarms that trigger actions (Auto Scaling, SNS notifications) when metrics cross thresholds.",
    whenToUse:
      "Use for all monitoring needs: setting alarms on EC2 CPU to trigger Auto Scaling, querying logs for error messages, creating operational dashboards, and monitoring custom application metrics.",
    keyFacts: [
      "Default metric resolution: 1 minute (standard); High-Resolution metrics can be published with 1-second granularity",
      "CloudWatch Logs Insights: interactive query language for searching and analyzing log data in CloudWatch Logs",
      "Composite Alarms: combine multiple alarms with AND/OR logic to reduce alarm noise",
      "CloudWatch Contributor Insights: identifies top contributors to high request rates or errors from logs",
      "CloudWatch Container Insights: collects CPU, memory, disk, and network metrics from ECS and EKS clusters",
      "Basic monitoring: free, 5-minute granularity for EC2; Detailed monitoring: extra cost, 1-minute granularity",
    ],
    examTraps: [
      "Trap: CloudWatch and CloudTrail both log events in your account — they're the same thing. Reality: CloudWatch collects metrics and application logs for monitoring and alerting. CloudTrail logs AWS API calls for auditing. They are distinct services that complement each other.",
    ],
    relatedServices: ["CloudTrail", "EventBridge", "SNS", "AutoScaling", "Config"],
  },

  {
    id: "cloudformation",
    name: "AWS CloudFormation",
    shortName: "AWS CloudFormation",
    abbr: "CloudFormation",
    category: "management",
    domains: [1, 2, 4],
    tagline: "Define your entire AWS infrastructure as code in a text file, then deploy it consistently with one command.",
    whatItDoes:
      "AWS CloudFormation is an Infrastructure as Code (IaC) service. You write a template (in JSON or YAML) that describes the AWS resources you want (VPCs, EC2 instances, RDS databases, Lambda functions, etc.), and CloudFormation creates, updates, or deletes those resources in the right order. The set of resources deployed from a template is called a Stack.",
    whenToUse:
      "Use to create repeatable, version-controlled infrastructure — deployment environments, disaster recovery setups, compliance baselines, and multi-region deployments. Also use for automating the creation of complex architectures with dependencies.",
    keyFacts: [
      "Stacks: a single deployment unit containing all resources defined in a template",
      "StackSets: deploy the same CloudFormation stack to multiple AWS accounts and regions from a single operation",
      "Change Sets: preview what CloudFormation will change before applying — useful for reviewing updates before making them",
      "Drift detection: identifies resources whose actual configuration has diverged from the CloudFormation template",
      "DeletionPolicy attribute: Retain (keep the resource when the stack is deleted), Snapshot (take a snapshot of EBS/RDS before deleting), or Delete (default — remove the resource)",
    ],
    examTraps: [
      "Trap: CloudFormation and Terraform are the same because both are IaC. Reality: On the exam, CloudFormation is the AWS-native answer. The key distinguishing feature is that CloudFormation handles resource creation order (dependencies) automatically and supports rollback on failure.",
    ],
    relatedServices: ["CDK", "ServiceCatalog", "Config", "CloudTrail"],
  },

  {
    id: "trusted-advisor",
    name: "AWS Trusted Advisor",
    shortName: "AWS Trusted Advisor",
    abbr: "TrustedAdvisor",
    category: "management",
    domains: [1, 2, 4],
    tagline: "Get personalized recommendations to optimize your AWS environment for cost, performance, security, and reliability.",
    whatItDoes:
      "AWS Trusted Advisor is an automated tool that inspects your AWS account configuration and gives you recommendations across five categories: Cost Optimization, Performance, Security, Fault Tolerance, and Service Limits. It compares your configuration against AWS best practices and flags issues.",
    whenToUse:
      "Use to get a quick scan of your account for obvious issues — unused EC2 Reserved Instances, S3 buckets with public read access, security groups with unrestricted access, or services approaching their limits.",
    keyFacts: [
      "All AWS accounts get 6 free checks: S3 bucket public access, security group open ports, IAM use check, MFA on root, Service Limits, and EBS public snapshots",
      "Full access to all Trusted Advisor checks requires Business, Enterprise On-Ramp, or Enterprise Support plan",
      "Five categories: Cost Optimization, Performance, Security, Fault Tolerance, Service Limits",
      "Trusted Advisor integrates with CloudWatch Events (now EventBridge) to trigger automated remediation when check status changes",
      "Trusted Advisor Priority: available with Enterprise Support, highlights the most impactful recommendations",
    ],
    examTraps: [
      "Trap: All AWS customers get access to all Trusted Advisor checks. Reality: Only 6 core checks are free for Basic and Developer support plans. You need Business or Enterprise support to access the full set of checks.",
    ],
    relatedServices: ["CloudWatch", "EventBridge", "Config", "SecurityHub"],
  },

  {
    id: "cost-explorer",
    name: "AWS Cost Explorer",
    shortName: "Cost Explorer",
    abbr: "CostExplorer",
    category: "management",
    domains: [4],
    tagline: "Visualize, understand, and manage your AWS spending over time with interactive charts and forecasts.",
    whatItDoes:
      "AWS Cost Explorer is an interactive tool for visualizing and analyzing your AWS costs and usage. You can view costs by service, account, region, tag, or time period. It shows historical spending, forecasts future costs, and recommends Reserved Instance or Savings Plans purchases based on your usage patterns.",
    whenToUse:
      "Use to understand where your AWS spending is going, identify cost anomalies, forecast future bills, right-size EC2 instances, and evaluate the cost savings from purchasing Reserved Instances or Savings Plans.",
    keyFacts: [
      "Free to use — no additional charge to access Cost Explorer",
      "Data retention: up to 12 months of historical cost and usage data",
      "Savings Plans recommendations: Cost Explorer analyzes your On-Demand usage and recommends the right Savings Plans commitment",
      "Reserved Instance utilization and coverage reports show how well your Reserved Instances are being used",
      "Cost anomaly detection: uses machine learning to alert you when unexpected spending is detected",
    ],
    examTraps: [
      "Trap: AWS Budgets and Cost Explorer are the same tool. Reality: Cost Explorer is for analysis and visualization of past and projected costs. AWS Budgets is for setting spending thresholds and receiving alerts when you approach or exceed them.",
    ],
    relatedServices: ["Budgets", "CostAllocationTags", "TrustedAdvisor", "Organizations"],
  },

  {
    id: "config",
    name: "AWS Config",
    shortName: "AWS Config",
    abbr: "Config",
    category: "management",
    domains: [1, 2],
    tagline: "Track every configuration change to your AWS resources over time and check whether they comply with your rules.",
    whatItDoes:
      "AWS Config is a configuration history and compliance service. It continuously records the configuration of your AWS resources (EC2 instances, security groups, S3 buckets, IAM policies, etc.) as configuration items. You can define Config Rules (or use AWS-managed rules) to check if resources meet your compliance requirements. Config tells you what changed, when, and what it looked like before.",
    whenToUse:
      "Use for compliance auditing (prove that all S3 buckets are encrypted), change management (trace the configuration history of a resource that's causing an issue), security baseline monitoring (alert when a security group is opened to 0.0.0.0/0), and configuration drift detection.",
    keyFacts: [
      "Detective control: records what CHANGED in resource configuration — it does not prevent changes",
      "Conformance Packs: collections of Config Rules and remediation actions deployed as a single unit, useful for regulatory compliance frameworks (PCI-DSS, HIPAA, CIS AWS Foundations)",
      "Remediation: Config Rules can trigger automatic remediation via AWS Systems Manager Automation documents when a resource is non-compliant",
      "Multi-account and multi-region: AWS Config Aggregator collects configuration data from multiple accounts/regions into one view",
      "Config records configuration items for each supported resource type; the history is stored in S3",
    ],
    examTraps: [
      "Trap: AWS Config, CloudTrail, and GuardDuty all do the same thing. Reality: Config = what changed in resource configuration (detective). CloudTrail = who made the API call (audit log). GuardDuty = is there a threat in the account (threat detection). They are distinct and complementary services.",
    ],
    relatedServices: ["CloudTrail", "GuardDuty", "SecurityHub", "CloudWatch", "CloudFormation"],
  },
]
