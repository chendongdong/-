import Axios from 'axios'
// import { MessageBox } from 'mint-ui'
import { REQUEST_SUCCESS, baseURL } from '../utils/Constant'

const axios = Axios.create({
  baseURL: baseURL + '/ctm014ks/service/rs/ui/v1',
  timeout: 2000,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})
// console.log('VUE_APP_API_ROOT=', process.env.VUE_APP_API_ROOT)
// 相应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对错误进行统一处理
    if (response.data.code != REQUEST_SUCCESS) {
      // MessageBox.alert(response.data.msg)
      return Promise.reject(response)
    } else if (response.data.code == REQUEST_SUCCESS && response.config.successNotify) {
      // 弹出成功提示
      // MessageBox.alert(response.data.msg || 'success !')
    }
    return Promise.resolve({
      code: response.data.code,
      msg: response.data.msg,
      data: response.data.data
    })
  },
  function(error) {
    if (error.message.indexOf('timeout') > -1) {
      // 多语言需要自己在项目中配置
      // MessageBox.alert('请求超时，请重试！')
    }
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 请求拦截器
axios.interceptors.request.use(
  function(config) {
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

export default axios
