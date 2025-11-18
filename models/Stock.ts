import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  type: string; // 'ปกติ', 'ขาวดำ', 'พิเศษ'
  sizes: {
    SSS: number;
    SS: number;
    S: number;
    M: number;
    L: number;
    XL: number;
    '2XL': number;
    '3XL': number;
    '4XL': number;
    '5XL': number;
    '6XL': number;
    '7XL': number;
    '8XL': number;
    '9XL': number;
    '10XL': number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StockSchema: Schema = new Schema({
  type: {
    type: String,
    required: [true, 'Stock type is required'],
    enum: ['ปกติ', 'ขาวดำ', 'พิเศษ'],
    unique: true,
  },
  sizes: {
    SSS: { type: Number, default: 0, min: 0 },
    SS: { type: Number, default: 0, min: 0 },
    S: { type: Number, default: 0, min: 0 },
    M: { type: Number, default: 0, min: 0 },
    L: { type: Number, default: 0, min: 0 },
    XL: { type: Number, default: 0, min: 0 },
    '2XL': { type: Number, default: 0, min: 0 },
    '3XL': { type: Number, default: 0, min: 0 },
    '4XL': { type: Number, default: 0, min: 0 },
    '5XL': { type: Number, default: 0, min: 0 },
    '6XL': { type: Number, default: 0, min: 0 },
    '7XL': { type: Number, default: 0, min: 0 },
    '8XL': { type: Number, default: 0, min: 0 },
    '9XL': { type: Number, default: 0, min: 0 },
    '10XL': { type: Number, default: 0, min: 0 },
  },
}, {
  timestamps: true,
});

export default mongoose.models.Stock || mongoose.model<IStock>('Stock', StockSchema);