import React, { createRef, Component } from 'react'
import {
  Map,
  TileLayer,
  Marker,
  Popup
  // PropTypes as MapPropTypes
} from "react-leaflet";

import Leaflet from 'leaflet';
import style from './index.less'
import Axios from 'axios';
import { wsPrefix, apiPrefix } from '../../utils/config'


class MapView extends Component {
  state = {
    center: { lat: 33.1172316, lng: 55.5597364 },
    zoom: 6,
    draggable: true,

  }

  render() {



    const position = [this.state.center.lat, this.state.center.lng]
    const markers = this.state.markers ? this.state.markers.map((x, i) =>
      <Marker key={i} position={[x.lat, x.lng]} icon={Leaflet.divIcon({
        className: "my-custom-pin",
        iconAnchor: [0, 24],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${`
        background-color: ${x.color};
        color: white;
        font-size: 12px;
        font-weight: bold;
        width: 50px;
        height: 50px;
        display: block;
        text-align: center;
        padding-top: 10px;
        left: -25px;
        top: -25px;
        position: relative;
        border-radius: 50%;
        border: 1px solid #FFFFFF`}" >
        ${!x.deviceId ? x.tooltip + '<br/>' + x.faults + '/' + x.total : x.tooltip}
        </span>`
      })}>
        {!x.deviceId ?
          <Popup minWidth={90} keepInView={true}>
            <span style={{ color: x.color }}>
              <p>
                {x.tooltip}
              </p>
              <p>{x.faults} / {x.total}</p>
            </span>
          </Popup>
          :
          <Popup minWidth={90} keepInView={true}>
            <p>{x.deviceId}</p>
            <p style={{ color: x.color }}>{x.tooltip}</p>
          </Popup>
        }
      </Marker>) : [];
    return (
      <div>
        <button onClick={this.refreshMap.bind(this)}>{"refresh"}</button>

        <Map center={position} zoom={this.state.zoom} onZoom={this.onZoomChanged.bind(this)}>
          <TileLayer
            attribution=""
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
            {markers}
        </Map>
      </div>
    )
  }


  componentDidMount() {
    this.ws = new WebSocket(wsPrefix + "/mapNotify");
    var self = this;
    this.ws.onmessage = function (data) {
      console.log(data);
      self.refreshMap();
    }
    this.refreshMap();
  }

  componentWillUnmount() {
    this.ws.close();
  }

  onZoomChanged(event) {
    this.setState({ zoom: event.target._zoom })
    this.refreshMap();
  }

  refreshMap() {
    var self = this;
    var type = "None";
    if (this.state.zoom < 13) {
      type = "City";
    }
    if (this.state.zoom < 9) {
      type = "State"
    }
    if (this.cancelToken != null) {
      console.log("cancel prev requ")
      this.cancelToken.cancel();
    }
    this.cancelToken = Axios.CancelToken.source();
    Axios.get(`${apiPrefix}/map?level=${type}`,
      {
        headers: {
          token: window.localStorage.token
        },
        cancelToken: this.cancelToken.token
      }).then(response => {
        self.cancelToken = null;
        self.setState({
          markers: response.data
        })
      })

  }
}


export default MapView
