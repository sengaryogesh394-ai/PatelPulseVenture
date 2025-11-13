import type { Product } from '@/lib/types';

const API_BASE_URL = '/api/products';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_BASE_URL);
  const result: ApiResponse<Product[]> = await response.json();
  if (!result.success) throw new Error(result.error || 'Failed to fetch products');
  return result.data || [];
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const result: ApiResponse<Product> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Product not found');
  return result.data;
}

export async function createProduct(productData: Omit<Product, 'id' | 'slug'> & { slug?: string }): Promise<Product> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const result: ApiResponse<Product> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to create product');
  return result.data;
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/${id}` ,{
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const result: ApiResponse<Product> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to update product');
  return result.data;
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  const result: ApiResponse<unknown> = await response.json();
  if (!result.success) throw new Error(result.error || 'Failed to delete product');
}

export async function toggleProductStatus(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/${id}/toggle-status`, { method: 'PATCH' });
  const result: ApiResponse<Product> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to toggle product status');
  return result.data;
}

export async function seedProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/seed`, { method: 'POST' });
  const result: ApiResponse<Product[]> = await response.json();
  if (!result.success) throw new Error(result.error || 'Failed to seed products');
  return result.data || [];
}

export async function resetProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/seed`, { method: 'DELETE' });
  const result: ApiResponse<Product[]> = await response.json();
  if (!result.success) throw new Error(result.error || 'Failed to reset products');
  return result.data || [];
}
