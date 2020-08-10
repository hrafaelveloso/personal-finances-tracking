import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

const isObjectId = (value: any): boolean => {
  try {
    const asString = value.toString(); // value is either ObjectId or string or anything
    const asObjectId = new ObjectId(asString);
    const asStringifiedObjectId = asObjectId.toString();
    return asString === asStringifiedObjectId;
  } catch (error) {
    return false;
  }
};

export default isObjectId;
