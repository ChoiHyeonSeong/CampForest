import React from 'react'

const Board = () => {
  return (
    <div className='my-[2rem] shadow-md rounded-md p-[1rem]'>
      <div className='text-center bg-red-300 h-[3.5rem]'>
        Header
      </div>
      <div className='relative text-center bg-yellow-300'>
        <div className='inline-block bg-gray-300'>Picture</div>
        <div></div>
      </div>
    </div>
  )
}

export default Board;