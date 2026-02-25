import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CategoryService, type Category } from '../services/CategoryService';
import { FeaturedCategoryService, type FeaturedCategory } from '../services/FeaturedCategoryService';

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([]);
    const featuredCategories = ref<FeaturedCategory[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const featuredCategoryCodes = computed(() =>
        featuredCategories.value.map(fc => fc.code)
    );

    const fetchCategories = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const [cats, featured] = await Promise.all([
                CategoryService.getAll(),
                FeaturedCategoryService.getAll()
            ]);
            categories.value = cats;
            featuredCategories.value = featured;
        } catch (e: any) {
            error.value = e?.message || 'Failed to fetch categories';
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    };

    const isFeatured = (categoryId: string): boolean => {
        return featuredCategoryCodes.value.includes(categoryId);
    };

    const toggleFeatured = async (category: Category) => {
        const currentlyFeatured = isFeatured(category.id);
        error.value = null;

        if (!currentlyFeatured && featuredCategories.value.length >= 4) {
            const msg = 'Maximum of 4 featured categories allowed.';
            error.value = msg;
            throw new Error(msg);
        }

        try {
            if (currentlyFeatured) {
                await FeaturedCategoryService.delete(category.id);
                featuredCategories.value = featuredCategories.value.filter(fc => fc.code !== category.id);
            } else {
                await FeaturedCategoryService.create(category.id);
                featuredCategories.value.push({ code: category.id });
            }
        } catch (e: any) {
            error.value = e?.message || 'Failed to update featured status';
            console.error(e);
            throw e; // Re-throw to be handled by the component
        }
    };

    return {
        categories,
        featuredCategories,
        isLoading,
        error,
        featuredCategoryCodes,
        fetchCategories,
        isFeatured,
        toggleFeatured
    };
});
