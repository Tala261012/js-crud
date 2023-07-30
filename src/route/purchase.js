// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================
// ================================================================
class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count //генерация уникального id
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    // Фильтруем товары, чтоб исключить тот, который выбран
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    // Перемешиваем полученный массив
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    // Возвращаем 3 элемента перемешанного массива
    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/300/300',
  "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/",
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)

Product.add(
  'https://picsum.photos/300/300',
  "Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel,",
  'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  17000,
  10,
)

Product.add(
  'https://picsum.photos/300/300',
  "Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)",
  'Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  113109,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return Math.trunc(value * Purchase.#BONUS_FACTOR)
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count //генерация уникального id

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse().map((item) => {
      let { id, product, totalPrice } = { ...item }
      let productTitle = product.title
      let bonus = Purchase.calcBonusAmount(totalPrice)

      return { id, productTitle, totalPrice, bonus }
    }) //TODO деструктуризация
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)

    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/alert', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',

    data: {
      info_title: 'Упешное выполнение действия',
      info_description: 'Товар был добавлен',
      link: '/test-path',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',

    title: 'Товари',
    info: "Комп'ютери та ноутбуки/Комп'ютери, неттопи, моноблоки",

    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/purchase-product', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id) //TODO query возвращает всегда СТРОКУ!

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',

    title: '',
    info: '',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/purchase-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id) //TODO query возвращает всегда СТРОКУ!
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',

      title: '',
      info: '',

      data: {
        info_title: 'Ошибка',
        info_description: 'Некорректное количество товара',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',

      title: '',
      info: '',

      data: {
        info_title: 'Ошибка',
        info_description:
          'Такого количества товара нет в наличии',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  // console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',

    title: '',
    info: '',

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: 'Доставка: ',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/purchase-submit', function (req, res) {
  // res.render генерує нам HTML сторінку
  // console.log(req.body)
  // console.log(req.query)

  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  console.log(amount)

  const product = Product.getById(id)

  if (!product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',

      data: {
        info_title: 'Ошибка',
        info_description: 'Товар не найден',
        link: '/purchase-list',
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (product.amount < amount) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',

      data: {
        info_title: 'Ошибка',
        info_description:
          'Товара нет в достаточном количестве',
        link: '/purchase-list',
      },
    })
  }

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',

      data: {
        info_title: 'Ошибка',
        info_description: 'Некорректные данные',
        link: '/purchase-list',
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',

      data: {
        info_title: 'Ошибка',
        info_description: 'Заполните обязательные поля',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  if (bonus && bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)
    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) {
    totalPrice = 0
  }

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,
      comment,

      promocode,
    },
    product,
  )

  console.log(purchase)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',

    data: {
      info_title: 'Упешное выполнение действия',
      info_description: 'Заказ оформлен',
      link: '/purchase-list',
    },
  })
})
// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/purchase-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const purchaseList = Purchase.getList()

  console.log(purchaseList)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',

    data: {
      purchaseList,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/purchase-info', function (req, res) {
  // res.render генерує нам HTML сторінку

  const id = Number(req.query.id)
  const bonus = Number(req.query.bonus)

  const purchase = Purchase.getById(id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,

    firstname,
    lastname,
    email,
    phone,

    product,
  } = { ...purchase }

  const productTitle = product.title

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-info',

    data: {
      id,
      firstname,
      lastname,
      email,
      phone,

      totalPrice,
      productPrice,
      deliveryPrice,

      bonus,
      productTitle,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/purchase-edit-user', function (req, res) {
  // res.render генерує нам HTML сторінку

  const id = Number(req.query.id)

  const purchase = Purchase.getById(id)

  let { firstname, lastname, email, phone } = {
    ...purchase,
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-edit-user', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-edit-user',

    data: {
      id,
      firstname,
      lastname,
      email,
      phone,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post(
  '/purchase-edit-user-success',
  function (req, res) {
    // res.render генерує нам HTML сторінку
    const id = Number(req.query.id)
    let { firstname, lastname, email, phone } = req.body

    const result = Purchase.updateById(id, {
      firstname,
      lastname,
      email,
      phone,
    })
    console.log(result)

    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',

      data: {
        info_title: 'Упешное выполнение действия',
        info_description: 'Изменения созранены',
        link: '/purchase-list',
      },
    })
    // ↑↑ сюди вводимо JSON дані
  },
)
// ================================================================

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router