import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {

getFirestore,
doc,
getDoc,
getDocs,
updateDoc,
collection,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp

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
const auth = getAuth(app);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const requestId = params.get("id");

let currentUser = null;
let requestData = null;
let isProvider = false;
let firstLoad = true;
let lastMessageCount = 0;
let selectedImage = null;

const IMGBB_API_KEY =
"c2e3fcd3251f6d46da391b73e5113cda";

function formatTime(timestamp){

if(!timestamp) return "";

try{

const date =
timestamp.toDate
? timestamp.toDate()
: new Date(timestamp);

return date.toLocaleTimeString(
"id-ID",
{
hour:"2-digit",
minute:"2-digit"
}
);

}catch{

return "";

}

}

async function loadRequest(){

if(!requestId) return;

const requestRef =
doc(
db,
"requests",
requestId
);

const snap =
await getDoc(requestRef);

if(!snap.exists()){

document.getElementById(
"requestInfo"
).innerHTML =
"<h3>Request tidak ditemukan</h3>";

return;

}

requestData =
snap.data();

isProvider =
currentUser.uid ===
requestData.providerId;

const backBtn =
document.getElementById(
"backBtn"
);

backBtn.href =
isProvider
? "provider-requests.html"
: "requests.html";

const card =
document.getElementById(
"requestInfo"
);

if(isProvider){

const workflowStatus =
requestData?.workflowStatus ||
"negotiation";

let buttonText =
"Mulai";

let buttonClass =
"status-btn";

if(
workflowStatus ===
"working"
){

buttonText =
"Buat Tagihan";

}

if(
workflowStatus ===
"billing_review"
){

buttonText =
"Menunggu Pembayaran";

buttonClass =
"status-btn waiting-btn";

}

if(
workflowStatus ===
"payment_confirmation"
){

buttonText =
"Konfirmasi Pembayaran";

buttonClass =
"status-btn btn-green";

}

if(
workflowStatus ===
"payment_confirmed"
){

buttonText =
"Selesaikan";

buttonClass =
"status-btn btn-green";

}

if(
workflowStatus ===
"completed"
){

buttonText =
"Selesai";

buttonClass =
"status-btn waiting-btn";

}

card.innerHTML = `

<div class="mini-info">

<div class="info-left">

<div class="info-name">
👤 ${requestData.nama || "-"}
</div>

<div class="info-status">
🟡 ${requestData.status || "-"}
</div>

</div>

<div class="info-right">

${
workflowStatus === "negotiation"

? `

<button
id="startWorkBtn"
class="${buttonClass}">

Mulai

</button>

`

:

workflowStatus === "working"

? `

<button
id="billingBtn"
class="${buttonClass}">

Buat Tagihan

</button>

`

:

workflowStatus === "payment_confirmation"

? `

<button
id="confirmPaymentBtn"
class="status-btn btn-green">

💰 Konfirmasi Pembayaran

</button>

`

:

workflowStatus === "payment_confirmed"

? `

<button
id="finishOrderBtn"
class="status-btn btn-green">

✅ Selesaikan Pesanan

</button>

`

:

`

<button
class="${buttonClass}">

${buttonText}

</button>

`

}

</div>

</div>

`;

}else{

let customerActions = "";

if(
requestData.workflowStatus==="billing_review"
){

customerActions=`

<button
id="goPaymentBtn"
class="status-btn">

💳 Bayar Sekarang

</button>

`;

}

if(
requestData.workflowStatus==="payment_confirmation"
){

customerActions=`

<button
class="status-btn waiting-btn">

⏳ Menunggu Konfirmasi Mitra

</button>

`;

}

if(
requestData.workflowStatus==="payment_confirmed"
){

customerActions=`

<button
class="status-btn waiting-btn">

✅ Pembayaran Diterima

</button>

`;

}

card.innerHTML = `

<div class="mini-info">

<div class="info-left">

<div class="info-name">
🏢 ${requestData.namaJasa || "-"}
</div>

<div class="info-status">
🟡 ${requestData.status || "-"}
</div>

</div>

<div class="info-right">

${customerActions}

</div>

</div>

`;

}

}

function initRealtimeRequest(){

const requestRef =
doc(
db,
"requests",
requestId
);

onSnapshot(
requestRef,
(snapshot)=>{

if(!snapshot.exists()) return;

requestData =
snapshot.data();

loadRequest();

}
);

}

function initRealtimeChat(){

const messagesRef =
collection(
db,
"requests",
requestId,
"messages"
);

const q =
query(
messagesRef,
orderBy(
"createdAt",
"asc"
)
);

onSnapshot(
q,
(snapshot)=>{

const chat =
document.getElementById(
"chatMessages"
);

chat.innerHTML = "";

snapshot.forEach(
(docItem)=>{

const msg =
docItem.data();

const isMine =
msg.senderId ===
currentUser.uid;

const senderName =
isMine
? "Anda"
: (
isProvider
? "Customer"
: "Mitra"
);

if(msg.type==="billing"){

const bill=msg.billing;

chat.innerHTML+=`

<div class="system-message">

<div class="system-card">

<h3 style="margin-top:0;">
🧾 Tagihan Akhir
</h3>

<div style="text-align:left;line-height:1.8;">

<b>Harga Kesepakatan</b><br>
Rp ${bill.agreedPrice.toLocaleString("id-ID")}<br><br>

<b>Jasa Tambahan</b><br>
Rp ${bill.extraLabor.toLocaleString("id-ID")}<br><br>

<b>Material</b><br>
Rp ${bill.materialFee.toLocaleString("id-ID")}<br>

${bill.materialName||"-"}<br><br>

<b>Catatan</b><br>

${bill.workNotes||"-"}

<br><br>

<b>Total Tagihan</b>

<h2 style="margin:6px 0;">

Rp ${bill.total.toLocaleString("id-ID")}

</h2>

${
bill.photoUrl
?

`<img
src="${bill.photoUrl}"
style="
width:100%;
border-radius:12px;
margin-top:10px;
">`

:

""

}

<div style="
margin-top:15px;
font-weight:bold;
color:#2563eb;
">

Menunggu Pembayaran

</div>

${
!isProvider &&
requestData.workflowStatus==="billing_review"

?

`

<div
class="payment-hint">

📌 Silakan lakukan pembayaran menggunakan tombol hijau
<strong>Bayar Sekarang</strong>
di bagian atas halaman.

</div>

`

:

requestData.workflowStatus==="payment_confirmation"

?

`

<div
class="payment-hint">

✅ Pembayaran berhasil dikirim.

Menunggu konfirmasi dari Mitra.

</div>

`

:

requestData.workflowStatus==="payment_confirmed"

?

`

<div
class="payment-hint">

🎉 Pembayaran telah dikonfirmasi Mitra.

</div>

`

:

""

}

</div>

</div>

</div>

`;

return;

}

if(msg.type==="payment"){

const pay=msg.payment;

chat.innerHTML+=`

<div class="system-message">

<div class="system-card">

<h3 style="margin-top:0;">
💳 Customer Telah Membayar
</h3>

<div style="line-height:1.9;">

<b>Metode</b><br>

${pay.method==="cash"
?"Tunai"
:"Non Tunai"}

<br><br>

<b>Nominal</b><br>

Rp ${pay.amount.toLocaleString("id-ID")}

<br><br>

<b>Status</b><br>

${
requestData.payment?.status==="waiting_confirmation"

?

"Menunggu Konfirmasi"

:

"Pembayaran Diterima"

}

</div>

${
isProvider

?

(

requestData.workflowStatus==="payment_confirmation"

?

`

<button
id="confirmPaymentBtn"
class="status-btn btn-green"
style="margin-top:18px;">

✅ Konfirmasi Pembayaran

</button>

`

:

`

<div
class="payment-hint"
style="
background:#dcfce7;
color:#166534;
font-weight:700;
">

✔ Pembayaran Sudah Dikonfirmasi

</div>

`

)

:

`

<div
class="payment-hint">

Menunggu konfirmasi Mitra

</div>

`

}

</div>

</div>

`;

return;

}

if(msg.type==="location"){

chat.innerHTML+=`

<div class="message ${
isMine
?
"provider"
:
"customer"
}">

<div class="sender">

${senderName}

</div>

<div class="location-card">

<div class="location-icon">

<i class="fa-solid fa-location-dot"></i>

</div>

<div class="location-content">

<div class="location-title">

📍 Lokasi Dibagikan

</div>

<div class="location-desc">

Ketuk tombol di bawah untuk membuka lokasi di Google Maps.

</div>

<a
class="location-link"
href="${msg.mapUrl}"
target="_blank">

🗺️ Buka Google Maps

</a>

</div>

</div>

<div class="message-time">

${formatTime(msg.createdAt)}

</div>

</div>

`;

return;

}

if(msg.type === "system"){

chat.innerHTML += `

<div class="system-message">

<div>

<div class="system-card">

${msg.text || ""}

</div>

<div class="message-time">

${formatTime(msg.createdAt)}

</div>

</div>

</div>

`;

return;

}

chat.innerHTML += `

<div class="message ${
isMine
? "provider"
: "customer"
}">

<div class="sender">
${senderName}
</div>

<div class="bubble-text">

${
msg.type === "image"

? `<img
src="${msg.imageUrl}"
class="chat-image"
onclick="window.open('${msg.imageUrl}','_blank')">`

: (msg.text || "")
}

</div>

<div class="message-time">
${formatTime(msg.createdAt)}
</div>

</div>

`;

}
);

setTimeout(()=>{

chat.scrollTop =
chat.scrollHeight;

window.scrollTo({
top: document.body.scrollHeight,
behavior: "smooth"
});

},150);

}
);

}

async function sendMessage(){

if(selectedImage){

await sendImage(
selectedImage
);

selectedImage = null;

document.getElementById(
"imagePreview"
).style.display =
"none";

return;

}  

const input =
document.getElementById(
"messageInput"
);

const text =
input.value.trim();

if(!text) return;

input.value = "";

await addDoc(
collection(
db,
"requests",
requestId,
"messages"
),
{
type:"text",

text,

senderId:
currentUser.uid,

createdAt:
serverTimestamp()
}
);

}

async function uploadImage(file){

const formData =
new FormData();

formData.append(
"image",
file
);

const response =
await fetch(
`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
{
method:"POST",
body:formData
}
);

const result =
await response.json();

if(!result.success){

throw new Error(
"Gagal upload foto"
);

}

return result.data.url;

}

async function sendImage(file){

const imageUrl =
await uploadImage(file);

await addDoc(

collection(
db,
"requests",
requestId,
"messages"
),

{
type:"image",

imageUrl,

senderId:
currentUser.uid,

createdAt:
serverTimestamp()
}

);

}

async function sendLocation(){

if(!navigator.geolocation){

alert("Browser tidak mendukung GPS.");

return;

}

navigator.geolocation.getCurrentPosition(

async(position)=>{

const lat=position.coords.latitude;

const lng=position.coords.longitude;

await addDoc(

collection(
db,
"requests",
requestId,
"messages"
),

{

type:"location",

latitude:lat,

longitude:lng,

mapUrl:`https://www.google.com/maps?q=${lat},${lng}`,

senderId:currentUser.uid,

createdAt:serverTimestamp()

}

);

},

()=>{

alert("Lokasi tidak berhasil diambil.");

},

{

enableHighAccuracy:true,

timeout:10000

}

);

}

onAuthStateChanged(
auth,
async(user)=>{

if(!user){

window.location.href =
"akun.html";

return;

}

currentUser = user;

await loadRequest();

initRealtimeRequest();

initRealtimeChat();

document.body.classList.remove(
"page-loading"
);

document.body.classList.add(
"page-ready"
);

const acceptBtn =
document.getElementById(
"acceptBtn"
);

const estimateModal =
document.getElementById(
"estimateModal"
);

const cancelEstimate =
document.getElementById(
"cancelEstimate"
);

const saveEstimate =
document.getElementById(
"saveEstimate"
);

const billingModal =
document.getElementById(
"billingModal"
);

const cancelBilling =
document.getElementById(
"cancelBilling"
);

const sendBilling =
document.getElementById(
"sendBilling"
);

const billingPhotoInput =
document.getElementById(
"billingPhoto"
);

const workNotesInput =
document.getElementById(
"workNotes"
);

const materialFeeInput =
document.getElementById(
"materialFee"
);

const materialNoteInput =
document.getElementById(
"materialNote"
);

const extraLaborInput =
document.getElementById(
"extraLaborFee"
);

const agreedPriceText =
document.getElementById(
"summaryAgreed"
);

const laborText =
document.getElementById(
"summaryLabor"
);

const materialText =
document.getElementById(
"summaryMaterial"
);

const totalText =
document.getElementById(
"summaryTotal"
);

const providerActions =
document.querySelector(
".provider-actions"
);

const workflowActions =
document.getElementById(
"workflowActions"
);

if(isProvider){

document.body.classList.add(
"provider-mode"
);

workflowActions.style.display =
"none";

}else{

document.body.classList.add(
"customer-mode"
);

workflowActions.style.display =
"none";

}

document
.getElementById(
"sendBtn"
)
.addEventListener(
"click",
sendMessage
);

document
.getElementById(
"messageInput"
)
.addEventListener(
"keydown",
(e)=>{

if(e.key==="Enter"){

e.preventDefault();

sendMessage();

}

}
);

document
.getElementById(
"attachmentBtn"
)
.addEventListener(
"click",
()=>{

const menu=
document.getElementById(
"attachmentMenu"
);

menu.style.display=

menu.style.display==="flex"

?

"none"

:

"flex";

}
);

document
.getElementById(
"choosePhoto"
)
.addEventListener(
"click",
()=>{

document
.getElementById(
"attachmentMenu"
).style.display="none";

document
.getElementById(
"imageInput"
)
.click();

}
);

document
.getElementById(
"chooseLocation"
)
.addEventListener(
"click",
()=>{

document
.getElementById(
"attachmentMenu"
).style.display="none";

sendLocation();

}
);

document
.getElementById(
"chooseDocument"
)
.addEventListener(
"click",
()=>{

document
.getElementById(
"attachmentMenu"
).style.display="none";

alert(
"Fitur kirim dokumen akan kita aktifkan pada tahap berikutnya."
);

}
);

document
.getElementById(
"imageInput"
)
.addEventListener(
"change",
(e)=>{

const file =
e.target.files[0];

if(!file) return;

selectedImage = file;

const preview =
document.getElementById(
"imagePreview"
);

const previewImg =
document.getElementById(
"previewImg"
);

previewImg.src =
URL.createObjectURL(file);

preview.style.display =
"flex";

e.target.value = "";

}
);

document
.getElementById(
"removePreview"
)
.addEventListener(
"click",
()=>{

selectedImage = null;

document
.getElementById(
"imagePreview"
)
.style.display =
"none";

document
.getElementById(
"imageInput"
)
.value = "";

}
);

function updateBillingSummary(){

const agreed =
requestData?.agreedPrice || 0;

const labor =
parseInt(extraLaborInput.value) || 0;

const material =
parseInt(materialFeeInput.value) || 0;

const total =
agreed + labor + material;

agreedPriceText.textContent =
"Rp " + agreed.toLocaleString("id-ID");

laborText.textContent =
"Rp " + labor.toLocaleString("id-ID");

materialText.textContent =
"Rp " + material.toLocaleString("id-ID");

totalText.textContent =
"Rp " + total.toLocaleString("id-ID");

materialNoteInput.parentElement.style.display =
material > 0
? "block"
: "none";

if(material<=0){

materialNoteInput.value="";

}

}

extraLaborInput.addEventListener(
"input",
updateBillingSummary
);

materialFeeInput.addEventListener(
"input",
updateBillingSummary
);

document
.addEventListener(
"click",
async (e)=>{

if(
e.target.id==="goPaymentBtn"
){

window.location.href=
`payment.html?id=${requestId}`;

return;

}


if(
e.target.id ===
"approveEstimateBtn"
){

const requestRef =
doc(
db,
"requests",
requestId
);

await updateDoc(
requestRef,
{
estimatedStatus:
"approved",

status:
"Disetujui"
}
);

await addDoc(
collection(
db,
"requests",
requestId,
"messages"
),
{
type:"system",

text:
`✅ Estimasi Rp ${requestData.estimatedLaborFee.toLocaleString("id-ID")} disetujui customer`,

createdAt:
serverTimestamp()
}
);

requestData.estimatedStatus =
"approved";

await loadRequest();

return;

}  

if(
e.target.id ===
"rejectEstimateBtn"
){

alert(
"Fitur alasan penolakan kita buat tahap berikutnya"
);

return;

}

if(
e.target.id ===
"startWorkBtn"
){

estimateModal.style.display =
"flex";

return;

}

if(
e.target.id ===
"billingBtn"
){

billingModal.style.display =
"flex";

updateBillingSummary();

return;

}

if(
e.target.id==="confirmPaymentBtn"
){

try{

await updateDoc(

doc(
db,
"requests",
requestId
),

{

workflowStatus:
"payment_confirmed",

status:
"Pembayaran Diterima",

payment:{

...requestData.payment,

status:
"paid",

confirmedAt:
serverTimestamp(),

confirmedBy:
currentUser.uid

}

}

);

await addDoc(

collection(
db,
"requests",
requestId,
"messages"
),

{

type:"system",

text:
"✅ Pembayaran telah dikonfirmasi oleh Mitra. Transaksi selesai.",

createdAt:
serverTimestamp()

}

);

alert(
"Pembayaran berhasil dikonfirmasi."
);

}
catch(err){

console.error(err);

alert(
"Gagal mengonfirmasi pembayaran."
);

}

return;

}

if(
e.target.id==="finishOrderBtn"
){

try{

await updateDoc(

doc(
db,
"requests",
requestId
),

{

workflowStatus:
"completed",

status:
"Selesai",

completedAt:
serverTimestamp()

}

);

await addDoc(

collection(
db,
"requests",
requestId,
"messages"
),

{

type:"system",

text:
"🎉 Pesanan telah diselesaikan oleh Mitra.",

createdAt:
serverTimestamp()

}

);

}
catch(err){

console.error(err);

alert("Gagal menyelesaikan pesanan.");

}

return;

}

}
);

cancelEstimate.addEventListener(
"click",
()=>{

estimateModal.style.display =
"none";

}
);

saveEstimate.addEventListener(
"click",
async()=>{

const amount =
parseInt(
document.getElementById(
"estimateInput"
).value
);

if(
!amount ||
amount <= 0
){

alert(
"Masukkan harga kesepakatan terlebih dahulu"
);

return;

}

const requestRef =
doc(
db,
"requests",
requestId
);

await updateDoc(
requestRef,
{
agreedPrice:
amount,

workflowStatus:
"working",

status:
"Pengerjaan"
}
);

requestData.workflowStatus =
"working";

await loadRequest();

await addDoc(

collection(
db,
"requests",
requestId,
"messages"
),

{
type:"system",

systemType:
"agreed_price",

amount,

text:
`
🤝 HARGA KESEPAKATAN AWAL

Rp ${amount.toLocaleString("id-ID")}

🚀 PEKERJAAN DIMULAI
`,

createdAt:
serverTimestamp()
}

);

estimateModal.style.display =
"none";

document.getElementById(
"estimateInput"
).value = "";

alert(
"Harga kesepakatan berhasil disimpan"
);

}
);

cancelBilling.addEventListener(
"click",
()=>{

billingModal.style.display="none";

}
);

sendBilling.addEventListener(
"click",
async()=>{

try{

sendBilling.disabled=true;
sendBilling.textContent="Mengirim...";

const agreed =
requestData?.agreedPrice || 0;

const labor =
parseInt(extraLaborInput.value)||0;

const material =
parseInt(materialFeeInput.value)||0;

const total =
agreed+labor+material;

const file =
billingPhotoInput.files[0];

let photoUrl="";

const billingData={

agreedPrice:agreed,

extraLabor:labor,

materialFee:material,

materialName:
materialNoteInput.value.trim(),

workNotes:
workNotesInput.value.trim(),

photoUrl,

total,

createdAt:
serverTimestamp(),

createdBy:
currentUser.uid

};

await updateDoc(

doc(
db,
"requests",
requestId
),

{

billing:billingData,

workflowStatus:"billing_review",

status:"Menunggu Pembayaran"

}

);

await addDoc(

collection(
db,
"requests",
requestId,
"messages"
),

{

type:"billing",

billing:billingData,

senderId:
currentUser.uid,

createdAt:
serverTimestamp()

}

);

billingModal.style.display="none";

alert(
"Tagihan berhasil disimpan."
);

if(file){

(async()=>{

try{

const url=
await uploadImage(file);

const newBilling={

...billingData,

photoUrl:url

};

await updateDoc(

doc(
db,
"requests",
requestId
),

{

billing:newBilling

}

);

// update pesan billing yang terakhir

const billingQuery=
query(

collection(
db,
"requests",
requestId,
"messages"
),

orderBy(
"createdAt",
"desc"
)

);

const billingSnap=
await getDocs(billingQuery);

if(!billingSnap.empty){

await updateDoc(

billingSnap.docs[0].ref,

{

billing:newBilling

}

);

}

}catch(err){

console.error(err);

}

})();

}

}
catch(err){

console.error(err);

alert(
"Gagal menyimpan tagihan."
);

}
finally{

sendBilling.disabled=false;
sendBilling.textContent="Kirim Tagihan";

}

}
);

}
);
