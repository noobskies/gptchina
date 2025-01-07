import React from 'react';
import { Calculator, TrendingUp, RefreshCw } from 'lucide-react';
import Header from '~/components/ui/Header';
import Footer from '~/components/ui/Footer';
import { ThemeSelector } from '~/components/ui';

const AiTokenBurnRates = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
      <Header />
      <div className="fixed bottom-0 left-0 md:m-4">
        <ThemeSelector />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">
              Understanding Token Consumption
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Tokens are used whenever you interact with language models on our platform. But what
              exactly is a token?
            </p>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Token Explanation Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6">
                <h2 className="flex flex-col items-center gap-3 text-2xl font-semibold text-gray-900 dark:text-gray-50 sm:flex-row sm:gap-2">
                  <Calculator className="h-8 w-8 sm:h-6 sm:w-6" />
                  What are tokens?
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Tokens are pieces of words that the AI processes. A token might be as short as one
                  letter or as long as a word and some punctuation. Here are a few helpful rules:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                  <li>1 token ≈ 4 characters in English</li>
                  <li>100 tokens ≈ 75 words</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  For context, the quote: "You miss 100% of the shots you don't take" is 11 tokens.
                </p>
                <div className="space-y-4 pt-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    When you select a model, you'll see its Input and Output multipliers. These
                    numbers explain token consumption:
                  </p>
                  <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-300">
                    <li>
                      Input tokens: Taken from your prompt and the conversation's context.
                      Multiplied by the Input rate.
                    </li>
                    <li>
                      Output tokens: Tokens generated in the model's response. Multiplied by the
                      Output rate.
                    </li>
                  </ul>
                  <div className="mt-4 rounded-md bg-blue-50 p-4 dark:bg-blue-900/30">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      For example, if a model has an Input rate of 2.13 and an Output rate of 8.5,
                      each input token consumes 2.13 tokens, and each output token consumes 8.5
                      tokens.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6">
                <h2 className="flex flex-col items-center gap-3 text-2xl font-semibold text-gray-900 dark:text-gray-50 sm:flex-row sm:gap-2">
                  <TrendingUp className="hidden text-green-500 sm:block sm:h-6 sm:w-6" />
                  Tips to Optimize Token Usage
                </h2>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                  <RefreshCw className="h-8 w-8 text-green-500 sm:mt-1 sm:h-5 sm:w-5" />
                  <div>
                    <h3 className="text-center font-semibold text-gray-900 dark:text-gray-50 sm:text-left">
                      Start New Chats for New Topics
                    </h3>
                    <p className="text-center text-gray-600 dark:text-gray-300 sm:text-left">
                      Context from long threads is treated as input, which increases token usage.
                      Starting fresh for new topics reduces costs.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                  <TrendingUp className="h-8 w-8 text-green-500 sm:mt-1 sm:h-5 sm:w-5" />
                  <div>
                    <h3 className="text-center font-semibold text-gray-900 dark:text-gray-50 sm:text-left">
                      Experiment with Models
                    </h3>
                    <p className="text-center text-gray-600 dark:text-gray-300 sm:text-left">
                      Each model has different rates. Test them to find the best balance of cost and
                      performance.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                  <Calculator className="h-8 w-8 text-green-500 sm:mt-1 sm:h-5 sm:w-5" />
                  <div>
                    <h3 className="text-center font-semibold text-gray-900 dark:text-gray-50 sm:text-left">
                      Understand Multipliers
                    </h3>
                    <p className="text-center text-gray-600 dark:text-gray-300 sm:text-left">
                      Powerful models (e.g., Claude 3 Opus or OpenAI's o1) consume more tokens but
                      may deliver better results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="mx-auto max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              By understanding how tokens work and using these strategies, you can manage your usage
              and costs while maximizing the platform's capabilities.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AiTokenBurnRates;
