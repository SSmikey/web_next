import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentSettings extends Document {
  bankName: string;
  accountName: string;
  accountNumber: string;
  qrCodeImage: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSettingsSchema: Schema = new Schema({
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
  },
  accountName: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    trim: true,
  },
  qrCodeImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Ensure there's only one payment settings document
PaymentSettingsSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Delete any existing payment settings
    await mongoose.model('PaymentSettings').deleteMany({});
  }
  next();
});

export default mongoose.models.PaymentSettings || mongoose.model<IPaymentSettings>('PaymentSettings', PaymentSettingsSchema);