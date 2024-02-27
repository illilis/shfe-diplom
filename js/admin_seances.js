// Сетка сеансов
let timelineSeances;
let timelineMovies;
let selectedMovie;
let selectedHall;

let hallSeances;
let seanceTimeStart;
let seanceTimeEnd;
let currentSeancesDuration;
let currentSeancesStart;
let currentSeanceTimeStart;
let currentSeancesTimeEnd;

// Кнопки

let movieSeancesCancel;
let movieSeancesSave;

// popup Добавление сеанса

const popupSeanceAdd = document.querySelector(".popup__seance_add");
const formAddSeance = document.querySelector(".popup__form_add-seance");
const selectSeanceHall = document.querySelector(".select__add-seance_hall");
let optionHallName;
let optionMovieName;
const selectSeanceMovie = document.querySelector(".select__add-seance_movie");
const inputSeanceTime = document.querySelector(".add-seans__input_time");
let checkedHallId;
let checkedMovieId;
let checkedMovieName;
let checkedMovieDuration;
let checkedSeanceTime;
let seanceCancelButton;

// popup Удаление сеанса

const popupSeanceRemove = document.querySelector(".popup__seance_remove");
let seanceRemoveTitle;
let seanceDeleteButton;
let seanceRemoveCancelButton;

// Загрузка сеансов

function loadSeances(data) {
  timelineSeances.forEach(timeline => {
    for(let i = 0; i < data.result.seances.length; i++) {
      let movieSeanseId = data.result.films.findIndex(element => element.id === Number(data.result.seances[i].seance_filmid));
      
      if(Number(timeline.dataset.id) === data.result.seances[i].seance_hallid) {
        timeline.insertAdjacentHTML("beforeend", `
        <div class="timeline__seances_movie" data-filmid="${data.result.seances[i].seance_filmid}" data-seanceid="${data.result.seances[i].id}" draggable="true">
          <p class="timeline__seances_title">${data.result.films[movieSeanseId].film_name}</p>
          <p class="timeline__movie_start" >${data.result.seances[i].seance_time}</p>
        </div>
        `);
      }
    }
    
  })

  // Загрузка фона сеансов

  setMovieBackground();

  // Позиционирование сеансов
  
  positionSeance();

  // Отслеживание изменения ширины окна

  window.addEventListener("resize", event => {
    positionSeance();
  })
}


// Установка цвета фона для фильмов в таймлайнах

function setMovieBackground() {
  const movies = document.querySelectorAll(".movie-seances__movie");
  let movieBackground;
  const moviesInformation = new Array();

  // Собираем массив из загруженных фильмов и сохраняем номер цвета фона в каждом

  movies.forEach(movie => {
    movieBackground = movie.classList.value.match(/\d+/)[0];

    const movieInfo = new Object();
    movieInfo.movieInfoId = movie.dataset.id;
    movieInfo.background = movieBackground;

    moviesInformation.push(movieInfo);
  })

  // Проставляем номер цвета фона в фильмы в таймлайне с сеансами

  timelineMovies = Array.from(document.querySelectorAll(".timeline__seances_movie"));

  timelineMovies.forEach(element => {
    for (let i = 0; i < moviesInformation.length; i++)
      if(Number(element.dataset.filmid) === Number(moviesInformation[i].movieInfoId)) {
        element.classList.add(`background_${moviesInformation[i].background}`);
      }
  })

}

// Позиционирование сеансов по таймлайну

let hourSize;
let minuteSize;
let movieWidth;
let seancePosition;

