import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
    phoneNumber?: string | null;
    email?: string | null;
    linkedId?: mongoose.Types.ObjectId | null;
    linkPrecedence: 'primary' | 'secondary';
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

const ContactSchema: Schema = new Schema(
    {
        phoneNumber: { type: String, default: null },
        email: { type: String, default: null },
        linkedId: { type: Schema.Types.ObjectId, ref: 'Contact', default: null },
        linkPrecedence: {
            type: String,
            enum: ['primary', 'secondary'],
            required: true,
            default: 'primary',
        },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
