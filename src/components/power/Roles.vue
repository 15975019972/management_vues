<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>权限管理</el-breadcrumb-item>
     <el-breadcrumb-item>角色列表</el-breadcrumb-item>
       </el-breadcrumb>
       <!-- 添加角色 -->
       <el-card>
         <el-row>
           <el-col>
             <el-button type="primary"  @click="showAddRole">添加角色</el-button>
           </el-col>
         </el-row>
       </el-card>
        <!-- 角色列表区域 -->
        <el-table :data="roleList" :border="true" stripe>
          <el-table-column type="expand">
             <template v-slot='scope'>
               <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                 <!-- 渲染一级权限 -->
                 <el-col :span="5">
                   <el-tag @close="removeThreeTag(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                   <i class="el-icon-caret-right"></i>
                 </el-col>
                 <!-- 渲染二级权限和三级权限-->
                 <!-- 通过for循环 嵌套二级权限 -->
                 <el-col :span="19">
                    <el-row :class="['bdbottom',i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                       <el-col :span="6">
                         <el-tag type="success" @close="removeThreeTag(scope.row,item2.id)" closable>{{item2.authName}}</el-tag>
                         <i class="el-icon-caret-right"></i>
                       </el-col>
                       <el-col :span="18">
                          <el-tag type="warning" @close="removeThreeTag(scope.row,item3.id)" closable  v-for="(item3,i3) in item2.children" :key="item3.id">
                            {{item3.authName}}
                          </el-tag>
                       </el-col>
                    </el-row>
                 </el-col>
               </el-row>
             </template>
          </el-table-column>
          <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300">
               <template v-slot:default='scope'>
                 <el-button type="primary" icon="el-icon-coin" size="mini" @click="showEdit(scope.row.id,scope.row.roleName,scope.row.roleDesc)">编辑</el-button>
                 <el-button type="warning" icon="el-icon-delete-solid" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
                 <el-button type="danger" icon="el-icon-s-opportunity" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
               </template>
            </el-table-column>
     </el-table>
       <el-dialog
         title="添加角色"
         :visible.sync="showRole"
         width="50%" @close='closeAddRoleDialog'>
            <el-form :model="addRole" :rules="addRoleRule" ref="addRoleForm" label-width="100px" >
            <el-form-item label="角色名字" prop="roleName">
              <el-input v-model="addRole.roleName"></el-input>
            </el-form-item>
             <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addRole.roleDesc"></el-input>
            </el-form-item>
           </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="showRole=false">取 消</el-button>
           <el-button type="primary" @click="commitAddRole">确 定</el-button>
         </span>
       </el-dialog>