function positionSeance() {
  let timelineWidth = timelineSeances[0].getBoundingClientRect().width;

  hourSize = timelineWidth / 24;
  minuteSize = hourSize / 60;

  timelineMovies.forEach(item => {
    let time = item.lastElementChild.textContent.split(":", [2]);
    let hours = Number(time[0]); 
    let minutes = Number(time[1]);

    seancePosition = hours * hourSize + minutes * minuteSize;

    item.style.left = seancePosition + "px";

    if(item.dataset.change === "true") {
      item.style.width = 80 + "px";
      item.style.padding = "10px";
    }

    movieWidth = item.getBoundingClientRect().width;

    if((seancePosition + movieWidth) > timelineWidth) {
      item.style.width = timelineWidth - seancePosition - 2 + "px";
      item.style.padding = "10px 2px";
      item.dataset.change = "true";
    } 
  })

}

// Перетаскивание фильма в таймлайн зала (открытие popup Добавление сеанса)

function openSeancePopup(data) {
  const moviesArray = document.querySelectorAll(".movie-seances__movie");
  const hallsTimelineArray = document.querySelectorAll(".timeline__seances");

  // Определение выбранного фильма

  moviesArray.forEach(movie => {
    movie.addEventListener("dragstart", (event) => {  
      selectedMovie = movie.dataset.id;
    }) 
  })

  // Отслеживание пространства таймлайна зала

  hallsTimelineArray.forEach(timeline => {
    timeline.addEventListener("dragover", (event) => {
      event.preventDefault();
    })

    timeline.addEventListener("drop", (event) => {
      event.preventDefault();
      selectedHall = timeline.dataset.id;
      
      // Открытие popup "Добавление сеанса"

      popupSeanceAdd.classList.remove("popup__hidden");

      // Очищение значений в popup

      selectSeanceHall.innerHTML = '<option class="option_add-seance hall__name">Название зала</option>';
      selectSeanceMovie.innerHTML = '<option class="option_add-seance movie__name">Название фильма</option>';
      formAddSeance.reset();

      // Формирование select "Название зала"

      for(let i = 0; i < data.result.halls.length; i++) {
        selectSeanceHall.insertAdjacentHTML("beforeend", `
        <option class="option_add-seance hall__name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</option>
        `);
      } 

      optionHallName = document.querySelectorAll(".hall__name");

      optionHallName.forEach(hallName => {
        if(Number(hallName.dataset.id) === Number(selectedHall)) {
          hallName.setAttribute("selected", "true");
        }
      })

      // Формирование select "Название фильма"

      for(let i = 0; i < data.result.films.length; i++) {
        selectSeanceMovie.insertAdjacentHTML("beforeend", `
        <option class="option_add-seance movie__name" data-id="${data.result.films[i].id}">${data.result.films[i].film_name}</option>
        `);
      } 

      optionMovieName = document.querySelectorAll(".movie__name");

      optionMovieName.forEach(movieName => {
        if(Number(movieName.dataset.id) === Number(selectedMovie)) {
          movieName.setAttribute("selected", "true");
        }
      })

      // Кнопка "Отменить" в popup "Добавление сеанса"

      seanceCancelButton = document.querySelector(".popup__add-seance_button_cancel");

      seanceCancelButton.addEventListener("click", () => {
        optionHallName.forEach(hallName => {
          hallName.removeAttribute("selected");

          if(hallName.textContent === "Название зала") {
            hallName.setAttribute("selected", "true");
          }
        })

        optionMovieName.forEach(movieName => {
          movieName.removeAttribute("selected");

          if(movieName.textContent === "Название фильма") {
            movieName.setAttribute("selected", "true");
          }
        })
      })

      // Кнопка "Добавить сеанс" в popup "Добавление сеанса"

      formAddSeance.addEventListener("submit", (event) => {
        event.preventDefault();

        // Сохранение данных по залу

        let checkedHall = selectSeanceHall.value;

        if(checkedHall === "Название зала") {
          alert("Выберите зал!");
          return;
        }

        optionHallName.forEach(hallName => {
            if(hallName.textContent === checkedHall) {
            checkedHallId = hallName.dataset.id;
          }
        })

        // Сохранение данных по фильму

        let checkedMovie = selectSeanceMovie.value;

        if(checkedMovie === "Название фильма") {
          alert("Выберите фильм!");
          return;
        }

        optionMovieName.forEach(movieName => {
          if(movieName.textContent === checkedMovie) {
            checkedMovieId = movieName.dataset.id;
            checkedMovieName = checkedMovie;
          }
        })

        // Сохранение данных по выбранному времени

        checkedSeanceTime = inputSeanceTime.value;

        // Получение длительности фильма

        for(let i = 0; i < data.result.films.length; i++) {

          if(data.result.films[i].id === Number(checkedMovieId)) {
            checkedMovieDuration = data.result.films[i].film_duration;
          }
        }

        let seanceTime = checkedSeanceTime.split(':', [2]);
        seanceTimeStart = Number(seanceTime[0]) * 60 + Number(seanceTime[1]);

        seanceTimeEnd = seanceTimeStart + checkedMovieDuration;

        // Последний сеанс должен заканчиваться не позднее 23:59

        let lastTime = 23 * 60 + 59;

        if(seanceTimeEnd > lastTime) {
          alert("Последний сеанс должен заканчиваться не позднее 23:59!");
        }

        // Проверка на пересечение с другими сеансами в зале

        timelineSeances = document.querySelectorAll(".timeline__seances");
        
        // Сбор сеансов в искомом зале

        timelineSeances.forEach(timeline => {
          if(Number(timeline.dataset.id) === Number(checkedHallId)) {
            hallSeances = timeline.querySelectorAll(".timeline__seances_movie");
          }
        })

        // Информация о всех существующих сеансах в конкретном зале

        if(hallSeances.length !== 0) {
          hallSeances.forEach(seance => {
        
            // Получение длительности фильма в каждом существующем сеансе
        
            for(let i = 0; i < data.result.films.length; i++) {
              if(Number(seance.dataset.filmid) === Number(data.result.films[i].id)) {
                currentSeancesDuration = data.result.films[i].film_duration;
              }
            }
        
            // Получение времени начала каждого существующего сеанса
        
            for(let i = 0; i < data.result.seances.length; i++) {
              if(Number(seance.dataset.seanceid) === Number(data.result.seances[i].id)) {
                currentSeancesStart = data.result.seances[i].seance_time;
              }
            }
        
            // Расчет старта и окончания каждого существующего сеанса
        
            let currentSeanceTime = currentSeancesStart.split(':', [2]);
            currentSeanceTimeStart = Number(currentSeanceTime[0]) * 60 + Number(currentSeanceTime[1]);
        
            currentSeancesTimeEnd = currentSeanceTimeStart + currentSeancesDuration;
        
            // Проверка добавляемого сеанса

            if(
              (seanceTimeStart >= currentSeanceTimeStart && seanceTimeStart <= currentSeancesTimeEnd) ||
              (seanceTimeEnd >= currentSeanceTimeStart && seanceTimeEnd <= currentSeancesTimeEnd)
              ) {
              alert("Новый сеанс пересекается по времени с существующими!");
            } else {
              popupSeanceAdd.classList.add("popup__hidden");
            }
        
          })
        } else {
          popupSeanceAdd.classList.add("popup__hidden");
        }

        // Добавление сеанса на страницу

        timelineSeances = document.querySelectorAll(".timeline__seances");

        timelineSeances.forEach(timeline => {
          if (Number(timeline.dataset.id) === Number(checkedHallId)) {
            timeline.insertAdjacentHTML("beforeend", `
            <div class="timeline__seances_movie" data-filmid="${checkedMovieId}" data-seanceid="" draggable="true">
              <p class="timeline__seances_title">${checkedMovieName}</p>
              <p class="timeline__movie_start" >${checkedSeanceTime}</p>
            </div>
            `);
          }      
          
        })

        setMovieBackground();
        
        positionSeance();

      })

    })
  })

}

