import mongoose from 'mongoose';

const UserNotificationSchema = new mongoose.Schema(
  {
    notice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notice',
      required: true,
      index: true
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true
    },
    channel: {
      type: String,
      enum: ['system', 'mail'],
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['SENT', 'FAILED'],
      default: 'SENT'
    },
    error: String,
    deliveredAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const UserNotification = mongoose.model(
  'UserNotification',
  UserNotificationSchema
);
