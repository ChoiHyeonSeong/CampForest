import React, { useState, useEffect } from 'react'
import { ReactComponent as HeartIcon } from '@assets/icons/heart.svg'
import { ReactComponent as BookmarkIcon } from '@assets/icons/bookmark.svg'
import { ReactComponent as CommentIcon} from '@assets/icons/comment.svg'
import { ReactComponent as LeftArrowIcon } from '@assets/icons/arrow-left.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/arrow-right.svg';
import { RootState } from '@store/store'
import { useSelector } from 'react-redux'
import MoreOptionsMenu from '@components/Public/MoreOptionsMenu'
import { useNavigate } from 'react-router-dom'

import { boardDelete, boardLike, boardDislike } from '@services/boardService';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export type BoardType = {
  boardId: number;
  boardOpen: boolean;
  category: string;
  commentCount: number;
  content: string;
  createdAt: string;
  imageUrls: string[];
  likeCount: number;
  liked: boolean;
  modifiedAt: string;
  nickname: string;
  saved: boolean
  title: string;
  userId: number;
  userImage: string;
}

type Props = {
  board: BoardType;
  deleteFunction: () => void;
  isDetail: boolean;
}

const Board = (props: Props) => {
  const user = useSelector((state: RootState) => state.userStore);
  const [liked, setLiked] = useState(props.board.liked);
  const [likeCount, setLikeCount] = useState(props.board.likeCount);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const [timeDifference, setTimeDifference] = useState('');
  const isUserPost = user.userId === props.board.userId

  const deleteBoard = async (boardId: number) => {
    try {
      const result = await boardDelete(boardId)
      props.deleteFunction()
      console.log(result)
    } catch (error) {
      console.log(error)
    };
  };

  const goBoardDetail = () => {
    navigate(`/board/detail/${props.board.boardId}`)
  }
  
  const like = async () => {
    try {
      const result = await boardLike(props.board.boardId, user.userId)
      setLiked(true)
      setLikeCount(result);
    } catch (error) {
      console.log(error)
    };
  }

  const dislike = async () => {
    try {
      const result = await boardDislike(props.board.boardId, user.userId)
      setLiked(false)
      setLikeCount(result);
    } catch (error) {
      console.log(error)
    };
  }
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const calculateTimeDifference = (modifiedAt: string) => {
    const modifiedDate = new Date(modifiedAt);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - modifiedDate.getTime();
  
    const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
  
    if (differenceInMinutes >= 1440) {
      return formatDate(modifiedDate);
    }
  
    if (differenceInMinutes >= 60) {
      return `${differenceInHours}시간 전`;
    }
  
    return `${differenceInMinutes}분 전`;
  };

  useEffect(() => {
    const modifiedAt = props.board.createdAt; // 예: "2024-07-30T11:19:40" 형식의 시간 문자열
    const difference = calculateTimeDifference(modifiedAt);
    setTimeDifference(difference); // 계산된 값을 상태에 설정
  }, [props.board.createdAt]); // modifiedAt이 변경될 때마다 실행

  // Swiper 크기 제어용
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      className={`
        flex flex-col justify-between w-full min-w-[22rem] lg:h-fit lg:px-[1rem]
      bg-light-white border-light-border
      dark:bg-dark-white dark:border-dark-border
        border-b
      `}
    >
      <div>
        {/* 포스팅 상단바 */}
        <div className={`flex justify-between h-[5rem] px-[0.5rem] py-[1rem]`}>
          <div className={`flex`}>
            <div 
              className={`
                overflow-hidden size-[2.75rem] md:size-[3rem]
                rounded-full shadow-md
              `}
            />
            <div className={`ms-[1rem]`}>
              <div className={`text-xl md:text-lg`}>{props.board.nickname}</div>
              <div className={`md:text-sm`}>{props.board.category}</div>
            </div>
          </div>
          <MoreOptionsMenu 
            isUserPost={isUserPost} 
            deleteFunction={deleteBoard} 
            deleteId={props.board.boardId}
            copyURL={`board/detail/${props.board.boardId}`}
          />
        </div>

        {/* 사진 및 내용 */}
        <div className={`w-full mb-[0.5rem]`}>
          {/* 사진 */}
          <div 
            className={`
              ${props.board.imageUrls.length > 0 ? 'bg-light-black dark:bg-dark-black' : 'hidden'}
              flex flex-all-center relative w-full max-w-full
              cursor-pointer overflow-hidden aspect-1
            `} 
            onClick={goBoardDetail}
          >
            {props.board.imageUrls.length > 0 && (
              <Swiper
              className="w-full aspect-1"
              style={{ maxWidth: `${windowWidth}px` }} // 브라우저 크기만큼 maxWidth 설정
              modules={[Navigation, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={{ nextEl: '.my-next-button', prevEl: '.my-prev-button' }}
              pagination={{ clickable: true }}
              onSwiper={(swiper: any) => console.log(swiper)}
            >
              {props.board.imageUrls.map((imageUrl, index) => (
                <SwiperSlide key={index} >
                  <img
                    src={imageUrl}
                    alt="ProductImg"
                    className="
                      w-full h-full 
                      object-contain
                    "
                  />
                </SwiperSlide>
              ))}
              <button 
                className={`
                  my-next-button 
                  absolute top-1/2 right-[0.5rem] z-[10] p-[0.5rem]
                  transform -translate-y-1/2 rounded-full
                  bg-white bg-opacity-50
                `}
              >
                <RightArrowIcon className="w-[1.5rem] h-[1.5rem]" />
              </button>
              <button 
                className={`
                  my-prev-button
                  absolute top-1/2 left-2 z-10 p-2
                  transform -translate-y-1/2 rounded-full
                  bg-white bg-opacity-50
                `}
              >
                <LeftArrowIcon className="w-[1.5rem] h-[1.5rem]" />
              </button>
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                  .swiper-container {
                    width: 100% !important;
                    height: 100% !important;
                  }
                  .swiper-slide {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .swiper-pagination-bullet {
                    background-color: #888 !important;
                    opacity: 0.5 !important;
                  }
                  .swiper-pagination-bullet-active {
                    background-color: #555 !important;
                    opacity: 1 !important;
                  }
                `,
                }}
              />
            </Swiper>
            )}
          </div>
          {/* 내용 및 포스팅 시간 */}
          <div className={`px-[0.5rem] py-[1rem]`}>
            {/* 제목 */}
            <div 
              className={`
                mb-[0.5rem]
                text-lg md:text-xl cursor-pointer break-all
              `}
              onClick={goBoardDetail}
            >
              {props.board.title}
            </div>
            {/* 내용 */}
            <div 
              className={`
                ${props.isDetail ? '' : 'line-clamp-3'}
                text-xl md:text-base
                cursor-pointer break-all
              `} 
              onClick={goBoardDetail}
            >
              {props.board.content}
            </div>
            <div 
              className={`
                my-[0.5rem]
              text-light-text-secondary
              dark:text-dark-text-secondary
                text-xs md:text-sm
              `}
            >
              {timeDifference}
            </div>
          </div>
        </div>
      </div>

      {/* 좋아요, 댓글, 북마크 아이콘 */}
      <div 
        className={`
          flex justify-between mb-[1rem]
          text-center
        `}
      >
        <div className={`relative w-1/3`}>
        {liked ? (
          <HeartIcon 
            onClick={dislike}
            className={`
              absolute left-1/2 size-[1.75rem]
              fill-light-heart stroke-light-heart
              dark:fill-dark-heart dark:stroke-dark-heart
              cursor-pointer
            `}
          />
        ) : (
          <HeartIcon 
            onClick={like}
            className={`
              absolute left-1/2 size-[1.75rem]
              fill-none stroke-light-border-icon
              dark:stroke-dark-border-icon
              cursor-pointer  
            `}
          />
        )}
          <div 
            className={`
              absolute left-[calc(50%+1.75rem)] top-[0.25rem] w-[3rem] mx-[0.5rem]
              text-start md:text-sm
            `}
          >
            {likeCount}
          </div>
        </div>
        <div className={`relative w-1/3`}>
          <CommentIcon 
            className={`
              absolute left-[45%] size-[1.75rem]
              cursor-pointer 
            `}
          />
          <div 
            className={`
              absolute left-[calc(45%+1.75rem)] top-[0.25rem] w-[3rem] mx-[0.5rem]
              text-start md:text-sm
            `}
          >
              3
          </div>
        </div>
        <div className={`w-1/3`}>
          {props.board.saved ? 
            (<BookmarkIcon
              className={`
                inline size-[1.75rem]
                stroke-light-border-icon
                dark:stroke-dark-border-icon
                cursor-pointer
              `}
            />) : (<BookmarkIcon
              className={`
                inline size-[1.75rem]
                fill-none stroke-light-border-icon
                dark:stroke-dark-border-icon
                cursor-pointer
              `}
            />)
          }
        </div>
      </div>
    </div>
  )
}

export default Board;