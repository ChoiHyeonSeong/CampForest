import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import { ReactComponent as EmojiIcon } from '@assets/icons/emoji-icon.svg'

type Props = {
  onAddComment: (comment: string) => void;
};

const CommentInput = (props: Props) => {
  const [comment, setComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleAddComment = () => {
    if (comment.trim()) {
      props.onAddComment(comment);
      setComment('');
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setComment(comment + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  return (
    <div className='flex flex-col items-start border-t border-gray-300 p-2'>
      <div className='flex items-center w-full'>
        <EmojiIcon 
          className='text-2xl me-2 size-6 cursor-pointer'
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        <input
          type='text'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='댓글 달기...'
          className='flex-1 px-2 py-1 outline-none focus:border-none border border-transparent rounded cursor-text'
        />
        <button onClick={handleAddComment} className='ml-2 text-blue-500'>
          게시
        </button>
      </div>
      {showEmojiPicker && (
        <div className='absolute top-0 z-10'>
          <Picker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default CommentInput;
