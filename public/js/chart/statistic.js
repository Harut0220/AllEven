data = parseData(data)
const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const d = new Date();

let eventCatName = []
let eventCatUt = []
let eventCatCol = []
let compCatName = []
let compCatUt = []
let compCatCol = []
let meetingUt=[]
// console.log("data.eventCategories",data.eventCategories);
meetingUt.push(data.meetingLength)
for(let e=0;e<data.eventCategories.length;e++){
    eventCatName.push(data.eventCategories[e].name)
    eventCatUt.push(data.eventCategories[e].utilizers)
    eventCatCol.push(random_rgba())
}

// console.log("data.meetingLength",data.meetingLength);


const ctx2 = document.getElementById('myChart').getContext('2d');
const myChart2 = new Chart(ctx2, {
type: 'doughnut',
data: {
    labels: [
        // 'Посетитель',
        'Пользователи'
      ],
      datasets: [{
        label: 'My First Dataset',
        // , data.organizers
        data: [data.visitors],
        backgroundColor: [
          // 'rgb(255, 99, 132)',
          'rgb(54, 162, 235)'
        ],
        hoverOffset: 1
      }]
}
});

const date = new Date();
const year = date.getFullYear();

const ctx3 = document.getElementById('myChart1').getContext('2d');
const myChart3 = new Chart(ctx3, {
type: 'scatter',
data: {
    labels: [
        monthNames[d.getMonth()],
        monthNames[d.getMonth() - 1],
        monthNames[d.getMonth() - 2],
      ],
      datasets: [{
        type: 'bar',
        label: 'Количество событий',
        data: [data.events[`${year}-${padTo2Digits(date.getMonth() + 1)}`], data.events[`${year}-${padTo2Digits(date.getMonth())}`], data.events[`${year}-${padTo2Digits(date.getMonth() - 1)}`]],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)'
      }, {
        type: 'line',
        label: 'Набор линейных данных',
        data: [50, 50, 50, 50],
        fill: false,
        borderColor: 'rgb(54, 162, 235)'
      }]
}
});

//myChartcomp
const myChartcomp = document.getElementById('myChartcomp').getContext('2d');
const myChartCompany = new Chart(myChartcomp, {
type: 'scatter',
data: {
    labels: [
        monthNames[d.getMonth()],
        monthNames[d.getMonth() - 1],
        monthNames[d.getMonth() - 2],
      ],
      datasets: [{
        type: 'bar',
        label: 'Количество событий',
        data: [data.events[`${year}-${padTo2Digits(date.getMonth() + 1)}`], data.events[`${year}-${padTo2Digits(date.getMonth())}`], data.events[`${year}-${padTo2Digits(date.getMonth() - 1)}`]],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)'
      }, {
        type: 'line',
        label: 'Набор линейных данных',
        data: [50, 50, 50, 50],
        fill: false,
        borderColor: 'rgb(54, 162, 235)'
      }]
}
});

//myChartmeet
const myChartmeet = document.getElementById('myChartmeet').getContext('2d');
const myChartmeeting = new Chart(myChartmeet, {
type: 'scatter',
data: {
    labels: [
        monthNames[d.getMonth()],
        monthNames[d.getMonth() - 1],
        monthNames[d.getMonth() - 2],
      ],
      datasets: [{
        type: 'bar',
        label: 'Количество событий',
        data: [data.events[`${year}-${padTo2Digits(date.getMonth() + 1)}`], data.events[`${year}-${padTo2Digits(date.getMonth())}`], data.events[`${year}-${padTo2Digits(date.getMonth() - 1)}`]],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)'
      }, {
        type: 'line',
        label: 'Набор линейных данных',
        data: [50, 50, 50, 50],
        fill: false,
        borderColor: 'rgb(54, 162, 235)'
      }]
}
});


const ctx = document.getElementById('myChart3').getContext('2d');
      const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: eventCatName,
              datasets: [{
                  label: 'Пользователи категории событий',
                  data: eventCatUt,
                  backgroundColor: eventCatCol,
                //   borderColor: ,
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });

      for(let e=0;e<data.companiesCat.length;e++){
        compCatName.push(data.companiesCat[e].name)
        eventCatUt.push(data.companiesCat[e].utilizers)
        eventCatCol.push(random_rgba())
    }

const ctx4 = document.getElementById('myChart4').getContext('2d');
const myChart4 = new Chart(ctx4, {
  type: 'bar',
  data: {
      labels: compCatName,
      datasets: [{
          label: 'Пользователи категории услуги',
          data: data.companiesLength,
          backgroundColor: eventCatCol,
        //   borderColor: ,
          borderWidth: 1
      }]
  },
  options: {
      scales: {
          y: {
              beginAtZero: true
          }
      }
  }
});

const meet=["Встречи"]

const ctx5 = document.getElementById('myChart5').getContext('2d');
const myChart5 = new Chart(ctx5, {
  type: 'bar',
  data: {
      labels: meet,
      datasets: [{
          label: 'Пользователи категории встречи',
          data: meetingUt,
          backgroundColor: eventCatCol,
        //   borderColor: ,
          borderWidth: 1
      }]
  },
  options: {
      scales: {
          y: {
              beginAtZero: true
          }
      }
  }
});

