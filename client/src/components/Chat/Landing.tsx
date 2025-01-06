import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EModelEndpoint, Constants } from 'librechat-data-provider';
import {
  useGetEndpointsQuery,
  useGetStartupConfig,
  useGetModelRatesQuery,
} from 'librechat-data-provider/react-query';
import type * as t from 'librechat-data-provider';
import type { ReactNode } from 'react';
import { useAuthContext } from '~/hooks/AuthContext';
import { useChatContext, useAgentsMapContext, useAssistantsMapContext } from '~/Providers';
import { useGetAssistantDocsQuery } from '~/data-provider';
import ConvoIcon from '~/components/Endpoints/ConvoIcon';
import { getIconEndpoint, getEntity, cn } from '~/utils';
import { useLocalize, useSubmitMessage } from '~/hooks';
import { TooltipAnchor } from '~/components/ui';
import { BirthdayIcon } from '~/components/svg';
import ConvoStarter from './ConvoStarter';

export default function Landing({ Header }: { Header?: ReactNode }) {
  const { conversation } = useChatContext();
  const agentsMap = useAgentsMapContext();
  const assistantMap = useAssistantsMapContext();
  const { token } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const { data: endpointsConfig } = useGetEndpointsQuery();

  const { data: modelRates } = useQuery(
    ['modelRates'],
    async () => {
      if (!token) return null;

      const response = await fetch('/api/models/rates', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch model rates');
      }
      return response.json();
    },
    {
      enabled: !!token, // Only run query when token is available
    },
  );

  const localize = useLocalize();

  let { endpoint = '', model = '' } = conversation ?? {};

  const currentModelRates = useMemo(() => {
    if (!modelRates || !endpoint || !model) {
      return null;
    }
    return modelRates[endpoint]?.[model];
  }, [modelRates, endpoint, model]);

  if (
    endpoint === EModelEndpoint.chatGPTBrowser ||
    endpoint === EModelEndpoint.azureOpenAI ||
    endpoint === EModelEndpoint.gptPlugins
  ) {
    endpoint = EModelEndpoint.openAI;
  }

  const iconURL = conversation?.iconURL;
  endpoint = getIconEndpoint({ endpointsConfig, iconURL, endpoint });
  const { data: documentsMap = new Map() } = useGetAssistantDocsQuery(endpoint, {
    select: (data) => new Map(data.map((dbA) => [dbA.assistant_id, dbA])),
  });

  const { entity, isAgent, isAssistant } = getEntity({
    endpoint,
    agentsMap,
    assistantMap,
    agent_id: conversation?.agent_id,
    assistant_id: conversation?.assistant_id,
  });

  const name = entity?.name ?? '';
  const description = entity?.description ?? '';
  const avatar = isAgent
    ? (entity as t.Agent | undefined)?.avatar?.filepath ?? ''
    : ((entity as t.Assistant | undefined)?.metadata?.avatar as string | undefined) ?? '';
  const conversation_starters = useMemo(() => {
    /* The user made updates, use client-side cache, or they exist in an Agent */
    if (entity && (entity.conversation_starters?.length ?? 0) > 0) {
      return entity.conversation_starters;
    }
    if (isAgent) {
      return entity?.conversation_starters ?? [];
    }

    /* If none in cache, we use the latest assistant docs */
    const entityDocs = documentsMap.get(entity?.id ?? '');
    return entityDocs?.conversation_starters ?? [];
  }, [documentsMap, isAgent, entity]);

  const containerClassName =
    'shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black';

  const { submitMessage } = useSubmitMessage();
  const sendConversationStarter = (text: string) => submitMessage({ text });

  const getWelcomeMessage = () => {
    const greeting = conversation?.greeting ?? '';
    if (greeting) {
      return greeting;
    }

    if (isAssistant) {
      return localize('com_nav_welcome_assistant');
    }

    if (isAgent) {
      return localize('com_nav_welcome_agent');
    }

    return localize('com_nav_welcome_message');
  };

  return (
    <div className="relative h-full">
      <div className="absolute left-0 right-0">{Header != null ? Header : null}</div>
      <div className="flex h-full flex-col items-center justify-center">
        <div className={cn('relative h-12 w-12', name && avatar ? 'mb-0' : 'mb-3')}>
          <ConvoIcon
            agentsMap={agentsMap}
            assistantMap={assistantMap}
            conversation={conversation}
            endpointsConfig={endpointsConfig}
            containerClassName={containerClassName}
            context="landing"
            className="h-2/3 w-2/3"
            size={41}
          />
          {startupConfig?.showBirthdayIcon === true ? (
            <TooltipAnchor
              className="absolute bottom-8 right-2.5"
              description={localize('com_ui_happy_birthday')}
            >
              <BirthdayIcon />
            </TooltipAnchor>
          ) : null}
        </div>
        {name ? (
          <div className="flex flex-col items-center gap-0 p-2">
            <div className="text-center text-2xl font-medium dark:text-white">{name}</div>
            <div className="max-w-md text-center text-sm font-normal text-text-primary ">
              {description ? description : localize('com_nav_welcome_message')}
            </div>
          </div>
        ) : (
          <h2 className="mb-5 max-w-[75vh] px-12 text-center text-lg font-medium dark:text-white md:px-0 md:text-2xl">
            {getWelcomeMessage()}
          </h2>
        )}
        {currentModelRates && (
          <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            <div className="mb-1 font-semibold">Model: {model}</div>
            <div>Input: {currentModelRates.promptRate}</div>
            <div>Output: {currentModelRates.completionRate}</div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3 px-4">
          {conversation_starters.length > 0 &&
            conversation_starters
              .slice(0, Constants.MAX_CONVO_STARTERS)
              .map((text: string, index: number) => (
                <ConvoStarter
                  key={index}
                  text={text}
                  onClick={() => sendConversationStarter(text)}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
