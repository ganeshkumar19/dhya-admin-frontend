import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, FormControl, FormLabel, Input, Select, useToast,
  Button
} from '@chakra-ui/react';
import { useState } from 'react';
import { fetchAllDevices, fetchAllUsers } from '../../api/dropdown';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ReactSelect from 'react-select'
import { CreateSupportPayload, createSupportTicket } from '../../api/support';


const severityOptions = ['Low', 'Medium', 'High', 'Critical'];


const AddTicketModal = ({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const [deviceId, setDeviceId] = useState('');
  const [issue, setIssue] = useState('');
  const [severity, setSeverity] = useState('');
  const [user, setUser] = useState('');
  const toast = useToast();

  const { data: users = [] } = useQuery({
    queryKey: ['fetchallusers'],
    queryFn: fetchAllUsers,
    enabled: isOpen,
    retry: false,
  });

  const { data: devices = [] } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchAllDevices,
    enabled: isOpen,
  });

  const deviceOptions = devices.map((d: any) => ({
    label: `${d.deviceId} (${d.type})`,
    value: d.deviceId,
  }));

    const handleSubmit = async () => {
    if (!deviceId || !issue || !severity || !user) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill all required fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      userId: user,
      deviceId,
      issue,
      severity: severity.toUpperCase() as CreateSupportPayload['severity'],
    };

    try {
      const createdTicket = await createSupportTicket(payload);
      toast({
        title: 'Ticket Created',
        description: 'Support ticket has been successfully created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
      onClose();

      // Reset form fields
      setDeviceId('');
      setIssue('');
      setSeverity('');
      setUser('');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to create support ticket. Try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Support Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          maxH="60vh"
          overflowY="auto"
          sx={{
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: 'gray.100', borderRadius: '8px' },
            '&::-webkit-scrollbar-thumb': { background: 'gray.400', borderRadius: '8px' },
            '&::-webkit-scrollbar-thumb:hover': { background: 'gray.500' },
          }}
        >
          <FormControl mb={3} isRequired>
            <FormLabel>Device ID</FormLabel>
            <ReactSelect
              options={deviceOptions}
              value={deviceOptions.find((opt: any) => opt.value === deviceId) || null}
              onChange={(selected) => setDeviceId(selected?.value || '')}
              placeholder="Select device"
              isSearchable
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Issue</FormLabel>
            <Input value={issue} onChange={e => setIssue(e.target.value)} placeholder="Describe the issue" />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Severity</FormLabel>
            <Select placeholder="Select severity" value={severity} onChange={e => setSeverity(e.target.value)}>
              {severityOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Status</FormLabel>
            <Input value="Open" isDisabled />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>User</FormLabel>
            <Select placeholder="Select user" value={user} onChange={e => setUser(e.target.value)}>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTicketModal;

