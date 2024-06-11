const rolModel = require("../models/rolModel");

// Crear un nuevo rol
exports.createRol = async (req, res) => {
    const { RolName } = req.body;
    try {
        const newRol = new rolModel({ RolName });
        const rol = await newRol.save();
        res.status(201).json(rol);
    } catch (err) {
        console.error('Error al crear el rol:', err);
        res.status(500).send('Error al crear el rol');
    }
};

// Obtener todos los roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await rolModel.find();
        res.json(roles);
    } catch (err) {
        console.error('Error al obtener los roles:', err);
        res.status(500).send('Error al obtener los roles');
    }
};


// Obtener un rol por ID
exports.getRolById = async (req, res) => {
    const { id } = req.params;
    try {
        const rol = await rolModel.findById(id);
        if (!rol) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }
        res.json(rol);
    } catch (err) {
        console.error('Error al obtener el rol:', err);
        res.status(500).send('Error al obtener el rol');
    }
};

// Actualizar un rol por ID
exports.updateRol = async (req, res) => {
    const { id } = req.params;
    const { RolName } = req.body;
    try {
        const rol = await rolModel.findByIdAndUpdate(id, { RolName }, { new: true });
        if (!rol) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }
        res.json(rol);
    } catch (err) {
        console.error('Error al actualizar el rol:', err);
        res.status(500).send('Error al actualizar el rol');
    }
};


exports.getActiveRol = async (req, res) => {
    try {
        const activeUsers = await rolModel.find({ estado: true });
        res.json(activeUsers);
    } catch (err) {
        console.error('Error al obtener los rols activos:', err);
        res.status(500).send('Error al obtener los rols activos');
    }
};


exports.deactivateRol = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await rolModel.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error al desactivar el Rol:', err);
        res.status(500).send('Error al desactivar el Rol');
    }
};


exports.reactivateRol = async (req, res) => {
    const { id } = req.params;
    try {
        const rol = await rolModel.findByIdAndUpdate(
            id,
            { estado: true },
            { new: true }
        );
        if (!rol) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }
        res.json(rol);
    } catch (err) {
        console.error('Error al reactivar el rol:', err);
        res.status(500).send('Error al reactivar el rol');
    }
};

