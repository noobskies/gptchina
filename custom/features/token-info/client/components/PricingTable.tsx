/**
 * CUSTOM: gptchina fork
 *
 * Feature: Token Info / Pricing Guide
 * Created: 2025-11-14
 * Upstream Impact: None (standalone module)
 *
 * Pricing table component showing categorized model costs.
 */

import React from 'react';

interface PricingModel {
  model: string;
  input: number;
  output: number;
  total: number;
}

interface PricingTableProps {
  title: string;
  models: PricingModel[];
  categoryColor: 'green' | 'yellow' | 'red';
}

const colorClasses = {
  green: 'border-green-500 bg-green-50 dark:bg-green-900/10',
  yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
  red: 'border-red-500 bg-red-50 dark:bg-red-900/10',
};

const iconClasses = {
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
};

export const PricingTable: React.FC<PricingTableProps> = ({ title, models, categoryColor }) => {
  return (
    <div className={`mb-6 rounded-lg border-2 ${colorClasses[categoryColor]} p-4`}>
      <h3 className={`mb-3 flex items-center text-lg font-semibold ${iconClasses[categoryColor]}`}>
        <span className="mr-2 text-2xl">
          {categoryColor === 'green' && '🟢'}
          {categoryColor === 'yellow' && '🟡'}
          {categoryColor === 'red' && '🔴'}
        </span>
        {title}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-medium text-left">
              <th className="pb-2 font-semibold text-text-primary">Model</th>
              <th className="pb-2 text-right font-semibold text-text-primary">Input</th>
              <th className="pb-2 text-right font-semibold text-text-primary">Output</th>
              <th className="pb-2 text-right font-semibold text-text-primary">Total</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.model} className="border-b border-border-light last:border-0">
                <td className="py-2 font-mono text-text-primary">{model.model}</td>
                <td className="py-2 text-right text-text-secondary">{model.input.toFixed(2)}</td>
                <td className="py-2 text-right text-text-secondary">{model.output.toFixed(2)}</td>
                <td className="py-2 text-right font-semibold text-text-primary">
                  {model.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-text-secondary">Prices shown per 1 million tokens</p>
    </div>
  );
};
