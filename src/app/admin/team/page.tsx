'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Mail,
  Phone,
  RefreshCw,
  Database,
  RotateCcw,
  UserPlus,
  Filter,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Team } from '@/lib/types';
import { getTeamMembers, deleteTeamMember } from '@/lib/team-api';

export default function TeamManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState<Team[]>([]);
  const [filteredTeam, setFilteredTeam] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Load team members from database
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setLoading(true);
        const members = await getTeamMembers();
        setTeamMembers(members);
        setFilteredTeam(members);
      } catch (error) {
        console.error('Error loading team members:', error);
        alert('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = teamMembers.filter(member =>
      member.name.toLowerCase().includes(term.toLowerCase()) ||
      member.position.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTeam(filtered);
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      await deleteTeamMember(memberId);
      const updated = filteredTeam.filter(member => member.id !== memberId);
      setFilteredTeam(updated);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      alert('Team member deleted successfully');
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member');
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will replace all existing team members with seed data. Are you sure?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/team/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully seeded ${result.data.length} team members!`);
        // Reload team members
        const members = await getTeamMembers();
        setTeamMembers(members);
        setFilteredTeam(members);
      } else {
        alert(`Failed to seed team members: ${result.error}`);
      }
    } catch (error) {
      console.error('Error seeding team members:', error);
      alert('Failed to seed team members');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('This will delete ALL team members. This action cannot be undone. Are you sure?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/team/seed', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully deleted ${result.deletedCount} team members!`);
        // Clear local state
        setTeamMembers([]);
        setFilteredTeam([]);
      } else {
        alert(`Failed to reset team members: ${result.error}`);
      }
    } catch (error) {
      console.error('Error resetting team members:', error);
      alert('Failed to reset team members');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (position: string) => {
    const colors: Record<string, string> = {
      'Founder': 'bg-purple-100 text-purple-800',
      'Co-Founder': 'bg-blue-100 text-blue-800',
      'CTO': 'bg-blue-100 text-blue-800',
      'Sales Manager': 'bg-green-100 text-green-800',
      'UX Engineer': 'bg-orange-100 text-orange-800',
      'Designer': 'bg-pink-100 text-pink-800',
      'Developer': 'bg-indigo-100 text-indigo-800',
      'Manager': 'bg-yellow-100 text-yellow-800',
    };
    
    // Check if position contains any of the keywords
    for (const [key, color] of Object.entries(colors)) {
      if (position.toLowerCase().includes(key.toLowerCase())) {
        return color;
      }
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading team members...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="border-b border-border pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                <p className="text-muted-foreground">
                  Manage your team members and their information
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Data Management Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSeed}
                disabled={loading}
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
              >
                <Database className="w-4 h-4 mr-2" />
                Seed Data
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReset}
                disabled={loading}
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            
            {/* Primary Action */}
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link href="/admin/team/new">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Members</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{teamMembers.length}</div>
            <p className="text-xs text-blue-600 mt-1">
              {teamMembers.length === 1 ? 'Active member' : 'Active members'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Leadership</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {teamMembers.filter(m => m.position.toLowerCase().includes('founder') || m.position.toLowerCase().includes('cto')).length}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Founders & executives
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Designers</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {teamMembers.filter(m => m.position.toLowerCase().includes('designer') || m.position.toLowerCase().includes('ux')).length}
            </div>
            <p className="text-xs text-green-600 mt-1">
              Design team members
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Other Roles</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              {teamMembers.filter(m => 
                !m.position.toLowerCase().includes('founder') && 
                !m.position.toLowerCase().includes('cto') &&
                !m.position.toLowerCase().includes('designer') &&
                !m.position.toLowerCase().includes('ux')
              ).length}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Sales & other roles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Team Grid */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Members
                <Badge variant="secondary" className="ml-2">
                  {filteredTeam.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                View and manage all team members
              </CardDescription>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or position..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64 bg-white border-gray-200 focus:border-primary"
                />
              </div>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTeam.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">No team members found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding your first team member.'
                }
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/team/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team Member
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTeam.map((member) => (
                <Card key={member.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-0">
                    {/* Header with Avatar */}
                    <div className="relative p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                          <AvatarImage 
                            src={member.imageUrl || `/images/team/${member.imageId}`} 
                            alt={member.name} 
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Action Menu */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50" asChild>
                            <Link href={`/team`}>
                              <ExternalLink className="h-4 w-4 text-blue-600" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-50" asChild>
                            <Link href={`/admin/team/${member.id}/edit`}>
                              <Edit className="h-4 w-4 text-green-600" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(member.id)}
                            className="h-8 w-8 hover:bg-red-50 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Member Info */}
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{member.name}</h3>
                        <Badge className={`${getRoleColor(member.position)} font-medium`}>
                          {member.position}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Bio Section */}
                    {member.bio && (
                      <div className="px-6 pb-4">
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                    )}
                    
                    {/* Contact Info */}
                    <div className="px-6 pb-4 space-y-2">
                      {member.socialLinks?.email && (
                        <div className="flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{member.socialLinks.email}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Order: {member.order}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs font-medium text-green-700">Active</span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">#{member.id.slice(-6)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
