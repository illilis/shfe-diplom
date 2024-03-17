# Дипломная работа по профессии «Frontend-разработчик»

## Ссылки на сайт
- [https://illilis.github.io/shfe-diplom/](https://illilis.github.io/shfe-diplom/ "Проект на GitHub Pages") — главная страница (пользовательская)
- [https://illilis.github.io/shfe-diplom/admin-index.html](https://illilis.github.io/shfe-diplom/admin-index.html "Административная часть") — административная часть сайта

***

## Стек технологий

- HTML
- CSS
- JavaScript
- fetch
- БЭМ

***

## Цели дипломной работы

В этой дипломной работе создается сайт для бронирования билетов в кинотеатр онлайн и разрабатывается информационная система для администрирования залов, сеансов и предварительного бронирования билетов (административная часть сайта).

### Инструменты и дополнительные материалы

- [Макеты страниц в Figma](https://www.figma.com/file/zGf2lm7mUBGeXWlZQyf9LH/%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-%D0%BC%D0%B0%D0%BA%D0%B5%D1%82-(1)?type=design&mode=design)
- [Информация по API](https://github.com/netology-code/shfe-diplom/blob/main/md/api.md).

### Описание проекта

#### 1. Сущности

- **Кинозал** – помещение, в котором демонстрируются фильмы. Режим работы определяется расписанием на день. Зал — прямоугольный, состоит из `N*M` различных зрительских мест.

- **Зрительское место** – место в кинозале. Зрительские места могут быть VIP и обычные.

- **Фильм** – информация о фильме заполняется администратором. Фильм связан с сеансом в кинозале.

- **Сеанс** – это временной промежуток, в котором в кинозале будет показываться фильм. На сеанс могут быть забронированы билеты.

- **Билет** – QR-код c уникальным кодом бронирования, в котором обязательно указаны: Дата, Время, Название фильма, Зал, Ряд, Место, Стоимость, Фраза _"Билет действителен строго на свой сеанс"_.
  
Для генерации QR-кода используется [QRCreator.js](https://github.com/slesareva-gala/QR-Code)

#### 2. Роли пользователей системы

- Гость — неавторизованный посетитель сайта.
- Администратор — авторизованный пользователь.

#### 3. Возможности гостя
- Просмотр расписания
- Просмотр информации о фильмах
- Выбор места в кинозале
- Бронирование билета

#### 4. Возможности администратора
- Создание или редактирование залов.
- Создание или редактирование списка фильмов.
- Настройка цен.
- Создание или редактирование расписания сеансов фильмов.

### Этапы разработки

1. Выполнена верстка предоставленных [макетов]((https://www.figma.com/file/BwhoRUEU4ikdbjjxFOrO7v/%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-%D0%BC%D0%B0%D0%BA%D0%B5%D1%82?type=design&node-id=0-1&mode=design&t=j9bYnoV4gt8q03IU-0))  
   * Верстка должна корректно отображаться в браузере chrome на устройствах с шириной экрана **320px** и более.  
   * В наименовании CSS-классов желательно придерживаться методологии [БЭМ](https://ru.bem.info/methodology/quick-start/)
   * Верстка должна быть валидной ([Валидатор](https://validator.w3.org/)). 
2. Разработка класс API для взаимодействия с [Backend](https://github.com/netology-code/shfe-diplom/blob/main/md/api.md).
3. Программирование админской части сайта.
4. Программирование клиентской части сайта.

### Основные требования к работоспособности проекта
1. [ ] Допускаются ошибки уровня warning, ошибки уровня error обязательно нужно исправить.
2. [ ] Полностью работает создание и удаление залов, фильмов и сеансов.
3. [ ] Корректно работает изменение схемы зала и стоимости билетов
4. [ ] Полностью работает заказ нужного билета с выбором посадочного места, сохранением данных в БД и получением QR кода
5. [ ] QR код содержит в себе полную информацию о билете (более подробно см. описание сущности ***Билет*** выше)
6. [ ] В гостевой части на вкладке ***Сегодня*** прошедшие сеансы должны быть неактивны (чтобы не было возможности забронировать билет на уже прошедшие сеансы)
7. [ ] В гостевой части должны отображаться сеансы, которые проходят только в открытых залах.

### Дополнительные моменты

>Как добавляются и удаляются сеансы?

- Добавление сеансов производится при помощи drag&drop — перетаскивания фильма на ленту timeline нужного зала  
- Удаление сеансов тоже производится при помощи drag&drop — перетаскивания сеанса с ленты timeline за ее пределы  

>Что значит кнопка «Открыть продажу билетов»?  

По умолчанию зал создаётся неактивным. После нажатия на эту кнопку зал становится доступным гостям. Надпись на кнопке меянется на «Приостановить продажу билетов».
