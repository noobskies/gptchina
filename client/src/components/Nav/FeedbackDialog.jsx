import * as Sentry from "@sentry/react";
import { MessageSquare } from 'lucide-react';

export const handleSentryFeedback = (user) => {
  Sentry.showReportDialog({
    eventId: Sentry.captureMessage("User Feedback"),
    user: {
      name: user?.name || user?.username || 'Anonymous',
      email: user?.email || undefined,
    },
    title: 'Send Feedback',
    subtitle: 'Tell us what happened',
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

const FeedbackDialog = ({ user }) => {
  return (
    <>
      <MessageSquare className="icon-md" aria-hidden="true" />
      Send Feedback
    </>
  );
};

export default FeedbackDialog;