$(function () {
    //获取数据列表
    const form = layui.form
    const initArtCateList = () => {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) return layer.msg(msg.message)
                const htmlStr = template('tpl-table', res)
                $("tbody").empty().html(htmlStr);
            }
        })
    }

    const layer = layui.layer;
    let index = null
    $("#btnAddCate").click(() => {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                initArtCateList()
                layer.close(index)

            }
        })
    })
    let indexEdit = null
    $('tbody').on('click', '.btnEdit', function () {
        console.log(2);
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html(),
        });
        const id = $(this).attr("data-id");
        // 发起请求获取对应分类的数据
        $.ajax({
            type: 'GET',
            url: "/my/article/cates/" + id,
            success: (res) => {
                if (res.status !== 0) return layer.msg(res.message)
                form.val('form-edit', res.data)
            }
        })
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message)
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })

    $('tbody').on('click', '#btn-deletet', function () {
        console.log(1);
        const id = $(this).attr("data-id");
        layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除分类失败！");
                    }
                    layer.msg("删除分类成功！");
                    layer.close(index);
                    initArtCateList();
                },
            });
        });
    })

    initArtCateList()

})