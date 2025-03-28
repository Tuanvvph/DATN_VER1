var token = localStorage.getItem("token");
async function loadGiamGiaSp() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/voucher-sanpham/admin/all';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${Number(i) + Number(1)}</td>
                    <td>${list[i].ngayKetThuc}</td>
                    <td>${list[i].loaiGiamGia}</td>
                    <td>${list[i].loaiGiamGia=='CO_DINH'?formatmoney(list[i].giaTriGiam):list[i].giaTriGiam+'%'}</td>
                    <td>${list[i].daHoanThanh == false?'<span class="error">Chưa hoàn thành</span>':'<span class="success">Đã hoàn thành</span>'}</td>
                    <td class="sticky-col d-flex">
                        ${list[i].daHoanThanh == false?`<button onclick="hoanThanhVoucher(${list[i].id})" class="btn btn-warning btn-sm">Hoàn thành</button>`:''}
                        <button onclick="deleteVoucher(${list[i].id})" class="btn btn-danger btn-sm">Xóa</button>
                        <button onclick="loadSanPhamGG(${list[i].id})" data-bs-toggle="modal" data-bs-target="#addtk" class="btn btn-warning btn-sm">Chi tiết</button>
                    </td>
                </tr>`
    }
    document.getElementById("listdata").innerHTML = main
    $('#example').DataTable();
}


async function saveVoucher() {
    var url = 'http://localhost:8080/api/voucher-sanpham/admin/create';
    if($("#listdpar").val().length == 0){
        toastr.error("Chọn ít nhất 1 sản phẩm");return;
    }
    var obj = {
        "voucherSanPham":{
            "ngayKetThuc": document.getElementById("ngaykt").value,
            "giaTriGiam": document.getElementById("discount").value,
            "daHoanThanh": false,
            "loaiGiamGia": document.getElementById("loaigiam").value,
        },
        "idProducts":$("#listdpar").val()
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
                text: "thêm/sửa voucher thành công!",
                type: "success"
            },
            function() {
                window.location.href = 'giamgiasanpham.html'
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.error(result.defaultMessage);
    }
}

async function deleteVoucher(id) {
    var con = confirm("Bạn chắc chắn muốn xóa voucher này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/voucher-sanpham/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        loadGiamGiaSp();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function hoanThanhVoucher(id) {
    var con = confirm("Bạn chắc chắn muốn hoàn thành voucher này? Hành động không thể khôi phục");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/voucher-sanpham/admin/hoanthanh?id=' + id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Thành công!");
        loadGiamGiaSp();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function loadSanPhamSelect() {
    var url = 'http://localhost:8080/api/sanpham/public/all';
    const response = await fetch(url, {
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].tenSanPham}</option>`
    }
    document.getElementById("listdpar").innerHTML = main
    const ser = $("#listdpar");
    ser.select2({
        placeholder: "Chọn danh sách sản phẩm giảm giá",
    });
}

async function loadSanPhamGG(id) {
    $('#examplegg').DataTable().destroy();
    var url = 'http://localhost:8080/api/voucher-sanpham/admin/sanpham-giamgia?id='+id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
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
                </tr>`
    }
    document.getElementById("listdatagg").innerHTML = main
    $('#examplegg').DataTable();
}