<template>
  <div>
      <el-button type="info" @click.native="logOut">退出</el-button>
  </div>
</template>

<script>
export default {
    name:'home',
    methods:{
        logOut(){
         window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        }
    }

}
</script>

<style lang="less" scoped>

</style>