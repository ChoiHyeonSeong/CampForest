import React from 'react'

type Props = {
  modalOpen: () => void;
}

const Camping = (props: Props) => {
  return (
    <div 
      onClick={props.modalOpen} 
      className={`flex w-full md:min-w-[30rem]`}
    >
      {/* 캠핑이미지 */}
      <div 
        className={`
          shrink-0 w-1/3 max-w-[8rem] m-[1rem]
          bg-slate-300
          aspect-1 rounded overflow-hidden
        `}
      >
        <img src="" alt="캠핑장사진" />
      </div>

      
      <div className={`w-2/3 sm:w-3/4 ms-[0.75rem] my-[1rem]  py-[0.25rem]`}>
        {/* 캠핑장 이름 및 장소 */}
        <div className={`lex items-baseline mb-[0.5rem]`}>
          <div 
            className={`
              me-[0.5rem]
              text-2xl
            `}
          >
            OO캠핑장
          </div>
          <div
            className={`
              ps-[0.25rem]
              text-light-text-secondary
              dark:text-dark-text-secondary
              text-xs
            `}
          >
            OO시 OO구 OO로 OO-OO
          </div>
        </div>

        {/* 캠핑태그 */}
        <div 
          className={`
            max-md:hidden flex mb-[0.25rem] ms-[0.1rem] space-x-[0.5rem]
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
          <div className={`flex items-center mt-[1rem]`}>
            <div className={`text-lg me-[0.5rem]`}>
              ★★★★★
              <span>5.0</span>
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