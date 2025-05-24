import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  VStack,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { fetchFarmsByUserId, fetchPondsByFarmId } from '../../api/dropdown';
import { assignDevice } from '../../api/devices';

type Option = { label: string; value: string };

interface LinkDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: Option[];
  deviceId: string | null
  onSubmit: (selectedFarm: Option, selectedPond: Option, selectedUser: Option) => void;
  refetchDevices: ()=> void
}

const LinkDeviceModal = ({ isOpen, onClose,users, deviceId, onSubmit, refetchDevices }: LinkDeviceModalProps) => {
  const toast = useToast();
  const [selectedFarm, setSelectedFarm] = useState<Option | null>(null);
  const [selectedPond, setSelectedPond] = useState<Option | null>(null);
  const [selectedUser, setSelectedUser] = useState<Option | null>(null);
 


   const { data: farmsData = [], isLoading: isFarmsLoading } = useQuery({
    queryKey: ['farmsByUser', selectedUser?.value],
    queryFn: () => fetchFarmsByUserId(selectedUser!.value), // your API call
    enabled: !!selectedUser,
    retry: false,
  });
  // 🧠 Fetch ponds when a farm is selected
  const { data: pondData = [], isLoading: isLoadingPonds } = useQuery({
    queryKey: ['pondsByFarm', selectedFarm?.value],
    queryFn: () => fetchPondsByFarmId(selectedFarm!.value),
    enabled: !!selectedFarm,
    retry: false,
  });

  useEffect(() => {
    setSelectedFarm(null);
    setSelectedPond(null);
  }, [selectedUser]);

  


  const farmOptions = farmsData.map((farm: any) => ({ label: farm.name, value: farm.id }));
  const pondOptions = pondData.map((pond: any) => ({ label: pond.name, value: pond.id }));

  const handleSubmit = async () => {
    console.log(selectedUser, selectedFarm, selectedPond)
  if (selectedUser && selectedFarm && selectedPond && deviceId) {
    try {
      await assignDevice(deviceId, selectedUser.value, selectedFarm.value, selectedPond.value);

      toast({
        title: 'Device linked successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refetchDevices();
      onClose();
    } catch (error: any) {
      console.error('Error assigning device:', error);
      toast({
        title: 'Failed to link device.',
        description: error.response?.data?.message || 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  } else {
    toast({
      title: 'Please select all fields.',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
  }
};


   return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Link Device</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>User</FormLabel>
              <Select
                options={users}
                value={selectedUser}
                onChange={(option) => setSelectedUser(option)}
                placeholder="Select a user"
              />
            </FormControl>
            <FormControl isRequired isDisabled={!selectedUser || isFarmsLoading}>
              <FormLabel>Farm</FormLabel>
              <Select
                options={farmOptions}
                value={selectedFarm}
                onChange={(option) => setSelectedFarm(option)}
                placeholder={isFarmsLoading ? "Loading farms..." : "Select a farm"}
              />
            </FormControl>
            <FormControl isRequired isDisabled={!selectedFarm || isLoadingPonds}>
              <FormLabel>Pond</FormLabel>
              <Select
                options={pondOptions}
                value={selectedPond}
                onChange={(option) => setSelectedPond(option)}
                placeholder={isLoadingPonds ? "Loading ponds..." : "Select a pond"}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3} variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Link
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LinkDeviceModal;
