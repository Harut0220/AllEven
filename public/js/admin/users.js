function burgerMenu(icon) {
    const menu = document.querySelector(".Menu");
    icon.classList.toggle("change");
    if (menu.style.display == "none") {
      menu.style.display = "flex";
    } else {
      menu.style.display = "none";
    }
  }
  
  let denyDivBackDiv1 = document.getElementById("denyDivBackDiv1");
  
  let tdName1 = document.getElementsByClassName("tdName1");
  let chooseName1 = document.getElementById("chooseName1");
  function deleteOpen1() {
    pox1 = "";
    denyDivBackDiv1.style.display = "flex";
    // chooseName1.innerHTML =
      // tdName[+this.attributes["data-number"].value].innerHTML;
    // pox1 = +this.attributes["data-number"].value;
  }
  function deleteClose() {
    denyDivBackDiv1.style.display = "none";
  }
  function deleteClient() {
    console.log(11111);
    // obj.splice(pox1, 1);
  
    // tbody1.innerHTML = "";
    // addClients();
  
    denyDivBackDiv1.style.display = "none";
  }
  let clients = document.getElementById("clients");
  var a10 = 1;
  var a20 = 1;
  function returN(arg) {
    a10++;
    return arg;
  }
  function returN1(arg) {
    a20++;
    return arg;
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
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
    },
    {
      id: returN(a10),
      name: "Владислав  Сидоров1",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      ban: "",
      delete: "",
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
        } else if (Object.keys(mainObj[i])[a] == "direction") {
          let img = document.createElement("img");
          img.style.margin = "0 0 -1px";
          img.style.cursor = "pointer";
          img.src = "../pics/Vector 202.svg";
          td.style.textAlign = "center";
          td.appendChild(img);
        } else if (Object.keys(mainObj[i])[a] == "delete") {
          let img = document.createElement("img");
          img.style.margin = "0 0 -1px";
          img.style.cursor = "pointer";
          img.src = "../pics/delete 1.svg";
          img.onclick = deleteOpen1;
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
  // addClients();
  
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
  
  let tbody2 = document.getElementById("tbody2");
  
  let objForNewEvent = [
    {
      id: returN1(a20),
      name: "Владислав  Сидоров",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      confirm: "",
      delete: "",
    },
    {
      id: returN1(a20),
      name: "Владислав  Сидоров",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      confirm: "",
      delete: "",
    },
    {
      id: returN1(a20),
      name: "Владислав  Сидоров",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      confirm: "",
      delete: "",
    },
    {
      id: returN1(a20),
      name: "Владислав  Сидоров",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      confirm: "",
      delete: "",
    },
    {
      id: returN1(a20),
      name: "Владислав  Сидоров",
      phoneNumber: "+7 960 777 77 77",
      email: "imyafamiliya@mail.ru",
      date: "Организатор",
      role: "07.07.22-17.07.22",
      direction: "",
      confirm: "",
      delete: "",
    },
  ];
  function addNewEvent() {
    for (i = 0; i < objForNewEvent.length; i++) {
      let tr = document.createElement("tr");
      tbody2.appendChild(tr);
      for (a = 0; a < Object.keys(objForNewEvent[i]).length; a++) {
        let td = document.createElement("td");
        td.className = "td";
  
        if (Object.keys(objForNewEvent[i])[a] == "id") {
          let checkbox = document.createElement("input");
          checkbox.style.textAlign = "center";
          checkbox.style.width = "16px";
          checkbox.style.height = "16px";
          checkbox.type = "checkbox";
          // td.style.padding = "10px";
          // td.style.textAlign = "center";
          // td.innerHTML = Object.values(obj[i])[a];
          td.appendChild(checkbox);
        } else if (Object.keys(objForNewEvent[i])[a] == "direction") {
          let img = document.createElement("img");
          img.style.margin = "0 0 -1px";
          img.style.cursor = "pointer";
          img.src = "../pics/Vector 202.svg";
          td.style.textAlign = "center";
          td.appendChild(img);
        } else if (Object.keys(objForNewEvent[i])[a] == "confirm") {
          let div10 = document.createElement("div");
          let label = document.createElement("label");
          label.setAttribute("class", "switch");
          let checkbox = document.createElement("input");
          checkbox.className = "checkbox";
          let span = document.createElement("span");
          span.className = "slider round";
          checkbox.type = "checkbox";
          div10.style.display = "flex";
          div10.style.justifyContent = "center";
          label.appendChild(checkbox);
          label.appendChild(span);
          div10.appendChild(label);
          td.appendChild(div10);
        } else if (Object.keys(objForNewEvent[i])[a] == "delete") {
          let img = document.createElement("img");
          img.style.margin = "0 0 -1px";
          img.style.cursor = "pointer";
          img.onclick = deleteOpen1;
          img.src = "../pics/delete 1.svg";
          td.style.textAlign = "center";
          td.appendChild(img);
        } else {
          td.innerHTML = Object.values(objForNewEvent[i])[a];
        }
        tr.appendChild(td);
      }
    }
  }
  // addNewEvent();
  

  function getUsers (page) {
    const pages = document.getElementsByClassName("userPages");
    pages && pages[0] ? pages[page-1].href = `/admin/profile/users?page=${page}` : null
  }

  function getByRole(role) {
    window.location = role ? `/admin/profile/users?role=${role}` : `/admin/profile/users`;
  }

  function getDateFromInput() {
    const dateInputFrom = document.getElementById(`table_date_input`);
    const dateInputTo = document.getElementById(`table_date_input1`);
    return {
      date_from: dateInputFrom.value,
      date_to: dateInputTo.value
    };
  }

  function userFilter(flag) {
    const {date_from, date_to } = getDateFromInput();
    let date_str = '/admin/profile/users';
    let page = window.location.toString();
    if(window.location.toString().includes('role')) {
      const params = window.location.search.split('&')
      console.log('params: ', params);
      for (const param of params) {
        if (param.includes('role')) {
          date_str += `${param}`
        }
      }
    }
    if (!date_str.includes('role')) {
      date_str += `?`
    }
    if (flag == 0 && (page.includes('date_from') || !page.includes('date_from'))) {
      if (page.includes('date_to')) {
        date_str += `&date_to=${page.split('date_to=')[1].substring(0, 10)}`
      }
      date_str += `&date_from=${date_from}`
    }
    if (flag == 1 && (page.includes('date_to') || !page.includes('date_to'))) {
      if (page.includes('date_from')) {
        date_str += `&date_from=${page.split('date_from=')[1].substring(0, 10)}`
      }
      date_str += `&date_to=${date_to}`
    }
    window.location = date_str
  }