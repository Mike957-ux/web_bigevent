// 注意：每次调用 $.get() $.post 或者$.ajax()的
// 都会调用ajaxPrefilter这个函数
// 这个函数中我们可以拿到我们给Ajax提供的对象
$.ajaxPrefilter(
    function (options) {
        //发起请求拼接url
        options.url = 'http://www.liulongbin.top:3007' + options.url
        console.log(options.url);
    }
)