/**
 * CUSTOM: gptchina fork
 * Model pricing card component with category badges
 */

import React from 'react';
import { DollarSign } from 'lucide-react';

interface Model {
  model: string;
  input: number;
  output: number;
  total: number;
}

interface ModelPricingCardProps {
  title: string;
  models: Model[];
  categoryColor: 'success' | 'warning' | 'error';
}

const categoryStyles = {
  success: 'border-green-500/20 bg-green-500/5',
  warning: 'border-yellow-500/20 bg-yellow-500/5',
  error: 'border-red-500/20 bg-red-500/5',
};

export const ModelPricingCard: React.FC<ModelPricingCardProps> = ({
  title,
  models,
  categoryColor,
}) => {
  return (
    <div
      className={`mb-6 rounded-lg border-2 p-6 transition-all hover:shadow-md ${categoryStyles[categoryColor]}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
            categoryColor === 'success'
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : categoryColor === 'warning'
                ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          <DollarSign className="h-3 w-3" />
          {categoryColor === 'success'
            ? 'Budget'
            : categoryColor === 'warning'
              ? 'Mid-Range'
              : 'Premium'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-medium">
              <th className="pb-3 text-left text-sm font-semibold text-text-primary">Model</th>
              <th className="pb-3 text-right text-sm font-semibold text-text-primary">
                Input (per 1M)
              </th>
              <th className="pb-3 text-right text-sm font-semibold text-text-primary">
                Output (per 1M)
              </th>
              <th className="pb-3 text-right text-sm font-semibold text-text-primary">Total</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, index) => (
              <tr
                key={model.model}
                className={`transition-colors hover:bg-surface-tertiary ${
                  index !== models.length - 1 ? 'border-b border-border-light' : ''
                }`}
              >
                <td className="py-3 pr-4 font-mono text-sm text-text-primary">{model.model}</td>
                <td className="py-3 text-right font-mono text-sm text-text-secondary">
                  ${model.input.toFixed(2)}
                </td>
                <td className="py-3 text-right font-mono text-sm text-text-secondary">
                  ${model.output.toFixed(2)}
                </td>
                <td className="py-3 text-right font-mono text-sm font-semibold text-text-primary">
                  ${model.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
