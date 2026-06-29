import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
getFirestore,
collection,
query,
where,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

import {
getAuth,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyCnk56ZY63q2h1ewEdiivzB0rrSfJOJtYo",
authDomain: "jasaku-92b55.firebaseapp.com",
projectId: "jasaku-92b55",
storageBucket: "jasaku-92b55.firebasestorage.app",
messagingSenderId: "217601622524",
appId: "1:217601622524:web:e3bc48dbdc50d7cb10b279"
};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

async function loadRequests(userId){

const container =
document.getElementById(
"requestsList"
);

container.innerHTML = "";

const q =
query(
collection(db,"requests"),
where(
"userId",
"==",
userId
)
);

const snapshot =
await getDocs(q);

const requests =
snapshot.docs
.sort(
(a,b)=>
(b.data().createdAt || 0) -
(a.data().createdAt || 0)
);

if(requests.length === 0){

container.innerHTML = `

<div class="empty-card">

<h2>
Belum Ada Aktivitas
</h2>

<p>
Aktivitas layanan Anda akan muncul di halaman ini.
</p>

</div>

`;

return;

}

requests.forEach((doc)=>{

const data =
doc.data();

container.innerHTML += `

<div class="request-card">

<div class="request-code">

<div class="code-label">
Kode Aktivitas
</div>

<div class="code-value">
${data.requestCode || "-"}
</div>

</div>

<h2>
${data.namaJasa}
</h2>

<div class="status">
${data.status}
</div>

<div class="request-info">

<p>
<b>Tanggal:</b>
${data.tanggal}
</p>

<p>
<b>Jam:</b>
${data.jam}
</p>

<p>
<b>Alamat:</b>
${data.alamat}
</p>

<p>
<b>Keluhan:</b>
${data.keluhan}
</p>

</div>

<button
class="btn-chat"
data-id="${doc.id}"
data-status="${data.workflowStatus}"
data-rated="${data.rated===true}"
data-skipped="${data.ratingSkipped===true}">

${getActionText(
data.workflowStatus,
data.rated,
data.ratingSkipped
)}

</button>

</div>

`;

});

container
.querySelectorAll(".btn-chat")
.forEach(btn=>{

btn.addEventListener("click",()=>{

const id =
btn.dataset.id;

const status =
btn.dataset.status;

const rated =
btn.dataset.rated==="true";

const skipped =
btn.dataset.skipped==="true";

openActivity(
id,
status,
rated,
skipped
);

});

});

}

function getActionText(status){

switch(status){

case "negotiation":
return "💬 Lanjut Negosiasi";

case "working":
return "👷 Lihat Pengerjaan";

case "billing_review":
return "🧾 Lihat Tagihan";

case "payment_confirmation":
return "💳 Bayar Sekarang";

case "payment_confirmed":
return "✅ Menunggu Penyelesaian";

case "completed":
return "⭐ Beri Penilaian";

default:
return "📄 Lihat Detail";

}

}

function openActivity(id,status){

if(status==="completed"){

window.location.href=
`rating.html?id=${id}`;

return;

}

window.location.href=
`negosiasi.html?id=${id}`;

}

onAuthStateChanged(
auth,
async(user)=>{

if(!user){

window.location.href =
"index.html";

return;

}

await loadRequests(
user.uid
);

}
);

