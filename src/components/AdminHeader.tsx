import {
  Box,
  Flex,
  IconButton,
  Text,
  Avatar,
  useColorModeValue,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Notify from './dashboard/Notify';

interface HeaderProps {
  onOpen: () => void;
}

const Header = ({ onOpen }: HeaderProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex
      as="header"
      w="full"
      px={4}
      height="16"
      align="center"
      justify="space-between"
      bg={useColorModeValue('white', 'gray.800')}
      borderBottomWidth="1px"
      position="sticky"
      top="0"
      zIndex="docked"
    >
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          Dhya Admin Dashboard
        </Text>
      </Box>

     <HStack spacing={3}>
    <Notify />

    <Menu>
    <MenuButton>
      <Avatar size="sm" cursor="pointer" />
    </MenuButton>
    <MenuList>
      <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </MenuList>
  </Menu>

  <IconButton
    display={{ base: 'inline-flex', md: 'none' }}
    onClick={onOpen}
    icon={<FiMenu />}
    variant="ghost"
    aria-label="Open menu"
  />
</HStack>
    </Flex>
  );
};

export default Header;
