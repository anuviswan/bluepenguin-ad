import { api } from '../api/api';

export interface Category {
    id: string;
    name: string;
    productCount: number;
    isActive: boolean;
}

export class CategoryService {
    static async getAll(): Promise<Category[]> {
        try {
            const response = await api.get<any[]>('/api/Category/getall');
            return response.map(item => ({
                id: item.rowKey || item.id || Math.random().toString(),
                name: item.title || item.name || 'Unknown Category',
                productCount: item.productCount || 0,
                isActive: item.isActive ?? true
            }));
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            throw error;
        }
    }
}
