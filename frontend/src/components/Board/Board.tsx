import React, { useState, useEffect } from 'react'
import { ReactComponent as HeartIcon } from '@assets/icons/heart.svg'
import { ReactComponent as BookmarkIcon } from '@assets/icons/bookmark.svg'
import { ReactComponent as CommentIcon} from '@assets/icons/comment.svg'
import { ReactComponent as LeftArrowIcon } from '@assets/icons/arrow-left.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/arrow-right.svg';
import { RootState } from '@store/store'
import { useSelector } from 'react-redux'
import MoreOptionsMenu from '@components/Public/MoreOptionsMenu'
import { Link } from 'react-router-dom'
import defaultProfileImage from '@assets/images/basic_profile.png'

import { boardDelete, boardLike, boardDislike, boardSave, deleteSave } from '@services/boardService';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { formatTime } from '@utils/formatTime';

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
  detailOpen? : (param: number) => void;
  updateComment: (boardId: number, commentCount: number) => void;
  updateLike: (boardId: number, isLiked: boolean, likedCount: number) => void;
  updateSaved: (boardId: number, isSaved: boolean) => void;
}

const Board = (props: Props) => {
  const user = useSelector((state: RootState) => state.userStore);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [timeDifference, setTimeDifference] = useState('');

  const deleteBoard = async () => {
    try {
      const result = await boardDelete(props.board.boardId)
      console.log(result)
      props.deleteFunction()
    } catch (error) {
      console.log(error)
    };
  };

  const handleDetailClick = () => {
    if (props.detailOpen) {
      props.detailOpen(props.board.boardId)
    }
  }

  const toggleLike = async () => {
    try {
      if (user.isLoggedIn) {
        if (props.board.liked) {
          // dislike
          const result = await boardDislike(props.board.boardId, user.userId)
          props.updateLike(props.board.boardId, false, result)
        } else {
          const result = await boardLike(props.board.boardId, user.userId)
          props.updateLike(props.board.boardId, true, result)
        }
      } else {
        alert("로그인 해주세요.")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const modifiedAt = props.board.createdAt; // 예: "2024-07-30T11:19:40" 형식의 시간 문자열
    const difference = formatTime(modifiedAt);
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
  
  const handleBookmark = async () => {
    try {
      if (user.isLoggedIn) {
        if (props.board.saved) {
          await deleteSave(props.board.boardId);
          props.updateSaved(props.board.boardId, false)
        } else {
          await boardSave(props.board.boardId);
          props.updateSaved(props.board.boardId, true)
        }
      } else {
        alert("로그인 해주세요.")
      }
    } catch (error) {
      console.error('북마크 취소 실패: ', error);
    }
  }
  
  return (
    <div 
      className={`
        flex flex-col w-full sm:min-w-[22rem] lg:h-full lg:px-[1rem]
        bg-light-bgbasic border-light-border bg-opacity-80
        dark:bg-dark-white dark:border-dark-border dark:bg-opacity-80
        border-b  sm:rounded-md
      `}
    >
      <div>
        {/* 포스팅 상단바 */}
        <div className={`flex justify-between h-[5rem] px-[0.5rem] py-[1rem]`}>
          <div className={`flex`}>
            <Link
              to={`/user/${props.board.userId}`}
              className={`
                flex items-center justify-center size-[2.75rem] md:size-[3rem]
                rounded-full shadow-md overflow-hidden
              `}
            >
              <img 
                src={props.board.userImage ? props.board.userImage : defaultProfileImage}
                alt=''
                className='w-full aspect-1'
              />
            </Link>
            <div className={`ms-[1rem]`}>
              <Link
                to={`/user/${props.board.userId}`} 
                className={`text-xl md:text-lg`}>{props.board.nickname}
              </Link>
              <div className={`md:text-sm`}>{props.board.category}</div>
            </div>
          </div>
          <MoreOptionsMenu 
            isUserPost={user.userId === props.board.userId} 
            updateFunction={() => console.log('test')}
            deleteFunction={deleteBoard} 
            deleteId={props.board.boardId}
          />
        </div>

        {/* 사진 및 내용 */}
        <div className={`w-full mb-[0.5rem]`}>
          {/* 사진 */}
          <div 
            className={`
              ${props.board.imageUrls.length > 0 ? 'bg-black' : 'hidden'}
              flex flex-all-center relative w-full max-w-full
              cursor-pointer overflow-hidden aspect-1
            `} 
            onClick={handleDetailClick}
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
          <div className={`px-[1rem] py-[1rem]`}>
            {/* 제목 */}
            <div 
              className={`
                mb-[0.5rem]
                text-lg md:text-xl cursor-pointer break-all
              `}
              onClick={handleDetailClick}
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
              onClick={handleDetailClick}
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
          flex items-center mb-[1rem] px-[1rem]
          text-center
        `}
      >
        <div>
          <div className={`flex items-center me-[1rem]`}>
            {props.board.liked ? (
              <HeartIcon 
                onClick={toggleLike}
                className={`
                  size-[1.5rem]
                  fill-light-heart stroke-light-heart
                  dark:fill-dark-heart dark:stroke-dark-heart
                  cursor-pointer
                `}
              />
            ) : (
              <HeartIcon 
                onClick={toggleLike}
                className={`
                  size-[1.5rem]
                  fill-none stroke-light-border-icon
                  dark:stroke-dark-border-icon
                  cursor-pointer  
                `}
              />
            )}
            <div 
              className={`
                mx-[0.5rem]
                text-start md:text-sm
              `}
            >
              {props.board.likeCount}
            </div>
          </div>
        </div>

        <div
          onClick={handleDetailClick}
          className='flex items-center'
        >
          <CommentIcon 
            className={`
              size-[1.25rem]
              cursor-pointer 
            `}
          />
          <div 
            className={`
              mx-[0.5rem]
              text-start md:text-sm
            `}
          >
              {props.board.commentCount}
          </div>
        </div>

        <div className='flex items-center ms-auto'>
          {props.board.saved ? 
            (<BookmarkIcon
              onClick={() => handleBookmark()}
              className={`
                inline size-[1.5rem]
                fill-light-border-icon
                dark:fill-dark-border-icon
                cursor-pointer
              `}
            />) : (<BookmarkIcon
              onClick={() => handleBookmark()}
              className={`
                inline size-[1.5rem]
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