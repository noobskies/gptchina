import * as Sentry from '@sentry/react';
import { MessageSquare } from 'lucide-react';

export const handleSentryFeedback = (user, message) => {
  console.log('[Sentry Feedback] User:', user);
  console.log('[Sentry Feedback] Message:', message);

  const model = message?.model || message?.sender || 'unknown';
  console.log('[Sentry Feedback] Using model/sender:', model);

  Sentry.showReportDialog({
    eventId: Sentry.captureMessage('User Feedback', {
      tags: {
        model: model,
        messageId: message?.messageId,
        sender: message?.sender,
        conversationId: message?.conversationId,
      },
    }),
    user: {
      name: user?.name || user?.username || 'Anonymous',
      email: user?.email || undefined,
    },
    title: 'Send Feedback',
    subtitle: `Feedback for ${message?.sender || 'Assistant'}`,
    subtitle2: '',
    labelName: 'Name',
    labelEmail: 'Email',
    labelComments: 'What happened?',
    labelClose: 'Close',
    labelSubmit: 'Send Feedback',
    errorGeneric: 'An error occurred while sending your feedback. Please try again.',
    errorFormEntry: 'Please fill out all fields.',
    successMessage: 'Your feedback has been sent. Thank you!',
  });
};

const FeedbackDialog = ({ user, message }) => {
  return (
    <div
      onClick={() => {
        console.log('[FeedbackDialog] Triggering feedback with:', {
          user,
          message,
        });
        handleSentryFeedback(user, message);
      }}
      className="flex items-center gap-2"
    >
      <MessageSquare className="icon-md" aria-hidden="true" />
      Send Feedback
    </div>
  );
};

export default FeedbackDialog;
