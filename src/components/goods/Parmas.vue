<template>
  <div>
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 警告视图 -->
      <el-alert
         title="注意:只允许为第三级分类设置相关参数!"
         type="warning" 
         :show-icon='true' :closable='false'>
       </el-alert>
       <!-- 选择商品分类区域 -->
       <el-row class="cat_opt">
           <el-col>
               <span>选择商品分类：</span>
               <!-- 选择商品的级联分配的商品框 -->
             <el-cascader
                v-model="selectCateKey"
                :options="allCateList"
                :props="CateAscaderOpt"
                 @change='cascaderCateKkeyChang'>
            </el-cascader>
           </el-col>
       </el-row>
     <el-tabs v-model="activeName" @tab-click="handleTabClick">
         <!-- 添加动态参数的面板 -->
          <el-tab-pane label="动态参数" name="many">
              <!-- 添加参数的按钮 -->
              <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click="showAddDialog">添加参数</el-button>
                <!-- 动态数据表格 -->
               <el-table :data="manyTabData" border stripe>
                   <!-- 展开行 -->
                   <el-table-column type="expand">
              <template #default='scope'>
                        <!-- 循环渲染标签 -->
                    <el-tag v-for="(item,index) of scope.row.attr_vals" @close='handleClose(index,scope.row)' :key="item.attr_id" closable>{{item}}</el-tag>
                 <!-- 输入文本框 -->
                  <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="mini"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 添加按钮 -->
                   <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                   </el-table-column>
                   <!-- index行 -->
                   <el-table-column type="index"></el-table-column>
                   <!-- 操作行 -->
                   <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template #default='scope'>
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParmasById(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
               </el-table>
          </el-tab-pane>
          <!-- 添加静态属性的面板 -->
          <el-tab-pane label="静态属性" name="only">
              <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click="showAddDialog">添加属性</el-button>
                <!-- 动态数据表格 -->
                <el-table :data="onlyTabData" border stripe>
                    <!-- 展开行 -->
                    <el-table-column type="expand">
                        <template #default='scope'>
                            <!-- 循环渲染标签 -->
                        <el-tag v-for="(item,index) in scope.row.attr_vals" @close='handleClose(index,scope.row)' :key="item.attr_id" closable>{{item}}</el-tag>
                     <!-- 输入文本框 -->
                      <el-input
                          class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="mini"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <!-- 添加按钮 -->
                       <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <!-- index行 -->
                    <el-table-column type="index"></el-table-column>
                    <!-- 操作行 -->
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                     <el-table-column label="操作">
                         <template #default='scope'>
                             <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                             <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteParmasById(scope.row.attr_id)">删除</el-button>
                         </template>
                     </el-table-column>
                </el-table>
          </el-tab-pane>
        </el-tabs>
     </el-card>
     <!-- 添加参数对话框 -->
     <el-dialog
          :title="'添加'+titleText"
          :visible.sync="addDialogVisible"
          width="50%" @close='addDialogClose'>
     <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
         <el-input v-model="addForm.attr_name"></el-input>
         </el-form-item>
    </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
          </span>
      </el-dialog>

      <!-- 修改参数对话框 -->

       <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%" @close='editDialogClose'>
 <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="100px">
    <el-form-item :label="titleText" prop="attr_name">
     <el-input v-model="editForm.attr_name"></el-input>
     </el-form-item>
</el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
    name:"Parmas",
    data(){
        return{
            allCateList:[],
            selectCateKey:[],
            CateAscaderOpt:{
                value:'cat_id',
                label:'cat_name',
                children:"children",
                expandTrigger:'hover',
            },
            activeName:'many',
            // 动态参数的数据
            manyTabData:[],
            // 静态参数的数据
            onlyTabData:[],
            addDialogVisible:false,
            // 添加参数的表单对象
            addForm:{
               attr_name:'',
            },
            addFormRules:{
                attr_name:[
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                ]
            },
            // 修改dialog相关数据
            editDialogVisible:false,
            editForm:{
                attr_name:'',
                attr_id:''
             },
             editFormRules:{
                  attr_name:[
                      { required: true, message: '请输入修改内容', trigger: 'blur' },
                  ]
              },   
        }
    },
    created(){
        this.getCateList();
    },
    methods:{
        // 获取商品所有的列表
        async getCateList(){
            const {data:res}=await this.$http.get('categories');
             console.log(res);
             if(res.meta.status!==200){
                 return this.$message.error('获取商品分类列表失败!')
             }
             this.allCateList=res.data
            //  console.log(this.allCateList);
        },
        // 级联选择框中项变化, 会触发这个函数
        cascaderCateKkeyChang(){
            // 证明选择的不是三级分类
              this.getActiveCateData()
        },
        // tab 点击处理的函数
        handleTabClick(){
            this.getActiveCateData()
             console.log(this.activeName);
        },
        // 获取静态或动态的数据
        async getActiveCateData(){
         if(this.selectCateKey.length!==3){
              this.selectCateKey=[];
              this.manyTabData=[];
              this.onlyTabData=[];
              return
           }
           // 证明选中是三级分类
           console.log(this.selectCateKey);
           // 根据所选分类的id，和当前所处的面板,获取对应的参数
      const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
         if(res.meta.status!==200){
             return this.$message.error('获取参数列表失败!')
         }
           res.data.forEach(item=>{
             item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
             item.inputVisible=false;
             item.inputValue=''
         })
            if(this.activeName==='many'){
                this.manyTabData=res.data
            }else{
                this.onlyTabData=res.data
            }
         console.log(res.data);
        },
        showAddDialog(){
            this.addDialogVisible=true
        },
        // 监听添加对话框的关闭按钮
        addDialogClose(){
            this.$refs.addFormRef.resetFields();
        },
        addParams(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    return 
                }
                const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName})
                 if(res.meta.status!==201){
                     return this.$message.error(this.titleText+'创建失败!')
                 }
                 this.$message.success(this.titleText+'创建成功!')

                this.getActiveCateData()
                 this.addDialogVisible=false;
                console.log(res);
            })
        },
        // 点击按钮修改对话框
        async showEditDialog(attr_id){
            this.editForm.attr_id=attr_id
            // 查询当前参数的信息
            console.log(attr_id);
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.active}})
             console.log(res);
             if(res.meta.status!==200){
                  return this.$message.error('查询参数信息失败！')
              }
              this.editForm.attr_name=res.data.attr_name

           this.editDialogVisible=true
            
        },
        editDialogClose(){
          this.$refs.editFormRef.resetFields();
      },
    //   点击按钮修改参数信息
      editParams(){
         this.$refs.editFormRef.validate(async valid=>{
             if(!valid){
                 return
             }
             const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{'attr_name':this.editForm.attr_name,'attr_sel':this.activeName})
               if(res.meta.status!==200){
                   return this.$message.error('编辑参数更新失败!')
               }
               this.$message.success('更新参数成功!')
               this.editDialogVisible=false;
               this.getActiveCateData();
        })
      },
       async deleteParmasById(attr_id){
           console.log(attr_id);
           const confirmRes=await this.$confirm('此操作将永久删除该数据, 是否继续?', '删除该分类', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
           }).catch(err=>err)
           if(confirmRes!=='confirm')return
            const {data:res}=await this.$http.delete(`categories/${this.selectCateKey}/attributes/${attr_id}`)
             if(res.meta.status!==200){
                 return this.$message.error('删除参数失败!')
             }
             this.$message.success('删除参数成功!')
             this.getActiveCateData();
            console.log(res);
       },
    //    input输入框的失去焦点和entere发送请求
      handleInputConfirm(row){
           if(row.inputValue.trim().length===0){
               row.inputValue=[]
               row.inputVisible=false
               return
           }
        //    如果没有retrun 则证明输入的内容,需要做后续的处理
          row.attr_vals.push(row.inputValue.trim())
          row.inputValue='';
          row.inputVisible=false
          this.saveArrVals(row)
       },
        async saveArrVals(row){
         const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                 {
                      'attr_name':row.attr_name,
                      'attr_sel':row.attr_sel,
                      'attr_vals':row.attr_vals.join(' ')
                })
                if(res.meta.status!==200){
                    return this.$message.error('更新分类标签失败!')
                }
                this.$message.success('添加参数成功！')
             console.log(res);
       },
       showInput(row){
        //    row.inputVisible=false
        row.inputVisible=true
        // $nextTick的方法的作用，就是当页面上元素被重新渲染之后,就会至自动回调函数中的代码
         this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
        console.log(row.inputVisible);
       },
    //    删除对应的参数可选项
       handleClose(index,row){ 
         row.attr_vals.splice(index,1)
         this.saveArrVals(row)
       }
    },
     computed:{
        //  如果按钮禁用 返回true 否则返回false
          isBtnDisabled(){
              if(this.selectCateKey.length!==3){
                  return true
              }
              return false
          },
          cateId(){
              if(this.selectCateKey.length===3){
                  return this.selectCateKey[this.selectCateKey.length-1]
              }
              return null
          },
          titleText(){
              return this.activeName==='many'?'动态参数':'静态属性'
          }
     }
}
</script>

<style lang="less" scoped>
    .cat_opt{
        margin: 15px 0;
    }
    .el-tag{
        margin: 0px 15px;
    }
    .input-new-tag{
        width: 100px;
    }
</style>