import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import 'assets/css/global.css'
import './assets/css/font_h9yx6b813ma/iconfont.css'

//netword
import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';
axios.defaults.timeout=5000
Vue.prototype.$http=axios

Vue.config.productionTip = false

  import {
    Button,
    Form,
    FormItem,
    Input,
    Message
  } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message=Message

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
