<template>
  <div> 
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!--  卡片视图-->
      <el-card>
        <el-row>
             <el-col>
                 <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>
     <!-- 表格 -->
     <tree-table :data='cateList' :columns='columns' :selection-type='false' :expand-type='false' :show-index='true' index-text='#' border :show-row-hover='false' class="tree-table">
        <!-- 是否有效 -->
         <template #isOk='scope'>
             <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:lightgreen"></i>
             <i class="el-icon-error" v-else style="red"></i>
         </template>
         <template #order='scope'>
             <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
             <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
             <el-tag type="warning" size="mini" v-else>三级</el-tag>
         </template>
         <template #opt='scope'>
               <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditCate(scope.row.cat_id,scope.row.cat_name)">编辑</el-button>
               <el-button type="danger" size="mini" icon="el-icon-delete" @click='deleCateById(scope.row.cat_id)'>删除</el-button>
         </template>
     </tree-table>
     <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      </el-card>
    <el-dialog
        title="提示"
        :visible.sync="addCateDialogVisible"
        width="50%" @close='addCateDialogClose'>
        <!-- 添加分类的表单 -->
       <el-form :model="addCateForm" :rules="addCateFormRule" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称:" prop="cat_name">
           <el-input v-model="addCateForm.cat_name"></el-input>
           </el-form-item>

         <el-form-item label="父级分类:">
             <!-- 级联选择器 -->
             <!-- options是指定数据源 -->
             <!--props 用来指定配置对象 -->
         <el-cascader
                v-model="selectCateValue"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChange" 
                clearable>
            </el-cascader>
         </el-form-item>
         </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
     </el-dialog>
     <!-- 分类编辑页面 -->
     <el-dialog
        title="编辑分类"
        :visible.sync="showEditCateDialog"
        width="50%" @close='editCateClose'>
        <el-form :model="editCateForm" status-icon ref="editCateRef" label-width="100px" :rules="editFormrules">
           <el-form-item label="分类名称" prop="cat_name">
             <el-input type="text" v-model="editCateForm.cat_name" autocomplete="off"></el-input>
           </el-form-item>
       </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showEditCateDialog = false">取 消</el-button>
          <el-button type="primary" @click="commitEditCateInfo">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
      name:"Cate",
      data(){
          
          return{
            //   商品分类数据列表, 默认为空
            // 查询条件
              cateList:[],
              queryInfo:{
                  type:3,
                  pagenum:1,
                  pagesize:5
              },
              total:0,
            //   为table指定定列的定义
               columns:[
                   {
                   label:'分类名称',
                   prop:'cat_name'
                 },{
                    // 标题名字
                    label:"是否有效",
                    // 定义当前的模板
                    type:"template",
                    // 使用自定义模板
                    template:"isOk"
                 },{
                     label:'排序',
                     type:"template",
                     template:"order"
                 },{
                     label:"操作",
                     type:'template',
                     template:"opt"
                 }
               ],
            //    控制对话框分类对话框的显示和隐藏
               addCateDialogVisible:false,
            //    添加分类的分来名称
               addCateForm:{
                    cat_pid:0,
                    // 分类的id
                    cat_name:'',
                    cat_level:0
                    // 分类的等级 默认添加的分类是一级分类

               },
            //    添加分类表单规则的对象
               addCateFormRule:{
                   cat_name:[
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                   ]
               },
            //    父级分类的列表
               parentCateList:[],
               cascaderProps:{
                   value:'cat_id',
                   label:"cat_name",
                   children:'children',
                   expandTrigger: 'hover',
                   checkStrictly:true
               },
            //    选中的父级分类的数组
               selectCateValue:[],
            //    编辑分类相关
               showEditCateDialog:false,
               editCateForm:{
                   cat_name:'',
                   cat_id:''
               },
            //    edit验证规则
               editFormrules:{
                   cat_name:[
                     { required: true, message: '请输入分类名称', trigger: 'blur' }
                   ]
               }
               

          }
      },
      created(){
          this.getCateList();
      },
      methods:{ 
        //   获取商品分类数据
           async getCateList(){
              const {data:res}=await this.$http.get('categories',{params:this.queryInfo});
                if(res.meta.status!==200){
                    return this.$message.success("获取商品分类失败!")
                }
                // 商品总数
                this.cateList=res.data.result;
                // 数据总数
                this.total=res.data.total;
           },
        //    监听pagesize 的改变 (注：请求多少条数据)
           handleSizeChange(newSize){
            //    请求几条数据页面
               console.log(newSize);
               this.queryInfo.pagesize=newSize
               this.getCateList();
           },
        //    监听页面值的变化 pagenum的改变 (注： 请求页码)
           handleCurrentChange(newPage){
            //    分页状态的变化
               console.log(newPage);
               this.queryInfo.pagenum=newPage
               this.getCateList()
           },
           showAddCateDialog(){
            //   获取数据列表
               this.getParentCateList()
               console.log(this.parentsCateList);
            //    展示对话框
                this.addCateDialogVisible=true
           },
           async getParentCateList(){
               const {data:res}=await this.$http.get('categories',{params:{type:2}})
               if(res.meta.status!==200){
                   return this.$message.success('获取数据失败！')
               }
               this.parentCateList=res.data
               console.log(res.data);
           },
        //    选择项发生变化会触发这个函数  
           parentCateChange(){
            //    如selectCateValue 数组中的length大于0 证明选中父级分类
            //   父级分类的id
              if(this.selectCateValue.length>0){
                  this.addCateForm.cat_pid=this.selectCateValue[this.selectCateValue.length-1]
                  this.addCateForm.cat_level=this.selectCateValue.length
                  return
              }else{
                  this.addCateForm.cat_pid=0;
                  this.addCateForm.cat_level=0;
              }
            //   为当前分类的等级赋值
           },
        //    点击按钮, 添加新的分类
        addCate(){
            this.$refs.addCateFormRef.validate(async valid=>{
                // console.log(valid);
                if(!valid){
                    return
                }
                const {data:res}=await this.$http.post('categories',this.addCateForm)
                if(res.meta.status!==201){
                    return this.$message.error('创建分类失败!')
                }
                this.$message.success('创建分类成功!')
                this.getCateList();
                this.addCateDialogVisible=false
            })
           },
        //    监听对话框的关闭事件
        // 手动清空 联级对话框的数据
           addCateDialogClose(){
               this.$refs.addCateFormRef.resetFields()
               this.selectCateValue=[];
               this.addCateForm.cat_pid=0;
               this.addCateForm.cat_level=0;
            
           },
           showEditCate(cat_id,cat_name){
               this.editCateForm.cat_id=cat_id;
               this.editCateForm.cat_name=cat_name
               this.showEditCateDialog=true
           },
           commitEditCateInfo(){
                this.$refs.editCateRef.validate(async valid=>{
                    if(!valid){
                        return
                    }
                    console.log(this.editCateForm.cat_name);
                const {data:res}=await this.$http.put(`categories/${this.editCateForm.cat_id}`,{'cat_name':this.editCateForm.cat_name})
                    if(res.meta.status!==200){
                        return this.$message.error('分类名称更新失败')
                    }
                    this.$message.success('分类名称更新成功!')
                    this.getCateList();
                    this.showEditCateDialog=false
                    
                })
           },
        //    监听edit对话框关闭
        editCateClose(){
            this.$refs.editCateRef.resetFields()
        },
        // 根据id删除分类
        async deleCateById(id){
         const confirmCate=await this.$confirm('此操作将永久删除该分类, 是否继续?', '删除分类', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
           if(confirmCate!=='confirm'){
               return
           }
           const {data:res}=await this.$http.delete(`categories/${id}`)
           console.log(res);
           if(res.meta.status!==200){
               return  this.$message.error('删除分类失败!')
           }
           console.log(res);
           this.$message.success('删除分类成功!')
           this.getCateList();
        }
      }
}
</script>

<style lang="less" scoped>
.tree-table{
    margin: 15px;
}
.el-cascader{
    width: 100%;
}
</style>

