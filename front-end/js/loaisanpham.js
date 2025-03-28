async function loadLoaiSanPhamLeft() {
    var url = 'http://localhost:8080/api/loai-san-pham/public/all';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += ` <div class="form-check">
                    <input value="${list[i].id}" class="form-check-input" type="checkbox" name="danhmucsearc">
                    <label class="form-check-label" for="brand3">${list[i].tenLoaiSanPham}</label>
                </div>`
    }
    document.getElementById("listdanhmuc").innerHTML = main
}