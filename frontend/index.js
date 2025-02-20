const container = document.querySelector('.content');
const cardsContainer = container.querySelector('.places__list');
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
profilePopup.classList.add('popup_is-animated');
cardPopup.classList.add('popup_is-animated');
imagePopup.classList.add('popup_is-animated');

// Функция для удаления карточки
function deleteCard(cardId, cardElement) {
    fetch(`http://127.0.0.1:8000/api/cards/${cardId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при удалении карточки');
        }
        return response.json();
    })
    .then(data => {
        console.log('Карточка удалена:', data);
        cardElement.remove(); // Удаляем карточку с интерфейса
    })
    .catch(error => {
        console.error('Ошибка при удалении карточки:', error);
    });
}

// Создание элемента карточки
function createCard(newCard) {
    const cardTemplate = document.querySelector('#card-template').content;

    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    cardElement.setAttribute('data-id', newCard.id);


    cardElement.querySelector('.card__image').src = newCard.link;
    cardElement.querySelector('.card__image').alt = newCard.name;
    cardElement.querySelector('.card__title').textContent = newCard.name;
    cardElement.querySelector('.card__type').textContent = `Тип: ${newCard.device_type}`;
    cardElement.querySelector('.card__characteristics').textContent = `Характеристики: ${newCard.device_characteristics}`;
    cardElement.querySelector('.card__functions').textContent = `Функции: ${newCard.device_functions}`;


    // Просмотр карточки
    const cardPreview = cardElement.querySelector('.card__image');
    function handleCardPreviewClick() {
        imagePopup.querySelector('.popup__image').src = newCard.link
        imagePopup.querySelector('.popup__image').alt = newCard.name
        imagePopup.querySelector('.popup__caption').textContent = newCard.name

        openPopup(imagePopup);
    }

    cardPreview.addEventListener('click', handleCardPreviewClick);

    const previewCloseButton = imagePopup.querySelector('.popup__close');
    function handlePreviewCloseClick() {
        closePopup(imagePopup);
    }

    previewCloseButton.addEventListener('click', handlePreviewCloseClick);

    // Лайк карточки
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    function handleCardLikeClick() {
        cardLikeButton.classList.toggle('card__like-button_is-active');
    }

    cardLikeButton.addEventListener('click', handleCardLikeClick);

    // Первый вариант реализации кнопки удаления карточки
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
    function handleCardDeleteClick() {
        const cardId = cardElement.getAttribute('data-id'); // Получаем id карточки
        console.log(cardId, 'ETO ID');
        deleteCard(cardId, cardElement); // Вызываем функцию удаления
        cardElement.remove();
    }

    cardDeleteButton.addEventListener('click', handleCardDeleteClick);

    return cardElement;
}

// Функция для запроса карточек с сервера
function fetchCards() {
    fetch('http://127.0.0.1:8000/api/cards')  // Запрос на сервер по маршруту /api/cards
      .then(response => response.json())  // Получаем данные в формате JSON
      .then(cards => {
        cards.forEach(function (newCard) {
          const card = createCard(newCard);  // Создаем карточку
          cardsContainer.append(card);  // Добавляем ее в контейнер
        });
      })
      .catch(error => console.error('Error fetching cards:', error));  // Обработка ошибок
  }


function fetchAdminData() {
    fetch('http://127.0.0.1:8000/api/admin')
        .then(response => response.json())
        .then(data => {
            profileName.textContent = data.name; // Устанавливаем имя администратора
            profileDesc.textContent = data.status; // Устанавливаем статус администратора
        })
        .catch(error => console.error('Ошибка при получении данных администратора:', error));
}
  
  // Вызов функции для загрузки карточек
fetchCards();
fetchAdminData();
  

// Открытие и закрытие поп-ап окон
function openPopup(popup) {
    popup.classList.add('popup_is-opened');
}
function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
}

// Окно редактирования профиля пользователя
const profileEditButton = container.querySelector('.profile__edit-button');
const profileCloseButton = profilePopup.querySelector('.popup__close');
let profileName = container.querySelector('.profile__title');
let profileDesc = container.querySelector('.profile__description');

const profileFormElement = profilePopup.querySelector('.popup__form');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');

function handleProfileEditClick() {
    nameInput.value = profileName.textContent;
    jobInput.value = profileDesc.textContent;

    openPopup(profilePopup);
}

function handleProfileFormSubmit(event) {
    event.preventDefault();

    const updatedAdminData = {
        name: nameInput.value,
        status: jobInput.value
    };

    fetch('http://127.0.0.1:8000/api/admin', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAdminData),
    })
    .then(response => response.json())
    .then(data => {
        profileName.textContent = data.admin.name; // Обновляем имя администратора на странице
        profileDesc.textContent = data.admin.status; // Обновляем статус администратора на странице
        closePopup(profilePopup); // Закрываем попап
    })
    .catch(error => {
        console.error('Ошибка при обновлении данных администратора:', error);
    });
}

function handleProfileCloseClick() {
    closePopup(profilePopup);
}

profileEditButton.addEventListener('click', handleProfileEditClick);
profileFormElement.addEventListener('submit', handleProfileFormSubmit);
profileCloseButton.addEventListener('click', handleProfileCloseClick);

// Окно редактирования профиля пользователя
const cardAddButton = container.querySelector('.profile__add-button');
const cardCloseButton = cardPopup.querySelector('.popup__close');
const cardFormElement = cardPopup.querySelector('.popup__form');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardURLInput = cardFormElement.querySelector('.popup__input_type_url');
const cardTypeInput = cardFormElement.querySelector('.popup__input_type_card_type');
const cardCharacteristicsInput = cardFormElement.querySelector('.popup__input_type_card_characteristics');
const cardFunctionsInput = cardFormElement.querySelector('.popup__input_type_card_functions');


function handleCardAddClick() {
    cardNameInput.value = '';
    cardURLInput.value = '';
    cardTypeInput.value = '';
    cardCharacteristicsInput.value = '';
    cardFunctionsInput.value = '';

    openPopup(cardPopup);
}

function handleCardFormSubmit(event) {
    event.preventDefault();

    const newCard = {
        name: cardNameInput.value,
        link: cardURLInput.value,
        device_type: cardTypeInput.value,
        device_characteristics: cardCharacteristicsInput.value,
        device_functions: cardFunctionsInput.value
    };

    // Отправка данных на бэкенд
    fetch('http://127.0.0.1:8000/api/cards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Карточка добавлена:', data);
        const card = createCard(newCard);
        cardsContainer.prepend(card);
        closePopup(cardPopup);
    })
    .catch(error => {
        console.error('Ошибка при добавлении карточки:', error);
    });
}

function handleCardCloseClick() {
    closePopup(cardPopup);
}

cardAddButton.addEventListener('click', handleCardAddClick);
cardFormElement.addEventListener('submit', handleCardFormSubmit);
cardCloseButton.addEventListener('click', handleCardCloseClick);

