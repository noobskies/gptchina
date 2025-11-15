/**
 * CUSTOM: gptchina fork
 *
 * Feature: Token Info / Pricing Guide
 * Created: 2025-11-14
 * Upstream Impact: None (standalone module)
 *
 * Interactive cost calculator component.
 */

import React, { useState, useEffect } from 'react';
import { request } from 'librechat-data-provider';

interface CalculationResult {
  model: string;
  input: {
    words: number;
    tokens: number;
    cost: number;
  };
  output: {
    words: number;
    tokens: number;
    cost: number;
  };
  total: {
    tokens: number;
    cost: number;
  };
  context: {
    freeTokens: number;
    conversationsPossible: number;
  };
}

interface CostCalculatorProps {
  models: Array<{ model: string; input: number; output: number }>;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ models }) => {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [inputWords, setInputWords] = useState(1000);
  const [outputWords, setOutputWords] = useState(1000);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Flatten all models for dropdown
  const allModels = models.flatMap((category) => category);

  useEffect(() => {
    calculateCost();
  }, [selectedModel, inputWords, outputWords]);

  const calculateCost = async () => {
    if (!selectedModel || !inputWords || !outputWords) {
      return;
    }

    try {
      setIsCalculating(true);
      setError(null);

      const response = (await request.get(
        `/api/custom/token-info/calculate?model=${encodeURIComponent(
          selectedModel,
        )}&inputWords=${inputWords}&outputWords=${outputWords}`,
      )) as { success: boolean; data?: CalculationResult };

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError('Failed to calculate cost');
      }
    } catch (err) {
      console.error('Error calculating cost:', err);
      setError('Failed to calculate cost');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-6 dark:bg-blue-900/10">
      <h3 className="mb-4 flex items-center text-lg font-semibold text-blue-600 dark:text-blue-400">
        <span className="mr-2 text-2xl">🧮</span>
        Cost Calculator
      </h3>

      <div className="space-y-4">
        {/* Model selector */}
        <div>
          <label
            htmlFor="model-select"
            className="mb-1 block text-sm font-medium text-text-primary"
          >
            Model
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded-md border border-border-medium bg-background px-3 py-2 text-text-primary focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {allModels.map((model) => (
              <option key={model.model} value={model.model}>
                {model.model}
              </option>
            ))}
          </select>
        </div>

        {/* Input words */}
        <div>
          <label htmlFor="input-words" className="mb-1 block text-sm font-medium text-text-primary">
            Message Length (words)
          </label>
          <input
            id="input-words"
            type="number"
            min="1"
            value={inputWords}
            onChange={(e) => setInputWords(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full rounded-md border border-border-medium bg-background px-3 py-2 text-text-primary focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Output words */}
        <div>
          <label
            htmlFor="output-words"
            className="mb-1 block text-sm font-medium text-text-primary"
          >
            Response Length (words)
          </label>
          <input
            id="output-words"
            type="number"
            min="1"
            value={outputWords}
            onChange={(e) => setOutputWords(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full rounded-md border border-border-medium bg-background px-3 py-2 text-text-primary focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Results */}
        {isCalculating && (
          <div className="rounded-md bg-background p-4 text-center text-text-secondary">
            Calculating...
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {result && !isCalculating && !error && (
          <div className="rounded-md bg-background p-4">
            <h4 className="mb-3 font-semibold text-text-primary">📊 Estimated Cost:</h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Input:</span>
                <span className="font-mono text-text-primary">
                  ~{result.input.tokens.toLocaleString()} tokens = {result.input.cost.toFixed(6)}{' '}
                  credits
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Output:</span>
                <span className="font-mono text-text-primary">
                  ~{result.output.tokens.toLocaleString()} tokens = {result.output.cost.toFixed(6)}{' '}
                  credits
                </span>
              </div>
              <div className="my-2 border-t border-border-medium"></div>
              <div className="flex justify-between font-semibold">
                <span className="text-text-primary">Total:</span>
                <span className="font-mono text-text-primary">
                  ~{result.total.tokens.toLocaleString()} tokens = {result.total.cost.toFixed(6)}{' '}
                  credits
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                💡 Your 20,000 free tokens ={' '}
                <span className="font-semibold">
                  ~{result.context.conversationsPossible.toLocaleString()} conversations
                </span>{' '}
                like this with {selectedModel}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
