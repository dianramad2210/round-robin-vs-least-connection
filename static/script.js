// function createCard(server){

// let percent =
// (server.total / 15) * 100;

// return `

// <div class="server-card">

//     <h5>${server.name}</h5>

//     <p>
//     Aktif: 0 |
//     Total: ${server.total}
//     </p>

//     <div class="progress">

//         <div
//         class="progress-bar"
//         style="width:${percent}%">
//         </div>

//     </div>

// </div>

// `;

// }

// function jalankan(){

// fetch('/simulate')

// .then(res => res.json())

// .then(data=>{

//     let rr='';

//     data.rr.forEach(server=>{

//         rr += createCard(server);

//     });

//     document
//     .getElementById("rr-container")
//     .innerHTML = rr;


//     let lc='';

//     data.lc.forEach(server=>{

//         lc += createCard(server);

//     });

//     document
//     .getElementById("lc-container")
//     .innerHTML = lc;

//     document
//     .getElementById("log-area")
//     .value = data.logs.join('\n');

// });

// }

// function resetData(){

// document
// .getElementById("rr-container")
// .innerHTML='';

// document
// .getElementById("lc-container")
// .innerHTML='';

// document
// .getElementById("log-area")
// .value='';

// }