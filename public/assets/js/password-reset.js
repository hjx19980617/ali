$("#modifyForm").on("submit", function() {
    var formData = $(this).serialize()
    $.ajax({
        type: "put",
        url: "/users/password",
        data: formData,
        success: function() {
            location.href = "login.html"
        }
    })
    return false
})