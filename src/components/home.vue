<template>
<el-container class="home-container">
        <!-- header  -->
 <el-header>
     <div class="head-logo">
         <img src="~/assets/img/u=4273873158,1929030524&fm=26&gp=0.jpg" alt="">
         <span>电商管理系统</span>
     </div>
    <el-button type="info" @click.native="logOut">退出</el-button>
</el-header>
  <!-- contest -->
<el-container>
    <el-aside :width="showAside">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409BFF"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition='false' 
      :router="true" :default-active="showSvarState">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="(item,index) in menusList" :key="item.id">
        <template slot="title">
          <i :class="iconsList[index]"></i>
          <span>{{item.authName}}</span>
        </template>
    <el-menu-item :index="'/'+it.path" v-for="it in item.children" :key="it.id" @click="saveNavState">
      <template slot="title">
         <i class="el-icon-menu"></i>
         <span>{{it.authName}}</span>
     </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
     
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
    </el-container>   
 </el-container>
</template>

<script>
export default {
    name:'home',
    data(){
        return{
             menusList:[],
            //  图标遍历 可以是数组和object形式遍历
            iconsList:[
                'iconfont icon-yonghuguanli',
                'iconfont icon-quanxianguanli',
                'iconfont icon-shangpinguanli',
                'iconfont icon-dingdanguanli',
                'iconfont icon-shujutongji'
            ],
            isCollapse:false

        }
    },
    created(){
        this.getMenuList()
    },
    methods:{
        logOut(){
         window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        },
        // 获取所有的菜单
        async getMenuList(){
           const {data:res}=await this.$http.get('menus')
           if(res.meta.status!==200) return this.$message.error(res.meta.meg)
           this.menusList=res.data
           console.log(this.menusList);
           
        },
        // 点击按钮, 切换菜单的折叠与展开
        toggleCollapse(){
            console.log("111");
             this.isCollapse=!this.isCollapse
        },
        saveNavState(){
               window.sessionStorage.setItem('activePath',this.$route.path)
        }
    },
    computed:{
        showAside(){
            return !this.isCollapse?'200px':'64px'
        },
        showSvarState(){
            return window.sessionStorage.getItem('activePath')
        }   
    }

}
</script>

<style lang="less" scoped>
.el-header{
    padding-right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center ;
}
.head-logo{
    width: 400px;
    height: 100%;
    color: #fff;
    font-size: 20px;
    img{
         height: 100%;
       vertical-align: middle;
       border-radius: 100px;
    }
    span{
        margin-left: 15px;
    }
    
}
.home-container{
    height: 100%;
}
.el-header{
    background-color: #373D41;
}
.el-aside{
    background-color: #333744;
   .el-menu{
       border: 0;
      }
}
.el-main{
    background-color: #eaedf1;
}
.el-submenu{
    span{
        margin-left: 10px;
    } 
}
.toggle-button{
    height: 24px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    font-size: 10px;
    color: #fff;
    background: rgb(72, 81, 101);
    cursor: pointer;
}
</style>