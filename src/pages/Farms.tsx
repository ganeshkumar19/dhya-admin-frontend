import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  TableContainer,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import AddFarmModal from '../components/modals/AddFarmModal';
import { useEffect, useState } from 'react';
import EditFarmModal from '../components/modals/EditFarmModal';
import SearchFilterBar from '../components/dashboard/SearchFilterBar';
import { PondSizeOption, SpeciesOption } from '../types/ponds';
import { addFarm, fetchFarms, fetchFarmSizes, fetchFarmTypes, fetchWaterSources } from '../api/farms';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Farm, FarmSize, FarmType, WaterSource } from '../types/farms';
import { useFarmStore } from '../store/useFarmStore';
import { useToast } from '@chakra-ui/react';
import { fetchPondSizes, fetchPondSpecies } from '../api/ponds';
import Pagination from '../components/dashboard/Pagination';
import { fetchAllDevices, fetchAllUsers } from '../api/dropdown';






const Farms = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');  // <-- Correct usage at the top level
  const [filterSize, setFilterSize] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setFarms } = useFarmStore();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);


  const {
  data,
} = useQuery({
  queryKey: ['farms', currentPage, filterSize, filterType, filterSource],
  queryFn: () =>
    fetchFarms(currentPage, {
      farmSize: filterSize || undefined,
      farmType: filterType || undefined,
      waterSrc: filterSource || undefined,
    }),
  placeholderData: (prev) => prev,
});

  console.log('data', data)

    const farmsData = data?.farms || [];
  const totalPages = data?.pagination?.totalPages || 1;

  useEffect(() => {
    if (farmsData.length > 0) {
      setFarms(farmsData);
    }
  }, [farmsData, setFarms]);

   const {
  data: farmSizes = [],
} = useQuery<FarmSize[]>({
  queryKey: ['farmSizes'],
  queryFn: fetchFarmSizes,
  refetchOnWindowFocus: false,
});

const {
  data: farmTypeOptions = [],
} = useQuery<FarmType[]>({
  queryKey: ['farmTypes'],
  queryFn: fetchFarmTypes,
  refetchOnWindowFocus: false,
});

const {
  data: waterSources = [],
} = useQuery<WaterSource[]>({
  queryKey: ['waterSources'],
  queryFn: fetchWaterSources,
  refetchOnWindowFocus: false,
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

const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    enabled: isOpen,
    retry: false,
  });

const { data: devices = [] } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchAllDevices,
    enabled: isOpen,
    retry: false,
  });


  

  // ✅ Enrich farms with pondCount and user name
  const farmsWithExtras: Farm[] = farmsData.map((farm: Farm) => ({
  ...farm,
  farmSize: farm.farmSize,
  farmType:  farm.farmType,
  waterSource: farm.waterSrc,
  pondCount: farm.pondCount || 0,
  user: farm.owner?.name || 'Unknown',
}));



const handleEditClick = (farm: Farm) => {
  setSelectedFarm(farm);
  setIsEditOpen(true);
};




 const handleAddFarm = async (data: { farm: any; pond: any }) => {
  try {
    const newFarm = await addFarm(data);
    console.log('Farm created:', newFarm);
    queryClient.invalidateQueries({ queryKey: ['farms'] });

    toast({
      title: 'Farm created successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Optional: redirect or reset form
  } catch (err) {
    console.error('Failed to create farm:', err);
    toast({
      title: 'Failed to create farm.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};




  
 const filteredFarms = farmsWithExtras.filter((farm) => {
  const matchesSearch =
    farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesSearch;
});




  const maxW = useBreakpointValue({ base: '100%', md: 'container.md' });

  const farmColumns = [
    { key: 'name', label: 'Farm Name' },
    { key: 'location', label: 'Location' },
    { key: 'farmSize', label: 'Farm Size' },
    { key: 'farmType', label: 'Farm Type' },
    { key: 'waterSource', label: 'Water Source' },
    { key: 'pondCount', label: 'Ponds' },
    { key: 'user', label: 'User' },
  ];

  return (
    <Box w="100%" minW={maxW} mx="auto">
      <Flex justify="space-between" align="center" mb={16} px={4} flexWrap="wrap">
        <Heading size="lg">Farms</Heading>
        <Button
          borderRadius={5}
          bg="green.800"
          onClick={onOpen}
          color="white"
          fontSize={{ base: 'xs', md: 'md' }}
          _hover={{ bg: 'green.700' }}
        >
          Add New Farm
        </Button>
      </Flex>

      <SearchFilterBar
        searchPlaceholder="Search by name, location, user..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Size',
            value: filterSize,
            onChange: setFilterSize,
            options: farmSizes.map((s) => ({ label: s.name, value: s.sizeType })),
          },
          {
            label: 'Type',
            value: filterType,
            onChange: setFilterType,
            options: farmTypeOptions.map((t) => ({ label: t.name, value: t.farmType })),
          },
          {
            label: 'Water Source',
            value: filterSource,
            onChange: setFilterSource,
            options: waterSources.map((w) => ({ label: w.name, value: w.srcType })),
          },
        ]}
        onClearFilters={() => {
          setFilterSize('');
          setFilterType('');
          setFilterSource('');
        }}
      />


      <TableContainer
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        overflowX="auto"
        maxW={{ base: '100%' }}
        mx="auto"
      >
        <Table variant="simple" size={{xs: 'md', md: 'xs'}}>
        <Thead bg="gray.100">
  <Tr>
    {farmColumns.map((col) => (
                <Th
                  key={col.key}
                  border="1px solid"
                  borderColor="gray.200"
                  fontSize={{ base: 'xs', md: '13px' }}
                >
                  {col.label}
                </Th>
              ))}
              <Th
                border="1px solid"
                borderColor="gray.200"
                fontSize={{ base: 'xs', md: '13px' }}
              >
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
             {filteredFarms.length === 0 ? (
    <Tr>
      <Td colSpan={farmColumns.length + 1} textAlign="center" py={8}>
        {searchQuery || filterSize || filterType || filterSource
          ? 'No data found based on filtering.'
          : 'No farms available.'}
      </Td>
    </Tr>
  ) : (
    filteredFarms.map((farm: any) => (
      <Tr key={farm.id}>
        {farmColumns.map((col) => (
                  <Td
  key={col.key}
  border="1px solid"
  borderColor="gray.200"
  fontSize={{ base: 'xs', md: '12px' }}
  p={3}
  maxW="100px" // or whatever width you want
  whiteSpace="nowrap"
  overflow="hidden"
  textOverflow="ellipsis"
>
  <Text isTruncated maxW="inherit" fontSize={{base: 'xs', sm: '10px', xl: '13px'}}>
    {(farm as any)[col.key]}
  </Text>
</Td>
                ))}
                <Td>
                  <Button size="sm" colorScheme="blue" onClick={() => handleEditClick(farm)}>
                    Edit
                  </Button>
                </Td>
              </Tr>
            ))
          )}

          </Tbody>

        </Table>
      </TableContainer>
     <AddFarmModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleAddFarm}
        farmSizes={farmSizes}
        farmTypes={farmTypeOptions}
        waterSources={waterSources}
        pondSizes={pondSizes}
        speciesList={speciesList}
        users={users} 
        devices={devices}// ← fetch this using react-query too
      />
  
       <EditFarmModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        farm={selectedFarm}
        farmSizes={farmSizes}
        farmTypes={farmTypeOptions}
        waterSources={waterSources}
      />
       <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Box>
  );
};

export default Farms;