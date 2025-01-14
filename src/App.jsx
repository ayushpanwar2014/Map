
import './App.css'
import Map, { Marker, Popup } from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useContext, useEffect, useState } from 'react';
import apiRequest from "./lib/apiRequest"
import { format } from "timeago.js";
import Login from "../src/Component/Login/login"
import Register from './Component/Register/register';


function App() {
  const myStorage = window.localStorage;
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"))

  
  const token = import.meta.env.VITE_APP_TOKEN;

  useEffect(() => {

    const getPins = async () => {

      try {

        const res = await apiRequest.get("/pin")
        setPins(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    getPins();

  }, [])


  const handleMarkerClick = (_id) => {
    setCurrentPlaceId(_id);
  };

  const handleAddClick = (e) => {

    const longitude = e.lngLat.lng;
    const latitude = e.lngLat.lat;

    setNewPlace({
      lat: latitude,
      long: longitude
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {

      const res = await apiRequest.post("/pin", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);

    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = async () => {
   await apiRequest.post('/user/logout');
    setCurrentUsername(null);
    myStorage.removeItem("user");
    window.location.reload();
  };

  return (

    <div className='app'>

      {currentUsername ? (
        <button className="button logout" onClick={handleLogout}>
          Log out
        </button>
      ) : (
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      )}


      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: 2.35,
          latitude: 48.86,
          zoom: 2
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}>

        {pins.map(p => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-20}
              offsetTop={-10}>
              <RoomIcon style={{ fontSize: "40px", color: p.username === currentUsername ? "tomato" : "slateblue", cursor: "pointer" }} onClick={() => handleMarkerClick(p._id)} />
            </Marker>


            {p._id === currentPlaceId && (

              <Popup style={{ marginLeft: 20 }} longitude={p.long} latitude={p.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)} >
                <div className='card'>
                  <label>Place</label>
                  <h4 className='place'>{p.title}</h4>
                  <label>Review</label>
                  <p className='desc'>{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<StarIcon className='star' />)}
                  </div>

                  <label>Informatioin</label>
                  <span className="username">Created by <b>{p.username}</b></span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}

        {newPlace &&

          (
            <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-20 }
              offsetTop={-10 }
              >
              <RoomIcon
                style={{
                  fontSize: "40px",
                  color: "tomato",
                  cursor: "pointer",
                }}
                />
            </Marker>
          
          
          <Popup style={{ marginLeft: 20 }} longitude={newPlace.long} latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input type="text" placeholder='Enter a title' onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea placeholder='Say us something about this place.' onChange={(e) => setDesc(e.target.value)} />
                <label>Rating</label>
                <select style={{ cursor: "pointer" }} onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className='submitButton' type='submit'>Add Pin</button>
              </form>
            </div>

          </Popup>
            </>
          )}
      </Map>
      {showLogin && <Login  myStorage={myStorage} setCurrentUsername={setCurrentUsername} setShowLogin={setShowLogin} />

      }

      {showRegister && <Register setShowRegister={setShowRegister} />}

    </div>
  )
}

export default App
