/* global document */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Trans, withI18n } from '@lingui/react'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Select } from 'antd'
import city from 'utils/city'

const { Search } = Input
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

@withI18n()
@Form.create()
class Filter extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (Object.keys(prevProps.filter).length === 0) {
      this.handleReset()
    }
  }
  handleFields = fields => {
    return fields
  }

  handleSubmit = () => {
    const { onFilterChange, form } = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    fields = this.handleFields(fields)
    onFilterChange(fields)
  }

  handleReset = () => {
    const { form } = this.props
    const { getFieldsValue, setFieldsValue } = form

    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    this.handleSubmit()
  }
  handleChange = (key, values) => {
    const { form, onFilterChange } = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    fields[key] = values
    fields = this.handleFields(fields)
    onFilterChange(fields)
  }

  render() {
    const { onAdd, filter, form, i18n } = this.props
    const { getFieldDecorator } = form
    const { deviceCode,deviceName,state,city,branch,deviceTypes,deviceGroups } = filter
    const { allDeviceTypes,allDeviceGroups } = this.props
    let deviceTypeOptions = []
    if(allDeviceTypes){
      for (let i = 0; i < allDeviceTypes.length; i++) {
          deviceTypeOptions.push(<Option key={allDeviceTypes[i].id}>{allDeviceTypes[i].nameFa}</Option>)
      }
    }

    let deviceGroupsOptions = []
    if(allDeviceGroups){
      for (let i = 0; i < allDeviceGroups.length; i++) {
        deviceGroupsOptions.push(<Option key={allDeviceGroups[i].id}>{allDeviceGroups[i].name}</Option>)
      }
    }

    let initialCreateTime = []
    if (filter.createTime && filter.createTime[0]) {
      initialCreateTime[0] = moment(filter.createTime[0])
    }
    if (filter.createTime && filter.createTime[1]) {
      initialCreateTime[1] = moment(filter.createTime[1])
    }

    return (
      <Row gutter={24}>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('deviceCode', { initialValue: deviceCode })(
            <Search
              placeholder={i18n.t`DeviceCode`}
              onSearch={this.handleSubmit}
            />
          )}
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('deviceName', { initialValue: deviceName })(
            <Search
              placeholder={i18n.t`DeviceName`}
              onSearch={this.handleSubmit}
            />
          )}
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('state', { initialValue: state })(
            <Search
              placeholder={i18n.t`State`}
              onSearch={this.handleSubmit}
            />
          )}
        </Col> <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('city', { initialValue: city })(
            <Search
              placeholder={i18n.t`City`}
              onSearch={this.handleSubmit}
            />
          )}
        </Col> <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('branch', { initialValue: branch })(
            <Search
              placeholder={i18n.t`Branch`}
              onSearch={this.handleSubmit}
            />
          )}
        </Col> <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('deviceTypes', { initialValue: deviceTypes })(
            <Select
              mode="tags"
              placeholder={i18n.t`Type`}
              onSearch={this.handleSubmit}
              style={{width:'100%'}}
            >
            {deviceTypeOptions}
            </Select>
          )}
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('deviceGroups', { initialValue: deviceGroups })(
          <Select
            mode="tags"
            placeholder={i18n.t`Type`}
            onSearch={this.handleSubmit}
            style={{width:'100%'}}
          >
          {deviceGroupsOptions}
          </Select>
        )}
      </Col>
        {/* <Col
          {...ColProps}
          xl={{ span: 4 }}
          md={{ span: 8 }}
          id="addressCascader"
        >
          {getFieldDecorator('address', { initialValue: address })(
            <Cascader
              style={{ width: '100%' }}
              options={city}
              placeholder={i18n.t`Please pick an address`}
              onChange={this.handleChange.bind(this, 'address')}
              getPopupContainer={() =>
                document.getElementById('addressCascader')
              }
            />
          )}
        </Col> */}
      
        <Col
          {...TwoColProps}
          xl={{ span: 10 }}
          md={{ span: 24 }}
          sm={{ span: 24 }}
        >
          <Row type="flex" align="middle" justify="space-between">
            <div>
              <Button
                type="primary"
                className="margin-right"
                onClick={this.handleSubmit}
              >
                <Trans>Search</Trans>
              </Button>
              <Button onClick={this.handleReset}>
                <Trans>Reset</Trans>
              </Button>
            </div>
            <Button type="ghost" onClick={onAdd}>
              <Trans>Create</Trans>
            </Button>
          </Row>
        </Col>
      </Row>
    )
  }
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Filter
