const FQAModel = require('../models/fqa');
const { error500, response200 } = require('../utils/utils');

class FQA {

    findAll(from, limit, res) {
        FQAModel.find({})
            .skip(from)
            .limit(limit)
            .populate('user', 'name user email role')
            .exec((err, fqa) => {

                if (err) return error500(res, err);


                FQAModel.countDocuments((err, count) => {

                    if (err) return error500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: fqa,
                        total: count
                    });

                });

            });
    }

    agregarPersona(id, nombre, sala) {

        let persona = { id, nombre, sala };

        this.personas.push(persona);

        return this.personas;

    }

    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id) {

        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;

    }


}


module.exports = {
    FQA
}