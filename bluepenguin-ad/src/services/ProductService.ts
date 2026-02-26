import { api } from '../api/api';

export interface Product {
    sku?: string;
    name: string;
    description?: string;
    productCare?: string[];
    specifications?: string[];
    price: number;
    discountPrice?: number;
    discountExpiryDate?: string;
    category: string;
    material: string;
    featureCodes: string[];
    collectionCode: string;
    yearCode: number;
    sequenceCode: number;
    status: string;
    stock?: number;
    isArtisanFav?: boolean;
}

export class ProductService {
    static async getAll(page: number = 1, pageSize: number = 10): Promise<{ products: Product[], totalCount: number }> {
        try {
            console.log("Page size " + pageSize)
            const response = await api.get<{ items: any[], totalCount?: number } | any[]>('/api/Product/getall', {
                params: {
                    page: page.toString(),
                    pageSize: pageSize.toString()
                }
            });

            const items = Array.isArray(response) ? response : (response.items || []);
            const totalCount = Array.isArray(response) ? items.length : (response.totalCount || items.length);

            const products = items.map(item => {
                const skuVal = item.sku || item.skuId || 'N/A';
                const extractedSeq = skuVal.length >= 2 ? parseInt(skuVal.slice(-2)) : 0;

                return {
                    sku: skuVal,
                    name: item.productName || 'Unknown Product',
                    description: item.description,
                    productCare: item.productCare || [],
                    specifications: item.specifications || [],
                    price: item.price || 0,
                    discountPrice: item.discountPrice,
                    discountExpiryDate: item.discountExpiryDate,
                    category: item.categoryCode || '-',
                    material: item.materialCode || item.material || item.productMaterial || '-',
                    featureCodes: item.featureCodes || [],
                    collectionCode: item.collectionCode || '-',
                    yearCode: item.yearCode || 0,
                    sequenceCode: item.sequenceCode || extractedSeq,
                    status: (item.stock || 0) > 0 ? 'In Stock' : 'Out of Stock',
                    stock: item.stock || 0
                };
            });

            return { products, totalCount };
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw error;
        }
    }

    static async search(
        filters: { category?: string; material?: string; collection?: string; feature?: string },
        page: number = 1,
        pageSize: number = 10
    ): Promise<{ products: Product[], totalCount: number }> {
        try {
            const tempSearchParam: any = {};
            if (filters.category) tempSearchParam.selectedCategories = [filters.category];
            if (filters.material) tempSearchParam.selectedMaterials = [filters.material];
            if (filters.collection) tempSearchParam.selectedCollections = [filters.collection];
            if (filters.feature) tempSearchParam.selectedFeatures = [filters.feature];

            const response = await api.post<{ items: any[], totalCount?: number } | any>('/api/Product/search', tempSearchParam, {
                params: {
                    page: page.toString(),
                    pageSize: pageSize.toString()
                }
            });

            const items = Array.isArray(response) ? response : (response.items || []);
            const totalCount = Array.isArray(response) ? items.length : (response.totalCount || items.length);

            const products = items.map((item: any) => {
                const skuVal = item.sku || item.skuId || 'N/A';
                const extractedSeq = skuVal.length >= 2 ? parseInt(skuVal.slice(-2)) : 0;

                return {
                    sku: skuVal,
                    name: item.productName || 'Unknown Product',
                    description: item.description,
                    productCare: item.productCare || [],
                    specifications: item.specifications || [],
                    price: item.price || 0,
                    discountPrice: item.discountPrice,
                    discountExpiryDate: item.discountExpiryDate,
                    category: item.categoryCode || '-',
                    material: item.materialCode || item.material || item.productMaterial || '-',
                    featureCodes: item.featureCodes || [],
                    collectionCode: item.collectionCode || '-',
                    yearCode: item.yearCode || 0,
                    sequenceCode: item.sequenceCode || extractedSeq,
                    status: (item.stock || 0) > 0 ? 'In Stock' : 'Out of Stock',
                    stock: item.stock || 0
                };
            });

            return { products, totalCount };
        } catch (error) {
            console.error('Failed to search products:', error);
            throw error;
        }
    }

    static async create(product: Partial<Product>): Promise<any> {
        try {
            return await api.post<any>('/api/Product/create', {
                productName: product.name,
                description: product.description,
                productCareInstructions: product.productCare,
                specifications: product.specifications,
                price: product.price,
                discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
                discountExpiryDate: product.discountExpiryDate ? product.discountExpiryDate : null,
                categoryCode: product.category,
                material: product.material,
                featureCodes: product.featureCodes,
                collectionCode: product.collectionCode,
                yearCode: product.yearCode,
                sequenceCode: product.sequenceCode,
                stock: product.stock || 0
            }, {
                params: product.sku ? { skuId: product.sku } : {}
            });
        } catch (error) {
            console.error('Failed to create product:', error);
            throw error;
        }
    }

    static async getBySku(sku: string): Promise<Product> {
        try {
            const item = await api.get<any>('/api/Product/getbysku', {
                params: { sku }
            });

            console.log(`ProductService: Raw item for SKU ${sku}:`, item);

            if (!item) throw new Error('Product not found');

            const skuVal = item.sku || item.skuId || 'N/A';
            const extractedSeq = skuVal.length >= 2 ? parseInt(skuVal.slice(-2)) : 0;

            return {
                sku: skuVal,
                name: item.productName || 'Unknown Product',
                description: item.productDescription || item.description,
                productCare: item.productCareInstructions || item.productCare || [],
                specifications: item.specifications || [],
                price: item.price || 0,
                discountPrice: item.discountPrice,
                discountExpiryDate: item.discountExpiryDate,
                category: item.categoryCode || item.category || '-',
                material: item.materialCode || item.material || item.productMaterial || '-',
                featureCodes: item.featureCodes || [],
                collectionCode: item.collectionCode || item.collection || '-',
                yearCode: item.yearCode || 0,
                sequenceCode: item.sequenceCode || extractedSeq,
                status: (item.stock || 0) > 0 ? 'In Stock' : 'Out of Stock',
                stock: item.stock || 0
            };
        } catch (error) {
            console.error(`Failed to fetch product with SKU ${sku}:`, error);
            throw error;
        }
    }

    static async update(product: Partial<Product>): Promise<void> {
        try {
            await api.put('/api/Product/update', {
                sku: product.sku,
                productName: product.name,
                description: product.description,
                specifications: product.specifications,
                productCareInstructions: product.productCare,
                price: product.price,
                discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
                discountExpiryDate: product.discountExpiryDate ? product.discountExpiryDate : null,
                stock: product.stock,
            });
        } catch (error) {
            console.error(`Failed to update product with SKU ${product.sku}:`, error);
            throw error;
        }
    }

    static async delete(sku: string): Promise<void> {
        try {
            await api.delete(`/api/Product/delete/${sku}`);
        } catch (error) {
            console.error(`Failed to delete product with SKU ${sku}:`, error);
            throw error;
        }
    }
}
