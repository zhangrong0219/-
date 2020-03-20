//公用版块的热门推荐
//发送获取热门推荐的请求
$.ajax({
    type:'get',
    url:'/posts/recommend',
    success:function(res){
        // console.log(res);
        //利用变量接收模板拼接，并用template.render拼接模板即可实现在js里面拼接和引用模板
        let recommend = `
        {{each data}}
            <li>
              <a href="{{$value.category}}">
                <img src="{{$value.thumbnail}}" alt="" />
                <span>{{$value.title}}</span>
              </a>
            </li>
        {{/each}}
        `
        let html = template.render(recommend,{data:res});
        $('.recommend').html(html);
    }
})