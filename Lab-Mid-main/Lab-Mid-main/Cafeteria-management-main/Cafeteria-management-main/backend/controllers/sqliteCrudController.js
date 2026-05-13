import { getDB } from '../config/db-sqlite.js';

const prepareData = (data) => {
  const prepared = { ...data };
  // Convert booleans to 0/1 for SQLite
  Object.keys(prepared).forEach(key => {
    if (typeof prepared[key] === 'boolean') {
      prepared[key] = prepared[key] ? 1 : 0;
    }
  });
  return prepared;
};

export const createItem = (tableName) => async (req, res) => {
  try {
    const db = getDB();
    const data = prepareData(req.body);
    
    // Ensure both id and _id are present for compatibility
    if (data.id && !data._id) data._id = data.id;
    if (data._id && !data.id) data.id = data._id;

    const keys = Object.keys(data);
    const columns = keys.join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    await db.run(query, values);
    
    res.status(201).json({ ...data });
  } catch (error) {
    console.error(`Error creating item in ${tableName}:`, error);
    res.status(500).json({ message: `SQLite error creating item in ${tableName}`, error: error.message });
  }
};

export const getAllItems = (tableName) => async (req, res) => {
  try {
    const db = getDB();
    const items = await db.all(`SELECT * FROM ${tableName} ORDER BY createdDate DESC`);
    
    // Map back to boolean if needed or just return as is (frontend usually handles 0/1 as falsy/truthy)
    res.json({
      items: items,
      totalCount: items.length
    });
  } catch (error) {
    console.error(`Error fetching items from ${tableName}:`, error);
    res.status(500).json({ message: 'SQLite error fetching items', error: error.message });
  }
};

export const getItemById = (tableName) => async (req, res) => {
  try {
    const db = getDB();
    const item = await db.get(`SELECT * FROM ${tableName} WHERE id = ? OR _id = ?`, [req.params.id, req.params.id]);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error(`Error fetching item ${req.params.id} from ${tableName}:`, error);
    res.status(500).json({ message: 'SQLite error fetching item', error: error.message });
  }
};

export const updateItem = (tableName) => async (req, res) => {
  try {
    const db = getDB();
    const data = prepareData(req.body);
    const id = req.params.id;

    const keys = Object.keys(data).filter(k => k !== 'id' && k !== '_id');
    const sets = keys.map(key => `${key} = ?`).join(', ');
    const values = [...keys.map(k => data[k]), id, id];

    await db.run(`UPDATE ${tableName} SET ${sets} WHERE id = ? OR _id = ?`, values);
    
    res.json({ id, ...data });
  } catch (error) {
    console.error(`Error updating item ${req.params.id} in ${tableName}:`, error);
    res.status(500).json({ message: 'SQLite error updating item', error: error.message });
  }
};

export const deleteItem = (tableName) => async (req, res) => {
  try {
    const db = getDB();
    await db.run(`DELETE FROM ${tableName} WHERE id = ? OR _id = ?`, [req.params.id, req.params.id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(`Error deleting item ${req.params.id} from ${tableName}:`, error);
    res.status(500).json({ message: 'SQLite error deleting item', error: error.message });
  }
};

