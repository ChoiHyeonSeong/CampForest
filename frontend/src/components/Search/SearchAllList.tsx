import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchProfile, { profileType } from '@components/Search/SearchProfile'
import SearchBoard from '@components/Search/SerarchBoard'
import SearchProduct from '@components/Search/SearchProduct'
import { ReactComponent as ArrowRightIcon } from '@assets/icons/arrow-right.svg'
import { nicknameSearch, userPage } from '@services/userService'
import { boardTitleSearch } from '@services/boardService'
import { productList } from '@services/productService'
import { BoardType } from '@components/Board/Board';
import { ProductType } from '@components/Product/ProductCard';

import BoardDetail from '@components/Board/BoardDetail';
import BoardModify from '@components/Board/BoardModify';

type Props = {
  searchText: string;
}

const SearchAllList = (props: Props) => {
  const navigate = useNavigate();
  const [profileList, setProfileList] = useState<profileType[]>([]);
  const [productsList, setProductsList] = useState<ProductType[]>([]);
  const [boardList, setBoardList] = useState<BoardType[]>([]);
  const [totalProfileCount, setTotalProfileCount] = useState<number>(0);
  const [totalBoardCount, setTotalBoardCount] = useState<number>(0);
  const [totalProductCount, setTotalProductCount] = useState<number>(0);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isModifyOpen, setIsModyfyOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<BoardType | null>(null);
  const [selectedModifyId, setSelectedModifyId] = useState<number | null>(null);

  const fetchAllSearchResults = useCallback(async () => {
    if (props.searchText.length < 2) {
      setProfileList([]);
      setProductsList([]);
      setBoardList([]);
      return;
    }
    
    try {
      // 1. 프로필 검색
      const profileResult = await nicknameSearch(props.searchText, 0, 5);
      console.log(profileResult)
      if (profileResult.users) {
        setProfileList(profileResult.users);
      }
      if (profileResult.totalCount) {
        setTotalProfileCount(profileResult.totalCount);
      }

      // 2. 상품 검색
      const productResult = await productList({ 
        titleKeyword: props.searchText, 
        productType: '',
        cursorId: null,
        size: 5,
      });
      setProductsList(productResult.products);
      setTotalProductCount(productResult.totalCount);

      // 3. 게시글 검색
      const boardResult = await boardTitleSearch(props.searchText, null, 2);
      console.log(boardResult)
      setBoardList(boardResult.content);
      setTotalBoardCount(boardResult.totalCount);

    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, [props.searchText]);

  useEffect(() => {
    fetchAllSearchResults();
  }, [fetchAllSearchResults]);
  


  // 유저 추가한 로직 (좋아요 실시간 갱신)
  const renewalUser = async (userId: number) => {
    try {
      const response = await userPage(userId)
      setProfileList((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.userId === response.userId
            ? { ...profile, ...response } // response의 정보를 profile에 덮어씌움
            : profile // 조건이 맞지 않는 경우 기존의 profile 유지
        )
      );
    } catch (error) {
      console.log(error)
    }
  }


  // 보드 추가한 로직
  const pageReload = () => {
    fetchAllSearchResults()
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
    <>
      {/* 보드 디테일 모달 */}
      {
        isDetailOpen && selectedDetail !== null ? (
          <BoardDetail selectedBoard={selectedDetail} detailClose={detailClose} pageReload={pageReload} updateComment={updateComment} updateLike={updateLike} updateSaved={updateSaved} modifyOpen={handleModify}/>
        ) : (
          <></>
        )
      }

      {/* 보드 수정하기 모달 */}
      {
        isModifyOpen && selectedModifyId !== null ? (
          <BoardModify selectedModifyId={selectedModifyId} modifyClose={modifyClose} isModifyOpen={isModifyOpen}/>
        ) : (
          <></>
        )
      }


      {/* 프로필 */}
      <div className='mb-[3rem]'>
        <div className='flex justify-between mb-1'>
          <p className='mb-[1rem] font-bold text-lg '>
            프로필
            <span 
              className='
                ms-[0.5rem]
                font-bold
              '
            >
              {totalProfileCount}
            </span>
          </p>
          
          {/* 모두보기 -> 프로필 검색으로 이동 */}
          <div
            className='
            flex items-center
            cursor-pointer
            '
            onClick={() => navigate(`/search/profile?query=${encodeURIComponent(props.searchText)}`)}
          >
            <button
              className='
                text-light-text-secondary
                dark:text-dark-text-secondary
                text-[0.9rem]
              '
            >
              모두보기       
            </button>
            <ArrowRightIcon
              className='
                size-[1.1rem]
                fill-light-border-icon
                dark:fill-dark-border-icon
              '
            /> 
          </div>
        </div>
        <div>
          {profileList.map((profile) => (
              <SearchProfile key={profile.userId} profile={profile} callbackFunction={renewalUser}/>  
            ))
          }
        </div>
      </div>

      {/* 판매/대여 */}
      <div className='mb-[3rem]'>
      <div className='flex justify-between mb-1'>
          <p className='font-bold text-lg '>
            장비거래
            <span 
              className='
                ms-[0.5rem]
                font-bold
              '
            >
              {totalProductCount}
            </span>
          </p>
          
          {/* 모두보기 -> 장비거래 검색으로 이동 */}
          <div
            className='
            flex items-center
            cursor-pointer
            '
            onClick={() => navigate(`/search/product?query=${encodeURIComponent(props.searchText)}`)}
          >
            <button
              className='
                text-light-text-secondary
                dark:text-dark-text-secondary
                text-[0.9rem]
              '
            >
              모두보기       
            </button>
            <ArrowRightIcon
              className='
                size-[1.1rem]
                fill-light-border-icon
                dark:fill-dark-border-icon
              '
            /> 
          </div>
          
        </div>
        <div>
          <SearchProduct product={productsList} />
        </div>
      </div>


      {/* 커뮤니티 */}
      <div className='mb-[3rem]'>
      <div className='flex justify-between mb-1'>
          <p className='mb-[1rem] font-bold text-lg '>
            커뮤니티
            <span 
              className='
                ms-[0.5rem]
                font-bold
              '
            >
              {totalBoardCount}
            </span>
          </p>
          
          {/* 모두보기 -> 커뮤니티검색으로 이동 */}
          <div
            className='
            flex items-center
            cursor-pointer
            '
            onClick={() => navigate(`/search/board?query=${encodeURIComponent(props.searchText)}`)}
          >
            <button
              className='
                text-light-text-secondary
                dark:text-dark-text-secondary
                text-[0.9rem]
              '
            >
              모두보기       
            </button>
            <ArrowRightIcon
              className='
                size-[1.1rem]
                fill-light-border-icon
                dark:fill-dark-border-icon
              '
            /> 
          </div>
          
        </div>
        <div className=''>
          {boardList.map((board, index) =>
              <SearchBoard key={index} board={board} detailOpen={detailOpen}/>  
            )
          }
        </div>
      </div>
    </>
  )
}

export default SearchAllList