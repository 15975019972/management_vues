import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import 'assets/css/global.css'
import 'assets/css/font_2067899_gisc7zvt03v/iconfont.css'

//netword
import axios from 'axios'
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';
axios.defaults.timeout=5000
Vue.prototype.$http=axios

Vue.config.productionTip = false

  import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Main,
    Header,
    Footer,
    Menu,
    MenuItem,
    Submenu,
    Aside,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Col,
    Row,
    Table,
    TableColumn,
    Tooltip,
    Pagination,
    Switch,
    Dialog,
    MessageBox
  } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Footer)
Vue.use(Header)
Vue.use(Main)
Vue.use(Container);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu)
Vue.use(Aside)
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
