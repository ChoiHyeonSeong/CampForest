import React from 'react'

type Props = {
  title: string;
  imgsrc: string;
  imgBgColor: string;
  imgWd: string;
}

const EachCategory = (props: Props) => {
  return (
    <div className='flex flex-col flex-all-center mb-5'>
      <div className={`${props.imgWd} mb-[0.25rem] rounded-xl ${props.imgBgColor}`}>
        <img src={props.imgsrc} alt="NoImg" className={`${props.imgWd}`}/>
      </div>
      <p>{props.title}</p>
    </div>
  )
}

export default EachCategory