/* global window */

import {
  router
} from 'utils'
import {
  stringify
} from 'qs'
import store from 'store'
import {
  ROLE_TYPE
} from 'utils/constant'
import {
  queryLayout,
  pathMatchRegexp
} from 'utils'
import {
  CANCEL_REQUEST_MESSAGE
} from 'utils/constant'
import api from 'api'
import config from 'config'

const {
  logoutUser,
  queryUserInfo
} = api

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    routeList: [{
        id: '1',
        icon: 'laptop',
        name: 'Dashboard',
        route: '/dashboard',
        breadcrumbParentId: null,
        menuParentId: null
      },
      {
        id: '2',
        icon: 'compass',
        name: 'Map',
        route: '/mapView',
        breadcrumbParentId: null,
        menuParentId: null
      },
      {
        id: '3',
        icon: 'desktop',
        name: 'Devices',
        route: null,
        breadcrumbParentId: null,
        menuParentId: null
      },
      {
        id: '31',
        icon: 'desktop',
        name: 'DeviceManagement',
        route: '/deviceManagement',
        breadcrumbParentId: '3',
        menuParentId: '3'
      }
    ],
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [{
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
  },
  subscriptions: {
    setupHistory({
      dispatch,
      history
    }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setupRequestCancel({
      history
    }) {
      history.listen(() => {
        const {
          cancelRequest = new Map()
        } = window

        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },

    setup({
      dispatch
    }) {
      dispatch({
        type: 'query'
      })
    },
  },
  effects: {
    * query({
      payload
    }, {
      call,
      put,
      select
    }) {
      let result = yield call(queryUserInfo, payload)
      // const { success,user }  yield call(queryUserInfo, payload)
      let success = result.success;
      let user = result.data;
      const {
        locationPathname
      } = yield select(_ => _.app)
      if (success && user) {
        const {
          permissions
        } = user

        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
          },
        })
        if (pathMatchRegexp(['/', '/login'], window.location.pathname)) {
          router.push({
            pathname: '/dashboard',
          })
        }
      } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        })
      }
    },

    * signOut({
      payload
    }, {
      call,
      put
    }) {
      const data = yield call(logoutUser)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            user: {},
            permissions: {
              visit: []
            },
            menu: [{
              id: '1',
              icon: 'laptop',
              name: 'Dashboard',
              zhName: '仪表盘',
              router: '/dashboard',
            }, ],
          },
        })
        yield put({
          type: 'query'
        })
      } else {
        throw data
      }
    },
  },
  reducers: {
    updateState(state, {
      payload
    }) {
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, {
      payload
    }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, {
      payload
    }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
  },
}
