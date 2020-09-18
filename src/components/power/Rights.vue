<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
 <el-card>
     <el-table :data='rightsList' :border="true" :stripe='true'>
       <el-table-column type="index" label="#" ></el-table-column>
       <el-table-column label="名称" prop="authName" ></el-table-column>
       <el-table-column label="路径" prop="path" ></el-table-column>
       <el-table-column label="权限等级" prop="level" class="font-color">
          <template v-slot:default='scope'>
                <!-- {{scope.row.level}} -->
                <el-tag size="medium" v-if="scope.row.level==='0'" type="success">一级</el-tag>
                <el-tag size="medium" v-else-if="scope.row.level==='1'" type="info">二级</el-tag>
                <el-tag size="medium" v-else type="warning">三级</el-tag>
                <!-- <el-tag v-if="scope.row.level==='0'" size="medium">{{scope.row.level}}</el-tag> -->
                 <!-- <el-tag type="success" v-else-if="scope.row.level==='1'">{{scope.row.level}}</el-tag> -->
                 <!-- <el-tag type="info" v-else>{{scope.row.level}}</el-tag> -->
          </template>
       </el-table-column>
     </el-table>
 </el-card>
 <el-tag>标签一</el-tag>
  </div>
</template>

<script>
export default {
     name:"Rights",
     data(){
       return{
         rightsList:[]
       }
     },
     created(){
      //  获取所有的权限数据
       this.getRightList();
     },
     methods:{
       async getRightList(){
         const {data:res}=await this.$http.get(`rights/list`)
         if(res.meta.status!==200){
           return this,$message.error(res.meta.msg)
         }
         this.rightsList=res.data
         this.$message.success(res.meta.msg)
         console.log(this.rightsList);
       }
     }
}
</script>

<style lang="less" scoped>
.font-color{
  color: #ccc;
}
</style>