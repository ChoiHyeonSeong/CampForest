import React, { useEffect, useState } from 'react'
import SearchBoard from '@components/Search/SerarchBoard'
import { BoardType } from '@components/Board/Board';
import { boardTitleSearch } from '@services/boardService';

type Props = {}

const SearchBoardList = (props: Props) => {
  const [boardList, setBoardList] = useState<BoardType[]>([]);

  const fetchBoardList = async () => {
    const result = await boardTitleSearch('제목', 0, 10);
    setBoardList(result);
  }

  // useEffect
  // 1. 페이지가 로딩될 때
  // 2. [] 안에 있는 변수가 변할 때 (무한 루프 조심)
  useEffect(() => {
    fetchBoardList();
  }, [])
  
  return (
    <div>
      <p className='font-medium text-lg md:text-xl'>커뮤니티<span className='ms-[0.5rem] font-bold'>90</span></p>
      {boardList.map((board) => (
        <SearchBoard board={board}/>  
      ))}
      
    </div>
  )
}

export default SearchBoardList