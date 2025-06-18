const mongoose = require("mongoose");

// Define o schema do usuário
const userSchema = new mongoose.Schema({
    nome: String,         // Nome do usuário
    email: String,        // E-mail do usuário
    senha: String,        // Senha (deve ser armazenada com hash em produção)
    isAdmin: Boolean,     // Indica se o usuário é administrador
    id: Number,           // ID numérico (opcional, se não for o _id do MongoDB)
    discord: String       // Nome de usuário no Discord (opcional)
}, { 
    timestamps: true      // Adiciona campos createdAt e updatedAt automaticamente
});

// Exporta o modelo User para ser usado em outras partes do app
module.exports = mongoose.model('User', userSchema);
