import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import Link from 'umi/link'
import styles from './List.less'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n, onEditDeviceGroup } = this.props
    const entity = 'Device'

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: i18n.t`Are you sure you want to delete selected ${entity}?`,
        okText: i18n.t`Ok`,
        cancelText: i18n.t`Cancel`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    } else if (e.key === '3') {
      onEditDeviceGroup(record)
    }
  }

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
      {
        title: <Trans>Code</Trans>,
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: <Trans>Name</Trans>,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: <Trans>Type</Trans>,
        dataIndex: 'type_fa',
        key: 'type_fa',
      },
      {
        title: <Trans>Branch</Trans>,
        dataIndex: 'branch',
        key: 'branch',
      },
      {
        title: <Trans>City</Trans>,
        dataIndex: 'city',
        key: 'city',
      },
      {
        title: <Trans>Activeness</Trans>,
        dataIndex: 'active',
        key: 'active',
        render: text => <span>{text ? i18n.t`Active` : i18n.t`Deactive`}</span>,
      },
      {
        title: <Trans>Operation</Trans>,
        key: 'operation',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: i18n.t`Update` },
                { key: '2', name: i18n.t`Delete` },
                { key: '3', name: i18n.t`DeviceGroups` },
              ]}
            />
          )
        },
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
