/* ======================================
   JASKIT RATING MODULE
====================================== */

let db = null;
let currentUser = null;
let requestId = null;
let requestData = null;

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

export function initRating(config){

db = config.db;

currentUser = config.currentUser;

requestId = config.requestId;

requestData = config.requestData;

createRatingUI();

console.log("Rating Ready");

}

function createRatingUI(){

if(document.getElementById("ratingContainer")) return;

document.body.insertAdjacentHTML(

"beforeend",

`

<div
id="ratingContainer"
class="rating-container">

<div class="rating-title">

⭐ Beri Penilaian

</div>

<div class="rating-subtitle">

Bagaimana pengalaman Anda menggunakan jasa Mitra?

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

`

);

bindRatingEvents();

}

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

return defaultTags.map(

tag=>`

<div

class="rating-tag"

data-tag="${tag}">

${tag}

</div>

`

).join("");

}

function bindRatingEvents(){

document

.querySelectorAll(

"#ratingStars i"

)

.forEach(

(star)=>{

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

}

);

document

.querySelectorAll(

".rating-tag"

)

.forEach(

(tag)=>{

tag.addEventListener(

"click",

()=>{

tag.classList.toggle(

"active"

);

const value=

tag.dataset.tag;

if(

selectedTags.includes(value)

){

selectedTags=

selectedTags.filter(

v=>v!==value

);

}else{

selectedTags.push(value);

}

}

);

}

);

}

function updateStars(){

document
.querySelectorAll(
"#ratingStars i"
)
.forEach(
(star)=>{

const value=
Number(
star.dataset.value
);

if(
value<=selectedRating
){

star.classList.add(
"active"
);

}else{

star.classList.remove(
"active"
);

}

}
);

}

async function submitRating(){

if(selectedRating===0){

alert(
"Pilih jumlah bintang terlebih dahulu."
);

return;

}

const review=

document
.getElementById(
"ratingReview"
)
.value
.trim();

const ratingData={

rating:selectedRating,

review,

tags:selectedTags,

requestId,

providerId:
requestData.providerId,

customerId:
currentUser.uid,

createdAt:
new Date()

};

try{

await addDoc(

collection(
db,
"ratings"
),

ratingData

);

showSuccess();

}
catch(err){

console.error(err);

alert(
"Gagal mengirim rating."
);

}

}

function skipRating(){

showSuccess();

}

function showSuccess(){

const container=

document.getElementById(
"ratingContainer"
);

container.innerHTML=`

<div
class="rating-success">

🎉

Terima kasih.

Penilaian berhasil disimpan.

</div>

`;

}

document

.addEventListener(

"click",

(e)=>{

if(
e.target.id==="submitRating"
){

submitRating();

}

if(
e.target.id==="skipRating"
){

skipRating();

}

}

);
