
async function loadTinhShip(){
    var respon = await fetch('http://localhost:8080/api/shipping/public/province', {});
    var provinces = await respon.json();
    provinces = provinces.data
    var main = ``
    for(var i=0; i< provinces.length; i++){
        main += `<option value="${provinces[i].ProvinceID}">${provinces[i].ProvinceName}</option>`
    }
    document.getElementById("listtinh").innerHTML = main
    loadHuyenShip();
}

async function loadHuyenShip(){
    var ProvinceID = document.getElementById("listtinh").value
    var respon = await fetch('http://localhost:8080/api/shipping/public/district?provinceId='+ProvinceID, {});
    var huyens = await respon.json();
    huyens = huyens.data
    var main = `>`
    for(var i=0; i< huyens.length; i++){
        main += `<option value="${huyens[i].DistrictID}">${huyens[i].DistrictName}</option>`
    }
    document.getElementById("listhuyen").innerHTML = main
    loadXaShip();
}

async function loadXaShip(){
    var huyenId = document.getElementById("listhuyen").value
    var respon = await fetch('http://localhost:8080/api/shipping/public/wards?districtId='+huyenId, {});
    var xas = await respon.json();
    xas = xas.data
    var main = ``
    for(var i=0; i< xas.length; i++){
        main += `<option value="${xas[i].WardCode}">${xas[i].WardName}</option>`
    }
    document.getElementById("listxa").innerHTML = main
}

async function loadDiaChi() {
    if(token == null){
        return;
    }
    var url = 'http://localhost:8080/api/diachi/user/all' ;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = ''
    for(i=0; i< list.length; i++){
        main += 
        `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h6 class="mb-1">${list[i].hoTen}</h6>
                        <p class="mb-1">${list[i].soDienThoai}</p>
                        <p class="mb-1">${list[i].chiTiet}, ${list[i].diaChi}</p>
                    </div>
                    <div>
                        <button onclick="loadADiaChi(${list[i].id})" data-bs-toggle="modal" data-bs-target="#addAddressModal" class="btn btn-outline-primary btn-sm me-2">Sửa</button>
                        <button onclick="deletDiaChi(${list[i].id})" class="btn btn-outline-danger btn-sm">Xóa</button>
                    </div>
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("listdiachi").innerHTML = main;
}


async function loadADiaChi(id) {
    var url = 'http://localhost:8080/api/diachi/user/findById?id=' + id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.json();
    document.getElementById("idadduser").value = result.id
    document.getElementById("hotendc").value = result.hoTen
    document.getElementById("sdtdc").value = result.soDienThoai
    document.getElementById("cuthedc").value = result.chiTiet
    document.getElementById("listtinh").value = result.maTinh
    await loadHuyenShip();
    document.getElementById("listhuyen").value = result.maHuyen
    await loadXaShip();
    document.getElementById("listxa").value = result.maXa
}

function clearDuLieu(){
    document.getElementById("idadduser").value = ""
    document.getElementById("hotendc").value = result.hoTen
    document.getElementById("sdtdc").value = result.soDienThoai
    document.getElementById("cuthedc").value = ""
}


async function addAddressUser() {
    var id = document.getElementById("idadduser").value;
    var addu = {
        "id": id,
        "hoTen": document.getElementById("hotendc").value,
        "soDienThoai": document.getElementById("sdtdc").value,
        "chiTiet": document.getElementById("cuthedc").value,
        "diaChi": $('#listxa option:selected').text() + ", "+$('#listhuyen option:selected').text()+", "+$('#listtinh option:selected').text(),
        "maXa": document.getElementById("listxa").value,
        "maHuyen": document.getElementById("listhuyen").value,
        "maTinh": document.getElementById("listtinh").value,
    }
    console.log(addu);
    var url = 'http://localhost:8080/api/diachi/user/create-update';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(addu)
    });
    if (response.status < 300) {
        toastr.success("Thêm địa chỉ thành công");
        loadDiaChi();
        $("#addAddressModal").modal("hide")
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}



async function deletDiaChi(id) {
    var con = confirm("Bạn chắc chắn muốn xóa địa chỉ này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/diachi/user/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        loadDiaChi();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}



async function loadDiaChiCheckout() {
    var url = 'http://localhost:8080/api/diachi/user/all' ;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = ''
    for(i=0; i< list.length; i++){
        main += 
        `
        <option evalue="${list[i].maTinh}" value="${list[i].id}">${list[i].hoTen}, sđt: ${list[i].soDienThoai}, ${list[i].chiTiet}, ${list[i].diaChi}</option>
        `
    }
    document.getElementById("sodiachi").innerHTML = main;
    checkDiaChiHn(document.getElementById("sodiachi"));
}

function checkDiaChiHn(e){
    let selectedOption = e.selectedOptions[0]; 
    var maTinh = selectedOption.getAttribute("evalue"); 
    if(maTinh != '201'){
        phiShip = 35000;
    }
    else{
        phiShip = 30000;
    }
    loadPhiTinhTam();
}