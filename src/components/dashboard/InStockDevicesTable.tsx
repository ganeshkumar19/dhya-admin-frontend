import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Text,
  Spinner,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { fetchDeviceTypes, fetchInStockDevices } from '../../api/devices';
import Pagination from './Pagination';
import SearchFilterBar from './SearchFilterBar';
import AddDeviceModal from '../modals/AddDeviceModal';
import LinkDeviceModal from '../modals/LinkDeviceModal';


interface InStockDevicesTableProps {
  farms: any[];
  ponds: any[];
  users: any[];
  isLinkModalOpen: boolean;
  setIsLinkModalOpen: (val: boolean) => void;
  refetchDevices: () => void;
}

const InStockDevicesTable = ({ farms, ponds, users, isLinkModalOpen, setIsLinkModalOpen, refetchDevices }: InStockDevicesTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
  const {
  data,
  isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: ['inStockDevices', currentPage, typeFilter, statusFilter],
  queryFn: () => fetchInStockDevices(currentPage, typeFilter || undefined, statusFilter || undefined),
  placeholderData: (previousData) => previousData,
  retry: false,
});



  const instockdevices = data?.devices || [];
  const totalPages = data?.pagination?.totalPages || 1;

   const { data: deviceTypes = []} = useQuery({
    queryKey: ['deviceTypes'],
    queryFn: fetchDeviceTypes,
    enabled: isOpen, 
    retry: false// only fetch when modal is open
  });
  

  const handleEdit = () => {
    
  };

  const handleLink = () => {
  };


  const typeOptions = useMemo(() => {
  return deviceTypes.map((device) => ({
    label: device.type,
    value: device.type,
  }));
}, [deviceTypes]);

  const statusOptions = useMemo(() => {
    const statuses = new Set(instockdevices.map((d) => d.status));
    return Array.from(statuses).map((s) => ({ label: s, value: s }));
  }, [instockdevices]);

  // Apply search and filters
  const searchedDevices = instockdevices.filter((device) =>
  device.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
  device.type.toLowerCase().includes(searchQuery.toLowerCase())
);



  return (
    <Box mb={8}>
      <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">New Devices</Heading>
            <Button colorScheme="teal" size="sm" onClick={onOpen}>
                Add New Device
            </Button>
     </Flex>

      
      <SearchFilterBar
        searchPlaceholder="Search by Device ID or Type"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Type',
            value: typeFilter,
            options: typeOptions,
            onChange: setTypeFilter,
          },
          {
            label: 'Status',
            value: statusFilter,
            options: statusOptions,
            onChange: setStatusFilter,
          },
        ]}
        onClearFilters={() => {
          setSearchQuery('');
          setTypeFilter('');
          setStatusFilter('');
        }}
      />

      {isLoading ? (
        <Flex justify="center" align="center" minH="100px">
          <Spinner />
        </Flex>
      ) : isError ? (
        <Text color="red.500">Failed to load in-stock devices.</Text>
      ) : (
        <>
          <TableContainer
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            overflowX="auto"
          >
            <Table size={{ base: 'md', md: 'sm' }} variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th fontSize={{ base: 'xs', md: 'sm' }}>Device ID</Th>
                  <Th fontSize={{ base: 'xs', md: 'sm' }}>Type</Th>
                  <Th fontSize={{ base: 'xs', md: 'sm' }}>State</Th>
                  <Th fontSize={{ base: 'xs', md: 'sm' }}>Status</Th>
                  <Th fontSize={{ base: 'xs', md: 'sm' }}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {searchedDevices.length > 0 ? (
                  searchedDevices.map((device) => (
                    <Tr key={device.id}>
                      <Td fontSize={{ base: 'xs', md: 'sm' }}>{device.deviceId}</Td>
                      <Td fontSize={{ base: 'xs', md: 'sm' }}>{device.type}</Td>
                      <Td fontSize={{ base: 'xs', md: 'sm' }}>{device.state}</Td>
                      <Td fontSize={{ base: 'xs', md: 'sm' }}>{device.status}</Td>
                      <Td>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => {}}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="green"
                    onClick={() => {
                      setSelectedDeviceId(device.deviceId);
                      setIsLinkModalOpen(true);
                    }}
                  >
                    Link
                  </Button>

                </Td>

                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={6}>
                      <Text fontSize="sm">No available devices</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>

           <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
          <LinkDeviceModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          users={users}
          deviceId={selectedDeviceId}
          onSubmit={() => {
            console.log('Selected:');
          }}
          refetchDevices={refetchDevices}
        />
            <AddDeviceModal isOpen={isOpen} onClose={onClose} onDeviceAdded={refetch}  deviceTypes={deviceTypes}/>
        </>
      )}
    </Box>
  );
};

export default InStockDevicesTable;
