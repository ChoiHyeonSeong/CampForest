import React, { useEffect, useState, useCallback, useRef } from 'react'
import SearchBoard from '@components/Search/SerarchBoard'
import { BoardType } from '@components/Board/Board';
import { boardTitleSearch } from '@services/boardService';
import NoResultSearch from '@components/Search/NoResultSearch'

import { useInView } from 'react-intersection-observer';

type Props = {
  searchText: string;
}

const SearchBoardList = (props: Props) => {
  const [boardList, setBoardList] = useState<BoardType[]>([]);
  const [boardCount, setBoardCount] = useState(0);

  const [ref, inView] = useInView();
  const [nextPageExist, setNextPageExist] = useState(true);

  const nextCursorRef = useRef<number | null>(null)

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

  return (
    <div>
      <p className='font-medium text-lg md:text-xl'>
        커뮤니티
        <span className='ms-[0.5rem] font-bold'>
          {boardCount}
        </span>
      </p>

      {/* 검색결과 출력 */}
      {boardList.length > 0 ? 
        boardList.map((board) =>
          <SearchBoard key={board.boardId} board={board}/>  
        ) :
        <NoResultSearch searchText={props.searchText} />
      }

    <div ref={ref} className={`${boardList.length >= 1 ? 'block' : 'hidden'} h-[0.25rem]`}></div>
    </div>
  )
}

export default SearchBoardList