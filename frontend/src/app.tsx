import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Room, Star } from '@material-ui/icons'
import "./app.css"
import axios from "axios"
import Map, {
  Marker,
  Popup,

} from 'react-map-gl';

import Pin from './pin';

import CITIES from './data/cities.json';

const TOKEN = 'pk.eyJ1IjoibW91cmFqdW5pb3IxOSIsImEiOiJjbHZqbTlqajAwaG14MmlscTJpa3FrOTZsIn0.EjjK5PBEYxSEtviQVOJrOA';

export default function App() {
  const [pins, setPins] = useState([])
  const [popupInfo, setPopupInfo] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  // const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({
    latitude: -1.4558,
    longitude: -48.4902,
    zoom: 4,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // const pins = useMemo(
  //   () =>
  //     CITIES.map((city, index) => (
  //       <Marker
  //         key={`marker-${index}`}
  //         longitude={city.longitude}
  //         latitude={city.latitude}
  //         anchor="bottom"
  //         onClick={e => {
  //           // If we let the click event propagates to the map, it will immediately close the popup
  //           // with `closeOnClick: true`
  //           e.originalEvent.stopPropagation();
  //           setPopupInfo(city);
  //         }}
  //       >
  //         <Pin />
  //       </Marker>
  //     )),
  //   []
  // );
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8800/api/pin')
        // console.log(res.data)

        setPins(res.data)

      } catch (err) {
        console.log(err)
      }
    }
    getPins()
  }, [])

  const handleLogout = () => {
    // setCurrentUsername(null);
    // myStorage.removeItem("user");
  };

  return (
    <>
      <Map
        initialViewState={{
          latitude: -1.4558,
          longitude: -48.4902,
          zoom: 3.5,
          bearing: 0,
          pitch: 0
        }}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        mapboxAccessToken={TOKEN}
      >

        {pins.map(p=>(
        
          <Marker
          latitude={p.latitude}
          longitude={p.longitude}
          >
          <Room style={{fontSize: viewport.zoom * 7, color: "red"}}
          
          onClick={() => handleMarkerClick(p._id,p.latitude,p.longtitude)}
         >
          </Room>
          </Marker>
        )
        )}
        {/* {p._id === currentPlaceId} */}
        <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
          >
            <div className='card'>
              <label>Lugar</label>
              <h4 className='place'>{popupInfo.title}</h4>
              <label>Review</label>
              <p className='desc'>{popupInfo.desc}</p>
              <label>Rating</label>
              <div className='stars'></div>
              <Star className='star'></Star >
              <Star className='star'></Star >
              <Star className='star'></Star >
              <Star className='star'></Star >
              <Star className='star'></Star>
              <label>Descriptions</label>
              <span className='username'> Created By <b>{popupInfo.username}</b> </span>
              <span className='date'> 1 hour ago </span>
            </div>
            <img width="100%" src={popupInfo.image} />
          </Popup>
        {/* {popupInfo && ( */}
          
        {/* )} */}

      </Map>

    </>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
