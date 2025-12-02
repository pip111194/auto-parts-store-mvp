const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Part name is required'],
    trim: true,
    minlength: [3, 'Part name must be at least 3 characters'],
    maxlength: [200, 'Part name cannot exceed 200 characters']
  },
  partNumber: {
    type: String,
    required: [true, 'Part number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Pricing
  costPrice: {
    type: Number,
    required: [true, 'Cost price is required'],
    min: [0, 'Cost price cannot be negative']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  taxPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  
  // Inventory
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  minStockLevel: {
    type: Number,
    default: 5,
    min: [0, 'Minimum stock level cannot be negative']
  },
  reorderQuantity: {
    type: Number,
    default: 10,
    min: [0, 'Reorder quantity cannot be negative']
  },
  
  // Images
  images: [{
    url: String,
    publicId: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Specifications
  specifications: {
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['mm', 'cm', 'inch'],
        default: 'cm'
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['g', 'kg', 'lb'],
        default: 'kg'
      }
    },
    material: String,
    color: String,
    warranty: {
      duration: Number,
      unit: {
        type: String,
        enum: ['days', 'months', 'years'],
        default: 'months'
      }
    },
    countryOfOrigin: String
  },
  
  // Vehicle Compatibility
  vehicleCompatibility: [{
    make: String,
    model: String,
    yearFrom: Number,
    yearTo: Number,
    engineType: String
  }],
  
  // Additional Info
  tags: [String],
  sku: String,
  barcode: String,
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  views: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  
  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
partSchema.index({ partNumber: 1 });
partSchema.index({ name: 'text', description: 'text', brand: 'text' });
partSchema.index({ category: 1 });
partSchema.index({ quantity: 1 });
partSchema.index({ sellingPrice: 1 });

// Virtual for stock status
partSchema.virtual('stockStatus').get(function() {
  if (this.quantity === 0) return 'out_of_stock';
  if (this.quantity <= this.minStockLevel) return 'low_stock';
  return 'in_stock';
});

// Virtual for final price after discount
partSchema.virtual('finalPrice').get(function() {
  if (this.discount > 0) {
    return this.sellingPrice - (this.sellingPrice * this.discount / 100);
  }
  return this.sellingPrice;
});

// Virtual for profit margin
partSchema.virtual('profitMargin').get(function() {
  if (this.costPrice > 0) {
    return ((this.sellingPrice - this.costPrice) / this.costPrice * 100).toFixed(2);
  }
  return 0;
});

// Enable virtuals in JSON
partSchema.set('toJSON', { virtuals: true });
partSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure at least one primary image
partSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

const Part = mongoose.model('Part', partSchema);

module.exports = Part;
