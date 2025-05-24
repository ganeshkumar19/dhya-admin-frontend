import DashboardOverview from '../components/dashboard/DashboardOverview';
import { Box } from '@chakra-ui/react';
import { Activity } from '../types/dashboard';
import { fetchOverviewCounts } from '../api/dashboard';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const Dashboard = () => {

        const { data, isLoading, isError, error } = useQuery({
          queryKey: ['overview-counts'],
          queryFn: fetchOverviewCounts,
          refetchOnWindowFocus: false,
          retry: false
        });


   const dummyActivities: Activity[] = [
    {
      id: 1,
      type: 'add',
      message: 'New farm "Green Valley" added by Admin.',
      timestamp: '2025-05-12 10:15 AM',
    },
    {
      id: 2,
      type: 'alert',
      message: 'High ammonia levels detected in Pond 4.',
      timestamp: '2025-05-12 09:50 AM',
    },
    {
      id: 3,
      type: 'device',
      message: 'Sensor #34 went offline.',
      timestamp: '2025-05-12 09:30 AM',
    },
  ];

  const stats = useMemo(() => {
  if (!data) return [];

  return [
    { label: 'Total Farms', value: data.farms, color: 'green.400' },
    { label: 'Total Ponds', value: data.ponds, color: 'blue.400' },
    { label: 'Total Users', value: data.users, color: 'purple.400' },
    { label: 'Active Devices', value: data.devices, color: 'orange.400' },
    { label: 'Tickets Raised', value: data.tickets, color: 'red.400' },
  ];
}, [data]);

  return (
     <Box p={6}>
      <DashboardOverview stats={stats} />
      {/*<RecentActivityFeed activities={dummyActivities} />*/}
    </Box>
  )
}

export default Dashboard