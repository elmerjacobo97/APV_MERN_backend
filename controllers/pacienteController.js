import Paciente from '../models/Paciente.js';

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);

    // añadimos el paciente autenticado(checkAuth) a la columna "veterinario"
    paciente.veterinario = req.veterinario._id;

    try {
        const pacienteAlmacenado = await paciente.save();
        return res.json(pacienteAlmacenado);
    } catch (e) {
        console.log(e);
    }
};

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes);
};

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const paciente = await Paciente.findById(id);

        // Evaluar si el usuario autenticado tiene los permisos para traer un paciente en específico
        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.status(403).json({ msg: 'Acción no válida' });
        }

        return res.json(paciente);
    } catch (error) {
        return res.status(404).json({ msg: 'No se ha encontrado ningún paciente' });
    }
};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const paciente = await Paciente.findById(id);

        // Evaluar que la persona quién vaya a editar sea quién la creó
        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.status(403).json({ msg: 'Acción no válida' });
        }

        // Actualizar datos pacientes
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        try {
            const pacienteActualizado = await paciente.save();
            return res.json(pacienteActualizado);
        } catch (error) {
            return res.status(403).json('Hubo un error en la actualización');
        }
    } catch (error) {
        return res
            .status(404)
            .json({ msg: 'No se ha encontrado ningún paciente o no tienes permisos' });
    }
};

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const paciente = await Paciente.findById(id);

        // Evaluar que la persona quién vaya a editar sea quién la creó
        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.status(403).json({ msg: 'Acción no válida' });
        }

        try {
            await paciente.deleteOne();
            return res.json({ msg: 'Paciente eliminado correctamente' });
        } catch (error) {
            return res.status(403).json('Hubo un error al eliminar');
        }
    } catch (error) {
        return res
            .status(404)
            .json({ msg: 'No se ha encontrado ningún paciente o no tienes permisos' });
    }
};

export { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente };
