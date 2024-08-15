import React, { useState, useRef, useEffect } from 'react'
import CampingReview from './CampingReview'
import { userGetProfile } from '@services/userService'
import CampingReviewWrite from './CampingReviewWrite'
import { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'

import { campingLoadReviews, campingReviewWrite, campingReviewDelete } from '@services/campingService'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@store/store'
import { setIsLoading } from '@store/modalSlice'

import Swal from 'sweetalert2'
export type Review = {
  reviewId: number;
  content: string;
  rate: number;
  nickname: string;
  profileImage: string;
  userId: number;
  createdAt: string;
}

type Props = {
  isModalOpen: boolean;
  campsiteId: number;
  updateFunction: (campsiteId: number) => void;
}

const CampingReviewList = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userStore)
  const [reviews, setReviews] = useState<Review[]>([]);
  const reviewWriteRef = useRef<HTMLDivElement>(null);

  const fetchCampingReviews = async () => {
    try {
      const response = await campingLoadReviews(props.campsiteId)
      console.log(response)
      setReviews(response.data.data)
    } catch (error) {
      console.log(error)
    }   
  };

  useEffect(() => {
    if (props.isModalOpen) {
      fetchCampingReviews()
    }
  }, [props.isModalOpen]);

  const writeReview = async (content: string, rate: number) => {
    try {
      dispatch(setIsLoading(true))
      const response = await campingReviewWrite(props.campsiteId, content, rate)
      console.log(response)
      await fetchCampingReviews()
      props.updateFunction(props.campsiteId)
      dispatch(setIsLoading(false))
    } catch (error) {
      dispatch(setIsLoading(false))
      console.log(error) 
    }
  }

  const deleteReview = async (reviewId: number) => {
    try {
      const response = await campingReviewDelete(reviewId)
      console.log(response)
      await fetchCampingReviews()
      props.updateFunction(props.campsiteId)
    } catch (error) {
      console.log(error)
    }
  }

  const popLoginAlert = () => {
    Swal.fire({
      icon: "error",
      title: "로그인 해주세요.",
      text: "로그인 후 사용가능합니다.",
      confirmButtonText: '확인'
    }).then(result => {
      if (result.isConfirmed) {
        navigate('/user/login')
      }
    });
  }

  const handleWriteClick = () => {
    if (!user.isLoggedIn) {
      popLoginAlert()
      return;
    }
    reviewWriteRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const textarea = reviewWriteRef.current?.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 500);
  };

  return (
    <div className=''>
      <div className='flex justify-between font-semibold mb-[1rem] text-lg'>
        <div className='flex'>
          <p>후기</p>
          <span>({reviews.length})</span>
        </div>

        <button
          onClick={handleWriteClick}
          className='
            
            text-light-signature
            dark:text-dark-signature
            text-sm
          '
        >
          후기작성하기
        </button>
      </div>
      
      {/* 캠핑 후기 전체부모 */}
      <div
        className='
          p-[0.5rem]
          bg-light-bgbasic
          dark:bg-dark-bgbasic
        '
        >
          {/* 후기 */}
          {reviews.length > 0 ? (
          <div>
            {reviews.map(review => (
              <CampingReview key={review.reviewId} review={review} deleteFunction={deleteReview}/>
            ))}
          </div>
          ) : (
            <p className="text-center py-4">아직 후기가 없습니다. 후기를 남겨주세요!</p>
          )}

          
      </div>

      {/* 후기 달기 */}
      <div
        className='
        my-[1rem] p-[1rem]
        bg-light-bgbasic
        dark:bg-dark-bgbasic
        '
        ref={reviewWriteRef}>
        <CampingReviewWrite writeReview={writeReview} isLoggedin={user.isLoggedIn} />
      </div>
      
    </div>
  )
}

export default CampingReviewList