// JoyrideTour.tsx
import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

const steps = [
  {
    target: '#tour',
    content: (
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold">First Step</h3>
        <p className="text-gray-600">This is the first step of the tour</p>
      </div>
    ),
  },
  {
    target: '.my-second-target',
    content: (
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold">Second Step</h3>
        <p className="text-gray-600">This is the second step of the tour</p>
      </div>
    ),
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

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#2563eb', // Tailwind blue color
        },
      }}
    />
  );
};

export default JoyrideTour;
