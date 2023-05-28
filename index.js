require("./config/db");

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const expressValidator = require("express-validator");
const flash = require("connect-flash");
const passport = require("./config/passport");

require("dotenv").config({ path: "variables.env" });

const app = express();

// Habilitar body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar express validator
app.use(expressValidator());

// Habilitar template engine
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "layout",
    helpers: require("./helpers/handlebars"),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true, // Habilitar acceso a propiedades no propias
    }
  })
);
app.set("view engine", "handlebars");

// static files
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
  })
);

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Inicializar flash messages y alertas
app.use(flash());

// Crear nuestro middleware
app.use((req, res, next) => {
  res.locals.mensajes = req.flash();
  next();
});

app.use("/", router());

app.listen(process.env.PORT);
