window.HomeServices = {

renderServices(
container,
dataList
){

container.innerHTML = "";

if(!dataList.length){

container.innerHTML = `

<p style="
text-align:center;
padding:20px;
color:#64748b;
">

Belum ada jasa tersedia

</p>

`;

return;

}

dataList.forEach(data=>{

const harga =
Number(
data.harga || 0
).toLocaleString(
"id-ID"
);

container.innerHTML += `

<div class="provider-card">

<div class="provider-info">

<h3>
${data.namaJasa || "-"}
</h3>

<p>
🏪 ${data.businessName || "-"}
</p>

<p>
📍 ${data.alamat || "-"}
</p>

<p>
💰 Mulai Rp ${harga}
</p>

</div>

<a
href="#"
class="btn-pesan">

Lihat Detail

</a>

</div>

`;

});

}

};
