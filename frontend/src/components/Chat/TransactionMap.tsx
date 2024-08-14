import React, { SetStateAction, useEffect, useState } from 'react';

type Props = {
  latitude: number;
  longitude: number;
};

let mapInstance: naver.maps.Map | null = null;
let infoWindow: naver.maps.InfoWindow | null = null;
let marker: naver.maps.Marker | null = null;
let address = '';

const loadScript = (src: string, callback: () => void) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.onload = () => callback();
  document.head.appendChild(script);
};

type MapInformationProps = {
  options: PositionOptions;
  latitude: number;
  longitude: number;
};

const MapInformation: React.FC<MapInformationProps> = ({ options, latitude, longitude }) => {
  const [isStart, setIsStart] = useState(false);

  const initMap = () => {
    const mapOptions = {
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
      center: new naver.maps.LatLng(
        latitude,
        longitude,
      ),
      zoom: 15,
    };

    if (document.getElementById('map')) {
      mapInstance = new naver.maps.Map('map', mapOptions);

      marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(latitude, longitude),
        map: mapInstance,
      });

      // 클릭한 곳으로 마커랑 인포 윈도우 이동
      naver.maps.Event.addListener(mapInstance, 'click', (event) => {
        
      });
    }
  };
  const handleStart = () => {
    setTimeout(() => {
      setIsStart(true);
    }, 3000);
  } 

  useEffect(() => {
    if (typeof naver === 'undefined' || !naver.maps) {
      loadScript(
        'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=52k7jcq0yh&callback=initMap&submodules=geocoder',
        initMap,
      );
    } else {
      initMap();
    }
    handleStart();
  }, []);

  useEffect(() => {
    if(isStart && marker) {
      console.log('지금 시작');
      mapInstance?.setCenter(new naver.maps.LatLng(latitude, longitude));
      marker.setPosition(new naver.maps.LatLng(latitude, longitude));
      let contentString = `<div style='padding:10px;'>안녕하세요</div>`;

      naver.maps.Service.reverseGeocode(
        {
          coords: new naver.maps.LatLng(latitude, longitude),
          orders: [
            naver.maps.Service.OrderType.LEGAL_CODE,
            naver.maps.Service.OrderType.ADDR,
          ].join(','),
        },
        function (status, response) {
          if (status === naver.maps.Service.Status.ERROR) {
            return alert('Something Wrong');
          }

          if(response.v2.results[0]) {
            address = `${response.v2.address.jibunAddress}`;
          } 
          else {
            address = `위치 정보가 없습니다.`
          }

          contentString = `<div style='padding:10px;'><div>${address}</div></div>`;
          
          infoWindow = new naver.maps.InfoWindow({
            content: contentString,
            disableAnchor: true,
            pixelOffset: new naver.maps.Point(0, -10),
          });
          if (mapInstance && marker) {
            infoWindow?.open(mapInstance, marker);
          }
        },
      );
    }
  }, [isStart])

  return (
    <div className={`w-full h-2/3`}>
      <div 
        id="map" 
        className={`h-full w-full`} 
      />
    </div>
  );
};

const TransactionMap: React.FC<Props> = ({ latitude, longitude }) => {
  const geolocationOptions = {
    enableHighAccuracy: true,
  };

  return (
    <div className={`w-full h-full`}>
      <div className={`w-full h-full`}>
        <MapInformation
          options={geolocationOptions}
          latitude={latitude}
          longitude={longitude}
        />
      </div>
    </div>
  );
};

export default TransactionMap;
