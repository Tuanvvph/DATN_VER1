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


async function loadSanPhamTaiQuay() {
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
                    <td>${list[i].tenSanPham}</td>
                    <td>${formatmoney(list[i].gia)}</td>
                    <td>${list[i].loaiSanPham.tenLoaiSanPham}</td>
                    <td>${list[i].createdAt}</td>
                    <td>${list[i].updatedAt == null?'':list[i].updatedAt}</td>
                    <td>${list[i].sanPhamChiTiets.length == 0?'Chưa có sản phẩm chi tiết':list[i].sanPhamChiTiets.length}</td>
                    <td class="sticky-col">
                        ${list[i].sanPhamChiTiets.length == 0 ?'':`<button onclick="loadAProductCT(${list[i].id})" data-bs-toggle="modal" data-bs-target="#modalCtSP" class="btn btn-primary" >Chi tiết</button>`}
                    </td>
                </tr>`
    }
    document.getElementById("listdatasp").innerHTML = main
    $('#example').DataTable();
}



async function loadAProductCT(id) {
    var url = 'http://localhost:8080/api/sanpham-chitiet/public/all?idSp=' + id;
    const response = await fetch(url, {
    });
    var result = await response.json();
    listspct = result;
    listSpCTCho = result;
    const colors = Array.from(
        new Map(listspct.map(item => [item.mauSac.id, item.mauSac])).values()
    );
    
    var main = '';
    for (let i = 0; i < colors.length; i++) {
        main += `<div class="form-check">
                    <input class="form-check-input" type="radio" name="choncolor" id="color${colors[i].id}" 
                        value="${colors[i].id}" ${i == 0 ? 'checked' : ''} onchange="filterProductsByColor(this.value)">
                    <label class="form-check-label" for="color${colors[i].id}">${colors[i].ten}</label>
                </div>`;
    }
    filterProductsByColor(colors[0].id);
    document.getElementById("listmausac").innerHTML = main;
    document.getElementById("giaban").innerHTML = formatmoney(listspct[0].gia)
    if(listspct[0].giaCu != null){
        document.getElementById("giacu").innerHTML = formatmoney(listspct[0].giaCu)
    }
}


var listspct = [];
function filterProductsByColor(colorId) {
    var filteredProducts = listspct.filter(item => item.mauSac.id == colorId);
    console.log(filteredProducts); 
    renderProductList(filteredProducts);
}


function renderProductList(listCt) {
    var content = '';
    for (j=0; j<listCt.length; j++) {
        content += `<div class="form-check">
                        <input value="${listCt[j].id}" ${listCt[j].soLuong <= 0?'disabled':''} onchange="changeGiaBan(${listCt[j].gia}, ${listCt[j].giaCu})" class="form-check-input" type="radio" name="kichthuocchon" id="size${listCt[j].kichThuoc.id}" ${j==0 && listCt[j].soLuong > 0?'checked':''}>
                        <label class="form-check-label" for="size${listCt[j].kichThuoc.id}">${listCt[j].kichThuoc.ten} <span class="slcondetail">(${listCt[j].soLuong})</span></label>
                    </div>`;
    }
    document.getElementById("listikchthuoc").innerHTML = content;
    document.getElementById("giaban").innerHTML = formatmoney(listCt[0].gia)
    if(listCt[0].giaCu != null){
        document.getElementById("giacu").innerHTML = formatmoney(listCt[0].giaCu)
    }
}

