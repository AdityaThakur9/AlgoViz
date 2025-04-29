import React, { useMemo } from 'react';
import { Step } from '../utils/codeParser';
import { motion } from 'framer-motion';

interface MergeSortTreeProps {
  initialArray: number[];
  steps: Step[];
  currentStep: number;
}

// Map code execution steps to visualization steps
function mapCodeStepToVisualizationStep(codeStep: number, totalCodeSteps: number, totalVisualSteps: number): number {
  if (totalCodeSteps === 0 || totalVisualSteps === 0) return 0;
  
  // Calculate the proportion of code execution completed
  const proportion = codeStep / totalCodeSteps;
  
  // Map to visualization step
  return Math.min(Math.floor(proportion * totalVisualSteps), totalVisualSteps - 1);
}

const MergeSortTree: React.FC<MergeSortTreeProps> = ({ initialArray, steps, currentStep }) => {
  // Get the current step data
  const currentStepData = steps[currentStep] || { array: initialArray, comparing: [], swapping: [] };
  const array = currentStepData.array || initialArray;
  const comparisons = currentStepData.comparing || [];
  const swaps = currentStepData.swapping || [];
  
  // Map the current code step to a visualization step for any additional effects
  const visualizationStep = useMemo(() => {
    return mapCodeStepToVisualizationStep(
      currentStep, 
      steps.length, 
      steps.length
    );
  }, [currentStep, steps.length]);

  return (
    <div className="array-container" style={{ 
      display: 'flex', 
      alignItems: 'flex-end', 
      height: '300px', 
      gap: '2px',
      padding: '10px 0'
    }}>
      {array.map((value: number, index: number) => {
        const isComparing = comparisons.includes(index);
        const isSwapping = swaps.includes(index);
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              height: `${(value / Math.max(...array)) * 100}%`,
            }}
            transition={{ duration: 0.2 }}
            style={{
              flex: 1,
              minWidth: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              background: isSwapping
                ? '#e53935'
                : isComparing
                  ? '#1976d2'
                  : '#90caf9',
              borderRadius: '2px 2px 0 0',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            <span style={{ 
              position: 'absolute',
              bottom: '5px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {value}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MergeSortTree; 