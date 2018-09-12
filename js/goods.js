'use strict';

var MIN_AMOUT = 0;
var MAX_AMOUT = 20;
var MIN_PRICE = 100;
var MAX_PRICE = 1500;
var MIN_WEIGHT = 30;
var MAX_WEIGHT = 300;
var MIN_VALUE = 1;
var MAX_VALUE = 5;
var MIN_NUMBER = 10;
var MAX_NUMBER = 900;
var MIN_ENERGY = 70;
var MAX_ENERGY = 500;
var MAX_CARDS = 26;
var MAX_BASKET = 3;

// Массив для выбора названия
var names = [
  'Чесночные сливки',
  'Огуречный педант',
  'Молочная хрюша',
  'Грибной шейк',
  'Баклажановое безумие',
  'Паприколу итальяно',
  'Нинзя-удар васаби',
  'Хитрый баклажан',
  'Горчичный вызов',
  'Кедровая липучка',
  'Корманный портвейн',
  'Чилийский задира',
  'Беконовый взрыв',
  'Арахис vs виноград',
  'Сельдерейная душа',
  'Початок в бутылке',
  'Чернющий мистер чеснок',
  'Раша федераша',
  'Кислая мина',
  'Кукурузное утро',
  'Икорный фуршет',
  'Новогоднее настроение',
  'С пивком потянет',
  'Мисс креветка',
  'Бесконечный взрыв',
  'Невинные винные',
  'Бельгийское пенное',
  'Острый язычок'
];

// Массив адресов изображений
var pictures = [
  'gum-cedar',
  'gum-chile',
  'gum-eggplant',
  'gum-mustard',
  'gum-portwine',
  'gum-wasabi',
  'ice-cucumber',
  'ice-eggplant',
  'ice-garlic',
  'ice-italian',
  'ice-mushroom',
  'ice-pig',
  'marmalade-beer',
  'marmalade-caviar',
  'marmalade-corn',
  'marmalade-new-year',
  'marmalade-sour',
  'marshmallow-bacon',
  'marshmallow-beer',
  'marshmallow-shrimp',
  'marshmallow-spicy',
  'marshmallow-wine',
  'soda-bacon',
  'soda-celery',
  'soda-cob',
  'soda-garlic',
  'soda-peanut-grapes',
  'soda-russian'
];

// Массив состава
var contents = [
  'молоко',
  'сливки',
  'вода',
  'пищевой краситель',
  'патока',
  'ароматизатор бекона',
  'ароматизатор свинца',
  'ароматизатор дуба, идентичный натуральному',
  'ароматизатор картофеля',
  'лимонная кислота',
  'загуститель',
  'эмульгатор',
  'консервант: сорбат калия',
  'посолочная смесь: соль, нитрит натрия',
  'ксилит',
  'карбамид',
  'вилларибо',
  'виллабаджо'
];

// Массив для 26 объектов
var cards = [];

// Объект для рейтинга
var valueByStars = {
  1: 'stars__rating--one',
  2: 'stars__rating--two',
  3: 'stars__rating--three',
  4: 'stars__rating--four',
  5: 'stars__rating--five'
};

// Функция для вывода содержания сахара
var getSugarValue = function () {
  var sugar = '';
  if (getRandomValue() === 0) {
    sugar = 'Без сахара';
    return sugar;
  } else {
    sugar = 'Содержит сахар';
    return sugar;
  }
};

// Функция для получения случайного значения из диапазона
var getRandomValue = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

// Получаем случайные значения их массивов
var takeRandomElement = function (arr) {
  var i = getRandomValue(0, arr.length - 1);
  var randomElement = arr[i];
  arr.splice(i, 1);
  return randomElement;
};

// Функция для получения случайного изображения
var getRandomPicture = function () {
  return 'img/cards/' + takeRandomElement(pictures) + '.jpg';
};


// Функция для получени нескольких значений и склеивания
var getRandomContents = function () {
  var contentRandomValue = Math.round(Math.random() * contents.length - 1);
  var newContents = [];
  var contentsCopy = contents.slice();
  for (var i = 0; i <= contentRandomValue; i++) {
    var randomElement = getRandomValue(0, contents.length - 1);
    newContents.push(contentsCopy[randomElement]);
  }
  return newContents.join(', ');
};

