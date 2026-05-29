import { Question } from "../lib/types"
import { domain1NewQuestions } from "./questions-d1-new"
import { domain2NewQuestions } from "./questions-d2-new"
import { domain3NewQuestions } from "./questions-d3-new"
import { domain4NewQuestions } from "./questions-d4-new"
import { crossDomainQuestions } from "./questions-cross"
import { domain1NewQuestions2 } from "./questions-d1-new2"
import { domain2NewQuestions2 } from "./questions-d2-new2"
import { domain3NewQuestions2 } from "./questions-d3-new2"
import { domain4NewQuestions2 } from "./questions-d4-new2"
import { crossDomainQuestions2 } from "./questions-cross2"

// ─────────────────────────────────────────────────────────────
// DOMAIN 1 — Design Secure Architectures (10 questions)
// ─────────────────────────────────────────────────────────────
const domain1Questions: Question[] = [
  {
    id: "d1-001",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam", "sts", "s3"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A software company has a Development account and a Production account in AWS Organizations. Developers in the Development account need to occasionally read objects from an S3 bucket that lives in the Production account. The security team requires that no long-lived IAM user credentials are shared between accounts. Which approach grants cross-account S3 access with the LEAST operational overhead and no long-lived keys?",
    options: [
      {
        id: "A",
        text: "Create an IAM user in the Production account and share its access key with developers.",
        isCorrect: false,
        explanation: "Wrong — this uses long-lived access keys shared across accounts, which the question explicitly prohibits and is an IAM anti-pattern."
      },
      {
        id: "B",
        text: "Create an IAM role in the Production account with an S3 read policy and a trust policy that allows the Development account's IAM principals to assume it via AssumeRole.",
        isCorrect: true,
        explanation: "Correct — cross-account role assumption via STS AssumeRole is the standard AWS pattern. Developers receive temporary credentials (no long-lived keys) and the trust policy controls exactly who can assume the role."
      },
      {
        id: "C",
        text: "Enable S3 ACLs on the Production bucket and add the Development account's canonical user ID to the ACL.",
        isCorrect: false,
        explanation: "Wrong — S3 ACLs are a legacy mechanism that provide coarse-grained access and don't eliminate long-lived keys for the calling principals. AWS recommends disabling ACLs in favor of bucket policies."
      },
      {
        id: "D",
        text: "Configure an S3 Gateway VPC Endpoint in the Development account VPC to route traffic directly to the Production bucket.",
        isCorrect: false,
        explanation: "Wrong — a Gateway VPC Endpoint affects network routing but does not grant cross-account permissions. Access to the Production bucket still requires IAM authorization."
      }
    ],
    explanation: "Cross-account access in AWS is best handled by creating an IAM role in the target (Production) account with the necessary permissions, and a trust policy that explicitly trusts the source (Development) account. Principals in the source account use STS AssumeRole to obtain temporary credentials scoped to the role. This satisfies least-privilege, produces no long-lived keys, and is fully auditable in CloudTrail.",
    keywords: ["cross-account", "least operational overhead", "no long-lived keys"]
  },
  {
    id: "d1-002",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam", "organizations", "scp"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A large enterprise uses AWS Organizations with all features enabled. The security team wants to ensure that no IAM principal in any member account can disable AWS CloudTrail — including account administrators — without exception. What is the MOST effective way to enforce this guardrail?",
    options: [
      {
        id: "A",
        text: "Attach an IAM permission boundary to every IAM user and role in each member account that denies cloudtrail:StopLogging.",
        isCorrect: false,
        explanation: "Wrong — permission boundaries restrict individual principals but must be manually applied per principal. An account administrator with IAM::CreateRole permissions could simply create a new role without the boundary."
      },
      {
        id: "B",
        text: "Enable AWS Config in every member account with a managed rule that detects when CloudTrail is disabled and triggers an SSM Automation remediation to re-enable it.",
        isCorrect: false,
        explanation: "Wrong — Config rules are detective controls. They detect non-compliance after the fact and remediation takes time. This does not prevent the action from occurring in the first place."
      },
      {
        id: "C",
        text: "Apply a Service Control Policy (SCP) with an explicit Deny on cloudtrail:StopLogging and cloudtrail:DeleteTrail to the root or a parent OU.",
        isCorrect: true,
        explanation: "Correct — SCPs are preventive guardrails that cap permissions for all member accounts in the OU hierarchy, including account root users (except the management account). An explicit Deny in an SCP cannot be overridden by any IAM policy in a member account."
      },
      {
        id: "D",
        text: "Enable AWS Control Tower and activate the 'Disallow Changes to CloudTrail' guardrail, which uses a Lambda-backed Config rule.",
        isCorrect: false,
        explanation: "Wrong — Control Tower's detective guardrails use Config rules (detective), not SCPs (preventive) for this specific control. While Control Tower can enforce SCPs, the description here matches a detective approach, not a preventive one."
      }
    ],
    explanation: "Service Control Policies (SCPs) in AWS Organizations are the authoritative preventive guardrail. They act as a ceiling on what any IAM principal in a member account can do — including account administrators. An explicit Deny in an SCP at the root or OU level blocks all principals in that scope from performing the denied API actions regardless of their identity-based policies. SCPs do not apply to the management account itself.",
    keywords: ["preventive", "cannot disable", "all member accounts", "guardrail"]
  },
  {
    id: "d1-003",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "security-group", "nacl"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A financial services company operates a three-tier web application in a VPC. The operations team has identified a specific external IP address that is actively attempting SQL injection attacks against the application load balancer. The security team needs to block all traffic from that IP address immediately. Which solution achieves this with the LEAST changes to existing resources?",
    options: [
      {
        id: "A",
        text: "Add an inbound deny rule to the Network ACL (NACL) on the public subnet, explicitly denying traffic from the attacker's IP address.",
        isCorrect: true,
        explanation: "Correct — NACLs support explicit Deny rules and apply at the subnet level. A NACL rule with a lower rule number than any Allow rule that denies the specific IP will block all traffic from that address. Security Groups only support Allow rules, making them unable to explicitly block a specific IP."
      },
      {
        id: "B",
        text: "Update the security group attached to the Application Load Balancer to remove any inbound Allow rule matching the attacker's IP.",
        isCorrect: false,
        explanation: "Wrong — Security Groups are allow-list only; they have no explicit Deny rule capability. Traffic not matching any Allow rule is implicitly denied, but you cannot specifically deny one IP while allowing the general public. The attacker's IP may already be covered by a broad CIDR allow rule."
      },
      {
        id: "C",
        text: "Create a new security group that explicitly denies traffic from the attacker's IP and attach it to the ALB.",
        isCorrect: false,
        explanation: "Wrong — Security Groups do not support Deny rules. All rules in a security group are implicit Allows. This is a common exam distractor."
      },
      {
        id: "D",
        text: "Deploy AWS WAF with a custom rule to block the attacker's IP address and associate it with the ALB.",
        isCorrect: false,
        explanation: "Wrong — While WAF is a valid longer-term solution that can block specific IPs, the question asks for the least changes immediately. Modifying a NACL rule is a single, immediate action with no additional service to configure or cost to incur."
      }
    ],
    explanation: "The key distinction tested here is that Security Groups are stateful allow-only firewalls, while NACLs are stateless and support both Allow and Deny rules evaluated in numbered order. When you need to explicitly block a specific IP address, the NACL is the correct tool. WAF is also valid for IP blocking but involves deploying or reconfiguring an additional service.",
    keywords: ["block specific IP", "immediately", "least changes"]
  },
  {
    id: "d1-004",
    domain: 1,
    taskStatement: "1.2",
    services: ["cognito", "s3", "sts"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A mobile application allows users to sign in with their Google accounts and then upload photos directly to an S3 bucket from their mobile device. Each user must only be able to write to a prefix in S3 that matches their own unique user ID. The solution must scale to millions of users without creating IAM users. Which AWS service combination achieves this?",
    options: [
      {
        id: "A",
        text: "Amazon Cognito User Pool to authenticate users, then Amazon Cognito Identity Pool to exchange the Google ID token for temporary AWS credentials scoped to that user's S3 prefix using IAM policy variables.",
        isCorrect: true,
        explanation: "Correct — The Cognito User Pool handles authentication (sign-in with Google via federation). The Cognito Identity Pool exchanges the resulting JWT for temporary IAM credentials via STS. The IAM role can use the policy variable ${cognito-identity.amazonaws.com:sub} to scope S3 access to the user's own prefix. No IAM users are created."
      },
      {
        id: "B",
        text: "Amazon Cognito User Pool to authenticate users, then generate a pre-signed S3 URL from a backend Lambda function and return it to the mobile app for uploading.",
        isCorrect: false,
        explanation: "Wrong — Pre-signed URLs work but require a backend Lambda call for every upload, adding latency, cost, and operational complexity. The identity-pool approach allows the mobile device to upload directly using its own temporary credentials without a backend intermediary."
      },
      {
        id: "C",
        text: "IAM Identity Center with a Google SAML IdP integration to federate all users, then assign each user a permission set that grants S3 access.",
        isCorrect: false,
        explanation: "Wrong — IAM Identity Center is designed for workforce (employee) SSO to the AWS console and CLI, not for mobile application end users. Cognito is the correct service for application end-user identity."
      },
      {
        id: "D",
        text: "Use AWS STS GetFederationToken directly from the mobile app, passing the Google token, to obtain temporary credentials with S3 access.",
        isCorrect: false,
        explanation: "Wrong — GetFederationToken cannot be called from temporary credentials and is designed for server-side proxy federation, not mobile clients. It also requires embedding an IAM user's credentials in the mobile app to call it, which is an anti-pattern."
      }
    ],
    explanation: "The classic mobile-to-S3 secure upload pattern combines a Cognito User Pool (authentication/identity directory) with a Cognito Identity Pool (authorization — exchanges JWT for temporary AWS credentials). IAM role policies can use Cognito identity variables to ensure each user's credentials only grant access to their own S3 prefix, enabling fine-grained per-user access without an IAM user per customer.",
    keywords: ["temporary AWS credentials", "millions of users", "no IAM users", "direct S3 upload"]
  },
  {
    id: "d1-005",
    domain: 1,
    taskStatement: "1.3",
    services: ["kms", "s3"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A healthcare company stores patient records in Amazon S3. Compliance requirements mandate that the company controls all encryption keys and must have an audit trail of every time a key is used to decrypt data. The company's security team must be able to rotate keys on a schedule they define. Which S3 encryption configuration satisfies all three requirements?",
    options: [
      {
        id: "A",
        text: "SSE-S3 (default server-side encryption with S3-managed keys).",
        isCorrect: false,
        explanation: "Wrong — With SSE-S3, AWS owns and manages the keys internally. The customer has no control over key policies, no visibility into key usage via CloudTrail, and no ability to set a custom rotation schedule."
      },
      {
        id: "B",
        text: "SSE-KMS with a customer-managed KMS key (CMK).",
        isCorrect: true,
        explanation: "Correct — Customer-managed KMS keys give the company full control of the key policy, produce CloudTrail entries for every Decrypt/GenerateDataKey API call (providing the audit trail), and allow configuring automatic rotation from 90 to 2,560 days (or manual rotation)."
      },
      {
        id: "C",
        text: "SSE-C (server-side encryption with customer-provided keys).",
        isCorrect: false,
        explanation: "Wrong — With SSE-C, the customer provides the key with every request. AWS never stores the key, so there is no KMS-integrated audit trail. Key management and rotation are entirely the customer's responsibility outside AWS, with no CloudTrail integration for key usage."
      },
      {
        id: "D",
        text: "Client-side encryption using the AWS Encryption SDK before uploading objects to S3.",
        isCorrect: false,
        explanation: "Wrong — While CSE gives key control, the decryption happens on the client side, so there is no server-side audit trail in CloudTrail for every decrypt operation. This adds significant application complexity and does not centrally log key usage through AWS."
      }
    ],
    explanation: "SSE-KMS with a customer-managed CMK is the exam pattern whenever three specific requirements converge: customer controls the key, audit trail of key usage, and custom rotation schedule. KMS key usage is logged in CloudTrail as Decrypt/GenerateDataKey events. Key rotation can be configured between 90 and 2,560 days (since April 2024). AWS-managed KMS keys rotate automatically but cannot be rotated on a custom schedule or have policies modified.",
    keywords: ["customer controls keys", "audit trail", "rotation schedule", "compliance"]
  },
  {
    id: "d1-006",
    domain: 1,
    taskStatement: "1.2",
    services: ["ssm", "ec2", "vpc"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A company runs hundreds of EC2 instances in private subnets with no internet access. The operations team currently uses SSH bastion hosts to access instances for troubleshooting and patching. The security team wants to eliminate bastion hosts, remove all inbound SSH firewall rules, and retain a full audit log of all shell sessions. Which solution meets these requirements with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Deploy a fleet of NAT Instances in public subnets and configure them to proxy SSH traffic to private instances.",
        isCorrect: false,
        explanation: "Wrong — NAT instances are self-managed, don't solve the bastion problem, require inbound SSH rules, and provide no native session logging. This increases operational overhead."
      },
      {
        id: "B",
        text: "Deploy AWS Systems Manager Session Manager. Attach the AmazonSSMManagedInstanceCore IAM role to EC2 instances. Users start sessions via the AWS console or CLI using ssm:StartSession.",
        isCorrect: true,
        explanation: "Correct — Session Manager provides browser and CLI-based shell access to EC2 instances with no SSH keys, no bastion hosts, and no inbound security group rules. Sessions are fully audited and can be logged to S3 and CloudWatch Logs with optional KMS encryption. It requires SSM Agent (pre-installed on Amazon Linux 2/AL2023/Windows Server) and IAM permissions."
      },
      {
        id: "C",
        text: "Set up AWS Client VPN and have operators connect to the VPC over the VPN tunnel before SSH-ing to instances.",
        isCorrect: false,
        explanation: "Wrong — Client VPN enables network-level access but still requires SSH keys, open SSH ports on security groups, and provides no native session logging. Operators would still need the SSH bastion infrastructure."
      },
      {
        id: "D",
        text: "Configure EC2 Instance Connect and post ephemeral SSH public keys to instances via the API for each connection.",
        isCorrect: false,
        explanation: "Wrong — EC2 Instance Connect still uses SSH protocol and requires port 22 open in the security group (even if only to the EC2 Instance Connect service IP ranges). It does not provide the session logging capability asked for and still relies on SSH."
      }
    ],
    explanation: "AWS Systems Manager Session Manager is the canonical answer for 'secure EC2 access without SSH, bastion hosts, or open inbound ports.' It requires: the SSM Agent on the instance, the AmazonSSMManagedInstanceCore IAM role attached to the instance, and ssm:StartSession permission for the operator. All session activity is logged to CloudWatch Logs or S3. In private subnets, VPC Interface Endpoints for ssm, ssmmessages, and ec2messages are needed if there is no internet access.",
    keywords: ["no SSH", "no bastion", "no inbound ports", "audit log", "least operational overhead"]
  },
  {
    id: "d1-007",
    domain: 1,
    taskStatement: "1.3",
    services: ["secrets-manager", "rds", "lambda"],
    constraintType: "security",
    difficulty: 2,
    type: "single",
    stem: "A startup's application retrieves RDS database credentials by reading a hardcoded password from an environment variable set at Lambda deployment time. The security team requires that database passwords rotate automatically every 30 days, and that the application retrieves the current credential at runtime without code changes. Which solution meets both requirements with the LEAST custom development?",
    options: [
      {
        id: "A",
        text: "Store the password in AWS Systems Manager Parameter Store as a SecureString and update the Lambda environment variable on rotation day via a maintenance script.",
        isCorrect: false,
        explanation: "Wrong — Parameter Store SecureString does not support automatic rotation. Manually updating the environment variable adds operational overhead and code changes. This does not meet 'automatic rotation' or 'least custom development.'"
      },
      {
        id: "B",
        text: "Store the database credentials in AWS Secrets Manager with the managed rotation enabled for the RDS engine. Update the Lambda function to call secretsmanager:GetSecretValue at runtime.",
        isCorrect: true,
        explanation: "Correct — Secrets Manager natively supports automatic rotation for RDS (all engines) via Lambda-based rotation functions that AWS provides. The application calls GetSecretValue at runtime, always receiving the current credential. No manual rotation or code changes to rotation logic are needed."
      },
      {
        id: "C",
        text: "Enable RDS IAM database authentication and have the Lambda function generate a temporary auth token using rds-db:connect.",
        isCorrect: false,
        explanation: "Wrong — IAM database authentication is a valid security approach, but it requires changes to both the RDS instance (IAM auth must be enabled), the database (IAM users), and the application code. The question asks for the least custom development against an existing password-based credential system."
      },
      {
        id: "D",
        text: "Use AWS KMS to encrypt the password stored in an S3 bucket. Lambda reads and decrypts the file on each invocation.",
        isCorrect: false,
        explanation: "Wrong — This approach has no automatic rotation capability. Someone must update the S3 object manually when rotating. It also adds custom logic (S3 reads, KMS decrypt) when Secrets Manager already provides a purpose-built, fully managed solution."
      }
    ],
    explanation: "AWS Secrets Manager is purpose-built for storing, retrieving, and automatically rotating database credentials. For RDS, it provides managed rotation Lambda functions for all supported engines (MySQL, PostgreSQL, Oracle, SQL Server, MariaDB) that handle both the Secrets Manager secret update and the database password change. The application calls GetSecretValue at runtime — no environment variable updates, no deployment changes, and no custom rotation code.",
    keywords: ["automatic rotation", "runtime retrieval", "no code changes", "least custom development"]
  },
  {
    id: "d1-008",
    domain: 1,
    taskStatement: "1.2",
    services: ["waf", "shield", "cloudfront", "alb"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "An e-commerce company's website is protected by CloudFront in front of an Application Load Balancer. The company has experienced volumetric DDoS attacks (layer 3/4) and also HTTP flood attacks (layer 7). The security team needs protection against both attack types, 24/7 access to AWS DDoS experts during an attack, and reimbursement for scaling costs incurred during a DDoS event. What is the MINIMUM viable solution?",
    options: [
      {
        id: "A",
        text: "Enable AWS Shield Standard (free) on the CloudFront distribution and deploy AWS WAF with rate-based rules on the ALB.",
        isCorrect: false,
        explanation: "Wrong — Shield Standard provides automatic L3/L4 protection but does NOT include the DDoS Response Team (DRT) access or cost protection credits. It also lacks advanced reporting and 24/7 expert access."
      },
      {
        id: "B",
        text: "Subscribe to AWS Shield Advanced for the organization and associate the CloudFront distribution and ALB as protected resources. Enable WAF on CloudFront for L7 protection.",
        isCorrect: true,
        explanation: "Correct — Shield Advanced provides L3/L4 volumetric protection plus L7 protection via WAF integration, 24/7 Shield Response Team (SRT) access during attacks, DDoS cost protection (credits for scaling costs on protected resources), and advanced reporting. A $3,000/month subscription with a 1-year commitment covers all protected resources in the organization."
      },
      {
        id: "C",
        text: "Deploy AWS Network Firewall at the VPC perimeter and enable Suricata-based rules for DDoS detection.",
        isCorrect: false,
        explanation: "Wrong — Network Firewall operates at the VPC perimeter and cannot absorb volumetric internet-scale DDoS attacks. It also does not provide expert SRT access or cost protection credits."
      },
      {
        id: "D",
        text: "Use AWS Shield Standard on CloudFront and add an AWS WAF Web ACL with AWS Managed Rules for Known Bad Inputs and Core Rule Set.",
        isCorrect: false,
        explanation: "Wrong — Same as option A with different WAF rules. Still lacks SRT access and cost protection reimbursement which are explicitly required."
      }
    ],
    explanation: "AWS Shield Advanced is the answer when all three requirements appear together: L7 protection, 24/7 DRT/SRT access, and DDoS cost protection credits. Shield Standard is free and automatic but provides only L3/L4 protection with no expert access or cost reimbursement. Shield Advanced costs $3,000/month with a 1-year commitment per organization (not per resource), and the cost protection benefit alone can justify the cost during sustained attacks.",
    keywords: ["L3/L4 DDoS", "HTTP flood", "24/7 DDoS experts", "cost reimbursement", "cost protection"]
  },
  {
    id: "d1-009",
    domain: 1,
    taskStatement: "1.3",
    services: ["kms", "ebs", "ec2"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company has a running EC2 instance with an unencrypted EBS root volume containing sensitive production data. A compliance audit requires all EBS volumes to be encrypted with a customer-managed KMS key. The instance must remain functional after the migration with minimal downtime. Which sequence of steps achieves this?",
    options: [
      {
        id: "A",
        text: "Enable 'Encryption by default' at the account level and restart the EC2 instance to automatically encrypt the existing volume.",
        isCorrect: false,
        explanation: "Wrong — 'Encryption by default' only encrypts new volumes created after the setting is enabled. It does not retroactively encrypt existing unencrypted volumes. Restarting the instance has no effect on the existing volume's encryption state."
      },
      {
        id: "B",
        text: "Stop the instance, create a snapshot of the unencrypted volume, copy the snapshot specifying the customer-managed KMS key to encrypt it, restore a new encrypted volume from the encrypted snapshot, detach the old volume, attach the new volume, and start the instance.",
        isCorrect: true,
        explanation: "Correct — This is the only supported path to encrypt an existing unencrypted EBS volume. The steps are: (1) Stop instance, (2) Create snapshot, (3) Copy snapshot with --encrypted and --kms-key-id, (4) Create volume from encrypted snapshot, (5) Detach original root volume, (6) Attach new encrypted volume as /dev/xvda (root), (7) Start instance."
      },
      {
        id: "C",
        text: "Use the AWS console to modify the existing EBS volume and enable encryption in-place using KMS.",
        isCorrect: false,
        explanation: "Wrong — There is no in-place encryption conversion for existing EBS volumes. The EBS console allows changing volume type and size, but not enabling encryption on an existing unencrypted volume."
      },
      {
        id: "D",
        text: "Use AWS DataSync to copy the volume data to an encrypted EBS volume while the instance is running.",
        isCorrect: false,
        explanation: "Wrong — DataSync transfers data between file systems and S3, not between EBS volumes. It cannot directly copy a running EBS volume to an encrypted one while maintaining data consistency for a root volume."
      }
    ],
    explanation: "Converting an unencrypted EBS volume to an encrypted one always requires the snapshot-copy-restore path. There is no in-place encryption for existing volumes. The critical step is using the CopySnapshot API with --encrypted --kms-key-id to produce an encrypted snapshot, then restoring a volume from it. This also applies to cross-account snapshot sharing: the default aws/ebs key cannot be shared, so a customer-managed CMK must be used.",
    keywords: ["encrypt existing volume", "in-place encryption", "customer-managed key", "minimal downtime"]
  },
  {
    id: "d1-010",
    domain: 1,
    taskStatement: "1.2",
    services: ["guardduty", "macie", "inspector", "security-hub"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company's security team wants to address three separate requirements: (1) detect if an EC2 instance is communicating with a known cryptocurrency mining pool, (2) discover S3 buckets that contain unprotected credit card numbers, and (3) identify EC2 instances with unpatched critical CVEs. Which combination of services maps to these three requirements respectively?",
    options: [
      {
        id: "A",
        text: "Amazon Inspector, Amazon Macie, Amazon GuardDuty",
        isCorrect: false,
        explanation: "Wrong — Inspector detects CVEs but not cryptocurrency mining C2 traffic. Macie discovers PII/sensitive data in S3. This combination has the first two requirements transposed."
      },
      {
        id: "B",
        text: "Amazon GuardDuty, Amazon Macie, Amazon Inspector",
        isCorrect: true,
        explanation: "Correct — GuardDuty uses ML analysis of VPC Flow Logs, DNS, and CloudTrail to detect threats like cryptocurrency mining pool communication (a built-in finding type: CryptoCurrency:EC2/BitcoinTool). Macie scans S3 for PII and sensitive data including credit card numbers using managed data identifiers. Inspector v2 continuously scans EC2 for OS-level CVEs using the SSM agent."
      },
      {
        id: "C",
        text: "AWS Security Hub, Amazon Macie, Amazon GuardDuty",
        isCorrect: false,
        explanation: "Wrong — Security Hub aggregates and normalizes findings from other services (GuardDuty, Macie, Inspector) but does not independently detect C2 traffic or CVEs. It is an aggregation layer, not a detection service."
      },
      {
        id: "D",
        text: "Amazon GuardDuty, Amazon Inspector, Amazon Macie",
        isCorrect: false,
        explanation: "Wrong — This maps GuardDuty to requirement 1 (correct), Inspector to requirement 2 (wrong — Inspector scans compute, not S3 for PII), and Macie to requirement 3 (wrong — Macie does not scan for CVEs)."
      }
    ],
    explanation: "The four-service confusion matrix is a heavily tested concept: GuardDuty = active threat detection via ML on logs (C2, lateral movement, crypto mining, exfiltration); Macie = PII/sensitive data discovery in S3 only; Inspector = vulnerability/CVE scanning for EC2, ECR, and Lambda; Detective = investigation and visualization after a finding. Security Hub aggregates all four into a single pane of glass. Mapping the right service to the right problem is essential.",
    keywords: ["threat detection", "PII discovery", "CVE scanning", "cryptocurrency mining"]
  }
]

// ─────────────────────────────────────────────────────────────
// DOMAIN 2 — Design Resilient Architectures (10 questions)
// ─────────────────────────────────────────────────────────────
const domain2Questions: Question[] = [
  {
    id: "d2-001",
    domain: 2,
    taskStatement: "2.1",
    services: ["sqs", "sns", "lambda"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "An order processing system uses a Lambda function that is triggered by an SNS topic. The downstream inventory service occasionally takes longer than expected, causing Lambda to time out after 15 minutes. Failed orders are silently lost. The team needs to guarantee that every order is eventually processed, even if it requires multiple attempts, and that orders that repeatedly fail are isolated for investigation. Which architecture change achieves this?",
    options: [
      {
        id: "A",
        text: "Increase the Lambda function timeout to the maximum of 15 minutes and add retry logic inside the function code.",
        isCorrect: false,
        explanation: "Wrong — Lambda timeout is already at the maximum (15 minutes). Retrying within the function still loses orders if the function itself times out. This does not provide durable message storage or failure isolation."
      },
      {
        id: "B",
        text: "Add an SQS Standard queue as a subscriber to the SNS topic (SNS → SQS fan-out). Configure the SQS queue as the Lambda event source with a Dead Letter Queue (DLQ) set to a separate SQS queue after maxReceiveCount attempts.",
        isCorrect: true,
        explanation: "Correct — The SNS → SQS → Lambda pattern (fan-out with queuing) provides message durability and retry semantics. SQS retains the message (up to 14 days) between Lambda invocations. After maxReceiveCount failed attempts the message is moved to the DLQ for investigation. This decouples the SNS push from Lambda processing."
      },
      {
        id: "C",
        text: "Enable Lambda Destinations for failures and route failed invocations to another Lambda function for immediate retry.",
        isCorrect: false,
        explanation: "Wrong — Lambda Destinations (for async invocations) route the failure event to a target but do not provide durable storage or controlled retry backoff. If the inventory service is consistently slow, the retry Lambda may also fail."
      },
      {
        id: "D",
        text: "Switch the SNS subscription to a FIFO SNS topic and enable content-based deduplication.",
        isCorrect: false,
        explanation: "Wrong — SNS FIFO topics can only deliver to SQS FIFO queues — they do not add retry, durability, or failure isolation on their own. Content-based deduplication prevents duplicate deliveries but does not address processing failures."
      }
    ],
    explanation: "The SNS-to-SQS fan-out pattern is the canonical solution for durable, resilient event-driven processing. SQS provides: message retention (up to 14 days), visibility timeout (prevents duplicate processing), configurable retry via maxReceiveCount, and DLQ support for isolating poison messages. Lambda Destinations with async invocations also have retry, but SQS gives more control over retry count, interval, and message inspection.",
    keywords: ["guaranteed delivery", "retry", "failed orders isolated", "DLQ", "fan-out"]
  },
  {
    id: "d2-002",
    domain: 2,
    taskStatement: "2.2",
    services: ["rds", "aurora", "rds-proxy"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A company runs a customer-facing API backed by a Lambda function that connects to an Amazon RDS PostgreSQL instance. During flash sale events, the number of concurrent Lambda executions spikes from 100 to 5,000 within seconds. The RDS instance frequently logs 'too many connections' errors during these spikes, causing API failures. The database cannot be replaced. Which solution resolves this with the LEAST code changes?",
    options: [
      {
        id: "A",
        text: "Increase the max_connections parameter in the RDS Parameter Group to a higher value.",
        isCorrect: false,
        explanation: "Wrong — max_connections is bounded by instance memory (typically memory_GB × ~100 for PostgreSQL). A db.r5.large supports ~3,750 connections maximum. Increasing the parameter may help slightly but does not address the fundamental problem of Lambda's connection-per-execution model."
      },
      {
        id: "B",
        text: "Add Amazon RDS Proxy in front of the RDS instance and update the Lambda connection string to point to the Proxy endpoint.",
        isCorrect: true,
        explanation: "Correct — RDS Proxy maintains a persistent connection pool to the RDS instance and multiplexes thousands of Lambda connections into a much smaller pool of real database connections. It also supports IAM authentication and Secrets Manager integration. The only code change needed is updating the connection endpoint — no logic changes."
      },
      {
        id: "C",
        text: "Implement connection pooling in the Lambda function code using a PgBouncer layer.",
        isCorrect: false,
        explanation: "Wrong — Lambda functions are stateless and ephemeral. A PgBouncer layer within Lambda cannot maintain a persistent connection pool across invocations because each Lambda execution environment is independent. Connections are opened and closed with each invocation."
      },
      {
        id: "D",
        text: "Convert the Lambda function to an ECS Fargate service with a persistent connection pool library (e.g., pgpool).",
        isCorrect: false,
        explanation: "Wrong — While this would solve the problem, it involves significant architectural change (Lambda → ECS), which contradicts 'least code changes.' RDS Proxy is purpose-built for exactly this Lambda + RDS connection exhaustion scenario."
      }
    ],
    explanation: "Amazon RDS Proxy is the purpose-built answer for the Lambda-to-RDS connection storm problem. Lambda opens a new database connection per execution context, and with thousands of concurrent executions the connection limit is easily exhausted. RDS Proxy pools and multiplexes connections, allowing thousands of Lambda executions to share a much smaller pool of real RDS connections. It also provides up to 66% faster failover for RDS Multi-AZ events.",
    keywords: ["too many connections", "Lambda connection storm", "least code changes", "connection pool"]
  },
  {
    id: "d2-003",
    domain: 2,
    taskStatement: "2.2",
    services: ["aurora", "route53"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A global e-commerce platform requires a relational MySQL-compatible database with an RPO of less than 1 second and an RTO of less than 1 minute for a regional disaster. The database must serve read traffic from the disaster recovery region during normal operations. Which database architecture meets these requirements?",
    options: [
      {
        id: "A",
        text: "Amazon RDS MySQL with Multi-AZ enabled and automated cross-region snapshots every 5 minutes.",
        isCorrect: false,
        explanation: "Wrong — Automated snapshots every 5 minutes give an RPO of up to 5 minutes, not less than 1 second. Restoring from a snapshot in a new region also takes tens of minutes for the RTO, far exceeding the <1 minute requirement."
      },
      {
        id: "B",
        text: "Amazon Aurora Global Database (MySQL-compatible) with a secondary region and Route 53 failover routing.",
        isCorrect: true,
        explanation: "Correct — Aurora Global Database uses dedicated replication infrastructure to maintain a secondary region with a typical RPO of under 1 second and an RTO of under 1 minute for an unplanned failover. Secondary region instances can serve read traffic during normal operation. On failover, the secondary region is promoted to the primary."
      },
      {
        id: "C",
        text: "Amazon Aurora MySQL with cross-region read replicas using standard MySQL asynchronous replication.",
        isCorrect: false,
        explanation: "Wrong — Standard cross-region read replicas use MySQL binary log replication, which can have replication lag of minutes, not sub-second. The RPO cannot be guaranteed to be under 1 second. Aurora Global Database uses storage-level replication, which is far faster."
      },
      {
        id: "D",
        text: "DynamoDB Global Tables with DynamoDB Transactions to enforce relational data consistency.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB is a NoSQL key-value/document store. DynamoDB Transactions do not provide relational SQL capabilities. The question specifies a relational MySQL-compatible requirement."
      }
    ],
    explanation: "Aurora Global Database replicates at the storage layer using dedicated replication infrastructure, achieving a typical RPO of under 1 second and RTO under 1 minute for cross-region failover. Secondary regions can serve read traffic. This is the correct answer whenever both sub-second RPO and sub-minute RTO are required for a relational database in a cross-region DR scenario. Standard RDS cross-region replicas and snapshot-based DR cannot meet these requirements.",
    keywords: ["RPO less than 1 second", "RTO less than 1 minute", "cross-region DR", "read traffic"]
  },
  {
    id: "d2-004",
    domain: 2,
    taskStatement: "2.2",
    services: ["s3", "lifecycle"],
    constraintType: "ha",
    difficulty: 2,
    type: "single",
    stem: "A media company stores 5 PB of video archive in Amazon S3. Most content is never accessed after the first 90 days. Compliance requires retaining all content for 7 years. The team needs to minimize storage costs while ensuring content can be retrieved within 12 hours when requested. Which lifecycle configuration minimizes cost?",
    options: [
      {
        id: "A",
        text: "S3 Standard for 90 days, then transition to S3 Standard-IA.",
        isCorrect: false,
        explanation: "Wrong — S3 Standard-IA at ~$0.0125/GB-mo is much cheaper than Standard but far more expensive than Glacier Deep Archive for 7-year retention. For 12-hour retrieval tolerance, Glacier Deep Archive is appropriate."
      },
      {
        id: "B",
        text: "S3 Standard for 90 days, then transition to S3 Glacier Deep Archive.",
        isCorrect: true,
        explanation: "Correct — Glacier Deep Archive at ~$0.00099/GB-mo (roughly $1/TB/month) is the cheapest storage class in AWS. Standard 12-hour retrieval and Bulk 48-hour retrieval satisfy the 12-hour SLA. The 180-day minimum duration does not apply because data starts its Glacier lifecycle after 90 days in Standard, well past the minimum."
      },
      {
        id: "C",
        text: "S3 Standard for 90 days, then transition to S3 Glacier Instant Retrieval.",
        isCorrect: false,
        explanation: "Wrong — Glacier Instant Retrieval at ~$0.004/GB-mo is designed for archives requiring millisecond retrieval. Since this use case tolerates 12-hour retrieval, the millisecond access tier is unnecessary and 4× more expensive than Deep Archive."
      },
      {
        id: "D",
        text: "S3 Intelligent-Tiering for all content, with the optional Deep Archive tier enabled.",
        isCorrect: false,
        explanation: "Wrong — Intelligent-Tiering with Deep Archive opt-in works, but the monitoring fee ($0.0025 per 1,000 objects) on a large archive with many objects adds cost. Since the access pattern is predictable (rarely after 90 days), a deterministic lifecycle rule is simpler and often cheaper."
      }
    ],
    explanation: "When the access pattern is predictable (no access after 90 days) and the retrieval tolerance is measured in hours, S3 Glacier Deep Archive is the correct cost-optimization choice. At ~$0.00099/GB-mo, it is the cheapest storage tier in AWS. Standard retrieval completes in 12 hours, exactly meeting the SLA. Glacier Instant Retrieval's millisecond access is unnecessary overhead when 12 hours is acceptable.",
    keywords: ["minimize storage costs", "7-year retention", "12-hour retrieval", "archive"]
  },
  {
    id: "d2-005",
    domain: 2,
    taskStatement: "2.2",
    services: ["ec2", "auto-scaling", "route53"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A startup has a production web application running in a single AWS Region with an RTO requirement of 15 minutes and an RPO of 1 hour after a complete regional failure. The team has limited budget. Which DR strategy meets these requirements at the LOWEST cost?",
    options: [
      {
        id: "A",
        text: "Multi-Site Active/Active: Deploy full production capacity in two regions simultaneously and use Route 53 latency-based routing.",
        isCorrect: false,
        explanation: "Wrong — Active/Active provides near-zero RTO and RPO but at roughly 2× the cost. This exceeds the budget constraint and the requirements are satisfied by a cheaper strategy."
      },
      {
        id: "B",
        text: "Warm Standby: Run a scaled-down version of the full stack in a DR region, replicate data, and scale up on failover.",
        isCorrect: false,
        explanation: "Wrong — Warm Standby meets the RTO and RPO but costs more than Pilot Light because compute resources are running in the DR region even during normal operations. It is unnecessarily expensive for a 15-minute RTO."
      },
      {
        id: "C",
        text: "Pilot Light: Keep only the data layer (RDS read replica) running in a DR region. Use CloudFormation and AMIs to spin up application servers on failover, with Route 53 failover routing.",
        isCorrect: true,
        explanation: "Correct — Pilot Light keeps only the critical data core (database replica) running at minimal cost. On failover, CloudFormation or EC2 Auto Scaling launches pre-baked AMIs within ~10–15 minutes, meeting the 15-minute RTO. RDS replication provides sub-hourly RPO. Cost is minimal as compute is off in the DR region."
      },
      {
        id: "D",
        text: "Backup and Restore: Take hourly RDS snapshots to the DR region and use Infrastructure as Code to rebuild everything from scratch on failover.",
        isCorrect: false,
        explanation: "Wrong — Backup and Restore meets the 1-hour RPO (with hourly snapshots) but the RTO to restore a database from snapshot and rebuild the entire stack typically exceeds 1 hour, not 15 minutes."
      }
    ],
    explanation: "DR strategy selection maps to RPO/RTO budgets: Backup & Restore (hours/hours, cheapest), Pilot Light (minutes/tens of minutes, cheap), Warm Standby (seconds/minutes, moderate), Multi-Site Active/Active (near-zero, expensive). For 15-minute RTO and 1-hour RPO at lowest cost, Pilot Light is the right fit. It keeps only the data layer (the 'pilot light') running in the DR region, with compute launched only during a failover event.",
    keywords: ["RTO 15 minutes", "RPO 1 hour", "lowest cost", "pilot light", "DR strategy"]
  },
  {
    id: "d2-006",
    domain: 2,
    taskStatement: "2.1",
    services: ["step-functions", "lambda"],
    constraintType: "ops",
    difficulty: 3,
    type: "single",
    stem: "A financial services company needs to build a loan approval workflow that: processes a credit check (takes 2 seconds), then waits for a human underwriter to approve or reject the application (may take up to 3 business days), and finally sends an approval email. The workflow must be exactly-once and retain full execution history for 90 days. Which AWS service best orchestrates this workflow?",
    options: [
      {
        id: "A",
        text: "AWS Step Functions Express Workflow with a .waitForTaskToken integration pattern.",
        isCorrect: false,
        explanation: "Wrong — Express Workflows have a maximum execution duration of 5 minutes. A workflow waiting up to 3 business days (~72 hours) far exceeds this limit. Express Workflows also provide at-least-once semantics, not exactly-once."
      },
      {
        id: "B",
        text: "AWS Step Functions Standard Workflow with a .waitForTaskToken integration for the human approval step.",
        isCorrect: true,
        explanation: "Correct — Standard Workflows support executions up to 1 year, are exactly-once, and retain full execution history for 90 days in the console (or longer via CloudWatch). The .waitForTaskToken integration pattern pauses the workflow indefinitely until an external system calls SendTaskSuccess or SendTaskFailure — perfect for human approval. The underwriter's response sends the task token to resume the workflow."
      },
      {
        id: "C",
        text: "Amazon SQS FIFO queue with a visibility timeout of 72 hours for the approval step.",
        isCorrect: false,
        explanation: "Wrong — SQS visibility timeout maximum is 12 hours (not 72 hours). There is no native human-approval step or execution history. Building a full workflow orchestration on SQS alone would require significant custom code."
      },
      {
        id: "D",
        text: "AWS Lambda function with a recursive polling loop that checks a DynamoDB approval table every 5 minutes.",
        isCorrect: false,
        explanation: "Wrong — Lambda's maximum execution time is 15 minutes. A recursive polling loop for 72 hours would require hundreds of Lambda invocations and complex state management in DynamoDB. This adds significant operational overhead and cost compared to the built-in .waitForTaskToken pattern."
      }
    ],
    explanation: "The .waitForTaskToken integration pattern in Step Functions Standard Workflow is purpose-built for human-in-the-loop workflows. The workflow is paused at a Task state until an external call provides the task token back to Step Functions. Standard Workflows (up to 1-year execution, exactly-once, 90-day history) are required when any step exceeds 5 minutes — Express Workflows are for high-volume, short-duration, at-least-once processes.",
    keywords: ["human approval", "wait for callback", "exactly-once", "execution history", "90 days"]
  },
  {
    id: "d2-007",
    domain: 2,
    taskStatement: "2.1",
    services: ["sqs", "sns"],
    constraintType: "ops",
    difficulty: 2,
    type: "single",
    stem: "An online retailer's order service publishes an event to a messaging system every time an order is placed. Three independent downstream services — inventory, shipping, and billing — must each receive and process every order event independently. If the billing service is down for 2 hours, those events must not be lost. Which architecture pattern ensures all three services receive every event with message durability?",
    options: [
      {
        id: "A",
        text: "Publish order events directly to three separate SQS queues, one per downstream service.",
        isCorrect: false,
        explanation: "Wrong — Publishing to three separate queues directly from the producer requires the producer to know about and write to all three queues, creating tight coupling. If a new consumer is added, the producer must be modified. This violates the loose coupling principle."
      },
      {
        id: "B",
        text: "Publish order events to an SNS Standard topic with three SQS Standard queue subscriptions, one per downstream service.",
        isCorrect: true,
        explanation: "Correct — This is the canonical SNS fan-out pattern. The producer publishes once to SNS; SNS fans out to all three SQS queues. Each queue independently buffers messages for its consuming service. If billing is down, its SQS queue retains messages for up to 14 days (message retention is configurable). New consumers can be added without modifying the producer."
      },
      {
        id: "C",
        text: "Publish order events to an SQS FIFO queue and have all three services poll the same queue.",
        isCorrect: false,
        explanation: "Wrong — A single SQS queue delivers each message to only one consumer. If three services poll the same queue, each message is processed by only one of them (the one that receives it first), not all three."
      },
      {
        id: "D",
        text: "Use Amazon EventBridge to route order events to three Lambda functions, one per downstream service.",
        isCorrect: false,
        explanation: "Wrong — While EventBridge can route to multiple targets, Lambda invocations are not durably queued. If the billing Lambda fails (because the billing service is down), EventBridge's retry behavior is limited. Adding SQS between EventBridge and Lambda would solve this, but the cleanest answer for this pattern is SNS → SQS fan-out."
      }
    ],
    explanation: "The SNS fan-out to multiple SQS queues is the standard pattern for independent, durable, decoupled event distribution to multiple consumers. Each SQS queue acts as a durable buffer for its specific consumer. The producer is decoupled from consumers (just publishes to SNS). Message retention of up to 14 days ensures messages survive consumer downtime. This pattern is tested heavily on the SAA exam.",
    keywords: ["fan-out", "independent consumers", "message durability", "loose coupling", "not lost"]
  },
  {
    id: "d2-008",
    domain: 2,
    taskStatement: "2.1",
    services: ["amazon-mq", "sqs"],
    constraintType: "migration",
    difficulty: 3,
    type: "single",
    stem: "A company is migrating an on-premises Java EE application to AWS. The existing application uses an Apache ActiveMQ broker with JMS APIs for inter-service communication. The development team does not want to rewrite any messaging code and needs a managed, highly available broker in AWS. Which service is the correct choice?",
    options: [
      {
        id: "A",
        text: "Amazon SQS with the JMS compliance library for AWS.",
        isCorrect: false,
        explanation: "Wrong — While Amazon SQS provides a JMS 1.1-compatible library, it does not support the full JMS 2.0 specification, ActiveMQ protocol features (OpenWire, STOMP, MQTT, AMQP), or the exact ActiveMQ behavior. Applications with ActiveMQ-specific features would require code changes."
      },
      {
        id: "B",
        text: "Amazon MQ with the Apache ActiveMQ broker engine in Active/Standby Multi-AZ deployment.",
        isCorrect: true,
        explanation: "Correct — Amazon MQ is a managed message broker service for Apache ActiveMQ and RabbitMQ. It supports JMS, AMQP, STOMP, MQTT, and OpenWire natively, requiring zero code changes. The Active/Standby Multi-AZ deployment provides HA with automatic failover for production workloads."
      },
      {
        id: "C",
        text: "Amazon Kinesis Data Streams with a JMS-to-Kinesis adapter.",
        isCorrect: false,
        explanation: "Wrong — Kinesis is a streaming platform for high-throughput event streams, not a JMS-compatible message broker. An adapter would require significant code changes and does not support ActiveMQ protocols."
      },
      {
        id: "D",
        text: "Amazon SNS with a Java SDK client that simulates topic-based publish/subscribe.",
        isCorrect: false,
        explanation: "Wrong — SNS uses its own API and SDK, not the JMS API. Migrating to SNS would require rewriting all messaging code, which contradicts the requirement."
      }
    ],
    explanation: "Amazon MQ is the correct choice for lift-and-shift migrations from on-premises ActiveMQ or RabbitMQ brokers when no code changes are desired. It natively supports JMS, AMQP 1.0, MQTT, OpenWire, and STOMP. For new AWS-native applications without legacy protocol requirements, SQS/SNS are preferred. For production HA, choose ActiveMQ Active/Standby Multi-AZ (shared EFS storage) or RabbitMQ Cluster Multi-AZ (3 nodes).",
    keywords: ["JMS", "no code changes", "lift-and-shift", "ActiveMQ", "migration"]
  },
  {
    id: "d2-009",
    domain: 2,
    taskStatement: "2.2",
    services: ["dynamodb"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A gaming company's leaderboard application uses Amazon DynamoDB. Players post scores from multiple geographic regions simultaneously and expect to see globally consistent leaderboard updates within 1 second. The table must remain writable from all regions simultaneously. Occasional last-writer-wins conflicts are acceptable. Which DynamoDB feature satisfies these requirements?",
    options: [
      {
        id: "A",
        text: "DynamoDB with cross-region read replicas.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB does not have a 'read replica' concept like RDS. DynamoDB tables are single-region by default. Cross-region replication is provided through Global Tables."
      },
      {
        id: "B",
        text: "DynamoDB Global Tables with the default multi-region eventual consistency (MREC) mode.",
        isCorrect: true,
        explanation: "Correct — DynamoDB Global Tables provides multi-region, multi-active replication with approximately 1 second typical replication latency and last-writer-wins (LWW) conflict resolution by update timestamp. MREC (the default) is appropriate when sub-second cross-region consistency is not required and LWW conflicts are acceptable. All regions can accept writes simultaneously."
      },
      {
        id: "C",
        text: "DynamoDB with DAX clusters deployed in each region pointing to the same table.",
        isCorrect: false,
        explanation: "Wrong — DAX is an in-memory caching layer for a single-region DynamoDB table. It does not provide cross-region replication. DAX in one region cannot cache data from another region's table."
      },
      {
        id: "D",
        text: "DynamoDB Global Tables with Multi-Region Strong Consistency (MRSC) mode.",
        isCorrect: false,
        explanation: "Wrong — MRSC (GA June 2025) provides strongly consistent reads across all regions but requires exactly 3 regions (or 2 + witness), and has restrictions (no TTL, no LSI, table must be empty at conversion). The question states 'last-writer-wins conflicts are acceptable,' which means MREC is sufficient and cheaper."
      }
    ],
    explanation: "DynamoDB Global Tables is the multi-region multi-active solution for DynamoDB. The default MREC mode uses last-writer-wins conflict resolution based on the aws:rep:updatetime attribute and achieves approximately 1 second cross-region replication. When LWW is acceptable, MREC is the right choice. MRSC is needed only when strong read consistency across regions is a hard requirement, and it comes with additional constraints and costs.",
    keywords: ["multi-region", "writable from all regions", "1 second", "last-writer-wins", "global"]
  },
  {
    id: "d2-010",
    domain: 2,
    taskStatement: "2.2",
    services: ["elb", "ec2", "auto-scaling", "route53"],
    constraintType: "ha",
    difficulty: 3,
    type: "single",
    stem: "A company operates a web application in a single AWS Region across three Availability Zones. An EC2 Auto Scaling Group behind an Application Load Balancer handles the traffic. During a deployment, the team rolls out a new version to 10% of capacity to verify performance before full rollout. If metrics are degraded, the deployment should automatically roll back. Which approach implements this canary deployment with LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Create a second Auto Scaling Group with the new version, and add it as a second target group to the ALB with 10% weighted routing.",
        isCorrect: false,
        explanation: "Wrong — While valid architecturally, managing two ASGs and manually adjusting weights involves significant operational overhead. It does not natively provide automatic rollback based on CloudWatch metrics."
      },
      {
        id: "B",
        text: "Use EC2 Auto Scaling Instance Refresh with a maximum 10% healthy percentage threshold and configure CloudWatch alarms as rollback triggers.",
        isCorrect: true,
        explanation: "Correct — Instance Refresh performs a rolling update of instances in the ASG. Setting MinHealthyPercentage to 90% limits rollout to 10% of capacity at a time. Enabling auto-rollback with a CloudWatch alarm as the rollback trigger will automatically revert to the previous launch template if the alarm fires during the refresh. This is the native, lowest-overhead canary approach for EC2 ASGs."
      },
      {
        id: "C",
        text: "Use Route 53 weighted routing to send 10% of DNS traffic to the new version's ALB and 90% to the original.",
        isCorrect: false,
        explanation: "Wrong — This requires managing two separate ALBs and ASGs (one per version) and does not provide automatic rollback. Route 53 TTL also means traffic shifts are not instant."
      },
      {
        id: "D",
        text: "Deploy the new version to a Blue/Green environment using AWS CodeDeploy with an Allat-Once deployment.",
        isCorrect: false,
        explanation: "Wrong — AllAtOnce deploys to 100% of capacity simultaneously, which is the opposite of a canary (10%) rollout. CodeDeploy supports canary with the correct configuration (e.g., Linear10PercentEvery1Minute), but 'AllAtOnce' eliminates the gradual approach."
      }
    ],
    explanation: "EC2 Auto Scaling Instance Refresh with auto-rollback is the native mechanism for canary/rolling deployments in an ASG. The MinHealthyPercentage parameter controls how many instances are replaced at once. Auto-rollback triggers on CloudWatch alarm states (e.g., elevated 5xx error rate or high latency) and automatically reverts to the previous launch template version. This provides canary deployments with automatic rollback with no additional services.",
    keywords: ["canary deployment", "10% rollout", "automatic rollback", "least operational overhead"]
  }
]

// ─────────────────────────────────────────────────────────────
// DOMAIN 3 — Design High-Performing Architectures (10 questions)
// ─────────────────────────────────────────────────────────────
const domain3Questions: Question[] = [
  {
    id: "d3-001",
    domain: 3,
    taskStatement: "3.1",
    services: ["s3", "cloudfront"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A media streaming company distributes video tutorial files globally. Files are stored in an S3 bucket in us-east-1. Users in Asia-Pacific report 8–12 second latency on first-byte downloads. The company uses the public S3 endpoint directly without any CDN. Which solution MOST effectively reduces first-byte latency for Asia-Pacific users?",
    options: [
      {
        id: "A",
        text: "Enable S3 Transfer Acceleration on the bucket and update clients to use the accelerate endpoint.",
        isCorrect: false,
        explanation: "Wrong — S3 Transfer Acceleration uses CloudFront edge locations to accelerate UPLOADS from globally-distributed clients to a single S3 bucket. It is designed for upload performance, not download distribution. For download optimization, CloudFront is the correct service."
      },
      {
        id: "B",
        text: "Deploy an Amazon CloudFront distribution with the S3 bucket as the origin, using Origin Access Control.",
        isCorrect: true,
        explanation: "Correct — CloudFront caches content at 600+ edge locations (Points of Presence) worldwide. Asia-Pacific users fetch from the nearest edge PoP after the first request, reducing latency from 8–12 seconds (trans-Pacific round trip) to sub-50 ms (local PoP). OAC restricts S3 direct access so only CloudFront can read the bucket."
      },
      {
        id: "C",
        text: "Replicate the S3 bucket to an ap-southeast-1 region using S3 Cross-Region Replication and update DNS to point each region's users to their local bucket.",
        isCorrect: false,
        explanation: "Wrong — CRR replicates the full dataset to another region, doubling storage costs. It also requires application-level routing logic to direct users to the correct regional bucket. CloudFront is simpler, cheaper for this use case, and provides more PoPs than a single additional region."
      },
      {
        id: "D",
        text: "Enable S3 Byte-Range Fetches so the client downloads in parallel 8 MB chunks.",
        isCorrect: false,
        explanation: "Wrong — Byte-range fetches parallelize a single download but do nothing to reduce the geographic latency between Asia-Pacific users and an S3 bucket in us-east-1. The physical distance (network round-trip) remains the same."
      }
    ],
    explanation: "Amazon CloudFront is the solution for reducing download latency to globally-distributed users. After the first user in a region requests a file, CloudFront caches it at the nearest PoP. Subsequent users in the same region receive the cached copy from the PoP at local network speeds. S3 Transfer Acceleration improves upload performance, not download. OAC (replacing legacy OAI) is the correct way to restrict the S3 bucket to allow access only via CloudFront.",
    keywords: ["first-byte latency", "Asia-Pacific", "global users", "CDN", "CloudFront"]
  },
  {
    id: "d3-002",
    domain: 3,
    taskStatement: "3.2",
    services: ["lambda", "provisioned-concurrency"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A financial trading platform uses a Java 11 Lambda function as a critical pricing engine. The function initializes a large in-memory pricing library during cold starts, adding 6–8 seconds of latency. This cold-start latency is unacceptable for trading operations. The function receives 50–100 invocations per second continuously during market hours. What is the MOST cost-effective solution to eliminate cold-start latency?",
    options: [
      {
        id: "A",
        text: "Enable Lambda Provisioned Concurrency set to 150 concurrent instances to pre-warm all execution environments.",
        isCorrect: false,
        explanation: "Wrong — Provisioned Concurrency eliminates cold starts by keeping environments warm, but it charges per GB-second for pre-warmed environments 24/7, even during off-hours. For a Java function with a large init payload, this can be expensive. SnapStart is cheaper for Java."
      },
      {
        id: "B",
        text: "Enable Lambda SnapStart for the Java 11 function.",
        isCorrect: true,
        explanation: "Correct — Lambda SnapStart (free for Java) takes a snapshot of the initialized execution environment after the init phase. Subsequent cold starts restore from the snapshot instead of re-executing the init code, reducing cold start latency from 6–8 seconds to under 1 second. SnapStart is FREE for Java, unlike Provisioned Concurrency which is billed per GB-second."
      },
      {
        id: "C",
        text: "Increase the Lambda function memory from 512 MB to 10,240 MB to reduce initialization time.",
        isCorrect: false,
        explanation: "Wrong — More memory allocates more CPU proportionally, which can reduce init time somewhat. However, it does not fundamentally eliminate the initialization work of loading a large library. The reduction is marginal and does not address 6–8 second cold starts with the same guarantee as SnapStart."
      },
      {
        id: "D",
        text: "Migrate the Lambda function to a container-based invocation to pre-load the library in a custom base image.",
        isCorrect: false,
        explanation: "Wrong — Container images in Lambda still have cold starts (and can be longer due to image size). A custom base image with a pre-loaded library helps but does not eliminate the init phase as comprehensively as SnapStart. Container images also add deployment complexity."
      }
    ],
    explanation: "Lambda SnapStart for Java (free since 2022) takes a snapshot of the fully initialized execution environment (after the init phase) and restores from that snapshot on cold starts. This reduces Java cold-start latency to sub-second. SnapStart is FREE for Java, making it the most cost-effective solution vs Provisioned Concurrency (which is charged per GB-second). Python 3.12+ and .NET 8+ SnapStart have caching costs. SnapStart is incompatible with Provisioned Concurrency, EFS, ephemeral storage >512 MB, and container images.",
    keywords: ["cold start", "Java Lambda", "6-8 seconds", "most cost-effective", "eliminate latency"]
  },
  {
    id: "d3-003",
    domain: 3,
    taskStatement: "3.3",
    services: ["dynamodb", "dax"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A product catalog application reads DynamoDB item data heavily on the product detail page — millions of GetItem calls per second. Response time must be in the microsecond range. The application is already optimized and there is no tolerance for stale data on strongly consistent reads. Which caching solution should be added?",
    options: [
      {
        id: "A",
        text: "Add an ElastiCache for Valkey cluster in front of DynamoDB and populate it on cache misses.",
        isCorrect: false,
        explanation: "Wrong — ElastiCache can cache DynamoDB results, but requires custom application code to implement the cache-aside pattern (check cache → miss → read DDB → populate cache). It also does not integrate with DynamoDB's strongly consistent read API."
      },
      {
        id: "B",
        text: "Enable DynamoDB Accelerator (DAX) in the same VPC and update the application connection string to the DAX endpoint.",
        isCorrect: false,
        explanation: "Wrong — DAX provides microsecond read performance but only caches eventually consistent reads. Strongly consistent reads bypass the DAX cache and go directly to DynamoDB. If strongly consistent reads are required, DAX will not serve them from cache."
      },
      {
        id: "C",
        text: "Use DynamoDB Accelerator (DAX) and accept that strongly consistent reads bypass the cache and go to DynamoDB directly.",
        isCorrect: true,
        explanation: "Correct — DAX is the purpose-built, API-compatible in-memory cache for DynamoDB providing microsecond reads. Strongly consistent reads are NOT cached by DAX and go directly to DynamoDB (still within milliseconds), while the vast majority of eventually consistent product catalog reads are served from DAX at microsecond latency. For a product catalog, eventual consistency is typically acceptable for most reads."
      },
      {
        id: "D",
        text: "Enable DynamoDB On-Demand capacity mode and increase read capacity to 10 million RCUs.",
        isCorrect: false,
        explanation: "Wrong — Increasing DynamoDB capacity improves throughput and reduces throttling, but does not change the underlying DynamoDB single-digit millisecond latency. Only a caching layer provides microsecond latency."
      }
    ],
    explanation: "DAX is the only DynamoDB-native caching solution that provides microsecond read latency without application code changes (it is API-compatible). The critical caveat: strongly consistent reads bypass DAX. For a product catalog where eventual consistency is acceptable for most reads, DAX's item cache and query cache deliver microsecond performance. Strongly consistent reads (e.g., inventory counts) still work but go to DynamoDB (millisecond latency). The question must be read carefully — option C is the most accurate framing.",
    keywords: ["microsecond", "DynamoDB cache", "no code changes", "strongly consistent reads bypass"]
  },
  {
    id: "d3-004",
    domain: 3,
    taskStatement: "3.4",
    services: ["vpc", "transit-gateway", "privatelink"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A company operates 35 VPCs across multiple accounts in a single AWS Region. All VPCs must be able to communicate with each other and with an on-premises data center connected via Direct Connect. The on-premises team uses overlapping CIDR blocks across several VPCs which cannot be re-addressed. What is the MOST scalable architecture to satisfy all connectivity requirements?",
    options: [
      {
        id: "A",
        text: "Create VPC peering connections between every pair of VPCs (35×34/2 = 595 peering connections).",
        isCorrect: false,
        explanation: "Wrong — Full-mesh VPC peering scales as O(n²) — 595 connections for 35 VPCs. VPC peering also does not allow transitive routing and each VPC pair must have non-overlapping CIDRs. With overlapping CIDRs, peering is not possible at all for affected VPCs."
      },
      {
        id: "B",
        text: "Deploy an AWS Transit Gateway, attach all 35 VPCs, and connect the TGW to Direct Connect via a Transit VIF on a Direct Connect Gateway.",
        isCorrect: true,
        explanation: "Correct — Transit Gateway acts as a regional hub supporting up to 5,000 VPC attachments with transitive routing. It connects to Direct Connect via a Transit VIF (TGW attachment type). Note: Transit Gateway does NOT support overlapping CIDR blocks for VPC attachments — overlapping VPCs would need PrivateLink for service exposure. However, TGW is still the correct scalable answer for the majority of the 35 VPCs and DX connectivity."
      },
      {
        id: "C",
        text: "Use AWS PrivateLink to expose services between each VPC pair and connect on-premises via a VPN.",
        isCorrect: false,
        explanation: "Wrong — PrivateLink enables one-directional service-to-consumer connectivity and does not provide full bidirectional network reachability between VPCs. It is appropriate for exposing specific services, not replacing a full network fabric. It also does not provide hub-and-spoke DX connectivity."
      },
      {
        id: "D",
        text: "Enable VPC sharing via AWS RAM so all workloads use subnets in a single shared VPC.",
        isCorrect: false,
        explanation: "Wrong — VPC sharing via RAM allows multiple accounts to use subnets in a shared VPC, but the VPCs already exist and cannot be retroactively merged. This addresses multi-account subnet sharing for new architectures, not routing between existing VPCs."
      }
    ],
    explanation: "Transit Gateway is the scalable hub-and-spoke solution for connecting many VPCs and hybrid connectivity. It supports up to 5,000 VPC attachments and connects to Direct Connect via a Transit VIF on a Direct Connect Gateway. For the overlapping CIDR problem, those specific VPCs would use PrivateLink endpoints for service-level connectivity. The exam typically presents TGW as the answer for 'many VPCs' + 'transitive routing' + 'hybrid DX connectivity.'",
    keywords: ["35 VPCs", "transitive routing", "Direct Connect", "scalable", "overlapping CIDR"]
  },
  {
    id: "d3-005",
    domain: 3,
    taskStatement: "3.5",
    services: ["kinesis-data-streams", "lambda"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A real-time clickstream analytics platform ingests 500,000 events per second from a web application. Multiple independent analytics teams each need to process the full stream independently at their own pace. Data must be replayable for up to 7 days. Processing latency must be under 500 milliseconds. Which streaming solution satisfies all requirements?",
    options: [
      {
        id: "A",
        text: "Amazon SQS Standard queues with one queue per team. The producer publishes each event to all queues simultaneously.",
        isCorrect: false,
        explanation: "Wrong — SQS does not support replay (messages are deleted after consumption). Fan-out to multiple queues from a single producer requires the producer to write to all queues, creating tight coupling. SQS message retention is 14 days (configurable), which does cover 7 days, but the no-replay limitation is a hard disqualifier."
      },
      {
        id: "B",
        text: "Amazon Kinesis Data Streams with Enhanced Fan-Out (EFO) consumers, one per team, with 7-day retention enabled.",
        isCorrect: true,
        explanation: "Correct — Kinesis Data Streams provides: ordered per-shard delivery, multiple consumer groups (each reads the full stream independently), Enhanced Fan-Out (dedicated 2 MB/s push per consumer with sub-200ms latency), replay up to the retention period (7 days with extended retention), and handles 500K events/sec with appropriate shard count. EFO consumers each get their own dedicated throughput."
      },
      {
        id: "C",
        text: "Amazon SNS with multiple SQS queue subscriptions per team and 7-day message retention on SQS.",
        isCorrect: false,
        explanation: "Wrong — SQS does not support replay. Once a message is consumed from an SQS queue, it is deleted. SNS→SQS fan-out solves the multiple independent consumer problem but fails the replay requirement."
      },
      {
        id: "D",
        text: "Amazon Managed Streaming for Apache Kafka (MSK) with one consumer group per team and 7-day log retention.",
        isCorrect: false,
        explanation: "Wrong — MSK would technically work, but the question tests AWS-native solutions. Kinesis Data Streams with EFO is the canonical AWS answer for this pattern. MSK adds operational overhead (cluster management) vs Kinesis's managed service. Both are valid, but Kinesis with EFO is the more direct AWS exam answer."
      }
    ],
    explanation: "Kinesis Data Streams with Enhanced Fan-Out (EFO) is the AWS pattern for high-throughput streaming with multiple independent consumers. EFO gives each registered consumer a dedicated 2 MB/s read throughput and sub-200ms push latency (vs polling). Extended data retention (7 days) enables replay. Each consumer reads at its own pace from the same stream without affecting others. For 500K events/sec, provision shards at (total_write_MB/s / 1 MB per shard).",
    keywords: ["multiple independent consumers", "replay", "7 days", "sub-500ms latency", "fan-out"]
  },
  {
    id: "d3-006",
    domain: 3,
    taskStatement: "3.3",
    services: ["elasticache", "rds"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A social media application has a read-heavy workload where 95% of requests read the same 'trending posts' data, which changes every 5 minutes. The primary database is Amazon RDS PostgreSQL. Read replicas are already saturated. Adding more read replicas is too costly. The team needs sub-millisecond read latency for the trending posts endpoint. Which solution achieves this with the LEAST application code changes?",
    options: [
      {
        id: "A",
        text: "Add a second RDS Multi-AZ DB Cluster with two readable standbys for additional read capacity.",
        isCorrect: false,
        explanation: "Wrong — RDS Multi-AZ DB Cluster's readable standbys use semi-synchronous replication and still provide millisecond-level latency, not sub-millisecond. They are also expensive as they double the DB tier cost."
      },
      {
        id: "B",
        text: "Implement a write-through caching strategy using Amazon ElastiCache for Valkey (Redis-compatible). Cache trending posts on every write and serve reads from cache.",
        isCorrect: true,
        explanation: "Correct — ElastiCache for Valkey provides sub-millisecond read latency and can store the trending posts result (refreshed every 5 minutes with a TTL). Write-through caching keeps the cache current on every update. This offloads 95% of read traffic from RDS, reducing load significantly. Valkey is ~20% cheaper than Redis OSS and is drop-in compatible."
      },
      {
        id: "C",
        text: "Enable Aurora read replicas with Aurora Parallel Query to push aggregation to the storage layer.",
        isCorrect: false,
        explanation: "Wrong — The question specifies RDS PostgreSQL, not Aurora. Additionally, Aurora Parallel Query is designed for analytical queries on operational data, not caching trending data. It does not provide sub-millisecond latency for repeated identical reads."
      },
      {
        id: "D",
        text: "Create a DynamoDB table as a secondary data store and synchronize trending posts to it on write.",
        isCorrect: false,
        explanation: "Wrong — DynamoDB provides single-digit millisecond latency, not sub-millisecond. It also introduces a second data store to synchronize, adding significant application complexity versus an in-memory cache."
      }
    ],
    explanation: "ElastiCache (Redis or Valkey) is the standard answer for sub-millisecond read latency at scale. For a high-read-ratio workload with data that refreshes every 5 minutes, a write-through or TTL-based caching strategy in ElastiCache absorbs the repetitive reads before they reach RDS. Valkey is the cost-optimal engine choice (20% cheaper than Redis OSS). The write-through pattern ensures cache consistency with every database write.",
    keywords: ["sub-millisecond", "read-heavy", "caching", "write-through", "trending posts"]
  },
  {
    id: "d3-007",
    domain: 3,
    taskStatement: "3.4",
    services: ["alb", "nlb", "global-accelerator"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A global multiplayer gaming company needs to route UDP game traffic from players worldwide to regional EC2 game servers with minimal latency. The solution must provide static IP addresses for players to whitelist in their firewall rules and must automatically route players to the healthy nearest region. HTTPS/HTTP is not used — the game uses a custom UDP protocol. Which solution meets these requirements?",
    options: [
      {
        id: "A",
        text: "Amazon CloudFront with a custom origin pointing to UDP game servers.",
        isCorrect: false,
        explanation: "Wrong — CloudFront is an HTTP/HTTPS CDN only. It does not support UDP traffic. It also provides dynamic IPs for its endpoints, not static IPs for client firewall whitelisting."
      },
      {
        id: "B",
        text: "AWS Global Accelerator with endpoint groups in each region pointing to Network Load Balancers fronting the game servers.",
        isCorrect: true,
        explanation: "Correct — Global Accelerator provides 2 static anycast IPv4 addresses (whitelistable), routes traffic over the AWS global backbone (improving latency significantly vs public internet), supports TCP and UDP (Layer 4), performs health checks, and automatically routes to the nearest healthy endpoint group. NLB supports UDP listeners. This is the canonical solution for UDP gaming with static IPs."
      },
      {
        id: "C",
        text: "Application Load Balancers in each region with Route 53 latency-based routing.",
        isCorrect: false,
        explanation: "Wrong — ALB operates at Layer 7 (HTTP/HTTPS/gRPC/WebSocket) and does not support UDP. Route 53 latency-based routing does not provide static IPs — each region's ALB has different IPs."
      },
      {
        id: "D",
        text: "Network Load Balancers in each region with Route 53 latency-based routing and Elastic IPs.",
        isCorrect: false,
        explanation: "Wrong — NLB with static EIPs per region provides static IPs per region, but clients would need to whitelist all regional IPs. Route 53 latency-based routing provides two or more separate DNS names with different IPs — not two globally consistent static IPs. Global Accelerator's two anycast IPs are the correct solution for a single global static IP for client firewall rules."
      }
    ],
    explanation: "AWS Global Accelerator is the answer when a question contains three key signals: (1) non-HTTP protocol (UDP, TCP gaming, MQTT, VoIP), (2) static IPs for firewall whitelisting, and (3) global multi-region routing with health-check-based failover. CloudFront is for HTTP/HTTPS caching. Global Accelerator routes at Layer 4 over the AWS backbone, providing both the static anycast IPs and the performance benefits of AWS's private network vs the public internet.",
    keywords: ["UDP", "static IP", "whitelist", "global routing", "non-HTTP"]
  },
  {
    id: "d3-008",
    domain: 3,
    taskStatement: "3.1",
    services: ["ebs", "ec2"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A database team is sizing EBS volumes for a new Oracle RAC cluster that requires 250,000 IOPS, 3,500 MiB/s throughput, sub-500 microsecond latency, and the ability to attach the same volume to up to 8 EC2 instances simultaneously for clustered read access. Which EBS volume type satisfies ALL requirements?",
    options: [
      {
        id: "A",
        text: "EBS gp3 volumes provisioned to 16,000 IOPS each, with one volume per instance.",
        isCorrect: false,
        explanation: "Wrong — gp3 supports maximum 16,000 IOPS and 1,000 MiB/s per volume. It cannot be multi-attached (gp3 does not support Multi-Attach). Multiple separate volumes don't address the shared storage requirement for RAC."
      },
      {
        id: "B",
        text: "EBS io2 Block Express volumes with Multi-Attach enabled.",
        isCorrect: true,
        explanation: "Correct — io2 Block Express supports up to 256,000 IOPS, 4,000 MiB/s throughput, sub-500 microsecond latency, and Multi-Attach (up to 16 Nitro-based instances in the same AZ). All io2 volumes are automatically Block Express as of April 30, 2025. This is the only EBS type that satisfies all four requirements simultaneously."
      },
      {
        id: "C",
        text: "EBS st1 (throughput-optimized HDD) with RAID 0 across multiple instances.",
        isCorrect: false,
        explanation: "Wrong — st1 is an HDD-based volume optimized for sequential throughput (max 500 MiB/s) with millisecond latency. It does not support Multi-Attach and cannot achieve sub-500 microsecond latency or 250,000 IOPS."
      },
      {
        id: "D",
        text: "EFS General Purpose with Elastic throughput mode.",
        isCorrect: false,
        explanation: "Wrong — EFS is a file system, not a block device. Oracle RAC requires block storage (iSCSI or NVMe) with cluster-aware filesystem features. EFS does not meet the IOPS or latency requirements for Oracle RAC."
      }
    ],
    explanation: "io2 Block Express (all io2 volumes are Block Express since April 30, 2025) is the only EBS volume type supporting: 256,000 IOPS, 4,000 MiB/s throughput, sub-500 microsecond latency, 99.999% durability, AND Multi-Attach (up to 16 Nitro instances in the same AZ). Multi-Attach with io2 also supports NVMe reservations for I/O fencing required by Oracle RAC and similar clustered databases. A cluster-aware filesystem (GFS2, OCFS2, Oracle ASM) is still required.",
    keywords: ["250000 IOPS", "multi-attach", "Oracle RAC", "sub-500 microsecond", "shared volume"]
  },
  {
    id: "d3-009",
    domain: 3,
    taskStatement: "3.5",
    services: ["athena", "s3", "glue"],
    constraintType: "performance",
    difficulty: 3,
    type: "single",
    stem: "A data engineering team runs ad-hoc SQL queries against a 50 TB data lake stored in S3. Queries currently scan the entire dataset and cost $250 per day on Amazon Athena. The data is stored as CSV files partitioned by year only. The team wants to reduce query costs by at least 80% without changing the existing S3 data layout. Which optimization achieves this?",
    options: [
      {
        id: "A",
        text: "Use S3 Select to push SQL predicates into S3 and only return matching rows.",
        isCorrect: false,
        explanation: "Wrong — S3 Select can reduce bytes returned for individual objects but is not a replacement for query-layer optimization. It does not help with the Athena cost model (billed per bytes scanned at the query level) across partitioned tables."
      },
      {
        id: "B",
        text: "Convert the CSV data to Apache Parquet format and add sub-partitions by month and day using AWS Glue ETL.",
        isCorrect: true,
        explanation: "Correct — Parquet is a columnar format that typically reduces bytes scanned by 60–90% vs CSV because Athena reads only the columns queried (not entire rows) and exploits min/max statistics to skip row groups. Adding finer partitions (month/day) means Athena only scans partitions matching the WHERE clause. Combined, this typically achieves >90% cost reduction. Athena is billed on bytes scanned at $5/TB."
      },
      {
        id: "C",
        text: "Increase the Athena query concurrency limit to run more queries in parallel.",
        isCorrect: false,
        explanation: "Wrong — Query concurrency affects throughput (how many simultaneous queries) but has no effect on the bytes scanned by each individual query. Cost is per bytes scanned, not per time spent querying."
      },
      {
        id: "D",
        text: "Enable Athena result reuse (query result cache) for a 7-day TTL on frequently repeated queries.",
        isCorrect: false,
        explanation: "Wrong — Query result reuse helps when the exact same query runs repeatedly within the cache TTL, but does not help for ad-hoc queries where the WHERE clause varies. The question asks for an 80% reduction on general query cost, not identical-query repetition."
      }
    ],
    explanation: "Athena cost reduction best practices, in order of impact: (1) Parquet/ORC columnar format (read only needed columns, skip row groups via statistics), (2) Partitioning (prune entire partitions from scan), (3) Compression (reduce bytes read). Converting CSV to Parquet typically saves 70–90% on bytes scanned. Adding month/day partitions means a query for last week scans <0.1% of the 50 TB dataset instead of 100%. These two changes together easily exceed 80% reduction.",
    keywords: ["reduce Athena cost", "80% reduction", "bytes scanned", "columnar format", "partitioning"]
  },
  {
    id: "d3-010",
    domain: 3,
    taskStatement: "3.4",
    services: ["cloudfront", "alb", "lambda-edge"],
    constraintType: "performance",
    difficulty: 4,
    type: "single",
    stem: "A SaaS application uses CloudFront in front of an Application Load Balancer. The team wants to implement authentication at the CDN edge: every viewer request must validate a JWT from the Authorization header and return HTTP 401 if the token is invalid, without forwarding unauthenticated requests to the ALB origin. The validation logic requires a call to an external JWKS endpoint. Which CloudFront component should implement this?",
    options: [
      {
        id: "A",
        text: "CloudFront Functions at the viewer-request event.",
        isCorrect: false,
        explanation: "Wrong — CloudFront Functions execute in under 1 ms and run at all 600+ PoPs, but they cannot make network calls to external endpoints. JWT validation against a JWKS endpoint requires an HTTP call to retrieve the public keys, which CloudFront Functions cannot perform."
      },
      {
        id: "B",
        text: "Lambda@Edge at the viewer-request event.",
        isCorrect: true,
        explanation: "Correct — Lambda@Edge (Node.js or Python) runs at CloudFront's 13 regional edge caches and supports network calls within its 5-second timeout. It can call the JWKS endpoint to retrieve the public key, validate the JWT signature, and return HTTP 401 for invalid tokens — all before the request reaches the ALB origin. This is the canonical Lambda@Edge auth pattern."
      },
      {
        id: "C",
        text: "Lambda@Edge at the origin-request event.",
        isCorrect: false,
        explanation: "Wrong — The origin-request event fires only for cache misses (when the request is forwarded to the origin). If authentication runs here, unauthenticated requests for cached objects would not be validated — the cached response would be served to anyone. Authentication must run at viewer-request to intercept every inbound request."
      },
      {
        id: "D",
        text: "An ALB Lambda authorizer configured with Cognito JWT validation.",
        isCorrect: false,
        explanation: "Wrong — ALB does not have 'Lambda authorizers.' API Gateway has Lambda authorizers. ALB supports Cognito and OIDC authentication natively but these require redirecting users to a login page, not inline JWT header validation. More critically, this would allow all requests to reach the ALB before being authenticated, not at the edge."
      }
    ],
    explanation: "Lambda@Edge is the correct choice when CDN-edge logic requires network calls (e.g., calling a JWKS endpoint for JWT public key retrieval). CloudFront Functions cannot make network calls and are limited to lightweight header/URL manipulation. The viewer-request trigger is critical because it fires for every incoming request (including cache hits), ensuring authentication is enforced universally. The origin-request trigger only fires for cache misses, creating a security gap for cached content.",
    keywords: ["CDN edge authentication", "JWT validation", "JWKS endpoint", "network call", "viewer-request"]
  }
]

// ─────────────────────────────────────────────────────────────
// DOMAIN 4 — Design Cost-Optimized Architectures (10 questions)
// ─────────────────────────────────────────────────────────────
const domain4Questions: Question[] = [
  {
    id: "d4-001",
    domain: 4,
    taskStatement: "4.1",
    services: ["s3", "lifecycle"],
    constraintType: "cost",
    difficulty: 2,
    type: "single",
    stem: "A compliance team stores audit log files in Amazon S3 Standard. Logs are accessed daily for the first 30 days for active investigations, then rarely until a mandatory 7-year retention requirement ends. The team has no budget to reprocess the files if lost. Retrieval within 12 hours is acceptable after the 30-day active period. Which lifecycle configuration minimizes storage cost while meeting all requirements?",
    options: [
      {
        id: "A",
        text: "S3 Standard for 30 days, then transition to S3 Standard-IA.",
        isCorrect: false,
        explanation: "Wrong — Standard-IA at ~$0.0125/GB-mo is more appropriate than Standard, but far more expensive than Glacier Deep Archive over a 7-year retention period. Standard-IA is optimized for data accessed 1–2 times per month, not data that is almost never accessed."
      },
      {
        id: "B",
        text: "S3 Standard for 30 days, then transition to S3 Glacier Deep Archive.",
        isCorrect: true,
        explanation: "Correct — Glacier Deep Archive at ~$0.00099/GB-mo (~$1/TB-month) is the cheapest AWS storage class. Standard 12-hour retrieval satisfies the SLA. The 180-day minimum duration is met because data ages past 30 days in Standard before entering Glacier. The 7-year compliance requirement is fully supported."
      },
      {
        id: "C",
        text: "S3 Standard for 30 days, then transition to S3 Glacier Instant Retrieval.",
        isCorrect: false,
        explanation: "Wrong — Glacier Instant Retrieval provides millisecond access at ~$0.004/GB-mo. Since the team only needs 12-hour retrieval after 30 days, paying 4× more for millisecond access is unnecessary waste."
      },
      {
        id: "D",
        text: "S3 One Zone-IA for all content after upload.",
        isCorrect: false,
        explanation: "Wrong — S3 One Zone-IA stores data in a single AZ. If that AZ suffers a disaster, data is permanently lost. The question states the team has no budget to reprocess lost files — meaning durability across multiple AZs is required."
      }
    ],
    explanation: "Lifecycle cost optimization maps access frequency to storage class: active data → Standard, infrequent monthly → Standard-IA, quarterly → Glacier Instant Retrieval, annual or rarely + hours OK → Glacier Flexible Retrieval, rarely + 12+ hours OK → Glacier Deep Archive. Deep Archive at ~$1/TB/month is the right choice for near-never-accessed compliance archives when retrieval time of hours is acceptable. Memorize the trio: Standard-IA min 30 days, Glacier IR/Flexible min 90 days, Deep Archive min 180 days.",
    keywords: ["minimize storage cost", "7-year retention", "rarely accessed", "12-hour retrieval"]
  },
  {
    id: "d4-002",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2", "savings-plans", "reserved-instances"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company runs a stable baseline of 100 m5.xlarge EC2 instances 24/7 in us-east-1. Over the next 3 years, the team plans to migrate to Graviton instances (m7g family), move some workloads to Fargate, and potentially shift some compute to Lambda. They want maximum discount on the stable baseline. Which purchase option provides both maximum discount AND flexibility to cover the planned service changes?",
    options: [
      {
        id: "A",
        text: "3-year Standard Reserved Instances for 100 m5.xlarge in us-east-1.",
        isCorrect: false,
        explanation: "Wrong — Standard RIs provide up to 72% discount but are locked to the m5 instance family in us-east-1. They do not cover Graviton (m7g), Fargate, or Lambda. When the migration happens, the RIs become unused or must be sold on the Marketplace."
      },
      {
        id: "B",
        text: "3-year EC2 Instance Savings Plans for the m5 instance family in us-east-1.",
        isCorrect: false,
        explanation: "Wrong — EC2 Instance Savings Plans provide up to 72% discount but are locked to a specific instance family (m5) and region (us-east-1). Migrating to m7g (Graviton) in the same region is allowed (same M family), but Fargate and Lambda are NOT covered."
      },
      {
        id: "C",
        text: "3-year Compute Savings Plans.",
        isCorrect: true,
        explanation: "Correct — Compute Savings Plans provide up to 66% discount and cover EC2 (any family, size, OS, region), Fargate, AND Lambda. As the team migrates from m5 to m7g to Fargate to Lambda, the Savings Plan automatically applies to all usage. This is the most flexible plan — the slight reduction in max discount (66% vs 72%) is the trade-off for flexibility."
      },
      {
        id: "D",
        text: "Mix of 1-year Standard RIs for m5.xlarge and separate 1-year Standard RIs for Fargate.",
        isCorrect: false,
        explanation: "Wrong — Standard RIs cannot be applied to Fargate. Fargate is covered by Compute Savings Plans, not Reserved Instances. Additionally, 1-year terms provide significantly less discount than 3-year terms."
      }
    ],
    explanation: "The Savings Plan decision tree: maximum discount locked to one family/region → EC2 Instance SP (72%); flexibility across EC2 families/regions + Fargate + Lambda → Compute SP (66%). When the question includes a planned migration across instance families or compute services (EC2 → Fargate → Lambda), Compute Savings Plans is always the answer because it follows the actual compute usage wherever it migrates within the commitment period.",
    keywords: ["maximum discount", "flexibility", "Graviton migration", "Fargate", "Lambda", "Savings Plans"]
  },
  {
    id: "d4-003",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2", "spot"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A genomics research company runs large-scale DNA sequence processing jobs that take 4–8 hours to complete. Jobs are fault-tolerant and can resume from checkpoints if interrupted. Each job uses 500 EC2 instances concurrently. The company wants to minimize compute costs and can tolerate up to 2-minute interruption warnings. Which purchase strategy achieves the LOWEST cost?",
    options: [
      {
        id: "A",
        text: "On-Demand Instances in an EC2 Auto Scaling group with target tracking.",
        isCorrect: false,
        explanation: "Wrong — On-Demand provides no discount (base price). For a fault-tolerant, batch workload, this is the most expensive option."
      },
      {
        id: "B",
        text: "Spot Instances via an EC2 Spot Fleet with capacity-optimized allocation strategy across multiple instance families and AZs.",
        isCorrect: true,
        explanation: "Correct — Spot Instances provide up to 90% discount vs On-Demand. The capacity-optimized strategy picks the Spot pools with the most available capacity, minimizing interruption probability. Diversifying across instance families and AZs further reduces interruption risk. The 2-minute interruption warning allows checkpointing. For fault-tolerant batch jobs, Spot is the optimal choice."
      },
      {
        id: "C",
        text: "3-year Standard Reserved Instances for 500 instances.",
        isCorrect: false,
        explanation: "Wrong — Reserved Instances commit to 24/7 usage for 3 years. If the genomics jobs only run intermittently (not 24/7), unused RI hours are wasted. RIs provide up to 72% discount but for intermittent workloads, Spot (90% off) on actual usage is cheaper."
      },
      {
        id: "D",
        text: "Dedicated Hosts reserved for 3 years.",
        isCorrect: false,
        explanation: "Wrong — Dedicated Hosts are for BYOL licensing requirements (Windows, Oracle, SQL Server per-socket/core). They have no cost advantage for standard Linux workloads — they are actually more expensive than Spot or even On-Demand for general compute."
      }
    ],
    explanation: "Spot Instances are the correct answer for fault-tolerant, interruption-tolerant, batch workloads. At up to 90% discount, they are the cheapest EC2 purchase option. The capacity-optimized (or price-capacity-optimized) Spot Fleet allocation strategy maximizes the probability of obtaining and retaining Spot capacity by preferring pools with the most available instances. Diversifying instance families prevents reliance on a single over-subscribed pool.",
    keywords: ["fault-tolerant", "checkpoint", "lowest cost", "batch", "2-minute interruption", "Spot"]
  },
  {
    id: "d4-004",
    domain: 4,
    taskStatement: "4.4",
    services: ["vpc", "nat-gateway", "s3-endpoint"],
    constraintType: "cost",
    difficulty: 2,
    type: "single",
    stem: "A company's analytics pipeline on EC2 instances in private subnets processes data by downloading files from S3 and uploading results back to S3. The current architecture routes all S3 traffic through a NAT Gateway. Monthly NAT Gateway processing fees are $8,500 for 188 TB of S3 traffic. What is the MOST cost-effective change to eliminate this cost?",
    options: [
      {
        id: "A",
        text: "Replace the NAT Gateway with a NAT Instance in each Availability Zone.",
        isCorrect: false,
        explanation: "Wrong — NAT Instances eliminate the per-GB NAT processing fee but still route traffic over the internet (or intra-VPC paths), incurring EC2 instance-hour costs and still applying standard data transfer charges. NAT Instances are not free."
      },
      {
        id: "B",
        text: "Create an S3 Gateway VPC Endpoint and update the route table to direct S3 traffic to the endpoint.",
        isCorrect: true,
        explanation: "Correct — S3 Gateway VPC Endpoints are completely FREE (no hourly charge, no per-GB charge). They route S3 traffic from private subnets directly to S3 without passing through the NAT Gateway, eliminating the $0.045/GB NAT processing fee. For 188 TB/month, this saves the full $8,500/month. The only change is adding the endpoint and updating route tables."
      },
      {
        id: "C",
        text: "Create an S3 Interface VPC Endpoint (PrivateLink) instead of a Gateway Endpoint.",
        isCorrect: false,
        explanation: "Wrong — S3 Interface Endpoints charge $0.01/hour per AZ + $0.01/GB processed. For a 3-AZ deployment processing 188 TB, the Interface Endpoint would cost ~$21.90/mo hourly + ~$1,880/mo per-GB = ~$1,900/mo. This is much cheaper than the NAT Gateway but still not free like the Gateway Endpoint."
      },
      {
        id: "D",
        text: "Enable S3 Transfer Acceleration on the bucket to use AWS backbone instead of NAT.",
        isCorrect: false,
        explanation: "Wrong — S3 Transfer Acceleration adds a premium charge ($0.04/GB on top of standard transfer) for globally-distributed clients uploading to a single region. It does not reduce or eliminate NAT Gateway costs — it is a performance feature, not a cost optimization."
      }
    ],
    explanation: "S3 Gateway VPC Endpoints are the single most impactful cost optimization for architectures that route S3 or DynamoDB traffic through NAT Gateways. Gateway Endpoints are FREE (no hourly fee, no per-GB charge), whereas NAT Gateway charges $0.045/GB for processing. For large S3 workloads in private subnets, always deploy a Gateway Endpoint. The exam frequently tests this as a 'most cost-effective' question. Interface Endpoints for S3 are useful when you need on-premises access to S3 via Direct Connect, but Gateway Endpoints are always cheaper within VPC.",
    keywords: ["NAT Gateway cost", "S3 traffic", "free endpoint", "Gateway VPC Endpoint", "most cost-effective"]
  },
  {
    id: "d4-005",
    domain: 4,
    taskStatement: "4.3",
    services: ["aurora", "aurora-serverless"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A software development team has 20 Aurora PostgreSQL databases for individual developer environments. Each database is active only 2–3 hours per day during work hours and idles overnight and on weekends. The team currently pays for 20 provisioned Aurora instances running 24/7. What configuration change would MOST reduce database costs while maintaining instant availability during work hours?",
    options: [
      {
        id: "A",
        text: "Stop each Aurora provisioned instance at the end of each workday using a scheduled Lambda and restart it each morning.",
        isCorrect: false,
        explanation: "Wrong — Stopped Aurora instances only remain stopped for 7 days before AWS automatically restarts them. Manual or scheduled start/stop is also operationally cumbersome for 20 databases. Additionally, startup time from a stopped state can take 1–2 minutes."
      },
      {
        id: "B",
        text: "Migrate all 20 developer databases to Aurora Serverless v2 with minimum capacity set to 0 ACUs and a 5-minute auto-pause threshold.",
        isCorrect: true,
        explanation: "Correct — Aurora Serverless v2 with minimum 0 ACUs (scale-to-zero, GA November 2024) auto-pauses the database after 5 minutes of inactivity. When a developer connects, the database resumes in approximately 15 seconds. Compute cost is $0 when paused — only storage is billed. For databases active 2–3 hours/day, this reduces compute costs by ~87.5% vs 24/7 provisioned."
      },
      {
        id: "C",
        text: "Migrate to DynamoDB for developer testing to eliminate the relational database cost entirely.",
        isCorrect: false,
        explanation: "Wrong — Developer environments test PostgreSQL-specific code. Replacing the database engine with DynamoDB fundamentally changes the application behavior and would require significant code changes. The question asks for a cost reduction, not an engine migration."
      },
      {
        id: "D",
        text: "Apply 1-year Reserved Instance discounts to all 20 Aurora instances.",
        isCorrect: false,
        explanation: "Wrong — RIs provide discounts on 24/7 running instances. If the databases are only used 2–3 hours per day (~10–12%), paying for 24/7 capacity (even at a discount) is far more expensive than scale-to-zero. RI discounts optimize running costs; they don't eliminate idle costs."
      }
    ],
    explanation: "Aurora Serverless v2 with scale-to-zero (min 0 ACUs, released November 2024) is purpose-built for dev/test workloads with intermittent traffic. When no connections exist for the configured auto-pause threshold (5 min–24 hours), the compute capacity scales to zero and only storage is billed. On first connection, the database resumes in ~15 seconds. For databases used 2–3 hours/day (~10–12% utilization), this reduces compute costs by ~88% vs provisioned 24/7 instances.",
    keywords: ["dev/test database", "scale-to-zero", "auto-pause", "idle overnight", "minimize cost"]
  },
  {
    id: "d4-006",
    domain: 4,
    taskStatement: "4.3",
    services: ["rds", "rds-multi-az"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company runs an Oracle Database Standard Edition 2 (SE2) on a large on-premises server. They want to migrate to AWS and reduce licensing costs. Oracle SE2 is licensed per socket (maximum 2 sockets). The company needs 8 vCPUs and 64 GB RAM. Which AWS approach MOST reduces the Oracle license cost?",
    options: [
      {
        id: "A",
        text: "Run Oracle SE2 on a db.r5.2xlarge RDS instance (8 vCPU, 64 GiB) with License Included.",
        isCorrect: false,
        explanation: "Wrong — RDS Oracle License Included includes the Oracle license in the hourly price, which is 3–5× more expensive than BYOL. For a customer that already owns Oracle SE2 licenses, LI wastes the existing license investment."
      },
      {
        id: "B",
        text: "Run Oracle SE2 BYOL on a db.r5.2xlarge RDS instance with RDS Custom for Oracle.",
        isCorrect: false,
        explanation: "Wrong — RDS Custom for Oracle allows OS-level access and supports Oracle BYOL, but it adds the cost of RDS Custom management overhead. Standard RDS Oracle BYOL is simpler and less expensive for a standard SE2 migration."
      },
      {
        id: "C",
        text: "Run Oracle SE2 BYOL on a Dedicated Host using an instance type with 2 sockets to maximize SE2's 2-socket license scope while bringing the existing license.",
        isCorrect: true,
        explanation: "Correct — Oracle SE2 is licensed per physical socket (max 2). A Dedicated Host provides visibility into the physical socket count and supports BYOL per-socket/per-core licensing. Running SE2 on a 2-socket Dedicated Host BYOL maximizes the existing license and avoids Oracle licensing fees. This is the cost-optimal AWS approach for Oracle SE2 BYOL."
      },
      {
        id: "D",
        text: "Migrate to Aurora PostgreSQL with AWS DMS and AWS SCT to eliminate Oracle licensing entirely.",
        isCorrect: false,
        explanation: "Wrong — Migrating to Aurora PostgreSQL eliminates Oracle licensing permanently and is often the best long-term strategy, but 'migrating from Oracle' requires significant application testing and schema conversion effort. The question asks which approach 'most reduces the Oracle license cost' on AWS — implying continued Oracle use."
      }
    ],
    explanation: "Oracle SE2 is licensed per socket (maximum 2 sockets per instance). On shared EC2 or RDS, Oracle charges per vCPU (2 vCPUs = 1 license). On a Dedicated Host, you license by physical socket. A 2-socket Dedicated Host running SE2 BYOL maximizes the SE2 license value and avoids the License Included premium (3–5× more expensive than BYOL). Dedicated Hosts are specifically designed for BYOL workloads that require per-socket, per-core, or per-VM licensing models.",
    keywords: ["Oracle SE2", "BYOL", "per-socket licensing", "reduce license cost", "Dedicated Host"]
  },
  {
    id: "d4-007",
    domain: 4,
    taskStatement: "4.4",
    services: ["cloudfront", "s3"],
    constraintType: "cost",
    difficulty: 2,
    type: "single",
    stem: "A startup hosts a globally-accessed static website (HTML, CSS, JS, images) with 100 TB of data served per month. The files are stored in an S3 bucket. Current monthly costs are $9,000 for S3 data transfer out ($0.09/GB × ~100,000 GB). What is the MOST cost-effective architecture to serve this content?",
    options: [
      {
        id: "A",
        text: "Move the website to an EC2 instance in each of 5 major global regions to reduce latency.",
        isCorrect: false,
        explanation: "Wrong — Running EC2 instances adds significant compute cost on top of data transfer costs. EC2 to internet data transfer is still charged at $0.09/GB. This is far more expensive than the current setup and adds operational overhead."
      },
      {
        id: "B",
        text: "Place a CloudFront distribution in front of the S3 bucket.",
        isCorrect: true,
        explanation: "Correct — Data transfer from S3 to CloudFront (origin fetch) is FREE. CloudFront-to-internet egress is $0.085/GB for the first 10 TB (vs $0.09/GB direct from S3) and decreases with volume. CloudFront also includes a free tier of 1 TB/month egress. With caching, cache hit rate reduces origin fetches, further reducing S3 request costs. The combined savings easily exceed 15–20% and often much more with high cache hit rates."
      },
      {
        id: "C",
        text: "Enable S3 Requester Pays so users pay the data transfer costs.",
        isCorrect: false,
        explanation: "Wrong — S3 Requester Pays transfers the cost to the user (requester), which is suitable for data distribution businesses (e.g., AWS Open Data) but inappropriate for a public-facing startup website where users would be charged unexpectedly."
      },
      {
        id: "D",
        text: "Use S3 Transfer Acceleration to reduce latency for downloads.",
        isCorrect: false,
        explanation: "Wrong — S3 Transfer Acceleration adds a $0.04/GB PREMIUM on top of existing data transfer costs to accelerate uploads. It does not reduce download costs — it actually increases them."
      }
    ],
    explanation: "CloudFront is the cost-optimization layer for high-volume S3 content distribution. The key facts: (1) S3 → CloudFront data transfer is FREE, (2) CloudFront egress to internet is $0.085/GB (vs S3 direct $0.09/GB), (3) CloudFront provides a 1 TB/month free tier, (4) caching reduces origin fetches and S3 request charges. For 100 TB/month, CloudFront saves ~$500/month on egress rates alone, plus eliminates origin fetch charges for cache hits.",
    keywords: ["reduce data transfer cost", "S3 egress", "CloudFront free tier", "static website", "most cost-effective"]
  },
  {
    id: "d4-008",
    domain: 4,
    taskStatement: "4.2",
    services: ["ec2", "graviton"],
    constraintType: "cost",
    difficulty: 2,
    type: "single",
    stem: "A company runs a containerized Java microservices application on Amazon ECS with EC2 launch type using m5.4xlarge instances in us-east-1. A cloud architect proposes switching to m7g.4xlarge (Graviton3) instances using multi-arch container images. The application is stateless. What is the PRIMARY cost benefit of this change?",
    options: [
      {
        id: "A",
        text: "m7g.4xlarge instances are ARM-based and cannot run x86 Java JARs, so the team must switch to a lower-cost runtime.",
        isCorrect: false,
        explanation: "Wrong — Amazon Corretto and most JVMs support ARM64 natively. Multi-arch container images (built for both x86 and ARM64) allow the same Java application to run on Graviton without changes. The ARM architecture is not a limitation."
      },
      {
        id: "B",
        text: "Graviton instances provide up to 40% better price-performance than comparable x86 instances, reducing compute costs for the same workload.",
        isCorrect: true,
        explanation: "Correct — AWS Graviton3 (m7g) delivers up to 40% better price-performance vs comparable x86 instances (m5) for the same workload type. The m7g.4xlarge has similar vCPU/RAM to m5.4xlarge but at a lower hourly price. For stateless containerized applications built with multi-arch images, Graviton migration requires no application changes."
      },
      {
        id: "C",
        text: "Graviton instances are only available as Reserved Instances, providing forced discount commitment.",
        isCorrect: false,
        explanation: "Wrong — Graviton instances are available under all EC2 purchase options: On-Demand, Spot, Reserved Instances, and Savings Plans. There is no restriction to reserved-only purchasing."
      },
      {
        id: "D",
        text: "Graviton instances eliminate the need for EC2 Auto Scaling because they are more powerful.",
        isCorrect: false,
        explanation: "Wrong — Auto Scaling is about dynamically matching capacity to demand, which is independent of instance type. Graviton does not eliminate the need for scaling — you may need fewer Graviton instances to handle the same workload, but scaling behavior is unchanged."
      }
    ],
    explanation: "AWS Graviton instances (ARM64 architecture, designed by AWS) consistently deliver up to 40% better price-performance vs equivalent x86 (Intel/AMD) instances for the same workload. For containerized Java/Python/Go/.NET workloads, multi-arch images (built with docker buildx for linux/amd64 and linux/arm64) allow zero-code migration to Graviton. The ECS task definition simply specifies ARM64 architecture. This is one of the lowest-effort, highest-impact cost optimizations in AWS.",
    keywords: ["price-performance", "Graviton", "ARM64", "40% better", "lower compute cost"]
  },
  {
    id: "d4-009",
    domain: 4,
    taskStatement: "4.4",
    services: ["direct-connect", "vpn"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company currently transfers 10 TB of data per month from AWS to its on-premises data center over the public internet, paying standard AWS data transfer out rates. The operations team proposes installing a 1 Gbps AWS Direct Connect connection. The DX port fee is $0.30/hr (~$219/month). AWS data transfer out over DX is $0.02/GB vs $0.09/GB over the internet. At which monthly data transfer volume does Direct Connect become MORE cost-effective than internet-based transfer?",
    options: [
      {
        id: "A",
        text: "1 TB/month",
        isCorrect: false,
        explanation: "Wrong — At 1 TB: Internet cost = 1,024 × $0.09 = $92.16. DX cost = $219 port + 1,024 × $0.02 = $219 + $20.48 = $239.48. DX is still more expensive at 1 TB."
      },
      {
        id: "B",
        text: "2.6 TB/month",
        isCorrect: true,
        explanation: "Correct — Break-even calculation: Internet cost = N × $0.09. DX cost = $219 + N × $0.02. Setting equal: N × $0.09 = $219 + N × $0.02 → N × $0.07 = $219 → N ≈ 3,129 GB ≈ 3.06 TB. More precisely with the per-GB savings of $0.07, break-even is approximately 2.6–3.1 TB/month depending on exact tier pricing. At 10 TB/month, DX saves ~$490/month."
      },
      {
        id: "C",
        text: "10 TB/month",
        isCorrect: false,
        explanation: "Wrong — At 10 TB the savings are already significant ($900 internet vs $204 + $219 = $423 DX), meaning break-even occurred well before 10 TB."
      },
      {
        id: "D",
        text: "50 TB/month",
        isCorrect: false,
        explanation: "Wrong — Break-even is far below 50 TB. At 50 TB: Internet = $4,608. DX = $219 + $1,024 = $1,243. DX is dramatically cheaper above break-even."
      }
    ],
    explanation: "The Direct Connect break-even analysis: DX port cost ($219/mo for 1 Gbps) is the fixed overhead. The per-GB savings are $0.09 - $0.02 = $0.07/GB. Break-even: $219 / $0.07 = ~3,129 GB ≈ 3.1 TB/month. The commonly cited exam answer is ~2.6 TB/month (using slightly different egress tiers). At 10 TB/month, the company saves approximately $700/month by switching to DX. DX also provides consistent latency vs variable public internet performance.",
    keywords: ["Direct Connect break-even", "data transfer cost", "internet vs DX", "cost-effective threshold"]
  },
  {
    id: "d4-010",
    domain: 4,
    taskStatement: "4.3",
    services: ["dynamodb"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company's DynamoDB table processes exactly 800,000 write operations and 400,000 read operations per hour, consistently, 24 hours a day, 7 days a week. The table is currently in On-Demand capacity mode. After the November 2024 price reduction, the monthly write cost is ~$876 and read cost is ~$88. The data engineering team wants to further reduce costs. Which change would achieve the GREATEST cost reduction?",
    options: [
      {
        id: "A",
        text: "Switch to DynamoDB Standard-IA table class to reduce storage and request costs.",
        isCorrect: false,
        explanation: "Wrong — Standard-IA reduces storage cost by 60% but increases request cost by approximately 25%. For a write-heavy workload where compute cost dominates storage cost, Standard-IA increases total cost."
      },
      {
        id: "B",
        text: "Enable DynamoDB Streams on the table to process writes asynchronously.",
        isCorrect: false,
        explanation: "Wrong — Enabling Streams does not reduce the cost of write operations on the base table. Streams may add a small read cost for stream readers. This is not a cost reduction strategy."
      },
      {
        id: "C",
        text: "Switch to DynamoDB Provisioned capacity mode with Auto Scaling configured for 100% of the observed peak, and purchase 1-year Reserved Capacity.",
        isCorrect: true,
        explanation: "Correct — The traffic is perfectly steady at 800K writes/hr = ~222 WCU/s and 400K reads/hr = ~111 RCU/s. Provisioned capacity with Reserved Capacity (1-year: up to 53% off provisioned cost, 3-year: up to 77% off) reduces per-WCU/RCU cost significantly. Post-2024, the break-even between on-demand and provisioned is ~40% sustained utilization. At 100% steady utilization, provisioned + Reserved Capacity is dramatically cheaper."
      },
      {
        id: "D",
        text: "Add a DynamoDB DAX cluster to cache all read operations.",
        isCorrect: false,
        explanation: "Wrong — DAX caches reads and can reduce DynamoDB read costs. However, DAX has a 3-node minimum for production (~$86+/month) and does not reduce write costs. Since writes dominate ($876/month), DAX only addresses the $88 read cost. Switching to provisioned with Reserved Capacity addresses both read and write costs."
      }
    ],
    explanation: "DynamoDB capacity mode decision: On-Demand is cost-optimal for unpredictable/spiky traffic; Provisioned with Reserved Capacity is cost-optimal for steady, predictable traffic above ~40% utilization. A workload at 100% constant utilization should always use Provisioned with Reserved Capacity (1-year: up to 53% savings, 3-year: up to 77% savings). The November 2024 on-demand price cut shifted the break-even from ~70% to ~40% utilization, but 100% constant utilization clearly favors provisioned.",
    keywords: ["DynamoDB provisioned vs on-demand", "Reserved Capacity", "steady traffic", "greatest cost reduction"]
  }
]

export const ALL_QUESTIONS: Question[] = [
  ...domain1Questions,
  ...domain1NewQuestions,
  ...domain1NewQuestions2,
  ...domain2Questions,
  ...domain2NewQuestions,
  ...domain2NewQuestions2,
  ...domain3Questions,
  ...domain3NewQuestions,
  ...domain3NewQuestions2,
  ...domain4Questions,
  ...domain4NewQuestions,
  ...domain4NewQuestions2,
  ...crossDomainQuestions,
  ...crossDomainQuestions2,
]

// Alias used by the quiz session page's dynamic require()
export const questions = ALL_QUESTIONS
