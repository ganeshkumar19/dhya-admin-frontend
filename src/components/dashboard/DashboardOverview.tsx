import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import StatCard from './StatCard';

interface Stat {
  label: string;
  value: number;
  color: string;
}

interface DashboardOverviewProps {
  stats: Stat[];
}

const DashboardOverview = ({ stats }: DashboardOverviewProps) => {
  return (
    <Box>
      <Heading mb={4}>Dashboard Overview</Heading>
      <Text mb={6}>
        Welcome to the Dhya Admin Dashboard. Here's a quick overview of your system.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} color={stat.color} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DashboardOverview;
