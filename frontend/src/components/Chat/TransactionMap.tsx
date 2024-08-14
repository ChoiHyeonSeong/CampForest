import React, { useEffect, useRef } from 'react'

type Props = {
  latitude: number;
  longitude: number;
}

const TransactionMap: React.FC<Props> = ( props ) => {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapElement.current && naver.maps) {
      const mapOptions = {
        center: new naver.maps.LatLng(props.latitude, props.longitude),
        zoom: 15
      };

      new naver.maps.Map(mapElement.current, mapOptions);
    }
  }, [props.latitude, props.longitude]);

  return (
    <div ref={mapElement} className='w-[40rem] h-[40rem]' />
  );
}

export default TransactionMap;