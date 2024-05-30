const UserModel = require('../models/userModel');

exports.createUser = async (req, res) => {
    try {
        let user;
        user = new UserModel(req.body);
        await user.save();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { nombre, apellido, identificacion, password, usuario } = req.body;
        let user = await UserModel.findById(req.params.id);

        if (!user) {
            res.status(404).json({ msg: 'No existe el usuario' });
        }

        user.nombre = nombre;
        user.apellido = apellido;
        user.identificacion = identificacion;
        user.password = password;
        user.usuario = usuario;

        user = await UserModel.findOneAndUpdate({ _id: req.params.id }, user, { new: true });
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.getUserById = async (req, res) => {
    try {
        let user = await UserModel.findById(req.params.id);
        if (!user) {
            res.status(404).json({ msg: 'No existe el usuario' });
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.updateUserEstado = async (req, res) => {
    try {
        let user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'No existe el usuario' });
        }

        user.estado = 'Inactivo';
        await user.save();

        res.json({ msg: 'Estado del usuario actualizado con éxito' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al actualizar el estado del usuario');
    }
};


// Auth

exports.getUserByEmailAndUsername = async (req, res) => {
    try {
        const { email, usuario } = req.body;

        let user = await UserModel.findOne({ email, usuario });

        if (!user) {
            return res.json({ found: false });
        }

        res.json({ found: true });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
