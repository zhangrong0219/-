//定义一个空数组
let userArr = [];
//发送请求
$.ajax({
   type:'get',
   url:'/users',
   success:function(res){
       //console.log(res);//打印出来的是用户列表
       userArr = res;
       render();
   }
})

//封装渲染页面模板
function render(){
     //拼接模板
     let html = template('userTpl',{data:userArr});
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
});

//实现添加用户功能
//给按钮添加点击事件
$('#btn').on('click',function(){
    //获取form表单里面的内容，用到表单里面的serialize方法，不仅可以获取表单的内容还可以把表单内容格式化为参数字符串
    let data = $("form").serialize();
    //发送添加用户请求
    $.ajax({
        type:'post',
        url:'/users',
        data:data,
        success:function(res) {
           //把返回的数据追加到数组中的最前面
           userArr.unshift(res);
           //重新渲染页面
           render();  
           //添加完后清空表单数据
           $('#previewImg').attr('src','../assets/img/default.png');
           $('#hidden').val('');
           $('input[name="email"]').val('');
           $('input[name="nickName"]').val('');
           $('input[name="password"]').val('');
           $('#status0').prop('checked',false);
           $('#status1').prop('checked',false);
           $('#admin').prop('checked',false);
           $('#normal').prop('checked',false);
        },
        error:function(err) {
            console.log(err)
        }
    })
});

//定义一个存储用户信息id的全局变量
var userId;
//给编辑按钮注册点击事件，注意编辑按钮是后来创建的，所以需要用到事件委托事件
$('tbody').on('click','.edit',function(){
    //获取当前编辑的用户的自定义id
    userId=$(this).attr('data-id');
    //把h2里面添加改为编辑
    $('h2').html('编辑');
    //获取到tbody里面的tr
    let tr = $(this).parents('tr');
    //把右边tbody里面的数据取到放到左边form表单对应的框中
    $('#previewImg').attr('src',tr.find('img').attr('src'));
    $('#hidden').val(tr.find('img').attr('src'));
    //获取到邮箱内容后把当前这个输入框禁用，禁止修改
    $('input[name="email"]').prop('disabled', true).val(tr.children().eq(2).text());
    $('input[name="nickName"]').val(tr.children().eq(3).text());
    //获取到密码框内容后把当前这个输入框禁用，禁止修改
    $('input[name="password"]').prop('disabled',true);
    if(tr.children().eq(4).text() == '激活'){
        $('#status1').prop('checked',true)
    }else{
        $('#status0').prop('checked',true)
    };
    if(tr.children().eq(5).text() == '超级管理员'){
        $('#admin').prop('checked',true)
    }else{
        $('#normal').prop('checked',true)
    };

    //隐藏添加用户按钮，显示编辑按钮
    $('#btn').hide();
    $('#btnEdit').show();

});

//给编辑按钮注册点击事件
$('#btnEdit').on('click',function(){
    //获取表单的数据
    let data = $("form").serialize();
    //发送请求
    $.ajax({
        type: 'PUT',
        url: '/users/'+ userId,
        data: data,
        success:function(res){
            // console.log(res);//得到的是修改后的用户所有的信息
            //获得点击的当前元素的下标
            let index = userArr.findIndex(item => res._id == item._id);
            //res的内容赋值给对应下标数组对象
            userArr[index] = res;
            //重新渲染页面
            render();
            //把编辑用户里面的信息全部删除，变更为添加用户界面
            //恢复h2里面的标题文字
            $('h2').text('添加新用户');
            //头像框改为默认的图片
            $('#previewImg').prop('src','../assets/img/default.png');
            //隐藏域里面的内容清空
            $('#hidden').val('');
            //清空表单里面的内容，禁用按钮恢复
            $('input[name="email"]').prop('disabled', false).val('');
            $('input[name="nickName"]').val('');
            $('input[name="password"]').prop('disabled',false);
            $('#status0').prop('checked',false);
            $('#status1').prop('checked',false);
            $('#admin').prop('checked',false);
            $('#normal').prop('checked',false);
            //编辑按钮隐藏，添加按钮显示
            $('#btnEdit').hide();
            $('#btn').show();
        }
    })
});

//完成删除功能
$('tbody').on('click','.del',function(){
    //获取当前点击的数据id
    let id = $(this).attr('data-id');
    //弹出是否确认删除框
    let isConfirm = confirm('您确认删除吗？');
    if(isConfirm){
        //发送请求
        $.ajax({
            type:'delete',
            url:'/users/'+id,
            success:function(res){
                //获得点击的当前元素的下标
                let index = userArr.findIndex(item => res._id == item._id);
                //删除数组对应下标的数据
                userArr.splice(index,1);
                //重新渲染页面
                render();
            }
        })
    }
})