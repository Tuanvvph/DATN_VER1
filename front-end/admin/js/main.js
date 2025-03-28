const exceptionCode = 417;
var token = localStorage.getItem("token");
$(document).ready(function() {
    checkroleAdmin();
    loadmenu();
    function loadmenu() {
        var user = JSON.parse(localStorage.getItem("user"));
        var menu =
        `   <nav class="mb-4">
            <div class="d-flex align-items-center mb-3">
                <img src="/img/logoDojin Luxury.jpg" alt="Dojin Luxury" class="rounded-circle" width="60" height="60">
                <span class="ms-3 fs-5">Dojin Luxury</span>
            </div>
        </nav>
            <div>
                <div class="">
                    <span style="display:block; text-align:center">Wellcome, ${user.hoTen}</span>
                </div>
                <div class="container-fluid">
                    <a href="taikhoan.html"><button class="navbar-brand mb-0 h2 btn btn-dark w-100 text-light">Quản lý tài khoản</button></a>
                </div>
                <div class="container-fluid">
                    <a href="loaisanpham.html"><button class="navbar-brand btn btn-dark w-100 text-light">Loại sản phẩm</button></a>
                </div>
                <div class="container-fluid">
                        <a class="nav-link" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                            <button class="navbar-brand btn btn-dark w-100 text-light">Quản lý sản phẩm</button>
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="kichthuoc.html">Kích thước</a></li>
                            <li><a class="dropdown-item" href="mausac.html">Màu sắc</a></li>
                            <li><a class="dropdown-item" href="sanpham.html">Danh sách sản phẩm</a></li>
                        </ul>
                </div>
                <div class="container-fluid">
                    <a href="banhang.html"><button class="navbar-brand btn btn-dark w-100 text-light">Bán hàng tại quầy</button></a>
                </div>
                <div class="container-fluid">
                    <a href="hoadon.html"><button class="navbar-brand mb-0 h2 btn btn-dark w-100 text-light">Quản lý hóa đơn</button></a>
                </div>
                <div class="container-fluid">
                    <a href="thongke.html"><button class="navbar-brand mb-0 h2 btn btn-dark w-100 text-light">Thống kê</button></a>
                </div>
                 <div class="container-fluid">
                        <a class="nav-link" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                            <button class="navbar-brand btn btn-dark w-100 text-light">Quản lý giảm giá</button>
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="giamgiadonhang.html">Giảm giá đơn hàng</a></li>
                            <li><a class="dropdown-item" href="giamgiasanpham.html">Giảm giá sản phẩm</a></li>
                        </ul>
                </div>
                <div class="container-fluid">
                    <button onclick="dangXuat()" class="navbar-brand mb-0 h2 btn btn-danger w-100 text-light">
                        Đăng xuất
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                            <path fill-rule="evenodd"
                                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                        </svg>
                    </button>
                </div>
            </div>`
        document.getElementById("menuadmin").innerHTML = menu
    }
});

async function dangXuat() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('../login.html')
}


function formatmoney(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}

async function checkroleAdmin() {
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/user/admin/check-role-admin';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('../login.html')
    }
}