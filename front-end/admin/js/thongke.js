async function thongke() {
    var url = 'http://localhost:8080/api/thongke/admin/revenue-this-month';
    const response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.text();
    document.getElementById("doanhThu").innerHTML = formatmoney(result)

    var url = 'http://localhost:8080/api/thongke/admin/number-invoice-today';
    const respon = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await respon.text();
    document.getElementById("donhomnay").innerHTML = (result)


    var url = 'http://localhost:8080/api/thongke/admin/number-user';
    const res = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await res.text();
    document.getElementById("soLuongNV").innerHTML = result


    var url = 'http://localhost:8080/api/thongke/admin/number-product';
    const resp = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await resp.text();
    document.getElementById("soLuongMH").innerHTML = result




}


async function revenueYear(nam) {
    if (nam < 2000) {
        nam = new Date().getFullYear()
    }
    var url = 'http://localhost:8080/api/thongke/admin/revenue-year?year=' + nam;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    console.log(list)
    var main = '';
    for (i = 0; i < list.length; i++) {
        if (list[i] == null) {
            list[i] = 0
        }
    }


    var lb = 'doanh thu năm ' + nam;
    document.getElementById("chartdiv").innerHTML = '';
    document.getElementById("chartdiv").innerHTML = `<canvas id="chart"></canvas>`
    const ctx = document.getElementById("chart").getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["tháng 1", "tháng 2", "tháng 3", "tháng 4",
                "tháng 5", "tháng 6", "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"
            ],
            datasets: [{
                label: lb,
                backgroundColor: 'rgba(161, 198, 247, 1)',
                borderColor: 'rgb(47, 128, 237)',
                data: list,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value) {
                            return formatmoney(value);
                        }
                    }
                }]
            }
        },
    });
}

function loadByNam() {
    var nam = document.getElementById("nams").value;
    revenueYear(nam);
}


async function danhMucBan() {
    var url = 'http://localhost:8080/api/thongke/admin/soluongbandanhmuc';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    console.log(list);
    
    var lb = []
    var datas = []
    var bg = [];
    var main = '';
    for (i = 0; i < list.length; i++) {
        if (list[i] == null) {
            list[i] = 0
        }
        lb.push(list[i].tenLoaiSanPham)
        datas.push(list[i].soLuong)
        bg.push(getRandomColor())
    }


    const productChart = new Chart(document.getElementById('productChart'), {
        type: 'doughnut',
        data: {
            labels: lb,
            datasets: [{
                data: datas,
                backgroundColor: bg
            }]
        }
    });
}

function getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
}