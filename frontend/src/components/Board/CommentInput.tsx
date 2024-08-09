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
    <div 
      className={`
        flex flex-col items-start p-[0.5rem]
        border-light-border-1
        dark:border-dark-border-1
        border-t
      `}
    >
      <div className={`flex items-center w-full`}>
        <EmojiIcon 
          className={`
            size-[1.5rem] me-[0.5rem]
            text-2xl cursor-pointer
          `}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        <input
          type='text'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='댓글 달기...'
          className={`
            flex-1 px-[0.5rem] py-[0.25rem] 
            bg-light-white border-light-border
            dark:bg-dark-white dark:border-dark-border
            outline-none focus:border-none border border-transparent rounded cursor-text
          `}
        />
        <button 
          onClick={handleAddComment} 
          className={`
            mx-[0.5rem] 
            text-light-anchor
            dark:text-dark-anchor
          `}
        >
          게시
        </button>
      </div>
      {showEmojiPicker && (
        <div className={`absolute bottom-[3rem] z-[30]`}>
          <Picker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default CommentInput;
