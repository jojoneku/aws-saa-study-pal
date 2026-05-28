# AWS SAA-C03 Domain 1: The Complete Secure Architecture Service Atlas

**Bottom line up front:** As of May 15, 2026, **SAA-C03 is the only active version** of the AWS Certified Solutions Architect – Associate exam — SAA-C04 has *not* been released, despite widespread third-party speculation. Domain 1 ("Design Secure Architectures") accounts for **30% of scored questions** — the heaviest weight on the exam — and is structured into exactly **three task statements (1.1, 1.2, 1.3)**, not four. Although AWS's published "in-scope" appendix lags behind reality, real exam questions now routinely surface post-2022 services like **Verified Access, Verified Permissions, IAM Roles Anywhere, Security Lake, Resource Control Policies, and GuardDuty Extended Threat Detection**, so any quiz aiming for full coverage must include them. The atlas below catalogues **70+ services** across the seven sub-domains, plus 20 scenario archetypes and 13 high-yield comparison pairs that drive most of the scenario-based questions on Domain 1.

---

## 1. Exam overview

### Current status (verified May 2026)

**SAA-C03 is active with no retirement date.** Launched August 30, 2022, the exam remains the only published version of the AWS Solutions Architect – Associate. The current exam guide is **Version 1.1**, published at `https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf` and mirrored at `https://docs.aws.amazon.com/aws-certification/latest/examguides/solutions-architect-associate-03.html`. The exam is 65 questions (50 scored + 15 unscored), 130 minutes, $150 USD, with a scaled passing score of **720/1000**.

**SAA-C04 has not been released.** The AWS "Coming Soon to AWS Certification" page lists no SAA replacement as of May 2026 — the only Associate-level transition currently in motion is SOA-C02 → SOA-C03 (CloudOps), which transitioned on September 30, 2025. **Misinformation flag:** a third-party blog (citadelcloudmanagement.com) claims "SAA-C04 launched March 2024," but this is contradicted by every official AWS source and AWS Digital Training Partners including Tutorials Dojo. Treat SAA-C03 as the exam to prepare for.

### Domain weights and Domain 1 structure (SAA-C03 v1.1)

| Domain | Weight |
|---|---|
| **Domain 1: Design Secure Architectures** | **30%** |
| Domain 2: Design Resilient Architectures | 26% |
| Domain 3: Design High-Performing Architectures | 24% |
| Domain 4: Design Cost-Optimized Architectures | 20% |

Domain 1 contains **only three task statements** (there is no 1.4):

- **Task 1.1 — Design secure access to AWS resources.** Covers IAM users/groups/roles/policies, federated access (IAM Identity Center, formerly AWS SSO), multi-account governance (Control Tower, SCPs), STS and role assumption, resource policies, and the AWS Shared Responsibility Model.
- **Task 1.2 — Design secure workloads and applications.** Covers VPC architectures, security groups vs NACLs, NAT gateways, public/private subnet segmentation, threat vectors (DDoS, SQL injection), and integration of Shield, WAF, IAM Identity Center, Secrets Manager, Cognito, GuardDuty, Macie, plus VPN and Direct Connect for hybrid security.
- **Task 1.3 — Determine appropriate data security controls.** Covers data classification, encryption at rest (KMS) and in transit (ACM/TLS), key policies, backup/replication, lifecycle and retention policies, key rotation, and certificate renewal.

### Service-naming changes already reflected in v1.1

The Version 1.1 guide updated several service names without changing domain weights or structure: **AWS SSO → AWS IAM Identity Center**, **Amazon Elasticsearch Service → Amazon OpenSearch Service**, **AWS Personal Health Dashboard → AWS Health Dashboard**, and **AWS Server Migration Service was removed entirely** (retired March 31, 2023).

---

## 2. Service inventory by sub-domain

### A. Identity and access management

#### AWS IAM (Identity and Access Management)

The globally-scoped (no region) foundation of all AWS access control, governing who can call which APIs against which resources. Principals are root users (avoid for daily work), IAM users (long-lived), and IAM roles (temporary credentials via STS — preferred for everything modern).

**Memorize the seven policy types.** *Identity-based* policies attach to users/groups/roles and grant permissions. *Resource-based* policies attach to resources like S3 buckets, KMS keys, SNS, SQS, and Lambda, and uniquely include a `Principal` element for cross-account access. *Permissions boundaries* cap what an identity policy can grant but never grant by themselves. *Service Control Policies (SCPs)* attach to OUs or accounts in Organizations and set the ceiling for member accounts. *Resource Control Policies (RCPs)* — released November 2024 — do the same but at the resource level. *Session policies* are passed at `AssumeRole` time to further filter permissions. *ACLs* are the legacy cross-account mechanism on S3 and VPC peerings.

**Policy evaluation order is the single most-tested IAM concept.** Default is implicit deny. Any explicit deny anywhere in the evaluation chain wins, period. Then SCPs must allow, RCPs must allow, permissions boundaries must allow, session policies must allow, and finally at least one explicit allow in identity-based or resource-based policy is required. **Effective permissions = intersection of restrictive layers ∩ union of identity/resource allows.**

*Key exam scenarios:* EC2 accessing S3 via instance profile (never embedded keys); cross-account access via assumed role + trust policy; delegating limited admin via permissions boundaries; enforcing MFA via `aws:MultiFactorAuthPresent: true`. *Common gotchas:* IAM is **global, not regional** — never "deploy IAM per region"; SCPs don't grant permissions, only cap; explicit deny always wins; SCPs do NOT apply to the management account or service-linked roles.

#### AWS IAM Identity Center (formerly AWS SSO)

Centralized **workforce identity** for SSO across multiple AWS accounts and SAML/OIDC apps via short-lived credentials. Renamed from "AWS SSO" in July 2022; both names appear in exam questions. The identity source can be the built-in directory, AWS Managed Microsoft AD/AD Connector, or external SAML 2.0 IdPs (Okta, Microsoft Entra ID, OneLogin, Google Workspace). **Permission sets** are reusable templates that, when assigned, provision IAM roles named `AWSReservedSSO_*` in target accounts. SCIM supports automated user/group provisioning. **MFA is enabled by default** for instances created after Nov 15, 2023.

*Right answer when:* centrally managing human access across an Organizations multi-account environment without creating IAM users in each account; federating corporate Entra ID/Okta into AWS; providing temporary CLI access via `aws sso login` (60-minute credentials). *Gotchas:* only **one identity source** at a time; **single-region service** (configure in one region — set up break-glass SAML federation in another); **not for machine-to-machine** workloads; **no additional charge**. Don't confuse with Cognito (for *your app's* end users) or Directory Service (the AD backend, not the SSO portal).

