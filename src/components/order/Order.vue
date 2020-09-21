<template>
  <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
          <el-row>
              <el-col :span="8">
                 <el-input placeholder="请输入内容">
                   <el-button slot="append" icon="el-icon-search"></el-button>
                 </el-input>
              </el-col>
          </el-row>
         <el-table :data="goodsOrderList" border stripe>
             <el-table-column type="index" label="#"></el-table-column>
             <el-table-column label="订单编号" prop="order_number"></el-table-column>
             <el-table-column label="订单价格" prop="order_price" width="100"></el-table-column>
             <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
             <el-table-column label="是否付款" width="100">
                 <template #default='scope'>
                    <el-tag v-if="scope.pay_status==='1'" type="success">已付款</el-tag>
                    <el-tag v-else type='danger'>未付款</el-tag>
                 </template>
             </el-table-column>
             <el-table-column label="下单时间">
                 <template #default='scope'>
                     {{scope.row.create_time|dataFormat}}
                 </template>
             </el-table-column>
             <el-table-column label="操作">
                 <template #default='scope'>
                     <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                     <el-button type="success" icon="el-icon-truck" size="mini" @click='showProgressBox'></el-button>
                 </template>
             </el-table-column>
         </el-table>
         <!-- 分页 -->
       <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!-- 展示修改地址的对话框 -->
           <el-dialog
            title="修改地址信息"
            :visible.sync="addressVisible"
            width="50%" @close='addressDialogClosed'>
             <el-form :model="addressForm" :rules="addressRules" ref="addressRef" label-width="100px    " label-position='left'>
                <el-form-item label="省市区/县:" prop="address1">
                     <el-cascader
                        v-model="addressForm.address1"
                        :options="cityData"
                        :props="{expandTrigger: 'hover'}"
                        @change="cityDatahandleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label='详细地址:' prop="address2">
                  <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
              </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addressVisible = false">取 消</el-button>
              <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 展示物流进度的对话框 -->
             <el-dialog
              title="物流进度"
              :visible.sync="progressVisible"
              width="50%">
                <el-timeline>
                    <el-timeline-item
                      v-for="(activity, index) in progressInfo"
                      :key="index"
                      :timestamp="activity.time">
                      {{activity.context    }}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
     name:'Order',
     data(){
         return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            goodsOrderList:[],
            addressVisible:false,
            addressForm:{
                address1:[],
                address2:''
            },
            addressRules:{
                address1:[
                    { required: true, message: '请输入省市区/县', trigger: 'change' }
                ],
                address2:[
                    { required: true, message: '详细地址', trigger: 'change' }
                ]
            },
            // 选择城市的数据信息
            cityData,
            progressVisible:false,
            progressInfo:[],
           }
        },
     created(){
         this.getOrderList()
     },
     mounted(){
         console.log(this.cityDataInfo);
     },
     methods:{
          async getOrderList(){
              const {data:res}=await this.$http.get('orders',{params:this.queryInfo})
              if(res.meta.status!==200){
                  return this.$message.error('获取订单列表失败!')
              }
              this.$message.success('获取订单列表成功!')
              this.total=res.data.total;
              this.goodsOrderList=res.data.goods
            //   console.log(res);
            console.log(this.total);
            console.log(this.goodsOrderList);
          },
          handleSizeChange(newSize){
              this.queryInfo.pagesize=newSize
               this.getOrderList()
          },
          handleCurrentChange(newNum){
              this.queryInfo.pagenum=newNum
              this.getOrderList()
          },
        //   展示修改地址的对话框
          showBox(){
            this.addressVisible=true
          },
          cityDatahandleChange(){
              console.log(this.addressForm.address1);
          },
          addressDialogClosed(){
              this.$refs.addressRef.resetFields();
          },
          async showProgressBox(){
              const {data:res}=await this.$http.get(`/kuaidi/804909574412544580`)
                   if(res.meta.status!==200){
                       return this.$message.error('请求物流信息错误!')
                   }
                   console.log(res);
                   this.progressInfo=res.data
                   console.log(this.progressInfo);
               this.progressVisible=true
          }
     }
}
</script>

<style lang='less' scoped>
.tab-column-center{
    text-align: center;
}
.el-cascader{
    width: 100%;
}
</style>