// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzMwNSwidXNlcm5hbWUiOiJtb3AxIiwicGFzc3dvcmQiOiIiLCJuaWNrbmFtZSI6IiIsImVtYWlsIjoiIiwidXNlcl9waWMiOiIiLCJpYXQiOjE2NTI2ODI2NjAsImV4cCI6MTY1MjcxODY2MH0.lbaVIjSHyDanzmmpafJGjwQNAuanvQVQNMlXJU3_uoU


// username:mop1 password:000000

$(function () {
    // 点击了去注册账号按钮
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    // 点击了去登录按钮
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            // 自定义一个pwd校验规则
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function (value) {
            // value是拿到表单中的值
            var pwd = $('.reg-box [name=password]').val() //拿到另外一个的
            if (value !== pwd) {
                return layer.msg('两次输入的密码不一致');
            }
        }
    })

    // 监听注册表单的提交时间

    $('#form_reg').on('submit', function (e) {
        e.preventDefault() //阻止表单的默认行为
        var dataStr = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        console.log(dataStr);
        $.post("/api/reguser", dataStr,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，去登录');
                // 模拟点击
                $('#link_login').click();
            }
        );
    });

    // 登录表单的提交事件
    $('#form-login').submit(function (e) {
        e.preventDefault();//阻止表单的默认行为
        $.ajax({
            type: "post",
            url: "/api/login",
            data: $(this).serialize(),//当前表单的所有值
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message)
                // console.log(res.token);
                // 将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                // 跳转后台
                location.href = '/index.html'
            }
        });
    });

})