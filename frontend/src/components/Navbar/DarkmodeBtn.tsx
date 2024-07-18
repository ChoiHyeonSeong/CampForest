import React, { useState } from 'react'

type Props = {}

const DarkmodeBtn = (props: Props) => {
  const [isDarkmode, setIsDarkmode] = useState(false)

  const toggleDarkmode = () => {
    setIsDarkmode(!isDarkmode)
  }

  return (
    <div className='bg-black w-16 h-5 rounded-3xl cursor-pointer' onClick={toggleDarkmode}>
      <div className={`bg-green-500 w-10 h-5 rounded-3xl transition-all duration-300
        ${isDarkmode ? 'translate-x-6' : '-translate-x-0'}`}
      />
    </div>
  )
}

export default DarkmodeBtn