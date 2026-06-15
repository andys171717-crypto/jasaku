window.HomeServices = {

renderServices(
container,
dataList
){

container.innerHTML = "";

if(dataList.length === 0){

container.innerHTML = `

<p style="
text-align:center;
padding:20px;
color:#64748b;
">

Jasa tidak ditemukan

</p>

`;

return;

}

dataList.forEach(data=>{

container.innerHTML += `

<div class="provider-card">

<div class="provider-info">

<h3>${data.namaJasa}</h3>

<p>${data.kategori}</p>

<p>Rp ${data.harga}</p>

</div>

<a
href="detail.html?id=${data.id}"
class="btn-pesan">

Lihat

</a>

</div>

`;

});

}

};