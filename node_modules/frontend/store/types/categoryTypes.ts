// store/categoryTypes.ts

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  parentCategory?: string;
}

export interface UpdateCategoryRequest {
  _id: string;
  name?: string;
  slug?: string;
  parentCategory?: string;
}
