import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications } from '../api/notifications';
import NotificationCard from '../components/dashboard/NotificationsCard';
import { Notification } from '../types/notifications';
import {
  Box,
  Heading,
  Spinner,
  Text,
  Center,
  Alert,
  AlertIcon,
  SimpleGrid,
} from '@chakra-ui/react';
import Pagination from '../components/dashboard/Pagination';

const Notifications: React.FC = () => {
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

  const {
  data,
  isLoading,
  isError,
  error,
  isFetching,
} = useQuery({
  queryKey: ['notifications', page],
  queryFn: () => fetchNotifications(page),
  placeholderData: () => {
    if (page === 1) {
      return queryClient.getQueryData(['notifications', 1]);
    }
    return undefined;
  },
});

  if (isLoading) {
    return (
      <Center py={6}>
        <Spinner size="lg" />
        <Text ml={3}>Loading notifications...</Text>
      </Center>
    );
  }



  if (isError) {
    return (
      <Alert status="error" borderRadius="md" mx="auto" maxW="3xl" mt={6}>
        <AlertIcon />
        Error: {error.message}
      </Alert>
    );
  }

   const notifications: Notification[] = data?.notifications ?? [];
  const { totalPages, page: currentPage } = data?.pagination ?? {};

  return (
    <Box px={3} py={8} maxW="4xl" mx="auto">
      <Heading as="h1" size="lg" mb={6}>
        Notifications
      </Heading>

      {notifications.length > 0 ? (
        <>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {notifications.map((notif) => (
              <NotificationCard key={notif.id} {...notif} />
            ))}
          </SimpleGrid>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <Text>No notifications found.</Text>
      )}

      {isFetching && <Text mt={2}>Fetching more...</Text>}
    </Box>
  );
};

export default Notifications;