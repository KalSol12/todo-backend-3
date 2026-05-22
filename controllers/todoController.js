const Todo = require("../models/Todo");

// @desc    Get all todos for logged-in user
// @route   GET /api/todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
exports.createTodo = async (req, res) => {
  try {
    const { text, startDate, endDate, priority, category } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text field is required" });
    }

    const count = await Todo.countDocuments({ user: req.user._id });

    const newTodo = await Todo.create({
      user: req.user._id,
      text,
      startDate,
      endDate,
      priority,
      category,
      order: count,
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    let todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a single todo
// @route   DELETE /api/todos/:id
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await todo.deleteOne();
    res.status(200).json({ message: "Todo deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Reorder todos
// @route   PUT /api/todos/reorder
exports.reorderTodos = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ message: "orderedIds array is required" });
    }

    const updates = orderedIds.map((id, index) =>
      Todo.updateOne(
        { _id: id, user: req.user._id },
        { $set: { order: index } }
      )
    );

    await Promise.all(updates);

    const todos = await Todo.find({ user: req.user._id }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Clear all todos for logged-in user
// @route   DELETE /api/todos
exports.clearAllTodos = async (req, res) => {
  try {
    await Todo.deleteMany({ user: req.user._id });
    res.status(200).json({ message: "All todos cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
