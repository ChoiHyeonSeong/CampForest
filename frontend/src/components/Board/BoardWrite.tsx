import React, { useState, useRef, useEffect } from 'react'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 
import { ReactComponent as ArrowBottomIcon } from '@assets/icons/arrow-bottom.svg'
import { ReactComponent as ArrowLeftIcon } from '@assets/icons/arrow-left.svg'
import { useDispatch, useSelector } from 'react-redux'
import { setIsBoardWriteModal } from '@store/modalSlice'
import { boardWrite } from '@services/boardService'
import { RootState } from '@store/store'

type CategoryType = {
  text: string;
  value: string;
}

type BoardOpenType = {
  text: string;
  bool: boolean;
}

const BoardWrite = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState) => state.userStore);
  const isBoardWriteModal = useSelector((state: RootState) => state.modalStore.isBoardWriteModal)
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>({text: '캠핑장 후기', value: 'place'});
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [boardOpen, setBoardOpen] = useState<boolean>(true);
  const [isBoardOpenDropdownOpen, setIsBoardOpenDropdownOpen] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string[]>([])
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const dispatch = useDispatch()
  const handleWrite = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      await boardWrite(user.userId, title, content, category.value, boardOpen, uploadedImage);
      dispatch(setIsBoardWriteModal(false));
    } catch (error) {
      console.log(error)
    }
  }

  const categories: CategoryType[] = [
    {
      text: '캠핑장 후기',
      value: 'place'
    },
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImage((prevImages: string[]) => [...prevImages, base64String]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImage(prev => prev.filter((_, i) => i !== index));
  };


  const formClear = () => {
    setTitle('');
    setContent('');
    setCategory({text: '캠핑장 후기', value: 'place'});
    setIsCategoryDropdownOpen(false);
    setBoardOpen(true);
    setIsBoardOpenDropdownOpen(false);
    setUploadedImage([]);
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
        ${isBoardWriteModal ? 'block' : 'hidden'} 
        fixed z-[10] md:z-[100] w-full h-[calc(100vh-5.95rem)] md:h-full mt-[3.2rem] md:mt-0
        bg-light-black bg-opacity-80
        dark:bg-dark-black dark:bg-opacity-80
        inset-0
      `}
      onClick={() => dispatch(setIsBoardWriteModal(false))} 
    >
      <div 
        className={`md:w-[40rem] h-full md:h-[90%] md:mx-auto`} 
        onClick={(event) => event.stopPropagation()}
      >
        <div 
          className={`
            flex flex-col justify-between md:w-[35rem] h-[calc(100vh-5.95rem)] md:h-[85%] mt-0 md:mt-[15%] md:mx-auto p-[1rem] md:px-[2rem] md:py-[3rem]
            bg-light-white
            dark:bg-dark-white
            overflow-auto md:rounded-md
          `}
        >
          <div className={`flex flex-col flex-grow`}>
            <div className={`flex items-center mb-[1rem]`}>
              <div>
                <ArrowLeftIcon 
                  onClick={() => dispatch(setIsBoardWriteModal(false))} 
                  className={`
                    md:hidden md:size-[2rem] 
                    cursor-pointer
                  `}
                  fill='000000' 
                />
              </div>
              <div 
                className={`
                  ms-[1rem]
                  font-bold text-2xl
                `}
              >
                  글 쓰기
              </div>
              <div className={`ms-auto`}>
                <CloseIcon 
                  onClick={() => dispatch(setIsBoardWriteModal(false))} 
                  className={`
                    hidden md:block md:size-[1.5rem]
                    cursor-pointer
                  `} 
                  fill='000000' 
                />
              </div>
            </div>
            <div className={`flex items-baseline justify-between mb-[1rem]`}>
              <div className={`relative`}>
                <div 
                  className={`
                    flex justify-between items-center w-[10rem] ms-[0.5rem] md:px-[1rem] py-[0.3rem]
                    border-light-black
                    dark:border-dark-black
                    border-b md:border md:rounded-md
                  `} 
                  onClick={toggleCategoryDropdown}
                >
                  {category.text}
                  <ArrowBottomIcon className={`inline size-[1rem] ms-[1.5rem]`}/>
                </div>
                <div 
                  className={`
                    ${isCategoryDropdownOpen ? 'max-h-[18.75rem] opacity-100' : 'max-h-0 opacity-0'}
                    absolute z-[10] w-[calc(100%-0.5rem)] mt-[0.25rem] ms-[0.5rem]
                    bg-light-white border-light-border-1
                    dark:bg-dark-white dark:border-dark-border-1
                    border rounded-md shadow-lg overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out
                  `}
                > 
                  {categories.map((eachCategory, index) => (
                    <div 
                      key={index} 
                      className={`
                        px-[1rem] py-[0.5rem]
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
                    absolute z-10 w-[calc(100%-0.5rem)] mt-[0.25rem] ms-[0.5rem]
                    bg-light-white border-light-border-1
                    dark:bg-dark-white dark:border-dark-border-1
                    border rounded-md shadow-lg overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out 
                  `}
                > 
                  {boradOpenBoolean.map((eachChoice, index) => (
                    <div 
                      key={index} 
                      className={`
                        px-[1rem] py-[0.5rem] 
                        cursor-pointer
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
                  bg-light-white border-light-border
                  dark:bg-dark-white dark:border-dark-border
                  border-b focus:outline-none
                `}
                placeholder='제목을 입력하세요.'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <textarea 
                className={`
                  flex-grow h-[17rem] mb-[2rem] py-[0.5rem] ps-[1rem]
                  bg-light-white
                  dark:bg-dark-white
                  resize-none focus:outline-none
                `}
                placeholder='내용을 입력하세요.'
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
            </div>
          </div>
          <div className={`flex flex-col`}>
            <div 
              className={`
                flex md:static mb-[1.25rem] 
                overflow-x-auto scrollbar-hide
              `}
            >
              {uploadedImage.map((eachImage, index) => (
                <div 
                  key={index} 
                  className={`
                    flex-shrink-0 size-[6rem] md:mb-[2rem] me-[1.25rem]
                    cursor-pointer rounded-md
                  `}
                  onClick={() => handleRemoveImage(index)}
                >
                  <img 
                    src={eachImage} 
                    alt="NOIMG" 
                    className={`
                      w-full h-full
                      rounded-md
                    `}
                  />
                </div>
              ))}
              <div 
                className={`
                  flex-shrink-0 size-[6rem] md:mb-[2rem] me-[1.25rem]
                  cursor-pointer rounded-md
                `}
                onClick={() => {fileInputRef.current?.click()}}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className={`hidden`}
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
            </div>
            <div 
              className={`
                md:static w-full
                md:text-center
              `} 
              onClick={handleWrite}
            >
              <button 
                className={`
                  ${
                    isSubmitDisabled ? 
                    `
                      bg-light-gray border-light-gray text-light-text-secondary
                      dark:bg-dark-gray dark:border-dark-gray dark:text-dark-text-secondary
                    ` : `
                      bg-light-black md:bg-light-white text-light-white md:text-light-black border-light-black md:hover:bg-light-black md:hover:text-light-white
                      dark:bg-dark-black dark:md:bg-dark-white dark:text-dark-white dark:md:text-dark-black dark:border-dark-black dark:md:hover:bg-dark-black dark:md:hover:text-dark-white
                    `
                  }
                  w-full md:w-[15rem] py-[0.75rem] md:py-[0.25rem]  
                  md:border transition duration-300 text-center md:rounded-md 
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