import { api } from '../api/api';

export interface Collection {
    id: string;
    name: string;
    productCount: number;
    isActive: boolean;
}

export class CollectionService {
    static async getAll(): Promise<Collection[]> {
        try {
            const response = await api.get<any[]>('/api/Collection/getall');
            return response.map(item => ({
                id: item.collectionId || item.rowKey || item.id || Math.random().toString(),
                name: item.collectionName || item.title || item.name || 'Unknown Collection',
                productCount: item.productCount || 0,
                isActive: item.isActive ?? true,
            }));
        } catch (error) {
            console.error('Failed to fetch collections:', error);
            throw error;
        }
    }

    static async create(id: string, name: string): Promise<void> {
        await api.post('/api/Collection/create', {
            featureId: id, // Based on bp.webapi.json, it uses AddFeatureRequest schema
            featureName: name
        });
    }
}


