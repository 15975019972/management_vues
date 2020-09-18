<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
   <el-card>
      <el-row :gutter="20">
          <el-col :span='8'>
             <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable='true' @clear='getUserList'>
             <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span='4'>
              <el-button type="primary" @click='addDialogVisible=true'>添加用户</el-button>    
          </el-col>
      </el-row>
      <el-table :data='userlist' :border='true' :stripe='true'>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" width="180" prop="username"></el-table-column>
          <el-table-column label="邮箱" width="180" prop="email"></el-table-column>
          <el-table-column label="电话" width="180" prop="mobile"></el-table-column>
          <el-table-column label="角色" width="180" prop="role_name"></el-table-column>
           <el-table-column label="状态" width="180" prop="mg_state" type="index">
               <template v-slot:default='scope'>
                 <el-switch
                  v-model="scope.row.mg_state" @change='userStateChange(scope.row)'>
                </el-switch>
               </template>
           </el-table-column>
          <el-table-column label="操作" width="180">
              <template #default='scope'>
                  <!-- 修改按钮 -->
                  {{scope.col}}
                  <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable='false'>
                  <el-button type="primary" icon="el-icon-edit" size='mini' @click='EditForm(scope.row.id,scope.row.email,scope.row.mobile)'></el-button>
                   </el-tooltip>
                  <!-- 删除按钮 -->
                  <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable='false'>
                    <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)"></el-button>
                  </el-tooltip>
                  
                  <!-- 分配角色按钮 -->
                  <el-tooltip class="item" effect="dark" content="设置" placement="top" :enterable='false'>
                      <el-button type="warning" icon="el-icon-setting" size='mini' @click='setRole(scope.row)'></el-button>
                 </el-tooltip>
              </template>
          </el-table-column>
      </el-table>
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>


  <!-- 添加用户的对话框  -->
   <el-dialog
     title="添加用户"
     :visible.sync="addDialogVisible"
     width="50%" @close='closeDialogForm'>
     <!--dislog内容主体区域 -->

     <!-- 表单区域 -->
  <el-form ref="formRef" :model="addForm" label-width="80px" :rules='addFormRules'>
        <!-- 用户名 -->
     <el-form-item label="用户名" prop='username'>
         <el-input  v-model="addForm.username"></el-input>
      </el-form-item>
      <!--  -->
      <el-form-item label="密码" prop='password'>
          <el-input  v-model="addForm.password"></el-input>
     </el-form-item>
        <!-- 邮箱 -->
       <el-form-item label="邮箱" prop='email'>
          <el-input  v-model="addForm.email"></el-input>
       </el-form-item>
          <!-- 电话号码 -->
        <el-form-item label="电话号码" prop='mobile'>
           <el-input  v-model="addForm.mobile"></el-input>
        </el-form-item>
  </el-form>
     <!-- 这是底部按钮区域 -->
     <span slot="footer" class="dialog-footer">
     <el-button @click="addDialogVisible = false">取 消</el-button>
     <el-button type="primary" @click="addUser">确 定</el-button>
     </span>
</el-dialog>
<!-- 编辑用户信息对话框 -->
  <el-dialog
       title="编辑用户"
       :visible.sync="showEditDialog"
       width="50%" @close='closeEditForm'>
       <!-- 编辑表单 -->
      <el-form :model="editFormData" status-icon :rules="editFormRule" ref="editFormRef" label-width="100px" class="demo-ruleForm">
       <el-form-item label="id">
      <el-input type="text"  autocomplete="off" :value='editFormData.id' :disabled='true'></el-input>
        </el-form-item>
      <el-form-item label="email" prop="email">
         <el-input type="text"  autocomplete="off" v-model="editFormData.email"></el-input>
      </el-form-item>
        <el-form-item label="mobile" prop="mobile">
     <el-input type="text"  autocomplete="off" v-model="editFormData.mobile"></el-input>
   </el-form-item>
     </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="showEditDialog = false">取 消</el-button>
         <el-button type="primary" @click="commitEditUserData">确 定</el-button>
       </span>
     </el-dialog>
     <!-- 分配角色的对话框 -->
     <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%" @close='setRoleDialogClosed'>
      <div>
        <!-- {{userIn fo}} -->
        <p>当前用户:{{userInfo.username}}</p>
        <p>当前角色:{{userInfo.role_name}}</p>
        <p>分配新角色:
       <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
       </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
