<template>
  <div>
    <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>商品管理</el-breadcrumb-item>
       <el-breadcrumb-item>添加商品</el-breadcrumb-item>
     </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
    <!-- 提示区域 -->
     <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>

     <!-- 步骤条区域 -->
    <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!-- 侧边table栏 -->

    <el-form :model="addForm" :rules="addFormRules" ref="goodsFormRef" label-width="100px" label-position="top">
     <el-tabs tab-position="left" v-model="activeIndex" :before-leave='beforeTabLeave' @tab-click='tabClicked'>
       <el-tab-pane label="基本信息" name="0">
         <el-form-item label="商品名称" prop="goods_name">
           <el-input v-model="addForm.goods_name"></el-input>
         </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
           <el-input v-model="addForm.goods_price" type="number"></el-input>
        </el-form-item>
         <el-form-item label="商品重量" prop="goods_weight">
             <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
             <el-input v-model="addForm.goods_number" type="number"></el-input>
           </el-form-item>
           <el-form-item label="商品分类" prop="goods_cate">
            <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderValue"
                 @change='cascaderHandleChange'>
            </el-cascader>
           </el-form-item>
       </el-tab-pane>
       <el-tab-pane label="商品参数" name="1">
         <!-- 渲染表单的item项 -->
         <el-form-item :label="item.attr_name" v-for="item in manyParamsList" :key="item.id">
             <el-checkbox-group v-model="item.attr_vals">
               <el-checkbox :label="it" v-for="(it,i) in item.attr_vals" :key="i" border></el-checkbox>
             </el-checkbox-group>
         </el-form-item>
       </el-tab-pane>
       <el-tab-pane label="商品属性" name="2">
         <el-form-item :label="item.attr_name" v-for="item in onlyParamsList" :key="item.attr_id">
          <el-input v-model="item.attr_vals"></el-input>
         </el-form-item>
       </el-tab-pane>
       <el-tab-pane label="商品图片" name="3">
         <!-- action 表示图片要上传的后台api地址 -->
         <el-upload
            :action="upLoadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="getSessstorage"
            :on-success='handleSuccess'>
            <el-button size="small" type="primary">点击上传</el-button>
           </el-upload>
       </el-tab-pane>
       <el-tab-pane label="商品内容" name="4">
         <!-- 富文本编辑器组件 -->
         <quill-editor v-model="addForm.goods_introduce"></quill-editor>
         <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
       </el-tab-pane>
     </el-tabs>
     </el-form>
  </el-card>
  <!-- 图片显示对话框 -->
  <el-dialog
  title="提示信息"
  :visible.sync="pirviewDialogVisible"
  width="50%">
  <div class="dialogViewPirc"><img :src="pirviewPath" alt=""></div>
</el-dialog>
  </div>
</template>

