/**
 * CUSTOM: gptchina fork
 *
 * Feature: Token Usage Guide
 * File: Main page component
 * Created: 2025-12-09
 * Upstream Impact: None (standalone module)
 *
 * Educational guide explaining token costs, model pricing, and optimization strategies.
 * Full-page component with 7 sections covering all aspects of token usage.
 */

import React from 'react';
import { useLocalize } from '~/hooks';
import {
  MODEL_PRICING,
  CALCULATION_EXAMPLES,
  TOTAL_INPUT,
  TOTAL_OUTPUT,
  CONTEXT_TOKENS,
  NEW_PROMPT_TOKENS,
  RESPONSE_TOKENS,
} from './data';

export default function TokenUsageGuidePage() {
  const localize = useLocalize();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-surface-primary text-text-primary">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold">
            {(localize as any)('com_custom_usage_guide_title')}
          </h1>

          {/* Introduction */}
          <section className="mb-8">
            <p className="mb-4 text-base leading-relaxed">
              {(localize as any)('com_custom_usage_guide_intro')}
            </p>
            <p className="mb-4 text-base leading-relaxed">
              {(localize as any)('com_custom_usage_guide_intro_2')}
            </p>
          </section>

          {/* Understanding Input vs Output */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              {(localize as any)('com_custom_usage_guide_understanding_title')}
            </h2>
            <p className="mb-3 text-base">
              {(localize as any)('com_custom_usage_guide_understanding_intro')}
            </p>
            <ol className="mb-4 ml-6 list-decimal space-y-2">
              <li className="text-base leading-relaxed">
                <strong>{(localize as any)('com_custom_usage_guide_input_label')}</strong>{' '}
                {(localize as any)('com_custom_usage_guide_input_desc')}
              </li>
              <li className="text-base leading-relaxed">
                <strong>{(localize as any)('com_custom_usage_guide_output_label')}</strong>{' '}
                {(localize as any)('com_custom_usage_guide_output_desc')}
              </li>
            </ol>
            <div className="rounded-lg bg-surface-secondary px-4 py-3">
              <p className="text-sm italic">
                <strong>{(localize as any)('com_custom_usage_guide_note_label')}</strong>{' '}
                {(localize as any)('com_custom_usage_guide_note_content')}
              </p>
            </div>
          </section>

          {/* Model Pricing Table */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              {(localize as any)('com_custom_usage_guide_pricing_title')}
            </h2>
            <p className="mb-4 text-sm italic text-text-secondary">
              {(localize as any)('com_custom_usage_guide_pricing_note')}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg border border-border-medium">
                <thead>
                  <tr className="bg-surface-secondary">
                    <th className="border border-border-medium px-4 py-3 text-left font-semibold">
                      {(localize as any)('com_custom_usage_guide_table_model')}
                    </th>
                    <th className="border border-border-medium px-4 py-3 text-left font-semibold">
                      {(localize as any)('com_custom_usage_guide_table_input')}
                    </th>
                    <th className="border border-border-medium px-4 py-3 text-left font-semibold">
                      {(localize as any)('com_custom_usage_guide_table_output')}
                    </th>
                    <th className="border border-border-medium px-4 py-3 text-left font-semibold">
                      {(localize as any)('com_custom_usage_guide_table_best_for')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MODEL_PRICING.map((pricing, index) => (
                    <tr key={index} className="hover:bg-surface-hover">
                      <td className="border border-border-medium px-4 py-3 font-medium">
                        {pricing.model}
                      </td>
                      <td className="border border-border-medium px-4 py-3">
                        {pricing.inputCost.toFixed(2)}
                      </td>
                      <td className="border border-border-medium px-4 py-3">
                        {pricing.outputCost.toFixed(2)}
                      </td>
                      <td className="border border-border-medium px-4 py-3 text-sm">
                        {(localize as any)(pricing.bestForKey)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Thinking & Reasoning Models */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              {(localize as any)('com_custom_usage_guide_reasoning_title')}
            </h2>
            <p className="mb-3 text-base leading-relaxed">
              {(localize as any)('com_custom_usage_guide_reasoning_intro')}
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li className="text-base leading-relaxed">
                <strong>
                  {(localize as any)('com_custom_usage_guide_reasoning_transparency_label')}
                </strong>{' '}
                {(localize as any)('com_custom_usage_guide_reasoning_transparency_desc')}
              </li>
              <li className="text-base leading-relaxed">
                <strong>{(localize as any)('com_custom_usage_guide_reasoning_cost_label')}</strong>{' '}
                {(localize as any)('com_custom_usage_guide_reasoning_cost_desc')}
              </li>
            </ul>
          </section>

          {/* Real-World Calculation Example */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              {(localize as any)('com_custom_usage_guide_example_title')}
            </h2>
            <p className="mb-4 text-base leading-relaxed">
              {(localize as any)('com_custom_usage_guide_example_intro')}
            </p>
            <div className="mb-4 rounded-lg bg-surface-secondary px-4 py-3">
              <p className="font-mono text-sm">
                {(localize as any)('com_custom_usage_guide_example_total_input', {
                  context: CONTEXT_TOKENS.toLocaleString(),
                  prompt: NEW_PROMPT_TOKENS.toLocaleString(),
                })}
              </p>
              <p className="font-mono text-sm">
                {(localize as any)('com_custom_usage_guide_example_total_output', {
                  output: RESPONSE_TOKENS.toLocaleString(),
                })}
              </p>
            </div>

            {/* Calculation Examples */}
            {CALCULATION_EXAMPLES.map((example) => {
              const inputCharge = TOTAL_INPUT * example.inputCost;
              const outputCharge = TOTAL_OUTPUT * example.outputCost;
              const totalCost = inputCharge + outputCharge;

              return (
                <div key={example.scenario} className="mb-6">
                  <h3 className="mb-2 text-lg font-semibold">
                    {(localize as any)(
                      `com_custom_usage_guide_example_scenario_${example.scenario.toLowerCase()}`,
                      {
                        model: example.model,
                      },
                    )}
                  </h3>
                  <ul className="ml-6 list-disc space-y-1 text-base">
                    <li>
                      {(localize as any)('com_custom_usage_guide_example_input_charge', {
                        calculation: `${TOTAL_INPUT.toLocaleString()} × ${example.inputCost}`,
                        amount: inputCharge.toLocaleString(),
                      })}
                    </li>
                    <li>
                      {(localize as any)('com_custom_usage_guide_example_output_charge', {
                        calculation: `${TOTAL_OUTPUT.toLocaleString()} × ${example.outputCost}`,
                        amount: outputCharge.toLocaleString(),
                      })}
                    </li>
                    <li className="font-semibold">
                      {(localize as any)('com_custom_usage_guide_example_total_cost', {
                        amount: totalCost.toLocaleString(),
                      })}
                    </li>
                  </ul>
                </div>
              );
            })}

            <p className="text-base italic text-text-secondary">
              {(localize as any)('com_custom_usage_guide_example_conclusion')}
            </p>
          </section>

          {/* Top Tips for Saving Tokens */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              {(localize as any)('com_custom_usage_guide_tips_title')}
            </h2>
            <ol className="ml-6 list-decimal space-y-4">
              <li>
                <strong className="text-base">
                  {(localize as any)('com_custom_usage_guide_tip_1_title')}
                </strong>
                <p className="mt-1 text-base leading-relaxed">
                  {(localize as any)('com_custom_usage_guide_tip_1_desc')}
                </p>
              </li>
              <li>
                <strong className="text-base">
                  {(localize as any)('com_custom_usage_guide_tip_2_title')}
                </strong>
                <p className="mt-1 text-base leading-relaxed">
                  {(localize as any)('com_custom_usage_guide_tip_2_desc')}
                </p>
              </li>
              <li>
                <strong className="text-base">
                  {(localize as any)('com_custom_usage_guide_tip_3_title')}
                </strong>
                <p className="mt-1 text-base leading-relaxed">
                  {(localize as any)('com_custom_usage_guide_tip_3_desc')}
                </p>
              </li>
            </ol>
          </section>

          {/* Controlling Costs with Parameters */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              {(localize as any)('com_custom_usage_guide_parameters_title')}
            </h2>
            <p className="mb-6 text-base leading-relaxed">
              {(localize as any)('com_custom_usage_guide_parameters_intro')}
            </p>

            {/* Max Context Tokens */}
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">
                {(localize as any)('com_custom_usage_guide_param_context_title')}
              </h3>
              <ul className="ml-6 list-disc space-y-1 text-base">
                <li>
                  <strong>{(localize as any)('com_custom_usage_guide_param_how_label')}</strong>{' '}
                  {(localize as any)('com_custom_usage_guide_param_context_how')}
                </li>
                <li>
                  <strong>{(localize as any)('com_custom_usage_guide_param_why_label')}</strong>{' '}
                  {(localize as any)('com_custom_usage_guide_param_context_why')}
                </li>
                <li className="italic text-text-secondary">
                  <strong>{(localize as any)('com_custom_usage_guide_note_label')}</strong>{' '}
                  {(localize as any)('com_custom_usage_guide_param_context_note')}
                </li>
              </ul>
            </div>

            {/* Max Output Tokens */}
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">
                {(localize as any)('com_custom_usage_guide_param_output_title')}
              </h3>
              <ul className="ml-6 list-disc space-y-1 text-base">
                <li>
                  <strong>{(localize as any)('com_custom_usage_guide_param_how_label')}</strong>{' '}
                  {(localize as any)('com_custom_usage_guide_param_output_how')}
                </li>
                <li>
                  <strong>{(localize as any)('com_custom_usage_guide_param_why_label')}</strong>{' '}
                  {(localize as any)('com_custom_usage_guide_param_output_why')}
                </li>
              </ul>
            </div>

            {/* Thinking Budget */}
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">
                {(localize as any)('com_custom_usage_guide_param_thinking_title')}
              </h3>
              <p className="mb-2 text-base leading-relaxed">
                {(localize as any)('com_custom_usage_guide_param_thinking_desc')}
              </p>
              <ul className="ml-6 list-disc space-y-1 text-base">
                <li>
                  <strong>
                    {(localize as any)('com_custom_usage_guide_param_thinking_higher_label')}
                  </strong>{' '}
                  {(localize as any)('com_custom_usage_guide_param_thinking_higher_desc')}
                </li>
                <li>
                  <strong>
                    {(localize as any)('com_custom_usage_guide_param_thinking_lower_label')}
                  </strong>{' '}
                  {(localize as any)('com_custom_usage_guide_param_thinking_lower_desc')}
                </li>
                <li className="italic text-text-secondary">
                  <strong>
                    {(localize as any)('com_custom_usage_guide_param_thinking_important_label')}
                  </strong>{' '}
                  {(localize as any)('com_custom_usage_guide_param_thinking_note')}
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
