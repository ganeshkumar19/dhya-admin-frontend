import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  useToast,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { addNewDevice, DeviceTypeOption} from '../../api/devices';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceAdded: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceAdded: () => void;
  deviceTypes: DeviceTypeOption[]; // <- Add this
}


const AddDeviceModal = ({ isOpen, onClose, onDeviceAdded, deviceTypes }: AddDeviceModalProps) => {
  const toast = useToast();

  const [deviceId, setDeviceId] = useState('');
  const [type, setType] = useState('');
  const [firmwareVersion, setFirmwareVersion] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
  try {
    setIsSubmitting(true);
    await addNewDevice({
      deviceId,
      type,
      firmwareVersion,
      location,
    });

    toast({
      title: 'Device added successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    onClose();
    onDeviceAdded();
  } catch (error) {
    toast({
      title: 'Failed to add device.',
      description: 'Something went wrong.',
      status: 'error',
      duration: 4000,
      isClosable: true,
    });
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Device</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Device ID</FormLabel>
              <Input value={deviceId} onChange={(e) => setDeviceId(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Type</FormLabel>
              <Select
                placeholder="Select type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {deviceTypes.map((dt) => (
                  <option key={dt.id} value={dt.deviceType}>
                    {dt.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Firmware Version</FormLabel>
              <Input value={firmwareVersion} onChange={(e) => setFirmwareVersion(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3} variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isSubmitting}>
            Add Device
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddDeviceModal;