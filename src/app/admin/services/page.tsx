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
  Briefcase,
  TrendingUp,
  FileText,
  RefreshCw,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { getServices, deleteService, seedServices, toggleServiceStatus, resetServices } from '@/lib/services-api';
import type { Service } from '@/lib/types';
import { services as staticServices } from '@/lib/data';
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

export default function ServicesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const servicesData = await getServices();
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (err) {
      console.error('Error fetching services from API:', err);
      // Fallback to static services if API fails
      console.log('Falling back to static services');
      setServices(staticServices);
      setFilteredServices(staticServices);
      setError('Using static data - API connection failed. Click "Seed Services" to migrate to MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = services.filter((service: Service) =>
      service.name.toLowerCase().includes(term.toLowerCase()) ||
      service.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const handleDelete = async (serviceId: string, serviceName: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete "${serviceName}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      setError(null);
      await deleteService(serviceId);
      
      // Show success message
      alert(`Service "${serviceName}" has been deleted successfully.`);
      
      // Refresh the services list
      await fetchServices();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete service';
      setError(errorMessage);
      console.error('Error deleting service:', err);
      
      // Show error alert
      alert(`Error deleting service: ${errorMessage}`);
    }
  };

  const handleSeedServices = async () => {
    try {
      setLoading(true);
      await seedServices();
      await fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed services');
      console.error('Error seeding services:', err);
    }
  };

  const handleResetServices = async () => {
    const confirmed = window.confirm(
      'This will replace all existing services with the updated data including new details.\n\nAre you sure you want to continue?'
    );
    
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      await resetServices();
      await fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset services');
      console.error('Error resetting services:', err);
    }
  };

  const handleToggleStatus = async (serviceId: string) => {
    try {
      console.log('Toggling status for service ID:', serviceId);
      setError(null); // Clear any previous errors
      setTogglingStatus(serviceId); // Set loading state for this specific service
      
      const updatedService = await toggleServiceStatus(serviceId);
      console.log('Service status updated:', updatedService);
      
      // Refresh the services list to show updated status
      await fetchServices();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle service status';
      setError(errorMessage);
      console.error('Error toggling service status:', err);
      
      // Show alert for immediate feedback
      alert(`Error: ${errorMessage}`);
    } finally {
      setTogglingStatus(null); // Clear loading state
    }
  };

  return (
    <div className="space-y-6 relative isolate pb-48">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Services Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Manage your company's service offerings and descriptions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSeedServices}
            disabled={loading}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            Seed Services
          </Button>
          <Button 
            onClick={handleResetServices}
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
            onClick={fetchServices}
            disabled={loading}
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link href="/admin/services/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Service
            </Link>
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
      {!loading && !error && services.length > 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">✅ Services loaded successfully!</p>
          <p>Click on any status button (Active/Inactive) in the table below to toggle service visibility.</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg text-slate-600">Loading services...</span>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && (
        <div className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/20 overflow-hidden relative z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
              Active Services
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent mb-1">
              {filteredServices.filter(s => (s.status || 'active') === 'active').length}
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Active service offerings
            </p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20 overflow-hidden relative z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
              Inactive Services
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-br from-red-600 to-red-700 bg-clip-text text-transparent mb-1">
              {filteredServices.filter(s => (s.status || 'active') === 'inactive').length}
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Hidden from public
            </p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 overflow-hidden relative z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
              Avg. Details
            </CardTitle>
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <FileText className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent mb-1">
              {filteredServices.length > 0 
                ? (filteredServices.reduce((sum, service) => sum + (service.details?.length || 0), 0) / filteredServices.length).toFixed(1)
                : '0'
              }
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Avg. detail sections per service
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Search and Filters */}
      {!loading && (
      <Card className="relative z-30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Services</CardTitle>
              <CardDescription>
                View and manage all your service offerings
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
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
                  <DropdownMenuItem>All Services</DropdownMenuItem>
                  <DropdownMenuItem>Development</DropdownMenuItem>
                  <DropdownMenuItem>Design</DropdownMenuItem>
                  <DropdownMenuItem>Marketing</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="overflow-x-auto pb-16 md:pb-24">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Details Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {service.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-sm line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {service.details?.length || 0} sections
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(service.id)}
                      disabled={togglingStatus === service.id}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                        (service.status || 'active') === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                          : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
                      } ${togglingStatus === service.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                    >
                      {togglingStatus === service.id ? (
                        <>
                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            (service.status || 'active') === 'active' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          {(service.status || 'active') === 'active' ? 'Active' : 'Inactive'}
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right relative z-40">
                    <div className="flex items-center justify-end gap-2 relative z-50 pointer-events-auto">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/services/${service.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/services/${service.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(service.id, service.name)}
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
      {/* Bottom spacer to ensure last row actions are fully clickable and not occluded */}
      <div className="h-48 md:h-72" />
    </div>
  );
}
