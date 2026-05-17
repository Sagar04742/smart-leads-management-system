import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadDocument extends Document {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: { type: String, required: [true, 'Name required'], trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: [true, 'Email required'], lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost'], default: 'New' },
    source: { type: String, enum: ['Website', 'Instagram', 'Referral'], required: [true, 'Source required'] },
    notes: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

LeadSchema.index({ name: 'text', email: 'text' });
LeadSchema.index({ status: 1, source: 1, createdAt: -1 });

export const Lead = mongoose.model<ILeadDocument>('Lead', LeadSchema);
