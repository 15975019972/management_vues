<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="~/assets/logo.png" alt="">
      </div>
      <el-form ref='loginFormRef' label-width='10px' class="login_form" :model="login_form" :rules="loginFormRules">
        <!-- 用户名 -->
         <el-form-item prop='username'>
            <el-input prefix-icon="iconfont icon-yonghu" v-model="login_form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
       <el-form-item prop='password'>
           <el-input prefix-icon="iconfont icon-mima" v-model="login_form.password" type='password'></el-input>
      </el-form-item>

      <!-- 按钮区域 -->
       <el-form-item class="btns">
          <el-button type="primary" @click='login'>登陆</el-button>
          <el-button type="info" @click='resetForm'>重置按钮</el-button>
       </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
      name:"login",
      data(){
        return{
          login_form:{
            username:"admin",
            password:'123456'
          },
          loginFormRules:{
            // 验证用户名是否合法
             username:[
              { required: true, message: '请输入名称', trigger: 'blur' },
              { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
             ],
            //  验证密码是否合法
             password:[
                 { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
             ]
          }
        }
      },
      methods:{
        // 点击重置按钮
           resetForm(){
             console.log(this.$refs.loginFormRef.resetFields);
             this.$refs.loginFormRef.resetFields()
           },
           login(){
               this.$refs.loginFormRef.validate(async valid=>{
                     if(!valid)return;
                     let  {data:res}=await this.$http.post('login',this.login_form)
                      console.log(res);
                     if(res.meta.status!==200){
                       return this.$message.error('登陆失败')
                     }
                    this.$message.success('登陆成功')

                    // 1.将登陆成功之后 token 保存到客户端的sessionStorage中
                    // 1.2 项目中出了登录之外的其他API接口,必须在登陆之后才能访问
                    // 1.2  token 直应在当前网站打开期间生效 , 所有将token保存在sessionStorage中
                    // 2. 通过编程式导航跳转到后台主页,路由地址是/home
                    console.log(res);
                    window.sessionStorage.setItem('token',res.data.token)
                    this.$router.push('/home')
               })
           }
      }
}
</script>

<style lang="less" scoped>
  .login_container{
    background-color: rgb(68, 192, 137);
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    .avatar_box{
      overflow: hidden;
      height: 130px;
      width: 130px;
      border: 1px solid #ccc;
      border-radius: 50%;
      padding: 5px;
      box-shadow: 0 0 10px #ccc;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background: #fff;

      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
         background: #eee;

      }
    }
  }
 .btns{
   display: flex;
   justify-content: flex-end;
 }
 .login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>