import React, { useState } from 'react';

type Props = {
  openMap: (value: boolean) => void;
}

let mapInstance: naver.maps.Map | null = null;

const loadScript = (src: string, callback: () => void) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.onload = () => callback();
  document.head.appendChild(script);
}

function MapInformation({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const [isMapLoaded, setMapLoaded] = useState(false);

  const initMap = () => {
    // 추가 옵션 설정
    const mapOptions = {
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
      center: new naver.maps.LatLng(latitude, longitude),
      zoom: 16,
    };

    // 지도 초기화 확인
    if (document.getElementById('map')) {
      mapInstance = new naver.maps.Map('map', mapOptions);
    }

    // Marker 생성
    if (mapInstance) {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(latitude, longitude),
        map: mapInstance,
      });
    }

    // Marker 클릭 시 지도 초기화
    // naver.maps.Event.addListener(marker, 'click', () => {
    //   mapInstance?.setCenter(new naver.maps.LatLng(latitude, longitude));
    //   mapInstance?.setZoom(16);
    // });

    setMapLoaded(true);
  }
}

const ProductMap = (props: Props) => {



  return (
    <div>
      {/* 네이버 지도 API */}
      <script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=52k7jcq0yh&callback=CALLBACK_FUNCTION"></script>

      <div id="map" className="w-[100%] h-[25rem];"></div>
      <div onClick={() => props.openMap(false)}>지도 닫기</div>
    </div>
  )
}

export default ProductMap;