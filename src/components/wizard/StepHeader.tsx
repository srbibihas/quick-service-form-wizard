
import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepHeaderProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const StepHeader: React.FC<StepHeaderProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-6 border-b">
      <div className="flex flex-wrap justify-between items-center gap-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
              step.id <= currentStep ? 'opacity-100' : 'opacity-50'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                step.id < currentStep
                  ? 'bg-green-500 text-white'
                  : step.id === currentStep
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.id < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            <div className="text-center">
              <p className={`text-xs font-medium ${
                step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 hidden sm:block">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepHeader;
