import React from 'react'

type Props = {
  modalOpen: () => void;
}

const Camping = (props: Props) => {
  return (
    <div 
      onClick={props.modalOpen} 
      className={`flex items-center w-full border-b border-light-border-1`}
    >
      {/* 캠핑이미지 */}
      <div 
        className={`
          hidden md:block md:w-[15rem]
          aspect-[3/2]
          bg-slate-300
          rounded-sm overflow-hidden
          m-2
        `}
      >
        <img
          src=""
          alt="캠핑장사진"
          className="w-full h-full object-cover"
        
        />
      </div>

      
      <div className={`w-full ms-[0.75rem] my-[0.5rem] py-[0.5rem]`}>
        {/* 캠핑장 이름 및 장소 */}
        <div className={`lex items-baseline mb-[0.5rem]`}>
          <div 
            className={`
              mb-[0.25rem]
              text-xl font-semibold line-clamp-1
            `}
          >
            OO캠핑장
          </div>
          <div
            className={`
              mb-[0.25rem]
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-xs line-clamp-1
            `}
          >
            OO시 OO구 OO로 OO-OO
          </div>
        </div>

        {/* 캠핑태그 */}
        <div 
          className={`
            max-md:hidden flex mb-[0.25rem] space-x-[0.5rem]
            text-xs
          `}
        >
          <button 
            className={`
              px-[0.25rem] py-[0.1rem]
              bg-light-bgbasic
              dark:bg-dark-bgbasic
              rounded font-medium
            `}
          >
            무료
          </button>
          <button 
            className={`
              px-[0.25rem] py-[0.1rem]
              bg-light-bgbasic
              dark:bg-dark-bgbasic
              rounded font-medium
            `}
          >
            계곡
          </button>
          <button 
            className={`
              px-[0.25rem] py-[0.1rem]
              bg-light-bgbasic
              dark:bg-dark-bgbasic
              rounded font-medium
            `}
          >
            반려견 동반 가능
          </button>
        </div>

        {/* 캠핑후기 */}
        <div>
          <div className={`flex items-center mt-[0.5rem]`}>
            <div className={`text-lg me-[0.5rem]`}>
              ★★★★★
              <span className='ms-[0.25rem]'>5.0</span>
            </div>
            <div className={`text-xs`}>
              (28개의 평가)
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Camping;