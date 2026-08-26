import React from 'react';
import { Check } from 'lucide-react';

interface RegistrationProgressProps {
  currentStep: 1 | 2 | 3;
}

export const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Explore Clubs' },
    { num: 2, label: 'Review & Fill Details' },
    { num: 3, label: 'Confirmation' },
  ];

  return (
    <div className="max-w-2xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#7226FF]/20 -translate-y-1/2 -z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#7226FF] to-[#F042FF] -translate-y-1/2 -z-0 transition-all duration-300"
          style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
        />

        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-[#87F5F5] text-[#010030] shadow-cyanGlow'
                    : isCurrent
                    ? 'btn-primary-gradient text-white shadow-magentaGlow ring-4 ring-[#F042FF]/20 scale-110'
                    : 'bg-[#160078] border border-[#7226FF]/30 text-[#A4A0D1]'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : `0${step.num}`}
              </div>
              <span
                className={`mt-2 font-mono text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  isCurrent ? 'text-[#FFE5F1]' : isDone ? 'text-[#87F5F5]' : 'text-[#A4A0D1]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
