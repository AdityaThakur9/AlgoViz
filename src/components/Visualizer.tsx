import React, { useEffect } from 'react';
import { Step } from '../utils/codeParser';
import './Visualizer.css';

interface VisualizerProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  algorithmName: string;
}

const Visualizer: React.FC<VisualizerProps> = ({
  steps,
  currentStep,
  onStepChange,
  algorithmName,
}) => {
  console.log("Visualizer rendering with:", { steps, currentStep, algorithmName });
  
  useEffect(() => {
    console.log("Visualizer mounted");
    return () => console.log("Visualizer unmounted");
  }, []);

  if (!steps || steps.length === 0) {
    console.log("No steps available");
    return <div className="visualizer">No visualization data available</div>;
  }

  const currentStepData = steps[currentStep];
  console.log("Current step data:", currentStepData);
  
  const array = currentStepData?.array || [];
  const comparisons = currentStepData?.comparing || [];
  const swaps = currentStepData?.swapping || [];

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div className="visualizer">
      <h2>{algorithmName}</h2>
      <div className="array-container">
        {array.map((value: number, index: number) => {
          const isComparing = comparisons.includes(index);
          const isSwapping = swaps.includes(index);
          return (
            <div
              key={index}
              className={`array-element ${isComparing ? 'comparing' : ''} ${
                isSwapping ? 'swapping' : ''
              }`}
              style={{
                height: `${(value / Math.max(...array)) * 100}%`,
              }}
            >
              <span className="element-value">{value}</span>
            </div>
          );
        })}
      </div>
      <div className="controls">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="control-button"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="control-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Visualizer; 