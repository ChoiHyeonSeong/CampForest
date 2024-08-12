import React, { SetStateAction, useEffect, useState } from 'react';

type Props = {
  isPersonal: boolean;
  openMap: (value: boolean) => void;
  handleLocation: (dongName: string) => void;
};

let mapInstance: naver.maps.Map | null = null;
let infoWindow: naver.maps.InfoWindow | null = null;
let dongName = '';

const loadScript = (src: string, callback: () => void) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.onload = () => callback();
  document.head.appendChild(script);
};

type MapInformationProps = {
  setChooseLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setButtonText: React.Dispatch<React.SetStateAction<string>>;
  options: PositionOptions;
  latitude: number;
  longitude: number;
};

const MapInformation: React.FC<MapInformationProps> = ({ setChooseLocation, setButtonText, options, latitude, longitude }) => {
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
            dongName = `${response.v2.results[0].region.area2.name} ${response.v2.results[0].region.area3.name}`;
            contentString = `<div style='padding:10px;'><div>${response.v2.results[0].region.area2.name} ${response.v2.results[0].region.area3.name}</div></div>`;
            infoWindow = new naver.maps.InfoWindow({
              content: contentString,
              disableAnchor: true,
              pixelOffset: new naver.maps.Point(0, -10),
            });
            if (mapInstance) {
              infoWindow?.open(mapInstance, marker);
            }
            setChooseLocation(true);
            setButtonText('선택 완료');
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
    <>
      <div className={`w-[25rem]`}>
        <div 
          id="map" 
          className={`h-[40rem] w-[25rem]`} 
        />
      </div>
    </>
  );
};

const ProductMap: React.FC<Props> = ({ handleLocation, openMap }) => {
  const geolocationOptions = {
    enableHighAccuracy: true,
  };

  const [chooseLocation, setChooseLocation] = useState(false);
  const [buttonText, setButtonText] = useState('장소를 선택해주세요.');

  const handleButtonClick = () => {
    handleLocation(dongName);
    openMap(false);
  };

  return (
    <div className={`relative`}>
      <div className={`w-[100%] h-[100%]`}>
        <MapInformation
          setChooseLocation={setChooseLocation}
          setButtonText={setButtonText}
          options={geolocationOptions}
          latitude={37.5666805}
          longitude={126.9784147}
        />
      </div>
      <div
        className={`
          ${chooseLocation ? 'bg-light-signature dark:bg-dark-signature hover:bottom-[0.9rem] hover:w-[92%] hover:py-[0.6rem]' : 'bg-light-gray dark:bg-dark-gray'} 
          fixed bottom-[1rem] left-1/2 z-[50] w-[90%] py-[0.5rem] 
          text-center text-white -translate-x-1/2 transition-all cursor-pointer
        `}
        onClick={() => handleButtonClick()}
      >
        {buttonText}
      </div>
    </div>
  );
};

export default ProductMap;
