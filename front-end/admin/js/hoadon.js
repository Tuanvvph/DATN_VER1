async function loadHoaDon() {
    var start = document.getElementById("start").value
    var end = document.getElementById("end").value
    var type = document.getElementById("type").value
    var trangthai = document.getElementById("trangthai").value
    var url = 'http://localhost:8080/api/hoadon/admin/find-all?size=10';
    if (start != "" && end != "") {
        url += '&from=' + start + '&to=' + end;
    }
    if (type != "") {
        url += '&loaiThanhToan=' + type;
    }
    if (trangthai != "") {
        url += '&trangThai=' + trangthai
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    console.log(list);
    
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].createdAt}</td>
                    <td>${list[i].loaiHoaDon}</td>
                    <td>${formatmoney(list[i].tongGia + list[i].phiShip)}</td>
                    <td>${formatmoney(list[i].phiShip)}</td>
                    <td>
                        <strong>Họ tên</strong>: ${list[i].hoTen}<br>
                        <strong>Số điện thoại</strong>: ${list[i].soDienThoai}<br>
                        <strong>Địa chỉ</strong>: ${list[i].diaChi}<br>
                    </td>
                    <td>${list[i].trangThai}</td>
                    <td>
                        <button onclick="loadDetailInvoice(${list[i].id})" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#orderDetailModal">
                            Chi tiết
                        </button>
                        <a class="btn btn-sm btn-warning" target="_blank" href="in-don.html?id=${list[i].id}">In đơn</a>
                    </td>
                </tr>`
    }
    $('#example').DataTable().destroy();
    document.getElementById("listinvoice").innerHTML = main
    $('#example').DataTable();
}



async function loadDetailInvoice(id) {
    var url = 'http://localhost:8080/api/hoadon/admin/find-by-id?id='+id;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await res.json();
    document.getElementById("ngaydat").innerHTML = result.createdAt
    document.getElementById("trangthaiup").innerHTML = result.trangThai
    document.getElementById("pttt").innerHTML = result.loaiThanhToan
    document.getElementById("hotengh").innerHTML = result.hoTen
    document.getElementById("sdtgh").innerHTML = result.soDienThoai
    document.getElementById("dcgh").innerHTML = result.diaChi
    document.getElementById("tamtinhgia").innerHTML = formatmoney(result.tongGia)
    document.getElementById("phivc").innerHTML = formatmoney(result.phiShip)
    document.getElementById("tongcong").innerHTML = formatmoney(result.phiShip + result.tongGia)
    document.getElementById("giamgiavc").innerHTML = result.voucherDonHang == null?'0đ': formatmoney(result.voucherDonHang.giaTriGiam)

    var btn = "";
    if(result.trangThai == "DANG_CHO_XAC_NHAN"){
        btn = `<button onclick="updateStatus('DA_XAC_NHAN', ${id})" class="btn btn-primary">Xác nhận đơn hàng</button>
                <button onclick="updateStatus('DA_HUY', ${id})" class="btn btn-danger">Hủy đơn hàng</button>`
    }
    else if(result.trangThai == "DA_XAC_NHAN"){
        btn = `<button onclick="updateStatus('DA_GUI', ${id})" class="btn btn-primary">Đã gửi đơn hàng</button>
                <button onclick="updateStatus('DA_HUY', ${id})" class="btn btn-danger">Hủy đơn hàng</button>`
    }
    else if(result.trangThai == "DA_GUI"){
        btn = `<button onclick="updateStatus('DA_NHAN', ${id})" class="btn btn-primary">Đã nhận</button>
                <button onclick="updateStatus('KHONG_NHAN_HANG', ${id})" class="btn btn-danger">Không nhận hàng</button>`
    }


    document.getElementById("divbtnupdate").innerHTML = btn

    var url = 'http://localhost:8080/api/hoadon/admin/hdct-by-hoadon?id='+id;
    const resp = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await resp.json();
    var main = ''
    for(i=0; i< list.length; i++){
        main += `<tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${list[i].sanPhamChiTiet.anh}" alt="Túi xách" style="width: 50px; height: 50px; object-fit: cover" class="me-2">
                            <span>${list[i].sanPhamChiTiet.sanPham.tenSanPham}</span>
                        </div>
                    </td>
                    <td>${formatmoney(list[i].gia)}</td>
                    <td>${list[i].soLuong}</td>
                    <td>${formatmoney(list[i].gia *list[i].soLuong )}</td>
                </tr>`
    }
    document.getElementById("listDetailinvoice").innerHTML = main

}


async function updateStatus(status, id) {
    var url = 'http://localhost:8080/api/hoadon/admin/update-trangthai?id=' + id + '&trangThai=' + status;
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (res.status < 300) {
        toastr.success("Cập nhật trạng thái đơn hàng thành công!");
        loadDetailInvoice(id)
        loadHoaDon();
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}

