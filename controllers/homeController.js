exports.mostrarTrabajos = (req, res) => {
    res.render('home', {
        nombrePagina: 'techJobs',
        tagline: 'Encuentra y Publica Trabajos para Desarrolladores Web',
        barra: true,
        boton: true
    });
}