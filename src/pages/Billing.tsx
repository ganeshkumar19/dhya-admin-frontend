import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Flex,
  Text,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import Pagination from '../components/dashboard/Pagination';
import SearchFilterBar from '../components/dashboard/SearchFilterBar';
import { useDisclosure } from '@chakra-ui/react';
import CreateSubscriptionModal from '../components/modals/CreateSubscriptionModal';
import { fetchSubscriptions } from '../api/plans';
import { useQuery } from '@tanstack/react-query';
import { TruncatedCell } from '../helpers/TruncatedCell';

type BillingStatus = 'PAID' | 'PENDING' | 'FAILED';

type BillingItem = {
  id: string;
  planId: string;
  amount: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  status: BillingStatus;
};

// Dummy billing data (6–7 items)
const dummyBillingData: BillingItem[] = [
  {
    id: '1',
    planId: 'PLAN_BASIC',
    amount: 500,
    startTime: '2024-12-01T00:00:00Z',
    endTime: '2025-01-01T00:00:00Z',
    createdAt: '2024-12-01T10:30:00Z',
    status: 'PAID',
  },
  {
    id: '2',
    planId: 'PLAN_PRO',
    amount: 1200,
    startTime: '2024-11-01T00:00:00Z',
    endTime: '2024-12-01T00:00:00Z',
    createdAt: '2024-11-01T09:15:00Z',
    status: 'PAID',
  },
  {
    id: '3',
    planId: 'PLAN_ENTERPRISE',
    amount: 5000,
    startTime: '2024-10-01T00:00:00Z',
    endTime: '2024-11-01T00:00:00Z',
    createdAt: '2024-10-01T08:45:00Z',
    status: 'PAID',
  },
  {
    id: '4',
    planId: 'PLAN_PRO',
    amount: 1200,
    startTime: '2024-09-01T00:00:00Z',
    endTime: '2024-10-01T00:00:00Z',
    createdAt: '2024-09-01T08:00:00Z',
    status: 'FAILED',
  },
  {
    id: '5',
    planId: 'PLAN_BASIC',
    amount: 500,
    startTime: '2024-08-01T00:00:00Z',
    endTime: '2024-09-01T00:00:00Z',
    createdAt: '2024-08-01T10:00:00Z',
    status: 'PENDING',
  },
  {
    id: '6',
    planId: 'PLAN_ENTERPRISE',
    amount: 5000,
    startTime: '2024-07-01T00:00:00Z',
    endTime: '2024-08-01T00:00:00Z',
    createdAt: '2024-07-01T11:30:00Z',
    status: 'PAID',
  },
];

const Billing = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    planId: '',
    amount: '',
    status: '',
  });
    const itemsPerPage = 5;

  const clearFilters = () =>
  setFilters({ planId: '', amount: '', status: '' });

  const { data: billingData = [], isLoading } = useQuery({
  queryKey: ['subscriptions'],
  queryFn: fetchSubscriptions,
  refetchOnWindowFocus: false,
  retry: false
   });

   console.log('data', billingData)

  const columns = [
  { key: 'userId', label: 'User ID' },
  { key: 'tenantId', label: 'Tenant ID' },
  { key: 'plan', label: 'Plan' },
  { key: 'amount', label: 'Amount (₹)' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'status', label: 'Status' },
];


  const filteredData = billingData.filter((item: any) => {
  const matchesSearch = item.plan?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesPlan = filters.planId ? item.plan?.subscriptionType === filters.planId : true;
  const matchesAmount = filters.amount ? item.plan?.amount.toString() === filters.amount : true;
  const matchesStatus = filters.status ? item.status === filters.status : true;

  return matchesSearch && matchesPlan && matchesAmount && matchesStatus;
});


const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const currentData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);



  return (
    <Box w="100%" mx="auto">
      <Flex justify="space-between" align="center" mb={16} px={4} flexWrap="wrap">
            <Heading size="lg">Billing</Heading>
            <Button bg="green.800" color="white" _hover={{ bg: 'green.700' }} onClick={onOpen}>
              Create Subscription
            </Button>
          </Flex>

<SearchFilterBar
  searchPlaceholder="Search by Plan ID"
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  onClearFilters={clearFilters}
  filters={[
    {
      label: 'Plan ID',
      value: filters.planId,
      options: [...new Set(dummyBillingData.map((item) => item.planId))].map((id) => ({
        label: id,
        value: id,
      })),
      onChange: (val) => setFilters((prev) => ({ ...prev, planId: val })),
    },
    {
      label: 'Amount',
      value: filters.amount,
      options: [...new Set(dummyBillingData.map((item) => item.amount))].map((amt) => ({
        label: `₹${amt}`,
        value: amt.toString(),
      })),
      onChange: (val) => setFilters((prev) => ({ ...prev, amount: val })),
    },
    {
      label: 'Status',
      value: filters.status,
      options: ['PAID', 'PENDING', 'FAILED'].map((status) => ({
        label: status,
        value: status,
      })),
      onChange: (val) => setFilters((prev) => ({ ...prev, status: val })),
    },
  ]}
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
        <Table variant="simple" size={{ base: 'md', md: 'sm' }}>
          <Thead bg="gray.100">
            <Tr>
              {columns.map((col) => (
                <Th key={col.key} fontSize={{ base: 'xs', md: 'sm' }}>
                  {col.label}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
           {isLoading ? (
  <Tr>
    <Td colSpan={columns.length}>Loading...</Td>
  </Tr>
) : currentData.length > 0 ? (
  currentData.map((item: any) => (
    <Tr key={item.id}>
     <TruncatedCell value={item.userId} />
     <TruncatedCell value={item.tenantId} />
     <TruncatedCell value={item.plan?.name || 'N/A'} />
      <Td>₹{item.amount}</Td>
      <Td>
  {new Date(item.startDate).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })}
</Td>
<Td>
  {new Date(item.endDate).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })}
</Td>
      <Td>{new Date(item.createdAt).toLocaleDateString()}</Td>
      <Td>
        <Text
          color={
            item.status === 'PAID'
              ? 'green.500'
              : item.status === 'PENDING'
              ? 'orange.500'
              : 'red.500'
          }
          fontWeight="medium"
        >
          {item.status}
        </Text>
      </Td>
    </Tr>
  ))
) : (
  <Tr>
    <Td colSpan={columns.length} textAlign="center" py={6}>
      No billing records found.
    </Td>
  </Tr>
)}
          </Tbody>
        </Table>
      </TableContainer>

      <CreateSubscriptionModal isOpen={isOpen} onClose={onClose} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default Billing;
