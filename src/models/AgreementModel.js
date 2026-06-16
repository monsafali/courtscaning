import mongoose from "mongoose";

const PartySchema = new mongoose.Schema({
  name: { type: String, required: true },
  cnic: { type: String, required: true },
  image: { type: String, default: "" },
});

const AgreementSchema = new mongoose.Schema(
  {
    firstParty: PartySchema,
    secondParty: PartySchema,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Agreement ||
  mongoose.model("Agreement", AgreementSchema);
