import React, { PureComponent, createRef } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Row, Col } from 'antd'
import { withI18n } from '@lingui/react'
import {
  Map,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

const Option = Select.Option;

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
@withI18n()
@Form.create()
class DeviceModal extends PureComponent {

  state = {
    position: { lat: 33.1172316, lng: 55.5597364 },
    zoom: 13,
    marker: {
      lat: 33.1172316,
      lng: 55.5597364
    },
    firstTime: true,
    draggable: true,
  }
  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item.id,
      }
      onOk(data)
    })
  }

  updatePosition = () => {
    const marker = this.refmarker.current
    if (marker != null) {
      this.setState({
        marker: marker.leafletElement.getLatLng(),
      })
    }
    this.props.form.setFieldsValue({
      lat: marker.leafletElement.getLatLng().lat,
      lng: marker.leafletElement.getLatLng().lng
    });
  }

  refmarker = createRef(Marker)

  toggleDraggable = () => {
    this.setState({ draggable: !this.state.draggable })
  }

  render() {
    const { item = {}, onOk, form, i18n, cities, branches, deviceTypes, ...modalProps } = this.props
    const { getFieldDecorator } = form
    const cityOptions = cities ? (cities.list.map(x => <Option key={x.id}>{x.name}</Option>)) : [];
    const branchOptions = branches ? (branches.list.map(x => <Option key={x.id}>{x.name}</Option>)) : [];
    const deviceTypeOptions = deviceTypes ? (deviceTypes.map(x => <Option key={x.id}>{x.nameFa}</Option>)) : [];

    if (item.lat && this.state.firstTime) {
      this.state.marker.lat = item.lat;
      this.state.marker.lng = item.lng;
    }
    this.state.firstTime = false;
    const markerPosition = [this.state.marker.lat, this.state.marker.lng]
    return (
      <Modal {...modalProps} onOk={this.handleOk} width={800} >
        <Form layout="horizontal">
          <Row gutter={8}>
            <Col span={12} >
              <FormItem label={i18n.t`Mac`} hasFeedback {...formItemLayout}>
                {getFieldDecorator('mac', {
                  initialValue: item.mac,
                  rules: [
                    {
                      required: true,
                      pattern: /^[0-9a-fA-F]{1,2}([\.:-])(?:[0-9a-fA-F]{1,2}\1){4}[0-9a-fA-F]{1,2}$/,
                      message: 'Mac Address format is invalid'
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label={i18n.t`Ip`} hasFeedback {...formItemLayout}>
                {getFieldDecorator('ip', {
                  initialValue: item.ip,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/,
                      message: 'No a valid ip address'
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label={i18n.t`City`} hasFeedback {...formItemLayout}>
                {getFieldDecorator('cityId', {
                  initialValue: item.cityId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a city"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {cityOptions}
                  </Select>
                )}
              </FormItem>
              <FormItem label={i18n.t`Branch`} hasFeedback {...formItemLayout}>
                {getFieldDecorator('branchId', {
                  initialValue: item.branchId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select branch"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {branchOptions}
                  </Select>
                )}
              </FormItem>
              <FormItem label={i18n.t`Type`} hasFeedback {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: item.type,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select device type"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {deviceTypeOptions}
                  </Select>
                )}
              </FormItem>
              <FormItem label={i18n.t`Code`} hasFeedback {...formItemLayout}>
                {getFieldDecorator('code', {
                  initialValue: item.code,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label={i18n.t`Name`} hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12} >
              <FormItem label={i18n.t`Lat`} hasFeedback {...formItemLayout}>
                {getFieldDecorator('lat', {
                  initialValue: item.lat,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input type="number" />)}
              </FormItem>
              <FormItem label={i18n.t`Lng`} hasFeedback {...formItemLayout} >
                {getFieldDecorator('lng', {
                  initialValue: item.lng,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input type="number" />)}
              </FormItem>
              <Map
                center={this.state.position}
                zoom={5}
              >
                <TileLayer
                  attribution=""
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />

                <Marker
                  draggable={this.state.draggable}
                  onDragend={this.updatePosition}
                  position={markerPosition}
                  ref={this.refmarker}>
                  <Popup minWidth={90}>
                    <span onClick={this.toggleDraggable}>
                      {this.state.draggable ? 'DRAG MARKER' : 'MARKER FIXED'}
                    </span>
                  </Popup>
                </Marker>
              </Map>
            </Col>
          </Row>


        </Form>
      </ Modal>
    )
  }
}

DeviceModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default DeviceModal
