// Generic CRUD Controller for all models
export const createItem = (Model) => async (req, res) => {
  try {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating item', error: error.message });
  }
};

export const getAllItems = (Model) => async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    
    const items = await Model.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });
    
    const totalCount = await Model.countDocuments();
    
    res.json({
      items,
      totalCount,
      hasNext: parseInt(skip) + parseInt(limit) < totalCount,
      currentPage: Math.floor(parseInt(skip) / parseInt(limit)),
      pageSize: parseInt(limit),
      nextSkip: parseInt(skip) + parseInt(limit) < totalCount 
        ? parseInt(skip) + parseInt(limit) 
        : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching items', error: error.message });
  }
};

export const getItemById = (Model) => async (req, res) => {
  try {
    const item = await Model.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching item', error: error.message });
  }
};

export const updateItem = (Model) => async (req, res) => {
  try {
    const item = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating item', error: error.message });
  }
};

export const deleteItem = (Model) => async (req, res) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully', deletedItem: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting item', error: error.message });
  }
};
