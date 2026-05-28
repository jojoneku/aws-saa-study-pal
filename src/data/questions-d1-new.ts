import { Question } from "../lib/types"

export const domain1NewQuestions: Question[] = [
  // ─── Difficulty 2 (2 questions) ─────────────────────────────
  {
    id: "d1-011",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam", "permission-boundary"],
    constraintType: "security",
    difficulty: 2,
    type: "single",
    stem: "A cloud platform team allows individual development teams to create their own AWS Identity and Access Management (IAM) roles for their Lambda functions. The platform team wants to ensure no developer-created role can ever grant permissions beyond a predefined set of allowed actions, even if the developer attaches a very permissive policy to the role. Which IAM feature enforces this upper bound on permissions for developer-created roles?",
    options: [
      {
        id: "A",
        text: "Attach an IAM managed policy to every developer-created role that lists allowed actions.",
        isCorrect: false,
        explanation: "A managed policy grants permissions but does not cap them. A developer could attach additional policies to the same role that grant actions beyond the managed policy, overriding the intended restriction."
      },
      {
        id: "B",
        text: "Set an IAM permissions boundary on each developer-created role that defines the maximum allowed permissions.",
        isCorrect: true,
        explanation: "Permissions boundaries are an IAM feature that sets the maximum permissions an identity policy can grant a principal. Even if a developer attaches an AdministratorAccess policy to the role, the effective permissions are limited to the intersection of the boundary and the identity policy. The boundary itself does not grant permissions — it only caps them."
      },
      {
        id: "C",
        text: "Apply a Service Control Policy (SCP) to the member account that denies all actions outside the allowed set.",
        isCorrect: false,
        explanation: "SCPs cap what all principals in the account can do, including the platform team's own roles. While SCPs are a valid guardrail at the account level, the question asks about constraining developer-created roles specifically. SCPs also require AWS Organizations and are coarser-grained than permissions boundaries."
      },
      {
        id: "D",
        text: "Use AWS IAM Access Analyzer to generate a least-privilege policy for each developer-created role after deployment.",
        isCorrect: false,
        explanation: "IAM Access Analyzer policy generation is a detective tool that recommends policies based on observed access activity. It does not proactively cap permissions at creation time — developers could still deploy over-permissive roles before Access Analyzer reviews them."
      }
    ],
    explanation: "IAM permissions boundaries are guardrails that set the maximum permissions any identity-based policy can grant to a principal. The platform team can require that all developer-created roles have a specific boundary attached (enforced via SCP on iam:CreateRole or iam:PutRolePermissionsBoundary). The developer's attached policy still grants permissions, but the effective permissions are the intersection of what the boundary allows and what the identity policy grants — the boundary always wins on the ceiling.",
    keywords: ["upper bound", "permissions boundary", "developer-created roles", "maximum allowed"]
  },
  {
    id: "d1-012",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "nacl", "security-group"],
    constraintType: "security",
    difficulty: 2,
    type: "single",
    stem: "A company's web application runs EC2 instances in private subnets behind a public Application Load Balancer (ALB). The security team notices that NACLs on the private subnets are blocking return traffic from the ALB to clients. A network engineer proposes adding outbound NACL rules to allow ephemeral port range 1024–65535. Why is this outbound rule required on the NACL but NOT required on the security group?",
    options: [
      {
        id: "A",
        text: "Security groups use numbered rules evaluated in order, so a low-numbered deny can block return traffic.",
        isCorrect: false,
        explanation: "This describes NACL behavior, not security group behavior. Security groups evaluate all rules together and do not use rule numbering. NACLs use numbered rules with first-match evaluation."
      },
      {
        id: "B",
        text: "NACLs are stateless — each direction of a flow is evaluated independently, so return traffic requires its own explicit allow rule. Security groups are stateful — they automatically allow return traffic for established connections.",
        isCorrect: true,
        explanation: "NACLs are stateless: both inbound and outbound rules must explicitly permit each direction of traffic. When a client sends a TCP SYN to the ALB on port 443, the server's response travels on a random ephemeral port (1024–65535) in the outbound direction — the NACL must explicitly allow this. Security groups track connection state and automatically permit return traffic for any connection the SG already allowed inbound."
      },
      {
        id: "C",
        text: "Security groups do not apply to subnets, so they cannot block traffic between the ALB and EC2 instances in the same subnet.",
        isCorrect: false,
        explanation: "Security groups apply to individual ENIs (instances), not subnets. However, this does not explain the stateful vs stateless distinction that is the actual reason the outbound rule is required on NACLs but not security groups."
      },
      {
        id: "D",
        text: "NACLs only evaluate inbound traffic; outbound rules are ignored.",
        isCorrect: false,
        explanation: "NACLs evaluate both inbound AND outbound traffic independently. That is precisely why both sets of rules must explicitly allow traffic in each direction — the stateless nature means neither direction is automatically permitted based on the other."
      }
    ],
    explanation: "The stateful vs stateless distinction between security groups and NACLs is one of the most frequently tested Domain 1 concepts. Security groups track established connection state (like a stateful firewall), so any traffic matching an inbound allow rule has its return traffic automatically permitted regardless of outbound rules. NACLs are stateless packet filters — every packet is evaluated independently in each direction, so both the request and the response require explicit rules. Return traffic from servers uses ephemeral ports (1024–65535) in the outbound direction.",
    keywords: ["stateless", "stateful", "ephemeral ports", "return traffic", "NACL outbound rule"]
  },

  // ─── Difficulty 3 (12 questions) ────────────────────────────
  {
    id: "d1-013",
    domain: 1,
    taskStatement: "1.1",
    services: ["identity-center", "organizations", "iam"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A 500-person enterprise has 12 AWS accounts in AWS Organizations. Employees currently authenticate to AWS via individual IAM users in each account, resulting in 6,000 IAM user credentials to manage. The security team requires centralized MFA enforcement, single sign-on from the corporate Microsoft Entra ID (Azure AD), and the ability to provision or deprovision access across all accounts when an employee is hired or leaves. Which solution meets all three requirements with LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Create cross-account IAM roles in each of the 12 accounts trusting a central identity account, then configure SAML 2.0 federation between that identity account and Microsoft Entra ID.",
        isCorrect: false,
        explanation: "This approach works but requires manually maintaining trust relationships, SAML metadata, and role assignments in 12 accounts. Provisioning and deprovisioning require touching multiple accounts manually. This is the legacy approach before IAM Identity Center existed."
      },
      {
        id: "B",
        text: "Configure AWS IAM Identity Center with Microsoft Entra ID as the external SAML 2.0 / SCIM identity source. Create permission sets and assign them to groups in Entra ID across the 12 accounts.",
        isCorrect: true,
        explanation: "IAM Identity Center is purpose-built for this exact scenario. Entra ID as the identity source provides SSO (SAML 2.0) and automatic user/group provisioning via SCIM. When an employee is offboarded in Entra ID, SCIM deprovisioning removes their access across all 12 accounts within minutes. MFA is enforced centrally via Entra ID or IAM Identity Center's built-in MFA. Permission sets are reusable templates deployed to multiple accounts — one change propagates everywhere."
      },
      {
        id: "C",
        text: "Use Amazon Cognito User Pools with Microsoft Entra ID as a federated OIDC provider, then exchange Cognito tokens for AWS credentials via a Cognito Identity Pool.",
        isCorrect: false,
        explanation: "Cognito is designed for application end-user authentication, not workforce AWS console access. It does not integrate natively with AWS Organizations multi-account structures or generate permission sets that map to console roles across accounts. This would require significant custom code."
      },
      {
        id: "D",
        text: "Deploy Active Directory on EC2 (AD Connector) in a central account, configure a two-way forest trust with Microsoft Entra ID Domain Services, then use IAM SAML federation in each account.",
        isCorrect: false,
        explanation: "AD Connector is a proxy to an existing on-prem AD — it does not support creating forest trusts with Entra ID Domain Services directly. This architecture also requires managing AD infrastructure and configuring SAML in each of the 12 accounts separately, creating significant operational overhead."
      }
    ],
    explanation: "AWS IAM Identity Center (formerly AWS SSO) is the canonical answer for workforce SSO across an Organizations multi-account structure. With an external identity source (Entra ID, Okta, Google Workspace), SCIM automates user lifecycle management — provisioning on hire and deprovisioning on termination propagate automatically. Permission sets are defined once and assigned to accounts/OUs, reducing the 6,000 IAM users to zero while centralizing access governance.",
    keywords: ["SSO", "Entra ID", "SCIM provisioning", "LEAST operational overhead", "multi-account"]
  },
  {
    id: "d1-014",
    domain: 1,
    taskStatement: "1.1",
    services: ["ram", "organizations", "vpc"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A large enterprise uses AWS Organizations. A central networking team owns a VPC with pre-approved subnets in a shared networking account. Application teams in separate AWS accounts need to launch Amazon EC2 instances and AWS Lambda functions into these centrally-managed subnets, while the networking team retains control over route tables, security group defaults, and NACLs. Which mechanism achieves this with LEAST operational overhead and WITHOUT creating VPC peering connections?",
    options: [
      {
        id: "A",
        text: "Create VPC peering connections between the networking account VPC and each application account's VPC.",
        isCorrect: false,
        explanation: "VPC peering requires non-overlapping CIDRs, does not allow transitive routing, and grows as O(n) connections for n application accounts. Application teams would still need their own VPCs, which is what the question is trying to eliminate. Peering also does not give application teams access to the central subnets directly."
      },
      {
        id: "B",
        text: "Share the specific subnets from the networking account to application accounts using AWS Resource Access Manager (RAM), scoped to the Organization or specific OUs.",
        isCorrect: true,
        explanation: "AWS RAM subnet sharing (VPC sharing) allows application accounts to launch resources into centrally-managed subnets without creating their own VPCs or peering connections. The networking account retains full ownership and control of the VPC, route tables, NACLs, and internet/NAT gateways. Application accounts manage only the resources (EC2, Lambda, RDS) they launch into the shared subnets. No peering or Transit Gateway required."
      },
      {
        id: "C",
        text: "Create a Transit Gateway in the networking account and attach all application account VPCs to it.",
        isCorrect: false,
        explanation: "Transit Gateway enables inter-VPC routing but requires each application account to have its own VPC with a TGW attachment. This adds per-attachment hourly costs and requires application teams to manage their own VPCs — not what the question describes."
      },
      {
        id: "D",
        text: "Use AWS PrivateLink to expose the networking team's subnets as endpoints to application accounts.",
        isCorrect: false,
        explanation: "PrivateLink exposes specific service endpoints (behind NLB or GWLB) to consumer VPCs — it does not share subnets for EC2/Lambda deployment. Application teams cannot launch EC2 instances or Lambda functions 'into' a PrivateLink endpoint."
      }
    ],
    explanation: "AWS RAM VPC subnet sharing (the 'shared VPC' pattern) is the purpose-built mechanism for centralized network governance. The networking account creates the VPC, subnets, and all network infrastructure. RAM shares specific subnets to application accounts (within the Organization or specific OUs). Application teams launch EC2, Lambda, RDS, and other resources into those subnets and manage only their compute resources. The networking team retains full control of all network primitives (route tables, NACLs, IGW, NAT GW). No peering or TGW attachments are required.",
    keywords: ["shared VPC", "WITHOUT peering", "central networking", "LEAST operational overhead", "RAM"]
  },
  {
    id: "d1-015",
    domain: 1,
    taskStatement: "1.2",
    services: ["waf", "cloudfront", "shield"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A retail company's website receives 50,000 requests per second through Amazon CloudFront. The security team notices bots are scraping product prices at scale, consuming significant origin capacity. The team wants to identify and block scrapers using behavioral signals (mouse movement patterns, browser fingerprinting) without writing custom rules. Which AWS WAF feature addresses this with LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Create a custom AWS WAF rule with rate-based limiting set to 100 requests per 5 minutes per IP.",
        isCorrect: false,
        explanation: "Rate-based rules block IPs exceeding a threshold but do not use behavioral signals. Sophisticated bots distribute requests across many IPs to stay under rate limits, making IP-based rate limiting ineffective against distributed scraping."
      },
      {
        id: "B",
        text: "Enable AWS WAF Bot Control (Targeted Protection level) on the CloudFront Web ACL.",
        isCorrect: true,
        explanation: "AWS WAF Bot Control's Targeted Protection level uses advanced browser interrogation, fingerprinting, and behavioral analysis (including mouse movements and interaction patterns) to distinguish bots from humans — without custom rule writing. Common bots are categorized (scrapers, crawlers) and blocked or challenged. Targeted Protection runs JavaScript challenges and verifies browser legitimacy. This is the zero-configuration path to behavioral bot detection."
      },
      {
        id: "C",
        text: "Use AWS Shield Advanced with advanced reporting to identify bot patterns and manually block detected IPs.",
        isCorrect: false,
        explanation: "Shield Advanced provides DDoS protection and cost protection credits — it is not designed for bot scraping detection or behavioral fingerprinting. Manually blocking IPs from Shield reports is reactive and operationally intensive."
      },
      {
        id: "D",
        text: "Deploy AWS WAF with the AWS Managed Rules for Core Rule Set (CRS) to block common attack patterns including bot signatures.",
        isCorrect: false,
        explanation: "The Core Rule Set (CRS) targets web application attack vectors (SQLi, XSS, RFI/LFI) based on signature patterns — not behavioral bot detection. It does not include browser fingerprinting or mouse movement analysis. Bot Control is the correct managed rule group for bot-specific threats."
      }
    ],
    explanation: "AWS WAF Bot Control provides two protection levels: Common Protection (categorizes and manages common bots using signatures and CAPTCHAs) and Targeted Protection (adds JavaScript browser interrogation, device fingerprinting, and behavioral signals like mouse movements). Targeted Protection is the correct choice when the requirement includes behavioral signals and browser fingerprinting without custom rule development. It integrates directly with CloudFront Web ACLs and requires only enabling the managed rule group.",
    keywords: ["bot scraping", "behavioral signals", "browser fingerprinting", "LEAST operational overhead", "Bot Control"]
  },
  {
    id: "d1-016",
    domain: 1,
    taskStatement: "1.3",
    services: ["cloudtrail", "config", "security-hub"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A financial services company needs to prove to external auditors that its AWS security configuration has continuously complied with the CIS AWS Foundations Benchmark v1.4 over the past 12 months, and that all detected deviations were remediated within 48 hours. Which combination of services provides this continuous compliance evidence with MINIMUM custom development?",
    options: [
      {
        id: "A",
        text: "Enable AWS CloudTrail in all regions and query the Event History console to produce a compliance report.",
        isCorrect: false,
        explanation: "CloudTrail records API calls (who did what) but does not evaluate resource configurations against compliance standards like CIS Benchmark. It cannot produce a continuous compliance posture report or show remediation timelines against benchmarks."
      },
      {
        id: "B",
        text: "Enable AWS Security Hub with the CIS AWS Foundations Benchmark v1.4 standard enabled. Ensure AWS Config is enabled in all regions. Review the Security Hub Findings dashboard for the compliance posture and use Security Hub Insights for remediation tracking.",
        isCorrect: true,
        explanation: "Security Hub's CIS AWS Foundations Benchmark standard continuously evaluates 50+ controls using AWS Config as the data source. Each control check runs automatically and produces pass/fail findings with timestamps. The 12-month findings history and Insights queries can demonstrate continuous compliance and remediation timelines to auditors. AWS Config's configuration history provides point-in-time configuration evidence. This requires zero custom development — enabling Security Hub and Config is sufficient."
      },
      {
        id: "C",
        text: "Deploy AWS Audit Manager with the CIS framework and manually collect evidence from CloudTrail logs, Config snapshots, and manual attestations.",
        isCorrect: false,
        explanation: "Audit Manager automates evidence collection for compliance frameworks including CIS, but it requires creating assessment frameworks, defining controls, and reviewing evidence reports — more setup and review overhead than Security Hub's automatic continuous posture checks. Audit Manager is appropriate for formal audit preparation; Security Hub is better for continuous automated compliance monitoring."
      },
      {
        id: "D",
        text: "Use AWS Trusted Advisor to run weekly security checks against CIS Benchmark controls.",
        isCorrect: false,
        explanation: "Trusted Advisor's security checks cover only 7 core checks on Basic/Developer support plans and do not map to the full CIS Benchmark v1.4 control set. It also runs on a schedule rather than continuously, and cannot provide 12-month historical compliance evidence."
      }
    ],
    explanation: "AWS Security Hub with CIS AWS Foundations Benchmark standard is the purpose-built continuous compliance monitoring solution. It requires AWS Config enabled in all regions (as the configuration recorder) and Security Hub enabled with the desired compliance standard. Security Hub then continuously evaluates all in-scope Config rules against CIS controls, generates findings with timestamps, and maintains historical posture data. The combination of Security Hub findings history + Config configuration history provides the continuous evidence auditors require.",
    keywords: ["continuous compliance", "CIS Benchmark", "MINIMUM custom development", "12 months", "Security Hub"]
  },
  {
    id: "d1-017",
    domain: 1,
    taskStatement: "1.2",
    services: ["guardduty", "macie", "inspector"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A healthcare company stores patient medical records in Amazon S3 and runs an EMR cluster on Amazon EC2 for processing. The CISO wants to implement three detective controls: (1) automatically scan new S3 objects for PHI (Protected Health Information) as they are uploaded, (2) detect if EC2 instances in the EMR cluster are beaconing to external command-and-control servers, and (3) continuously scan EMR EC2 instances for known OS-level vulnerabilities. Which combination of services, in order, addresses all three requirements?",
    options: [
      {
        id: "A",
        text: "Amazon GuardDuty Malware Protection for S3, Amazon Inspector, Amazon GuardDuty EC2 monitoring",
        isCorrect: false,
        explanation: "GuardDuty Malware Protection for S3 scans S3 objects for malware signatures — not PHI/PII pattern matching. Inspector detects CVEs but is used here for the wrong requirement (C2 detection). The ordering does not match the three requirements."
      },
      {
        id: "B",
        text: "Amazon Macie, Amazon GuardDuty, Amazon Inspector",
        isCorrect: true,
        explanation: "Macie scans S3 objects for sensitive data including PHI using managed data identifiers (it includes US healthcare identifiers — Medicare IDs, NPI numbers, healthcare common procedure codes). GuardDuty analyzes VPC Flow Logs and DNS to detect C2 beaconing (finding type: Backdoor:EC2/C&CActivity.B). Inspector v2 with the SSM agent continuously scans EC2 OS packages for CVEs. These map directly to requirements 1, 2, and 3 respectively."
      },
      {
        id: "C",
        text: "Amazon Inspector, Amazon GuardDuty, Amazon Macie",
        isCorrect: false,
        explanation: "This maps Inspector to S3 PHI scanning (wrong — Inspector scans compute workloads for CVEs, not S3 for data classification), GuardDuty to C2 detection (correct), and Macie to CVE scanning (wrong — Macie discovers sensitive data in S3, not OS vulnerabilities). Requirements 1 and 3 are transposed."
      },
      {
        id: "D",
        text: "AWS Security Hub, Amazon GuardDuty, Amazon Inspector",
        isCorrect: false,
        explanation: "Security Hub aggregates findings from other services but does not independently scan S3 for PHI. Without Macie enabled and feeding into Security Hub, PHI detection in S3 is not possible through Security Hub alone."
      }
    ],
    explanation: "The four-detective-service mapping is a critical exam concept: Macie = PII/PHI/sensitive data discovery in S3 using managed data identifiers (includes healthcare-specific identifiers for US, UK, France, etc.); GuardDuty = active threat detection via ML on VPC Flow Logs, CloudTrail, DNS (finds C2 traffic, crypto mining, exfiltration); Inspector v2 = CVE/vulnerability scanning for EC2 (via SSM agent), ECR images, and Lambda functions. All three push findings to Security Hub for a unified view.",
    keywords: ["PHI detection", "C2 beaconing", "OS vulnerabilities", "Macie", "detective controls"]
  },
  {
    id: "d1-018",
    domain: 1,
    taskStatement: "1.3",
    services: ["acm", "cloudfront", "alb"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company runs a multi-region web application with an Application Load Balancer (ALB) in us-west-2 and an Amazon CloudFront distribution globally. The security team wants to use AWS Certificate Manager (ACM) to provision TLS certificates for both the ALB and the CloudFront distribution, and ensure certificates auto-renew WITHOUT manual intervention. In which region(s) must the ACM certificates be provisioned?",
    options: [
      {
        id: "A",
        text: "Provision both certificates in us-west-2 where the ALB is deployed.",
        isCorrect: false,
        explanation: "ACM certificates for CloudFront MUST be provisioned in us-east-1, regardless of where the origin or ALB resides. Provisioning only in us-west-2 means the CloudFront certificate request will fail — CloudFront cannot use ACM certs from any other region."
      },
      {
        id: "B",
        text: "Provision the ALB certificate in us-west-2 and the CloudFront certificate separately in us-east-1.",
        isCorrect: true,
        explanation: "ACM is a regional service. An ALB requires a certificate in the same region as the load balancer (us-west-2 in this case). CloudFront is a global service that always validates and deploys ACM certificates from us-east-1 only — this is a hard requirement with no exceptions. Both certs auto-renew because ACM manages renewal for its native integrations (ALB, CloudFront, API Gateway). No manual intervention is required for either."
      },
      {
        id: "C",
        text: "Provision a single ACM certificate in us-east-1 and use it for both CloudFront and the ALB.",
        isCorrect: false,
        explanation: "An ACM certificate in us-east-1 can be used by CloudFront, but NOT by an ALB in us-west-2. ACM certificates are regional resources and cannot be deployed to load balancers in other regions. ALBs can only use ACM certs from their own region."
      },
      {
        id: "D",
        text: "Provision a single ACM private certificate in the global ACM namespace, then deploy it to both services.",
        isCorrect: false,
        explanation: "ACM does not have a 'global namespace.' ACM is strictly regional. ACM Private CA certificates are also regional. There is no mechanism to deploy a single ACM certificate to services in multiple regions."
      }
    ],
    explanation: "The ACM regional constraint for CloudFront is one of the most tested exam gotchas: CloudFront certificates must ALWAYS be in us-east-1, regardless of the origin's region. ALB certificates must be in the same region as the ALB. For a multi-region architecture with CloudFront + ALB in different regions, two separate ACM certificates are required. Both auto-renew through ACM's managed renewal (60 days before expiration via DNS or email validation) without manual intervention.",
    keywords: ["ACM CloudFront us-east-1", "auto-renew", "regional certificate", "ALB certificate"]
  },
  {
    id: "d1-019",
    domain: 1,
    taskStatement: "1.1",
    services: ["sts", "iam", "s3"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company's on-premises backup server runs scripts that upload nightly backup files to Amazon S3. The current approach uses hardcoded IAM user access keys stored in a configuration file on the backup server. The security team requires that the backup server obtain temporary credentials automatically, with no long-lived access keys stored anywhere on the server, and that the solution work WITHOUT making code changes to the backup scripts. Which approach satisfies all three requirements?",
    options: [
      {
        id: "A",
        text: "Create a new IAM user with a 90-day key rotation policy and a script that rotates the keys automatically using the IAM API.",
        isCorrect: false,
        explanation: "Rotating keys reduces the risk window but still results in long-lived IAM user credentials stored on the server. The question explicitly requires no long-lived access keys stored anywhere on the server."
      },
      {
        id: "B",
        text: "Deploy AWS IAM Roles Anywhere on the backup server. Issue an X.509 certificate from the company's on-premises CA, register it as a trust anchor, and configure a profile with an S3 upload role. Use the AWS Signing Helper as a credential provider for the AWS CLI/SDK.",
        isCorrect: true,
        explanation: "IAM Roles Anywhere allows on-premises workloads to obtain temporary IAM credentials by presenting X.509 certificates — no long-lived IAM keys are stored. The AWS Signing Helper acts as a credential process provider that the AWS CLI and SDKs transparently call, so backup scripts using the AWS CLI do not require any code changes. The temporary credentials (STS) are obtained at runtime and expire after the session duration."
      },
      {
        id: "C",
        text: "Install the AWS SSM Agent on the backup server and register it as a managed instance to use Session Manager for credential delegation.",
        isCorrect: false,
        explanation: "SSM managed instances on-premises use an activation code + ID mechanism that still requires storing the SSM activation credentials. Session Manager is designed for interactive shell access, not for credential delegation to backup scripts. SSM does not provide S3-scoped credentials to scripts via a credential process provider."
      },
      {
        id: "D",
        text: "Use the AWS STS GetFederationToken API from the backup server to obtain temporary credentials, passing the current IAM user credentials.",
        isCorrect: false,
        explanation: "GetFederationToken still requires long-lived IAM user credentials to call the STS API — the server must store the IAM user's access keys to make the initial GetFederationToken call. This does not eliminate long-lived credentials from the server."
      }
    ],
    explanation: "AWS IAM Roles Anywhere is purpose-built for on-premises workloads that need temporary AWS credentials without long-lived access keys. It uses X.509 certificates from any CA (on-prem PKI, AWS Private CA, or self-signed for testing) as the proof of identity. The AWS Signing Helper binary acts as a credential_process provider in the AWS credentials file, so any script using the AWS CLI or SDK transparently calls it to obtain STS temporary credentials — no code changes required.",
    keywords: ["no long-lived keys", "on-premises", "temporary credentials", "no code changes", "IAM Roles Anywhere"]
  },
  {
    id: "d1-020",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "security-group", "nacl"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company runs a three-tier application: a public web tier (EC2 in public subnets), an application tier (EC2 in private subnets), and a database tier (RDS in isolated subnets). The security team wants to ensure that the application tier can ONLY receive traffic from the web tier, using the MOST maintainable approach that automatically updates when web-tier instances are replaced by Auto Scaling. Which mechanism achieves this?",
    options: [
      {
        id: "A",
        text: "Add inbound NACL rules to the application tier's private subnets that allow only the web tier's subnet CIDR range.",
        isCorrect: false,
        explanation: "NACL rules based on CIDR blocks allow any EC2 instance in the web-tier subnet to reach the application tier — not just the actual web-tier application servers. More importantly, NACLs cannot reference security groups, so they cannot automatically track web-tier instance changes. They also require explicit ephemeral port rules, adding maintenance overhead."
      },
      {
        id: "B",
        text: "Configure the application tier's security group inbound rules to allow traffic from the web tier's security group ID, rather than a CIDR range.",
        isCorrect: true,
        explanation: "Security groups can reference other security groups as sources, not just CIDR blocks. An inbound rule allowing traffic from 'sg-webtierId' means only instances belonging to that security group can reach the application tier. When Auto Scaling launches new web-tier instances, they automatically inherit the web-tier security group, so the application tier's inbound rule automatically allows them — no rule updates needed. This is the canonical approach for tier-to-tier access control."
      },
      {
        id: "C",
        text: "Deploy an AWS Network Firewall between the web and application tiers with domain-based filtering rules.",
        isCorrect: false,
        explanation: "Network Firewall operates at the network perimeter (VPC level) and uses Suricata-compatible rules. It does not track Auto Scaling group membership or security group assignments. It also adds significant cost and latency for intra-VPC tier-to-tier traffic, which is unnecessary when the same goal is achievable with security group referencing."
      },
      {
        id: "D",
        text: "Use VPC Flow Logs to detect unauthorized access attempts and trigger an automated Lambda function to update NACL rules.",
        isCorrect: false,
        explanation: "VPC Flow Logs are a monitoring/auditing tool, not a preventive access control. Using them to reactively update NACLs is a detective + reactive pattern with inherent lag — unauthorized traffic reaches the application tier during the detection and remediation window."
      }
    ],
    explanation: "Security group referencing (using a security group ID as the source in an inbound rule, not a CIDR) is the most maintainable tier-to-tier access control pattern. It tracks membership dynamically — any instance assigned the referenced security group passes the rule, regardless of its IP address. This means Auto Scaling replacements automatically inherit access. NACLs are CIDR-based only and do not understand security group membership, making them less precise and harder to maintain for tier-to-tier access.",
    keywords: ["security group referencing", "tier-to-tier access", "Auto Scaling", "automatically updates", "MOST maintainable"]
  },
  {
    id: "d1-021",
    domain: 1,
    taskStatement: "1.3",
    services: ["ssm", "secrets-manager", "kms"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company stores configuration values for its microservices in AWS Systems Manager (SSM) Parameter Store as SecureString parameters. As the application grows, the team needs to store 50,000 parameters, including large configuration files up to 6 KB each, and enforce automatic expiration of parameters that are not refreshed within 90 days. Which Parameter Store tier and configuration supports these requirements?",
    options: [
      {
        id: "A",
        text: "SSM Parameter Store Standard tier with KMS encryption and a Lambda function that checks parameter age and deletes old ones.",
        isCorrect: false,
        explanation: "The Standard tier supports only 10,000 parameters per Region and maximum 4 KB per parameter. 50,000 parameters and 6 KB files both exceed Standard tier limits. Standard also does not natively support parameter expiration policies — custom Lambda is required, adding operational overhead."
      },
      {
        id: "B",
        text: "SSM Parameter Store Advanced tier with parameter policies to set expiration (Time-to-Live) of 90 days, supporting up to 100,000 parameters and 8 KB values.",
        isCorrect: true,
        explanation: "The Advanced tier supports: up to 100,000 parameters per Region, up to 8 KB per parameter value (accommodating 6 KB files), and parameter policies — which include Expiration policies that automatically delete or notify when a parameter reaches its TTL. A 90-day Expiration policy natively handles the automatic expiration requirement without custom code. Advanced tier is $0.05/parameter/month."
      },
      {
        id: "C",
        text: "Migrate all parameters to AWS Secrets Manager, which supports larger payloads and native lifecycle management.",
        isCorrect: false,
        explanation: "Secrets Manager supports secrets up to 64 KB, which accommodates the size requirement. However, Secrets Manager costs $0.40/secret/month. 50,000 parameters at $0.40 = $20,000/month — versus $2,500/month for Advanced Parameter Store. Additionally, Secrets Manager is designed for credentials and sensitive data, not general configuration values. The question asks about Parameter Store specifically."
      },
      {
        id: "D",
        text: "Use SSM Parameter Store Standard tier and store large files in S3, with Parameter Store holding the S3 object ARN as a reference.",
        isCorrect: false,
        explanation: "This approach works for the size constraint but does not address the 50,000-parameter limit of the Standard tier (maximum 10,000) or provide native parameter expiration. It also adds application code complexity to resolve S3 references."
      }
    ],
    explanation: "SSM Parameter Store has two tiers: Standard (free, 10,000 params max, 4 KB max, no parameter policies) and Advanced ($0.05/param/month, 100,000 params max, 8 KB max, parameter policies available). Parameter policies in the Advanced tier provide three policy types: Expiration (delete after TTL), ExpirationNotification (SNS alert before expiration), and NoChangeNotification (alert if not updated). For auto-expiration without Lambda, Advanced tier parameter policies are the correct native solution.",
    keywords: ["50000 parameters", "6 KB", "automatic expiration", "90 days", "Advanced tier"]
  },
  {
    id: "d1-022",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "guardduty", "security-hub"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company operates 40 AWS accounts under AWS Organizations. The security operations team wants a single pane of glass for threat detection findings across all 40 accounts and needs to automatically trigger an AWS Lambda function to isolate an EC2 instance whenever Amazon GuardDuty generates a finding of severity 8.0 or higher in any member account. Which architecture requires the LEAST custom code?",
    options: [
      {
        id: "A",
        text: "Enable GuardDuty in each of the 40 accounts independently, then poll each account's GuardDuty API from a central Lambda function every 5 minutes.",
        isCorrect: false,
        explanation: "Polling each account independently requires managing credentials for 40 accounts, handling pagination, rate limits, and clock skew. This is maximum custom code — exactly what the question asks to minimize."
      },
      {
        id: "B",
        text: "Enable GuardDuty in a delegated administrator account for the Organization, which aggregates all member account findings. Configure an Amazon EventBridge rule in the delegated admin account to trigger a Lambda isolation function on findings with severity ≥ 8.0.",
        isCorrect: true,
        explanation: "GuardDuty Organizations integration with a delegated administrator automatically aggregates all member account findings into the admin account with no custom code. EventBridge in the admin account receives all GuardDuty findings as events — a single EventBridge rule with a severity filter (detail.severity >= 8.0) triggers the Lambda. The Lambda uses cross-account role assumption to isolate the EC2 instance in the source member account. This requires minimal code: one EventBridge rule and one Lambda function."
      },
      {
        id: "C",
        text: "Deploy a GuardDuty custom threat intelligence feed in each account and configure individual CloudWatch alarms per account to trigger local Lambda functions.",
        isCorrect: false,
        explanation: "Per-account CloudWatch alarms and Lambda functions require deploying and maintaining infrastructure in each of the 40 accounts. Custom threat intelligence feeds are for defining custom IoCs, not for aggregating findings. This is far more code and infrastructure than the delegated administrator pattern."
      },
      {
        id: "D",
        text: "Enable AWS Security Hub in all accounts, aggregate findings via Security Hub cross-account configuration, and use Security Hub custom actions to trigger Lambda.",
        isCorrect: false,
        explanation: "Security Hub aggregation works and can forward findings to EventBridge, but it adds an extra layer (Security Hub) over GuardDuty's native Organizations integration. GuardDuty's native Organizations delegated-admin pattern already aggregates directly with no additional service. Custom Actions in Security Hub require manual console interaction, not automatic triggering on severity thresholds."
      }
    ],
    explanation: "GuardDuty's Organizations integration with a delegated administrator account is the zero-custom-code aggregation pattern. Once configured, all member account findings automatically flow to the delegated admin account's GuardDuty console and EventBridge event bus. A single EventBridge rule with an event pattern filtering on source 'aws.guardduty' and detail.severity ≥ 8.0 routes to a Lambda function. The Lambda then assumes cross-account roles in the source member account to perform isolation actions (removing security group rules, adding quarantine SG).",
    keywords: ["single pane of glass", "40 accounts", "severity 8.0", "LEAST custom code", "delegated administrator"]
  },
  {
    id: "d1-023",
    domain: 1,
    taskStatement: "1.3",
    services: ["kms", "s3", "cloudtrail"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A regulated financial company stores customer records in Amazon Simple Storage Service (Amazon S3). A compliance audit requires proof that all encryption keys used to protect customer data are rotated at least annually, and that every key usage event is logged in an immutable audit trail. The company wants to use AWS-managed encryption with MINIMUM operational overhead for key rotation. Which solution meets these requirements?",
    options: [
      {
        id: "A",
        text: "Enable SSE-S3 (server-side encryption with Amazon S3-managed keys). S3 rotates the underlying keys automatically.",
        isCorrect: false,
        explanation: "SSE-S3 does rotate AES-256 keys automatically, but these keys are opaque — there is no CloudTrail event generated per key usage, and the company cannot demonstrate individual key rotation events to auditors."
      },
      {
        id: "B",
        text: "Enable SSE-KMS (server-side encryption with AWS KMS-managed keys) using an AWS managed key (aws/s3). Ensure CloudTrail is logging AWS KMS API calls.",
        isCorrect: true,
        explanation: "AWS managed keys in KMS rotate automatically every year — no configuration needed. Every S3 object encryption/decryption generates a CloudTrail event with the key ARN, key ID, and requester identity — meeting both the rotation and immutable audit trail requirements. AWS managed keys have zero management overhead."
      },
      {
        id: "C",
        text: "Enable SSE-KMS using a customer managed key (CMK). Enable automatic key rotation on the CMK and configure a CloudTrail trail.",
        isCorrect: false,
        explanation: "This also works technically and provides more control, but the question asks for MINIMUM operational overhead. Customer managed keys require creating and managing the key policy, IAM permissions, and key lifecycle — more overhead than using the AWS managed key (aws/s3) which handles all of this automatically."
      },
      {
        id: "D",
        text: "Enable SSE-C (server-side encryption with customer-provided keys) and rotate the customer-provided keys annually using a Lambda function.",
        isCorrect: false,
        explanation: "SSE-C requires the client to provide the encryption key on every request. The company must store, rotate, and secure these keys entirely outside AWS — this is the HIGHEST operational overhead and the most error-prone approach."
      }
    ],
    explanation: "For S3 encryption with audit requirements and minimum overhead: SSE-S3 lacks per-operation audit trail visibility; SSE-C requires full client-side key management (highest overhead); SSE-KMS with AWS managed key (aws/s3) provides automatic annual rotation, full CloudTrail integration for every KMS API call, and zero key management overhead. Customer managed CMKs give more control but add key policy and rotation monitoring overhead.",
    keywords: ["annually", "immutable audit trail", "MINIMUM operational overhead", "key rotation"]
  },
  {
    id: "d1-024",
    domain: 1,
    taskStatement: "1.1",
    services: ["organizations", "scp", "iam"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A global enterprise uses AWS Organizations. The security team wants to enforce a data residency policy: no AWS resources (S3 buckets, RDS instances, EC2, etc.) should be created in any region outside of eu-west-1 and eu-central-1 across all member accounts. Account administrators must NOT be able to override this restriction. Which solution implements this with LEAST configuration per account?",
    options: [
      {
        id: "A",
        text: "Attach an IAM permission boundary to every IAM role in each account that restricts actions to eu-west-1 and eu-central-1 using the aws:RequestedRegion condition.",
        isCorrect: false,
        explanation: "Permission boundaries must be applied per IAM principal (role/user). In a large organization with hundreds of roles per account, manually maintaining boundaries across all principals is operationally intensive. Account administrators could also create new roles without the boundary unless further restricted."
      },
      {
        id: "B",
        text: "Apply a Service Control Policy (SCP) at the root OU level with a Deny effect for all actions when aws:RequestedRegion is not eu-west-1 or eu-central-1.",
        isCorrect: true,
        explanation: "SCPs at the root OU level apply to all member accounts and all principals within them automatically — no per-account or per-role configuration needed. A single Deny SCP with a NotAction exclusion for global services (IAM, STS, CloudFront, Route 53, WAF) and a StringNotEquals condition on aws:RequestedRegion enforces the data residency policy across the entire organization. Account administrators cannot override an explicit SCP Deny."
      },
      {
        id: "C",
        text: "Enable AWS Config in all accounts with a managed rule that detects resources outside eu-west-1 and eu-central-1, triggering automated deletion via SSM Automation.",
        isCorrect: false,
        explanation: "AWS Config rules are detective controls — they detect resources after they are created. Automated deletion remediates non-compliance after the fact but allows brief windows of non-compliant resource existence. The question requires that resources cannot be created outside the allowed regions at all (preventive)."
      },
      {
        id: "D",
        text: "Use AWS Control Tower's region restriction guardrail to limit account provisioning to eu-west-1 and eu-central-1.",
        isCorrect: false,
        explanation: "Control Tower's region restriction controls apply to newly vended accounts but may not cover all actions in existing accounts. Control Tower's preventive region controls are implemented via SCPs, but the question asks for the direct mechanism with least per-account configuration — which is applying the SCP directly rather than through the Control Tower abstraction."
      }
    ],
    explanation: "Region restriction via SCP using the aws:RequestedRegion condition key is the canonical data residency guardrail in AWS Organizations. A root-level SCP applies to all 100+ accounts automatically — zero per-account configuration. The SCP pattern uses a Deny with NotAction to exclude global services (IAM, STS, CloudFront, Route 53) and StringNotEquals on aws:RequestedRegion for the allowed regions. This is a preventive control: it blocks the API call before the resource is created.",
    keywords: ["data residency", "LEAST configuration per account", "aws:RequestedRegion", "region restriction", "SCP"]
  },

  // ─── Difficulty 4 (11 questions) ────────────────────────────
  {
    id: "d1-025",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "guardduty", "cloudtrail"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company's security team investigates a GuardDuty finding indicating that an EC2 instance may be exfiltrating data via unusual outbound network connections. The team needs to capture the full content of network packets from the suspicious instance to confirm the payload of the outbound traffic. Which approach provides packet-level content inspection for the specific EC2 instance WITHOUT deploying a new VPC or replacing the instance?",
    options: [
      {
        id: "A",
        text: "Enable Amazon VPC Flow Logs on the instance's ENI with 1-minute aggregation and analyze the logs in CloudWatch Logs Insights.",
        isCorrect: false,
        explanation: "VPC Flow Logs capture metadata only (source/destination IP, port, protocol, bytes, accept/reject) — they do NOT capture packet payload content. Analyzing flow log metadata confirms that connections occurred but cannot show what data was transmitted."
      },
      {
        id: "B",
        text: "Configure Amazon VPC Traffic Mirroring on the suspicious instance's ENI, mirroring traffic to a network monitoring tool on another EC2 instance or to a Network Load Balancer with packet capture capability.",
        isCorrect: true,
        explanation: "VPC Traffic Mirroring replicates the actual network packets (including payload) from a source ENI to a target ENI or NLB. A packet capture tool (tcpdump, Wireshark, IDS appliance) on the mirror target receives full packet contents. This is the only AWS-native mechanism to inspect packet payloads within a VPC without replacing the instance or routing traffic through a new VPC. Traffic Mirroring is available on Nitro-based instances."
      },
      {
        id: "C",
        text: "Enable GuardDuty Runtime Monitoring on the EC2 instance to capture system calls and network connections at the OS level.",
        isCorrect: false,
        explanation: "GuardDuty Runtime Monitoring captures OS-level events (process creation, file access, network connections) using a lightweight agent. It provides behavioral telemetry and generates findings, but it does NOT capture full packet payload content for deep inspection. It confirms what connections were made, not the data payload."
      },
      {
        id: "D",
        text: "Deploy AWS Network Firewall with TLS inspection in the VPC and route outbound traffic from the instance through it.",
        isCorrect: false,
        explanation: "Network Firewall with TLS inspection can decrypt and inspect TLS traffic payloads, but it requires routing traffic through a firewall subnet and modifying route tables — a significant architecture change. It also operates at the inspection policy level (block/allow/alert on rules) and does not provide full raw packet capture for forensic analysis. Traffic Mirroring is the correct forensic packet capture tool."
      }
    ],
    explanation: "VPC Traffic Mirroring is the AWS-native mechanism for full packet-level inspection. Unlike VPC Flow Logs (metadata only), Traffic Mirroring copies the actual packet payload and headers from a source ENI to a monitoring destination. It is available on Nitro-based instances and supports filtering rules to capture only specific traffic flows. For incident response forensics requiring payload inspection, Traffic Mirroring → packet capture tool (on an EC2 monitor instance or behind an NLB) is the correct architecture.",
    keywords: ["packet content", "payload inspection", "WITHOUT replacing instance", "Traffic Mirroring", "forensics"]
  },
  {
    id: "d1-026",
    domain: 1,
    taskStatement: "1.1",
    services: ["cognito", "iam", "sts"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A SaaS company builds a document management application serving 200,000 business users across 500 corporate tenants. Each user must only access documents belonging to their own tenant. Documents are stored in a single Amazon S3 bucket under prefixes like s3://docs-bucket/tenant-{tenantId}/. The solution must scale to millions of users WITHOUT creating IAM users or roles per tenant, and credentials must be short-lived. Which approach implements per-tenant S3 isolation at scale?",
    options: [
      {
        id: "A",
        text: "Create one IAM role per tenant (500 roles) with an S3 policy restricting access to their prefix. Users assume the tenant's role via Cognito Identity Pool role mapping based on their Cognito group.",
        isCorrect: false,
        explanation: "500 IAM roles is feasible technically but violates the spirit of 'no roles per tenant' at scale. If the company grows to 10,000 tenants, 10,000 IAM roles creates a management and quota challenge. There is also no per-user isolation within a tenant — all users of a tenant share the same role and could access any document in the tenant prefix."
      },
      {
        id: "B",
        text: "Configure a Cognito Identity Pool with a single IAM role for all authenticated users. Use IAM policy variables — ${cognito-identity.amazonaws.com:sub} for user ID and a custom attribute for tenant ID — to scope the S3 prefix in the role policy. Pass session tags for the tenant ID via AssumeRoleWithWebIdentity.",
        isCorrect: true,
        explanation: "A single IAM role with policy variables dynamically scopes the S3 policy to the authenticated user's identity. The role policy can use ${aws:PrincipalTag/tenantId} (passed as a session tag) to restrict access to s3://docs-bucket/tenant-${aws:PrincipalTag/tenantId}/. With Cognito Identity Pool, the ID token claims map to session tags via the role's AssumeRoleWithWebIdentity condition. Zero IAM roles per tenant — one role serves all 200,000 users with per-tenant isolation enforced by STS session tags."
      },
      {
        id: "C",
        text: "Use S3 Object Lock with tenant-specific retention policies to prevent cross-tenant access.",
        isCorrect: false,
        explanation: "S3 Object Lock is a compliance feature for WORM immutability (preventing deletion/overwrite). It has nothing to do with access control or tenant isolation. Any principal with the correct S3 GetObject permission could still read any document regardless of Object Lock status."
      },
      {
        id: "D",
        text: "Create 500 separate S3 buckets, one per tenant, and use S3 bucket policies to restrict each bucket to the tenant's Cognito user pool group.",
        isCorrect: false,
        explanation: "Creating 500 buckets is operationally manageable today but does not scale to millions of tenants. S3 bucket quotas (default 100, hard limit 1,000 with increase) become a constraint. S3 bucket policies cannot reference Cognito groups directly — they reference IAM principals or identity conditions. This approach also does not use short-lived credentials as cleanly as the session tag pattern."
      }
    ],
    explanation: "STS session tags combined with IAM policy variables are the scalable per-tenant isolation pattern in AWS. A single IAM role with a policy using ${aws:PrincipalTag/tenantId} in the S3 condition dynamically scopes permissions per user/tenant at assume-role time. Cognito Identity Pool maps user pool claims to session tags via a role's trust policy. This pattern works for millions of users with zero additional IAM roles — the role policy does the per-user filtering through the session context.",
    keywords: ["per-tenant isolation", "session tags", "policy variables", "WITHOUT IAM roles per tenant", "scale"]
  },
  {
    id: "d1-027",
    domain: 1,
    taskStatement: "1.3",
    services: ["kms", "ebs", "s3"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company in Account A has an encrypted EBS snapshot that uses the default AWS-managed KMS key (aws/ebs). They need to share this snapshot with a partner in Account B so Account B can create an EBS volume from it. The team has tried sharing the snapshot but Account B receives an error when attempting to create a volume. What is the CORRECT solution to enable this cross-account snapshot sharing?",
    options: [
      {
        id: "A",
        text: "In Account A, make the EBS snapshot public so that Account B can access it.",
        isCorrect: false,
        explanation: "Encrypted EBS snapshots CANNOT be made public — AWS prevents sharing encrypted snapshots publicly as a security guardrail. Attempting to make an encrypted snapshot public results in an error."
      },
      {
        id: "B",
        text: "In Account A, copy the snapshot specifying a customer-managed KMS key (CMK), update the CMK key policy to allow Account B's principal to use the key, then share the new snapshot with Account B.",
        isCorrect: true,
        explanation: "AWS-managed KMS keys (like aws/ebs) cannot be shared across accounts — their key policies cannot be modified. The only supported path for cross-account encrypted snapshot sharing is: (1) copy the snapshot to a new snapshot re-encrypted with a customer-managed CMK, (2) add Account B as a principal in the CMK's key policy with kms:Decrypt and kms:CreateGrant permissions, (3) share the new snapshot with Account B. Account B can then create volumes using the shared snapshot, leveraging the cross-account KMS key grant."
      },
      {
        id: "C",
        text: "In Account B, create an IAM role with kms:Decrypt permissions on Account A's aws/ebs key ARN, then assume that role to create the volume.",
        isCorrect: false,
        explanation: "IAM policies alone cannot grant cross-account KMS key access. Both the KMS key policy in Account A AND an IAM policy in Account B must allow the access. More critically, the aws/ebs key policy cannot be modified — it is an AWS-managed key. IAM policy changes in Account B are insufficient."
      },
      {
        id: "D",
        text: "Enable KMS key replication to replicate Account A's aws/ebs key to Account B, then create the volume.",
        isCorrect: false,
        explanation: "KMS key replication (Multi-Region keys) copies key material to another AWS region, not another AWS account. Multi-Region keys also do not apply to AWS-managed keys — only to customer-managed CMKs. There is no mechanism to 'replicate' the aws/ebs key to another account."
      }
    ],
    explanation: "AWS-managed KMS keys (aws/ebs, aws/s3, etc.) have a fundamental limitation: their key policies are managed by AWS and cannot be modified to allow cross-account access. Encrypted EBS snapshots using aws/ebs cannot be shared across accounts without re-encryption. The cross-account snapshot sharing workflow always requires a customer-managed CMK: copy snapshot → re-encrypt with CMK → add destination account to CMK key policy → share snapshot. This applies to both EBS snapshots and encrypted AMIs.",
    keywords: ["cross-account snapshot", "aws/ebs key", "customer-managed CMK", "key policy", "cannot share AWS-managed"]
  },
  {
    id: "d1-028",
    domain: 1,
    taskStatement: "1.2",
    services: ["waf", "shield", "cloudfront"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A financial services company runs a payment API behind Amazon CloudFront. The API must accept requests from legitimate customers but must also block requests that include SQL injection patterns in query string parameters. The security team needs to enforce rate limiting at 500 requests per 5 minutes per IP for unauthenticated endpoints and must maintain detailed logs of all blocked requests for PCI DSS audit evidence. The solution must require MINIMUM ongoing rule maintenance.",
    options: [
      {
        id: "A",
        text: "Deploy AWS WAF with custom regex rules for SQL injection patterns, a custom rate-based rule at 100 req/min per IP, and enable WAF full logging to Amazon Kinesis Firehose.",
        isCorrect: false,
        explanation: "Custom regex rules for SQL injection require ongoing maintenance as new injection patterns emerge. AWS Managed Rules for SQL Database and Known Bad Inputs already include comprehensive, continuously-updated SQL injection detection. Custom regex also risks false negatives (missing novel patterns) and requires security expertise to write correctly."
      },
      {
        id: "B",
        text: "Associate an AWS WAF Web ACL with the CloudFront distribution using AWS Managed Rules (SQL Database rule group and Known Bad Inputs rule group), add a rate-based rule set to 500 requests per 5-minute window per IP, and enable WAF logging to Amazon S3 via Kinesis Firehose.",
        isCorrect: true,
        explanation: "AWS Managed Rules are maintained by AWS and updated automatically as new SQLi patterns are discovered — zero maintenance. The SQL Database managed rule group detects SQL injection in query strings, headers, and body. The Known Bad Inputs group adds additional attack pattern detection. Rate-based rules natively support a time window and per-IP tracking. WAF logging to Kinesis Firehose → S3 provides immutable, queryable PCI DSS audit evidence."
      },
      {
        id: "C",
        text: "Enable AWS Shield Advanced on the CloudFront distribution with Advanced WAF integration and configure DDoS event-level rate limiting.",
        isCorrect: false,
        explanation: "Shield Advanced provides L3/L4 DDoS protection and SRT support — it does not include application-layer SQL injection detection. Shield Advanced's WAF integration provides automatic DDoS L7 rules during active attacks, but does not address steady-state SQL injection prevention."
      },
      {
        id: "D",
        text: "Use CloudFront Functions at the viewer-request event to validate query strings against a SQLi blocklist maintained in CloudFront KeyValueStore.",
        isCorrect: false,
        explanation: "CloudFront Functions can perform lightweight validation but cannot replicate the comprehensive rule coverage of AWS WAF Managed Rules, which include thousands of SQLi patterns across multiple rule groups. The CloudFront KVS blocklist would require manual maintenance — exactly what the question wants to avoid. CloudFront Functions also cannot generate WAF-format logs for PCI DSS audit purposes."
      }
    ],
    explanation: "AWS WAF Managed Rules are the minimum-maintenance path for comprehensive attack detection. AWS continuously updates the SQL Database and Known Bad Inputs rule groups as new patterns emerge, at no additional effort from the customer. Rate-based rules natively support per-IP rate limiting with configurable time windows (1 to 5 minutes). WAF full logging to Kinesis Firehose → S3 creates the immutable, queryable audit trail required for PCI DSS. This combination requires zero custom rule development and minimal ongoing maintenance.",
    keywords: ["MINIMUM ongoing maintenance", "SQL injection", "rate limiting per IP", "PCI DSS", "managed rules"]
  },
  {
    id: "d1-029",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam", "organizations", "scp"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company uses AWS Organizations and wants to allow developers in member accounts to create IAM roles for their Lambda functions, but PREVENT them from creating IAM roles that can assume a role in the company's production account (account ID: 111122223333). Developers must still be able to create roles with trust policies for AWS services like Lambda. Which approach enforces this restriction with MINIMUM operational overhead?",
    options: [
      {
        id: "A",
        text: "Apply a Service Control Policy (SCP) that denies iam:CreateRole when the request condition includes the production account ID in the trust policy.",
        isCorrect: false,
        explanation: "SCPs cannot inspect the content (body/attributes) of resource-based policies passed in API requests. The iam:CreateRole API call creates the role with a trust policy document, but SCPs evaluate API-level conditions (like aws:RequestedRegion, aws:ResourceAccount) — they cannot parse the JSON of the trust policy document to check for specific account IDs."
      },
      {
        id: "B",
        text: "Configure an IAM Permissions Boundary that developers must attach to all roles they create. The boundary includes a Deny on sts:AssumeRole targeting the production account, preventing created roles from being able to assume roles there.",
        isCorrect: false,
        explanation: "Permissions boundaries restrict what the principal (the role being created) can do, but they don't prevent the role from being created WITH a trust policy that allows assumption from production. The boundary limits outbound actions of the created role, but the question is about preventing the trust policy itself from referencing the production account."
      },
      {
        id: "C",
        text: "Apply an SCP that denies iam:CreateRole for any developer-run principal and require developers to submit role creation requests via a Service Catalog product that validates the trust policy before calling iam:CreateRole in the automation pipeline.",
        isCorrect: true,
        explanation: "Since SCPs cannot inspect trust policy document content at the API evaluation layer, a Service Catalog product (with automation via Lambda or CodePipeline) is the correct approach to validate trust policy content before role creation. The Lambda validates that the Principal element does not contain the production account ID, then creates the role if valid. The SCP denies direct iam:CreateRole calls from developer principals, ensuring all role creation goes through the validated pipeline. This adds one approval layer but prevents the unsafe trust policy pattern."
      },
      {
        id: "D",
        text: "Enable AWS IAM Access Analyzer to detect cross-account role trusts and configure it to automatically delete any role with a trust policy pointing to the production account.",
        isCorrect: false,
        explanation: "IAM Access Analyzer detects roles that are accessible externally (from outside the account or Organization), but it is a detective control — it runs after the role is created. Automatic deletion would require EventBridge + Lambda, adding custom code, and there is an inherent window where the unsafe trust policy exists before detection and remediation."
      }
    ],
    explanation: "SCPs operate at the IAM API action and condition-key level — they cannot inspect the contents of policy documents passed as parameters to API calls (like the trust policy JSON in iam:CreateRole). When the restriction requires validating the content of a policy document, the solution must enforce this in an application layer (Service Catalog, CDK pipelines, cfn-guard, AWS Control Tower proactive guardrails using CloudFormation Hooks). The SCP blocks direct role creation, routing all requests through the validated pipeline.",
    keywords: ["trust policy content", "production account", "SCP limitation", "MINIMUM operational overhead", "iam:CreateRole"]
  },
  {
    id: "d1-030",
    domain: 1,
    taskStatement: "1.3",
    services: ["secrets-manager", "kms", "rds"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A multinational company runs a microservices application with 50 services across 3 AWS regions (us-east-1, eu-west-1, ap-southeast-1). Each service retrieves a shared RDS PostgreSQL password from AWS Secrets Manager at startup. After a security incident, the CISO requires that if the password secret is compromised, the company can rotate the password and ensure ALL services across ALL 3 regions pick up the new credentials within 60 seconds WITHOUT any service restarts. Which architecture achieves this?",
    options: [
      {
        id: "A",
        text: "Store the secret in Secrets Manager in us-east-1 only. Each service polls GetSecretValue every 30 seconds and caches the result in memory.",
        isCorrect: false,
        explanation: "Services in eu-west-1 and ap-southeast-1 would make cross-region API calls to us-east-1 on every 30-second poll, adding latency and introducing a single-region dependency. More critically, the Secrets Manager SDK default caches secrets for 1 hour by default — services would not pick up rotation within 60 seconds without additional configuration."
      },
      {
        id: "B",
        text: "Enable Secrets Manager cross-region replication to all 3 regions. Configure each service to use the Secrets Manager Caching Client SDK with a TTL of 30 seconds and a refresh-on-rotation hook using Secrets Manager rotation notifications via SNS.",
        isCorrect: true,
        explanation: "Secrets Manager cross-region replication automatically propagates the primary secret's value to replica secrets in each region within seconds of rotation. The AWS Secrets Manager Caching Client SDK (available for Java, Python, Go, .NET, JavaScript) caches secrets in memory with a configurable TTL. Setting TTL to 30 seconds ensures services refresh the secret from the local regional Secrets Manager replica within 30 seconds. Combined, all services across all 3 regions pick up the rotated credential within 30–60 seconds with no restarts."
      },
      {
        id: "C",
        text: "Use AWS Systems Manager Parameter Store Advanced tier with cross-region replication and 30-second TTL polling in each service.",
        isCorrect: false,
        explanation: "SSM Parameter Store does NOT support native cross-region replication. Each region's Parameter Store is independent — value changes in us-east-1 do not automatically propagate to eu-west-1 or ap-southeast-1. Custom Lambda replication would be required, adding operational overhead. Secrets Manager is the correct service for this pattern."
      },
      {
        id: "D",
        text: "Store the credentials in DynamoDB Global Tables with TTL-based invalidation. Services read the credentials from DynamoDB via a local region endpoint.",
        isCorrect: false,
        explanation: "DynamoDB Global Tables replicates data across regions with sub-second propagation, but DynamoDB is not purpose-built for secret storage. It lacks built-in encryption-at-rest key management, automatic rotation integration, fine-grained access control for secret retrieval, and audit logging specific to credential access. Using DynamoDB for credentials introduces significant security and operational gaps."
      }
    ],
    explanation: "Secrets Manager cross-region replication paired with the Secrets Manager Caching Client SDK is the purpose-built solution for multi-region secret distribution with fast rotation propagation. Replication pushes the rotated secret to all configured replica regions within seconds. The caching client's configurable TTL (set ≤30 seconds) ensures services re-fetch from the local regional replica frequently enough to pick up rotations within the 60-second window. No service restart or redeploy is required — the in-process cache refresh handles the update.",
    keywords: ["60 seconds", "cross-region", "no service restarts", "rotation propagation", "caching client"]
  },
  {
    id: "d1-031",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "nacl", "security-group"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A security architect is designing the network controls for a new VPC. A public-facing HTTPS application runs on EC2 in public subnets (10.0.1.0/24). The architect adds a NACL inbound rule to allow TCP port 443 from 0.0.0.0/0. After deployment, HTTPS connections succeed for initial requests but intermittently fail for subsequent requests in the same TCP session. No changes were made to security groups. What is the MOST LIKELY cause and fix?",
    options: [
      {
        id: "A",
        text: "The security group on the EC2 instance is blocking return traffic. Add an outbound rule allowing port 443.",
        isCorrect: false,
        explanation: "Security groups are stateful — once an inbound connection is permitted, return traffic is automatically allowed regardless of outbound rules. Security group outbound rules do not need to explicitly permit return traffic for established connections. This is not the cause."
      },
      {
        id: "B",
        text: "The NACL is stateless and the outbound ephemeral port range (1024–65535) has no NACL outbound allow rule. TCP return segments from the EC2 instance to the client are being dropped.",
        isCorrect: true,
        explanation: "NACLs are stateless — they evaluate each packet independently regardless of session state. When a client connects on port 443, the server's TCP response segments travel back on a random ephemeral client port (1024–65535) in the OUTBOUND direction from the EC2 perspective. Without an outbound NACL rule permitting 0.0.0.0/0 on TCP 1024–65535, the NACL drops the return packets. The TCP session partially succeeds (SYN/SYN-ACK reaches client) but subsequent data packets fail, causing intermittent connection issues."
      },
      {
        id: "C",
        text: "NACLs have a maximum rule evaluation time of 1 second per packet, causing timeouts during high-throughput sessions.",
        isCorrect: false,
        explanation: "There is no 'maximum NACL evaluation time per packet' limit in AWS. NACLs evaluate rules in microseconds. This is a fabricated explanation."
      },
      {
        id: "D",
        text: "The NAT Gateway in the public subnet is dropping packets because it is not configured to pass-through HTTPS traffic.",
        isCorrect: false,
        explanation: "NAT Gateways are used in private subnets for outbound internet access — they do not sit in front of public-subnet EC2 instances for inbound HTTPS. The scenario describes a public-subnet EC2 with a direct internet gateway path, not NAT. NAT Gateways also support all TCP/UDP traffic and do not selectively drop HTTPS."
      }
    ],
    explanation: "NACL statelessness is one of the most-tested network concepts in Domain 1. Because NACLs evaluate each packet independently (no state tracking), both inbound AND outbound rules must explicitly permit all traffic in each direction. For HTTPS on port 443: inbound NACL allows client→server (port 443). Outbound NACL must allow server→client (ephemeral ports 1024–65535). Without the outbound ephemeral rule, return packets are silently dropped at the subnet boundary, causing intermittent TCP session failures that look like application-level bugs.",
    keywords: ["NACL stateless", "ephemeral ports", "return traffic dropped", "intermittent failure", "outbound NACL rule"]
  },
  {
    id: "d1-032",
    domain: 1,
    taskStatement: "1.3",
    services: ["macie", "s3", "security-hub"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A healthcare company uses Amazon Macie to scan S3 buckets for PHI. The security team notices that Macie's automated sensitive data discovery is running daily on 500 S3 buckets containing 200 TB total. Macie costs are $15,000 per month, which is over budget. The team wants to reduce Macie costs by 80% while still ensuring all HIGH-severity PHI findings are detected within 24 hours. Which approach achieves this?",
    options: [
      {
        id: "A",
        text: "Disable Macie's automated sensitive data discovery entirely and rely on GuardDuty to detect unusual S3 access patterns as a proxy for PHI exposure.",
        isCorrect: false,
        explanation: "GuardDuty detects unusual access behavior (e.g., GetObject from an anonymous user) but cannot classify data content. It cannot determine whether accessed objects contain PHI. Disabling Macie entirely removes PHI discovery capability."
      },
      {
        id: "B",
        text: "Configure Macie to run sensitive data discovery jobs only on buckets tagged as 'sensitivity: high' and schedule other buckets for weekly instead of daily discovery. Use S3 bucket-level sensitivity thresholds in the Macie console to de-prioritize known-clean buckets.",
        isCorrect: true,
        explanation: "Macie's automated sensitive data discovery cost is proportional to data scanned. By targeting daily discovery to buckets tagged as high-sensitivity (a subset of the 500), reducing scan frequency for low-risk buckets to weekly or monthly, and using Macie's bucket sensitivity score to skip buckets with no prior findings, the team reduces the daily scanned data volume by 80%+ while maintaining 24-hour detection on high-risk buckets. Macie's per-GB pricing means scanning fewer bytes = directly proportional cost reduction."
      },
      {
        id: "C",
        text: "Replace Macie with AWS Config managed rules that detect publicly accessible S3 buckets and flag them as non-compliant.",
        isCorrect: false,
        explanation: "AWS Config rules (s3-bucket-public-read-prohibited, s3-bucket-level-public-access-prohibited) detect bucket-level public access settings — they do NOT scan object content for PHI. A private bucket can contain PHI and Config would not detect it. This does not replace Macie's data classification function."
      },
      {
        id: "D",
        text: "Migrate all PHI to Amazon RDS with encryption and disable Macie, since Macie only scans S3.",
        isCorrect: false,
        explanation: "Macie does indeed only scan S3 — not RDS. Moving PHI to RDS would remove it from Macie's scope, but this is a significant architectural change and introduces new RDS security/compliance requirements. It does not address the need to maintain compliance for data that remains in S3 during or after migration."
      }
    ],
    explanation: "Macie cost optimization leverages its sampling and scheduling capabilities. Automated sensitive data discovery's cost is driven by bytes scanned per day. Best practices: (1) Tag buckets by sensitivity and configure daily discovery only on high-sensitivity buckets, (2) Use weekly/monthly schedules for low-sensitivity buckets, (3) Review Macie's bucket-level sensitivity scores to skip buckets Macie has consistently found clean. The per-GB pricing model means scanning 20% of current data volume → 80% cost reduction, while the daily schedule on tagged high-risk buckets maintains the 24-hour detection SLA.",
    keywords: ["Macie cost reduction", "80%", "PHI findings", "sensitivity tagging", "sampling"]
  },
  {
    id: "d1-033",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam", "sts", "cognito"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company builds an internal web application where employee permissions within the app are managed by an external authorization service. The app is deployed on EC2 and calls DynamoDB. A new requirement states that each employee's DynamoDB access must be scoped to their department's data partition (table partition key = department ID). Employees authenticate via the corporate Okta IdP through a Cognito User Pool. The solution must NOT require per-user IAM role creation and must use short-lived credentials. Which mechanism enforces per-department DynamoDB isolation?",
    options: [
      {
        id: "A",
        text: "Configure the Cognito User Pool to add the department attribute to the ID token. The EC2 application reads the department from the token and performs client-side filtering on DynamoDB GetItem results to return only department-matching items.",
        isCorrect: false,
        explanation: "Client-side filtering does NOT prevent the application or a compromised EC2 instance from accessing other departments' data — the IAM permissions still allow GetItem on any item. Client-side filtering is a display control, not a security control. A privileged attacker could bypass the filtering."
      },
      {
        id: "B",
        text: "Use a Cognito Identity Pool to exchange the ID token for temporary credentials via AssumeRoleWithWebIdentity. Configure the IAM role's trust policy to require a condition matching the Cognito custom attribute for department. Use the aws:PrincipalTag/department session tag in the DynamoDB IAM policy to enforce partition key access.",
        isCorrect: true,
        explanation: "Cognito Identity Pool maps claims from the User Pool ID token to session tags when calling AssumeRoleWithWebIdentity. The IAM role policy uses the condition 'dynamodb:LeadingKeys': ['${aws:PrincipalTag/department}'], which enforces that the DynamoDB partition key in every request must match the authenticated user's department session tag. AWS enforces this condition server-side — it is a cryptographic IAM control, not client-side filtering. No per-user or per-department roles required."
      },
      {
        id: "C",
        text: "Deploy an API Gateway with a Lambda authorizer that validates the department attribute from Okta and returns an IAM policy restricting DynamoDB access to the department partition.",
        isCorrect: false,
        explanation: "API Gateway Lambda authorizers can scope permissions per request, but the EC2 application calls DynamoDB directly (not via API Gateway). Adding API Gateway as a proxy to DynamoDB is an architectural change with additional latency and cost. The Cognito Identity Pool + session tags pattern achieves the same result without the API Gateway layer."
      },
      {
        id: "D",
        text: "Configure DynamoDB fine-grained access control (FGAC) with a separate DynamoDB table per department and use S3 bucket policies referencing the Cognito identity pool to control access.",
        isCorrect: false,
        explanation: "DynamoDB FGAC uses IAM conditions (including dynamodb:LeadingKeys) — it does not require separate tables per department. S3 bucket policies are irrelevant to DynamoDB access control. This option conflates concepts from different services and does not describe a valid technical pattern."
      }
    ],
    explanation: "DynamoDB fine-grained access control using the dynamodb:LeadingKeys IAM condition with Cognito session tags is the canonical per-tenant/per-user DynamoDB isolation pattern. The session tag (e.g., department=engineering) is embedded in the STS temporary credentials issued by the Cognito Identity Pool. The IAM role policy enforces that every DynamoDB request's partition key must match the session tag value. This is enforced by IAM at the SigV4 signature evaluation layer — it cannot be bypassed at the application level.",
    keywords: ["DynamoDB isolation", "session tags", "LeadingKeys", "per-department", "no per-user roles"]
  },
  {
    id: "d1-034",
    domain: 1,
    taskStatement: "1.2",
    services: ["inspector", "ssm", "security-hub"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A company runs 2,000 EC2 instances across 5 AWS accounts. The security team wants continuous CVE scanning of all instances WITHOUT installing any third-party agents and wants to receive a prioritized list of vulnerabilities ranked by exploitability — not just CVSS score alone. The solution must also show findings in a central console across all 5 accounts. Which solution meets all three requirements?",
    options: [
      {
        id: "A",
        text: "Deploy Amazon Inspector v1 Classic on all instances using the Inspector agent. Configure cross-account aggregation in Inspector.",
        isCorrect: false,
        explanation: "Amazon Inspector Classic (v1) is deprecated and reached end of support on December 31, 2023. Inspector Classic required a standalone Inspector agent, and did not have native Organizations integration for cross-account aggregation. This is a trap answer referencing a legacy service."
      },
      {
        id: "B",
        text: "Enable Amazon Inspector v2 across all 5 accounts using AWS Organizations integration with a delegated administrator. EC2 scanning uses the SSM Agent (pre-installed on Amazon Linux/Windows) — no additional agents needed. Inspector v2 provides a 'Inspector risk score' combining CVSS, network reachability, and exploit availability for prioritization.",
        isCorrect: true,
        explanation: "Inspector v2 EC2 scanning requires only the SSM Agent (which is pre-installed on Amazon Linux 2, AL2023, and Windows Server by default — not a third-party agent). The Inspector risk score (0–100) combines CVSS severity, network path reachability, and Exploit Prediction Scoring System (EPSS) / CISA Known Exploited Vulnerabilities data for context-aware prioritization. Organizations integration with a delegated administrator provides a central cross-account findings dashboard."
      },
      {
        id: "C",
        text: "Use AWS Security Hub with the AWS Foundational Security Best Practices standard to scan all EC2 instances for vulnerabilities using AWS Config.",
        isCorrect: false,
        explanation: "Security Hub with FSBP evaluates configuration compliance (e.g., 'EC2 instances should not have unrestricted SSH') — it does not perform CVE scanning or report specific CVE findings with CVSS scores. Config rules check configuration state, not OS package vulnerability status."
      },
      {
        id: "D",
        text: "Enable AWS GuardDuty Malware Protection for EC2, which scans EBS volumes for CVEs and malware across all accounts.",
        isCorrect: false,
        explanation: "GuardDuty Malware Protection for EC2 scans EBS volumes for malware signatures (viruses, trojans, ransomware, cryptominers) using agentless EBS snapshot analysis. It does NOT scan for CVE vulnerabilities or OS package versions. CVE/vulnerability scanning is Inspector's function."
      }
    ],
    explanation: "Amazon Inspector v2 is the correct answer for CVE scanning with three specific requirements: (1) no third-party agents (uses SSM Agent, which is pre-installed on major AMIs), (2) exploitability-aware prioritization (Inspector risk score combines CVSS + network reachability + EPSS/CISA KEV data), and (3) multi-account central view (Organizations integration with delegated admin). Inspector v1 Classic (deprecated Dec 2023) required a standalone agent and is never the correct answer on current exams.",
    keywords: ["CVE scanning", "no third-party agents", "exploitability prioritization", "Inspector risk score", "5 accounts"]
  },
  {
    id: "d1-035",
    domain: 1,
    taskStatement: "1.3",
    services: ["kms", "s3", "cloudtrail"],
    constraintType: "security",
    difficulty: 4,
    type: "single",
    stem: "A government contractor stores classified documents in Amazon S3 encrypted with AWS KMS customer-managed keys. A new compliance requirement mandates that the KMS encryption key material for classified documents must be stored exclusively on hardware that meets FIPS 140-3 Level 3 certification AND the key material must be exportable so the company can store a copy offline in a classified facility. Which KMS configuration satisfies both requirements simultaneously?",
    options: [
      {
        id: "A",
        text: "Use a standard AWS KMS customer-managed key with FIPS 140-3 Level 3 certified HSMs. Enable automatic key rotation for the CMK.",
        isCorrect: false,
        explanation: "Standard AWS KMS CMKs use AWS-managed HSMs that are now FIPS 140-3 Level 3 certified (since February 2025), satisfying the first requirement. However, the key material for standard KMS CMKs is NOT exportable — AWS manages it within KMS and it never leaves the HSM boundary. Automatic rotation changes the key material but the old material remains inaccessible for export. The second requirement (exportable key material) cannot be met."
      },
      {
        id: "B",
        text: "Create a KMS key with imported key material: generate the key material offline, import it into KMS, store the offline copy in the classified facility. The KMS service uses FIPS 140-3 Level 3 HSMs to protect the imported key material during use.",
        isCorrect: false,
        explanation: "KMS imported key material allows bringing your own key material (BYOK) into KMS, and KMS uses FIPS 140-3 Level 3 HSMs to protect it during use — satisfying the first requirement. However, once imported into KMS, the key material CANNOT be re-exported from KMS. The offline copy stored during import creation satisfies the 'offline copy' need, but this relies on keeping the original pre-import copy rather than exporting from KMS. This partially satisfies the intent but the key within KMS remains non-exportable."
      },
      {
        id: "C",
        text: "Use AWS CloudHSM with a KMS custom key store. The CloudHSM cluster (FIPS 140-3 Level 3 certified) stores the key material in customer-owned HSMs. CloudHSM supports key export via PKCS#12 or raw wrapping for offline backup.",
        isCorrect: true,
        explanation: "CloudHSM (hsm2m.medium, GA August 2024) uses dedicated single-tenant FIPS 140-3 Level 3 certified HSMs that the customer owns and controls. As a KMS custom key store, KMS operations use CloudHSM to perform cryptographic operations — the key material never leaves the customer-owned HSMs. CloudHSM supports key export via PKCS#11/JCE APIs and key wrapping (exporting encrypted key material), enabling the offline copy for the classified facility. This is the only configuration satisfying both requirements simultaneously."
      },
      {
        id: "D",
        text: "Enable AWS KMS Multi-Region keys (MRK) with key material replication to a second region. Store the primary key material ARN in the classified facility as the exportable offline reference.",
        isCorrect: false,
        explanation: "Multi-Region keys share key material across regions under the same key ID (mrk-prefix), but the key material is still managed by AWS KMS — it is not exportable. Storing an ARN 'offline' is not the same as storing actual key material. MRK is for cross-region decryption, not offline key material export."
      }
    ],
    explanation: "The KMS vs CloudHSM decision for key exportability is a critical distinction: standard KMS CMKs (even with imported material) do NOT support key export from KMS. CloudHSM (as a KMS custom key store) provides FIPS 140-3 Level 3 certified dedicated HSMs where the customer controls the key material AND can export it via PKCS#11/JCE APIs. When both 'FIPS 140-3 Level 3' AND 'exportable key material' appear in the same requirement, CloudHSM with KMS custom key store is always the answer.",
    keywords: ["FIPS 140-3 Level 3", "exportable key material", "CloudHSM", "custom key store", "offline backup"]
  },

  // ─── Difficulty 5 (5 questions — trap) ─────────────────────
  {
    id: "d1-036",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam", "organizations", "scp"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A company's security architect states: 'We have an explicit Allow in a Service Control Policy (SCP) attached to our production OU that permits ec2:StartInstances. This means everyone in our production accounts can start EC2 instances.' A junior engineer challenges this statement. Which evaluation is CORRECT regarding SCP Allows?",
    options: [
      {
        id: "A",
        text: "The architect is correct. An explicit Allow in an SCP grants permission to all principals in the OU, overriding any IAM policy denies in the member accounts.",
        isCorrect: false,
        explanation: "This is the misconception that makes this a trap question. SCPs NEVER grant permissions — they only define the maximum boundary of permissions. An explicit Allow in an SCP means the action is 'within the allowed boundary,' but a principal still needs an explicit Allow in their IAM identity-based or resource-based policy to actually perform the action. SCPs cannot override IAM policy explicit denies."
      },
      {
        id: "B",
        text: "The junior engineer is correct. An SCP Allow does NOT grant permissions — it only establishes the maximum boundary. Principals in the OU still need an explicit Allow in their IAM identity-based or resource-based policy to start EC2 instances.",
        isCorrect: true,
        explanation: "SCPs are guardrails that constrain the maximum permissions available to principals in member accounts. An SCP Allow means the action is 'permitted to be allowed' by IAM policies — but the SCP itself grants nothing. If no IAM policy in the member account explicitly allows ec2:StartInstances for the principal, they cannot start instances even with the SCP Allow. Both the SCP Allow AND an IAM Allow must exist for the effective permission to be granted. SCPs = ceiling, not floor."
      },
      {
        id: "C",
        text: "SCPs containing explicit Allows are invalid — SCPs can only contain Deny statements. An Allow in an SCP is silently ignored.",
        isCorrect: false,
        explanation: "SCPs can contain both Allow and Deny statements. An Allow in an SCP is valid and not silently ignored — it defines which actions are within the allowed scope for member accounts. The issue is not that Allows are invalid, but that SCP Allows do not grant permissions the way IAM Allows do."
      },
      {
        id: "D",
        text: "The SCP Allow overrides any IAM Deny in the same account, because SCPs are at a higher policy evaluation tier than identity-based policies.",
        isCorrect: false,
        explanation: "This inverts the actual policy evaluation precedence. Explicit Deny at any layer — IAM identity policy, SCP, or resource policy — always wins. An SCP Allow does not override an IAM Deny. The policy evaluation order is: (1) check for explicit denies in all applicable policies (any deny = denied), (2) check for explicit allows (all required layers must allow)."
      }
    ],
    explanation: "The most common SCP misconception on the exam: SCPs do NOT grant permissions. An SCP Allow defines what actions are 'eligible to be allowed' by IAM policies in member accounts, but a principal still requires an explicit Allow in an IAM identity-based or resource-based policy. Think of SCPs as a filter that IAM permissions must pass through — if the SCP does not allow the action, IAM permissions are irrelevant. But passing through the SCP filter still requires a separate IAM Allow. The evaluation chain is: Explicit Deny anywhere → denied. SCP must allow. Then IAM policy must explicitly allow.",
    keywords: ["SCP does NOT grant", "SCP Allow misconception", "maximum boundary", "IAM policy still required"]
  },
  {
    id: "d1-037",
    domain: 1,
    taskStatement: "1.3",
    services: ["kms", "s3", "cloudtrail"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A security engineer makes the following claim: 'We have enabled automatic key rotation on our AWS KMS customer-managed CMK used to encrypt our S3 data. This means all ciphertext encrypted with older key material will automatically be re-encrypted with the new key material when rotation occurs, so we do not need to track which key version encrypted which object.' Is this claim accurate? What ACTUALLY happens during KMS automatic key rotation?",
    options: [
      {
        id: "A",
        text: "The claim is accurate. KMS automatic rotation re-encrypts all existing data encrypted with the old key material using the new key material as part of the rotation process.",
        isCorrect: false,
        explanation: "This is the trap — and a very common exam misconception. KMS automatic key rotation does NOT re-encrypt existing ciphertext. Existing data remains encrypted under the key version that encrypted it. Only NEW data is encrypted with the new key material."
      },
      {
        id: "B",
        text: "The claim is inaccurate. KMS automatic rotation only rotates the CMK's backing key material (the AES-256 key). KMS retains ALL previous key versions and can still decrypt data encrypted by any previous version using the same CMK ARN/ID. Existing ciphertext is NOT re-encrypted.",
        isCorrect: true,
        explanation: "KMS automatic key rotation replaces the CMK's backing key material but retains all previous key versions behind the same CMK ARN and key ID. AWS automatically tracks which key version encrypted which ciphertext in the encrypted data blob's metadata, so decryption works transparently. Existing data is NEVER automatically re-encrypted during rotation. To re-encrypt existing data, you must explicitly call the KMS ReEncrypt API or use a data migration job — this is a separate, explicit operation."
      },
      {
        id: "C",
        text: "The claim is partially accurate. KMS automatic rotation re-encrypts all S3 objects inline as a background process that completes within 24 hours of rotation.",
        isCorrect: false,
        explanation: "There is no background re-encryption process in KMS for S3 objects. KMS does not have access to the plaintext of S3 objects — it only performs GenerateDataKey and Decrypt operations for the S3 data encryption keys. Re-encrypting S3 objects would require reading and re-writing each object at the application/SDK layer, which KMS cannot do autonomously."
      },
      {
        id: "D",
        text: "The claim is inaccurate because KMS automatic rotation is disabled by default and must be manually triggered for each rotation cycle.",
        isCorrect: false,
        explanation: "This partially correct observation distracts from the main misconception. While KMS automatic rotation must indeed be explicitly enabled (it is off by default), the question's core claim is about what happens to existing ciphertext during rotation — which is the actual trap. Whether rotation is enabled by default is a secondary point."
      }
    ],
    explanation: "KMS key rotation does NOT re-encrypt existing ciphertext — this is one of the most common and dangerous exam misconceptions. Automatic rotation only generates a new backing key and uses it for future encryption operations. KMS stores all old backing key versions and automatically selects the correct version for decryption using metadata embedded in the ciphertext blob. The data encryption key (DEK) in each S3 object's metadata still references the original key version. To explicitly re-encrypt existing data, you must call kms:ReEncrypt or use a re-encryption data pipeline.",
    keywords: ["automatic rotation does NOT re-encrypt", "existing ciphertext", "key version retained", "re-encrypt explicitly"]
  },
  {
    id: "d1-038",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "nacl", "security-group"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A company has a VPC with one EC2 instance in a public subnet. The instance's security group has an inbound rule: Allow TCP port 80 from 0.0.0.0/0. The subnet's NACL has an inbound rule: Allow ALL traffic from 0.0.0.0/0. A security engineer claims: 'Since the NACL allows all traffic inbound, the security group is redundant — I can delete it and the instance will still receive HTTP traffic.' Is this claim correct?",
    options: [
      {
        id: "A",
        text: "The claim is correct. NACLs override security groups. If the NACL allows all traffic, the security group is unnecessary.",
        isCorrect: false,
        explanation: "This is incorrect. NACLs and security groups are independent, additive layers of network control — neither overrides the other. Traffic must pass BOTH the NACL evaluation (at the subnet level) AND the security group evaluation (at the ENI level). They are complementary, not redundant."
      },
      {
        id: "B",
        text: "The claim is incorrect. An EC2 instance without any security group attached falls back to the default VPC security group, which allows all outbound traffic but denies all inbound traffic by default. HTTP traffic to port 80 would be blocked even though the NACL permits it.",
        isCorrect: true,
        explanation: "If you remove all security groups from an ENI, AWS automatically attaches the VPC's default security group. The default security group denies all inbound traffic from external sources (it only allows inbound from other members of the same default security group). Without an inbound Allow rule for TCP port 80, HTTP traffic to the instance would be dropped at the security group layer — even though the NACL allows it. NACLs and security groups are evaluated independently; both must permit traffic."
      },
      {
        id: "C",
        text: "The claim is correct, but only for TCP-based traffic like HTTP. UDP and ICMP traffic would still be filtered by the security group.",
        isCorrect: false,
        explanation: "Security groups apply to all protocols (TCP, UDP, ICMP, and all others) uniformly — there is no distinction by protocol type. More fundamentally, security groups cannot be removed to fall back to 'no filtering'; the default security group is applied automatically."
      },
      {
        id: "D",
        text: "The claim is incorrect because security groups are stateful and the NACL is stateless. Removing the security group would make the return traffic path stateless and TCP sessions would fail.",
        isCorrect: false,
        explanation: "This conflates two separate issues. Statefulness/statelessness is a property of how the firewall tracks return traffic, not whether traffic is allowed at all. The primary reason the claim is wrong is that without an explicit Allow inbound rule (from the default security group or an attached security group), port 80 traffic is blocked — unrelated to statefulness."
      }
    ],
    explanation: "Security groups and NACLs are independent, complementary controls that both evaluate traffic — neither overrides the other. Removing all security groups from an ENI does NOT disable security group filtering; the VPC default security group is applied automatically. The default SG allows all outbound traffic and allows inbound only from within the same security group (i.e., other instances in the default SG). Inbound from the internet on port 80 would be blocked. NACLs allowing all traffic do not bypass security group evaluation.",
    keywords: ["default security group", "NACL does not override", "independent layers", "both must permit", "redundant claim"]
  },
  {
    id: "d1-039",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "guardduty", "cloudtrail"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A solutions architect states: 'We do not need to enable Amazon VPC Flow Logs or CloudTrail in our AWS account because Amazon GuardDuty has its own independent log collection mechanism — it does not rely on Flow Logs or CloudTrail being enabled by the customer. If we enable GuardDuty, threat detection will work the same whether or not we enable Flow Logs and CloudTrail ourselves.' Evaluate this claim.",
    options: [
      {
        id: "A",
        text: "The claim is false. GuardDuty requires customer-enabled VPC Flow Logs and CloudTrail trails to be active. If these are disabled, GuardDuty stops detecting threats.",
        isCorrect: false,
        explanation: "This is also incorrect — GuardDuty does NOT require the customer to enable Flow Logs or CloudTrail. GuardDuty maintains its own independent data feeds from AWS infrastructure. However, this option goes too far — GuardDuty does NOT need customer-enabled versions of these services."
      },
      {
        id: "B",
        text: "The claim is mostly accurate with one important caveat: GuardDuty uses its own independent data streams for CloudTrail and VPC Flow Logs — separate from any customer-configured trails or flow logs. However, the customer should still enable CloudTrail and VPC Flow Logs separately for their own audit, investigation, and compliance needs. GuardDuty findings cannot be used as CloudTrail audit records or for forensic log analysis.",
        isCorrect: true,
        explanation: "GuardDuty ingests duplicate independent copies of VPC Flow Logs, CloudTrail management events, DNS query logs, and optional protection plan logs — these are separate from any customer-configured CloudTrail trail or VPC Flow Log. GuardDuty works even if the customer has no CloudTrail trail or Flow Logs enabled. However, customer-enabled CloudTrail trails (for audit retention, compliance, and forensics) and VPC Flow Logs (for network troubleshooting and security investigation) serve different, complementary purposes that GuardDuty does not replace."
      },
      {
        id: "C",
        text: "The claim is false. GuardDuty reads from the customer's configured CloudTrail trail and VPC Flow Logs. Disabling these services stops GuardDuty from receiving data.",
        isCorrect: false,
        explanation: "GuardDuty does NOT read from customer-configured CloudTrail trails or Flow Logs. It receives its own independent duplicate stream from AWS infrastructure. This is a common misconception — many assume GuardDuty depends on customer-configured logging, but it maintains its own data pipeline independent of customer configurations."
      },
      {
        id: "D",
        text: "The claim is fully accurate. GuardDuty provides complete threat detection independent of CloudTrail and VPC Flow Logs, making both services redundant for security purposes.",
        isCorrect: false,
        explanation: "GuardDuty's independent data feeds do make it work without customer-enabled CloudTrail or Flow Logs. However, calling these services 'redundant for security purposes' is incorrect — CloudTrail and VPC Flow Logs serve critical security functions that GuardDuty does not: CloudTrail provides the long-term API audit record for compliance, investigation, and forensics; VPC Flow Logs enable network-level investigation and troubleshooting beyond GuardDuty's automated finding categories."
      }
    ],
    explanation: "GuardDuty operates on its own independent data streams that AWS provides — the customer does NOT need to enable CloudTrail trails or VPC Flow Logs for GuardDuty to function. This surprises many users who assume GuardDuty reads the customer's Flow Logs. However, GuardDuty does not replace CloudTrail trails or VPC Flow Logs for the customer — these serve different purposes: audit trail retention (CloudTrail), compliance evidence, forensic investigation of specific incidents, and network troubleshooting (Flow Logs). GuardDuty's independent feed is optimized for ML-based threat detection, not raw log retention.",
    keywords: ["GuardDuty independent logs", "does not require Flow Logs", "does not replace CloudTrail", "independent data stream"]
  },
  {
    id: "d1-040",
    domain: 1,
    taskStatement: "1.3",
    services: ["s3", "kms", "cloudtrail"],
    constraintType: "security",
    difficulty: 5,
    type: "single",
    stem: "A developer claims: 'Our S3 bucket uses SSE-KMS with an AWS managed key (aws/s3). Since the key is managed by AWS, we do not have a key policy to worry about, and any IAM principal with s3:GetObject permission can decrypt any object in the bucket.' A security engineer challenges this. Which statement CORRECTLY describes the access control behavior for SSE-KMS with an AWS managed key in the SAME account?",
    options: [
      {
        id: "A",
        text: "The developer is correct. AWS managed KMS keys do not have key policies — access is entirely controlled by IAM policies. Any IAM principal with s3:GetObject can read SSE-KMS encrypted objects.",
        isCorrect: false,
        explanation: "This is the misconception. AWS managed keys DO have key policies — they are managed by AWS and cannot be modified by customers, but they exist. The default AWS managed key policy for aws/s3 includes a policy that allows IAM principals in the account to use the key IF their IAM policies grant the relevant KMS permissions. However, the statement 'no key policy to worry about' is imprecise in a way that creates exam traps."
      },
      {
        id: "B",
        text: "The developer is partially incorrect. AWS managed keys have an AWS-managed key policy that grants account-level access via IAM. A principal needs BOTH s3:GetObject (in their IAM policy) AND kms:Decrypt permission on the aws/s3 key (either explicitly in their IAM policy or implicitly via the key policy delegation). However, the aws/s3 key policy automatically delegates to account IAM, so any principal with an IAM policy that allows both s3:GetObject and implicitly kms:Decrypt (or kms:* or *) can decrypt.",
        isCorrect: true,
        explanation: "AWS managed key policies contain a statement that grants the owning account root full access to the key, and delegates further access to IAM. This means IAM policies control access to AWS managed keys for same-account principals — unlike customer-managed CMKs where the key policy must also explicitly allow the principal. In practice, for same-account access, a principal with s3:GetObject AND kms:Decrypt (on aws/s3) can read SSE-KMS objects. The kms:Decrypt permission may be implicitly granted via AWS managed wildcard policies, which is where the confusion arises."
      },
      {
        id: "C",
        text: "The developer is fully incorrect. AWS managed keys have an immutable key policy that ONLY allows AWS services to use the key. IAM users and roles can never directly call kms:Decrypt on an AWS managed key — only the S3 service can decrypt on their behalf.",
        isCorrect: false,
        explanation: "This overstates the restriction. The AWS managed key policy delegates access to the account's IAM system. Account principals with appropriate IAM permissions CAN make direct KMS API calls (kms:Decrypt, kms:GenerateDataKey) on AWS managed keys — they are not limited to service-level access only. The S3 service does call KMS on the principal's behalf during GetObject, but the authorization check uses the requesting principal's permissions."
      },
      {
        id: "D",
        text: "The developer is incorrect. AWS managed keys (aws/s3) are not usable for SSE-KMS. You must create a customer-managed CMK to use SSE-KMS on S3.",
        isCorrect: false,
        explanation: "AWS managed keys (aws/s3) are fully valid for SSE-KMS and are in fact the default KMS key used when you select SSE-KMS without specifying a CMK. Customer-managed CMKs are optional — they provide additional control (custom key policies, manual rotation, cross-account sharing) but are not required for SSE-KMS."
      }
    ],
    explanation: "The AWS managed key (aws/s3) for S3 SSE-KMS DOES have a key policy — it is managed by AWS and cannot be modified, but it includes a root delegation statement that allows account IAM to control access. Same-account principals need both s3:GetObject AND effective kms:Decrypt permission on the key. For same-account access, the IAM policy governs (due to the root delegation in the key policy). This differs from cross-account access where both the key policy AND the external account's IAM must allow access. The trap is that 'AWS managed key = no key policy' — there IS a policy, it just cannot be modified by customers.",
    keywords: ["AWS managed key policy", "kms:Decrypt required", "aws/s3 key", "IAM delegation", "same account access"]
  }
]
