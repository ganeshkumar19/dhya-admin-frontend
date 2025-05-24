import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  VStack,
  Heading,
  useDisclosure,
  Flex,
  Button,
} from '@chakra-ui/react';
import Select from 'react-select';
import { useQuery } from '@tanstack/react-query';
import {
  addFarmSize,
  addFarmType,
  addWaterSource,
  fetchFarmSizes,
  fetchFarmTypes,
  fetchWaterSources
} from '../../api/farms';
import {
  addPondSize,
  addPondSpecies,
  fetchPondSizes,
  fetchPondSpecies
} from '../../api/ponds';
import { addRoles, fetchRoles } from '../../api/roles';
import ConfigSection from './ConfigSection';
import { useTheme } from '@chakra-ui/react';
import AddUserModal from '../modals/AddUserModal';
import { addPlan, fetchPlans } from '../../api/plans';

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const configDefs = [
  {
    title: 'Farm Types',
    key: 'farmTypes',
    fetchFn: fetchFarmTypes,
    addFn: addFarmType,
    getName: (item: any) => item.name,
  },
  {
    title: 'Farm Sizes',
    key: 'farmSizes',
    fetchFn: fetchFarmSizes,
    addFn: addFarmSize,
    getName: (item: any) => item.name,
  },
  {
    title: 'Water Sources',
    key: 'waterSources',
    fetchFn: fetchWaterSources,
    addFn: addWaterSource,
    getName: (item: any) => item.name,
  },
  {
    title: 'Pond Species',
    key: 'pondSpecies',
    fetchFn: fetchPondSpecies,
    addFn: addPondSpecies,
    getName: (item: any) => item.name,
  },
  {
    title: 'Pond Sizes',
    key: 'pondSizes',
    fetchFn: fetchPondSizes,
    addFn: addPondSize,
    getName: (item: any) => item.name,
  },
  {
    title: 'Roles',
    key: 'roles',
    fetchFn: fetchRoles,
    addFn: addRoles,
    getName: (item: any) => item.roleType,
  },
  {
    title: 'Plans',
    key: 'plans',
    fetchFn: fetchPlans,
    addFn: addPlan,
    getName: (item: any) => `${item.name}`, // Display only the plan name
  },
];

const ConfigurationsSettings: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedConfigKey, setSelectedConfigKey] = useState<string | null>(null);
  const [localStates, setLocalStates] = useState(() =>
    configDefs.reduce((acc, config) => {
      acc[config.key] = { items: [] as string[], newItem: '' };
      return acc;
    }, {} as Record<string, { items: string[]; newItem: string }>)
  );

  const theme = useTheme();
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? theme.colors.blue[500] :theme.colors.blue[300], // fallback to gray.300
      boxShadow: state.isFocused ? `0 0 0 1px ${theme.colors.blue[500]}` : 'none',
      '&:hover': {
        borderColor: theme.colors.blue[500],
      },
    }),
  };
  const selectedConfig = useMemo(
    () => configDefs.find((c) => c.key === selectedConfigKey),
    [selectedConfigKey]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: [selectedConfig?.key],
    queryFn: selectedConfig?.fetchFn!,
    enabled: !!selectedConfig,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (selectedConfig && Array.isArray(data)) {
      const names = Array.from(
        new Set(data.map((d: any) => capitalize(selectedConfig.getName(d).trim())))
      );
      setLocalStates((prev) => ({
        ...prev,
        [selectedConfig.key]: {
          ...prev[selectedConfig.key],
          items: names,
        },
      }));
    }
  }, [data, selectedConfig]);

  const handleAdd = async () => {
    if (!selectedConfig) return;
    const key = selectedConfig.key;
    const trimmed = localStates[key].newItem.trim();
    if (!trimmed) return;

    const formatted = capitalize(trimmed);
    const alreadyExists = localStates[key].items.some(
      (item) => item.toLowerCase() === formatted.toLowerCase()
    );
    if (alreadyExists) return;

    try {
      await selectedConfig.addFn(formatted);
      setLocalStates((prev) => ({
        ...prev,
        [key]: {
          newItem: '',
          items: [...prev[key].items, formatted],
        },
      }));
    } catch (err) {
      console.error(`Error adding ${selectedConfig.title}`, err);
    }
  };

  return (
    <VStack align="start" spacing={6} w="100%">
     <Flex justify="space-between" align="center" w="100%">
    <Heading size="md" mb={5} textAlign="center">Configuration Types</Heading>
      <Button colorScheme="blue" onClick={onOpen}>
        Create User
      </Button>
    </Flex>
    <Box width="80%">
    <Select
      placeholder="Select configuration type..."
      options={configDefs.map((c) => ({
        value: c.key,
        label: c.title,
      }))}
      styles={customStyles}
      onChange={(option) => setSelectedConfigKey(option?.value || null)}
    />
    </Box>

      {selectedConfigKey && selectedConfig && (
        <ConfigSection
          key={selectedConfig.key}
          title={selectedConfig.title}
          items={localStates[selectedConfig.key].items}
          newItem={localStates[selectedConfig.key].newItem}
          setNewItem={(val) =>
            setLocalStates((prev) => ({
              ...prev,
              [selectedConfig.key]: {
                ...prev[selectedConfig.key],
                newItem: typeof val === 'function' ? val(prev[selectedConfig.key].newItem) : val,
              },
            }))
          }
          onAdd={handleAdd}
          isLoading={isLoading}
          isError={isError}
        />
      )}

      <AddUserModal
          isOpen={isOpen}
          onClose={onClose}
          onUserAdded={() => {
            // optionally refresh data if needed
          }}
        />

    </VStack>
  );
};

export default ConfigurationsSettings;

