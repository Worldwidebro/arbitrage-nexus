/**
 * Cross-Repository Orchestration Layer
 * Connects arbitrage-nexus to Worldwidebro ecosystem repos
 */

import { supabase } from '@/integrations/supabase/client';
import { Octokit } from '@octokit/rest';

// Types
export interface RepoConfig {
  owner: string;
  repo: string;
  branch?: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  data?: unknown;
  timestamp: Date;
}

export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  path: string;
  version: string;
}

export interface FinancialData {
  vertical: string;
  metrics: Record<string, number>;
  timestamp: Date;
}

export interface IntelligencePayload {
  query: string;
  context: Record<string, unknown>;
  sources: string[];
}

// Base Integration Class
abstract class BaseIntegration {
  protected octokit: Octokit | null = null;
  protected repoConfig: RepoConfig;

  constructor(repoConfig: RepoConfig, githubToken?: string) {
    this.repoConfig = repoConfig;
    if (githubToken) {
      this.octokit = new Octokit({ auth: githubToken });
    }
  }

  protected async fetchFileFromRepo(path: string): Promise<string | null> {
    if (!this.octokit) {
      console.warn('GitHub client not initialized - no token provided');
      return null;
    }

    try {
      const response = await this.octokit.repos.getContent({
        owner: this.repoConfig.owner,
        repo: this.repoConfig.repo,
        path,
        ref: this.repoConfig.branch || 'main',
      });

      if ('content' in response.data && response.data.content) {
        return atob(response.data.content);
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch ${path} from ${this.repoConfig.repo}:`, error);
      return null;
    }
  }

  protected async listDirectoryFromRepo(path: string): Promise<string[]> {
    if (!this.octokit) {
      console.warn('GitHub client not initialized');
      return [];
    }

    try {
      const response = await this.octokit.repos.getContent({
        owner: this.repoConfig.owner,
        repo: this.repoConfig.repo,
        path,
        ref: this.repoConfig.branch || 'main',
      });

      if (Array.isArray(response.data)) {
        return response.data.map((item) => item.name);
      }
      return [];
    } catch (error) {
      console.error(`Failed to list ${path} from ${this.repoConfig.repo}:`, error);
      return [];
    }
  }

  abstract sync(): Promise<SyncResult>;
}

/**
 * Template Marketplace Integration
 * Syncs with template-marketplace repo for UI components and patterns
 */
export class TemplateMarketplaceIntegration extends BaseIntegration {
  private templates: TemplateConfig[] = [];

  constructor(githubToken?: string) {
    super(
      {
        owner: 'Worldwidebro',
        repo: 'template-marketplace',
        branch: 'main',
      },
      githubToken
    );
  }

  async sync(): Promise<SyncResult> {
    try {
      // Fetch template manifest
      const manifest = await this.fetchFileFromRepo('templates/manifest.json');
      
      if (manifest) {
        this.templates = JSON.parse(manifest);
        
        // Store in Supabase for local caching
        const user = (await supabase.auth.getUser()).data.user;
        if (user) {
          const { error } = await supabase.from('ai_conversations').insert([{
            user_id: user.id,
            messages: [{ type: 'template_sync', data: this.templates }] as unknown as never[],
          }]);

          if (error) {
            console.warn('Failed to cache templates locally:', error);
          }
        }
      }

      return {
        success: true,
        message: `Synced ${this.templates.length} templates from marketplace`,
        data: this.templates,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Template sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
    }
  }

  async getTemplatesByCategory(category: string): Promise<TemplateConfig[]> {
    return this.templates.filter((t) => t.category === category);
  }

  async getTemplateContent(templateId: string): Promise<string | null> {
    const template = this.templates.find((t) => t.id === templateId);
    if (!template) return null;
    return this.fetchFileFromRepo(template.path);
  }
}

/**
 * Financial Core Integration
 * Connects to babydoge-financial-core for financial calculations and data
 */
export class FinancialCoreIntegration extends BaseIntegration {
  private financialModules: string[] = [];

  constructor(githubToken?: string) {
    super(
      {
        owner: 'Worldwidebro',
        repo: 'babydoge-financial-core',
        branch: 'main',
      },
      githubToken
    );
  }

  async sync(): Promise<SyncResult> {
    try {
      // List available financial modules
      this.financialModules = await this.listDirectoryFromRepo('src/modules');

      return {
        success: true,
        message: `Found ${this.financialModules.length} financial modules`,
        data: this.financialModules,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Financial core sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
    }
  }

  async calculateArbitrageOpportunity(data: FinancialData): Promise<number | null> {
    // Placeholder for financial calculation logic
    // In production, this would call the financial core's calculation engine
    const { vertical, metrics } = data;
    
    // Simple spread calculation
    if (metrics.buyPrice && metrics.sellPrice) {
      const spread = ((metrics.sellPrice - metrics.buyPrice) / metrics.buyPrice) * 100;
      return spread;
    }
    
    return null;
  }

  async getAvailableModules(): Promise<string[]> {
    return this.financialModules;
  }
}

/**
 * Intelligence Core Integration
 * Connects to babydoge-intelligence-core for AI/ML capabilities
 */
export class IntelligenceCoreIntegration extends BaseIntegration {
  private availableAgents: string[] = [];

  constructor(githubToken?: string) {
    super(
      {
        owner: 'Worldwidebro',
        repo: 'babydoge-intelligence-core',
        branch: 'main',
      },
      githubToken
    );
  }

  async sync(): Promise<SyncResult> {
    try {
      // List available AI agents
      this.availableAgents = await this.listDirectoryFromRepo('agents');

      return {
        success: true,
        message: `Found ${this.availableAgents.length} intelligence agents`,
        data: this.availableAgents,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Intelligence core sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
    }
  }

  async queryIntelligence(payload: IntelligencePayload): Promise<unknown> {
    // This would integrate with the intelligence core's API
    // For now, log the query and return a placeholder
    console.log('Intelligence query:', payload);
    
    return {
      response: 'Intelligence query received',
      query: payload.query,
      processedAt: new Date().toISOString(),
    };
  }

  async getAvailableAgents(): Promise<string[]> {
    return this.availableAgents;
  }
}

/**
 * Main Orchestrator
 * Coordinates all integrations for the Arbitrage Nexus platform
 */
export class ArbitrageNexusOrchestrator {
  private templateMarketplace: TemplateMarketplaceIntegration;
  private financialCore: FinancialCoreIntegration;
  private intelligenceCore: IntelligenceCoreIntegration;
  private initialized: boolean = false;
  private lastSync: Date | null = null;

  constructor(githubToken?: string) {
    this.templateMarketplace = new TemplateMarketplaceIntegration(githubToken);
    this.financialCore = new FinancialCoreIntegration(githubToken);
    this.intelligenceCore = new IntelligenceCoreIntegration(githubToken);
  }

  async initialize(): Promise<void> {
    console.log('Initializing Arbitrage Nexus Orchestrator...');
    
    const results = await Promise.allSettled([
      this.templateMarketplace.sync(),
      this.financialCore.sync(),
      this.intelligenceCore.sync(),
    ]);

    results.forEach((result, index) => {
      const integrationNames = ['TemplateMarketplace', 'FinancialCore', 'IntelligenceCore'];
      if (result.status === 'fulfilled') {
        console.log(`${integrationNames[index]}: ${result.value.message}`);
      } else {
        console.error(`${integrationNames[index]} failed:`, result.reason);
      }
    });

    this.initialized = true;
    this.lastSync = new Date();
  }

  async syncAll(): Promise<Record<string, SyncResult>> {
    const [templates, financial, intelligence] = await Promise.all([
      this.templateMarketplace.sync(),
      this.financialCore.sync(),
      this.intelligenceCore.sync(),
    ]);

    this.lastSync = new Date();

    return {
      templates,
      financial,
      intelligence,
    };
  }

  getTemplateMarketplace(): TemplateMarketplaceIntegration {
    return this.templateMarketplace;
  }

  getFinancialCore(): FinancialCoreIntegration {
    return this.financialCore;
  }

  getIntelligenceCore(): IntelligenceCoreIntegration {
    return this.intelligenceCore;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getLastSyncTime(): Date | null {
    return this.lastSync;
  }

  async getSystemStatus(): Promise<{
    initialized: boolean;
    lastSync: Date | null;
    integrations: Record<string, boolean>;
  }> {
    return {
      initialized: this.initialized,
      lastSync: this.lastSync,
      integrations: {
        templateMarketplace: true,
        financialCore: true,
        intelligenceCore: true,
      },
    };
  }
}

// Singleton instance
let orchestratorInstance: ArbitrageNexusOrchestrator | null = null;

export function getOrchestrator(githubToken?: string): ArbitrageNexusOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new ArbitrageNexusOrchestrator(githubToken);
  }
  return orchestratorInstance;
}

export function resetOrchestrator(): void {
  orchestratorInstance = null;
}
