import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
getFirestore,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

const params =
new URLSearchParams(
window.location.search
);

const requestId =
params.get("id");

async function loadRequest(){

if(!requestId){
return;
}

const requestRef =
doc(
db,
"requests",
requestId
);

const requestSnap =
await getDoc(requestRef);

if(!requestSnap.exists()){

document.getElementById(
"requestInfo"
).innerHTML = `
<h3>Data Request Tidak Ditemukan</h3>
<p>ID: ${requestId}</p>
`;

return;
}

const data =
requestSnap.data();

document.getElementById(
"requestInfo"
).innerHTML = `

<div class="request-code">

Kode Permintaan

<br>

${data.requestCode || "-"}

</div>

<h2>
${data.namaJasa || "-"}
</h2>

<p>
Customer:
${data.nama || "-"}
</p>

<p>
Alamat:
${data.alamat || "-"}
</p>

<p>
Keluhan:
${data.keluhan || "-"}
</p>

<p>
Status:
${data.status || "-"}
</p>

`;

}

loadRequest();

document.getElementById(
"chatMessages"
).innerHTML = `
<div class="message customer">
Ruang negosiasi sedang disiapkan...
</div>
`;
