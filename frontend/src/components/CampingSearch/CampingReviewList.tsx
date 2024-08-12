import React, { useState, useRef, useEffect } from 'react'
import CampingReview from './CampingReview'
import { userGetProfile } from '@services/userService'
import CampingReviewWrite, { User, Review } from './CampingReviewWrite'
import { AxiosResponse } from 'axios'

type UserProfileResponse = {
  data: User;
  message: string;
  status: string;
}
type Props = {}

const CampingReviewList = (props: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reviewWriteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response: AxiosResponse<UserProfileResponse> = await userGetProfile();
        console.log("User data received:", response.data.data);  // 디버깅을 위한 로그
        setCurrentUser(response.data.data);
      } catch (error) {
        console.error('Failed to get current user:', error);
        setError('사용자 정보를 가져오는데 실패했습니다.');
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const addReview = (newReview: Omit<Review, 'id' | 'author' | 'profileImage' | 'userId' | 'date'>) => {
    if (!currentUser) {
      alert('로그인 후 리뷰를 작성할 수 있습니다.');
      return;
    }
    const review: Review = {
      ...newReview,
      id: Date.now(),
      author: currentUser.nickname,
      profileImage: currentUser.profileImage,
      userId: currentUser.userId,
      date: new Date().toLocaleDateString()
    };
    console.log("New review being added:", review);  // 디버깅을 위한 로그
    setReviews(prevReviews => [review, ...prevReviews]);
  };

  const handleWriteClick = () => {
    if (!currentUser) {
      alert('로그인 후 리뷰를 작성할 수 있습니다.');
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

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
              <CampingReview key={review.id} review={review} />
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
        <CampingReviewWrite addReview={addReview} currentUser={currentUser} />
      </div>
      
    </div>
  )
}

export default CampingReviewList