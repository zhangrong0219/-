//定义一个空数组
let usrArr = [];
//发送请求
$.ajax({
   type:'get',
   url:'/users',
   success:function(res){
       //console.log(res);//打印出来的是用户列表
       usrArr = res;
       render();
   }
})

//封装渲染页面模板
function render(){
     //拼接模板
     let html = template('userTpl',{data:usrArr});
    //  console.log(html);
    //把拼接好的数据追加到页面的tbody中
    $('tbody').html(html);
};

//完成头衔上传功能
//创建头像框点击改变事件
$('#avatar').on('change',function(){
    //创建FormData表单对象，实现图片二进制上传功能
    let formData = new FormData();
    //向表单对象追加元素,也就是选择的第一个文件
    formData.append('avatar', this.files[0]);
    //发送图片上传请求
    $.ajax({
        type:'post',
        url:'/upload',
        data:formData,
        //只要通过jQuery中的ajax来实现文件上传的功能，就必须设置下面两个属性，是固定参数
        //告诉$.ajax不要解释请求参数，也就是上面data对应的值
        processData:false,
        //告诉$.ajax不要设置请求参数的类型
        contentType:false,
        success:function(res){
            //得到的是一个数组，里面有一个参数是图片的地址{avatar: "\uploads\upload_4d9101c04765667ddad746c0d485901d.jpg"}，下标为0
            // console.log(res);
            //图片预览
            $('#previewImg').attr('src',res[0].avatar);
            //将图片的地址暂时保存在隐藏域中，等点击提交按钮时和表单的内容一起提交给数据库
            $('#hidden').val(res[0].avatar)
        }
    })
})