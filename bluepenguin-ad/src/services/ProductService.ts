import { api } from '../api/api';

export interface Product {
    sku: string;
    name: string;
    description?: string;
    productCare?: string;
    specifications?: string;
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
    static async getAll(): Promise<Product[]> {
        try {
            const response = await api.get<any[]>('/api/Product/getall');
            return response.map(item => ({
                sku: item.sku || item.skuId || 'N/A',
                name: item.productName || 'Unknown Product',
                description: item.description,
                productCare: item.productCare,
                specifications: item.specifications,
                price: item.price || 0,
                category: item.categoryCode || '-',
                material: item.material || '-',
                featureCodes: item.featureCodes || [],
                collectionCode: item.collectionCode || '-',
                yearCode: item.yearCode || 0,
                sequenceCode: item.sequenceCode || 0,
                status: 'Live' // Defaulting to Live as API schema doesn't seem to have status yet
            }));
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
                productCare: product.productCare,
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
}
