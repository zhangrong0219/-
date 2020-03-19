$('#logout').on('click',function(){
    //运用conform方法，弹出是否确认退出按钮，这个方法的返回值是布尔值
    let isConform = confirm('您确认退出吗？');
    if(isConform){
      $.ajax({
        type:'post',
        url:'/logout',
        success:function(){
          //如果退出成功就跳转登录页面
          location.href = 'login.html'
        },
        error:function(){
          //如果退出失败，就提示用户
          alert('退出失败')
        }
      })     
      }
  });

  //修改侧边栏登录用户显示对用用户的姓名和头像
  //用到的路由是根据id查询用户
  $.ajax({
    type:'get',
    url:'/users/' + userId,
    success:function(res){
      // console.log(res);
      
      //把名字放在侧边栏的名字框中
      $('.profile h3').text(res.nickName);
      //把头像放在侧边栏头像框中
      $('.profile img').prop('src',res.avatar)
    }
  })