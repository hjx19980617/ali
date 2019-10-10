$("#userForm").on("submit", function() {
        var formData = $(this).serialize()
        $.ajax({
            type: "post",
            url: "/users",
            data: formData,
            success: function(response) {
                location.reload()
            },
            error: function() {
                alert("添加失败")
            }
        });
        return false;
    })
    // $("#avatar").on("change", function() {
    //     //$(this)是一个数组,里面包括this
    //     // console.dir(this); //this指向$("#avatar")
    //     // console.log($(this));
    //     var formData = new FormData()
    //     formData.append("avatar", this.files[0])
    //     $.ajax({
    //         type: "post",
    //         url: "/upload",
    //         data: formData,
    //         //processData是告诉$.ajax不要解析请求参数,$.ajax会把参数改为属性名=属性值&属性名=属性值
    //         //当前我们需要做的是二进制文件上传,是不需要ajax内部解析的
    //         processData: false,
    //         //contentType是告诉$.ajax不要设置请求参数的类型,参数类型已经在formData中设置了
    //         contentType: false,
    //         success: function(res) {
    //             //res是图片的路径
    //             // console.log(res);
    //             // console.log(res[0].avatar);
    //             // avatar: "\uploads\upload_6e2b32907e2d9dd386d55c43f1f834d4.jpg"
    //             $("#preview").attr("src", res[0].avatar)
    //             $("#hiddenAvatar").val(res[0].avatar)
    //         }
    //     })
    // })
$("#modifyBox").on("change", "#avatar", function() {
    var formData = new FormData()
    formData.append("avatar", this.files[0])
    $.ajax({
        type: "post",
        url: "/upload",
        data: formData,
        processData: false,
        contentType: false,
        success: function(res) {
            $("#preview").attr("src", res[0].avatar)
            $("#hiddenAvatar").val(res[0].avatar)
        }
    })
})
$.ajax({
    type: "get",
    url: "/users",
    success: function(res) {
        var html = template("userTpl", { data: res })
        $("#userBox").html(html)
    }
})
$("#userBox").on("click", ".edit", function() {
    var id = $(this).attr("data-id")
    $.ajax({
        type: "get",
        url: "/users/" + id,
        success: function(res) {
            var html = template("modifyTpl", res)
            $("#modifyBox").html(html)
        }
    })
})
$("#modifyBox").on("submit", "#modifyForm", function() {
    var formData = $(this).serialize()
    var id = $(this).attr("data-id")
    $.ajax({
        type: "put",
        url: "/users/" + id,
        data: formData,
        success: function() {
            location.reload()
        }
    })
    return false
})
$("#userBox").on("click", ".delete", function() {
    if (confirm("您确认删除用户吗")) {
        var id = $(this).attr("data-id")
        $.ajax({
            type: "delete",
            url: "/users/" + id,
            success: function() {
                location.reload()
            }
        })
    }
})
var deleteMany = $("#deleteMany")
$("#selectAll").on("change", function() {
    var status = $(this).prop("checked")
    if (status) {
        deleteMany.show()
    } else {
        deleteMany.hide()
    }
    $("#userBox").find("input").prop("checked", status)
})
$("#userBox").on("change", ".userStatus", function() {
    var inputs = $("#userBox").find("input")
    if (inputs.length == inputs.filter(":checked").length) {
        $("#selectAll").prop("checked", true)
    } else {
        $("#selectAll").prop("checked", false)
    }
    if (inputs.filter(":checked").length > 0) {
        deleteMany.show()
    } else {
        deleteMany.hide()
    }
})
deleteMany.on("click", function() {
    var ids = []
    var checkedUser = $("#userBox").find("input").filter(":checked")
        // console.log(checkedUser);
    checkedUser.each(function(index, element) {
            ids.push($(element).attr("data-id"))
        })
        // console.log(ids);
    if (confirm("您确认批量删除用户吗")) {
        $.ajax({
            type: "delete",
            url: "/users/" + ids.join("-"),
            success: function() {
                location.reload()
            }
        })
    }
})