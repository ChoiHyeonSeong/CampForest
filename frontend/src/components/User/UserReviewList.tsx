import React, { useEffect, useState } from 'react'
import UserReviewCard from '@components/User/UserReviewCard'
import { userReviewList, writeReviewList } from '@services/reviewService';
import { ReviewType } from '@components/Chat/Chat';
import { store } from '@store/store';

type Props = {
  userId: number;
}

const UserReviewList = (props: Props) => {
  const [reviewList, setReviewList] = useState<ReviewType[]>([]);
  const [myReviewList, setMyReviewList] = useState<ReviewType[]>([]);
  const [avarage, setAvarage] = useState(0);
  const [myPage, setMyPage] = useState(false);
  const [written, setWritten] = useState(false);

  function calculateAvarage (reviewList: ReviewType[]) {
    let rating = 0;
    let size = reviewList.length;
    reviewList.forEach((review) => {
      rating += review.rating;
    })
    return rating / size;
  }

  async function fetchReviewList () {
    try {
      const result = await userReviewList(props.userId);
      if(result.length) {
        setAvarage(calculateAvarage(result));
      }
      setReviewList(result);
    } catch (error) {
      console.error('fetch Review List failed :', error);
    }
  }

  async function fetchMyReviewList () {
    try {
      const result = await writeReviewList();

      setMyReviewList(result);
    } catch (error) {
      console.error(`fetch myReview list Failed: `, error);
    }
  }

  useEffect(() => {
    fetchReviewList();
    if (props.userId === store.getState().userStore.userId) {
      setMyPage(true);
      setWritten(true);
      fetchMyReviewList();
    }
  }, [])

  return (
    <div className={`w-full`}>
      {/* 작성글, 저장됨, 필터 */}
      <div
          className={`
            flex justify-center relative mt-[1.5rem] mb-[1.5rem]
          `}
        >
          {/* 작성글 */}
          <div
            onClick={() => setWritten(true)}
            className={`
              ${myPage ? '' : 'hidden'}
              ${written ? 'font-bold' : 'text-light-text-secondary'}
              me-[2.5rem]
              flex items-center
            `}
          >
            <span
              className={`
                ms-[0.5rem]
                text-[0.875rem]
              `}
            >
              보낸 리뷰 {myReviewList.length}
            </span>
          </div>
          {/* 북마크 */}
          <div 
            onClick={() => setWritten(false)}
            className={`
              flex items-center
            `}
          >
            <span
              className={`
                ${!written ? 'font-bold' : 'text-light-text-secondary'}
                text-[0.875rem]
              `}
            >
              받은 리뷰 {reviewList.length}
            </span>
          </div>
        </div>

      {/* 후기 카드 */}
      {written ? (
        <div className={`w-full px-[0.75rem]`}>
        {myReviewList.map((review) => (
          <div key={review.id}>
            <UserReviewCard review={review}/>
          </div>
        ))}
      </div>) : (
        <div className={`w-full px-[0.75rem]`}>
        {reviewList.map((review) => (
          <div key={review.id}>
            <UserReviewCard review={review}/>
          </div>
        ))}
      </div>)}
      
    </div>
  )
}

export default UserReviewList