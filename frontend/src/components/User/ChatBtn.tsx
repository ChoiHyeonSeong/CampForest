import React from 'react'

type Props = {
  handleChatButton: () => void;
}

const ChatBtn = ({ handleChatButton }: Props) => {

  return (
    <div 
      onClick={handleChatButton}
      className={`
        px-[0.75rem] md:px-[1rem] py-[0.25rem]
        bg-light-gray-1
        dark:bg-dark-gray-1
        rounded-md cursor-pointer text-[100%]
      `}
    >
      채팅
    </div>
  )
}

export default ChatBtn