// Удаление сеанса из таймлайна

let selectSeances;
let selectDelete;

let selectedSeance;
let selectedSeanceId;
let selectTimeline;
let selectedHallId;
let selectedMovieName;

let deletedSeances = [];
let filterDeletedSeances;

function deleteSeance() {
  selectSeances = document.querySelectorAll(".timeline__seances_movie");

  // Определение выбранного сеанса

  selectSeances.forEach(seance => {
    seance.addEventListener("dragstart", () => {
      selectedSeance = seance;
      selectTimeline = seance.parentElement.parentElement;
      selectedMovie = seance.dataset.filmid;
      selectedMovieName = seance.firstElementChild.textContent;
      selectedHallId = seance.parentElement.dataset.id;
      selectDelete = selectTimeline.querySelector(".timeline__delete");

      selectDelete.classList.remove("hidden");

      selectDelete.addEventListener("dragover", (event) => {
        event.preventDefault();
      })

      selectDelete.addEventListener("drop", (event) => {
        event.preventDefault();
        selectDelete.classList.add("hidden");

        // Открытие popup "Удаление сеанса"

        popupSeanceRemove.classList.remove("popup__hidden");

        seanceRemoveTitle = document.querySelector(".seance-remove_title");
        seanceRemoveTitle.textContent = selectedMovieName;

        seanceDeleteButton = document.querySelector(".popup__remove-seance_button_delete");
        seanceRemoveCancelButton = document.querySelector(".popup__remove-seance_button_cancel");

        // Кнопка "Отменить" в popup "Удаление сеанса"

        seanceRemoveCancelButton.addEventListener("click", () => {
          popupSeanceRemove.classList.add("popup__hidden");
        })

        // Кнопка "Удалить" в popup "Удаление сеанса"

        seanceDeleteButton.addEventListener("click", (e) => {
          e.preventDefault();

          popupSeanceRemove.classList.add("popup__hidden");

          if(selectedSeance.dataset.seanceid !== "") {
            selectedSeanceId = selectedSeance.dataset.seanceid;
            deletedSeances.push(selectedSeanceId);
          }
          
          selectedSeance.remove();

          // Очищение массива с удаляемыми сеансами от повторов

          filterDeletedSeances = deletedSeances.filter((item, index) => {
            return deletedSeances.indexOf(item) === index;
          });

        })

      })
    }) 

  })

}

