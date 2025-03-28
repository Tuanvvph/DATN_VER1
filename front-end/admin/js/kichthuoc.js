var token = localStorage.getItem("token");
async function loadKichThuoc() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/kich-thuoc/public/all';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${Number(i) + Number(1)}</td>
                    <td>${list[i].ten}</td>
                    <td class="sticky-col">
                        <button data-bs-toggle="modal" data-bs-target="#addtk" onclick="loadAKichThuoc(${list[i].id})" class="btn btn-warning btn-sm">Sửa</button>
                        <button onclick="deleteKichThuoc(${list[i].id})" class="btn btn-danger btn-sm">Xóa</button>
                    </td>
                </tr>`
    }
    document.getElementById("listdata").innerHTML = main
    $('#example').DataTable();
}


function clearData(){
    document.getElementById("idcm").value = ""
    document.getElementById("tencm").value = ""
}


async function loadAKichThuoc(id) {
        var url = 'http://localhost:8080/api/kich-thuoc/admin/findById?id=' + id;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        var result = await response.json();
        document.getElementById("tencm").value = result.ten
        document.getElementById("idcm").value = result.id
}

async function saveKichThuoc() {
    var uls = new URL(document.URL)
    var id = document.getElementById("idcm").value
    var catename = document.getElementById("tencm").value
    var url = 'http://localhost:8080/api/kich-thuoc/admin/create-update';
    var obj = {
        "id": id,
        "ten": catename,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(obj)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "thêm/sửa kích thước thành công!",
                type: "success"
            },
            function() {
                $("#addtk").modal("hide")
                loadKichThuoc();
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function deleteKichThuoc(id) {
    var con = confirm("Bạn chắc chắn muốn xóa kích thước này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/kich-thuoc/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa kích thước thành công!");
        loadKichThuoc();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

