import React, { useState } from 'react'

function CampingSearch() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalOpen = () => {
    setIsModalOpen(true);
  }

  const modalClose = () => {
    setIsModalOpen(false);
  }

  return (
    <div className='lg:h-screen'>

      {/* 메인 화면 */}
      <div className='w-full h-full flex flex-all-center '>
        <div className='ms-2 me-2 md:mt-[1rem] p-6 lg:p-0 flex flex-all-center flex-col lg:flex-row lg:h-[40rem] w-full lg:max-w-[80rem] md:max-w-3xl'>
          <div className='bg-black aspect-[1/1] w-full lg:w-[40rem] lg:h-[40rem]'>지도</div>
          <div className='bg-slate-300 w-full lg:w-[calc(100%-40rem)] lg:min-w-[20rem] h-[calc()] lg:h-full'>
            <div className='bg-yellow-100 h-[2rem]' onClick={modalOpen}>검색어 (모달확인용 임시 버튼)</div>
            <div className='bg-yellow-200 h-[2rem]'>필터</div>
            <div className='bg-yellow-300 lg:h-[36rem] overflow-y-auto scrollbar-hide'>
              <div className='bg-gray-500 h-[100rem]'>
                scroll test
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <div 
        className={`fixed z-20 bg-opacity-75 ${isModalOpen ? 'bg-gray-500 inset-0' : 'bg-none'}`}
        onClick={modalClose}
      >
      </div>
      <div 
        className={`fixed z-30 right-0 top-0 h-full w-[30%] bg-yellow-500 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isModalOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
      </div>

    </div>
  )
}

export default CampingSearch