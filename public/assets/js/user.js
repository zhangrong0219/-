//定义一个空数组
let usrArr = [];
//发送请求
$.ajax({
   type:'get',
   url:'/users',
   success:function(res){
       //console.log(res);//打印出来的是用户列表
       usrArr = res;
       render();
   }
})

//封装渲染页面模板
function render(){
     //拼接模板
     let html = template('userTpl',{data:usrArr});
    //  console.log(html);
    //把拼接好的数据追加到页面的tbody中
    $('tbody').html(html);
}