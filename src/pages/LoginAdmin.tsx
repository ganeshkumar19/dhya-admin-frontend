import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  VStack,
  useToast,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import aquaBg from '../assets/images/aquaintellilanding.jpg';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { login } from '../api/auth';


const LoginAdmin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const toast = useToast();
  const { setAuth } = useAuthStore.getState();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await login({ email, password });

      setAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      });


      toast({
        title: 'Login successful.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error: any) {
      setErrors({ password: 'Invalid email or password' });
    }
  };


  const bgGradient = useColorModeValue('linear(to-br, green.50, blue.50)', 'linear(to-br, gray.800, gray.900)');
  const cardBg = useColorModeValue('white', 'gray.700');
  const overlayColor = useColorModeValue('rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)');

  return (
     <Box minH="100vh" bgGradient={bgGradient} display="flex" flexDirection="column">
      <Box
        position="relative"
        flex="1"
        bgImage={`url(${aquaBg})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        display="flex"

        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, md: 20 }}
        pt={{ base: 8, md: 12 }}
        pb={{ base: 16, md: 18 }}
      >
        <Box position="absolute" inset={0} bg={overlayColor} zIndex={0}/>
    <Flex flex="1" direction="column" align="center" justify="center" px={4} py={12} zIndex={1} position="relative">
    <Box maxW="lg" w="full" bg={cardBg} boxShadow="lg" borderRadius="lg" p={8}>
      <Heading size="md" mb={6} textAlign="center">
        Admin Login
      </Heading>
      <form onSubmit={handleSubmit}>
         <VStack spacing={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Button colorScheme="teal" width="full" type="submit">
                  Login
                </Button>
              </VStack>
      </form>
    </Box>
    </Flex>
    </Box>
      </Box>
  );
};

export default LoginAdmin;
