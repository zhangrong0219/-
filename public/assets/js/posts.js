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

//定义一个接受页码的变量
var currentPage = 1;
//实现分页功能，需要封装到一个函数，在点击分页对应按钮时调用这个方法，实现无刷新页面的跳转页面
function changePage(index){
    currentPage = index;
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
});


//完成文章删除功能
//给删除按钮注册点击事件,事件委托的方式
$('tbody').on('click','#delete',function(){
    //获取当前点击的元素的对应id
    let id = $(this).attr('data-id');
    //询问是否确定删除
    if(confirm('您确认要删除吗？')){
        //执行删除请求
        $.ajax({
            type:'DELETE',
            url:'/posts/' + id,
            success:function(res){
                //判断文章列表还有当前页码下面是否还剩一条数据，如果只剩一条数据，删除的话就跳转到上一页
                if($('tbody tr').length == 1){
                    //如果当前页面是第一页，说明只剩下最后一页内容了，也不存在还有上一页，所以也不需要执行当前页码减1的代码
                    if(currentPage == 1){
                        //把当前页码作为参数传递进来，实现删除了当前页的元素跳转回当前页
                        render(categroyId,state,currentPage);
                    }
                    //当前页面自减一，不能写currentPage-1，不然currentPage没有被重新定义，就只能完成一次跳转到上一页，多删几条数据跳跃两页就会报错
                    render(categroyId,state, --currentPage);
                }else{
                    //把当前页码作为参数传递进来，实现删除了当前页的元素跳转回当前页
                    render(categroyId,state,currentPage);
                }
                
            }
        })
    }
})
