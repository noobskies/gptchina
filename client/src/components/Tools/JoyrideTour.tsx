// JoyrideTour.tsx
import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

const steps = [
  {
    target: '#tour',
    content: 'This is the first step of the tour',
  },
  {
    target: '.my-second-target',
    content: 'This is the second step of the tour',
  },
  // Add more steps as needed
];

const JoyrideTour = () => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  useEffect(() => {
    // Start the tour after the user logs in
    setRun(true);
  }, []);

  return <Joyride steps={steps} run={run} stepIndex={stepIndex} callback={handleJoyrideCallback} />;
};

export default JoyrideTour;
