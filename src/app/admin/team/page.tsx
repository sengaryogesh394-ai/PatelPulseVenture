'use client';

import { useState } from 'react';
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
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { teamMembers } from '@/lib/data';

export default function TeamManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTeam, setFilteredTeam] = useState(teamMembers);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = teamMembers.filter(member =>
      member.name.toLowerCase().includes(term.toLowerCase()) ||
      member.role.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTeam(filtered);
  };

  const handleDelete = (memberId: string) => {
    const updated = filteredTeam.filter(member => member.id !== memberId);
    setFilteredTeam(updated);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Founder': 'bg-purple-100 text-purple-800',
      'Co-Founder - CTO': 'bg-blue-100 text-blue-800',
      'Sales Manager': 'bg-green-100 text-green-800',
      'UX Engeneer': 'bg-orange-100 text-orange-800',
      'Interaction Designer': 'bg-pink-100 text-pink-800',
      'Visual Designer': 'bg-indigo-100 text-indigo-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their information.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/team/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leadership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Founders & executives
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Designers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Design team members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Sales team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Team Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                View and manage all team members
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 w-64"
              />
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeam.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/team`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/team/${member.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        {member.name.toLowerCase().replace(' ', '.')}@patelpulse.com
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        +1 (555) 000-{member.id.padStart(4, '0')}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Member ID</span>
                        <span className="font-mono">{member.id}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="default" className="text-xs">Active</Badge>
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
