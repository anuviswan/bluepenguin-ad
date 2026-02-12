import { api } from '../api/api';

export interface Feature {
    id: string;
    name: string;
    symbolicText?: string;
    productCount: number;
    isActive: boolean;
}

// Based on bp.webapi.json schemas
export interface MetaDataEntity {
    partitionKey?: string | null;
    rowKey?: string | null;
    title?: string | null;
    timestamp?: string | null;
}

export class FeatureService {
    /**
     * Retrieves all features from the API.
     * Maps the API response to the Feature interface used by the UI.
     */
    static async getAll(): Promise<Feature[]> {
        try {
            // The user specified /api/Feature/getall
            // Looking at bp.webapi.json, /api/Feature/getall exists
            const response = await api.get<any[]>('/api/Feature/getall');

            // We need to map the API response to our UI Feature model.
            // Usually these "getall" endpoints return an array of items.
            // Based on bp.webapi.json MetaDataEntity and AddFeatureRequest:
            // it might have properties like 'featureName', 'featureId' or 'rowKey', 'title'.

            return response.map((item: any) => ({
                id: item.featureId || item.rowKey || item.id || Math.random().toString(),
                name: item.featureName || item.title || item.name || 'Unknown Feature',
                symbolicText: item.symbolic || item.symbolicText,
                productCount: item.productCount || 0,
                isActive: item.isActive ?? true,
            }));
        } catch (error) {
            console.error('Failed to fetch features:', error);
            throw error;
        }
    }

    static async create(id: string, name: string, symbolicText?: string): Promise<void> {
        // /api/Feature/create exists in bp.webapi.json
        await api.post('/api/Feature/create', {
            featureId: id,
            featureName: name,
            symbolic: symbolicText
        });
    }

    static async getById(id: string): Promise<Feature | null> {
        try {
            const features = await this.getAll();
            return features.find(f => f.id === id) || null;
        } catch (error) {
            console.error(`Failed to fetch feature with ID ${id}:`, error);
            throw error;
        }
    }

    static async update(id: string, name: string, symbolicText?: string): Promise<void> {
        try {
            await api.put('/api/Feature/update', {
                featureId: id,
                featureName: name,
                symbolic: symbolicText
            });
        } catch (error) {
            console.error(`Failed to update feature with ID ${id}:`, error);
            throw error;
        }
    }
}
