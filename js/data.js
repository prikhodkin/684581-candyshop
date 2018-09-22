'use strict';

(function () {
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
    if (getRandomValue(0, 1) === 0) {
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

  window.data = {
    cards: cards,
    valueByStars: valueByStars,
    fillArray: fillArray
  };

})();
