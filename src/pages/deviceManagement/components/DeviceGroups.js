import React, { PureComponent, createRef } from 'react'
import PropTypes from 'prop-types'
import { Form, Table, Modal, } from 'antd'
import { Trans, withI18n } from '@lingui/react'

@withI18n()
@Form.create()
class DeviceGroupsModal extends PureComponent {

  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        groups: this.props.groups
      }
      onOk(data)
    })
  }

  onSelectionChanged = (selectedRowKeys) => {
    for (var i = 0; i < this.props.groups.length; ++i) {
      this.props.groups[i].isInDevice = selectedRowKeys.indexOf(this.props.groups[i].id) >= 0;
    }
    this.setState({ selectedRowKeys });
  }

  render() {
    const { groups = [], onOk, form, i18n, cities, branches, deviceTypes, ...modalProps } = this.props
    const columns = [
      {
        title: <Trans>Name</Trans>,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: <Trans>HasResponsible</Trans>,
        dataIndex: 'hasResponsible',
        key: 'hasResponsible',
        render: (data) => {
          return data ? i18n.t`Has` : i18n.t`HasNot`
        }
      },
      {
        title: <Trans>Type</Trans>,
        dataIndex: 'type',
        key: 'type',
        render: (data) => {
          return i18n._(data)
        }
      },
      {
        title: <Trans>DeviceCount</Trans>,
        dataIndex: 'deviceCount',
        key: 'deviceCount',
      }
    ]

    const selectedRowKeys = groups.filter(x => x.isInDevice).map(x => x.id);

    return (
      <Modal {...modalProps} onOk={this.handleOk} width={800} >
        <Table
          dataSource={groups}
          bordered
          scroll={{ x: 1200 }}
          columns={columns}
          simple
          rowKey={record => record.id} و
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectionChanged
          }}
        />
      </ Modal>
    )
  }

}
DeviceGroupsModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default DeviceGroupsModal
