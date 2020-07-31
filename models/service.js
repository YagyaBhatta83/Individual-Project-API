const {mongoose}=require('./../config');

const serviceSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      }
    },
      { timestamps: true }
      );
      module.exports = mongoose.model("Service", serviceSchema);
