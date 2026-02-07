import { api } from '../api/api';

export interface Collection {
    id: string;
    name: string;
}

export class CollectionService {
    static async getAll(): Promise<Collection[]> {
        try {
            const response = await api.get<any[]>('/api/Collection/getall');
            return response.map(item => ({
                id: item.rowKey || item.id || Math.random().toString(),
                name: item.title || item.name || 'Unknown Collection'
            }));
        } catch (error) {
            console.error('Failed to fetch collections:', error);
            throw error;
        }
    }
}
