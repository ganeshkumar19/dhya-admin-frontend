import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Box,
  Text,
  Flex,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { AddFarmInPond } from '../../types/ponds';
import { addPond } from '../../api/ponds';
import { useQueryClient } from '@tanstack/react-query';



type Farm = {
  id: number;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  farms: Farm[];
  pondSizes: { name: string; sizeType: string }[];
  speciesList: { name: string; speciesType: string }[];
};


const AddPondModal = ({ isOpen, onClose, farms, pondSizes, speciesList }: Props) => {
   const queryClient = useQueryClient();
  const toast = useToast();
  const [pondForm, setPondForm] = useState<AddFarmInPond>({
    pondName: '',
    pondSize: '',
    stockingDensity: '',
    species: '',
    monitoring: 'manual',
    newDeviceId: '',
    deviceIds: [],
    farmId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPondForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDevice = () => {
    if (pondForm.newDeviceId.trim()) {
      setPondForm(prev => ({
        ...prev,
        deviceIds: [...prev.deviceIds, prev.newDeviceId.trim()],
        newDeviceId: '',
      }));
    }
  };

  const handleSubmit = async () => {
  const { pondName, pondSize, stockingDensity, species, farmId } = pondForm;

  if (!pondName || !pondSize || !stockingDensity || !species || !farmId) {
    toast({
      title: 'Missing Fields',
      description: 'Please fill all required fields',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  try {
    await addPond({
      name: pondName,
      size: pondSize,
      density: parseFloat(stockingDensity),
      species,
      farmId: farmId.toString(),
    });

    queryClient.invalidateQueries({ queryKey: ['ponds'] });

    toast({
      title: 'Pond added successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    onClose();
    setPondForm({
      pondName: '',
      pondSize: '',
      stockingDensity: '',
      species: '',
      monitoring: 'manual',
      newDeviceId: '',
      deviceIds: [],
      farmId: '',
    });

  } catch (error: any) {
    toast({
      title: 'Error adding pond',
      description: error?.response?.data?.message || error.message || 'Something went wrong',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" scrollBehavior="inside" closeOnOverlayClick={false}
    closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Pond</ModalHeader>
        <ModalCloseButton />
        <ModalBody sx={{
                    '&::-webkit-scrollbar': {
                    width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                    background: 'gray.100',
                    borderRadius: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                    background: 'gray.400',
                    borderRadius: '8px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                    background: 'gray.500',
                    },
                }}>
          <FormControl mb={4}>
            <FormLabel>Pond Name</FormLabel>
            <Input name="pondName" value={pondForm.pondName} onChange={handleChange} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Pond Size</FormLabel>
            <Select placeholder="Select size" name="pondSize" value={pondForm.pondSize} onChange={handleChange}>
              {pondSizes.map(size => (
                <option key={size.sizeType} value={size.sizeType}>
                  {size.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Stocking Density</FormLabel>
            <Input
              type="number"
              name="stockingDensity"
              value={pondForm.stockingDensity}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Species</FormLabel>
            <Select placeholder="Select species" name="species" value={pondForm.species} onChange={handleChange}>
              {speciesList.map(species => (
                <option key={species.speciesType} value={species.speciesType}>
                  {species.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Farm</FormLabel>
            <Select placeholder="Select farm" name="farmId" value={pondForm.farmId} onChange={handleChange}>
              {farms.map(farm => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Device ID</FormLabel>
            <Flex>
              <Input
                name="newDeviceId"
                value={pondForm.newDeviceId}
                onChange={handleChange}
                placeholder="Enter device ID"
              />
              <Button ml={2} onClick={handleAddDevice}>
                Add
              </Button>
            </Flex>
            <Box mt={2}>
              {pondForm.deviceIds.map((id, idx) => (
                <Text key={idx} fontSize="sm">• {id}</Text>
              ))}
            </Box>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>Cancel</Button>
          <Button colorScheme="green" onClick={handleSubmit}>Add Pond</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddPondModal;
