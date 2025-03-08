import { Schema, Document, Types } from 'mongoose';

export interface IBalance extends Document {
  user: Types.ObjectId;
  tokenCredits: number;
  lastTokenClaim?: Date;
}

const balanceSchema = new Schema<IBalance>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  // 1000 tokenCredits = 1 mill ($0.001 USD)
  tokenCredits: {
    type: Number,
    default: 0,
  },
  // Timestamp of the last token claim for cooldown tracking
  lastTokenClaim: {
    type: Date,
    default: null,
  },
});

export default balanceSchema;
