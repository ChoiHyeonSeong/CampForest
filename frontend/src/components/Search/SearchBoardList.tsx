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
    const result = await boardTitleSearch(props.searchText, 0, 10);
    if (result && Array.isArray(result.content)) {
      // 정확히 일치하는 결과만 필터링
      const filteredResults = result.content.filter((board: BoardType) => 
        board.title.includes(props.searchText)
      );
      setBoardList(filteredResults);
    } else {
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
        <NoResultSearch />
      }
    </div>
  )
}

export default SearchBoardList