const rolOpcionModel = require('../models/rolOpcionModel');

// añadir
exports.createRolOpcion = async (req, res) => {
    try {
        const newRolOpcion = new rolOpcionModel(req.body);
        const rolOpcion = await newRolOpcion.save();
        res.json(rolOpcion);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// retornar Todos
exports.getRolOpciones = async (req, res) => {
    try {
        const rolOpciones = await rolOpcionModel.find();
        res.json(rolOpciones);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Editar
exports.updateRolOpcion = async (req, res) => {
    try {
        const rolOpcion = await rolOpcionModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(rolOpcion);
    } catch (err) {
        res.status(500).send('Server error');
    }
};
// retornar por ID
exports.getRolOpcionById = async (req, res) => {
    try {
        const rolOpcion = await rolOpcionModel.findById(req.params.id);
        if (!rolOpcion) {
            return res.status(404).json({ msg: 'Opción de rol no encontrada' });
        }
        res.json(rolOpcion);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// retornar todos los activo
exports.getRolOpcionByEstado = async (req, res) => {
    try {
        const rolOpciones = await rolOpcionModel.find({ estado: true });
        res.json(rolOpciones);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Eliminar (cambiar el estado)
exports.deleteRolOpcion = async (req, res) => {
    try {
        const rolOpcion = await rolOpcionModel.findByIdAndUpdate(
            req.params.id,
            { $set: { estado: false } },
            { new: true }
        );
        res.json(rolOpcion);
    } catch (err) {
        res.status(500).send('Server error');
    }
};
