import { from } from 'core-js/fn/array'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login=()=>import('components/login.vue')
const Home=()=>import('components/home.vue')
const routes = [
  {
    path:'',
    redirect: '/login'
  },
   {
     path:'/login',
     component:Login
   },
   {
     path:'/home',
     component:Home
   }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂载裸导航守卫
router.beforeEach((to,from,next)=>{
    //to 将要访问的路径
    // from 代表从哪个路径跳转
    // next 是一个函数  表示放行
    // next()   放行   next('/login') 这里是要跳转的路径
    
    if(to.path==='/login') return next()

    const tokenStr=window.sessionStorage.getItem('token');

    if(!tokenStr) return next('/login')

    next();
})    
export default router
