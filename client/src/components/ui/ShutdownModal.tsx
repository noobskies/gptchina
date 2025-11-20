/* eslint-disable i18next/no-literal-string */
import { useEffect } from 'react';
import DialogTemplate from '~/components/ui/DialogTemplate';
import { OGDialog } from '~/components/ui';
import { useLocalize } from '~/hooks';

interface ShutdownModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ShutdownModal = ({ open, onOpenChange }: ShutdownModalProps) => {
  const localize = useLocalize();

  const handleClose = () => {
    onOpenChange(false);
    // Mark as seen in session storage so it doesn't show up again in this session
    sessionStorage.setItem('shutdown_notice_seen', 'true');
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <DialogTemplate
        title="Important: Service Shutdown Notice"
        className="w-11/12 max-w-3xl border-2 border-red-500 sm:w-3/4 md:w-1/2 lg:w-2/5"
        showCloseButton={true}
        showCancelButton={false}
        main={
          <div className="p-6 text-text-primary">
            <div className="mb-4 rounded-lg border border-red-200 bg-red-100 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
              <h3 className="mb-2 text-lg font-bold">Service Discontinuation</h3>
              <p>This service will be shutting down soon.</p>
            </div>

            <div className="space-y-4">
              <p className="text-base">
                Please use{' '}
                <a
                  href="https://gptchina.io"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  gptchina.io
                </a>{' '}
                for continued service.
              </p>

              <p className="text-base">On this domain:</p>

              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>New Registrations Disabled:</strong> We are no longer accepting new user
                  accounts.
                </li>
                <li>
                  <strong>Payments Disabled:</strong> New subscriptions and credit purchases have
                  been suspended.
                </li>
                <li>
                  <strong>Service Access:</strong> Existing users may continue to access the service
                  until the final shutdown date.
                </li>
              </ul>

              <p className="mt-4 font-medium">
                We recommend exporting any important conversations or data you wish to keep.
              </p>

              <p className="mt-6 text-sm text-text-secondary">
                Thank you for being a valued user of our platform.
              </p>
            </div>
          </div>
        }
        buttons={
          <button
            onClick={handleClose}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            I Understand
          </button>
        }
      />
    </OGDialog>
  );
};

export default ShutdownModal;
