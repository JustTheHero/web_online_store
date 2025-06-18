const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors()); // Habilita CORS para permitir requisições externas
app.use(express.json()); // Habilita o parsing de JSON nas requisições

// Conexão com o MongoDB usando a URL no .env
mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
// Evento para erro na conexão
db.on("error", console.error.bind(console, "connection error:"));
// Evento quando a conexão for aberta com sucesso
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Define as rotas da API
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/sales', require('./routes/sales'));

// Inicializa o servidor na porta definida no .env
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
