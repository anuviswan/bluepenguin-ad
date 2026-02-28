import { api } from '../api/api';

export interface Material {
    id: string;
    name: string;
    productCount: number;
    isActive: boolean;
}

export class MaterialService {
    static async getAll(): Promise<Material[]> {
        try {
            const response = await api.get<any[]>('/api/Material/getall');
            const materials = response.map(item => ({
                id: item.rowKey || item.id || Math.random().toString(),
                name: item.title || item.name || 'Unknown Material',
                productCount: item.itemCount || item.productCount || 0,
                isActive: item.isActive ?? true
            }));

            return materials;
        } catch (error) {
            console.error('Failed to fetch materials:', error);
            throw error;
        }
    }
}
