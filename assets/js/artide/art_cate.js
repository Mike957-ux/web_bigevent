$(function () {
    var layer = layui.layer
    var form = layui.form
    // 获取文章的分类的类别
    function intArtCateList() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg(res.message);
                }
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
            }
        });
    }
    intArtCateList();
    // 添加的弹出层
    var indexAdd = null
    $('#btnAddCate').click(function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    // 通过事件代理方式给form-add绑定事件submit
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        // console.log('ok');
        $.ajax({
            type: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                intArtCateList();
                layer.msg(res.message)
                // 根据索引关闭弹出层
                layer.close(indexAdd)
            }
        });
    });
    // 编辑弹出层和获取id
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function () {
        // 弹框
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 获取数据并且渲染值
        var id = $(this).attr('data-id');
        $.ajax({
            type: "get",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                form.val('form-edit', res.data)
            }
        });

    });
    // 修表单的提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        // console.log('ok');
        $.ajax({
            type: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return console.log(res.message);
                }
                layer.close(indexEdit)
                layer.msg(res.message);
                intArtCateList();
            }
        });
    });

    // 通过事件代理方式给删除绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message)
                    layer.close(index);
                    intArtCateList()
                }
            });
        });
    });


})