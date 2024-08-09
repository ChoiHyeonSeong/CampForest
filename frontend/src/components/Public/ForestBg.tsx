import React from 'react'

type Props = {
  children?: React.ReactNode
}

const ForestBg = (props: Props) => {
  return (
    <div className=" flex flex-col items-center justify-center bg-cover bg-left-center fixed inset-0 w-screen h-screen z-[-1]"
         style={{backgroundImage: "url('https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')"}}>
      <div className="absolute inset-0 w-full h-1/2 bg-cover animate-clouds1"
           style={{backgroundImage: "url('https://github.com/joshuaward/codepen-images/blob/master/clouds-left.png?raw=true')"}}></div>
      <div className="absolute inset-0 top-1/2 w-full h-1/2 bg-cover animate-clouds2"
           style={{backgroundImage: "url('https://github.com/joshuaward/codepen-images/blob/master/clouds-right.png?raw=true')"}}></div>
      <div className="relative z-10">
        {props.children}
      </div>
    </div>
  )
}

export default ForestBg