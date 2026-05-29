import { Question } from "../lib/types"

export const domain2NewQuestions2: Question[] = [

  // ── d2-041 ── difficulty 3 ── AWS MGN vs DMS ── taskStatement 2.1
  {
    id: "d2-041",
    domain: 2,
    taskStatement: "2.1",
    services: ["mgn", "dms", "datasync"],
    constraintType: "migration",
    difficulty: 3,
    type: "single",
    stem: "A retail company is migrating its on-premises infrastructure to AWS. The migration includes: (1) a Windows Server running a legacy order-management application (binary, no source code), (2) a MySQL database that must be migrated to Amazon Aurora MySQL with continuous replication during cutover, and (3) 50 TB of historical flat files on a NAS share that need to be moved to Amazon S3. The team wants to use the CORRECT AWS-native tool for each workload. Which combination is RIGHT?",
    options: [
      {
        id: "A",
        text: "AWS Application Migration Service (AWS MGN) for the Windows Server, AWS Database Migration Service (AWS DMS) for the MySQL-to-Aurora replication, and AWS DataSync for the NAS-to-S3 file transfer.",
        isCorrect: true,
        explanation: "Correct — Each tool is purpose-matched: AWS MGN performs agent-based, continuous block-level replication of the entire server (OS + application + data) to AWS and converts it to an EC2 instance — no source code needed. AWS DMS continuously replicates the MySQL database to Aurora MySQL with change data capture (CDC), allowing a live cutover with minimal downtime. AWS DataSync is an agent-based file transfer service optimized for moving large amounts of data (NAS/NFS/SMB) to S3, EFS, or FSx at up to 10 Gbps per agent — far faster than a manual copy."
      },
      {
        id: "B",
        text: "AWS DMS for the Windows Server, AWS MGN for the MySQL-to-Aurora database migration, and AWS Storage Gateway for the NAS-to-S3 file transfer.",
        isCorrect: false,
        explanation: "Wrong — DMS is for database schema and data migration, not full server lift-and-shift. MGN is for server replication, not database replication. Storage Gateway provides on-premises access to cloud storage (caching, hybrid) — it is not designed for bulk one-time file migrations. All three service assignments are reversed or incorrect."
      },
      {
        id: "C",
        text: "AWS MGN for all three workloads — MGN supports server, database, and file migration in a unified platform.",
        isCorrect: false,
        explanation: "Wrong — AWS MGN replicates entire servers (block-level) to EC2. It does not perform schema conversion for databases (DMS does that) or optimized bulk file transfers to S3 (DataSync does that). Using MGN for all three would work for the server but is suboptimal or incorrect for the database cutover workflow and the file migration."
      },
      {
        id: "D",
        text: "AWS DataSync for the Windows Server, AWS DMS for the database, and AWS Snow Family for the 50 TB file transfer.",
        isCorrect: false,
        explanation: "Wrong — DataSync is for file-protocol (NFS/SMB/S3/EFS/FSx) transfers, not full server migrations. Snow Family is appropriate when network bandwidth is insufficient for 50 TB (typical threshold: weeks of upload time), but the question does not state a bandwidth constraint. AWS MGN is the correct tool for the Windows Server."
      }
    ],
    explanation: "The three AWS migration transfer services have distinct roles: AWS MGN (Application Migration Service) = full-server block-level replication to EC2 (formerly CloudEndure Migration), ideal for lift-and-shift without source code. AWS DMS = database schema + data migration, supports 20+ source/target engines, continuous replication via CDC for live cutover. AWS DataSync = high-throughput file data transfer between NFS/SMB/S3/EFS/FSx/HDFS, agent-based, up to 10 Gbps per agent, with scheduling, filtering, and integrity verification. Exam tip: when you see 'server migration' → MGN; 'database migration' → DMS; 'file/NAS/NFS migration to S3 or EFS' → DataSync.",
    keywords: ["AWS MGN", "AWS DMS", "AWS DataSync", "migration tools", "correct tool per workload", "CDC replication"]
  },

  // ── d2-042 ── difficulty 3 ── AWS DRS agent vs AWS Backup ── taskStatement 2.2
  {
    id: "d2-042",
    domain: 2,
    taskStatement: "2.2",
    services: ["disaster-recovery", "backup", "ec2"],
    constraintType: "ha",
    difficulty: 2,
    type: "single",
    stem: "A financial services company runs 40 physical servers in a colocation facility. After evaluating DR options, the team states these requirements: RPO must be under 1 minute, RTO must be under 20 minutes, and the solution must support POINT-IN-TIME recovery to any second in the last 24 hours to recover from ransomware or accidental data corruption. The servers run a mix of Windows Server and Linux. Which AWS service BEST satisfies ALL requirements with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "AWS Backup with on-premises VMware agent, configured for hourly backups with cross-region copy to a DR vault.",
        isCorrect: false,
        explanation: "Wrong — Hourly backups provide an RPO of up to 60 minutes, which violates the sub-1-minute RPO requirement. Restoring from AWS Backup also takes time to provision EC2 instances and restore data — the RTO would be 30–90 minutes depending on data size. AWS Backup does not provide seconds-level point-in-time recovery for physical servers."
      },
      {
        id: "B",
        text: "AWS Elastic Disaster Recovery (AWS DRS) with the DRS replication agent installed on each physical server — continuous block-level replication, sub-second RPO, 5–20-minute RTO, and a rolling 24-hour point-in-time recovery window.",
        isCorrect: true,
        explanation: "Correct — AWS Elastic Disaster Recovery (DRS, formerly CloudEndure DR) uses an agent installed on the source server that continuously replicates block-level changes to a low-cost AWS staging area (a replication server + EBS volumes). The result: RPO = seconds (continuous replication, near real-time), RTO = 5–20 minutes (automated EC2 launch with OS conversion), and a rolling 24-hour point-in-time recovery window — you can recover to any point in the last 24 hours by second. Non-disruptive DR drills are also supported. Cost is ~$20/month per server."
      },
      {
        id: "C",
        text: "AWS Storage Gateway Volume Gateway (Stored mode) with daily EBS snapshots copied to a DR region — provides near-continuous block replication.",
        isCorrect: false,
        explanation: "Wrong — Volume Gateway in Stored mode keeps data on-premises with periodic EBS snapshots to AWS (not continuous). The RPO depends on snapshot frequency (minimum ~1 hour). Restoring requires provisioning EC2 instances and attaching the restored volume manually — RTO is hours. This does not meet the sub-1-minute RPO or 20-minute RTO requirements."
      },
      {
        id: "D",
        text: "Amazon Data Lifecycle Manager (DLM) for automated EBS snapshot creation every 5 minutes on all servers, with snapshot copies to the DR region.",
        isCorrect: false,
        explanation: "Wrong — DLM manages EBS snapshot and AMI lifecycle for EC2 instances — it cannot manage physical on-premises servers that don't have EBS volumes. DLM is not applicable to colocation physical hardware."
      }
    ],
    explanation: "AWS Elastic Disaster Recovery (DRS) key facts for the exam: formerly CloudEndure Disaster Recovery; agent-based continuous BLOCK-LEVEL replication from physical servers, VMs (VMware, Hyper-V), EC2, and other cloud VMs to AWS; RPO = seconds; RTO = 5–20 minutes; ~24-hour rolling point-in-time recovery window; non-disruptive drills (launch recovery instances without interrupting replication); automatic OS conversion; ~$20/server/month. Important limitation: DRS does NOT replicate managed databases (use native database replication tools like DMS or Aurora Global Database for those). When you see 'physical servers to AWS DR with seconds RPO and minutes RTO,' the answer is AWS DRS.",
    keywords: ["AWS DRS", "continuous block-level replication", "physical servers", "sub-second RPO", "point-in-time recovery", "ransomware DR"]
  },

  // ── d2-043 ── difficulty 3 ── Step Functions Standard vs Express ── taskStatement 2.1
  {
    id: "d2-043",
    domain: 2,
    taskStatement: "2.1",
    services: ["step-functions", "lambda", "sqs"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A fintech company processes 2 million payment micro-transactions per day through a workflow that includes: a fraud check Lambda (200 ms), a ledger update Lambda (150 ms), and a notification Lambda (100 ms). Total per-transaction workflow duration is under 3 minutes. Some transactions are occasionally retried by the upstream system, so the team wants IDEMPOTENCY handled by the workflow engine itself. The company is COST-CONSCIOUS and wants to minimize Step Functions charges. Which workflow type should be used, and what idempotency consideration applies?",
    options: [
      {
        id: "A",
        text: "Step Functions Express Workflow — cheapest option for high-volume short workflows. Because Express Workflows guarantee at-least-once execution, the downstream Lambda functions MUST be idempotent.",
        isCorrect: true,
        explanation: "Correct — Express Workflows are billed per execution request + duration (not per state transition), making them significantly cheaper for high-volume, short-duration workloads. At 2M transactions/day and under 3-minute duration, Express Workflows are optimal. However, Express Workflows have at-least-once execution semantics — a workflow may execute more than once for the same input if retried or in failure scenarios. Therefore, the Lambda functions called by the workflow MUST be designed to be idempotent (same input produces same result, safe to retry). The workflow engine does NOT deduplicate — that responsibility falls to the application."
      },
      {
        id: "B",
        text: "Step Functions Standard Workflow — it provides exactly-once execution, automatically deduplicating retried transactions so Lambda functions don't need to be idempotent.",
        isCorrect: false,
        explanation: "Wrong — Standard Workflows provide exactly-once execution semantics and maintain full execution history, but they are billed per state transition (~$0.025/1,000 state transitions). At 2M transactions/day × 3 state transitions each = 6M transitions/day — significantly more expensive than Express Workflows. Furthermore, Standard Workflow's 'exactly-once' refers to execution within a single workflow run, not deduplication of external retries triggering new executions."
      },
      {
        id: "C",
        text: "Step Functions Express Workflow — Express Workflows guarantee exactly-once execution, so no idempotency design is needed in the Lambda functions.",
        isCorrect: false,
        explanation: "Wrong — This reverses the semantics. Express Workflows guarantee AT-LEAST-ONCE execution (not exactly-once). Standard Workflows guarantee exactly-once execution per state transition. Claiming Express Workflows provide exactly-once is a critical error that would lead to duplicate transactions in production."
      },
      {
        id: "D",
        text: "Step Functions Standard Workflow is required because the workflow duration can approach 3 minutes, and Express Workflows only support durations up to 1 minute.",
        isCorrect: false,
        explanation: "Wrong — Express Workflows support a maximum duration of 5 minutes (not 1 minute). Standard Workflows support up to 1 year. A 3-minute duration is well within the Express Workflow 5-minute limit."
      }
    ],
    explanation: "Step Functions workflow type comparison: Standard Workflow = up to 1 year, exactly-once per state transition, full execution history, $0.025/1,000 state transitions, asynchronous only. Express Workflow = up to 5 minutes, at-least-once (idempotent design REQUIRED for downstream services), no native execution history (CloudWatch Logs), $1/million executions + duration. The critical exam trap: Express = AT-LEAST-ONCE (not exactly-once). For high-volume (millions/day), short-duration (minutes) workflows, Express is the cost-efficient answer — but downstream services MUST handle duplicate invocations gracefully.",
    keywords: ["Standard vs Express", "at-least-once", "exactly-once", "idempotent", "5 minutes max", "high-volume cost"]
  },

  // ── d2-044 ── difficulty 4 ── Amazon MQ vs SQS for lift-and-shift ── taskStatement 2.1
  {
    id: "d2-044",
    domain: 2,
    taskStatement: "2.1",
    services: ["mq", "sqs", "sns"],
    constraintType: "migration",
    difficulty: 4,
    type: "single",
    stem: "A manufacturing company's on-premises ERP system communicates with multiple shop-floor control systems using Apache ActiveMQ with JMS (Java Message Service) topics and AMQP 1.0 queues. The company wants to migrate the messaging infrastructure to AWS with MINIMAL code changes to the existing applications. A cloud architect proposes two options: (A) Amazon MQ managed broker, or (B) Amazon SQS + SNS with a custom JMS-to-SQS adapter library. Which option is CORRECT and why is the alternative insufficient?",
    options: [
      {
        id: "A",
        text: "Option A — Amazon MQ with an Apache ActiveMQ broker supports JMS, AMQP 1.0, MQTT, STOMP, OpenWire, and WSS protocols natively. Existing application code requiring no changes.",
        isCorrect: true,
        explanation: "Correct — Amazon MQ is a managed Apache ActiveMQ (and RabbitMQ) broker. It natively supports the protocols the ERP system uses: JMS, AMQP 1.0, MQTT, STOMP, OpenWire, and WSS. Applications connect to Amazon MQ using the same client libraries and connection strings (updated hostname only), requiring zero code changes. This is the textbook 'lift-and-shift messaging migration' use case for Amazon MQ."
      },
      {
        id: "B",
        text: "Option B — Amazon SQS + SNS is the preferred architecture because it is fully managed, more scalable, and less expensive than Amazon MQ.",
        isCorrect: false,
        explanation: "Wrong — SQS and SNS use AWS-proprietary APIs (AWS SDK, not JMS or AMQP). Migrating from JMS/AMQP to SQS requires rewriting all message-producing and message-consuming code to use AWS SDK calls — a significant engineering effort. Option B would require 'major code changes,' which the question prohibits. Amazon MQ is the correct choice when the application uses standard messaging protocols (JMS, AMQP, MQTT, STOMP) and code changes must be minimized."
      },
      {
        id: "C",
        text: "Option B is better because Amazon MQ does not support AMQP 1.0, which the ERP system requires.",
        isCorrect: false,
        explanation: "Wrong — Amazon MQ with Apache ActiveMQ DOES support AMQP 1.0 natively. Amazon MQ with RabbitMQ supports AMQP 0-9-1. AMQP 1.0 is specifically listed in Amazon MQ's ActiveMQ supported protocol list. This option contains a false technical claim."
      },
      {
        id: "D",
        text: "Both options require equal code changes because AWS services always require the AWS SDK regardless of the protocol layer.",
        isCorrect: false,
        explanation: "Wrong — Amazon MQ is specifically designed to NOT require AWS SDK changes. Applications connect using standard protocol clients (ActiveMQ JMS client, AMQP 1.0 client, MQTT client) to the Amazon MQ broker endpoint. No AWS SDK is required. SQS/SNS DO require the AWS SDK, making this claim false."
      }
    ],
    explanation: "Amazon MQ vs SQS/SNS decision rule: Use Amazon MQ when migrating from on-premises messaging that uses standard protocols: JMS, AMQP (0-9-1 or 1.0), MQTT, STOMP, OpenWire, or WebSocket-based messaging. Amazon MQ supports Apache ActiveMQ and RabbitMQ brokers. Applications connect using existing protocol clients with only the connection hostname changed — zero code rewrite. Use SQS/SNS for NEW applications built natively for AWS, where AWS SDK integration is acceptable and you want unlimited throughput, fully managed scaling, and lower operational overhead. The key exam phrase: 'migrating on-premises JMS/AMQP/MQTT application without code changes' → Amazon MQ.",
    keywords: ["Amazon MQ", "JMS", "AMQP", "lift-and-shift messaging", "no code changes", "SQS vs MQ"]
  },

  // ── d2-045 ── difficulty 4 ── Amazon AppFlow SaaS integration ── taskStatement 2.1
  {
    id: "d2-045",
    domain: 2,
    taskStatement: "2.1",
    services: ["appflow", "s3", "lambda"],
    constraintType: "ops",
    difficulty: 4,
    type: "single",
    stem: "A retail analytics team needs to ingest Salesforce opportunity records and ServiceNow incident tickets into Amazon S3 on a scheduled and event-driven basis. Requirements: field-level mapping and data filtering during ingestion, transfers up to 100 GB per flow run, and PrivateLink-based connectivity to Salesforce for security compliance. The team has NO in-house ETL or integration developers and wants to avoid writing custom code. Which service meets ALL requirements with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Amazon AppFlow — a no-code, fully managed service for bidirectional data transfers between SaaS applications (Salesforce, ServiceNow, SAP, etc.) and AWS services, supporting scheduled and event-triggered flows, field mapping, filtering, and Salesforce PrivateLink connectivity.",
        isCorrect: true,
        explanation: "Correct — Amazon AppFlow is purpose-built for SaaS-to-AWS data integration without custom code. It supports 50+ SaaS connectors including Salesforce (with PrivateLink support for private connectivity), ServiceNow, SAP, Marketo, Zendesk, Google Analytics, and more. Flows can be triggered on a schedule, on-demand, or by SaaS events (Salesforce CDC). Field-level mapping, validation, transformation, and filtering are built in. Max 100 GB per flow run is a supported limit."
      },
      {
        id: "B",
        text: "AWS Glue with custom PySpark jobs connecting to Salesforce and ServiceNow REST APIs, writing output to S3 in Parquet format.",
        isCorrect: false,
        explanation: "Wrong — AWS Glue requires writing PySpark or Python ETL scripts, managing job execution environments, and implementing custom Salesforce/ServiceNow API connectors. This requires in-house ETL developers — exactly what the question prohibits. AppFlow provides the same outcome with no code writing."
      },
      {
        id: "C",
        text: "AWS Lambda functions triggered by CloudWatch Events on a schedule, calling Salesforce and ServiceNow REST APIs and writing to S3.",
        isCorrect: false,
        explanation: "Wrong — Lambda-based SaaS integration requires writing, testing, and maintaining custom API integration code for each source system, handling pagination, rate limiting, error retry logic, and authentication token refresh. This is a significant engineering effort and requires ongoing maintenance. AppFlow handles all of this without code."
      },
      {
        id: "D",
        text: "Amazon Kinesis Data Streams with a Salesforce Connector streaming data continuously to Kinesis, then Amazon Data Firehose delivering to S3.",
        isCorrect: false,
        explanation: "Wrong — Kinesis doesn't have native Salesforce or ServiceNow connectors. Setting up streaming from Salesforce to Kinesis requires custom code (Salesforce Platform Events + a Lambda bridge). This introduces code-writing overhead. AppFlow natively supports Salesforce CDC (change data capture) as an event trigger, eliminating custom streaming code."
      }
    ],
    explanation: "Amazon AppFlow is the exam answer when requirements include: SaaS-to-AWS data integration (Salesforce, ServiceNow, SAP, Zendesk, Marketo, Google Analytics, Slack, etc.), no code, field mapping and filtering, scheduled or event-triggered flows, up to 100 GB/flow, PrivateLink support. AppFlow connectors: 50+ SaaS sources, AWS targets include S3, Redshift, EventBridge, Snowflake. The key trigger phrase is 'no code' + 'SaaS application' + 'S3 or Redshift destination.' AppFlow is bidirectional for some connectors — it can also push data FROM AWS TO Salesforce.",
    keywords: ["Amazon AppFlow", "no-code", "Salesforce", "ServiceNow", "SaaS integration", "PrivateLink", "field mapping"]
  },

  // ── d2-046 ── difficulty 3 ── ALB sticky sessions and weighted target groups ── taskStatement 2.1
  {
    id: "d2-046",
    domain: 2,
    taskStatement: "2.1",
    services: ["alb", "ecs", "auto-scaling"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "An e-commerce platform runs a stateful checkout application on Amazon ECS tasks behind an Application Load Balancer (ALB). Users must maintain the same ECS task for their entire checkout session. Additionally, the team wants to perform a blue/green deployment by gradually shifting 10% of traffic to a new task definition version while keeping 90% on the existing version — all through the SAME ALB listener. Which combination of ALB features implements BOTH requirements?",
    options: [
      {
        id: "A",
        text: "ALB sticky sessions (duration-based or application-based) on the target group for session affinity, and ALB weighted target groups to split traffic 90/10 between the existing and new task definition versions.",
        isCorrect: true,
        explanation: "Correct — ALB sticky sessions bind a user's requests to a specific target for the duration of the session cookie. Duration-based stickiness uses the `AWSALB` cookie (set by ALB); application-based stickiness uses your application's own cookie. For the blue/green deployment, ALB supports weighted target groups — two target groups registered on the same listener rule with weights (e.g., 90 to the blue group, 10 to the green group). Traffic splits are applied at the listener rule level. Both features can be used simultaneously on different target groups."
      },
      {
        id: "B",
        text: "Use an ALB listener rule with a query string condition to route checkout requests to one target group, and a separate ALB for the new version with a separate DNS record.",
        isCorrect: false,
        explanation: "Wrong — A separate ALB for the new version requires two different DNS endpoints, meaning the 90/10 traffic split must be implemented at the DNS level (Route 53 Weighted routing). This increases complexity and doesn't use ALB weighted target groups. The question specifies routing through the SAME ALB listener."
      },
      {
        id: "C",
        text: "ALB path-based routing with sticky sessions — route /checkout/* to the existing version and /checkout-v2/* to the new version.",
        isCorrect: false,
        explanation: "Wrong — Path-based routing routes different URL paths to different target groups, not the same URL to different versions at a traffic percentage. This requires the application to use different paths for different versions — not a transparent blue/green deployment. Users would need to be redirected to a new URL path to land in the green group."
      },
      {
        id: "D",
        text: "Enable ALB Multi-AZ across two AZs — the ALB routes sessions to the same AZ targets (providing session affinity) and balances new user traffic 50/50 between the two versions.",
        isCorrect: false,
        explanation: "Wrong — Multi-AZ load balancing routes users to any healthy target across AZs — it does NOT provide session affinity. Cross-zone load balancing distributes requests across ALL targets regardless of AZ. Sticky sessions are a separate feature configured on the target group, not by enabling Multi-AZ."
      }
    ],
    explanation: "Two distinct ALB features for this scenario: (1) Sticky Sessions: configured per target group as 'duration-based' (ALB-managed `AWSALB` cookie) or 'application-based' (your app cookie); keeps subsequent requests from a client going to the same target. (2) Weighted Target Groups: one listener rule can forward traffic to multiple target groups with percentage-based weights (e.g., 90% to blue, 10% to green); used for canary releases, A/B testing, and blue/green deployments on the same ALB. These are independent features that can be combined — sticky sessions on the blue target group and weights at the listener rule level.",
    keywords: ["ALB sticky sessions", "weighted target groups", "blue/green deployment", "session affinity", "same ALB listener"]
  },

  // ── d2-047 ── difficulty 3 ── NLB TLS termination and static IPs ── taskStatement 2.1
  {
    id: "d2-047",
    domain: 2,
    taskStatement: "2.1",
    services: ["nlb", "acm", "ec2"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A healthcare company exposes a patient data API over TCP port 443. Their firewall team requires STATIC IP addresses for the load balancer endpoint so they can manage firewall rules precisely — one IP per Availability Zone deployed across three AZs. The company also requires TLS TERMINATION at the load balancer so backend EC2 instances receive plaintext traffic on port 80. Which load balancer type and configuration meets BOTH requirements?",
    options: [
      {
        id: "A",
        text: "Application Load Balancer (ALB) with an HTTPS listener and an AWS Certificate Manager (ACM) certificate — ALB terminates TLS and forwards HTTP to EC2. ALB automatically assigns one static IP per AZ.",
        isCorrect: false,
        explanation: "Wrong — ALB DOES support TLS termination with ACM certificates, but ALB does NOT provide static IP addresses. ALB uses dynamic DNS-based IPs that can change. For static IPs per AZ, a Network Load Balancer (NLB) is required."
      },
      {
        id: "B",
        text: "Network Load Balancer (NLB) with a TLS listener using an ACM certificate — NLB terminates TLS and forwards TCP to the EC2 backend on port 80. NLB provides one static IP address (or Elastic IP) per AZ.",
        isCorrect: true,
        explanation: "Correct — NLB supports TLS termination at Layer 4 via TLS listeners (port 443) using ACM-managed certificates. After TLS decryption, NLB forwards the plaintext TCP traffic to the target group on port 80. NLB assigns one static IP per Availability Zone (automatically assigned or you can specify an Elastic IP), which is exactly what the firewall team needs for static-IP whitelisting. NLB also operates at extremely high throughput (millions of requests per second) with ultra-low latency."
      },
      {
        id: "C",
        text: "Application Load Balancer with Elastic IP addresses assigned per AZ — this provides static IPs with the TLS termination capabilities of ALB.",
        isCorrect: false,
        explanation: "Wrong — Application Load Balancers CANNOT be associated with Elastic IP addresses. ALBs use DNS names with dynamic underlying IPs. Only Network Load Balancers support Elastic IPs per AZ. This option describes a configuration that does not exist in AWS."
      },
      {
        id: "D",
        text: "Network Load Balancer in TCP passthrough mode — TLS is terminated on the EC2 instances using certificates deployed to each instance directly.",
        isCorrect: false,
        explanation: "Wrong — TCP passthrough (no TLS listener on the NLB) passes encrypted TLS traffic directly to the EC2 instances, which then terminate TLS themselves. This satisfies the static IP requirement but NOT the TLS-termination-at-load-balancer requirement. The question requires TLS terminated at the load balancer so EC2 instances receive plaintext."
      }
    ],
    explanation: "NLB key features for the exam: Layer 4 (TCP/UDP/TLS); one static IP per AZ (or assignable Elastic IP / BYOIP); supports TLS termination via ACM certificates on TLS listeners (forwards decrypted TCP to targets); required for VPC PrivateLink endpoint services; cross-zone load balancing OFF by default (enabling incurs inter-AZ data charges); preserves client source IP. ALB is L7 (HTTP/HTTPS), provides richer routing features (path/host/header) but NO static IPs. When the question mentions 'static IP' or 'firewall whitelisting' → NLB.",
    keywords: ["NLB TLS termination", "static IP per AZ", "Elastic IP", "firewall whitelisting", "ACM certificate", "ALB has no static IP"]
  },

  // ── d2-048 ── difficulty 4 ── Global Accelerator with ALB blue/green ── taskStatement 2.2
  {
    id: "d2-048",
    domain: 2,
    taskStatement: "2.2",
    services: ["global-accelerator", "alb", "route53"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "A SaaS company serves customers globally. Their application runs on Application Load Balancers in us-east-1 (production) and eu-west-1 (staging for the new version). The team wants to perform a blue/green deployment by gradually shifting 5% of GLOBAL traffic from the production ALB to the staging ALB, and roll forward to 100% once validation passes. Client applications whitelist the load balancer IP addresses in their firewall configurations and CANNOT tolerate IP changes. Which architecture achieves the blue/green traffic shift with no IP changes?",
    options: [
      {
        id: "A",
        text: "AWS Global Accelerator with two endpoints (production ALB and staging ALB), using endpoint weights to set 95% weight on production and 5% on staging — the two static anycast IPs remain constant.",
        isCorrect: true,
        explanation: "Correct — AWS Global Accelerator provides exactly 2 static anycast IPv4 addresses that never change. Behind those IPs, you configure endpoint groups with endpoints (ALBs, NLBs, EC2 IPs, Elastic IPs). Each endpoint can have a weight (0–255), enabling traffic splitting between the production ALB (weight 95%) and staging ALB (weight 5%). Clients whitelist the 2 Global Accelerator IPs — they never see the underlying ALB IPs. Shifting traffic = adjusting weights without any DNS change or IP change."
      },
      {
        id: "B",
        text: "Route 53 Weighted routing with weights 95 (production ALB) and 5 (staging ALB) — Route 53 will distribute traffic based on DNS response.",
        isCorrect: false,
        explanation: "Wrong — Route 53 Weighted routing distributes traffic based on DNS and is a valid blue/green mechanism. However, each ALB resolves to different dynamic IP addresses. If clients whitelist specific IP addresses, Route 53 Weighted routing won't work because the two ALBs have different IPs, and the client would need to whitelist all IPs of both ALBs. Global Accelerator's 2 static anycast IPs remain fixed regardless of which backend serves traffic."
      },
      {
        id: "C",
        text: "Add both ALBs to the same target group behind a parent ALB and use ALB weighted target groups at the parent ALB layer.",
        isCorrect: false,
        explanation: "Wrong — ALB cannot be a target in another ALB's target group directly (you would use NLB-behind-ALB chains, not ALB-behind-ALB). More importantly, this doesn't solve the static IP requirement — the parent ALB still has dynamic IPs. Also, cross-region ALBs cannot be in the same target group without specialized routing infrastructure."
      },
      {
        id: "D",
        text: "Deploy both ALBs with the same Elastic IP address using AWS IP address manager (IPAM) to share a static IP across both load balancers.",
        isCorrect: false,
        explanation: "Wrong — ALBs cannot be associated with Elastic IP addresses, and two separate load balancers cannot share the same IP address. IPAM manages IP address allocation across regions/accounts but does not enable IP sharing between resources. This option describes a configuration that doesn't exist in AWS."
      }
    ],
    explanation: "AWS Global Accelerator for blue/green deployments: provides 2 static anycast IPs that serve as permanent client-facing endpoints. Traffic routing is done by adjusting endpoint weights (0–255 per endpoint) within endpoint groups. Weight 0 = no traffic; equal weights = equal split; unequal weights = proportional split. This pattern is ideal when: (1) clients whitelist IP addresses (static IPs required), (2) non-HTTP/non-DNS traffic splitting needed (L4 routing over AWS backbone), or (3) multi-region blue/green with instant failback (weight change takes effect in seconds). Compare with Route 53 Weighted, which relies on DNS TTL and dynamic IPs.",
    keywords: ["Global Accelerator endpoint weights", "blue/green deployment", "static anycast IPs", "whitelist", "traffic dial"]
  },

  // ── d2-049 ── difficulty 3 ── ECS capacity providers Fargate vs EC2 ── taskStatement 2.1
  {
    id: "d2-049",
    domain: 2,
    taskStatement: "2.1",
    services: ["ecs", "auto-scaling", "ec2"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A data processing company runs an Amazon ECS cluster for batch processing jobs. Most batch jobs are fault-tolerant and can tolerate 2-minute interruption notices. The workload spikes unpredictably during business hours (peak: 500 concurrent tasks) and drops to near-zero overnight. The team wants to MINIMIZE compute costs while maintaining the ability to handle peak demand. Which capacity provider strategy BEST minimizes cost?",
    options: [
      {
        id: "A",
        text: "ECS on-demand Fargate capacity provider only — Fargate auto-scales and avoids managing EC2 instances.",
        isCorrect: false,
        explanation: "Wrong — On-demand Fargate is convenient but the most expensive compute option. For fault-tolerant batch jobs with unpredictable spikes, using only on-demand Fargate misses ~70% cost savings available through FARGATE_SPOT."
      },
      {
        id: "B",
        text: "ECS FARGATE_SPOT capacity provider with a base of 0 FARGATE on-demand tasks, weighted 100% toward FARGATE_SPOT — tasks run on spare capacity at ~70% discount and receive a 2-minute SIGTERM before interruption.",
        isCorrect: true,
        explanation: "Correct — FARGATE_SPOT uses spare Fargate capacity at approximately 70% discount versus on-demand Fargate pricing. When AWS needs capacity back, tasks receive a 2-minute SIGTERM interruption notice (sufficient for graceful shutdown of fault-tolerant batch jobs). For workloads that are fault-tolerant and can tolerate interruptions, using 100% FARGATE_SPOT maximizes savings. The ECS capacity provider strategy can set base = 0 (no guaranteed on-demand tasks) and weight = 100 on FARGATE_SPOT."
      },
      {
        id: "C",
        text: "EC2 Auto Scaling group with Reserved Instances for 500 instances to guarantee peak capacity at lowest hourly rate.",
        isCorrect: false,
        explanation: "Wrong — Reserving 500 EC2 instances to cover PEAK demand means paying for 500 instances 24/7, even overnight when near-zero tasks run. Reserved Instances are cost-effective for STEADY-STATE workloads, not highly variable workloads that drop to near-zero overnight. This would be the most expensive option for this workload pattern."
      },
      {
        id: "D",
        text: "EC2 launch type with a Spot Instance Auto Scaling group — EC2 Spot is cheaper than FARGATE_SPOT and provides the same 2-minute interruption warning.",
        isCorrect: false,
        explanation: "Wrong — EC2 Spot Instances do require managing the EC2 cluster (instance types, AMIs, cluster capacity, patching). While EC2 Spot can be cheaper than FARGATE_SPOT in some configurations, it adds operational overhead (EC2 management) that FARGATE_SPOT avoids. For fault-tolerant batch jobs where the team wants to minimize BOTH cost AND operational overhead, FARGATE_SPOT is purpose-built."
      }
    ],
    explanation: "ECS Capacity Provider strategies for cost optimization: FARGATE = on-demand serverless (no EC2 mgmt, standard pricing). FARGATE_SPOT = ~70% discount, 2-minute SIGTERM interruption, ECS-only (not EKS), fault-tolerant workloads only. EC2 ASG-based = most control, GPU/privileged/EBS support, requires EC2 management. EC2 Spot via ASG = cheapest raw compute but most ops burden. For fault-tolerant batch jobs with variable demand: FARGATE_SPOT is optimal (low cost + zero EC2 management). Mixed strategies can combine FARGATE (for critical tasks) with FARGATE_SPOT (for fault-tolerant tasks) using the `base` and `weight` parameters.",
    keywords: ["FARGATE_SPOT", "70% discount", "2-minute interruption", "fault-tolerant batch", "capacity provider strategy", "cost minimization"]
  },

  // ── d2-050 ── difficulty 4 ── EKS Fargate profiles vs managed node groups ── taskStatement 2.1
  {
    id: "d2-050",
    domain: 2,
    taskStatement: "2.1",
    services: ["eks", "fargate", "ec2"],
    constraintType: "ops",
    difficulty: 4,
    type: "single",
    stem: "A startup runs a multi-tenant SaaS platform on Amazon Elastic Kubernetes Service (Amazon EKS). The engineering team has three pod types: (1) API server pods that need access to persistent EBS volumes, run custom DaemonSets for logging, and require privileged container mode, (2) batch processing pods that are stateless and fault-tolerant, and (3) developer test pods in isolated namespaces that must incur ZERO cost when idle. The team wants to use the CORRECT compute option for each pod type. Which mapping is RIGHT?",
    options: [
      {
        id: "A",
        text: "API server pods → EKS Fargate profiles; batch pods → EKS managed node group (EC2); developer test pods → EKS Fargate profiles.",
        isCorrect: false,
        explanation: "Wrong — EKS Fargate profiles do NOT support DaemonSets, privileged containers, hostNetwork mode, or EBS volumes. API server pods requiring DaemonSets, privileged mode, and EBS volumes MUST use EC2-based node groups (managed or self-managed). Assigning them to Fargate profiles would cause deployment failures."
      },
      {
        id: "B",
        text: "API server pods → EKS managed node group (EC2); batch pods → EKS managed node group (EC2) with Spot instances; developer test pods → EKS Fargate profiles.",
        isCorrect: true,
        explanation: "Correct — EKS managed node group (EC2): supports DaemonSets, privileged containers, EBS PersistentVolumes, and all standard Kubernetes features. Managed node groups handle node provisioning and lifecycle (patching, drain, replacement). Spot instances on managed node groups provide ~70% discount for fault-tolerant batch. EKS Fargate profiles: each pod runs in its own Firecracker microVM, billed per-CPU/per-memory second — zero cost when no pods are scheduled. Perfect for dev test pods that are idle most of the time. Fargate limitations: no DaemonSets, no privileged containers, no EBS, no GPU, no hostNetwork."
      },
      {
        id: "C",
        text: "All three pod types → EKS Fargate profiles — Fargate eliminates EC2 management overhead entirely.",
        isCorrect: false,
        explanation: "Wrong — EKS Fargate cannot run DaemonSets, privileged containers, or use EBS volumes. Assigning API server pods with these requirements to Fargate would result in failed pod schedules. Fargate is the correct choice only for pods compatible with its constraints (no DaemonSets, no privileged, no EBS, ≤4 vCPU/30 GB per pod)."
      },
      {
        id: "D",
        text: "Developer test pods → EKS managed node group with On-Demand instances; API server pods → EKS self-managed nodes for maximum control.",
        isCorrect: false,
        explanation: "Wrong — Developer test pods needing ZERO cost when idle cannot use always-on EC2 instances (whether On-Demand or Reserved). EKS Fargate profiles charge per second only when pods are actively running, enabling true zero-cost idle periods. Self-managed nodes add more operational burden than managed node groups for API server pods — managed node groups are simpler without sacrificing the required features."
      }
    ],
    explanation: "EKS compute option selection: Managed Node Groups (EC2) = standard Kubernetes features, DaemonSets, privileged containers, EBS, GPU, host networking, node-level control — ideal for production workloads with specific node requirements. Fargate Profiles = per-pod billing, zero-cost when idle, each pod in isolated Firecracker microVM, no DaemonSets/privileged/EBS/GPU/hostNetwork — ideal for bursty/sporadic workloads and multi-tenant isolation. Self-managed Nodes = maximum control (custom AMIs, kernel modules) but most operational overhead. EKS Auto Mode = fully managed Bottlerocket nodes auto-replaced every 21 days (GA Dec 2024), closest to 'managed Fargate-like experience for EC2 pods.'",
    keywords: ["EKS Fargate profiles", "managed node groups", "DaemonSets not supported on Fargate", "EBS not on Fargate", "zero-cost idle", "privileged containers"]
  },

  // ── d2-051 ── difficulty 3 ── Amazon ECR lifecycle policies ── taskStatement 2.1
  {
    id: "d2-051",
    domain: 2,
    taskStatement: "2.1",
    services: ["ecr", "ecs", "eks"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A DevOps team pushes a new container image to Amazon Elastic Container Registry (Amazon ECR) on every CI/CD pipeline run — approximately 50 builds per day. After 6 months, the ECR repository has accumulated over 9,000 image tags, and storage costs have grown to $450/month. The team only needs the last 10 images per branch for rollback purposes. Images tagged with 'production' must NEVER be deleted automatically. Which ECR feature automatically cleans up old images with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Delete old images manually using a cron-based Lambda function that calls the ECR DeleteImage API on a weekly schedule.",
        isCorrect: false,
        explanation: "Wrong — A custom Lambda solution requires writing, testing, and maintaining code to identify old images, handle the 'production' tag exclusion logic, and manage permissions. ECR Lifecycle Policies are a built-in, no-code solution that eliminates the need for custom maintenance scripts."
      },
      {
        id: "B",
        text: "ECR Lifecycle Policies — configure a policy to expire untagged images after 7 days and keep only the 10 most recent images in each branch-named tag prefix, with a separate rule to exclude 'production' tagged images from cleanup.",
        isCorrect: true,
        explanation: "Correct — ECR Lifecycle Policies are purpose-built for automated image cleanup. Rules can be based on: image count (keep only X most recent), image age (expire after N days), tag status (tagged/untagged/prefix matching), and tag prefix patterns. Rules are evaluated in priority order. A high-priority rule to EXCLUDE 'production' tagged images (rule priority 1: `tagStatus=tagged, tagPrefixList=['production'], action=keep`) prevents production images from matching any cleanup rule. Lower-priority rules then expire images by count or age."
      },
      {
        id: "C",
        text: "Enable ECR image scanning on push — scan results automatically delete vulnerable images older than 30 days to reduce the attack surface.",
        isCorrect: false,
        explanation: "Wrong — ECR image scanning (basic or enhanced via Inspector) analyzes images for software vulnerabilities (CVEs) but does NOT delete images. Scan results are stored as metadata. Deletion of images based on scan results requires custom automation. Image scanning and lifecycle policies are completely separate features."
      },
      {
        id: "D",
        text: "Configure an S3 Lifecycle Policy on the underlying ECR bucket to transition old images to Glacier after 30 days.",
        isCorrect: false,
        explanation: "Wrong — ECR does not store images in an S3 bucket accessible to users. Container images in ECR are stored in a managed object store backend that is not directly accessible via S3 APIs. You cannot apply S3 Lifecycle Policies to ECR storage. ECR Lifecycle Policies are the correct mechanism."
      }
    ],
    explanation: "Amazon ECR Lifecycle Policies automate image cleanup to control storage costs. Key rule parameters: tagStatus (tagged, untagged, any), tagPrefixList (match tag name prefixes), countType (imageCountMoreThan or sinceImagePushed), countNumber (count threshold or age in days), action (expire). Rules are evaluated by priority (lowest number = highest priority). Protection pattern: add a rule with priority 1 to keep images matching the 'production' tag prefix — this prevents the tag from being matched by lower-priority cleanup rules. Without lifecycle policies, ECR repositories accumulate all pushed images indefinitely.",
    keywords: ["ECR Lifecycle Policies", "image cleanup", "tag prefix", "keep production", "storage cost", "no-code automation"]
  },

  // ── d2-052 ── difficulty 2 ── AWS App Runner vs Elastic Beanstalk ── taskStatement 2.1
  {
    id: "d2-052",
    domain: 2,
    taskStatement: "2.1",
    services: ["app-runner", "beanstalk", "ecs"],
    constraintType: "ops",
    difficulty: 2,
    type: "single",
    stem: "A startup developer has a containerized Python Flask web API stored in Amazon ECR. The developer wants to deploy it to a PUBLIC HTTPS endpoint in under 5 minutes with ZERO infrastructure configuration — no VPCs, no load balancers, no auto scaling groups to manage. The app should automatically scale based on traffic. Which AWS service is the SIMPLEST deployment path?",
    options: [
      {
        id: "A",
        text: "AWS Elastic Beanstalk with a Docker platform — Beanstalk deploys the container to EC2 instances with automatic load balancing and scaling.",
        isCorrect: false,
        explanation: "Wrong — Elastic Beanstalk automates provisioning but still requires configuring the environment (instance type, VPC, security groups, platform selection), and you access EC2 instances for debugging. Setup takes more than 5 minutes for a new environment. Beanstalk provides more control (good for complex configurations) but more friction than App Runner for a simple containerized API."
      },
      {
        id: "B",
        text: "AWS App Runner — point to an ECR image, and App Runner builds and deploys the containerized service to a fully managed HTTPS endpoint with automatic scaling, no infrastructure to configure.",
        isCorrect: true,
        explanation: "Correct — AWS App Runner is the simplest container deployment service on AWS. You provide an ECR image URL (or source code from GitHub), set the port, and App Runner handles: provisioning compute, configuring HTTPS endpoint, load balancing, auto scaling (up and down to zero), health checks, and TLS certificates. There is no VPC, no EC2, no ALB to configure. A new App Runner service is live in 2–3 minutes. This is the canonical 'simplest container deployment' answer."
      },
      {
        id: "C",
        text: "Amazon ECS with AWS Fargate — serverless container deployment with no EC2 management required.",
        isCorrect: false,
        explanation: "Wrong — ECS with Fargate is powerful and serverless but requires configuring: a VPC, subnets, security groups, an ALB with listener and target group, ECS task definitions, and ECS services. While no EC2 instances are managed, there is significant infrastructure configuration overhead (VPC, ALB, task definitions). This is more complex than App Runner for a simple containerized web API."
      },
      {
        id: "D",
        text: "Amazon Lightsail Containers — provides managed container deployment for simple web applications with automatic HTTPS.",
        isCorrect: false,
        explanation: "Wrong — Amazon Lightsail Containers is a valid simple container service, but AWS App Runner is the AWS-recommended service for this pattern (ECR image → HTTPS endpoint with zero config). Lightsail is positioned for smaller workloads with fixed pricing, while App Runner integrates natively with ECR, IAM roles for tasks, VPC connectors, and CloudWatch without additional configuration."
      }
    ],
    explanation: "AWS App Runner vs Elastic Beanstalk vs ECS Fargate simplicity spectrum: App Runner (simplest) = ECR image or GitHub source → HTTPS URL in minutes, fully managed, zero infra config, auto scale to zero, integrated ACM certs. Beanstalk (middle) = automates EC2/ALB/ASG provisioning but requires environment selection, VPC config; gives you EC2 access, deployment policies (All-at-once, Rolling, Immutable, Blue/Green). ECS Fargate (most flexible) = full Kubernetes-like control over networking, load balancing, task placement — but requires explicit VPC/ALB/task definition setup. Exam rule: 'simplest deployment of a container with no infra config' → App Runner.",
    keywords: ["AWS App Runner", "simplest container deployment", "zero infrastructure", "HTTPS endpoint", "ECR image", "App Runner vs Beanstalk"]
  },

  // ── d2-053 ── difficulty 3 ── Auto Scaling target tracking vs step vs scheduled ── taskStatement 2.1
  {
    id: "d2-053",
    domain: 2,
    taskStatement: "2.1",
    services: ["auto-scaling", "cloudwatch", "ec2"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A video streaming platform experiences predictable daily traffic patterns: traffic triples every weekday morning at 8 AM (East Coast users), then doubles again at noon, then drops by 75% at 6 PM. In addition to these predictable spikes, the platform experiences occasional sudden viral events where traffic can spike 10× in under 2 minutes. The team wants an Auto Scaling strategy that handles BOTH the predictable daily pattern AND the sudden viral spikes with the MINIMUM manual configuration. Which combination of scaling policies is CORRECT?",
    options: [
      {
        id: "A",
        text: "Scheduled scaling actions for 8 AM, noon, and 6 PM to pre-scale the fleet, combined with target tracking scaling based on average CPU utilization to react to unplanned viral spikes.",
        isCorrect: true,
        explanation: "Correct — Scheduled scaling pre-scales the fleet BEFORE the predictable morning and noon spikes, ensuring capacity is available before load arrives (not after). Target tracking scaling continuously adjusts capacity based on a metric (CPU utilization, request count per target) and reacts automatically to unplanned events like viral spikes. Together: scheduled scaling handles known patterns proactively; target tracking handles unknown/viral spikes reactively. This combination is the AWS-recommended approach for workloads with both predictable and unpredictable components."
      },
      {
        id: "B",
        text: "Target tracking scaling with a 60-second CloudWatch alarm evaluation period — it will scale fast enough to catch both predictable and viral spikes.",
        isCorrect: false,
        explanation: "Wrong — Target tracking reacts AFTER a metric threshold is crossed, which means it responds AFTER capacity is insufficient (reactive, not proactive). For predictable 8 AM spikes, the fleet would spend the first 3–5 minutes under-provisioned (CloudWatch alarm + instance launch time). Scheduled scaling solves this by adding capacity BEFORE the spike occurs."
      },
      {
        id: "C",
        text: "Predictive scaling based on ML forecasts — it learns the daily pattern and pre-provisions capacity automatically.",
        isCorrect: false,
        explanation: "Wrong — Predictive scaling uses ML on 14-day historical data to forecast demand up to 48 hours ahead, which handles predictable daily patterns. However, it does NOT respond to sudden viral events that have no historical precedent. For viral spikes, a reactive policy (target tracking or step scaling) is still needed. Predictive scaling alone leaves the viral spike unaddressed."
      },
      {
        id: "D",
        text: "Step scaling with CloudWatch alarms at 50% CPU (add 5 instances), 75% CPU (add 10 instances), and 90% CPU (add 20 instances) — the steps handle both patterns.",
        isCorrect: false,
        explanation: "Wrong — Step scaling is reactive (responds after CPU thresholds are breached). For predictable 8 AM spikes, the fleet is under-provisioned until CPU crosses the 50% threshold + CloudWatch alarm evaluation time + instance launch time (~3–8 minutes). Step scaling also doesn't proactively handle predictable patterns. For most use cases, target tracking is simpler and more precise than step scaling."
      }
    ],
    explanation: "Auto Scaling policy selection guide: Target tracking = continuously adjusts to maintain a metric target (e.g., 50% CPU, 1000 req/target); simplest and most common reactive policy. Step scaling = CloudWatch alarm with configurable step adjustments; more granular than target tracking but more configuration. Scheduled scaling = time-based, proactive pre-scaling for known traffic patterns. Predictive scaling = ML-based 48-hour forecast from 14-day history, proactive for cyclical loads. Combination pattern: Scheduled (proactive, for known patterns) + Target Tracking (reactive, for unknown spikes) = best of both worlds with minimal configuration.",
    keywords: ["scheduled scaling", "target tracking", "step scaling", "proactive vs reactive", "viral spike", "predictable traffic pattern"]
  },

  // ── d2-054 ── difficulty 4 ── Elastic Beanstalk deployment policies ── taskStatement 2.1
  {
    id: "d2-054",
    domain: 2,
    taskStatement: "2.1",
    services: ["beanstalk", "alb", "auto-scaling"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "An e-commerce application runs on AWS Elastic Beanstalk with 20 EC2 instances behind an Application Load Balancer. During the previous deployment, the team used 'All at once' and experienced 4 minutes of downtime. Requirements for the next deployment: ZERO downtime during deployment, the ability to INSTANTLY ROLL BACK if the new version causes errors (without waiting for instances to re-deploy), and no additional compute cost during the deployment. Which Elastic Beanstalk deployment policy meets ALL three requirements?",
    options: [
      {
        id: "A",
        text: "Rolling deployment — updates instances in batches, maintaining partial availability. Zero downtime and no extra instances.",
        isCorrect: false,
        explanation: "Wrong — Rolling deployment achieves zero downtime (instances updated in batches, healthy instances serve traffic) and has no extra compute cost. However, instant rollback is NOT available — rolling back requires re-deploying the previous version through the same rolling process (another 10–20 minutes). Rolling does not satisfy the 'instant rollback' requirement."
      },
      {
        id: "B",
        text: "Immutable deployment — launches a full set of 20 new instances in a separate Auto Scaling group alongside the current 20 instances, performs health checks, then swaps all at once. Rollback = delete the new ASG instantly.",
        isCorrect: false,
        explanation: "Wrong — Immutable deployment achieves zero downtime AND instant rollback (delete the new ASG to revert immediately). However, it DOUBLES compute costs during deployment (40 instances running simultaneously: 20 old + 20 new). The question requires no additional compute cost, which immutable fails."
      },
      {
        id: "C",
        text: "Rolling with additional batch — adds a new batch of instances first, then rolls updates through in batches. Maintains full capacity throughout. Instant rollback by redeploying previous version.",
        isCorrect: false,
        explanation: "Wrong — Rolling with additional batch maintains full 20-instance capacity throughout (adds 1 batch extra during the transition, then removes it). It achieves zero downtime and full capacity, but like basic Rolling, rollback requires re-deploying the previous version through another batch deployment — not instant."
      },
      {
        id: "D",
        text: "Blue/Green deployment — deploy a new Elastic Beanstalk environment (green) alongside the existing one (blue), validate, then use Route 53 or Elastic Beanstalk 'Swap Environment URLs' to shift traffic. Rollback = swap URLs back instantly.",
        isCorrect: true,
        explanation: "Correct — Blue/Green in Elastic Beanstalk deploys an entirely new environment (same configuration, new version). Traffic is shifted to green via 'Swap Environment URLs' (Elastic Beanstalk built-in) or Route 53 weighted routing. If the new version fails: swap URLs back immediately (instant rollback, seconds). Zero downtime during deployment (blue continues serving 100% traffic until swap). Zero additional ongoing cost (blue environment is swapped OUT, then can be terminated). The separate environment also serves as a staging validation environment before cutover."
      }
    ],
    explanation: "Elastic Beanstalk deployment policies: All at once = fastest, causes downtime; Rolling = no downtime, no extra cost, slow rollback; Rolling with additional batch = no downtime, no capacity loss, extra instances during transition, slow rollback; Immutable = no downtime, instant rollback, 2× cost during deployment; Blue/Green = no downtime, instant rollback via URL swap, no extra cost after swap (terminate blue). The three requirements (zero downtime + instant rollback + no extra cost) uniquely identify Blue/Green. Immutable satisfies 1 and 2 but fails 3. Rolling satisfies 1 and 3 but fails 2.",
    keywords: ["Elastic Beanstalk Blue/Green", "Swap Environment URLs", "instant rollback", "zero downtime", "no extra cost", "deployment policies"]
  },

  // ── d2-055 ── difficulty 4 ── CloudFormation StackSets multi-account ── taskStatement 2.2
  {
    id: "d2-055",
    domain: 2,
    taskStatement: "2.2",
    services: ["cloudformation", "organizations", "iam"],
    constraintType: "ops",
    difficulty: 4,
    type: "single",
    stem: "A large enterprise has 150 AWS accounts in AWS Organizations. The security team needs to deploy a standard CloudWatch log retention policy (set all Log Groups to 90-day retention) and a centralized GuardDuty detector across ALL 150 accounts and FIVE regions simultaneously. Deployments must automatically propagate to NEW accounts as they join the organization. Manual deployment per account is NOT permitted. Which CloudFormation feature implements this?",
    options: [
      {
        id: "A",
        text: "AWS CloudFormation Stack in each account, with a master account deploying stacks via cross-account IAM roles manually triggered.",
        isCorrect: false,
        explanation: "Wrong — Deploying individual stacks per account and region (150 accounts × 5 regions = 750 stacks) requires manual work per account and does not automatically propagate to new accounts. This is the exact problem StackSets solves."
      },
      {
        id: "B",
        text: "AWS CloudFormation StackSets with 'Service-Managed Permissions' targeting the entire AWS Organization or specific Organizational Units — automatically deploys to all current accounts and to new accounts as they join.",
        isCorrect: true,
        explanation: "Correct — CloudFormation StackSets enable deploying a single CloudFormation template to MULTIPLE accounts and regions simultaneously. With SERVICE-MANAGED permissions (uses AWS Organizations trust, no manual role creation required), you can target the entire organization, specific OUs, or individual accounts. Crucially, enabling 'automatic deployment' in StackSets deploys stack instances to NEW accounts as they join the target OU or organization — eliminating manual onboarding steps. The administrator account manages all instances from one StackSet."
      },
      {
        id: "C",
        text: "AWS Service Control Policies (SCPs) in AWS Organizations — deploy CloudWatch and GuardDuty configurations as policy-enforced settings across all accounts.",
        isCorrect: false,
        explanation: "Wrong — SCPs define PERMISSION boundaries (what actions are allowed or denied) — they are IAM policy controls, not resource deployment tools. SCPs cannot create CloudWatch Log Groups, set retention policies, or enable GuardDuty detectors. Resource deployment requires a provisioning service (CloudFormation, CDK, Control Tower customizations)."
      },
      {
        id: "D",
        text: "AWS Config with a custom conformance pack that auto-remediates non-compliant Log Group retention settings using Lambda.",
        isCorrect: false,
        explanation: "Wrong — AWS Config conformance packs detect and report compliance (are Log Groups non-compliant?) and can auto-remediate with SSM Automation or Lambda. However, for deploying initial GuardDuty detectors and initial log retention settings across all accounts, Config is reactive (reacts after a violation) while StackSets is proactive (deploys the resource before any non-compliance can occur). StackSets is the better answer for initial deployment at scale."
      }
    ],
    explanation: "CloudFormation StackSets is the correct tool for deploying IaC templates across multiple accounts and regions simultaneously. Key features: Self-managed permissions = manually create IAM roles in each target account (AWSCloudFormationStackSetAdministrationRole + AWSCloudFormationStackSetExecutionRole). Service-managed permissions = integrates with AWS Organizations, no manual role creation, and supports automatic deployment to new accounts. Automatic deployment option = when enabled, new accounts added to targeted OUs automatically receive the stack instance. Max concurrent deployments and failure tolerance are configurable. StackSets also support drift detection to identify configuration drift across all instances.",
    keywords: ["CloudFormation StackSets", "multi-account", "multi-region", "automatic deployment", "new accounts", "AWS Organizations"]
  },

  // ── d2-056 ── difficulty 3 ── Route 53 health check types ── taskStatement 2.2
  {
    id: "d2-056",
    domain: 2,
    taskStatement: "2.2",
    services: ["route53", "cloudwatch", "rds"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A company uses Amazon Route 53 Failover routing to fail over from a primary web application (public ALB in us-east-1) to a static S3 website in us-west-2. The operations team also wants to monitor the health of an Amazon RDS database in a PRIVATE subnet — if the database becomes unavailable, Route 53 must also trigger the failover. Which combination of Route 53 health check types is REQUIRED?",
    options: [
      {
        id: "A",
        text: "An HTTP health check on the public ALB endpoint for the web app, and an HTTP health check on the RDS private IP address for the database.",
        isCorrect: false,
        explanation: "Wrong — Route 53 health checkers are external (internet-facing) probers run from AWS points of presence worldwide. They CANNOT reach resources in private subnets (private RDS endpoints are not accessible from the public internet). An HTTP health check on a private RDS IP address would fail immediately and is architecturally incorrect."
      },
      {
        id: "B",
        text: "An HTTP/HTTPS health check on the public ALB endpoint, and a CloudWatch Alarm health check for the RDS database (CloudWatch monitors RDS DatabaseConnections metric in the private subnet and Route 53 checks the alarm state).",
        isCorrect: true,
        explanation: "Correct — Route 53 health check types: Endpoint health checks (HTTP/HTTPS/TCP) = public internet-accessible endpoints only. CloudWatch Alarm health checks = Route 53 monitors a CloudWatch alarm state; if the alarm is IN_ALARM, Route 53 marks the health check as failed. Since RDS is in a private subnet, the correct approach is: (1) create a CloudWatch alarm on RDS DatabaseConnections or RDS event notifications, and (2) create a Route 53 CloudWatch Alarm health check pointing to that alarm. This enables private resource health monitoring through Route 53 indirectly."
      },
      {
        id: "C",
        text: "A Calculated health check that combines an HTTP check on the ALB and an HTTP check on the RDS endpoint — Calculated health checks aggregate multiple sub-checks.",
        isCorrect: false,
        explanation: "Wrong — A Calculated health check (also called a composite health check) aggregates up to 256 child health checks based on a threshold (e.g., 'healthy if at least 2 of 3 are healthy'). However, this doesn't solve the fundamental problem: Route 53's standard endpoint health checkers can't reach private subnet RDS. The child checks would still need to be either endpoint checks (public) or CloudWatch alarm checks (for private). The CloudWatch alarm health check is the specific type needed for private resources."
      },
      {
        id: "D",
        text: "An HTTP health check with a custom matching string that includes an RDS connectivity test response in the ALB's response body.",
        isCorrect: false,
        explanation: "Wrong — Including RDS connectivity status in the ALB response requires modifying the application to perform a DB health check on every health check request and report DB status. While this is a valid application-level design pattern, it does NOT use the Route 53 CloudWatch Alarm health check type that the question is testing. The AWS-recommended approach for private resource health monitoring through Route 53 is the CloudWatch Alarm health check."
      }
    ],
    explanation: "Route 53 health check types: (1) Endpoint health check — HTTP, HTTPS, or TCP to a public IP/hostname; Route 53's distributed probers check from 15+ global locations every 30 seconds (standard) or 10 seconds (fast). (2) CloudWatch Alarm health check — Route 53 monitors a CloudWatch alarm state; used for PRIVATE resources (RDS in private subnet, internal ELBs, on-premises resources) that Route 53 probers cannot reach directly. (3) Calculated health check — aggregates child health check results (up to 256) with threshold. For private resources behind a VPC, always use CloudWatch Alarm health checks.",
    keywords: ["Route 53 health check types", "CloudWatch Alarm health check", "private subnet", "RDS monitoring", "endpoint health check limitation"]
  },

  // ── d2-057 ── difficulty 5 ── RDS automated backup vs manual snapshot trap ── taskStatement 2.2
  {
    id: "d2-057",
    domain: 2,
    taskStatement: "2.2",
    services: ["rds", "backup", "s3"],
    constraintType: "ha",
    difficulty: 5,
    type: "single",
    stem: "A financial services company's database administrator is planning the backup strategy for a production Amazon RDS PostgreSQL database. The following statements are made about RDS backup behavior. Which statement is INCORRECT?",
    options: [
      {
        id: "A",
        text: "Automated backups (backup retention period 1–35 days) enable point-in-time recovery to any second within the retention window.",
        isCorrect: false,
        explanation: "This statement is CORRECT — RDS automated backups capture daily snapshots and transaction logs every 5 minutes. Together, they enable PITR to any second within the configured retention period (1–35 days). This is a true and accurate statement."
      },
      {
        id: "B",
        text: "When you delete an RDS instance, automated backups are deleted with the instance. Manual snapshots created by the user persist indefinitely after instance deletion.",
        isCorrect: false,
        explanation: "This statement is CORRECT — RDS automated backups (the daily snapshots and transaction logs that enable PITR) are automatically deleted when the DB instance is deleted (unless you choose to create a final snapshot during deletion). Manual snapshots, created explicitly by the user or via AWS Backup, are INDEPENDENT of the DB instance lifecycle and persist indefinitely (until manually deleted). This is a critical distinction for DR planning."
      },
      {
        id: "C",
        text: "Setting the backup retention period to 0 disables automated backups entirely and also deletes all existing automated backup snapshots for that instance.",
        isCorrect: false,
        explanation: "This statement is CORRECT — Setting the RDS backup retention period to 0 disables automated backups and deletes all automated backup snapshots. Note: retention period 0 also prevents Multi-AZ (you cannot enable Multi-AZ on an RDS instance with retention period 0 for Oracle and SQL Server in some configurations). This is a true statement."
      },
      {
        id: "D",
        text: "Automated backups are stored in Amazon S3 and are accessible in the S3 console — you can download the raw backup files for migration or analysis.",
        isCorrect: true,
        explanation: "This statement is INCORRECT — RDS automated backups ARE stored in Amazon S3, but they are stored in AWS-managed S3 buckets that are NOT visible or accessible in your S3 console. You cannot download raw RDS backup files. You can only restore automated backups via the RDS console/API/CLI (PITR restore). To get data out of RDS backups, you restore to a new DB instance and then export or copy data. This is the INCORRECT statement."
      }
    ],
    explanation: "TRAP: RDS automated backups are stored in S3 but in AWS-internal buckets, NOT in your own S3 bucket. You cannot access them via the S3 console or download raw backup files. This is a common misconception. The correct recovery path for automated backups is: restore to a new DB instance via the RDS console/CLI. Key RDS backup facts: automated backups = deleted with the instance (unless final snapshot taken during deletion); manual snapshots = persist indefinitely after instance deletion; retention 0 = disables automated backups; PITR = any second within retention window using daily snapshots + transaction logs.",
    keywords: ["automated backups deleted with instance", "manual snapshots persist", "S3 not accessible", "backup retention 0", "PITR"]
  },

  // ── d2-058 ── difficulty 4 ── DynamoDB GSI vs LSI consistency trap ── taskStatement 2.1
  {
    id: "d2-058",
    domain: 2,
    taskStatement: "2.1",
    services: ["dynamodb"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A fintech application uses an Amazon DynamoDB table with partition key 'accountId' and sort key 'transactionDate'. The team needs to add two new access patterns: (1) query transactions by 'merchantId' (a non-key attribute) with a specific 'transactionDate' range — these queries can tolerate slight staleness (eventual consistency is acceptable), and (2) query by 'accountId' and a different sort key 'transactionAmount' with STRONGLY CONSISTENT reads. Which index combination is REQUIRED, and what constraint applies?",
    options: [
      {
        id: "A",
        text: "Two Global Secondary Indexes (GSIs) — one with partition key 'merchantId' and sort key 'transactionDate', and one with partition key 'accountId' and sort key 'transactionAmount'. GSIs support strongly consistent reads for Query 2.",
        isCorrect: false,
        explanation: "Wrong — Global Secondary Indexes only support EVENTUALLY CONSISTENT reads. Strongly consistent reads are NOT supported on GSIs. Query 2 requires strongly consistent reads with the same partition key ('accountId') — this requires a Local Secondary Index (LSI), not a GSI."
      },
      {
        id: "B",
        text: "A Global Secondary Index (GSI) with partition key 'merchantId' and sort key 'transactionDate' for Query 1, and a Local Secondary Index (LSI) with the same partition key 'accountId' and sort key 'transactionAmount' for Query 2. LSIs support both eventually and strongly consistent reads.",
        isCorrect: true,
        explanation: "Correct — GSIs use a different partition key than the base table, enabling Query 1 ('merchantId' as PK). GSIs always return eventually consistent results (acceptable for Query 1). LSIs use the SAME partition key as the base table ('accountId') but a different sort key ('transactionAmount'). LSIs support both eventually consistent and strongly consistent reads — enabling Query 2's strongly consistent requirement. Critical constraint: LSIs MUST be created when the table is first created and CANNOT be added later."
      },
      {
        id: "C",
        text: "Two Local Secondary Indexes (LSIs) — one with sort key 'transactionDate' (same as base table but different PK) and one with sort key 'transactionAmount'. LSIs can have any partition key.",
        isCorrect: false,
        explanation: "Wrong — LSIs must use the SAME partition key as the base table. You cannot define an LSI with a different partition key. Query 1 requires 'merchantId' as the partition key (different from the base table's 'accountId'), which requires a GSI. An LSI with a different partition key is architecturally impossible."
      },
      {
        id: "D",
        text: "A single GSI with a composite key (merchantId + transactionDate) and a Scan with a filter expression for transactionAmount — Scan is more flexible than secondary indexes.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB Scans read the ENTIRE table and filter client-side, consuming all provisioned read capacity. For large tables, this is extremely expensive and slow. Scan is an anti-pattern for production query access patterns. Secondary indexes (GSI/LSI) are the correct solution for non-primary-key access patterns."
      }
    ],
    explanation: "DynamoDB index types: GSI (Global Secondary Index) = different partition key + optional sort key; can be added at any time; only EVENTUALLY CONSISTENT reads; has its own provisioned or on-demand throughput; 20 GSIs max per table. LSI (Local Secondary Index) = SAME partition key as base table + different sort key; MUST be created at table creation (cannot add later); supports BOTH strongly consistent and eventually consistent reads; shares table's read capacity; 5 LSIs max per table; 10 GB limit per partition key value (item collection). The critical distinction: strongly consistent reads on an index → must use LSI (not possible with GSI).",
    keywords: ["GSI eventual consistency only", "LSI strongly consistent reads", "LSI same partition key", "LSI at table creation only", "DynamoDB index selection"]
  },

  // ── d2-059 ── difficulty 3 ── Aurora clone vs restore vs backtrack ── taskStatement 2.2
  {
    id: "d2-059",
    domain: 2,
    taskStatement: "2.2",
    services: ["aurora", "rds"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A development team needs to create an isolated copy of their production Amazon Aurora MySQL database for performance testing. The test database must initially contain the SAME DATA as production, must be provisioned in UNDER 5 MINUTES, and must NOT affect production database performance or storage costs (the copy should not consume a full 500 GB of separate storage immediately). Which Aurora feature is MOST appropriate?",
    options: [
      {
        id: "A",
        text: "Create an Aurora Read Replica from the production cluster, then promote it — the replica shares storage with the primary cluster.",
        isCorrect: false,
        explanation: "Wrong — Promoting a Read Replica creates a new independent cluster that no longer shares Aurora storage — it provisions its own copy of the data. The promotion process takes several minutes, and once promoted, storage is independent. Also, promoting a production Read Replica to use as a test instance removes a production replica (reducing HA headroom)."
      },
      {
        id: "B",
        text: "Aurora Fast Clone — creates a copy-on-write clone of the cluster in seconds to minutes, sharing the original storage pages until modified. The clone only consumes storage for data that diverges from production.",
        isCorrect: true,
        explanation: "Correct — Aurora Fast Clone uses a copy-on-write mechanism at the storage layer. The clone initially points to the SAME physical storage pages as the source cluster — no data is copied at clone creation time. The clone provisions in seconds to minutes (depending on instance start time). Additional storage is consumed only as the clone or source modifies pages (copy-on-write). This means initial storage cost is near-zero, and the clone is fully isolated from production (writes to the clone don't affect production). Aurora Cloning is available within the same Aurora cluster or to a different account."
      },
      {
        id: "C",
        text: "Restore from the latest automated backup snapshot to a new Aurora cluster — snapshots are stored in S3 and restore quickly.",
        isCorrect: false,
        explanation: "Wrong — Restoring from a snapshot creates a new Aurora cluster from a full copy of the data, which takes 5–30 minutes depending on database size (500 GB). It also immediately consumes the full 500 GB of storage in the new cluster. This is slower and more expensive than Aurora Cloning for creating a test copy."
      },
      {
        id: "D",
        text: "Use Aurora Backtrack to rewind the production cluster to yesterday's state for testing, then roll it forward after testing.",
        isCorrect: false,
        explanation: "Wrong — Aurora Backtrack rewinds the EXISTING cluster in place — it would roll back the production database, affecting production users. Backtrack is not for creating isolated test copies; it is for in-place recovery from accidental data mutations (DROP TABLE, accidental DELETE). It would be catastrophic to use Backtrack on a production cluster for testing."
      }
    ],
    explanation: "Aurora Fast Clone key facts: uses copy-on-write storage mechanism — clone and source share physical storage pages until either side modifies a page, at which point a new page copy is created for the modifier. Cloning is fast (seconds to minutes, regardless of database size). Initial storage overhead is near-zero (only divergent pages are billed). Fully isolated: writes to clone don't affect source. Available within an AWS account and cross-account. Use cases: dev/test environment, schema experiments, data analysis isolation. Compare: Snapshot restore = full data copy (slow, full storage consumption). Read Replica = async replication (live, not isolated). Backtrack = in-place rewind (modifies existing cluster, production risk).",
    keywords: ["Aurora Fast Clone", "copy-on-write", "no storage duplication", "5 minutes", "isolated test copy", "production-safe"]
  },

  // ── d2-060 ── difficulty 5 ── Step Functions at-least-once misconception ── taskStatement 2.1
  {
    id: "d2-060",
    domain: 2,
    taskStatement: "2.1",
    services: ["step-functions", "lambda", "dynamodb"],
    constraintType: "ops",
    difficulty: 5,
    type: "single",
    stem: "An architect is designing a payment processing workflow using AWS Step Functions Express Workflows. A team member states: 'Since we're using Express Workflows, the workflow is lightweight and cost-effective. Because they run synchronously, each payment transaction will be executed EXACTLY ONCE — there's no risk of duplicate charges even if the caller retries the StartExecution API.' A senior engineer disagrees. Which response CORRECTLY identifies the flaw?",
    options: [
      {
        id: "A",
        text: "The team member is correct — Synchronous Express Workflows guarantee exactly-once execution because the client waits for the response and there is no asynchronous retry mechanism.",
        isCorrect: false,
        explanation: "Wrong — Synchronous Express Workflows return a result synchronously (the StartSyncExecution API call blocks until completion), but the EXECUTION SEMANTICS are still at-least-once. If the workflow fails mid-execution and is retried by the application, the workflow may execute again — potentially triggering duplicate downstream actions. The synchronous return behavior affects the API call pattern, not the execution guarantee."
      },
      {
        id: "B",
        text: "The flaw is that Express Workflows have AT-LEAST-ONCE execution semantics — a workflow may execute more than once for the same input if errors or retries occur. For exactly-once payment processing, Standard Workflows must be used, or the Lambda functions must be idempotent (e.g., using a unique transaction ID stored in DynamoDB to detect and skip duplicate charges).",
        isCorrect: true,
        explanation: "Correct — AWS Step Functions Express Workflows guarantee AT-LEAST-ONCE execution semantics, not exactly-once. The team member's claim is false. Standard Workflows guarantee exactly-once execution per state transition. For payment processing where duplicate execution = duplicate charges, you need either: (1) Standard Workflows (exactly-once), or (2) Express Workflows with idempotent Lambda functions (check DynamoDB for the transaction ID before charging, skip if already processed). The synchronous API call pattern of Synchronous Express Workflows does NOT change the at-least-once execution guarantee."
      },
      {
        id: "C",
        text: "The flaw is that Express Workflows do not support synchronous execution — they are always asynchronous and fire-and-forget.",
        isCorrect: false,
        explanation: "Wrong — Express Workflows DO support synchronous execution via the StartSyncExecution API (returns the result inline when the workflow completes). Standard Express = asynchronous (fire-and-forget). Synchronous Express = synchronous (blocks until result). The existence of Synchronous Express Workflows is a real feature — this answer contains a false technical claim."
      },
      {
        id: "D",
        text: "The flaw is that Express Workflows have a 15-minute maximum execution duration, which may be insufficient for payment processing.",
        isCorrect: false,
        explanation: "Wrong — Express Workflows support a maximum duration of 5 minutes (not 15 minutes — 15 minutes is the Lambda function timeout). For typical payment processing (milliseconds to seconds), 5 minutes is ample. The critical flaw in the team member's statement is the incorrect claim about exactly-once semantics, not the duration limit."
      }
    ],
    explanation: "TRAP: Express Workflows = AT-LEAST-ONCE (not exactly-once). Standard Workflows = exactly-once per state transition. This is the most important Step Functions exam trap. Synchronous Express Workflows (StartSyncExecution) return results synchronously but still have at-least-once semantics. For financial transactions, idempotency must be built into Lambda functions: use a unique transaction ID as a DynamoDB conditional write to ensure each transaction is processed exactly once. Express Workflow max duration = 5 minutes. Standard Workflow max duration = 1 year.",
    keywords: ["Express Workflow at-least-once", "Standard exactly-once", "idempotent Lambda", "duplicate payment trap", "synchronous express misconception"]
  },

  // ── d2-061 ── difficulty 3 ── API Gateway WebSocket API ── taskStatement 2.1
  {
    id: "d2-061",
    domain: 2,
    taskStatement: "2.1",
    services: ["api-gateway", "lambda", "dynamodb"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A gaming company is building a real-time multiplayer game lobby where players can see when other players join, leave, or update their status. The backend must maintain PERSISTENT BIDIRECTIONAL connections between the game client and the server, push status updates to ALL connected clients whenever any player's state changes, and allow the backend to PROACTIVELY PUSH messages to clients without the client polling. Which Amazon API Gateway API type is designed for this use case?",
    options: [
      {
        id: "A",
        text: "Amazon API Gateway REST API with long polling — clients hold open connections for up to 29 seconds, receiving updates when available.",
        isCorrect: false,
        explanation: "Wrong — REST API long polling is a polling mechanism (client initiates each request, waits for server response within timeout). It does not provide true persistent bidirectional connections. The server cannot PROACTIVELY push to a client without a pending request. Long-polling also adds latency (up to the polling interval) and is less efficient than WebSockets for real-time bidirectional communication."
      },
      {
        id: "B",
        text: "Amazon API Gateway WebSocket API — maintains persistent stateful connections, routes incoming messages to Lambda handlers by route selection expression, and allows the backend to proactively push to connected clients via the connection management API.",
        isCorrect: true,
        explanation: "Correct — API Gateway WebSocket API is designed for real-time bidirectional communication. Each connected client gets a unique connectionId. Lambda is triggered on connection ($connect), disconnection ($disconnect), and custom message routes. The backend can PROACTIVELY push messages to any connected client by calling the API Gateway Management API (POST to /@connections/{connectionId}). Connection IDs are typically stored in DynamoDB for the backend to look up which clients to notify when state changes."
      },
      {
        id: "C",
        text: "Amazon API Gateway HTTP API with Server-Sent Events (SSE) — the server can push events to the client over a long-lived HTTP connection.",
        isCorrect: false,
        explanation: "Wrong — Server-Sent Events (SSE) is a one-way server-to-client push mechanism over HTTP. It is unidirectional (server → client only) and is not natively supported as an API Gateway integration pattern. API Gateway HTTP API has a 30-second integration timeout, which is incompatible with long-lived SSE connections. WebSocket API is the correct choice for bidirectional communication."
      },
      {
        id: "D",
        text: "Amazon API Gateway REST API with GraphQL subscriptions — GraphQL is natively supported in REST API and provides real-time data updates.",
        isCorrect: false,
        explanation: "Wrong — REST API does not natively support GraphQL. GraphQL with real-time subscriptions is provided by AWS AppSync, not API Gateway REST API. API Gateway REST API implements REST patterns (request/response), not GraphQL subscriptions."
      }
    ],
    explanation: "API Gateway API types: REST API = request/response, HTTP/HTTPS, rich features (caching, usage plans, mapping templates). HTTP API = request/response, cheaper, JWT/OIDC native, simpler. WebSocket API = persistent bidirectional connections, proactive push to clients, connectionId-based routing, Lambda/HTTP/mock integrations, $connect/$disconnect/$default route keys. WebSocket use cases: real-time chat, gaming lobbies, live dashboards, collaborative editing, financial tickers. Backend push pattern: store connectionIds in DynamoDB; on state change, iterate connectionIds and POST to `https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/@connections/{connectionId}`.",
    keywords: ["WebSocket API", "persistent bidirectional", "proactive push", "connectionId", "real-time multiplayer", "API Gateway types"]
  },

  // ── d2-062 ── difficulty 4 ── S3 versioning + MFA Delete ── taskStatement 2.2
  {
    id: "d2-062",
    domain: 2,
    taskStatement: "2.2",
    services: ["s3", "iam"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A media company stores video master files in an Amazon S3 bucket. An accidental `aws s3 rm` command deleted 50 objects from the bucket last week. The operations team wants to prevent accidental or rogue permanent deletions going forward, while still allowing authorized operations to DELETE specific VERSION IDs when needed (legal purge requests). Which S3 configuration PREVENTS accidental permanent deletions while allowing AUTHORIZED version-specific deletions?",
    options: [
      {
        id: "A",
        text: "Enable S3 versioning on the bucket — when an object is deleted without specifying a version ID, S3 inserts a Delete Marker instead of permanently removing data, preserving all previous versions.",
        isCorrect: false,
        explanation: "Correct on the Delete Marker behavior, but INCOMPLETE for the requirement. With versioning enabled, a delete without a version ID adds a Delete Marker (recoverable). However, if an operator runs `aws s3api delete-object --bucket X --key Y --version-id Z`, it permanently deletes that version. This does not add protection against operators with s3:DeleteObjectVersion permission permanently removing versions. The question asks for ADDITIONAL protection beyond just versioning."
      },
      {
        id: "B",
        text: "Enable S3 versioning with MFA Delete — requires the root account + a registered MFA device to permanently delete a specific version ID or change the versioning state. Accidental AWS CLI deletes without version IDs add Delete Markers only; permanently removing a version requires MFA authentication.",
        isCorrect: true,
        explanation: "Correct — S3 versioning + MFA Delete requires Multi-Factor Authentication to perform two operations: (1) permanently delete a specific object version (delete-object with version-id), and (2) change the bucket versioning state (suspend/re-enable). Without the MFA token, s3:DeleteObjectVersion calls fail even for bucket owners. This prevents rogue scripts or compromised credentials from permanently deleting versions. Authorized legal purges still work — the operator provides the MFA token. MFA Delete must be enabled via the AWS CLI by the bucket owner (root account)."
      },
      {
        id: "C",
        text: "Apply an S3 Object Lock in Governance mode with a 1-year retention period — no versions can be deleted during the retention window.",
        isCorrect: false,
        explanation: "Wrong — S3 Object Lock with Governance mode prevents deletion within the retention period, but it also prevents ALL deletions (including authorized legal purges) unless the operator has the s3:BypassGovernanceRetention permission. More importantly, Object Lock requires a fixed retention period — videos with no retention requirement would be locked unnecessarily. MFA Delete is more flexible: it adds an authentication gate to version deletion without an immutability window."
      },
      {
        id: "D",
        text: "Configure an S3 bucket policy that denies s3:DeleteObject for all principals except a specific IAM role used by the legal team.",
        isCorrect: false,
        explanation: "Wrong — A bucket policy restricting s3:DeleteObject protects against non-version-specific deletes, but it does not protect against deletion of specific version IDs (s3:DeleteObjectVersion). A rogue insider or compromised credential with s3:DeleteObjectVersion permission can still permanently delete versions. MFA Delete adds a second factor for version deletion that a bucket policy alone cannot provide."
      }
    ],
    explanation: "S3 versioning + MFA Delete: Versioning alone protects against overwrites (creates new versions) and non-version-specific deletes (adds Delete Marker instead of permanent removal). MFA Delete adds a second-factor gate to: (1) permanently delete a specific version ID, and (2) change versioning state (suspend/re-enable). Must be enabled by the bucket owner using root account credentials (only root can enable/disable MFA Delete). Only the root account can make MFA-authenticated DeleteObjectVersion calls. This combination protects against accidental rm commands (Delete Marker) AND rogue version deletion (MFA required). Limitation: MFA Delete requires CLI usage by root — console UI doesn't support the MFA challenge for version deletion.",
    keywords: ["S3 versioning", "MFA Delete", "Delete Marker", "permanent version deletion", "root account", "accidental deletion protection"]
  },

  // ── d2-063 ── difficulty 4 ── CloudFormation change sets and drift detection ── taskStatement 2.2
  {
    id: "d2-063",
    domain: 2,
    taskStatement: "2.2",
    services: ["cloudformation", "sns"],
    constraintType: "ops",
    difficulty: 4,
    type: "single",
    stem: "A DevOps team manages a critical production CloudFormation stack with 150 resources. Before applying an infrastructure update, the team lead wants to PREVIEW which resources will be added, modified, or deleted WITHOUT making any changes. Additionally, the security team reports that someone modified an EC2 security group manually through the console 3 days ago — the team needs to DETECT which stack resources have been modified outside of CloudFormation. Which CloudFormation features address these two requirements?",
    options: [
      {
        id: "A",
        text: "CloudFormation Change Sets (preview proposed changes without applying) and CloudFormation Drift Detection (compare current resource configurations against the stack template to identify out-of-band changes).",
        isCorrect: true,
        explanation: "Correct — CloudFormation Change Sets: create a change set from a modified template to preview what will be added (Add), modified (Modify — direct/indirect replacement), or removed (Remove) from the stack. The change set is not executed until you choose to execute it. CloudFormation Drift Detection: compares the current actual configuration of stack resources against the expected configuration in the template. Resources modified outside CloudFormation (console, CLI, API) are flagged as DRIFTED with the specific property differences shown. Both are read-only operations that provide visibility without making changes."
      },
      {
        id: "B",
        text: "CloudFormation Stack Policies (prevent accidental resource modification) and CloudFormation Rollback Triggers (detect and roll back failed deployments).",
        isCorrect: false,
        explanation: "Wrong — Stack Policies control which resources can be updated/replaced during a stack UPDATE — they don't preview future changes. Rollback Triggers monitor CloudWatch alarms during deployment and trigger automatic rollback if alarms fire — they don't preview changes or detect manual configuration drift. Neither feature addresses the two stated requirements."
      },
      {
        id: "C",
        text: "AWS Config with CloudFormation-specific rules (detect manual changes) and CloudFormation StackSets (deploy the same template to verify no differences across all regions).",
        isCorrect: false,
        explanation: "Wrong — AWS Config can detect resource configuration changes (including changes to EC2 security groups) via configuration history, but it is not the CloudFormation-native drift detection mechanism. CloudFormation Drift Detection is the purpose-built tool for identifying resources modified outside of CloudFormation management. StackSets are for multi-account/region deployment, not single-stack change preview."
      },
      {
        id: "D",
        text: "CloudFormation Rollback Configuration (previews changes, then auto-rolls back if monitors fail) and CloudFormation StackSets drift detection.",
        isCorrect: false,
        explanation: "Wrong — Rollback Configuration sets CloudWatch alarms that trigger automatic rollback if they fire during or after a stack update — it doesn't preview changes before executing. StackSets have their own drift detection for stack instances across accounts/regions, not for a single stack's resource-level drift."
      }
    ],
    explanation: "Two distinct CloudFormation operational features: Change Sets = preview-before-apply for stack updates (create → review → execute pattern). Shows action type (Add/Modify/Remove), resource type, and logical ID for each change. Replacement field indicates if a resource will be replaced (interruption). Drift Detection = detect out-of-band manual modifications. Compares current resource configuration to template-defined configuration. Drift states: DRIFTED (resource differs from template), NOT_CHECKED, IN_SYNC. Available for most resource types (EC2 instances, security groups, S3 buckets, IAM roles, etc.). Can detect drift at stack level or individual resource level.",
    keywords: ["CloudFormation Change Sets", "Drift Detection", "preview changes", "out-of-band modifications", "DRIFTED resources"]
  },

  // ── d2-064 ── difficulty 3 ── Amazon MQ ActiveMQ HA modes ── taskStatement 2.2
  {
    id: "d2-064",
    domain: 2,
    taskStatement: "2.2",
    services: ["mq", "efs"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A company is deploying Amazon MQ with Apache ActiveMQ for a PRODUCTION workload requiring HIGH AVAILABILITY. The broker must automatically fail over to a standby if the primary broker fails, with no manual intervention. Messages in transit must not be lost during failover. Which Amazon MQ deployment configuration provides production-grade HA for Apache ActiveMQ?",
    options: [
      {
        id: "A",
        text: "Single-instance broker in a single Availability Zone — the broker automatically restarts if the host fails.",
        isCorrect: false,
        explanation: "Wrong — A single-instance broker provides no HA. If the host or AZ fails, the broker is unavailable until the instance is restarted. There is no automatic failover to a standby, and messages stored on the broker may be delayed. Single-instance is only suitable for development/testing."
      },
      {
        id: "B",
        text: "Amazon MQ ActiveMQ Active/Standby broker with shared Amazon EFS storage across two AZs — the active broker handles all traffic; if it fails, the standby takes over and inherits the shared message store.",
        isCorrect: true,
        explanation: "Correct — Amazon MQ ActiveMQ Active/Standby is the production HA configuration. Two broker instances (active in one AZ, standby in another AZ) share the same Amazon EFS file system as their message store. If the active broker fails, the standby broker takes over (fencing the active from EFS) and all messages persisted to EFS are immediately available on the standby. Clients reconnect using the failover transport URL, which includes both broker endpoints. This provides AZ-level resilience with no message loss for messages persisted before failure."
      },
      {
        id: "C",
        text: "Amazon MQ RabbitMQ Multi-AZ Cluster with mirrored queues — this provides equivalent HA to ActiveMQ Active/Standby.",
        isCorrect: false,
        explanation: "Wrong — Amazon MQ RabbitMQ Cluster Multi-AZ does provide production HA for RabbitMQ workloads (3-node cluster across 3 AZs with mirrored queues). However, the question asks specifically about Apache ActiveMQ HA — using RabbitMQ would require rewriting application code (different protocol: AMQP 0-9-1 vs OpenWire/AMQP 1.0/JMS). The correct ActiveMQ HA configuration is Active/Standby with shared EFS, not a RabbitMQ cluster."
      },
      {
        id: "D",
        text: "Single-instance broker with Amazon EBS storage using Multi-Attach io1 volumes — EBS replication provides data durability if the broker fails.",
        isCorrect: false,
        explanation: "Wrong — EBS Multi-Attach (io1/io2) allows multiple EC2 instances to attach the same EBS volume in the same AZ, but Amazon MQ does not use this configuration. Amazon MQ ActiveMQ uses EFS (not EBS Multi-Attach) for shared storage in the Active/Standby HA configuration. A single-instance broker with any EBS configuration does not provide automatic AZ failover."
      }
    ],
    explanation: "Amazon MQ HA configurations: ActiveMQ = Active/Standby with shared EFS (2 brokers, 2 AZs, shared message store on EFS, automatic failover via fencing). Clients use failover transport URL: `failover:(ssl://broker1:61617,ssl://broker2:61617)`. RabbitMQ = Cluster Multi-AZ (3-node cluster across 3 AZs, mirrored queues). Single-instance = dev/test only. The key mechanism for ActiveMQ HA: shared EFS message store ensures the standby can access all persisted messages immediately upon failover. Clients must be configured with both broker hostnames in the connection URL for automatic reconnection.",
    keywords: ["Amazon MQ ActiveMQ", "Active/Standby", "EFS shared storage", "AZ failover", "no message loss", "production HA"]
  },

  // ── d2-065 ── difficulty 5 ── RDS automated backup deletion trap ── taskStatement 2.2
  {
    id: "d2-065",
    domain: 2,
    taskStatement: "2.2",
    services: ["rds", "backup"],
    constraintType: "ha",
    difficulty: 5,
    type: "single",
    stem: "A startup's sole DBA terminates a production Amazon RDS MySQL instance on Friday evening, intending to restore it from backups on Monday. The RDS instance had automated backups with a 7-day retention period and THREE user-created manual snapshots taken over the past month. On Monday, the DBA attempts to restore the database. Which statement about the available recovery options is CORRECT?",
    options: [
      {
        id: "A",
        text: "Both the automated backups (7-day PITR) and all three manual snapshots are available for restore — RDS retains all backups and snapshots indefinitely when an instance is deleted.",
        isCorrect: false,
        explanation: "Wrong — This is the critical trap. Automated backups are NOT retained indefinitely when an RDS instance is deleted. By default, deleting an RDS instance ALSO DELETES all its automated backups (unless you create a final snapshot during deletion). Only manually created snapshots persist after instance deletion."
      },
      {
        id: "B",
        text: "Automated backups are deleted when the RDS instance is deleted. Only the three manual snapshots remain. PITR is not available because automated backup data no longer exists — the DBA can only restore to one of the three manual snapshot timestamps.",
        isCorrect: true,
        explanation: "Correct — When you delete an RDS DB instance, automated backups (including the PITR transaction logs) are DELETED immediately with the instance by default. If you choose to skip creating a final snapshot during deletion (or if you click 'delete without creating final snapshot'), you lose automated backup history. The three manually created snapshots are independent resources that persist after instance deletion. The DBA can restore to one of those three manual snapshot timestamps, but PITR (point-in-time recovery to any second in the last 7 days) is no longer available."
      },
      {
        id: "C",
        text: "Automated backups are retained for 7 days after instance deletion as a safety buffer, matching the retention period configuration. PITR is available for 7 more days.",
        isCorrect: false,
        explanation: "Wrong — RDS does NOT retain automated backups for the retention period after instance deletion. The 7-day retention period governs how far back you can do PITR WHILE THE INSTANCE EXISTS. Upon deletion, automated backups are deleted immediately (unless you enabled 'Automated Backup Replication' to another region, which retains cross-region backup copies). This is a common misconception."
      },
      {
        id: "D",
        text: "The DBA should restore using AWS Backup if it was configured — AWS Backup retains copies independently of RDS instance lifecycle.",
        isCorrect: false,
        explanation: "This statement is PARTIALLY correct but not applicable: if AWS Backup was configured with cross-account or vault-protected copies, those would survive instance deletion. However, the question does not mention AWS Backup being configured. Without evidence of AWS Backup, the correct answer describes what happens to standard RDS automated backups on deletion: they are deleted, and only manual snapshots remain."
      }
    ],
    explanation: "CRITICAL TRAP: RDS automated backups are DELETED when the DB instance is deleted. The only way to preserve automated backups across instance deletion is: (1) create a final snapshot during the DeleteDBInstance API call (choose 'Create final snapshot' in the console), which creates a manual snapshot you can restore from later, or (2) use AWS Backup with a backup vault that retains copies independently. Manual snapshots created before deletion ALWAYS persist — they are independent resources. Exam tip: when a question involves RDS instance deletion and recovery options, remember: automated backups → gone with the instance; manual snapshots → persist indefinitely.",
    keywords: ["automated backups deleted with instance", "manual snapshots persist", "PITR lost after deletion", "final snapshot", "recovery after deletion"]
  },

  // ── d2-066 ── difficulty 3 ── Auto Scaling predictive scaling ── taskStatement 2.1
  {
    id: "d2-066",
    domain: 2,
    taskStatement: "2.1",
    services: ["auto-scaling", "cloudwatch", "ec2"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A media streaming company has EC2 instances serving video content. Traffic follows a highly PREDICTABLE daily pattern: viewing spikes every evening 7–11 PM and drops significantly from 2–6 AM. The current target tracking policy (CPU at 60%) causes 8–12 minutes of degraded performance at the start of each evening spike because EC2 instances take time to launch and warm up AFTER CPU crosses the threshold. The team wants to ELIMINATE the capacity lag at spike start with MINIMUM manual configuration. Which Auto Scaling policy type solves this?",
    options: [
      {
        id: "A",
        text: "Scheduled scaling actions set for 6:45 PM (scale up) and 11:15 PM (scale down) every day — pre-scale before the evening spike.",
        isCorrect: false,
        explanation: "Wrong — Scheduled scaling works, but it requires manually setting the exact scale-up time and instance count, updating when traffic patterns shift, and managing exceptions (holidays, events). The question asks for MINIMUM manual configuration. Predictive scaling automatically learns the daily pattern from 14-day history."
      },
      {
        id: "B",
        text: "Amazon EC2 Auto Scaling Predictive Scaling — uses ML-based 14-day traffic history to forecast demand 48 hours ahead and pre-provisions instances BEFORE load arrives, eliminating the reactive lag.",
        isCorrect: true,
        explanation: "Correct — Predictive Scaling uses machine learning trained on up to 14 days of CloudWatch metrics (CPU utilization, network, request count) to produce a 48-hour demand forecast. It pre-launches instances BEFORE the forecasted load increase — typically 5–10 minutes before the spike. This eliminates the reactive lag (CPU must spike → alarm → launch → warm up) that target tracking alone causes. Predictive scaling can run in 'forecast only' mode (no actual scaling) for validation before enabling scale-out. It pairs well with target tracking (predictive handles predictable patterns; target tracking handles unexpected deviations)."
      },
      {
        id: "C",
        text: "Step scaling with multiple CloudWatch alarms at CPU thresholds 40%, 60%, 80% — earlier thresholds trigger scaling sooner, reducing the lag.",
        isCorrect: false,
        explanation: "Wrong — Step scaling with lower CPU thresholds triggers scaling sooner but still REACTS AFTER load arrives. If CPU must reach 40% before scaling starts, there's still a lag period between traffic starting to spike and the 40% threshold being breached, plus CloudWatch evaluation time (typically 1 alarm period = 60 seconds) + EC2 launch time (~2–5 minutes). Step scaling cannot fundamentally eliminate reactive lag for a predictable pattern."
      },
      {
        id: "D",
        text: "Increase the minimum capacity of the Auto Scaling group to handle peak load 24/7 — no scaling needed, no lag.",
        isCorrect: false,
        explanation: "Wrong — Keeping peak capacity 24/7 eliminates performance lag but runs full capacity during the 2–6 AM low-traffic window, wasting compute costs. This is the most expensive approach and defeats the purpose of Auto Scaling. Predictive scaling achieves low lag with appropriate capacity at each time of day."
      }
    ],
    explanation: "EC2 Auto Scaling Predictive Scaling is purpose-built for predictable cyclical workloads (daily peaks, weekly patterns). Key features: trains on 14 days of CloudWatch metric history (CPU utilization, application-level metrics), generates 48-hour forecasts updated every 24 hours, pre-provisions capacity 5–10 minutes before forecasted need, supports forecast-only mode for validation. Best used in combination with target tracking: predictive = handles predictable pattern proactively; target tracking = handles unexpected deviations reactively. When the question describes 'predictable daily pattern + reactive lag + minimum manual config,' predictive scaling is the answer.",
    keywords: ["Predictive Scaling", "ML-based forecast", "pre-provision", "predictable daily pattern", "eliminate reactive lag", "14-day history"]
  },

  // ── d2-067 ── difficulty 4 ── DynamoDB LSI creation constraint ── taskStatement 2.1
  {
    id: "d2-067",
    domain: 2,
    taskStatement: "2.1",
    services: ["dynamodb"],
    constraintType: "ops",
    difficulty: 4,
    type: "single",
    stem: "A team has a production Amazon DynamoDB table (partition key: 'customerId', sort key: 'orderDate') containing 500 million records. After six months of production use, the team discovers a critical new query pattern: retrieve all orders for a customer sorted by 'orderTotal' (a non-key attribute) with strongly consistent reads. A developer proposes creating a Local Secondary Index (LSI) with sort key 'orderTotal' on the existing table. A senior engineer immediately rejects this. Why?",
    options: [
      {
        id: "A",
        text: "LSIs can only be created on empty tables, and the 500-million-record table is too large for an LSI rebuild.",
        isCorrect: false,
        explanation: "Partially correct reasoning but wrong framing. The real reason LSIs cannot be added is not size — it's that LSIs fundamentally CANNOT be added to an EXISTING DynamoDB table at all, regardless of the table's item count. LSIs must be defined at table creation time and cannot be added, modified, or removed afterward."
      },
      {
        id: "B",
        text: "LSIs must be created at the time the DynamoDB table is first created — they CANNOT be added to an existing table. The team must create a new table with the LSI defined and migrate 500 million records.",
        isCorrect: true,
        explanation: "Correct — This is the critical LSI constraint. Unlike GSIs (which can be added to an existing table at any time), LSIs are defined ONLY at table creation and cannot be added, modified, or deleted after the table exists. For the existing production table, the only path to adding an LSI-equivalent access pattern is: (1) create a NEW table with the LSI defined, (2) migrate all 500 million records to the new table (using DynamoDB Streams + Lambda, AWS Data Pipeline, or AWS Glue), and (3) cutover. This is a significant migration effort. Alternatively, use a GSI (can be added at any time) if eventual consistency is acceptable."
      },
      {
        id: "C",
        text: "LSIs support only eventually consistent reads — they cannot be used for the strongly consistent reads the team requires.",
        isCorrect: false,
        explanation: "Wrong — This reverses the GSI/LSI consistency facts. LSIs support BOTH strongly consistent and eventually consistent reads. GSIs support ONLY eventually consistent reads. The LSI rejection is NOT about consistency limitations — it's about the inability to add an LSI to an existing table. If consistency were the issue, LSIs would be the CORRECT choice (since they support strongly consistent reads)."
      },
      {
        id: "D",
        text: "LSIs require a different partition key than the base table — since the team wants to use 'customerId' as the same partition key, an LSI is architecturally incompatible.",
        isCorrect: false,
        explanation: "Wrong — This reverses the GSI/LSI partition key rules. LSIs must use the SAME partition key as the base table (they can only have a different sort key). GSIs can use a completely different partition key. An LSI with partition key 'customerId' and sort key 'orderTotal' is architecturally valid for this access pattern. The rejection is about the creation-time-only constraint, not partition key rules."
      }
    ],
    explanation: "DynamoDB LSI vs GSI creation constraints: LSI = MUST be created at table creation; cannot be added, modified, or removed later; up to 5 per table; shares table's read/write capacity; supports strongly consistent reads; 10 GB limit per partition key item collection. GSI = can be added to existing tables at any time; up to 20 per table; has its own dedicated read/write capacity; only eventually consistent reads. For existing production tables needing new access patterns: always use GSIs (addable anytime). If strongly consistent reads are required on a non-PK sort, you MUST design the table with LSIs from the start or create a new table.",
    keywords: ["LSI must be created at table creation", "cannot add LSI to existing table", "GSI can be added anytime", "500 million records migration", "LSI vs GSI creation constraint"]
  },

  // ── d2-068 ── difficulty 5 ── Amazon MQ not a managed SQS trap ── taskStatement 2.1
  {
    id: "d2-068",
    domain: 2,
    taskStatement: "2.1",
    services: ["mq", "sqs", "sns"],
    constraintType: "ops",
    difficulty: 5,
    type: "single",
    stem: "A cloud architect makes the following statement about AWS messaging services: 'Amazon MQ is simply a managed version of Amazon SQS — both services provide managed queuing infrastructure, so they can be used interchangeably. For any new application, you should default to Amazon MQ since it provides more protocol options than SQS.' Which response CORRECTLY identifies the flaws in this statement?",
    options: [
      {
        id: "A",
        text: "The statement is correct — Amazon MQ and Amazon SQS are functionally equivalent managed queuing services. The choice between them is purely based on cost.",
        isCorrect: false,
        explanation: "Wrong — Amazon MQ and SQS are fundamentally different services with different use cases. They are NOT interchangeable. SQS is an AWS-native service with proprietary APIs; Amazon MQ is a managed Apache ActiveMQ/RabbitMQ broker using open messaging protocols. They have different scaling models, pricing, and integration patterns."
      },
      {
        id: "B",
        text: "Flaw 1: Amazon MQ is NOT a managed SQS — it is a managed Apache ActiveMQ and RabbitMQ broker service using open protocols (JMS, AMQP, MQTT, STOMP). Flaw 2: For NEW AWS-native applications, SQS/SNS should be the DEFAULT because they are infinitely scalable, serverless, and use AWS-native APIs with no infrastructure to manage. Amazon MQ is recommended for MIGRATING existing applications that depend on JMS/AMQP/MQTT protocols to avoid rewriting code.",
        isCorrect: true,
        explanation: "Correct — The architect's statement contains two critical errors: (1) Amazon MQ is NOT a managed SQS. Amazon MQ manages message broker instances (ActiveMQ, RabbitMQ) that support open messaging protocols (JMS, AMQP 0-9-1/1.0, MQTT, STOMP, OpenWire, WSS). SQS is a fully managed, infinitely scalable, serverless queue with proprietary AWS SDK APIs. They are built on completely different architectures. (2) For NEW applications on AWS, SQS/SNS are the recommended defaults because they are truly serverless (no broker instances to size/patch), scale to unlimited messages, and cost nothing when idle. Amazon MQ is recommended when migrating existing on-premises applications that use standard broker protocols — avoiding code rewrites."
      },
      {
        id: "C",
        text: "Flaw 1: Amazon MQ only supports RabbitMQ, not Apache ActiveMQ. Flaw 2: Amazon MQ cannot be used for new applications.",
        isCorrect: false,
        explanation: "Wrong — Amazon MQ supports BOTH Apache ActiveMQ AND RabbitMQ. And while SQS/SNS are preferred for new AWS-native apps, Amazon MQ CAN be used for new applications if the development team specifically needs AMQP/MQTT/STOMP protocol support and has existing client libraries for these protocols. Both specific claims in this option are false."
      },
      {
        id: "D",
        text: "The only flaw is that Amazon MQ supports AMQP while SQS does not — they are otherwise equivalent.",
        isCorrect: false,
        explanation: "Wrong — Amazon MQ and SQS differ in far more than just protocol support. SQS is serverless (no broker instances, no instance sizing, infinite scale). Amazon MQ requires provisioning broker instances with specific compute sizes. SQS has no infrastructure to manage; Amazon MQ's brokers require patching, failover configuration (Active/Standby for HA), and storage sizing. Claiming they are 'otherwise equivalent' is fundamentally incorrect."
      }
    ],
    explanation: "Amazon MQ vs SQS/SNS decision matrix: Amazon MQ = managed Apache ActiveMQ or RabbitMQ broker; supports JMS, AMQP, MQTT, STOMP, OpenWire, WSS; requires instance sizing; has broker infrastructure to manage; ideal for MIGRATING existing apps using these protocols without code rewrites. SQS = AWS-native, serverless, infinitely scalable queue; AWS SDK only; no broker infrastructure; ideal for NEW cloud-native apps. SNS = AWS-native pub/sub. Exam rule: 'migrate from on-prem JMS/AMQP/MQTT without code changes' → Amazon MQ. 'New AWS application requiring queuing' → SQS. 'Fan-out to multiple consumers' → SNS → SQS.",
    keywords: ["Amazon MQ not managed SQS", "JMS AMQP MQTT migration", "SQS for new apps", "Amazon MQ for lift-and-shift", "protocol difference", "misconception trap"]
  },

  // ── d2-069 ── difficulty 4 ── ECR cross-account access ── taskStatement 2.1
  {
    id: "d2-069",
    domain: 2,
    taskStatement: "2.1",
    services: ["ecr", "iam", "ecs"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A large enterprise has a shared ECR repository in a central 'tools' AWS account (Account A) containing approved base images. Development teams in 50 other AWS accounts (Accounts B–Z) need to PULL images from the central ECR repository to build their own container images and deploy to ECS. The security team requires that ONLY specific IAM roles in the development accounts can access the central ECR repository, with NO IAM user keys shared. Which approach grants cross-account ECR pull access with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Create an IAM role in each of the 50 development accounts and share the access key ID/secret access key with developers for ECR authentication.",
        isCorrect: false,
        explanation: "Wrong — Sharing access key ID/secret access key for ECR authentication uses long-lived credentials, which the question prohibits. ECS task roles and CI/CD roles should assume IAM roles (temporary credentials) rather than use long-lived access keys. This is an IAM anti-pattern."
      },
      {
        id: "B",
        text: "Attach an ECR repository policy on the central repository in Account A that grants pull permissions (ecr:GetDownloadUrlForLayer, ecr:BatchGetImage, ecr:BatchCheckLayerAvailability) to specific IAM role ARNs from Accounts B–Z. Each development account's ECS task role or CI/CD role already has no cross-account role assumption needed.",
        isCorrect: true,
        explanation: "Correct — ECR supports resource-based repository policies (similar to S3 bucket policies). By attaching a repository policy to the central ECR repository in Account A that specifies the IAM role ARNs from development accounts (Accounts B–Z), those roles can authenticate to ECR and pull images using `aws ecr get-login-password` + docker pull — without any cross-account role assumption. ECS task roles and CI/CD pipeline IAM roles call ECR APIs directly; the repository policy grants them access cross-account. This is the least overhead approach: one repository policy update, no trust policy configuration in Account A, no assume-role calls needed."
      },
      {
        id: "C",
        text: "Replicate the ECR repository to each of the 50 development accounts using ECR replication — each account has its own local copy.",
        isCorrect: false,
        explanation: "Wrong — ECR supports cross-region and cross-account replication, but replicating to 50 accounts creates 50 copies of every image. This multiplies storage costs 50× and requires managing consistency across all replicas (image tags, lifecycle policies). It does NOT achieve 'centralized repository' governance. The central repository with cross-account access is the correct pattern for a shared image registry."
      },
      {
        id: "D",
        text: "Create a VPC endpoint for ECR in each development account's VPC — VPC endpoints make the central ECR accessible from development accounts without cross-account IAM policies.",
        isCorrect: false,
        explanation: "Wrong — VPC endpoints for ECR (com.amazonaws.region.ecr.dkr and com.amazonaws.region.ecr.api) route ECR traffic over the AWS private network within a single account/VPC. They do not grant cross-account access to a different account's ECR repository. IAM authorization (repository policy or IAM policy) is still required for cross-account pulls regardless of whether VPC endpoints are used."
      }
    ],
    explanation: "ECR cross-account access uses ECR resource-based repository policies (not cross-account IAM role assumption). The repository policy in Account A specifies which principals (IAM role ARNs from other accounts) can perform actions (ecr:GetDownloadUrlForLayer, ecr:BatchGetImage, ecr:BatchCheckLayerAvailability). The principal's calling account must also have IAM policy permissions. The `aws ecr get-login-password | docker login` command works cross-account when the repository policy permits the caller. Compare with cross-account S3: S3 bucket policy + calling IAM policy. ECR follows the same resource-policy pattern.",
    keywords: ["ECR repository policy", "cross-account pull", "no role assumption", "central image registry", "IAM role ARNs", "cross-account ECR access"]
  },

  // ── d2-070 ── difficulty 5 ── Aurora clone vs restore vs replicas combined ── taskStatement 2.2
  {
    id: "d2-070",
    domain: 2,
    taskStatement: "2.2",
    services: ["aurora", "rds", "s3"],
    constraintType: "ops",
    difficulty: 5,
    type: "single",
    stem: "A database architect must recommend the correct Aurora operation for THREE distinct scenarios involving an Amazon Aurora MySQL cluster: (A) The DBA ran `DELETE FROM orders WHERE 1=1` 30 minutes ago and needs to recover the data IN-PLACE without creating a new cluster, within the Backtrack window. (B) The analytics team needs an isolated copy of the database for a 3-day data science project starting NOW — the copy must provision quickly and minimally impact production storage costs. (C) An application requires an additional database endpoint that can serve read-heavy analytics queries with ~20 ms replica lag from the primary. Which combination of operations correctly addresses all three scenarios?",
    options: [
      {
        id: "A",
        text: "(A) Aurora PITR restore to a new cluster → (B) Aurora Fast Clone → (C) Aurora Read Replica",
        isCorrect: false,
        explanation: "Wrong — Scenario A specifically requires in-place recovery WITHOUT creating a new cluster. PITR always creates a new cluster, violating this requirement. Aurora Backtrack is the correct in-place operation for Scenario A (MySQL only, within 72-hour window). The answers for B and C are correct but A is wrong."
      },
      {
        id: "B",
        text: "(A) Aurora Backtrack (in-place rewind to before the DELETE, MySQL only) → (B) Aurora Fast Clone (copy-on-write, provisions in minutes, minimal initial storage) → (C) Aurora Replica (up to 15 replicas, ~10–20 ms lag, auto-promoted on failover)",
        isCorrect: true,
        explanation: "Correct — All three operations matched correctly: (A) Aurora Backtrack rewinds the EXISTING cluster in place to a timestamp before the DELETE — no new cluster created, completes in minutes, within the 72-hour window. MySQL only. (B) Aurora Fast Clone creates a copy-on-write clone sharing physical storage pages with the source — provisions in seconds to minutes, near-zero initial storage cost, fully isolated (clone writes don't affect source). (C) Aurora Replicas are up to 15 read-only replicas attached to the same Aurora shared storage — replica lag ~10–20 ms, serve read traffic via the reader endpoint, and are automatically promoted on primary failure."
      },
      {
        id: "C",
        text: "(A) Aurora Backtrack → (B) RDS Snapshot restore to a new cluster → (C) RDS Read Replica promoted to standalone",
        isCorrect: false,
        explanation: "Wrong — Scenario B using snapshot restore creates a full copy of the data (slow, full storage consumption immediately), not the copy-on-write efficiency of Aurora Fast Clone. Scenario C using an RDS Read Replica promoted to standalone would disconnect it from the cluster, creating an independent database — not a live read endpoint with ~20 ms lag. Aurora Replicas (not promoted standalone replicas) are the correct answer for Scenario C."
      },
      {
        id: "D",
        text: "(A) Aurora Backtrack → (B) Aurora Fast Clone → (C) Aurora Serverless v2 reader endpoint",
        isCorrect: false,
        explanation: "Wrong — Aurora Serverless v2 can be used as a reader (mixed-instance clusters), but 'Aurora Serverless v2 reader endpoint' is not a distinct operation — it's a cluster configuration option, not an additional replica type. The correct answer for Scenario C is adding an Aurora Replica to the cluster (provisioned reader instance) for predictable read performance and ~20 ms lag. Aurora Serverless v2 readers are valid but not the standard recommendation for 'additional read endpoint with consistent ~20 ms lag.'"
      }
    ],
    explanation: "Aurora operation selection: Backtrack = in-place rewind, MySQL only, within 72-hour window, minutes to complete, no new cluster. PITR = new cluster, all Aurora engines, any second in 35-day window, minutes to provision. Fast Clone = copy-on-write, seconds-to-minutes provisioning, near-zero initial storage overhead, isolated, same or cross-account. Aurora Replica = up to 15 readers, shared storage (no replication lag for storage reads), ~10–20 ms lag for writes, auto-promoted to primary on failure, reader endpoint load-balances across all replicas. Memorize this matrix: recovery in-place → Backtrack; recovery to new cluster → PITR; fast isolated copy → Fast Clone; read scaling with low lag → Aurora Replica.",
    keywords: ["Aurora Backtrack in-place", "Aurora Fast Clone copy-on-write", "Aurora Replica 15 replicas", "PITR new cluster", "in-place vs new cluster", "all three Aurora operations"]
  },

]
