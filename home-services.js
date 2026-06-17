const badgeStyle = document.createElement("style");

badgeStyle.innerHTML = `

.service-badge{
display:inline-block;
padding:4px 10px;
border-radius:999px;
font-size:11px;
font-weight:700;
margin-bottom:10px;
}

.service-badge.express{
background:#fef3c7;
color:#92400e;
}

.service-badge.scheduled{
background:#dbeafe;
color:#1e40af;
}

.service-badge.both{
background:#dcfce7;
color:#166534;
}

`;

document.head.appendChild(
badgeStyle
);

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

${
data.serviceType === "express"
? `
<div class="service-badge express">
⚡ EKSPRES
</div>
`
: data.serviceType === "scheduled"
? `
<div class="service-badge scheduled">
📅 TERJADWAL
</div>
`
: data.serviceType === "both"
? `
<div class="service-badge both">
⚡📅 EKSPRES & TERJADWAL
</div>
`
: ""
}

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
href="detail.html?id=${data.id}"
class="btn-pesan">

Lihat Detail

</a>

</div>

`;

});

}

};
