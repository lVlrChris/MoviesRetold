const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sliceSchema = new Schema({
    claimant: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    startTime: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
});

sliceSchema.virtual('endTime').get(function() {
    return this.startTime + this.duration;
});

sliceSchema.set('toObject', { virtuals: true });
sliceSchema.set('toJSON', { virtuals: true });

module.exports = sliceSchema;
