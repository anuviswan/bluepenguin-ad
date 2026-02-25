import { api } from '../api/api';

export interface FeaturedCategory {
    code: string;
}

export class FeaturedCategoryService {
    static async getAll(): Promise<FeaturedCategory[]> {
        try {
            const response = await api.get<any>('/api/FeaturedCategory/getall');
            const items = Array.isArray(response) ? response : (response.items || []);
            return items.map((item: any) => {
                if (typeof item === 'string') {
                    return { code: item };
                }
                return { code: item.code || item.id || '' };
            }).filter((fc: FeaturedCategory) => fc.code);
        } catch (error) {
            console.error('Failed to fetch Featured Categories:', error);
            throw error;
        }
    }

    static async create(code: string): Promise<void> {
        try {
            await api.post('/api/FeaturedCategory/create', { code });
        } catch (error) {
            console.error(`Failed to create Featured Category for code ${code}:`, error);
            throw error;
        }
    }

    static async delete(code: string): Promise<void> {
        try {
            await api.delete(`/api/FeaturedCategory/delete/${code}`);
        } catch (error) {
            console.error(`Failed to delete Featured Category for code ${code}:`, error);
            throw error;
        }
    }
}
