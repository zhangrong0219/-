//定义一个空数组
var categoryArr = [];
//给添加按钮注册点击事件
$('#addBtn').on('click',function(){
    //获取表单里面的值
    let title = $('[name="title"]').val().trim();
    let className = $('[name="className"]').val().trim();
    if(title.length == 0) return alert('请输入分类名称');
    if(className.length == 0) return alert('请输入分类图标类名');
    //发送添加分类的请求
    $.ajax({
        type:'POST',
        url:'/categories',
        data:{
            title:title,
            className:className
        },
        success:function(res){
            //把数据追加到数组中
            categoryArr.push(res);
            //渲染模板
            render();
            //清空表格内容
            $('[name="title"]').val('');
            $('[name="className"]').val('');
        }
    })
});

//拼接模板，封装到单独的函数中
function render(){
    let html = template('cTpl',{data:categoryArr});
    $('tbody').html(html);
}

//查询分类展示到页面上
$.ajax({
    type:'get',
    url:'/categories',
    success:function(res){
       categoryArr = res;  
       render();
    }
});


//编辑功能
//定义一个用于接收每个分类tr的id
var categoryId;
//给编辑按钮注册点击事件，注意是事件委托
$('tbody').on('click','.edit',function(){
    //获取到编辑前的当前点击的分类的id
    categoryId = $(this).parents('td').attr('data-id');
    //获取tr标签
    let tr = $(this).parents('tr');
    //修改h2标签中的内容
    $('h2').text('编辑分类')
    //把左边的数据给到右边对应的表单框中
    $('[name="title"]').val(tr.children().eq(1).text());
    $('[name="className"]').val(tr.children().eq(2).text());
    //把添加按钮隐藏
    $('#addBtn').hide();
    $('#editBtn').show();
});

//给编辑按钮绑定点击事件
$('#editBtn').on('click',function(){
    //发送文章分类编辑请求
    $.ajax({
        type:'put',
        url:'/categories/'+ categoryId,
        data:{
            title: $('[name="title"]').val().trim(),
            className: $('[name="className"]').val().trim()
        },
        success:function(res){
            // console.log(res);//得到的是修改后的文章分类数据
            //获得当前元素的下标
            let index = categoryArr.findIndex(item => item._id == res._id)
            //res的内容赋值给对应下标数组对象
            categoryArr[index] = res;
            //重新渲染页面
            render();
            //把页面还原成添加用户页面，并清空所有表单内容
            $('h2').text('添加分类');
            $('[name="title"]').val('');
            $('[name="className"]').val('')
            //把添加按钮隐藏
            $('#addBtn').show();
            $('#editBtn').hide();
        }
    })
});

//删除单个文章分类
//给删除按钮注册点击事件，同样也要使用事件委托处理
$('tbody').on('click','.del',function(){
    let id = $(this).parent().attr('data-id');
    //提醒用户是否确认删除
    if(confirm('您确定要删除这个分类吗？')){
        //发送删除请求
        $.ajax({
            type:'DELETE',
            url:'/categories/' + id,
            success:function(res){
                //获取当前点击的元素索引
                let index = categoryArr.findIndex(item => item._id == res._id);
                //删除找出来的数组中对应下标的元素
                categoryArr.splice(index, 1);
                //重新渲染页面
                render();
            }
        })
    }
});

//删除多个分类
//实现全选
//给全选复选框注册点击事件
$('.checkAll').on('click',function(){
    //下面单个复选框的状态和全选复选框的状态保持一致
    $('.check').prop('checked',$(this).prop('checked'));
    //如果全选按钮点击后显示批量删除按钮
    if($(this).prop('checked')){
        //显示批量删除按钮
        $('#delAll').show();
    }else{
        //隐藏批量删除按钮
        $('#delAll').hide();
    }
});

//实现反选
$('tbody').on('click', '.check', function () {
    //判断下面复选框的长度和选中状态的长度是否一致，一致的话全选按钮就被选中
    $('.checkAll').prop('checked', $('.check').length == $('.check:checked').length);
    //显示批量删除按钮，条件是下面复选框选中个数至少有两个才可以
    if($('.check:checked').length >= 2){
        //显示批量删除按钮
        $('#delAll').show();
    }else{
        //隐藏批量删除按钮
        $('#delAll').hide();
    }
});

//给批量删除按钮注册点击事件
$('#delAll').on('click',function(){
    //定义一个空数组，后面需要把获取的多个id放在数组中
    var arr = [];
    //遍历已经被选中的的复选框
    $('.check:checked').each(function(index, ele){
       //获得所有被选中的复选框当前的tr的id
       arr.push($(ele).parents('tr').children().eq(3).attr('data-id'));
       
    });

    if(confirm('您确定要删除这几个用户信息吗？')){
        //发送批量删除请求
        $.ajax({
            type:'delete',
            url:'/categories/' + arr.join('-'),
            success:function(res){
                res.forEach(item =>{
                    //获得点击的当前元素的下标
                    let index = categoryArr.findIndex(ele => item._id == ele._id);
                    //删除数组对应下标的数据
                    categoryArr.splice(index,1);
                    //重新渲染页面
                    render();
                })
               
            }
        })
    }  
});