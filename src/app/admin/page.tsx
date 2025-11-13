'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  FolderOpen, 
  Users, 
  FileText, 
  MessageSquare,
  TrendingUp,
  Eye,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { services, teamMembers, projects, testimonials } from '@/lib/data';

export default function AdminDashboard() {
  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Services',
      value: services.length,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/services'
    },
    {
      title: 'Active Projects',
      value: projects.length,
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/projects'
    },
    {
      title: 'Team Members',
      value: teamMembers.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/team'
    },
    {
      title: 'Blog Posts',
      value: 12, // Mock data
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/admin/blogs'
    },
    {
      title: 'Contact Inquiries',
      value: 28, // Mock data
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: '/admin/contacts'
    },
    {
      title: 'Monthly Views',
      value: '2.4K',
      icon: Eye,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      href: '/admin'
    }
  ];

  const recentActivities = [
    { action: 'New contact inquiry from John Doe', time: '2 hours ago', type: 'contact' },
    { action: 'Blog post "AI in Web Development" published', time: '1 day ago', type: 'blog' },
    { action: 'Project "TechPyro" updated', time: '2 days ago', type: 'project' },
    { action: 'New team member added', time: '3 days ago', type: 'team' },
    { action: 'Service "Mobile App Development" updated', time: '1 week ago', type: 'service' }
  ];

  const quickActions = [
    { title: 'Add New Service', href: '/admin/services/new', icon: Plus, color: 'bg-blue-600' },
    { title: 'Create Project', href: '/admin/projects/new', icon: Plus, color: 'bg-green-600' },
    { title: 'Add Team Member', href: '/admin/team/new', icon: Plus, color: 'bg-purple-600' },
    { title: 'Write Blog Post', href: '/admin/blogs/new', icon: Plus, color: 'bg-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Welcome back! Here's what's happening with your website.
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Link href="/">
            <Eye className="w-4 h-4 mr-2" />
            View Website
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                 style={{
                   background: index % 6 === 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                              index % 6 === 1 ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                              index % 6 === 2 ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
                              index % 6 === 3 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' :
                              index % 6 === 4 ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' :
                              'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                 }} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                {stat.title}
              </CardTitle>
              <div className={`p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 ${stat.bgColor} group-hover:rotate-12`}>
                <stat.icon className={`w-5 h-5 ${stat.color} group-hover:text-white transition-colors duration-300`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors duration-300">
                {stat.value}
              </div>
              <Button variant="link" asChild className="p-0 h-auto text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                <Link href={stat.href}>View details →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quick Actions
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Common tasks to manage your website content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <Button
                key={action.title}
                asChild
                variant="outline"
                className="w-full justify-start group border-0 bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 h-14"
              >
                <Link href={action.href}>
                  <div className={`p-2 rounded-lg mr-4 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110 ${
                    index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                    index === 1 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                    index === 2 ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                    'bg-gradient-to-br from-orange-500 to-orange-600'
                  }`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                    {action.title}
                  </span>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Recent Activities
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Latest updates and changes to your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 rounded-xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 group">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 shadow-sm ${
                    activity.type === 'contact' ? 'bg-gradient-to-br from-blue-400 to-blue-500' :
                    activity.type === 'blog' ? 'bg-gradient-to-br from-green-400 to-green-500' :
                    activity.type === 'project' ? 'bg-gradient-to-br from-purple-400 to-purple-500' :
                    activity.type === 'team' ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                    'bg-gradient-to-br from-pink-400 to-pink-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <Badge variant="secondary" className={`text-xs font-medium shadow-sm ${
                    activity.type === 'contact' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    activity.type === 'blog' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    activity.type === 'project' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    activity.type === 'team' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
                  }`}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20 border-0 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="relative z-10 pb-6">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Performance Overview
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Website metrics and engagement statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-sm group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 mb-3">
                <div className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">98.5%</div>
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Uptime</div>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl shadow-sm group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 mb-3">
                <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent">2.3s</div>
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Load Time</div>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl shadow-sm group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 mb-3">
                <div className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-violet-600 bg-clip-text text-transparent">85%</div>
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Mobile Score</div>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl shadow-sm group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 mb-3">
                <div className="text-3xl font-bold bg-gradient-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent">4.8/5</div>
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">User Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
