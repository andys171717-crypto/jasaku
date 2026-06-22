import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
getFirestore,
doc,
getDoc,
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

card.innerHTML = `

<div class="mini-info">

<span>
👤 ${requestData.nama || "-"}
</span>

<span>
🟡 ${requestData.status || "-"}
</span>

</div>

`;

}else{

card.innerHTML = `

<div class="mini-info">

<span>
🏢 ${requestData.namaJasa || "-"}
</span>

<span>
🟡 ${requestData.status || "-"}
</span>

</div>

`;

}

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

if(msg.type === "system"){

chat.innerHTML += `

<div class="system-message">

<div class="system-card">

${msg.text || ""}

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

const providerActions =
document.querySelector(
".provider-actions"
);

const approvalActions =
document.getElementById(
"approvalActions"
);

const approveEstimate =
document.getElementById(
"approveEstimate"
);

const rejectEstimate =
document.getElementById(
"rejectEstimate"
);
    
if(isProvider){

document.body.classList.add(
"provider-mode"
);

if(
requestData?.estimatedStatus ===
"waiting_customer"
){

providerActions.style.display =
"none";

}else{

providerActions.style.display =
"block";

}

approvalActions.style.display =
"none";

}    
    
else{

providerActions.style.display =
"none";

document.body.classList.add(
"customer-mode"
);

if(
requestData?.estimatedStatus ===
"waiting_customer"
){

approvalActions.style.display =
"flex";

}else{

approvalActions.style.display =
"none";

}

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
"photoBtn"
)
.addEventListener(
"click",
()=>{

document
.getElementById(
"imageInput"
)
.click();

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

acceptBtn.addEventListener(
"click",
()=>{

estimateModal.style.display =
"flex";

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
"Masukkan estimasi terlebih dahulu"
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
estimatedLaborFee:
amount,

estimatedStatus:
"waiting_customer"
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

systemType:
"estimate",

amount,

text:
`
💰 ESTIMASI UPAH JASA AWAL

Rp ${amount.toLocaleString("id-ID")}

Menunggu Persetujuan Customer
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

requestData.estimatedStatus =
"waiting_customer";

providerActions.style.display =
"none";

approvalActions.style.display =
"none";   
    
alert(
"Estimasi berhasil diajukan"
);

}
);

approveEstimate.addEventListener(
"click",
async()=>{

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
"Pengerjaan"
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

systemType:
"estimate_approved",

text:
`
✅ ESTIMASI DISETUJUI

Rp ${requestData.estimatedLaborFee.toLocaleString("id-ID")}

Pekerjaan dapat dimulai
`,

createdAt:
serverTimestamp()
}

);

approvalActions.style.display =
"none";

alert(
"Estimasi disetujui"
);

}
);   
    
}
);
