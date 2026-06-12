import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
getFirestore,
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

authDomain:
"jasaku-92b55.firebaseapp.com",

projectId:
"jasaku-92b55",

storageBucket:
"jasaku-92b55.firebasestorage.app",

messagingSenderId:
"217601622524",

appId:
"1:217601622524:web:e3bc48dbdc50d7cb10b279"

};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

let currentUser = null;

onAuthStateChanged(
auth,
(user)=>{
    
console.log("USER:", user);   

if(!user){

window.location.href =
"index.html";

return;

}

currentUser = user;

}
);

document
.getElementById(
"btnSaveProvider"
)
.addEventListener(
"click",
async ()=>{

const businessName =
document
.getElementById(
"businessName"
)
.value
.trim();

const phone =
document
.getElementById(
"phone"
)
.value
.trim();

const province =
document
.getElementById(
"province"
)
.value
.trim();

const city =
document
.getElementById(
"city"
)
.value
.trim();

const district =
document
.getElementById(
"district"
)
.value
.trim();

const address =
document
.getElementById(
"address"
)
.value
.trim();

const description =
document
.getElementById(
"description"
)
.value
.trim();

if(
!businessName ||
!phone ||
!province ||
!city ||
!district ||
!address
){

alert(
"Semua data wajib diisi"
);

return;

}

try{

await updateDoc(
doc(
db,
"users",
currentUser.uid
),
{

businessName,
phone,
province,
city,
district,
address,
description,

providerProfileComplete:
true,

providerStatus:
"approved"

}
);

alert(
"Profil provider berhasil disimpan"
);

window.location.href =
"tambah-jasa.html";

}catch(error){

console.error(error);

alert(
"Gagal menyimpan data"
);

}

}
);