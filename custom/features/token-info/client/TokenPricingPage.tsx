/**
 * CUSTOM: gptchina fork
 *
 * Feature: Token Info / Pricing Guide
 * Created: 2025-11-14
 * Updated: 2025-11-15 - Complete redesign with theme integration
 * Upstream Impact: None (standalone module)
 *
 * Standalone pricing page that opens in a new tab.
 */

import React, { useEffect, useState } from 'react';
import { request } from 'librechat-data-provider';
import { useTheme, Separator } from '@librechat/client';
import {
  BookOpen,
  DollarSign,
  Package,
  MessageSquare,
  Zap,
  Target,
  Scissors,
  Gift,
  BarChart3,
} from 'lucide-react';
import { PageHeader } from './components/PageHeader';
import { SectionContainer } from './components/SectionContainer';
import { ModelPricingCard } from './components/ModelPricingCard';
import { PackageCard } from './components/PackageCard';
import { CostCalculator } from './components/CostCalculator';

interface PricingData {
  budget: Array<{ model: string; input: number; output: number; total: number }>;
  mid: Array<{ model: string; input: number; output: number; total: number }>;
  premium: Array<{ model: string; input: number; output: number; total: number }>;
}

export const TokenPricingPage: React.FC = () => {
  const { theme } = useTheme();
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      setIsLoading(true);
      const response = (await request.get('/api/custom/token-info/pricing')) as {
        success: boolean;
        data?: PricingData;
      };

      if (response.success && response.data) {
        setPricingData(response.data);
      } else {
        setError('Failed to load pricing data');
      }
    } catch (err) {
      console.error('Error fetching pricing data:', err);
      setError('Failed to load pricing data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-border-medium border-t-blue-600" />
          <p className="text-text-secondary">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  if (error || !pricingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-4xl text-red-600">✕</div>
          <p className="text-text-primary">{error || 'Failed to load pricing data'}</p>
        </div>
      </div>
    );
  }

  const allModels = [...pricingData.budget, ...pricingData.mid, ...pricingData.premium];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* How It Works Section */}
        <SectionContainer title="How Token Consumption Works" icon={BookOpen}>
          <div className="rounded-lg bg-surface-secondary p-6">
            <div className="space-y-4 text-text-secondary">
              <p>
                Tokens are the fundamental units of text processing in AI models. Both your messages
                (input) and the AI's responses (output) consume tokens.
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong className="text-text-primary">Input tokens</strong> = your message to the
                  AI (prompt, question, instruction)
                </li>
                <li>
                  <strong className="text-text-primary">Output tokens</strong> = the AI's response
                  to your message
                </li>
                <li>
                  <strong className="text-text-primary">Pricing shown per 1 million tokens</strong>{' '}
                  - actual costs are proportional to usage
                </li>
              </ul>
              <div className="rounded-md border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Quick estimate:</strong> 1 word ≈ 1.3 tokens on average. A 1000-word
                    conversation uses ~2,600 tokens total.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Pricing Tables Section */}
        <SectionContainer title="Pricing by Category" icon={DollarSign}>
          <div className="grid grid-cols-1 gap-6">
            <ModelPricingCard
              title="Budget-Friendly Models"
              models={pricingData.budget}
              categoryColor="success"
            />
            <ModelPricingCard
              title="Mid-Range Models"
              models={pricingData.mid}
              categoryColor="warning"
            />
            <ModelPricingCard
              title="Premium Models"
              models={pricingData.premium}
              categoryColor="error"
            />
          </div>
        </SectionContainer>

        {/* Calculator Section */}
        <SectionContainer title="Cost Calculator" icon={BarChart3} showSeparator={false}>
          <CostCalculator models={allModels} />
        </SectionContainer>

        <Separator className="my-12" />

        {/* Package Value Section */}
        <SectionContainer title="What Can You Do with Each Package?" icon={Package}>
          <p className="mb-6 text-text-secondary">
            Based on a typical conversation:{' '}
            <strong className="text-text-primary">200 words sent, 300 words received</strong> (~650
            tokens total)
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PackageCard
              title="100,000 Tokens"
              price="¥10"
              tokens="100K"
              badge="starter"
              models={[
                {
                  name: 'gpt-4o-mini (Budget)',
                  conversations: '~205,000 conversations',
                  color: 'success',
                },
                {
                  name: 'gpt-4o (Mid-Range)',
                  conversations: '~12,300 conversations',
                  color: 'primary',
                },
                {
                  name: 'claude-3.5-sonnet',
                  conversations: '~8,500 conversations',
                  color: 'primary',
                },
                { name: 'o1 (Premium)', conversations: '~2,000 conversations', color: 'warning' },
              ]}
            />

            <PackageCard
              title="500,000 Tokens"
              price="¥35"
              tokens="500K"
              badge="popular"
              isPopular={true}
              models={[
                {
                  name: 'gpt-4o-mini (Budget)',
                  conversations: '~1,025,000 conversations',
                  color: 'success',
                },
                {
                  name: 'gpt-4o (Mid-Range)',
                  conversations: '~61,500 conversations',
                  color: 'primary',
                },
                {
                  name: 'claude-3.5-sonnet',
                  conversations: '~42,700 conversations',
                  color: 'primary',
                },
                { name: 'o1 (Premium)', conversations: '~10,200 conversations', color: 'warning' },
              ]}
              discount="30% - was ¥50, now ¥35"
            />

            <PackageCard
              title="1,000,000 Tokens"
              price="¥55"
              tokens="1M"
              badge="value"
              models={[
                {
                  name: 'gpt-4o-mini (Budget)',
                  conversations: '~2,050,000 conversations',
                  color: 'success',
                },
                {
                  name: 'gpt-4o (Mid-Range)',
                  conversations: '~123,000 conversations',
                  color: 'primary',
                },
                {
                  name: 'claude-3.5-sonnet',
                  conversations: '~85,400 conversations',
                  color: 'primary',
                },
                { name: 'o1 (Premium)', conversations: '~20,500 conversations', color: 'warning' },
              ]}
              discount="45% - was ¥100, now ¥55"
            />

            <PackageCard
              title="10,000,000 Tokens"
              price="¥280"
              tokens="10M"
              badge="power"
              models={[
                {
                  name: 'gpt-4o-mini (Budget)',
                  conversations: '~20,500,000 conversations',
                  color: 'success',
                },
                {
                  name: 'gpt-4o (Mid-Range)',
                  conversations: '~1,230,000 conversations',
                  color: 'primary',
                },
                {
                  name: 'claude-3.5-sonnet',
                  conversations: '~854,000 conversations',
                  color: 'primary',
                },
                { name: 'o1 (Premium)', conversations: '~205,000 conversations', color: 'warning' },
              ]}
              discount="72% - was ¥1,000, now ¥280"
            />
          </div>
        </SectionContainer>

        {/* Real Conversation Examples */}
        <SectionContainer title="Real Conversation Examples" icon={MessageSquare}>
          <p className="mb-6 text-text-secondary">
            See exactly how much different types of conversations cost across models:
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Quick Question */}
            <div className="rounded-lg border border-border-medium bg-surface-secondary p-6">
              <h3 className="mb-4 text-lg font-semibold text-text-primary">Quick Question</h3>
              <p className="mb-4 text-sm text-text-secondary">
                50 words in, 100 words out = ~195 tokens
              </p>
              <div className="space-y-3">
                <div className="rounded-md bg-green-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o-mini</div>
                  <div className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                    0.0001 credits
                  </div>
                  <div className="text-xs text-text-secondary">10,000 questions per ¥10</div>
                </div>
                <div className="rounded-md bg-blue-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o</div>
                  <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                    0.0024 credits
                  </div>
                  <div className="text-xs text-text-secondary">41,000 questions per ¥10</div>
                </div>
                <div className="rounded-md bg-orange-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">o1</div>
                  <div className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">
                    0.0146 credits
                  </div>
                  <div className="text-xs text-text-secondary">6,800 questions per ¥10</div>
                </div>
              </div>
            </div>

            {/* Standard Chat */}
            <div className="rounded-lg border border-border-medium bg-surface-secondary p-6">
              <h3 className="mb-4 text-lg font-semibold text-text-primary">Standard Chat</h3>
              <p className="mb-4 text-sm text-text-secondary">
                200 words in, 300 words out = ~650 tokens
              </p>
              <div className="space-y-3">
                <div className="rounded-md bg-green-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o-mini</div>
                  <div className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                    0.0005 credits
                  </div>
                  <div className="text-xs text-text-secondary">205,000 chats per ¥10</div>
                </div>
                <div className="rounded-md bg-blue-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o</div>
                  <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                    0.0081 credits
                  </div>
                  <div className="text-xs text-text-secondary">12,300 chats per ¥10</div>
                </div>
                <div className="rounded-md bg-orange-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">o1</div>
                  <div className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">
                    0.0488 credits
                  </div>
                  <div className="text-xs text-text-secondary">2,000 chats per ¥10</div>
                </div>
              </div>
            </div>

            {/* Deep Dive */}
            <div className="rounded-lg border border-border-medium bg-surface-secondary p-6">
              <h3 className="mb-4 text-lg font-semibold text-text-primary">Deep Dive</h3>
              <p className="mb-4 text-sm text-text-secondary">
                500 words in, 1000 words out = ~1,950 tokens
              </p>
              <div className="space-y-3">
                <div className="rounded-md bg-green-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o-mini</div>
                  <div className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                    0.0015 credits
                  </div>
                  <div className="text-xs text-text-secondary">68,000 deep dives per ¥10</div>
                </div>
                <div className="rounded-md bg-blue-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o</div>
                  <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                    0.0244 credits
                  </div>
                  <div className="text-xs text-text-secondary">4,100 deep dives per ¥10</div>
                </div>
                <div className="rounded-md bg-orange-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">o1</div>
                  <div className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">
                    0.1463 credits
                  </div>
                  <div className="text-xs text-text-secondary">680 deep dives per ¥10</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="mt-6 rounded-lg border-2 border-blue-500 bg-blue-500/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                Cost Comparison Summary
              </h3>
            </div>
            <div className="space-y-3 text-sm text-text-secondary">
              <p>
                For the <strong className="text-text-primary">same 650-token conversation</strong>:
              </p>
              <ul className="ml-6 space-y-1">
                <li>
                  gpt-4o-mini costs{' '}
                  <strong className="text-green-600 dark:text-green-400">0.0005 credits</strong>{' '}
                  (baseline)
                </li>
                <li>
                  gpt-4o costs{' '}
                  <strong className="text-blue-600 dark:text-blue-400">0.0081 credits</strong> (16x
                  more)
                </li>
                <li>
                  claude-3.5-sonnet costs{' '}
                  <strong className="text-text-primary">0.0117 credits</strong> (23x more)
                </li>
                <li>
                  o1 costs{' '}
                  <strong className="text-orange-600 dark:text-orange-400">0.0488 credits</strong>{' '}
                  (98x more!)
                </li>
              </ul>
              <div className="mt-4 rounded-md border border-blue-500/20 bg-blue-500/10 p-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <p className="text-blue-600 dark:text-blue-400">
                    <strong>Smart Usage Tip:</strong> Use budget models (gpt-4o-mini,
                    gemini-2.0-flash) for everyday tasks. Save premium models (o1, claude-opus-4)
                    for complex reasoning, coding, or creative work where quality justifies the
                    cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Tips Section */}
        <SectionContainer title="Tips for Managing Tokens" icon={Target} showSeparator={false}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-lg border border-border-medium bg-surface-secondary p-6">
              <Target className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <strong className="text-text-primary">Choose the right model</strong>
                <p className="mt-1 text-sm text-text-secondary">
                  Use budget models for simple queries and save premium models for complex reasoning
                  tasks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border border-border-medium bg-surface-secondary p-6">
              <Scissors className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <strong className="text-text-primary">Keep prompts concise</strong>
                <p className="mt-1 text-sm text-text-secondary">
                  Shorter, well-structured prompts are more cost-effective and often yield better
                  results.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border border-border-medium bg-surface-secondary p-6">
              <Gift className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <strong className="text-text-primary">Claim free tokens</strong>
                <p className="mt-1 text-sm text-text-secondary">
                  Remember to claim your 20,000 free tokens every 24 hours to maximize value!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border border-border-medium bg-surface-secondary p-6">
              <BarChart3 className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <strong className="text-text-primary">Consider capability vs cost</strong>
                <p className="mt-1 text-sm text-text-secondary">
                  Premium models offer advanced reasoning and creativity - use them when the task
                  justifies the cost.
                </p>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Footer Note */}
        <div className="mt-12 rounded-lg border border-border-medium bg-surface-secondary p-6 text-center">
          <p className="text-sm text-text-secondary">
            Pricing is based on actual costs per 1 million tokens. Your token balance is deducted
            proportionally based on your usage.
          </p>
          <p className="mt-2 text-xs text-text-secondary">
            Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
    </div>
  );
};
