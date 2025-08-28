import { MainLayout } from '@/components/layout/main-layout';
import { TrendCard } from '@/components/dashboard/trend-card';
import { ContentPlanCard } from '@/components/dashboard/content-plan-card';
import { EngagementChart } from '@/components/dashboard/engagement-chart';
import { PlatformConnectionsCard } from '@/components/dashboard/platform-connections-card';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Welcome back!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your strategic overview for today.
            </p>
          </div>
          <Button>
            <FilePlus className="mr-2" />
            Create New Content
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EngagementChart />
            <div className="grid md:grid-cols-2 gap-6">
              <TrendCard />
              <ContentPlanCard />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <PlatformConnectionsCard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
