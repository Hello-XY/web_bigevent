$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').click(function () {
        $('#file').click()
    })
    // 为文件上传框绑定 change 事件
    $('#file').change(function (e) {
        const fileLength = e.target.files.length
        if (fileLength <= 0) return '请上传文件'
        // 1. 拿到用户选择的文件
        const file = e.target.files[0]
        // 2. 将文件，转化为路径
        const imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", imgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })

    $('#btnUpload').click(function () {
        // 1、拿到用户裁切之后的头像
        // 直接复制代码即可
        const dataURL = $image.cropper("getCroppedCanvas", {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100,
        })
            .toDataURL("image/png");
        // 2、发送 ajax 请求，发送到服务器
        $.ajax({
            type: "POST",
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: (res) => {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                window.parent.getUserInfo()

            }
        })
    })
})