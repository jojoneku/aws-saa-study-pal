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

  // ─── COMPUTE (NEW) ──────────────────────────────────────────────────────────

  {
    id: "app-runner",
    name: "AWS App Runner",
    shortName: "App Runner",
    abbr: "AppRunner",
    category: "compute",
    domains: [2, 3, 4],
    tagline: "Go from container image or source code to a live HTTPS URL in minutes, with zero infrastructure to manage.",
    whatItDoes:
      "AWS App Runner is a fully managed service that takes a container image (from ECR) or source code (from GitHub) and builds, deploys, and runs it as a scalable HTTPS web service. AWS handles load balancing, TLS certificates, auto scaling, and health checks. You never configure servers, clusters, or networking.",
    whenToUse:
      "Use when you want the fastest possible path from code to a running web service or API, with no interest in managing the underlying infrastructure. Ideal for web apps, REST APIs, and microservices where simplicity matters more than deep configuration control.",
    keyFacts: [
      "Supports container images from Amazon ECR and source code from GitHub (builds automatically on push)",
      "Automatically scales out and in based on incoming request volume, including scaling to zero when idle",
      "Provides a built-in HTTPS endpoint with a TLS certificate managed by AWS",
      "No charge when scaled to zero; you pay only for compute and memory when requests are being served",
      "VPC connector available to allow App Runner services to access private resources inside a VPC",
    ],
    examTraps: [
      "Trap: App Runner and Elastic Beanstalk solve the same problem. Reality: Elastic Beanstalk provisions and exposes underlying EC2 instances, Auto Scaling groups, and load balancers that you can view and modify. App Runner abstracts all of that away entirely — no EC2 instances to see or manage.",
    ],
    relatedServices: ["ECS", "Fargate", "Elastic Beanstalk", "ECR", "Lambda"],
  },

  {
    id: "batch",
    name: "AWS Batch",
    shortName: "AWS Batch",
    abbr: "Batch",
    category: "compute",
    domains: [3, 4],
    tagline: "Run large-scale batch computing jobs on EC2, Fargate, or Spot Instances without managing job schedulers.",
    whatItDoes:
      "AWS Batch is a fully managed batch computing service. You submit jobs (packaged as Docker containers) to a job queue. AWS Batch provisions the right amount of compute capacity — EC2, Fargate, or Spot Instances — runs your jobs, and cleans up when done. It handles job scheduling, dependency management (run job B after job A finishes), and compute provisioning automatically.",
    whenToUse:
      "Use for large-scale data processing, simulation, genomics, rendering, and any workload that runs as discrete jobs rather than a continuously running service. Use Spot Instances for task nodes to cut costs significantly on fault-tolerant batch workloads.",
    keyFacts: [
      "Jobs are Docker containers run on EC2, Fargate, or Spot Instances — no custom job scheduler to operate",
      "Job queues and compute environments: you define how much compute to provision and from which sources (On-Demand, Spot, Fargate)",
      "Job dependencies: you can specify that job B should only start after job A completes successfully",
      "AWS Batch on Fargate removes the need to manage EC2 instances entirely for batch jobs",
      "No additional charge for AWS Batch — you pay only for the underlying EC2, Fargate, or Spot resources consumed",
    ],
    examTraps: [
      "Trap: Use Lambda for long-running batch data processing jobs. Reality: Lambda has a 15-minute maximum timeout. AWS Batch has no execution time limit and is purpose-built for long-running batch jobs that process large datasets.",
    ],
    relatedServices: ["Lambda", "ECS", "Fargate", "EC2", "S3", "Step Functions"],
  },

  {
    id: "auto-scaling",
    name: "Amazon EC2 Auto Scaling",
    shortName: "EC2 Auto Scaling",
    abbr: "AutoScaling",
    category: "compute",
    domains: [2, 3, 4],
    tagline: "Automatically add or remove EC2 instances based on demand so you always have the right amount of capacity.",
    whatItDoes:
      "Amazon EC2 Auto Scaling maintains a group of EC2 instances (called an Auto Scaling Group, or ASG) and automatically adjusts the number of running instances in response to changing demand. You define a minimum, maximum, and desired capacity. Scaling policies specify when to scale out (add instances) and scale in (remove instances) based on CloudWatch metrics, schedules, or predictive models.",
    whenToUse:
      "Use any time you deploy EC2-based applications that experience variable traffic — web servers, application tiers, batch processing fleets. Always pair an Auto Scaling Group with a load balancer to distribute traffic across the healthy instances.",
    keyFacts: [
      "Scaling policies: Target Tracking (keep a metric at a target, e.g., CPU at 50%), Step Scaling (scale by fixed amounts at different thresholds), Simple Scaling (one action per alarm), and Scheduled Scaling (scale at a known time)",
      "Predictive Scaling uses machine learning to forecast traffic and pre-provision capacity before demand spikes",
      "Lifecycle hooks let you pause instance launch or termination to run custom scripts (install software, drain connections)",
      "Warm pools: pre-initialized instances waiting in a stopped state so they can join the group faster than cold launches",
      "Health checks: replaces unhealthy instances automatically; can use EC2 status checks or ELB health checks",
    ],
    examTraps: [
      "Trap: Auto Scaling alone ensures high availability. Reality: Auto Scaling improves resilience, but for true high availability you must deploy instances across multiple Availability Zones AND use a load balancer to route traffic only to healthy instances.",
    ],
    relatedServices: ["EC2", "ALB", "NLB", "CloudWatch", "ELB", "Launch Template"],
  },

  // ─── STORAGE (NEW) ──────────────────────────────────────────────────────────

  {
    id: "datasync",
    name: "AWS DataSync",
    shortName: "AWS DataSync",
    abbr: "DataSync",
    category: "storage",
    domains: [1, 2, 4],
    tagline: "Automate scheduled data transfers between on-premises storage and AWS storage services at up to 10 Gbps.",
    whatItDoes:
      "AWS DataSync is an online data transfer service that automates moving data between on-premises file servers, object storage, and AWS storage services — including Amazon S3, Amazon EFS, Amazon FSx, and AWS Snowcone. You deploy a DataSync agent on-premises, create a task that defines source and destination, and schedule it to run on a recurring basis. DataSync handles encryption, data integrity verification, and bandwidth throttling.",
    whenToUse:
      "Use to migrate on-premises file data to AWS, replicate data to AWS for disaster recovery, archive cold data from on-premises NAS to S3, or synchronize on-premises and cloud storage on a schedule. Not the right choice when you need real-time replication — use Storage Gateway or database replication for that.",
    keyFacts: [
      "Can transfer data at up to 10 Gbps when used over AWS Direct Connect",
      "Performs automatic data integrity checks (checksums) to verify files arrived intact",
      "Supports NFS, SMB, HDFS, and object storage (S3-compatible) as sources",
      "DataSync is scheduled/batch-oriented — it does NOT do real-time or continuous streaming replication",
      "Agent-based for on-premises sources; agentless for transfers between AWS storage services",
      "Supports bandwidth throttling to avoid saturating your network link during business hours",
    ],
    examTraps: [
      "Trap: AWS DataSync and AWS Storage Gateway do the same thing. Reality: DataSync transfers data in bulk on a schedule (migration, sync, archival). Storage Gateway provides an always-on hybrid storage bridge so on-premises apps can access cloud storage using familiar protocols. They solve different problems.",
    ],
    relatedServices: ["S3", "EFS", "FSx", "Storage Gateway", "Direct Connect", "Snowball Edge"],
  },

  {
    id: "transfer-family",
    name: "AWS Transfer Family",
    shortName: "Transfer Family",
    abbr: "TransferFamily",
    category: "storage",
    domains: [1, 2],
    tagline: "A managed SFTP, FTPS, FTP, and AS2 server that stores transferred files directly in Amazon S3 or Amazon EFS.",
    whatItDoes:
      "AWS Transfer Family is a fully managed file transfer service. It runs SFTP (SSH File Transfer Protocol), FTPS (FTP over TLS), FTP, and AS2 servers on your behalf. When partners or customers upload or download files using any of those protocols, the files are stored directly in or served from Amazon S3 or Amazon EFS. You manage users and their S3/EFS permissions through IAM.",
    whenToUse:
      "Use when business partners or customers need to transfer files to or from your AWS environment using standard file transfer protocols (SFTP, FTPS, FTP, AS2) — for example, EDI file exchanges, B2B data transfers, or migrating on-premises SFTP servers to AWS without changing client workflows.",
    keyFacts: [
      "Supports SFTP (SSH), FTPS (TLS), FTP (plaintext, use only in private VPCs), and AS2 (Applicability Statement 2, used for EDI) protocols",
      "Files are stored directly in Amazon S3 or Amazon EFS — no separate storage layer to manage",
      "Custom identity providers: integrate with existing Microsoft Active Directory, LDAP, or a custom Lambda function for user authentication",
      "No file transfer servers to patch or manage — AWS handles all the infrastructure",
      "Endpoint types: public (internet-facing) or VPC (accessible only from your VPC or over Direct Connect/VPN)",
    ],
    examTraps: [
      "Trap: To allow partners to upload files via SFTP to S3, you need to run an EC2-based SFTP server. Reality: AWS Transfer Family provides a fully managed SFTP endpoint that writes directly to S3 — no EC2 instances required.",
    ],
    relatedServices: ["S3", "EFS", "IAM", "Route53", "Direct Connect"],
  },

  {
    id: "fsx-ontap",
    name: "Amazon FSx for NetApp ONTAP",
    shortName: "FSx for NetApp ONTAP",
    abbr: "FSx-ONTAP",
    category: "storage",
    domains: [2, 3],
    tagline: "A fully managed NetApp ONTAP file system on AWS, supporting NFS, SMB, and iSCSI simultaneously.",
    whatItDoes:
      "Amazon FSx for NetApp ONTAP provides a managed file system based on NetApp's ONTAP storage operating system. It supports NFS (Linux), SMB (Windows), and iSCSI (block storage) protocols from a single file system. Enterprise features like data tiering, snapshots, clones, compression, deduplication, and SnapMirror replication are all available.",
    whenToUse:
      "Use when migrating on-premises NetApp ONTAP workloads to AWS and you want to retain the same storage OS and tooling. Also use when a single file system needs to serve both Linux (NFS) and Windows (SMB) clients simultaneously, or when you need enterprise storage features like SnapMirror cross-region replication.",
    keyFacts: [
      "Supports NFS, SMB, and iSCSI protocols simultaneously from one file system",
      "Includes NetApp ONTAP enterprise features: snapshots, FlexClone (instant zero-copy clones), data deduplication, compression",
      "Storage tiering automatically moves cold data to a lower-cost S3 storage tier",
      "SnapMirror replication lets you replicate data to another FSx for ONTAP file system in a different region for DR",
      "Deployed in Multi-AZ or Single-AZ configurations",
    ],
    examTraps: [
      "Trap: FSx for Windows File Server and FSx for NetApp ONTAP are interchangeable for multi-protocol workloads. Reality: FSx for Windows supports SMB only. FSx for ONTAP supports NFS + SMB + iSCSI from one system — it's the choice when you need multi-protocol access or NetApp-specific features.",
    ],
    relatedServices: ["EFS", "FSx for Windows", "FSx-Lustre", "S3", "DataSync"],
  },

  {
    id: "fsx-openzfs",
    name: "Amazon FSx for OpenZFS",
    shortName: "FSx for OpenZFS",
    abbr: "FSx-OpenZFS",
    category: "storage",
    domains: [2, 3],
    tagline: "A fully managed ZFS file system on AWS with sub-millisecond latency, snapshots, and instant clones.",
    whatItDoes:
      "Amazon FSx for OpenZFS provides a managed file system built on the open-source OpenZFS file system. It delivers sub-millisecond latency and up to 12.5 GB/s throughput. It includes ZFS native features such as point-in-time snapshots, instant zero-copy clones (useful for dev/test copies of production data), data compression, and NFS access.",
    whenToUse:
      "Use when migrating on-premises ZFS or Linux-based NFS workloads to AWS, or when you need fast NFS-accessible storage with instant cloning capabilities — for example, creating rapid developer copies of a large production dataset without duplicating the data.",
    keyFacts: [
      "Sub-millisecond read latency; up to 12.5 GB/s throughput",
      "Instant zero-copy clones: create a writable clone of any snapshot in seconds, with no data duplication until writes occur",
      "Supports NFS v3, v4, v4.1, and v4.2 protocols — Linux-only (no SMB support)",
      "Data compression reduces storage consumption automatically",
      "Up to 1 million IOPS on NVMe-backed configurations",
    ],
    examTraps: [
      "Trap: FSx for OpenZFS and Amazon EFS are equivalent for Linux NFS storage. Reality: EFS is fully elastic and scales automatically to petabytes. FSx for OpenZFS offers much higher IOPS and throughput for latency-sensitive workloads but requires you to provision capacity up front.",
    ],
    relatedServices: ["EFS", "FSx for ONTAP", "FSx-Lustre", "EC2"],
  },

  {
    id: "snow-family",
    name: "AWS Snow Family",
    shortName: "Snow Family",
    abbr: "SnowFamily",
    category: "storage",
    domains: [1, 4],
    tagline: "Physical devices AWS ships to you for moving large amounts of data to AWS when the network is too slow or unavailable.",
    whatItDoes:
      "AWS Snow Family is a collection of physical edge computing and offline data transfer devices. Snowcone (8 TB) is the smallest and can be shipped or used with DataSync. Snowball Edge (up to 80 TB storage, 40+ vCPUs) is mid-range and can run EC2 instances and Lambda locally. Snowmobile is a 100 PB shipping container on a truck for truly massive migrations.",
    whenToUse:
      "Use when transferring large data sets over the network would take too long (more than a week) or is impractical due to bandwidth cost or network limitations. Also use Snowball Edge at remote or disconnected sites that need local compute (military, oil rigs, factory floors) where internet is unreliable.",
    keyFacts: [
      "Snowcone: 8 TB HDD or 14 TB SSD, smallest device, can use AWS DataSync to send data back over the internet",
      "Snowball Edge Storage Optimized: 80 TB usable, 40 vCPU, 80 GB RAM",
      "Snowball Edge Compute Optimized: 28 TB NVMe SSD, 52 vCPU, 208 GB RAM — for edge compute needs",
      "Snowmobile: 100 PB capacity, physically delivered as a shipping container on a truck",
      "All devices use 256-bit encryption with keys managed by AWS KMS; encryption is automatic",
      "Typical turnaround time: ship device → load data → ship back → AWS ingests → data in S3",
    ],
    examTraps: [
      "Trap: Snowball Edge is only for data transfer — it cannot run compute workloads. Reality: Snowball Edge runs EC2 instances and Lambda functions locally at the edge, making it suitable for processing data at remote sites with no reliable internet connection.",
    ],
    relatedServices: ["S3", "KMS", "DataSync", "Storage Gateway"],
  },

  // ─── DATABASE (NEW) ─────────────────────────────────────────────────────────

  {
    id: "keyspaces",
    name: "Amazon Keyspaces (for Apache Cassandra)",
    shortName: "Amazon Keyspaces",
    abbr: "Keyspaces",
    category: "database",
    domains: [2, 3],
    tagline: "A serverless, managed database compatible with Apache Cassandra — no Cassandra clusters to operate.",
    whatItDoes:
      "Amazon Keyspaces is a fully managed, serverless database service compatible with the Apache Cassandra Query Language (CQL). You can run existing Cassandra workloads on AWS without operating or scaling Cassandra clusters. Keyspaces automatically scales table throughput and storage up and down based on application traffic.",
    whenToUse:
      "Use when you need a Cassandra-compatible database without the operational overhead of running Cassandra clusters yourself. Good for high-velocity, wide-column data storage such as IoT telemetry, time-series-like data, and user profile storage where you already use Cassandra CQL.",
    keyFacts: [
      "Fully compatible with Cassandra Query Language (CQL) API version 3.11",
      "Serverless — no clusters to provision, patch, or rebalance; capacity scales automatically",
      "Single-digit millisecond read/write latency at any scale",
      "Data is replicated 3 times across 3 Availability Zones within a region automatically",
      "Supports both on-demand and provisioned capacity modes, similar to DynamoDB",
    ],
    examTraps: [
      "Trap: DynamoDB and Amazon Keyspaces are interchangeable — just pick either for NoSQL. Reality: Keyspaces is specifically for teams already using Apache Cassandra CQL. DynamoDB uses its own API. If the question mentions migrating Cassandra workloads, Keyspaces is the answer.",
    ],
    relatedServices: ["DynamoDB", "Aurora", "Timestream", "Glue"],
  },

  {
    id: "timestream",
    name: "Amazon Timestream",
    shortName: "Amazon Timestream",
    abbr: "Timestream",
    category: "database",
    domains: [3, 4],
    tagline: "A serverless time-series database purpose-built for storing and analyzing metrics that change over time.",
    whatItDoes:
      "Amazon Timestream is a fully managed, serverless time-series database designed for storing trillions of time-stamped data points efficiently. It automatically tiers recent data into memory for fast queries and moves older data to a cost-optimized magnetic store. Timestream uses a SQL-like query language with built-in time-series functions for smoothing, interpolation, and approximation.",
    whenToUse:
      "Use for IoT sensor data, application performance metrics, DevOps telemetry, industrial monitoring, and any use case where data is inherently a series of values over time. Much cheaper and faster than storing time-series data in a relational database.",
    keyFacts: [
      "Automatically moves data from a fast in-memory store (recent data) to a cost-optimized magnetic store (older data) based on configurable retention policies",
      "Serverless — scales automatically; no servers, shards, or clusters to manage",
      "Built-in time-series analytics functions: time_series(), interpolate(), smooth(), and more",
      "Integrates with Amazon Grafana, Amazon QuickSight, and Apache Kafka for visualization and ingestion",
      "Can query data across both the in-memory and magnetic stores in a single query transparently",
    ],
    examTraps: [
      "Trap: Store IoT sensor readings in DynamoDB because it has low latency. Reality: DynamoDB can store time-series data, but Timestream is purpose-built for it — it costs less per data point, compresses time-series data more efficiently, and provides native time-series query functions.",
    ],
    relatedServices: ["Keyspaces", "DynamoDB", "Kinesis Data Streams", "IoT Core", "QuickSight"],
  },

  {
    id: "dms",
    name: "AWS Database Migration Service (AWS DMS)",
    shortName: "AWS DMS",
    abbr: "DMS",
    category: "database",
    domains: [2, 3],
    tagline: "Migrate databases to AWS with minimal downtime by replicating data continuously during the move.",
    whatItDoes:
      "AWS Database Migration Service migrates databases to AWS quickly and with minimal downtime. A replication instance (an EC2-based server managed by AWS) reads from the source database and writes to the target. For ongoing migrations, DMS uses Change Data Capture (CDC) to replicate ongoing transactions so the source database can stay live while you migrate.",
    whenToUse:
      "Use to migrate databases to AWS with minimal downtime — for example, moving an on-premises Oracle database to Amazon Aurora PostgreSQL. Use the AWS Schema Conversion Tool (SCT) alongside DMS for heterogeneous migrations (different database engines) to convert stored procedures and schema.",
    keyFacts: [
      "Supports homogeneous migrations (Oracle → Oracle, MySQL → RDS MySQL) and heterogeneous migrations (Oracle → Aurora PostgreSQL, SQL Server → MySQL)",
      "Replication instance is an EC2-based server; you choose the instance size based on data volume and workload",
      "Full load + CDC mode: migrates existing data then continuously replicates changes, keeping source and target in sync until cutover",
      "AWS Schema Conversion Tool (SCT) converts database schema and stored procedures between different engine types — required for heterogeneous migrations",
      "Supports migration to RDS, Aurora, Redshift, DynamoDB, S3, OpenSearch, and more",
    ],
    examTraps: [
      "Trap: You need to take the source database offline before migrating with DMS. Reality: DMS supports live migration using Change Data Capture (CDC) — the source database stays online and continues serving traffic during the migration. Downtime only occurs at the final cutover moment.",
    ],
    relatedServices: ["RDS", "Aurora", "Redshift", "Schema Conversion Tool", "Direct Connect"],
  },

  {
    id: "dax",
    name: "Amazon DynamoDB Accelerator (Amazon DAX)",
    shortName: "Amazon DAX",
    abbr: "DAX",
    category: "database",
    domains: [1, 3],
    tagline: "An in-memory cache that sits in front of DynamoDB and reduces read latency from milliseconds to microseconds.",
    whatItDoes:
      "Amazon DynamoDB Accelerator (DAX) is a fully managed, highly available in-memory cache for DynamoDB. It is API-compatible with DynamoDB — your application points to the DAX cluster endpoint instead of DynamoDB directly, with no code changes beyond the connection string. DAX handles cache population and invalidation automatically.",
    whenToUse:
      "Use when DynamoDB reads are a bottleneck and you need microsecond latency instead of single-digit milliseconds — for example, a leaderboard read by millions of users simultaneously, or a heavily read product catalog. Not useful for write-heavy workloads.",
    keyFacts: [
      "Delivers microsecond read latency for cached data (vs. single-digit millisecond for standard DynamoDB reads)",
      "Minimum production cluster size: 3 nodes (for Multi-AZ high availability)",
      "DAX does NOT cache strongly consistent reads — if your application requests a strongly consistent read, DAX bypasses the cache and goes directly to DynamoDB",
      "API-compatible: swap the DynamoDB SDK endpoint for the DAX cluster endpoint with minimal code changes",
      "DAX operates inside your VPC; it is not a public service",
    ],
    examTraps: [
      "Trap: DAX caches all DynamoDB reads, including strongly consistent reads. Reality: Strongly consistent reads bypass the DAX cache entirely and go straight to DynamoDB. DAX only accelerates eventually consistent reads.",
    ],
    relatedServices: ["DynamoDB", "ElastiCache", "VPC", "Lambda"],
  },

  {
    id: "elasticache-serverless",
    name: "Amazon ElastiCache Serverless",
    shortName: "ElastiCache Serverless",
    abbr: "ElastiCache-SL",
    category: "database",
    domains: [3, 4],
    tagline: "An auto-scaling cache that requires zero cluster configuration — just create it and connect.",
    whatItDoes:
      "Amazon ElastiCache Serverless is a serverless option for ElastiCache that automatically scales cache capacity up and down based on application demand. Unlike traditional ElastiCache, which requires you to choose cluster sizes and shard counts, Serverless handles all of that invisibly. It is compatible with both Redis and Memcached clients.",
    whenToUse:
      "Use when you want the performance benefits of an in-memory cache without the operational work of sizing, sharding, and managing a cache cluster. Good for applications with unpredictable or variable traffic patterns where you want to avoid over-provisioning.",
    keyFacts: [
      "No cluster configuration required — scales automatically as demand changes",
      "Compatible with Redis OSS and Valkey (Redis fork) and Memcached protocols",
      "Pricing is based on ElastiCache Processing Units (ECPUs) consumed and data stored — no charge for idle capacity",
      "Supports Multi-AZ replication for high availability automatically",
      "Single-digit millisecond latency for cached reads, same as traditional ElastiCache",
    ],
    examTraps: [
      "Trap: ElastiCache Serverless has no minimum capacity or cost. Reality: There is a minimum data storage charge even for near-empty caches, so for very low and predictable workloads a provisioned cluster may be cheaper. Serverless shines for variable or unpredictable workloads.",
    ],
    relatedServices: ["ElastiCache", "DAX", "DynamoDB", "RDS", "Lambda"],
  },

  // ─── NETWORKING (NEW) ───────────────────────────────────────────────────────

  {
    id: "network-firewall",
    name: "AWS Network Firewall",
    shortName: "Network Firewall",
    abbr: "NetworkFirewall",
    category: "networking",
    domains: [1, 2],
    tagline: "A managed stateful firewall for your VPC that can inspect and filter traffic at Layer 3, Layer 4, and Layer 7.",
    whatItDoes:
      "AWS Network Firewall is a managed network firewall service that you deploy into your VPC subnets. It provides stateless packet filtering (allow/block by IP, port, protocol), stateful connection tracking, and application-layer (Layer 7) intrusion detection and prevention using Suricata-compatible IDS/IPS rules. Traffic must be routed through the firewall endpoints for inspection.",
    whenToUse:
      "Use when you need deeper network-level traffic inspection inside or between VPCs beyond what Security Groups and NACLs provide — for example, blocking known malicious IP addresses, detecting port scans, filtering outbound traffic to prevent data exfiltration, or enforcing domain-based filtering.",
    keyFacts: [
      "Supports stateless rules (IP/port/protocol, fast but no connection tracking) and stateful rules (connection-aware, supports application protocols)",
      "Suricata-compatible IDS/IPS rules: you can import community rule sets or write your own Suricata rules for threat detection and prevention",
      "Deployed per Availability Zone — one firewall endpoint per AZ for high availability",
      "Logs can be sent to S3, CloudWatch Logs, or Kinesis Data Firehose",
      "Managed threat intelligence rule groups available through AWS and third-party Marketplace vendors",
    ],
    examTraps: [
      "Trap: AWS WAF and AWS Network Firewall do the same job — just pick either one. Reality: WAF operates at Layer 7 for HTTP/HTTPS traffic only, protecting web applications. Network Firewall operates at Layers 3, 4, and 7 for all protocols and can inspect non-HTTP traffic using Suricata IDS/IPS rules.",
    ],
    relatedServices: ["WAF", "Security Groups", "NACLs", "Transit Gateway", "Firewall Manager"],
  },

  {
    id: "firewall-manager",
    name: "AWS Firewall Manager",
    shortName: "Firewall Manager",
    abbr: "FirewallManager",
    category: "networking",
    domains: [1],
    tagline: "Centrally apply and enforce WAF, Security Group, and Network Firewall policies across all accounts in your AWS Organization.",
    whatItDoes:
      "AWS Firewall Manager is a security management service for AWS Organizations. It lets you centrally create and enforce firewall rules — WAF Web ACLs, Security Group policies, Network Firewall policies, Shield Advanced protections, and Route 53 Resolver DNS Firewall rules — across all accounts and resources in your organization from a single administrator account.",
    whenToUse:
      "Use in multi-account AWS Organizations environments to ensure consistent security policies across all accounts — for example, mandating that all ALBs have a WAF Web ACL, or enforcing that all EC2 instances in every account use a specific Security Group baseline. Eliminates the need to configure policies account by account.",
    keyFacts: [
      "Requires AWS Organizations and an designated Firewall Manager administrator account",
      "Automatically applies policies to new accounts and resources as they are added to the organization",
      "Supports WAF rules, Security Group policies, Network Firewall policies, Shield Advanced, and Route 53 DNS Firewall",
      "Provides a compliance dashboard showing which accounts/resources are non-compliant with each policy",
      "No charge for Firewall Manager itself, but you pay for the underlying resources (WAF Web ACLs, etc.) it creates",
    ],
    examTraps: [
      "Trap: AWS Config and Firewall Manager both enforce security policies. Reality: Config detects and reports non-compliance (detective). Firewall Manager actively deploys and enforces security policies across accounts (preventive). Config tells you what's wrong; Firewall Manager prevents it from being wrong.",
    ],
    relatedServices: ["WAF", "Network Firewall", "Shield", "Organizations", "Security Groups"],
  },

  {
    id: "nat-gateway",
    name: "NAT Gateway",
    shortName: "NAT Gateway",
    abbr: "NATGateway",
    category: "networking",
    domains: [1, 2, 3],
    tagline: "Let EC2 instances in private subnets reach the internet (for software updates, API calls) without being reachable from the internet.",
    whatItDoes:
      "A NAT Gateway is a managed network address translation service. EC2 instances in private subnets send outbound internet traffic to the NAT Gateway (which lives in a public subnet), and the NAT Gateway forwards it to the internet using its own Elastic IP address. Return traffic comes back to the NAT Gateway and is forwarded to the originating instance. Inbound connections from the internet are not allowed.",
    whenToUse:
      "Use whenever private subnet instances need to make outbound internet connections — to download OS patches, call external APIs, reach AWS public endpoints (without VPC endpoints), or pull container images from the internet. Place a NAT Gateway in each Availability Zone's public subnet for high availability.",
    keyFacts: [
      "Deployed per Availability Zone in a public subnet — for high availability, deploy one per AZ",
      "Managed by AWS — scales automatically up to 100 Gbps per NAT Gateway",
      "Charged per hour the NAT Gateway exists plus per GB of data processed — not free",
      "NAT Instances (EC2-based, older approach) require you to manage the instance; NAT Gateway is fully managed and preferred",
      "For lowest cost, use VPC Gateway Endpoints for S3 and DynamoDB (free) instead of routing that traffic through NAT Gateway",
    ],
    examTraps: [
      "Trap: NAT Gateway and Internet Gateway do the same thing — you only need one. Reality: Internet Gateway enables two-way communication between a VPC and the internet. NAT Gateway only enables outbound-initiated connections from private subnets. They serve different purposes and are often both present in an architecture.",
    ],
    relatedServices: ["Internet Gateway", "VPC", "Elastic IP", "Route Table", "VPC Endpoints"],
  },

  {
    id: "internet-gateway",
    name: "Internet Gateway",
    shortName: "Internet Gateway",
    abbr: "IGW",
    category: "networking",
    domains: [1, 2, 3],
    tagline: "The free gateway that connects your VPC to the public internet, enabling two-way traffic for public subnets.",
    whatItDoes:
      "An Internet Gateway is a horizontally scaled, redundant, and highly available VPC component that allows two-way communication between instances in a VPC and the public internet. You attach one Internet Gateway to a VPC and add a route in a subnet's route table pointing 0.0.0.0/0 to the IGW — that subnet becomes a public subnet. Instances in public subnets need an Elastic IP or public IP to be reachable from the internet.",
    whenToUse:
      "Use in any VPC that needs resources (load balancers, bastion hosts, NAT Gateways) accessible from or able to initiate connections to the public internet. One Internet Gateway per VPC is the standard architecture — it is free and scales automatically.",
    keyFacts: [
      "Free — no hourly charge, no data processing fee",
      "One Internet Gateway per VPC; it is attached to the VPC, not to individual subnets",
      "Only makes a subnet 'public' when a route to the IGW (0.0.0.0/0 → igw-xxxx) is added to the subnet's route table",
      "Performs NAT for instances with public IPv4 addresses (translates between their private and public IP)",
      "Does NOT support IPv6 NAT — IPv6 addresses are globally routable, so no NAT is needed for IPv6",
    ],
    examTraps: [
      "Trap: Attaching an Internet Gateway to a VPC automatically makes all subnets public. Reality: A subnet is public only when its route table has a route to the Internet Gateway. Attaching the IGW alone does nothing without the route table entry.",
    ],
    relatedServices: ["NAT Gateway", "VPC", "Route Table", "Elastic IP", "Security Groups"],
  },

  {
    id: "vpg",
    name: "Virtual Private Gateway",
    shortName: "Virtual Private Gateway",
    abbr: "VPG",
    category: "networking",
    domains: [1, 2],
    tagline: "The AWS-side endpoint for a Site-to-Site VPN connection between your on-premises network and a VPC.",
    whatItDoes:
      "A Virtual Private Gateway (VGW) is the AWS endpoint of an AWS Site-to-Site VPN connection. You attach a VGW to your VPC and create a VPN connection between the VGW and a Customer Gateway (your on-premises VPN device). The VPN tunnel encrypts traffic between your data center and the VPC over the public internet.",
    whenToUse:
      "Use to establish an encrypted VPN connection between an on-premises network and a VPC. This is the fastest way to start a hybrid connection — provisioning takes minutes, unlike Direct Connect which takes weeks. Often used as a backup to Direct Connect for redundancy.",
    keyFacts: [
      "Each VPN connection has two IPSec tunnels for redundancy (one per Availability Zone on the AWS side)",
      "Maximum throughput per VPN connection: approximately 1.25 Gbps (limited by the VPN endpoint, not the internet link)",
      "VPN traffic goes over the public internet (encrypted) — unlike Direct Connect, which uses dedicated private fiber",
      "Can be used with Direct Connect as an encrypted overlay for compliance requirements (Direct Connect + VPN)",
      "For connecting multiple VPCs via VPN at scale, attach VPN connections to Transit Gateway instead of individual VGWs",
    ],
    examTraps: [
      "Trap: Direct Connect and Site-to-Site VPN provide the same connectivity and performance. Reality: Direct Connect offers dedicated bandwidth, consistent latency, and private connectivity. VPN runs over the public internet and has variable latency. Direct Connect is preferred for production workloads; VPN for backup or quick setup.",
    ],
    relatedServices: ["Direct Connect", "Transit Gateway", "VPC", "Customer Gateway"],
  },

  {
    id: "vpc-lattice",
    name: "Amazon VPC Lattice",
    shortName: "VPC Lattice",
    abbr: "VPCLattice",
    category: "networking",
    domains: [1, 2, 3],
    tagline: "Application-level networking that lets services in different VPCs and accounts communicate securely without complex VPC peering.",
    whatItDoes:
      "Amazon VPC Lattice is an application networking service that simplifies service-to-service communication across VPCs and AWS accounts. You define services (backed by EC2, Lambda, ECS, or Kubernetes pods) in a service network, configure access policies, and VPC Lattice handles load balancing, health checks, authentication, and authorization — regardless of where the services live.",
    whenToUse:
      "Use in microservices architectures spread across multiple VPCs or accounts where traditional VPC peering or Transit Gateway becomes complex to manage. VPC Lattice provides a consistent way to discover, connect to, and secure service-to-service communication without managing IP routing.",
    keyFacts: [
      "Connects services across VPCs and accounts without requiring VPC peering or IP address management",
      "Supports HTTP/HTTPS and gRPC traffic; provides built-in load balancing and health checks",
      "Auth policies control which services can call other services using IAM-based authorization",
      "Services can be backed by EC2 Auto Scaling Groups, Lambda functions, ECS services, Kubernetes pods, or IP addresses",
      "Integrates with AWS Resource Access Manager (RAM) for cross-account service sharing",
    ],
    examTraps: [
      "Trap: Use Transit Gateway for service-to-service communication between VPCs. Reality: Transit Gateway solves network-level (IP routing) connectivity. VPC Lattice works at the application level (HTTP/gRPC), providing service discovery, authentication, and load balancing that Transit Gateway does not offer.",
    ],
    relatedServices: ["Transit Gateway", "API Gateway", "ALB", "ECS", "Lambda", "RAM"],
  },

  // ─── SECURITY (NEW) ─────────────────────────────────────────────────────────

  {
    id: "detective",
    name: "Amazon Detective",
    shortName: "Amazon Detective",
    abbr: "Detective",
    category: "security",
    domains: [1],
    tagline: "Investigate and visualize the root cause of security findings using ML-powered graph analysis of your AWS logs.",
    whatItDoes:
      "Amazon Detective automatically collects log data from AWS CloudTrail, Amazon VPC Flow Logs, Amazon GuardDuty findings, and AWS Organizations, then uses machine learning and graph analysis to build an interactive behavior graph. Security teams use Detective to investigate security incidents — tracing the chain of events, understanding the scope of a compromise, and identifying the root cause.",
    whenToUse:
      "Use when you receive a GuardDuty finding and need to investigate further — who triggered the finding, what IP addresses were involved, which resources were accessed, and what happened before and after the finding. Detective replaces hours of manual log correlation with interactive graph visualizations.",
    keyFacts: [
      "Uses ML and graph analysis on CloudTrail events, VPC Flow Logs, and GuardDuty findings to build a behavior graph",
      "READ-ONLY investigation tool — Amazon Detective cannot block threats, quarantine resources, or take any remediation action",
      "Automatically retains up to 1 year of aggregated log data for investigation",
      "Multi-account support: a designated administrator account can investigate findings across all member accounts",
      "Works alongside GuardDuty (detection) — GuardDuty surfaces threats; Detective helps you understand them",
    ],
    examTraps: [
      "Trap: Amazon Detective can block threats detected by GuardDuty. Reality: Detective is an investigation-only, read-only service. It helps you understand what happened — it cannot block traffic, quarantine instances, or prevent future attacks. Use WAF, Security Groups, or Lambda-based automated remediation for blocking.",
    ],
    relatedServices: ["GuardDuty", "CloudTrail", "SecurityHub", "Macie", "Inspector"],
  },

  {
    id: "iam-access-analyzer",
    name: "AWS IAM Access Analyzer",
    shortName: "IAM Access Analyzer",
    abbr: "AccessAnalyzer",
    category: "security",
    domains: [1],
    tagline: "Find out which of your AWS resources are accessible from outside your account or organization, and validate IAM policies before deploying.",
    whatItDoes:
      "AWS IAM Access Analyzer continuously analyzes resource-based policies (on S3 buckets, KMS keys, IAM roles, Lambda functions, SQS queues, Secrets Manager secrets, and more) to identify resources shared with external principals — principals outside your zone of trust. It also validates IAM policies for syntax errors, best-practice violations, and unused access.",
    whenToUse:
      "Use to audit whether any AWS resources are unintentionally exposed to external accounts or the public, and to validate IAM policies before deploying them. Especially important in multi-account organizations to detect accidental cross-account sharing.",
    keyFacts: [
      "Zone of trust can be set to a single AWS account or an entire AWS Organization",
      "Generates findings for any resource accessible by principals outside the zone of trust",
      "Policy validation checks IAM and resource-based policies for syntax errors, security warnings, and best-practice suggestions",
      "Unused access analyzer (added 2024): identifies IAM users and roles with permissions that have never been used, helping enforce least privilege",
      "Access preview: simulate what access a proposed policy change would grant before applying it",
    ],
    examTraps: [
      "Trap: IAM Access Analyzer prevents external access to your resources. Reality: Access Analyzer is a detective control — it identifies and reports unintended external access but does not block it. You must act on the findings manually or through automated remediation.",
    ],
    relatedServices: ["IAM", "S3", "KMS", "Lambda", "SecretsManager", "Organizations"],
  },

  {
    id: "acm-private-ca",
    name: "AWS Private Certificate Authority",
    shortName: "AWS Private CA",
    abbr: "ACM-PCA",
    category: "security",
    domains: [1],
    tagline: "Run your own private certificate authority on AWS to issue TLS certificates for internal services without buying from a public CA.",
    whatItDoes:
      "AWS Private Certificate Authority (formerly ACM Private CA) is a managed private CA service. You create a root or subordinate certificate authority, and it issues private X.509 TLS certificates for internal use — microservices, IoT devices, VPN clients, or any internal application that needs mutual TLS (mTLS) or encryption. The certificates are trusted only by systems that trust your private CA, not by public browsers.",
    whenToUse:
      "Use when you need to issue certificates for internal services, devices, or users that don't need to be publicly trusted. Common for securing service-to-service communication with mTLS in microservices, issuing certificates to IoT devices, and encrypting internal corporate applications.",
    keyFacts: [
      "Issues private certificates — not trusted by public browsers, only by systems configured to trust your CA",
      "Works with AWS Certificate Manager (ACM) for managed certificate deployment to ALB, CloudFront, API Gateway",
      "Charges per CA per month ($400/month for a root CA) plus per certificate issued",
      "Supports ECDSA and RSA key algorithms; certificate validity period configurable",
      "Integrates with AWS IoT Core, Amazon EKS (for in-cluster TLS), and Amazon API Gateway",
    ],
    examTraps: [
      "Trap: Use AWS Certificate Manager (ACM) public certificates for internal microservice mTLS. Reality: ACM public certificates are issued by a public CA and are designed for external-facing HTTPS. For internal mTLS between microservices, you need AWS Private CA to issue certificates trusted only within your environment.",
    ],
    relatedServices: ["ACM", "ALB", "API Gateway", "IoT Core", "EKS"],
  },

  {
    id: "audit-manager",
    name: "AWS Audit Manager",
    shortName: "Audit Manager",
    abbr: "AuditManager",
    category: "security",
    domains: [1],
    tagline: "Automate evidence collection for compliance audits (PCI-DSS, HIPAA, SOC 2) by continuously gathering data from your AWS environment.",
    whatItDoes:
      "AWS Audit Manager continuously collects evidence from your AWS environment to help you prepare for compliance audits. It maps your AWS resource configurations and activity to compliance frameworks (PCI-DSS, HIPAA, SOC 2, GDPR, FedRAMP, and more) and produces audit-ready reports. Instead of manually gathering screenshots and logs before an audit, Audit Manager does it continuously.",
    whenToUse:
      "Use when you need to demonstrate compliance with regulatory frameworks and want to reduce the manual effort of gathering evidence before an audit. Especially valuable for organizations subject to regular audits where evidence collection is a recurring burden.",
    keyFacts: [
      "Pre-built frameworks for PCI-DSS, HIPAA, SOC 2, ISO 27001, GDPR, FedRAMP, NIST, and more",
      "Collects evidence automatically from AWS Config, CloudTrail, Security Hub, and AWS API calls",
      "Custom frameworks: create your own control library and evidence sources for internal policies",
      "Evidence repository: stores all collected evidence for audit review, with delegation to control owners",
      "Works alongside AWS Config (which tracks configuration changes) and Security Hub (which aggregates findings)",
    ],
    examTraps: [
      "Trap: AWS Config and Audit Manager serve the same purpose for compliance. Reality: Config records resource configuration changes and checks compliance rules in real time. Audit Manager focuses on generating audit-ready evidence reports mapped to compliance frameworks. They complement each other.",
    ],
    relatedServices: ["Config", "CloudTrail", "SecurityHub", "Trusted Advisor"],
  },

  {
    id: "directory-service",
    name: "AWS Directory Service",
    shortName: "Directory Service",
    abbr: "DirectoryService",
    category: "security",
    domains: [1, 2],
    tagline: "Run Microsoft Active Directory on AWS (or connect to your existing AD) so AWS services and Windows workloads can use AD authentication.",
    whatItDoes:
      "AWS Directory Service provides managed Microsoft Active Directory options on AWS. AWS Managed Microsoft AD is a fully functional Microsoft AD (hosted on Windows Server) managed by AWS, suitable for production workloads. AD Connector is a proxy that redirects authentication requests to your existing on-premises AD without caching any data. Simple AD is a low-cost, Samba-based AD-compatible directory for basic use cases.",
    whenToUse:
      "Use AWS Managed Microsoft AD when you need a full Active Directory in AWS for domain-joining EC2 instances, FSx for Windows, Amazon WorkSpaces, and AWS SSO. Use AD Connector when you want to keep your existing on-premises AD as the identity source and just proxy AWS authentication to it.",
    keyFacts: [
      "AWS Managed Microsoft AD: real Microsoft AD on Windows Server, Multi-AZ, supports trusts with on-premises AD",
      "AD Connector: proxy only — redirects authentication to on-premises AD, no directory data stored in AWS, requires Direct Connect or VPN",
      "Simple AD: Samba-based, supports basic LDAP and Kerberos, limited functionality, lower cost — not for complex AD workloads",
      "Works with Amazon WorkSpaces, Amazon WorkDocs, Amazon RDS for SQL Server, FSx for Windows, and IAM Identity Center",
      "Trust relationships between AWS Managed Microsoft AD and on-premises AD allow single sign-on across hybrid environments",
    ],
    examTraps: [
      "Trap: AD Connector stores a copy of your Active Directory in AWS. Reality: AD Connector is a pure proxy — it stores no directory data in AWS. All authentication requests are forwarded to your on-premises AD. If the on-premises AD or the network link is unavailable, authentication fails.",
    ],
    relatedServices: ["FSx for Windows", "WorkSpaces", "IAM", "Direct Connect", "VPN"],
  },

  {
    id: "verified-access",
    name: "AWS Verified Access",
    shortName: "Verified Access",
    abbr: "VerifiedAccess",
    category: "security",
    domains: [1],
    tagline: "Give employees secure access to internal applications without a VPN, using identity and device trust signals.",
    whatItDoes:
      "AWS Verified Access implements a zero-trust network access model for internal corporate applications. Instead of requiring employees to connect to a VPN before accessing internal web apps, Verified Access evaluates trust signals in real time — identity (from an identity provider like Okta, Azure AD, or IAM Identity Center) and device posture (from AWS Verified Access or third-party device management tools) — and grants or denies access to each individual request.",
    whenToUse:
      "Use to replace or reduce VPN usage for internal web application access. Provides more granular, per-request authorization than a VPN (which grants broad network access once connected) and makes it easier for employees to access applications from any device or location.",
    keyFacts: [
      "Zero-trust model: every request is evaluated individually against identity and device trust policies",
      "Integrates with any OIDC-compatible identity provider (Okta, Azure AD, Google Workspace, IAM Identity Center)",
      "Device trust: can integrate with AWS Verified Access device trust providers or third-party tools like Jamf, Carbon Black",
      "No VPN client required — employees access apps through a browser using their identity provider login",
      "Access logs are sent to S3, CloudWatch Logs, or Kinesis Data Firehose for auditing",
    ],
    examTraps: [
      "Trap: Verified Access replaces Direct Connect or Site-to-Site VPN for all hybrid connectivity needs. Reality: Verified Access replaces VPN only for user-to-application access to internal web apps. It does not replace network-level hybrid connectivity between data centers and VPCs (that is the role of Direct Connect and Site-to-Site VPN).",
    ],
    relatedServices: ["IAM Identity Center", "WAF", "ALB", "CloudTrail", "Organizations"],
  },

  {
    id: "cognito",
    name: "Amazon Cognito",
    shortName: "Amazon Cognito",
    abbr: "Cognito",
    category: "security",
    domains: [1, 2],
    tagline: "Add user sign-up, sign-in, and access control to your web and mobile apps in minutes.",
    whatItDoes:
      "Amazon Cognito provides two services: User Pools and Identity Pools. User Pools are managed user directories — they handle user registration, authentication (username/password, MFA, OAuth 2.0/OIDC federated login via Google, Facebook, SAML), and return JWT tokens. Identity Pools (Federated Identities) exchange those tokens (or tokens from other identity providers) for temporary AWS credentials, allowing users to directly access AWS services like S3 or DynamoDB.",
    whenToUse:
      "Use Cognito User Pools when you need to add authentication (sign-up/sign-in) to a web or mobile application. Use Cognito Identity Pools when authenticated users need to call AWS services directly from the client (for example, a mobile app uploading to S3). Combine both for full auth + AWS resource access.",
    keyFacts: [
      "User Pools: user directory with sign-up, sign-in, MFA, social federation (Google, Facebook), SAML federation",
      "Identity Pools: exchange User Pool JWT tokens or social identity tokens for temporary IAM credentials",
      "Integrates natively with API Gateway and ALB for JWT token validation",
      "User Pool triggers: Lambda functions can customize authentication flows (pre-sign-up, post-confirmation, pre-token generation)",
      "Supports OAuth 2.0, OpenID Connect (OIDC), and SAML 2.0 standards",
    ],
    examTraps: [
      "Trap: Cognito User Pools and Identity Pools are the same thing. Reality: User Pools handle authentication (who are you?) and return JWTs. Identity Pools handle authorization to AWS resources (what AWS services can you access?) by issuing temporary IAM credentials. They are complementary but distinct.",
    ],
    relatedServices: ["IAM", "API Gateway", "ALB", "Lambda", "S3"],
  },

  // ─── INTEGRATION (NEW) ──────────────────────────────────────────────────────

  {
    id: "amazon-mq",
    name: "Amazon MQ",
    shortName: "Amazon MQ",
    abbr: "AmazonMQ",
    category: "integration",
    domains: [2, 3],
    tagline: "A managed message broker for Apache ActiveMQ and RabbitMQ — lift and shift on-premises messaging to AWS without rewriting applications.",
    whatItDoes:
      "Amazon MQ is a managed message broker service that supports Apache ActiveMQ and RabbitMQ. It lets you migrate existing applications that use standard messaging protocols (AMQP, MQTT, STOMP, OpenWire, WebSocket) to AWS without changing the messaging code. AWS manages broker provisioning, patching, and high availability.",
    whenToUse:
      "Use when you're migrating on-premises applications that already use ActiveMQ or RabbitMQ and want to move to AWS without rewriting the messaging layer. For new applications, prefer Amazon SQS (simpler, fully serverless, scales automatically) or Amazon SNS over Amazon MQ.",
    keyFacts: [
      "Supports Apache ActiveMQ and RabbitMQ broker engines",
      "Supports open standard messaging protocols: AMQP, MQTT, STOMP, OpenWire, WebSocket",
      "Deployed on managed EC2 instances (not truly serverless like SQS) — you choose an instance type",
      "High availability: Active/Standby broker pair in two Availability Zones with automatic failover",
      "Storage backed by Amazon EFS (for ActiveMQ) to ensure message durability across failover",
    ],
    examTraps: [
      "Trap: Amazon MQ and Amazon SQS are equivalent — use Amazon MQ for all messaging needs. Reality: SQS is serverless, scales to unlimited throughput, and is the preferred choice for new AWS-native applications. Amazon MQ is specifically for migrating existing applications that already depend on ActiveMQ or RabbitMQ protocols.",
    ],
    relatedServices: ["SQS", "SNS", "EventBridge", "EC2", "EFS"],
  },

  {
    id: "appsync",
    name: "AWS AppSync",
    shortName: "AWS AppSync",
    abbr: "AppSync",
    category: "integration",
    domains: [1, 3],
    tagline: "A managed GraphQL API service that connects your apps to data from multiple sources with real-time subscriptions.",
    whatItDoes:
      "AWS AppSync is a fully managed GraphQL API service. You define a GraphQL schema, and AppSync resolves queries and mutations against data sources — DynamoDB, Aurora Serverless, Lambda, OpenSearch, HTTP APIs, and more. AppSync also supports real-time data with GraphQL subscriptions (using WebSockets), so clients receive updates when data changes.",
    whenToUse:
      "Use when you want to build a GraphQL API that aggregates data from multiple backends, when your mobile or web app needs real-time updates (subscriptions), or when different clients need different subsets of the same data (a GraphQL strength over REST APIs).",
    keyFacts: [
      "Supports GraphQL queries (read), mutations (write), and subscriptions (real-time WebSocket push)",
      "Data sources: DynamoDB, Aurora Serverless, Lambda, OpenSearch, HTTP endpoints",
      "Resolvers use Apache VTL (Velocity Template Language) or JavaScript to map GraphQL operations to data source calls",
      "AWS WAF can be attached to AppSync to protect against malicious GraphQL queries",
      "Offline data sync: AppSync includes conflict resolution for mobile apps that need to work offline and sync later",
    ],
    examTraps: [
      "Trap: API Gateway and AppSync are interchangeable for all API needs. Reality: API Gateway is for REST and WebSocket APIs. AppSync is specifically for GraphQL APIs with real-time subscriptions and multi-source data aggregation. The exam will hint at GraphQL when AppSync is the answer.",
    ],
    relatedServices: ["API Gateway", "DynamoDB", "Lambda", "Cognito", "WAF"],
  },

  {
    id: "eventbridge-scheduler",
    name: "Amazon EventBridge Scheduler",
    shortName: "EventBridge Scheduler",
    abbr: "EBScheduler",
    category: "integration",
    domains: [2, 3, 4],
    tagline: "Schedule one-time or recurring invocations of Lambda, SQS, Step Functions, and other AWS targets without writing scheduler code.",
    whatItDoes:
      "Amazon EventBridge Scheduler is a standalone scheduling service. You create schedules using cron or rate expressions for recurring jobs, or a one-time timestamp for a future task. The scheduler invokes a target — Lambda, SQS, SNS, Step Functions, ECS, Kinesis, Firehose, and many other AWS services — at the specified time, handling retries and delivering at-least-once or exactly-once execution.",
    whenToUse:
      "Use for scheduled tasks that need to run at a specific time or on a regular interval — nightly data exports, batch job triggers, scheduled notifications, resource cleanup, and any 'run this at 2 AM every day' requirement. Replaces the need for EC2-based cron jobs or custom scheduler applications.",
    keyFacts: [
      "Supports cron expressions (schedule with year, month, day, hour, minute precision) and rate expressions (e.g., every 5 minutes)",
      "One-time schedules: invoke a target exactly once at a specified future date and time",
      "Flexible time window: allow the scheduler to invoke the target within a configurable window (e.g., within 15 minutes of the scheduled time) to smooth out traffic",
      "Supports over 270 AWS service targets natively",
      "Different from EventBridge rules (which trigger on event patterns from the event bus) — Scheduler is time-based only",
    ],
    examTraps: [
      "Trap: EventBridge Scheduler and EventBridge scheduled rules do exactly the same thing. Reality: EventBridge scheduled rules (on the default event bus) are limited and designed for simpler use cases. EventBridge Scheduler is a dedicated service with millions of schedules, flexible time windows, and one-time schedules — preferred for large-scale scheduling needs.",
    ],
    relatedServices: ["Lambda", "Step Functions", "SQS", "ECS", "EventBridge"],
  },

  {
    id: "step-functions",
    name: "AWS Step Functions",
    shortName: "Step Functions",
    abbr: "StepFunctions",
    category: "integration",
    domains: [1, 2, 3],
    tagline: "Visually orchestrate multi-step workflows across Lambda, ECS, Glue, and other services with built-in error handling and retry logic.",
    whatItDoes:
      "AWS Step Functions is a serverless workflow orchestration service. You define a state machine in Amazon States Language (ASL) — a JSON-based language — where each state is a task (calling Lambda, ECS, Glue, DynamoDB, etc.), a choice point, a parallel branch, a wait, or an error handler. Step Functions handles sequencing, retries, error handling, and long-running orchestrations automatically.",
    whenToUse:
      "Use when you need to coordinate multiple AWS services into a reliable workflow — order processing pipelines, ML model training pipelines, data ETL orchestration, microservice choreography, and human approval workflows. Replace ad hoc Lambda chains with explicit, visible state machines.",
    keyFacts: [
      "Standard Workflows: exactly-once execution semantics, up to 1 year duration, async and sync execution; ideal for long-running, auditable business processes",
      "Express Workflows: at-least-once execution semantics, up to 5 minutes duration, higher throughput and lower cost; ideal for high-volume, short-duration event processing",
      "Built-in error handling: Catch and Retry blocks at the state level to handle failures without custom code",
      "Integrations: optimized integrations with Lambda, ECS, DynamoDB, SNS, SQS, Glue, SageMaker, and 200+ other AWS services",
      "Visual Workflow Studio in the AWS Console for designing and debugging state machines graphically",
    ],
    examTraps: [
      "Trap: Express Workflows provide exactly-once execution like Standard Workflows. Reality: Express Workflows use at-least-once execution — a step may execute more than once on retries. Only Standard Workflows guarantee exactly-once execution. This matters for non-idempotent operations like financial transactions.",
    ],
    relatedServices: ["Lambda", "ECS", "Glue", "SageMaker", "EventBridge", "SQS"],
  },

  {
    id: "appflow",
    name: "Amazon AppFlow",
    shortName: "Amazon AppFlow",
    abbr: "AppFlow",
    category: "integration",
    domains: [3, 4],
    tagline: "Transfer data between SaaS applications (Salesforce, ServiceNow, Slack) and AWS services without writing integration code.",
    whatItDoes:
      "Amazon AppFlow is a fully managed data integration service. It moves data between SaaS applications (Salesforce, ServiceNow, Zendesk, Slack, Google Analytics, Marketo, and more) and AWS services (S3, Redshift, EventBridge) using pre-built connectors. You configure flows in the console to trigger on a schedule, an event, or on demand, and optionally apply data transformations (filtering, masking, mapping) in transit.",
    whenToUse:
      "Use when you need to sync or import data from SaaS tools into your AWS data lake or analytics pipeline — pulling Salesforce leads into Redshift for analysis, archiving ServiceNow tickets to S3, or sending Slack messages to EventBridge for routing. No custom integration code required.",
    keyFacts: [
      "Pre-built connectors for 50+ SaaS applications including Salesforce, ServiceNow, SAP, Google Analytics, Zendesk, Slack, and more",
      "Data is transferred and encrypted in transit using AWS PrivateLink when available (data does not traverse the public internet)",
      "Built-in data transformations: field mapping, filtering, masking PII fields, value concatenation",
      "Triggers: schedule-based, event-based (on data change in SaaS), or on-demand",
      "Destinations: Amazon S3, Amazon Redshift, Amazon EventBridge, Salesforce (bidirectional)",
    ],
    examTraps: [
      "Trap: Use AWS Glue to ingest data from Salesforce into Redshift. Reality: Glue ETL requires you to write code and manage connectors. AppFlow provides a no-code, pre-built Salesforce connector with built-in transformations and is the simpler choice for SaaS-to-AWS data movement.",
    ],
    relatedServices: ["S3", "Redshift", "EventBridge", "Glue", "DataSync"],
  },

  // ─── ANALYTICS (NEW) ────────────────────────────────────────────────────────

  {
    id: "quicksight",
    name: "Amazon QuickSight",
    shortName: "Amazon QuickSight",
    abbr: "QuickSight",
    category: "analytics",
    domains: [3, 4],
    tagline: "A serverless business intelligence tool for creating interactive dashboards and visualizations from your AWS data.",
    whatItDoes:
      "Amazon QuickSight is a fully managed cloud business intelligence (BI) service. You connect it to data sources — S3, Athena, Redshift, RDS, Aurora, Timestream, and more — and build interactive dashboards, charts, and reports. QuickSight uses SPICE (Super-fast Parallel In-memory Calculation Engine) to cache and query data at high speed. Dashboards can be embedded in applications or shared with users.",
    whenToUse:
      "Use to give business users self-service access to data visualizations and reports without running a separate BI server. Good for executive dashboards, operational reporting, ad hoc data exploration, and embedding analytics in customer-facing applications.",
    keyFacts: [
      "SPICE: QuickSight's in-memory calculation engine that caches imported data for fast query responses — queries SPICE instead of hitting the source database every time",
      "Per-user pricing: approximately $18/user/month for Reader access, $24/user/month for Author access (can create dashboards)",
      "Embedded analytics: dashboards can be embedded in web applications using the QuickSight Embedding API",
      "Machine learning insights: automatically detects anomalies and trends in your data (ML-powered narratives and forecasting)",
      "Connects to Athena, Redshift, RDS, Aurora, S3, Timestream, Salesforce, and third-party databases via JDBC",
    ],
    examTraps: [
      "Trap: Use Redshift as a BI visualization tool. Reality: Redshift is a data warehouse for running analytical SQL queries. QuickSight is the visualization and BI layer that sits on top of Redshift (or other sources) to display charts and dashboards to end users.",
    ],
    relatedServices: ["Athena", "Redshift", "S3", "Glue", "Timestream", "RDS"],
  },

  {
    id: "kinesis-video",
    name: "Amazon Kinesis Video Streams",
    shortName: "Kinesis Video Streams",
    abbr: "KVS",
    category: "analytics",
    domains: [3],
    tagline: "Securely ingest, store, and process video, audio, and other time-encoded media streams from cameras and devices.",
    whatItDoes:
      "Amazon Kinesis Video Streams makes it easy to securely stream video, audio, radar, and other time-encoded data from millions of connected devices to AWS for storage, playback, and real-time or batch processing. Producer SDKs handle the capture and ingestion; consumer applications (using Amazon Rekognition Video, custom ML models, or WebRTC) process the streams.",
    whenToUse:
      "Use for video surveillance systems, smart home camera streams, industrial IoT visual inspection, video analytics pipelines, and any application that needs to ingest and process continuous time-encoded media at scale.",
    keyFacts: [
      "Ingests video, audio, RADAR, LIDAR, and depth data streams",
      "Supports HTTP Live Streaming (HLS) and Dynamic Adaptive Streaming over HTTP (DASH) for playback",
      "WebRTC support for two-way, real-time media streaming (interactive video chat, video conferencing use cases)",
      "Integrated with Amazon Rekognition Video for real-time face detection, object identification, and content moderation on live streams",
      "Data is durably stored with configurable retention periods (hours to years)",
    ],
    examTraps: [
      "Trap: Amazon Kinesis Data Streams and Kinesis Video Streams are the same service for different data types. Reality: Kinesis Data Streams handles general-purpose records (logs, events, metrics). Kinesis Video Streams is purpose-built for time-encoded media with video-specific features like HLS playback, WebRTC, and Rekognition integration.",
    ],
    relatedServices: ["Rekognition", "Kinesis Data Streams", "S3", "Lambda"],
  },

  {
    id: "lake-formation",
    name: "AWS Lake Formation",
    shortName: "Lake Formation",
    abbr: "LakeFormation",
    category: "analytics",
    domains: [1, 3],
    tagline: "Build, secure, and manage a data lake on Amazon S3 with fine-grained column- and row-level access controls.",
    whatItDoes:
      "AWS Lake Formation simplifies building a secure data lake on Amazon S3. It builds on top of the AWS Glue Data Catalog and adds centralized fine-grained access control — down to individual columns and rows — for data in S3. You grant permissions to tables and columns in Lake Formation, and those permissions are enforced when Athena, Redshift Spectrum, or EMR queries the data.",
    whenToUse:
      "Use when you need centralized, fine-grained access control over your S3 data lake — for example, letting analysts query a table but only see non-PII columns, or restricting row-level access based on department. Also use to streamline the ingestion and cataloging of new data sources into the lake.",
    keyFacts: [
      "Fine-grained access control: grant or deny access to specific databases, tables, columns, and rows in the Glue Data Catalog",
      "Built on top of AWS Glue Data Catalog — Lake Formation adds permission management; Glue provides the metadata",
      "Cross-account data sharing: grant other AWS accounts or Organizations access to specific tables in your data lake",
      "Integrates with Athena, Redshift Spectrum, EMR, and AWS Glue for query enforcement",
      "Data filters: row-level and cell-level security using filter expressions",
    ],
    examTraps: [
      "Trap: Use S3 bucket policies and IAM to control who can query specific columns of data in your data lake. Reality: S3 bucket policies control access to entire objects (files), not columns within files. Lake Formation provides the column- and row-level security that S3 bucket policies cannot offer.",
    ],
    relatedServices: ["S3", "Glue", "Athena", "Redshift Spectrum", "EMR", "IAM"],
  },

  {
    id: "emr",
    name: "Amazon EMR",
    shortName: "Amazon EMR",
    abbr: "EMR",
    category: "analytics",
    domains: [3, 4],
    tagline: "A managed big data platform for running Hadoop, Spark, Hive, Flink, and other frameworks at scale on EC2 or Fargate.",
    whatItDoes:
      "Amazon EMR (Elastic MapReduce) is a managed big data platform that provisions and configures clusters of EC2 instances running open-source frameworks — Apache Hadoop, Apache Spark, Apache Hive, Apache HBase, Presto, Flink, and more. EMR handles cluster setup, framework configuration, and scaling so you can focus on writing data processing jobs.",
    whenToUse:
      "Use for large-scale batch data processing, ETL pipelines, machine learning feature engineering, log analysis, genomics, financial risk modeling, and any use case that requires running Spark or Hadoop at scale. Use Spot Instances for task nodes to cut cluster costs significantly.",
    keyFacts: [
      "Three deployment modes: EC2 (traditional, most control), EKS (run Spark jobs on existing Kubernetes clusters), and Serverless (no cluster provisioning — EMR allocates resources automatically)",
      "Supports Hadoop, Spark, Hive, HBase, Presto, Flink, Pig, and many other big data frameworks",
      "Use Spot Instances for task nodes (stateless, can be interrupted without data loss) to reduce cost by up to 80%",
      "EMRFS: EMR File System extends Hadoop to use S3 as a durable storage layer instead of HDFS",
      "EMR Serverless: auto-provisions and scales workers; you pay per vCPU-second and GB-second consumed",
    ],
    examTraps: [
      "Trap: Use Glue ETL for all large-scale Spark processing workloads. Reality: Glue ETL is simpler and serverless but less flexible. EMR gives full control over Spark/Hadoop configuration, supports a wider range of frameworks, and is preferred for complex, long-running big data jobs or when you need to tune Spark settings.",
    ],
    relatedServices: ["S3", "Glue", "Athena", "Redshift", "Lake Formation", "Kinesis Data Streams"],
  },

  // ─── MANAGEMENT (NEW) ───────────────────────────────────────────────────────

  {
    id: "control-tower",
    name: "AWS Control Tower",
    shortName: "Control Tower",
    abbr: "ControlTower",
    category: "management",
    domains: [1, 2],
    tagline: "Set up and govern a secure, multi-account AWS environment based on best practices, with a few clicks.",
    whatItDoes:
      "AWS Control Tower automates the setup of a multi-account AWS environment (called a landing zone) following AWS best practices. It uses AWS Organizations, AWS SSO (IAM Identity Center), AWS Config, and CloudTrail under the hood to create a pre-configured governance structure: separate accounts for logging and security, guardrails (preventive and detective controls), and a self-service account vending machine for creating new accounts.",
    whenToUse:
      "Use when setting up a new multi-account AWS environment and want guardrails and governance built in from the start. Control Tower is the prescriptive, fast-path solution for organizations adopting AWS at scale who want to follow the AWS Well-Architected Framework multi-account best practices.",
    keyFacts: [
      "Creates a landing zone: a baseline multi-account structure with a management account, log archive account, and audit account",
      "Guardrails are governance rules that are either preventive (using SCPs — cannot be bypassed) or detective (using Config Rules — detect violations)",
      "Account Factory: a self-service portal (backed by Service Catalog) for creating new AWS accounts that automatically conform to your baseline",
      "Account Factory for Terraform (AFT): provision accounts and apply Terraform customizations via GitOps",
      "Integrates with AWS Organizations, Config, CloudTrail, and IAM Identity Center (SSO)",
    ],
    examTraps: [
      "Trap: AWS Organizations alone provides the same governance as Control Tower. Reality: Organizations manages account hierarchy and Service Control Policies. Control Tower adds opinionated best-practice guardrails, automated logging baselines, an account vending machine, and a unified dashboard — it orchestrates Organizations rather than replacing it.",
    ],
    relatedServices: ["Organizations", "Config", "CloudTrail", "IAM Identity Center", "Service Catalog"],
  },

  {
    id: "service-catalog",
    name: "AWS Service Catalog",
    shortName: "Service Catalog",
    abbr: "ServiceCatalog",
    category: "management",
    domains: [1, 4],
    tagline: "Create and manage a catalog of approved AWS products (CloudFormation templates) that teams can self-service deploy.",
    whatItDoes:
      "AWS Service Catalog lets administrators create and share portfolios of approved AWS products — CloudFormation templates packaged as service catalog products — that users can deploy themselves without needing IAM permissions to create the underlying resources. The catalog enforces organizational standards, tagging policies, and constraints (e.g., allowed regions, instance types) while giving users self-service agility.",
    whenToUse:
      "Use when you want to empower development teams to provision approved resources (a standard EC2 + VPC setup, a pre-approved RDS configuration) without granting them broad IAM permissions to create anything. Also use for Control Tower Account Factory to provision new accounts following standards.",
    keyFacts: [
      "Products are CloudFormation templates packaged with metadata, descriptions, and constraints",
      "Portfolios group products and are shared with specific IAM users, groups, or roles",
      "Launch constraints: delegate a specific IAM role to launch the CloudFormation stack, so the end user doesn't need CloudFormation permissions directly",
      "TagOptions: enforce required tags on all resources created through the catalog",
      "Integrates with AWS Organizations for sharing portfolios across accounts",
    ],
    examTraps: [
      "Trap: Service Catalog and CloudFormation are the same — just use CloudFormation for self-service deployments. Reality: CloudFormation requires the user to have IAM permissions to create the underlying resources. Service Catalog wraps CloudFormation with governance, constraints, and a launch role so end users can deploy without broad IAM permissions.",
    ],
    relatedServices: ["CloudFormation", "Organizations", "IAM", "Control Tower", "Config"],
  },

  {
    id: "xray",
    name: "AWS X-Ray",
    shortName: "AWS X-Ray",
    abbr: "XRay",
    category: "management",
    domains: [3],
    tagline: "Trace requests as they flow through your distributed application to find bottlenecks, errors, and slow services.",
    whatItDoes:
      "AWS X-Ray provides distributed tracing for applications. You instrument your application code (using X-Ray SDKs or auto-instrumentation for Lambda, API Gateway, and ECS) so each request generates trace data. X-Ray aggregates these traces into a service map — a visual graph of how services call each other — and shows latency, error rates, and throttling for each segment.",
    whenToUse:
      "Use when debugging performance issues or errors in distributed applications (microservices, serverless, containers) where a single request passes through multiple services and you need to see the full execution path and identify which service is slow or throwing errors.",
    keyFacts: [
      "Service map: auto-generated visual graph showing all service dependencies and their health (latency, error rates, throttle rates)",
      "Traces consist of segments (one per service/component) and subsegments (within a service call, e.g., SQL query, external HTTP call)",
      "Sampling: by default, X-Ray records the first request each second and 5% of additional requests — reduces cost while maintaining visibility",
      "Integrates with Lambda, API Gateway, ALB, ECS, EC2, Elastic Beanstalk, and App Mesh out of the box",
      "X-Ray Analytics: query and filter traces using filter expressions to find specific error patterns",
    ],
    examTraps: [
      "Trap: Use CloudWatch Logs to debug latency issues in a microservice architecture. Reality: CloudWatch Logs shows individual log lines per service but doesn't correlate a single end-to-end request across services. X-Ray provides end-to-end distributed tracing so you can see the full request journey and pinpoint exactly which service or call is slow.",
    ],
    relatedServices: ["CloudWatch", "Lambda", "API Gateway", "ECS", "Elastic Beanstalk"],
  },

  {
    id: "ecr",
    name: "Amazon Elastic Container Registry (Amazon ECR)",
    shortName: "Amazon ECR",
    abbr: "ECR",
    category: "management",
    domains: [1, 2, 3],
    tagline: "A fully managed Docker and OCI container image registry on AWS, integrated with ECS, EKS, and Lambda.",
    whatItDoes:
      "Amazon ECR is a managed container image registry. You push Docker or OCI images to ECR repositories, and AWS stores them durably, replicates them, and serves them to ECS tasks, EKS pods, Lambda functions, or any Docker client. ECR integrates with AWS IAM for access control and with Amazon Inspector for automatic vulnerability scanning of images.",
    whenToUse:
      "Use whenever you deploy containers on AWS — ECR is the natural registry for ECS and EKS workloads. Use ECR instead of Docker Hub to avoid external network hops, keep images inside the AWS network, and leverage IAM-based authentication.",
    keyFacts: [
      "Fully integrated with ECS, EKS, Lambda container images, and Fargate — image pulls stay on the AWS network",
      "ECR Public Gallery: publicly accessible registry for sharing images (similar to Docker Hub) — open to anyone",
      "Image scanning: integrates with Amazon Inspector to automatically scan images for CVEs (software vulnerabilities) on push or on schedule",
      "Lifecycle policies: automatically delete old images (e.g., keep only the last 10 images tagged as 'release') to reduce storage costs",
      "Cross-region and cross-account replication: replicate images to other regions and accounts for DR or multi-region deployments",
    ],
    examTraps: [
      "Trap: You must use Docker Hub to store container images before deploying to ECS. Reality: ECR is a fully managed, AWS-native container registry. Using ECR avoids internet egress costs, keeps image pulls on the AWS network for lower latency, and uses IAM for authentication instead of Docker Hub credentials.",
    ],
    relatedServices: ["ECS", "EKS", "Lambda", "Fargate", "Inspector", "IAM"],
  },
]
