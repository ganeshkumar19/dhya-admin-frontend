import {
  Box, Button, Flex, Heading, Table, TableContainer, Tbody,
  Td, Th, Thead, Tooltip, Tr, useBreakpointValue, useDisclosure
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers } from '../api/users';
import SearchFilterBar from '../components/dashboard/SearchFilterBar';
import Pagination from '../components/dashboard/Pagination';
import AddUserModal from '../components/modals/AddUserModal';
import RegisterUserModal from '../components/modals/RegisterUserModaal';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  mobile: string
  registrationStatus: string,

};


const Users = () => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const maxW = useBreakpointValue({ base: '100%', md: 'container.md' });
  const [registeringUser, setRegisteringUser] = useState<User | null>(null);


  console.log(editingUser)
  // 🧠 UseQuery for fetching users
  const { data, isLoading, isError } = useQuery({
  queryKey: ['users', currentPage], // include currentPage in the query key
  queryFn: () => fetchUsers(currentPage),
  placeholderData: (previousData) => previousData,
});

  const users = data?.users || []
  const totalPages = data?.pagination?.totalPages || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterRole, filterStatus]);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole ? user.role.toLowerCase() === filterRole.toLowerCase() : true;
    const matchesStatus = filterStatus ? user.status.toLowerCase() === filterStatus.toLowerCase() : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const userColumns = [
    { key: 'id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'registrationStatus', label: 'Registration Status' },
  ] as const;


  return (
    <Box w="100%" minW={maxW} mx="auto">
      <Flex justify="space-between" align="center" mb={16} px={4} flexWrap="wrap">
        <Heading size="lg">Users</Heading>
        {/*<Button
          borderRadius={5}
          bg="green.800"
          onClick={onOpen}
          color="white"
          fontSize={{ base: 'xs', md: 'md' }}
          _hover={{ bg: 'green.700' }}
        >
          Add New User
        </Button>*/}
      </Flex>

      <SearchFilterBar
        searchValue={searchQuery}
        searchPlaceholder="Search by name, email"
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Role',
            value: filterRole,
            options: [...new Set(users.map(u => u.role))].map(role => ({ label: role, value: role })),
            onChange: setFilterRole,
          },
          {
            label: 'Status',
            value: filterStatus,
            options: [...new Set(users.map(u => u.status))].map(status => ({ label: status, value: status })),
            onChange: setFilterStatus,
          },
        ]}
        onClearFilters={() => {
          setSearchQuery('');
          setFilterRole('');
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
              {userColumns.map(col => (
                <Th key={col.key} fontSize={{ base: 'xs', md: 'sm' }}>
                  {col.label}
                </Th>
              ))}
              <Th fontSize={{ base: 'xs', md: 'sm' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={userColumns.length + 1} textAlign="center" py={6}>
                  Loading users...
                </Td>
              </Tr>
            ) : isError ? (
              <Tr>
                <Td colSpan={userColumns.length + 1} textAlign="center" py={6}>
                  Failed to load users.
                </Td>
              </Tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <Tr key={user.id}>
                  {userColumns.map(col => (
                    <Td
                    border="1px solid"
                    borderColor="gray.200"
                    key={col.key}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    maxW="150px"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                  >
                    <Tooltip label={user[col.key]} isDisabled={user[col.key]?.length <= 15} hasArrow>
                      <Box as="span" display="inline-block" maxW="100%" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                        {user[col.key]?.length > 15 ? `${user[col.key].slice(0, 15)}...` : user[col.key]}
                      </Box>
                    </Tooltip>
                  </Td>
                  ))}
                 <Td>
                  {user.registrationStatus === 'INCOMPLETE' ? (
                    <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                   <Button size="sm" colorScheme="green" onClick={() => setRegisteringUser(user)}>
                        Register
                      </Button>

                    </Box>
                  ) : (
                     <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                    <Button size="sm" colorScheme="blue" onClick={() => setEditingUser(user)}>
                      Edit
                    </Button>
                    </Box>
                  )}
                </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={userColumns.length + 1} textAlign="center" py={6}>
                  No users found based on current filters.
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

     <RegisterUserModal
  isOpen={!!registeringUser}
  onClose={() => setRegisteringUser(null)}
  user={registeringUser}
  onRegisterSuccess={() => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }}
/>

    <AddUserModal
      isOpen={isOpen}
      onClose={onClose}
      onUserAdded={() => {
        queryClient.invalidateQueries({ queryKey: ['users'] }); // or however you refresh users
      }}
    />
    </Box>
  );
};

export default Users;