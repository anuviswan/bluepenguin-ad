import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CategoryService, type Category } from '../services/CategoryService';
import { FeaturedCategoryService } from '../services/FeaturedCategoryService';

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const featuredCategoryCodes = computed(() =>
        categories.value.filter(c => c.isFeatured).map(c => c.id)
    );

    const fetchCategories = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const cats = await CategoryService.getAll();
            categories.value = cats;
        } catch (e: any) {
            error.value = e?.message || 'Failed to fetch categories';
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    };

    const isFeatured = (categoryId: string): boolean => {
        const cat = categories.value.find(c => c.id === categoryId);
        return cat ? cat.isFeatured : false;
    };

    const toggleFeatured = async (category: Category) => {
        const currentlyFeatured = category.isFeatured;
        error.value = null;

        if (!currentlyFeatured && featuredCategoryCodes.value.length >= 4) {
            const msg = 'Maximum of 4 featured categories allowed.';
            error.value = msg;
            throw new Error(msg);
        }

        try {
            if (currentlyFeatured) {
                await FeaturedCategoryService.delete(category.id);
            } else {
                await FeaturedCategoryService.create(category.id);
            }

            // Update local state
            const index = categories.value.findIndex(c => c.id === category.id);
            if (index !== -1) {
                const categoryToUpdate = categories.value[index];
                if (categoryToUpdate) {
                    categoryToUpdate.isFeatured = !currentlyFeatured;
                }
            }
        } catch (e: any) {
            error.value = e?.message || 'Failed to update featured status';
            console.error(e);
            throw e;
        }
    };

    return {
        categories,
        isLoading,
        error,
        featuredCategoryCodes,
        fetchCategories,
        isFeatured,
        toggleFeatured
    };
});
