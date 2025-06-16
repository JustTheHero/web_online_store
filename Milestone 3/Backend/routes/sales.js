const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");

router.get("/", async (req, res) => {
  try {
    const { status, productId, customerId, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (productId) query.productId = productId;
    if (customerId) query.customerId = customerId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const sales = await Sales.find(query).sort({ timestamp: -1 });
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status } = req.query;
    
    let query = { customerId };
    if (status) query.status = status;

    const sales = await Sales.find(query).sort({ timestamp: -1 });

    const stats = {
      totalOrders: sales.length,
      totalSpent: sales.reduce((sum, sale) => sum + sale.totalPrice, 0),
      completedOrders: sales.filter(sale => sale.status === 'completed').length,
      pendingOrders: sales.filter(sale => sale.status === 'pending').length
    };

    res.json({ sales, stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);
    
    if (!sale) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }

    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const { 
      productId, 
      productName, 
      quantity, 
      unitPrice, 
      username, 
      password, 
      customerId,
      status 
    } = req.body;

    if (!productId || !productName || !quantity || !unitPrice || !username || !password) {
      return res.status(400).json({ 
        message: "Campos obrigatórios: productId, productName, quantity, unitPrice, username, password" 
      });
    }

    if (quantity <= 0 || unitPrice < 0) {
      return res.status(400).json({ 
        message: "Quantidade deve ser maior que 0 e preço não pode ser negativo" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Senha deve ter pelo menos 6 caracteres" 
      });
    }

    const totalPrice = quantity * unitPrice;

    const sale = new Sales({
      productId,
      productName,
      quantity,
      unitPrice,
      totalPrice,
      username,
      password,
      customerId: customerId || null,
      status: status || 'pending',
      timestamp: new Date()
    });

    const savedSale = await sale.save();
    
    console.log('Venda criada com sucesso:', savedSale._id);
    
    res.status(201).json({
      message: 'Venda criada com sucesso',
      sale: savedSale
    });

  } catch (error) {
    console.error('Erro ao criar venda:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.quantity !== undefined && updateData.quantity <= 0) {
      return res.status(400).json({ 
        message: "Quantidade deve ser maior que 0" 
      });
    }

    if (updateData.unitPrice !== undefined && updateData.unitPrice < 0) {
      return res.status(400).json({ 
        message: "Preço não pode ser negativo" 
      });
    }

    const existingSale = await Sales.findById(id);
    if (!existingSale) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }

    if (updateData.quantity || updateData.unitPrice) {
      const newQuantity = updateData.quantity || existingSale.quantity;
      const newUnitPrice = updateData.unitPrice || existingSale.unitPrice;
      updateData.totalPrice = newQuantity * newUnitPrice;
    }

    const updatedSale = await Sales.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }

    console.log('Venda atualizada:', updatedSale._id);
    
    res.json({
      message: 'Venda atualizada com sucesso',
      sale: updatedSale
    });

  } catch (error) {
    console.error('Erro ao atualizar venda:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSale = await Sales.findByIdAndDelete(id);

    if (!deletedSale) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }

    console.log('Venda deletada:', deletedSale._id);
    
    res.json({
      message: 'Venda deletada com sucesso',
      sale: deletedSale
    });

  } catch (error) {
    console.error('Erro ao deletar venda:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Status deve ser um dos seguintes: ${validStatuses.join(', ')}` 
      });
    }

    const updatedSale = await Sales.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }

    console.log('Status da venda atualizado:', updatedSale._id, 'para', status);
    
    res.json({
      message: 'Status atualizado com sucesso',
      sale: updatedSale
    });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});
router.get('/stats/general', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const sales = await Sales.find(query);

    const stats = {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.totalPrice, 0),
      averageOrderValue: sales.length > 0 ? 
        sales.reduce((sum, sale) => sum + sale.totalPrice, 0) / sales.length : 0,
      statusBreakdown: {
        pending: sales.filter(sale => sale.status === 'pending').length,
        processing: sales.filter(sale => sale.status === 'processing').length,
        completed: sales.filter(sale => sale.status === 'completed').length,
        cancelled: sales.filter(sale => sale.status === 'cancelled').length
      },
      topProducts: getTopProducts(sales),
      revenueByStatus: {
        pending: sales.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.totalPrice, 0),
        processing: sales.filter(s => s.status === 'processing').reduce((sum, s) => sum + s.totalPrice, 0),
        completed: sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.totalPrice, 0),
        cancelled: sales.filter(s => s.status === 'cancelled').reduce((sum, s) => sum + s.totalPrice, 0)
      }
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
function getTopProducts(sales) {
  const productStats = {};
  
  sales.forEach(sale => {
    if (!productStats[sale.productId]) {
      productStats[sale.productId] = {
        productId: sale.productId,
        productName: sale.productName,
        totalQuantity: 0,
        totalRevenue: 0,
        salesCount: 0
      };
    }
    
    productStats[sale.productId].totalQuantity += sale.quantity;
    productStats[sale.productId].totalRevenue += sale.totalPrice;
    productStats[sale.productId].salesCount += 1;
  });
  
  return Object.values(productStats)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10); 
}

module.exports = router;