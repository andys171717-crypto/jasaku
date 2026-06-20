import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
getFirestore,
collection,
query,
where,
getDocs,
doc,
updateDoc
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function loadRequests(uid){

const container =
document.getElementById("requestsList");

container.innerHTML = "";

const q =
query(
collection(db,"requests"),
where("providerId","==",uid)
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
<div class="request-card">
<h3>Belum Ada Permintaan Masuk</h3>
</div>
`;

return;
}

requests.forEach(req=>{

const data = req.data();

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

<h3>${data.namaJasa}</h3>

<div class="status">
${data.status}
</div>

<p><b>Nama:</b> ${data.nama}</p>
<p><b>HP:</b> ${data.hp}</p>
<p><b>Alamat:</b> ${data.alamat}</p>
<p><b>Keluhan:</b> ${data.keluhan}</p>

<div class="action-buttons">

<button
class="btn-review"
data-id="${req.id}">
Tinjau
</button>

<button
class="btn-reject"
data-id="${req.id}">
Tolak
</button>

</div>

</div>

`;

});

}

onAuthStateChanged(
auth,
(user)=>{

if(!user){

window.location.href =
"index.html";

return;

}

loadRequests(user.uid);

}
);

document.addEventListener(
"click",
async(e)=>{

if(
e.target.classList.contains(
"btn-review"
)
){

await updateDoc(
doc(
db,
"requests",
e.target.dataset.id
),
{
status:"Sedang Ditinjau"
}
);

location.reload();

}

if(
e.target.classList.contains(
"btn-reject"
)
){

await updateDoc(
doc(
db,
"requests",
e.target.dataset.id
),
{
status:"Ditolak"
}
);

location.reload();

}

}
);
