
async function loadDetailInvoicePrint() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/hoadon/admin/hdct-by-hoadon?id='+id;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await res.json();
    var main = ''
    var tongTienTam = 0;
    for (i = 0; i < list.length; i++) {
        tongTienTam = Number(tongTienTam) + Number(list[i].gia * list[i].soLuong);
        main += `<tr>
                    <td>${Number(i) + Number(1)}</td>
                    <td>${list[i].sanPhamChiTiet.sanPham.tenSanPham}</td>
                    <td>${list[i].sanPhamChiTiet.kichThuoc.ten}</td>
                    <td>${list[i].sanPhamChiTiet.mauSac.ten}</td>
                    <td>${list[i].soLuong}</td>
                    <td>${formatmoney(list[i].gia)}</td>
                    <td>${formatmoney(list[i].gia * list[i].soLuong)}</td>
                </tr>`
    }
    document.getElementById("listDetailinvoice").innerHTML = main

    var url = 'http://localhost:8080/api/hoadon/admin/find-by-id?id='+id;
    const resp = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await resp.json();
    console.log(result);
    
    document.getElementById("mahoadon").innerHTML = "#"+result.id
    document.getElementById("ngayTao").innerHTML = result.createdAt
    document.getElementById("phiShip").innerHTML = formatmoney(result.phiShip)
    document.getElementById("tongtam").innerHTML = formatmoney(result.tongGia)
    document.getElementById("tongTientt").innerHTML = formatmoney(result.tongGia + result.phiShip)
    if(result.voucherDonHang != null){
        document.getElementById("giamgia").innerHTML = formatmoney(result.voucherDonHang.giaTriGiam)
    }
    if(result.receiverName != null){
        document.getElementById("tenkhachhang").innerHTML = `<p>Khách Hàng</p>
            <span>${result.receiverName}</span>`
    }
}


function formatmoney(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}