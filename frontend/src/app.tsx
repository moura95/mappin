import * as React from 'react';
import {useState, useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import {Room, Star} from '@material-ui/icons'
import Map, {
  Marker,
  Popup,

} from 'react-map-gl';

import Pin from './pin';

import CITIES from './data/cities.json';

const TOKEN = 'pk.eyJ1IjoibW91cmFqdW5pb3IxOSIsImEiOiJjbHZqbTlqajAwaG14MmlscTJpa3FrOTZsIn0.EjjK5PBEYxSEtviQVOJrOA'; // Set your mapbox token here

export default function App() {
  const [popupInfo, setPopupInfo] = useState(null);

  const pins = useMemo(
    () =>
      CITIES.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <>
      <Map
        initialViewState={{
          latitude: -1.4558,
          longitude: -48.4902,
          zoom: 3.5,
          // bearing: 0,
          // pitch: 0
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={TOKEN}
      >
        {/* <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl /> */}

        {pins}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div className='card'>
              {/* {popupInfo.city}- {popupInfo.state} |{' '} */}
              <label>Lugar</label>
              <h4 className='place'>Tower Eiffel</h4>
              <label>Review</label>
              <p>Beautiful place</p>
              <label>Rating</label>
              <Star></Star>
              <Star></Star>
              <Star></Star>
              <Star></Star>
              <Star></Star>
              <label>Descriptions</label>
              <span className='username'> Created By <b>Moura</b> </span>
              <span className='date'> 1 hour ago </span>
            </div>
            <img width="100%" src={popupInfo.image} />
          </Popup>
        )}
      </Map>

    </>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
