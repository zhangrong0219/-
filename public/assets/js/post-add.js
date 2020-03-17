//发送请求
$.ajax({
    type:'get',
    url:'/categories',
    success:function(res){
        //拼接模板
        let html = template('postAddTpl',{data:res});
        //把拼接好的字符串追加到页面中
        $('#category').html(html); 
    }
});

//实现图片文件上传功能
//给选择文件按钮注册改变事件
$('#feature').on('change',function(){
    //使用FormData方法实现图片二进制上传
    let formData = new FormData();
    //向formData中追加选中的第一个文件元素
    formData.append('img',this.files[0]);
    //发送请求
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
            //返回的是选择的文件的路径
            //把图片展示到html里被隐藏起来的img框中
            $('.thumbnail').show().prop('src',res[0].img);
            //再把图片地址藏在隐藏域中
            $('#hidden').val(res[0].img);
            
        }
    })
});

//完成文章添加功能
//给添加按钮注册点击事件
$('#bthAdd').on('click',function(){
    //获取form表单里面的内容，用到表单里面的serialize方法，不仅可以获取表单的内容还可以把表单内容格式化为参数字符串
    let data = $("form").serialize();
    //发送添加文章请求
    $.ajax({
        type:'post',
        url:'/posts',
        data:data,
        success:function(res){
            //添加文章成功后跳转到文章列表页面
            location.href = 'posts.html' ;  
        }
    })
})