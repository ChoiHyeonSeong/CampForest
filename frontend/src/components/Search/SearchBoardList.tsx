import React, { useEffect, useState, useCallback, useRef } from 'react'
import SearchBoard from '@components/Search/SerarchBoard'
import { BoardType } from '@components/Board/Board';
import { boardTitleSearch } from '@services/boardService';
import NoResultSearch from '@components/Search/NoResultSearch'

import { useInView } from 'react-intersection-observer';

import BoardDetail from '@components/Board/BoardDetail';
import BoardModify from '@components/Board/BoardModify';

type Props = {
  searchText: string;
}

const SearchBoardList = (props: Props) => {
  const [boardList, setBoardList] = useState<BoardType[]>([]);
  const [boardCount, setBoardCount] = useState(0);

  const [ref, inView] = useInView();
  const [nextPageExist, setNextPageExist] = useState(true);

  const nextCursorRef = useRef<number | null>(null)

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isModifyOpen, setIsModyfyOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<BoardType | null>(null);
  const [selectedModifyId, setSelectedModifyId] = useState<number | null>(null);

  const fetchBoardList = useCallback(async () => {
    if (props.searchText.length < 2) {
      setBoardList([]);
      return;
    }

    try {
      const result = await boardTitleSearch(props.searchText, nextCursorRef.current, 10);
      console.log(result)
      setBoardList((prevBoards) => [...prevBoards, ...result.content]);
      setBoardCount(result.totalCount)

      if (!result.hasNext) {
        setNextPageExist(false)
      } 
      nextCursorRef.current = result.nextCursor
      
    } catch (error) {
      console.error("Error fetching board list:", error);
      setBoardList([]);
    }
  }, [props.searchText]);

  // useEffect
  // 1. 페이지가 로딩될 때
  // 2. [] 안에 있는 변수가 변할 때 (무한 루프 조심)
  useEffect(() => {
    fetchBoardList();
  }, [fetchBoardList]);
  
  useEffect(() => {
    if (inView && nextPageExist) {
      console.log(inView, '무한 스크롤 요청');
      fetchBoardList();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [inView]);



  // 보드 추가한 로직
  const pageReload = () => {
    nextCursorRef.current = null
    setBoardList([]);
    setNextPageExist(true);
    
    fetchBoardList()
  }

  const detailClose = () => {
    setIsDetailOpen(false)
  }

  const detailOpen = (selectedId: number) => {
    const selected = boardList.find(board => {
      return Number(board.boardId) === selectedId
    })
    if (selected) {
      setSelectedDetail(selected)
      setIsDetailOpen(true)
    }
  }

  const updateComment = async (boardId: number, commentCount: number) => {
    setBoardList(prevBoards =>
      prevBoards.map(board =>
        board.boardId === boardId
          ? { ...board, commentCount: commentCount}
          : board
      )
    );
  }

  const updateLike = async (boardId: number, isLiked: boolean, likedCount: number) => {
    setBoardList(prevBoards =>
      prevBoards.map(board =>
        board.boardId === boardId
          ? { ...board, likeCount: likedCount, liked: isLiked } // 좋아요 수를 1 증가시킴
          : board
      )
    );
  };

  const updateSaved = async (boardId: number, isSaved: boolean) => {
    setBoardList(prevBoards =>
      prevBoards.map(board =>
        board.boardId === boardId
          ? { ...board, saved: isSaved }
          : board
      )
    );
  }

  // 게시글 선택 시 detail 창 열기
  useEffect(() => {
    const selected = boardList.find(board => {
      return Number(board.boardId) === selectedDetail?.boardId
    })
    if (selected) {
      setSelectedDetail(selected)
    }
  }, [boardList])

  // Detail 창이 열리면 바깥 스크롤 바 숨김
  useEffect(() => {
    const contentBox = document.querySelector('#contentBox') as HTMLElement;
    if (isDetailOpen) {
      contentBox.classList.add('md:scrollbar-hide')
    } else {
      contentBox.classList.remove('md:scrollbar-hide')
    }
  }, [isDetailOpen])

  const handleModify = (boardId: number) => {
    setSelectedModifyId(boardId)
    setIsModyfyOpen(true)
  }

  const modifyClose = () => {
    setIsModyfyOpen(false)
  }

  return (
    <div>
      {/* 디테일 모달 */}
      {
        isDetailOpen && selectedDetail !== null ? (
          <BoardDetail selectedBoard={selectedDetail} detailClose={detailClose} pageReload={pageReload} updateComment={updateComment} updateLike={updateLike} updateSaved={updateSaved} modifyOpen={handleModify}/>
        ) : (
          <></>
        )
      }

      {/* 수정하기 모달 */}
      {
        isModifyOpen && selectedModifyId !== null ? (
          <BoardModify selectedModifyId={selectedModifyId} modifyClose={modifyClose} isModifyOpen={isModifyOpen}/>
        ) : (
          <></>
        )
      }


      <p className='font-medium text-lg md:text-xl'>
        커뮤니티
        <span className='ms-[0.5rem] font-bold'>
          {boardCount}
        </span>
      </p>

      {/* 검색결과 출력 */}
      {boardList.length > 0 ? 
        boardList.map((board) =>
          <SearchBoard key={board.boardId} board={board} detailOpen={detailOpen}/>  
        ) :
        <NoResultSearch searchText={props.searchText} />
      }

    <div ref={ref} className={`${boardList.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
    </div>
  )
}

export default SearchBoardList