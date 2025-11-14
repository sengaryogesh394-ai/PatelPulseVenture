import mongoose, { Model } from 'mongoose';
import { ProductSchema, IProduct } from './Product';

// Use a distinct model name and collection name for PPV products
const modelName = 'PPVProduct';
const collectionName = 'ppvproducts';

const PPVProduct: Model<IProduct> =
  (mongoose.models[modelName] as Model<IProduct>) ||
  mongoose.model<IProduct>(modelName, ProductSchema, collectionName);

export default PPVProduct;
