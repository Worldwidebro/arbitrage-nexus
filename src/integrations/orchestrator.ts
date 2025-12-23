/**
 * Arbitrage Nexus Integration Layer
 * Connects arbitrage-nexus to all Worldwidebro repos for unified orchestration
 */

import { createClient } from '@supabase/supabase-js'
import { Octokit } from '@octokit/rest'

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://cyhzilqldouzgynacqpe.supabase.co',
  process.env.SUPABASE_ANON_KEY || ''
)

// GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

/**
 * INTEGRATION 1: Business Template Marketplace
 * Access 487 templates via GitHub API
 */
export class TemplateMarketplaceIntegration {
  async listTemplates(): Promise<any[]> {
    // Get all templates from business-template-marketplace repo
    const { data } = await octokit.repos.getContent({
      owner: 'Worldwidebro',
      repo: 'business-template-marketplace',
      path: 'templates'
    })

    return Array.isArray(data) ? data : []
  }

  async getTemplate(templateId: string): Promise<any> {
    // Fetch specific template
    const { data } = await octokit.repos.getContent({
      owner: 'Worldwidebro',
      repo: 'business-template-marketplace',
      path: `templates/${templateId}`
    })

    return data
  }

  async findTemplateForOpportunity(opportunityType: string): Promise<string | null> {
    // Match opportunity type to template
    const templates = await this.listTemplates()

    // Intelligence: Find best matching template
    // For now, simple keyword matching
    const match = templates.find(t =>
      t.name.toLowerCase().includes(opportunityType.toLowerCase())
    )

    return match ? match.name : null
  }
}

/**
 * INTEGRATION 2: IZA OS Financial Core
 * Revenue tracking and forecasting
 */
export class FinancialCoreIntegration {
  async trackVentureRevenue(ventureId: string, mrr: number) {
    // Update venture MRR in Supabase
    const { data, error } = await supabase
      .from('ventures')
      .update({ mrr, last_updated: new Date().toISOString() })
      .eq('venture_id', ventureId)

    if (error) throw error
    return data
  }

  async getTotalRevenue(): Promise<number> {
    // Sum MRR across all active ventures
    const { data, error } = await supabase
      .from('ventures')
      .select('mrr')
      .eq('status', 'active')

    if (error) throw error

    return data?.reduce((sum, v) => sum + (v.mrr || 0), 0) || 0
  }

  async forecastRevenue(months: number = 12): Promise<number[]> {
    // Simple growth projection
    const currentMRR = await this.getTotalRevenue()
    const monthlyGrowthRate = 0.15 // 15% monthly growth assumption

    return Array.from({ length: months }, (_, i) =>
      currentMRR * Math.pow(1 + monthlyGrowthRate, i + 1)
    )
  }
}

/**
 * INTEGRATION 3: IZA OS Intelligence Core
 * Opportunity detection and validation
 */
export class IntelligenceCoreIntegration {
  async detectOpportunities(): Promise<any[]> {
    // Query intelligence core for opportunities
    // For now, read from Supabase opportunities table
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'detected')

    if (error) throw error
    return data || []
  }

  async validateOpportunity(opportunityId: string): Promise<boolean> {
    // Validate opportunity using intelligence algorithms
    // For MVP: Simple validation based on confidence score
    const { data, error } = await supabase
      .from('opportunities')
      .select('confidence_score')
      .eq('id', opportunityId)
      .single()

    if (error) return false
    return (data?.confidence_score || 0) > 0.7 // 70% confidence threshold
  }

  async analyzeMarketGap(opportunityType: string): Promise<number> {
    // Analyze market gap for opportunity type
    // Returns confidence score 0-1
    // TODO: Connect to actual intelligence-core repo for analysis
    return 0.85 // Placeholder
  }
}

/**
 * INTEGRATION 4: Cross-Repo Orchestration
 * Main orchestrator connecting all systems
 */
export class ArbitrageNexusOrchestrator {
  private templateMarketplace = new TemplateMarketplaceIntegration()
  private financialCore = new FinancialCoreIntegration()
  private intelligenceCore = new IntelligenceCoreIntegration()