// Функция для создания карточки
var getCard = function () {
  return {
    name: takeRandomElement(names),
    picture: getRandomPicture(),
    amount: getRandomValue(MIN_AMOUT, MAX_AMOUT),
    price: getRandomValue(MIN_PRICE, MAX_PRICE),
    weight: getRandomValue(MIN_WEIGHT, MAX_WEIGHT),
    rating: {
      value: getRandomValue(MIN_VALUE, MAX_VALUE),
      number: getRandomValue(MIN_NUMBER, MAX_NUMBER)
    },
    nutritionFacts: {
      sugar: getSugarValue(),
      energy: getRandomValue(MIN_ENERGY, MAX_ENERGY),
      contents: getRandomContents()
    }
  };
};

// Функция для создания массива карточек
var fillArray = function () {
  for (var i = 1; i <= MAX_CARDS; i++) {
    cards.push(getCard());
  }
  return cards;
};


// // Создаем массив для карточек в корзине
// var fillArrayBasket = function () {
//   var cardsBasket = [];
//   var cardsBasketCopy = cards.slice();
//   for (var i = 1; i <= MAX_BASKET; i++) {
//     var randomCard = getRandomValue(0, cards.length - 1);
//     cardsBasket.push(cardsBasketCopy[randomCard]);
//   }
//   return cardsBasket;
// };

// Создаем массив для карточек в корзине
var fillArrayBasket = function () {
  var cardsBasket = [];
  var cardsBasketCopy = cards.slice();
  for (var i = 0; i < 1; i++) {

    cardsBasket.push(cardsBasketCopy[i]);
  }
  return cardsBasket;
};

// ============================================
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
var createCards = function (cardData) {
  var fragment = document.createDocumentFragment();
  cardData.forEach(function (item) {
    var cardElement = document.querySelector('#card').content.cloneNode(true);
    var cardPrice = cardElement.querySelector('.card__price');
    var cardCurrency = cardElement.querySelector('.card__currency');
    var cardWeight = cardElement.querySelector('.card__weight');
    cardElement.querySelector('.catalog__card').classList.remove('card--in-stock');
    cardElement.querySelector('.catalog__card').classList.add(addClassByAmount(item.amount));
    cardElement.querySelector('.card__img').src = item.picture;
    cardElement.querySelector('.card__title').textContent = item.name;
    cardPrice.textContent = item.price;
    cardPrice.appendChild(cardCurrency);
    cardPrice.appendChild(cardWeight);
    cardElement.querySelector('.card__weight').textContent = '/ ' + item.weight + ' Г';
    cardElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
    cardElement.querySelector('.stars__rating').classList.add(valueByStars[item.rating.value]);
    cardElement.querySelector('.star__count').textContent = item.rating.number;
    cardElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar;
    cardElement.querySelector('.card__composition-list').textContent = 'Состав: ' + item.nutritionFacts.contents;
    fragment.appendChild(cardElement);
  });
  return fragment;
};

catalogCards.appendChild(createCards(fillArray()));

// Отрисовываем товары в корзине

var goodsCards = document.querySelector('.goods__cards');
// goodsCards.classList.remove('goods__cards--empty');
var goodsCardEmpty = goodsCards.querySelector('.goods__card-empty');
// goodsCardEmpty.classList.add('visually-hidden');

var createCardsBasket = function (cardData) {
  var fragment = document.createDocumentFragment();
  cardData.forEach(function (item) {
    var cardBasketElement = document.querySelector('#card-order').content.cloneNode(true);
    cardBasketElement.querySelector('.card-order__title').textContent = item.name;
    cardBasketElement.querySelector('.card-order__img').src = item.picture;
    cardBasketElement.querySelector('.card-order__price').textContent = item.price + ' ₽';
    fragment.appendChild(cardBasketElement);
  });
  return fragment;
};

// goodsCards.appendChild(createCardsBasket(fillArrayBasket()));


catalogCards.addEventListener('click', function (evt) {
  var target = evt.target.closest('.card__btn-favorite');
  if (target === null) {
    return;
  }
  target.classList.toggle('card__btn-favorite--selected');
});

catalogCards.addEventListener('click', function (evt) {
  var target = evt.target.closest('.card__btn');
  if (target === null) {
    return;
  }
  goodsCards.appendChild(createCardsBasket(fillArrayBasket()));
  goodsCards.classList.remove('goods__cards--empty');
  goodsCardEmpty.classList.add('visually-hidden');
});
