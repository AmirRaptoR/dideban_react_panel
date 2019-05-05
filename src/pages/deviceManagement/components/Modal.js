import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'
const Option = Select.Option;
import api from 'api'
const {
  getAllCities,
  getAllBranches
} = api

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
class UserModal extends PureComponent {
  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      data.address = data.address.join(' ')
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, cities, branches, deviceTypes, ...modalProps } = this.props
    const { getFieldDecorator } = form
    const cityOptions = cities ? (cities.list.map(x => <Option key={x.id}>{x.name}</Option>)) : [];
    const branchOptions = branches ? (branches.list.map(x => <Option key={x.id}>{x.name}</Option>)) : [];
    const deviceTypeOptions = deviceTypes ? (deviceTypes.map(x => <Option key={x.id}>{x.nameFa}</Option>)) : [];
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label={i18n.t`Mac`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('mac', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  pattern : /^[0-9a-f]{1,2}([\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/,
                  message: 'Mac Address format is invalid'
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Ip`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('ip', {
              initialValue: item.nickName,
              rules: [
                {
                  required: true,
                  pattern : /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/,
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
        </Form>
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UserModal
