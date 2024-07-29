import { getboardlist } from '@services/boardService';
import React, { useEffect, useState } from 'react';
import Board from './Board';

const BoardList = () => {
  const [boards, setBoards] = useState<Board[]>();
  const fetchBoards = async () => {
    try {
      const result = await getboardlist(0, 10);
      console.log(result)
      console.log(123)
      setBoards(result.data.data.content);
    } catch (error) {
      console.error('게시글 불러오기 실패: ', error);
    }
  };

  // useEffect(() => {
  //   fetchBoards();
  // }, []);
  
  return (
    <div>
      <p onClick={fetchBoards}>테스트용버튼</p>
      {boards?.map((board) => (
        <Board key={board.boardId} board={board} />
      ))}
    </div>
  )
}

export default BoardList;