import React, { useEffect } from 'react';
import { TransactionEntityType } from './Chat';

type Props = {
  latitude: number,
  longitude: number,
}

const TransactionMap = (props: Props) => {
  let map: naver.maps.Map | null = null;
  let infoWindow: naver.maps.InfoWindow | null = null;
  let dongName = '';

  const initMap = () => {
    const mapOptions = {
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
      center: new naver.maps.LatLng(
        props.latitude,
        props.longitude
      ),
      zoom: 15,
    };

    if (document.getElementById('map')) {
      map = new naver.maps.Map('map', mapOptions);

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(props.latitude, props.longitude),
        map: map
      })

      naver.maps.Event.addListener(map, 'click', (event) => {
        map?.setCenter(new naver.maps.LatLng(event.coord.y, event.coord.x));
        marker.setPosition(new naver.maps.LatLng(event.coord.y, event.coord.x));
        let contentString = '';

        naver.maps.Service.reverseGeocode(
          {
            coords: event.coord,
            orders: [
              naver.maps.Service.OrderType.LEGAL_CODE,
              naver.maps.Service.OrderType.ADDR,
            ].join(',')
          },
          function (status, response) {
            if (status === naver.maps.Service.Status.ERROR) {
              return alert(status);
            }
            dongName = `${response.v2.results[0].region.area2.name} ${response.v2.results[0].region.area3.name}`;
            contentString = `
              <div style='padding:10px;'>
                <div>
                  ${dongName}
                </div>
              </div>
            `
            infoWindow = new naver.maps.InfoWindow({
              content: contentString,
              disableAnchor: true,
              pixelOffset: new naver.maps.Point(0, -10)
            });
            if (map) {
              infoWindow?.open(map, marker);
            }
          },
        );
      });
    }
  };

  const loadScript = (src: string, callback: () => void) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = () => callback();
    document.head.appendChild(script);
  }

  useEffect(() => {
    if (typeof naver === 'undefined' || !naver.maps) {
      loadScript(
        'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=52k7jcq0yh&callback=initMap&submodules=geocoder',
        initMap,
      );
    }
    else {
      initMap();
    }
  }, []);

  return (
    <div className='w-[20rem]'>
      <div
        id='map'
        className='h-[20rem] w-[20rem]' 
      />
    </div>
  );
};

export default TransactionMap;