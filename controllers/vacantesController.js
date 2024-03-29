const mongoose = require("mongoose");
const Vacante = mongoose.model("Vacante");

exports.formularioNuevaVacante = (req, res) => {
  res.render("nueva-vacante", {
    nombrePagina: "Nueva Vacante",
    tagline: "Llena el formulario y publica tu vacante",
  });
};

// agrega las vacantes a la base de datos
exports.agregarVacante = async (req, res) => {
  const vacante = new Vacante(req.body);

  // Usuario autor de la vacante
  vacante.autor = req.user._id;

  // Crear arreglo de skills
  vacante.skills = req.body.skills.split(",");
  console.log(vacante);

  // Almacenar en la base de datos
  const nuevaVacante = await vacante.save();

  // redireccionar
  res.redirect(`/vacantes/${nuevaVacante.url}`);
};

// Muestra una vacante
exports.mostrarVacante = async (req, res, next) => {
  const vacante = await Vacante.findOne({ url: req.params.url }).lean();
  // si no hay resultados
  if (!vacante) return next();
  // mostrar la vacante
  res.render("vacante", {
    vacante,
    nombrePagina: vacante.titulo,
    barra: true,
  });
};

exports.formularioEditarVacante = async (req, res, next) => {
  const vacante = await Vacante.findOne({ url: req.params.url}).lean();

  if(!vacante) return next();

  res.render('editar-vacante', {
      vacante,
      nombrePagina : `Editar - ${vacante.titulo}`,
  })
}

exports.editarVacante = async (req, res) => {
  const vacanteActualizada = req.body;

  vacanteActualizada.skills = req.body.skills.split(',').lean();

  const vacante = await Vacante.findOneAndUpdate({url: req.params.url}.lean(), vacanteActualizada, {
      new: true,
      runValidators: true
  });

  res.redirect(`/vacantes/${vacante.url}`);
}
