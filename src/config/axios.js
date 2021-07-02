
import Axios  from 'axios'
import VueCookies from 'vue-cookies'
import router from '../router/index.js'
import { Message } from 'element-ui';
import {baseUrl} from './env'
// 添加请求拦截器
Axios.defaults.baseURL =baseUrl
Axios.interceptors.request.use(config=> {
  // 在发送请求之前做些什么
  config.headers.post['Access-Control-Allow-Origin'] = '*';
  config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//   if (VueCookies.get('token')) {
//     //用户登录完成之后 ，每次请求都携带请求头的token值，
//     config.headers.Authorization = "Bearer " +VueCookies.get('token')
//   }
  return config;
}, error=> {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 响应拦截器，对错误进行想要进行的处理
Axios.interceptors.response.use(response => { 

  if (response.data.code == 2103||response.data.code === '2129' || response.data.code === '2400') {
    Message.error(response.data.msg);
  
    // router.push({name:'Login'})
  }
 
//   if (response.data.code == 409) {
//    Message.error(response.data.message);
//     VueCookies.remove('token');
//     router.push({
//       path:"/login",
//     })
//   }
  return response;
}, err=> {
  console.log('err',err)
  return Promise.reject(err)
});
export function get(url, params){    
    return new Promise((resolve, reject) =>{        
      Axios.get(url, {            
            params: params        
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
      Axios.post(url, QS.stringify(params))
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data)
        })
    });
}
