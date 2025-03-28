function kiemTra(){
    var doncho = localStorage.getItem("doncho");
    if(doncho == null){
        doncho = [];
        window.localStorage.setItem("doncho", JSON.stringify(doncho));
    }
}

function addDonCho(){
    var doncho = localStorage.getItem("doncho");
    doncho = JSON.parse(doncho);
    var obj = {
        "id":Date.now(),
        "hoTen":document.getElementById("hotendc").value,
        "soDienThoai":document.getElementById("sdtdc").value,
        "listSp":[]
    }
    doncho.push(obj);
    window.localStorage.setItem("doncho", JSON.stringify(doncho));
    toastr.success("Thêm đơn chờ thành công");
    loadDonChoSelect();
}

function loadDonChoSelect(){
    var doncho = localStorage.getItem("doncho");
    doncho = JSON.parse(doncho);
    var main = '<option disabled selected value="-1">Chọn khách hàng</option>';
    for(i=0; i< doncho.length; i++){
        main += `<option value="${doncho[i].id}">${doncho[i].hoTen} - ${doncho[i].soDienThoai}</option>`
    }
    document.getElementById("listdoncho").innerHTML = main;
}

var listSpCTCho = [];

function addSpChiTiet(){
    var doncho = localStorage.getItem("doncho");
    doncho = JSON.parse(doncho);
    var selected = document.querySelector('input[name="kichthuocchon"]:checked').value;
    var chiTietSp = null;
    console.log(listSpCTCho);
    for(i=0; i<listSpCTCho.length; i++){
        if(listSpCTCho[i].id == selected){
            chiTietSp = listSpCTCho[i];
        }
    }
    var spCho = {
        "chiTietSp":chiTietSp,
        "soLuong":1,
    }
    var iddoncho = document.getElementById("listdoncho").value;
    if(iddoncho == "-1"){
        toastr.error("Hãy chọn 1 hóa đơn chờ"); return;
    }
    for(i=0; i< doncho.length; i++){
        if(doncho[i].id == iddoncho){
            for(j=0; j< doncho[i].listSp.length; j++){
                if(doncho[i].listSp[j].chiTietSp.id == selected){
                    toastr.error("Đã có sản phẩm này trong đơn chờ");
                    return;
                }
            }
            doncho[i].listSp.push(spCho);
            toastr.success("Đã thêm sản phẩm vào hóa đơn chờ");
        }
    }
    window.localStorage.setItem("doncho", JSON.stringify(doncho));
    loadChiTietHoaDonCho();
}

function loadChiTietHoaDonCho(){
    var doncho = localStorage.getItem("doncho");
    doncho = JSON.parse(doncho);
    var iddoncho = document.getElementById("listdoncho").value;
    var dc = null;
    for(i=0; i<doncho.length; i++){
        if(doncho[i].id == iddoncho){
            dc = doncho[i];
        }
    }
    var main = '';
    var tongTien = 0;
    for(i=0; i<dc.listSp.length; i++){
        tongTien = Number(tongTien) + dc.listSp[i].chiTietSp.gia * dc.listSp[i].soLuong;
        main += 
        `<div class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">${dc.listSp[i].chiTietSp.sanPham.tenSanPham}</h6>
                    <small class="text-muted">${dc.listSp[i].chiTietSp.kichThuoc.ten} / ${dc.listSp[i].chiTietSp.mauSac.ten}</small><br>
                    <small class="text-muted">${formatmoney(dc.listSp[i].chiTietSp.gia)} x ${dc.listSp[i].soLuong}</small>
                </div>
                <div class="d-flex">
                    <button onclick="upAndDownSl(-1, ${dc.id}, ${dc.listSp[i].chiTietSp.id})" class="btnupanddown">-</button>
                    <input type="text" value="${dc.listSp[i].soLuong}" placeholder="Số lượng" class="inputsltaiquay" readonly>
                    <button onclick="upAndDownSl(1, ${dc.id}, ${dc.listSp[i].chiTietSp.id})" class="btnupanddown">+</button>
                </div>
                <div>
                    <button onclick="xoaSp(${dc.id},${dc.listSp[i].chiTietSp.id})" class="btn btn-sm btn-outline-danger">
                        <i class="fa fa-remove"></i>
                    </button>
                </div>
            </div>
        </div>`
    }
    document.getElementById("listspchitiet").innerHTML = main;
    document.getElementById("tongTientam").innerHTML = formatmoney(tongTien);
    tongTiemTam = tongTien;
    loadGiaCuoi();
}


