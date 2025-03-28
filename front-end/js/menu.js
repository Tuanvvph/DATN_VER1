var token = localStorage.getItem("token");
const exceptionCode = 417;
var tokenFcm = "";
async function loadMenu() {
    var dn = `<a href="login.html" class="btn btn-primary">Đăng nhập</a>`
    var giohang = '';
    if (token != null) {
        var user = JSON.parse(localStorage.getItem("user"));
        dn = `<div class="dropdown me-3">
                        <a class="btn btn-outline-dark dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-user"></i> ${user.hoTen}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="account.html"><i class="fas fa-user-circle me-2"></i>Tài khoản</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li onclick="logout()"><a class="dropdown-item text-danger" href="#"><i class="fas fa-sign-out-alt me-2"></i>Đăng xuất</a></li>
                        </ul>
                    </div>`
        giohang = `<a href="#" class="btn btn-outline-dark me-2 position-relative" data-bs-toggle="modal" data-bs-target="#cartModal">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="slcartmenu">
                            0
                        </span>
                    </a>`
    }

    var menu =
        `
        <div class="container">
            <a class="navbar-brand" href="index.html">Dojin Luxury</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <!-- Thêm form tìm kiếm -->
                <form class="d-flex me-auto ms-4">
                    <div class="input-group">
                        <input class="form-control" type="search" placeholder="Tìm kiếm sản phẩm..." aria-label="Search" style="min-width: 300px;">
                        <button class="btn btn-outline-dark" type="submit">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </form>

                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link active" href="#">Trang chủ</a></li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            Danh mục
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Túi xách tay</a></li>
                            <li><a class="dropdown-item" href="#">Túi đeo chéo</a></li>
                            <li><a class="dropdown-item" href="#">Túi đeo vai</a></li>
                            <li><a class="dropdown-item" href="#">Balo</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="#">Giới thiệu</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Liên hệ</a></li>
                </ul>
                
                <div class="d-flex align-items-center">
                    <button type="button" class="btn btn-outline-dark me-2" data-bs-toggle="modal" data-bs-target="#orderTrackingModal">
                        <i class="fas fa-truck me-1"></i> Tra cứu đơn hàng
                    </button>
                    ${giohang}
                    ${dn}
                </div>
            </div>
        </div>

        <div class="modal fade" id="orderTrackingModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Tra cứu đơn hàng</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="orderNumber" class="form-label">Mã đơn hàng</label>
                            <input type="text" class="form-control" id="orderNumber" placeholder="Nhập mã đơn hàng của bạn">
                        </div>
                        <div class="mb-3">
                            <label for="phoneNumber" class="form-label">Số điện thoại</label>
                            <input type="tel" class="form-control" id="phoneNumber" placeholder="Nhập số điện thoại đặt hàng">
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Tra cứu</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="cartModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Giỏ hàng của bạn</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <!-- Danh sách sản phẩm trong giỏ -->
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Tổng</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="listcart">
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="/SanPham/img/1.jpg" alt="Túi xách" style="width: 50px; height: 50px; object-fit: cover" class="me-2">
                                            <span>Túi xách thời trang</span>
                                        </div>
                                    </td>
                                    <td>1,200,000đ</td>
                                    <td>
                                        <div class="input-group" style="width: 120px">
                                            <button class="btn btn-outline-secondary btn-sm">-</button>
                                            <input type="text" class="form-control text-center" value="1">
                                            <button class="btn btn-outline-secondary btn-sm">+</button>
                                        </div>
                                    </td>
                                    <td>1,200,000đ</td>
                                    <td>
                                        <button class="btn btn-outline-danger btn-sm">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Tổng tiền -->
                    <div class="d-flex justify-content-end">
                        <div class="text-end">
                            <p class="mb-2">Tạm tính: <strong id="tongtamcart">0đ</strong></p>
                            <p class="mb-2">Phí vận chuyển: <strong>30,000đ</strong></p>
                            <h5>Tổng cộng: <span class="text-danger" id="tongtien">30,000đ</span></h5>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tiếp tục mua sắm</button>
                    <a href="checkout.html" class="btn btn-primary">Tiến hành thanh toán</a>
                </div>
            </div>
        </div>
    </div>
    `
    document.getElementById("menu").innerHTML = menu
    try { loadFooter(); } catch (error) {}
    loadCartMenu();
}




