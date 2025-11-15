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
        <SectionContainer title="Understanding Burn Rates" icon={BookOpen}>
          <div className="rounded-lg bg-surface-secondary p-6">
            <div className="space-y-4 text-text-secondary">
              <p>
                Tokens are the fundamental units of text processing in AI models. Different models
                consume tokens at different rates, which we measure using a{' '}
                <strong className="text-text-primary">Burn Rate (BR)</strong>.
              </p>
              <div className="my-4 rounded-lg border-2 border-blue-500 bg-blue-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
                      What is Burn Rate (BR)?
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      BR is a multiplier that shows how expensive a model is relative to a $1
                      baseline. Higher BR = faster token consumption = higher costs.
                    </p>
                  </div>
                </div>
              </div>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong className="text-text-primary">Budget models</strong> have low BR
                  (0.15-1.5) - great for everyday tasks
                </li>
                <li>
                  <strong className="text-text-primary">Mid-range models</strong> have medium BR
                  (2.5-15) - balanced performance and cost
                </li>
                <li>
                  <strong className="text-text-primary">Premium models</strong> have high BR
                  (15-60+) - advanced reasoning, use when quality matters
                </li>
              </ul>
              <div className="mt-4 rounded-md border border-border-medium bg-surface-tertiary p-4">
                <p className="mb-2 font-semibold text-text-primary">Quick Comparison:</p>
                <ul className="space-y-1 text-sm">
                  <li>• gpt-4o-mini: BR ~0.38 (baseline - most economical)</li>
                  <li>• gpt-4o: BR ~6.25 (16x more expensive)</li>
                  <li>• o1: BR ~37.5 (98x more expensive!)</li>
                </ul>
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
        <SectionContainer title="Token Consumption Examples" icon={MessageSquare}>
          <p className="mb-6 text-text-secondary">
            See exactly how many tokens different types of conversations consume across models:
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Quick Question */}
            <div className="rounded-lg border border-border-medium bg-surface-secondary p-6">
              <h3 className="mb-4 text-lg font-semibold text-text-primary">Quick Question</h3>
              <p className="mb-4 text-sm text-text-secondary">
                50 words in, 100 words out (150 words total)
              </p>
              <div className="space-y-3">
                <div className="rounded-md bg-green-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o-mini</div>
                  <div className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                    ~74 tokens
                  </div>
                  <div className="text-xs text-text-secondary">
                    Cost: ¥0.001 | 10,000 questions per ¥10
                  </div>
                </div>
                <div className="rounded-md bg-blue-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o</div>
                  <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                    ~1,215 tokens
                  </div>
                  <div className="text-xs text-text-secondary">
                    Cost: ¥0.024 | 410 questions per ¥10
                  </div>
                </div>
                <div className="rounded-md bg-orange-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">o1</div>
                  <div className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">
                    ~7,313 tokens
                  </div>
                  <div className="text-xs text-text-secondary">
                    Cost: ¥0.146 | 68 questions per ¥10
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Chat */}
            <div className="rounded-lg border border-border-medium bg-surface-secondary p-6">
              <h3 className="mb-4 text-lg font-semibold text-text-primary">Standard Chat</h3>
              <p className="mb-4 text-sm text-text-secondary">
                200 words in, 300 words out (500 words total)
              </p>
              <div className="space-y-3">
                <div className="rounded-md bg-green-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o-mini</div>
                  <div className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                    ~247 tokens
                  </div>
                  <div className="text-xs text-text-secondary">
                    Cost: ¥0.005 | 2,050 chats per ¥10
                  </div>
                </div>
                <div className="rounded-md bg-blue-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o</div>
                  <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                    ~4,050 tokens
                  </div>
                  <div className="text-xs text-text-secondary">
                    Cost: ¥0.081 | 123 chats per ¥10
                  </div>
                </div>
                <div className="rounded-md bg-orange-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">o1</div>
                  <div className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">
                    ~24,375 tokens
                  </div>
                  <div className="text-xs text-text-secondary">Cost: ¥0.488 | 20 chats per ¥10</div>
                </div>
              </div>
            </div>

            {/* Deep Dive */}
            <div className="rounded-lg border border-border-medium bg-surface-secondary p-6">
              <h3 className="mb-4 text-lg font-semibold text-text-primary">Deep Dive</h3>
              <p className="mb-4 text-sm text-text-secondary">
                500 words in, 1000 words out (1,500 words total)
              </p>
              <div className="space-y-3">
                <div className="rounded-md bg-green-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o-mini</div>
                  <div className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                    ~741 tokens
                  </div>
                  <div className="text-xs text-text-secondary">
                    Cost: ¥0.015 | 680 deep dives per ¥10
                  </div>
                </div>
                <div className="rounded-md bg-blue-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">gpt-4o</div>
                  <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                    ~12,150 tokens
                  </div>
                  <div className="text-xs text-text-secondary">
                    Cost: ¥0.244 | 41 deep dives per ¥10
                  </div>
                </div>
                <div className="rounded-md bg-orange-500/10 p-3">
                  <div className="mb-1 font-medium text-text-primary">o1</div>
                  <div className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">
                    ~73,125 tokens
                  </div>
                  <div className="text-xs text-text-secondary">
                    Cost: ¥1.463 | 7 deep dives per ¥10
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="mt-6 rounded-lg border-2 border-blue-500 bg-blue-500/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                Why Token Consumption Varies So Much
              </h3>
            </div>
            <div className="space-y-3 text-sm text-text-secondary">
              <p>
                For the <strong className="text-text-primary">same 500-word conversation</strong>:
              </p>
              <ul className="ml-6 space-y-1">
                <li>
                  gpt-4o-mini consumes{' '}
                  <strong className="text-green-600 dark:text-green-400">~247 tokens</strong>{' '}
                  (baseline)
                </li>
                <li>
                  gpt-4o consumes{' '}
                  <strong className="text-blue-600 dark:text-blue-400">~4,050 tokens</strong> (16x
                  more)
                </li>
                <li>
                  o1 consumes{' '}
                  <strong className="text-orange-600 dark:text-orange-400">~24,375 tokens</strong>{' '}
                  (98x more!)
                </li>
              </ul>
              <p className="mt-3">
                This is why{' '}
                <strong className="text-text-primary">choosing the right model matters</strong>!
                Budget models are perfect for everyday tasks, while premium models should be
                reserved for complex work.
              </p>
              <div className="mt-4 rounded-md border border-blue-500/20 bg-blue-500/10 p-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <p className="text-blue-600 dark:text-blue-400">
                    <strong>Smart Usage Tip:</strong> Use budget models (gpt-4o-mini,
                    gemini-2.0-flash) for everyday tasks. Save premium models (o1, claude-opus-4)
                    for complex reasoning, coding, or creative work where quality justifies the
                    higher token consumption.
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
