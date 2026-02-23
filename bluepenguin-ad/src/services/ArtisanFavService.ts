import { api } from '../api/api';

export interface ArtisanFav {
    sku: string;
}

export class ArtisanFavService {
    static async getAll(): Promise<ArtisanFav[]> {
        try {
            const response = await api.get<any>('/api/ArtisanFav/getall');
            const items = Array.isArray(response) ? response : (response.items || []);
            return items.map((item: any) => {
                if (typeof item === 'string') {
                    return { sku: item };
                }
                return { sku: item.sku || item.skuId || item.id || '' };
            }).filter((f: ArtisanFav) => f.sku);
        } catch (error) {
            console.error('Failed to fetch Artisan Favs:', error);
            throw error;
        }
    }

    static async create(sku: string): Promise<void> {
        try {
            await api.post('/api/ArtisanFav/create', { sku });
        } catch (error) {
            console.error(`Failed to create Artisan Fav for sku ${sku}:`, error);
            throw error;
        }
    }

    static async delete(sku: string): Promise<void> {
        try {
            await api.delete(`/api/ArtisanFav/delete/${sku}`);
        } catch (error) {
            console.error(`Failed to delete Artisan Fav for sku ${sku}:`, error);
            throw error;
        }
    }
}
