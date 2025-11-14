import connectDB from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import PPVProduct from '@/models/ProductPPV';
import DigiProduct from '@/models/ProductDigi';

function getModel(company?: string) {
  const c = (company || '').toLowerCase();
  if (c === 'ppv') return PPVProduct;
  if (c === 'digiworldadda' || c === 'digi' || c === 'digiproducts') return DigiProduct;
  return Product;
}

export class ProductController {
  // Get all products with filtering, sorting, and pagination
  static async getAllProducts(options: {
    page?: number;
    limit?: number;
    category?: string;
    isFeatured?: boolean;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    company?: string;
  } = {}) {
    await connectDB();

    const {
      page = 1,
      limit = 12,
      category,
      isFeatured,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      company
    } = options;

    const skip = (page - 1) * limit;

    // Build filter query
    const filter: any = {};
    
    // Only add status filter if status is provided (undefined means fetch all)
    // If status is explicitly undefined, don't filter by status
    if (status !== undefined) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort query
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const Model = getModel(company);

    const [products, total] = await Promise.all([
      Model.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Model.countDocuments(filter)
    ]);

    return {
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get product by ID
  static async getProductById(id: string, company?: string) {
    await connectDB();

    const Model = getModel(company);
    const product = await Model.findById(id).lean();

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    return {
      success: true,
      data: product
    };
  }

  // Get product by slug
  static async getProductBySlug(slug: string, company?: string) {
    await connectDB();

    const Model = getModel(company);
    const product = await Model.findOne({ slug }).lean();

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    console.log('📦 getProductBySlug - Fetching product:', slug);
    console.log('🎯 getProductBySlug - Promotional header in DB:', product.promotionalHeader);

    return {
      success: true,
      data: product
    };
  }

  // Create new product
  static async createProduct(productData: Partial<IProduct>, company?: string) {
    await connectDB();

    console.log('🆕 CREATE PRODUCT - Received data:', JSON.stringify(productData, null, 2));
    console.log('🆕 Promotional Header in create:', productData.promotionalHeader);
    console.log('✨ Product Benefits in create:', productData.productBenefits);
    console.log('🔗 Download Link in create:', productData.downloadLink);

    // Generate slug if not provided
    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Ensure unique slug
      const ModelCheck = getModel(company || (productData as any)?.company);
      const existingProduct = await ModelCheck.findOne({ slug: productData.slug });
      if (existingProduct) {
        productData.slug = `${productData.slug}-${Date.now()}`;
      }
    }

    // Ensure promotionalHeader is properly set
    if (productData.promotionalHeader) {
      console.log('🔥 Setting promotional header on new product');
      productData.promotionalHeader = {
        enabled: productData.promotionalHeader.enabled || false,
        topBannerText: productData.promotionalHeader.topBannerText || '',
        topBannerSubtext: productData.promotionalHeader.topBannerSubtext || '',
        buttonText: productData.promotionalHeader.buttonText || '',
        buttonPrice: productData.promotionalHeader.buttonPrice || '',
        buttonSubtext: productData.promotionalHeader.buttonSubtext || '',
        headlinePart1: productData.promotionalHeader.headlinePart1 || '',
        headlinePart2: productData.promotionalHeader.headlinePart2 || '',
        subHeading: productData.promotionalHeader.subHeading || '',
        platformText: productData.promotionalHeader.platformText || '',
        highlightText: productData.promotionalHeader.highlightText || '',
        timerEndDate: productData.promotionalHeader.timerEndDate
      };
    }

    // Ensure productBenefits is properly set
    if (productData.productBenefits) {
      console.log('✨ Setting product benefits on new product');
      productData.productBenefits = {
        enabled: productData.productBenefits.enabled || false,
        mainTitle: productData.productBenefits.mainTitle || '',
        subtitle: productData.productBenefits.subtitle || '',
        benefits: productData.productBenefits.benefits || []
      };
    }

    const Model = getModel(company || (productData as any)?.company);
    const product = new Model(productData);
    await product.save();

    console.log('🆕 Product created and saved');
    console.log('🆕 Promotional header in saved product:', product.promotionalHeader);
    console.log('✨ Product benefits in saved product:', product.productBenefits);

    return {
      success: true,
      data: product,
      message: 'Product created successfully'
    };
  }

  // Update product
  static async updateProduct(id: string, updateData: Partial<IProduct>, company?: string) {
    await connectDB();

    console.log('ProductController - Received update data:', JSON.stringify(updateData, null, 2));
    console.log('ProductController - Promotion data:', updateData.promotion);
    console.log('ProductController - Promotional Header data:', updateData.promotionalHeader);
    console.log('🔗 ProductController - Download Link data:', updateData.downloadLink);

    // If name is updated, regenerate slug
    if (updateData.name) {
      const newSlug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Check if slug already exists (excluding current product)
      const ModelForSlug = getModel(company || (updateData as any)?.company);
      const existingProduct = await ModelForSlug.findOne({ 
        slug: newSlug,
        _id: { $ne: id }
      });
      
      if (existingProduct) {
        updateData.slug = `${newSlug}-${Date.now()}`;
      } else {
        updateData.slug = newSlug;
      }
    }

    // Fetch the product first
    const Model = getModel(company || (updateData as any)?.company);
    const product = await Model.findById(id);

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    // Update regular fields
    if (updateData.name) product.name = updateData.name;
    if (updateData.description) product.description = updateData.description;
    if (updateData.price !== undefined) product.price = updateData.price;
    if (updateData.originalPrice !== undefined) product.originalPrice = updateData.originalPrice;
    if (updateData.category) product.category = updateData.category;
    if (updateData.status) product.status = updateData.status;
    if (updateData.stock !== undefined) product.stock = updateData.stock;
    if (updateData.isFeatured !== undefined) product.isFeatured = updateData.isFeatured;
    if (updateData.tags) product.tags = updateData.tags;
    if (updateData.downloadLink !== undefined) {
      product.downloadLink = updateData.downloadLink;
      console.log('🔗 Download link updated to:', product.downloadLink);
    }
    if (updateData.media) product.media = updateData.media;
    if (updateData.features) product.features = updateData.features;
    if (updateData.slug) product.slug = updateData.slug;
    
    // Update promotion
    if (updateData.promotion) {
      console.log('💰 UPDATING PROMOTION');
      product.promotion = {
        enabled: updateData.promotion.enabled || false,
        discountPercentage: updateData.promotion.discountPercentage || 0,
        timerDuration: updateData.promotion.timerDuration || 24,
        timerEndDate: updateData.promotion.timerEndDate
      };
      product.markModified('promotion');
      console.log('💰 Promotion SET:', product.promotion);
    }
    
    // Update promotionalHeader - EXACT SAME PATTERN AS PROMOTION
    if (updateData.promotionalHeader) {
      console.log('🔥 UPDATING PROMOTIONAL HEADER');
      console.log('🔥 Data received:', updateData.promotionalHeader);
      
      product.promotionalHeader = {
        enabled: updateData.promotionalHeader.enabled || false,
        topBannerText: updateData.promotionalHeader.topBannerText || '',
        topBannerSubtext: updateData.promotionalHeader.topBannerSubtext || '',
        buttonText: updateData.promotionalHeader.buttonText || '',
        buttonPrice: updateData.promotionalHeader.buttonPrice || '',
        buttonSubtext: updateData.promotionalHeader.buttonSubtext || '',
        headlinePart1: updateData.promotionalHeader.headlinePart1 || '',
        headlinePart2: updateData.promotionalHeader.headlinePart2 || '',
        subHeading: updateData.promotionalHeader.subHeading || '',
        platformText: updateData.promotionalHeader.platformText || '',
        highlightText: updateData.promotionalHeader.highlightText || '',
        timerEndDate: updateData.promotionalHeader.timerEndDate
      };
      
      product.markModified('promotionalHeader');
      console.log('🔥 Promotional header SET on product:', product.promotionalHeader);
    }

    // Update productBenefits - EXACT SAME PATTERN AS PROMOTION
    if (updateData.productBenefits) {
      console.log('✨ UPDATING PRODUCT BENEFITS');
      console.log('✨ Data received:', updateData.productBenefits);
      
      product.productBenefits = {
        enabled: updateData.productBenefits.enabled || false,
        mainTitle: updateData.productBenefits.mainTitle || '',
        subtitle: updateData.productBenefits.subtitle || '',
        benefits: updateData.productBenefits.benefits || []
      };
      
      product.markModified('productBenefits');
      console.log('✨ Product benefits SET on product:', product.productBenefits);
    }

    // Save the product
    await product.save();
    
    console.log('🔥 Product SAVED. Re-fetching from DB...');
    
    // Fetch fresh from database to verify
    const savedProduct = await Model.findById(id).lean();
    
    console.log('🔥 Fresh from DB - Promotional header:', savedProduct?.promotionalHeader);

    console.log('ProductController - Product after save:', JSON.stringify(product, null, 2));
    console.log('ProductController - Saved promotion:', product.promotion);
    console.log('🎯 ProductController - Saved promotional header:', product.promotionalHeader);

    return {
      success: true,
      data: product,
      message: 'Product updated successfully'
    };
  }

  // Delete product
  static async deleteProduct(id: string, company?: string) {
    await connectDB();

    const Model = getModel(company);
    const product = await Model.findByIdAndDelete(id);

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    return {
      success: true,
      message: 'Product deleted successfully'
    };
  }

  // Toggle featured status
  static async toggleFeatured(id: string, company?: string) {
    await connectDB();

    const Model = getModel(company);
    const product = await Model.findById(id);

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    return {
      success: true,
      data: product,
      message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully`
    };
  }

  // Update stock
  static async updateStock(id: string, quantity: number, company?: string) {
    await connectDB();

    const Model = getModel(company);
    const product = await Model.findById(id);

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    product.stock = quantity;
    if (quantity === 0) {
      product.status = 'out_of_stock';
    } else if (product.status === 'out_of_stock') {
      product.status = 'active';
    }
    
    await product.save();

    return {
      success: true,
      data: product,
      message: 'Stock updated successfully'
    };
  }

  // Increment sales
  static async incrementSales(id: string, company?: string) {
    await connectDB();

    const Model = getModel(company);
    const product = await Model.findByIdAndUpdate(
      id,
      { $inc: { sales: 1, stock: -1 } },
      { new: true }
    );

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    return {
      success: true,
      data: product
    };
  }

  // Get product statistics
  static async getProductStats(company?: string) {
    await connectDB();

    const Model = getModel(company);
    const [
      totalProducts,
      activeProducts,
      featuredProducts,
      outOfStock,
      totalSales,
      categories
    ] = await Promise.all([
      Model.countDocuments(),
      Model.countDocuments({ status: 'active' }),
      Model.countDocuments({ isFeatured: true }),
      Model.countDocuments({ status: 'out_of_stock' }),
      Model.aggregate([
        { $group: { _id: null, total: { $sum: '$sales' } } }
      ]),
      Model.distinct('category')
    ]);

    return {
      success: true,
      data: {
        totalProducts,
        activeProducts,
        featuredProducts,
        outOfStock,
        totalSales: totalSales[0]?.total || 0,
        categories: categories.length
      }
    };
  }

  // Get related products
  static async getRelatedProducts(productId: string, limit: number = 4, company?: string) {
    await connectDB();

    const Model = getModel(company);
    const product = await Model.findById(productId);

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    const relatedProducts = await Model.find({
      _id: { $ne: productId },
      category: product.category,
      status: 'active'
    })
      .limit(limit)
      .lean();

    return {
      success: true,
      data: relatedProducts
    };
  }
}
