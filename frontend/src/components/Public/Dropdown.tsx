import React from 'react';
import { ReactComponent as RefreshIcon } from '@assets/icons/refresh.svg';
import { ReactComponent as ArrowBottomIcon } from '@assets/icons/arrow-bottom.svg';

type Option = {
  id: number;
  name: string;
};

type DropdownProps = {
  label: string;
  options: Option[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (option: Option) => void;
  selectedOption: Option;
};

const Dropdown = ({ label, options, isOpen, onToggle, onSelect, selectedOption }: DropdownProps) => {

  const handleSelect = (option: Option) => {
    onSelect(option);
    onToggle();
  };

  const handleRefreshClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onToggle
    const optionOne = options.find(option => option.id === 1);
    if (optionOne) {
      onSelect(optionOne);
    }
    if (isOpen) {
      onToggle(); // Close the dropdown if it's open
    }
  };

  const shouldChangeIcon = label !== 'Write' && selectedOption.id !== 1;

  return (
    <div 
      className={`
        inline-block relative
        text-left
      `}
    >
      <div>
        <button
          type="button"
          className={`
            ${shouldChangeIcon ? 'border-light-signature dark:border-dark-signature' : 'border-light-border-1 dark:border-dark-border-1'} 
            inline-flex justify-between items-center w-full min-w-[7rem] px-[1rem] py-[0.5rem]
            bg-light-gray
            dark:bg-dark-gray
            text-sm font-medium rounded-md shadow-sm`}
          onClick={onToggle}
        >
          {selectedOption.name}
          {shouldChangeIcon ? (
            <RefreshIcon 
              className={`
                size-[1.25rem] ms-[0.5rem] -mr-[0.25rem]
                text-light-text-secondary fill-light-border-icon
                dark:text-dark-text-secondary dark:fill-dark-border-icon
              `} 
              onClick={handleRefreshClick} />
          ) : (
            <ArrowBottomIcon 
              className={`
                size-[0.75rem] ms-[0.5rem] -mr-[0.25rem] 
                text-light-text-secondary fill-light-border-icon
                dark:text-dark-text-secondary dark:fill-dark-border-icon
              `}
            />
          )}
        </button>
      </div>
      {isOpen && (
        <div 
          className={`
            origin-top-left absolute left-0 z-[20] w-max mt-[0.5rem] 
            border-light-border-2 bg-light-white
            dark:border-dark-border-2 dark:bg-dark-white
            rounded-md shadow-lg border focus:outline-none
          `}
        >
          <div className={`py-[0.25rem]`}>
            {options.map((option) => (
              <div 
                key={option.id}
                className={`
                  block px-[1rem] py-[0.5rem] 
                  hover:text-light-signature
                  dark:hover:text-dark-signature
                  text-sm font-medium cursor-pointer duration-100
                `}
                onClick={() => handleSelect(option)}
              >
                {option.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
