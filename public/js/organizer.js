let jsonDatas = null
let jsonDateMeet = null
let jsonDateComp = null
function getJsonData(){
  fetch('?type=json')
  .then(async (response) => {
    return await response.json();
  })

  .then((data) => {
    console.log(data.dataComp,"data.dataComp");
    
    jsonDatas = data.dataEvent
    jsonDateMeet = data.dataMeet
    jsonDateComp = data.dataComp
  });
}

getJsonData()
function burgerMenu(icon) {
  const menu = document.querySelector(".Menu");
  icon.classList.toggle("change");
  if (menu.style.display == "none") {
    menu.style.display = "flex";
  } else {
    menu.style.display = "none";
  }
}

let SearchModal = document.getElementById("SearchModal");
let pox = 0;
function search() {
  if (pox === 0) {
    SearchModal.style.display = "flex";
    pox++;
  } else if (pox === 1) {
    SearchModal.style.display = "none";
    pox--;
  }
}

let periodInp = document.getElementById("period");
function period() {
  if (checkbox1.checked) {
    periodInp.style.display = "flex";
  } else {
    periodInp.style.display = "none";
  }
}

let imgItem = document.getElementsByClassName("imgItem");
let imgItemMeet= document.getElementsByClassName("imgItemMeet");
let imgItemComp= document.getElementsByClassName("imgItemComp");
function setBorder(e) {
  for (i = 0; i < imgItem.length; i++) {
    imgItem[i].style.border = "none";
  }
  this.style.border = "2px solid #00ADA6";
  this.style.borderRadius = "5px";
  viewEvent(e.target.getAttribute("value"));
}
function setBorderMeet(e) {
  for (i = 0; i < imgItemMeet.length; i++) {
    imgItemMeet[i].style.border = "none";
  }
  this.style.border = "2px solid #00ADA6";
  this.style.borderRadius = "5px";
  viewMeet(e.target.getAttribute("value"));
}
function setBorderComp(e) {
  for (i = 0; i < imgItemComp.length; i++) {
    imgItemComp[i].style.border = "none";
  }
  this.style.border = "2px solid #00ADA6";
  this.style.borderRadius = "5px";
  viewComp(e.target.getAttribute("value"));
}
function generateImg(data) {
  let im = ``;
  for (let i = 0; i < data.length; i++) {
    im += `<img src="/${data[i].name}" class="allEvImg" />`;
  }
  return im;
}
function generateImgMeet(data) {
  let im = ``;
  for (let i = 0; i < data.length; i++) {
    im += `<img src="/${data[i].path}" class="allEvImgMeet" />`;
  }
  return im;
}
function generateImgComp(data) {
  let im = ``;
  for (let i = 0; i < data.length; i++) {
    im += `<img src="/${data[i].url}" class="allEvImgMeet" />`;
  }
  return im;
}

function generateDiv(data) {
  return `<div class="allEvBoxCont">
    <div id="pics1">${generateImg(data.images)}</div>
    <div class="allEvBoxContDiv">
      <div id="boxPersonName">
        <h6>${data.name}</h6>
        <div id="emotions">
          <div>
            <img src="/images/pics/walking 1.svg" />
            <a>${data.participants ? data.participants.length : 0}</a>
          </div>
          <div>
            <img src="/images/pics/Vector 80.svg" />
            ${data.favorites ? data.favorites.length : 0}
          </div>
          <div>
            <img src="/images/pics/Vector(30).svg" />
            ${data.likes ? data.likes.length : 0}
          </div>
          <div>
            <img src="/images/pics/Vector (20).svg" />
            ${data.views ? data.views.length : 0}
          </div>
        </div>
      </div>

      <div id="boxCatalog">
        <p>${data.category ? data.category.name : ""}</p>
        <a href="">Пришли на событие: ${
          data.participants ? data.participants.length : 0
        }</a>
      </div>
      <div id="boxDescription">
        <p>
          <span>Описание </span>${data.description ?? ""}
        </p>
      </div>
      <p class="boxP"><span>Дата:</span> ${conntDateToYMD(
        data.started_time
      )}</p>
      <p class="boxP"><span>Время: </span>${conntDateToHM(data.started_time)}</p>
      <p class="boxP"><span>Телефон:</span>${phone}</p>
      <p class="boxP"><span>Веб сайт:</span>${data.tickets_link ?? ""}</p>
      <p class="boxP boxPflex">
        <span>Место прохождения:</span>
        <img
          src="/images/pics/locationIcon.svg"
          style="cursor: pointer"
        />
      </p>
      <p></p>
      <p class="boxP">
        <span>Ссылка на билеты:</span>
        <a
          href="${data.tickets_link ?? ""}"
        >
        ${data.tickets_link ?? ""}
        </a>
      </p>
      <p class="boxP">
        <span class="biggerLetter">Почему я должен посетить?</span
        ><br />
        ${data.description_visit ?? ""}
      </p>
    </div>
  </div>`;
}

