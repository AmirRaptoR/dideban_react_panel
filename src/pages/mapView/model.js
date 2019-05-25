import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import api from 'api'
import { model } from 'utils/model'

const { queryDashboard, queryWeather } = api

export default modelExtend(model, {
  namespace: 'map',
  state: {
   
  },
  subscriptions: {

  },
  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(queryDashboard, parse(payload))
      yield put({
        type: 'updateState',
        payload: data,
      })
    }
    },
})
