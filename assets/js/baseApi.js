// 注意：每次调用 $.get() $.post 或者$.ajax()的
// 都会调用ajaxPrefilter这个函数
// 这个函数中我们可以拿到我们给Ajax提供的对象
$.ajaxPrefilter(
    function (options) {

        //发起请求拼接url
        options.url = 'http://www.liulongbin.top:3007' + options.url
        // console.log(options.url);

        // 统一为有权限的接口设置headers请求头
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }
        // 全局挂载complete回调函数
        // 无论请求成功还失败都会执行
        options.complete = function (res) {
            // console.log(res);
            // 在complete 回函数中，可以使用res.responseJSON拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1.清空本地储存的token
                localStorage.removeItem('token')
                // 2.跳转到登录页面
                location.href = '/logoin.html'
            }
        }
    }

)