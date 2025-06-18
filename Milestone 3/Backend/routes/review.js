const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Sales = require("../models/Sales");
const User = require("../models/Users");

// Busca reviews com filtros, paginação e ordenação
router.get("/", async (req, res) => {
  try {
    const { 
      productId, userId, rating, isVerified, startDate, endDate,
      limit = 50, offset = 0, sortBy = 'timestamp', sortOrder = 'desc'
    } = req.query;

    let query = {};
    if (productId) query.productId = productId;
    if (userId) query.userId = userId;
    if (rating) query.rating = parseInt(rating);
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Busca reviews com dados populados de pedido e usuário
    const reviews = await Review.find(query)
      .populate('orderId', 'productName productId totalPrice status timestamp username')
      .populate('userId', 'name username email')
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar reviews:', error);
    res.status(500).json({ message: error.message });
  }
});

// Busca reviews de um produto específico, com estatísticas de notas
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Reviews do produto com dados de usuário e pedido populados
    const reviews = await Review.find({ productId })
      .populate('userId', 'name username')
      .populate('orderId', 'status timestamp')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Review.countDocuments({ productId });

    // Estatísticas agregadas das avaliações do produto
    const stats = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingCounts: { $push: '$rating' }
        }
      }
    ]);

    // Formatação dos dados estatísticos para resposta
    const productStats = stats[0] ? {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingDistribution: {
        5: stats[0].ratingCounts.filter(r => r === 5).length,
        4: stats[0].ratingCounts.filter(r => r === 4).length,
        3: stats[0].ratingCounts.filter(r => r === 3).length,
        2: stats[0].ratingCounts.filter(r => r === 2).length,
        1: stats[0].ratingCounts.filter(r => r === 1).length
      }
    } : {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    res.json({
      reviews,
      stats: productStats,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar reviews do produto:', error);
    res.status(500).json({ message: error.message });
  }
});

// Busca todas as reviews feitas por um usuário
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const reviews = await Review.find({ userId })
      .populate('orderId', 'productName productId totalPrice status timestamp')
      .sort({ timestamp: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Erro ao buscar reviews do usuário:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cria nova review validando dados e status do pedido
router.post('/', async (req, res) => {
  try {
    const { orderId, userId, productId, rating, comment } = req.body;

    if (!orderId || !userId || !productId || !rating) {
      return res.status(400).json({ message: "Campos obrigatórios: orderId, userId, productId, rating" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating deve ser entre 1 e 5" });
    }

    const sale = await Sales.findById(orderId);
    if (!sale) return res.status(404).json({ message: "Venda não encontrada" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const existingReview = await Review.findOne({ orderId, userId });
    if (existingReview) return res.status(400).json({ message: "Usuário já avaliou este pedido" });

    if (sale.status !== 'completed') {
      return res.status(400).json({ message: "Só é possível avaliar pedidos concluídos" });
    }

    const reviewData = {
      orderId,
      userId,
      productId,
      rating,
      comment: comment || '',
      productName: sale.productName,
      username: user.name || user.username
    };

    const review = new Review(reviewData);
    const savedReview = await review.save();
    
    await savedReview.populate('orderId', 'productName productId totalPrice status timestamp');
    await savedReview.populate('userId', 'name username email');

    res.status(201).json({
      message: 'Review criada com sucesso',
      review: savedReview
    });

  } catch (error) {
    console.error('Erro ao criar review:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Usuário já avaliou este pedido' });
    } else {
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  }
});

// Busca review específica pelo ID com dados relacionados
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('orderId', 'productName productId totalPrice status timestamp username')
      .populate('userId', 'name username email');
    
    if (!review) return res.status(404).json({ message: "Review não encontrada" });
    
    res.json(review);
  } catch (error) {
    console.error('Erro ao buscar review:', error);
    res.status(500).json({ message: error.message });
  }
});

// Atualiza campos selecionados da review (rating, comentário, verificação)
router.put('/:id', async (req, res) => {
  try {
    const { rating, comment, isVerified } = req.body;
    const updateData = {};

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating deve ser entre 1 e 5" });
      updateData.rating = rating;
    }

    if (comment !== undefined) {
      if (comment.length > 1000) return res.status(400).json({ message: "Comentário deve ter no máximo 1000 caracteres" });
      updateData.comment = comment;
    }

    if (isVerified !== undefined) updateData.isVerified = isVerified;

    updateData.updatedAt = new Date();

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('orderId', 'productName productId totalPrice status timestamp')
      .populate('userId', 'name username email');

    if (!updatedReview) return res.status(404).json({ message: "Review não encontrada" });

    res.json({ message: 'Review atualizada com sucesso', review: updatedReview });

  } catch (error) {
    console.error('Erro ao atualizar review:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
});

// Deleta uma review pelo ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) return res.status(404).json({ message: "Review não encontrada" });

    res.json({ message: 'Review deletada com sucesso', review: deletedReview });

  } catch (error) {
    console.error('Erro ao deletar review:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
});

// Estatísticas gerais de reviews, podendo filtrar por produto e datas
router.get('/stats/general', async (req, res) => {
  try {
    const { productId, startDate, endDate } = req.query;
    let matchStage = {};

    if (productId) matchStage.productId = productId;
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }

    const stats = await Review.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          verifiedReviews: { $sum: { $cond: ['$isVerified', 1, 0] } },
          reportedReviews: { $sum: { $cond: ['$reported', 1, 0] } },
          totalHelpful: { $sum: '$helpful' },
          ratingDistribution: { $push: '$rating' },
          reviewsWithComments: { $sum: { $cond: [{ $gt: [{ $strLenCP: '$comment' }, 0] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          totalReviews: 1,
          averageRating: { $round: ['$averageRating', 2] },
          verifiedReviews: 1,
          reportedReviews: 1,
          totalHelpful: 1,
          reviewsWithComments: 1,
          ratingDistribution: {
            5: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$this', 5] } } } },
            4: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$this', 4] } } } },
            3: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$this', 3] } } } },
            2: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$this', 2] } } } },
            1: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$this', 1] } } } }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalReviews: 0,
      averageRating: 0,
      verifiedReviews: 0,
      reportedReviews: 0,
      totalHelpful: 0,
      reviewsWithComments: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Retorna os top produtos com melhor avaliação (mínimo 3 reviews)
router.get('/stats/top-products', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await Review.aggregate([
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productName' },
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          totalHelpful: { $sum: '$helpful' }
        }
      },
      { $match: { totalReviews: { $gte: 3 } } },
      {
        $project: {
          productId: '$_id',
          productName: 1,
          averageRating: { $round: ['$averageRating', 2] },
          totalReviews: 1,
          totalHelpful: 1,
          _id: 0
        }
      },
      { $sort: { averageRating: -1, totalReviews: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json(topProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
