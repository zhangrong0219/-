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
  })