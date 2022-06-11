$(function () {
    const form = layui.form
    //自动以验证规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        samePwd: (val) => {
            if (val === $('[name="oldPwd"]').val()) return '新密码不能与旧密码相同'
        },
        rePwd: (val) => {
            if (val !== $('[name="newPwd"]').val()) return '确认密码与新密码不相同'
        }
    })
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success: (res)=>{
                if(res.status!==0) return layer.msg(res.message);
                layer.msg(res.message);
                localStorage.removeItem('token')
                window.parent.location.href='/login.html'
            }
        })
    })

})