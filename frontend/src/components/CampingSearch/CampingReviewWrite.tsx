import React, { useState } from 'react'
import { ReactComponent as StarIcon } from '@assets/icons/star.svg'

type Props = {
  isLoggedin: boolean,
  writeReview: (content: string, rate: number) => void;
}

const CampingReviewWrite = (props: Props) => {
  const [review, setReview] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    if (input.length <= 150) {
      setReview(input);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    if (!props.isLoggedin) {
      setError('로그인 후 리뷰를 작성할 수 있습니다.');
      return;
    }
    if (rating === 0) {
      setError('별점을 선택해주세요.');
      return;
    }
    if (review.trim() === '') {
      setError('후기 내용을 입력해주세요.');
      return;
    }
    props.writeReview(review, rating);
    setReview('');
    setRating(0);
    setError('');
  };

  if (!props.isLoggedin) {
    return <p>리뷰를 작성하려면 로그인이 필요합니다.</p>;
  }


  return (
    <div>
      <div className='font-semibold text-lg'>후기 작성</div>
      <div className="relative">
        <textarea
          value={review}
          onChange={handleReviewChange}
          placeholder="캠핑장을 다녀오셨나요? 솔직한 후기를 남겨주시면, 유저들에게 도움이 됩니다."
          className="
            w-full h-[6rem] mt-[0.5rem] p-[0.5rem]
            bg-light-white placeholder:text-light-text-secondary
            dark:bg-dark-white dark:placeholder:text-dark-text-secondary
            rounded resize-none focus:outline-none"
        />
        <span
          className="
            absolute bottom-2 right-2
            text-light-gray-3
            dark:text-dark-gray-3
            text-sm
          "
        >
          {review.length}/150
        </span>
      </div>

      <div className='flex justify-between'>
        {/* 별점 평가 */}
        <div className="flex items-center space-x-1">
          <span className='font-medium me-[0.5rem]'>별점평가({rating}점)</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              onClick={() => handleRatingChange(star)}
              fill={star <= rating ? 'gold' : 'none'}
              stroke={star <= rating ? 'gold' : '#666'}
              className="size-[1.2rem] cursor-pointer transition-colors duration-200"
            />
          ))}

        </div>
        
        {/* 작성하기 */}
        <button
        onClick={handleSubmit}
          className="
            px-[1rem] py-[0.25rem]
            bg-light-signature text-white hover:bg-light-signature-hover
            dark:bg-dark-signature dark:hover:bg-ligdarkht-signature-hover
            rounded transition-colors duration-200
          "
        >
          작성
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default CampingReviewWrite