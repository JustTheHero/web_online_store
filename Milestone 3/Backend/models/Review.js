const mongoose = require('mongoose');

// Define o schema para avaliações (reviews)
const reviewSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sales', // Referência à venda
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referência ao usuário
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String // Nome do produto (opcional)
  },
  username: {
    type: String // Nome do usuário (opcional)
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // Avaliação de 1 a 5 estrelas
  },
  comment: {
    type: String,
    maxLength: 1000,
    default: '' // Comentário opcional
  },
  timestamp: {
    type: Date,
    default: Date.now // Data da criação
  },
  updatedAt: {
    type: Date,
    default: Date.now // Data da última atualização
  }
});

// Atualiza o campo updatedAt sempre que salvar
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Preenche automaticamente o nome do produto e do usuário ao criar nova review
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Sales = mongoose.model('Sales');
      const sale = await Sales.findById(this.orderId);
      if (sale) this.productName = sale.productName;

      const User = mongoose.model('User');
      const user = await User.findById(this.userId);
      if (user) this.username = user.name || user.username;
    } catch (error) {
      console.error(error);
    }
  }
  next();
});

// Método para popular dados relacionados (ordem e usuário)
reviewSchema.methods.populateRelatedData = async function() {
  await this.populate('orderId', 'productName productId totalPrice status');
  await this.populate('userId', 'name username email');
  return this;
};

// Busca reviews já com os dados relacionados populados
reviewSchema.statics.findWithPopulatedData = function(query = {}) {
  return this.find(query)
    .populate('orderId', 'productName productId totalPrice status timestamp')
    .populate('userId', 'name username email')
    .sort({ timestamp: -1 });
};

// Retorna estatísticas de avaliação: média, total e distribuição
reviewSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingDistribution: { $push: '$rating' }
      }
    },
    {
      $project: {
        _id: 0,
        totalReviews: 1,
        averageRating: { $round: ['$averageRating', 2] },
        ratingDistribution: {
          5: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 5] } } } },
          4: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 4] } } } },
          3: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 3] } } } },
          2: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 2] } } } },
          1: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 1] } } } }
        }
      }
    }
  ]);

  return stats[0] || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };
};

// Índices para melhorar performance nas consultas
reviewSchema.index({ orderId: 1, userId: 1 }, { unique: true }); // Garante 1 avaliação por pedido e usuário
reviewSchema.index({ productId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ timestamp: -1 });

// Exporta o modelo para uso externo
module.exports = mongoose.model('Review', reviewSchema);
