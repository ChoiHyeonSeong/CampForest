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

  return (
    <div 
    onClick={() => dispatch(setIsBoardWriteModal(false))} 
    className={`${isBoardWriteModal ? 'block' : 'hidden'} fixed z-[100] md:items-center w-full h-full bg-black bg-opacity-80 inset-0`}>
      <div className="h-full md:w-[40rem] md:h-[90%] md:mx-auto" onClick={(event) => event.stopPropagation()}>
        
        <div className='overflow-auto md:mx-auto h-[calc(100vh-5.95rem)] mt-[3.2rem] md:h-[85%] md:mt-[15%] md:w-[35rem] bg-white md:rounded-md p-4 md:px-[2rem] md:py-[3rem] flex flex-col justify-between'>
          
          <div className='flex flex-col flex-grow'>

            <div className='flex items-center mb-[1rem]'>
              <div><ArrowLeftIcon onClick={() => dispatch(setIsBoardWriteModal(false))} className='md:hidden md:size-8 cursor-pointer' fill='000000' /></div>
              <div className='ms-4 font-bold text-2xl'>글 쓰기</div>
              <div className='ms-auto'><CloseIcon onClick={() => dispatch(setIsBoardWriteModal(false))} className='hidden md:block md:size-[1.5rem] cursor-pointer' fill='000000' /></div>
            </div>

            <div className='flex items-baseline justify-between mb-[1rem]'>
              <div className='relative'>
                <div className='w-[10rem] flex justify-between items-center ms-2 border-b md:border border-black md:rounded-md md:px-4 py-[0.3rem]' onClick={toggleCategoryDropdown}>
                  {category.text}
                  <ArrowBottomIcon className='ms-6 inline size-[1rem]'/>
                </div>
                <div 
                  className={`absolute z-10 w-[calc(100%-0.5rem)] ms-2 mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out ${
                    isCategoryDropdownOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                > 
                  {categories.map((eachCategory, index) => (
                    <div 
                      key={index} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectCategory(eachCategory)}
                    >
                      {eachCategory.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className='relative'>
                <div className='ms-auto cursor-pointer text-sm md:text-md text-blue-600' onClick={toggleBoardOpenDropdown}>
                  공개 범위 : {boardOpen ? '공개' : '비공개'}
                </div>
                <div 
                  className={`absolute z-10 w-[calc(100%-0.5rem)] ms-2 mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out ${
                    isBoardOpenDropdownOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                > 
                  {boradOpenBoolean.map((eachChoice, index) => (
                    <div 
                      key={index} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectBoardOpen(eachChoice.bool)}
                    >
                      {eachChoice.text}
                    </div>
                  ))}
                </div>
              </div>
                  
              
            </div>
            
            <div className='flex flex-col flex-grow'>
              <input 
                className='border-b py-2 ps-4 focus:outline-none'
                placeholder='제목을 입력하세요.'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <textarea 
                className='resize-none py-2 ps-4 h-[17rem] focus:outline-none mb-[2rem] flex-grow'
                placeholder='내용을 입력하세요.'
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
            </div>
          
          </div>
          
          <div className='flex flex-col'>

            <div className='flex md:static mb-5 overflow-x-auto scrollbar-hide'>
              {uploadedImage.map((eachImage, index) => (
                <div 
                  key={index} 
                  className="size-[6rem] cursor-pointer flex-shrink-0 rounded-md bg-gray-300 md:mb-[2rem] me-5"
                  onClick={() => handleRemoveImage(index)}
                >
                  <img src={eachImage} alt="NOIMG" className='w-full h-full rounded-md'/>
                </div>
              ))}

              <div 
                className='size-[6rem] cursor-pointer flex-shrink-0 rounded-md bg-gray-300 md:mb-[2rem] me-5'
                onClick={() => {fileInputRef.current?.click()}}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className='hidden'
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
                  
            </div>

            <div className='md:static md:text-center w-full' onClick={handleWrite}>
              <button className='
                py-3 w-full md:w-[15rem] bg-black text-white 
                md:bg-white md:text-black md:hover:bg-black md:hover:text-white 
                transition duration-300 text-center md:border border-black 
                md:rounded-md md:py-1'
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