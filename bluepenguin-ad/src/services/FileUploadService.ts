import { api } from '../api/api';

export interface ImageDetail {
    imageId: string;
    skuId: string;
    isPrimary: boolean;
    url?: string;
}

export class FileUploadService {
    static async getAllImagesForSku(skuId: string): Promise<string[]> {
        try {
            const response = await api.get<string[]>(`/api/FileUpload/getAllImagesForSkuId`, {
                params: { skuId }
            });
            return response || [];
        } catch (error) {
            console.error(`Failed to fetch images for SKU ${skuId}:`, error);
            return [];
        }
    }

    static getImageUrl(skuId: string, imageId: string): string {
        const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7022/').replace(/\/$/, '');
        return `${baseUrl}/api/FileUpload/downloadByimageId?skuId=${skuId}&imageId=${imageId}`;
    }

    static async uploadImage(skuId: string, file: File, isPrimary: boolean = false): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('File', file);
            formData.append('SkuId', skuId);

            // Use fetch directly for FormData or update api.post to handle it
            // Based on api.ts, it uses JSON.stringify, so we need a workaround or update api.ts
            // Let's use fetch directly for now to be safe with multipart/form-data
            const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7022/').replace(/\/$/, '');
            const token = localStorage.getItem('auth_token');
            const url = `${baseUrl}/api/FileUpload/addproductimage?isPrimaryImage=${isPrimary}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            throw error;
        }
    }

    static async deleteImage(skuId: string, imageId: string): Promise<void> {
        try {
            await api.delete('/api/FileUpload/deleteproductimage', {
                params: { skuId, imageId }
            });
        } catch (error) {
            console.error(`Failed to delete image ${imageId} for SKU ${skuId}:`, error);
            throw error;
        }
    }
}
