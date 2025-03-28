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
