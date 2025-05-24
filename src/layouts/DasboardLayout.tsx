import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import Sidebar from '../components/AdminSidebar';
import Header from '../components/AdminHeader';
import { Outlet } from 'react-router-dom';


const DashboardLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh">
      {/* Sidebar for large screens */}
      <Box
        display={{ base: 'none', md: 'block' }}
        w="250px"
        pos="fixed"
        h="full"
        zIndex={1000}

      >
        <Sidebar onClose={onClose} />
      </Box>

      {/* Sidebar Drawer for small screens */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <Sidebar onClose={onClose} inDrawer />
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <Box ml={{ base: 0, md: '250px' }} transition="margin-left 0.2s">
        <Header onOpen={onOpen} />
        <Box p={4}>
            <Outlet/>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;