function generateDivMeet(data) {
  
  return `<div class="allEvBoxCont">
    <div id="pics1">${generateImgMeet(data.images)}</div>
    <div class="allEvBoxContDiv">
      <div id="boxPersonName">
        <h6>${data.purpose}</h6>
        <div id="emotions">
          <div>
            <img src="/images/pics/walking 1.svg" />
            <a>${data.participants ? data.participants.length : 0}</a>
          </div>
          <div>
            <img src="/images/pics/Vector 80.svg" />
            ${data.favorites ? data.favorites.length : 0}
          </div>
          <div>
            <img src="/images/pics/Vector(30).svg" />
            ${data.likes ? data.likes.length : 0}
          </div>
          <div>
            <img src="/images/pics/Vector (20).svg" />
            ${data.views ? data.views.length : 0}
          </div>
        </div>
      </div>

      <div id="boxCatalog">
        <a href="">Пришли на событие: ${
          data.participants ? data.participants.length : 0
        }</a>
      </div>
      <div id="boxDescription">
      </div>
      <p class="boxP"><span>Дата:</span> ${conntDateToYMD(
        data.date
      )}</p>
      <p class="boxP"><span>Время: </span>${conntDateToHM(data.date)}</p>
      <p class="boxP"><span>Телефон:</span>${phone}</p>
      <p class="boxP boxPflex">
        <span>Место прохождения: ${data.address}</span>
        <img
          src="/images/pics/locationIcon.svg"
          style="cursor: pointer"
        />
      </p>
      <p></p>
      <p class="boxP">
        <span>Ссылка на билеты:</span>
        <a
          href="${data.ticket ?? ""}"
        >
        ${data.ticket ?? ""}
        </a>
      </p>
      <p class="boxP">
        <span class="biggerLetter">Почему я должен посетить?</span
        ><br />
        ${data.description ?? ""}
      </p>
    </div>
  </div>`;
}


function generateDivComp(data) {
  
  return `<div class="allEvBoxCont">
    <div id="pics1">${generateImgComp(data.images)}</div>
    <div class="allEvBoxContDiv">
      <div id="boxPersonName">
        <h6>${data.companyName}</h6>
        <div id="emotions">
          <div>
            <img src="/images/pics/walking 1.svg" />
            <a>${data.participantsCount}</a>
          </div>
          <div>
            <img src="/images/pics/Vector(30).svg" />
             <span> ${data.likes ? data.likes.length : 0}</span>
          </div>
          <div>
            <img src="/images/pics/Vector (20).svg" />
            ${data.view ? data.view : 0}
          </div>
        </div>
      </div>

      <div id="boxCatalog">
      </div>
      <div id="boxDescription">
      </div>
      <p class="boxP"><span>Oткрывается: </span> ${data.startHour}</p>
      <p class="boxP"><span>Закрывается: </span>${data.endHour}</p>
      <p class="boxP"><span>Телефон:</span>${data.phoneNumbers[0].number}</p>
      <p class="boxP boxPflex">
        <span>Место прохождения: ${data.address}</span>
        <img
          src="/images/pics/locationIcon.svg"
          style="cursor: pointer"
        />
      </p>
      <p></p>
      <p class="boxP">
        <span>Сайт:</span>
        <a
          href="${data.web ?? ""}"
        >
        ${data.web ?? ""}
        </a>
      </p>
    </div>
  </div>`;
}

function viewEvent(k) {

  appendDiv('event_view',generateDiv(jsonDatas[k]),'afterbegin',1)
}

function viewMeet(k) {

  appendDiv('meet_view',generateDivMeet(jsonDateMeet[k]),'afterbegin',1)
}
function viewComp(k) {
  console.log(k,"kMeet");
  console.log(jsonDateComp,"jsonDateComp");
  console.log(jsonDateComp[k],"json[k]Meet");
  appendDiv('comp_view',generateDivComp(jsonDateComp[k]),'afterbegin',1)
}

for (i = 0; i < imgItem.length; i++) {
  imgItem[i].addEventListener("click", setBorder);
}

for (i = 0; i < imgItemMeet.length; i++) {
  imgItemMeet[i].addEventListener("click", setBorderMeet);
}

for (i = 0; i < imgItemComp.length; i++) {
  imgItemComp[i].addEventListener("click", setBorderComp);
}


// // ---------- slider ------------------
// var swiper = new Swiper(".mySwiper", {
//   slidesPerView: 5,
//   spaceBetween: 11,
//   slidesPerGroup: 1,
//   autoplay: {
//     delay: 5000,
//   },
//   loop: true,
//   loopFillGroupWithBlank: true,
//   navigation: {
//     nextEl: ".swiper-button-next",
//     prevEl: ".swiper-button-prev",
//   },
// });
// // -------------------------
// console.log(JSON.parse(meetings),"meetings");



  
  
