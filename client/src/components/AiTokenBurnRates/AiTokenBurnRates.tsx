/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { ThemeSelector } from '~/components/ui';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useLocalize } from '~/hooks';

const AiTokenBurnRates = () => {
  const localize = useLocalize();

  const domainLogos = {
    'gptchina.io': 'logo-china.png',
    'gptafrica.io': 'logo-africa.png',
    'gptglobal.io': 'logo-global.png',
    'gptiran.io': 'logo-iran.png',
    'gptitaly.io': 'logo-italy.png',
    'gptrussia.io': 'logo-russia.png',
    'gptusa.io': 'logo-usa.png',
    'novlisky.io': 'logo-novlisky.png',
  };

  const currentDomain = window.location.hostname;
  const logoImageFilename = domainLogos[currentDomain] || 'logo-novlisky.png';

  return (
    <div className="relative min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold">{localize('token_burn_rates_title')}</h1>
        <p className="mb-4">{localize('token_burn_rates_intro')}</p>
        <p className="mb-4">
          {localize('token_burn_rates_br_explanation')}{' '}
          <strong>{localize('token_burn_rates_context_usage')}</strong>{' '}
          {localize('token_burn_rates_new_chat_suggestion')}
        </p>
        <p className="mb-4">{localize('token_burn_rates_input_tokens')}</p>
        <table className="mb-4 w-full table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_model')}
              </th>
              <th className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_input_br')}
              </th>
              <th className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_output_br')}
              </th>
              <th className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_average_br')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_gpt3_5_turbo')}
              </td>
              <td className="border border-gray-400 px-4 py-2">0.1</td>
              <td className="border border-gray-400 px-4 py-2">0.3</td>
              <td className="border border-gray-400 px-4 py-2">0.2</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_gpt4')}
              </td>
              <td className="border border-gray-400 px-4 py-2">3</td>
              <td className="border border-gray-400 px-4 py-2">8</td>
              <td className="border border-gray-400 px-4 py-2">5</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_claude3_haiku')}
              </td>
              <td className="border border-gray-400 px-4 py-2">0.1</td>
              <td className="border border-gray-400 px-4 py-2">0.3</td>
              <td className="border border-gray-400 px-4 py-2">0.2</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_claude3_haiku')}
              </td>
              <td className="border border-gray-400 px-4 py-2">0.6</td>
              <td className="border border-gray-400 px-4 py-2">3.75</td>
              <td className="border border-gray-400 px-4 py-2">1.5</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_claude3_opus')}
              </td>
              <td className="border border-gray-400 px-4 py-2">8</td>
              <td className="border border-gray-400 px-4 py-2">20</td>
              <td className="border border-gray-400 px-4 py-2">12</td>
            </tr>
          </tbody>
        </table>
        <h2 className="mb-4 text-2xl font-bold">{localize('token_burn_rates_example_title')}</h2>
        <p className="mb-4">{localize('token_burn_rates_example_intro')}</p>
        <p className="mb-4">{localize('token_burn_rates_example_given')}</p>
        <ul className="mb-4 list-disc pl-6">
          <li>{localize('token_burn_rates_example_given_1')}</li>
          <li>{localize('token_burn_rates_example_given_2')}</li>
          <li>{localize('token_burn_rates_example_given_3')}</li>
          <li>{localize('token_burn_rates_example_given_4')}</li>
        </ul>
        <p className="mb-4">{localize('token_burn_rates_example_rates')}</p>
        <table className="mb-4 w-full table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_model')}
              </th>
              <th className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_input_br')}
              </th>
              <th className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_output_br')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_gpt3_5_turbo')}
              </td>
              <td className="border border-gray-400 px-4 py-2">0.1</td>
              <td className="border border-gray-400 px-4 py-2">0.3</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_table_gpt4')}
              </td>
              <td className="border border-gray-400 px-4 py-2">3</td>
              <td className="border border-gray-400 px-4 py-2">8</td>
            </tr>
          </tbody>
        </table>
        <p className="mb-4">{localize('token_burn_rates_example_calculations')}</p>
        <table className="mb-8 w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_example_gpt3_5_turbo_consumption')}
              </th>
              <th className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_example_gpt4_consumption')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_example_gpt3_5_turbo_input')}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_example_gpt4_input')}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_example_gpt3_5_turbo_output')}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_example_gpt4_output')}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_example_gpt3_5_turbo_total')}{' '}
                <strong>150 {localize('token_burn_rates_example_tokens')}</strong>
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {localize('token_burn_rates_example_gpt4_total')}{' '}
                <strong>4,200 {localize('token_burn_rates_example_tokens')}</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mb-4">{localize('token_burn_rates_calculation_challenge')}</p>
        <p className="mb-4">{localize('token_burn_rates_experimentation')}</p>
        <p className="mb-4">{localize('token_burn_rates_new_conversations')}</p>
        <p>{localize('token_burn_rates_conclusion')}</p>
      </div>
    </div>
  );
};

export default AiTokenBurnRates;
