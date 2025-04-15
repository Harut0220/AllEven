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
      return `/admin/profile/meeting/single/${data.data._id}`;
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

// function removeNotif(el) {  
//   // const localSocket = JSON.parse(localStorage.getItem("notifCount"));
//   // let nMod = document.getElementById("notifModal");
//   // localStorage.setItem("notifDataRemove", name);



//   el.parentElement.remove();
//   let c = document.getElementById("notificationCountSpan");

//   if (c.innerHTML == "1") {
//     c.innerHTML = "";
//   }

//   if (c.innerHTML && c.innerHTML != 0) {
//     c.innerHTML = +c.innerHTML - 1;
//   }
// }



// function generateNotifDiv(data) {
//   return `<div class="notificationModalChild">
//   <div>${data.type}</div>
//   <a href='${genRoute(data)}' onclick="removeMessage('${data.message}')">${data.message}</a>
//   <input
//     class="notifModalRemove"
//     type="image"
//     name="category"
//     src="/images/pics/delete 1.svg"
//     onclick="removeNotif(this)"
//   />
// </div>`;
// }

function iconActive(status = 1) {
  let ic = document.getElementById("notificationIcon");
  if (status) {
    ic.classList.add("notificationIcon-active");
  } else {
    ic.classList.remove("notificationIcon-active");
  }
}

// socket.onmessage = function (event) {
//   let data = parseData(event.data);
//   console.log(data, "data by keys");

//   let nMod = document.getElementById("notifModal");
//   let nModLength = nMod.querySelectorAll(".notificationModalChild").length;
//   document.getElementById("notificationCountSpan").innerHTML =
//     nModLength && nModLength != 0 ? nModLength : "";
//   iconActive(1);
//   const parentId = window.location.toString().split("=")[1];
//   if (parentId && parentId == data.data.parent._id) {
//     window.location.reload();
//   }
//   const localSocket = JSON.parse(localStorage.getItem("notifCount"));
//   if (!localSocket) {
//     let obj = {
//       countNotif: 1,
//       notifs: [data],
//     };
//     localStorage.setItem("notifCount", JSON.stringify(obj));
//     document.getElementById("notificationCountSpan").innerHTML =1;
//     appendDiv("notifModal", generateNotifDiv(data));

//     console.log("socketic galuc storage chka");
//   } else {
//     let obj = {
//       countNotif: Number(localSocket.countNotif) + 1,
//       notifs: [...localSocket.notifs, data],
//     };
//     console.log("socketic galuc storage ka heto hner@ u nor@ irar het", obj);
//     nMod.innerHTML = ""; // 💥 This clears the content

//     document.getElementById("notificationCountSpan").innerHTML =
//     Number(localSocket.countNotif) + 1;
//     console.log(document.getElementById("notificationCountSpan").innerHTML,"document.getElementById(notificationCountSpan).innerHTML");
    
//     obj.notifs.map((el) => {
//       console.log("el");

//       appendDiv("notifModal", generateNotifDiv(el));
//     });
//     localStorage.setItem("notifCount", JSON.stringify(obj));
//   }
// };



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


// function removeMessage(name) {
//   console.log("removeMessage",name);
//   const localSocket = JSON.parse(localStorage.getItem("notifCount"));
//   let nMod = document.getElementById("notifModal");
//   localStorage.setItem("notifDataRemove", name);
//   const updated = localSocket.notifs.filter((el)=>{
//     return el.message!==name
//   })
//   const count=localSocket.countNotif-1
//   let obj={
//     countNotif:count>0?count: "",
//     notifs:updated
//   }

//   localStorage.setItem("notifData", JSON.stringify(obj));




  // const newNotif=localSocket.notifs.filter((el)=>{
  //   return el.message !== name
  // })
  // console.log(newNotif,"newNotif filtered notifs");
  // let obj={
  //   countNotif:localSocket.countNotif-1,
  //   notifs:newNotif
  // }
  // // const localSocketUpdated= localStorage.updateItem("notifCount");
  // localStorage.setItem("notifData", JSON.stringify(obj));
  // const localSocketUpdated= JSON.parse(localStorage.getItem("notifCount"));
  // nMod.innerHTML = ""; // 💥 This clears the content
  // localSocketUpdated.notifs.map((el)=>{
  //   appendDiv("notifModal", generateNotifDiv(el));
  // })
  // document.getElementById("notificationCountSpan").innerHTML = localSocketUpdated.countNotif
// }



// const savedCount = JSON.parse(localStorage.getItem("notifCount"));

// console.log(savedCount, "refreshic heto");
// if (!savedCount) {
//   document.getElementById("notificationCountSpan").innerHTML = "";
// } else {
//   const nameForRemove = localStorage.getItem("notifDataRemove");
//   console.log(nameForRemove, "nameForRemove");

//   if (nameForRemove) {
//     console.log("name for remove");
    
//     const filterData = savedCount.notifs.filter((el) => {
//       return el.message !== nameForRemove;
//     });
//     const updatedCount = savedCount.notifs.length - 1;

//     let obj = {
//       countNotif: updatedCount > 0 ? updatedCount : " ",
//       notifs: filterData,
//     };
//     console.log("obj",obj);
    
