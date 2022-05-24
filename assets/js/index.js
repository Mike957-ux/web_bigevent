// username:mop1 password:000000
$(function () {
    // 调用getUserInfo获取用户的信息
    getUserInfo()

    var layer = layui.layer
    // 退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地储存的token
            localStorage.removeItem('token')
            // 2.跳转到登录页面
            location.href = '/logoin.html'

            // 关闭
            layer.close(index);
        });
    });

})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function (res) {
            // console.log(localStorage.getItem('token'));
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取失败！！')
            }
            // 调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },

    });
}

// 渲染用户头像
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username
    // 文本信息 用户姓名
    $('#welcome').html('欢迎，' + name);
    if (user.user_pic !== null) {
        // 渲染用户头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}


