import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

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

const btnAkun =
document.getElementById("btnAkun");

btnAkun.addEventListener(
"click",
(e)=>{

e.preventDefault();

onAuthStateChanged(
auth,
(user)=>{

if(user){

window.location.href =
"akun.html";

}else{

showToast(
"Silakan login terlebih dahulu"
);

}

}
);

}
);

function showToast(message){

const oldToast =
document.querySelector(".custom-toast");

if(oldToast){
oldToast.remove();
}

const toast =
document.createElement("div");

toast.className =
"custom-toast";

toast.textContent =
message;

document.body.appendChild(toast);

setTimeout(()=>{

toast.classList.add("show");

},50);

setTimeout(()=>{

toast.classList.remove("show");

setTimeout(()=>{

toast.remove();

},300);

},2500);

}
