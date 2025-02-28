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
  
  
  
  // let arrForPhotos = [
  //   "1",
  //   "2",
  //   "3",
  //   "4",
  //   "5",
  //   "6",
  //   "7",
  //   "8",
  //   "9",
  //   "10",
  //   "11",
  //   "12",
  //   "13",
  //   "14",
  //   "15",
  //   "16",
  // ];
  
  // let a1 = document.getElementsByClassName("a1");
  // let boxLi = document.getElementsByClassName("boxLi");
  // let p1 = document.getElementById("p1");
  // let allEvBoxCont = document.getElementsByClassName("allEvBoxCont ")[1];
  
  // let photos = document.getElementById("photos");
  // function createPhotos() {
  //   allEvBoxCont.style.overflowY = "hidden";
  //   p1.innerHTML = "Добавленные фото/видео";
  
  //   for (i = 0; i < boxLi.length; i++) {
  //     a1[i].setAttribute("class", "a1");
  //   }
  //   a1[0].setAttribute("class", "a1 active");
  //   photos.innerHTML = "";
  //   photos.setAttribute("class", "photos");
  //   for (i = 0; i < arrForPhotos.length; i++) {
  //     let div1 = document.createElement("div");
  //     div1.className = "emptyPhotosImg";
  
  //     let imgX = document.createElement("img");
  //     imgX.style = "margin:7px; cursor:pointer";
  //     imgX.src = "../pics/GroupX.svg";
  //     imgX.setAttribute("data-number", i);
  
  //     imgX.onclick = function () {
  //       arrForPhotos.splice(+this.attributes["data-number"].value, 1);
  //       console.log(arrForPhotos.length);
  //       createPhotos();
  //     };
  
  //     // div1.style.background = `url(${arrForPhotos[i]})`
  
  //     div1.appendChild(imgX);
  //     photos.appendChild(div1);
  //   }
  // }
  // createPhotos();
  
  
  // let arrForComments = [
  //   {
  //     name: "Имя пользователя",
  //     text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
  //     likes: 20,
  //     time: "30 мин.",
  //   },
  //   {
  //     name: "Имя пользователя",
  //     text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
  //     likes: 20,
  //     time: "30 мин.",
  //   },
  //   {
  //     name: "Имя пользователя",
  //     text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
  //     likes: 20,
  //     time: "30 мин.",
  //   },
  //   {
  //     name: "Имя пользователя",
  //     text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
  //     likes: 20,
  //     time: "30 мин.",
  //   },
  //   {
  //     name: "Имя пользователя",
  //     text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
  //     likes: 20,
  //     time: "30 мин.",
  //   },
  //   {
  //     name: "Имя пользователя",
  //     text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
  //     likes: 20,
  //     time: "30 мин.",
  //   },
  // ];
  // function createComments() {
  //   allEvBoxCont.style.overflowY = "hidden";
  //   for (i = 0; i < boxLi.length; i++) {
  //     a1[i].setAttribute("class", "a1");
  //   }
  //   a1[1].setAttribute("class", "a1 active");
  //   p1.innerHTML = "Оставленные комментарии";
  //   photos.innerHTML = "";
  //   photos.setAttribute("class", "comments");
  //   let comments = document.getElementsByClassName("comments")[0];
  //   for (i = 0; i < arrForComments.length; i++) {
  //     let divMain = document.createElement("div");
  //     divMain.style = "display:flex; flex-direction:column; gap: 10px;";
  
  //     let divMainDiv1 = document.createElement("div");
  //     divMainDiv1.style = "display:flex; flex-direction:row; gap: 10px;";
  
  //     let img = document.createElement("img");
  //     img.style.height = "fit-content";
  //     img.style.marginTop = "9px";
  //     img.src = "../pics/Ellipse 48.svg";
  //     divMainDiv1.appendChild(img);
  
  //     let div2 = document.createElement("div");
  //     div2.style = "display:flex; flex-direction: column; width: 90%;";
  //     let div2Cont1 = document.createElement("div");
  //     div2Cont1.style =
  //       "display:flex; flex-direction:row; justify-content:space-between";
  
  //     let p1 = document.createElement("p");
  //     p1.style = "font-weight: 600;font-size: 12px; margin:7px 0; padding:0";
  //     p1.innerHTML = arrForComments[i].name;
  
  //     let span1 = document.createElement("span");
  //     span1.className = "span2";
  //     span1.innerHTML =
  //       arrForComments[i].likes + '<img src="../pics/heart1.svg" />';
  
  //     let p2 = document.createElement("p");
  //     p2.style =
  //       "font-weight: 400; font-size: 12px; line-height: 20px; letter-spacing: 0.01em;";
  //     p2.innerHTML = arrForComments[i].text;
  
  //     div2Cont1.appendChild(p1);
  //     div2Cont1.appendChild(span1);
  //     div2.appendChild(div2Cont1);
  //     div2.appendChild(p2);
  
  //     divMainDiv1.appendChild(div2);
  
  //     let divMainDiv2 = document.createElement("div");
  //     divMainDiv2.style =
  //       "display:flex; flex-direction:row;gap: 20px; align-items: center;";
  
  //     let time = document.createElement("span");
  //     time.style = "font-weight: 400; font-size: 10px; line-height: 20px;";
  //     time.innerHTML = arrForComments[i].time;
  
  //     let deleteBtn = document.createElement("div");
  //     deleteBtn.setAttribute("data-number", i);
  //     deleteBtn.onclick = function () {
  //       console.log(+this.attributes["data-number"].value);
  //       arrForComments.splice(+this.attributes["data-number"].value, 1);
  //       console.log(arrForComments.length);
  //       createComments();
  //     };
  //     deleteBtn.innerHTML = "Удалить";
  //     deleteBtn.style =
  //       "font-weight: 600;font-size: 12px;color: #00ADA6; cursor:pointer;height: fit-content;";
  
  //     divMainDiv2.appendChild(time);
  //     divMainDiv2.appendChild(deleteBtn);
  
  //     divMain.appendChild(divMainDiv1);
  //     divMain.appendChild(divMainDiv2);
  //     comments.appendChild(divMain);
  //   }
  // }

  function findIm(data,id){
    for(let i=0;i<data.length;i++){
      if(data[i].event == id){
        return data[i].path
      }
    }
    return 0
  }

  function findCom(data,id){
    let arr = []
    for(let i=0;i<data.length;i++){
      if(data[i].event == id){
        arr.push(data[i])
      }
    }
    return arr
  }

  function generateImg(data){
    let im = ``
    for(let i=0;i<data.length;i++){
      im += `<div class="emptyPhotosImg">
      <img src="/${data[i]}" data-number="${i}">
    </div>`
    }
    return im
  }

  function generateDiv(data){
    return `<div class="allEvBoxCont ChangedAllEvBoxCont" style="overflow-y: hidden;">
    <p id="p1" class="p1">Добавленные фото/видео</p>
    <div id="photos" class="photos">
      ${generateImg(data)}
    </div>
  </div>`
  }

  function genComTemp(d,fullname,avatar){
    let c = '';
    for(let i=0;i<d.length;i++){
       c+= `<div style="display: flex; flex-direction: column; gap: 10px;">
       <div style="display: flex; flex-direction: row; gap: 10px;">
       ${avatar ? `<img src="/${avatar}" style="height: fit-content; margin-top: 9px;">` : ''}
       <div style="display: flex; flex-direction: column; width: 90%;">
       <div style="display: flex; flex-direction: row; justify-content: space-between;">
       <p style="font-weight: 600; font-size: 12px; margin: 7px 0px; padding: 0px;">
       ${fullname}
       </p>
       <span class="span2">${d[i].likes.length}
       <img src="/images/pics/heart1.svg">
       </span>
       </div>
       <p style="font-weight: 400; font-size: 12px; line-height: 20px; letter-spacing: 0.01em;">
       ${d[i].text}
       </p>
       </div>
       </div>
       <div style="display: flex; flex-direction: row; gap: 20px; align-items: center;">
       <span style="font-weight: 400; font-size: 10px; line-height: 20px;">
       </span>
       <div data-number="0" style="font-weight: 600; font-size: 12px; color: rgb(0, 173, 166); cursor: pointer; height: fit-content;">
       <form method="POST" action="/profile/event/comment/destroy/${d[i]._id}">
       <input type="submit" value="Удалить" />
       </form>
       </div>
       </div>
       </div>`
    }
    return c
  }

  function generateComDiv(d,fullname = 'Имя пользователя',avatar = null){
    return `<div class="allEvBoxCont ChangedAllEvBoxCont" style="overflow-y: hidden;">
    <p id="p1" class="p1">Оставленные комментарии</p>
      <div id="photos" class="comments">
        ${genComTemp(d,fullname,avatar)}
      </div>
  </div>`
  }

  let gallery = document.getElementById("gallery")
  let comment = document.getElementById("comment")

  function viewEvent(k,type){
    let data = parseData(items)
    gallery.setAttribute("data-val",k)
    gallery.setAttribute("data-type",type)
    comment.setAttribute("data-val",k)
    comment.setAttribute("data-type",type)
    let d = findIm(data.event_impression_image,data[type][k]._id)


    appendDiv('items_box',generateDiv(d),'afterbegin',1)
    gallery.classList.add("active")
  }

  function viewEventComment(k,type){
    let data = parseData(items)
    let fullname = data.name + ' ' + data.surname
    let avatar = data.avatar ? data.avatar : null
 
    let d = findCom(data.event_comment,data[type][k]._id)

    appendDiv('items_box',generateComDiv(d,fullname,avatar),'afterbegin',1)

  }


  let imgItem = document.getElementsByClassName("imgItem");
  function setBorder(e) {
    let k = e.target.getAttribute('value')
    let type = e.target.getAttribute('type')
    viewEvent(k,type)
    for (i = 0; i < imgItem.length; i++) {
      imgItem[i].style.border = "none";
    }
    this.style.border = "2px solid #00ADA6";
    this.style.borderRadius = "5px";
    
  }

  function chnageView(e,type){
    gallery.classList.remove("active")
    comment.classList.remove("active")
    let k = e.getAttribute('data-val')
    let t = e.getAttribute('data-type')
    // console.log(k,t)
    // console.log(type)
    if(k && t){
      e.classList.add("active")
      if(type == 'gallery'){
        viewEvent(k,t)
      }else if(type == 'comment'){
        viewEventComment(k,t)
      }
    }
    
  }
  
  for (i = 0; i < imgItem.length; i++) {
    imgItem[i].addEventListener("click", setBorder);
  }