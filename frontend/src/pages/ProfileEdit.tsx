import React from 'react'
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import UserInformation from '@components/User/UserInformation'

type Props = {}

const ProfileEdit = (props: Props) => {
  return (
    <div className='md:mt-[1rem] lg:mt-[3rem] mx-auto p-6 md:w-[40rem] lg:p-0'>
      <div className='flex md:justify-center items-center pb-[0.75rem] md:text-[2rem] md:border-b-2 border-black md:mb-[3rem]'>
        <LeftArrow className='md:hidden me-3 cursor-pointer w-5 h-5'/>
        <div className='max-md:text-[1.5rem]'>프로필 수정</div>
      </div>
      <UserInformation />
      <div className='text-center'>
        <button className='w-[80%] md:mt-[3rem] border-2 border-black font-bold md:w-[20rem] md:rounded-none rounded-md h-[2.5rem] hover:bg-black hover:text-white transition-all duration-300'>
            완료
        </button>
      </div>
    </div>
  )
}

export default ProfileEdit