// Отображение сеансов

function seancesOperations(data) {
  timelineSeances = document.querySelectorAll(".timeline__seances");

  // Загрузкa сеансов

  loadSeances(data);

  openSeancePopup(data);

  deleteSeance();

  // Кнопка Отмена под сеткой сеансов

  movieSeancesCancel = document.querySelector(".movie-seances__batton_cancel");

  movieSeancesCancel.addEventListener("click", event => {
    event.preventDefault();
    
    loadSeances(data);
  })

}

// Кнопка Сохранить под сеткой сеансов

movieSeancesSave = document.querySelector(".movie-seances__batton_save");

// Сохранить сетку сеансов

movieSeancesSave.addEventListener("click", event => {
  event.preventDefault();

  const seancesArray = Array.from(document.querySelectorAll(".timeline__seances_movie"));

  // Добавление сеансов

  seancesArray.forEach(seance => {
    if(seance.dataset.seanceid === "") {
      const params = new FormData();
      params.set("seanceHallid", `${seance.parentElement.dataset.id}`);
      params.set('seanceFilmid', `${seance.dataset.filmid}`);
      params.set('seanceTime', `${seance.lastElementChild.textContent}`);
      addSeances(params);
    }
  })
  
  // Удаление сеансов

  filterDeletedSeances.forEach(seance => {
    let seanceId = seance;
    deleteSeances(seanceId);
  })

  alert("Сеансы сохранены!");
  location.reload();
})

// Добавить сеанс на сервер

function addSeances(params) {
  fetch("https://shfe-diplom.neto-server.ru/seance", {
  method: "POST",
  body: params 
})
  .then(response => response.json())
  .then(function(data) { 
    console.log(data);
  })
}

// Удалить сеанс с сервера

function deleteSeances(seanceId) {
  fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
    })
}