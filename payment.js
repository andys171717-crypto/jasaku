import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
getFirestore,
doc,
getDoc,
updateDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

import {
getAuth,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {

apiKey:"AIzaSyCnk56ZY63q2h1ewEdiivzB0rrSfJOJtYo",

authDomain:"jasaku-92b55.firebaseapp.com",

projectId:"jasaku-92b55",

storageBucket:"jasaku-92b55.firebasestorage.app",

messagingSenderId:"217601622524",

appId:"1:217601622524:web:e3bc48dbdc50d7cb10b279"

};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

const params =
new URLSearchParams(
window.location.search
);

const requestId =
params.get("id");

let requestData=null;

let currentUser=null;

let paymentMethod="cash";

const totalAmount =
document.getElementById(
"totalAmount"
);

const agreedPrice =
document.getElementById(
"agreedPrice"
);

const extraLabor =
document.getElementById(
"extraLabor"
);

const materialFee =
document.getElementById(
"materialFee"
);

const materialNameBox =
document.getElementById(
"materialNameBox"
);

const summaryTotal =
document.getElementById(
"summaryTotal"
);

const paymentStatus =
document.getElementById(
"paymentStatus"
);

const payButton =
document.getElementById(
"payButton"
);

const cancelButton =
document.getElementById(
"cancelButton"
);

async function loadBilling(){

const snap =
await getDoc(

doc(
db,
"requests",
requestId
)

);

if(!snap.exists()){

alert(
"Data tidak ditemukan."
);

history.back();

return;

}

requestData =
snap.data();

renderBilling();

}

function rupiah(value){

return "Rp " +

Number(value || 0)
.toLocaleString(
"id-ID"
);

}

function renderBilling(){

const bill =
requestData.billing;

if(!bill) return;

totalAmount.textContent =
rupiah(
bill.total
);

summaryTotal.textContent =
rupiah(
bill.total
);

agreedPrice.textContent =
rupiah(
bill.agreedPrice
);

extraLabor.textContent =
rupiah(
bill.extraLabor
);

materialFee.textContent =
rupiah(
bill.materialFee
);

materialNameBox.textContent =

bill.materialName ||

"-";

paymentStatus.textContent =

requestData.status ||

"Menunggu Pembayaran";

}

function getSelectedMethod(){

const selected =
document.querySelector(
'input[name="paymentMethod"]:checked'
);

paymentMethod =
selected
? selected.value
: "cash";

}

async function payCash(){

payButton.disabled = true;

payButton.textContent =
"Menyimpan...";

try{

await updateDoc(

doc(
db,
"requests",
requestId
),

{

payment:{

method:"cash",

status:
"waiting_confirmation",

amount:
requestData.billing.total,

createdAt:
serverTimestamp(),

createdBy:
currentUser.uid

},

paymentMethod:"cash",

paymentStatus:
"waiting_confirmation",

status:
"Menunggu Konfirmasi Mitra"

}

);

alert(
"Metode pembayaran Tunai berhasil dipilih."
);

window.location.href =
`negosiasi.html?id=${requestId}`;

}
catch(err){

console.error(err);

alert(
"Gagal menyimpan pembayaran."
);

}
finally{

payButton.disabled=false;

payButton.textContent=
"Bayar Sekarang";

}

}

function payNonCash(){

alert(

`🚧

Pembayaran Non Tunai

akan tersedia
pada update berikutnya.

Silakan gunakan
metode Tunai terlebih dahulu.`

);

}

async function payNow(){

getSelectedMethod();

if(paymentMethod==="cash"){

await payCash();

return;

}

payNonCash();

}

payButton.addEventListener(

"click",

async()=>{

await payNow();

}

);

cancelButton.addEventListener(

"click",

()=>{

window.location.href=
`negosiasi.html?id=${requestId}`;

}

);

document

.querySelectorAll(
'input[name="paymentMethod"]'
)

.forEach(item=>{

item.addEventListener(

"change",

()=>{

document

.querySelectorAll(
".payment-option"
)

.forEach(card=>{

card.classList.remove(
"active"
);

});

item

.closest(
".payment-option"
)

.classList.add(
"active"
);

}

);

});

onAuthStateChanged(

auth,

async(user)=>{

if(!user){

window.location.href=
"akun.html";

return;

}

currentUser=user;

await loadBilling();

}

);
