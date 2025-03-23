var token = localStorage.getItem("token");
async function loadLoaiSanPham() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/loai-san-pham/public/all';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${Number(i) + Number(1)}</td>
                    <td>${list[i].tenLoaiSanPham}</td>
                    <td>${list[i].createdAt}</td>
                    <td>${list[i].updatedAt == null?'':list[i].updatedAt}</td>
                    <td class="sticky-col">
                        <button data-bs-toggle="modal" data-bs-target="#addtk" onclick="loadACategory(${list[i].id})" class="btn btn-warning btn-sm">Sửa</button>
                        <button onclick="deleteCategory(${list[i].id})" class="btn btn-danger btn-sm">Xóa</button>
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


async function loadACategory(id) {
        var url = 'http://localhost:8080/api/loai-san-pham/admin/findById?id=' + id;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        var result = await response.json();
        document.getElementById("tencm").value = result.tenLoaiSanPham
        document.getElementById("idcm").value = result.id
}

async function saveCategory() {
    var uls = new URL(document.URL)
    var id = document.getElementById("idcm").value
    var catename = document.getElementById("tencm").value
    var url = 'http://localhost:8080/api/loai-san-pham/admin/create-update';
    var category = {
        "id": id,
        "tenLoaiSanPham": catename,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(category)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "thêm/sửa danh mục thành công!",
                type: "success"
            },
            function() {
                $("#addtk").modal("hide")
                loadLoaiSanPham();
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function deleteCategory(id) {
    var con = confirm("Bạn chắc chắn muốn xóa loại sản phẩm này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/loai-san-pham/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa danh mục thành công!");
        loadLoaiSanPham();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}



async function loadCategoryAddProduct() {
    var url = 'http://localhost:8080/api/category/public/all-category';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("listcategory").innerHTML = main
}