<!-- 编辑页面 -->
         <el-dialog
    title="编辑角色"
    :visible.sync="showEditRole"
    width="50%" @close='closeEditRoleDialog'>
       <el-form :model="EditRole" :rules="addRoleRule" ref="EditRoleForm" label-width="100px" >
       <el-form-item label="角色名字" prop="roleName">
         <el-input v-model="EditRole.roleName"></el-input>
       </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
         <el-input v-model="EditRole.roleDesc"></el-input>
       </el-form-item>
      </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showEditRole=false">取 消</el-button>
      <el-button type="primary" @click="commitEditRole">确 定</el-button>
    </span>
  </el-dialog>
      <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVlisible"
      width="50%" @close='setrRightDiaglogClose'>
      <!--这里是树形控件 -->
      <el-tree :data="rightList" :props="treeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys="defkeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVlisible = false">取 消</el-button>
        <el-button type="primary" @click="allLotRights">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
      name:'Roles',
      data(){
        return{
          roleList:[],
          showRole:false,
//         添加角色数据
           addRole:{
            roleName:'',
            roleDesc:'',
          },
          // rule效验规则
          addRoleRule:{
            roleName:[
               { required: true, message: '请输入活动名称', trigger: 'blur' },
             { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
            ],
            roleDesc:[
              { required: true, message: '请输入描述信息', trigger: 'blur' }
            ]
          },
          // role 的id
          roleId:'',
          // 添加角色用户
          EditRole:{
            roleName:'',
             roleDesc:'',
          },
          // 分配权限
          showEditRole:false,
          setRightDialogVlisible:false,
          rightList:[],
          // 树形控件的属性绑定对象
          treeProps:{
            label:"authName",
            children:'children'
          },
          // 默认选中的节点id数组
          defkeys:[]
        }
        },
      created(){
        this.getRoleList();
      },
      methods:{
        async getRoleList(){
            const {data:res}=await this.$http.get('roles')
             if(res.meta.status!==200){
               return this.$meesage.error(res.meta.msg)
             }
             this.roleList=res.data
             console.log(this.roleList);
        },
        showAddRole(){
          this.showRole=true
        },
        // 确定
        commitAddRole(){
           this.$refs.addRoleForm.validate(async valid=>{
                if(!valid){
                  return  this.$message.error('请重新输入！')
                }
                 const {data:res}=await this.$http.post('roles',this.addRole)
                 if(res.meta.status!==201){
                   return this.$message.error(res.meta.msg)
                 }
                 this.$message.success(res.meta.msg)
                 this.showRole=false;
                 this.getRoleList();

           })
        },
        // 监听close 的dialog
        closeAddRoleDialog(){
             this.$refs.addRoleForm.resetFields()
        },
        // 编辑role页面相关的
        showEdit(id,name,desc){
          this.showEditRole=true
            this.roleId=id;
            this.EditRole.roleName=name;
            this.EditRole.roleDesc=desc
        },
        commitEditRole(){
           this.$refs.EditRoleForm.validate(async valid=>{
              if(!valid){
                return this.$message.error('请输入正确的格式!')
              }
              const {data:res}=await this.$http.put(`roles/${this.roleId}`,this.EditRole)
              if(res.meta.status!==200){
                return this.$message.error(res.meta.msg)
              }
              this.$message.success('添加成功!')
              this.getRoleList();
              this.showEditRole=false

           })
        },
        closeEditRoleDialog(){
         this.$refs.EditRoleForm.resetFields()
        },
        async deleteRole(id){
          console.log(id);
            const confirmRole=await this.$confirm('此操作将永久用户, 是否继续?', '删除角色', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
          console.log(confirmRole);
          if(confirmRole!=='confirm'){
            return this.$message.info('取消')
          }
          const {data:res}=await this.$http.delete(`roles/${id}`)
            if(res.meta.status!==200){
               return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getRoleList();
        },
        async removeThreeTag(role,rightId){
          console.log(role);
          console.log(rightId);
          // console.log(rightId);
           const confirmRsult=await this.$confirm('此操作将永久删除该权限,是否继续？','删除权限',{
              confirmButtonText:'确定',
              cancelBUttonText:"取消",
              type:'warning'
            }).catch(err=>err)
            //  console.log(roleId);
            //  console.log(rightId)
               if(confirmRsult!=='confirm'){
                 return this.$message.info('取消')
               }
           const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
             if(res.meta.status!==200){
               return this.$message.success(res.meta.msg)
             }
             
             this.$message.success(res.meta.msg);
               role.children=res.data;
        },
        async getRoleListDate(){
                const {data:res}=await this.$http.get('rights/tree')
                if(res.meta.status!==200){
                  return this.$message.error(res.meta.status)
                }
                // 获取到的权限数据
               this.rightList=res.data;
              //  console.log(this.rightList);
        },
        // 展示权限对话框
        async showSetRightDialog(role){
          this.roleId=role.id
             this.defkeys=[];
             this.getLeafKeys(role,this.defkeys)
            //  打开对话框
            this.getRoleListDate()
             this.setRightDialogVlisible=true
             console.log(this.rightList);
        },
        // 通过递归递归的形式,获取角色下所有三级的权限的id,并且保存到数组里面defakeysu数组中
         getLeafKeys(node,arr){
             if(!node.children){
               return arr.push(node.id)
             }
             node.children.forEach(item=>{
               this.getLeafKeys(item,arr)
             })
         },
        //  监听权限对话框的关闭事件
         setrRightDiaglogClose(){
          //  console.log("1111");
           this.defkeys=[]
         },
        //  点击分配角色权限
         async allLotRights(){
          //  console.log(this.roleId);
           const keys=[
             ...this.$refs.treeRef.getCheckedKeys(),
             ...this.$refs.treeRef.getHalfCheckedKeys()
           ]
           const idStr=keys.join(',')
            const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            console.log(res);
             if(res.meta.status!==200){
               return this.$message.error('分配权限失败!')
             }
            this.$message.success('分配权成功!')
            this.getRoleList()
            this.setRightDialogVlisible=false

         }
      }

    
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>