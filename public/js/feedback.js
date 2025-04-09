const fbSocketProt = window.location.protocol == 'http:' ? 'ws' : 'wss';
let fbSocket = new WebSocket(`${fbSocketProt}://${window.location.host}/notification/ADMIN`);
items = parseData(items);

fbSocket.onopen = function(e) {
  console.log('fbSocket connected success')
};

function generateMes(data){
  let ms = ''
  if(data.length){
      for(let m=0;m<data.length;m++){
        if(data[m].user){
          ms+=`<div class="friendText">
          <div class="friendText1">
            <p>${data[m].message}</p>
            <span>${conntDateToHM(data[m].createdAt)}</span>
          </div>
        </div>`
        }
        else{
          ms+=`<div class="myText">
          <div class="myText1">
          <span>${conntDateToHM(data[m].createdAt)}</span>
          <p class="myTextVal">${data[m].message}</p>
          </div>
          </div>`
        }
      }
  }
  return ms
}

      // <p class="organ">${data.user && data.user.roles && data.user.roles.name ? lng(data.user.roles.name) : ""}</p>
const generateDiv = function(data){
  return`<div class="Notification1">
    <p>Ответ, пользователю</p>
    </div>
    <div class="profil">
    ${data.user && data.user.avatar ? `<img src="/${data.user.avatar}" class="profPic">` : ''}
    <div class="profilPic">
      <p class="name" id="name">${data.user && data.user.name ? data.user.name : ''}</p>
    </div>
    </div>
    <div class="messageArea">
    <div class="messageArea2" id="messageArea2">
      <div class="day">${conntDateToHM(data.createdAt)}</div>
      ${generateMes([data])}
      ${generateMes(data.sub_message)}
    </div>
    <div class="form">
      <input type="text" class="inpSend" id="inpSend" placeholder="Добавить комментарий"><img src="/images/staticimg/Vector (1).svg" onclick="saveNotification('${data._id}','${data.user._id}')">
    </div>

    </div>`
}


function viewMeaage(k, feedback){
  if (feedback) {
    window.location = window.location.toString().split('?')[0] + '?q=' + feedback
  }
  appendDiv('messages',generateDiv(items[k]),'afterbegin',1)
}


async function storeMessage(url = '/admin/profile/notification/feedback/store', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  let d = await response.json()
  return d;
}

function appendMessage(data){
  let m = `<div class="myText">
  <div class="myText1">
  <span>${conntDateToHM(data.createdAt)}</span>
  <p class="myTextVal">${data.message}</p>
  </div>
  </div>`
  appendDiv('messageArea2',m,'beforeend')
}

function appendIncomMessage(data){
  let m = `<div class="friendText">
  <div class="friendText1">
    <p>${data.message}</p>
    <span>${conntDateToHM(data.createdAt)}</span>
  </div>
</div>`
  appendDiv('messageArea2',m,'beforeend')
}

function saveNotification(id, user = null){
  
  
  let message = document.getElementById('inpSend')
  appendMessage({message:message.value, createdAt: new Date().toISOString()})
  storeMessage('/admin/profile/notification/feedback/store',{message:message.value,parent_id:id,user})
  message.value = ''
}

function addToList(data){
  let div = `<div class=" listProfil" onclick="viewMeaage(${items.length - 1})">
    <div class="listProfilPic">
      <p class="listProfilname">${data.user.name}</p>
      <span class="listProfilJam">${conntDateToHM(data.createdAt)}</span>
      <p class="listProfilText">${data.message ? data.message : ''}</p>
    </div>
  </div>`
  appendDiv('listNot',div)
}

function findFB(id){
  for(let f=0;f<items.length;f++){
    if(items[f]._id == id){
      return f;
    }
  }
}

if(searchQParam('q')){
viewMeaage(findFB(searchQParam('q')))
}