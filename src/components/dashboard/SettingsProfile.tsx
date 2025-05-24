import {
  Box,
  Text,
  Heading,
  VStack,
  Tag,
  Avatar,
  Flex,
  Card,
  CardBody,
  Divider,
  Badge,
  Center,
} from '@chakra-ui/react';
import { useAuthStore } from '../../store/useAuthStore';

const SettingsProfile = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Text>No user data available.</Text>;

  const { name, email, isAdmin, roles } = user;

  return (
    <Card maxW="md" mx="auto" mt={8} boxShadow="md" borderRadius="xl">
      <CardBody>
        <Center mb={4}>
          <Avatar name={name} size="xl" />
        </Center>

        <Divider color="#000" width={"100%"} mb={4}/>

        <VStack align="start" spacing={6}>
          <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
            <Heading size="xs">Name:</Heading>
            <Text>{name}</Text>
          </Box>
          <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
             <Heading size="xs">Email:</Heading>
             <Text>{email}</Text>
          </Box>


          <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
            <Heading size="xs">Admin Access:</Heading>
              <Badge colorScheme={isAdmin ? 'green' : 'red'}>
                {isAdmin ? 'Yes' : 'No'}
              </Badge>
          </Box>

          <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
            <Text><strong>Roles:</strong></Text>
            <Flex wrap="wrap" gap={2} mt={1}>
              {roles?.length ? (
                roles.map((roleObj: any, idx: number) => (
                  <Tag key={idx} colorScheme="blue" variant="solid">
                    {roleObj.role}
                  </Tag>
                ))
              ) : (
                <Text>No roles assigned</Text>
              )}
            </Flex>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default SettingsProfile;

