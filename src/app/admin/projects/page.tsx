'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  ExternalLink,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ProjectsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProjects(term, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterProjects(searchTerm, category);
  };

  const filterProjects = (term: string, category: string) => {
    let filtered = projects;

    if (term) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(term.toLowerCase()) ||
        project.description.toLowerCase().includes(term.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(term.toLowerCase()))
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(project => project.category === category);
    }

    setFilteredProjects(filtered);
  };

  const handleDelete = (projectId: string) => {
    const updated = filteredProjects.filter(project => project.id !== projectId);
    setFilteredProjects(updated);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'E-Commerce': 'bg-blue-100 text-blue-800',
      'Education': 'bg-green-100 text-green-800',
      'LLM (ML/AI)': 'bg-purple-100 text-purple-800',
      'Crypto': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects Management</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects and case studies.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Project
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              Active portfolio items
            </p>
          </CardContent>
        </Card>
        {categories.slice(1).map((category) => (
          <Card key={category}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.category === category).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Projects in category
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>
                View and manage your portfolio projects
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{project.title}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {project.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-sm line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(project.category)}>
                      {project.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.link !== '#' ? (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="secondary">Coming Soon</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/projects`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(project.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProjects.length === 0 && (
            <div className="text-center py-8">
              <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">No projects found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first project.'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/projects/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Project
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
