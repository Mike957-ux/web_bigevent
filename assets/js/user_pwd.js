$(function () {
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            };
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '新密码和确认密码不相同'
            }
        }
    })


    // 表单提交
    $('.layui-form').submit(function (e) {
        // 阻止默认行为
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // console.log(res.message);
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                // console.log($('.layui-form'));
                // 清空表单
                $('.layui-form')[0].reset();
            }
        });
    });
})