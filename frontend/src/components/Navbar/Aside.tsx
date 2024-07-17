import React from 'react'

// icon import
import { ReactComponent as WriteIcon } from '@assets/icons/write.svg'
import { ReactComponent as TopBtnIcon } from '@assets/icons/top-btn.svg'

type Props = {}

const Aside = (props: Props) => {
  return (
    <aside className='fixed bottom-8 right-5'>
        <div className='w-11 h-11 bg-black mb-2 rounded-full flex flex-all-center hover:bg-[#FF6B00] duration-200'>
            <WriteIcon />
        </div>
        <div className='w-11 h-11 bg-black rounded-full flex flex-all-center hover:bg-[#FF6B00] duration-200'>
            <TopBtnIcon />
        </div>
    </aside>
  )
}

export default Aside