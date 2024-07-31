import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ProfileModal = (props: Props) => {
  const { isOpen, onClose } = props;
  if (!isOpen) return null;

  return (
    <div className="absolute z-50 mt-2 w-64 bg-white rounded-lg shadow-lg">
      <div className="relative p-4">
        <button className="absolute top-2 right-2" onClick={onClose}>×</button>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
          <div className="text-lg mb-2">사용자닉네임</div>
          <Link to="/my-page" className="text-blue-500 mb-4">마이페이지 보기</Link>
          <button className="border rounded-lg px-4 py-2" onClick={onClose}>로그아웃</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
