
$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.legth > 6) {
                return '昵称长度必须在1-6个字符之间!'
            }
        }
    })
    initUserInof()
    function initUserInof() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.mag('获取用户信息失败')
                }
                // console.log(res);
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        });
    }
    // 重置表单的数据
    $('#btnReset').click(function (e) {
        // 阻止表单默认重置行为
        e.preventDefault();
        initUserInof();
    });
    // 监听表单的提交事件
    $('.layui-form').submit(function (e) {
        // 阻止表单默认重置行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            type: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                layer.msg(res.message)
                // 调用页面的中方法重新，渲染用户的信息
                window.parent.getUserInfo();
            }
        });
    });
})