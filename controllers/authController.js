const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'HalaMadrid';

// Registro
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({ name, email, password: hashedPassword });
        return res.status(201).json({ message: 'Usuario registrado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor.' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales incorrectas.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales incorrectas.' });
        }
        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return res.json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor.' });
    }
    };

    // Obtener datos del usuario autenticado
    exports.getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor.' });
    }
};
