import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Map,
  TileLayer,
  Marker,
  Popup
  // PropTypes as MapPropTypes
} from "react-leaflet";

class MapView extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  }
  render() {
    console.log(1)
    const center = [this.state.lat, this.state.lng];
    return (
      <Map center={center} zoom={this.state.zoom}>
      <TileLayer
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
    </Map>
    )
  }
}


export default MapView
