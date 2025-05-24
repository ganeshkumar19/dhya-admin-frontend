// src/components/modals/RegisterUserModal.tsx

import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
  Input, useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { completeUserRegistration } from '../../api/users';

type RegisterUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    status: string
    registrationStatus: string
  } | null;
  onRegisterSuccess?: () => void;
};

const RegisterUserModal = ({ isOpen, onClose, user, onRegisterSuccess }: RegisterUserModalProps) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    status: '',
  });

  // Pre-fill form when user is provided
 useEffect(() => {
  if (user) {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.mobile,
      password: '',
      location: '',
      status: user.registrationStatus || '', // assuming status is the registrationStatus
    });
  }
}, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await completeUserRegistration(user.id, formData);
      toast({
        title: 'User registered successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      onRegisterSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Complete Registration</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Email</FormLabel>
            <Input name="email" value={formData.email} onChange={handleChange} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Phone</FormLabel>
            <Input name="phone" value={formData.phone} isDisabled />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Location</FormLabel>
            <Input name="location" value={formData.location} onChange={handleChange} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterUserModal;
