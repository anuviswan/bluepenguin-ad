import { api } from '../api/api';

export interface Product {
    sku: string;
    name: string;
    description?: string;
    productCare?: string[];
    specifications?: string[];
    price: number;
    category: string;
    material: string;
    featureCodes: string[];
    collectionCode: string;
    yearCode: number;
    sequenceCode: number;
    status: string;
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

            const products = items.map(item => ({
                sku: item.sku || item.skuId || 'N/A',
                name: item.productName || 'Unknown Product',
                description: item.description,
                productCare: item.productCare || [],
                specifications: item.specifications || [],
                price: item.price || 0,
                category: item.categoryCode || '-',
                material: item.material || '-',
                featureCodes: item.featureCodes || [],
                collectionCode: item.collectionCode || '-',
                yearCode: item.yearCode || 0,
                sequenceCode: item.sequenceCode || 0,
                status: 'Active' // Mapping everything to Active status
            }));

            return { products, totalCount };
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw error;
        }
    }

    static async create(product: Partial<Product>): Promise<void> {
        try {
            await api.post('/api/Product/create', {
                sku: product.sku,
                productName: product.name,
                description: product.description,
                productCareInstructions: product.productCare,
                specifications: product.specifications,
                price: product.price,
                categoryCode: product.category,
                material: product.material,
                featureCodes: product.featureCodes,
                collectionCode: product.collectionCode,
                yearCode: product.yearCode,
                sequenceCode: product.sequenceCode,
                isActive: product.status === 'Active'
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

            return {
                sku: item.sku || item.skuId || 'N/A',
                name: item.productName || 'Unknown Product',
                description: item.productDescription,
                productCare: item.productCareInstructions || item.productCare || [],
                specifications: item.specifications || [],
                price: item.price || 0,
                category: item.categoryCode || '-',
                material: item.material || '-',
                featureCodes: item.featureCodes || [],
                collectionCode: item.collectionCode || '-',
                yearCode: item.yearCode || 0,
                sequenceCode: item.sequenceCode || 0,
                status: item.isActive === false ? 'Draft' : 'Active'
            };
        } catch (error) {
            console.error(`Failed to fetch product with SKU ${sku}:`, error);
            throw error;
        }
    }
}
