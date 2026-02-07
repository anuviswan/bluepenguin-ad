import { api } from '../api/api';

export interface Material {
    id: string;
    name: string;
}

export class MaterialService {
    static async getAll(): Promise<Material[]> {
        try {
            const response = await api.get<any[]>('/api/Material/getall');
            return response.map(item => ({
                id: item.rowKey || item.id || Math.random().toString(),
                name: item.title || item.name || 'Unknown Material'
            }));
        } catch (error) {
            console.error('Failed to fetch materials:', error);
            throw error;
        }
    }
}
