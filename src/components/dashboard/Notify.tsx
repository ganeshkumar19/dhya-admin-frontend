import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Button,
  Badge,
  Box,
  Divider,
  Spinner,
  Center,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { FiBell } from 'react-icons/fi';
import { fetchNotifications } from '../../api/notifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getLastSeen, setLastSeen } from '../../helpers/lastSeen';


const Notify = () => {
  const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications', 1],
    queryFn: () => fetchNotifications(1),
  });

   const lastSeen = getLastSeen();
  

  const notifications = data?.notifications?.slice(0, 3) || [];
 const newCount = notifications.filter((n: any) => new Date(n.createdAt) > lastSeen).length;

   const handleViewAll = () => {
    // Mark all as seen
    setLastSeen();
    onClose();
    setTimeout(() => {
      navigate('/notifications');
    }, 50);
  };


  return (
    <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom-end">
      <MenuButton position="relative">
        <IconButton
          icon={<FiBell />}
          fontSize={24}
          aria-label="Notifications"
          variant="ghost"
        />
         {newCount > 0 && (
          <Badge
            colorScheme="red"
            borderRadius="full"
            fontSize="0.7em"
            position="absolute"
            top="0"
            right="3px"
          >
            {newCount}
          </Badge>
        )}
      </MenuButton>

      <MenuList
        maxW="300px"
        maxH="350px"
        overflowY="auto"
        px={0}
        py={2}
        boxShadow="lg"
        borderRadius="md"
      >
        {isLoading ? (
          <Center py={4}>
            <Spinner size="sm" mr={2} />
            <Text>Loading...</Text>
          </Center>
        ) : isError ? (
          <Text px={4} py={2} color="red.500">
            Failed to load notifications
          </Text>
        ) : notifications.length === 0 ? (
          <Text px={4} py={2}>No new notifications</Text>
        ) : (
          <>
            {notifications.map((notif: any, idx: any) => (
              <Box key={notif.id} px={4} py={2} _hover={{ bg: 'gray.50' }}>
                <Text fontSize="sm" fontWeight="medium">
                  {notif.title}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </Text>
                {idx !== notifications.length - 1 && <Divider mt={2} />}
              </Box>
            ))}
          </>
        )}

        <Box borderTop="1px solid" borderColor="gray.200" pt={2} textAlign="center">
          <Button
              size="sm"
              colorScheme="blue"
              variant="link"
              onClick={handleViewAll}
            >
            View All
          </Button>
        </Box>
      </MenuList>
    </Menu>
  );
};

export default Notify;


