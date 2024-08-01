import React from 'react';
import { Root, Trigger, Content, Portal } from '@radix-ui/react-popover';
import MenuItem from '~/components/Chat/Menus/UI/MenuItem';
import type { Option } from '~/common';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils/';
import { useMultiSearch } from './MultiSearch';

type SelectDropDownProps = {
  id?: string;
  title?: string;
  value: string | null | Option;
  disabled?: boolean;
  setValue: (value: string) => void;
  availableValues: string[] | Option[];
  emptyTitle?: boolean;
  showAbove?: boolean;
  showLabel?: boolean;
  iconSide?: 'left' | 'right';
  renderOption?: () => React.ReactNode;
};

function SelectDropDownPop({
  title: _title,
  value,
  availableValues,
  setValue,
  showAbove = false,
  showLabel = true,
  emptyTitle = false,
}: SelectDropDownProps) {
  const localize = useLocalize();
  const transitionProps = { className: 'top-full mt-3' };
  if (showAbove) {
    transitionProps.className = 'bottom-full mb-3';
  }

  let title = _title;

  if (emptyTitle) {
    title = '';
  } else if (!title) {
    title = localize('com_ui_model');
  }

  // Detemine if we should to convert this component into a searchable select.  If we have enough elements, a search
  // input will appear near the top of the menu, allowing correct filtering of different model menu items. This will
  // reset once the component is unmounted (as per a normal search)
  const [filteredValues, searchRender] = useMultiSearch<string[] | Option[]>({
    availableOptions: availableValues,
  });
  const hasSearchRender = Boolean(searchRender);
  const options = hasSearchRender ? filteredValues : availableValues;

  const optionTitles = {
    'gemini-pro': 'Gemini Pro',
    'gemini-pro-vision': 'Gemini Pro Vision',
    BingAI: 'Bing AI',
    Sydney: 'Sydney',
    'gpt-3.5-turbo-0125': 'GPT-3.5 Turbo 🔥0.5',
    'gpt-4-1106-preview': 'GPT-4 Turbo 🔥5',
    'gpt-4o': 'GPT-4o 🔥2.5',
    'gpt-4o-mini': 'GPT-4o Mini 🔥0.2',
    'claude-3-5-sonnet-20240620': 'Claude-3.5 Sonnet 🔥2.5',
    'claude-3-opus-20240229': 'Claude-3 Opus 🔥12',
    'claude-3-sonnet-20240229': 'Claude-3 Sonnet 🔥1.5',
    'claude-3-haiku-20240307': 'Claude-3 Haiku 🔥0.2',
    'claude-2.1': 'Claude 2.1',
    'claude-2': 'Claude 2',
    'claude-1.2': 'Claude 1.2',
    'claude-1': 'Claude 1',
    'claude-1-100k': 'Claude 1 (100k)',
    'claude-instant-1': 'Claude Instant 1',
    'claude-instant-1-100k': 'Claude Instant 1 (100k)',
    // Perplexity models
    'llama-3.1-sonar-small-128k-chat': 'Llama 3.1 Sonar Small 128k Chat 🔥0.2',
    'llama-3.1-sonar-small-128k-online': 'Llama 3.1 Sonar Small 128k Online 🔥0.2',
    'llama-3.1-sonar-large-128k-chat': 'Llama 3.1 Sonar Large 128k Chat 🔥1',
    'llama-3.1-sonar-large-128k-online': 'Llama 3.1 Sonar Large 128k Online 🔥1',
    'llama-3.1-70b-instruct': 'Llama 3.1 70B Instruct 🔥1',
    'llama-3.1-8b-instruct': 'Llama 3.1 8B Instruct 🔥0.2',
    // Groq models
    'llama3-70b-8192': 'Llama 3 70B 8192 🔥0.7',
    'llama3-8b-8192': 'Llama 3 8B 8192 🔥0.07',
    'llama2-70b-4096': 'Llama 2 70B 4096 🔥0.75',
    'mixtral-8x7b-32768': 'Mixtral 8x7B 32768 🔥0.24',
    'gemma-7b-it': 'Gemma 7B IT 🔥0.1',
    // Mistral models
    'open-mistral-7b': 'Open Mistral 7B 🔥0.05',
    'open-mixtral-8x7b': 'Open Mixtral 8x7B 🔥0.7',
    'mistral-tiny': 'Mistral Tiny 🔥0.05',
    'open-mixtral-8x22b': 'Open Mixtral 8x22B 🔥1.4',
    'open-mixtral-8x22b-2404': 'Open Mixtral 8x22B 2404 🔥1.4',
    'mistral-small-2312': 'Mistral Small 2312 🔥0.4',
    'mistral-small': 'Mistral Small 🔥0.4',
    'mistral-small-2402': 'Mistral Small 2402 🔥0.4',
    'mistral-small-latest': 'Mistral Small Latest 🔥0.4',
    'mistral-medium-latest': 'Mistral Medium Latest 🔥1',
    'mistral-medium-2312': 'Mistral Medium 2312 🔥1',
    'mistral-medium': 'Mistral Medium 🔥1',
    'mistral-large-2407': 'Mistral Large 2407 🔥1.6',
    'mistral-large-latest': 'Mistral Large Latest 🔥1.6',
    'mistral-large-2402': 'Mistral Large 2402 🔥1.6',
    'codestral-2405': 'Codestral 2405 🔥0.5',
    'codestral-latest': 'Codestral Latest 🔥0.5',
    'mistral-embed': 'Mistral Embed 🔥0.05',
  };

  return (
    <Root>
      <div className={'flex items-center justify-center gap-2 '}>
        <div className={'relative w-full'}>
          <Trigger asChild>
            <button
              data-testid="select-dropdown-button"
              id="step-2"
              className={cn(
                'pointer-cursor relative flex flex-col rounded-md border border-black/10 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-gray-700 dark:bg-gray-800 sm:text-sm',
                'hover:bg-gray-50 radix-state-open:bg-gray-50 dark:hover:bg-gray-700 dark:radix-state-open:bg-gray-700',
              )}
            >
              {' '}
              {showLabel && (
                <label className="block text-xs text-gray-700 dark:text-gray-500 ">{title}</label>
              )}
              <span className="inline-flex w-full">
                <span
                  className={cn(
                    'flex h-6 items-center gap-1 text-sm text-gray-800 dark:text-white',
                    !showLabel ? 'text-xs' : '',
                    'min-w-[75px] font-normal',
                  )}
                >
                  {typeof value !== 'string' && value
                    ? optionTitles[value] || value?.label || ''
                    : optionTitles[value] || value || ''}
                </span>
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4  text-gray-400"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  style={showAbove ? { transform: 'scaleY(-1)' } : {}}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
          </Trigger>
          <Portal>
            <Content
              side="bottom"
              align="start"
              className={cn(
                'mt-2 max-h-[52vh] min-w-full overflow-hidden overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white lg:max-h-[52vh]',
                hasSearchRender && 'relative',
              )}
            >
              {searchRender}
              {options.map((option) => {
                const optionTitle = optionTitles[option] || option;
                return (
                  <MenuItem
                    key={option}
                    title={optionTitle}
                    // description={option}
                    value={option}
                    selected={!!(value && value === option)}
                    onClick={() => setValue(option)}
                  />
                );
              })}
            </Content>
          </Portal>
        </div>
      </div>
    </Root>
  );
}

export default SelectDropDownPop;
