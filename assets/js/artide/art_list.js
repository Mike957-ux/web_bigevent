$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 补零函数
    function padZero(n) {
        if (n < 10) {
            return '0' + n;
        } else {
            return n;
        }
    }
    // 定义时间过滤器定义过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ': ' + mm + ':' + ss
    }


    // 定义一个查询参数对象，请求对象
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,  //页码值
        pagesize: 2,  //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: ''   //文章的状态，可选值有：已发布、草稿
    }
    // 调用获取文章列表数据
    initTable()
    // 调用初始化文章分类方法
    initCate()


    // 获取文章列表数据
    function initTable() {
        $.ajax({
            type: "get",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                console.log(res);
                // 渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                // 调用分页
                renderPage(res.total)
            }
        });
    }

    // 初始化文章分类方法
    function initCate() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                // 调用模板引擎渲染可选项
                var htmlStr = template('tpl-cate', res)
                // console.log();
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染页面
                form.render()
            }
        });
    }

    // 筛选
    $('#form-serch').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 给查询对象q赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新查询对象q渲染表格
        initTable()
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页的容器id
            count: total, //总数据
            limit: q.pagesize,  //每天页显示的数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            /* 触发jump的方式有两种
            1.点击页面的时候会触发jump回掉
            2.只要调用 laypage.render()方法就会触发jump回调 */
            jump: function (obj, first) {
                // 可以通过first来判断那种方式触发的jump回调
                // 如果first的值为true，就证明是方式2触发的
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                q.pagenum = obj.curr
                // 把最新的条目数，复制给q.pagesize
                q.pagesize = obj.limit
                // 根据最新查询对象q渲染表格
                if (!first) {
                    // 根据最新查询对象q渲染表格
                    initTable()
                }
            }
        })
    }

    // 事件代理绑定删除事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr('data-id');
        console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        console.log(res);
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    if (len === 1) {
                        // 页面值最小必须为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            });
            layer.close(index);
        });
    });


    // 事件代理的方式绑定点击事件
    var btnEdit = null
    $('tbody').on('click', '#btn-edit', function () {
        btnEdit = layer.open({
            type: 1,
            area: ['80%', '80%'],
            title: '修改文章',
            content: $('#dialog-edit').html()
        });
        // 提取值渲染页面
        var id = $(this).attr('data-id');
        console.log(id);
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                console.log(res);


                // 初始化富文本
                initEditor()
                // 1. 初始化图片裁剪器
                var $image = $('#image')

                // 2. 裁剪选项
                var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview'
                }

                // 3. 初始化裁剪区域
                $image.cropper(options)

                initCate()
                form.val('form-edit', res.data)


                $('#btnCoverFile').click(function () {
                    $('#coverFile').click();
                });
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



                $('#form-edit').on('submit', function (e) {

                    e.preventDefault();
                    console.log($(this)[0]);
                    var fd = new FormData($(this)[0]);

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
                            publisthArticle(fd);
                            // 调用获取文章列表数据
                            initTable()
                            layer.close(btnEdit)
                        })
                });
            }
        });

    });
    function publisthArticle(fd) {
        $.ajax({
            type: "post",
            url: "/my/article/edit",
            data: fd,
            // 注意：如果向服务器提交的是 FormData 数据格式，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 通知layui重新渲染页面
                var dd = parent.window.$("dd")
                // 将当前dd消除layui-this类
                $(dd).attr('class', '');
                $(dd[4]).attr('class', 'layui-this')
                location.href = '/article/art_list.html'
            }
        });
    }

})