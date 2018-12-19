import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"


const Map = withScriptjs(withGoogleMap((props) =>{
  // location={{lat: doctor.closestPractice.lat, lng: doctor.closestPractice.lon}}  
  return (
      <GoogleMap
        defaultZoom={14}
        center={ { lat:  props.lat, lng: props.long } }
        >
        <Marker
          position={{lat: props.lat, lng: props.long}}
        >
        </Marker>
      </GoogleMap>
    );
  }
))

export default Map;