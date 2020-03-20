//完成公共部分侧边栏的随机推荐版块
$.ajax({
    type:'get',
    url:'/posts/random',
    success:function(res){
        // console.log(res);
        let random = `
        {{each data}}
        <li>
        <a href="detail.html?id={{@$value._id}}">
          <p class="title">{{$value.title}}</p>
          <p class="reading">阅读({{$value.meta.views}})</p>
          <div class="pic">
            <img src="{{$value.thumbnail}}" alt="" />
          </div>
        </a>
      </li>
      {{/each}}
    `
        let html = template.render(random,{data:res});
        $('.random').html(html);
    }
});

//完成公共板块侧边栏的分类列表
$.ajax({
    type:'get',
    url:'/categories',
    success:function(res){
        // console.log(res);
        let classify = `
        {{each data}}
        <li>
            <a href="list.html?id={{@$value._id}}"><i class="fa {{$value.className}}"></i>{{$value.title}}</a>
          </li>
        {{/each}}
        `
        let html = template.render(classify,{data:res});
        $('.classify').html(html);
    }
});


//给搜索框注册提交事件
$('form').on('submit',function(){
  location.href = 'search.html?keys=' + $('form').find('.keys').val();
  return false;//阻止提交事件的默认行为
})