function upAndDownSl(sl, iddoncho, idSpct) {     
    var doncho = localStorage.getItem("doncho");     
    doncho = JSON.parse(doncho);     
    for (let i = 0; i < doncho.length; i++) {         
        if (doncho[i].id == iddoncho) {             
            for (let j = 0; j < doncho[i].listSp.length; j++) {                 
                if (doncho[i].listSp[j].chiTietSp.id == idSpct) {                     
                    doncho[i].listSp[j].soLuong = Number(doncho[i].listSp[j].soLuong) + sl;                     
                    if (doncho[i].listSp[j].soLuong == 0) {                         
                        doncho[i].listSp.splice(j, 1);                       
                        j--; 
                    }                 
                }             
            }         
        }     
    }     
    window.localStorage.setItem("doncho", JSON.stringify(doncho));     
    loadChiTietHoaDonCho(); 
}


function xoaSp(iddoncho, idSpct){
    var con = confirm("Xác nhận xóa sản phẩm chờ");
    if(con == false){
        return;
    }
    var doncho = localStorage.getItem("doncho");     
    doncho = JSON.parse(doncho); 
    for (let i = 0; i < doncho.length; i++) {         
        if (doncho[i].id == iddoncho) {             
            for (let j = 0; j < doncho[i].listSp.length; j++) {                 
                if (doncho[i].listSp[j].chiTietSp.id == idSpct) {                     
                    doncho[i].listSp.splice(j, 1);   
                    window.localStorage.setItem("doncho", JSON.stringify(doncho));     
                    loadChiTietHoaDonCho(); 
                    return;
                }             
            }         
        }     
    }     
}

function changeGiaBan(gia, giacu){
    document.getElementById("giaban").innerHTML = formatmoney(gia)
    if(giacu != null){
        document.getElementById("giacu").innerHTML = formatmoney(giacu)
    }
}


var tongTiemTam = 0;
var giamGiaDh = 0;
async function loadGiamGiaDHTaiQuay() {
    var url = 'http://localhost:8080/api/voucher-donhang/admin/voucher-khadung';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '<option value="-1">--- Chọn khuyến mại ---</option>';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}" discount="${list[i].giaTriGiam}">Giảm: ${formatmoney(list[i].giaTriGiam)}, tối thiểu: ${formatmoney(list[i].donToiThieu)}</option>`
    }
    document.getElementById("listvoucher").innerHTML = main
}

function changeGiamGia(){
    var e = document.getElementById("listvoucher")
    if(document.getElementById("listvoucher").value != -1){
        var selectedOption = e.selectedOptions[0]; 
        giamGiaDh = selectedOption.getAttribute("discount");
    }
    else{
        giamGiaDh = 0;
    }
    if(tongTiemTam != 0){
        loadGiaCuoi();
    }
}

function loadGiaCuoi(){
    document.getElementById("giamgia").innerHTML = formatmoney(giamGiaDh)
    document.getElementById("tongcong").innerHTML = formatmoney(tongTiemTam - giamGiaDh)
}


async function xacNhanBan() {
    var doncho = localStorage.getItem("doncho");     
    doncho = JSON.parse(doncho);     
    var iddoncho = document.getElementById("listdoncho").value;
    var dc = null;
    for(i=0; i<doncho.length; i++){
        if(doncho[i].id == iddoncho){
            dc = doncho[i];
        }
    }
    for(i=0; i<dc.listSp.length; i++){
        var obj = {
            "id":dc.listSp[i].chiTietSp.id
        }
        dc.listSp[i].chiTietSp = obj
    }
    if(document.getElementById("listvoucher").value != -1){
        dc.idVoucher = document.getElementById("listvoucher").value
    }
    var url = 'http://localhost:8080/api/hoadon/admin/create';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(dc)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "Tạo đơn hàng thành công!",
                type: "success"
            },
            function() {
                xoaDonCho(dc.id);
                window.location.reload();
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

function xoaDonCho(iddoncho){
    var doncho = localStorage.getItem("doncho");     
    doncho = JSON.parse(doncho);  
    var remainingArr = doncho.filter(data => data.id != iddoncho);
    window.localStorage.setItem("doncho", JSON.stringify(remainingArr));     
}