import { Team } from '@/lib/types';

const API_BASE_URL = '/api/team';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function getTeamMembers(): Promise<Team[]> {
  const response = await fetch(API_BASE_URL);
  const result: ApiResponse<Team[]> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to fetch team members');
  return result.data;
}

export async function getTeamMember(id: string): Promise<Team> {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const result: ApiResponse<Team> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to fetch team member');
  return result.data;
}

export async function createTeamMember(teamData: Partial<Team>): Promise<Team> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamData),
  });
  const result: ApiResponse<Team> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to create team member');
  return result.data;
}

export async function updateTeamMember(id: string, teamData: Partial<Team>): Promise<Team> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamData),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  const result: ApiResponse<Team> = await response.json();
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to update team member');
  return result.data;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  const result: ApiResponse<unknown> = await response.json();
  if (!result.success) throw new Error(result.error || 'Failed to delete team member');
}
