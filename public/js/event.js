function burgerMenu(icon) {
    const menu = document.querySelector(".Menu");
    icon.classList.toggle("change");
    if (menu.style.display == "none") {
      menu.style.display = "flex";
    } else {
      menu.style.display = "none";
    }
  }
  let events = document.getElementById("events");
  let allEvents = document.getElementById("allEvents");
  let newEvent = document.getElementById("newEvent");
  let changeEvent = document.getElementById("changeEvent");
  
  let deniedDiv = document.getElementById("deniedDiv");
  
  let notifA = document.getElementsByClassName("notification_a");
  
  let changeNavText = document.getElementById("changeNavText")
  
  
  function penClickFunc() {
    events.style.display = "none";
    newEvent.style.display = "none";
    allEvents.style.display = "none";
    deniedDiv.style.display = "none";
    changeEvent.style.display = "flex";
  
    for (i = 0; i < notifA.length; i++) {
      notifA[i].setAttribute("class", "notification_a");
    }
    notifA[2].setAttribute("class", "notification_a active");
  }
  
  let imgHeart = '<img style="margin-bottom:-2px" src="./clients/heart.svg" />';
  let obj = [
    {
      id: 1,
      catalog: "Дегустация",
      name: "Дегустация Кофе",
      person: "Имя Фамилия",
      status: "Запланированое",
      date: "07.07.22-17.07.22",
      location: "",
      rating: "4.8/ " + imgHeart + " 300",
      changing: "",
    },
    {
      id: 2,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "Текущие",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 3,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 4,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 5,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 6,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 7,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 8,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 9,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 10,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 11,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
  ];
  let objForTop = [
    {
      id: 1,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "Запланированое",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 2,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "Текущие",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 3,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 4,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 5,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 6,
      catalog: "aaaaaaa",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 7,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 8,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 9,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 10,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 11,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
    {
      id: 12,
      catalog: "",
      name: "",
      person: "",
      status: "",
      date: "",
      location: "",
      rating: "",
      changing: "",
    },
  ];
  
  let tbody1 = document.getElementById("tbody1");
  let mainObj = obj;
  function addEvent() {
    // let table = document.getElementById("table");
    newEvent.style.display = "none";
    // deniedDiv.style.display = "none";
  
    for (i = 0; i < notifA.length; i++) {
      notifA[i].setAttribute("class", "notification_a");
    }
    notifA[2].setAttribute("class", "notification_a active");
  
    for (i = 0; i < mainObj.length; i++) {
      let tr = document.createElement("tr");
      tbody1.appendChild(tr);
      for (a = 0; a < Object.keys(mainObj[i]).length; a++) {
        let td = document.createElement("td");
        td.className = "td";
  
        if (Object.keys(mainObj[i])[a] == "id") {
          let checkbox = document.createElement("input");
          checkbox.style.textAlign = "center";
          checkbox.style.width = "16px";
          checkbox.style.height = "16px";
          checkbox.type = "checkbox";
          // td.style.padding = "10px";
          // td.style.textAlign = "center";
          // td.innerHTML = Object.values(obj[i])[a];
          td.appendChild(checkbox);
        } else if (Object.keys(mainObj[i])[a] == "changing") {
          let img = document.createElement("img");
          img.src = "../staticimg/Vector1(1).svg";
          img.style = "width: 15px;height: 16px;cursor:pointer";
          img.onclick = penClickFunc;
          td.style.display = "flex";
          td.style.justifyContent = "center";
          td.style.padding = "11px 10px";
          td.appendChild(img);
        } else {
          td.innerHTML = Object.values(mainObj[i])[a];
        }
        tr.appendChild(td);
      }
    }
  }
  addEvent();
  
  let pox = 0;
  function filterShow() {
    let hideDiv = document.getElementById("filter");
    if (pox === 0) {
      hideDiv.style.display = "flex";
      pox++;
    } else if (pox === 1) {
      hideDiv.style.display = "none";
      pox--;
    }
  }
  
  let checkbox1 = document.getElementById("checkbox1");
  let periodInp = document.getElementById("period");
  function period() {
    if (checkbox1.checked) {
      periodInp.style.display = "flex";
    } else {
      periodInp.style.display = "none";
    }
  }
  function changeToTop() {
    changeEvent.style.display = "none";
    newEvent.style.display = "none";
    allEvents.style.display = "none";
    deniedDiv.style.display = "none";
  
    events.style.display = "flex";
  
    changeNavText.innerHTML = "Топ события"
    mainObj = objForTop;
    tbody1.innerHTML = "";
    addEvent();
    for (i = 0; i < notifA.length; i++) {
      notifA[i].setAttribute("class", "notification_a");
    }
    notifA[1].setAttribute("class", "notification_a active");
  
    toEvent()
  }
  function changeToAllEvents() {
    newEvent.style.display = "none";
    allEvents.style.display = "none";
    changeEvent.style.display = "none";
    deniedDiv.style.display = "none";
  
    events.style.display = "flex";
  
    changeNavText.innerHTML = "Все событии"
  
    mainObj = obj;
    tbody1.innerHTML = "";
    addEvent();
    for (i = 0; i < notifA.length; i++) {
      notifA[i].setAttribute("class", "notification_a");
    }
    notifA[2].setAttribute("class", "notification_a active");
  
    toEvent()
  }
  
  let arrForPhotos = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
  ];
  
  let a1 = document.getElementsByClassName("a1");
  let boxLi = document.getElementsByClassName("boxLi");
  let p1 = document.getElementById("p1");
  let allEvBoxCont = document.getElementsByClassName("allEvBoxCont ")[1];
  
  let photos = document.getElementById("photos");
  function createPhotos() {
    allEvBoxCont.style.overflowY = "hidden";
    p1.innerHTML = "Добавленные фото/видео";
  
    for (i = 0; i < boxLi.length; i++) {
      a1[i].setAttribute("class", "a1");
    }
    a1[0].setAttribute("class", "a1 active");
    photos.innerHTML = "";
    photos.setAttribute("class", "photos");
    for (i = 0; i < arrForPhotos.length; i++) {
      let div1 = document.createElement("div");
      div1.className = "emptyPhotosImg";
  
      let imgX = document.createElement("img");
      imgX.style = "margin:7px; cursor:pointer";
      imgX.src = "../staticimg/GroupX.svg";
      imgX.setAttribute("data-number", i);
  
      imgX.onclick = function () {
        arrForPhotos.splice(+this.attributes["data-number"].value, 1);
        // console.log(arrForPhotos.length);
        createPhotos();
      };
  
      // div1.style.background = `url(${arrForPhotos[i]})`
  
      div1.appendChild(imgX);
      photos.appendChild(div1);
    }
  }
  createPhotos();
  
  let arrForComments = [
    {
      name: "Имя пользователя",
      text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
      likes: 20,
      time: "30 мин.",
    },
    {
      name: "Имя пользователя",
      text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
      likes: 20,
      time: "30 мин.",
    },
    {
      name: "Имя пользователя",
      text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
      likes: 20,
      time: "30 мин.",
    },
    {
      name: "Имя пользователя",
      text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
      likes: 20,
      time: "30 мин.",
    },
    {
      name: "Имя пользователя",
      text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
      likes: 20,
      time: "30 мин.",
    },
    {
      name: "Имя пользователя",
      text: "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ",
      likes: 20,
      time: "30 мин.",
    },
  ];
  function createComments() {
    allEvBoxCont.style.overflowY = "hidden";
    for (i = 0; i < boxLi.length; i++) {
      a1[i].setAttribute("class", "a1");
    }
    a1[1].setAttribute("class", "a1 active");
    p1.innerHTML = "Оставленные комментарии";
    photos.innerHTML = "";
    photos.setAttribute("class", "comments");
    let comments = document.getElementsByClassName("comments")[0];
    for (i = 0; i < arrForComments.length; i++) {
      let divMain = document.createElement("div");
      divMain.style = "display:flex; flex-direction:column; gap: 10px;";
  
      let divMainDiv1 = document.createElement("div");
      divMainDiv1.style = "display:flex; flex-direction:row; gap: 10px;";
  
      let img = document.createElement("img");
      img.style.height = "fit-content";
      img.style.marginTop = "9px";
      img.src = "./clients/Ellipse 48.svg";
      divMainDiv1.appendChild(img);
  
      let div2 = document.createElement("div");
      div2.style = "display:flex; flex-direction: column; width: 90%;";
      let div2Cont1 = document.createElement("div");
      div2Cont1.style =
        "display:flex; flex-direction:row; justify-content:space-between";
  
      let p1 = document.createElement("p");
      p1.style = "font-weight: 600;font-size: 12px; margin:7px 0; padding:0";
      p1.innerHTML = arrForComments[i].name;
  
      let span1 = document.createElement("span");
      span1.className = "span2";
      span1.innerHTML =
        arrForComments[i].likes + '<img src="../staticimg/heart.svg" />';
  
      let p2 = document.createElement("p");
      p2.style =
        "font-weight: 400; font-size: 12px; line-height: 20px; letter-spacing: 0.01em;";
      p2.innerHTML = arrForComments[i].text;
  
      div2Cont1.appendChild(p1);
      div2Cont1.appendChild(span1);
      div2.appendChild(div2Cont1);
      div2.appendChild(p2);
  
      divMainDiv1.appendChild(div2);
  
      let divMainDiv2 = document.createElement("div");
      divMainDiv2.style =
        "display:flex; flex-direction:row;gap: 20px; align-items: center;";
  
      let time = document.createElement("span");
      time.style = "font-weight: 400; font-size: 10px; line-height: 20px;";
      time.innerHTML = arrForComments[i].time;
  
      let deleteBtn = document.createElement("div");
      deleteBtn.setAttribute("data-number", i);
      deleteBtn.onclick = function () {
        console.log(+this.attributes["data-number"].value);
        arrForComments.splice(+this.attributes["data-number"].value, 1);
        console.log(arrForComments.length);
        createComments();
      };
      deleteBtn.innerHTML = "Удалить";
      deleteBtn.style =
        "font-weight: 600;font-size: 12px;color: #00ADA6; cursor:pointer;height: fit-content;";
  
      divMainDiv2.appendChild(time);
      divMainDiv2.appendChild(deleteBtn);
  
      divMain.appendChild(divMainDiv1);
      divMain.appendChild(divMainDiv2);
      comments.appendChild(divMain);
    }
  }
  let arrForClients = [
    {
      src: "",
      name: "Имя пользователя",
    },
    {
      src: "",
      name: "Имя пользователя",
    },
    {
      src: "",
      name: "Имя пользователя",
    },
    {
      src: "",
      name: "Имя пользователя",
    },
    {
      src: "",
      name: "Имя пользователя",
    },
    {
      src: "",
      name: "Имя пользователя",
    },
  ];
  
  function createClients() {
    allEvBoxCont.style.overflowY = "auto";
    for (i = 0; i < boxLi.length; i++) {
      a1[i].setAttribute("class", "a1");
    }
    a1[2].setAttribute("class", "a1 active");
    photos.innerHTML = "";
    photos.setAttribute("class", "clients");
    p1.innerHTML = "Пришли на событие: 520";
  
    for (i = 0; i < arrForClients.length; i++) {
      let div1 = document.createElement("div");
      div1.style = "display:flex; flex-direction:row; gap:24px";
  
      let img = document.createElement("img");
      img.src = "./clients/client1.svg"; // arrForClients[i].src
      let divName = document.createElement("div");
      divName.innerHTML = arrForClients[i].name;
      divName.style = "margin: 5px 0 0; height: fit-content;";
  
      div1.appendChild(img);
      div1.appendChild(divName);
      photos.appendChild(div1);
    }
    let headerP = document.createElement("p");
    headerP.className = "p1";
    headerP.setAttribute("id", "p10");
    headerP.innerHTML = "Собирались посетить: 200";
    photos.appendChild(headerP);
  
    for (i = 0; i < arrForClients.length; i++) {
      let div1 = document.createElement("div");
      div1.style = "display:flex; flex-direction:row; gap:24px";
  
      let img = document.createElement("img");
      img.src = "./clients/client1.svg"; // arrForClients[i].src
      let divName = document.createElement("div");
      divName.innerHTML = arrForClients[i].name;
      divName.style = "margin: 5px 0 0; height: fit-content;";
  
      div1.appendChild(img);
      div1.appendChild(divName);
      photos.appendChild(div1);
    }
  }
  
  function wereGoingToCome() {
    createClients();
    let p10 = document.getElementById("p10");
    let boxUl = document.getElementById("boxUl");
    // document.getElementById("allEvents").getBoundingClientRect().top
    console.log(allEvBoxCont);
    allEvBoxCont.scrollTo(0, 10000);
    console.log(
      +p10.getBoundingClientRect().top - +boxUl.getBoundingClientRect().top
    );
  
    // setTimeout(console.log(p10), 1000)
    // setTimeout(p10.scrollIntoView({block: "start",inline:"start", behavior: "smooth"}), 1000)
  }
    

  
  function changeNotificationToNewEvent() {
    events.style.display = "none";
    allEvents.style.display = "none";
    newEvent.style.display = "none";
    deniedDiv.style.display = "none";
    changeEvent.style.display = "flex";
  
    mainObj = obj;
    tbody1.innerHTML = "";
    addEvent();
    for (i = 0; i < notifA.length; i++) {
      notifA[i].setAttribute("class", "notification_a");
    }
    notifA[0].setAttribute("class", "notification_a active");
  }
  
  let navbarImg = document.getElementsByClassName("navbarImg");
  let navbarItem = document.getElementsByClassName("menuA");
  
  function toClients() {
    for (i = 0; i < navbarItem.length; i++) {
      navbarItem[i].setAttribute("class", "menuA");
    }
  
    navbarItem[0].setAttribute("class", "menuA activeMenu");
  
    navbarImg[1].setAttribute("src", "./clients/GroupForEvent.svg");
    navbarImg[0].setAttribute("src", "./clients/Profile(active).svg");
  
    events.style.display = "none";
    newEvent.style.display = "none";
    allEvents.style.display = "flex";
    changeEvent.style.display = "none";
    deniedDiv.style.display = "none";
  
    for (i = 0; i < notifA.length; i++) {
      notifA[i].setAttribute("class", "notification_a");
    }
    notifA[2].setAttribute("class", "notification_a active");
  }
  
  function toEvent() {
    events.style.display = "flex";
    newEvent.style.display = "none";
    allEvents.style.display = "none";
    changeEvent.style.display = "none";
    deniedDiv.style.display = "none";
  
    for (i = 0; i < navbarItem.length; i++) {
      navbarItem[i].setAttribute("class", "menuA");
    }
  
    navbarItem[2].setAttribute("class", "menuA activeMenu");
  
    navbarImg[0].setAttribute("src", "./clients/Profile.svg");
    navbarImg[1].setAttribute("src", "./clients/GroupForEvent(active).svg");
  }
  
  let denyDivBackDiv = document.getElementById("denyDivBackDiv");
  let denyTextarea = document.getElementById("denyTextarea");
  let fillResponseMessage = document.getElementById("fillResponseMessage");
  let response =
    "Повседневная практика показывает, что укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. Повседневная укрепление и развитие структуры играет важную роль в формировании соответствующий условий активизации. ";
  function openDenyDiv() {
    denyDivBackDiv.style.display = "flex";
    denyTextarea.value = ""
  }
  function closeDenyDiv() {
    denyDivBackDiv.style.display = "none";
  }
  function getTextareaValue() {
    events.style.display = "none";
    newEvent.style.display = "none";
    allEvents.style.display = "none";
    changeEvent.style.display = "none";
  
    denyDivBackDiv.style.display = "none";
    deniedDiv.style.display = "flex";
    // response = denyTextarea.value;
    fillResponseMessage.innerHTML = denyTextarea.value;
  }