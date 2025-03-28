var token = localStorage.getItem("token");
async function loadSanPhamCT() {
    $('#example').DataTable().destroy();
    var uls = new URL(document.URL)
    var sanpham = uls.searchParams.get("sanpham");
    if(sanpham == null){
        window.location.href = 'sanpham.html'
    }
    var url = 'http://localhost:8080/api/sanpham/admin/findById?id=' + sanpham;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var sp = await res.json();
    document.getElementById("idsp").innerHTML = sp.id
    document.getElementById("tensp").innerHTML = sp.tenSanPham
    document.getElementById("giaban").innerHTML = formatmoney(sp.gia)

    var url = 'http://localhost:8080/api/sanpham-chitiet/public/all?idSp='+sanpham;
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${Number(i) + Number(1)}</td>
                    <td><img class="imgtable" src="${list[i].anh}"></td>
                    <td>${list[i].sanPham.tenSanPham}</td>
                    <td>${formatmoney(list[i].gia)}</td>
                    <td>${list[i].kichThuoc.ten}</td>
                    <td>${list[i].mauSac.ten}</td>
                    <td>${list[i].soLuong}</td>
                    <td class="sticky-col d-flex">
                        <a href="addsanphamchitiet.html?id=${list[i].id}&sanpham=${list[i].sanPham.id}" class="btn btn-warning btn-sm">Sửa</a>
                        <button onclick="deleteSanPhamCT(${list[i].id})" class="btn btn-danger btn-sm">Xóa</button>
                    </td>
                </tr>`
    }
    document.getElementById("listdata").innerHTML = main
    $('#example').DataTable();
}


async function loadASanPhamCT() {
    var uls = new URL(document.URL)
    var sanpham = uls.searchParams.get("sanpham");
    var id = uls.searchParams.get("id");
    if(sanpham == null){
        window.location.href = 'sanpham.html'
    }
    var url = 'http://localhost:8080/api/sanpham/admin/findById?id=' + sanpham;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    var sp = await response.json();
    document.getElementById("price").value = sp.gia

    if (id != null) {
        var url = 'http://localhost:8080/api/sanpham-chitiet/admin/findById?id=' + id;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            }),
        });
        var result = await response.json();
        document.getElementById("price").value = result.gia
        document.getElementById("soluong").value = result.soLuong
        document.getElementById("listmausac").value = result.mauSac.id
        document.getElementById("listkichthuoc").value = result.kichThuoc.id
        document.getElementById("imgpreproduct").src = result.anh
        linkbanner = result.anh
    }
}


var linkbanner = '';
async function saveProductCt() {
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var sanpham = uls.searchParams.get("sanpham");
    var url = 'http://localhost:8080/api/sanpham-chitiet/admin/create-update';
    await uploadFile(document.getElementById("imgbanner"));
    var product = {
        "id": id,
        "gia": document.getElementById("price").value,
        "anh": linkbanner,
        "soLuong": document.getElementById("soluong").value,
        "mauSac": {
            "id":document.getElementById("listmausac").value
        },
        "kichThuoc": {
            "id":document.getElementById("listkichthuoc").value
        },
        "sanPham": {
            "id":sanpham
        },
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
                text: "thêm/sửa chi tiết sản phẩm thành công",
                type: "success"
            },
            function() {
                document.getElementById("loading").style.display = 'none'
                window.location.href = 'sanphamchitiet.html?sanpham='+sanpham;
            });
    } else {
        toastr.error(result.defaultMessage)
        document.getElementById("loading").style.display = 'none'
    }
}

async function deleteSanPhamCT(id) {
    var con = confirm("Bạn chắc chắn muốn xóa sản phẩm chi tiết này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/sanpham-chitiet/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa sản phẩm thành công!");
        loadSanPhamCT();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
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

function chuyenTrang(){
    var uls = new URL(document.URL)
    var sanpham = uls.searchParams.get("sanpham");
    window.location.href = 'addsanphamchitiet.html?sanpham='+sanpham
}

async function loadMauSacSelect() {
    var url = 'http://localhost:8080/api/mau-sac/public/all';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].ten}</option>`
    }
    document.getElementById("listmausac").innerHTML = main
}
async function loadKichThuocSelect() {
    var url = 'http://localhost:8080/api/kich-thuoc/public/all';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].ten}</option>`
    }
    document.getElementById("listkichthuoc").innerHTML = main
}