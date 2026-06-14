const categories = [

{
name:"AC",
icon:"fa-screwdriver-wrench"
},

{
name:"Listrik",
icon:"fa-bolt"
},

{
name:"Komputer",
icon:"fa-laptop"
},

{
name:"CCTV",
icon:"fa-video"
},

{
name:"Jasa Lainnya",
icon:"fa-ellipsis"
}

];

const kategoriList =
document.getElementById(
"kategoriList"
);

if(kategoriList){

kategoriList.innerHTML =
categories.map(item => `

<div
class="card"
data-category="${item.name}">

<i class="fas ${item.icon}"></i>

<span>
${item.name}
</span>

</div>

`).join("");

}
