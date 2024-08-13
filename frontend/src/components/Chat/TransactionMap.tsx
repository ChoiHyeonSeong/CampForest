import React, { SetStateAction, useEffect, useState } from 'react';

type Props = {
  latitude: number;
  longitude: number;
};

let mapInstance: naver.maps.Map | null = null;
let infoWindow: naver.maps.InfoWindow | null = null;
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
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });
  };

  const initMap = () => {
    const mapOptions = {
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
      center: new naver.maps.LatLng(
        location ? location.latitude : latitude,
        location ? location.longitude : longitude,
      ),
      zoom: 15,
    };

    if (document.getElementById('map')) {
      mapInstance = new naver.maps.Map('map', mapOptions);

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(latitude, longitude),
        map: mapInstance,
      });

      // 클릭한 곳으로 마커랑 인포 윈도우 이동
      naver.maps.Event.addListener(mapInstance, 'click', (event) => {
        mapInstance?.setCenter(new naver.maps.LatLng(event.coord.y, event.coord.x));
        marker.setPosition(new naver.maps.LatLng(event.coord.y, event.coord.x));
        let contentString = `<div style='padding:10px;'>안녕하세요</div>`;

        naver.maps.Service.reverseGeocode(
          {
            coords: event.coord,
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
            if (mapInstance) {
              infoWindow?.open(mapInstance, marker);
            }
          },
        );
      });
    }
  };

  useEffect(() => {
    const { geolocation } = navigator;

    if (geolocation) {
      geolocation.getCurrentPosition(handleSuccess, null, options);
    }

    if (typeof naver === 'undefined' || !naver.maps) {
      loadScript(
        'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=52k7jcq0yh&callback=initMap&submodules=geocoder',
        initMap,
      );
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (location && mapInstance) {
      mapInstance.setCenter(new naver.maps.LatLng(location.latitude, location.longitude));
    }
  }, [location]);

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
          latitude={37.5666805}
          longitude={126.9784147}
        />
      </div>
    </div>
  );
};

export default TransactionMap;
