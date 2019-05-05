import React, { createRef, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import {
  Map,
  TileLayer,
  Marker,
  Popup
  // PropTypes as MapPropTypes
} from "react-leaflet";


class MapView extends Component {
  state = {
    center: {
      lat: 51.505,
      lng: -0.09,
    },
    markers: [
    ],
    zoom: 13,
    draggable: true,

  }

  mapRef = createRef(Map);
 refmarker = createRef(Marker)


toggleDraggable = () => {
  this.setState({ draggable: !this.state.draggable })
}

updatePosition = () => {
  const marker = this.refmarker.current
  if (marker != null) {
    this.setState({
      marker: marker.leafletElement.getLatLng(),
    })
  }
}
  render() {
    const position = [this.state.center.lat, this.state.center.lng]
    // const markerPosition = [this.state.marker.lat, this.state.marker.lng]
    return (
      <Map center={position} zoom={this.state.zoom}
      >
      <TileLayer
        attribution=""
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
    {/* <Marker
          draggable={this.state.draggable}
          onDragend={this.updatePosition}
          position={markerPosition}
          ref={this.refmarker}>
          <Popup minWidth={90} keepInView={true}>
            <span onClick={this.toggleDraggable}>
              {this.state.draggable ? 'DRAG MARKER' : 'MARKER FIXED'}
            </span>
          </Popup>
        </Marker> */}
    </Map>
    )
  }
}


export default MapView
