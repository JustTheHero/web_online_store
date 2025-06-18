const mongoose = require('mongoose');

// Define o schema para vendas (sales)
const salesSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    trim: true // Remove espaços extras
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1 // Quantidade mínima: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },

  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Mínimo de 6 caracteres
  },

  customerId: {
    type: String,
    default: null,
    trim: true
  },

  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },

  timestamp: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },

  deliveryDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Cria automaticamente createdAt e updatedAt
});

// Atualiza a data de modificação ao salvar
salesSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Atualiza o preço total se quantidade ou preço unitário forem modificados
salesSchema.pre('save', function(next) {
  if (this.isModified('quantity') || this.isModified('unitPrice')) {
    this.totalPrice = this.quantity * this.unitPrice;
  }
  next();
});

// Índices para melhorar a performance das buscas
salesSchema.index({ customerId: 1 });
salesSchema.index({ productId: 1 });
salesSchema.index({ status: 1 });
salesSchema.index({ timestamp: -1 });
salesSchema.index({ customerId: 1, status: 1 });

// Métodos de instância para atualizar o status
salesSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  return this.save();
};

salesSchema.methods.markAsCancelled = function() {
  this.status = 'cancelled';
  return this.save();
};

// Busca vendas por cliente
salesSchema.statics.findByCustomer = function(customerId) {
  return this.find({ customerId }).sort({ timestamp: -1 });
};

// Busca vendas por status
salesSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ timestamp: -1 });
};

// Busca vendas por produto
salesSchema.statics.findByProduct = function(productId) {
  return this.find({ productId }).sort({ timestamp: -1 });
};

// Estatísticas para um cliente específico
salesSchema.statics.getCustomerStats = async function(customerId) {
  const sales = await this.find({ customerId });

  return {
    totalOrders: sales.length,
    totalSpent: sales.reduce((sum, sale) => sum + sale.totalPrice, 0),
    completedOrders: sales.filter(sale => sale.status === 'completed').length,
    pendingOrders: sales.filter(sale => sale.status === 'pending').length,
    cancelledOrders: sales.filter(sale => sale.status === 'cancelled').length,
    averageOrderValue: sales.length > 0 ?
      sales.reduce((sum, sale) => sum + sale.totalPrice, 0) / sales.length : 0
  };
};

// Estatísticas gerais de vendas, com filtros opcionais por data
salesSchema.statics.getSalesStats = async function(startDate, endDate) {
  let query = {};

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const sales = await this.find(query);

  return {
    totalSales: sales.length,
    totalRevenue: sales.reduce((sum, sale) => sum + sale.totalPrice, 0),
    averageOrderValue: sales.length > 0 ?
      sales.reduce((sum, sale) => sum + sale.totalPrice, 0) / sales.length : 0,
    statusBreakdown: {
      pending: sales.filter(sale => sale.status === 'pending').length,
      processing: sales.filter(sale => sale.status === 'processing').length,
      completed: sales.filter(sale => sale.status === 'completed').length,
      cancelled: sales.filter(sale => sale.status === 'cancelled').length
    }
  };
};

// Exporta o modelo
const Sales = mongoose.model('Sales', salesSchema);
module.exports = Sales;
