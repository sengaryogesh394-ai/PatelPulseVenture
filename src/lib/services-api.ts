import type { Service } from '@/lib/types';

const API_BASE_URL = '/api/services';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Get all services
export async function getServices(): Promise<Service[]> {
  try {
    console.log('Fetching services from:', API_BASE_URL);
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('Response text:', text.substring(0, 200));
    
    let result: ApiResponse<Service[]>;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Invalid JSON response from server');
    }
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch services');
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

// Get a specific service by ID
export async function getService(id: string): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result: ApiResponse<Service> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch service');
    }
    
    if (!result.data) {
      throw new Error('Service not found');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
}

// Create a new service
export async function createService(serviceData: Omit<Service, 'id' | 'slug'> & { slug?: string }): Promise<Service> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });
    
    const result: ApiResponse<Service> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create service');
    }
    
    if (!result.data) {
      throw new Error('No data returned from server');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

// Update a service
export async function updateService(id: string, serviceData: Partial<Service>): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });
    
    const result: ApiResponse<Service> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update service');
    }
    
    if (!result.data) {
      throw new Error('No data returned from server');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

// Delete a service
export async function deleteService(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    const result: ApiResponse<void> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete service');
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}

// Seed services (for initial setup)
export async function seedServices(): Promise<Service[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/seed`, {
      method: 'POST',
    });
    
    const result: ApiResponse<Service[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to seed services');
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error seeding services:', error);
    throw error;
  }
}

// Reset and reseed services
export async function resetServices(): Promise<Service[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/seed`, {
      method: 'DELETE',
    });
    
    const result: ApiResponse<Service[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to reset services');
    }
    
    return result.data || [];
  } catch (error) {
    console.error('Error resetting services:', error);
    throw error;
  }
}

// Toggle service status (active/inactive)
export async function toggleServiceStatus(id: string): Promise<Service> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/toggle-status`, {
      method: 'PATCH',
    });
    
    const result: ApiResponse<Service> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to toggle service status');
    }
    
    if (!result.data) {
      throw new Error('No data returned from server');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error toggling service status:', error);
    throw error;
  }
}
