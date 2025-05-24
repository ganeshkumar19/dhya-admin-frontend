import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Notification } from '../../types/notifications';

interface NotificationCardProps extends Notification {}

const severityColors: Record<NotificationCardProps['severity'], { bg: string; borderColor: string }> = {
  low: { bg: 'green.50', borderColor: 'green.500' },
  medium: { bg: 'yellow.50', borderColor: 'yellow.500' },
  high: { bg: 'red.50', borderColor: 'red.500' },
  info: { bg: 'blue.50', borderColor: 'blue.500' },
  warning: { bg: 'orange.50', borderColor: 'orange.500' },
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  message,
  severity,
  type,
  createdAt,
  user,
}) => {
  const { bg, borderColor } = severityColors[severity] ?? {
    bg: 'white',
    borderColor: 'gray.300',
  };

  return (
    <Box
      p={4}
      borderLeftWidth="4px"
      borderLeftColor={borderColor}
      bg={bg}
      borderRadius="xl"
      boxShadow="sm"
      mb={4}
    >
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="lg" fontWeight="semibold">
          {title}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {new Date(createdAt).toLocaleString()}
        </Text>
      </Flex>

      <Text fontSize="sm" color="gray.700" mb={1}>
        {message}
      </Text>

      <Text fontSize="xs" color="gray.600">
        From: {user.name} ({user.email})
      </Text>

      <Text fontSize="xs" color="gray.500" mt={1}>
        Type: {type} | Severity: {severity}
      </Text>
    </Box>
  );
};

export default NotificationCard;
