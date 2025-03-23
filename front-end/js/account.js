async function login() {
    var url = 'http://localhost:8080/api/user/login/email'
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var user = {
        "email": username,
        "password": password
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.json();
    if (response.status < 300) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        if (result.user.quyen.tenQuyen === "ROLE_ADMIN") {
            window.location.href = 'admin/loaisanpham.html';
        }
        if (result.user.quyen.tenQuyen === "ROLE_USER") {
            window.location.href = 'index.html';
        }
    }
    if (response.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }
}

async function regis() {
    var url = 'http://localhost:8080/api/user/public/regis'
    var email = document.getElementById("email").value
    var fullname = document.getElementById("fullname").value
    var phone = document.getElementById("phone").value
    var password = document.getElementById("password").value
    if(document.getElementById("terms").checked == false){
        toastr.warning("Hãy đồng ý với điều khoản trước khi đăng ký")
        return;
    }
    var user = {
        "fullName": fullname,
        "email": email,
        "phone": phone,
        "password": password
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await response.json();
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "đăng ký tài khoản thành công",
                type: "success"
            },
            function() {
                window.location.href = 'login.html'
            });
    }
    if (response.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }
}


async function forgorPassword() {
    var email = document.getElementById("email").value
    var url = 'http://localhost:8080/api/user/public/quen-mat-khau?email=' + email
    const res = await fetch(url, {
        method: 'POST'
    });
    if (res.status < 300) {
        swal({
                title: "",
                text: "mật khẩu mới đã được gửi về email của bạn",
                type: "success"
            },
            function() {
                window.location.replace("login.html")
            });
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}