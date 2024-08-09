import React from 'react'
import Camping from './Camping';

type Props = {
  modalOpen: () => void;
}

const CampingList = (props: Props) => {
  return (
    <div className='bg-light-white dark:bg-dark-white'>
      <Camping modalOpen={props.modalOpen} />
      <Camping modalOpen={props.modalOpen} />
      <Camping modalOpen={props.modalOpen} />
      <Camping modalOpen={props.modalOpen} />
      <Camping modalOpen={props.modalOpen} />
    </div>
  )
}

export default CampingList;