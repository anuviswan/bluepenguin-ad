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
            const categories = response.map(item => ({
                id: item.rowKey || item.id || Math.random().toString(),
                name: item.title || item.name || 'Unknown Category',
                productCount: item.productCount || 0,
                isActive: item.isActive ?? true
            }));

            // Fetch product counts dynamically since the getall API doesn't return them
            await Promise.allSettled(categories.map(async (category: Category) => {
                try {
                    const searchRes = await api.post<any>('/api/Product/search', {
                        selectedCategories: [category.id]
                    }, { params: { page: '1', pageSize: '1' } });
                    category.productCount = searchRes?.totalCount || 0;
                } catch (e) {
                    console.warn(`Could not fetch count for category ${category.id}`);
                }
            }));

            return categories;
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            throw error;
        }
    }
}
