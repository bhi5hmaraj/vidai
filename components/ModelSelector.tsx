
import React from 'react';

export type ModelOption = 'gemini-2.5-flash-preview-04-17' | 'gemini-2.5-pro-preview-06-05';

interface ModelSelectorProps {
  currentModel: ModelOption;
  onModelChange: (model: ModelOption) => void;
  disabled?: boolean;
}

const models: { value: ModelOption; label: string; description: string }[] = [
  {
    value: 'gemini-2.5-flash-preview-04-17',
    label: 'Flash Model',
    description: 'Fast & Efficient: Good for most tasks, quick responses.'
  },
  {
    value: 'gemini-2.5-pro-preview-06-05',
    label: 'Pro Model',
    description: 'Powerful & Detailed: Slower, but higher quality responses.'
  },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({ currentModel, onModelChange, disabled }) => {
  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-md ${disabled ? 'opacity-60' : ''}`}>
      <h3 className="text-lg font-semibold text-sky-400 mb-3">Choose AI Model</h3>
      <fieldset 
        className="space-y-3"
        aria-labelledby="model-selector-heading"
        disabled={disabled}
      >
        <legend id="model-selector-heading" className="sr-only">AI Model Selection</legend>
        {models.map((model) => (
          <label
            key={model.value}
            htmlFor={model.value}
            className={`flex items-center p-3 rounded-md border transition-colors duration-150 ease-in-out
              ${currentModel === model.value ? 'bg-sky-700 border-sky-500 shadow-md' : 'bg-gray-700 border-gray-600 hover:border-sky-600'}
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <input
              type="radio"
              id={model.value}
              name="model"
              value={model.value}
              checked={currentModel === model.value}
              onChange={() => onModelChange(model.value)}
              className="form-radio h-5 w-5 text-sky-500 bg-gray-600 border-gray-500 focus:ring-sky-500 focus:ring-offset-gray-800 disabled:opacity-50"
              disabled={disabled}
              aria-describedby={`${model.value}-description`}
            />
            <div className="ml-3 text-sm">
              <span className={`font-medium ${currentModel === model.value ? 'text-white' : 'text-gray-200'}`}>{model.label}</span>
              <p id={`${model.value}-description`} className={`text-xs ${currentModel === model.value ? 'text-sky-200' : 'text-gray-400'}`}>
                {model.description}
              </p>
            </div>
          </label>
        ))}
      </fieldset>
    </div>
  );
};
