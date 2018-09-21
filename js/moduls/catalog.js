'use strict';

(function () {
  var catalogCards = document.querySelector('.catalog__cards');
  catalogCards.classList.remove('catalog__cards--load');
  var catalogLoad = catalogCards.querySelector('.catalog__load');
  catalogLoad.classList.add('visually-hidden');

  // Определяем классы в завсисимости от значения
  var addClassByAmount = function (amount) {
    var cardClass;
    if (amount > 5) {
      cardClass = 'card--in-stock';
    } else if (amount > 1 && amount <= 5) {
      cardClass = 'card--little';
    } else if (amount === 0) {
      cardClass = 'card--soon';
    }
    return cardClass;
  };

  // Отрисовывает карточки
  // var createCards = function (cardData) {
  //   var fragment = document.createDocumentFragment();
  //   cardData.forEach(function (item) {
  //     var cardElement = document.querySelector('#card').content.cloneNode(true);
  //     var cardPrice = cardElement.querySelector('.card__price');
  //     var cardCurrency = cardElement.querySelector('.card__currency');
  //     var cardWeight = cardElement.querySelector('.card__weight');
  //     cardElement.querySelector('.catalog__card').classList.remove('card--in-stock');
  //     cardElement.querySelector('.catalog__card').classList.add(addClassByAmount(item.amount));
  //     cardElement.querySelector('.card__img').src = item.picture;
  //     cardElement.querySelector('.card__title').textContent = item.name;
  //     cardPrice.textContent = item.price;
  //     cardPrice.appendChild(cardCurrency);
  //     cardPrice.appendChild(cardWeight);
  //     cardElement.querySelector('.card__weight').textContent = '/ ' + item.weight + ' Г';
  //     cardElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
  //     cardElement.querySelector('.stars__rating').classList.add(window.data.valueByStars[item.rating.value]);
  //     cardElement.querySelector('.star__count').textContent = item.rating.number;
  //     cardElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar;
  //     cardElement.querySelector('.card__composition-list').textContent = 'Состав: ' + item.nutritionFacts.contents;
  //     fragment.appendChild(cardElement);
  //   });
  //   return fragment;
  // };

  // catalogCards.appendChild(createCards(window.data.fillArray()));

  var createCards = function (card) {
    var cardElement = document.querySelector('#card').content.cloneNode(true);
    var cardPrice = cardElement.querySelector('.card__price');
    var cardCurrency = cardElement.querySelector('.card__currency');
    var cardWeight = cardElement.querySelector('.card__weight');
    cardElement.querySelector('.catalog__card').classList.remove('card--in-stock');
    cardElement.querySelector('.catalog__card').classList.add(addClassByAmount(card.amount));
    cardElement.querySelector('.card__img').src = card.picture;
    cardElement.querySelector('.card__title').textContent = card.name;
    cardPrice.textContent = card.price;
    cardPrice.appendChild(cardCurrency);
    cardPrice.appendChild(cardWeight);
    cardElement.querySelector('.card__weight').textContent = '/ ' + card.weight + ' Г';
    cardElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
    cardElement.querySelector('.stars__rating').classList.add(window.data.valueByStars[card.rating.value]);
    cardElement.querySelector('.star__count').textContent = card.rating.number;
    cardElement.querySelector('.card__characteristic').textContent = card.nutritionFacts.sugar;
    cardElement.querySelector('.card__composition-list').textContent = 'Состав: ' + card.nutritionFacts.contents;
    return cardElement;
  };

  window.backend.load(function (cards) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < cards.length; i++) {
      fragment.appendChild(createCards(cards[i]));
    }
    catalogCards.appendChild(fragment);
  });

  // catalogCards.appendChild(createCards(window.data.fillArray()));
  // Отрисовываем товары в корзине

  var goodsCards = document.querySelector('.goods__cards');
  var goodsCardEmpty = goodsCards.querySelector('.goods__card-empty');

  // Добавляет и убирает товары в избранное
  catalogCards.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target.closest('.card__btn-favorite');
    if (!target) {
      return;
    }
    target.classList.toggle('card__btn-favorite--selected');
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

  // Выводит и убирает сообщение о наличии товара в корзине
  var alertMessage = function () {
    var article = document.querySelector('.goods_card');
    goodsCards.classList.toggle('goods__cards--empty', article === null);
    goodsCardEmpty.classList.toggle('visually-hidden', article !== null);
  };

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
      addButtons[i].addEventListener('click', createAddToBasketHandler(i));
    }
  };

  addBasketAdditionHandlers();

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


  // Увеличивает кол-во товаров в корзине
  goodsCards.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target.closest('.card-order__btn--increase');
    var card = evt.target.closest('.card-order__amount');
    var value = card.querySelector('.card-order__count');
    if (target === null) {
      return;
    }
    increaseValue(value);
  });

  // Уменьшает кол-во товаров в корзине
  goodsCards.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target.closest('.card-order__btn--decrease');
    var card = evt.target.closest('.card-order__amount');
    var value = card.querySelector('.card-order__count');
    if (target === null) {
      return;
    } else if (value.value > 1) {
      value.value--;
    } else {
      var targetCard = evt.target.closest('.card-order');
      goodsCards.removeChild(targetCard);
      alertMessage();
      window.order.addDisabledForInput();
    }
  });

  // Увеличивает значение
  var increaseValue = function (value) {
    value.value++;
  };

  // Добавляет дата атрибуты
  var addDataAtribute = function () {
    for (var i = 0; i < cardsOnCatalog.length; i++) {
      cardsOnCatalog[i].setAttribute('data-id', i + 1);
    }
  };
  addDataAtribute();

  // Добавляет карточки в корзину, если есть повтор, увеличивает значение
  var addToBasket = function (target, i) {
    var dataAttribute = goodsCards.querySelector('[data-id="' + target.dataset.id + '"]');
    if (dataAttribute === null) {
      var cardsBasket = window.data.cards[i];
      var cardBasketElement = document.querySelector('#card-order').content.cloneNode(true);
      cardBasketElement.querySelector('.card-order__title').textContent = cardsBasket.name;
      cardBasketElement.querySelector('.card-order__img').src = cardsBasket.picture;
      cardBasketElement.querySelector('.card-order__price').textContent = cardsBasket.price + ' ₽';
      cardBasketElement.querySelector('.goods_card').setAttribute('data-id', i + 1);
      goodsCards.appendChild(cardBasketElement);
    } else {
      var value = dataAttribute.querySelector('.card-order__count');
      increaseValue(value);
    }
  };
})();
