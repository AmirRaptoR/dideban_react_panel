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
  getDeviceTypes:'/devices/types',
  getDeviceGroupes:'/devices/groups'
}
