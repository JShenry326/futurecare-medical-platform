import request from '../utils/request'

// 发送验证码
export const getCode = data => {
  return request.post('/get/code', data)
}

// 验证码验证
export const authentication = data => {
  return request.post('/user/authentication', data)
}

// 登录
export const login = data => {
  return request.post('/login', data)
}

// 账号管理
export const authAdmin = (params = {}) => {
  return request.get('/auth/admin', { params })
}
// 控制台接口
export const getControlData = (params = {}) => {
  return request.get('/report', { params })
}

// 获取头像
export const photoList = () => {
  return request.get('/photo/list')
}

// 陪护师
export const companion = data => {
  return request.post('/companion', data)
}

// 陪护师列表
export const companionList = params => {
  return request.get('/companion/list', { params })
}

// 删除陪护师
export const deleteCompanion = data => {
  return request.post('/delete/companion', data)
}

// 获取菜单权限
export const userGetMenu = () => {
  return request.get('/user/getmenu')
}

// 创建菜单权限
export const userSetmenu = data => {
  return request.post('/user/setmenu', data)
}

// 获取菜单列表数据
export const menuList = params => {
  return request.get('/menu/list', { params })
}

// 菜单权限下拉列表
export const menuSelectList = () => {
  return request.get('/menu/selectlist')
}

// 用户信息修改
export const updateAuth = data => {
  return request.post('/update/user', data)
}

// 订单列表

export const adminOrder = params => {
  return request.get('/admin/order', { params })
}

// 修改订单

export const updateOrder = data => {
  return request.post('/update/order', data)
}

// 菜单权限
export const menuPermissions = params => {
  return request.get('/menu/permissions', { params })
}
