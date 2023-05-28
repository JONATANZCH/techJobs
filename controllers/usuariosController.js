const mongoose = require("mongoose");
const Usuarios = mongoose.model("Usuarios");

exports.formularioCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    nombrePagina: "Crear tu cuenta en techJobs",
    tagline: "Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
  });
};

exports.validarRegistro = (req, res, next) => {
  // sanitizar y validar los campos del formulario
  req.sanitizeBody("nombre").escape();
  req.sanitizeBody("email").escape();
  req.sanitizeBody("password").escape();
  req.sanitizeBody("confirmar").escape();

  // validar
  req.checkBody("nombre", "El nombre es obligatorio").notEmpty();
  req.checkBody("email", "El email no es valido").isEmail();
  req.checkBody("password", "El password no puede ir vacio").notEmpty();
  req.checkBody("password", "El password debe tener al menos 6 caracteres").isLength({ min: 6 });
  req.checkBody("confirmar", "Confirmar password no puede ir vacio").notEmpty();
  req.checkBody("confirmar", "El password no coincide").equals(req.body.password);

  const errores = req.validationErrors();

  if(errores){
    // si hay errores
    req.flash("error", errores.map(error => error.msg));
    res.render("crear-cuenta", {
        nombrePagina: "Crear tu cuenta en techJobs",
        tagline: "Comienza a publicar tus vacantes gratis, solo debes crear una cuenta",
        mensajes: req.flash()
    });
    return;
  }

  // Si la validacion es correcta
  next();
};

exports.crearUsuario = async (req, res, next) => {
  // crear el usuario
  const usuario = new Usuarios(req.body);
  try {
      await usuario.save();
      res.redirect('/iniciar-sesion');
  } catch (error) {
      req.flash('error', error);
      res.redirect('/crear-cuenta');
  }
}

// Formulario para iniciar sesion
exports.formularioIniciarSesion = (req, res) => {
  res.render("iniciar-sesion", {
    nombrePagina: "Iniciar Sesión en techJobs",
  })
}

// Form Editar el Perfil
exports.formularioEditarPerfil = (req, res) => {
  res.render("editar-perfil", {
    nombrePagina: "Edita tu perfil en techJobs",
    usuario: req.user,
  })
};

// Guardar cambios editar perfil
exports.editarPerfil = async (req, res) => {
  const usuario = await Usuarios.findById(req.user._id).exec();
  console.log(req.body.nombre)
  usuario.nombre = req.body.nombre;
  usuario.email = req.body.email;
  if(req.body.password) {
      usuario.password = req.body.password
  }

  if(req.file) {
      usuario.imagen = req.file.filename;
  }

  await usuario.save();

  req.flash('correcto', 'Cambios Guardados Correctamente');
  // redirect
  res.redirect('/administracion');
}