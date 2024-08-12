import React, { useState, useRef, useEffect } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 
import { ReactComponent as ArrowBottomIcon } from '@assets/icons/arrow-bottom.svg'
import { ReactComponent as ArrowLeftIcon } from '@assets/icons/arrow-left.svg'
import { useDispatch, useSelector } from 'react-redux'
import { setIsBoardWriteModal } from '@store/modalSlice'
import { boardWrite } from '@services/boardService'
import { RootState } from '@store/store'

import MultiImageUpload from '@components/Public/MultiImageUpload'

import { throttle } from '@utils/throttle'

type CategoryType = {
  text: string;
  value: string;
}

type BoardOpenType = {
  text: string;
  bool: boolean;
}

const BoardWrite = () => {
  const user = useSelector((state: RootState) => state.userStore);
  const isBoardWriteModal = useSelector((state: RootState) => state.modalStore.isBoardWriteModal)
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>({text: '장비 후기', value: 'equipment'});
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [boardOpen, setBoardOpen] = useState<boolean>(true);
  const [isBoardOpenDropdownOpen, setIsBoardOpenDropdownOpen] = useState<boolean>(false);
  const [boardImages, setBoardImages] = useState<File[]>([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch()
  const handleWrite = async (e: React.FormEvent) => {
    e.preventDefault(); 

    console.log(123123)
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await boardWrite(user.userId, title, content, category.value, boardOpen, boardImages);
      dispatch(setIsBoardWriteModal(false));
      window.location.reload();
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false);
    }
  }

  // 3초 쓰로틀링
  const throttledHandleWrite = throttle(handleWrite, 3000)

  const categories: CategoryType[] = [
    {
      text: '장비 후기',
      value: 'equipment'
    },
    {
      text: '레시피 추천',
      value: 'recipe'
    },
    {
      text: '캠핑장 양도',
      value: 'assign'
    },
    {
      text: '자유게시판',
      value: 'free'
    },
    {
      text: '질문게시판',
      value: 'question'
    },
  ];

  const boradOpenBoolean: BoardOpenType[] = [
    {
      text: '공개',
      bool: true
    },
    {
      text: '비공개',
      bool: false
    }
  ];


  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const selectCategory = (cat: CategoryType) => {
    setCategory(cat);
    setIsCategoryDropdownOpen(false);
  }

  const toggleBoardOpenDropdown = () => {
    setIsBoardOpenDropdownOpen(!isBoardOpenDropdownOpen);
  };

  const selectBoardOpen = (isOpen: boolean) => {
    setBoardOpen(isOpen);
    setIsBoardOpenDropdownOpen(false);
  } 

  const handleImagesChange = (images: File[]) => {
    setBoardImages(images);
  };

  const formClear = () => {
    setTitle('');
    setContent('');
    setCategory({text: '장비 후기', value: 'equipment'});
    setIsCategoryDropdownOpen(false);
    setBoardOpen(true);
    setIsBoardOpenDropdownOpen(false);
    setBoardImages([]);
  }

  useEffect(() => {
    formClear()
  }, [isBoardWriteModal]);

  useEffect(() => {
    if (title.length > 0 && content.length > 0) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [title, content])

  return (
    <div 
      className={`
        fixed z-[10] md:z-[100] w-full h-[calc(100vh-5.95rem)] md:h-full mt-[3.2rem] md:mt-0
        bg-light-black bg-opacity-80
        dark:bg-dark-black dark:bg-opacity-80
        inset-0
      `}
      onClick={() => dispatch(setIsBoardWriteModal(false))} 
    >
      <div 
        className={`md:w-[50rem] h-full md:h-[95%] md:mx-auto`} 
        onClick={(event) => event.stopPropagation()}
      >
        <div 
          className={`
            flex flex-col justify-between md:w-[45rem] h-[calc(100vh-5.95rem)] md:h-[90%] mt-0 md:mt-[8%] md:mx-auto p-[1rem] md:p-[1.5rem]
            bg-light-white
            dark:bg-dark-white
            overflow-auto md:rounded-md
          `}
        >
          <div className={`flex flex-col flex-grow`}>
            <div className={`flex items-center mb-[1.5rem]`}>
              <div>
                <ArrowLeftIcon 
                  onClick={() => dispatch(setIsBoardWriteModal(false))} 
                  className={`
                    md:hidden size-[1.5rem]
                    fill-light-border-icon
                    dark:fill-dark-border-icon
                    cursor-pointer
                  `}
                />
              </div>
              <div 
                className={`
                  ms-[1rem] md:ms-0
                  font-bold text-2xl
                `}
              >
                  커뮤니티 글쓰기
              </div>
              <div className={`ms-auto`}>
                <CloseIcon 
                  onClick={() => dispatch(setIsBoardWriteModal(false))} 
                  className={`
                    hidden md:block md:size-[1.5rem]
                    fill-light-border-icon
                    dark:fill-dark-border-icon
                    cursor-pointer
                  `}
                />
              </div>
            </div>
            <div className={`flex items-baseline justify-between mb-[1rem]`}>
              <div className={`relative`}>
                <div 
                  className={`
                    flex justify-between items-center w-[10rem] ms-[0.5rem] md:ms-0 px-[0.5rem] md:px-[1rem] py-[0.3rem]
                    border-light-gray-2
                    dark:border-dark-gray-2
                    border-b md:border md:rounded-md cursor-pointer font-medium
                  `} 
                  onClick={toggleCategoryDropdown}
                >
                  {category.text}
                  <ArrowBottomIcon
                    className={`
                      inline size-[1rem] ms-[1.5rem]
                      fill-light-border-icon
                      dark:fill-dark-border-icon
                      cursor-pointer
                    `}
                  />
                </div>
                <div 
                  className={`
                    ${isCategoryDropdownOpen ? 'max-h-[18.75rem] opacity-100' : 'max-h-0 opacity-0'}
                    absolute z-[10] w-[calc(100%-0.5rem)] mt-[0.5rem] ms-[0.5rem] md:ms-0 
                    bg-light-white border-light-border-1
                    dark:bg-dark-white dark:border-dark-border-1
                    border rounded-md shadow-lg overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out
                  `}
                > 
                  {categories.map((eachCategory, index) => (
                    <div 
                      key={index} 
                      className={`
                        ps-[1rem] py-[0.75rem]
                        cursor-pointer
                      `}
                      onClick={() => selectCategory(eachCategory)}
                    >
                      {eachCategory.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className={`relative`}>
                <div 
                  className={`
                    ms-auto
                    text-light-anchor hover:text-light-anchor-hover
                    dark:text-dark-anchor dark:hover:text-dark-anchor-hover
                    text-sm md:text-md cursor-pointer 
                  `}
                  onClick={toggleBoardOpenDropdown}
                >
                  공개 범위 : {boardOpen ? '공개' : '비공개'}
                </div>
                <div 
                  className={`
                    ${isBoardOpenDropdownOpen ? 'max-h-[18.75rem] opacity-100' : 'max-h-0 opacity-0'}
                    absolute z-10 w-20 mt-[0.5rem]
                    bg-light-white border-light-border-1 text-light-text-secondary
                    dark:bg-dark-white dark:border-dark-border-1 dark:text-dark-text-secondary
                    text-sm border rounded-md shadow-lg overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out 
                  `}
                > 
                  {boradOpenBoolean.map((eachChoice, index) => (
                    <div 
                      key={index} 
                      className={`
                        ps-[0.5rem] py-[0.5rem]
                        hover:text-light-signature
                        dark:hover:text-dark-signature
                        cursor-pointer duration-150
                      `}
                      onClick={() => selectBoardOpen(eachChoice.bool)}
                    >
                      {eachChoice.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={`flex flex-col flex-grow`}>
              <input
                className={`
                  py-[0.5rem] ps-[1rem]
                  bg-light-white border-light-border placeholder:text-light-text-secondary
                  dark:bg-dark-white dark:border-dark-border dark:placeholder:text-dark-text-secondary
                  border-b focus:outline-none
                `}
                placeholder='제목'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <textarea 
                className={`
                  flex-grow h-[17rem] mt-[1rem] mb-[2rem] py-[0.5rem] ps-[1rem]
                  bg-light-bgbasic placeholder:text-light-text-secondary
                  dark:bg-dark-gray opacity-80 dark:placeholder:text-dark-text-secondary
                  resize-none focus:outline-none rounded-sm
                `}
                placeholder='사람들과 공유하고 싶은 내용을 작성해주세요.'
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
            </div>
          </div>
          <div className={`flex flex-col`}>
            <MultiImageUpload onImagesChange={handleImagesChange}/>
            <div 
              className={`
                md:static w-full mt-[1rem]
                md:text-center
              `} 
              onClick={throttledHandleWrite}
            >
              <button 
                className={`
                  ${
                    isSubmitDisabled ? 
                    `
                      bg-light-gray text-light-text-secondary
                      dark:bg-dark-gray dark:text-dark-text-secondary
                    ` : `
                      bg-light-black text-light-white hover:bg-light-signature hover:text-light-white
                      dark:bg-dark-black dark:text-dark-white dark:hover:bg-dark-signature dark:hover:text-white
                    `
                  }
                  w-full py-[0.5rem]
                  transition duration-300 text-center rounded-md 
                `}
                disabled={isSubmitDisabled}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardWrite;