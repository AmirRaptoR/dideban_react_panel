import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page, ScrollBar } from 'components'
import styles from './index.less'

const { Map: LeafletMap, TileLayer, Marker, Popup } = window.ReactLeaflet

@connect(({ app, dashboard, loading }) => ({
  avatar: app.user.avatar,
  username: app.user.username,
  dashboard,
  loading,
}))
class Map extends PureComponent {
  render() {
    return (
      <Page
        // loading={loading.models.dashboard && sales.length === 0}
        className={styles.dashboard}
      >
      <LeafletMap ></LeafletMap >
         
      </Page>
    )
  }
}

Map.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string,
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default Map
