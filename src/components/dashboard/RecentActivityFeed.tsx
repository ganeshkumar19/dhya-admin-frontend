import {
  Box,
  Heading,
  Text,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { AddIcon, WarningIcon, InfoOutlineIcon } from '@chakra-ui/icons';

type Activity = {
  id: number;
  type: 'add' | 'alert' | 'device';
  message: string;
  timestamp: string;
};

const iconMap = {
  add: <AddIcon color="green.500" />,
  alert: <WarningIcon color="red.500" />,
  device: <InfoOutlineIcon color="blue.500" />,
};

interface RecentActivityFeedProps {
  activities: Activity[];
}

const RecentActivityFeed = ({ activities }: RecentActivityFeedProps) => {
  return (
    <Box mt={10}>
      <Heading size="md" mb={4}>
        Recent Activity
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
        {activities.map((activity) => (
          <Box
            key={activity.id}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            boxShadow="sm"
          >
            <HStack align="start" spacing={3}>
              <Box>{iconMap[activity.type]}</Box>
              <Box>
                <Text fontSize="sm">{activity.message}</Text>
                <Text fontSize="xs" color="gray.500">
                  {activity.timestamp}
                </Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RecentActivityFeed;