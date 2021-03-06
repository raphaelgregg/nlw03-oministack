import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FiPlus, FiArrowRight} from "react-icons/fi";
import { Marker, Popup} from "react-leaflet";
import Map from '../components/Map';

import mapMarkerImg from "../images/map-marker.svg";
import mapIcon from "../utils/mapIcon";

import "../styles/pages/orphanages-map.css";
import api from "../services/api";

interface Orphanage {
    id:number;
    latitude: number;
    longitude: number;
    name: string;
}

function OrphanagesMap () {
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useEffect(() => {
        api.get('orphanages').then(response => {
            setOrphanages(response.data);
        })
    },[]);

    return(
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy"/>

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Pará</strong>
                    <strong>Belém</strong>
                </footer>
            </aside>

            <div></div>
            <Map>               
                {orphanages.map(orphanage => {
                    return(
                        <Marker 
                    icon={mapIcon}
                    position={[orphanage.latitude,orphanage.longitude]}
                    key={orphanage.id}
                >
                    <Popup 
                    closeButton={false} 
                    minWidth={240} 
                    maxWidth={240} 
                    className="map-popup">
                        {orphanage.name}
                        <Link to={`/orphanages/${orphanage.id}`}>
                            <FiArrowRight size={20} color="#FFF"/>
                        </Link>
                    </Popup>
                </Marker>
                    )
                })}
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>
        </div>
    );
}

export default OrphanagesMap;