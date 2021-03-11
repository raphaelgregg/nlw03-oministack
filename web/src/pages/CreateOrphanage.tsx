import React, {ChangeEvent, FormEvent, useState} from "react";
import { useHistory } from "react-router-dom";
// import { Marker, useMapEvents} from 'react-leaflet';
import { Marker} from 'react-leaflet';
import Map from '../components/Map';
import {LeafletMouseEvent } from 'leaflet';

import { FiPlus } from "react-icons/fi";

import PrimaryButton from "../components/PrimaryButton";
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";

import api from "../services/api";

import '../styles/pages/create-orphanage.css';

export default function OrphanagesCreate() {
  const history = useHistory();

  const [position, setPosition] = useState({latitude: 0, longitude: 0});

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekend] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([])
  
  function handleMapClick(event: LeafletMouseEvent) {
    const {lat, lng} = event.latlng;
console.log(event.latlng);
    setPosition({
      latitude: lat,
      longitude:lng,
    });
  }
//   function HandleMapClick() {
//     const map = useMapEvents({
//       click: (e: LeafletMouseEvent) => {
//         // map.locate();
//         const { lat, lng } = e.latlng;
//         console.log(e.latlng);

//         setPosition({
//           latitude: lat,
//           longitude: lng,
//         });

//         map.flyTo(e.latlng, map.getZoom());
//       },
//       // locationfound(e) {}
//   });

//   return position === null ? null : (
//     <Marker
//       interactive={false}
//       icon={mapIcon}
//       position={[position.latitude, position.longitude]}
//     />
//   );
// }

  function handleSelectImages(event:ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }
    

    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagesPreview);

  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const {latitude, longitude} = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(image => {
    data.append('images', image);
    });

    await api.post('orphanages', data);

    alert('Cadastro realizado com sucesso!');

    history.push('/app');

    // console.log({
    //   latitude,
    //   longitude,
    //   name,
    //   about,
    //   instructions,
    //   opening_hours,
    //   open_on_weekends,
    //   images
    // })
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>
            
            <Map 
            style={{ width: '100%', height: 280 }}
            onclick={handleMapClick}
            >
              { position.latitude !== 0 &&  (
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[
                    position.latitude, 
                    position.longitude
                  ]} />)
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
              id="name" 
              value={name} 
              onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" 
              maxLength={300} 
              value={about} 
              onChange={event => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => {
                  return (
                    <img key={image} src={image} alt={name}/>
                  )
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" 
              value={instructions} 
              onChange={event => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input id="opening_hours" 
              value={opening_hours} 
              onChange={event => setOpeningHours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" 
                className={open_on_weekends ? "active" : ""}
                onClick={() => setOpenOnWeekend(true)}
                >
                  Sim
                  </button>
                <button 
                type="button"
                className={!open_on_weekends ? "active" : ""}
                onClick={() => setOpenOnWeekend(false)}
                >
                  Não
                  </button>
              </div>
            </div>
          </fieldset>

          <PrimaryButton type="submit">Confirmar</PrimaryButton>
        </form>
      </main>
    </div>
  );
}