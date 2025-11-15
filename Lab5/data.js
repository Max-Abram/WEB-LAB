// data.js

// Об'єкт, що імітує базу даних
const db = {
  currencies: [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 67000 },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', price: 1 },
    { id: 'ton', name: 'Toncoin', symbol: 'TON', price: 7.5 }
  ],
  settings: [
    
     { id: 1, name: 'BTC increase each 2 sec for T-Shirts', status: 'Draft', link: 'settings.html' },
     { id: 2, name: 'USDT decrease each 1 sec for Hoodies', status: 'Active', link: '#' },
     { id: 3, name: 'TON based for merch each 1 min', status: 'Active', link: '#' }
  ],
  collections: [
    { id: 'c1', name: 'T-Shirts' },
    { id: 'c2', name: 'Hoodies' },
    { id: 'c3', name: 'Merch' }
  ],
  products: [
    { id: 'p1', collectionId: 'c1', name: 'Basic T-Shirt', price: 20 },
    { id: 'p2', collectionId: 'c2', name: 'Basic Hoodie', price: 50 }
  ]
};