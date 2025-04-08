// const socketProt = window.location.protocol == "http:" ? "ws" : "wss";
// const socket = new WebSocket(
//   `${socketProt}://${window.location.host}/notification/ADMIN`
// );
// let notifListMod = document.getElementById("notifModal");
// console.log(`${socketProt}://${window.location.host}/notification/ADMIN`,"${socketProt}://${window.location.host}/notification/ADMIN");

// socket.onopen = function (e) {
//   console.log("connected success");
// };
const socketProt = window.location.protocol === "http:" ? "ws" : "wss";
const socketUrl = `${socketProt}://${window.location.host}/notification/ADMIN`;
console.log("WebSocket URL: ", socketUrl); // Debugging

const socket = new WebSocket(socketUrl);

socket.onopen = () => console.log("WebSocket connected successfully!");
// socket.onmessage = (event) => console.log("Received:", event.data);
socket.onerror = (error) => console.error("WebSocket error:", error);
// socket.onclose = () => console.log("WebSocket closed");


function genRoute(data) {
  console.log('genRoute: ', data);
  switch (data.type) {
    case "Обратная связь":
      if (data.data.parent) {
        return `/admin/profile/notification/feedback?q=${data.data.parent._id}`;
      }
      return `/admin/profile/notification/feedback?q=${data.data._id}`;
    case "Подтвердил документ":
      return "/admin/profile/documents/subscribed-users";
    case "Онлайн оплата":
      return `/admin/profile/company/online/single/${data.data._id}`;
    case "Новая услуга":
      return `/admin/profile/company/single/${data.data._id}`;
    case "Новая встреча":
      return `/admin/profile/meeting/single/${data.data._id}`
    case "Новая события":
      return `/admin/profile/event/single/${data.data._id}`;
    case "Новая категория":
      return `/admin/profile/notification/categories`;
    case "В модерации события":
        return `/admin/profile/event/single/${data.data._id}`;  
    case "Событие находится на модерации":
        return `/admin/profile/event/single/${data.data._id}`;  
    default:
      return "";
  }
}

function removeNotif(el){
  el.parentElement.remove();
  let c = document.getElementById("notificationCountSpan");

  if(c.innerHTML == '1'){
    c.innerHTML = ''
  }

  if(c.innerHTML && c.innerHTML != 0){
    c.innerHTML = +c.innerHTML - 1;
  }

}

function generateNotifDiv(data) {
  console.log(data, "dataNOTIF");
  
  return `<div class="notificationModalChild">
  <div>${data.type}</div>
  <a href='${genRoute(data)}'>${data.message}</a>
  <input
    class="notifModalRemove"
    type="image"
    name="category"
    src="/images/pics/delete 1.svg"
    onclick="removeNotif(this)"
  />
</div>`;
}

function iconActive(status = 1) {
  let ic = document.getElementById("notificationIcon");
  if (status) {
    ic.classList.add("notificationIcon-active");
  } else {
    ic.classList.remove("notificationIcon-active");
  }
}

socket.onmessage = function (event) {
  console.log(window.location.toString().split('=')[1]);
  let data = parseData(event.data);
  console.log(event.data,"event.data");
  console.log(event, "event");
  
  appendDiv("notifModal", generateNotifDiv(data));
  console.log(data);
  let nMod = document.getElementById("notifModal");
  let nModLength = nMod.querySelectorAll('.notificationModalChild').length;
  document.getElementById("notificationCountSpan").innerHTML = nModLength && nModLength != 0 ? nModLength : ''
  iconActive(1);
  const parentId = window.location.toString().split('=')[1]
  if (parentId && parentId == data.data.parent._id) {
    // removeNotif()
    window.location.reload()
  }
};

socket.onclose = function (event) {
  console.log("[close] Соединение прервано");
};

// socket.onerror = function(error) {
//   alert(`[error] ${error.message}`);
// };

function notifList(id, display = "block") {
  let x = document.getElementById(id);
  if (x.style.display === "none") {
    x.style.display = display;
  } else {
    x.style.display = "none";
  }
  iconActive(0);
}

