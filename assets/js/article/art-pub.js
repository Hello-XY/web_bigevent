$(function () {
    const form = layui.form
    initEditor()
    const initCate = () => {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) return layer.msg('res.message')
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render('select')
            }
        })
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

    $('#btnChooseImage').click(() => {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').change((e) => {
        const files = e.target.files
        if (files.length === 0) return layer.msg('上传文件失败')
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    let art_state = '已发布'
    $('#btnSave2').click((() => {
        art_state = '草稿'
    }))

    $('#form-pub').submit(function (e) {
        e.preventDefault()
        //基于 form 表单，快速创建一个 FormData 对象
        const fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    const publishArticle = (fd) => {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message);
                location.href = '/article/art_list.html'
                window.parent.change()
            }
        })
    }
    initCate()
})