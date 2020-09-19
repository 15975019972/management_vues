import { from } from 'core-js/fn/array'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login=()=>import('components/login.vue')
const Home=()=>import('components/home.vue')
const WelCome=()=>import('components/WelCome.vue')
const Users=()=>import('components/users/Users.vue')
const Roles=()=>import('components/power/Roles.vue')
const Rights=()=>import('components/power/Rights.vue')
const Cate=()=>import('components/goods/Cate.vue')


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
     component:Home,
     children:[
       {
         path:'',
         redirect: '/welcome'
       },
       {
         path:"/welcome",
         component:WelCome
       },
       {
         path:"/users",
         component:Users
       },{
         path:'/roles',
         component:Roles
       },{
         path:'/rights',
         component:Rights
       },{
         path:'/categories',
         component:Cate
       }
     ]
   }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL
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
