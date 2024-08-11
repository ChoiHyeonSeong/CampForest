import React from 'react'
import Mountain from '@assets/images/mountain.png'

type Props = {}

const LightMode = (props: Props) => {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden">
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-700 to-sky-50"></div>

      {/* Sun */}
      {/* <div className="absolute -top-[1rem] left-[20%] w-[100px] h-[100px] rounded-full bg-[#fff8d7] shadow-sun"></div> */}


      {/* Clouds */}
      <div className="absolute inset-0 w-full h-1/2 bg-cover animate-clouds1"
           style={{backgroundImage: "url('https://github.com/joshuaward/codepen-images/blob/master/clouds-left.png?raw=true')"}}>
      </div>
      <div className="absolute inset-0 top-1/2 w-full h-1/2 bg-cover animate-clouds2"
           style={{backgroundImage: "url('https://github.com/joshuaward/codepen-images/blob/master/clouds-right.png?raw=true')"}}>
      </div>

      {/* Mountains and forest */}
      <div className="absolute -bottom-[16.5rem] left-0 w-full">
        <img src={Mountain} alt="Mountain landscape" className="object-cover w-full" />
      </div>
    </div>
  );
}

export default LightMode