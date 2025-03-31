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


async function taiKhoanDangDangNhap() {
    var url = 'http://localhost:8080/api/user/user/user-logged'
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await res.json();
    console.log(result);
    
    document.getElementById("hotenkh").innerHTML = result.hoTen
    document.getElementById("hotenvalue").value = result.hoTen
    document.getElementById("hotendc").value = result.hoTen
    document.getElementById("sdtvalue").value = result.soDienThoai
    document.getElementById("sdtdc").value = result.soDienThoai
    document.getElementById("emailkh").innerHTML = result.email
    document.getElementById("emailinput").value = result.email
}



async function updateInfor() {
    var url = 'http://localhost:8080/api/user/user/update-infor'
    var user = {
        "fullName": document.getElementById("hotenvalue").value,
        "phone": document.getElementById("sdtvalue").value,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "Cập nhật thông tin thành công",
                type: "success"
            },
            function() {
                window.location.reload();
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json();
        toastr.warning(result.defaultMessage);
    }
}


async function changePassword() {
    var token = localStorage.getItem("token");
    var oldpass = document.getElementById("oldpass").value
    var newpass = document.getElementById("newpass").value
    var renewpass = document.getElementById("renewpass").value
    var url = 'http://localhost:8080/api/user/user/change-password';
    if (newpass != renewpass) {
        alert("mật khẩu mới không trùng khớp");
        return;
    }
    var passw = {
        "oldPass": oldpass,
        "newPass": newpass
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(passw)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "cập nhật mật khẩu thành công, hãy đăng nhập lại",
                type: "success"
            },
            function() {
                window.location.reload();
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}