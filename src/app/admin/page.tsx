import AdminContentForm from '@/components/admin/admin-content-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className="container mx-auto max-w-4xl">
        <Card>
            <CardHeader>
                <CardTitle>Admin Content Generation Tool</CardTitle>
                <CardDescription>
                    Use the power of AI to generate draft content for your venture portfolios, innovation highlights, and team bios.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AdminContentForm />
            </CardContent>
        </Card>
    </div>
  );
}
