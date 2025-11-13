'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Archive,
  Star,
  Reply,
  Trash2,
  Eye
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock contact data
const mockContacts = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Innovations Inc.',
    subject: 'Website Development Inquiry',
    message: 'Hi, I\'m interested in your web development services for our startup. We need a modern e-commerce platform with custom features.',
    status: 'new',
    priority: 'high',
    source: 'contact-form',
    submittedAt: '2024-11-12T10:30:00Z',
    tags: ['web-development', 'e-commerce', 'startup']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@designstudio.com',
    phone: '+1 (555) 987-6543',
    company: 'Creative Design Studio',
    subject: 'Mobile App Development',
    message: 'We need a mobile app for our design portfolio. Looking for both iOS and Android versions with a clean, modern interface.',
    status: 'in-progress',
    priority: 'medium',
    source: 'contact-form',
    submittedAt: '2024-11-11T14:15:00Z',
    tags: ['mobile-app', 'design', 'portfolio']
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@retailcorp.com',
    phone: '+1 (555) 456-7890',
    company: 'Retail Corp',
    subject: 'Digital Marketing Services',
    message: 'Our company is looking to improve our online presence. We need help with SEO, social media marketing, and PPC campaigns.',
    status: 'responded',
    priority: 'medium',
    source: 'contact-form',
    submittedAt: '2024-11-10T09:45:00Z',
    tags: ['digital-marketing', 'seo', 'social-media']
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.r@healthtech.io',
    phone: '+1 (555) 321-0987',
    company: 'HealthTech Solutions',
    subject: 'AI Integration Consultation',
    message: 'We\'re a healthcare startup looking to integrate AI features into our platform. Would like to discuss possibilities and pricing.',
    status: 'new',
    priority: 'high',
    source: 'contact-form',
    submittedAt: '2024-11-12T16:20:00Z',
    tags: ['ai', 'healthcare', 'consultation']
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'dwilson@financefirm.com',
    phone: '+1 (555) 654-3210',
    company: 'Wilson Finance',
    subject: 'Custom CRM Development',
    message: 'We need a custom CRM system for our financial services company. Must have advanced reporting and client management features.',
    status: 'archived',
    priority: 'low',
    source: 'contact-form',
    submittedAt: '2024-11-08T11:30:00Z',
    tags: ['crm', 'finance', 'custom-development']
  }
];

export default function ContactsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [filteredContacts, setFilteredContacts] = useState(mockContacts);
  const [selectedContact, setSelectedContact] = useState<typeof mockContacts[0] | null>(null);

  const statuses = ['all', 'new', 'in-progress', 'responded', 'archived'];
  const priorities = ['all', 'high', 'medium', 'low'];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterContacts(term, selectedStatus, selectedPriority);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    filterContacts(searchTerm, status, selectedPriority);
  };

  const handlePriorityFilter = (priority: string) => {
    setSelectedPriority(priority);
    filterContacts(searchTerm, selectedStatus, priority);
  };

  const filterContacts = (term: string, status: string, priority: string) => {
    let filtered = mockContacts;

    if (term) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(term.toLowerCase()) ||
        contact.email.toLowerCase().includes(term.toLowerCase()) ||
        contact.company.toLowerCase().includes(term.toLowerCase()) ||
        contact.subject.toLowerCase().includes(term.toLowerCase()) ||
        contact.message.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(contact => contact.status === status);
    }

    if (priority !== 'all') {
      filtered = filtered.filter(contact => contact.priority === priority);
    }

    setFilteredContacts(filtered);
  };

  const updateContactStatus = (contactId: string, newStatus: string) => {
    const updated = filteredContacts.map(contact =>
      contact.id === contactId ? { ...contact, status: newStatus } : contact
    );
    setFilteredContacts(updated);
  };

  const deleteContact = (contactId: string) => {
    const updated = filteredContacts.filter(contact => contact.id !== contactId);
    setFilteredContacts(updated);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'responded': 'bg-green-100 text-green-800',
      'archived': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-orange-100 text-orange-800',
      'low': 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const newContacts = mockContacts.filter(c => c.status === 'new').length;
  const inProgressContacts = mockContacts.filter(c => c.status === 'in-progress').length;
  const highPriorityContacts = mockContacts.filter(c => c.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and contact form submissions.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockContacts.length}</div>
            <p className="text-xs text-muted-foreground">
              All inquiries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newContacts}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressContacts}</div>
            <p className="text-xs text-muted-foreground">
              Being handled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityContacts}</div>
            <p className="text-xs text-muted-foreground">
              Urgent inquiries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Contact Inquiries</CardTitle>
              <CardDescription>
                View and manage customer contact submissions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Status: {selectedStatus === 'all' ? 'All' : selectedStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {statuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                    >
                      {status === 'all' ? 'All Statuses' : status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Priority: {selectedPriority === 'all' ? 'All' : selectedPriority}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {priorities.map((priority) => (
                    <DropdownMenuItem
                      key={priority}
                      onClick={() => handlePriorityFilter(priority)}
                    >
                      {priority === 'all' ? 'All Priorities' : priority}
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
                <TableHead>Contact Info</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {contact.company}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {contact.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium line-clamp-1">{contact.subject}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {contact.message}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(contact.priority)}>
                      {contact.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(contact.submittedAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedContact(contact)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Contact Details</DialogTitle>
                            <DialogDescription>
                              Full contact information and message
                            </DialogDescription>
                          </DialogHeader>
                          {selectedContact && (
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="font-semibold">Contact Information</h4>
                                  <div className="space-y-2 mt-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Name:</span>
                                      <span>{selectedContact.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      <span>{selectedContact.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      <span>{selectedContact.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Company:</span>
                                      <span>{selectedContact.company}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Status & Priority</h4>
                                  <div className="space-y-2 mt-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Status:</span>
                                      <Badge className={getStatusColor(selectedContact.status)}>
                                        {selectedContact.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Priority:</span>
                                      <Badge className={getPriorityColor(selectedContact.priority)}>
                                        {selectedContact.priority}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>{formatDate(selectedContact.submittedAt)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold">Subject</h4>
                                <p className="mt-1">{selectedContact.subject}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Message</h4>
                                <p className="mt-1 text-muted-foreground">
                                  {selectedContact.message}
                                </p>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button size="sm">
                                  <Reply className="h-4 w-4 mr-2" />
                                  Reply
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => updateContactStatus(contact.id, 'in-progress')}>
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateContactStatus(contact.id, 'responded')}>
                            Mark Responded
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateContactStatus(contact.id, 'archived')}>
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteContact(contact.id)}
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

          {filteredContacts.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">No contacts found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No contact inquiries have been submitted yet.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
