const passport = require('passport');
const mongoose = require("mongoose");
const Vacante = mongoose.model("Vacante");

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Resvisa si el usuario esta autenticado o no
exports.verificarUsuario = (req, res, next) => {
    // Revisa si el usuario esta autenticado
    if(req.isAuthenticated()) {
        return next(); // Si esta autenticado, continua
    };
    // Si no esta autenticado
    return res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async (req, res) => {

    // consultar el usuario autenticado
    const vacantes = await Vacante.find({ autor: req.user._id }).lean();
    
    res.render('administracion', {
        nombrePagina: 'Panel de Administración',
        tagline: 'Crea y Administra tus vacantes desde aquí',
        vacantes
    })
}