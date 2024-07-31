import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import ProfileTop from '@components/User/ProfileTop'
import MenuBar from '@components/User/MenuBar';
import FollowUsers from '@components/User/FollowUsers';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@store/modalSlice';
import { productList } from '@services/productService';
import ProductCard from '@components/Product/ProductCard';
import { boardUserList } from '@services/boardService';
import Board from '@components/Board/Board';
import UserReviewList from '@components/User/UserReviewList';

const UserPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('게시물');
  const [products, setProducts] = useState({ content: [], totalElements: 0 });
  const [boards, setBoards] = useState({ content: [], totalElements: 0 });
  const userId = Number(useParams().userId);

  const pageReload = () => {
  }

  async function fetchBoards() {
    try {
      const boardData = await boardUserList(userId);
      setBoards(boardData);
    } catch (error) {
      console.error("Failed to fetch boards: ", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  async function fetchProducts() {
    try {
      dispatch(setIsLoading(true));
      const productData = await productList({userId: userId});
      setProducts(productData);
    } catch (error) {
      console.error("Failed to fetch products: ", error);
    }
  }

  useEffect(() => {

    fetchProducts();
    fetchBoards();
  }, [])

  return (
    <div className='flex justify-center min-h-screen'>
      <div 
        onClick={() => setIsModalOpen(false)} 
        className={`${isModalOpen ? '' : 'hidden'} z-10 fixed md:items-center w-full h-full bg-black bg-opacity-70 flex`}>
        <div className="h-full md:min-h-[30rem] md:w-[40rem] md:h-[50%] md:mx-auto" onClick={(event) => event.stopPropagation()}>
          <FollowUsers isFollowing={isFollowing} setIsModalOpen={setIsModalOpen}/>
        </div>
      </div>
      <div className='bg-white md:p-6 w-full xl:w-[55rem] rounded-lg'>
        <h3 className='pb-[0.75rem] text-lg md:text-[1.5rem] hidden lg:block'>유저 프로필</h3>
        <ProfileTop userId={userId} setIsModalOpen={setIsModalOpen} setIsFollowing={setIsFollowing}/>
        <div>
          {/* 목록전환박스 */}
          <MenuBar boardCount={boards.totalElements} productCount={products?.totalElements} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}/>

          {/* 목록 */}
          <div className='w-full h-56'>
            {/* 게시물 목록 */}
            <div className={`${selectedMenu === '게시물' ? '' : 'hidden'} px-[4rem]`}>
            {boards?.content.map((board: any) => (
                <Board board={board} deleteFunction={pageReload} isDetail={false}/>
            ))}
            </div>
            {/* 판매/대여 목록 */}
            <div className={`${selectedMenu === '판매/대여' ? '' : 'hidden'} grid grid-cols-2 md:grid-cols-3`}>
              {products?.content.map((product: any) => (
                <ProductCard product={product}/>
              ))}
            </div>
            {/* 거래후기 목록 */}
            <div className={`${selectedMenu === '거래후기' ? '' : 'hidden'}`}>
              {/* {reveiw?.content.map((reveiw: any) => ( */}
                <UserReviewList />
              {/* ))} */}
      
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default UserPage;