<script>
export default {
    name:"Add",
    data(){
      return{
        activeIndex:'0',
        // 添加商品的表单数据对象
        addForm:{
          goods_name:'',
          goods_price:0,
          goods_weight:0,
          goods_number:0,
          goods_cat:[],
          pics:[],
          // 商品详情描述
          goods_introduce:'',
          attrs:[]
        },
        addFormRules:{
          goods_name:[
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          goods_price:[
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          goods_weight:[
            { required: true, message: '请输入商品重量', trigger: 'blur' }
          ],
          goods_number:[
             { required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
          goods_cat:[
            { required: true, message: '请输入商品分类', trigger: 'blur' }
          ]
        },
        // 商品分类列表
        cateList:[],
        cascaderValue:{
          label:'cat_name',
          value:'cat_id',
          children:'children',
          expandTrigger: 'hover'
        },
        // 动态参数列表数据
        manyParamsList:[],
        // 静态属性列表数据
        onlyParamsList:[],
        // 图片上传的url地址
        upLoadURL:'http://127.0.0.1:8888/api/private/v1/upload',
        pirviewPath:'',
        pirviewDialogVisible:false
      }
    },
    created(){
      this.getCateList()
    },
    methods:{
      async getCateList(){
        const {data:res}=await this.$http.get('categories')
         if(res.meta.status!==200){
           return
         }
         this.cateList=res.data
         console.log(this.cateList);
      },
      cascaderHandleChange(){
        if(this.addForm.goods_cat.length!==3){
           this.addForm.goods_cat=[];
        }
        console.log(this.addForm.goods_cat);
      },
      beforeTabLeave(activeName,oldActiveName){
        if(oldActiveName==='0'&&this.addForm.goods_cat.length!==3){
            this.$message.error('请选择分类商品!')
         return false
        }
      },
      async tabClicked(){
        // 证明是访问动态参数的面板
          if(this.activeIndex==='1'){
              const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{'sel':'many'}})
              if(res.meta.status!==200){
                return this.$message.error('请求动态参数错误!')
              }
              res.data.forEach(item=>{
                item.attr_vals=item.attr_vals.length!==0?item.attr_vals.split(' '):[]
              })
             this.manyParamsList=res.data
             console.log(this.manyParamsList);
          }else if(this.activeIndex==='2'){
                const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{'sel':'only'}})
                if(res.meta.status!==200){
                  return this.$message.error('请求静态参数错误!')
                }
                this.onlyParamsList=res.data
                console.log(this.onlyParamsList);
          }
      },
      // 处理图片预览效果
      handlePreview(file){
        this.pirviewDialogVisible=true
          this.pirviewPath=file.response.data.url;
              console.log(file);
      },
      // 点击×号处理函数
      handleRemove(file){
        // 1.获取将要删除的图片的临时路径
        // 2.从pics数组中,找到这个图片的对应的索引值
        // 3.调用数组的splice方法 把图片信息对象,从pics数组汇总移除
        const filepath=file.response.data.tmp_path
        const index=this.addForm.pics.findIndex(item=>item.pic===filepath)
        this.addForm.pics.splice(index,1)
        console.log(this.addForm.pics);
      },
      // 图片上传成功的钩子
      handleSuccess(res){
        // 拼接得到一个图片信息对象
        // 将图片信息对象，push到pics数组中
        const picInfo={'pic':res.data.tmp_path}
        this.addForm.pics.push(picInfo)
        console.log(this.addForm.pics);
      },
      add(){
         this.$refs.goodsFormRef.validate(async valid=>{
           if(!valid){
             return  this.$message.error('请填写必要的表单数据!')
           }
          //  执行添加的业务逻辑
          // lodash  cloneDeep(obj) 深拷贝
            const form=_.cloneDeep(this.addForm)
          form.goods_cat=form.goods_cat.join(',')
          console.log(this.manyParamsList);
          console.log(this.onlyParamsList);
          //  console.log(valid);
          // 处理动态参数和静态属性
          // 动态属性
          this.manyParamsList.forEach(item=>{
            const newInfo={'attr_id':item.attr_id,'attr_value':item.attr_vals.join(' ')}
             this.addForm.attrs.push(newInfo)
          })
          // 动态属性
          this.onlyParamsList.forEach(item=>{
            const newInfo={'attr_id':item.attr_id,'attr_value':item.attr_vals}
            this.addForm.attrs.push(newInfo)
          })
          form.attrs=this.addForm.attrs
        // 发起添加商品
         const {data:res}=await this.$http.post('goods',form)
           if(res.meta.status!==201){
             return this.$message.error('添加商品失败!')
           }
           this.$message.success('添加商品成功!')
           this.$router.push('/goods')
         console.log(res);
         
         })
      }

    },
    computed:{
      cateId(){
        if(this.addForm.goods_cat.length===3){
          return this.addForm.goods_cat[2]
        }
        return null
      },
      getSessstorage(){
        return {'Authorization':window.sessionStorage.getItem('token')}
      }
    }
}
</script>

<style lang='less'>
.el-checkbox{
  margin: 0 5px 0 0 !important;
}
.dialogViewPirc{
  display: flex;
  justify-content: center;
}
.ql-blank,.ql-editor{
  height: 400px;
}
.btnAdd{
  margin: 20px 0;
}
</style>