async function loadAllUser() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/user/admin/get-user-by-role';
    var role = document.getElementById("role").value
    if (role != "") {
        url += '?role=' + role
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var listUser = await response.json();
    console.log();
    var main = '';
    for (i = 0; i < listUser.length; i++) {
        var btn = '';
        if (listUser[i].trangThai == false) {
            btn = `<button onclick="lockOrUnlock(${listUser[i].id},0)" class="btn btn-danger btn-sm"><i class="fa fa-unlock"></i> mở khóa</button>`
        } 
        else {
            btn = `<button onclick="lockOrUnlock(${listUser[i].id},1)" class="btn btn-primary btn-sm"><i class="fa fa-lock"></i> Khóa</button>`
        }
        if (listUser[i].quyen.tenQuyen == "ROLE_ADMIN") {
            btn = ''
        }
        main += `<tr>
                    <td>${listUser[i].id}</td>
                    <td>${listUser[i].email}</td>
                    <td>${listUser[i].hoTen}</td>
                    <td>${listUser[i].soDienThoai}</td>
                    <td>${listUser[i].trangThai == true?`<p class="danghoatdong">Đang hoạt động</p>`:'<span class="dakhoatk">Đã khóa</span>'}</td>
                    <td>${listUser[i].quyen.tenQuyen}
                    <i onclick="setRole(${listUser[i].id}, '${listUser[i].quyen.tenQuyen}')" data-bs-toggle="modal" data-bs-target="#modalrole" class="fa fa-edit iconaction"></i>
                    </td>
                    <td class="d-flex chucnangtd">
                        <button class="btn btn-warning btn-sm">Sửa</button>
                        <button onclick="deleteUser(${listUser[i].id})" class="btn btn-danger btn-sm">Xóa</button>
                        ${btn}
                    </td>
                </tr>`
    }
    document.getElementById("listdata").innerHTML = main
    $('#example').DataTable();
}

async function lockOrUnlock(id, type) {
    var con = confirm("Xác nhận hành động?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/user/admin/lockOrUnlockUser?id=' + id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        var mess = '';
        if (type == 1) {
            mess = 'Khóa thành công'
        } else {
            mess = 'Mở khóa thành công'
        }
        swal({
                title: "Thông báo",
                text: mess,
                type: "success"
            },
            function() {
                loadAllUser();
            });
    } else {
        swal({
                title: "Thông báo",
                text: "hành động thất bại",
                type: "error"
            },
            function() {
                loadAllUser();
            });
    }
}


async function addAdmin() {
    var url = 'http://localhost:8080/api/admin/addaccount'
    var fullname = document.getElementById("fullname").value
    var phone = document.getElementById("phone").value
    var email = document.getElementById("email").value
    var password = document.getElementById("pass").value
    var repassword = document.getElementById("repass").value
    var user = {
        "fullname": fullname,
        "phone": phone,
        "email": email,
        "password": password

    }
    if (password != repassword) {
        alert("Mật khẩu không trùng khớp")
        return;
    }
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await res.json();
    if (res.status < 300) {
        swal({
                title: "Thông báo",
                text: "Tạo tài khoản thành công!",
                type: "success"
            },
            function() {
                window.location.reload();
            });
    }
    if (res.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }
}

function setRole(id, role){
    document.getElementById("idacc").value = id
    document.getElementById("rolechange").value = role
}


async function changerole() {
    var id = document.getElementById("idacc").value
    var role = document.getElementById("rolechange").value
    var url = 'http://localhost:8080/api/user/admin/change-role?id=' + id+'&role='+role;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Thành công!");
        loadAllUser();
    } else {
        toastr.error("Thất bại");
    }
}



async function deleteUser(id) {
    var con = confirm("Bạn chắc chắn muốn xóa tài khoản này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/user/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Thành công!");
        loadAllUser();
    } else {
        var result = await response.json();
        toastr.error(result.defaultMessage);
    }
}