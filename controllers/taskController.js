const { Task } = require('../models');
const { Op } = require('sequelize');

// Crear una nueva tarea
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, status } = req.body;
        const userId = req.user.id;
        if (!title) {
        return res.status(400).json({ message: 'El título es obligatorio.' });
        }
        const task = await Task.create({
            title,
            description,
            dueDate,
            status,
            userId
        });
        return res.status(201).json({
            message: 'Tarea creada exitosamente',
            task
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear la tarea.' });
    }
};

// Obtener todas las tareas del usuario autenticado
exports.getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, search, fromDate, toDate } = req.query;
        let where = { userId };

        // Filtros
        if (status) {
            where.status = status;
        }
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }
        if (fromDate && toDate) {
            where.dueDate = {
                [Op.between]: [fromDate, toDate]
            };
        } else if (fromDate) {
            where.dueDate = { [Op.gte]: fromDate };
        } else if (toDate) {
            where.dueDate = { [Op.lte]: toDate };
        }

        const tasks = await Task.findAll({ where });

        return res.json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener las tareas.' });
    }
};


// Obtener una tarea específica por ID
exports.getTaskById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const task = await Task.findOne({ where: { id, userId } });
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        return res.json(task);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener la tarea.' });
    }
};

// Actualizar una tarea
exports.updateTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { title, description, dueDate, status } = req.body;

        const task = await Task.findOne({ where: { id, userId } });

        if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada.' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.status = status || task.status;

        await task.save();
        return res.json(task);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar la tarea.' });
    }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const task = await Task.findOne({ where: { id, userId } });

        if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        await task.destroy();
        return res.json({ message: 'Tarea eliminada correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar la tarea.' });
    }
};
