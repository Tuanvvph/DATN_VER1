var tongGioHang = 0;

async function loadGiamGiaDH() {
    var url = 'http://localhost:8080/api/voucher-donhang/user/voucher-khadung';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = `<option disabled selected value="-1">--- Có ${list.length} voucher khả dụng ---</option>`;
    for (i = 0; i < list.length; i++) {
        main += `<option evalue="${list[i].giaTriGiam}" value="${list[i].code}">${list[i].code} - giảm ${formatmoney(list[i].giaTriGiam)} - đơn tối thiểu: ${formatmoney(list[i].donToiThieu)}</option>`
    }
    document.getElementById("voucher").innerHTML = main
}

function changeGiamGia(e){
    let selectedOption = e.selectedOptions[0]; // Lấy option đang được chọn
    giamGia = selectedOption.getAttribute("evalue"); // Lấy giá trị evalue
    loadPhiTinhTam();
}
