'use client';

import { useState, useEffect } from 'react';
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
  Globe,
  RefreshCw,
  Database,
  FolderOpen,
  TrendingUp,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { getProjects, deleteProject, seedProjects, toggleProjectStatus, resetProjects } from '@/lib/projects-api';
import type { Project } from '@/lib/types';
import { projects as staticProjects } from '@/lib/data';
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData = await getProjects();
      setProjects(projectsData);
      setFilteredProjects(projectsData);
    } catch (err) {
      console.error('Error fetching projects from API:', err);
      // Fallback to static projects if API fails
      console.log('Falling back to static projects');
      setProjects(staticProjects);
      setFilteredProjects(staticProjects);
      setError('Using static data - API connection failed. Click "Seed Projects" to migrate to MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const categories = ['all', ...Array.from(new Set(projects.map((p: Project) => p.category)))];

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
      filtered = filtered.filter((project: Project) =>
        project.title.toLowerCase().includes(term.toLowerCase()) ||
        project.description.toLowerCase().includes(term.toLowerCase()) ||
        project.technologies.some((tech: string) => tech.toLowerCase().includes(term.toLowerCase()))
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter((project: Project) => project.category === category);
    }

    setFilteredProjects(filtered);
  };

  const handleDelete = async (projectId: string, projectTitle: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete "${projectTitle}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      setError(null);
      await deleteProject(projectId);
      
      // Show success message
      alert(`Project "${projectTitle}" has been deleted successfully.`);
      
      // Refresh the projects list
      await fetchProjects();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      console.error('Error deleting project:', err);
      
      // Show error alert
      alert(`Error deleting project: ${errorMessage}`);
    }
  };

  const handleSeedProjects = async () => {
    try {
      setLoading(true);
      await seedProjects();
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed projects');
      console.error('Error seeding projects:', err);
    }
  };

  const handleResetProjects = async () => {
    const confirmed = window.confirm(
      'This will replace all existing projects with the updated data including new details.\n\nAre you sure you want to continue?'
    );
    
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      await resetProjects();
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset projects');
      console.error('Error resetting projects:', err);
    }
  };

  const handleToggleStatus = async (projectId: string) => {
    try {
      console.log('Toggling status for project ID:', projectId);
      setError(null); // Clear any previous errors
      setTogglingStatus(projectId); // Set loading state for this specific project
      
      const updatedProject = await toggleProjectStatus(projectId);
      console.log('Project status updated:', updatedProject);
      
      // Refresh the projects list to show updated status
      await fetchProjects();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle project status';
      setError(errorMessage);
      console.error('Error toggling project status:', err);
      
      // Show alert for immediate feedback
      alert(`Error: ${errorMessage}`);
    } finally {
      setTogglingStatus(null); // Clear loading state
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'E-Commerce': 'bg-blue-100 text-blue-800',
      'Education': 'bg-green-100 text-green-800',
      'LLM (ML/AI)': 'bg-purple-100 text-purple-800',
      'Blockchain (Crypto)': 'bg-orange-100 text-orange-800',
      'Dashboards (CMS)': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 relative isolate pb-48">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Projects Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Manage your portfolio projects and case studies.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Link>
          </Button>
          <Button 
            onClick={handleSeedProjects}
            disabled={loading}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            Seed Projects
          </Button>
          <Button 
            onClick={handleResetProjects}
            disabled={loading}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            Reset & Seed
          </Button>
          <Button 
            onClick={fetchProjects}
            disabled={loading}
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Success Message */}
      {!loading && !error && projects.length > 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">✅ Projects loaded successfully!</p>
          <p>Click on any status button (Active/Inactive) in the table below to toggle project visibility.</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg text-slate-600">Loading projects...</span>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && (
        <div className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/20 overflow-hidden relative z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
              Active Projects
            </CardTitle>
            <div className="p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 bg-green-100 group-hover:rotate-12">
              <FolderOpen className="w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors duration-300">
              {projects.filter(p => (p.status || 'active') === 'active').length}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
              Currently visible to users
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 overflow-hidden relative z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
              Total Projects
            </CardTitle>
            <div className="p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 bg-purple-100 group-hover:rotate-12">
              <TrendingUp className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors duration-300">
              {projects.length}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
              All projects in database
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20 overflow-hidden relative z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
              Categories
            </CardTitle>
            <div className="p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 bg-orange-100 group-hover:rotate-12">
              <FileText className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors duration-300">
              {categories.length - 1}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
              Different project types
            </p>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Projects Table */}
      {!loading && (
        <Card className="relative z-10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  All Projects
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  View and manage all projects in your database
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
                  <DropdownMenuContent align="end">
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={selectedCategory === category ? 'bg-accent' : ''}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="overflow-x-auto pb-12">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Technologies</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{project.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{project.description}</div>
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
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(project.id)}
                          disabled={togglingStatus === project.id}
                          className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                            (project.status || 'active') === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                              : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
                          } ${togglingStatus === project.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                        >
                          {togglingStatus === project.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                (project.status || 'active') === 'active' ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              {(project.status || 'active') === 'active' ? 'Active' : 'Inactive'}
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 relative z-30 pointer-events-auto">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={project.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
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
                            onClick={() => handleDelete(project.id, project.title)}
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
            </div>
          </CardContent>
        </Card>
      )}

      <div className="h-32" />
    </div>
  );
}
