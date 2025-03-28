var token = localStorage.getItem("token");
async function loadGiamGiaDH() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/voucher-donhang/admin/all';
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
                    <td>${list[i].code}</td>
                    <td>${formatmoney(list[i].donToiThieu)}</td>
                    <td>${formatmoney(list[i].giaTriGiam)}</td>
                    <td>${list[i].ngayBatDau}</td>
                    <td>${list[i].ngayKetThuc}</td>
                    <td>${list[i].createdAt}</td>
                    <td>${list[i].updatedAt == null?'':list[i].updatedAt}</td>
                    <td class="sticky-col">
                        <a href="addvoucherdonhang.html?id=${list[i].id}" class="btn btn-warning btn-sm">Sửa</a>
                        <button onclick="deleteVoucher(${list[i].id})" class="btn btn-danger btn-sm">Xóa</button>
                    </td>
                </tr>`
    }
    document.getElementById("listdata").innerHTML = main
    $('#example').DataTable();
}


async function loadAVouhcer() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if (id != null) {
        var url = 'http://localhost:8080/api/voucher-donhang/admin/findById?id=' + id;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        var result = await response.json();
        document.getElementById("code").value = result.code
        document.getElementById("minamount").value = result.donToiThieu
        document.getElementById("discount").value = result.giaTriGiam
        document.getElementById("from").value = result.ngayBatDau
        document.getElementById("to").value = result.ngayKetThuc
    }
}

async function saveVoucher() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");

    var url = 'http://localhost:8080/api/voucher-donhang/admin/create-update';
    var voucher = {
        "id": id,
        "code": document.getElementById("code").value,
        "giaTriGiam": document.getElementById("discount").value,
        "donToiThieu": document.getElementById("minamount").value,
        "ngayBatDau": document.getElementById("from").value,
        "ngayKetThuc": document.getElementById("to").value,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(voucher)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "thêm/sửa voucher thành công!",
                type: "success"
            },
            function() {
                window.location.href = 'giamgiadonhang.html'
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
    var url = 'http://localhost:8080/api/voucher-donhang/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        loadGiamGiaDH();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}



