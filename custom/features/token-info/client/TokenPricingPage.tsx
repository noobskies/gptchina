/**
 * CUSTOM: gptchina fork
 *
 * Feature: Token Info / Pricing Guide
 * Created: 2025-11-14
 * Upstream Impact: None (standalone module)
 *
 * Standalone pricing page that opens in a new tab.
 */

import React, { useEffect, useState } from 'react';
import { request } from 'librechat-data-provider';
import { PricingTable } from './components/PricingTable';
import { CostCalculator } from './components/CostCalculator';

interface PricingData {
  budget: Array<{ model: string; input: number; output: number; total: number }>;
  mid: Array<{ model: string; input: number; output: number; total: number }>;
  premium: Array<{ model: string; input: number; output: number; total: number }>;
}

export const TokenPricingPage: React.FC = () => {
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
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-text-secondary">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  if (error || !pricingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-4xl">❌</div>
          <p className="text-text-primary">{error || 'Failed to load pricing data'}</p>
        </div>
      </div>
    );
  }

  // Combine all models for calculator
  const allModels = [...pricingData.budget, ...pricingData.mid, ...pricingData.premium];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border-medium bg-surface-primary py-6">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="mb-2 text-3xl font-bold text-text-primary">Token Pricing Guide</h1>
          <p className="text-text-secondary">
            Understand how token consumption works and estimate your costs
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* How It Works Section */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center text-2xl font-bold text-text-primary">
            <span className="mr-2 text-3xl">📚</span>
            How Token Consumption Works
          </h2>
          <div className="space-y-4 rounded-lg bg-surface-secondary p-6 text-text-secondary">
            <p>
              Tokens are the fundamental units of text processing in AI models. Both your messages
              (input) and the AI's responses (output) consume tokens.
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong className="text-text-primary">Input tokens</strong> = your message to the AI
                (prompt, question, instruction)
              </li>
              <li>
                <strong className="text-text-primary">Output tokens</strong> = the AI's response to
                your message
              </li>
              <li>
                <strong className="text-text-primary">Pricing shown per 1 million tokens</strong> -
                actual costs are proportional to usage
              </li>
            </ul>
            <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              💡 <strong>Quick estimate:</strong> 1 word ≈ 1.3 tokens on average. A 1000-word
              conversation uses ~2,600 tokens total.
            </p>
          </div>
        </section>

        {/* Pricing Tables Section */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center text-2xl font-bold text-text-primary">
            <span className="mr-2 text-3xl">💰</span>
            Pricing by Category
          </h2>

          <PricingTable
            title="Budget-Friendly Models"
            models={pricingData.budget}
            categoryColor="green"
          />
          <PricingTable title="Mid-Range Models" models={pricingData.mid} categoryColor="yellow" />
          <PricingTable title="Premium Models" models={pricingData.premium} categoryColor="red" />
        </section>

        {/* Calculator Section */}
        <section className="mb-12">
          <CostCalculator models={allModels} />
        </section>

        {/* Package Value Section */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center text-2xl font-bold text-text-primary">
            <span className="mr-2 text-3xl">📦</span>
            What Can You Do with Each Package?
          </h2>
          <div className="space-y-4">
            <p className="text-text-secondary">
              Based on a typical conversation:{' '}
              <strong className="text-text-primary">200 words sent, 300 words received</strong>{' '}
              (~650 tokens total)
            </p>

            {/* 100K Package */}
            <div className="rounded-lg bg-surface-secondary p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">100,000 Tokens (¥10)</h3>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  Starter
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">gpt-4o-mini (Budget):</span>
                  <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                    ~205,000 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">gpt-4o (Mid-Range):</span>
                  <span className="font-mono font-semibold text-text-primary">
                    ~12,300 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">claude-3.5-sonnet:</span>
                  <span className="font-mono font-semibold text-text-primary">
                    ~8,500 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">o1 (Premium):</span>
                  <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">
                    ~2,000 conversations
                  </span>
                </div>
              </div>
            </div>

            {/* 500K Package */}
            <div className="rounded-lg border-2 border-blue-500 bg-surface-secondary p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">500,000 Tokens (¥35)</h3>
                <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                  ⭐ Most Popular
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">gpt-4o-mini (Budget):</span>
                  <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                    ~1,025,000 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">gpt-4o (Mid-Range):</span>
                  <span className="font-mono font-semibold text-text-primary">
                    ~61,500 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">claude-3.5-sonnet:</span>
                  <span className="font-mono font-semibold text-text-primary">
                    ~42,700 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">o1 (Premium):</span>
                  <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">
                    ~10,200 conversations
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                💡 Save 30% - was ¥50, now ¥35
              </p>
            </div>

            {/* 1M Package */}
            <div className="rounded-lg bg-surface-secondary p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">1,000,000 Tokens (¥55)</h3>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  Best Value
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">gpt-4o-mini (Budget):</span>
                  <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                    ~2,050,000 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">gpt-4o (Mid-Range):</span>
                  <span className="font-mono font-semibold text-text-primary">
                    ~123,000 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">claude-3.5-sonnet:</span>
                  <span className="font-mono font-semibold text-text-primary">
                    ~85,400 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">o1 (Premium):</span>
                  <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">
                    ~20,500 conversations
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-purple-600 dark:text-purple-400">
                💡 Save 45% - was ¥100, now ¥55
              </p>
            </div>

            {/* 10M Package */}
            <div className="rounded-lg bg-surface-secondary p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">10,000,000 Tokens (¥280)</h3>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Power User
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">gpt-4o-mini (Budget):</span>
                  <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                    ~20,500,000 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">gpt-4o (Mid-Range):</span>
                  <span className="font-mono font-semibold text-text-primary">
                    ~1,230,000 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">claude-3.5-sonnet:</span>
                  <span className="font-mono font-semibold text-text-primary">
                    ~854,000 conversations
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">o1 (Premium):</span>
                  <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">
                    ~205,000 conversations
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
                💡 Save 72% - was ¥1,000, now ¥280
              </p>
            </div>
          </div>
        </section>

        {/* Real Conversation Examples */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center text-2xl font-bold text-text-primary">
            <span className="mr-2 text-3xl">📝</span>
            Real Conversation Examples
          </h2>
          <div className="space-y-6">
            <p className="text-text-secondary">
              See exactly how much different types of conversations cost across models:
            </p>

            {/* Quick Question */}
            <div className="rounded-lg bg-surface-secondary p-6">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-text-primary">
                <span className="mr-2">💬</span>
                Quick Question (50 words in, 100 words out = ~195 tokens)
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-green-50 p-3 dark:bg-green-900/10">
                  <span className="font-medium text-text-primary">gpt-4o-mini</span>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                      0.0001 credits
                    </div>
                    <div className="text-xs text-text-secondary">10,000 questions per ¥10</div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md bg-blue-50 p-3 dark:bg-blue-900/10">
                  <span className="font-medium text-text-primary">gpt-4o</span>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                      0.0024 credits
                    </div>
                    <div className="text-xs text-text-secondary">41,000 questions per ¥10</div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md bg-orange-50 p-3 dark:bg-orange-900/10">
                  <span className="font-medium text-text-primary">o1</span>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">
                      0.0146 credits
                    </div>
                    <div className="text-xs text-text-secondary">6,800 questions per ¥10</div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs italic text-text-secondary">
                💡 For simple questions, budget models are 100x more cost-effective!
              </p>
            </div>

            {/* Standard Chat */}
            <div className="rounded-lg bg-surface-secondary p-6">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-text-primary">
                <span className="mr-2">💭</span>
                Standard Chat (200 words in, 300 words out = ~650 tokens)
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-green-50 p-3 dark:bg-green-900/10">
                  <span className="font-medium text-text-primary">gpt-4o-mini</span>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                      0.0005 credits
                    </div>
                    <div className="text-xs text-text-secondary">205,000 chats per ¥10</div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md bg-blue-50 p-3 dark:bg-blue-900/10">
                  <span className="font-medium text-text-primary">gpt-4o</span>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                      0.0081 credits
                    </div>
                    <div className="text-xs text-text-secondary">12,300 chats per ¥10</div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md bg-orange-50 p-3 dark:bg-orange-900/10">
                  <span className="font-medium text-text-primary">o1</span>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">
                      0.0488 credits
                    </div>
                    <div className="text-xs text-text-secondary">2,000 chats per ¥10</div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs italic text-text-secondary">
                💡 This is the "typical conversation" used in package calculations above
              </p>
            </div>

            {/* Deep Dive */}
            <div className="rounded-lg bg-surface-secondary p-6">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-text-primary">
                <span className="mr-2">📚</span>
                Deep Dive (500 words in, 1000 words out = ~1,950 tokens)
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-green-50 p-3 dark:bg-green-900/10">
                  <span className="font-medium text-text-primary">gpt-4o-mini</span>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                      0.0015 credits
                    </div>
                    <div className="text-xs text-text-secondary">68,000 deep dives per ¥10</div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md bg-blue-50 p-3 dark:bg-blue-900/10">
                  <span className="font-medium text-text-primary">gpt-4o</span>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                      0.0244 credits
                    </div>
                    <div className="text-xs text-text-secondary">4,100 deep dives per ¥10</div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md bg-orange-50 p-3 dark:bg-orange-900/10">
                  <span className="font-medium text-text-primary">o1</span>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">
                      0.1463 credits
                    </div>
                    <div className="text-xs text-text-secondary">680 deep dives per ¥10</div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs italic text-text-secondary">
                💡 For long conversations, model selection significantly impacts costs
              </p>
            </div>

            {/* Comparison Summary */}
            <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-6 dark:bg-blue-900/10">
              <h3 className="mb-3 flex items-center text-lg font-semibold text-blue-600 dark:text-blue-400">
                <span className="mr-2">⚡</span>
                Cost Comparison Summary
              </h3>
              <div className="space-y-2 text-sm text-text-secondary">
                <p>
                  For the <strong className="text-text-primary">same 650-token conversation</strong>
                  :
                </p>
                <ul className="ml-6 space-y-1">
                  <li>
                    gpt-4o-mini costs{' '}
                    <strong className="text-green-600 dark:text-green-400">0.0005 credits</strong>{' '}
                    (baseline)
                  </li>
                  <li>
                    gpt-4o costs{' '}
                    <strong className="text-blue-600 dark:text-blue-400">0.0081 credits</strong>{' '}
                    (16x more)
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
                <p className="mt-3 rounded-md bg-blue-100 p-3 dark:bg-blue-900/20">
                  <strong className="text-blue-700 dark:text-blue-300">💡 Smart Usage Tip:</strong>{' '}
                  Use budget models (gpt-4o-mini, gemini-2.0-flash) for everyday tasks. Save premium
                  models (o1, claude-opus-4) for complex reasoning, coding, or creative work where
                  quality justifies the cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center text-2xl font-bold text-text-primary">
            <span className="mr-2 text-3xl">💡</span>
            Tips for Managing Tokens
          </h2>
          <div className="space-y-3 rounded-lg bg-surface-secondary p-6">
            <div className="flex items-start">
              <span className="mr-3 text-2xl">🎯</span>
              <div>
                <strong className="text-text-primary">Choose the right model</strong>
                <p className="text-text-secondary">
                  Use budget models for simple queries and save premium models for complex reasoning
                  tasks.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-2xl">✂️</span>
              <div>
                <strong className="text-text-primary">Keep prompts concise</strong>
                <p className="text-text-secondary">
                  Shorter, well-structured prompts are more cost-effective and often yield better
                  results.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-2xl">🎁</span>
              <div>
                <strong className="text-text-primary">Claim free tokens</strong>
                <p className="text-text-secondary">
                  Remember to claim your 20,000 free tokens every 24 hours to maximize value!
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-2xl">📊</span>
              <div>
                <strong className="text-text-primary">Consider capability vs cost</strong>
                <p className="text-text-secondary">
                  Premium models offer advanced reasoning and creativity - use them when the task
                  justifies the cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="rounded-lg border border-border-medium bg-surface-secondary p-6 text-center">
          <p className="text-sm text-text-secondary">
            Pricing is based on actual costs per 1 million tokens. Your token balance is deducted
            proportionally based on your usage.
          </p>
          <p className="mt-2 text-xs text-text-secondary">
            Updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </main>
    </div>
  );
};
