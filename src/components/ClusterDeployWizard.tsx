'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, Cloud, CheckCircle2 } from 'lucide-react';

export default function ClusterDeployWizard() {
  const [targetCloud, setTargetCloud] = useState<'k8s' | 'helm' | 'terraform' | 'systemd'>('k8s');
  const [copied, setCopied] = useState(false);
  const [clusterNamespace, setClusterNamespace] = useState('production');

  const configs: Record<string, { title: string; filename: string; code: string }> = {
    k8s: {
      title: 'Kubernetes eBPF DaemonSet Manifest',
      filename: 'immunix-daemonset.yaml',
      code: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: immunix-ebpf-mesh
  namespace: ${clusterNamespace}
  labels:
    app.kubernetes.io/name: immunix-agent
    immunix.network/tier: sovereign
spec:
  selector:
    matchLabels:
      name: immunix-ebpf-mesh
  template:
    metadata:
      labels:
        name: immunix-ebpf-mesh
      annotations:
        immunix.network/ebpf-hook: "sock_recvmsg_v6.8"
        immunix.network/latency-budget: "0.4ms"
    spec:
      hostNetwork: true
      hostPID: true
      containers:
      - name: ebpf-interceptor
        image: ghcr.io/immunix/ebpf-agent:v4.2.0
        securityContext:
          privileged: true
          capabilities:
            add: ["BPF", "NET_ADMIN", "SYS_ADMIN", "PERFMON"]
        env:
        - name: IMMUNIX_CLUSTER_ID
          value: "k8s-prod-us-east-1"
        - name: IMMUNIX_SOVEREIGN_KEY
          valueFrom:
            secretKeyRef:
              name: immunix-sovereign-credentials
              key: api-key
        resources:
          limits:
            cpu: "200m"
            memory: "256Mi"
          requests:
            cpu: "50m"
            memory: "64Mi"
        volumeMounts:
        - mountPath: /sys/fs/bpf
          name: bpffs
        - mountPath: /sys/kernel/debug
          name: debugfs
      volumes:
      - name: bpffs
        hostPath:
          path: /sys/fs/bpf
      - name: debugfs
        hostPath:
          path: /sys/kernel/debug`,
    },
    helm: {
      title: 'Helm v3 Production Command',
      filename: 'helm-install.sh',
      code: `# Add IMMUNIX Sovereign Defense Helm Repository
helm repo add immunix https://charts.immunix.network
helm repo update

# Install eBPF In-Kernel Socket Inception Agent
helm install immunix-mesh immunix/ebpf-agent \\
  --namespace ${clusterNamespace} \\
  --create-namespace \\
  --set sovereign.clusterId="k8s-${clusterNamespace}-cluster" \\
  --set sovereign.latencyPenaltyBudget="0.4ms" \\
  --set sovereign.zeroPayloadRetention=true \\
  --set sovereign.herdImmunitySync=true \\
  --set resources.limits.cpu="200m" \\
  --set resources.limits.memory="256Mi"

# Verify Sensor Agent Deployment
kubectl get daemonset -n ${clusterNamespace} -l app.kubernetes.io/name=immunix-agent`,
    },
    terraform: {
      title: 'Terraform AWS EKS / GCP GKE Module',
      filename: 'main.tf',
      code: `module "immunix_sovereign_mesh" {
  source  = "immunix/sensor-agent/kubernetes"
  version = "~> 4.2.0"

  cluster_name       = "enterprise-core-eks"
  cluster_namespace  = "${clusterNamespace}"
  environment        = "production"
  
  # Sovereign Defense Parameters
  enable_sensor_proxy             = true
  sensor_inspection_overhead_ms   = 1.0
  zero_payload_retention          = true
  global_herd_immunity_sync       = true
  
  # Cryptographic Root Verification
  sovereign_root_key_ed25519      = var.immunix_root_key
  
  tags = {
    SecurityClassification = "Sovereign-Defense"
    ComplianceAudited      = "SOC2-Type-II"
  }
}`,
    },
    systemd: {
      title: 'Bare-Metal Linux Systemd Agent Bootstrap',
      filename: 'immunix-agent.service',
      code: `[Unit]
Description=IMMUNIX Autonomous Software Immune Agent
After=network.target
Documentation=https://immunix.network/docs/architecture

[Service]
Type=simple
User=root
WorkingDirectory=/opt/immunix
ExecStart=/opt/immunix/bin/immunix-agent --cluster-id=baremetal-${clusterNamespace} --mode=proxy
Restart=always
RestartSec=3s
LimitMEMLOCK=infinity
CapabilityBoundingSet=CAP_BPF CAP_NET_ADMIN CAP_SYS_ADMIN CAP_PERFMON

[Install]
WantedBy=multi-user.target`,
    },
  };

  const current = configs[targetCloud];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([current.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = current.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="cluster-deploy-wizard" className="py-24 bg-white relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Cloud className="w-3.5 h-3.5 text-[#D4AF37]" /> Cluster Deployment Engine
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#0B0B0C] tracking-tight">
            Deploy in Under 60 Seconds
          </h2>
          <p className="mt-4 text-[#6E6E73] text-base sm:text-lg leading-relaxed">
            Attach the sovereign eBPF socket interceptor to your production Kubernetes pods, Helm deployments, or Terraform modules. Zero application code modifications required.
          </p>
        </div>

        {/* Wizard Panel */}
        <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#FBFBF9] p-6 lg:p-8 shadow-xl">
          {/* Format Selection Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#D4AF37]/20 gap-4">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm overflow-x-auto w-full sm:w-auto">
              <button suppressHydrationWarning
                onClick={() => setTargetCloud('k8s')}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  targetCloud === 'k8s'
                    ? 'bg-[#0B0B0C] text-white shadow-sm'
                    : 'text-[#6E6E73] hover:text-[#0B0B0C]'
                }`}
              >
                Kubernetes DaemonSet
              </button>

              <button suppressHydrationWarning
                onClick={() => setTargetCloud('helm')}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  targetCloud === 'helm'
                    ? 'bg-[#0B0B0C] text-white shadow-sm'
                    : 'text-[#6E6E73] hover:text-[#0B0B0C]'
                }`}
              >
                Helm v3 Chart
              </button>

              <button suppressHydrationWarning
                onClick={() => setTargetCloud('terraform')}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  targetCloud === 'terraform'
                    ? 'bg-[#0B0B0C] text-white shadow-sm'
                    : 'text-[#6E6E73] hover:text-[#0B0B0C]'
                }`}
              >
                Terraform Module
              </button>

              <button suppressHydrationWarning
                onClick={() => setTargetCloud('systemd')}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  targetCloud === 'systemd'
                    ? 'bg-[#0B0B0C] text-white shadow-sm'
                    : 'text-[#6E6E73] hover:text-[#0B0B0C]'
                }`}
              >
                Bare-Metal Linux
              </button>
            </div>

            {/* Namespace customization */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#6E6E73]">Target Namespace:</span>
              <input suppressHydrationWarning
                type="text"
                value={clusterNamespace}
                onChange={(e) => setClusterNamespace(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 bg-white text-xs font-mono text-[#0B0B0C] w-32 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Code Manifest Display */}
          <div className="mt-6 rounded-2xl bg-[#0B0B0C] border border-[#D4AF37]/50 shadow-2xl overflow-hidden font-mono text-xs text-white">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#141416] border-b border-white/10">
              <div className="flex items-center gap-2 text-white/80">
                <Terminal className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-bold text-[#D4AF37]">{current.filename}</span>
                <span className="text-white/40 text-[11px] hidden sm:inline">— {current.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button suppressHydrationWarning
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#D4AF37]" /> Copy Manifest
                    </>
                  )}
                </button>

                <button suppressHydrationWarning
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            <pre className="p-6 overflow-x-auto text-white/85 leading-relaxed max-h-[460px]">
              {current.code}
            </pre>

            <div className="px-5 py-3 border-t border-white/10 bg-[#141416] flex items-center justify-between text-[11px] text-[#6E6E73]">
              <span className="flex items-center gap-1 text-[#10B981]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Linux Kernel eBPF Verifier v6.8
              </span>
              <span>Memory overhead: &lt; 24MB</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

