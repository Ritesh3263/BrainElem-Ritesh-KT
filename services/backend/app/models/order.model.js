const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    value: Number,
    currencyCode: '',
    certificationSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "CertificationSession"}],
    results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result"}],
    status: { type: String, default: 'UNCONFIRMED' },
    client: mongoose.Schema.Types.Mixed,
    invoice: mongoose.Schema.Types.Mixed,
    // OrderId from Paypal
    providerId: {type: String},
    providerItems: [{ type: mongoose.Schema.Types.Mixed}]
  },
  { timestamps: true }
);

OrderSchema.pre('remove', function (next) {
  console.log("Removing Order:", this._id)
  next()
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;