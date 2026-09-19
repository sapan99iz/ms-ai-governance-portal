# AegisAI — Enterprise Microsoft AI Governance, Risk & Threat Portal

[![Built by Sapan Patel](https://img.shields.io/badge/Built%20by-Sapan%20Patel-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sapan-patel-807321222/)
[![Portfolio](https://img.shields.io/badge/Portfolio-sapanpatel1230.github.io-cyan?style=for-the-badge&logo=github)](https://sapanpatel1230.github.io/)
[![Microsoft AI Ecosystem](https://img.shields.io/badge/Ecosystem-Microsoft%20AI%20%26%20Purview-0078D4?style=for-the-badge&logo=microsoft)](https://learn.microsoft.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **AegisAI** is an enterprise-grade AI Governance, Risk Assessment & Threat Modeling Platform designed specifically for workloads across the **Microsoft AI Ecosystem** (Microsoft 365 Copilot, Copilot Studio, Azure OpenAI Service, and Power Platform AI automation).

---

## 🌟 Live Demo & Architecture Highlights

- **Live URL**: [https://sapan99iz.github.io/ms-ai-governance-portal/](https://sapan99iz.github.io/ms-ai-governance-portal/)
- **Author**: **Sapan Patel** — AI Agent Developer & Solution Architect
- **LinkedIn**: [linkedin.com/in/sapan-patel-807321222/](https://www.linkedin.com/in/sapan-patel-807321222/)
- **Portfolio**: [sapanpatel1230.github.io](https://sapanpatel1230.github.io/)

---

## 🚀 Key Functional Sections

### 1. Dynamic Scenario Intelligence & 5x5 Risk Heatmap
- Dynamic AI governance posture scoring (0–100 scale).
- Interactive 6-dimension radar posture chart (Data Security, Prompt Defense, Model Safety, Identity & RBAC, Regulatory Compliance, Telemetry & Audit).
- Microsoft AI Risk Exposure Heatmap (Likelihood vs. Impact matrix) with 12 mapped OWASP LLM & Purview red flags.

### 2. End-to-End Security Topology & Pipeline Architecture
- Interactive 7-stage prompt security pipeline:
  1. Entra ID Zero Trust Contextual Ingress
  2. Azure AI Content Safety Prompt Shields
  3. Microsoft Purview Grounding DLP & Sensitivity Labeling
  4. Enterprise Vector DB / Graph Grounding Isolation
  5. Sandboxed LLM Execution
  6. Egress Data Loss Prevention (RMS Encryption)
  7. Microsoft Sentinel & Purview Audit Telemetry Logging

### 3. Scenario Adversarial Threat Simulator & Guardrail Sandbox
- Side-by-side parallel simulation testing how agents or automated flows can be bypassed under default settings vs. how Microsoft guardrails block them.
- Scenario-tailored vectors:
  - **Indirect Prompt Injection in Inbound Email / PDF Attachments**
  - **Excessive Agency & Autonomous Webhook Dispatch**
  - **Unencrypted PII / Credit Card Exfiltration via Auto-Replies**
  - **System Prompt Extraction & Schema Leakage**
  - **SharePoint Permissions Sprawl Mining**
  - **HIPAA PHI Clinical Health Records Leakage**
  - **CI/CD Pipeline Secrets & Azure Key Vault Exfiltration**
- Includes one-click copyable PowerShell scripts and KQL detection rules for each vector.

### 4. Zero Trust Microsoft Governance Blueprint
- Deep-dive configuration guides across 4 core Microsoft pillars:
  - **Microsoft Purview AI Hub & DLP**
  - **Azure AI Content Safety & Prompt Shields**
  - **Copilot Studio Maker Controls & Connector Isolation**
  - **Entra ID Zero Trust & PIM Access Controls**

### 5. Production Policy Scripts & Automation Playbooks
- Production-ready, copyable PowerShell scripts, KQL audit queries, and Azure CLI commands.

### 6. Official Microsoft Learn Compliance & Regulatory Directory
- Direct links and verified implementation guides for Microsoft Learn, ISO/IEC 42001, and NIST AI RMF.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS + Lucide Icons
- **Deployment**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

---

## 💻 Local Development Setup

```bash
# Clone the repository
git clone https://github.com/sapan99iz/ms-ai-governance-portal.git
cd ms-ai-governance-portal

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## 📦 Deployment to GitHub Pages

This repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

To enable GitHub Pages:
1. Push to your `main` branch.
2. Go to your repository on GitHub: **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment** $\rightarrow$ **Source**, select **GitHub Actions**.
4. The workflow will automatically build and publish the site to:
   `https://sapanpatel1230.github.io/ms-ai-governance-portal/`

---

## 👤 Author

**Sapan Patel**
- **Role**: AI Agent Developer & Solution Architect
- **Specialization**: Microsoft AI Ecosystem, Microsoft Purview, Copilot Studio, Azure OpenAI
- **Portfolio**: [https://sapanpatel1230.github.io/](https://sapanpatel1230.github.io/)
- **LinkedIn**: [https://www.linkedin.com/in/sapan-patel-807321222/](https://www.linkedin.com/in/sapan-patel-807321222/)
