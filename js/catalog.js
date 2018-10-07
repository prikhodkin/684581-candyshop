'use strict';

(function () {
  var catalogCards = document.querySelector('.catalog__cards');
  var catalogLoad = catalogCards.querySelector('.catalog__load');

  // Определяем классы в завсисимости от значения
  var addClassByAmount = function (amount) {
    var cardClass;
    if (amount > 5) {
      cardClass = 'card--in-stock';
    } else if (amount >= 1 && amount <= 5) {
      cardClass = 'card--little';
    } else if (amount === 0) {
      cardClass = 'card--soon';
    }
    return cardClass;
  };

  // Функция для вывода содержания сахара
  var getSugarValue = function (sugar) {
    if (!sugar) {
      return 'Без сахара';
    }
    return 'Содержит сахар';
  };

  // Объект для рейтинга
  var valueByStars = {
    1: 'stars__rating--one',
    2: 'stars__rating--two',
    3: 'stars__rating--three',
    4: 'stars__rating--four',
    5: 'stars__rating--five'
  };

  // Отрисовывает карточки
  var createCard = function (card) {
    var cardElement = document.querySelector('#card').content.cloneNode(true);
    cardElement.querySelector('.catalog__card').dataset.id = card.id;
    var cardPrice = cardElement.querySelector('.card__price');
    var cardCurrency = cardElement.querySelector('.card__currency');
    var cardWeight = cardElement.querySelector('.card__weight');
    var catalogCard = cardElement.querySelector('.catalog__card');
    var cardRating = cardElement.querySelector('.stars__rating');
    catalogCard.classList.remove('card--in-stock');
    catalogCard.classList.add(addClassByAmount(card.amount));
    cardElement.querySelector('.card__img').src = 'img/cards/' + card.picture;
    cardElement.querySelector('.card__title').textContent = card.name;
    cardPrice.textContent = card.price;
    cardPrice.appendChild(cardCurrency);
    cardPrice.appendChild(cardWeight);
    cardElement.querySelector('.card__weight').textContent = '/ ' + card.weight + ' Г';
    cardRating.classList.remove('stars__rating--five');
    cardRating.classList.add(valueByStars[card.rating.value]);
    cardElement.querySelector('.star__count').textContent = card.rating.number;
    cardElement.querySelector('.card__characteristic').textContent = getSugarValue(card.nutritionFacts.sugar) + '. ' + card.nutritionFacts.energy + ' ккал';
    cardElement.querySelector('.card__composition-list').textContent = 'Состав: ' + card.nutritionFacts.contents;
    if (card.favorite) {
      cardElement.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
    }
    return cardElement;
  };

  var render = (function (cards) {
    var fragment = document.createDocumentFragment();
    cards.forEach(function (it) {
      fragment.appendChild(createCard(it));
    });
    var oldCards = catalogCards.querySelectorAll('article');
    Array.from(oldCards).forEach(function (it) {
      it.remove();
    });
    catalogCards.appendChild(fragment);
    catalogCards.classList.remove('catalog__cards--load');
    catalogLoad.classList.add('visually-hidden');
    runAddToBasketCard();
  });

  // экспортируем данные
  var successHandler = function (responseData) {
    responseData.forEach(function (it, index) {
      it.id = index;
      it.favorite = false;
    });
    window.catalog.data = responseData;
    render(window.catalog.data);
  };

  var errorHandler = function (errorMessage) {
    catalogLoad.textContent = errorMessage;
  };

  window.backend.load(successHandler, errorHandler);

  // Добавляет и убирает товары в избранное
  catalogCards.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target.closest('.card__btn-favorite');
    if (!target) {
      return;
    }
    var cardElement = evt.target.closest('.catalog__card');
    var id = cardElement.dataset.id;
    var card = window.catalog.data[id];
    card.favorite = !card.favorite;

    target.classList.toggle('card__btn-favorite--selected', card.favorite);
  });

  // Показывает и скрывает состав
  catalogCards.addEventListener('click', function (evt) {
    evt.preventDefault();
    var cardMain = evt.target.closest('.card__main');
    var target = evt.target.closest('.card__btn-composition');
    var composition = cardMain.querySelector('.card__composition');
    if (!target) {
      return;
    }
    composition.classList.toggle('card__composition--hidden');
  });

  var goodsCards = document.querySelector('.goods__cards');
  var goodsCardEmpty = goodsCards.querySelector('.goods__card-empty');


  // Выводит и убирает сообщение о наличии товара в корзине
  var alertMessage = function () {
    var article = document.querySelector('.goods_card');
    goodsCards.classList.toggle('goods__cards--empty', article === null);
    goodsCardEmpty.classList.toggle('visually-hidden', article !== null);
  };

  // Удаляет товары из корзины
  goodsCards.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target.closest('.card-order__close');
    if (target === null) {
      return;
    }
    var targetCard = evt.target.closest('.card-order');
    goodsCards.removeChild(targetCard);
    alertMessage();
    window.order.addDisabledForInput();
  });

  // Отрисовываем товары в корзине

  var runAddToBasketCard = function () {
    var addButtons = document.querySelectorAll('.card__btn');
    var cardsOnCatalog = catalogCards.querySelectorAll('.catalog__card');

    // Создает карточку товара в корзине
    var createAddToBasketHandler = function (i) {
      return function (evt) {
        addToBasket(cardsOnCatalog[i], i);
        evt.preventDefault();
        alertMessage();
        window.order.addDisabledForInput();
      };
    };

    // Добавляет товары в корзину при клике на кнопку добавить
    var addBasketAdditionHandlers = function () {
      for (var i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener('click', createAddToBasketHandler(
            addButtons[i].closest('.catalog__card').dataset.id
        ));
      }
    };

    addBasketAdditionHandlers();

    // Увеличивает значение
    var increaseValue = function (value) {
      value.value++;
    };

    // Добавляет карточки в корзину, если есть повтор, увеличивает значение
    var addToBasket = function (target, i) {
      var dataAttribute = goodsCards.querySelector('[data-id="' + i + '"]');
      if (dataAttribute === null) {
        var cardsBasket = window.cardsData[i];
        var cardBasketElement = document.querySelector('#card-order').content.cloneNode(true);
        cardBasketElement.querySelector('.card-order__title').textContent = cardsBasket.name;
        cardBasketElement.querySelector('.card-order__img').src = 'img/cards/' + cardsBasket.picture;
        cardBasketElement.querySelector('.card-order__price').textContent = cardsBasket.price;
        cardBasketElement.querySelector('.goods_card').setAttribute('data-id', i);
        goodsCards.appendChild(cardBasketElement);
        window.basketPrice = cardsBasket.price;
      } else {
        var value = dataAttribute.querySelector('.card-order__count');
        var price = dataAttribute.querySelector('.card-order__price');
        increaseValue(value);
        increasePrice(price);
      }
    };

    var increasePrice = function (element) {
      var newPrice = +element.textContent + +window.basketPrice;
      element.textContent = newPrice;
    };

    var decreasePrice = function (element) {
      var newPrice = element.textContent - window.basketPrice;
      element.textContent = newPrice;
    };

    // Увеличивает кол-во товаров в корзине
    goodsCards.addEventListener('click', function (evt) {
      evt.preventDefault();
      var target = evt.target.closest('.card-order__btn--increase');
      if (!target) {
        return;
      }
      var card = evt.target.closest('.card-order__main');
      var value = card.querySelector('.card-order__count');
      var price = card.querySelector('.card-order__price');
      value.value++;
      increasePrice(price);
    });

    // Уменьшает кол-во товаров в корзине
    goodsCards.addEventListener('click', function (evt) {
      evt.preventDefault();
      var target = evt.target.closest('.card-order__btn--decrease');
      if (!target) {
        return;
      }
      var card = evt.target.closest('.card-order__main');
      var value = card.querySelector('.card-order__count');
      var price = card.querySelector('.card-order__price');
      if (value.value > 1) {
        value.value--;
        decreasePrice(price);
      } else {
        var targetCard = evt.target.closest('.card-order');
        goodsCards.removeChild(targetCard);
        alertMessage();
        window.order.addDisabledForInput();
      }
    });

    window.filter.getFilterNumber();

  };
  window.catalog = {
    render: render,
    data: [],
    catalogCards: catalogCards
  };
})();
