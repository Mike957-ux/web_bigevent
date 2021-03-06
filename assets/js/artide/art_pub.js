$(function () {
    // 加载文章
    var layer = layui.layer
    var form = layui.form

    // 调用富文本渲染页面
    initEditor()
    initCate()
    // initEditor()
    // 文章分类


    function initCate() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('初始化文章分类失败')
                }
                console.log(res);
                // 渲染下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[ name=cate_id]').html(htmlStr);
                // 一定要调用form.render()方法
                form.render();
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面的按钮，绑定点击事件
    $('#btnCoverFile').click(function () {
        $('#coverFile').click();
    });
    // 监听coverFile 的change事件 获取用户的文件列表
    $("#coverFile").change(function (e) {
        // 获取了文件的数据
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });
    // 定义发布状态
    var art_state = '已发布'
    // 点击存为草稿事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    });


    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单默认行为
        e.preventDefault();
        // 2.基于form表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);

        // 3.将文章的发布状态存放到fd中
        fd.append('state', art_state)

        // 4.将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象，存储到fd中
                fd.append('cover_img', blob)
                // 6.发起ajax请求
                console.log(fd);
                publisthArticle(fd)
            })

    });
    // 定义一个发布文章的方法
    function publisthArticle(fd) {
        $.ajax({
            type: "post",
            url: "/my/article/add",
            data: fd,
            // 注意：如果向服务器提交的是 FormData 数据格式，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功跳转页面
                // 获取父窗口的dd
                var dd = parent.window.$("dd")
                // 将当前dd消除layui-this类
                $(dd).attr('class', '');
                $(dd[4]).attr('class', 'layui-this')
                location.href = '/article/art_list.html'
            }
        });
    }

})