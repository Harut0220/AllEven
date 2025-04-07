function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function delete_cookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function conntDateToYMD(date) {
  
  
  return date.substring(0, 10);
}

function conntDateToHM(isoTime) {
  // var hours = parseInt(isoTime.substring(0, 2), 10),
  //   minutes = isoTime.substring(3, 5),
  //   ampm = "am";

  // if (hours == 12) {
  //   ampm = "pm";
  // } else if (hours == 0) {
  //   hours = 12;
  // } else if (hours > 12) {
  //   hours -= 12;
  //   ampm = "pm";
  // }

  // return hours + ":" + minutes + " " + ampm;
  let date = new Date(isoTime);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return isoTime.substring(11, 16);
  return hours + ":" + minutes;
}

function appendDiv(id, data, ap = "afterbegin", clean = null) {
  let d = document.getElementById(id);
  
  if (clean) {
    d.innerHTML = "";
  }
  d.insertAdjacentHTML(ap, data);
}

function parseData(data) {
  data = data.replace(/&quot;/g, `"`);
  data = data.replace(/\n|\r/g, "");
  data = JSON.parse(data);
  return data;
}

function toggleModal(id, display = "block") {
  let x = document.getElementById(id);
  if (x.style.display === "none") {
    x.style.display = display;
  } else {
    x.style.display = "none";
  }
}

function closeFilterModal() {
  let filterBox = document.getElementById("filter");
  filterBox.style.display = "none";
}

function random_rgba() {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return (
    "rgba(" +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    r().toFixed(1) +
    ")"
  );
}

function searchQParam(q) {
  let params = new URLSearchParams(window.location.search);
  return params.get(q) ?? null;
}

//const notificModal = document.getElementById("notifModal");
var closeModal = document.getElementsByClassName("notifModalRemove");
for (i = 0; i < closeModal.length; i++) {
  closeModal[i].onclick = function () {
    var div = this.parentElement;
    div.remove();
    if (closeModal.length == 0) {
      notifModal.style.border = "none";
    }
  };
}
if (closeModal.length == 0) {
  notifModal.style.border = "none";
}
function burgerMenu(icon) {
  const menu = document.querySelector(".Menu");
  icon.classList.toggle("change");
  if (menu.style.display == "none") {
    menu.style.display = "flex";
  } else {
    menu.style.display = "none";
  }
}

function lng(text, l = "ru") {
  const ru = {
    ADMIN: "Администратор",
    MODERATOR: "Модератор",
    VISITOR: "Посетитель",
    ORGANIZER: "Организатор",
    ALL: "Всем",
    all: "Всем",
    system: "По системным работам",
    general: "Общие",
    advertising: "Реклама",
  };

  return ru[text];
}
function toggleMenu() {
  const menu = document.getElementsByClassName("Header1")[0];
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
    menu.classList.add("hideMenu");
  } else if (menu.classList.contains("hideMenu")) {
    menu.classList.remove("hideMenu");
    menu.classList.add("showMenu");
  } else menu.classList.add("showMenu");
}

(function () {
  const tab_targets = document.querySelectorAll(
    `.allEvBoxCont.ChangedAllEvBoxCont`
  );
  const tabs = document.querySelectorAll(`[data-target]`);

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const id = e.target?.getAttribute("data-target");
      const tab_target = [...tab_targets].find((t) => t?.id == id);
      tab_targets.forEach((t) => t?.classList.remove("active"));
      tabs.forEach((t) => t?.classList.remove("active"));

      e.target?.classList.add("active");
      tab_target.classList.add("active");
    });
  });
})();
