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
            const collections = response.map(item => ({
                id: item.collectionId || item.rowKey || item.id || Math.random().toString(),
                name: item.collectionName || item.title || item.name || 'Unknown Collection',
                productCount: item.productCount || 0,
                isActive: item.isActive ?? true,
            }));

            // Fetch product counts dynamically since the getall API doesn't return them
            await Promise.allSettled(collections.map(async (collection: Collection) => {
                try {
                    const searchRes = await api.post<any>('/api/Product/search', {
                        selectedCollections: [collection.id]
                    }, { params: { page: '1', pageSize: '1' } });
                    collection.productCount = searchRes?.totalCount || 0;
                } catch (e) {
                    console.warn(`Could not fetch count for collection ${collection.id}`);
                }
            }));

            return collections;
        } catch (error) {
            console.error('Failed to fetch collections:', error);
            throw error;
        }
    }

    static async create(id: string, name: string): Promise<void> {
        await api.post('/api/Collection/create', {
            collectionId: id,
            collectionName: name
        });
    }

    static async getById(id: string): Promise<Collection | null> {
        try {
            const collections = await this.getAll();
            return collections.find(c => c.id === id) || null;
        } catch (error) {
            console.error(`Failed to fetch collection with ID ${id}:`, error);
            throw error;
        }
    }

    static async update(id: string, name: string): Promise<void> {
        try {
            await api.put('/api/Collection/update', {
                collectionId: id,
                collectionName: name
            });
        } catch (error) {
            console.error(`Failed to update collection with ID ${id}:`, error);
            throw error;
        }
    }
}


