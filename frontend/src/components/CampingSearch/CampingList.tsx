import React from 'react'
import Camping from './Camping';

type Props = {
  modalOpen: () => void;
}

const CampingList = (props: Props) => {
  return (
    <div>
      <Camping modalOpen={props.modalOpen}/>
      <Camping modalOpen={props.modalOpen}/>
      <Camping modalOpen={props.modalOpen}/>
      <Camping modalOpen={props.modalOpen}/>
      <Camping modalOpen={props.modalOpen}/>
    </div>
  )
}

export default CampingList;