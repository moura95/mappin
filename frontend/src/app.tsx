import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Room, Star } from '@material-ui/icons'
import Register from "./components/Register";
import Login from "./components/Login";
// import { format } from "timeago.js";
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
  const myStorage = window.localStorage;
  const [pins, setPins] = useState([])
  const [popupInfo, setPopupInfo] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState("");
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

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      latitude: latitude,
      longitude: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      latitude: newPlace.latitude,
      longitude: newPlace.longitude,
    };
  }

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
    setCurrentUsername(null);
    myStorage.removeItem("user");
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
        onDblClick={currentUsername && handleAddClick}
      >

        {pins.map((p) => (
          <>
            <Marker
              latitude={p.latitude}
              longitude={p.longitude}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color:
                    currentUsername === p.username ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.latitude, p.longitude)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                latitude={p.latitude}
                longitude={p.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  {/* <span className="date">{format(p.createdAt)}</span> */}
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <>
            <Marker
              latitude={newPlace.latitude}
              longitude={newPlace.longitude}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              latitude={newPlace.latitude}
              longitude={newPlace.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}

      </Map>

    </>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
