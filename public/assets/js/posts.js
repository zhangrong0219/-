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
    }
})