export default {
     name:'Users',
     data(){
        var checkEmail=(rule,value,cb)=>{
            //验证邮箱的规则
           const regEamil=/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
            if(regEamil.test(value)){
              return cb()
            }
            cb(new Error("请输入正确的邮箱!"))
        }
        let  checkTel=(rule,value,cb)=>{
          const regTel=/0?(13|14|15|18|17)[0-9]{9}/
          if(regTel.test(value)){
            return  cb();
          }
          cb(new Error('请输入正确的手机号码!'))
        }
        let checkUser=(rule,value,cb)=>{
          const regUser=/[A-Za-z0-9_\-\u4e00-\u9fa5]+/;
          if(regUser.test(value)){
            return cb();
          }
          cb(new Error('请输入正确的用户名'))
        }

         return{
            //  获取用户表的参数对象
           queryInfo:{
               query:'',
            //    当前页数
               pagenum:1,
            //    每一页显示多少条数据
               pagesize:2
           },
           userlist:[],
           total:0,
          //  控制对话框的控制和隐藏
          addDialogVisible:false,
          // 添加用户的表单数据
          addForm:{
            username:'112121212d',
            password:'12d1wajd',
            email:'8254454@qq.com',
            mobile:'1597501197'
          },
          // 添加表单的验证规则对象
          addFormRules:{
            username:[
              {required:true,message:"请输入用户名",traigger:'blur'},
              // {min:3,max:10,message:"用户名长度3~10之间",traigger:'blur'}
              { validator: checkUser, trigger: 'blur' }
            ],
             password:[
               {required:true,message:"请输入密码",traigger:'blur'},
               {min:6,max:16,message:"密码长度3~10之间",traigger:'blur'}
           ],
             email:[
               {required:true,message:"请输入邮箱",traigger:'blur'},
               { validator: checkEmail, trigger: 'blur' }
              ],
              mobile:[
                {required:true,message:"请输入你的手机号码",traigger:'blur'},
                { validator: checkTel, trigger: 'blur' }
              ]
          },
          showEditDialog:false,
          editFormData:{
             id:'',
             email:'',
             mobile:''
          },
          editFormRule:{
           email:[
               { validator: checkEmail, trigger: 'blur' }
           ],
             mobile:[
               { validator: checkTel, trigger: 'blur' }
             ]
            },
          setRoleDialogVisible:false,
          // 分配角色的用户信息
          userInfo:{},
        // 定义所有角色的数据
          rolesList:[],
          selectedRoleId:''
         }
     },
     created(){
         this.getUserList();
     },
     methods:{
          async getUserList(){
               const {data:res}=await this.$http.get('users',{
                  params:this.queryInfo
              })
              if(res.meta.status!==200) return this.$message.error(res.meta.msg)
              this.userlist=res.data.users
              this.total=res.data.total
              // console.log(res);
          },
        //   监听pagesize改变的事件
          handleSizeChange(newSize){
            //  console.log(newSize);
             this.queryInfo.pagesize=newSize
             this.getUserList()
          },
        //   监听页码值 改变的事件
          handleCurrentChange(newPage){
            console.log(newPage);
            this.queryInfo.pagesize=newPage
            this.getUserList()
          },
        //   监听switch状态的改变
          async userStateChange(userinfo){
              // console.log(userinfo);
              const {data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
               if(res.meta.status!==200){
                    userinfo.mg_state=!userinfo.mg_state
                   return this.$message.error('更新失败!')
               }
               this.$message.success("更新成功")
              // console.log(res);
          },
          // 监听添加用户对话框的关闭事件
          closeDialogForm(){
              this.$refs.formRef.resetFields()
            // console.log('111');
          },
          // 添加用户
           addUser(){
             this.$refs.formRef.validate(async valid=>{
              if(!valid) return
                const {data:res}=await this.$http.post('users',this.addForm)
              if(res.meta.status!==201){
                return this.$message.error(res.meta.msg);
              }
              this.$message.success(res.meta.msg)
              this.addDialogVisible=false;
              this.getUserList();
              // console.log(res);
                // console.log(valid);
            })
          },
          // 获取编辑页面的id
          EditForm(id,email,mobile){
               this.editFormData.id=id;
               this.editFormData.email=email;
               this.editFormData.mobile=mobile;
            this.showEditDialog=true
          },
          // 提交编辑页面的信息
          commitEditUserData(){
                this.$refs.editFormRef.validate(async valid=>{
                      console.log(this.editFormData);
                   if(!valid){
                     return
                   }
                   const {data:res}=await this.$http.put(`users/${this.editFormData.id}`,this.editFormData)
                   if(res.meta.status!==200){
                     return this.$message.error(res.meta.msg)
                   }
                   this.$message.success(res.meta.msg)
                   this.showEditDialog=false;
                    this.getUserList();
                  //  console.log(res);
                })
          },
          closeEditForm(){
              this.$refs.editFormRef.resetFields()
          },

          // 根据id删除
         async removeUserById(id){
           const confirmResult=await this.$confirm('此操作将永远删除用户,是否继续？','提示',{
             confirmButtonText:'确定',
             cancelButtonText:'取消',
             type:'warning'
           }).catch(err=>err)
          //  如果用户点击确认返回是confirm
          // 如果用户取消了删除,则返回值为字符串cancel
               if(confirmResult!=='confirm'){
                 return this.$message.info('取消')
               }
              const {data:res}=await this.$http.delete(`users/${id}`)
              if(res.meta.status!==200){
                return this.$message.error(res.meta.msg)
              }
              this.$message.success(res.meta.msg)
             this.getUserList()
         },
        //  展示/获取角色列表的数据
         async setRole(userInfo){
           this.userInfo=userInfo
              //  在展示对话框之前,获取所有的角色的列表
              const {data:res}=await this.$http.get(`roles`)
              if(res.meta.status!==200){
                return this.$message.error(msg);
              }
              this.rolesList=res.data
            this.setRoleDialogVisible=true
         },
          // 点击按钮分配角色
        async saveRoleInfo(){
            if(!this.selectedRoleId){
              return this.$message.error('请选择要分配的角色!')
            }
             const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
               if(res.meta.status!==200){
                 return this.$message.error('更新角色失败!')
               }
               this.$message.success('更新角色成功')
                  this.getUserList();
                  this.setRoleDialogVisible=false
         },
        //  监听角色对话框的关闭时间
         setRoleDialogClosed(){
            this.selectedRoleId='';
            this.userInfo={}
         }
     }
}
</script>

<style lang="less" scoped>

</style>