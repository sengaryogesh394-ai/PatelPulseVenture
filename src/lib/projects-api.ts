import type { Project } from '@/lib/types';

const API_BASE_URL = '/api/projects';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(API_BASE_URL);
  const result: ApiResponse<Project[]> = await response.json();
  if (!result.success) throw new Error(result.error || 'Failed to fetch projects');
  return result.data || [];
}

export async function getProject(id: string): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const result: ApiResponse<Project> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Project not found');
  return result.data;
}

export async function createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  const result: ApiResponse<Project> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to create project');
  return result.data;
}

export async function updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  const result: ApiResponse<Project> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to update project');
  return result.data;
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  const result: ApiResponse<unknown> = await response.json();
  if (!result.success) throw new Error(result.error || 'Failed to delete project');
}

export async function toggleProjectStatus(id: string): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/${id}/toggle-status`, { method: 'PATCH' });
  const result: ApiResponse<Project> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to toggle project status');
  return result.data;
}

export async function seedProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/seed`, { method: 'POST' });
  const result: ApiResponse<Project[]> = await response.json();
  if (!result.success) throw new Error(result.error || 'Failed to seed projects');
  return result.data || [];
}

export const resetProjects = async (): Promise<void> => {
  const response = await fetch('/api/projects/seed', {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reset projects');
  }
};

// Upload image for project
export const uploadProjectImage = async (file: File): Promise<{ imageUrl: string; fileName: string }> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  try {
    if (cloudName && uploadPreset) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error?.message || 'Cloudinary upload failed');
      return { imageUrl: json.secure_url || json.url, fileName: json.public_id };
    }

    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('/api/upload/image', { method: 'POST', body: formData });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }
    const data = await response.json();
    return { imageUrl: data.imageUrl, fileName: data.publicId || data.fileName };
  } catch (e) {
    throw e;
  }
};

// Delete uploaded image
export const deleteProjectImage = async (fileName: string): Promise<void> => {
  const response = await fetch(`/api/upload/image?fileName=${encodeURIComponent(fileName)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete image');
  }
};
