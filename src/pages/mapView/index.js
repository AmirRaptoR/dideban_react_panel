import React, { createRef, Component } from 'react'
import {
  Map,
  TileLayer,
  Marker,
  Popup
  // PropTypes as MapPropTypes
} from "react-leaflet";
import style from './index.less'
import Axios from 'axios';


class MapView extends Component {
  state = {
    center: { lat: 33.1172316, lng: 55.5597364 },
    zoom: 6,
    draggable: true,

  }

  render() {


    const position = [this.state.center.lat, this.state.center.lng]
    const markers = this.state.markers ? this.state.markers.map((x,i) =>
      <Marker key={i} position={[x.lat, x.lng]} >
          {!x.deviceId ? 
          <Popup minWidth={90} keepInView={true}>
          <span>
            {x.faults} / {x.total}
          </span>
        </Popup>
          :
          <Popup minWidth={90} keepInView={true}>
            <p>{x.deviceId}</p>
            <p style={ {color:x.color }}>{x.tooltip}</p>
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
	componentDidMount(){
		console.log(this)
		this.refreshMap();
	}
	
	onZoomChanged(event){
		this.setState({zoom:event.target._zoom})
		this.refreshMap();
	}

  refreshMap(){
		var self = this;
		var type = "None";
		if(this.state.zoom < 13){
			type = "City";
		}
		if(this.state.zoom < 9){
			type ="State"
		}
    Axios.get(`http://localhost:8080/map?level=${type}`,
    {
      headers:{
        token:window.localStorage.token
      }
    }).then(response=>{
      self.setState({
        markers:response.data
      })
    })

  }
}


export default MapView
