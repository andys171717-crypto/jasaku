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
Belum Ada Permintaan
</h2>

<p>
Permintaan jasa yang Anda kirim akan muncul di sini.
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
Kode Permintaan
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
onclick="window.location.href='negosiasi.html?id=${doc.id}'">
Buka Negosiasi
</button>

</div>

`;

});

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
