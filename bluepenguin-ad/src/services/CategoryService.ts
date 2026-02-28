import { api } from '../api/api';

export interface Category {
    id: string;
    name: string;
    productCount: number;
    isActive: boolean;
    isFeatured: boolean;
}

export class CategoryService {
    static async getAll(): Promise<Category[]> {
        try {
            const response = await api.get<any[]>('/api/Category/getall');
            const categories = response.map(item => ({
                id: item.rowKey || item.id || Math.random().toString(),
                name: item.title || item.name || 'Unknown Category',
                productCount: item.productCount || item.itemCount || 0,
                isActive: item.isActive ?? true,
                isFeatured: item.isFeatured ?? false
            }));

            return categories;
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            throw error;
        }
    }
}
