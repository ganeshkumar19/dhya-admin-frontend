import {
    Box, Button, Flex, Heading, Table, Tbody, Td, Th, Thead,
    Tr, TableContainer, useDisclosure, useBreakpointValue,
    Text
  } from '@chakra-ui/react';
import { useState } from 'react';

import SearchFilterBar from '../components/dashboard/SearchFilterBar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPonds, fetchPondSizes, fetchPondSpecies } from '../api/ponds';
import { PondSizeOption, SpeciesOption } from '../types/ponds';
import Pagination from '../components/dashboard/Pagination';
import AddPondModal from '../components/modals/AddPondModal';
import { fetchAllFarms } from '../api/dropdown';
import EditPondModal from '../components/modals/EditPondModal';


 
type Pond = {
  id: string;
  name: string;
  size: string;
  density: number;
  species: string;
  lastFeed: string;
  avgWeight: number;
  growthRate: number;
  feedToday: number;
  fcr: number;
  daysInCycle: number;
  totalStock: number;
  do_mg_l: number;
  temp_c: number;
  ph: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  salinity: number;
  turbidity: number;
  tds: number;
  orp: number;
  chlorine: number;
  water_level: number;
  farmId: string;
  createdAt: string;
  updatedAt: string;
  farm: Farm;
};

type Farm = {
  id: string;
  name: string;
  location: string;
  ownerId: string;
};


// Dummy filter options

const Ponds = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
  onOpen: onEditOpen,
} = useDisclosure();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPond, setSelectedPond] = useState<Pond | null>(null);
  const queryClient = useQueryClient()
  const { data: pondsData, isLoading, error } = useQuery({
  queryKey: ['ponds', currentPage, filterSize, filterSpecies],
  queryFn: () =>
    fetchPonds(currentPage, {
      size: filterSize || undefined,
      species: filterSpecies || undefined,
    }),
  placeholderData: (prev) => prev,
});

    const { data: pondSizes = [] } = useQuery<PondSizeOption[]>({
    queryKey: ['pondSizes'],
    queryFn: fetchPondSizes,
    refetchOnWindowFocus: false,
  });

const { data: speciesList = [] } = useQuery<SpeciesOption[]>({
  queryKey: ['pondSpecies'],
  queryFn: fetchPondSpecies,
  refetchOnWindowFocus: false,
});

const { data: farms = [] } = useQuery({
    queryKey: ['allfarms'],
    queryFn: fetchAllFarms,
    enabled: isOpen,
  });




  const ponds = pondsData?.ponds || [];
  const totalPages = pondsData?.pagination?.totalPages || 1;

  const serverFilteredPonds = pondsData?.ponds || [];

  const filteredPonds = serverFilteredPonds.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.farm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pondColumns = [
    { key: 'name', label: 'Name' },
    { key: 'farmId', label: 'Farm' },
    { key: 'size', label: 'Size' },
    { key: 'density', label: 'Density' },
    { key: 'species', label: 'Species' },
  ];

  return (
    <Box w="100%" mx="auto">
      <Flex justify="space-between" align="center" mb={6} px={4} flexWrap="wrap">
        <Heading size="lg">Ponds</Heading>
        <Button bg="green.800" color="white" onClick={onOpen} _hover={{ bg: 'green.700' }}>
          Add New Pond
        </Button>
      </Flex>

      <SearchFilterBar
        searchPlaceholder="Search by name, farm"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Size',
            value: filterSize,
            options: pondSizes.map(s => ({ label: s.name, value: s.sizeType })),
            onChange: setFilterSize,
          },
          {
            label: 'Species',
            value: filterSpecies,
            options: speciesList.map(s => ({ label: s.name, value: s.speciesType })),
            onChange: setFilterSpecies,
          },
        ]}
        onClearFilters={() => {
          setSearchQuery('');
          setFilterSize('');
          setFilterSpecies('');
        }}
      />

      <TableContainer border="1px solid" borderColor="gray.200" borderRadius="md" overflowX="auto" maxW={{ base: '100%' }}
        mx="auto">
        <Table variant="simple" size={{xs: 'md', md: 'sm'}}>
          <Thead bg="gray.100">
            <Tr>
              {pondColumns.map(col => (
                <Th key={col.key}  border="1px solid"
                  borderColor="gray.200"
                  fontSize={{ base: 'xs', md: 'sm' }}>{col.label}</Th>
              ))}
              <Th  border="1px solid"
                borderColor="gray.200"
                fontSize={{ base: 'xs', md: 'sm' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
  {filteredPonds.length > 0 ? (
    filteredPonds.map(pond => (
      <Tr key={pond.id}>
        {pondColumns.map(col => (
          <Td
            key={col.key}
            border="1px solid"
            borderColor="gray.200"
            fontSize={{ base: 'xs', md: 'sm' }}
            p={3}
            maxW="200px"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            <Text isTruncated maxW="inherit">
              {col.key === 'farmId' ? pond.farm.name : (pond as any)[col.key]}
            </Text>
          </Td>
        ))}
        <Td>
          <Button
  size="sm"
  colorScheme="blue"
 onClick={() => {
  setSelectedPond(pond);
  onEditOpen();
}}
>
  Edit
</Button>
        </Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={pondColumns.length + 1} textAlign="center">No ponds found</Td>
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

<AddPondModal
  isOpen={isOpen}
  onClose={onClose}
  farms={farms} // Replace with actual farm list if available
  pondSizes={pondSizes}
  speciesList={speciesList}
/>

{selectedPond && (
  <EditPondModal
    isOpen={!!selectedPond}
    onClose={() => setSelectedPond(null)}
    pond={selectedPond}
    pondSizes={pondSizes}
    speciesList={speciesList}
    onUpdated={() => {
      setSelectedPond(null);
      // Optionally refetch ponds
      queryClient.invalidateQueries({ queryKey: ['ponds'] });
    }}
  />
)}

    </Box>
  );
};


export default Ponds;
  