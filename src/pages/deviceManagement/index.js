import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'
import DeviceGroupModal from './components/DeviceGroups'

@withI18n()
@connect(({ device, loading }) => ({ device, loading }))
class DeviceManagement extends PureComponent {
  render() {
    const { location, dispatch, device, loading, i18n, groups } = this.props
    const { query, pathname } = location
    const {
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
      selectedRowKeys,
      allDeviceTypes,
      allDeviceGroups,
      cities,
      branches,
      modalName
    } = device
    const handleRefresh = newQuery => {
      router.push({
        pathname,
        search: stringify(
          {
            ...query,
            ...newQuery,
          },
          { arrayFormat: 'repeat' }
        ),
      })
    }
    const deviceGroupModalProps = {
      deviceGroups: [],
      allDeviceGroups: [],
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[`device/${modalType}`],
      title: i18n.t`DeviceDeviceGroups`,
      centered: true,
      groups: device.groups.list,
      deviceId: currentItem.id,
      onOk(data) {
        console.log("ok", data)
        dispatch({
          type: 'device/setDeviceDeviceGroups',
          payload: {
            id: data.id,
            data: data.groups.map(x => x.id)
          }
        }).then(() => {
          dispatch({
            type: 'device/hideModal',
          })
        })
      },
      onCancel() {
        dispatch({
          type: 'device/hideModal',
        })
      }
    }

    const modalProps = {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[`device/${modalType}`],
      title: `${
        modalType === 'create' ? i18n.t`CreateDevice` : i18n.t`UpdateDevice`
        }`,
      centered: true,
      cities,
      branches,
      deviceTypes: allDeviceTypes,
      onOk(data) {
        dispatch({
          type: `device/${modalType}`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'device/hideModal',
        })
      },
    }

    const listProps = {
      dispatch,
      dataSource: list,
      loading: loading.effects['device/query'],
      pagination,
      onChange(page) {
        handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onDeleteItem(id) {
        dispatch({
          type: 'device/delete',
          payload: id,
        }).then(() => {
          handleRefresh({
            page:
              list.length === 1 && pagination.current > 1
                ? pagination.current - 1
                : pagination.current,
          })
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'device/getDevice',
          payload: item.id
        }).then((device) => {
          dispatch({
            type: 'device/showModal',
            payload: {
              modalType: 'update',
              currentItem: device,
              modalName: 'device'
            },
          })
        })
      },
      onEditDeviceGroup(item) {
        dispatch({
          type: 'device/getDeviceDeviceGroups',
          payload: item.id
        }).then((groups) => {
          dispatch({
            type: 'device/showModal',
            payload: {
              modalType: 'update',
              currentItem: item,
              modalName: 'deviceGroups',
              groups
            },
          })
        })
      }
    }

    const filterProps = {
      allDeviceTypes,
      allDeviceGroups,
      filter: {
        ...query,
      },
      onFilterChange(value) {
        handleRefresh({
          ...value,
          page: 1,
        })
      },
      onAdd() {
        dispatch({
          type: 'device/showModal',
          payload: {
            modalType: 'create',
            modalName: 'device'
          },
        })
      },
    }

    const handleDeleteItems = () => {
      dispatch({
        type: 'device/multiDelete',
        payload: {
          ids: selectedRowKeys,
        },
      }).then(() => {
        handleRefresh({
          page:
            list.length === selectedRowKeys.length && pagination.current > 1
              ? pagination.current - 1
              : pagination.current,
        })
      })
    }
    return (
      <Page inner>
        <Filter {...filterProps} />
        {selectedRowKeys.length > 0 && (
          <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
            <Col>
              {`Selected ${selectedRowKeys.length} items `}
              <Popconfirm
                title="Are you sure delete these items?"
                placement="left"
                onConfirm={handleDeleteItems}
              >
                <Button type="primary" style={{ marginLeft: 8 }}>
                  Remove
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        )}
        <List {...listProps} />
        {(modalVisible && modalName == 'device') && <Modal {...modalProps} />}
        {(modalVisible && modalName == 'deviceGroups') && <DeviceGroupModal {...deviceGroupModalProps} />}
      </Page>
    )
  }
}

DeviceManagement.propTypes = {
  device: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default DeviceManagement
