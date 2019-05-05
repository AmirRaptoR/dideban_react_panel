/* global window */
import modelExtend from 'dva-model-extend'
import {
  pathMatchRegexp
} from 'utils'
import api from 'api'
import {
  pageModel
} from 'utils/model'

var globalCities;
var globalBranches;

const {
  queryDeviceList,
  getDeviceTypes,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceGroupes,
  getAllCities,
  getAllBranches
} = api

export default modelExtend(pageModel, {
  namespace: 'device',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    groups: []
  },

  subscriptions: {
    setup({
      dispatch,
      history
    }) {
      history.listen(location => {
        if (pathMatchRegexp('/deviceManagement', location.pathname)) {
          const payload = location.query || {
            page: 1,
            pageSize: 10
          }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    * query({
      payload = {}
    }, {
      call,
      put
    }) {
      const types = (yield call(getDeviceTypes, payload)).data.list
      const groups = (yield call(getDeviceGroupes, payload)).data.list
      const data = yield call(queryDeviceList, payload)
      if (!globalCities) {
        globalCities = (yield call(getAllCities)).data;
      }
      if (!globalBranches) {
        globalBranches = (yield call(getAllBranches)).data;
      }
      const cities = globalCities;
      const branches = globalBranches;
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.dtoList,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.totalItemCount,
            },
            data: {
              allDeviceTypes: types,
              allDeviceGroups: groups,
              cities,
              branches
            }
          },
        })
      }
    },

    * delete({
      payload
    }, {
      call,
    }) {
      const data = yield call(deleteDevice, {
        id: payload
      })
    },

    * create({
      payload
    }, {
      call,
      put
    }) {
      const data = yield call(createUser, payload)
      if (data.success) {
        yield put({
          type: 'hideModal'
        })
      } else {
        throw data
      }
    },

    * update({
      payload
    }, {
      select,
      call,
      put
    }) {
      const id = yield select(({
        user
      }) => user.currentItem.id)
      const newUser = {
        ...payload,
        id
      }
      const data = yield call(updateUser, newUser)
      if (data.success) {
        yield put({
          type: 'hideModal'
        })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, {
      payload
    }) {
      return {
        ...state,
        ...payload,
        modalVisible: true
      }
    },

    hideModal(state) {
      return {
        ...state,
        modalVisible: false
      }
    },
  },
})
