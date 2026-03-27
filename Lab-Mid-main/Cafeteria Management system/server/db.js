import { JSONFilePreset } from 'lowdb/node'

// Initialize lowdb with a default structure
const defaultData = { 
  users: [], 
  menu: [
    { id: 1, name: 'Coffee', price: 150, category: 'Beverages' },
    { id: 2, name: 'Burger', price: 350, category: 'Fast Food' },
    { id: 3, name: 'Pizza', price: 800, category: 'Fast Food' },
    { id: 4, name: 'Tea', price: 80, category: 'Beverages' }
  ], 
  orders: [],
  settings: {
    discounts: {
      student: 10, // 10% discount
      teacher: 5  // 5% discount
    }
  }
}

const db = await JSONFilePreset('db.json', defaultData)

export default db
