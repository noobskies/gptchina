// JoyrideTour.tsx
import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useLocalize } from '~/hooks';

const JoyrideTour = () => {
  const localize = useLocalize();
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: '#step-1',
      content: (
        <div>
          <h3 className="mb-2 text-lg font-semibold">{localize('tour_step_1_title')}</h3>
          <p className="text-gray-600">{localize('tour_step_1_content')}</p>
        </div>
      ),
    },
    {
      target: '#step-2',
      content: (
        <div>
          <h3 className="mb-2 text-lg font-semibold">{localize('tour_step_2_title')}</h3>
          <p className="text-gray-600">{localize('tour_step_2_content')}</p>
        </div>
      ),
    },
    // Add more steps as needed
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('tourCompleted', 'true');
    }
  };

  useEffect(() => {
    const tourCompleted = localStorage.getItem('tourCompleted');
    console.log('tourCompleted', tourCompleted);
    if (!tourCompleted) {
      console.log('Starting tour');
      setRun(true);
    }
  }, []);

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#2563eb', // Tailwind blue color
          textColor: '#333',
          backgroundColor: '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
        },
        buttonNext: {
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '10px 20px',
        },
        buttonBack: {
          marginRight: 10,
          color: '#2563eb',
          backgroundColor: 'transparent',
          border: 'none',
          padding: '10px 20px',
        },
        buttonSkip: {
          color: '#2563eb',
          backgroundColor: 'transparent',
          border: 'none',
          padding: '10px 20px',
        },
        tooltip: {
          borderRadius: '8px',
          padding: '20px',
        },
        tooltipContent: {
          fontSize: '16px',
        },
        tooltipTitle: {
          fontSize: '18px',
          marginBottom: '10px',
        },
      }}
      locale={{
        skip: 'Skip Tour',
      }}
      showSkipButton={true}
    />
  );
};

export default JoyrideTour;
