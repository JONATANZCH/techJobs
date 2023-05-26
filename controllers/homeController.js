const mongoose = require("mongoose");
const Vacante = mongoose.model("Vacante");

exports.mostrarTrabajos = async (req, res, next) => {
  const vacantes = await Vacante.find({}).lean();

  if (!vacantes) return next();

  res.render("home", {
    nombrePagina: "techJobs",
    tagline: "Encuentra y Pública Trabajos para Desarrolladores Web",
    barra: true,
    boton: true,
    vacantes,
  });
};
