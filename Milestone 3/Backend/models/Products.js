const mongoose = require('mongoose');

// Define o schema (estrutura) de um produto para o MongoDB usando Mongoose
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // Campo obrigatório
  },
  
  description: {
    type: String // Campo opcional
  },
  
  price: {
    type: Number,
    required: true, // Campo obrigatório
    min: 0          // Valor mínimo: 0
  },
  
  stock: {
    type: Number,
    required: true, // Campo obrigatório
    min: 0,         // Valor mínimo: 0
    default: 0      // Valor padrão: 0
  },
  
  image: {
    type: String // URL ou caminho da imagem
  },
  
  category: {
    type: String // Categoria do produto
  },
  
  brand: {
    type: String // Marca do produto
  }
}, {
  timestamps: true // Cria automaticamente os campos createdAt e updatedAt
});

// Modifica o método toJSON para incluir o campo 'id' ao invés de '_id'
productSchema.methods.toJSON = function() {
  const product = this.toObject();
  product.id = product._id;
  return product;
};

// Exporta o modelo para ser usado em outras partes da aplicação
module.exports = mongoose.model('Product', productSchema);
