import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { isAssistantsEndpoint } from 'librechat-data-provider';
import type { TConversation } from 'librechat-data-provider';
import { useChatContext, useAddedChatContext } from '~/Providers';
import { mainTextareaId } from '~/common';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

export default function AddMultiConvo() {
  const { conversation } = useChatContext();
  const { setConversation: setAddedConvo } = useAddedChatContext();
  const localize = useLocalize();
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  const tooltipId = 'multi-convo-tooltip';

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem(`tooltip-seen-${tooltipId}`);
    setHasBeenSeen(!!hasSeenTooltip);
    setIsOpen(!hasSeenTooltip);
  }, []);

  const handleClick = () => {
    if (!hasBeenSeen) {
      localStorage.setItem(`tooltip-seen-${tooltipId}`, 'true');
      setHasBeenSeen(true);
      setIsOpen(false);
    }

    const { title: _t, ...convo } = conversation ?? ({} as TConversation);
    setAddedConvo({
      ...convo,
      title: '',
    });

    const textarea = document.getElementById(mainTextareaId);
    if (textarea) {
      textarea.focus();
    }
  };

  if (!conversation || isAssistantsEndpoint(conversation.endpoint)) {
    return null;
  }

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root
        open={isOpen}
        onOpenChange={(open) => {
          // Allow hover to open the tooltip even for new users
          if (open && !isOpen) {
            setIsOpen(true);
          }
          // Only allow hover to close the tooltip if it's been seen before
          if (!open && (hasBeenSeen || !isOpen)) {
            setIsOpen(false);
          }
        }}
      >
        <TooltipPrimitive.Trigger asChild>
          <button
            id="add-multi-conversation-button"
            aria-label={localize('com_ui_add_multi_conversation')}
            onClick={handleClick}
            className={cn(
              'inline-flex size-10 items-center justify-center rounded-lg border border-border-light',
              'bg-transparent text-text-primary transition-all ease-in-out hover:bg-surface-tertiary',
              'disabled:pointer-events-none disabled:opacity-50 radix-state-open:bg-surface-tertiary',
            )}
            data-testid="multi-convo-button"
          >
            <PlusCircle size={16} aria-hidden="true" />
          </button>
        </TooltipPrimitive.Trigger>
        <AnimatePresence>
          {isOpen && (
            <TooltipPrimitive.Portal forceMount>
              <TooltipPrimitive.Content
                side="top"
                sideOffset={8}
                className="z-50 cursor-pointer overflow-hidden rounded-md border border-t-0 border-border-light bg-black px-3 py-1.5 text-sm text-white shadow-md"
                onClick={() => {
                  if (!hasBeenSeen) {
                    localStorage.setItem(`tooltip-seen-${tooltipId}`, 'true');
                    setHasBeenSeen(true);
                  }
                  setIsOpen(false);
                }}
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                >
                  {localize('com_ui_add_multi_conversation')}
                  <TooltipPrimitive.Arrow className="fill-black" />
                </motion.div>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          )}
        </AnimatePresence>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
