import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
getFirestore,
doc,
getDoc,
setDoc,
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

let currentUser = null;

let requestData = null;

onAuthStateChanged(
auth,
async(user)=>{

if(!user){

document.getElementById(
"providerCard"
).innerHTML=

"<h3>Silakan login terlebih dahulu.</h3>";

return;

}
    
currentUser = user;    

await loadRequest();

});

async function loadRequest(){

    try{

        if(!requestId){

            document.getElementById("providerCard").innerHTML=
            "<h3>Request ID tidak ditemukan.</h3>";

            return;

        }

        console.log("Request ID :",requestId);

        const snap = await getDoc(
            doc(
                db,
                "requests",
                requestId
            )
        );

        console.log("Document Exists :",snap.exists());

        if(!snap.exists()){

            document.getElementById("providerCard").innerHTML=
            "<h3>Transaksi tidak ditemukan.</h3>";

            return;

        }

        const data = snap.data();
        
        requestData = data;

        console.log("Request Data :",data);

        renderProvider(data);

    }catch(err){

        console.error(err);

        document.getElementById("providerCard").innerHTML=

        `<h3>${err.message}</h3>`;

    }

}

function renderProvider(data){

const providerCard =
document.getElementById(
"providerCard"
);

const providerName =
data.nama ||
data.businessName ||
"Mitra JasKit";

providerCard.innerHTML = `

<div class="provider-card">

<div class="provider-avatar">

<i class="fa-solid fa-user"></i>

</div>

<div class="provider-info">

<h2>

${providerName}

</h2>

<p class="provider-service">

<i class="fa-solid fa-screwdriver-wrench"></i>

<span>

${data.namaJasa || "-"}

</span>

</p>

<div class="provider-code">

<span>

Kode Aktivitas

</span>

<b>

${data.requestCode || "-"}

</b>

</div>

<div class="provider-status">

<i class="fa-solid fa-circle-check"></i>

<span>

Transaksi Selesai

</span>

</div>

</div>

</div>

`;

renderRatingForm();

}

function renderRatingForm(){

const container =
document.getElementById(
"ratingContainer"
);

container.innerHTML = `

<div class="rating-container">

<div class="rating-title">

⭐ Beri Penilaian

</div>

<div class="rating-subtitle">

Bagaimana pengalaman Anda menggunakan jasa Mitra ini?

</div>

<div
id="ratingStars"
class="rating-stars">

${createStars()}

</div>

<div
id="ratingTags"
class="rating-tags">

${createTags()}

</div>

<textarea

id="ratingReview"

class="rating-review"

placeholder="Tulis ulasan Anda (opsional)...">

</textarea>

<div class="rating-actions">

<button
id="skipRating">

Lewati

</button>

<button
id="submitRating">

Kirim Rating

</button>

</div>

</div>

`;

bindRatingEvents();

}

let selectedRating = 0;

let selectedTags = [];

const defaultTags = [

"Pelayanan Ramah",

"Pekerjaan Cepat",

"Hasil Memuaskan",

"Datang Tepat Waktu",

"Harga Sesuai",

"Komunikasi Baik"

];

function createStars(){

let html="";

for(let i=1;i<=5;i++){

html+=`

<i
class="fa-solid fa-star"
data-value="${i}">
</i>

`;

}

return html;

}

function createTags(){

return defaultTags.map(tag=>`

<div
class="rating-tag"
data-tag="${tag}">

${tag}

</div>

`).join("");

}

function bindRatingEvents(){

document

.querySelectorAll(
"#ratingStars i"
)

.forEach(star=>{

star.addEventListener(

"click",

()=>{

selectedRating=

Number(
star.dataset.value
);

updateStars();

}

);

});

document

.querySelectorAll(
".rating-tag"
)

.forEach(tag=>{

tag.addEventListener(

"click",

()=>{

tag.classList.toggle(
"active"
);

const value=
tag.dataset.tag;

if(selectedTags.includes(value)){

selectedTags=

selectedTags.filter(

v=>v!==value

);

}else{

selectedTags.push(value);

}

}

);

});

}

function updateStars(){

document

.querySelectorAll(
"#ratingStars i"
)

.forEach(star=>{

const value=
Number(
star.dataset.value
);

if(value<=selectedRating){

star.classList.add(
"active"
);

}else{

star.classList.remove(
"active"
);

}

});

}

async function submitRating(){

if(selectedRating===0){

alert("Pilih jumlah bintang terlebih dahulu.");

return;

}

const review=document
.getElementById("ratingReview")
.value
.trim();

const ratingData={

requestId,

requestCode:
requestData?.requestCode || "",

providerId:
requestData?.providerId || "",

customerId:
currentUser?.uid || "",

serviceName:
requestData?.namaJasa || "",

rating:selectedRating,

review,

tags:selectedTags,

createdAt:serverTimestamp()

};

try{

const ratingRef = doc(
db,
"ratings",
requestId
);

const ratingSnap =
await getDoc(ratingRef);

if(ratingSnap.exists()){

alert(
"Transaksi ini sudah pernah diberi penilaian."
);

return;

}

await setDoc(
ratingRef,
ratingData
);

await setDoc(
doc(db,"requests",requestId),
{
...requestData,
rated:true
}
);

showSuccess();

}catch(err){

console.error(err);

alert("Gagal mengirim penilaian.");

}

}

function skipRating(){

showSuccess();

}

function showSuccess(){

const container=document.getElementById("ratingContainer");

if(!container) return;

container.innerHTML=`

<div class="rating-success">

<h3>🎉 Terima Kasih</h3>

<p>

Penilaian berhasil dikirim.

</p>

</div>

`;

setTimeout(()=>{

window.location.href="requests.html";

},1200);

}

document.addEventListener(

"click",

(e)=>{

if(e.target.id==="submitRating"){

submitRating();

}

if(e.target.id==="skipRating"){

skipRating();

}

}

);
