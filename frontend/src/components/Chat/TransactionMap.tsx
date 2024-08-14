import React, { useEffect, useRef } from 'react'

type Props = {
  latitude: number;
  longitude: number;
  address: string;
}

const TransactionMap: React.FC<Props> = ( props ) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    if (mapElement.current && naver.maps) {
      const mapOptions = {
        center: new naver.maps.LatLng(props.latitude, props.longitude),
        zoom: 15
      };

      mapInstance.current = new naver.maps.Map(mapElement.current, mapOptions);

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(props.latitude, props.longitude),
        map: mapInstance.current,
      });

      const infoWindow = new naver.maps.InfoWindow({
        content: `<div style='padding:10px;'><div>${props.address}</div></div>`,
        disableAnchor: true,
        pixelOffset: new naver.maps.Point(0, -10),
      });

      infoWindow.open(mapInstance.current, marker);
    }
  }, [props.address, props.latitude, props.longitude]);

  return (
    <div ref={mapElement} className='w-full h-1/3 border rounded-lg mb-[1.5rem]' />
  );
}

export default TransactionMap;