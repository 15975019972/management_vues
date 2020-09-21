<template>
  <div>
      <!-- 面包屑导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>商品管理</el-breadcrumb-item>
           <el-breadcrumb-item>商品列表</el-breadcrumb-item>
         </el-breadcrumb>

         <!-- 卡片视图区域 -->
         <el-card>
            <el-row :gutter="20">
               <el-col :span="8"> 
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getGoodsList'>
                    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
               </el-col>
             <el-col :span="4">
                 <el-button type="primary" @click="goAddPage">添加商品</el-button>
             </el-col>
            </el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="85"></el-table-column>
                <el-table-column label="商品重量(kg)" prop="goods_weight" width="85"></el-table-column>
                <el-table-column label="商品创建时间" prop="add_time" width="120">
                    <template #default='scope'>
                        <!-- {{scope.row.add_time}} -->
                        {{scope.row.add_time|dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130">
                    <template #default='scope'>
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
             <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :current-page="queryInfo.pagenum"
                 :page-sizes="[5, 10, 15, 20]"
                 :page-size="queryInfo.pagesize"
                 layout="total, sizes, prev, pager, next, jumper"
                 :total="total" background>
             </el-pagination>
         </el-card>
  </div>
</template>

<script>
// import {formateDate} from 'assets/js/formatDate'
export default {
    name:'List',
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            // 商品列表
            goodsList:[],
            // 商品总数
            total:0
        }
    },
    created(){
       this.getGoodsList();
    },
    methods:{
        // 根据分页获取对应的商品列表
     async getGoodsList(){
         const {data:res}=await this.$http.get('goods',{params:this.queryInfo})
           if(res.meta.status!==200){
               return this.$message.error('获取商品数据失败!')
           }
           this.$message.success('获取商品数据成功')
           this.goodsList=res.data.goods
           this.total=res.data.total
        //    console.log(this.goodsList);
        //    console.log(this.total);
     },
         handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getGoodsList()
        },
        handleCurrentChange(newNum){
            this.queryInfo.pagenum=newNum
            this.getGoodsList();
        },
        async removeGoodsById(goods_id){
        const confirmData=await this.$confirm('此操作将永久删除该商品, 是否继续?', '删除商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
          if(confirmData!=='confirm'){
              return  this.$message.info('取消删除!')
          }
          const {data:res}=await this.$http.delete(`goods/${goods_id}`)
    res.meta.status!==200?this.$message.error('删除商品错误'):this.$message.success('删除商品成功')
         this.getGoodsList()
        },
        goAddPage(){
            this.$router.push('/goods/add')
        }
     },

}
</script>

<style lang="less" scoped>
.btnMl{
    margin-left: 15px;
}
</style>