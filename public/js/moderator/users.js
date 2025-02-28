function burgerMenu(icon) {
    const menu = document.querySelector(".Menu");
    icon.classList.toggle("change");
    if (menu.style.display == "none") {
      menu.style.display = "flex";
    } else {
      menu.style.display = "none";
    }
  }
  
  let clients = document.getElementById("clients");
  let a10 = 1;
  function returN(arg) {
    a10++;
    return arg++;
  }
  
  let obj = [
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров2",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров3",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров4",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров5",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров6",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров7",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров8",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
    },
  ];
  
  let tbody1 = document.getElementById("tbody1");
  let mainObj = obj;
  function addClients() {
    for (i = 0; i < mainObj.length; i++) {
      let tr = document.createElement("tr");
      tbody1.appendChild(tr);
      for (a = 0; a < Object.keys(mainObj[i]).length; a++) {
        let td = document.createElement("td");
        td.className = "td";
  
        if (Object.keys(mainObj[i])[a] == "name") {
          td.className = "td tdName";
        }
        if (Object.keys(mainObj[i])[a] == "direction") {
          let img = document.createElement("img");
          img.style.margin = "0 0 -1px";
          img.style.cursor = "pointer";
          img.src = "../pics/Vector 202.svg";
          td.style.textAlign = "center";
          td.appendChild(img);
        } else if (Object.keys(mainObj[i])[a] == "ban") {
          let img = document.createElement("img");
          img.style.margin = "0 0 -4px";
          img.style.cursor = "pointer";
          img.src = "../pics/ban 1.svg";
          img.setAttribute("data-number", i);
          img.onclick = banOpen;
          td.style.textAlign = "center";
          td.appendChild(img);
        } else {
          td.innerHTML = Object.values(mainObj[i])[a];
        }
        tr.appendChild(td);
      }
    }
  }
  addClients();
  
  let periodInp = document.getElementById("period");
  function period() {
    if (checkbox1.checked) {
      periodInp.style.display = "flex";
    } else {
      periodInp.style.display = "none";
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
  
  let denyDivBackDiv = document.getElementById("denyDivBackDiv");
  
  let tdName = document.getElementsByClassName("tdName");
  let chooseName = document.getElementById("chooseName");
  
  let pox1;
  function banOpen() {
    pox1 = "";
    denyDivBackDiv.style.display = "flex";
    chooseName.innerHTML =
      tdName[+this.attributes["data-number"].value].innerHTML;
    pox1 = +this.attributes["data-number"].value;
  }
  function banClose() {
    denyDivBackDiv.style.display = "none";
  }
  function banClient() {
    // obj.splice(pox1, 1);
  
    tbody1.innerHTML = "";
    addClients();
  
    denyDivBackDiv.style.display = "none";
  }
  