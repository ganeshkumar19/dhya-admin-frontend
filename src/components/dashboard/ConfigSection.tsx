import React from 'react';
import {
  Box,
  Heading,
  HStack,
  Input,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Spinner,
  Text,
} from '@chakra-ui/react';

interface ConfigSectionProps {
  title: string;
  items: string[];
  newItem: string;
  setNewItem: React.Dispatch<React.SetStateAction<string>>;
  onAdd: () => void;
  isLoading?: boolean;
  isError?: boolean;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({
  title,
  items,
  newItem,
  setNewItem,
  onAdd,
  isLoading,
  isError,
}) => (
  <Box w="100%" mb={6}>
    <Heading size="sm" mb={3}>{title}</Heading>
    <HStack mb={3}>
      <FormControl>
        <FormLabel srOnly>{title}</FormLabel>
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Add new ${title.toLowerCase()}`}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={onAdd}>Add</Button>
    </HStack>
    {isLoading ? (
      <Spinner size="sm" />
    ) : isError ? (
      <Text color="red.500">Failed to load</Text>
    ) : (
      <Box display={"flex"} flexDirection="column" gap="10px">
        <Heading size="xs">{title}</Heading>
        <Text>{items.join(', ')}</Text>
      </Box>
    )}
    <Divider mt={4} />
  </Box>
);

export default ConfigSection;
