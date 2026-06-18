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

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const container =
document.getElementById("orderDetail");

if(!orderId){

container.innerHTML = `
<h3>Order ID tidak ditemukan</h3>
`;

}else{

loadOrder();

}

async function loadOrder(){

try{

const orderRef =
doc(db,"orders",orderId);

const orderSnap =
await getDoc(orderRef);

if(!orderSnap.exists()){

container.innerHTML = `
<h3>Pesanan tidak ditemukan</h3>
`;

return;

}

const data =
orderSnap.data();

container.innerHTML = `

<div class="order-card">

<h2>${data.namaJasa}</h2>

<p>
<b>Status:</b>
${data.status}
</p>

<hr>

<p>
<b>Customer:</b>
${data.nama}
</p>

<p>
<b>HP:</b>
${data.hp}
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

`;

}catch(error){

console.error(error);

container.innerHTML = `
<h3>Gagal memuat data pesanan</h3>
`;

}

}
