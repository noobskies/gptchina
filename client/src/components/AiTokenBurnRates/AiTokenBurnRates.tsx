import React from 'react';
import { useLocalize } from '~/hooks';
import Header from '../ui/Header';
import Footer from '../ui/Footer';

const AiTokenBurnRates = () => {
  const localize = useLocalize();

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-900 dark:text-white">
      <Header />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-4xl font-bold">{localize('token_burn_rates_title')}</h1>
          <p className="mb-4">{localize('token_burn_rates_intro')}</p>
          <p className="mb-4">
            {localize('token_burn_rates_br_explanation')}{' '}
            <strong>{localize('token_burn_rates_context_usage')}</strong>{' '}
            <strong>{localize('token_burn_rates_new_chat_suggestion')}</strong>
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
                  {localize('token_burn_rates_table_gpt4o')}
                </td>
                <td className="border border-gray-400 px-4 py-2">1.5</td>
                <td className="border border-gray-400 px-4 py-2">4</td>
                <td className="border border-gray-400 px-4 py-2">2.5</td>
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
                  {localize('token_burn_rates_table_claude3_sonnet')}
                </td>
                <td className="border border-gray-400 px-4 py-2">1.5</td>
                <td className="border border-gray-400 px-4 py-2">4</td>
                <td className="border border-gray-400 px-4 py-2">2.5</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">
                  {localize('token_burn_rates_table_claude3_opus')}
                </td>
                <td className="border border-gray-400 px-4 py-2">8</td>
                <td className="border border-gray-400 px-4 py-2">20</td>
                <td className="border border-gray-400 px-4 py-2">12</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">
                  {localize('token_burn_rates_table_groq_llama_3_70b_8192')}
                </td>
                <td className="border border-gray-400 px-4 py-2">0.59</td>
                <td className="border border-gray-400 px-4 py-2">0.79</td>
                <td className="border border-gray-400 px-4 py-2">0.7</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">
                  {localize('token_burn_rates_table_perplexity_llama_3_sonar_large_32k_online')}
                </td>
                <td className="border border-gray-400 px-4 py-2">1</td>
                <td className="border border-gray-400 px-4 py-2">1</td>
                <td className="border border-gray-400 px-4 py-2">1</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">
                  {localize('token_burn_rates_table_mistral_large_latest')}
                </td>
                <td className="border border-gray-400 px-4 py-2">0.8</td>
                <td className="border border-gray-400 px-4 py-2">2.5</td>
                <td className="border border-gray-400 px-4 py-2">1.6</td>
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
          <p className="mb-8">{localize('token_burn_rates_conclusion')}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AiTokenBurnRates;
