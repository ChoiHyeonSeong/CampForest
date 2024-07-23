import React from 'react';
import { useState } from 'react';
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
};

const Dropdown = ({ label, options, isOpen, onToggle }: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    onToggle();
  };

  const handleRefreshClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onToggle
    const optionOne = options.find(option => option.id === 1);
    if (optionOne) {
      setSelectedOption(optionOne);
    }
    if (isOpen) {
      onToggle(); // Close the dropdown if it's open
    }
  };

  const shouldChangeIcon = selectedOption.id !== 1;

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className={`inline-flex justify-between items-center w-full rounded-md border shadow-sm px-4 py-2 bg-white text-sm font-medium ${
            shouldChangeIcon ? 'border-[#FF7F50] border-2' : 'border-gray-300'
          } text-gray-700 hover:bg-gray-50 focus:outline-none`}
          onClick={onToggle}
        >
          {selectedOption.name}
          {shouldChangeIcon ? (
            <RefreshIcon className="size-5 ml-2 -mr-1 text-gray-400" onClick={handleRefreshClick} />
          ) : (
            <ArrowBottomIcon className="size-3 ml-2 -mr-1 text-gray-400" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <div 
                key={option.id}
                className="text-gray-700 block px-4 py-2 text-sm hover:text-[#FF7F50] font-medium cursor-pointer duration-100"
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
