import React from 'react'

type Props = {
  modalOpen: () => void;
}

const Camping = (props: Props) => {
  return (
    <div 
      onClick={props.modalOpen} 
      className={`flex md:min-w-[25rem] w-full`}
    >
      <div 
        className={`
          w-1/3 max-w-[8rem] m-[1rem]
          aspect-1
        `}
      />
      <div className={`w-2/3 sm:w-3/4 my-[1rem] py-[0.25rem]`}>
        <div className={`md:flex items-baseline mb-[0.25rem]`}>
          <div 
            className={`
              me-[0.5rem]
              text-2xl
            `}
          >
            OO캠핑장
          </div>
          <div className={`text-xs`}>
            OO시 OO구 OO로 OO-OO
          </div>
        </div>
        <div 
          className={`
            max-md:hidden flex mb-[0.25rem] ms-[0.1rem] space-x-[0.5rem]
            text-xs
          `}
        >
          <button 
            className={`
              px-[0.25rem] py-[0.1rem]
              rounded-md
            `}
          >
            무료
          </button>
          <button 
            className={`
              px-[0.25rem] py-[0.1rem]
              rounded-md
            `}
          >
            계곡
          </button>
          <button 
            className={`
              px-[0.25rem] py-[0.1rem]
              rounded-md
            `}
          >
            반려견 동반 가능
          </button>
        </div>
        <div>
          <div className={`flex mt-[1rem]`}>
            <div className={`text-lg`}>
              ★★★★★ 5.0
            </div>
            <button 
              className={`
                my-[0.1rem] ms-[0.25rem] md:ms-[0.5rem] px-[0.5rem]
                text-xs rounded-md
              `}
            >
              후기 보기
            </button>
          </div>
          <div className={`text-xs`}>
            (28개의 평가)
          </div>
        </div>
      </div>
    </div>
  )
}

export default Camping;