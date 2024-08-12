import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { boardList, filteredBoardList } from '@services/boardService';
import Board, { BoardType } from '@components/Board/Board';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@store/modalSlice';
import BoardDetail from '@components/Board/BoardDetail';

const Community = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const category = params.category ?? 'all'
  const [ref, inView] = useInView();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [nextPageExist, setNextPageExist] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<BoardType | null>(null);
  const boardCursorIdRef = useRef<number | null>(null);
  const [visibleBoards, setVisibleBoards] = useState<number[]>([]);

  const fetchBoards = async () => {
    try {
      dispatch(setIsLoading(true))
      let response: any;
      if (category === 'all') {
        response = await boardList(boardCursorIdRef.current, 10);
      } else {
        response = await filteredBoardList(category, boardCursorIdRef.current, 10);
      }
      dispatch(setIsLoading(false))
      boardCursorIdRef.current = response.data.data.nextCursor
      if (!response.data.data.hasNext) {
        setNextPageExist(false);
      }
      setBoards((prevBoards) => [...prevBoards, ...response.data.data.content]);
    } catch (error) {
      dispatch(setIsLoading(false))
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  const pageReload = () => {
    boardCursorIdRef.current = null
    setBoards([]);
    setNextPageExist(true);

    fetchBoards()
  }

  useEffect(() => {
    pageReload()
  }, [category])

  useEffect(() => {
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청');
      fetchBoards();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [inView]);

  const detailClose = () => {
    setIsDetailOpen(false)
  }

  const detailOpen = (selectedId: number) => {
    const selected = boards.find(board => {
      return Number(board.boardId) === selectedId
    })
    console.log(selected)
    if (selected) {
      setSelectedDetail(selected)
      setIsDetailOpen(true)
    }
  }

  useEffect(() => {
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    if (isDetailOpen) {
      contentBox.classList.add('md:scrollbar-hide')
    } else {
      contentBox.classList.remove('md:scrollbar-hide')
    }
  }, [isDetailOpen])

  const updateComment = async (boardId: number, commentCount: number) => {
    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.boardId === boardId
          ? { ...board, commentCount: commentCount }
          : board
      )
    );
  }

  const updateLike = async (boardId: number, isLiked: boolean, likedCount: number) => {
    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.boardId === boardId
          ? { ...board, likeCount: likedCount, liked: isLiked } // 좋아요 수를 1 증가시킴
          : board
      )
    );
  };

  const updateSaved = async (boardId: number, isSaved: boolean) => {
    console.log(isSaved)
    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.boardId === boardId
          ? { ...board, saved: isSaved }
          : board
      )
    );
  }

  useEffect(() => {
    boards.forEach((board, index) => {
      setTimeout(() => {
        setVisibleBoards(prev => [...prev, board.boardId]);
      }, index * 100); // 각 게시물마다 100ms 지연
    });
  }, [boards])

  return (
    <div>
      {/* 디테일 모달 */}
      {
        isDetailOpen && selectedDetail !== null ? (
          <BoardDetail selectedBoard={selectedDetail} detailClose={detailClose} pageReload={pageReload} updateComment={updateComment} updateLike={updateLike} updateSaved={updateSaved}/>
        ) : (
          <></>
        )
      }

      {/* 본문 */}
      <div className={`flex justify-center`}>
        <div className={`w-[100%] md:w-[40rem]`}>
          <div
            className='
              h-[2rem] mt-[1rem]
              text-2xl
            '
          >
            {category === 'place' ? '캠핑장 후기' :
              category === 'equipment' ? '장비 후기' :
              category === 'recipe' ? '레시피 추천' :
              category === 'assign' ? '캠핑장 양도' :
              category === 'free' ? '자유 게시판' :
              category === 'question' ? '질문 게시판' : ''}
          </div>
          {boards?.map((board) => (
              <div 
                className={`my-[1.25rem] ${visibleBoards.includes(board.boardId) ? 'fade-in-down' : 'opacity-0'}`} 
                key={board.boardId}
              >
                <Board 
                  board={board} 
                  deleteFunction={pageReload} 
                  isDetail={false} 
                  detailOpen={detailOpen} 
                  updateComment={updateComment}
                  updateLike={updateLike} 
                  updateSaved={updateSaved}
                />
              </div>
            ))}
        </div>
      </div>

      {/* intersection observer */}
      <div ref={ref} className={`${boards.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
    </div>
  )
}

export default Community