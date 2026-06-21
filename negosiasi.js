import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
getFirestore,
doc,
getDoc,
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

const auth =
getAuth(app);

const db =
getFirestore(app);

const params =
new URLSearchParams(
window.location.search
);

const requestId =
params.get("id");

let currentUser = null;

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

let requestSnap;

try{

requestSnap =
await getDoc(requestRef);

}catch(error){

document.getElementById(
"requestInfo"
).innerHTML = `

<h3>ERROR FIRESTORE</h3>

<p>
${error.message}
</p>

`;

return;

}

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

chat.innerHTML += `
<div class="message ${
msg.senderId === currentUser.uid
? "provider"
: "customer"
}">
${msg.text}
</div>
`;

}
);

chat.scrollTop =
chat.scrollHeight;

}
);

}

async function sendMessage(){

try{

const input =
document.getElementById(
"messageInput"
);

const text =
input.value.trim();

if(!text){

return;

}

await addDoc(
collection(
db,
"requests",
requestId,
"messages"
),
{
text:text,
senderId:
currentUser.uid,
createdAt:
serverTimestamp()
}
);

input.value = "";

}catch(error){

console.error(error);

}

}

onAuthStateChanged(
auth,
(user)=>{

if(!user){

window.location.href =
"akun.html";

return;

}

currentUser = user;

loadRequest();

initRealtimeChat();

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

if(
e.key === "Enter"
){

e.preventDefault();

sendMessage();

}

}
);

}
);