//     localStorage.setItem("notifCount", JSON.stringify(obj));
//     document.getElementById("notificationCountSpan").innerHTML =
//       updatedCount > 0 ? updatedCount : " ";
//     filterData.map((el) => {
//       appendDiv("notifModal", generateNotifDiv(el));
//     });
//     localStorage.clear("notifDataRemove");
//   } else {
//     document.getElementById("notificationCountSpan").innerHTML =
//       savedCount.notifs.length;
//     savedCount.notifs.map((el) => {
//       appendDiv("notifModal", generateNotifDiv(el));
//     });
//   }
// }

































window.addEventListener("DOMContentLoaded", () => {
  const savedCount = JSON.parse(localStorage.getItem("notifCount"));
  const nameForRemove = localStorage.getItem("notifDataRemove");
  const notifSpan = document.getElementById("notificationCountSpan");
  const notifModal = document.getElementById("notifModal");

  // notifModal.innerHTML = "";

  // if (!savedCount || !savedCount.notifs) {
  //   notifSpan.innerHTML = "";
  //   return;
  // }

  // let notifs = savedCount.notifs;

  // if (nameForRemove) {
  //   notifs = notifs.filter((el) => el.message !== nameForRemove);
  //   localStorage.removeItem("notifDataRemove");
  //   const obj = {
  //     countNotif: notifs.length > 0 ? notifs.length : "",
  //     notifs,
  //   };
  //   localStorage.setItem("notifCount", JSON.stringify(obj));
  // }

  // notifSpan.innerHTML = notifs.length > 0 ? notifs.length : "";
  // notifs.forEach((el) => appendDiv("notifModal", generateNotifDiv(el)));
});


function generateNotifDiv(data) {
  // console.log(data,"data");
  
  return `<div class="notificationModalChild" id="notif-${data.message}">
    <div>${data.type}</div>
    <a href='${genRoute(data)}' onclick="removeMessage('${data.message}','${data._id}')">
      ${data.message}
    </a>
    <input
      class="notifModalRemove"
      type="image"
      name="category"
      src="/images/pics/delete 1.svg"
      onclick="removeNotif(this, '${data.message}','${data._id}')"
    />
  </div>`;
}


function removeNotif(el, message,id) {
  el.parentElement.remove();
  // console.log(message,id,"message,id");
  const count= document.getElementById("notificationCountSpan").innerHTML;
  document.getElementById("notificationCountSpan").innerHTML=Number(count)-1
  
  axios.post(`/admin/profile/notification/confirm/${id}`)
  // const localSocket = JSON.parse(localStorage.getItem("notifCount"));
  // if (!localSocket) return;

  // const updated = localSocket.notifs.filter((el) => el.message !== message);
  // const count = updated.length;

  // let obj = {
  //   countNotif: count > 0 ? count : "",
  //   notifs: updated,
  // };

  // localStorage.setItem("notifCount", JSON.stringify(obj));
  // document.getElementById("notificationCountSpan").innerHTML = count > 0 ? count : "";
}


function removeMessage(message,id) {
  const count= document.getElementById("notificationCountSpan").innerHTML;
  document.getElementById("notificationCountSpan").innerHTML=Number(count)-1
  axios.post(`/admin/profile/notification/confirm/${id}`)

  // console.log("removeMessage", message);
  // localStorage.setItem("notifDataRemove", message);
}


const getCleaningData = async () => {
  try {
    const response = await axios.get('/admin/profile/notifications/admin');
    const cleaningData = response.data;
    // console.log('Cleaning Data:', cleaningData);
    return cleaningData;
  } catch (error) {
    console.error('Error fetching cleaning data:', error);
    throw error;
  }
};

// This needs to be wrapped in an async function
const loadNotifs = async () => {
  const notifsAdmin = await getCleaningData();
  // console.log("res data notif", notifsAdmin);
   document.getElementById("notificationCountSpan").innerHTML = notifsAdmin.messages.length > 0 ?  notifsAdmin.messages.length : "";

  notifsAdmin.messages.forEach(el => {
    // console.log(el, "el");
    el._id=
    appendDiv("notifModal", generateNotifDiv(el));
  });
};

loadNotifs(); // run the async wrapper



socket.onmessage = function (event) {
  let data = parseData(event.data);
  iconActive(1);
  const parentId = window.location.toString().split("=")[1];

  if (parentId && parentId == data.data.parent._id) {
    window.location.reload();
    return;
  }
  appendDiv("notifModal", generateNotifDiv(data));
  const count= document.getElementById("notificationCountSpan").innerHTML;
  document.getElementById("notificationCountSpan").innerHTML=Number(count)+1
  // const localSocket = JSON.parse(localStorage.getItem("notifCount"));
  // const notifModal = document.getElementById("notifModal");

  // if (!localSocket) {
  //   let obj = {
  //     countNotif: 1,
  //     notifs: [data],
  //   };
  //   localStorage.setItem("notifCount", JSON.stringify(obj));
  //   document.getElementById("notificationCountSpan").innerHTML = 1;
  //   appendDiv("notifModal", generateNotifDiv(data));
  // } else {
  //   const count = typeof localSocket.countNotif === "string" ?Number(localSocket.countNotif)+1:localSocket.countNotif+1
  //   let updated = {
  //     countNotif: count,
  //     notifs: [...localSocket.notifs, data],
  //   };
  //   localStorage.setItem("notifCount", JSON.stringify(updated));
  //   document.getElementById("notificationCountSpan").innerHTML = updated.countNotif;

  //   notifModal.innerHTML = "";
  //   updated.notifs.forEach((el) => {
  //     appendDiv("notifModal", generateNotifDiv(el));
  //   });
  // }
};





