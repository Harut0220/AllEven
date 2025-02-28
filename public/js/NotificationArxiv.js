const NotTitle = [
  "№",
  "Текст уведомления ",
  "Тип уведомления",
  "Кому",
  "Дата",
  "Время",
  "Статус",
  "Вкл/Выкл",
  "Редак.",
];
const NotObj = [
  {
    id: 1,
    text: "asdasdasdasdsad",
    type: "по ролям ",
    whom: "Посетитель",
    data: "20/10/22",
    time: "20:00",
    status: "Запланирован",
    toggle:
      "<label class='switch'><input type='checkbox' ><span class='slider round'></span> </label>",
    change: "<img src='staticimg/Vector2.svg'>",
  },
  {
    id: 2,
    text: "asdasdasdasdsad",
    type: "по ролям ",
    whom: "Посетитель",
    data: "20/10/22",
    time: "20:00",
    status: "Запланирован",
    toggle:
      "<label class='switch'><input type='checkbox' ><span class='slider round'></span> </label>",
    change: "<img src='staticimg/Vector2.svg'>",
  },
  {
    id: 3,
    text: "asdasdasdasdsad",
    type: "по ролям ",
    whom: "Посетитель",
    data: "20/10/22",
    time: "20:00",
    status: "Запланирован",
    toggle:
      "<label class='switch'><input type='checkbox' ><span class='slider round'></span> </label>",
    change: "<img src='staticimg/Vector2.svg'>",
  },
  {
    id: 4,
    text: "asdasdasdasdsad",
    type: "по ролям ",
    whom: "Посетитель",
    data: "20/10/22",
    time: "20:00",
    status: "Запланирован",
    toggle:
      "<label class='switch'><input type='checkbox' ><span class='slider round'></span> </label>",
    change: "<img src='staticimg/Vector2.svg'>",
  },
  {
    id: 5,
    text: "asdasdasdasdsad",
    type: "по ролям ",
    whom: "Посетитель",
    data: "20/10/22",
    time: "20:00",
    status: "Запланирован",
    toggle:
      "<label class='switch'><input type='checkbox' ><span class='slider round'></span> </label>",
    change: "<img src='staticimg/Vector2.svg'>",
  },
];
const table = document.querySelector(".allNotification");
const tr = document.createElement("tr");
table.appendChild(tr);
NotTitle.forEach((el, index) => {
  const td = document.createElement("td");
  td.setAttribute("class", "td" + index);
  td.innerHTML = el;
  tr.appendChild(td);
});
NotObj.forEach((el, index) => {
  const tr1 = document.createElement("tr");
  table.appendChild(tr1);
  Object.values(el).forEach((el1, index) => {
    const td = document.createElement("td");
    td.setAttribute("class", "td" + index);
    td.innerHTML = el1;
    tr1.appendChild(td);
  });
});
