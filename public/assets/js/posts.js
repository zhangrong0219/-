//发送查询文章列表请求
$.ajax({
    type:'get',
    url:'/posts',
    data:{
        page:1
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


//实现分页功能，需要封装到一个函数，在点击分页对应按钮时调用这个方法，实现无刷新页面的跳转页面
function changePage(index){
    //发送查询文章列表请求
    $.ajax({
        type:'get',
        url:'/posts',
        data:{
            page:index
        },
        success:function(res){
            //拼接模板,注意是返回的对象里面records数组中的才是文章列表信息
            let html = template('postsTpl',{data:res.records});
            //把拼接好的数据追加到页面中的tbody中
            $('tbody').html(html);
            //拼接分页的模板
            let pageHtml = template('pageTpl', res)
            $('.pagination').html(pageHtml);
        }
    });
};