  /**
   * Complete workflow: Opportunity → Template → Venture → Revenue
   */
  async processOpportunity(opportunityId: string): Promise<string | null> {
    console.log(`🔍 Processing opportunity: ${opportunityId}`)

    // 1. Validate opportunity
    const isValid = await this.intelligenceCore.validateOpportunity(opportunityId)
    if (!isValid) {
      console.log('❌ Opportunity validation failed')
      return null
    }

    // 2. Get opportunity details
    const { data: opportunity } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single()

    if (!opportunity) return null

    // 3. Find matching template
    const templateId = await this.templateMarketplace.findTemplateForOpportunity(
      opportunity.opportunity_type
    )

    if (!templateId) {
      console.log('❌ No matching template found')
      return null
    }

    // 4. Generate venture from template
    const ventureId = await this.generateVentureFromTemplate(
      opportunity,
      templateId
    )

    // 5. Update opportunity status
    await supabase
      .from('opportunities')
      .update({ status: 'launched' })
      .eq('id', opportunityId)

    console.log(`✅ Venture created: ${ventureId}`)
    return ventureId
  }

  /**
   * Generate venture repo from template
   */
  private async generateVentureFromTemplate(
    opportunity: any,
    templateId: string
  ): Promise<string> {
    const ventureId = `venture-${Date.now()}`

    // 1. Create GitHub repo from template
    try {
      await octokit.repos.createUsingTemplate({
        template_owner: 'Worldwidebro',
        template_repo: 'business-template-marketplace',
        owner: 'Worldwidebro',
        name: ventureId,
        description: `Generated from ${templateId} for opportunity ${opportunity.id}`,
        private: false
      })
    } catch (error) {
      console.error('Error creating repo:', error)
    }

    // 2. Record in Supabase
    await supabase.from('ventures').insert({
      venture_id: ventureId,
      opportunity_id: opportunity.id,
      template_id: templateId,
      repo_name: ventureId,
      repo_url: `https://github.com/Worldwidebro/${ventureId}`,
      status: 'generated',
      mrr: 0,
      metadata: { generated_at: new Date().toISOString() }
    })

    // 3. Log orchestration event
    await supabase.from('orchestration_events').insert({
      event_type: 'venture_generated',
      source_repo: 'arbitrage-nexus',
      target_repo: ventureId,
      payload: { opportunity_id: opportunity.id, template_id: templateId }
    })

    return ventureId
  }

  /**
   * Sync all repos to Supabase inventory
   */
  async syncReposInventory(): Promise<void> {
    console.log('📊 Syncing repository inventory...')

    const { data } = await octokit.repos.listForOrg({
      org: 'Worldwidebro',
      per_page: 100
    })

    for (const repo of data) {
      await supabase.from('worldwidebro_repos').upsert({
        repo_name: repo.name,
        repo_url: repo.html_url,
        role: this.determineRepoRole(repo.name),
        health_status: 'active',
        last_sync: new Date().toISOString(),
        metadata: {
          description: repo.description,
          updated_at: repo.updated_at,
          size: repo.size
        }
      }, { onConflict: 'repo_name' })
    }

    console.log(`✅ Synced ${data.length} repositories`)
  }

  private determineRepoRole(repoName: string): string {
    if (repoName === 'arbitrage-nexus') return 'orchestrator'
    if (repoName === 'business-template-marketplace') return 'template'
    if (repoName.startsWith('iza-os-')) return 'core'
    if (repoName.includes('website')) return 'ui'
    if (repoName.match(/^(fin|ec|ht|et|ai|ft)-\d+/)) return 'venture'
    return 'other'
  }

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics() {
    const [totalRevenue, opportunities, ventures, repos] = await Promise.all([
      this.financialCore.getTotalRevenue(),

      supabase.from('opportunities').select('status', { count: 'exact' }),

      supabase.from('ventures').select('status', { count: 'exact' }),

      supabase.from('worldwidebro_repos').select('role', { count: 'exact' })
    ])

    return {
      revenue: {
        total_mrr: totalRevenue,
        target_mrr: 2390000, // From BUSINESS_REGISTRY
        achievement_rate: (totalRevenue / 2390000) * 100
      },
      opportunities: {
        total: opportunities.count || 0,
        by_status: {} // TODO: Group by status
      },
      ventures: {
        total: ventures.count || 0,
        active: ventures.data?.filter(v => v.status === 'active').length || 0
      },
      repos: {
        total: repos.count || 0
      }
    }
  }
}

// Export singleton instance
export const orchestrator = new ArbitrageNexusOrchestrator()
