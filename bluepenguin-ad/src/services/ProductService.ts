import { api } from '../api/api';

export interface Product {
    sku: string;
    name: string;
    description?: string;
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
}
