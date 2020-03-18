//获取分类和状态的内容
var categroyId = $('#category').val();
var state = $('#state').val();

//发送ajax都是重复的代码，我们可以封装一个函数，用于装ajax代码，
//唯一不同的地方是data数据里面的参数不同，可以给函数传递形参，调用时用实参接收
function render(categroyId,state,page=1){
    $.ajax({
        type:'get',
        url:'/posts',
        data:{
            page:page,
            category: categroyId,
            state: state
        },
        success:function(res){
            //拼接模板,注意是返回的对象里面records数组中的才是文章列表信息
            let html = template('postsTpl',{data:res.records});
            //把拼接好的数据追加到页面中的tbody中
            $('tbody').html(html);
            //拼接分页的模板
            let pageHtml = template('pageTpl',res)
            $('.pagination').html(pageHtml);
        }
    });
};
//发送查询文章列表请求
render(categroyId,state,1);

//实现分页功能，需要封装到一个函数，在点击分页对应按钮时调用这个方法，实现无刷新页面的跳转页面
function changePage(index){
    //发送查询文章列表请求
    render(categroyId,state,index);
};

//获取所有文章分类列表
$.ajax({
    type:'get',
    url:'/categories',
    success:function(res){
        let html = template('cTpl',{data:res});
        $('#category').append(html);
    }
})

//实现筛选功能
//给筛选按钮注册点击事件
$('#search').on('click',function(){
    //重新给分类和状态赋值
    categroyId = $('#category').val();
    state = $('#state').val();
    //再次发送查询文章列表请求
    render(categroyId,state);
})