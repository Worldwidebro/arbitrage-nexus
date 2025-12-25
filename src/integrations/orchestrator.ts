/**
 * Arbitrage Nexus Integration Layer
 * Connects arbitrage-nexus to all Worldwidebro repos for unified orchestration
 */

import { supabase } from '@/integrations/supabase/client';
import { Octokit } from '@octokit/rest';

// GitHub client - token should be provided at runtime
let octokit: Octokit | null = null;

export function initializeGitHub(token: string) {
  octokit = new Octokit({ auth: token });
}

function getOctokit(): Octokit {
  if (!octokit) {
    // Return a client without auth for public repos
    return new Octokit();
  }
  return octokit;
}

/**
 * INTEGRATION 1: Business Template Marketplace
 * Access templates via GitHub API
 */
export class TemplateMarketplaceIntegration {
  async listTemplates(): Promise<any[]> {
    try {
      const { data } = await getOctokit().repos.getContent({
        owner: 'Worldwidebro',
        repo: 'business-template-marketplace',
        path: 'templates'
      });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Could not fetch templates:', error);
      return [];
    }
  }

  async getTemplate(templateId: string): Promise<any> {
    const { data } = await getOctokit().repos.getContent({
      owner: 'Worldwidebro',
      repo: 'business-template-marketplace',
      path: `templates/${templateId}`
    });
    return data;
  }

  async findTemplateForOpportunity(vertical: string): Promise<string | null> {
    const templates = await this.listTemplates();
    const match = templates.find(t =>
      t.name.toLowerCase().includes(vertical.toLowerCase())
    );
    return match ? match.name : null;
  }
}

/**
 * INTEGRATION 2: Financial Core
 * Revenue tracking and forecasting
 */
export class FinancialCoreIntegration {
  async getOpportunityStats(): Promise<{ total: number; byStatus: Record<string, number> }> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('status');

    if (error) throw error;

    const byStatus: Record<string, number> = {};
    data?.forEach(opp => {
      const status = opp.status || 'pending';
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    return {
      total: data?.length || 0,
      byStatus
    };
  }

  async getValueEstimateTotal(): Promise<number> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('value_estimate')
      .eq('status', 'active');

    if (error) throw error;
    return data?.reduce((sum, o) => sum + (o.value_estimate || 0), 0) || 0;
  }
}

/**
 * INTEGRATION 3: Intelligence Core
 * Opportunity detection and validation
 */
export class IntelligenceCoreIntegration {
  async detectOpportunities(): Promise<any[]> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'pending');

    if (error) throw error;
    return data || [];
  }

  async validateOpportunity(opportunityId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();

    if (error) return false;
    // Simple validation: check if opportunity has required fields
    return !!(data?.title && data?.description && data?.vertical);
  }
}

/**
 * INTEGRATION 4: Cross-Repo Orchestration
 * Main orchestrator connecting all systems
 */
export class ArbitrageNexusOrchestrator {
  private templateMarketplace = new TemplateMarketplaceIntegration();
  private financialCore = new FinancialCoreIntegration();
  private intelligenceCore = new IntelligenceCoreIntegration();

  /**
   * Process opportunity workflow
   */
  async processOpportunity(opportunityId: string): Promise<string | null> {
    console.log(`🔍 Processing opportunity: ${opportunityId}`);

    // 1. Validate opportunity
    const isValid = await this.intelligenceCore.validateOpportunity(opportunityId);
    if (!isValid) {
      console.log('❌ Opportunity validation failed');
      return null;
    }

    // 2. Get opportunity details
    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();

    if (error || !opportunity) return null;

    // 3. Find matching template
    const templateId = await this.templateMarketplace.findTemplateForOpportunity(
      opportunity.vertical
    );

    // 4. Update opportunity status to matched
    await supabase
      .from('opportunities')
      .update({ status: 'matched' })
      .eq('id', opportunityId);

    console.log(`✅ Opportunity processed with template: ${templateId || 'none'}`);
    return templateId || opportunity.id;
  }

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics() {
    const [stats, totalValue] = await Promise.all([
      this.financialCore.getOpportunityStats(),
      this.financialCore.getValueEstimateTotal()
    ]);

    return {
      opportunities: stats,
      totalValue,
      pendingOpportunities: await this.intelligenceCore.detectOpportunities()
    };
  }
}

// Export singleton instance
export const orchestrator = new ArbitrageNexusOrchestrator();
