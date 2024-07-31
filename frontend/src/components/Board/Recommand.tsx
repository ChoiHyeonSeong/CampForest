import React, { useEffect } from 'react'
import RecommandUser from './RecommandUser';
import RecommandTransaction from './RecommandTransaction';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

const Recommand = () => {
  const similarUsers = useSelector((state: RootState) => state.userStore).similarUsers;
  useEffect(() => {
    console.log(similarUsers);
  }, [])
  return (
    <div className='max-xl:hidden xl:sticky xl:ms-[3rem] lg:top-[13rem] border rounded-md p-[2rem]'>
      {/* 사용자 추천 */}
      <div className='pb-[1rem] border-b'>
        <div className='mb-[0.5rem]'>사용자 추천</div>
        <div className='space-y-[1rem]'>
        {similarUsers.map((similarUser, index) => (
              <RecommandUser key={index} />
        ))}
        </div>
      </div>
      {/* 인기 거래 글 */}
      <div className='mt-[1rem]'>
        <div className='mb-[0.5rem]'>인기 거래 글</div>
        <div className='space-y-[1rem]'>
          <RecommandTransaction />
          <RecommandTransaction />
          <RecommandTransaction />
        </div>
      </div>
    </div>
  )
}

export default Recommand;