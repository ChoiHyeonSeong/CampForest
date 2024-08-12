import React, { useState } from 'react';

type FilterCategory = {
  name: string;
  options: string[];
};
const filterCategories: FilterCategory[] = [
  {
    name: "야영장 타입",
    options: ["전체", "카라반", "일반야영장", "자동차야영장", "글램핑"]
  },
  {
    name: "입지구분",
    options: ["전체", "산", "강", "숲", "해변", "계곡", "도심", "호수"]
  },
  {
    name: "부대시설",
    options: [] // 서버에서 받아온 데이터로 채워질 예정
  },
  {
    name: "주변 이용가능 시설",
    options: [] // 서버에서 받아온 데이터로 채워질 예정
  }
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};



const CampingDetailFilter = (props: Props) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const handleFilterSelect = (category: string, option: string) => {
    setSelectedFilters(prev => {
      const updatedCategory = prev[category] ? [...prev[category]] : [];
      const index = updatedCategory.indexOf(option);
      if (index > -1) {
        updatedCategory.splice(index, 1);
      } else {
        updatedCategory.push(option);
      }
      return { ...prev, [category]: updatedCategory };
    });
  };

  if (!props.isOpen) return null;

  return (
    <div
      className="
        flex flex-all-center fixed inset-0 z-[30] 
        bg-black
        bg-opacity-80
      "
    >
      <div
        className="
          max-w-1/2 max-h-[70vh] p-6
          bg-light-white
          dark:bg-dark-white
          rounded-lg overflow-y-auto
        "
      >
        <h2 className="text-xl font-bold mb-4">상세 필터</h2>
        {filterCategories.map((category) => (
          <div key={category.name} className="mb-4">
            <h3 className="font-semibold mb-2">{category.name}</h3>
            <div className="flex flex-wrap gap-2">
              {category.options.map((option) => (
                <button
                  key={option}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedFilters[category.name]?.includes(option)
                      ? 'bg-light-signature dark:bg-dark-signature text-white'
                      : 'bg-light-gray dark:bg-dark-gray'
                  }`}
                  onClick={() => handleFilterSelect(category.name, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <button
            className="w-1/2 py-2 me-[0.75rem] bg-gray-200 rounded"
            onClick={() => setSelectedFilters({})}
          >
            필터 초기화
          </button>
          <button
            className="w-1/2 py-2 bg-black text-white rounded"
            onClick={props.onClose}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampingDetailFilter