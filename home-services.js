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

Jasa tidak ditemukan

</p>

`;

return;

}

dataList.forEach(data=>{

const harga =
Number(
data.minHarga || 0
).toLocaleString(
"id-ID"
);

const layanan =
(data.layanan || [])
.slice(0,3)
.map(item=>`<li>${item}</li>`)
.join("");

container.innerHTML += `

<div class="provider-card">

<div class="provider-info">

<h3>
🏢 ${data.businessName || "-"}
</h3>

<p>
📍 ${data.alamat || "-"}
</p>

<div
style="
margin-top:8px;
margin-bottom:8px;
">

<b>Layanan:</b>

<ul>
${layanan}
</ul>

</div>

<p>
💰 Mulai Rp ${harga}
</p>

</div>

<a
href="#"
class="btn-pesan">

Lihat Profil

</a>

</div>

`;

});

}

};