import {
  Box, Button, Flex, Heading, Table, Tbody, Td, Th, Thead,
  Tr, TableContainer, useBreakpointValue, useDisclosure
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDevices } from '../api/devices';
import SearchFilterBar from '../components/dashboard/SearchFilterBar';
import Pagination from '../components/dashboard/Pagination';
import InStockDevicesTable from '../components/dashboard/InStockDevicesTable';
import { fetchAllFarms, fetchAllPonds, fetchAllUsers } from '../api/dropdown';

type DeviceRow = {
  id: string;
  type: string;
  farm: string;
  pond: string;
  owner: string;
  lastSeen: string;
};


const Devices = () => {
  const [editingDevice, setEditingDevice] = useState<DeviceRow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSeenFilter, setLastSeenFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const maxW = useBreakpointValue({ base: '100%', md: 'container.md' });
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);


  console.log('editingservices', editingDevice)
  const { data, isLoading, isError, refetch: refetchDevices } = useQuery({
    queryKey: ['devices', currentPage],
    queryFn: () => fetchDevices(currentPage),
     placeholderData: (previousData) => previousData,
     retry: false,
  });

  const { data: users = [] } = useQuery({
      queryKey: ['fetchallusers'],
      queryFn: fetchAllUsers,
      enabled: isLinkModalOpen,
      retry: false,
    });

    console.log('farmsusers', users)

  const { data: farms = [] } = useQuery({
      queryKey: ['allfarms'],
      queryFn: fetchAllFarms,
      enabled: isLinkModalOpen,
      retry: false,
    });

   const { data: ponds = [] } = useQuery({
      queryKey: ['fetchallponds'],
      queryFn: fetchAllPonds,
      enabled: isLinkModalOpen,
      retry: false,
    });


    

  const allDevices = data?.devices || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // Optional client-side filtering (after server pagination)
  const filteredDevices = allDevices.filter((device) => {
    const matchesSearch =
      device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.id.toLowerCase().includes(searchQuery.toLowerCase());

    const now = new Date();
    const lastSeenDate = new Date(device.lastSeen);
    let matchesLastSeen = true;

    if (lastSeenFilter === 'today') {
      matchesLastSeen = lastSeenDate.toDateString() === now.toDateString();
    } else if (lastSeenFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      matchesLastSeen = lastSeenDate >= sevenDaysAgo;
    } else if (lastSeenFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      matchesLastSeen = lastSeenDate >= thirtyDaysAgo;
    }

    return matchesSearch && matchesLastSeen;
  });

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, lastSeenFilter]);

  const deviceColumns = [
    { key: 'id', label: 'Device ID' },
    { key: 'type', label: 'Type' },
    { key: 'farm', label: 'Farm' },
    { key: 'pond', label: 'Pond' },
    { key: 'owner', label: 'Owner' },
    { key: 'lastSeen', label: 'Last Seen' },
  ];

  if (isLoading) {
    return (
      <Box p={4}>
        <Heading size="md">Loading devices...</Heading>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={4}>
        <Heading size="md" color="red.500">
          Failed to load devices.
        </Heading>
      </Box>
    );
  }

  const farmOptions = farms.map((f: any) => ({ label: f.name, value: f.id }));
  const pondOptions = ponds.map((p: any) => ({ label: p.name, value: p.id }));
  const userOptions = users.map((u: any) => ({ label: u.name, value: u.id }));

  return (
    <Box w="100%" minW={maxW} mx="auto">
      <Flex justify="space-between" align="center" mb={16} px={4} flexWrap="wrap">
        <Heading size="lg">Devices</Heading>
      </Flex>

      <InStockDevicesTable
          isLinkModalOpen={isLinkModalOpen}
          setIsLinkModalOpen={setIsLinkModalOpen}
          farms={farmOptions}
          ponds={pondOptions}
          users={userOptions}
          refetchDevices={refetchDevices}
        />

       <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">Available Devices</Heading>
      </Flex>

      <SearchFilterBar
        searchPlaceholder="Search by device ID or type"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Last Seen',
            value: lastSeenFilter,
            options: [
              { label: 'Today', value: 'today' },
              { label: 'Last 7 Days', value: '7days' },
              { label: 'Last 30 Days', value: '30days' },
            ],
            onChange: setLastSeenFilter,
          },
        ]}
        onClearFilters={() => {
          setSearchQuery('');
          setLastSeenFilter('');
        }}
      />

      <TableContainer border="1px solid" borderColor="gray.200" borderRadius="md" overflowX="auto">
        <Table variant="simple" size={{ xs: 'md', md: 'sm' }}>
          <Thead bg="gray.100">
            <Tr>
              {deviceColumns.map((col) => (
                <Th key={col.key} fontSize={{ base: 'xs', md: 'sm' }}>
                  {col.label}
                </Th>
              ))}
              <Th fontSize={{ base: 'xs', md: 'sm' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allDevices.length === 0 ? (
  <Tr>
    <Td colSpan={deviceColumns.length + 1} textAlign="center" py={6}>
      No available devices found.
    </Td>
  </Tr>
) : filteredDevices.length === 0 ? (
  <Tr>
    <Td colSpan={deviceColumns.length + 1} textAlign="center" py={6}>
      No devices found based on current filters.
    </Td>
  </Tr>
) : (
  filteredDevices.map((device) => (
    <Tr key={device.id}>
      {deviceColumns.map((col) => (
                <Td
                  border="1px solid"
                  borderColor="gray.200"
                  key={col.key}
                  fontSize={{ base: 'xs', md: 'sm' }}
                >
                  {(device as any)[col.key]}
                </Td>
              ))}
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => setEditingDevice(device)}
                >
                  Edit
                </Button>
              </Td>
            </Tr>
          ))
        )}
          </Tbody>
        </Table>
      </TableContainer>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

    </Box>
  );
};

export default Devices;

