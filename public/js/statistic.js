var yValues = [60];
  // " Посетитель " + yValues[0] + "%",
var xValues = [
  "Организатор " + yValues[1] + "%",
];
var barColors = ["#fee798"];

new Chart("myChart", {
  type: "doughnut",
  options: {
    title: {
      display: true,
    },
  },
  data: {
    labels: xValues,
    datasets: [
      {
        backgroundColor: barColors,
        data: yValues,
      },
    ],
  },
});
console.log(Chart);

var xValues1 = ["Янв.", "Фев", "Март", "Апр.", "Май", "Июнь"];
new Chart("myChart1", {
  type: "line",
  data: {
    labels: xValues1,
    datasets: [
      {
        data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
        borderColor: "#00ADA6",
        fill: false,
      },
    ],
  },
  options: {
    legend: { display: false },
  },
});
new Chart("myChartcomp", {
  type: "line",
  data: {
    labels: xValues1,
    datasets: [
      {
        data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
        borderColor: "#00ADA6",
        fill: false,
      },
    ],
  },
  options: {
    legend: { display: false },
  },
});
var xValues2 = ["Прошедшие", "Проходящие", "Предстооящие", "Отмененые"];
var yValues2 = [55, 49, 44, 24];
var barColors2 = ["#FEE798", "#FED487", "#00ADA6", "#01877D"];

new Chart("myChart2", {
  type: "doughnut",
  data: {
    labels: xValues2,
    datasets: [
      {
        backgroundColor: barColors2,
        data: yValues2,
      },
    ],
  },
  options: {
    title: {
      display: true,
    },
  },
});
var xValues3 = [
  "Рест./кафе",
  "Кино",
  "Конц.",
  "Театр",
  "Детям",
  "Фест.",
  "Спорт",
  "Квест",
  "Экск.",
  "Выст.",
  "Дегуст.",
  "Стендап",
  "Шоу",
  "Мюзикл",
  "Необычноe",
  "Игры",
  "Ночная жизнь",
  "Экстрим",
  "Другoe",
];
var yValues3 = [0, 100, 500, 1000, 2000, 3000, 4000, 5000, 10000];
var barColors3 = [
  "#00A29A",
  "#00A099",
  "#00A39B",
  "#00A098",
  "#01A69E",
  "#00897F",
  "#01ABA4",
  "#019086",
  "#01958C",
];

new Chart("myChart3", {
  type: "bar",
  data: {
    labels: xValues3,

    datasets: [
      {
        backgroundColor: barColors3,
        data: yValues3,
      },
    ],
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
    },
  },
});
function burgerMenu(icon) {
  const menu = document.querySelector(".Menu");
  icon.classList.toggle("change");
  if (menu.style.display == "none") {
    menu.style.display = "flex";
  } else {
    menu.style.display = "none";
  }
}


var xValues4 = [
  "Рест./кафе",
  "Кино",
  "Конц.",
  "Театр",
  "Детям",
  "Фест.",
  "Спорт",
  "Квест",
  "Экск.",
  "Выст.",
  "Дегуст.",
  "Стендап",
  "Шоу",
  "Мюзикл",
  "Необычноe",
  "Игры",
  "Ночная жизнь",
  "Экстрим",
  "Другoe",
];
var yValues4 = [0, 100, 500, 1000, 2000, 3000, 4000, 5000, 10000];
var barColors4 = [
  "#00A29A",
  "#00A099",
  "#00A39B",
  "#00A098",
  "#01A69E",
  "#00897F",
  "#01ABA4",
  "#019086",
  "#01958C",
];

new Chart("myChart4", {
  type: "bar",
  data: {
    labels: xValues4,

    datasets: [
      {
        backgroundColor: barColors4,
        data: yValues4,
      },
    ],
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
    },
  },
});

