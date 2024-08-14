import React, { useState, useEffect } from 'react';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg';

type FilterCategory = {
  name: string;
  options: string[];
};
export const filterCategories: FilterCategory[] = [
  {
    name: "야영장 타입",
    options: ["전체", "카라반", "일반야영장", "자동차야영장", "글램핑"]
  },
  {
    name: "입지구분",
    options: ["전체", "산", "강", "숲", "해변", "계곡", "도심", "섬"]
  },
  {
    name: "부대시설",
    options: ['전체', '운동시설', '전기', '무선인터넷', '장작판매', '온수', '트렘폴린', '물놀이장', '놀이터', '산책로', '운동장', '편의점', '덤프스테이션']
  },
  {
    name: "주변시설",
    options: ['전체', '수영장', '산책로', '계곡 물놀이', '강/물놀이', '청소년체험시설', '수상레저', '낚시', '해수욕', '어린이놀이시설', '운동장', '농어촌체험시설']
  },
  {
    name: "반려동물",
    options: ['전체', '소형견', '가능', '불가능']
  }
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (filters: Record<string, string[]>) => void;
  selectedFilters: Record<string, string[]>;
};


const CampingDetailFilter = (props: Props) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(props.selectedFilters);

  useEffect(() => {
    setSelectedFilters(props.selectedFilters);
  }, [props.selectedFilters]);

  const handleFilterSelect = (category: string, option: string) => {
    setSelectedFilters(prev => {
      const updatedCategory = [...(prev[category] || [])];
      if (option === '전체') {
        return { ...prev, [category]: ['전체'] };
      } else {
        const index = updatedCategory.indexOf(option);
        if (index > -1) {
          updatedCategory.splice(index, 1);
        } else {
          updatedCategory.push(option);
        }
        const allIndex = updatedCategory.indexOf('전체');
        if (allIndex > -1) {
          updatedCategory.splice(allIndex, 1);
        }
        if (updatedCategory.length === 0) {
          updatedCategory.push('전체');
        }
      }
      return { ...prev, [category]: updatedCategory };
    });
  };

  const resetFilters = () => {
    const initialFilters: Record<string, string[]> = {};
    filterCategories.forEach(category => {
      initialFilters[category.name] = ['전체'];
    });
    setSelectedFilters(initialFilters);
  };

  const applyFilters = () => {
    props.onSelect(selectedFilters);
    props.onClose();
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
          w-[90%] md:w-[45rem] max-h-[75vh] p-[0.75rem]
          bg-light-white
          dark:bg-dark-white
          rounded-lg overflow-y-auto
        "
      >
        <div className='flex justify-between mb-[1rem]'>
          <h2 className="text-xl font-bold">상세 필터</h2>
          <CloseIcon
            onClick={props.onClose}
            className='
              size-[1.5rem]
              fill-light-border-icon
              dark:fill-dark-border-icon
              cursor-pointer
            '
          />
        </div>
        
        {/* 필터 선택 */}
        <div className="flex-grow overflow-y-auto px-[0.5rem]">
          {filterCategories.map((category) => (
            <div key={category.name} className="mb-[1rem]">
              <h3 className="font-semibold mb-[0.5rem]">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.options.map((option) => (
                  <button
                    key={option}
                    className={`px-[0.75rem] py-[0.25rem] rounded-full text-sm ${
                      selectedFilters[category.name]?.includes(option)
                        ? 'bg-light-black dark:bg-dark-black text-light-white dark:text-dark-white'
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
        </div>
        

        {/* 버튼 */}
        <div className="flex justify-between mt-[1.75rem]">
          <button
            className="
              w-1/2 py-[0.5rem] me-[0.75rem]
              bg-light-gray-1 text-light-text
              dark:bg-dark-gray-1 dark:text-dark-text
              rounded"
            onClick={resetFilters}
          >
            필터 초기화
          </button>
          <button
            className="
              w-1/2 py-[0.5rem]
              bg-light-signature text-white hover:bg-light-signature-hover
              dark:bg-dark-signature dark:hover:bg-dark-signature-hover
              rounded transition-all duration-200
            "
            onClick={applyFilters}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampingDetailFilter