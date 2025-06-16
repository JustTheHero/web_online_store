const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sales',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: false 
  },
  username: {
    type: String,
    required: false 
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxLength: 1000,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Sales = mongoose.model('Sales');
      const sale = await Sales.findById(this.orderId);
      if (sale) {
        this.productName = sale.productName;
      }

      const User = mongoose.model('User');
      const user = await User.findById(this.userId);
      if (user) {
        this.username = user.name || user.username;
      }
    } catch (error) {
      console.error(error);
    }
  }
  next();
});

reviewSchema.methods.populateRelatedData = async function() {
  await this.populate('orderId', 'productName productId totalPrice status');
  await this.populate('userId', 'name username email');
  return this;
};

reviewSchema.statics.findWithPopulatedData = function(query = {}) {
  return this.find(query)
    .populate('orderId', 'productName productId totalPrice status timestamp')
    .populate('userId', 'name username email')
    .sort({ timestamp: -1 });
};

reviewSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalReviews: 1,
        averageRating: { $round: ['$averageRating', 2] },
        ratingDistribution: {
          5: {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                cond: { $eq: ['$$this', 5] }
              }
            }
          },
          4: {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                cond: { $eq: ['$$this', 4] }
              }
            }
          },
          3: {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                cond: { $eq: ['$$this', 3] }
              }
            }
          },
          2: {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                cond: { $eq: ['$$this', 2] }
              }
            }
          },
          1: {
            $size: {
              $filter: {
                input: '$ratingDistribution',
                cond: { $eq: ['$$this', 1] }
              }
            }
          }
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

reviewSchema.index({ orderId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ productId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Review', reviewSchema);