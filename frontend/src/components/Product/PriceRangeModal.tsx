import React, { useState, useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (minPrice: number, maxPrice: number) => void;
}

const PriceRangeModal = (props: Props) => {
  const MIN = 0;
  const MAX = 500000;

  const [minValue, setMinValue] = useState<string>(MIN.toString());
  const [maxValue, setMaxValue] = useState<string>((MAX / 2).toString());

  useEffect(() => {
    if (props.isOpen) {
      setMinValue(MIN.toString());
      setMaxValue((MAX / 2).toString());
    }
  }, [props.isOpen]);

  if (!props.isOpen) return null;

  const handleApply = () => {
    const minNum = parseInt(minValue) || MIN;
    const maxNum = parseInt(maxValue) || MAX;
    props.onApply(Math.min(minNum, maxNum), Math.max(minNum, maxNum));
    props.onClose();
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= MIN && parseInt(value) <= MAX)) {
      setMinValue(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= MIN && parseInt(value) <= MAX)) {
      setMaxValue(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">가격설정</h2>
          <button onClick={props.onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">최소</span>
            <span className="text-sm">~</span>
            <span className="text-sm">최대</span>
          </div>
          <div className="flex justify-between mb-2">
            <input
              type="number"
              value={minValue}
              onChange={handleMinChange}
              className="w-24 px-2 py-1 border rounded outline-none"
            />
            <input
              type="number"
              value={maxValue}
              onChange={handleMaxChange}
              className="w-24 px-2 py-1 border rounded outline-none"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setMinValue(MIN.toString());
              setMaxValue((MAX / 2).toString());
            }}
            className="flex-1 px-4 py-2 bg-light-gray rounded-md hover:bg-light-gray-1 dark:bg-dark-gray dark:hover:bg-dark-gray-1 duration-150"
          >
            초기화
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-light-signature text-white rounded-md hover:bg-light-signature-hover dark:bg-light-signature dark:hover:bg-dark-signature-hover"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeModal;