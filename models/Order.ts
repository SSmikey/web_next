import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  productName: string;
  productDescription: string;
  price: number;
  quantity: number;
  size: string;
  imageUrl?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    note?: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  shippingCost: number;
  shippingMethod: 'mail' | 'pickup';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderNumber: {
    type: String,
    required: [true, 'Order number is required'],
    unique: true,
  },
  userId: {
    type: String,
    ref: 'User',
  },
  customerInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  items: [{
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: 0,
  },
  shippingCost: {
    type: Number,
    required: [true, 'Shipping cost is required'],
    min: 0,
  },
  shippingMethod: {
    type: String,
    enum: ['mail', 'pickup'],
    required: [true, 'Shipping method is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Generate order number before saving
OrderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${year}-${random}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);