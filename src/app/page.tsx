'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ArchitectureSystemMap from '@/components/ArchitectureSystemMap';
import BreakMyApiArena from '@/components/BreakMyApiArena';
import DualSpeedEngine from '@/components/DualSpeedEngine';
import GlobalHerdImmunity from '@/components/GlobalHerdImmunity';
import VendorHealthRadar from '@/components/VendorHealthRadar';
import BenchmarkComparison from '@/components/BenchmarkComparison';
import McpProtocolSection from '@/components/McpProtocolSection';
import FinancialLossCalculator from '@/components/FinancialLossCalculator';
import ClusterDeployWizard from '@/components/ClusterDeployWizard';
import Pricing from '@/components/Pricing';
import SovereignCompliance from '@/components/SovereignCompliance';
import Footer from '@/components/Footer';
import ConsoleModal from '@/components/ConsoleModal';
import SovereignAuditModal from '@/components/SovereignAuditModal';
import ArchitectureDossierModal from '@/components/ArchitectureDossierModal';
import ApiKeyModal from '@/components/ApiKeyModal';
import CommandPalette from '@/components/CommandPalette';
import StripeCheckoutModal from '@/components/StripeCheckoutModal';

export default function Home() {
  const [consoleModalOpen, setConsoleModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedAuditTier, setSelectedAuditTier] = useState('Enterprise Grid');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedCheckoutTier, setSelectedCheckoutTier] = useState<string>('enterprise-grid');

  useEffect(() => {
    const handleOpenPaletteEvent = () => setPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpenPaletteEvent);
    return () => window.removeEventListener('open-command-palette', handleOpenPaletteEvent);
  }, []);

  const handleOpenAudit = (tierName: string = 'Enterprise Grid') => {
    setSelectedAuditTier(tierName);
    setAuditModalOpen(true);
  };

  const handleOpenCheckout = (tier: string = 'enterprise-grid') => {
    setSelectedCheckoutTier(tier);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0B0B0C] selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
      {/* Navigation */}
      <Navbar
        onOpenConsole={() => setConsoleModalOpen(true)}
        onOpenAudit={() => handleOpenAudit('Enterprise Grid')}
        onOpenKeys={() => setApiKeyModalOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main className="flex-1">
        {/* 1. Hero Section with Interactive 3D Gold DNA Canvas & Telemetry */}
        <Hero
          onOpenConsole={() => setConsoleModalOpen(true)}
          onOpenAudit={() => handleOpenAudit('Sovereign Mesh')}
          onOpenDossier={() => setDossierModalOpen(true)}
        />

        {/* 2. Core Paradigm: Dual-Speed Biological Immune Engine */}
        <DualSpeedEngine />

        {/* 3. BreakMyAPI Live Arena: 3:00 AM Sabotage Challenge */}
        <BreakMyApiArena />

        {/* 4. Deep Technical Architecture: 3-Plane System Map & 5-Tier Data Topology */}
        <ArchitectureSystemMap />

        {/* 5. Global Herd Immunity: Real-Time World Mesh & Inoculation Broadcast */}
        <GlobalHerdImmunity />

        {/* 6. Upstream Vendor Health Radar: Real-Time Egress Monitoring */}
        <VendorHealthRadar />

        {/* 7. Architectural Benchmark: Corrigio vs Mendr vs APISynQ vs IMMUNIX */}
        <BenchmarkComparison />

        {/* 8. Model Context Protocol (MCP) Live Agent Arena */}
        <McpProtocolSection />

        {/* 9. Financial Loss & Downtime ROI Estimator */}
        <FinancialLossCalculator onOpenAudit={() => handleOpenAudit('Enterprise Grid')} />

        {/* 10. Cluster Deployment Engine: Kubernetes / Helm / Terraform */}
        <ClusterDeployWizard />

        {/* 11. Enterprise Pricing with Hand-Crafted Gold Trim */}
        <Pricing
          onSelectTier={(tierName) => handleOpenCheckout(tierName)}
          onCheckout={(tierKey) => handleOpenCheckout(tierKey)}
          onOpenConsole={() => setConsoleModalOpen(true)}
        />

        {/* 12. Sovereign Trust & Compliance */}
        <SovereignCompliance onOpenAudit={() => handleOpenAudit('Sovereign Mesh')} />
      </main>

      {/* 13. Luxury Footer with CLI Inoculation Command */}
      <Footer
        onOpenConsole={() => setConsoleModalOpen(true)}
        onOpenAudit={() => handleOpenAudit('Enterprise Grid')}
      />

      {/* Interactive Modals */}
      <ConsoleModal
        isOpen={consoleModalOpen}
        onClose={() => setConsoleModalOpen(false)}
      />

      {checkoutModalOpen && (
        <StripeCheckoutModal
          key={selectedCheckoutTier}
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
          initialTier={selectedCheckoutTier}
          onOpenConsole={() => setConsoleModalOpen(true)}
        />
      )}

      <SovereignAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        defaultTier={selectedAuditTier}
      />

      <ArchitectureDossierModal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
      />

      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
      />

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenConsole={() => setConsoleModalOpen(true)}
        onOpenAudit={() => handleOpenAudit('Sovereign Mesh')}
        onOpenDossier={() => setDossierModalOpen(true)}
        onOpenCheckout={(tier) => handleOpenCheckout(tier || 'enterprise-grid')}
      />
    </div>
  );
}
