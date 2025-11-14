import { Suspense } from 'react';
import ShopPageContent from '../shop/ShopPageContent';
import { Skeleton } from '@/components/ui/skeleton';

function DigiShopSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <Skeleton className="h-12 w-1/2 mx-auto" />
        <Skeleton className="h-6 w-3/4 mx-auto mt-2" />
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Skeleton className="h-[400px] w-full" />
        </aside>
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DigiworldaddaShopPage() {
  return (
    <Suspense fallback={<DigiShopSkeleton />}>
      <ShopPageContent company="digiworldadda" />
    </Suspense>
  );
}
