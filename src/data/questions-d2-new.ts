import { Question } from "../lib/types"

export const domain2NewQuestions: Question[] = [
  // ── d2-011 ── difficulty 3 ── EventBridge Pipes ── taskStatement 2.1
  {
    id: "d2-011",
    domain: 2,
    taskStatement: "2.1",
    services: ["sqs", "eventbridge", "lambda", "step-functions"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A logistics company receives shipment events in an Amazon Simple Queue Service (Amazon SQS) queue. Each event must be enriched with carrier data by calling an AWS Lambda function, then routed to an AWS Step Functions state machine for processing. A senior engineer wants to wire this pipeline WITHOUT writing custom Lambda polling or glue code. Which AWS service achieves point-to-point integration with optional filtering and enrichment between the SQS source and the Step Functions target with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Create an Amazon EventBridge rule on the default event bus that triggers on SQS-related CloudTrail events and routes to the Step Functions state machine.",
        isCorrect: false,
        explanation: "Wrong — EventBridge rules on the default bus react to AWS API-level events (e.g., console actions), not to message payloads in SQS queues. You cannot route individual SQS message bodies via a standard EventBridge rule without custom intermediary code."
      },
      {
        id: "B",
        text: "Use Amazon EventBridge Pipes with the SQS queue as the source, the Lambda function as the enrichment step, and the Step Functions state machine as the target.",
        isCorrect: true,
        explanation: "Correct — EventBridge Pipes (GA December 2022) provides a managed point-to-point integration from a supported source (SQS, Kinesis, DynamoDB Streams, MSK, MQ) through an optional filter, optional enrichment (Lambda, Step Functions, API Gateway, or API destination), to a target. No polling Lambda or glue code is required. EventBridge Pipes handles SQS polling, filtering, enrichment invocation, and target delivery natively."
      },
      {
        id: "C",
        text: "Configure an SQS event source mapping on the Lambda function to consume messages and call Step Functions inside the Lambda handler.",
        isCorrect: false,
        explanation: "Wrong — This approach requires writing and maintaining the Lambda polling logic and the Step Functions StartExecution call inside the function. It works but adds custom code that EventBridge Pipes eliminates entirely."
      },
      {
        id: "D",
        text: "Enable Amazon SQS long polling and use an Amazon SNS subscription on the queue to fan out to Step Functions.",
        isCorrect: false,
        explanation: "Wrong — SQS queues cannot subscribe to SNS; it is the reverse — SNS delivers to SQS. Additionally, SNS cannot invoke Step Functions directly. This description is architecturally incorrect."
      }
    ],
    explanation: "Amazon EventBridge Pipes is purpose-built for the 'source → filter → enrich → target' integration pattern without custom glue code. Supported sources include SQS, Kinesis, DynamoDB Streams, Amazon MQ, and MSK. The enrichment step can be Lambda, Step Functions (Express), API Gateway, or an API destination. The target can be any of 20+ AWS services. This replaces the previous pattern of writing a Lambda function that polls SQS and calls downstream services.",
    keywords: ["point-to-point integration", "no glue code", "least operational overhead", "SQS to Step Functions", "enrichment"]
  },

  // ── d2-012 ── difficulty 3 ── EventBridge Scheduler ── taskStatement 2.1
  {
    id: "d2-012",
    domain: 2,
    taskStatement: "2.1",
    services: ["eventbridge", "lambda"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A fintech company needs to trigger a daily end-of-business report Lambda function at 6:00 PM in the America/New_York timezone, Monday through Friday. The company also needs to send a monthly summary email at the first of every month across 50 separate customer accounts. The solution must support millions of scheduled tasks per account and handle timezone-aware scheduling natively. Which AWS service is the RECOMMENDED approach for these scheduling requirements?",
    options: [
      {
        id: "A",
        text: "Amazon CloudWatch Events (scheduled rules) with cron expressions on the default event bus.",
        isCorrect: false,
        explanation: "Wrong — CloudWatch Events (now called EventBridge scheduled rules) use UTC only; timezone-aware scheduling requires working around UTC offset manually. AWS now recommends EventBridge Scheduler over scheduled rules for new scheduling workloads because it natively supports timezones and has much higher scale (10M schedules per account vs hundreds of rules per bus)."
      },
      {
        id: "B",
        text: "Amazon EventBridge Scheduler with timezone-aware cron expressions, one schedule per task.",
        isCorrect: true,
        explanation: "Correct — EventBridge Scheduler (GA November 2022) is the AWS-recommended service for new scheduling needs. It supports: named timezones (America/New_York, etc.), one-time and recurring cron/rate schedules, up to 10 million schedules per account by default, 270+ AWS service targets and 6,000+ API actions, flexible time windows, and DLQs for failed deliveries. It replaced scheduled EventBridge rules as the preferred path."
      },
      {
        id: "C",
        text: "AWS Step Functions Standard Workflow with a Wait state set to 24 hours between executions.",
        isCorrect: false,
        explanation: "Wrong — Using a Step Functions Wait state as a scheduling mechanism is an anti-pattern. Standard Workflows support up to 1-year execution, but running a permanent loop to schedule work wastes execution time and incurs state-transition costs. EventBridge Scheduler is purpose-built for this use case."
      },
      {
        id: "D",
        text: "An AWS Lambda function that polls the current UTC time every minute and triggers tasks when the UTC equivalent of the local schedule is reached.",
        isCorrect: false,
        explanation: "Wrong — A polling Lambda that runs every minute to check the time wastes compute, incurs Lambda and EventBridge invocation costs, and requires custom timezone offset logic. This is the exact problem EventBridge Scheduler eliminates."
      }
    ],
    explanation: "Amazon EventBridge Scheduler is the AWS-recommended scheduling service for new workloads, superseding EventBridge scheduled rules. Key advantages: native timezone support (IANA timezone database), millions of schedules per account, one-time and recurring schedules, 270+ AWS service targets, flexible time windows (reduces thundering-herd for large batch schedules), and DLQs for failed deliveries. When a question mentions timezone-aware scheduling, large numbers of scheduled tasks, or 'new scheduling workloads,' EventBridge Scheduler is the answer.",
    keywords: ["timezone scheduling", "millions of tasks", "cron", "EventBridge Scheduler", "recommended"]
  },

  // ── d2-013 ── difficulty 3 ── API Gateway REST vs HTTP API ── taskStatement 2.1
  {
    id: "d2-013",
    domain: 2,
    taskStatement: "2.1",
    services: ["api-gateway", "lambda"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A startup is building a mobile application backend using AWS Lambda functions behind Amazon API Gateway. The backend will handle 10 million API calls per month. Requirements are: JWT-based authentication using the mobile app's existing OIDC identity provider, response caching for slow database-backed endpoints, and per-client rate limiting via API keys and usage plans. The team wants to use the MOST cost-effective API Gateway option that satisfies all three requirements.",
    options: [
      {
        id: "A",
        text: "Amazon API Gateway HTTP API — it supports JWT/OIDC natively and is ~71% cheaper than REST API.",
        isCorrect: false,
        explanation: "Wrong — HTTP API supports JWT/OIDC natively and is significantly cheaper ($1.00/M vs $3.50/M), but it does NOT support response caching or API keys with usage plans. Both features are exclusive to REST API."
      },
      {
        id: "B",
        text: "Amazon API Gateway REST API — it supports response caching, API keys with usage plans, and Lambda authorizers for JWT validation.",
        isCorrect: true,
        explanation: "Correct — REST API is the only API Gateway type that supports all three requirements: (1) API response caching (TTL 0–3600s, 0.5–237 GB cache size), (2) API keys with usage plans for per-client rate limiting and throttling, and (3) JWT/OIDC authentication via a Lambda authorizer. HTTP API has neither caching nor usage plans."
      },
      {
        id: "C",
        text: "Amazon API Gateway WebSocket API — it maintains persistent connections for mobile apps and reduces request count.",
        isCorrect: false,
        explanation: "Wrong — WebSocket API is designed for persistent bidirectional communication (chat, live dashboards), not request/response mobile API patterns. It also lacks the caching and usage plan features required."
      },
      {
        id: "D",
        text: "Amazon API Gateway HTTP API with Amazon CloudFront as a caching layer in front of it.",
        isCorrect: false,
        explanation: "Wrong — Adding CloudFront provides caching but does not provide API keys with usage plans for per-client rate limiting, which is a hard requirement. CloudFront caching also behaves differently from API Gateway's built-in cache (no cache invalidation API, different TTL semantics)."
      }
    ],
    explanation: "API Gateway type selection: use HTTP API for lowest cost + JWT/OIDC + simple integrations. Use REST API when you need ANY of: response caching, API keys with usage plans (per-client monetization/throttling), mapping templates (VTL), request validation, X-Ray tracing, a private VPC endpoint, or canary deployments. The cost difference ($1/M vs $3.50/M) is the trade-off for REST API's richer feature set. When all three requirements in this question appear together, REST API is the only type that satisfies them all.",
    keywords: ["REST API vs HTTP API", "response caching", "usage plans", "API keys", "JWT", "most cost-effective"]
  },

  // ── d2-014 ── difficulty 3 ── ECS Fargate ── taskStatement 2.1
  {
    id: "d2-014",
    domain: 2,
    taskStatement: "2.1",
    services: ["ecs", "alb", "auto-scaling"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A company is migrating a Node.js microservices application consisting of 12 services to AWS. The DevOps team wants to run containers WITHOUT managing EC2 instance patching, AMI updates, or cluster capacity provisioning. Services must scale independently based on CPU utilization and must be reachable via Application Load Balancer (ALB) path-based routing. Which architecture satisfies these requirements with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Amazon ECS with EC2 launch type and an Auto Scaling group managed by AWS, with target tracking on CPU.",
        isCorrect: false,
        explanation: "Wrong — ECS EC2 launch type still requires managing the underlying EC2 instances (AMIs, patching, cluster capacity). While AWS manages the ECS control plane, the customer manages the EC2 worker fleet. This adds operational overhead."
      },
      {
        id: "B",
        text: "Amazon ECS with AWS Fargate launch type, one ECS service per microservice, Application Auto Scaling on CPU, and an ALB with path-based listener rules.",
        isCorrect: true,
        explanation: "Correct — Fargate is the serverless compute option for ECS: no EC2 to provision, patch, or scale. Each Fargate task runs in its own Firecracker microVM. Application Auto Scaling (target tracking on ECSServiceAverageCPUUtilization) scales each service independently. An ALB with path-based routing (/service1, /service2) directs traffic to each service's target group."
      },
      {
        id: "C",
        text: "Amazon EKS with managed node groups and the AWS Load Balancer Controller for ALB Ingress.",
        isCorrect: false,
        explanation: "Wrong — EKS with managed node groups still requires managing the EC2 worker nodes (patching, upgrade lifecycle via node group updates). EKS adds Kubernetes control-plane complexity. The question explicitly asks for 'no EC2 instance management.'"
      },
      {
        id: "D",
        text: "Amazon ECS on EC2 with Capacity Providers using FARGATE_SPOT for all 12 services.",
        isCorrect: false,
        explanation: "Wrong — FARGATE_SPOT is correct for fault-tolerant workloads but introduces 2-minute interruption risk unsuitable for production services without designing for interruption (checkpointing, graceful drain). The question does not specify fault-tolerance or cost optimization — it asks for 'least operational overhead.'"
      }
    ],
    explanation: "AWS Fargate with ECS is the canonical answer for 'run containers without managing EC2 infrastructure.' Fargate abstracts the worker fleet entirely — no AMI selection, no cluster scaling, no patching. Application Auto Scaling supports ECS service scaling via target-tracking or step policies. Each ECS service registers its tasks as a target group behind the ALB, which uses path-based rules (or host-based) for routing. For a 12-service microservices architecture, this is the lowest-overhead containerized deployment option on AWS.",
    keywords: ["no EC2 management", "serverless containers", "least operational overhead", "Fargate", "path-based routing"]
  },

  // ── d2-015 ── difficulty 4 ── EKS vs ECS decision ── taskStatement 2.1
  {
    id: "d2-015",
    domain: 2,
    taskStatement: "2.1",
    services: ["eks", "ecs", "alb"],
    constraintType: "migration",
    difficulty: 4,
    type: "single",
    stem: "A financial services company runs a Kubernetes-based platform on-premises across three data centers. They use Kubernetes RBAC, custom CRDs, Helm charts, and a service mesh (Istio) extensively. The company wants to migrate to AWS and MUST preserve their existing Kubernetes tooling, CI/CD pipeline manifests, and operator expertise WITHOUT rewriting deployment configurations. Which AWS container service is the CORRECT choice?",
    options: [
      {
        id: "A",
        text: "Amazon ECS with AWS Fargate — it provides serverless container orchestration without Kubernetes overhead.",
        isCorrect: false,
        explanation: "Wrong — ECS uses its own proprietary task definition format, not Kubernetes manifests or Helm charts. RBAC, CRDs, and Istio are Kubernetes-specific concepts that have no equivalent in ECS. Migrating from Kubernetes to ECS would require a complete rewrite of deployment configurations."
      },
      {
        id: "B",
        text: "Amazon Elastic Kubernetes Service (Amazon EKS) — it runs upstream Kubernetes and is fully compatible with RBAC, CRDs, Helm, and Istio.",
        isCorrect: true,
        explanation: "Correct — EKS runs certified upstream Kubernetes. All Kubernetes-native tooling (kubectl, Helm, Kustomize, Istio, custom CRDs, RBAC policies) works without modification. Existing Helm charts and manifests deploy to EKS with minimal changes (adjusting container image registries to ECR, storage class annotations). This preserves operator expertise and CI/CD pipelines."
      },
      {
        id: "C",
        text: "AWS App Runner — it automatically builds and deploys containerized applications from source code or containers without orchestration complexity.",
        isCorrect: false,
        explanation: "Wrong — App Runner is designed for simple web services and APIs; it does not support Kubernetes concepts, CRDs, Helm, or service meshes. It is not suitable for complex multi-service Kubernetes platform migrations."
      },
      {
        id: "D",
        text: "Amazon ECS with EC2 launch type and Service Connect for service mesh capabilities.",
        isCorrect: false,
        explanation: "Wrong — Same as option A. ECS Service Connect is an ECS-native service mesh that uses Envoy, but it is not compatible with Istio configurations or Kubernetes RBAC/CRD abstractions. Existing Kubernetes YAML manifests cannot be applied to ECS."
      }
    ],
    explanation: "The key differentiator between ECS and EKS is portability and Kubernetes compatibility. ECS is an AWS-proprietary orchestrator with its own task definition format and no Kubernetes API compatibility. EKS runs standard upstream Kubernetes (CNCF conformant), which means any Kubernetes tooling (Helm, Kustomize, RBAC, CRDs, Istio, Prometheus, ArgoCD) works without modification. When a migration scenario specifies Kubernetes-specific tooling, manifests, or expertise, EKS is the only correct answer.",
    keywords: ["Kubernetes migration", "Helm", "CRDs", "RBAC", "Istio", "no rewrite", "EKS vs ECS"]
  },

  // ── d2-016 ── difficulty 3 ── ALB vs NLB distinction ── taskStatement 2.1
  {
    id: "d2-016",
    domain: 2,
    taskStatement: "2.1",
    services: ["nlb", "alb", "ecs"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A healthcare company is exposing an internal microservice to partner organizations over the internet using AWS PrivateLink. The service runs on Amazon ECS tasks behind a load balancer. For AWS PrivateLink to work, the load balancer backing the endpoint service MUST meet specific requirements. Which load balancer type is REQUIRED for a VPC PrivateLink endpoint service, and why is the alternative insufficient?",
    options: [
      {
        id: "A",
        text: "Application Load Balancer (ALB) — because it operates at Layer 7 and provides content-based routing required for PrivateLink.",
        isCorrect: false,
        explanation: "Wrong — ALB is NOT supported as the backing load balancer for VPC PrivateLink endpoint services. PrivateLink requires a Network Load Balancer. ALB does not provide the static IP addresses or Layer 4 topology that PrivateLink's endpoint service mechanism requires."
      },
      {
        id: "B",
        text: "Network Load Balancer (NLB) — because NLB provides static IP addresses per AZ and is the ONLY load balancer type that can back a VPC PrivateLink endpoint service.",
        isCorrect: true,
        explanation: "Correct — AWS PrivateLink endpoint services require a Network Load Balancer as the backing load balancer. NLB operates at Layer 4 (TCP/UDP/TLS), assigns one static IP per AZ (or EIP/BYOIP), and is the only ELB type that supports the PrivateLink endpoint service model. ALB and GWLB cannot back PrivateLink endpoint services."
      },
      {
        id: "C",
        text: "Gateway Load Balancer (GWLB) — because GWLB provides transparent traffic inspection via GENEVE and is required for PrivateLink.",
        isCorrect: false,
        explanation: "Wrong — Gateway Load Balancer is for transparent inline insertion of 3rd-party security appliances using GENEVE on port 6081. It is not used for exposing application services via PrivateLink."
      },
      {
        id: "D",
        text: "Classic Load Balancer (CLB) — the original ELB type that supports all protocols and is compatible with PrivateLink.",
        isCorrect: false,
        explanation: "Wrong — CLB is a legacy load balancer type. It does not support PrivateLink endpoint services. AWS recommends migrating CLB workloads to ALB or NLB. CLB is not a valid answer for any new architecture."
      }
    ],
    explanation: "AWS PrivateLink endpoint services require a Network Load Balancer as the backing service endpoint. NLB is the only ELB type supported for PrivateLink endpoint services because: (1) it provides stable static IPs per AZ for the PrivateLink DNS model, (2) it operates at Layer 4 consistent with PrivateLink's connection model, and (3) it supports TCP, UDP, and TLS. When a question involves PrivateLink, static IPs, or exposing services to other VPCs/accounts/partners, NLB is the required load balancer type.",
    keywords: ["VPC PrivateLink", "NLB required", "static IP", "endpoint service", "ALB vs NLB"]
  },

  // ── d2-017 ── difficulty 3 ── Lambda Reserved vs Provisioned Concurrency ── taskStatement 2.1
  {
    id: "d2-017",
    domain: 2,
    taskStatement: "2.1",
    services: ["lambda", "auto-scaling"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A retail company has a critical AWS Lambda function that processes payment authorizations. During flash sales, the function must handle up to 2,000 concurrent invocations. The function's cold-start initialization takes 3–4 seconds, which causes payment failures during the first surge after a quiet period. The company also needs to ensure this function always has guaranteed capacity and that OTHER Lambda functions in the account CANNOT consume the concurrency reserved for payments. Which combination of Lambda concurrency settings meets BOTH requirements?",
    options: [
      {
        id: "A",
        text: "Set Reserved Concurrency to 2,000. This pre-warms 2,000 instances and caps the payment function's concurrency.",
        isCorrect: false,
        explanation: "Wrong — Reserved Concurrency guarantees a pool of concurrency exclusively for the function AND caps it, but it does NOT eliminate cold starts. Reserved Concurrency does not pre-warm execution environments. Cold starts still occur when new environments are initialized within the reserved pool."
      },
      {
        id: "B",
        text: "Set Reserved Concurrency to 2,000 AND enable Provisioned Concurrency for a baseline number of pre-warmed instances.",
        isCorrect: true,
        explanation: "Correct — Reserved Concurrency does two things: (1) guarantees the function always has up to 2,000 concurrent executions available (other functions cannot consume this pool), and (2) caps the function at 2,000 concurrent executions. Provisioned Concurrency separately pre-warms a set number of execution environments, eliminating cold starts for the pre-warmed capacity. Together, they satisfy both requirements."
      },
      {
        id: "C",
        text: "Enable Provisioned Concurrency for 2,000 instances. This both eliminates cold starts and reserves capacity from the account limit.",
        isCorrect: false,
        explanation: "Wrong — Provisioned Concurrency alone pre-warms environments to eliminate cold starts but does NOT prevent other Lambda functions in the account from consuming unreserved concurrency. To guarantee exclusive capacity for the payment function, Reserved Concurrency must also be set."
      },
      {
        id: "D",
        text: "Set the account-level Lambda concurrency limit to 2,000 to ensure the payment function always gets what it needs.",
        isCorrect: false,
        explanation: "Wrong — There is no API to set a per-account concurrency limit for a specific function at the account level. The account has a total concurrency limit (default 1,000 per region, raisable). Per-function concurrency is controlled by Reserved Concurrency, not an account-level setting."
      }
    ],
    explanation: "Lambda concurrency controls have distinct roles: Reserved Concurrency = guarantees exclusive pool + caps the function (prevents noisy-neighbor issues). Provisioned Concurrency = pre-warms execution environments, eliminating cold starts (billed per pre-warmed GB-second). To satisfy both 'no cold starts on surge' AND 'guaranteed capacity that other functions cannot consume,' you need BOTH: Reserved Concurrency for isolation and capacity guarantee, plus Provisioned Concurrency for pre-warming. They work independently and can be combined.",
    keywords: ["cold starts", "reserved concurrency", "provisioned concurrency", "guaranteed capacity", "flash sale"]
  },

  // ── d2-018 ── difficulty 4 ── Kinesis EFO + SQS comparison ── taskStatement 2.1
  {
    id: "d2-018",
    domain: 2,
    taskStatement: "2.1",
    services: ["kinesis", "lambda", "sqs"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A media company ingests 80,000 IoT sensor events per second into Amazon Kinesis Data Streams. Four independent analytics applications each need to consume the FULL stream simultaneously. After consuming, each application must process events in the order they were produced per device (partition key). Processing latency must be under 200 milliseconds end-to-end. A fifth application requires replay of the last 3 days of data for a model retrain. Which consumer configuration satisfies ALL requirements with the LEAST latency?",
    options: [
      {
        id: "A",
        text: "Four standard (shared) Kinesis shard iterators, one per application, polling GetRecords every 200 ms.",
        isCorrect: false,
        explanation: "Wrong — Shared (standard) shard iterators share 2 MB/s read throughput per shard across ALL consumers using polling. With four consumers polling the same shard, throughput per consumer is halved or worse, and polling latency can exceed 200 ms depending on the GetRecords cadence. Enhanced Fan-Out is needed for dedicated per-consumer throughput."
      },
      {
        id: "B",
        text: "Four Kinesis Enhanced Fan-Out (EFO) consumers registered to the stream, with 3-day extended data retention enabled.",
        isCorrect: true,
        explanation: "Correct — Enhanced Fan-Out gives each registered consumer a dedicated 2 MB/s per-shard push throughput with sub-200 ms latency (typically ~70 ms). Four EFO consumers are within the 5 EFO consumer limit per stream. Extended retention to 3 days (from the default 24h, up to 7 days) enables the fifth application's replay. Ordering is preserved per shard (per partition key). This is the purpose-built solution for multiple independent real-time consumers on Kinesis."
      },
      {
        id: "C",
        text: "Fan out the stream to four separate Amazon SQS Standard queues via an intermediate Lambda function.",
        isCorrect: false,
        explanation: "Wrong — SQS Standard queues do NOT preserve message ordering (best-effort only) — violating the per-device ordering requirement. Introducing a Lambda fan-out function also adds latency and a single point of failure. SQS FIFO provides ordering but has throughput limitations that would require significant sharding to match 80K events/sec."
      },
      {
        id: "D",
        text: "Use Kinesis Data Streams with one stream per consumer (four streams), fan out from the primary stream via a Lambda function, with 3-day retention.",
        isCorrect: false,
        explanation: "Wrong — Duplicating the stream to four separate streams requires a fan-out Lambda that replicates every event four times, quadrupling write costs and adding latency. This anti-pattern is exactly what EFO eliminates — multiple consumers reading the SAME stream independently without needing to duplicate data."
      }
    ],
    explanation: "Kinesis Enhanced Fan-Out is the solution for multiple independent consumers requiring sub-200 ms latency and per-consumer dedicated throughput. Standard consumers share 2 MB/s per shard across all pollers; EFO provides dedicated 2 MB/s per consumer per shard via push (HTTP/2 SubscribeToShard). Each stream supports up to 5 EFO consumers. Extended data retention (7 days) enables replay. The EFO limit of 5 consumers per stream is important — if more than 5 consumers are needed, you need separate streams with fan-out or a downstream Firehose to S3.",
    keywords: ["Enhanced Fan-Out", "multiple consumers", "sub-200ms", "per-consumer throughput", "replay", "ordering"]
  },

  // ── d2-019 ── difficulty 2 ── Route53 Failover routing ── taskStatement 2.2
  {
    id: "d2-019",
    domain: 2,
    taskStatement: "2.2",
    services: ["route53", "s3", "alb"],
    constraintType: "ha",
    difficulty: 2,
    type: "single",
    stem: "An e-commerce company hosts its primary website on Application Load Balancers in us-east-1. During a regional outage, the company wants to automatically serve a static maintenance page hosted in Amazon Simple Storage Service (Amazon S3) in us-west-2. The solution must automatically fail over to S3 when the primary ALB fails its health check and automatically fail back when the ALB recovers, with NO manual intervention. Which Amazon Route 53 routing policy implements this?",
    options: [
      {
        id: "A",
        text: "Route 53 Weighted routing with a weight of 100 for us-east-1 ALB and weight of 0 for the S3 website, manually adjusting weights during an outage.",
        isCorrect: false,
        explanation: "Wrong — Weighted routing with a weight of 0 does not use health checks for automatic failover. It requires manual weight adjustment to reroute traffic. The question requires automatic, health-check-driven failover."
      },
      {
        id: "B",
        text: "Route 53 Failover routing with the us-east-1 ALB as the Primary record (health-checked) and the us-west-2 S3 static website as the Secondary record.",
        isCorrect: true,
        explanation: "Correct — Route 53 Failover routing implements active-passive DR. The Primary record has a health check on the ALB endpoint. When the health check fails, Route 53 automatically routes all traffic to the Secondary record (S3 static site). When the ALB health check recovers, Route 53 automatically fails back to the Primary. Health checks run every 30 seconds by default (or every 10 seconds with fast health checks)."
      },
      {
        id: "C",
        text: "Route 53 Latency-based routing with records in us-east-1 and us-west-2 — Route 53 will automatically route to the lower-latency healthy region.",
        isCorrect: false,
        explanation: "Wrong — Latency-based routing routes based on the lowest measured network latency to the AWS region, not geographic distance. It can integrate with health checks, but it routes based on latency, not primary/secondary designation. Users near us-west-2 might normally route to the S3 site even without an outage."
      },
      {
        id: "D",
        text: "Route 53 Multi-Value Answer routing with both records, relying on Route 53 to exclude unhealthy records.",
        isCorrect: false,
        explanation: "Wrong — Multi-Value Answer returns up to 8 healthy records and lets the client choose from the returned set — it is a DNS-based soft load balancing feature, not a strict active-passive failover. During a primary outage, some clients that already resolved the primary IP would continue using it until DNS TTL expires. Failover routing provides the cleanest active-passive DR pattern."
      }
    ],
    explanation: "Route 53 Failover routing is the canonical active-passive DR routing policy. One record is designated Primary (with a required health check); one is designated Secondary (failback resource). When the Primary health check fails, Route 53 serves the Secondary record. Route 53 health checks run every 30 seconds (standard) or 10 seconds (fast, higher cost), checking HTTP/HTTPS/TCP. The common exam pattern pairs this with CloudFront, S3 static website, or a standby region for the secondary.",
    keywords: ["active-passive", "automatic failover", "Route 53 Failover", "health check", "no manual intervention"]
  },

  // ── d2-020 ── difficulty 4 ── Route53 Geolocation vs Latency trap ── taskStatement 2.2
  {
    id: "d2-020",
    domain: 2,
    taskStatement: "2.2",
    services: ["route53", "cloudfront"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "A global streaming company must ensure that users in the European Union are ALWAYS routed to their EU-region servers for GDPR data-residency compliance, regardless of which region has lower network latency. Australian users must always receive content from the ap-southeast-2 region. Users from all other countries should be routed to the lowest-latency region. Which combination of Amazon Route 53 routing policies implements this?",
    options: [
      {
        id: "A",
        text: "Route 53 Latency-based routing for all records, with health checks enabled. EU and Australian users will naturally route to their nearest region.",
        isCorrect: false,
        explanation: "Wrong — Latency-based routing routes to the AWS region with the lowest measured network latency, NOT based on geographic compliance requirements. An EU user's traffic might route to us-east-1 if trans-Atlantic latency is lower than within-EU latency at a given moment. Latency-based routing CANNOT enforce data-residency rules."
      },
      {
        id: "B",
        text: "Route 53 Geolocation routing for EU countries (mapped to eu-west-1) and Australia (mapped to ap-southeast-2); Route 53 Latency-based routing as the default for all other countries.",
        isCorrect: true,
        explanation: "Correct — Geolocation routing routes based on the user's DNS resolver location (country/continent/US state), enabling strict data-residency enforcement regardless of latency. EU countries route to eu-west-1 by rule; Australia routes to ap-southeast-2. For the remaining 'default' location (all other countries), a latency-based record set directs traffic to the lowest-latency region. Route 53 evaluates geolocation records first; the default record acts as a catch-all for unmatched locations."
      },
      {
        id: "C",
        text: "Route 53 Geoproximity routing with high positive bias for eu-west-1 and ap-southeast-2, and neutral bias for all other regions.",
        isCorrect: false,
        explanation: "Wrong — Geoproximity routing routes based on the geographic distance between the user and the resource, shifted by a bias dial (–99 to +99). It cannot GUARANTEE that EU users always route to eu-west-1 — it only influences routing by expanding or contracting a region's effective traffic area. For strict compliance requirements, Geolocation (which routes by legal jurisdiction) is required."
      },
      {
        id: "D",
        text: "Route 53 Weighted routing with weight 100 for eu-west-1 for EU users, applied via IAM conditions on the Route 53 API.",
        isCorrect: false,
        explanation: "Wrong — Route 53 Weighted routing splits traffic by percentage weight and is used for A/B testing or gradual migration. It does not route based on user location and cannot enforce geographic compliance requirements. IAM conditions on Route 53 APIs control who can modify DNS records, not how DNS queries are answered."
      }
    ],
    explanation: "The critical distinction tested here: Geolocation = routes by USER's DNS resolver country/continent/state, enforces jurisdictional compliance. Latency = routes by lowest measured network latency to AWS region, optimizes performance. Geoproximity = routes by geographic distance between user and resource, tunable by bias. For GDPR data-residency compliance (must route EU users to EU region), only Geolocation provides a deterministic guarantee. Latency may coincidentally route EU users to EU but is not a compliance guarantee. Using Geolocation for regulated locations and Latency as the default is a common exam pattern.",
    keywords: ["GDPR compliance", "data residency", "Geolocation vs Latency", "mandatory routing", "default record"]
  },

  // ── d2-021 ── difficulty 3 ── RDS Multi-AZ failover timing ── taskStatement 2.2
  {
    id: "d2-021",
    domain: 2,
    taskStatement: "2.2",
    services: ["rds", "aurora"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A hospital's electronic health record (EHR) application uses an Amazon Relational Database Service (Amazon RDS) PostgreSQL Multi-AZ Single-Instance deployment. The RTO requirement for a database AZ failure is under 35 seconds. During a recent simulated failover test, the application experienced 90 seconds of database downtime. The operations team suspects the failover time exceeds the requirement. What is the MOST likely cause, and which change resolves it?",
    options: [
      {
        id: "A",
        text: "RDS Multi-AZ Single-Instance failover takes 60–120 seconds for DNS propagation and crash recovery on the standby. Migrate to Amazon RDS Multi-AZ DB Cluster (PostgreSQL).",
        isCorrect: true,
        explanation: "Correct — RDS Multi-AZ Single-Instance failover involves: (1) detecting the primary failure, (2) promoting the standby (which must replay the transaction log from the point of failure — 'crash recovery'), and (3) a DNS CNAME flip with propagation time. This typically takes 60–120 seconds. RDS Multi-AZ DB Cluster (1 writer + 2 readable standbys, semi-synchronous replication) eliminates crash recovery on standby and typically fails over in under 35 seconds because standbys are already in sync."
      },
      {
        id: "B",
        text: "Add an Amazon RDS Read Replica in the same AZ as the primary and promote it during a failover. Read Replicas have faster promotion times than Multi-AZ standbys.",
        isCorrect: false,
        explanation: "Wrong — Read Replicas use asynchronous replication and are designed for read scaling, not HA. Promoting a Read Replica during a failure requires manual intervention and replication lag means data loss (RPO > 0). They do not provide automatic failover."
      },
      {
        id: "C",
        text: "Reduce the RDS parameter group's max_connections to zero to force all connections to the standby immediately during failover.",
        isCorrect: false,
        explanation: "Wrong — Setting max_connections to zero would prevent all database connections, not speed up failover. Failover timing is governed by the AWS internal replication and DNS flip process, not connection parameters."
      },
      {
        id: "D",
        text: "Add Amazon RDS Proxy in front of the RDS instance. RDS Proxy reduces failover time by up to 66% by maintaining connection pools.",
        isCorrect: false,
        explanation: "Wrong — RDS Proxy improves the application's reconnection speed after a failover (by pinning connections and maintaining a pool during the DNS flip) and can reduce perceived failover from the application perspective. However, the underlying RDS Single-Instance failover still takes 60–120 seconds. To meet a 35-second RTO at the database level, the cluster type itself must change."
      }
    ],
    explanation: "RDS failover timing by deployment type: Single-Instance Multi-AZ = 60–120 seconds (DNS flip + crash recovery on standby). Multi-AZ DB Cluster (MySQL/PostgreSQL only) = typically under 35 seconds (semi-synchronous replication, standbys already in sync, no crash recovery needed). Aurora Multi-AZ = under 30 seconds (6-copy storage, instant failover to replica). RDS Proxy speeds up application reconnection but does not change the underlying database failover time. When the RTO requirement is less than 35 seconds, the answer is either RDS Multi-AZ DB Cluster or Amazon Aurora.",
    keywords: ["RTO 35 seconds", "60-120 seconds", "crash recovery", "Multi-AZ DB Cluster", "failover timing"]
  },

  // ── d2-022 ── difficulty 4 ── Aurora Backtrack trap ── taskStatement 2.2
  {
    id: "d2-022",
    domain: 2,
    taskStatement: "2.2",
    services: ["aurora", "rds"],
    constraintType: "ops",
    difficulty: 4,
    type: "single",
    stem: "A gaming company's database administrator accidentally executes a DELETE statement that removes 2 million player records from an Amazon Aurora MySQL cluster. The incident is discovered 45 minutes later. The company needs to recover the deleted records as quickly as possible with MINIMUM data loss and wants to avoid creating a new cluster. The Aurora cluster was created with Backtrack enabled (72-hour window). Which recovery method minimizes recovery time WITHOUT creating a new cluster?",
    options: [
      {
        id: "A",
        text: "Restore the Aurora cluster to a point in time using AWS Console PITR to create a new cluster at the timestamp 44 minutes ago.",
        isCorrect: false,
        explanation: "Wrong — PITR creates a NEW cluster (it cannot restore in-place). This contradicts the requirement to avoid creating a new cluster. PITR restore is also slower (minutes to provision the new cluster) compared to Backtrack."
      },
      {
        id: "B",
        text: "Use Aurora Backtrack to rewind the EXISTING cluster in place to a timestamp before the DELETE statement, then re-apply any legitimate transactions from the 44-minute window.",
        isCorrect: true,
        explanation: "Correct — Aurora Backtrack rewinds the cluster in place without creating a new instance. It completes in minutes (typically 2–5 minutes) and does not require provisioning new infrastructure. The cluster is rewound to a time before the accidental DELETE within the 72-hour window. This is the fastest, lowest-overhead recovery path. Any legitimate transactions from the 44-minute window must be re-applied manually or are accepted as lost within the RPO window."
      },
      {
        id: "C",
        text: "Use Aurora Backtrack on an Aurora PostgreSQL cluster to rewind to before the DELETE.",
        isCorrect: false,
        explanation: "Wrong — Aurora Backtrack is ONLY available for Aurora MySQL. Aurora PostgreSQL does NOT support Backtrack. The question states Aurora MySQL, so this distinction is being tested here as a trap for candidates who misremember the engine restriction."
      },
      {
        id: "D",
        text: "Take an on-demand Aurora snapshot immediately and restore from it to recover data.",
        isCorrect: false,
        explanation: "Wrong — An on-demand snapshot taken NOW captures the database AFTER the DELETE, meaning the deleted records are not in the snapshot. To recover data from a snapshot, you need a snapshot taken BEFORE the DELETE — and restoring from any historical snapshot creates a NEW cluster, which violates the requirement."
      }
    ],
    explanation: "Aurora Backtrack is an in-place point-in-time rewind for Aurora MySQL clusters only (NOT PostgreSQL). Key facts: must be enabled at cluster creation (or snapshot restore), rewind window up to 72 hours, takes 2–5 minutes to complete, affects the ENTIRE cluster, no new cluster created. PITR always creates a new cluster. Backtrack is the correct answer when requirements specify: (1) Aurora MySQL, (2) in-place recovery, (3) minimize RTO, (4) within 72-hour window.",
    keywords: ["Aurora Backtrack", "in-place recovery", "Aurora MySQL only", "no new cluster", "72-hour window"]
  },

  // ── d2-023 ── difficulty 3 ── S3 Cross-Region Replication + RTC ── taskStatement 2.2
  {
    id: "d2-023",
    domain: 2,
    taskStatement: "2.2",
    services: ["s3"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A financial services company stores trade confirmation documents in Amazon Simple Storage Service (Amazon S3) in us-east-1. Regulatory requirements mandate that all documents must be replicated to ap-southeast-1 within 15 minutes of upload, with a documented SLA. A compliance audit requires evidence that replication meets this 15-minute window 99.99% of the time. Which S3 feature provides the replication SLA and the compliance evidence?",
    options: [
      {
        id: "A",
        text: "S3 Cross-Region Replication (CRR) without Replication Time Control — standard CRR replicates within 15 minutes on average.",
        isCorrect: false,
        explanation: "Wrong — Standard CRR replicates most objects within 15 minutes on average but provides NO service-level agreement or documented SLA. There is no metric or guarantee that 99.99% of objects complete within 15 minutes, and there is no compliance reporting built in."
      },
      {
        id: "B",
        text: "S3 Cross-Region Replication with S3 Replication Time Control (S3 RTC) — provides a 15-minute SLA with 99.99% of objects replicated, plus CloudWatch metrics for compliance reporting.",
        isCorrect: true,
        explanation: "Correct — S3 Replication Time Control (RTC) is an add-on to CRR/SRR that provides a documented SLA: 99.99% of new objects replicated within 15 minutes. It publishes CloudWatch metrics (ReplicationLatency, BytesPendingReplication, OperationsPendingReplication) that serve as auditable compliance evidence. S3 RTC adds a per-GB replication premium on top of CRR costs."
      },
      {
        id: "C",
        text: "S3 Same-Region Replication (SRR) to a second bucket in us-east-1 as a local backup, which replicates faster than cross-region.",
        isCorrect: false,
        explanation: "Wrong — Same-Region Replication keeps data in the same region, which does NOT satisfy the requirement for a copy in ap-southeast-1. Regulatory data-residency requirements for a geographically separate copy require CRR."
      },
      {
        id: "D",
        text: "S3 Event Notifications + Lambda to copy objects to ap-southeast-1 on every PutObject event — this provides real-time replication.",
        isCorrect: false,
        explanation: "Wrong — A Lambda-based copy is a custom solution with no documented SLA, no built-in compliance reporting, and potential for message loss (S3 Event Notifications have at-least-once delivery). S3 RTC is the purpose-built, SLA-backed solution for this requirement."
      }
    ],
    explanation: "S3 Replication Time Control (S3 RTC) is the answer when a question specifies: a documented replication SLA, 15 minutes, 99.99%, or compliance reporting for replication. RTC publishes three CloudWatch metrics: ReplicationLatency (seconds to replicate), BytesPendingReplication (GB queued), and OperationsPendingReplication (count queued). Standard CRR typically replicates within 15 minutes but has no SLA. Both source and destination buckets must have versioning enabled for any S3 replication to work.",
    keywords: ["S3 RTC", "15-minute SLA", "99.99%", "compliance evidence", "CloudWatch metrics", "cross-region replication"]
  },

  // ── d2-024 ── difficulty 3 ── S3 Object Lock Compliance ── taskStatement 2.2
  {
    id: "d2-024",
    domain: 2,
    taskStatement: "2.2",
    services: ["s3", "backup"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A pharmaceutical company must store clinical trial data in Amazon Simple Storage Service (Amazon S3) for 10 years, immutably. No one — including the root account, compliance officers, or AWS Support — must be able to delete or modify the data before the 10-year period ends. The company is also subject to a surprise audit, meaning the lock must be applied immediately at upload time. Which S3 feature combination is REQUIRED?",
    options: [
      {
        id: "A",
        text: "S3 Versioning with MFA Delete enabled — requiring MFA hardware for all deletions prevents accidental or unauthorized removal.",
        isCorrect: false,
        explanation: "Wrong — MFA Delete prevents deletions without a valid MFA token, but it only requires the bucket owner (root account) to provide MFA. It does NOT prevent the root account itself from deleting versions. The root account can disable MFA Delete and proceed with deletion. This does not satisfy 'no one, including root.'"
      },
      {
        id: "B",
        text: "S3 Object Lock with Compliance mode and a 10-year retention period, applied at upload time.",
        isCorrect: true,
        explanation: "Correct — S3 Object Lock Compliance mode creates a WORM (Write Once Read Many) lock that NOBODY can override or shorten — not the bucket owner, not the root account, not AWS. Once set, the retention period cannot be reduced. Governance mode allows override with the s3:BypassGovernanceRetention permission, but Compliance mode has NO bypass path. Object Lock must be enabled at bucket creation and auto-enables versioning."
      },
      {
        id: "C",
        text: "S3 Object Lock with Governance mode and the s3:BypassGovernanceRetention permission restricted to the security team only.",
        isCorrect: false,
        explanation: "Wrong — Governance mode can be overridden by principals with the s3:BypassGovernanceRetention IAM permission. While restricting this permission helps, the question requires that NOBODY can delete or modify the data. Compliance mode is the only mode that truly prevents ALL override, including the root account."
      },
      {
        id: "D",
        text: "Enable S3 Cross-Region Replication to back up the data to a second region with versioning, making deletion of both copies effectively impossible.",
        isCorrect: false,
        explanation: "Wrong — CRR replicates data, but the replicated copies can still be deleted from either bucket (source or destination) if there are no Object Lock restrictions. Replication alone does not provide WORM immutability."
      }
    ],
    explanation: "S3 Object Lock modes: Governance mode = users with s3:BypassGovernanceRetention can override; useful for most WORM requirements with an escape hatch. Compliance mode = NO override by ANYONE (not root, not AWS); used when regulatory requirements demand absolute immutability. Legal Hold = indefinite lock independent of retention period, can be removed by users with s3:PutObjectLegalHold. Object Lock must be enabled at bucket creation. When a question says 'no one including root can delete,' the answer is always Compliance mode.",
    keywords: ["WORM", "Compliance mode", "no override", "root account", "10-year immutability", "Object Lock"]
  },

  // ── d2-025 ── difficulty 4 ── Backup & Restore DR (cheapest) ── taskStatement 2.2
  {
    id: "d2-025",
    domain: 2,
    taskStatement: "2.2",
    services: ["backup", "rds", "s3"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A nonprofit organization hosts a donor management application on a single Amazon RDS MySQL instance and a static website on Amazon Simple Storage Service (Amazon S3) in us-east-1. The IT team has defined: RPO of 8 hours, RTO of 24 hours, and the MINIMUM possible monthly DR cost. The organization is willing to rebuild infrastructure entirely after a disaster using AWS CloudFormation templates they have documented. Which DR strategy meets the requirements at the LOWEST cost?",
    options: [
      {
        id: "A",
        text: "Pilot Light: Keep an RDS Read Replica running in us-west-2 and store CloudFormation templates in S3. Promote the replica and launch compute on failover.",
        isCorrect: false,
        explanation: "Wrong — A Pilot Light strategy keeps the data tier running in the DR region 24/7. This incurs ongoing RDS instance costs in us-west-2 even when not needed. With an 8-hour RPO and 24-hour RTO, a cheaper strategy (Backup and Restore) satisfies both requirements without continuous DR compute costs."
      },
      {
        id: "B",
        text: "Backup and Restore: Take automated RDS snapshots every 4 hours, copy them to us-west-2, replicate the S3 bucket via CRR, and store CloudFormation templates in S3. Restore infrastructure from IaC on failover.",
        isCorrect: true,
        explanation: "Correct — Backup and Restore costs only S3 snapshot storage and CRR data transfer — no running compute in the DR region. A 4-hour snapshot cadence achieves an 8-hour RPO (worst case: snapshot just before an 8-hour gap). Restoring from snapshots and launching infrastructure via CloudFormation takes ~1–4 hours (well within the 24-hour RTO). This is the cheapest DR strategy."
      },
      {
        id: "C",
        text: "Warm Standby: Run a scaled-down RDS instance and web tier in us-west-2 continuously, scaling up on failover.",
        isCorrect: false,
        explanation: "Wrong — Warm Standby keeps a reduced-capacity stack running continuously in the DR region (compute + database), which costs significantly more than Backup and Restore. For a nonprofit with budget constraints and loose RTO/RPO, paying for always-running DR infrastructure is wasteful."
      },
      {
        id: "D",
        text: "Multi-Site Active/Active: Deploy full production capacity in both us-east-1 and us-west-2 simultaneously with Route 53 latency-based routing.",
        isCorrect: false,
        explanation: "Wrong — Active/Active doubles infrastructure costs (2× the EC2, 2× the RDS, 2× data transfer) and provides near-zero RTO/RPO — far beyond what the 24-hour RTO and budget-conscious nonprofit require. This is the most expensive DR strategy."
      }
    ],
    explanation: "DR strategy cost ladder: Backup & Restore < Pilot Light < Warm Standby < Multi-Site Active/Active. Select the cheapest strategy whose RPO/RTO meets requirements. With 8-hour RPO and 24-hour RTO, Backup & Restore is sufficient: snapshot every 4 hours (RPO = 4h < 8h max), restore time 1–4 hours (RTO < 24h). The only ongoing costs are S3 snapshot storage and CRR data transfer — no DR-region compute at all. This is the canonical exam scenario testing when to choose Backup & Restore: loose requirements + cost minimization.",
    keywords: ["Backup and Restore", "lowest cost", "RPO 8 hours", "RTO 24 hours", "no running DR compute"]
  },

  // ── d2-026 ── difficulty 4 ── Warm Standby vs Pilot Light ── taskStatement 2.2
  {
    id: "d2-026",
    domain: 2,
    taskStatement: "2.2",
    services: ["rds", "ec2", "route53", "auto-scaling"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "A retail company's order management system must maintain service during a regional AWS outage. After a disaster, the system must serve customers at REDUCED capacity immediately (within 3 minutes) while full capacity is restored. RPO must be under 30 seconds. The disaster recovery region must be actively serving health-check traffic at all times. Which DR strategy and configuration BEST satisfies these requirements?",
    options: [
      {
        id: "A",
        text: "Backup and Restore: Automate hourly snapshots copied to the DR region. Restore infrastructure within the RTO window.",
        isCorrect: false,
        explanation: "Wrong — Backup and Restore RTO is measured in hours (snapshot restore + IaC rebuild). The 3-minute RTO for immediate reduced-capacity service is impossible with Backup and Restore."
      },
      {
        id: "B",
        text: "Pilot Light: Keep only the RDS replica running in the DR region. Launch EC2 instances from pre-built AMIs via Auto Scaling on failover.",
        isCorrect: false,
        explanation: "Wrong — Pilot Light has an RTO of tens of minutes (time to spin up and bootstrap compute from AMIs). Serving customers within 3 minutes is difficult — instance launch takes 2–5 minutes plus application start time. Additionally, compute is not running in the DR region for health-check traffic, which the question requires."
      },
      {
        id: "C",
        text: "Warm Standby: Run a scaled-down full stack in the DR region continuously (e.g., 2 instances vs 20 in production). Configure Route 53 failover routing with health checks. On disaster, scale up to full capacity via Auto Scaling.",
        isCorrect: true,
        explanation: "Correct — Warm Standby keeps a scaled-down but functional application stack running in the DR region 24/7 (satisfying the 'actively serving health-check traffic' requirement). With Route 53 failover, traffic switches to the DR region within ~30 seconds of primary health-check failure (Route 53 health checks every 30 seconds). At reduced capacity, the RTO is near-immediate (DR region is already running). Auto Scaling then brings the DR region to full capacity over the next few minutes. The RDS replica provides sub-30-second RPO with synchronous or near-synchronous replication."
      },
      {
        id: "D",
        text: "Multi-Site Active/Active: Deploy full production capacity in both regions. Both regions serve live traffic continuously.",
        isCorrect: false,
        explanation: "Wrong — Multi-Site Active/Active satisfies all technical requirements (near-zero RTO, near-zero RPO, always-on DR) but at roughly 2× the infrastructure cost. The question asks for the strategy that 'best satisfies' requirements — Warm Standby meets the RTO and RPO at lower cost than Active/Active, making it the more precise answer."
      }
    ],
    explanation: "Warm Standby is the correct DR strategy when requirements include: (1) immediate reduced-capacity service on failover (compute already running, no launch delay), (2) sub-minute RTO (Route 53 failover ~30s health-check + DNS TTL), (3) DR region serving health-check traffic continuously, and (4) sub-30-second RPO (near-synchronous replication). The differentiator from Pilot Light: compute is running (not off). The differentiator from Active/Active: running at reduced (not full) capacity. This is the canonical Warm Standby exam scenario.",
    keywords: ["Warm Standby", "scaled-down stack", "3-minute RTO", "health-check traffic", "immediately available at reduced capacity"]
  },

  // ── d2-027 ── difficulty 5 ── DynamoDB Global Tables active-active trap ── taskStatement 2.2
  {
    id: "d2-027",
    domain: 2,
    taskStatement: "2.2",
    services: ["dynamodb", "route53"],
    constraintType: "ha",
    difficulty: 5,
    type: "single",
    stem: "A solutions architect is designing a multi-region DynamoDB database strategy. A team member proposes the following: 'We will use DynamoDB Global Tables to replicate data from our primary region (us-east-1) to a standby region (eu-west-1). In normal operations, all writes go to us-east-1. The eu-west-1 region will serve read-only traffic. If us-east-1 fails, we will promote eu-west-1 to the write region.' Which of the following statements about this design is CORRECT?",
    options: [
      {
        id: "A",
        text: "This is a valid active-passive design. DynamoDB Global Tables supports designating one region as the primary writer and another as a read-only replica.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB Global Tables is an ACTIVE-ACTIVE multi-master design. ALL replica tables accept writes simultaneously. There is NO concept of a 'primary write region' or 'read-only standby' in Global Tables. Both regions are equal peers that can accept writes. Routing writes to one region is possible via application logic, but Global Tables does not enforce or support a primary/secondary designation at the service level."
      },
      {
        id: "B",
        text: "The design misrepresents Global Tables. Global Tables is active-active (multi-master) — eu-west-1 can accept writes at any time without a 'promotion' step. The failover process requires only a Route 53 DNS update, not a database 'promotion.'",
        isCorrect: true,
        explanation: "Correct — DynamoDB Global Tables is multi-master (active-active). Every replica region can accept writes immediately — there is no 'promote to primary' step like with RDS. Failover is purely a traffic routing change (Route 53 health-check failover or application logic). The team member's assumption that eu-west-1 is 'passive' and needs promotion is a fundamental misunderstanding of Global Tables architecture."
      },
      {
        id: "C",
        text: "The design is correct, and 'promoting' eu-west-1 in DynamoDB Global Tables is done via the 'PromoteReadReplica' API, which changes the replication direction.",
        isCorrect: false,
        explanation: "Wrong — There is no 'PromoteReadReplica' API in DynamoDB Global Tables because there are no read replicas. PromoteReadReplica is an RDS API. DynamoDB Global Tables does not have a promotion concept — all tables are always writable."
      },
      {
        id: "D",
        text: "The design is invalid because Global Tables only supports two regions maximum, and the us-east-1 to eu-west-1 pairing is not supported.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB Global Tables supports multiple regions worldwide, including us-east-1 and eu-west-1 pairing. The limit is not two regions — a Global Table can have replicas in multiple regions simultaneously. This option contains two false statements."
      }
    ],
    explanation: "TRAP: The most common DynamoDB Global Tables misconception is treating it as active-passive (primary/replica) like RDS. DynamoDB Global Tables is ALWAYS active-active multi-master. Every replica table accepts writes. There is no 'primary write region,' no 'standby,' and no 'promotion' process. Conflict resolution uses last-writer-wins by aws:rep:updatetime (MREC mode). To switch where your application sends traffic, you update Route 53 or your application endpoint — the database itself requires no reconfiguration. Compare with RDS: RDS Multi-AZ = active-passive (standby not readable, requires failover/promotion). Aurora Global Database = active-passive by default (one write region, read-only secondaries, but has planned failover/switchover).",
    keywords: ["active-active", "multi-master", "no promotion", "Global Tables misconception", "not active-passive"]
  },

  // ── d2-028 ── difficulty 5 ── SNS FIFO → SQS FIFO only trap ── taskStatement 2.1
  {
    id: "d2-028",
    domain: 2,
    taskStatement: "2.1",
    services: ["sns", "sqs", "lambda"],
    constraintType: "ops",
    difficulty: 5,
    type: "single",
    stem: "An e-commerce platform uses an Amazon Simple Notification Service (Amazon SNS) Standard topic to publish order events to three subscribers: an Amazon Simple Queue Service (Amazon SQS) queue for inventory, an AWS Lambda function for analytics, and an HTTP endpoint for a partner webhook. The team decides to migrate to an Amazon SNS FIFO topic to enforce strict ordering of order events by customer ID. Which statement about the migration is CORRECT?",
    options: [
      {
        id: "A",
        text: "SNS FIFO topics support all the same subscriber types as Standard topics: SQS queues, Lambda, HTTP endpoints, and email.",
        isCorrect: false,
        explanation: "Wrong — This is the core trap. SNS FIFO topics can ONLY deliver to SQS queues (Standard or FIFO). Lambda functions, HTTP/HTTPS endpoints, email addresses, SMS, and mobile push endpoints are NOT supported as subscribers on an SNS FIFO topic. This is a hard architectural constraint."
      },
      {
        id: "B",
        text: "The migration requires replacing the Lambda subscription and HTTP endpoint subscription because SNS FIFO topics can ONLY deliver to Amazon SQS queues. The team must add SQS queues as intermediaries for Lambda and the webhook.",
        isCorrect: true,
        explanation: "Correct — SNS FIFO topics have a strict subscriber constraint: they can ONLY deliver to SQS queues (Standard or FIFO). The existing Lambda and HTTP endpoint subscriptions cannot be migrated directly to SNS FIFO. Instead, the team must: add SQS Standard queues as SNS FIFO subscribers, then have Lambda poll the SQS queue and forward events to the HTTP endpoint. This adds architectural complexity vs the Standard topic approach."
      },
      {
        id: "C",
        text: "SNS FIFO topics can deliver to Lambda but not to HTTP endpoints. The HTTP endpoint must be replaced with an SQS queue.",
        isCorrect: false,
        explanation: "Wrong — SNS FIFO topics cannot deliver to Lambda directly. Both Lambda and HTTP endpoints are unsupported subscriber types for SNS FIFO topics. Only SQS queues are valid subscribers."
      },
      {
        id: "D",
        text: "SNS FIFO topics support a maximum of 100 SQS queue subscriptions per topic, which is adequate for most fan-out architectures.",
        isCorrect: false,
        explanation: "Wrong — While it is true that SNS FIFO topics support up to 100 subscriptions maximum per topic, this statement is about a limit, not a constraint on subscriber type. The critical architectural constraint — that only SQS queues can subscribe — is what the question tests. This answer is a distractor that contains a true fact but misses the central point."
      }
    ],
    explanation: "TRAP: SNS FIFO topics have a critical restriction that SNS Standard topics do not: SNS FIFO can ONLY deliver to SQS queues (Standard or FIFO). Lambda, HTTP/HTTPS endpoints, email, SMS, and mobile push are all unsupported for SNS FIFO. This means converting from Standard to FIFO topics requires architectural changes when non-SQS subscribers exist. The pattern when you need ordered delivery to Lambda is: SNS FIFO → SQS FIFO → Lambda event source mapping (which preserves ordering per message group). Max 100 subscribers per FIFO topic vs unlimited for Standard.",
    keywords: ["SNS FIFO subscribers", "SQS only", "Lambda not supported", "HTTP not supported", "migration constraint"]
  },

  // ── d2-029 ── difficulty 3 ── ElastiCache Redis Multi-AZ vs Memcached ── taskStatement 2.2
  {
    id: "d2-029",
    domain: 2,
    taskStatement: "2.2",
    services: ["elasticache", "rds"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A social networking application stores user session tokens in an in-memory cache. Sessions must survive a single Availability Zone failure — if the cache node in one AZ fails, users should not be logged out. The session data must be recoverable and must persist across cache node reboots (no cold cache on restart). The solution must be HIGHLY AVAILABLE with automatic failover. Which Amazon ElastiCache configuration meets ALL three requirements?",
    options: [
      {
        id: "A",
        text: "Amazon ElastiCache for Memcached with Auto Discovery — Memcached cluster mode distributes data across nodes for HA.",
        isCorrect: false,
        explanation: "Wrong — Memcached has no data replication between nodes and no automatic failover. When a Memcached node fails, the data on that node is permanently lost. Memcached also has no persistence (data is lost on reboot). It fails all three requirements."
      },
      {
        id: "B",
        text: "Amazon ElastiCache for Valkey (Redis-compatible) with cluster mode disabled, one primary node, and one read replica in a different AZ, with Multi-AZ automatic failover enabled and AOF persistence.",
        isCorrect: true,
        explanation: "Correct — ElastiCache Redis/Valkey with Multi-AZ + automatic failover replicates data synchronously to a replica in a different AZ. If the primary node fails, ElastiCache automatically promotes the replica to primary (typically within 1–3 minutes). AOF (Append-Only File) persistence ensures session data survives node reboots. Valkey is recommended over Redis OSS as it is ~20% cheaper with identical functionality."
      },
      {
        id: "C",
        text: "Amazon ElastiCache for Redis with cluster mode enabled across six shards — data is distributed across nodes for high availability.",
        isCorrect: false,
        explanation: "Wrong — Cluster mode enables sharding but each shard still needs replicas for AZ fault tolerance. Cluster mode alone without replication does not provide AZ resilience — if a primary shard node fails in a cluster with no replicas, that shard's data is unavailable. The question also requires persistence, which requires enabling AOF separately."
      },
      {
        id: "D",
        text: "Amazon MemoryDB for Valkey — MemoryDB provides 99.99% availability with a multi-AZ transactional log.",
        isCorrect: false,
        explanation: "Wrong — MemoryDB for Valkey provides the highest durability and availability and would satisfy all requirements. However, MemoryDB is a durable primary database (not just a cache) and costs significantly more than ElastiCache. The question asks for a cache-layer solution with HA, not a primary database. ElastiCache Redis/Valkey with Multi-AZ is the correct and cost-appropriate answer."
      }
    ],
    explanation: "ElastiCache high-availability matrix: Memcached = no replication, no HA, no persistence (ephemeral only). Redis/Valkey = Multi-AZ replication + automatic failover, RDB + AOF persistence, cluster mode for sharding. When requirements include AZ failover + persistence, the answer is Redis/Valkey (not Memcached). Valkey is the AWS-recommended engine (open-source Redis fork, ~20% cheaper). AOF (Append-Only File) persistence logs every write command and enables recovery from reboots. AOF and Multi-AZ automatic failover together are mutually exclusive in some configurations — AOF is disabled by default when Multi-AZ is enabled to avoid sync issues during failover.",
    keywords: ["Memcached vs Redis", "AZ failover", "persistence", "Multi-AZ", "session store", "auto failover"]
  },

  // ── d2-030 ── difficulty 3 ── OpenSearch HA ── taskStatement 2.2
  {
    id: "d2-030",
    domain: 2,
    taskStatement: "2.2",
    services: ["opensearch", "kinesis"],
    constraintType: "ha",
    difficulty: 5,
    type: "single",
    stem: "A log analytics company ingests application logs from 500 microservices into Amazon OpenSearch Service for real-time search and dashboards. The current single-AZ OpenSearch cluster experiences downtime during node failures. The company needs the search cluster to tolerate the loss of an entire Availability Zone without data loss or downtime, and queries must continue to be served during node failures. Which OpenSearch configuration provides this resiliency?",
    options: [
      {
        id: "A",
        text: "Deploy a single-AZ OpenSearch cluster with enhanced shard allocation across all nodes for automatic rebalancing.",
        isCorrect: false,
        explanation: "Wrong — A single-AZ cluster cannot survive an AZ failure by definition. All nodes in the cluster reside in the same AZ; an AZ outage takes down all nodes simultaneously."
      },
      {
        id: "B",
        text: "Enable Multi-AZ with Standby on the OpenSearch domain — OpenSearch distributes data shards and replicas across three AZs, with one replica shard per primary shard.",
        isCorrect: true,
        explanation: "Correct — Amazon OpenSearch Service Multi-AZ with Standby (GA 2023) provisions one standby node per data node in a separate AZ and requires an equal number of primary and replica shards across 3 AZs. This configuration is '99.99% availability SLA compliant.' If one AZ fails, replica shards in the remaining AZs ensure all data remains accessible and queries continue without downtime. The standby nodes replace failed nodes automatically."
      },
      {
        id: "C",
        text: "Enable automated daily snapshots to Amazon S3 and restore the index from the latest snapshot after any node failure.",
        isCorrect: false,
        explanation: "Wrong — Snapshot restore requires rebuilding the cluster from S3 data, which takes tens of minutes to hours depending on index size. This provides a recovery mechanism (DR), not continuous availability. There will be downtime between the failure and the restore completion."
      },
      {
        id: "D",
        text: "Use two OpenSearch domains in different AZs and route search queries to both using an Application Load Balancer.",
        isCorrect: false,
        explanation: "Wrong — OpenSearch domains do not support active-active cross-domain querying through an ALB natively. Index synchronization between two independent domains requires custom replication logic. OpenSearch's native Multi-AZ with Standby is the purpose-built solution for AZ resilience within a single domain."
      }
    ],
    explanation: "Amazon OpenSearch Service Multi-AZ with Standby provides the highest level of availability for OpenSearch domains. It requires at least 3 AZs and distributes primary and replica shards across AZs such that each AZ holds an equal portion of data. Standby nodes are provisioned in a separate zone to replace failed nodes. This achieves a 99.99% availability SLA. For exam purposes: OpenSearch + AZ resilience + no downtime = Multi-AZ with Standby. Standard Multi-AZ (without Standby) provides AZ distribution but less stringent SLA.",
    keywords: ["OpenSearch Multi-AZ", "AZ failure tolerance", "no downtime", "replica shards", "99.99% availability"]
  },

  // ── d2-031 ── difficulty 3 ── CloudFront Functions vs Lambda@Edge ── taskStatement 2.1
  {
    id: "d2-031",
    domain: 2,
    taskStatement: "2.1",
    services: ["cloudfront", "lambda"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A global media company serves 5 billion video requests per month through an Amazon CloudFront distribution. For every viewer request, the company needs to: (1) normalize URL path casing (e.g., convert '/Video/Home' to '/video/home') to maximize cache-hit ratios, and (2) add a custom 'X-Region' response header with the nearest CloudFront edge region name. Both operations must run at ALL 600+ CloudFront Points of Presence with sub-millisecond execution. Which component implements these two viewer-event manipulations at the LOWEST cost?",
    options: [
      {
        id: "A",
        text: "Lambda@Edge functions at the viewer-request and viewer-response events, deployed in us-east-1 and replicated globally.",
        isCorrect: false,
        explanation: "Wrong — Lambda@Edge runs at 13 regional edge caches (not all 600+ PoPs), has a 5-second timeout for viewer events, and costs $0.60/million invocations plus GB-seconds. For 5 billion requests/month, Lambda@Edge cost would be ~$3,000+/month. CloudFront Functions are cheaper by ~6×  and run at all 600+ PoPs."
      },
      {
        id: "B",
        text: "Amazon CloudFront Functions triggered at viewer-request (URL normalization) and viewer-response (response header injection), written in JavaScript.",
        isCorrect: true,
        explanation: "Correct — CloudFront Functions run at ALL 600+ CloudFront PoPs (vs 13 for Lambda@Edge), execute in under 1 ms (sub-millisecond), and cost $0.10/million invocations (~6× cheaper than Lambda@Edge). They support both viewer-request (URL manipulation, cache-key normalization) and viewer-response (response header injection) events. URL case normalization and response header addition are classic CloudFront Functions use cases."
      },
      {
        id: "C",
        text: "An AWS Lambda function behind API Gateway that pre-processes requests before they reach CloudFront.",
        isCorrect: false,
        explanation: "Wrong — Processing requests BEFORE CloudFront defeats the purpose of the CDN (requests would hit Lambda first, then CloudFront as a passthrough). This does not run at edge PoPs and adds significant latency."
      },
      {
        id: "D",
        text: "CloudFront cache behaviors with specific path patterns to route /Video/* to a header-injection-capable origin.",
        isCorrect: false,
        explanation: "Wrong — Cache behaviors control routing and caching policies but cannot transform URLs or inject headers based on logic. Header injection at the origin requires the origin to add headers, not CloudFront — and URL normalization at the cache key level requires edge compute."
      }
    ],
    explanation: "CloudFront Functions vs Lambda@Edge selection: CloudFront Functions = viewer events only, JS, <1 ms, ALL 600+ PoPs, $0.10/M, no network calls. Lambda@Edge = all 4 trigger types (viewer + origin), Node.js/Python, 5s viewer/30s origin, 13 regional caches, $0.60/M + GB-seconds, CAN make network calls. Choose CloudFront Functions for high-volume, lightweight, viewer-event manipulations (URL rewriting, header injection, cache-key normalization) where cost is the driver. Choose Lambda@Edge when the logic requires network I/O, body access, or origin-level triggers.",
    keywords: ["CloudFront Functions vs Lambda@Edge", "sub-millisecond", "600+ PoPs", "lowest cost", "URL normalization", "viewer event"]
  },

  // ── d2-032 ── difficulty 4 ── Global Accelerator vs CloudFront trap ── taskStatement 2.2
  {
    id: "d2-032",
    domain: 2,
    taskStatement: "2.2",
    services: ["global-accelerator", "cloudfront", "nlb"],
    constraintType: "ha",
    difficulty: 4,
    type: "single",
    stem: "A financial trading platform processes time-sensitive order submissions using a TCP-based proprietary protocol over port 8443. The platform has regional deployments in us-east-1 and eu-west-1. Clients (institutional traders) require two STATIC IP addresses to whitelist in their firewall rules — the same IPs regardless of which region serves them. The solution must route clients to the NEAREST HEALTHY region and automatically failover within 30 seconds if a region becomes unhealthy. Which solution satisfies ALL requirements?",
    options: [
      {
        id: "A",
        text: "Amazon CloudFront with an Origin Group containing both regional Network Load Balancers — CloudFront provides low-latency global routing and static edge IPs.",
        isCorrect: false,
        explanation: "Wrong — CloudFront is an HTTP/HTTPS CDN and does NOT support TCP port 8443 with a proprietary TCP protocol. CloudFront also does NOT provide static IP addresses — its edge IPs are dynamic and region-dependent. Static IPs are provided by AWS Global Accelerator."
      },
      {
        id: "B",
        text: "AWS Global Accelerator with two static anycast IP addresses, endpoint groups pointing to Network Load Balancers in us-east-1 and eu-west-1, with health checks and ~30-second failover.",
        isCorrect: true,
        explanation: "Correct — Global Accelerator provides exactly 2 static anycast IPv4 addresses (whitelistable, never change) and routes Layer 4 (TCP/UDP) traffic over the AWS global backbone to the nearest healthy endpoint group. Health checks detect regional NLB failures within ~30 seconds and automatically route to the healthy region. This satisfies all four requirements: TCP protocol support, static IPs, nearest-region routing, and ~30-second failover."
      },
      {
        id: "C",
        text: "Route 53 Latency-based routing with Elastic IP addresses on the Network Load Balancers in each region.",
        isCorrect: false,
        explanation: "Wrong — NLBs can have static EIPs per AZ, but each regional NLB has DIFFERENT EIPs. Clients would need to whitelist all EIPs across all AZs in both regions (potentially 6+ IPs). Route 53 latency routing relies on DNS TTL (typically 60 seconds) for failover, which can exceed 30 seconds. Global Accelerator's 2 anycast IPs and instant-ish failover are the correct answer."
      },
      {
        id: "D",
        text: "Application Load Balancers in both regions with Route 53 Geoproximity routing to direct traders to the nearest region.",
        isCorrect: false,
        explanation: "Wrong — ALB operates at Layer 7 (HTTP/HTTPS) and does NOT support TCP-only proprietary protocols on arbitrary ports. Geoproximity routing is DNS-based with TTL-bounded failover time. ALB also does not provide static IPs."
      }
    ],
    explanation: "The four signals that point to Global Accelerator: (1) non-HTTP protocol (TCP/UDP, gaming, VoIP, custom protocols), (2) static IP addresses for firewall whitelisting (Global Accelerator = 2 anycast IPs; CloudFront = dynamic IPs), (3) global multi-region active-passive or active-active routing with fast failover (<30 seconds), (4) latency improvement via AWS global backbone (not just DNS routing). CloudFront is for HTTP/HTTPS caching. Global Accelerator is for Layer 4 performance + static IPs + fast failover.",
    keywords: ["TCP protocol", "static IP", "whitelist", "Global Accelerator vs CloudFront", "30-second failover"]
  },

  // ── d2-033 ── difficulty 3 ── EFS high availability ── taskStatement 2.2
  {
    id: "d2-033",
    domain: 2,
    taskStatement: "2.2",
    services: ["efs", "ec2", "auto-scaling"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A software company runs a fleet of Amazon EC2 instances in an Auto Scaling group across three Availability Zones. The application requires a POSIX-compliant shared file system that ALL instances can mount simultaneously and read/write concurrently. The file system must automatically replicate data across all three AZs to survive a single AZ failure without data loss. Which AWS storage solution BEST meets these requirements?",
    options: [
      {
        id: "A",
        text: "An Amazon Elastic Block Store (Amazon EBS) volume with Multi-Attach enabled, shared across all instances.",
        isCorrect: false,
        explanation: "Wrong — EBS Multi-Attach (io1/io2 only) allows up to 16 instances to mount the same volume, but ONLY in the SAME Availability Zone. It cannot span multiple AZs and requires a cluster-aware filesystem (not standard POSIX). It does not survive an AZ failure of the volume's home AZ."
      },
      {
        id: "B",
        text: "Amazon Elastic File System (Amazon EFS) Standard storage class with the default Regional configuration.",
        isCorrect: true,
        explanation: "Correct — Amazon EFS (Regional) automatically stores data redundantly across all AZs in the region. All EC2 instances mount the same DNS name (mount target per AZ) and get full POSIX semantics (NFS v4.1/v4.0). If one AZ fails, the file system and data remain fully accessible from the other AZs. This satisfies all requirements: POSIX, multi-instance concurrent access, multi-AZ replication, and AZ fault tolerance."
      },
      {
        id: "C",
        text: "Amazon EFS One Zone storage class — cheaper and still provides the shared file system with concurrent access.",
        isCorrect: false,
        explanation: "Wrong — EFS One Zone stores data in a SINGLE AZ. If that AZ experiences an outage, the file system is unavailable and data may be lost. The question requires surviving an AZ failure without data loss, which requires the Regional (multi-AZ) storage class."
      },
      {
        id: "D",
        text: "Amazon FSx for Lustre in Persistent mode — provides high-performance POSIX file system with durability.",
        isCorrect: false,
        explanation: "Wrong — FSx for Lustre is single-AZ only (both Scratch and Persistent modes). It provides high-throughput POSIX access for HPC workloads, but it cannot natively span multiple AZs. If the AZ hosting the Lustre file system fails, the file system is unavailable."
      }
    ],
    explanation: "Amazon EFS (Regional) is the AWS-native shared POSIX file system for multi-AZ, multi-instance concurrent access. Key facts: NFS 4.0/4.1 protocol, POSIX semantics, Regional storage class = data replicated across all AZs (11 9s durability), One Zone = single AZ (cheaper but not AZ-resilient). EFS scales throughput automatically with storage size (Bursting mode) or on demand (Elastic mode). FSx for Lustre = single-AZ HPC storage. FSx for Windows = SMB/NFS, Multi-AZ option. EBS Multi-Attach = same-AZ block storage.",
    keywords: ["shared file system", "POSIX", "multi-AZ", "concurrent access", "AZ fault tolerance", "EFS Regional"]
  },

  // ── d2-034 ── difficulty 3 ── AWS Backup centralized ── taskStatement 2.2
  {
    id: "d2-034",
    domain: 2,
    taskStatement: "2.2",
    services: ["backup", "rds", "dynamodb", "efs"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A large enterprise has 200 AWS accounts in AWS Organizations. Each account contains a mix of Amazon RDS databases, Amazon DynamoDB tables, Amazon EFS file systems, and Amazon EC2 instances. The security team requires: (1) all resources backed up daily with backups copied to a separate AWS account in a different region, (2) backup retention enforced for 7 years in immutable storage, and (3) a centralized compliance report showing which resources are non-compliant. Which service provides ALL three capabilities with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Implement custom Lambda functions in each account that trigger daily RDS snapshots, DynamoDB on-demand backups, and EFS backups, then copy the snapshots to the central account.",
        isCorrect: false,
        explanation: "Wrong — Managing custom Lambda backup functions across 200 accounts is a major operational burden. Lambda functions do not natively provide compliance reporting or centralized backup policies. Each new service would require function updates. This is the anti-pattern that AWS Backup solves."
      },
      {
        id: "B",
        text: "AWS Backup with a cross-account cross-region backup plan, Backup Vault Lock in Compliance mode in the central account, and AWS Backup Audit Manager for compliance reporting.",
        isCorrect: true,
        explanation: "Correct — AWS Backup supports: (1) centralized backup policies deployed across Organizations accounts via backup policies (no per-account configuration), (2) cross-region cross-account copy rules in backup plans, (3) Backup Vault Lock in Compliance mode = WORM storage that even AWS cannot delete after the cooling-off period, and (4) AWS Backup Audit Manager generates compliance reports for all accounts showing compliant and non-compliant resource backup status."
      },
      {
        id: "C",
        text: "Amazon Data Lifecycle Manager (DLM) with cross-account sharing rules applied via AWS Organizations.",
        isCorrect: false,
        explanation: "Wrong — DLM manages EBS snapshot and AMI lifecycle only. It does not support RDS, DynamoDB, or EFS. It also does not provide centralized multi-service compliance reporting. DLM is a narrower service than AWS Backup."
      },
      {
        id: "D",
        text: "AWS Config rules that detect missing backups and trigger Lambda auto-remediation to create snapshots on non-compliant resources.",
        isCorrect: false,
        explanation: "Wrong — Config provides compliance detection but does not manage the backup schedule, cross-account copy, or immutable vault storage. Auto-remediation via Lambda adds operational complexity. AWS Backup is the purpose-built centralized backup management service."
      }
    ],
    explanation: "AWS Backup is the correct answer for 'centralized multi-service backup across many accounts with compliance reporting.' Key features: backup policies in AWS Organizations push backup plans to all member accounts automatically; cross-account cross-region copy rules in backup plans move backups to an isolated central account; Backup Vault Lock Compliance mode = immutable WORM (no one can delete, even AWS, after cooling-off period); AWS Backup Audit Manager generates compliance framework reports (NIST, ISO, HIPAA) showing which resources are compliant. Supported services include EBS, EFS, FSx, RDS, Aurora, DynamoDB, S3, EC2 AMIs, Storage Gateway, Neptune, DocumentDB, Timestream, Redshift, CloudFormation, and VMware.",
    keywords: ["centralized backup", "cross-account", "cross-region", "Backup Vault Lock Compliance", "Audit Manager", "AWS Organizations"]
  },

  // ── d2-035 ── difficulty 5 ── RDS Read Replica failover trap ── taskStatement 2.2
  {
    id: "d2-035",
    domain: 2,
    taskStatement: "2.2",
    services: ["rds", "aurora", "route53"],
    constraintType: "ha",
    difficulty: 5,
    type: "single",
    stem: "A startup runs an Amazon RDS MySQL instance (Single-AZ, no Multi-AZ enabled) with two Read Replicas in the same region. A developer proposes: 'We have two Read Replicas. If the primary fails, we can promote one to primary instantly — this is effectively our high-availability solution without paying for Multi-AZ.' A solutions architect reviewing this proposal identifies two critical flaws. Which answer correctly identifies BOTH flaws?",
    options: [
      {
        id: "A",
        text: "Flaw 1: Read Replica promotion requires manual intervention — it is NOT automatic. Flaw 2: Asynchronous replication means the promoted replica may have replication lag, causing data loss (RPO > 0 seconds).",
        isCorrect: true,
        explanation: "Correct — Both flaws identified are real: (1) RDS Read Replica promotion is a MANUAL operation triggered via the console, CLI, or API (or scripted automation). Unlike Multi-AZ automatic failover, there is no automatic detection and promotion. The RTO depends on how quickly an operator notices the failure and runs the promotion (minutes to hours of downtime). (2) Read Replicas use ASYNCHRONOUS replication. When the primary fails, the replica may be seconds or minutes behind — all transactions not yet replicated are lost. Multi-AZ standbys use SYNCHRONOUS replication (RPO = 0 for committed transactions)."
      },
      {
        id: "B",
        text: "Flaw 1: Read Replicas are in a different region, causing high promotion latency. Flaw 2: Read Replicas cannot be promoted — only Multi-AZ standbys can be promoted to primary.",
        isCorrect: false,
        explanation: "Wrong — Both flaws stated here are incorrect. Read Replicas can be in the same or different region (the question says same region). Read Replicas CAN be promoted to primary — this is a supported RDS operation. The actual flaws are manual promotion (not automatic) and asynchronous replication lag (RPO > 0)."
      },
      {
        id: "C",
        text: "Flaw 1: Promotion causes the replica to reboot, taking 15–20 minutes. Flaw 2: Multi-AZ must be enabled before promotion.",
        isCorrect: false,
        explanation: "Wrong — Read Replica promotion does not take 15–20 minutes; promotion itself is fast (seconds to a few minutes). You also do NOT need Multi-AZ enabled to promote a Read Replica — promotion is independent of Multi-AZ configuration. These are fabricated flaws."
      },
      {
        id: "D",
        text: "The proposal has no flaws — Read Replicas provide equivalent HA to Multi-AZ with lower cost.",
        isCorrect: false,
        explanation: "Wrong — Read Replicas and Multi-AZ serve fundamentally different purposes. Multi-AZ (synchronous replication, automatic failover, RPO = 0 for committed transactions) provides HA. Read Replicas (asynchronous replication, manual promotion, RPO > 0) provide read scaling. Using Read Replicas as HA is an anti-pattern with documented failure modes."
      }
    ],
    explanation: "TRAP: The classic RDS misconception is treating Read Replicas as HA equivalents to Multi-AZ. The two critical distinctions: (1) Replication type — Multi-AZ standby uses synchronous replication (0 data loss for committed transactions); Read Replicas use asynchronous replication (replication lag = potential data loss). (2) Failover type — Multi-AZ fails over automatically with DNS CNAME flip (60–120 seconds, zero manual action); Read Replica promotion is manual (operator must notice failure, trigger promotion, update application endpoint). For true HA, Multi-AZ or Aurora with replicas is required.",
    keywords: ["Read Replica vs Multi-AZ", "manual promotion", "asynchronous replication", "RPO > 0", "not automatic failover"]
  },

  // ── d2-036 ── difficulty 4 ── Aurora Serverless v2 scale-to-zero ── taskStatement 2.2
  {
    id: "d2-036",
    domain: 2,
    taskStatement: "2.2",
    services: ["aurora", "lambda"],
    constraintType: "cost",
    difficulty: 4,
    type: "single",
    stem: "A startup's SaaS platform has 500 customer tenants, each with an isolated Amazon Aurora PostgreSQL database. Tenant databases receive traffic sporadically — most databases are idle for 22 hours per day. The startup wants to minimize database costs to near-zero during idle periods while ensuring tenant databases resume automatically when a request arrives. The first query after idle must complete within 20 seconds. Which configuration MINIMIZES idle costs while meeting the resume latency requirement?",
    options: [
      {
        id: "A",
        text: "Amazon Aurora Serverless v2 with minimum capacity of 0.5 ACUs (Aurora Capacity Units) — databases scale down to minimum when idle.",
        isCorrect: false,
        explanation: "Wrong — Setting minimum ACUs to 0.5 means the database is always consuming 0.5 ACUs even when idle (~$0.12/hour per database). For 500 databases idle 22 hours/day, this costs ~$660/day. Minimum 0 ACUs (scale-to-zero) would eliminate idle compute costs."
      },
      {
        id: "B",
        text: "Amazon Aurora Serverless v2 with minimum capacity of 0 ACUs (scale-to-zero) and an auto-pause threshold configured — databases scale to zero after inactivity and resume in approximately 15 seconds on first connection.",
        isCorrect: true,
        explanation: "Correct — Aurora Serverless v2 scale-to-zero (GA November 2024) sets minimum ACUs to 0. After the configured auto-pause threshold (5 minutes to 24 hours of no connections), the database enters a near-zero-cost paused state (only storage billed). When a connection arrives, the database resumes in approximately 15 seconds. At 15 seconds, this easily meets the 20-second first-query requirement. This is the optimal configuration for 500 sporadically-accessed tenant databases."
      },
      {
        id: "C",
        text: "Amazon Aurora Provisioned with EC2 instance class db.t3.medium — small, cheap T-class instances minimize costs.",
        isCorrect: false,
        explanation: "Wrong — Provisioned instances run 24/7 regardless of traffic. A db.t3.medium runs 24 hours/day. For 500 databases × ~$0.073/hour = ~$876/day. Scale-to-zero eliminates idle compute costs entirely (only storage billed when paused)."
      },
      {
        id: "D",
        text: "Stop each Aurora provisioned instance using a scheduled Lambda function at midnight and restart at business hours — this achieves near-zero idle cost.",
        isCorrect: false,
        explanation: "Wrong — Stopped Aurora instances automatically restart after 7 days (AWS limitation). Scheduled start/stop requires Lambda maintenance, applies business-hours logic that doesn't match per-tenant sporadic usage, and leaves databases off when tenants in different timezones need access. Scale-to-zero handles per-connection auto-pause naturally without scheduling logic."
      }
    ],
    explanation: "Aurora Serverless v2 with minimum 0 ACUs (scale-to-zero) — GA November 2024 — is purpose-built for the 'many sporadic databases' pattern. When minimum ACUs = 0 and the auto-pause threshold is met (no open connections for the configured duration, 5 min–24 hours), the database pauses and only storage is charged. Resume on first connection takes ~15 seconds (or ~30 seconds after deeper sleep beyond 24 hours of inactivity). Constraints: scale-to-zero requires Aurora PostgreSQL 13.15+/14.12+/15.7+/16.3+ or Aurora MySQL 3.08+; incompatible with RDS Proxy, Zero-ETL, and binary log replication.",
    keywords: ["scale-to-zero", "Aurora Serverless v2", "minimum 0 ACUs", "auto-pause", "15 seconds resume", "500 tenants"]
  },

  // ── d2-037 ── difficulty 5 ── Warm Standby cost trap ── taskStatement 2.2
  {
    id: "d2-037",
    domain: 2,
    taskStatement: "2.2",
    services: ["rds", "ec2", "auto-scaling", "route53"],
    constraintType: "ha",
    difficulty: 5,
    type: "single",
    stem: "A media company currently uses a Pilot Light DR strategy with RTO of 45 minutes and RPO of 5 minutes. The business demands the RTO be reduced to 5 minutes and RPO to 30 seconds while MINIMIZING additional monthly DR cost. A junior engineer proposes upgrading to Multi-Site Active/Active for the best RTO/RPO. A senior architect proposes Warm Standby. Which choice is CORRECT, and what is the key reason the senior architect's recommendation is better?",
    options: [
      {
        id: "A",
        text: "Multi-Site Active/Active is correct because it provides the lowest RTO/RPO (~0/~0), exceeding the new requirements.",
        isCorrect: false,
        explanation: "Wrong — Multi-Site Active/Active provides near-zero RTO/RPO but at approximately 2× the infrastructure cost (full production capacity in both regions 24/7). The question specifies minimizing additional DR cost. Active/Active is over-engineered for a 5-minute RTO requirement and wastes budget."
      },
      {
        id: "B",
        text: "Warm Standby is correct because it runs a scaled-down but immediately available stack in the DR region, providing ~1-minute RTO and sub-30-second RPO with near-synchronous replication at a cost of roughly 20–30% of full production DR cost.",
        isCorrect: true,
        explanation: "Correct — Warm Standby keeps a reduced-capacity production stack running in the DR region, enabling near-immediate failover (Route 53 health-check flip within 30 seconds, DR region serves traffic immediately at reduced capacity). Near-synchronous database replication achieves sub-30-second RPO. Cost is significantly less than Active/Active because the DR region runs at 20–30% of production capacity. This is the minimum cost upgrade path from Pilot Light that meets the 5-minute RTO and 30-second RPO requirements."
      },
      {
        id: "C",
        text: "Neither is correct — upgrading from Pilot Light to any other strategy is unnecessary because 45 minutes RTO is already adequate.",
        isCorrect: false,
        explanation: "Wrong — The question explicitly states the business has NEW requirements of 5-minute RTO and 30-second RPO. The current 45-minute RTO and 5-minute RPO do NOT meet the new requirements. A strategy upgrade is required."
      },
      {
        id: "D",
        text: "Pilot Light can achieve a 5-minute RTO with AWS Lambda launching EC2 instances from pre-baked AMIs in under 5 minutes via Auto Scaling.",
        isCorrect: false,
        explanation: "Wrong — EC2 instance launch from an Auto Scaling group (with AMI-based bootstrapping) typically takes 3–7 minutes for instance launch + application startup. A 5-minute RTO from Pilot Light (compute OFF in DR region) is extremely tight and not reliably achievable, especially with application warmup time. Warm Standby (compute already running and healthy) is the reliable path to a consistent 5-minute RTO."
      }
    ],
    explanation: "DR strategy upgrade cost-effectiveness: The test here is avoiding both under-engineering (Pilot Light cannot reliably meet 5-minute RTO) and over-engineering (Active/Active is 2× cost for requirements achievable by Warm Standby). Warm Standby provides: RTO ~1 minute (traffic shifts to already-running DR stack via Route 53 health check), RPO <30 seconds (near-synchronous replication), cost = DR region at 20–30% of production capacity. It's the 'minimum cost that meets requirements' answer — a standard optimization framing on the SAA exam.",
    keywords: ["Warm Standby vs Active/Active", "minimize additional cost", "5-minute RTO", "30-second RPO", "over-engineered"]
  },

  // ── d2-038 ── difficulty 2 ── Elastic Disaster Recovery (DRS) ── taskStatement 2.2
  {
    id: "d2-038",
    domain: 2,
    taskStatement: "2.2",
    services: ["disaster-recovery", "ec2"],
    constraintType: "ha",
    difficulty: 2,
    type: "single",
    stem: "A manufacturing company runs a critical production scheduling application on VMware virtual machines in an on-premises data center. After a ransomware incident, the company wants to implement a cloud-based DR solution that continuously replicates the VMs to AWS at the block level, enables non-disruptive disaster recovery drills, and can recover to a point in time before the ransomware infection (point-in-time recovery). The target RTO is 15 minutes. Which AWS service BEST meets these requirements?",
    options: [
      {
        id: "A",
        text: "AWS Storage Gateway Volume Gateway in Cached mode — replicate on-premises iSCSI volumes to AWS and restore from S3-backed EBS snapshots.",
        isCorrect: false,
        explanation: "Wrong — Volume Gateway (Cached mode) creates EBS snapshots periodically from on-premises volumes. Snapshots are not continuously updating (they are point-in-time copies taken on a schedule), and recovery requires manual provisioning of EC2 instances and attachment of restored volumes. There is no built-in orchestration for non-disruptive drills or automated recovery."
      },
      {
        id: "B",
        text: "AWS Elastic Disaster Recovery (AWS DRS) — continuous block-level replication, point-in-time recovery with a rolling 24-hour window, and automated non-disruptive drills.",
        isCorrect: true,
        explanation: "Correct — AWS Elastic Disaster Recovery (DRS, formerly CloudEndure DR) provides: (1) continuous block-level replication from any source (physical, VMware, Hyper-V, EC2, other clouds) to a low-cost AWS staging area, (2) sub-second RPO (block-level changes replicated continuously), (3) RTO of 5–20 minutes (automated launch to converted EC2 instances), (4) a rolling point-in-time recovery window (~24 hours) for recovering before ransomware infection, and (5) non-disruptive drills that launch recovery instances without impacting replication."
      },
      {
        id: "C",
        text: "AWS Backup with VMware agent-based daily backups, cross-region copy to us-west-2, and restore to EC2.",
        isCorrect: false,
        explanation: "Wrong — AWS Backup with VMware integration creates daily backups, meaning RPO is up to 24 hours and RTO is the time to restore a multi-gigabyte VM (potentially hours). This does not meet the 15-minute RTO or the continuous replication requirement for point-in-time recovery."
      },
      {
        id: "D",
        text: "AWS Site-to-Site VPN with replication software installed on each VMware VM to replicate changed files to Amazon S3.",
        isCorrect: false,
        explanation: "Wrong — File-level S3 replication does not capture block-level changes (OS state, database files, registry) with the consistency required for system-level recovery. It also lacks DR orchestration (health checks, automated EC2 launch, drill functionality)."
      }
    ],
    explanation: "AWS Elastic Disaster Recovery (DRS) is purpose-built for lift-and-shift DR from any source (physical servers, VMware VMs, Hyper-V, other clouds, EC2) to AWS. Key specs: RPO = seconds (continuous block replication), RTO = 5–20 minutes (automated conversion and launch to EC2), point-in-time recovery window (~24 hours default, up to several days), non-disruptive drills, automatic OS conversion (VMware → EC2), and ~$20/server/month. Note: DRS does NOT replicate managed databases like RDS — those should use native RDS replication tools.",
    keywords: ["AWS DRS", "block-level replication", "VMware", "point-in-time recovery", "ransomware", "15-minute RTO"]
  },

  // ── d2-039 ── difficulty 4 ── Route53 Geoproximity with bias ── taskStatement 2.2
  {
    id: "d2-039",
    domain: 2,
    taskStatement: "2.2",
    services: ["route53", "cloudfront"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A streaming service has production servers in us-east-1 and eu-west-1. Business intelligence data shows that users in South America are geographically closer to us-east-1 (Sao Paulo to Northern Virginia = ~7,600 km) but measure LOWER latency to eu-west-1 (Dublin) due to better peering agreements on the trans-Atlantic route. After launching a new ap-southeast-1 (Singapore) region, the team wants to gradually shift South American traffic from us-east-1 toward eu-west-1 while ALSO routing most Asia-Pacific traffic to ap-southeast-1, with the ability to TUNE the traffic split using a dial without changing DNS records. Which Route 53 policy supports this use case?",
    options: [
      {
        id: "A",
        text: "Route 53 Latency-based routing — automatically routes to the lowest-latency region based on measured network latency.",
        isCorrect: false,
        explanation: "Wrong — Latency-based routing automatically routes based on measured network latency and requires no manual configuration. However, you cannot add a 'bias' to shift traffic beyond what latency dictates. The question requires a tunable bias dial to artificially influence routing geography beyond pure latency measurements."
      },
      {
        id: "B",
        text: "Route 53 Geoproximity routing — routes based on the geographic distance between the user and the resource, with a bias dial (–99 to +99) to expand or shrink each region's routing area.",
        isCorrect: true,
        explanation: "Correct — Geoproximity routing uses the geographic distance between the user's DNS resolver location and the resource. The bias parameter (–99 to +99) artificially expands (+) or shrinks (–) a region's geographic footprint: applying a +50 bias to eu-west-1 makes it attract traffic from a larger geographic area (including South America), shifting traffic from us-east-1. Geoproximity routing requires Route 53 Traffic Flow. This is distinct from Geolocation (which routes by legal jurisdiction) and Latency (which routes by measured network performance)."
      },
      {
        id: "C",
        text: "Route 53 Geolocation routing — create records for South America continent mapped to eu-west-1 and for Asia-Pacific mapped to ap-southeast-1.",
        isCorrect: false,
        explanation: "Wrong — Geolocation routing would work to force South America to eu-west-1, but it routes by hard legal jurisdiction (continent/country) with no bias dial. You cannot gradually tune the traffic split percentage or adjust which geographic boundary users fall into — it's a binary assignment. Geoproximity with bias provides the tunable, gradual-shift capability."
      },
      {
        id: "D",
        text: "Route 53 Weighted routing with weights 70/30 for eu-west-1 and us-east-1 for South American users.",
        isCorrect: false,
        explanation: "Wrong — Weighted routing splits traffic by percentage weight and applies globally — all users worldwide see the same weight distribution, not just South Americans. You cannot combine Weighted routing with geographic targeting for individual continents without Traffic Flow policies."
      }
    ],
    explanation: "Route 53 Geoproximity routing is the policy that routes by geographic distance AND allows a bias dial (–99 to +99) to shift the effective routing boundary. This enables: (1) gradual traffic migration between regions, (2) fine-tuning which geographic areas fall into each region's catchment, (3) prioritizing a new region by applying a positive bias. Geoproximity requires Route 53 Traffic Flow (visual policy builder). Compare: Geolocation = hard jurisdiction-based routing (legal compliance). Latency = auto-measured network performance. Geoproximity = distance + tunable bias (traffic engineering).",
    keywords: ["Geoproximity", "bias dial", "gradual traffic shift", "geographic distance", "tunable routing"]
  },

  // ── d2-040 ── difficulty 4 ── Multi-region active-active with Route53 ── taskStatement 2.2
  {
    id: "d2-040",
    domain: 2,
    taskStatement: "2.2",
    services: ["route53", "alb", "dynamodb", "cloudfront"],
    constraintType: "ha",
    difficulty: 4,
    type: "multi-select",
    stem: "A global e-commerce company wants to achieve near-zero RTO and RPO (Multi-Site Active/Active) across us-east-1 and eu-west-1. The solution architect identifies FOUR architectural requirements for a properly designed active-active deployment. Which TWO of the following are REQUIRED components of a Multi-Site Active/Active architecture for a stateful web application? (Select TWO)",
    options: [
      {
        id: "A",
        text: "A globally consistent, multi-region writable data store (such as Amazon DynamoDB Global Tables or Amazon Aurora Global Database with write forwarding) so writes from either region persist without data loss.",
        isCorrect: true,
        explanation: "Correct — Active/Active requires that writes accepted in either region are durable and replicated globally. DynamoDB Global Tables (multi-active, ~1 second replication) or Aurora Global Database with write forwarding (RPO ~1 second) allows writes from both regions. Without a multi-region data tier, each region has its own isolated data and the architecture is not truly active-active (it is active-standby with isolated data)."
      },
      {
        id: "B",
        text: "Amazon Route 53 Failover routing set to route all traffic to us-east-1 as the primary and only use eu-west-1 when us-east-1 is unhealthy.",
        isCorrect: false,
        explanation: "Wrong — Route 53 Failover routing is active-PASSIVE (primary/secondary). Active/Active requires BOTH regions to serve live traffic simultaneously. For active-active, use Route 53 Latency-based routing (routes each user to the lowest-latency region), Geoproximity routing (routes by geographic distance), or Weighted routing (splits traffic by percentage) — NOT Failover routing."
      },
      {
        id: "C",
        text: "Route 53 Latency-based routing with health checks on both regional Application Load Balancers, directing users to the nearest healthy region and automatically removing an unhealthy region from the DNS answer.",
        isCorrect: true,
        explanation: "Correct — Active/Active architecture requires: (1) both regions to simultaneously serve live traffic, and (2) automatic failover when one region becomes unhealthy. Route 53 Latency-based routing with health checks achieves both: each user is directed to the lowest-latency region (both regions active), and if a region's health check fails, Route 53 removes it from responses and routes all traffic to the remaining healthy region."
      },
      {
        id: "D",
        text: "An Amazon S3 bucket with Cross-Region Replication as the primary database for transactional data.",
        isCorrect: false,
        explanation: "Wrong — S3 is object storage, not a transactional database. S3 CRR does not provide the read-after-write consistency, transactions, or query capabilities required for a stateful e-commerce application database. S3 CRR is appropriate for static asset replication (images, videos) in an active-active design, but it cannot serve as the primary transactional data store."
      }
    ],
    explanation: "Multi-Site Active/Active requires two critical components: (1) Multi-region writable data tier — both regions must be able to accept writes and replicate to the other region (DynamoDB Global Tables or Aurora Global Database with write forwarding). Without this, 'active-active' is a fiction — one region's data changes are isolated. (2) Traffic distribution policy that actively uses BOTH regions simultaneously — Route 53 Latency-based, Geoproximity, or Weighted routing (NOT Failover routing, which is active-passive). Health checks on both regional endpoints ensure automatic removal of unhealthy regions.",
    keywords: ["active-active", "multi-region writable", "Route 53 latency-based routing", "health checks", "DynamoDB Global Tables", "two required components"]
  }
]
