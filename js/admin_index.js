// popups
const popups = Array.from(document.querySelectorAll(".popup"));
const popupClose = Array.from(document.querySelectorAll(".popup__close"));
const popupForms = Array.from(document.querySelectorAll(".popup__form"));
const popupCancel = Array.from(document.querySelectorAll(".popup__button_cancel"));

// Закрытие popup

popups.forEach(popup => {
  popupClose.forEach(element => {
    element.addEventListener("click", () => {
      popup.classList.add("popup__hidden");
    })
  })

  // Кнопка "отменить" в popup

  popupForms.forEach(form => {
    popupCancel.forEach(element => {
      element.addEventListener("click", () => {
        form.reset();
        popup.classList.add("popup__hidden");
      })
    })
  })
})

// Запрос данных у сервера

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    hallsOperations(data);
    moviesOperations(data);
    seancesOperations(data);
  })
