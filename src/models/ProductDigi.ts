import mongoose, { Model } from 'mongoose';
import { ProductSchema, IProduct } from './Product';

// Use a distinct model name and collection name for Digiworldadda products
const modelName = 'DigiProduct';
const collectionName = 'digiproducts';

const DigiProduct: Model<IProduct> =
  (mongoose.models[modelName] as Model<IProduct>) ||
  mongoose.model<IProduct>(modelName, ProductSchema, collectionName);

export default DigiProduct;
