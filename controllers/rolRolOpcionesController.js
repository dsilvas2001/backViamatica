const rolOpcionModel = require("../models/rolOpcionModel");
const rolRolOpcionesModel = require("../models/rolRolOpcionesModel");
const rolModel = require("../models/rolModel");

// Asignar una opción a un rol
exports.assignOptionToRol = async (req, res) => {
    const { Rol_idRol, RolOpciones_idOpcion } = req.body;
    try {
        // Verificar si el Rol está activo
        const rol = await rolModel.findById(Rol_idRol);
        if (!rol || !rol.estado) {
            return res.status(400).json({ msg: 'El rol no está activo o no existe' });
        }

        // Verificar si la Opción está activa
        const opcion = await rolOpcionModel.findById(RolOpciones_idOpcion);
        if (!opcion || !opcion.estado) {
            return res.status(400).json({ msg: 'La opción no está activa o no existe' });
        }


        const newAssignment = new rolRolOpcionesModel({ Rol_idRol, RolOpciones_idOpcion });
        const assignment = await newAssignment.save();
        res.status(201).json(assignment);
    } catch (err) {
        console.error('Error al asignar la opción al rol:', err);
        res.status(500).send('Error al asignar la opción al rol');
    }
};

// Obtener todas las opciones asignadas a un rol
exports.getOptionsByRol = async (req, res) => {
    const { rolId } = req.params;
    try {
        const assignments = await rolRolOpcionesModel.find({ Rol_idRol: rolId }).populate('RolOpciones_idOpcion');
        res.json(assignments);
    } catch (err) {
        console.error('Error al obtener las opciones del rol:', err);
        res.status(500).send('Error al obtener las opciones del rol');
    }
};


exports.getActiveOptionsByRol = async (req, res) => {
    const { rolId } = req.params;
    try {
        const assignments = await rolRolOpcionesModel.find({ Rol_idRol: rolId, estado: true }).populate('RolOpciones_idOpcion');
        res.json(assignments);
    } catch (err) {
        console.error('Error al obtener las opciones del rol:', err);
        res.status(500).send('Error al obtener las opciones del rol');
    }
};


// Obtener todos los roles asignados a una opción
exports.getRolesByOption = async (req, res) => {
    const { opcionId } = req.params;
    try {
        const assignments = await rolRolOpcionesModel.find({ RolOpciones_idOpcion: opcionId }).populate('Rol_idRol');
        res.json(assignments);
    } catch (err) {
        console.error('Error al obtener los roles de la opción:', err);
        res.status(500).send('Error al obtener los roles de la opción');
    }
};

exports.getActiveAssignmentsByOpcion = async (req, res) => {
    const { RolOpciones_idOpcion } = req.params;

    try {
        const activeAssignments = await rolRolOpcionesModel.find({ RolOpciones_idOpcion, estado: true }).populate('Rol_idRol');
        res.json(activeAssignments);
    } catch (err) {
        console.error('Error al obtener las asignaciones activas por opción:', err);
        res.status(500).send('Error al obtener las asignaciones activas por opción');
    }
};


// ESTADO

// Desactivar una asignación (cambiar estado a false)
exports.deactivateAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const assignment = await rolRolOpcionesModel.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );
        if (!assignment) {
            return res.status(404).json({ msg: 'Asignación no encontrada' });
        }
        res.json(assignment);
    } catch (err) {
        console.error('Error al desactivar la asignación:', err);
        res.status(500).send('Error al desactivar la asignación');
    }
};