#### AWS Organizations

Central multi-account governance with hierarchical OUs, consolidated billing, and organization-wide policies. The **management account** pays consolidated bills and is **not restricted by SCPs** (don't put resources here). Member accounts are subject to SCPs and RCPs. Feature sets are *Consolidated Billing only* (no policies) or *All Features* (SCPs, RCPs, tag/backup/AI policies). Maximum OU nesting is five levels.

*Right answer when:* needing volume discounts and RI/Savings Plan sharing across accounts; enforcing region restrictions via SCP with `aws:RequestedRegion`; denying ability to disable CloudTrail/GuardDuty/leave the organization; required as a prerequisite for **Control Tower**, **RAM org sharing**, **delegated administrators** for GuardDuty/Security Hub/Config. *Gotchas:* SCPs are guardrails, not grants; they don't affect the management account or service-linked roles; Consolidated-Billing-only orgs cannot use SCPs.

#### AWS Directory Service

Three flavors with **very different use cases** — heavily tested. **AWS Managed Microsoft AD** runs real Microsoft Windows Server AD in AWS across 2 AZs, supports forest trusts with on-prem AD, supports RDS for SQL Server Windows Auth, and FSx for Windows. **AD Connector** is a pure proxy/gateway to your existing on-prem AD — no data stored in AWS; requires Direct Connect/VPN for connectivity; does NOT support RDS SQL Server auth. **Simple AD** is a Samba 4 standalone directory for small/cheap deployments (≤5,000 users), no trusts, no MS-AD-specific features.

| Need | Right answer |
|---|---|
| RDS for SQL Server with Windows Auth, FSx, trusts to on-prem, ≥5k users | **Managed Microsoft AD** |
| Existing on-prem AD; want WorkSpaces/Console SSO without storing in AWS | **AD Connector** |
| ≤5k users, basic LDAP/Kerberos, no trusts, lowest cost | **Simple AD** |

#### Amazon Cognito

**The exam's favorite identity trap.** Cognito has two completely different services bundled under one name. **User Pools** do *authentication* — they're a user directory issuing JWTs (ID, access, refresh tokens). **Identity Pools** (Federated Identities) do *authorization for AWS* — they exchange tokens (from Cognito User Pool, social IdPs, SAML, OIDC, or developer-authenticated) for **temporary AWS credentials** via STS, mapped to IAM roles.

*Decision rule:* if the question mentions "**temporary AWS credentials**" or "direct access to S3/DynamoDB from mobile," the answer is **Identity Pool**. If it mentions "sign-up/sign-in," "user directory," or "API Gateway authorizer," the answer is **User Pool**. The common pattern uses both: User Pool authenticates → JWT → Identity Pool → temp AWS creds → S3 directly.

*Right answer when:* protecting API Gateway with Cognito Authorizer (User Pool); giving mobile/guest users direct S3 upload access (Identity Pool); federating social/SAML/OIDC logins; building multi-tenant SaaS with group→role mapping. *Gotchas:* Cognito is **for application end users**, NOT for AWS console SSO (that's Identity Center); Cognito Sync is deprecated.

#### AWS STS (Security Token Service)

The global service that issues temporary, limited-privilege credentials backing every role assumption in AWS. Five key operations: **AssumeRole** (cross-account/same-account role assumption — default 1 hour, max 12 hours), **AssumeRoleWithSAML** (enterprise SAML federation), **AssumeRoleWithWebIdentity** (OIDC — Cognito, EKS IRSA, GitHub Actions OIDC), **GetSessionToken** (MFA-protected API calls for IAM users, default 12 hours), and **GetFederationToken** (server-based proxy federation).

Session policies passed at `AssumeRole` time can further restrict — the result is intersection with the role policy. *Gotchas:* temporary credentials cannot be individually revoked, only expired or invalidated by policy change; **role chaining limits to 1 hour**; `GetFederationToken` and `GetSessionToken` cannot be called from temporary credentials, only from IAM users.

#### AWS Resource Access Manager (RAM)

Securely share specific AWS resources (VPC subnets, Transit Gateways, Route 53 Resolver rules, Private CA, Aurora clones, License Manager configs, IPAM pools, Outposts) across accounts or an entire Organization. **No additional cost.** The classic SAA scenario is **shared VPC**: a central networking account owns the VPC and shares subnets to workload accounts, which then launch EC2/Lambda/RDS into the shared subnets — eliminating peering sprawl.

*Gotchas:* RAM is **regional** (no cross-region sharing); you can't re-share resources shared with you; sharing subnets doesn't transfer ownership (consumer manages their own resources in the shared subnet, owner manages VPC/route tables/NACLs).

#### AWS Control Tower

Automated **landing zone orchestration** on top of Organizations, IAM Identity Center, Config, CloudTrail, and Service Catalog. Provides a pre-built multi-account baseline (Management, Log Archive, Audit accounts + Security & Sandbox OUs) with **three guardrail types**: *preventive* (implemented as SCPs), *detective* (implemented as Config rules), and *proactive* (CloudFormation Hooks).

*Right answer when:* needing a multi-account environment "in less than an hour"; enforcing mandatory guardrails (no public S3, CloudTrail in all accounts, allowed regions); centralized logging and audit; new account provisioning via Account Factory. *Don't confuse with Organizations* — Organizations is the raw multi-account service; Control Tower is the opinionated automated wrapper on top.

#### AWS IAM Roles Anywhere

Lets workloads **outside AWS** (on-prem servers, other clouds, IoT) obtain **temporary IAM credentials** by presenting X.509 certificates signed by a trusted CA — eliminating long-lived IAM access keys. Components: **trust anchor** (your CA or AWS Private CA), **profile** (selects roles + session policy), and the **AWS Signing Helper** installed on the workload. *Right answer when:* on-prem backup scripts uploading to S3 without storing keys; hybrid containers/Kubernetes outside EKS; CI/CD agents running on-prem. *Gotcha:* **not for workloads inside AWS** — use instance profiles, Lambda execution roles, ECS task roles, EKS IRSA instead.

#### AWS Verified Access

**Zero-trust application access** — secure, identity- and device-aware access to corporate web apps **without a VPN**. Components: trust providers (IAM Identity Center, OIDC IdPs for identity; Jamf, CrowdStrike, Jumpcloud for device posture), Verified Access groups, and endpoints (ALB/NLB/EC2-attached ENI). Access policies are written in **Cedar**. Every request is re-evaluated; all denied by default until policy exists.

#### Amazon Verified Permissions

Managed **fine-grained authorization** for *custom applications you build*, using the open-source Cedar policy language. Externalizes authorization logic from app code via the `IsAuthorized` API. **Critical exam distinction:** Verified **Access** = network/app entry layer (replace VPN). Verified **Permissions** = in-application authorization layer ("can user X share document Y with user Z?"). Both use Cedar but operate at completely different layers.

---

### B. Data protection and encryption

#### AWS KMS (Key Management Service)

Managed key creation, control, rotation, and audit backed by FIPS 140-3 Level 3 HSMs (upgraded from FIPS 140-2 Level 3 in February 2025 — narrowing the historical KMS-vs-CloudHSM gap). Three key types: **customer-managed CMK** (you create/manage, optional rotation 90–2,560 days since April 2024, $1/mo + usage), **AWS-managed** (`aws/<service>`, AWS rotates yearly, free), and **AWS-owned** (invisible, free).

**Key policies vs IAM policies — the most-tested KMS concept.** Every KMS key has exactly one **key policy**, which is the **root of trust**. No principal — not even the account root — has access unless the key policy explicitly allows it. IAM policies *alone* are insufficient; the key policy must first delegate to IAM (typically `"Principal": {"AWS": "arn:aws:iam::ACCT:root"}` with `"Action": "kms:*"`). For **cross-account** access you need BOTH the key policy in the key's account allowing the external account, AND an IAM policy in the external account allowing the user.

**Multi-Region keys** are *not replication of data* — they share **the same key material** across regions with the same key ID (prefix `mrk-`), so ciphertext from region A decrypts in region B without re-encryption. Each replica is an independent resource with its own policy.

**Envelope encryption** is the standard pattern: `GenerateDataKey` returns a plaintext data key + an encrypted version; the app encrypts data locally with the plaintext key and stores the encrypted key alongside the ciphertext. The CMK never leaves KMS.

*Gotchas:* KMS keys are regional (except MRKs); imported key material cannot use automatic rotation; the AWS-managed `aws/ebs` key **cannot be shared cross-account** for snapshots — you must use a customer-managed CMK.

#### AWS CloudHSM

Single-tenant, dedicated **hardware HSMs in your VPC**, FIPS 140-3 Level 3 (hsm2m.medium, GA August 2024; hsm1.medium retiring January 2026). You have exclusive ownership and root access; AWS cannot see your keys. *Right answer when:* need to **export keys** out of the HSM (KMS can't); need **PKCS#11, JCE, CNG** APIs; operating your own CA / PKI; Oracle TDE with customer-controlled keys; or as a **custom key store for KMS**. *Gotchas:* expensive (~$1.45/hr per HSM × multi-AZ cluster), you manage users/key lifecycle/backups, lives in your VPC (not regional public endpoint), doesn't directly integrate with most AWS services without the KMS custom-key-store wrapper.

#### AWS Secrets Manager

Managed storage with **built-in automatic rotation** via Lambda for RDS (all engines), Aurora, Redshift, DocumentDB. **$0.40/secret/month + $0.05/10,000 API calls.** Cross-region replication and cross-account access via resource-based policies are built in. Max secret size 64 KB.

#### AWS Systems Manager Parameter Store

Hierarchical key/value config store with String, StringList, and **SecureString** (KMS-encrypted) types. **Standard tier is free**; Advanced tier ($0.05/param/month) supports 8 KB values, 100k params, and parameter policies. Native cross-reference to Secrets Manager via `/aws/reference/secretsmanager/<name>`.

The **Secrets Manager vs Parameter Store decision rule** — heavily tested:

| Need | Right answer |
|---|---|
| Auto-rotate credentials | **Secrets Manager** |
| Cross-region replication, cross-account via resource policy | **Secrets Manager** |
| Generate random passwords automatically | **Secrets Manager** |
| Native RDS/Redshift/DocDB rotation integration | **Secrets Manager** |
| Static config (URLs, AMI IDs, feature flags), no rotation, free | **Parameter Store** |
| Hierarchical path namespace with path-based IAM | **Parameter Store** |

#### AWS Certificate Manager (ACM) and ACM Private CA

**ACM** issues **free public TLS certificates** via Amazon Trust Services and auto-renews them (60 days before expiration) for ACM-integrated services (ALB, NLB, CloudFront, API Gateway, App Runner). Public cert validity is ~13 months. *Critical gotcha:* certs for **CloudFront must live in us-east-1**. ACM **cannot export the private key of a standard public cert**, so it can't install directly on a standalone EC2 (use ALB in front, or use Exportable certs as paid option).

**ACM Private CA** (AWS Private Certificate Authority) provides managed private PKI for internal certs (mTLS, internal sites, EKS workloads, code signing). ~$400/month per CA — expensive — but private certs auto-renew like public ones when used with integrated services.

#### S3 encryption options

**As of January 5, 2023, SSE-S3 is the default for all new objects in all buckets.** You can override with any of these:

| Option | Keys managed by | Use case |
|---|---|---|
| **SSE-S3** (default) | AWS, internal | Baseline; free; no audit visibility |
| **SSE-KMS** | KMS (managed or customer) | Audit trail, key policies, control |
| **DSSE-KMS** (June 2023) | Two independent KMS layers | DoD IL5, CNSSP 15, top-secret |
| **SSE-C** | Customer (NOT stored in AWS) | You must retain the key |
| **CSE-KMS / CSE-C** | Client-side w/ KMS or customer | AWS only sees ciphertext |

**S3 Bucket Keys** reduce KMS calls by ~99% by caching a bucket-level intermediate key — significant cost savings at scale, but **not compatible with DSSE-KMS**. *Critical gotchas:* SSE-C keys are never stored by AWS — if lost, data is unrecoverable; default bucket encryption configuration cannot be SSE-C; server access logging destination buckets must use SSE-S3 (cannot use SSE-KMS). **Note for 2026:** AWS announced at re:Invent 2025 that **SSE-C will be disabled starting April 2026 for new buckets and existing buckets without SSE-C data**.

#### EBS, RDS, and DynamoDB encryption

**EBS encryption** uses AES-256 via KMS; account/region-level "Encryption by default" auto-encrypts all new volumes. **Sharing encrypted snapshots cross-account requires a customer-managed CMK** (not the default `aws/ebs`) AND sharing the CMK key policy; encrypted snapshots can never be made public. Converting an unencrypted volume requires snapshot → copy with `--encrypted` → restore.

**RDS** encryption at rest must be enabled at DB creation (cannot encrypt in place — snapshot → copy as encrypted → restore is the workaround). SSL/TLS in transit is supported on all engines and can be forced via parameter groups. **TDE** is available only for Oracle Enterprise Edition and SQL Server Enterprise/Standard via option groups.

**DynamoDB** encryption at rest is **on by default and cannot be disabled**. Three key options: AWS-owned (free, default), AWS-managed (`aws/dynamodb`, paid, limited audit), or customer-managed CMK (full control, supports cross-account via key policy). Global Tables should use Multi-Region CMKs for cross-region consistency.

#### AWS Payment Cryptography

PCI-compliant managed payment HSMs (PCI PTS HSM v3 + FIPS 140-2 Level 3) for PIN block translation/verification, EMV ARQC/ARPC, CVV/CVV2, MAC, DUKPT. *Right answer when:* migrating from on-prem payment HSMs; need PCI-PIN/P2PE compliance without managing dedicated hardware. Distinct from KMS (general crypto) and CloudHSM (general HSM).

---

### C. Network security

#### Amazon VPC primitives

A VPC contains subnets (each pinned to one AZ), route tables, and gateways. Public subnets have a route to an Internet Gateway; private subnets route 0.0.0.0/0 to a NAT Gateway for outbound only. **AWS reserves 5 IPs per subnet** (.0, .1, .2, .3, .255) — a /28 has only 11 usable. **Egress-Only Internet Gateway (EIGW)** is the IPv6 equivalent of NAT GW; NAT Gateway does NOT support IPv6 (common exam trap).

**NAT Gateway vs NAT Instance** is heavily tested. NAT Gateway is AWS-managed, starts at 5 Gbps and auto-scales to 100 Gbps, cannot have a security group, and is **highly available within a single AZ only** — for true HA you must deploy **one NAT Gateway per AZ** with route tables pointing each AZ's private subnets to the local NAT GW. NAT Instance is a self-managed EC2 with a security group, can do port forwarding, and can double as a bastion, but is a SPOF without custom scripting. AWS recommends NAT Gateway except at very low traffic where cost dominates.

#### Security Groups vs Network ACLs

Among the most-tested topics in Domain 1.

| | Security Group | NACL |
|---|---|---|
| Scope | Instance (ENI) | Subnet |
| State | **Stateful** | **Stateless** |
| Rules | **Allow only** | **Allow + Deny** |
| Evaluation | All rules together | **Numbered order, first match** |
| Targets | CIDR, SG ID, prefix list | **CIDR only** |
| Per-resource | Multiple per ENI | One per subnet |

*Decision rule:* if the question asks to **block a specific malicious IP**, the answer is **NACL** (SGs can't deny). If it asks to **allow web tier → DB tier**, the answer is **SG referencing another SG**. Stateless NACLs require allowing **both directions including ephemeral return ports (1024-65535)**. NAT Gateways cannot have a security group — control traffic via the private instance's SG or subnet NACL.

#### VPC Endpoints, PrivateLink, Peering, Transit Gateway

**Gateway endpoints** are FREE route-table entries that provide private connectivity to **S3 and DynamoDB only**. They do **not work from on-premises, peered VPCs, or via Transit Gateway** — for those scenarios, use an S3 Interface endpoint.

**Interface endpoints (PrivateLink)** are ENIs in your subnet providing private connectivity to 100+ AWS services and third-party SaaS. Cost ~$0.01/hour per AZ + $0.01/GB. SGs can be attached; private DNS overrides public hostnames.

**AWS PrivateLink** is the underlying technology letting a service provider expose a single service (behind NLB or GWLB) to consumer VPCs/accounts privately — uniquely **supports overlapping CIDR blocks**, which peering does not.

**VPC Peering** is 1:1 bidirectional connectivity with **no transitive routing** (if A↔B and B↔C, A cannot reach C through B) and **CIDRs must not overlap**. Best for ≤10 VPCs. **Transit Gateway** is a regional hub-and-spoke router connecting many VPCs, VPNs, and Direct Connect Gateways with transitive routing; supports cross-region peering and centralized inspection patterns. Costs more than peering (per-attachment hourly + per-GB) but scales to thousands of attachments.

| Scenario | Right answer |
|---|---|
| Private S3/DDB access, save NAT cost | **S3/DDB Gateway endpoint** (free) |
| Private SSM/ECR/KMS access | **Interface endpoint** |
| Expose your service to consumer VPCs (overlapping CIDR OK) | **PrivateLink** |
| Connect 2 VPCs, non-overlapping CIDR | **VPC Peering** |
| Connect 20+ VPCs and on-prem | **Transit Gateway** |

#### Site-to-Site VPN, Client VPN, Direct Connect

**Site-to-Site VPN** is IPsec **over the public internet** between an on-prem customer gateway and an AWS VGW or Transit Gateway. Each VPN connection has **two tunnels** for HA; **standard tunnel bandwidth is up to 1.25 Gbps per tunnel** (Large Bandwidth Tunnels support up to 5 Gbps on TGW/Cloud WAN, a 2024-2025 feature). Quick to set up (minutes), latency is variable (internet-dependent).

**Client VPN** is managed **OpenVPN-based (TLS, not IPsec)** for individual user devices to connect to VPCs. Supports MFA via SAML/AD; mutual TLS cert-based authentication. *User-to-network*, not network-to-network.

**Direct Connect (DX)** is a dedicated **physical** connection (1/10/100/400 Gbps) from on-prem into AWS via a partner DX location. Predictable latency, higher bandwidth, lower egress cost. **Critical exam gotcha: DX is NOT encrypted by default.** To encrypt: run a Site-to-Site VPN tunnel over DX (layer 3 IPsec, works on any DX) or use **MACsec** (layer 2, only on dedicated 10/100/400 Gbps connections at supported PoPs — not 1 Gbps or hosted). Provisioning takes weeks; HA pattern is DX + VPN backup, or two DX at different locations.

#### Network Firewall, WAF, Shield, Firewall Manager

**AWS Network Firewall** is a managed stateful firewall + IPS at the **VPC perimeter** supporting Suricata-compatible rules, deep packet inspection, layers 3–7, TLS inspection, and domain/FQDN filtering. Deployed per AZ; expensive at scale. Common in **TGW + inspection VPC** centralized-egress patterns.

**AWS WAF** is a **layer-7 HTTP/HTTPS** firewall via Web ACLs (managed rules, custom rules, rate-based, geo-blocking, Bot Control). Integrates with **CloudFront, ALB, API Gateway, AppSync, Cognito user pools, App Runner, Verified Access**, and Amplify. *Does NOT* attach to NLB, EC2 directly, or arbitrary TCP traffic (use Network Firewall).

**AWS Shield Standard** is free automatic L3/L4 DDoS protection for all customers. **Shield Advanced** is $3,000/month with a 1-year commitment, adding L7 protection (via WAF), 24/7 Shield Response Team access, **DDoS cost protection** (refunds scaling costs during attacks on protected resources), and advanced reporting. Protected resources: CloudFront, Route 53, Global Accelerator, ALB, CLB, EC2 Elastic IPs.

**AWS Firewall Manager** centrally manages WAF Web ACLs, Shield Advanced, Network Firewall, Route 53 Resolver DNS Firewall, VPC Security Groups, and Network ACLs across an entire Organization. **Requires Organizations (all features) + Config enabled in every member account and region + a delegated administrator account**.

#### Route 53 Resolver DNS Firewall and VPC Flow Logs

**Route 53 Resolver DNS Firewall** filters **outbound DNS queries from your VPC**. Use AWS Managed Domain Lists (Malware, Botnet C&C, Aggregate Threat List — sharing intel with GuardDuty) or custom lists. Actions: ALLOW, BLOCK (NODATA / NXDOMAIN / OVERRIDE), ALERT. **DNS Firewall Advanced** (2025) adds ML-based DGA and DNS tunneling detection.

**VPC Flow Logs capture IP traffic metadata — NOT packet contents** (massive exam trap). For packet contents you need **VPC Traffic Mirroring**. Aggregation intervals are 1 or 10 minutes (not real-time). Logs go to CloudWatch Logs, S3, or Kinesis Firehose. Does not log VPC+2 DNS resolver traffic, DHCP, Windows license activation, instance metadata, or 169.254.x.x.

---

### D. Detection, monitoring, and compliance

#### AWS CloudTrail

The AWS auditing/governance "black box recorder" — records every API call in immutable JSON logs. **Management events** (control plane) are on by default with 90-day Event History; first trail copy is free. **Data events** (S3 object-level, Lambda Invoke, DynamoDB item-level) are opt-in and always billed. **Insights events** apply ML to detect anomalies in API call rates/error rates. **Network activity events** (newer) cover VPC endpoint actions.

*The #1 exam confusion is CloudTrail vs Config:* **CloudTrail = who did what API call. Config = configuration state and compliance.** CloudTrail does not analyze logs for threats (that's GuardDuty); it just records. Pair with CloudWatch Logs metric filters for alarms on root logins, IAM changes, security group changes (classic CIS benchmark pattern).

#### Amazon CloudWatch (security uses)

For Domain 1 specifically, focus on the **CloudTrail → CloudWatch Logs → Metric Filter → Alarm → SNS** pattern for detecting security events. Examples: failed console logins, root account usage, IAM policy changes, security group changes. **CloudWatch Logs Insights** is the ad-hoc query language for security investigation. Note that CloudWatch *does not detect threats itself* — it observes and alerts based on patterns you define.

#### AWS Config

Continuously records **configuration state** and evaluates resources against **rules** (managed or custom Lambda-backed). **Conformance packs** bundle rules + remediations as a single deployable unit (pre-built for HIPAA, PCI DSS, NIST, CIS, FedRAMP). **Remediation** runs via SSM Automation documents. **Aggregator** provides multi-account/multi-region central view.

*Required by Security Hub* for most compliance checks — if Config is disabled, Security Hub controls show "No data." Config is **regional** — enable in every region. Don't confuse Config (state/compliance) with CloudTrail (API actions).

#### Amazon GuardDuty

Managed **threat detection** via ML analysis of CloudTrail management events, VPC Flow Logs, and DNS query logs (all independent duplicate streams — you don't need to enable your own flow logs). Opt-in protection plans add **S3 Protection**, **EKS Audit Log Monitoring**, **Malware Protection for EC2** (agentless EBS snapshot scan), **Malware Protection for S3** (GA June 2024), **RDS Protection**, **Lambda Protection**, **Runtime Monitoring** (OS-level for EC2/EKS/Fargate), and **Extended Threat Detection** (December 2024 — auto-correlates signals into MITRE ATT&CK-mapped AttackSequence findings).

*Right answer when:* detecting compromised EC2 with C2/Tor/cryptojacking traffic; unusual API calls from foreign IPs; data exfiltration from S3; agentless malware scan. *Gotchas:* GuardDuty **detects but doesn't prevent** — pair with EventBridge + Lambda/SSM for response; **regional service** (enable in all regions, even unused).

#### Amazon Macie

Managed **PII/sensitive data discovery in S3** via ML and pattern matching. Managed data identifiers cover credit cards, AWS secret keys, passports per country, etc.; custom identifiers support your regex + keywords. Supports automated daily sampling or scheduled discovery jobs. **S3 only** — not RDS, DynamoDB, EBS, EFS.

#### AWS Security Hub

**Aggregates and normalizes findings** from GuardDuty, Inspector, Macie, IAM Access Analyzer, Firewall Manager, and third-party tools, AND continuously evaluates your environment against industry standards: **AWS Foundational Security Best Practices (FSBP)** (default), **CIS AWS Foundations Benchmark** (v1.2/v1.4/v3.0/v5.0), **PCI DSS v3.2.1/v4.0.1**, **NIST SP 800-53 Rev. 5**, **NIST SP 800-171 Rev. 2**. Findings use the **AWS Security Finding Format (ASFF)**. **Requires AWS Config** for most compliance controls.

#### Amazon Inspector (v2)

Continuous **vulnerability scanning** for **EC2** (SSM agent-based or agentless EBS snapshot), **ECR container images** (push-time + continuous), and **Lambda** functions/layers (added November 2022 at re:Invent). Detects CVEs in OS packages + language dependencies + Lambda code. Provides **Inspector risk score** combining CVSS, network reachability, and exploitability for prioritization. Does NOT scan S3, RDS, DynamoDB.

#### Amazon Detective

**Security investigation** via behavior graph database — ingests CloudTrail, VPC Flow Logs, GuardDuty findings, EKS audit logs, and (optionally) Security Hub/Inspector findings/Security Lake. Up to **one year of historical data**. *Detective is for investigation, NOT detection* — it does not generate findings, it correlates and visualizes them. Requires GuardDuty enabled for 48 hours before activation.

#### AWS Audit Manager

Continuously collects evidence from CloudTrail, Config, Security Hub, and IAM, and maps it to controls in compliance frameworks: SOC 2, PCI DSS, HIPAA, GDPR, ISO 27001, FedRAMP Moderate, NIST 800-53 Rev 5, CIS, GxP 21 CFR Part 11. **Important 2026 note:** AWS announced Audit Manager will **stop accepting new customers on April 30, 2026**; existing customers continue, and AWS recommends migrating to Config Conformance Packs for new deployments. Still on the SAA-C03 exam.

#### AWS Artifact, Trusted Advisor, IAM Access Analyzer

**AWS Artifact** is the portal for downloading **AWS's own compliance reports** (SOC 1/2/3, PCI DSS AoC, ISO 27001/17/18, HIPAA, FedRAMP, GDPR) and signing **agreements (HIPAA BAA, NDA, GDPR DPA)**. The compliance trio memory aid: **Artifact = AWS's docs; Audit Manager = your evidence; Security Hub = posture checks**.

**AWS Trusted Advisor** is the automated best-practices inspector across cost, performance, security, fault tolerance, and service limits. Basic/Developer plans get only 7 core security checks (S3 bucket permissions, SG specific ports unrestricted, IAM use, MFA on root, EBS/RDS public snapshots, service limits). **Full security checks require Business, Business+, or Enterprise Support.**

**IAM Access Analyzer** uses **automated reasoning** to identify resources shared **externally** (free), **unused** IAM access (paid; added November 2023), **internal access paths** (newer, paid), and to **validate or generate policies**. Don't confuse with Access Advisor (the IAM console feature showing last-used service dates).

---

### E. Edge / perimeter security

#### Amazon CloudFront

Global CDN with deep security integrations. **Origin Access — heavily tested:**

| | **OAI (Origin Access Identity)** | **OAC (Origin Access Control)** |
|---|---|---|
| Status | **Legacy** (still works) | **Current standard** (GA Aug 2022) |
| Auth | Special CloudFront user (canonical ID) | **SigV4 signing** with CloudFront service principal |
| Regions | Only pre-Dec 2022 regions | **All regions including new opt-in** |
| SSE-KMS support | ❌ No | ✅ Yes |
| Dynamic PUT/POST/DELETE | ❌ No | ✅ Yes |
| Per-distribution restriction | ❌ No | ✅ Yes (via `AWS:SourceArn`) |

*New CloudFront → S3 deployments must use OAC.* OAI shows up in "what's wrong here" scenarios.

**Signed URLs vs Signed Cookies:**

| | Signed URL | Signed Cookie |
|---|---|---|
| Use case | **One file** (PDF, installer, image) | **Multiple files** (HLS streaming, members area) |
| URL changes? | Yes (contains signature) | **No — auth via cookies** |

**Field-level encryption** asymmetrically encrypts specific POST form fields (credit card #, SSN) at the edge with a public key, so only the back-end PCI environment with the private key can decrypt — additional layer beyond HTTPS. **Geo-restriction** is country-level allow/block list. *Critical gotcha:* ACM certs for CloudFront **must be in us-east-1** regardless of origin region.

#### AWS Global Accelerator

Two **static anycast IPs** routing user traffic over the AWS backbone to optimal endpoints across regions. **Built on AWS edge with Shield Standard automatic + Shield Advanced eligible.** *Right answer when:* the workload is **non-HTTP TCP/UDP** (gaming, IoT, MQTT, VoIP — CloudFront is HTTP/S only); needing **static IPs** for client/firewall whitelisting; multi-region failover with fast convergence. *Not a CDN* — no caching (that's CloudFront).

#### Amazon Route 53

DNS with three Domain 1 security angles. **DNSSEC** cryptographically signs DNS records to prevent spoofing — Route 53 supports DNSSEC signing for **public hosted zones** (not private) and DNSSEC for domain registration. The **KSK (Key Signing Key) must be in AWS KMS as asymmetric ECC_NIST_P256 in us-east-1**. **Route 53 Resolver DNS Firewall** (covered above) filters outbound DNS. **Private hosted zones** keep internal DNS off the public internet.

---

### F. Incident response and recovery

#### AWS Backup

Centralized policy-based backup across EC2/EBS, RDS, DynamoDB, EFS, FSx, Aurora, Storage Gateway, S3, Neptune, DocumentDB, Redshift, Timestream, and VMware on-prem. **Vault Lock** provides WORM immutability: **Governance mode** (privileged users can override) or **Compliance mode** (irreversible after 3-day grace period — **nobody can delete, not even root or AWS Support**; assessed for SEC 17a-4, CFTC, FINRA). **Logically air-gapped vaults** (newer) add cross-account isolation for ransomware defense. Cross-region and cross-account copy are built in.

#### AWS Elastic Disaster Recovery (DRS)

**Continuous block-level replication** of physical/virtual/cloud servers to a low-cost staging area in AWS — RPO of seconds, RTO of 5–20 minutes. Formerly **CloudEndure Disaster Recovery**. Lightweight Replication Agent on source → staging EBS in target region → full EC2 launch on failover or drill. *Right answer when:* on-prem VMware/Hyper-V/physical DR into AWS with seconds RPO; cross-region DR where snapshot/AMI copy is too slow; ransomware recovery to a known-clean point-in-time. **Not for database-level replication** (use RDS read replicas or Aurora Global Database).

#### AWS Systems Manager

The Domain 1 SSM star is **Session Manager** — browser/CLI shell access to EC2/on-prem with **no SSH keys, no bastion, no inbound ports, no public IP needed**. Access is via IAM (`AmazonSSMManagedInstanceCore` on the instance + `ssm:StartSession` on the user); session logs go to S3/CloudWatch Logs encrypted with KMS. Works on private subnets via VPC interface endpoints for `ssm`, `ssmmessages`, `ec2messages`. **For "secure EC2 access" questions, Session Manager is the SAA-preferred answer over bastion hosts or Site-to-Site VPN.**

Other SSM capabilities tested: **Patch Manager** (automated OS patching — *applies* patches, vs Inspector which *detects* missing patches), **Run Command** (IR forensics across fleets), **Automation documents** (used as Config remediation actions), **Incident Manager** (coordinated IR with runbooks and escalation), and **Parameter Store** (covered earlier).

---

### G. Specialized and often-forgotten Domain 1 services

#### AWS Signer

Managed **code-signing service**. Signs Lambda `.zip` deployment packages (enforced via Code Signing Configuration — Warn or Enforce mode), IoT firmware (using an ACM-imported cert), and container images in ECR via Notation/Notary. Separates code-signing authority (admin role) from deployment (developer role).

#### AWS Clean Rooms

Multi-party **privacy-preserving data collaboration** — parties analyze combined datasets without sharing raw data. Analysis rules restrict allowed queries; Clean Rooms ML supports custom and lookalike modeling; cryptographic computing encrypts sensitive join columns; differential privacy controls aggregation thresholds. Zero-ETL with Snowflake; synthetic dataset generation added re:Invent 2025. *Right answer when:* retailer + ad publisher measure campaigns without sharing customer lists; healthcare/financial joint analytics.

#### Amazon Security Lake

Managed **security data lake** centralizing logs from AWS (CloudTrail, VPC Flow Logs, Route 53 Resolver, Security Hub findings, EKS audit, WAF), on-prem, SaaS, and custom sources into a customer-owned S3 bucket in **OCSF (Open Cybersecurity Schema Framework) + Apache Parquet/Iceberg**. Subscribers (SIEM tools, Athena, OpenSearch) query the lake. Different from Security Hub (which aggregates *findings*, not raw logs) and CloudTrail Lake (CloudTrail-only audit store).

#### AWS Wickr

End-to-end-encrypted (AES-256) enterprise messaging/voice/video with FedRAMP High and DoD IL4/IL5. **The enterprise AWS Wickr product is active and being developed**; the consumer **Wickr Me was shut down December 31, 2023**, and Wickr Pro legacy was discontinued January 31, 2024. *Right answer when:* secure executive/board/M&A comms; government tactical messaging; incident-response out-of-band channel during a breach.

#### AWS Resilience Hub

Defines **resiliency policies (RTO/RPO targets)** for four disruption types (application, infrastructure, AZ, region failure) and assesses applications against them, generating recommendations, SSM-based SOPs, and CloudWatch alarms. Integrates with **AWS Fault Injection Service (FIS)** for chaos experiments. Not a backup service (use AWS Backup) and not DR orchestration (use AWS DRS), but plays a Domain 1 role where "secure architecture" overlaps with resilience requirements.

---

## 3. High-yield scenario archetypes

These 24 scenarios cover the patterns that drive most Domain 1 scenario-based questions. They form the spine of any quiz bank.

| # | Scenario | Right answer |
|---|---|---|
| 1 | Securely store database credentials with automatic rotation | **Secrets Manager** with managed RDS rotation |
| 2 | Encrypt data at rest and control key access cryptographically | **KMS customer-managed CMK** + key policy |
| 3 | Replace SSH bastion hosts with browser-based shell access | **SSM Session Manager** |
| 4 | Block SQL injection and XSS at the edge | **AWS WAF** on CloudFront/ALB |
| 5 | Detect compromised EC2 instance behavior | **GuardDuty** (with optional Malware Protection) |
| 6 | Centrally manage WAF rules across many accounts | **Firewall Manager** (with Organizations + Config) |
| 7 | Cross-account S3 access with least privilege | **IAM role assumption** + S3 bucket policy |
| 8 | Discover PII in S3 buckets | **Macie** |
| 9 | Compliance audit reports for SOC 2 / PCI | **AWS Artifact** (download AWS's reports) |
| 10 | Continuously evidence YOUR compliance posture | **Audit Manager** (with Config + Security Hub) |
| 11 | Find IAM roles shared externally or with excess permissions | **IAM Access Analyzer** |
| 12 | DDoS protection with cost refunds and SRT access | **Shield Advanced** |
| 13 | Private S3 access from EC2, avoid NAT costs | **S3 Gateway VPC endpoint** |
| 14 | Private access to SSM/ECR/KMS from private subnets | **Interface endpoints (PrivateLink)** |
| 15 | Connect 50+ VPCs and on-prem with transitive routing | **Transit Gateway** (shared via RAM) |
| 16 | Encrypt Direct Connect traffic end-to-end | **VPN over DX** or **MACsec** (10G+ dedicated) |
| 17 | Block outbound DNS to malware/phishing domains | **Route 53 Resolver DNS Firewall** |
| 18 | Vulnerability scan EC2, ECR, and Lambda continuously | **Inspector v2** |
| 19 | Investigate the blast radius after a GuardDuty finding | **Amazon Detective** |
| 20 | Single pane of glass for findings + CIS/PCI/NIST compliance | **Security Hub** |
| 21 | Immutable backups for ransomware/regulatory WORM | **AWS Backup Vault Lock (Compliance mode)** |
| 22 | DR with seconds RPO from on-prem VMware to AWS | **AWS DRS** (Elastic Disaster Recovery) |
| 23 | Federated SSO across many AWS accounts for employees | **IAM Identity Center** (with external IdP) |
| 24 | Mobile app users get temporary AWS credentials to upload to S3 | **Cognito Identity Pool** (typically chained from User Pool) |
| 25 | On-prem workloads call AWS APIs without long-lived keys | **IAM Roles Anywhere** (with X.509 certs) |
| 26 | Replace VPN with zero-trust per-request app access | **AWS Verified Access** (Cedar policies) |
| 27 | Externalize fine-grained authz from custom app code | **Amazon Verified Permissions** (Cedar) |
| 28 | Centralize security logs in OCSF for SIEM consumption | **Amazon Security Lake** |
| 29 | Enforce code signing on Lambda deployments | **AWS Signer** + Code Signing Configuration |
| 30 | Multi-party analytics without sharing raw datasets | **AWS Clean Rooms** |

---

## 4. Service comparison pairs — the subtle distinctions exam loves

| Comparison | Mnemonic / decision rule |
|---|---|
| **Security Group vs NACL** | SG = **S**tateful + **S**G-references + allow-only at instance; NACL = stateless + CIDR-only + allow+deny ordered at subnet. **Block a specific IP? NACL.** |
| **Secrets Manager vs SSM Parameter Store SecureString** | Auto-rotation, cross-region, cross-account, RDS-native → **Secrets Manager** ($0.40/mo). Otherwise → **Parameter Store** (free). |
| **KMS vs CloudHSM** | KMS = managed, multi-tenant, AWS-service integration. **CloudHSM when you need: export keys, PKCS#11/JCE/CNG, own CA root, single-tenant dedicated hardware.** |
| **GuardDuty vs Inspector vs Macie vs Detective** | GuardDuty = **threats now (ML on logs)**. Inspector = **CVE/vulns pre-attack**. Macie = **PII in S3 only**. Detective = **investigate after a finding (graph)**. All four push to Security Hub. |
| **ACM vs ACM Private CA** | ACM public = **free + Amazon-trusted + auto-renew** for ALB/CloudFront/API GW. ACM Private CA = **$400/mo private PKI** for internal mTLS/EKS/IoT. |
| **IAM Identity Center vs Cognito vs Directory Service** | Identity Center = **AWS console SSO for employees**. Cognito = **YOUR app's end users** (User Pool authn / Identity Pool AWS creds). Directory Service = **the AD backend** (Managed MS AD / AD Connector / Simple AD). |
| **Shield Standard vs Advanced** | Standard = **free, automatic L3/L4**. Advanced = **$3K/mo + 1-yr commit, L7 via WAF, SRT 24/7, DDoS cost protection**. |
| **Site-to-Site VPN vs Client VPN vs Direct Connect** | Site-to-Site = **network-to-network IPsec over internet, ~1.25 Gbps/tunnel**. Client = **user-to-network OpenVPN with MFA/SAML**. DX = **dedicated physical, NOT encrypted by default**. |
| **VPC Peering vs Transit Gateway vs PrivateLink** | Peering = **1:1 no transit, no overlapping CIDR**. TGW = **many-to-many transitive hub, costs more**. PrivateLink = **service-consumer model, supports overlapping CIDRs, no full reachability**. |
| **CloudFront OAI vs OAC** | OAI = **legacy** (no SSE-KMS, no new regions, no dynamic methods). OAC = **current** (SigV4, all regions, SSE-KMS, per-distribution restriction). **New deployments use OAC.** |
| **SSE-S3 vs SSE-KMS vs SSE-C vs DSSE-KMS** | SSE-S3 = **default, free, no audit**. SSE-KMS = **audit + key policies** (+ enable Bucket Keys for cost). SSE-C = **you own the key, AWS never stores it**. DSSE-KMS = **two independent KMS layers** for IL5/CNSSP 15. |
| **IAM policy vs Resource policy vs SCP vs Permissions Boundary vs Session policy vs RCP** | Identity & resource = **grant**. SCP, RCP, boundary, session = **cap only**. **Explicit deny anywhere wins. Effective = intersection of caps ∩ union of grants.** |
| **CloudTrail vs Config** | CloudTrail = **WHO did WHAT API call**. Config = **STATE of resources + compliance over time**. The #1 confusion in Domain 1. |
| **Artifact vs Audit Manager vs Security Hub** | Artifact = **AWS's compliance docs to download**. Audit Manager = **continuous evidence collection for YOUR audit**. Security Hub = **continuous posture checks against CIS/PCI/NIST/FSBP**. |
| **VPC Flow Logs vs Traffic Mirroring** | Flow Logs = **metadata only** (5-tuple, accept/reject, bytes). Traffic Mirroring = **full packet contents** for IDS/IPS appliances. **"Inspect payload" ≠ Flow Logs.** |
| **NAT Gateway vs NAT Instance vs Egress-Only IGW** | NAT GW = **managed, 5–100 Gbps, no SG, one per AZ for HA**. NAT Instance = **legacy EC2-based**. EIGW = **IPv6 outbound only** (NAT GW does NOT support IPv6). |

---

## 5. Recent changes (2024–2026) that may surface on the exam

### Service renames already reflected

The v1.1 SAA-C03 exam guide updates **AWS SSO → IAM Identity Center**, **Amazon Elasticsearch Service → OpenSearch Service**, and **AWS Personal Health Dashboard → AWS Health Dashboard**, and **removes AWS Server Migration Service** (retired March 31, 2023).

### Newly relevant Domain 1 services appearing in real exam questions

Although AWS's "in-scope" appendix is non-exhaustive, these post-2022 services are consistently reported in current SAA-C03 questions:

- **AWS Verified Access** (GA April 2023; non-HTTPS preview re:Invent 2024; GA mid-2025) for zero-trust app access.
- **Amazon Verified Permissions** (GA June 2023) for Cedar-based fine-grained authorization.
- **IAM Roles Anywhere** (GA July 2022) for X.509-based hybrid workload identity.
- **Amazon Security Lake** (GA May 2023) for OCSF-based centralized security logs.
- **AWS Clean Rooms** (GA March 2023; multicloud Dec 2024; ML synthetic data Dec 2025) for privacy-preserving collaboration.
- **AWS Resource Control Policies (RCPs)** and **Organizations Declarative Policies** (both GA re:Invent 2024) for org-wide resource-level "data perimeter" enforcement.

### Major feature additions

**GuardDuty Extended Threat Detection** (re:Invent 2024, expanded for EC2/ECS at re:Invent 2025) auto-correlates signals into MITRE ATT&CK-mapped AttackSequence critical findings. **GuardDuty Malware Protection for S3** went GA June 2024. **AWS Security Incident Response** (GA December 2024) provides 24/7 AWS CIRT access for triage and recovery. **AWS Network Firewall Geographic IP Filtering** and **Route 53 Resolver DNS Firewall Advanced** both shipped at re:Invent 2024. **KMS HSMs upgraded to FIPS 140-3 Level 3** (February 2025), narrowing the historical KMS-vs-CloudHSM gap. **KMS customer-managed CMK rotation became configurable from 90–2,560 days** (April 2024). **IAM Access Analyzer added unused-access analysis** (November 2023) and **internal-access analyzers** (re:Inforce 2025). **AWS Backup added logically air-gapped vaults** for cross-account ransomware defense.

### Heads-up for 2026

**AWS Audit Manager will stop accepting new customers on April 30, 2026** — existing customers continue, but AWS recommends migrating to AWS Config Conformance Packs. Audit Manager is **still on the exam blueprint**, so it remains relevant for quiz content. **S3 SSE-C will be disabled for new buckets and existing buckets without SSE-C data starting April 2026** per re:Invent 2025 announcement. **AWS re:Inforce was merged into re:Invent** going forward, ending the separate security conference.

---

## Conclusion

The shape of Domain 1 is stable: **30% of the exam, three task statements, no SAA-C04 in sight as of May 2026**. What has changed is the *surface area* — AWS's published in-scope appendix lags reality, and real questions routinely test post-2022 services like Verified Access, Verified Permissions, IAM Roles Anywhere, Security Lake, RCPs, and GuardDuty Extended Threat Detection, even though those aren't all in the appendix verbatim. A quiz bank built for full Domain 1 coverage should include all 70+ services catalogued here, weight scenario questions toward the 24 archetypes in section 3, and exploit the 13 comparison pairs in section 4 — those distinctions alone resolve roughly 80% of scenario-based Domain 1 questions. The most efficient study order for a candidate is the policy-evaluation logic first (it underpins every IAM scenario), then the SG-vs-NACL and endpoint-vs-PrivateLink-vs-peering-vs-TGW network grid, then the four-detection-service confusion matrix (GuardDuty / Inspector / Macie / Detective + Security Hub aggregation), and finally the data-protection layer where SSE options, KMS key policies, and Secrets-Manager-vs-Parameter-Store account for the majority of remaining traps.