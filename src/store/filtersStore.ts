// src/store/filtersStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Filters, Pagination, Sort } from './types';

interface FiltersStore {
  filters: Filters;
  sort: Sort;
  pagination: Pagination;
  searchQuery: string;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  setSort: (sort: Sort) => void;
  toggleSort: (field: keyof FiltersStore['sort']['field']) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setSearchQuery: (query: string) => void;
  resetAll: () => void;
}

const initialFilters: Filters = {
  status: [],
  priority: [],
  assignee: [],
  search: '',
  tags: [],
  dateRange: undefined,
};

const initialSort: Sort = {
  field: 'createdAt',
  order: 'desc',
};

const initialPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export const useFiltersStore = create<FiltersStore>()(
  persist(
    immer((set, get) => ({
      filters: initialFilters,
      sort: initialSort,
      pagination: initialPagination,
      searchQuery: '',

      setFilters: (newFilters) => {
        set((state) => {
          state.filters = { ...state.filters, ...newFilters };
          state.pagination.page = 1; // Сбрасываем страницу при изменении фильтров
        });
      },

      resetFilters: () => {
        set((state) => {
          state.filters = initialFilters;
          state.pagination.page = 1;
        });
      },

      setSort: (newSort) => {
        set({ sort: newSort });
      },

      toggleSort: (field) => {
        set((state) => {
          if (state.sort.field === field) {
            state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
          } else {
            state.sort.field = field;
            state.sort.order = 'asc';
          }
        });
      },

      setPage: (page) => {
        set((state) => {
          state.pagination.page = Math.max(1, Math.min(page, state.pagination.totalPages));
        });
      },

      setLimit: (limit) => {
        set((state) => {
          state.pagination.limit = limit;
          state.pagination.page = 1;
        });
      },

      nextPage: () => {
        const { page, totalPages } = get().pagination;
        if (page < totalPages) {
          set((state) => {
            state.pagination.page = page + 1;
          });
        }
      },

      prevPage: () => {
        const { page } = get().pagination;
        if (page > 1) {
          set((state) => {
            state.pagination.page = page - 1;
          });
        }
      },

      setSearchQuery: (query) => {
        set((state) => {
          state.searchQuery = query;
          state.pagination.page = 1;
        });
      },

      resetAll: () => {
        set({
          filters: initialFilters,
          sort: initialSort,
          pagination: initialPagination,
          searchQuery: '',
        });
      },
    })),
    {
      name: 'filters-storage',
      partialize: (state) => ({
        filters: state.filters,
        sort: state.sort,
        pagination: { limit: state.pagination.limit },
      }),
    }
  )
);