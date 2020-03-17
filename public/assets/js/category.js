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
})