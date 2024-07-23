const calender = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const eventContainer = document.querySelector(".events");
const AddeventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const eventsArr = [
  {
    day: 17,
    month: 7,
    year: 2024,
    events: [
      {
        title: "発表",
        time: "10:00AM",
      },
      {
        title: "輪講",
        time: "11:00AM",
      },
    ],
  },
  {
    day: 18,
    month: 7,
    year: 2024,
    events: [
      {
        title: "発表",
        time: "10:00AM",
      },
    ],
  },
];

function initCalendar() {
  // Date(年, 月(0~11), 日, 時, 分)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  // getDate() -> 日を取得(1~31)
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  // getDay() -> 曜日を取得(0~6)
  const nextDays = 7 - lastDay.getDay() - 1;

  // headerの初期設定
  date.innerHTML = months[month] + " " + year;

  let days = "";
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((element) => {
      if (
        element.day == i &&
        element.month == month + 1 &&
        element.year == year
      ) {
        event = true;
      }
    });

    if (
      i == new Date().getDate() &&
      year == new Date().getFullYear() &&
      month == new Date().getMonth()
    ) {
      // 右の日付を初期化
      activeDay = i;
      getActiveDay(i);
      // get events of that day
      updateEvent(i);

      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day active today">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;

  //listenerをカレンダーが初期化された後追加
  addLister();
}

initCalendar();

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length == 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType == "deleteContentBackward") {
    if (dateInput.value.length == 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length == 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length == 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("invaild date");
}

const addEventBtn = document.querySelector(".add-event"),
  addEventContainer = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click", () => {
  addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
  // if click outside
  if (e.target != addEventBtn && !addEventContainer.contains(e.target)) {
    addEventContainer.classList.remove("active");
  }
});

addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 50);
});

addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace("[^0~9]g", "");
  if (addEventFrom.value.length == 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace("[^0~9]g", "");
  if (addEventTo.value.length == 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

function addLister() {
  //全てのdayクラスを抽出
  const days = document.querySelectorAll(".day");

  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      //クリックされた日のhtmlの数値（日付）をactiveDayに格納
      activeDay = Number(e.target.innerHTML);

      //クリックされた日を右に表示
      getActiveDay(activeDay);
      //update events when it was clicked
      updateEvent(activeDay);

      //全ての日のactiveを取り除く
      days.forEach((day) => {
        day.classList.remove("active");
      });

      //もし先月の日をクリックされたとき先月に戻って，activeを追加
      if (e.target.classList.contains("prev-date")) {
        prevMonth();

        setTimeout(() => {
          const days = document.querySelectorAll(".day");

          // 先月に移動後，activeをその日に追加
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML == e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        prevMonth();

        setTimeout(() => {
          const days = document.querySelectorAll(".day");

          // 先月に移動後，activeをその日に追加
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML == e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

// function to show events of taht day
function updateEvent(date) {
  let events = "";
  eventsArr.forEach((event) => {
    // gets events of only active days in that month
    if (event.day == date && event.month == month + 1 && event.year == year) {
      event.events.forEach((event) => {
        events += `
        <div class="event">
          <div class="title">
            <i class="fas fa-circle"></i>
            <h3 class="event-title">${event.title}</h3>
          </div>
          <div class="event-time">
            <span class="event-time">${event.time}</span>
          </div>
        </div>
        `;
      });
    }
  });

  if (events == "") {
    events = `
    <div class="no-event">
      <h3>No Events</h3>
    </div>
    `;
  }

  eventContainer.innerHTML = events;

  saveEvents();
}

// function to create and add events
AddeventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;

  if (eventTitle == "" || eventTimeFrom == "" || eventTimeTo == "") {
    alert("全ての項目を入力してください");
    return;
  }

  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");

  if (
    timeFromArr.length != 2 ||
    timeToArr.length != 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("無効な時間です");
  }

  const timeFrom = convertTime(eventTimeFrom);
  console.log(timeFrom);
  const timeTo = convertTime(eventTimeTo);
  console.log(timeTo);

  const newEvent = {
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
  };

  let eventAdded = false;

  //選択した日にすでに予定があるならそこに追加
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day == activeDay &&
        item.month == month + 1 &&
        item.year == year
      ) {
        item.events.push(newEvent);
        eventAdded = True;
      }
    });
  }

  //もしないなら新規に日付も加えて追加
  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  addEventContainer.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";

  updateEvent(activeDay);
});

function convertTime(time) {
  let timeArr = time.split(":");
  let timeHour = time[0];
  let timeMin = time[1];
  let timeFormat = time >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
  if (localStorage.getItem("events" == null)) {
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
  }
}
