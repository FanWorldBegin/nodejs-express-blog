
//给删除按钮绑定事件
$(document).ready(function () {
  $('.delete-article').on('click', function (e) {
    //获取dom 元素本身
    var $target = $(e.target);
    var id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/articles/' + id,
      success: function () {
        alert('Deleting Article');
        window.location.href = "/";
      },
      erorr: function (err) {
        console.log(err);
      }
    })
  })
})