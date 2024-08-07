import React, { useEffect, useState, useCallback } from 'react'
import SearchBoard from '@components/Search/SerarchBoard'
import { BoardType } from '@components/Board/Board';
import { boardTitleSearch } from '@services/boardService';
import NoResultSearch from '@components/Search/NoResultSearch'

type Props = {
  searchText: string;
}

const SearchBoardList = (props: Props) => {
  const [boardList, setBoardList] = useState<BoardType[]>([]);

  const fetchBoardList = useCallback(async () => {
    if (props.searchText.length < 2) {
      setBoardList([]);
      return;
    }

    try {
      const result = await boardTitleSearch(props.searchText, 0, 10);
      if (result && Array.isArray(result)) {
        setBoardList(result);
      } else {
        setBoardList([]);
      }
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
  
  return (
    <div>
      <p className='font-medium text-lg md:text-xl'>
        커뮤니티
        <span className='ms-[0.5rem] font-bold'>
          {boardList.length}
        </span>
      </p>

      {/* 검색결과 출력 */}
      {boardList.length > 0 ? 
        boardList.map((board) =>
          <SearchBoard key={board.boardId} board={board}/>  
        ) :
        <NoResultSearch searchText={props.searchText} />
      }
    </div>
  )
}

export default SearchBoardList