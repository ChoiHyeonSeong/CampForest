import React, { useState, useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (minPrice: number | null, maxPrice: number | null) => void;
}

const PriceRangeModal = (props: Props) => {
  const [minValue, setMinValue] = useState<string | null>(null);
  const [maxValue, setMaxValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (props.isOpen) {
      setMinValue(null);
      setMaxValue(null);
      setError(null);
    }
  }, [props.isOpen]);

  if (!props.isOpen) return null;

  const handleApply = () => {
    const minNum = minValue !== null ? parseInt(minValue) : null;
    const maxNum = maxValue !== null ? parseInt(maxValue) : null;

    if (minNum !== null && maxNum !== null && minNum > maxNum) {
      setError('최소 가격이 최대 가격보다 클 수 없습니다.');
      return;
    }

    setError(null); // Reset error if valid
    props.onApply(minNum, maxNum);
    props.onClose();
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinValue(value === '' ? null : value);
    setError(null); // Reset error on change
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxValue(value === '' ? null : value);
    setError(null); // Reset error on change
  };

  return (
    <div 
      onClick={props.onClose}
      className="fixed inset-0 bg-light-black bg-opacity-80 flex items-center justify-center z-50"
    >
      <div
        onClick={e => e.stopPropagation()} 
        className="bg-light-white dark:bg-dark-white rounded-lg p-6 w-80"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">가격설정</h2>
          <button onClick={props.onClose} className="text-light-gray-2 hover:text-light-gray-3 dark:text-dark-gray-2 dark:hover:text-dark-gray-3">
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
              value={minValue || ''}
              onChange={handleMinChange}
              className="w-24 px-2 py-1 border rounded outline-none text-light-black bg-light-white dark:text-dark-black dark:bg-dark-white"
            />
            <input
              type="number"
              value={maxValue || ''}
              onChange={handleMaxChange}
              className="w-24 px-2 py-1 border rounded outline-none text-light-black bg-light-white dark:text-dark-black dark:bg-dark-white"
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
        
        <div 
          onClick={e => e.stopPropagation()}
          className="flex space-x-2"
        >
          <button
            onClick={() => {
              setMinValue(null);
              setMaxValue(null);
              setError(null); // Reset error on reset
            }}
            className="flex-1 px-4 py-2 bg-light-gray rounded-md hover:bg-light-gray-1 dark:bg-dark-gray dark:hover:bg-dark-gray-1 duration-150"
          >
            초기화
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-light-signature text-light-white rounded-md hover:bg-light-signature-hover dark:bg-light-signature dark:hover:bg-dark-signature-hover"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeModal;
