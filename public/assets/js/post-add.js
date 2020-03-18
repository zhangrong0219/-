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
$('#btnAdd').on('click',function(){
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
});

//封装判断文章是修改页面的函数,返回值是一个id的话就是修改页面，返回值是-1的话就是添加页面
function getParams(key) {
    //用location.search可以得到地址栏后面从问号开始的参数，比如?id=1234567
    //需要截取到问号后面的参数，因为有多个参数的话会以&符进行连接，所以要用&符进行分割成数组
    let params = location.search.substr(1).split('&');
    //遍历数组，以等号的形式进行分割数组元素
    for (let i = 0; i < params.length; i++){
        let item = params[i].split('=');
        //判断是否传递过来的参数是否和=分割后的数组下标为0的值相同
        if(key == item[0]){
            return item[1];
        }
    }
    return -1;
}

//传递的参数是id,只用比对id是否存在
let id = getParams('id');

//判断是否有id,有的话才执行
if(id != -1){
    //发送根据id查询文章的请求
    $.ajax({
        type:'get',
        url:'/posts/' + id,
        success:function(res){
            // console.log(res);
            //把修改的当前文章信息填写到添加页面对应的框中
            //把页面h2标题的添加文章改为编辑文章
            $('h1').html('编辑文章');
            //显示对应标题
            $('#title').val(res.title)
            //显示对应的内容
            $('#content').val(res.content);
            //显示对应的图片
            $('.thumbnail').show().prop('src',res.thumbnail);
            //把图片地址再放回隐藏域中
            $('#button').val(res.thumbnail);
            //把时间截取16位数字放到对应的时间显示框
            $('#created').val(res.category.createAt.substr(0,16));
            //获取当前文章的分类,遍历整个category里面的option根据分类的id判断，给这个分类添加selected为true
            $('#category option').each(function(index,item){
                // console.log($(item).attr('value'));
                if($(item).attr('value') == res.category._id){
                    $(this).prop('selected',true);
                }    
            });
            //状态，和获取分类是一样的操作
            $('#status option').each(function(index,item){
                if($(item).attr('value') == res.state){
                    $(this).prop('selected',true);
                }    
            });
            //保存按钮隐藏
            $('#btnAdd').hide();
            //编辑按钮显示
            $('#btnEdit').show();
        }
    })
};

//给编辑按钮注册点击事件
$('#btnEdit').on('click',function(){
    let data = $('form').serialize();
    //发送修改请求
    $.ajax({
        type:'PUT',
        url:'/posts/'+ id,
        data:data,
        success:function(res){
            location.href = 'posts.html'
        }
    })
});
