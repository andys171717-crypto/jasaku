import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
getFirestore,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

const params =
new URLSearchParams(
window.location.search
);

const requestId =
params.get("id");

loadRequest();

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

providerCard.innerHTML = `

<div class="provider-card">

<div class="provider-avatar">

<i class="fa-solid fa-user"></i>

</div>

<div class="provider-info">

<h2>

${data.businessName || "Mitra JasKit"}

</h2>

<p>

${data.namaJasa || "-"}

</p>

<div class="provider-code">

Kode Aktivitas

<b>

${data.requestCode || "-"}

</b>

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
