import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, FormControl, FormLabel, Input, Stack, Checkbox,
  CheckboxGroup, Box, Button, useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { addUser } from '../../api/users';
import { useQuery } from '@tanstack/react-query';
import { fetchRoles } from '../../api/roles';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const dummyRoles = ['Admin', 'Manager', 'User'];

const AddUserModal = ({ isOpen, onClose, onUserAdded }: AddUserModalProps) => {
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [preferLang, setPreferLang] = useState('en');
  const [roles, setRoles] = useState<string[]>([]);
  const [address, setAddress] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setPreferLang('en');
    setRoles([]);
    setAddress({
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    });
  };

  const { data: availableRoles = [], isLoading, isError } = useQuery({
  queryKey: ['roles'],
  queryFn: fetchRoles,
  enabled: isOpen, // only fetch when modal is open
});

  const handleSubmit = async () => {
    if (!name || !email || !password || roles.length === 0) {
      toast({
        title: 'Please fill all required fields and select at least one role',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name,
      email,
      phone,
      password,
      preferLang,
      roles,
      address: [address],
    };

    try {
      await addUser(payload);
      toast({
        title: 'User added successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onUserAdded();
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: 'Failed to add user.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New User</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxH={"70vh"} overflowY="auto">
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </FormControl>

            <FormControl>
              <FormLabel>Preferred Language</FormLabel>
              <Input value={preferLang} onChange={(e) => setPreferLang(e.target.value)} placeholder="en" />
            </FormControl>

              <FormControl isRequired>
                <FormLabel>Roles</FormLabel>
                <CheckboxGroup value={roles} onChange={(values) => setRoles(values as string[])}>
                  <Stack spacing={2} direction="row" wrap="wrap">
                    {availableRoles.map((role: any) => (
                      <Checkbox key={role.id} value={role.roleType} fontSize="14px">
                        {role.roleType.toLowerCase()}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>


            <Box borderWidth="1px" borderRadius="md" p={4}>
              <FormLabel>Address</FormLabel>
              <Stack spacing={2}>
                <Input placeholder="Address" value={address.address} onChange={(e) => handleAddressChange('address', e.target.value)} />
                <Input placeholder="City" value={address.city} onChange={(e) => handleAddressChange('city', e.target.value)} />
                <Input placeholder="State" value={address.state} onChange={(e) => handleAddressChange('state', e.target.value)} />
                <Input placeholder="Country" value={address.country} onChange={(e) => handleAddressChange('country', e.target.value)} />
                <Input placeholder="Pincode" value={address.pincode} onChange={(e) => handleAddressChange('pincode', e.target.value)} />
              </Stack>
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={() => { resetForm(); onClose(); }} mr={3}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={handleSubmit} isLoading={isSubmitting}>
            Add User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;

