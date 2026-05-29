import { Question } from "../lib/types"

export const domain1NewQuestions2: Question[] = [

  // ─── Difficulty 2 (2 questions) ─────────────────────────────
  {
    id: "d1-041",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "flow-logs", "cloudwatch-logs"],
    constraintType: "security",
    difficulty: 2,
    type: "single",
    stem: "A network engineer wants to capture metadata about traffic flowing through an Amazon Virtual Private Cloud (Amazon VPC) to diagnose a connectivity issue between two EC2 instances. The engineer needs to see the source IP, destination IP, port, protocol, and whether traffic was accepted or rejected. Which AWS feature provides this data with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Enable Amazon VPC Traffic Mirroring on both instance ENIs and send mirrored packets to a monitoring EC2 instance running Wireshark.",
        isCorrect: false,
        explanation: "VPC Traffic Mirroring captures full packet contents and requires deploying and managing a monitoring instance as the mirror target. For diagnosing accept/reject decisions and connection tuples, full packet capture is unnecessary overhead — Flow Logs provide exactly the metadata described."
      },
      {
        id: "B",
        text: "Enable Amazon VPC Flow Logs on the VPC, subnet, or ENI and publish the logs to Amazon CloudWatch Logs.",
        isCorrect: true,
        explanation: "VPC Flow Logs capture the 5-tuple (source IP, destination IP, source port, destination port, protocol), byte count, packet count, and the ACCEPT/REJECT decision made by security groups and NACLs. They publish to CloudWatch Logs, Amazon S3, or Kinesis Data Firehose with minimal configuration. This is the purpose-built tool for network flow metadata analysis."
      },
      {
        id: "C",
        text: "Enable AWS CloudTrail with Data Events on the EC2 instances to capture all network API calls.",
        isCorrect: false,
        explanation: "CloudTrail records API calls made to AWS service endpoints (the control plane), not network packet flows between EC2 instances. It does not capture connection-level metadata such as source IP, destination port, or ACCEPT/REJECT decisions for instance-to-instance traffic."
      },
      {
        id: "D",
        text: "Install the Amazon CloudWatch Agent on both instances and configure network interface statistics collection.",
        isCorrect: false,
        explanation: "The CloudWatch Agent collects OS-level metrics (CPU, memory, disk, network throughput totals) and application logs. It does not provide per-connection flow metadata, source/destination IPs, port-level breakdowns, or accept/reject decisions. VPC Flow Logs are the correct tool for this."
      }
    ],
    explanation: "VPC Flow Logs are the standard AWS mechanism for capturing IP traffic metadata. The default log record includes version, account-id, interface-id, srcaddr, dstaddr, srcport, dstport, protocol, packets, bytes, start/end timestamps, and action (ACCEPT/REJECT). They require only a simple enablement step at the VPC, subnet, or ENI level. Note that Flow Logs capture metadata only — they do not capture packet payload contents (Traffic Mirroring does that).",
    keywords: ["flow logs", "ACCEPT REJECT", "5-tuple", "network metadata", "LEAST operational overhead"]
  },

  {
    id: "d1-042",
    domain: 1,
    taskStatement: "1.1",
    services: ["artifact"],
    constraintType: "security",
    difficulty: 2,
    type: "single",
    stem: "A compliance officer at a financial institution needs to download AWS's SOC 2 Type II report and sign the AWS Business Associate Addendum (BAA) for HIPAA compliance. Where should the compliance officer go to access these documents?",
    options: [
      {
        id: "A",
        text: "AWS Security Hub — it aggregates compliance findings and provides downloadable compliance reports.",
        isCorrect: false,
        explanation: "AWS Security Hub evaluates your own AWS environment against compliance standards (CIS, PCI DSS, NIST). It does not provide AWS's own third-party audit reports (such as SOC 2) or legal agreements like the HIPAA BAA."
      },
      {
        id: "B",
        text: "AWS Audit Manager — it continuously collects evidence for compliance frameworks including SOC 2 and HIPAA.",
        isCorrect: false,
        explanation: "AWS Audit Manager collects evidence about YOUR environment's compliance posture. It does not provide AWS's own SOC 2 report or legal agreements. Audit Manager helps you prepare for your audits, not access AWS's audit results."
      },
      {
        id: "C",
        text: "AWS Artifact — it provides on-demand access to AWS's compliance reports and allows customers to review and accept agreements.",
        isCorrect: true,
        explanation: "AWS Artifact is the self-service portal for AWS compliance documentation. The Reports section provides downloadable copies of AWS's own third-party audit reports (SOC 1/2/3, PCI DSS AoC, ISO 27001, FedRAMP, HIPAA, GDPR, NIST, and more). The Agreements section allows customers to review and accept legal agreements such as the HIPAA BAA and NDA. No support case or manual request is required."
      },
      {
        id: "D",
        text: "AWS Trusted Advisor — its compliance checks include links to AWS audit documentation and agreements.",
        isCorrect: false,
        explanation: "AWS Trusted Advisor performs automated best-practice checks against your AWS account configuration (security groups, IAM, S3 permissions, etc.). It does not provide access to AWS's compliance reports or legal agreements."
      }
    ],
    explanation: "The compliance trio distinction: AWS Artifact = AWS's own compliance docs and agreements (SOC 2, PCI AoC, ISO certs, HIPAA BAA); Audit Manager = continuous evidence collection for YOUR audit readiness; Security Hub = continuous posture monitoring of your environment against standards. For anything asking about AWS's own certifications or legal agreements with AWS, the answer is always AWS Artifact.",
    keywords: ["SOC 2 report", "HIPAA BAA", "AWS Artifact", "compliance reports", "agreements"]
  },

  // ─── Difficulty 3 (12 questions) ────────────────────────────
  {
    id: "d1-043",
    domain: 1,
    taskStatement: "1.2",
    services: ["network-firewall", "waf", "security-group", "nacl"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A security architect is selecting controls to defend a three-tier web application. The requirements include: (1) blocking specific malicious IP addresses at the subnet level, (2) preventing SQL injection in HTTP request bodies at the application layer, (3) stateful deep packet inspection of north-south VPC traffic with Suricata-compatible IPS rules, and (4) blocking traffic between application-tier EC2 instances and the database tier except on port 5432. Which pairing of AWS services, in order, BEST meets all four requirements?",
    options: [
      {
        id: "A",
        text: "(1) Security Group, (2) AWS WAF, (3) AWS Network Firewall, (4) NACL",
        isCorrect: false,
        explanation: "Security groups cannot deny based on IP addresses with an explicit deny rule — they only allow. You cannot add an explicit IP block deny in a security group. For blocking specific IPs with a deny rule, NACLs are required. The remaining mappings are correct but the first is wrong."
      },
      {
        id: "B",
        text: "(1) Network ACL (NACL), (2) AWS WAF, (3) AWS Network Firewall, (4) Security Group",
        isCorrect: true,
        explanation: "NACLs support explicit Deny rules by CIDR — they are the correct mechanism to block specific malicious IP addresses at the subnet level. AWS WAF operates at Layer 7 HTTP/HTTPS and inspects request bodies for SQL injection patterns. AWS Network Firewall is a stateful firewall/IPS supporting Suricata-compatible rules for deep packet inspection. Security groups referencing each other (app-tier SG → DB SG on port 5432) are the right mechanism for tier-to-tier access control using logical security group IDs."
      },
      {
        id: "C",
        text: "(1) NACL, (2) AWS Network Firewall, (3) AWS WAF, (4) Security Group",
        isCorrect: false,
        explanation: "AWS Network Firewall operates at Layers 3-7 and can inspect HTTP bodies, but its primary role is perimeter/VPC-level deep packet inspection and IPS — not a managed WAF replacement. AWS WAF integrates directly with CloudFront/ALB for application-layer HTTP inspection, making it the better fit for requirement (2). Options (2) and (3) are transposed here."
      },
      {
        id: "D",
        text: "(1) NACL, (2) AWS WAF, (3) GuardDuty, (4) Security Group",
        isCorrect: false,
        explanation: "Amazon GuardDuty is a threat detection service that generates findings by analyzing logs — it does not perform inline packet inspection or act as an IPS with Suricata rules. GuardDuty is a detective control, not a preventive one. For stateful deep packet inspection with Suricata rules, AWS Network Firewall is required."
      }
    ],
    explanation: "Layer mapping is critical for this question type. NACLs = subnet-level stateless packet filter with allow+deny (blocks specific IPs). AWS WAF = Layer 7 HTTP/HTTPS inspection at ALB/CloudFront (SQL injection, XSS, rate limiting). AWS Network Firewall = VPC-perimeter stateful Layer 3-7 firewall with Suricata IPS rules. Security Groups = ENI-level stateful allow-only control that references other SGs for tier-to-tier access. Each operates at a distinct layer and serves a distinct purpose.",
    keywords: ["layer distinctions", "NACL deny IP", "WAF SQL injection", "Network Firewall Suricata", "security group tier-to-tier"]
  },

  {
    id: "d1-044",
    domain: 1,
    taskStatement: "1.1",
    services: ["firewall-manager", "waf", "organizations", "config"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A large enterprise has 80 AWS accounts in AWS Organizations. The security team needs to ensure that every Application Load Balancer (ALB) across all accounts has a specific AWS WAF Web ACL attached — including any new ALBs created in the future — without requiring each account team to manually attach WAF rules. The team also needs centralized visibility into which ALBs are non-compliant. Which AWS service enables this with LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Create an AWS Config managed rule in every account that checks ALBs for WAF attachment and triggers automated remediation via SSM Automation.",
        isCorrect: false,
        explanation: "Config rules per account require deployment and maintenance across 80 accounts. Even with StackSets, each account needs the Config rule and remediation deployed. This is per-account configuration versus a centralized policy push — more operational overhead than Firewall Manager."
      },
      {
        id: "B",
        text: "Use AWS Firewall Manager with an AWS WAF policy. Define the policy in the Firewall Manager administrator account to automatically deploy the WAF Web ACL to all ALBs across all accounts in scope, and remediate non-compliant resources automatically.",
        isCorrect: true,
        explanation: "AWS Firewall Manager is purpose-built for centrally managing WAF, Shield Advanced, Network Firewall, Route 53 Resolver DNS Firewall, security groups, and NACLs across an Organization. A single WAF policy in Firewall Manager automatically identifies all in-scope ALBs, attaches the specified Web ACL, and continuously enforces compliance — including on new ALBs created after policy creation. The Firewall Manager console provides centralized compliance visibility across all 80 accounts."
      },
      {
        id: "C",
        text: "Write an AWS Lambda function triggered by CloudTrail events for elasticloadbalancing:CreateLoadBalancer that automatically attaches a WAF Web ACL to every new ALB.",
        isCorrect: false,
        explanation: "An event-driven Lambda approach handles new ALBs going forward but does not address the 80 existing accounts' existing ALBs. It also requires deploying and maintaining the Lambda in each account or using cross-account event forwarding — significant operational overhead compared to Firewall Manager's built-in policy enforcement."
      },
      {
        id: "D",
        text: "Apply a Service Control Policy (SCP) that denies CreateLoadBalancer unless the request includes a WAF tag.",
        isCorrect: false,
        explanation: "SCPs can block resource creation based on conditions, but AWS WAF attachment to an ALB is a separate API call (wafv2:AssociateWebACL) made after ALB creation — not an attribute of CreateLoadBalancer. A tag-based SCP would not enforce actual WAF attachment. Additionally, this does not retroactively fix existing non-compliant ALBs or provide centralized compliance visibility."
      }
    ],
    explanation: "AWS Firewall Manager is the centralized governance layer for security policies across AWS Organizations. Prerequisites: Organizations with all features enabled, AWS Config enabled in every in-scope region and account, and a designated Firewall Manager administrator account. Once configured, a WAF policy defines which resources (ALBs, CloudFront, API Gateway) must have which Web ACL attached. Firewall Manager continuously enforces this — auto-remediating non-compliant resources and reporting compliance status centrally.",
    keywords: ["centralized WAF", "Firewall Manager", "80 accounts", "auto-remediate", "LEAST operational overhead"]
  },

  {
    id: "d1-045",
    domain: 1,
    taskStatement: "1.1",
    services: ["detective", "guardduty", "security-hub"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "Amazon GuardDuty generates a critical finding: an EC2 instance (i-0a1b2c3d4) is communicating with a known cryptocurrency mining pool. The security operations team wants to understand the full scope of the compromise: what API calls the instance's IAM role made in the past 30 days, which other instances communicated with the same mining pool IP, and whether any IAM users logged in from the same geographic location. Which AWS service is MOST appropriate for this investigation?",
    options: [
      {
        id: "A",
        text: "Amazon GuardDuty — navigate to the finding details to see correlated evidence.",
        isCorrect: false,
        explanation: "GuardDuty generates findings based on anomaly detection but provides only the immediate context of each individual finding (the specific behavior that triggered the alert). It does not provide a graph-based investigation view connecting related entities (IAM roles, VPC flow data, historical API calls) across multiple findings over 30 days."
      },
      {
        id: "B",
        text: "AWS Security Hub — use the finding correlation and cross-account aggregation to pivot between related findings.",
        isCorrect: false,
        explanation: "Security Hub aggregates findings from multiple services and provides a unified view of security posture. However, it does not maintain a behavior graph database for deep investigation or provide the entity-relationship analysis (connecting EC2 instance → IAM role → API call history → geolocation patterns) that the question requires."
      },
      {
        id: "C",
        text: "Amazon Detective — use the behavior graph to investigate the EC2 instance, related IAM role activity, and network connections over the 30-day historical window.",
        isCorrect: true,
        explanation: "Amazon Detective is specifically designed for post-incident investigation. It ingests CloudTrail, VPC Flow Logs, GuardDuty findings, and EKS audit logs and builds a behavior graph with up to one year of historical data. The Detective console allows investigators to pivot from the GuardDuty finding to the specific EC2 instance, see all API calls by its IAM role, visualize network connections to the mining pool IP over time, and identify related IAM principals from the same geography — all from a single investigation workflow."
      },
      {
        id: "D",
        text: "AWS CloudTrail Lake — run SQL queries against CloudTrail events to trace the instance's API activity.",
        isCorrect: false,
        explanation: "CloudTrail Lake can query API activity history, but it requires writing SQL queries and correlating results manually across multiple dimensions (instance, IAM role, IP geolocation, network flows). Detective provides pre-built entity graphs that correlate all this data automatically, making it far more efficient for incident investigation."
      }
    ],
    explanation: "Amazon Detective is the post-incident investigation tool. The key distinction: GuardDuty = detection (generates findings); Detective = investigation (explains findings). Detective requires GuardDuty to be enabled for 48 hours before activation and ingests a copy of GuardDuty findings, CloudTrail events, and VPC Flow Logs independently of customer-configured logging. Its behavior graph connects entities (EC2 instances, IAM roles, IP addresses, users) with historical context — exactly what is needed to understand scope, blast radius, and lateral movement after an alert.",
    keywords: ["Detective investigation", "behavior graph", "post-incident", "blast radius", "NOT prevention"]
  },

  {
    id: "d1-046",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam-access-analyzer", "iam", "organizations"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A security team at a company with 15 AWS accounts wants to identify any S3 buckets, IAM roles, KMS keys, SQS queues, or Lambda functions that are accessible from outside their AWS Organizations boundary — including from other AWS accounts, federated users, or public access. They want findings reported centrally. Which service and configuration achieves this with MINIMUM custom development?",
    options: [
      {
        id: "A",
        text: "Enable Amazon Macie in all 15 accounts and configure cross-account finding aggregation.",
        isCorrect: false,
        explanation: "Amazon Macie discovers sensitive data (PII, PHI) in S3 buckets and can detect public S3 buckets with sensitive data. However, Macie does not analyze IAM roles, KMS keys, SQS queues, Lambda functions, or other resource policies for external access patterns. Macie is a data classification service, not an access path analyzer."
      },
      {
        id: "B",
        text: "Enable AWS IAM Access Analyzer with an Organization-level analyzer in the management or delegated administrator account. This automatically generates findings for all resources in member accounts that are accessible from outside the Organizations boundary.",
        isCorrect: true,
        explanation: "IAM Access Analyzer uses automated reasoning (not sampling) to analyze resource-based policies — S3 buckets, IAM roles, KMS keys, SQS queues, Lambda functions and layers, Secrets Manager secrets, EFS file systems, SNS topics, and ECR repositories. An Organization-level analyzer uses the entire Organization as the zone of trust, generating findings only for resources accessible from outside the Org boundary. Findings appear centrally in the administrator account with zero custom development."
      },
      {
        id: "C",
        text: "Deploy an AWS Config managed rule (s3-bucket-public-read-prohibited) across all 15 accounts using CloudFormation StackSets.",
        isCorrect: false,
        explanation: "Config managed rules check specific configuration settings (like S3 Block Public Access enabled) but do not perform comprehensive resource policy analysis across all resource types or identify cross-account access paths through IAM role trust policies, KMS grants, or Lambda resource-based policies. This covers only a subset of the required resource types."
      },
      {
        id: "D",
        text: "Create a Lambda function that periodically calls GetBucketPolicy, GetKeyPolicy, GetQueueAttributes, and GetFunctionPolicy across all accounts and evaluates policy statements for cross-account principals.",
        isCorrect: false,
        explanation: "Manually parsing policy documents for cross-account access is error-prone (policies have complex evaluation logic involving conditions, wildcards, and negations that automated reasoning handles correctly), requires cross-account roles in 15 accounts, misses new resources as they are created, and requires ongoing maintenance. IAM Access Analyzer's automated reasoning engine handles these complexities reliably at no custom development cost."
      }
    ],
    explanation: "IAM Access Analyzer uses automated reasoning (provable security) to definitively determine which resources in your account or Organization are accessible from outside the defined zone of trust. Resource types analyzed include S3 buckets, IAM roles, KMS keys, Lambda functions/layers, SQS queues, Secrets Manager secrets, SNS topics, EFS file systems, and ECR repositories. An Organization-level analyzer reports findings only for access from outside the Organization, eliminating intra-org false positives. Findings update automatically when policies change.",
    keywords: ["external access findings", "Organization analyzer", "automated reasoning", "MINIMUM custom development", "IAM Access Analyzer"]
  },

  {
    id: "d1-047",
    domain: 1,
    taskStatement: "1.1",
    services: ["directory-service", "iam", "workspaces"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company has an existing on-premises Microsoft Active Directory (AD) domain with 8,000 users. The company is deploying Amazon WorkSpaces for remote work and wants users to log in to WorkSpaces using their existing on-premises AD credentials WITHOUT storing any directory data in AWS. The on-premises AD and AWS are connected via AWS Direct Connect. Which AWS Directory Service option satisfies these requirements?",
    options: [
      {
        id: "A",
        text: "AWS Managed Microsoft AD — deploy a fully managed Microsoft AD in AWS and establish a forest trust with on-premises AD.",
        isCorrect: false,
        explanation: "AWS Managed Microsoft AD does store directory data in AWS (it runs real Active Directory domain controllers in AWS across two Availability Zones). While it supports forest trusts with on-prem AD, the question specifically requires that NO directory data be stored in AWS. Managed Microsoft AD would replicate or create user/computer objects in AWS, violating this requirement."
      },
      {
        id: "B",
        text: "AD Connector — a proxy that forwards authentication requests to the existing on-premises AD without storing any directory data in AWS.",
        isCorrect: true,
        explanation: "AD Connector is specifically designed as a directory gateway (proxy) that forwards authentication and authorization requests to an existing on-premises AD over an established network connection (Direct Connect or VPN). No directory data is stored in AWS — AD Connector is stateless from a directory perspective. It integrates natively with WorkSpaces, allowing users to authenticate with on-premises credentials. This satisfies both the 'existing on-prem AD' and 'no data stored in AWS' requirements."
      },
      {
        id: "C",
        text: "Simple AD — a standalone Samba 4 directory that provides basic AD compatibility for WorkSpaces at the lowest cost.",
        isCorrect: false,
        explanation: "Simple AD is a standalone Samba 4 directory running entirely in AWS — all directory data is stored in AWS. It does not proxy or connect to on-premises AD, has no trust relationship capability, and cannot use existing on-premises user credentials. It is designed for small, greenfield deployments (≤5,000 users) with no existing AD."
      },
      {
        id: "D",
        text: "Deploy ADFS (Active Directory Federation Services) on-premises and configure SAML federation with an IAM Identity Provider in each AWS account.",
        isCorrect: false,
        explanation: "ADFS with SAML federation enables AWS Console SSO but does not directly integrate with Amazon WorkSpaces. WorkSpaces uses Directory Service (AD Connector, Managed Microsoft AD, or Simple AD) for authentication — not SAML IAM federation. SAML federation also does not fulfill the WorkSpaces directory requirement."
      }
    ],
    explanation: "The AWS Directory Service decision table: AD Connector = pure proxy to existing on-prem AD, no data stored in AWS, requires Direct Connect or VPN, supports WorkSpaces/Console SSO but NOT RDS SQL Server Windows Auth or FSx. AWS Managed Microsoft AD = real AD in AWS (2 AZs), supports trusts, RDS SQL Server, FSx, but stores data in AWS. Simple AD = standalone Samba 4, no trusts, cheapest, ≤5,000 users, greenfield only. For 'existing on-prem AD, no AWS storage,' AD Connector is always the answer.",
    keywords: ["AD Connector", "proxy", "no data stored", "on-premises AD", "WorkSpaces"]
  },

  {
    id: "d1-048",
    domain: 1,
    taskStatement: "1.3",
    services: ["s3", "kms", "iam"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company stores customer data in an Amazon S3 bucket. The bucket owner wants to ensure that no S3 object in the bucket can ever be made publicly accessible, regardless of individual object ACLs or bucket policies that individual teams might configure. The solution must also prevent any bucket policy from granting public access to the bucket. Which S3 setting should the bucket owner enable?",
    options: [
      {
        id: "A",
        text: "Enable S3 Versioning and Object Lock to prevent modification of objects and their ACLs.",
        isCorrect: false,
        explanation: "S3 Versioning and Object Lock prevent deletion and overwriting of object versions (WORM compliance). They do not control public access settings or prevent bucket/object ACLs from granting public access. An object could still be made publicly readable even with Object Lock enabled."
      },
      {
        id: "B",
        text: "Enable S3 Block Public Access — specifically the BlockPublicAcls and BlockPublicPolicy settings — at the bucket level.",
        isCorrect: true,
        explanation: "S3 Block Public Access has four settings at both the bucket and account level: BlockPublicAcls (blocks new public ACLs and ignores existing ones), IgnorePublicAcls (treats all public ACLs as if they grant no access), BlockPublicPolicy (blocks bucket policy requests that would grant public access), and RestrictPublicBuckets (restricts access to bucket to only AWS services and authorized users when a public policy exists). Enabling BlockPublicAcls + IgnorePublicAcls handles ACL-based public access; BlockPublicPolicy + RestrictPublicBuckets handles policy-based public access. All four together provide complete protection."
      },
      {
        id: "C",
        text: "Attach a bucket policy with an explicit Deny on s3:GetObject for Principal: '*'.",
        isCorrect: false,
        explanation: "An explicit Deny on Principal: '*' would block ALL access including legitimate applications and IAM roles — not just public access. More critically, individual object ACLs could still grant public-read access if the account-level Block Public Access is not enabled. A bucket policy Deny alone is not the same as Block Public Access."
      },
      {
        id: "D",
        text: "Enable default SSE-KMS encryption on the bucket so that objects are encrypted and cannot be read publicly.",
        isCorrect: false,
        explanation: "Server-side encryption protects data at rest from physical access but does not prevent public access via S3 APIs. If a public ACL or policy grants GetObject access, the requester receives the decrypted object — S3 handles the KMS decryption transparently. Encryption does not substitute for access control."
      }
    ],
    explanation: "S3 Block Public Access is the definitive mechanism to prevent public exposure of S3 objects. The four settings operate independently: BlockPublicAcls (prevents adding public ACLs) + IgnorePublicAcls (ignores existing public ACLs) address ACL-based access; BlockPublicPolicy (rejects bucket policy changes that grant public access) + RestrictPublicBuckets (restricts access even if public policy exists) address policy-based access. Best practice is to enable all four at the account level to protect all current and future buckets simultaneously. Bucket-level settings override account-level for individual buckets only if the bucket setting is MORE permissive — the more restrictive setting wins.",
    keywords: ["Block Public Access", "BlockPublicAcls", "BlockPublicPolicy", "prevent public access", "bucket ACL"]
  },

  {
    id: "d1-049",
    domain: 1,
    taskStatement: "1.3",
    services: ["cloudtrail", "s3", "lambda"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company has AWS CloudTrail enabled with a multi-region trail. The security team receives an unexpected bill: CloudTrail costs jumped from $12/month to $1,800/month. After investigation, they discover a Lambda function is invoked 10 million times per day and the team recently enabled CloudTrail to log individual Lambda invocations. Which CloudTrail event category is causing the cost increase, and what is the MOST cost-effective way to maintain function-level invocation logging for compliance while reducing cost?",
    options: [
      {
        id: "A",
        text: "Management events caused the increase. Switch from a multi-region trail to a single-region trail to halve the cost.",
        isCorrect: false,
        explanation: "Management events (control plane actions like CreateFunction, UpdateFunctionCode) are charged at $2.00 per 100,000 events and the first copy is free. A Lambda function invoked 10 million times per day triggers Invoke API data events — not management events. Switching to a single-region trail would not address the data event cost."
      },
      {
        id: "B",
        text: "Data events caused the increase. Enable CloudTrail data events only for the specific Lambda function ARN rather than all Lambda functions, using advanced event selectors to filter by function ARN.",
        isCorrect: true,
        explanation: "CloudTrail data events (Lambda Invoke, S3 object-level, DynamoDB item-level) are charged at $0.10 per 100,000 events. At 10 million invocations/day × 30 days = 300 million events/month = $300 for one function, but if all Lambda functions were enabled for data events, the cost multiplies. Advanced event selectors allow filtering data events by resource ARN — enabling data event logging for only the specific compliance-relevant function ARN eliminates logging for other functions, reducing cost proportionally while maintaining compliance coverage."
      },
      {
        id: "C",
        text: "Insights events caused the increase. Disable CloudTrail Insights to reduce costs.",
        isCorrect: false,
        explanation: "CloudTrail Insights events detect anomalous API activity rates and cost $0.35 per 100,000 write management events analyzed. At typical account scale, Insights costs are modest. More importantly, Lambda Invoke logging is a data event — Insights do not log individual Lambda invocations."
      },
      {
        id: "D",
        text: "Data events caused the increase. Disable all CloudTrail data events and use AWS Lambda destination logging to CloudWatch Logs instead.",
        isCorrect: false,
        explanation: "Lambda Destinations and CloudWatch Logs can capture function execution results but do not provide the same immutable, tamper-evident audit trail with requestor identity (IAM principal, source IP) that CloudTrail data events provide. For compliance requirements that mandate CloudTrail-based audit trails, disabling data events entirely violates the compliance objective. Scoping to specific ARNs achieves cost reduction without eliminating compliance coverage."
      }
    ],
    explanation: "CloudTrail event type cost model: Management events = $2.00/100K events (first trail copy free); Data events = $0.10/100K events (always billed); Insights events = $0.35/100K write management events analyzed. Lambda Invoke API calls are data events. 10M invocations/day × 30 days = 300M events = $300/function/month. Advanced event selectors introduced in 2021 allow scoping data events to specific resource ARNs, event names, or even partial ARN prefix matching — eliminating broad 'all Lambda functions' data event logging while targeting only compliance-critical functions.",
    keywords: ["data events", "management events", "Insights events", "advanced event selectors", "cost tradeoff"]
  },

  {
    id: "d1-050",
    domain: 1,
    taskStatement: "1.1",
    services: ["config", "security-hub", "organizations"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A security team needs to enforce that ALL Amazon RDS instances across 25 AWS accounts have Multi-AZ enabled, encryption at rest enabled, and automated backups enabled. Non-compliant instances must be flagged immediately and the account owner notified via Amazon SNS. The solution must work for instances created in the future with MINIMUM custom Lambda code. Which AWS Config capability enables this?",
    options: [
      {
        id: "A",
        text: "Create a custom AWS Lambda-backed Config rule in each account that queries the RDS DescribeDBInstances API and checks the three attributes.",
        isCorrect: false,
        explanation: "Custom Lambda-backed Config rules can check any attribute but require writing Lambda code, maintaining it in 25 accounts, and updating it if the rule logic changes. The question asks for MINIMUM custom code. AWS provides managed Config rules for all three RDS checks without Lambda."
      },
      {
        id: "B",
        text: "Deploy a conformance pack containing the managed Config rules rds-multi-az-support, rds-storage-encrypted, and rds-automatic-minor-version-upgrade-enabled across all 25 accounts using AWS Organizations integration. Add an SSM Automation remediation that triggers SNS notification on non-compliance.",
        isCorrect: true,
        explanation: "AWS Config conformance packs bundle multiple Config rules (and optional remediations) into a single deployable unit. The managed rules rds-multi-az-support, rds-storage-encrypted, and rds-instance-backup-enabled (for automated backups) cover all three requirements. Deploying via Organizations integration pushes the conformance pack to all 25 accounts automatically and covers future accounts. SSM Automation documents can trigger SNS notifications on non-compliance — no custom Lambda code required."
      },
      {
        id: "C",
        text: "Use AWS Security Hub's AWS Foundational Security Best Practices standard, which includes RDS checks for Multi-AZ, encryption, and backups.",
        isCorrect: false,
        explanation: "Security Hub's FSBP does include RDS checks (RDS.5 for Multi-AZ, RDS.3 for encryption, etc.) and provides findings and compliance scores. However, Security Hub findings are detective and do not natively trigger SNS notifications per non-compliant resource without custom EventBridge rules. Config conformance packs with SSM remediation actions directly integrate SNS notification without additional plumbing."
      },
      {
        id: "D",
        text: "Apply an SCP that denies CreateDBInstance unless the API call includes Multi-AZ, encryption, and backup parameters.",
        isCorrect: false,
        explanation: "SCPs can prevent non-compliant resource creation but cannot detect existing non-compliant instances or enforce retroactively. An SCP-only approach would require RDS CreateDBInstance to have mandatory condition keys for all three attributes, which AWS does not natively support as SCP conditions. SCPs also don't provide notification workflows — they silently deny the API call."
      }
    ],
    explanation: "AWS Config conformance packs are the purpose-built mechanism for deploying multiple rules as a unit across an Organization. Managed Config rules (no Lambda required) cover common RDS requirements: rds-multi-az-support (checks MultiAZ=true), rds-storage-encrypted (checks StorageEncrypted=true), rds-instance-backup-enabled (checks BackupRetentionPeriod > 0). Organizations integration deploys to all current and future member accounts automatically. SSM Automation remediation actions can call SNS APIs or other AWS services — no custom Lambda needed for the notification requirement.",
    keywords: ["conformance packs", "managed Config rules", "MINIMUM custom code", "25 accounts", "SNS notification"]
  },

  {
    id: "d1-051",
    domain: 1,
    taskStatement: "1.3",
    services: ["kms", "iam"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company uses a single AWS KMS customer-managed key (CMK) to encrypt data across multiple services. The security policy states: the platform team should be able to manage the key (create grants, schedule deletion, update key policy) but should NOT be able to use the key for encrypt/decrypt operations. The application team should be able to use the key for encrypt/decrypt but should NOT be able to manage key configuration. Which KMS feature implements this separation of duties?",
    options: [
      {
        id: "A",
        text: "Create two separate KMS CMKs — one for management operations used by the platform team and one for encryption used by the application team.",
        isCorrect: false,
        explanation: "Creating two separate CMKs does not implement separation of duties on the SAME key — data encrypted with the management CMK cannot be decrypted with the application CMK. The question requires that both teams interact with the same CMK but with different permission scopes."
      },
      {
        id: "B",
        text: "In the KMS key policy, create two separate policy statements: one granting kms:CreateGrant, kms:ScheduleKeyDeletion, kms:PutKeyPolicy to the platform team's IAM role, and a separate statement granting kms:Encrypt, kms:Decrypt, kms:GenerateDataKey to the application team's IAM role.",
        isCorrect: true,
        explanation: "KMS key policies allow granular action-level separation. The key policy can include separate statements with distinct Principal and Action elements — granting administrative actions (kms:CreateGrant, kms:ScheduleKeyDeletion, kms:PutKeyPolicy, kms:EnableKey, kms:DisableKey, kms:DescribeKey) to the platform team WITHOUT including usage actions (kms:Encrypt, kms:Decrypt, kms:GenerateDataKey, kms:GenerateDataKeyWithoutPlaintext). The application team statement includes usage actions but NOT management actions. KMS key policies support this precise separation natively."
      },
      {
        id: "C",
        text: "Enable KMS key grants for the application team's role to delegate usage operations, and use the key policy to restrict management to the platform team.",
        isCorrect: false,
        explanation: "Key grants are a valid mechanism for delegating specific usage permissions to services/roles, but they are typically used by services (like Secrets Manager, SSM) acting on behalf of principals — not the primary mechanism for long-term team-level separation of duties on a shared CMK. Key policy statements are the cleaner, more auditable approach for persistent team role separation."
      },
      {
        id: "D",
        text: "Use IAM permission boundaries on the application team's IAM roles to deny all kms: management actions.",
        isCorrect: false,
        explanation: "Permission boundaries cap what an IAM policy can grant a principal. However, they require attaching a boundary to every application team role — operationally intensive. More importantly, even with a boundary, if the key policy grants management actions to the application team's role, the effective permission would still allow them (key policy + boundary intersection still includes management actions if the key policy grants them). The key policy is the root of trust for KMS — controlling actions at the key policy level is more authoritative."
      }
    ],
    explanation: "KMS key policy separation of duties is implemented by creating distinct statements for administrative vs. usage permissions. AWS documentation explicitly recommends this pattern: an 'administrators' statement grants kms:Create*, kms:Describe*, kms:Enable*, kms:List*, kms:Put*, kms:Update*, kms:Revoke*, kms:Disable*, kms:Delete*, kms:TagResource, kms:UntagResource, kms:ScheduleKeyDeletion, kms:CancelKeyDeletion to the admin role WITHOUT kms:Encrypt/Decrypt. A 'users' statement grants kms:Encrypt, kms:Decrypt, kms:ReEncrypt*, kms:GenerateDataKey*, kms:DescribeKey to the user role. The key policy is the root of trust — IAM policies alone cannot grant access unless the key policy delegates to IAM.",
    keywords: ["key policy separation of duties", "administer vs use", "kms:Encrypt", "kms:PutKeyPolicy", "ViaService"]
  },

  {
    id: "d1-052",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "s3", "iam"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company wants to ensure that Amazon S3 objects in their data lake can ONLY be accessed from within their corporate Amazon Virtual Private Cloud (Amazon VPC) — never over the public internet — and that only requests from specific S3 buckets in their account are allowed through the VPC endpoint. Other S3 buckets (including any attacker-controlled S3 buckets) must be unreachable via the endpoint. Which combination of configurations achieves this?",
    options: [
      {
        id: "A",
        text: "Create an S3 Gateway VPC Endpoint and attach a bucket policy to each S3 bucket that denies requests unless the aws:SourceVpce condition matches the endpoint ID.",
        isCorrect: false,
        explanation: "This is half correct — the bucket policy with aws:SourceVpce restricts which requests can reach the bucket (from a specific endpoint). But it does not restrict the endpoint to only the company's buckets. An EC2 instance in the VPC could still use the same endpoint to access any public S3 bucket (e.g., downloading malware from attacker-controlled S3), because no endpoint policy is in place."
      },
      {
        id: "B",
        text: "Create an S3 Gateway VPC Endpoint with an endpoint policy that allows access only to specific S3 bucket ARNs in the account. Additionally, add bucket policies on each target bucket with a Deny unless aws:SourceVpce matches the endpoint ID.",
        isCorrect: true,
        explanation: "A two-layer approach is needed: (1) The VPC endpoint policy restricts what S3 resources can be accessed THROUGH the endpoint — allow only the company's bucket ARNs, preventing any traffic to external/attacker-controlled S3 buckets. (2) The S3 bucket policy with aws:SourceVpce (or aws:SourceVpc) ensures the bucket only accepts requests from within the VPC via the specific endpoint, blocking public internet access. Together these create a bidirectional restriction: only company buckets via only the company VPC."
      },
      {
        id: "C",
        text: "Configure S3 Block Public Access at the account level and restrict the VPC's route table to remove the internet gateway route.",
        isCorrect: false,
        explanation: "S3 Block Public Access prevents S3 bucket and object ACLs/policies from granting public anonymous access — it does not restrict IAM-authenticated requests coming from the internet. Removing the IGW route prevents outbound internet, but instances could still make S3 API calls over the NAT Gateway or other internet paths if present. This does not achieve the 'VPC-only' S3 access restriction."
      },
      {
        id: "D",
        text: "Use AWS PrivateLink for S3 (Interface endpoint) and attach a security group that allows only the VPC CIDR range.",
        isCorrect: false,
        explanation: "An S3 Interface endpoint (PrivateLink) with a security group is a valid approach for private S3 access, but the security group would restrict which instances can use the endpoint — not which S3 buckets are accessible through it. An endpoint policy is still needed on the Interface endpoint to restrict target bucket ARNs. This option also misses the bucket policy layer for bidirectional restriction."
      }
    ],
    explanation: "VPC endpoint policies restrict what resources CAN be accessed through the endpoint (the outbound scope from the VPC). S3 bucket policies with aws:SourceVpce restrict which requests can access the bucket (the inbound scope to the bucket). The combination creates a data perimeter: endpoint policy limits the endpoint to company-owned bucket ARNs (preventing data exfiltration to attacker-controlled S3), and bucket policy limits bucket access to requests from the specific VPC endpoint (preventing internet access). This two-layer pattern is the AWS recommended data perimeter architecture.",
    keywords: ["VPC endpoint policy", "bucket policy", "aws:SourceVpce", "data perimeter", "restrict S3 buckets"]
  },

  {
    id: "d1-053",
    domain: 1,
    taskStatement: "1.1",
    services: ["cognito", "iam", "sts"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A mobile application lets users sign up with their email address or sign in with their Google account. After authentication, users need to upload photos directly to an Amazon S3 bucket using temporary AWS credentials scoped to their personal S3 prefix (s3://photos-bucket/{userId}/). The application must NOT use a backend server to proxy S3 uploads. Which Amazon Cognito component issues the temporary AWS credentials that enable direct S3 upload?",
    options: [
      {
        id: "A",
        text: "Amazon Cognito User Pool — it authenticates users and issues temporary AWS credentials via the STS service.",
        isCorrect: false,
        explanation: "Cognito User Pools handle authentication (sign-up, sign-in, MFA, social federation) and issue JWTs (ID token, access token, refresh token). They do NOT issue temporary AWS credentials (IAM access key ID, secret, session token). That function belongs to the Identity Pool."
      },
      {
        id: "B",
        text: "Amazon Cognito Identity Pool (Federated Identities) — it exchanges the User Pool ID token for temporary AWS credentials via STS AssumeRoleWithWebIdentity, mapped to an IAM role with an S3 policy scoped to the user's prefix.",
        isCorrect: true,
        explanation: "Cognito Identity Pools are the authorization component of Cognito. After the User Pool authenticates the user and issues an ID token, the Identity Pool calls STS AssumeRoleWithWebIdentity with the token to obtain temporary AWS credentials. An IAM role policy using the ${cognito-identity.amazonaws.com:sub} policy variable scopes S3 permissions to the individual user's prefix. The mobile app uses these temporary credentials to directly call s3:PutObject — no backend proxy required."
      },
      {
        id: "C",
        text: "Amazon Cognito User Pool with API Gateway as a proxy — API Gateway validates the User Pool JWT and signs S3 pre-signed URL requests on behalf of the user.",
        isCorrect: false,
        explanation: "API Gateway with pre-signed URL generation is a valid alternative architecture but contradicts the requirement of NO backend server proxy. Additionally, pre-signed URLs are generated by a backend service (Lambda in API Gateway), which is a proxy pattern. The question specifically requires direct client-to-S3 upload using temporary credentials."
      },
      {
        id: "D",
        text: "Amazon Cognito Sync — it synchronizes user data and credentials between devices and provides S3 access tokens.",
        isCorrect: false,
        explanation: "Amazon Cognito Sync was a service for synchronizing app user data (preferences, state) across devices. It is deprecated (replaced by AWS AppSync) and never provided S3 upload credentials. This is a distractor testing whether candidates remember that Cognito Sync is deprecated and unrelated to IAM credential issuance."
      }
    ],
    explanation: "Cognito architecture: User Pool = authentication (who are you?), issues JWTs. Identity Pool = authorization for AWS (what AWS resources can you access?), issues temporary STS credentials. The standard mobile pattern: User Pool authenticates → ID token → Identity Pool exchanges token for STS credentials → app uses credentials to call AWS services directly. Policy variables like ${cognito-identity.amazonaws.com:sub} enable per-user resource scoping without per-user IAM roles.",
    keywords: ["Identity Pool", "User Pool distinction", "temporary credentials", "direct S3 upload", "no backend proxy"]
  },

  {
    id: "d1-054",
    domain: 1,
    taskStatement: "1.1",
    services: ["acm-private-ca", "acm", "ec2"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company runs a microservices platform on Amazon EKS. The security team requires mutual TLS (mTLS) authentication between all services, using certificates issued by an internal private Certificate Authority (CA) that the company controls. Certificates must auto-renew before expiration and must NOT be trusted by public browsers. Which AWS service provides the managed private CA infrastructure for this requirement?",
    options: [
      {
        id: "A",
        text: "AWS Certificate Manager (ACM) public certificates — issue certificates for each microservice and configure mTLS.",
        isCorrect: false,
        explanation: "ACM public certificates are signed by Amazon's public root CA and trusted by all browsers. They are designed for public HTTPS endpoints, not internal mTLS between microservices. Public certs cannot be used as client certificates for mTLS authentication without significant workarounds. ACM also cannot export the private key of a public certificate, which is required for client certificate usage."
      },
      {
        id: "B",
        text: "AWS Private Certificate Authority (AWS Private CA) — create a private CA hierarchy and issue private certificates for each EKS service. Integrate with ACM for automatic renewal.",
        isCorrect: true,
        explanation: "AWS Private CA (formerly ACM Private CA) provides a managed private PKI. Certificates issued by AWS Private CA are NOT trusted by public browsers — they are only trusted by systems that explicitly trust the private CA root. Integration with ACM enables automatic certificate renewal before expiration. AWS Private CA supports creating CA hierarchies (root CA + subordinate CAs) and issues certificates for internal workloads including EKS mTLS, IoT devices, and code signing. The cert-manager Kubernetes plugin integrates directly with AWS Private CA."
      },
      {
        id: "C",
        text: "Deploy an EC2 instance running OpenSSL as a self-managed CA and issue certificates manually for each microservice.",
        isCorrect: false,
        explanation: "A self-managed OpenSSL CA on EC2 is technically feasible but is not managed infrastructure — the company is responsible for HA, backup, HSM storage of the CA private key, CRL/OCSP publishing, and certificate lifecycle. The question asks for a managed solution that includes auto-renewal without managing CA infrastructure."
      },
      {
        id: "D",
        text: "Use AWS CloudHSM to store the CA private key and integrate it with the ACM public certificate issuance pipeline.",
        isCorrect: false,
        explanation: "CloudHSM stores cryptographic key material securely but is not itself a CA. CloudHSM can be used as a custom key store for KMS or to protect a CA private key in a self-managed PKI, but it does not provide certificate issuance, CRL management, OCSP, or automatic renewal. The correct service for managed private PKI with auto-renewal is AWS Private CA."
      }
    ],
    explanation: "AWS Private CA (AWS Certificate Authority) provides fully managed private PKI at ~$400/month per CA (pricing reduced from $400 in 2023 to $50/month for short-lived cert mode). Key characteristics: certificates are NOT trusted by public browsers; integrates with ACM for auto-renewal; supports RSA 2048/4096 and ECDSA P-256/P-384; works with Kubernetes cert-manager, EKS, IoT Core, and direct ACM integration. For 'internal certificates not trusted publicly + auto-renewal + managed infrastructure,' AWS Private CA is always the answer.",
    keywords: ["ACM Private CA", "mTLS", "internal certificates", "not public browser trusted", "auto-renew"]
  },

  // ─── Difficulty 4 (11 questions) ────────────────────────────
  {
    id: "d1-055",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "flow-logs", "s3"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A security analyst is reviewing VPC Flow Logs for a production VPC after a suspected data exfiltration incident. The analyst makes the following claims about what VPC Flow Logs DO and DO NOT capture. Which claim is CORRECT?",
    options: [
      {
        id: "A",
        text: "VPC Flow Logs capture DNS queries made by EC2 instances to the Amazon Route 53 Resolver (VPC+2 address at 169.254.169.253), so the analyst can identify which domains the compromised instance resolved.",
        isCorrect: false,
        explanation: "This is a critical misconception. VPC Flow Logs explicitly do NOT log traffic to the VPC's DNS resolver (VPC+2 address, 169.254.169.253). DNS query logging requires a separate feature: Route 53 Resolver DNS query logs. An analyst trying to identify domains resolved by a compromised instance from Flow Logs alone will miss all DNS traffic."
      },
      {
        id: "B",
        text: "VPC Flow Logs capture metadata (5-tuple, bytes, packets, action) for traffic that was allowed or rejected by security groups and NACLs. They do NOT capture traffic to the VPC DNS resolver, DHCP traffic, traffic to instance metadata (169.254.169.254), Windows KMS activation traffic, or packet payload contents.",
        isCorrect: true,
        explanation: "This is the accurate description of VPC Flow Logs capabilities and exclusions. Flow Logs record the 5-tuple (source/destination IP, source/destination port, protocol), byte and packet counts, start/end time, and ACCEPT/REJECT action. Explicitly excluded from Flow Logs: traffic to/from 169.254.169.254 (instance metadata), traffic to/from 169.254.169.253 (Route 53 Resolver), DHCP traffic, Amazon DNS server traffic (when using AWS-provided DNS), and Windows license activation traffic to AWS KMS. Packet payloads require VPC Traffic Mirroring."
      },
      {
        id: "C",
        text: "VPC Flow Logs capture all traffic through a NAT Gateway, including the private EC2 instance source IP, so the analyst can trace which instance initiated each outbound connection.",
        isCorrect: false,
        explanation: "VPC Flow Logs do capture traffic through NAT Gateways, but there is a NAT translation nuance: the flow log record for traffic through a NAT Gateway shows the translated (NAT Gateway's IP) as the source address for outbound traffic — not the original private EC2 instance IP. To trace the original source instance, you must correlate the pre-NAT flow log entry (instance-to-NAT-GW) with the post-NAT entry (NAT-GW-to-internet), which requires careful analysis."
      },
      {
        id: "D",
        text: "VPC Flow Logs capture rejected traffic but NOT accepted traffic, so the analyst can identify attack attempts without noise from legitimate traffic.",
        isCorrect: false,
        explanation: "VPC Flow Logs capture BOTH accepted (ACCEPT) and rejected (REJECT) traffic by default in the action field. They can be filtered to log only ACCEPT, only REJECT, or ALL traffic at the flow log creation time, but the default captures all. There is no configuration that captures only rejections by default."
      }
    ],
    explanation: "VPC Flow Logs exclusions are a high-frequency exam trap. The exact list of what Flow Logs do NOT capture: traffic to 169.254.169.254 (instance metadata service / IMDS), traffic to 169.254.169.253 (Route 53 Resolver), DHCP traffic, Amazon DNS traffic (VPC resolver queries), Windows KMS activation traffic (169.254.169.250), traffic between Network Load Balancer private IP and instances. For DNS query visibility, enable Route 53 Resolver DNS Query Logs separately. For packet payloads, use VPC Traffic Mirroring.",
    keywords: ["Flow Logs exclusions", "DNS resolver not captured", "169.254.169.253", "DHCP not captured", "metadata not captured"]
  },

  {
    id: "d1-056",
    domain: 1,
    taskStatement: "1.1",
    services: ["organizations", "scp", "iam"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company with AWS Organizations has the following SCP attached to the root OU: Deny all actions except a specified allowlist. A developer in a member account reports that they cannot perform ec2:DescribeInstances even though their IAM role has AdministratorAccess attached. The security team also wants to confirm: does this SCP restriction apply to the company's management account? Which evaluation is CORRECT regarding both the developer's issue and SCP scope?",
    options: [
      {
        id: "A",
        text: "The developer's IAM AdministratorAccess policy overrides the SCP Deny because AdministratorAccess is a higher-privilege policy. SCPs apply to all accounts including the management account.",
        isCorrect: false,
        explanation: "Both claims are wrong. IAM policies cannot override SCP explicit Denies — SCPs always win because they operate at the authorization layer before IAM policy evaluation. And SCPs do NOT apply to the management account — the management account is exempt from SCP restrictions regardless of what SCPs are attached to the root or any OU."
      },
      {
        id: "B",
        text: "The developer's ec2:DescribeInstances is being blocked by the SCP Deny because the allowlist SCP does not include ec2:DescribeInstances. The management account is exempt from all SCP restrictions — SCPs never apply to the management account.",
        isCorrect: true,
        explanation: "A Deny-all-except-allowlist SCP blocks any action not in the allowlist, regardless of what IAM policies the principal has — AdministratorAccess is irrelevant when an SCP explicitly denies the action. SCPs establish the maximum permissions boundary; explicit denies in SCPs cannot be overridden by IAM. Critically, AWS Organizations documentation explicitly states that SCPs DO NOT affect the management account — any principal in the management account retains full permissions regardless of attached SCPs. This is a fundamental SCP limitation companies must understand when designing their root OU policies."
      },
      {
        id: "C",
        text: "The developer's issue is caused by a permission boundary, not the SCP. SCPs apply to all accounts in the organization including the management account.",
        isCorrect: false,
        explanation: "The developer has AdministratorAccess (not a bounded role), and the question specifies a root OU SCP with a Deny. There is no permission boundary mentioned. And as noted, SCPs do not apply to the management account."
      },
      {
        id: "D",
        text: "SCPs apply to all member accounts except those directly under the root OU. The management account is protected by SCPs attached to the management OU.",
        isCorrect: false,
        explanation: "There is no 'management OU' in AWS Organizations — the management account exists outside the OU hierarchy and cannot be placed in any OU. SCPs attached anywhere in the organization (root, any OU) never apply to the management account. This is unconditional — it is a hard AWS platform behavior, not a configuration choice."
      }
    ],
    explanation: "Two critical SCP edge cases tested together: (1) SCP Deny overrides IAM Allow — even AdministratorAccess (* on *) cannot override an SCP Deny; effective permissions = intersection of SCP allowances ∩ IAM grants, but any explicit deny anywhere wins. (2) SCPs never apply to the management account — this is a hard platform rule. The management account should contain minimal resources for this reason. Also tested: SCPs do not apply to service-linked roles (SLRs) in any account.",
    keywords: ["SCP management account exempt", "SCP Deny overrides IAM", "AdministratorAccess irrelevant", "SCP edge cases"]
  },

  {
    id: "d1-057",
    domain: 1,
    taskStatement: "1.1",
    services: ["identity-center", "iam", "organizations"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company configures AWS IAM Identity Center with Okta as the external SAML 2.0 / SCIM identity source. An engineer notices that IAM Identity Center shows 'Single region service — configured in us-east-1.' The company's workloads span eu-west-1 and ap-southeast-1. The CISO asks: what happens if the IAM Identity Center region (us-east-1) becomes unavailable? Which statement about IAM Identity Center regional availability is CORRECT, and what contingency should be in place?",
    options: [
      {
        id: "A",
        text: "IAM Identity Center is multi-region and automatically fails over to backup regions — no contingency is needed.",
        isCorrect: false,
        explanation: "AWS IAM Identity Center is explicitly a single-region service. It is configured in one home region and does not automatically replicate or fail over to another region. If the home region is unavailable, IAM Identity Center is unavailable."
      },
      {
        id: "B",
        text: "IAM Identity Center is a single-region service. If the home region is unavailable, users cannot sign in via IAM Identity Center. As a contingency, the company should maintain emergency (break-glass) IAM user credentials or a separate SAML federation directly to IAM in a second region for critical workloads.",
        isCorrect: true,
        explanation: "IAM Identity Center is a single-region service with no automatic failover. This is a documented limitation — AWS recommends organizations with strict availability requirements maintain break-glass access mechanisms: IAM users with MFA in each account, or a second SAML federation configured directly in IAM (AssumeRoleWithSAML with the Okta IdP) as a regional backup. The break-glass accounts should be stored in a physical safe and used only during IAM Identity Center outages. Note: IAM itself is global, so IAM user break-glass credentials work from any region."
      },
      {
        id: "C",
        text: "IAM Identity Center configured in us-east-1 automatically extends to all regions where AWS Organizations is active. Workloads in eu-west-1 and ap-southeast-1 use a local IAM Identity Center node.",
        isCorrect: false,
        explanation: "IAM Identity Center does not deploy regional nodes. The single instance in us-east-1 serves all accounts and all regions — users authenticating in Frankfurt or Singapore still authenticate against the us-east-1 IAM Identity Center endpoint. There are no local nodes in eu-west-1 or ap-southeast-1."
      },
      {
        id: "D",
        text: "If us-east-1 is unavailable, workloads already running continue to operate because active IAM role sessions persist. Only new sign-ins are affected.",
        isCorrect: false,
        explanation: "This is partially true — active STS sessions do persist until expiration (up to 12 hours) since they are issued as temporary credentials stored at the client. However, once those sessions expire, users cannot obtain new sessions until IAM Identity Center is available. For any access beyond the session lifetime, this is still a critical outage. Additionally, automated systems that refresh sessions (e.g., AWS CLI, SDK credential refresh) would fail immediately."
      }
    ],
    explanation: "IAM Identity Center's single-region limitation is an important architectural consideration. Best practice: (1) Document break-glass IAM users in each critical account with MFA hardware tokens stored securely. (2) Optionally configure a secondary SAML federation directly in IAM as a failover. (3) Ensure that active STS sessions for running workloads have sufficient duration to survive a short outage. (4) Monitor IAM Identity Center availability and the home region health via AWS Health Dashboard.",
    keywords: ["IAM Identity Center single region", "break-glass", "regional availability", "SAML failover", "SCIM"]
  },

  {
    id: "d1-058",
    domain: 1,
    taskStatement: "1.1",
    services: ["ram", "vpc", "organizations"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A networking team shares VPC subnets from a central networking account (Account N) to three application accounts (A, B, C) using AWS Resource Access Manager (RAM). Account A deploys an EC2 instance in the shared subnet. Which of the following statements about the shared VPC model is CORRECT regarding ownership, control, and cross-account visibility?",
    options: [
      {
        id: "A",
        text: "Account A owns the shared subnet and can modify its route table and NACL to meet application requirements.",
        isCorrect: false,
        explanation: "In the shared VPC model, Account N (the networking owner) retains full ownership and control of all VPC primitives — subnets, route tables, NACLs, internet gateways, NAT gateways, and VPC peering connections. Account A can only manage the resources it deploys INTO the shared subnet (EC2 instances, Lambda functions, RDS) — it cannot modify the subnet's route table or NACL."
      },
      {
        id: "B",
        text: "Account A owns and manages its EC2 instance in the shared subnet. Account N owns and manages the VPC, subnet, route tables, and NACLs. Account A CANNOT see EC2 instances deployed by Account B in the same shared subnet.",
        isCorrect: true,
        explanation: "This is the correct ownership model for shared VPCs. Each participant account manages only the resources it deploys — EC2 instances, security groups, Lambda functions. The owner account (N) manages all network primitives. Critically, accounts sharing the same subnet cannot see each other's resources — Account A's EC2 DescribeInstances call does not return Account B's instances, even though they are in the same subnet. Each account sees only its own resources. Security groups in Account A can reference security groups in Account B by ID, but not by discovery."
      },
      {
        id: "C",
        text: "Account A can view and terminate EC2 instances in the shared subnet belonging to Account B because they share the same VPC and subnet.",
        isCorrect: false,
        explanation: "Resource ownership in AWS is account-scoped, not VPC-scoped. Sharing a subnet does not grant any IAM permissions over another account's resources. Account A cannot see, modify, or terminate Account B's EC2 instances. IAM authorization is required for cross-account resource access, independent of network topology."
      },
      {
        id: "D",
        text: "RAM subnet sharing transfers ownership of the subnet to Account A for the duration of the share. Account A can attach new route tables to the shared subnet.",
        isCorrect: false,
        explanation: "RAM sharing NEVER transfers ownership. The originating account (N) retains ownership permanently. 'Sharing' in RAM grants usage rights — the ability to deploy resources into the shared subnet — not ownership or management rights over the network infrastructure. Account A cannot attach route tables, modify NACLs, or perform any VPC-level networking operations."
      }
    ],
    explanation: "The AWS RAM shared VPC model has a strict separation: the owner account manages the network infrastructure (VPC, subnets, route tables, NACLs, gateways) — consumer accounts manage only the resources they deploy (EC2, Lambda, RDS, ECS tasks) in shared subnets. Cross-account resource visibility does NOT extend to other consumers' resources in the same subnet — each account sees only its own resources via AWS APIs. RAM is regional — shares cannot cross AWS regions. Resources cannot be re-shared by consumers.",
    keywords: ["RAM shared VPC", "ownership not transferred", "consumer cannot see other accounts", "network primitives", "regional"]
  },

  {
    id: "d1-059",
    domain: 1,
    taskStatement: "1.3",
    services: ["security-hub", "guardduty", "inspector", "macie", "config"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A CISO wants a single dashboard showing: GuardDuty threat findings, Inspector CVE findings, Macie sensitive data findings, IAM Access Analyzer external access findings, and AWS Config compliance status — all normalized to a common format and aggregated across 20 AWS accounts. The solution must require MINIMUM integration code and work without a third-party SIEM. Which AWS service and configuration provides this?",
    options: [
      {
        id: "A",
        text: "Enable Amazon CloudWatch Dashboards and configure metric filters for each service's CloudWatch metric outputs.",
        isCorrect: false,
        explanation: "GuardDuty, Inspector, Macie, and IAM Access Analyzer do not publish findings as CloudWatch metrics by default — they publish to EventBridge and their own finding APIs. CloudWatch Dashboards show metrics and logs, not structured security findings. Building a unified findings dashboard via CloudWatch would require significant custom EventBridge rules, Lambda functions, and dashboard configuration."
      },
      {
        id: "B",
        text: "Enable AWS Security Hub with a delegated administrator account using Organizations integration. Enable all integrated services (GuardDuty, Inspector v2, Macie, IAM Access Analyzer, Config). Security Hub normalizes findings to ASFF and aggregates across all 20 accounts.",
        isCorrect: true,
        explanation: "AWS Security Hub is the native aggregation layer for AWS security findings. It integrates with 50+ AWS services and third-party tools. Findings from GuardDuty, Inspector v2, Macie, and IAM Access Analyzer are automatically ingested and normalized to the AWS Security Finding Format (ASFF). AWS Config compliance status surfaces as Security Hub controls findings. Organizations integration with a delegated administrator aggregates findings across all 20 member accounts with zero custom code. The Security Hub console provides the unified dashboard the CISO requires."
      },
      {
        id: "C",
        text: "Deploy Amazon OpenSearch Service with an ingestion pipeline that calls each service's API every 5 minutes and indexes findings.",
        isCorrect: false,
        explanation: "Building a custom OpenSearch ingestion pipeline for five separate security services requires writing and maintaining Lambda functions, managing IAM cross-account permissions, handling pagination and deduplication, and creating OpenSearch dashboards. This is significant custom integration code — the opposite of minimum integration. Security Hub provides this functionality natively."
      },
      {
        id: "D",
        text: "Create an AWS EventBridge event bus in a central account and configure each member account to forward GuardDuty, Inspector, Macie, and Access Analyzer events to it via cross-account event bus rules.",
        isCorrect: false,
        explanation: "Cross-account EventBridge aggregation is a valid architecture for event routing but does not normalize findings to a common format, provide a built-in dashboard, or aggregate Config compliance status. Downstream processing of EventBridge events would require additional Lambda functions and a visualization layer. Security Hub provides the normalization, aggregation, and dashboard functionality as a managed service."
      }
    ],
    explanation: "AWS Security Hub is the native multi-account, multi-service security findings aggregation service. Key facts: (1) Accepts findings in ASFF format from 50+ integrated services (GuardDuty, Inspector v2, Macie, IAM Access Analyzer, Firewall Manager, Systems Manager Patch Manager). (2) AWS Config is required for most Security Hub compliance controls — Config checks surface as Security Hub finding-type controls. (3) Organizations integration auto-enables new member accounts. (4) Requires Config enabled in all regions. (5) Security Hub findings can be exported to EventBridge for SIEM or ticketing integration.",
    keywords: ["Security Hub aggregation", "ASFF normalization", "delegated administrator", "MINIMUM integration code", "20 accounts"]
  },

  {
    id: "d1-060",
    domain: 1,
    taskStatement: "1.3",
    services: ["kms", "s3", "iam"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company has a KMS customer-managed key in Account A used to encrypt S3 objects. Account B needs to decrypt these objects. A security engineer has already added Account B's IAM role ARN to the KMS key policy in Account A with kms:Decrypt permission. Account B's engineer says decryption still fails with 'AccessDenied.' What is the MOST LIKELY missing configuration?",
    options: [
      {
        id: "A",
        text: "The S3 bucket policy in Account A needs to explicitly allow Account B's IAM role to perform s3:GetObject.",
        isCorrect: false,
        explanation: "S3 bucket access is a separate authorization layer. However, the question states decryption fails — not that S3 GetObject fails. If the error were from S3, it would say s3:GetObject is denied. The error is KMS AccessDenied, suggesting the KMS authorization is incomplete despite the key policy change."
      },
      {
        id: "B",
        text: "Account B's IAM policy for the IAM role does not include kms:Decrypt on the specific KMS key ARN in Account A. For cross-account KMS access, both the key policy in Account A AND an IAM policy in Account B must explicitly allow the action.",
        isCorrect: true,
        explanation: "Cross-account KMS access requires a two-sided authorization: (1) The key policy in Account A must allow Account B's principal to perform kms:Decrypt. (2) An IAM policy in Account B must also explicitly allow kms:Decrypt on the specific Account A key ARN. Unlike same-account access where the key policy root delegation to IAM is sufficient, cross-account access requires explicit IAM policy permission IN Account B. Without step 2, the request fails with AccessDenied even though Account A's key policy was updated."
      },
      {
        id: "C",
        text: "Multi-Region keys must be enabled on the KMS CMK before cross-account access is possible.",
        isCorrect: false,
        explanation: "Multi-Region keys are an optional feature for cross-region decryption using the same key material. Cross-account KMS access does NOT require Multi-Region keys — it works with any KMS key type (single-region or multi-region). The issue here is the missing IAM policy in Account B, not the key type."
      },
      {
        id: "D",
        text: "The KMS key in Account A must be replicated to Account B using the KMS key replication feature before Account B can decrypt.",
        isCorrect: false,
        explanation: "KMS key replication is only available for Multi-Region keys and creates a replica in a different REGION of the same account (or another account via sharing). There is no mechanism to 'replicate' a key to another account for standard single-region keys. Cross-account decryption works with the original key in Account A — Account B calls the Account A KMS endpoint with its temporary credentials."
      }
    ],
    explanation: "Cross-account KMS access is a two-party authorization requirement: (1) Key policy in the key's account must allow the external principal (by specifying the Account B IAM role ARN or account root). (2) IAM policy in the external account must allow the KMS action on the specific key ARN. This differs from same-account KMS access where the key policy root delegation to IAM means IAM policies alone control access. In cross-account scenarios, neither the key policy nor the IAM policy alone is sufficient — BOTH must explicitly allow the action.",
    keywords: ["cross-account KMS", "two-sided authorization", "key policy AND IAM policy", "kms:Decrypt", "AccessDenied"]
  },

  {
    id: "d1-061",
    domain: 1,
    taskStatement: "1.2",
    services: ["network-firewall", "waf", "firewall-manager"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company's security team wants to enforce centralized egress filtering for all 30 AWS accounts: outbound DNS queries to known malware Command-and-Control (C2) domains must be blocked, and outbound HTTP/HTTPS traffic to specific fully qualified domain names (FQDNs) must be allowed while all other outbound traffic is denied. Traffic from all accounts routes through a central inspection VPC via a Transit Gateway. Which AWS service in the central inspection VPC handles domain-based egress filtering?",
    options: [
      {
        id: "A",
        text: "AWS WAF Web ACL attached to a centralized Application Load Balancer that all outbound traffic is routed through.",
        isCorrect: false,
        explanation: "AWS WAF operates on HTTP/HTTPS traffic from inbound requests arriving at CloudFront, ALB, API Gateway, etc. — not on outbound traffic from EC2 instances to the internet. WAF cannot be attached to a Transit Gateway or used as a forward proxy for egress filtering. WAF is an inbound edge protection tool."
      },
      {
        id: "B",
        text: "AWS Network Firewall deployed in the inspection VPC with stateful domain list rules to block C2 domains and allow specified FQDNs, routing all egress traffic through the firewall.",
        isCorrect: true,
        explanation: "AWS Network Firewall supports stateful FQDN/domain-based filtering rules — both domain list rules (block/allow specific FQDNs) and Suricata-compatible rules for DNS-based C2 detection. Deployed in a centralized inspection VPC, all egress traffic from the 30 accounts is routed through the Transit Gateway to the inspection VPC, through the Network Firewall, and then to the internet. The Managed Domain Lists (updated by AWS Threat Intelligence) include known C2 domains. FQDN-based allow-list rules control outbound HTTPS access to permitted destinations."
      },
      {
        id: "C",
        text: "Amazon Route 53 Resolver DNS Firewall in each account to block DNS resolution of C2 domains, and Security Groups in the inspection VPC to allow only port 443 to approved IP ranges.",
        isCorrect: false,
        explanation: "Route 53 Resolver DNS Firewall blocks DNS resolution in each individual account's VPC — it does not provide centralized inspection in a single VPC. Security Groups cannot enforce FQDN-based access control (only CIDR-based). This approach requires configuration in each of the 30 accounts, does not centralize egress inspection, and cannot enforce FQDN-based access at the HTTP layer. Network Firewall in the inspection VPC is the centralized answer."
      },
      {
        id: "D",
        text: "Deploy an EC2 Squid proxy cluster in the inspection VPC and configure all accounts' instances with proxy settings pointing to the Squid cluster.",
        isCorrect: false,
        explanation: "A Squid proxy is a valid architecture but requires deploying and scaling EC2 instances, managing Squid configuration and updates, and configuring proxy settings in every EC2 instance across 30 accounts — significant operational overhead. AWS Network Firewall is a managed service that handles scaling, updates, and HA without EC2 instance management."
      }
    ],
    explanation: "AWS Network Firewall is the managed stateful firewall for VPC-level traffic inspection. Its key capabilities relevant here: (1) Domain list rules — allow or deny traffic based on HTTP Host header or TLS SNI, supporting wildcard FQDNs. (2) Managed threat intelligence domain lists — automatically updated AWS-curated lists of malware C2, botnet, and phishing domains. (3) Suricata-compatible IPS rules for custom signatures. Deployed in a centralized inspection VPC with Transit Gateway routing, Network Firewall provides centralized egress control for all spoke VPCs across any number of accounts.",
    keywords: ["Network Firewall FQDN", "domain-based egress filtering", "inspection VPC", "centralized", "C2 domains"]
  },

  {
    id: "d1-062",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam-access-analyzer", "iam", "organizations"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A security team runs IAM Access Analyzer in their AWS account. They receive an Access Analyzer finding: an IAM role named 'DataProcessingRole' is accessible from a different AWS account (account ID: 987654321098). The team confirms this is an intentional cross-account access pattern for a vendor integration. Beyond marking the finding as archived, the team wants to VALIDATE that the DataProcessingRole's permission policy follows least privilege based on actual usage — which Access Analyzer capability addresses this?",
    options: [
      {
        id: "A",
        text: "IAM Access Analyzer external access finding details show the full permission scope of the cross-account trust — the team can review it there.",
        isCorrect: false,
        explanation: "External access findings show that a resource is accessible from outside the zone of trust and display the access path — but they do not evaluate whether the permissions attached to the role are overly broad relative to actual usage. They only identify that external access exists."
      },
      {
        id: "B",
        text: "Enable IAM Access Analyzer unused access analysis. This identifies IAM actions that the DataProcessingRole has been granted but has never used in the past 90 days, enabling the team to remove excess permissions.",
        isCorrect: true,
        explanation: "IAM Access Analyzer unused access analysis (launched November 2023) identifies unused IAM roles, unused access keys, unused passwords, and — critically — unused actions and services within active roles. For DataProcessingRole, Access Analyzer compares the policy's granted actions against CloudTrail-recorded usage over the past 90 days and highlights actions the role has permission to perform but has never actually performed. The team can then remove those actions, achieving least privilege. This is distinct from (and complementary to) external access findings."
      },
      {
        id: "C",
        text: "Use IAM Access Analyzer policy generation — record IAM activity for 90 days, then generate a least-privilege policy based on observed CloudTrail activity.",
        isCorrect: false,
        explanation: "IAM Access Analyzer policy generation creates a new least-privilege policy based on CloudTrail activity. It is useful for creating a new role's policy from scratch based on observed needs. However, for an existing role where you want to identify and remove specific unused actions from the current policy, unused access analysis is the more direct tool — it flags specific permissions to remove rather than requiring a full policy replacement."
      },
      {
        id: "D",
        text: "Run the IAM Access Analyzer policy validation on the DataProcessingRole's permission policy to check for errors and best practice violations.",
        isCorrect: false,
        explanation: "IAM Access Analyzer policy validation checks policies for syntax errors, type errors, security warnings (e.g., wildcard actions, resource wildcards), and general best practice warnings. It does NOT evaluate whether permissions are actually used — it only analyzes the policy document structure. Validation cannot tell you that s3:DeleteBucket is never actually invoked by this role."
      }
    ],
    explanation: "IAM Access Analyzer has three distinct capabilities (updated 2023-2024): (1) External access analysis — finds resources accessible from outside the zone of trust. (2) Unused access analysis — identifies IAM roles, access keys, and specific permissions that are granted but not used (based on last-accessed data from CloudTrail, looking back 90 days). (3) Policy validation and generation — validates policy syntax/security and generates least-privilege policies from CloudTrail. For identifying excess permissions to remove from an existing role, unused access analysis is the correct tool.",
    keywords: ["IAM Access Analyzer", "unused access analysis", "least privilege", "not just external access", "90 days"]
  },

  {
    id: "d1-063",
    domain: 1,
    taskStatement: "1.3",
    services: ["s3", "iam", "organizations"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company's S3 bucket contains sensitive data. The bucket has no bucket policy, but individual objects have been given public-read ACLs by developers. S3 Block Public Access has been enabled with IgnorePublicAcls = true and BlockPublicPolicy = true at the bucket level, but BlockPublicAcls = false and RestrictPublicBuckets = false. A developer claims the objects with public-read ACLs are now inaccessible to the public because Block Public Access is enabled. Is this claim correct?",
    options: [
      {
        id: "A",
        text: "The developer is correct. With any Block Public Access setting enabled, all public access to the bucket is blocked.",
        isCorrect: false,
        explanation: "Block Public Access has four independent settings — enabling some settings does not activate others. The settings have distinct and narrow effects. Enabling IgnorePublicAcls and BlockPublicPolicy does not make all objects inaccessible if those specific settings are what was enabled."
      },
      {
        id: "B",
        text: "The developer is correct specifically because IgnorePublicAcls = true treats all public ACLs as if they grant no access. Even though BlockPublicAcls = false (new public ACLs can still be applied), the existing public-read ACLs on objects are currently ignored. The objects are inaccessible to the public under the current configuration.",
        isCorrect: true,
        explanation: "IgnorePublicAcls = true causes Amazon S3 to ignore all public ACLs on the bucket and its objects — regardless of what ACLs are actually set. With IgnorePublicAcls = true, the public-read ACLs on the objects are effectively disabled: S3 treats requests as if the public-read grants do not exist. The developer is correct that the objects are currently inaccessible to unauthenticated users. However, a critical caveat: BlockPublicAcls = false means new public ACLs can still be added (they just won't take effect while IgnorePublicAcls = true). Best practice is to enable all four settings."
      },
      {
        id: "C",
        text: "The developer is incorrect. IgnorePublicAcls = true only prevents new public ACLs from being set — existing public ACLs remain active and publicly accessible.",
        isCorrect: false,
        explanation: "This confuses IgnorePublicAcls with BlockPublicAcls. BlockPublicAcls prevents PUT requests that would set public ACLs (blocks new public ACLs). IgnorePublicAcls makes S3 ignore all public ACLs — both existing and future — when evaluating access. With IgnorePublicAcls = true, even pre-existing public-read ACLs are treated as if they grant no access."
      },
      {
        id: "D",
        text: "The developer is incorrect. Only setting RestrictPublicBuckets = true prevents public access. IgnorePublicAcls has no effect on existing ACLs.",
        isCorrect: false,
        explanation: "RestrictPublicBuckets restricts a bucket that has a public bucket policy to only AWS service principals and authorized IAM users — it applies when a public POLICY exists. IgnorePublicAcls specifically addresses ACL-based public access. They address different mechanisms and are both needed for complete protection. IgnorePublicAcls = true does neutralize existing public ACLs."
      }
    ],
    explanation: "S3 Block Public Access four settings and their precise effects: BlockPublicAcls = blocks PUT ACL requests that would grant public access (preventive). IgnorePublicAcls = makes S3 ignore ALL public ACLs when evaluating access (retroactively neutralizes existing public ACLs). BlockPublicPolicy = blocks bucket policy PUT requests that would grant public access (preventive). RestrictPublicBuckets = when a public POLICY exists, restricts bucket to only AWS services and authorized IAM users. To understand which setting blocks what, distinguish ACL-blocking (first two) from policy-blocking (last two).",
    keywords: ["IgnorePublicAcls", "BlockPublicAcls", "RestrictPublicBuckets", "BlockPublicPolicy", "four settings distinct"]
  },

  {
    id: "d1-064",
    domain: 1,
    taskStatement: "1.3",
    services: ["kms", "nitro-enclaves", "ec2"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A financial services company processes highly sensitive encryption keys for payment card data on EC2 instances. The security team is concerned that even privileged EC2 operators (those with root OS access or the ability to create snapshots) could potentially extract the sensitive keys from memory or disk. The company needs an isolated compute environment where even the EC2 instance owner or AWS operators CANNOT access the memory or data being processed inside the isolated component. Which AWS feature addresses this requirement?",
    options: [
      {
        id: "A",
        text: "Encrypt the EBS root volume with a KMS customer-managed key so that even snapshot-based attacks are blocked.",
        isCorrect: false,
        explanation: "EBS encryption at rest protects data from physical media access but does not protect data IN MEMORY during processing. A user with root OS access on a running EC2 instance can still read process memory, access sensitive keys in RAM, or dump memory to disk. EBS encryption also does not prevent a privileged user from accessing files on a running, decrypted filesystem."
      },
      {
        id: "B",
        text: "Use AWS Nitro Enclaves to create a fully isolated compute environment within the EC2 instance. The enclave has no persistent storage, no external networking, and no interactive access — even the parent EC2 instance's operators cannot view or modify the enclave's memory.",
        isCorrect: true,
        explanation: "AWS Nitro Enclaves create isolated virtual machines (using Nitro Hypervisor partitioning) within a parent EC2 instance. They have: no persistent storage, no external network interfaces (only a local vsock channel to the parent instance), no SSH/interactive access, and cryptographic attestation (proving the exact code running in the enclave). The parent instance's root user, AWS operators, and even AWS support cannot access the enclave's memory or execution context. Sensitive key material is processed exclusively inside the enclave and never exposed to the parent instance's OS."
      },
      {
        id: "C",
        text: "Enable AWS CloudHSM in the VPC and perform all cryptographic operations inside the HSM, which is tamper-resistant and inaccessible to AWS.",
        isCorrect: false,
        explanation: "CloudHSM is correct for storing and protecting cryptographic keys in a dedicated HSM, but the question asks about protecting an isolated compute process where sensitive keys are USED during payment processing — this involves computation, not just key storage. CloudHSM performs specific cryptographic operations (RSA, AES, ECDSA, HMAC) but is not a general-purpose isolated compute environment for processing arbitrary logic."
      },
      {
        id: "D",
        text: "Deploy the sensitive payment processing logic in an AWS Lambda function with reserved concurrency and a VPC endpoint, so only Lambda infrastructure handles the sensitive code.",
        isCorrect: false,
        explanation: "AWS Lambda is a managed compute environment but does not provide memory isolation from AWS operators at the level Nitro Enclaves do. Lambda functions run on multi-tenant infrastructure managed by AWS. Nitro Enclaves specifically provide cryptographic attestation proving what code is executing in the isolated environment — Lambda does not offer this capability."
      }
    ],
    explanation: "AWS Nitro Enclaves are isolated compute environments for processing highly sensitive data such as PII, encryption keys, and payment credentials. Key properties: (1) Isolated virtual machine with no persistent storage; (2) No SSH, no interactive console; (3) Only local vsock IPC channel to parent instance; (4) Cryptographic attestation via AWS attestation service (proving exact code/AMI running in enclave); (5) KMS integration: only attested enclaves with matching PCR values can call kms:Decrypt via the attestation condition in the key policy. Even if the EC2 instance is fully compromised, the enclave memory remains protected.",
    keywords: ["Nitro Enclaves", "isolated compute", "memory isolation", "cryptographic attestation", "privileged operator protection"]
  },

  {
    id: "d1-065",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam", "organizations", "scp"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company's security architect wants to ensure that S3 objects in the organization's accounts can ONLY be encrypted using SSE-KMS with a customer-managed CMK — never SSE-S3 (AES-256) or unencrypted. This policy must apply to all member accounts and be enforceable even if individual account administrators try to remove bucket policies. Which approach enforces this organization-wide without requiring per-bucket policy changes?",
    options: [
      {
        id: "A",
        text: "Apply an SCP that Denies s3:PutObject unless the aws:RequestObjectEncryption condition key equals aws:kms.",
        isCorrect: false,
        explanation: "The IAM condition key aws:RequestObjectEncryption does not exist. S3 encryption conditions use x-amz-server-side-encryption as an HTTP header condition. SCPs can use string condition keys, but the specific condition expression for S3 server-side encryption in SCP context requires s3:x-amz-server-side-encryption conditions. The correct pattern is to use bucket policies with s3:x-amz-server-side-encryption condition, deployed via Organizations, or an SCP denying s3:PutObject requests that don't include the required encryption header."
      },
      {
        id: "B",
        text: "Apply an SCP at the root OU level that Denies s3:PutObject when the request condition s3:x-amz-server-side-encryption is null (missing) or not equal to 'aws:kms'. Use AWS Organizations Resource Control Policies (RCPs) for the same enforcement at the resource level.",
        isCorrect: true,
        explanation: "An SCP denying s3:PutObject unless s3:x-amz-server-side-encryption is 'aws:kms' enforces KMS encryption requirements across all member accounts at the API call level. Additionally, AWS Resource Control Policies (RCPs) — released re:Invent 2024 — enforce controls at the resource level across the organization, covering cross-account access scenarios. The SCP Deny condition pattern: Deny s3:PutObject if StringNotEquals s3:x-amz-server-side-encryption aws:kms. This blocks all unencrypted uploads and SSE-S3 uploads organization-wide without touching individual bucket policies."
      },
      {
        id: "C",
        text: "Enable AWS Config with the s3-bucket-server-side-encryption-enabled managed rule across all accounts and configure auto-remediation to delete non-compliant objects.",
        isCorrect: false,
        explanation: "Config rules are detective controls — they detect non-compliant configurations after the fact. The s3-bucket-server-side-encryption-enabled rule checks the bucket's default encryption setting, not individual object uploads. Auto-remediation cannot delete non-compliant objects proactively. This is a reactive control with inherent lag, not a preventive control blocking the upload."
      },
      {
        id: "D",
        text: "Deploy a standard S3 bucket policy template via CloudFormation StackSets that enforces SSE-KMS, and use an SCP to deny bucket policy deletion.",
        isCorrect: false,
        explanation: "Deploying bucket policies via StackSets requires maintaining StackSet deployments across all accounts and regions, and existing buckets may have policies replaced or removed between StackSet runs. An SCP denying bucket policy deletion (s3:DeleteBucketPolicy) would help but still requires per-bucket policies to exist initially. The SCP-based s3:PutObject condition approach is more direct and does not depend on bucket policy presence."
      }
    ],
    explanation: "Enforcing S3 encryption organization-wide uses the s3:x-amz-server-side-encryption IAM condition key in an SCP Deny statement. The condition checks the encryption header on PUT requests. Pattern: Deny s3:PutObject when StringNotEquals s3:x-amz-server-side-encryption ['aws:kms']. Also note: the newer AWS Resource Control Policies (RCPs) can enforce this at the S3 resource level for cross-account access scenarios where SCPs may not apply to the accessing principal. RCPs were released at re:Invent 2024 as org-wide resource-level guardrails.",
    keywords: ["organization-wide encryption enforcement", "SCP s3:PutObject condition", "x-amz-server-side-encryption", "RCP", "preventive control"]
  },

  // ─── Difficulty 5 (5 questions — traps) ────────────────────
  {
    id: "d1-066",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "flow-logs", "route53"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A security engineer states: 'VPC Flow Logs capture ALL network traffic flowing through a VPC, including DNS queries made by EC2 instances to the VPC resolver (169.254.169.253), DHCP lease requests, and traffic to the EC2 instance metadata service (169.254.169.254). Therefore, by analyzing Flow Logs alone, we can reconstruct the complete network activity of any EC2 instance.' A colleague disagrees. Which statement CORRECTLY identifies the flaw in this claim?",
    options: [
      {
        id: "A",
        text: "The claim is correct. VPC Flow Logs do capture all traffic including DNS, DHCP, and instance metadata service requests, making them a complete record of instance network activity.",
        isCorrect: false,
        explanation: "This is incorrect. VPC Flow Logs have several documented exclusions that make them an incomplete record of instance network activity."
      },
      {
        id: "B",
        text: "The claim is incorrect. VPC Flow Logs explicitly DO NOT capture: traffic to the VPC DNS resolver (169.254.169.253), DHCP traffic, traffic to the instance metadata service (169.254.169.254), Windows KMS activation traffic (169.254.169.250), and traffic between a Network Load Balancer private IP and instances. These exclusions mean Flow Logs cannot reconstruct complete instance network activity — DNS and metadata queries are invisible.",
        isCorrect: true,
        explanation: "AWS documentation explicitly lists the traffic NOT captured by VPC Flow Logs: (1) Traffic to the Amazon DNS server (including the VPC resolver at 169.254.169.253 and Route 53 Resolver). (2) Traffic generated by instances when they contact the Amazon Windows license activation server (169.254.169.250). (3) Traffic to and from 169.254.169.254 for instance metadata. (4) Traffic to and from 169.254.169.123 for the Amazon Time Sync Service. (5) DHCP traffic. (6) Traffic to the reserved IP address for the default VPC router. (7) Traffic between a Network Load Balancer interface and Fargate tasks or endpoint network interfaces. These exclusions represent significant gaps for complete network reconstruction."
      },
      {
        id: "C",
        text: "The claim is incorrect only because Flow Logs do not capture packet payloads — the 5-tuple metadata (IPs, ports, protocol) IS captured for all traffic types including DNS and DHCP.",
        isCorrect: false,
        explanation: "This is also wrong. Flow Logs do not capture the 5-tuple metadata for DNS/DHCP/IMDS traffic either — those traffic types are entirely excluded from Flow Logs, not just truncated to metadata. The exclusion applies to the entire flow record, not just the payload."
      },
      {
        id: "D",
        text: "The claim is incorrect because VPC Flow Logs only capture traffic on the primary ENI of each instance. Secondary ENIs are not logged.",
        isCorrect: false,
        explanation: "This is false. VPC Flow Logs can be enabled at the VPC level (capturing all ENIs), subnet level, or individual ENI level. Enabling at the VPC level covers all ENIs (primary and secondary) in the VPC. Flow Log scope is determined by where you enable it, not by primary vs. secondary ENI status."
      }
    ],
    explanation: "VPC Flow Logs exclusions represent one of the most frequently missed exam traps. The complete exclusion list from AWS documentation: Amazon DNS server traffic (169.254.169.253 / VPC+2 address), DHCP traffic, Windows KMS activation (169.254.169.250), instance metadata (169.254.169.254), Time Sync (169.254.169.123), default VPC router traffic, NLB-to-Fargate/endpoint interface traffic. For DNS visibility you need Route 53 Resolver Query Logs. For IMDS traffic analysis you need OS-level logging. Flow Logs are excellent for TCP/UDP connection metadata but not a complete network audit.",
    keywords: ["Flow Logs exclusions", "DNS not captured", "DHCP not captured", "IMDS not captured", "incomplete network record"]
  },

  {
    id: "d1-067",
    domain: 1,
    taskStatement: "1.1",
    services: ["directory-service", "iam", "workspaces"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A solutions architect states: 'We are deploying Amazon WorkSpaces and Amazon RDS for SQL Server with Windows Authentication. We chose AD Connector because it proxies all authentication to our on-premises AD without storing directory data in AWS. Both WorkSpaces and RDS SQL Server Windows Auth will work seamlessly since AD Connector proxies authentication requests.' A colleague points out an error. Which statement CORRECTLY identifies the flaw?",
    options: [
      {
        id: "A",
        text: "The architect is correct. AD Connector supports both WorkSpaces and RDS for SQL Server Windows Authentication by proxying authentication requests to on-premises AD.",
        isCorrect: false,
        explanation: "This is the trap. AD Connector does NOT support RDS for SQL Server Windows Authentication. The architect's claim about RDS SQL Server is incorrect."
      },
      {
        id: "B",
        text: "The architect is incorrect about RDS for SQL Server. AD Connector supports WorkSpaces authentication via proxy, but RDS for SQL Server Windows Authentication requires AWS Managed Microsoft AD — AD Connector explicitly does NOT support the Kerberos/NTLM authentication flow that RDS SQL Server requires for Windows Auth.",
        isCorrect: true,
        explanation: "This is the critical distinction. AD Connector supports: WorkSpaces login, AWS Management Console SSO, Amazon Chime, Amazon QuickSight, and some other AWS services. AD Connector does NOT support: RDS for SQL Server Windows Authentication, Amazon FSx for Windows File Server (joined to AD), Amazon RDS for Oracle with Windows Auth, or any service that requires Kerberos ticket issuance or LDAP queries that AD Connector cannot proxy correctly. For RDS SQL Server Windows Auth, the AD controllers must be directly reachable and Kerberos-compatible — this requires AWS Managed Microsoft AD (which runs real AD in AWS) or on-premises AD accessible via Direct Connect with the instance configured to join it directly."
      },
      {
        id: "C",
        text: "The architect is incorrect about WorkSpaces. WorkSpaces requires AWS Managed Microsoft AD for user authentication — AD Connector cannot be used as the WorkSpaces directory.",
        isCorrect: false,
        explanation: "This is wrong. AD Connector DOES support Amazon WorkSpaces. WorkSpaces can use AD Connector, AWS Managed Microsoft AD, or Simple AD as the directory. The limitation is on RDS SQL Server Windows Auth, not WorkSpaces."
      },
      {
        id: "D",
        text: "The architect is correct about both services. AD Connector supports all AWS services that require Active Directory authentication.",
        isCorrect: false,
        explanation: "AD Connector does NOT support all AD-dependent AWS services. The RDS SQL Server Windows Auth limitation is a specific and important exclusion that the exam tests. Services requiring full AD functionality (Kerberos, LDAP operations, group policy, schema extensions) require AWS Managed Microsoft AD."
      }
    ],
    explanation: "The AD Connector vs. AWS Managed Microsoft AD distinction is heavily tested. AD Connector is a pure proxy — it forwards authentication requests to on-prem AD but cannot fulfill requests that require the AD controllers to actively issue Kerberos tickets locally or perform complex LDAP operations. The definitive list of what requires AWS Managed Microsoft AD (NOT AD Connector): RDS for SQL Server Windows Authentication, Amazon FSx for Windows File Server (AD join), WorkDocs with AD, any service requiring LDAP read operations against a local AD. AD Connector supports: WorkSpaces login, AWS Console SSO, Chime, QuickSight. When a question mentions RDS SQL Server with Windows Auth + existing on-prem AD, the answer is Managed Microsoft AD with a trust, not AD Connector.",
    keywords: ["AD Connector limitation", "RDS SQL Server Windows Auth", "Managed Microsoft AD required", "proxy only", "Kerberos"]
  },

  {
    id: "d1-068",
    domain: 1,
    taskStatement: "1.3",
    services: ["config", "security-hub", "cloudtrail"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A security operations manager states: 'We enabled an AWS Config rule that checks whether all S3 buckets have server-side encryption enabled. When a developer creates an unencrypted S3 bucket, our Config rule immediately detects it and our automated remediation runs within 60 seconds — effectively preventing unencrypted bucket use in real time.' A security architect challenges this. Which statement CORRECTLY characterizes AWS Config rule behavior?",
    options: [
      {
        id: "A",
        text: "The manager is correct. Config rules with change-triggered evaluation run in real time — when a bucket is created without encryption, Config detects it within seconds and remediation begins immediately.",
        isCorrect: false,
        explanation: "This is the misconception. AWS Config evaluates rules either periodically (every 1, 3, 6, 12, or 24 hours) or when triggered by configuration changes. Even change-triggered rules have evaluation latency — Config must first detect the configuration change via its recorder, deliver the snapshot, evaluate the rule, generate the finding, and then trigger the remediation pipeline. This is not real-time and the window can be several minutes to longer."
      },
      {
        id: "B",
        text: "The manager is overstating the capability. AWS Config rules are detective controls — they detect non-compliance after resource creation, not in real-time. There is inherent latency between resource creation and Config rule evaluation (minutes, not seconds). Config rules also CANNOT prevent resource creation — they can only detect and trigger post-creation remediation. For real-time prevention, SCPs or IAM conditions are required.",
        isCorrect: true,
        explanation: "AWS Config rules evaluate configurations at specific points — either periodically or on configuration changes detected by the Config recorder. Even change-triggered rules have a pipeline latency: Config recorder detects the change → delivers configuration item → rule evaluator runs → generates compliance finding → EventBridge triggers → remediation automation runs. This pipeline takes minutes, not seconds. More importantly, Config rules CANNOT block the API call at the time it is made — they are detective, not preventive. An unencrypted bucket exists for the duration of this pipeline. For true prevention, SCPs with s3:x-amz-server-side-encryption conditions, or S3 bucket policies enforced via Firewall Manager, are required."
      },
      {
        id: "C",
        text: "The manager is correct about the timing but incorrect about scope — Config rules only apply to existing buckets, not newly created ones.",
        isCorrect: false,
        explanation: "Change-triggered Config rules DO evaluate newly created resources when the Config recorder detects their creation. The limitation is latency (not real-time) and the inability to prevent creation — not an exclusion of new resources."
      },
      {
        id: "D",
        text: "Config rules with custom Lambda-backed evaluation run in real time because the Lambda function is invoked synchronously during bucket creation.",
        isCorrect: false,
        explanation: "Lambda-backed custom Config rules are invoked asynchronously by Config after it detects a configuration change — they are not invoked synchronously during the API call. The Lambda function evaluates the configuration state after-the-fact, not as an inline interceptor. Config rules (managed or custom) cannot intercept AWS API calls in real time."
      }
    ],
    explanation: "AWS Config rules are detective and compliance-reporting controls — they are NOT real-time preventive controls. The evaluation pipeline has inherent latency even for change-triggered rules. AWS Config cannot block API calls. For real-time prevention: (1) SCPs with condition keys block API calls before resource creation. (2) AWS CloudFormation Hooks (proactive guardrails in Control Tower) run synchronously during CloudFormation deployments. (3) Service Catalog requires approved configurations before deployment. Config fills the monitoring/compliance reporting role — detecting drift and triggering remediation — but is fundamentally reactive.",
    keywords: ["Config rules detective not preventive", "evaluation latency", "cannot prevent resource creation", "SCP for real-time prevention", "change-triggered still has lag"]
  },

  {
    id: "d1-069",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam-access-analyzer", "iam", "s3"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A security engineer states: 'IAM Access Analyzer only finds external access — resources shared outside the account or Organization. It cannot help us identify over-privileged IAM roles that have more permissions than they actually use, or find IAM roles that have never been used at all.' A colleague says this statement was accurate in 2022 but is no longer complete. What has changed, and which statement CORRECTLY describes IAM Access Analyzer capabilities as of 2024?",
    options: [
      {
        id: "A",
        text: "The original statement remains accurate. IAM Access Analyzer is still limited to external access findings — it has not expanded its scope.",
        isCorrect: false,
        explanation: "This is factually incorrect. IAM Access Analyzer expanded significantly in November 2023 with the addition of unused access analysis capabilities, and further in 2024 with internal access analyzers."
      },
      {
        id: "B",
        text: "IAM Access Analyzer now includes three distinct capabilities: (1) External access analysis (original) — finds resources accessible from outside the zone of trust. (2) Unused access analysis (added November 2023) — identifies IAM roles not used in 90 days, unused access keys, unused passwords, and specific IAM actions/services within active roles that have never been called. (3) Policy validation and generation (available since 2020-2021) — checks policies for errors and generates least-privilege policies from CloudTrail. The engineer's 2022 statement is incomplete.",
        isCorrect: true,
        explanation: "IAM Access Analyzer expanded its scope significantly. The unused access feature (November 2023) is particularly important for least-privilege: it analyzes IAM roles, users, and access keys against CloudTrail data to identify: roles that have not been used in 90 days (suggesting they should be deleted or reviewed), access keys not used in 90 days, passwords not used in 90 days, and individual IAM permissions within an active role's policy that have never been exercised. This goes well beyond the original external access finding capability and is now a three-pillar service."
      },
      {
        id: "C",
        text: "IAM Access Analyzer expanded to include network reachability analysis — it now scans VPC security groups and NACLs to determine if resources are network-accessible from the internet.",
        isCorrect: false,
        explanation: "Network reachability analysis is a feature of Amazon Inspector v2 (network reachability findings for EC2 instances), not IAM Access Analyzer. Access Analyzer focuses on IAM/resource policy-based access analysis, not network-level reachability via security groups and NACLs."
      },
      {
        id: "D",
        text: "IAM Access Analyzer now integrates with Amazon GuardDuty to detect when IAM permissions are exploited by threat actors during active attacks.",
        isCorrect: false,
        explanation: "GuardDuty detects threats via behavioral analysis of API calls and network traffic. IAM Access Analyzer is a static analysis tool that analyzes policies and usage data — it is not an active threat detection tool and does not integrate with GuardDuty for live threat correlation. That function belongs to GuardDuty and Amazon Detective."
      }
    ],
    explanation: "IAM Access Analyzer's evolution: 2019 — launched with external access analysis (automated reasoning on resource policies). 2021 — added policy validation (syntax, grammar, security warnings, best practices). 2021-2022 — added policy generation (from CloudTrail activity). 2023 — added unused access analysis (IAM roles, access keys, specific permissions unused in 90 days). 2025 — added internal access analyzers (intra-organization access paths). The exam increasingly tests the post-2022 capabilities. 'IAM Access Analyzer only finds external access' is a now-outdated statement that the exam may present as a trap.",
    keywords: ["IAM Access Analyzer expanded", "unused access analysis", "not only external access", "policy validation", "three capabilities"]
  },

  {
    id: "d1-070",
    domain: 1,
    taskStatement: "1.1",
    services: ["cognito", "iam", "sts"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A developer says: 'In our application, users authenticate through a Cognito User Pool. After login, I call the Cognito Identity Pool to get temporary AWS credentials. These credentials have the exact same permissions as the IAM role I configured in the Identity Pool — there is no way to apply per-user permission restrictions without creating a separate IAM role for each user.' A senior architect disagrees. Which approach CORRECTLY enables per-user permission scoping without per-user IAM roles?",
    options: [
      {
        id: "A",
        text: "The developer is correct. Cognito Identity Pool always grants the full permissions of the mapped IAM role. Per-user scoping requires separate roles per user.",
        isCorrect: false,
        explanation: "This is the misconception. Cognito Identity Pool supports multiple mechanisms for per-user permission customization without creating per-user roles."
      },
      {
        id: "B",
        text: "Use Cognito Identity Pool role-based access control (RBAC) with Cognito User Pool groups — each group maps to a different IAM role. Users in different groups get different permissions without per-user roles.",
        isCorrect: false,
        explanation: "Group-to-role mapping reduces the number of roles (one per group, not one per user) but still requires a separate IAM role per permission group. For 1,000 users in 20 groups, you need 20 roles — better than 1,000, but this is not the approach the architect is likely suggesting for true per-user scoping."
      },
      {
        id: "C",
        text: "Pass a session policy at AssumeRoleWithWebIdentity time via the Cognito Identity Pool configuration to further restrict permissions for individual users, combined with IAM policy variables (${cognito-identity.amazonaws.com:sub}) in the role policy to scope resource access to the individual user's identity.",
        isCorrect: true,
        explanation: "IAM policy variables enable per-user resource scoping within a single shared role. The policy variable ${cognito-identity.amazonaws.com:sub} resolves to the authenticated user's unique Cognito identity ID at policy evaluation time — enabling expressions like 'Resource: arn:aws:s3:::my-bucket/${cognito-identity.amazonaws.com:sub}/*' that scope each user to their own S3 prefix. Additionally, Cognito Identity Pool supports session tags derived from User Pool token claims, and session policies can be passed per-request to further restrict permissions. A single IAM role can serve all users with per-user resource isolation — no per-user roles required."
      },
      {
        id: "D",
        text: "Configure Cognito Identity Pool with the 'Enhanced (Simplified) Auth Flow' instead of 'Basic Auth Flow.' The enhanced flow applies per-user permission rules automatically.",
        isCorrect: false,
        explanation: "The Enhanced Auth Flow simplifies the integration by allowing the Identity Pool to call STS on behalf of the user internally, versus the Basic Auth Flow where the client calls STS directly. Neither flow automatically applies per-user permission rules. The Enhanced flow uses a pre-configured role and does not dynamically scope permissions per user. Policy variables and session tags require configuration regardless of auth flow."
      }
    ],
    explanation: "Cognito Identity Pool per-user permission patterns without per-user roles: (1) IAM policy variables — ${cognito-identity.amazonaws.com:sub} in Resource ARNs or condition values to scope access to the user's own resources. (2) Session tags — Cognito maps User Pool token claims to STS session tags, and the IAM role policy uses aws:PrincipalTag conditions. (3) Session policies — the app passes an additional restricting policy at credential request time. These patterns are scalable to millions of users with a single IAM role by using the authenticated identity as a dynamic scope in the policy evaluation.",
    keywords: ["Cognito policy variables", "per-user scoping", "no per-user roles", "cognito-identity:sub", "session tags"]
  }
]
