import {
  Box, Button, Flex, Heading, Table, Tbody, Td, Th, Thead,
  Tr, TableContainer, useBreakpointValue, useDisclosure
} from '@chakra-ui/react';
import { useState, useMemo, useEffect } from 'react';
import AddTicketModal from '../components/modals/AddTicketModal';
import EditTicketModal from '../components/modals/EditTicketModal';
import SearchFilterBar from '../components/dashboard/SearchFilterBar';
import { useQuery } from '@tanstack/react-query';
import { fetchSupportTickets, SupportTicket as ApiSupportTicket, fetchSeverityTypes, fetchStatusTypes } from '../api/support';
import Pagination from '../components/dashboard/Pagination';
import { fetchAllDevices, fetchAllUsers } from '../api/dropdown';
import { SupportSeverity, SupportStatus } from '../helpers/enum';

// Define the support ticket type
type SupportTicket = {
  id: number,
  ticketNo: string;
  deviceId: string;
  issue: string;
  severity: string;
  status: string;
  resolution: string;
  user: string;
};


// Dummy data


const Support = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
    const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure();

  const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
 
  

  const { data } = useQuery({
  queryKey: ['supportTickets', currentPage, filterStatus, filterSeverity],
  queryFn: () => fetchSupportTickets(currentPage, filterStatus, filterSeverity),
  placeholderData: (previousData) => previousData,
  retry: false,
  refetchOnWindowFocus: false,
});




 const { data: severityRaw = [], isLoading: isSeverityLoading } = useQuery({
  queryKey: ['severityOptions'],
  queryFn: fetchSeverityTypes,
  staleTime: Infinity,
});

const { data: statusRaw = [], isLoading: isStatusLoading } = useQuery({
  queryKey: ['statusOptions'],
  queryFn: fetchStatusTypes,
  staleTime: Infinity,
});

const severityOptions = severityRaw.map((item: any) => ({
  label: item.name.trim(),
  value:  item.severityType,
}));

const statusOptions = statusRaw.map((item: any) => ({
  label: item.name.trim(),
  value:  item.statusType
}));



  

  const tickets = data?.tickets ?? [];
const totalPages = data?.pagination?.totalPages ?? 1;
   
console.log('totalpages', data?.pagination?.totalPages)

  const filteredTickets = tickets.filter((ticket: SupportTicket) => {
  const matchesSearch =
    ticket.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.user.toLowerCase().includes(searchQuery.toLowerCase());

  return matchesSearch;
});

  





  const maxW = useBreakpointValue({ base: '100%', md: 'container.md' });

  const columns = [
    { key: 'ticketNo', label: 'Ticket No' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'deviceId', label: 'Device ID' },
    { key: 'issue', label: 'Issue' },
    { key: 'severity', label: 'Severity' },
    { key: 'status', label: 'Status' },
    { key: 'resolution', label: 'Resolution' },
    { key: 'user', label: 'User' },
  ];

   const handleEditClick = (ticket: SupportTicket) => {
    setEditingTicket(ticket);
    onEditOpen();
  };

  return (
    <Box w="100%" minW={maxW} mx="auto">
      <Flex justify="space-between" align="center" mb={16} px={4} flexWrap="wrap">
        <Heading size="lg">Support Tickets</Heading>
        <Button
          borderRadius={5}
          bg="green.800"
          onClick={onOpen}
          color="white"
          fontSize={{ base: 'xs', md: 'md' }}
          _hover={{ bg: 'green.700' }}
        >
          Add New Ticket
        </Button>
      </Flex>

        <SearchFilterBar
        searchValue={searchQuery}
        searchPlaceholder="Search by Ticket No, Device ID or User"
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Severity',
            value: filterSeverity,
            options:severityOptions,
            onChange: setFilterSeverity,
          },
          {
            label: 'Status',
            value: filterStatus,
            options: statusOptions,
            onChange: setFilterStatus,
          }
        ]}
        onClearFilters={() => {
          setSearchQuery('');
          setFilterSeverity('');
          setFilterStatus('');
        }}
      />


      <TableContainer border="1px solid" borderColor="gray.200" borderRadius="md"  
      overflowX={{ base: 'auto', md: 'visible' }}
      sx={{
    '::-webkit-scrollbar': {
      height: '5px',
    },
    '::-webkit-scrollbar-track': {
      background: 'gray.100',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb': {
      background: 'gray.400',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: 'gray.500',
    },
  }}>
        <Table variant="simple" size={{ xs: 'md', md: 'sm' }}>
          <Thead bg="gray.100">
            <Tr>
              {columns.map(col => (
                <Th key={col.key} fontSize={{ base: 'xs', md: 'sm' }}>
                  {col.label}
                </Th>
              ))}
              <Th fontSize={{ base: 'xs', md: 'sm' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket: SupportTicket) => (
                <Tr key={ticket.ticketNo}>
                  {columns.map(col => (
                    <Td
                      border="1px solid"
                      borderColor="gray.200"
                      key={col.key}
                      fontSize={{ base: 'xs', md: 'sm' }}
                    >
                      {(ticket as any)[col.key]}
                    </Td>
                  ))}
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleEditClick(ticket)}
                    >
                      Edit
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length + 1} textAlign="center" py={6}>
                  No tickets found based on current filters.
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



      <AddTicketModal
          isOpen={isOpen}
          onClose={onClose}
        />
    <EditTicketModal
      isOpen={isEditOpen}
      onClose={onEditClose}
      ticket={editingTicket}
    />

    </Box>
  );
};

export default Support;
