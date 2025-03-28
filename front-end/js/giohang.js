async function addCart(type) {
    if(token == null){
        toastr.error("Bạn chưa đăng nhập");
        return
    }
    var selected = document.querySelector('input[name="kichthuocchon"]:checked');
    if (selected) {
        var idSpct = selected.value
        var quantity = document.getElementById("quantity").value
        var url = 'http://localhost:8080/api/giohang/user/create?spctId='+idSpct+"&quantity="+quantity;
        const response = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        });
        if (response.status < 300) {
            toastr.success("Thêm giỏ hàng thành công!");
            loadCartMenu();
            if(type == 0){
                window.location.href = 'thanhtoan.html'
            }
        }
        else {
            toastr.erorr("Thêm giỏ hàng thất bại!");
        }

    } else {
        toastr.error("Hãy chọn kích thước sản phẩm!");
        return null;
    }
}



async function loadCartCheckout() {
    if(token == null){
        return;
    }
    var url = 'http://localhost:8080/api/giohang/user/my-cart' ;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status > 300){
        return;
    }
    var list = await response.json();
    console.log(list);
    
    var main = ''
    for(i=0; i< list.length; i++){
        main += 
        `<div class="mb-4">
            <div class="d-flex align-items-center mb-3">
                <img src="${list[i].sanPhamChiTiet.anh}" alt="Túi xách" style="width: 60px; height: 60px; object-fit: cover" class="me-3">
                <div>
                    <h6 class="mb-0">${list[i].sanPhamChiTiet.sanPham.tenSanPham}</h6>
                    <small class="text-muted">Số lượng: ${list[i].soLuong}</small>
                </div>
                <div class="ms-auto">
                    <span class="fw-bold">${formatmoney(list[i].sanPhamChiTiet.gia *list[i].soLuong )}</span>
                </div>
            </div>
        </div>
        `
        tongGioHang = Number(tongGioHang) + list[i].soLuong * list[i].sanPhamChiTiet.gia;
    }
    document.getElementById("listcartcheckout").innerHTML = main;
    loadPhiTinhTam();
}