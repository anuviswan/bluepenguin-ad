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
                productCount: item.productCount || 0,
                isActive: item.isActive ?? true
            }));

            // Fetch product counts dynamically since the getall API doesn't return them
            await Promise.allSettled(materials.map(async (material: Material) => {
                try {
                    const searchRes = await api.post<any>('/api/Product/search', {
                        selectedMaterials: [material.id]
                    }, { params: { page: '1', pageSize: '1' } });
                    material.productCount = searchRes?.totalCount || 0;
                } catch (e) {
                    console.warn(`Could not fetch count for material ${material.id}`);
                }
            }));

            return materials;
        } catch (error) {
            console.error('Failed to fetch materials:', error);
            throw error;
        }
    }
}
