/**
 * CUSTOM: gptchina fork
 *
 * Feature: Token Usage Guide
 * File: Pricing data constants
 * Created: 2025-12-09
 * Upstream Impact: None (standalone module)
 */

export interface ModelPricing {
  model: string;
  inputCost: number;
  outputCost: number;
  bestForKey: string;
}

export interface CalculationExample {
  scenario: string;
  model: string;
  inputCost: number;
  outputCost: number;
}

export const MODEL_PRICING: ModelPricing[] = [
  {
    model: 'GPT-5-mini',
    inputCost: 0.25,
    outputCost: 2.0,
    bestForKey: 'com_custom_usage_guide_best_for_mini',
  },
  {
    model: 'Claude Haiku 4.5',
    inputCost: 1.0,
    outputCost: 5.0,
    bestForKey: 'com_custom_usage_guide_best_for_haiku',
  },
  {
    model: 'GPT-5.1',
    inputCost: 1.25,
    outputCost: 10.0,
    bestForKey: 'com_custom_usage_guide_best_for_standard',
  },
  {
    model: 'Gemini 3 Pro',
    inputCost: 2.0,
    outputCost: 12.0,
    bestForKey: 'com_custom_usage_guide_best_for_gemini',
  },
  {
    model: 'Claude Sonnet 4.5',
    inputCost: 3.0,
    outputCost: 15.0,
    bestForKey: 'com_custom_usage_guide_best_for_sonnet',
  },
  {
    model: 'Claude Opus 4.1',
    inputCost: 15.0,
    outputCost: 75.0,
    bestForKey: 'com_custom_usage_guide_best_for_opus',
  },
];

export const CALCULATION_EXAMPLES: CalculationExample[] = [
  {
    scenario: 'A',
    model: 'GPT-5-mini',
    inputCost: 0.25,
    outputCost: 2.0,
  },
  {
    scenario: 'B',
    model: 'GPT-5.1',
    inputCost: 1.25,
    outputCost: 10.0,
  },
  {
    scenario: 'C',
    model: 'Claude Opus 4.1',
    inputCost: 15.0,
    outputCost: 75.0,
  },
];

// Constants for calculation examples
export const CONTEXT_TOKENS = 1000;
export const NEW_PROMPT_TOKENS = 100;
export const RESPONSE_TOKENS = 200;
export const TOTAL_INPUT = CONTEXT_TOKENS + NEW_PROMPT_TOKENS; // 1100
export const TOTAL_OUTPUT = RESPONSE_TOKENS; // 200
