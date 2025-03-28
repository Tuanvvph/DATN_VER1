var token = localStorage.getItem("token");
async function loadSanPham() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/sanpham/public/all';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${Number(i) + Number(1)}</td>
                    <td><img class="imgtable" src="${list[i].anh}"></td>
                    <td>${list[i].tenSanPham}</td>
                    <td>${formatmoney(list[i].gia)}</td>
                    <td>${list[i].loaiSanPham.tenLoaiSanPham}</td>
                    <td>${list[i].createdAt}</td>
                    <td>${list[i].updatedAt == null?'':list[i].updatedAt}</td>
                    <td>${list[i].sanPhamChiTiets.length == 0?'Chưa có sản phẩm chi tiết':list[i].sanPhamChiTiets.length}</td>
                    <td class="sticky-col d-flex">
                        <a href="addsanpham.html?id=${list[i].id}" class="btn btn-warning btn-sm">Sửa</a>
                        <button onclick="deleteSanPham(${list[i].id})" class="btn btn-danger btn-sm">Xóa</button>
                        <a href="sanphamchitiet.html?sanpham=${list[i].id}" class="btn btn-warning btn-sm">Chi tiết</a>
                    </td>
                </tr>`
    }
    document.getElementById("listdata").innerHTML = main
    $('#example').DataTable();
}


async function loadASanPham() {
    var id = window.location.search.split('=')[1];
    if (id != null) {
        var url = 'http://localhost:8080/api/sanpham/admin/findById?id=' + id;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            }),
        });
        var result = await response.json();
        document.getElementById("namesp").value = result.tenSanPham
        document.getElementById("price").value = result.gia
        document.getElementById("listcategory").value = result.loaiSanPham.id
        document.getElementById("imgpreproduct").src = result.anh
        linkbanner = result.anh
        tinyMCE.get('editor').setContent(result.moTa)
    }
}


var linkbanner = '';
async function saveProduct() {
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var url = 'http://localhost:8080/api/sanpham/admin/create-update';
    await uploadFile(document.getElementById("imgbanner"));
    var product = {
        "id": id,
        "tenSanPham": document.getElementById("namesp").value,
        "anh": linkbanner,
        "gia": document.getElementById("price").value,
        "moTa": tinyMCE.get('editor').getContent(),
        "loaiSanPham": {
            "id":document.getElementById("listcategory").value
        }
    }
    console.log(product)
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(product)
    });
    var result = await response.json();
    console.log(result)
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "thêm/sửa sản phẩm thành công",
                type: "success"
            },
            function() {
                document.getElementById("loading").style.display = 'none'
                window.location.href = 'sanpham.html';
            });
    } else {
        swal({
                title: "Thông báo",
                text: "thêm/sửa sản phẩm thất bại",
                type: "error"
            },
            function() {
                document.getElementById("loading").style.display = 'none'
            });
    }
}

async function deleteSanPham(id) {
    var con = confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/sanpham/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa sản phẩm thành công!");
        loadSanPham();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}



async function loadCategoryAddProduct() {
    var url = 'http://localhost:8080/api/loai-san-pham/public/all';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].tenLoaiSanPham}</option>`
    }
    document.getElementById("listcategory").innerHTML = main
}


async function uploadFile(filePath) {
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        linkbanner = await res.text();
    }
}