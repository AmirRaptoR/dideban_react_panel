export default {
  queryRouteList: '/auth/routes',

  queryUserInfo: '/users/current',
  logoutUser: '/user/logout',
  loginUser: 'POST /auth/login',

  queryUser: '/user/:id',
  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',

  queryDeviceList: '/devices',
  getDevice: '/devices/:id',
  getDeviceDeviceGroups: '/devices/:id/groups',
  setDeviceDeviceGroups: 'POST /devices/:id/groups',
  createDevice: 'POST /devices',
  updateDevice: 'POST /devices/:id',
  deleteDevice: 'DELETE /devices/:id',

  getDeviceTypes: '/devices/types',
  getDeviceGroups: '/devices/groups',

  getAllCities: '/cities',
  getAllBranches: '/branches'
}
