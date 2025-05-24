import {
    Box,
    VStack,
    Text,
    useColorModeValue,
    CloseButton,
  } from '@chakra-ui/react';
  import { NavLink } from 'react-router-dom';

interface SidebarProps {
  onClose?: () => void;
  inDrawer?: boolean;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Farms', path: '/farms' },
  { name: 'Ponds', path: '/ponds' },
  { name: 'Devices', path: '/devices' },
  { name: 'Users', path: '/users' },
  { name: 'Support', path: '/support' },
  { name: 'Billing', path: '/billing' },
  { name: 'Notifications', path: '/notifications' },
  { name: 'Settings', path: '/settings' },
];

const Sidebar = ({ onClose, inDrawer = false }: SidebarProps) => {
  const bg = useColorModeValue('gray.50', 'gray.800');
  const hoverBg = useColorModeValue('green.200', 'green.600');
  const activeBg = useColorModeValue('green.100', 'green.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      bg={bg}
      w={{ base: 'full', md: '250px' }}
      pos="fixed"
      h="full"
      borderRight="1px solid"
      borderColor="gray.200"
      display={{ base: inDrawer ? 'block' : 'none', md: 'block' }}
      px={inDrawer ? 1 : 3}     // 👈 Reduced padding only for drawer
      py={inDrawer ? 1 : 2}     // 👈 Same here
    >
      {onClose && (
        <CloseButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onClose}
          mb={4}
        />
      )}

      <VStack spacing={1} align="stretch" px={0}>
        <Text fontWeight="bold" fontSize="md" mb={4} ml={4}>
          dhya-admin-dashboard
        </Text>

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: 'none',
              backgroundColor: isActive ? activeBg : 'transparent',
            })}
          >
            <Box
              px={inDrawer ? 3 : 5}     // 👈 Reduced padding only for drawer
              py={inDrawer ? 2 : 3}     
              borderRadius="md"
              _hover={{ bg: hoverBg }}
              cursor="pointer"
              color={textColor}
              fontWeight="medium"
            >
              {item.name}
            </Box>
          </NavLink>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;