function loadFooter() {
    var foo = ` <div class="container">
            <div class="row">
                <div class="col-md-3">
                    <h5>Dojin Luxury</h5>
                    <p>Chuyên cung cấp các sản phẩm thời trang cao cấp</p>
                </div>
                <div class="col-md-3">
                    <h5>Liên kết nhanh</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-light">Trang chủ</a></li>
                        <li><a href="#" class="text-light">Sản phẩm</a></li>
                        <li><a href="#" class="text-light">Giới thiệu</a></li>
                        <li><a href="#" class="text-light">Liên hệ</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5>Liên hệ</h5>
                    <ul class="list-unstyled">
                        <li><i class="fas fa-map-marker-alt me-2"></i>123 Đường ABC, Quận XYZ, TP.HCM</li>
                        <li><i class="fas fa-phone me-2"></i>0123 456 789</li>
                        <li><i class="fas fa-envelope me-2"></i>info@dojinluxury.com</li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5>Theo dõi chúng tôi</h5>
                    <div class="d-flex gap-3">
                        <a href="#" class="text-light"><i class="fab fa-facebook fa-lg"></i></a>
                        <a href="#" class="text-light"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="text-light"><i class="fab fa-twitter fa-lg"></i></a>
                    </div>
                </div>
            </div>
        </div>`
    document.getElementById("footer").innerHTML = foo;
}

async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('login.html')
}


function formatmoney(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}

async function loadCartMenu() {
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
    document.getElementById("slcartmenu").innerHTML = list.length;
    var main = ''
    var tong = 0;
    for(i=0; i< list.length; i++){
        main += 
        `<tr>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${list[i].sanPhamChiTiet.anh}" alt="Túi xách" style="width: 50px; height: 50px; object-fit: cover" class="me-2">
                    <span>${list[i].sanPhamChiTiet.sanPham.tenSanPham}</span>
                </div>
                <span>${list[i].sanPhamChiTiet.mauSac.ten} / ${list[i].sanPhamChiTiet.kichThuoc.ten}</span>
            </td>
            <td>${formatmoney(list[i].sanPhamChiTiet.gia)}</td>
            <td>
                <div class="input-group" style="width: 120px">
                    <button onclick="upDownQuantity(${list[i].id},'DOWN')" class="btn btn-outline-secondary btn-sm">-</button>
                    <input type="text" class="form-control text-center" value="${list[i].soLuong}">
                    <button onclick="upDownQuantity(${list[i].id},'UP')" class="btn btn-outline-secondary btn-sm">+</button>
                </div>
            </td>
            <td>${formatmoney(list[i].soLuong * list[i].sanPhamChiTiet.gia)}</td>
            <td>
                <button onclick="removeCart(${list[i].id})" class="btn btn-outline-danger btn-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>`
        tong = Number(tong) + list[i].soLuong * list[i].sanPhamChiTiet.gia;
    }
    if(list.length == 0){
        main = `<tr><td colspan="4">Chưa có sản phẩm nào trong giỏ hàng</td></tr>`
    }
    document.getElementById("listcart").innerHTML = main;
    document.getElementById("tongtamcart").innerHTML = formatmoney(tong);
    document.getElementById("tongtien").innerHTML = formatmoney(tong + 30000);
}



async function removeCart(id) {
    var con = confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/giohang/user/delete?id='+id ;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        loadCartMenu();
    }
}


async function upDownQuantity(id, type) {
    var url = 'http://localhost:8080/api/giohang/user/down-cart?id='+id ;
    if(type == "UP"){
        url = 'http://localhost:8080/api/giohang/user/up-cart?id='+id ;
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        loadCartMenu();
    }
}
