import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  HStack,
} from '@chakra-ui/react';

const dummyPondSizes = [
  { name: 'Small', sizeType: 'small' },
  { name: 'Medium', sizeType: 'medium' },
  { name: 'Large', sizeType: 'large' },
];

const dummySpecies = [
  { name: 'Tilapia', speciesType: 'tilapia' },
  { name: 'Catfish', speciesType: 'catfish' },
  { name: 'Shrimp', speciesType: 'shrimp' },
];

const AddPond: React.FC = () => {
  const [form, setForm] = useState({
    pondName: '',
    pondSize: '',
    stockingDensity: '',
    species: '',
    monitoring: 'manual',
    newDeviceId: '',
    deviceIds: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDevice = () => {
    const trimmed = form.newDeviceId.trim();
    if (trimmed && !form.deviceIds.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        deviceIds: [...prev.deviceIds, trimmed],
        newDeviceId: '',
      }));
    }
  };

  const handleRemoveDevice = (id: string) => {
    setForm((prev) => ({
      ...prev,
      deviceIds: prev.deviceIds.filter((d) => d !== id),
    }));
  };

  const handleSubmit = () => {
    const newPond = {
      ...form,
      stockingDensity: Number(form.stockingDensity) || 0,
      deviceIds: form.monitoring === 'sensor' ? form.deviceIds : [],
    };

    console.log('Pond submitted:', newPond);
    alert('Pond added (dummy)');
    // Reset form
    setForm({
      pondName: '',
      pondSize: '',
      stockingDensity: '',
      species: '',
      monitoring: 'manual',
      newDeviceId: '',
      deviceIds: [],
    });
  };

  return (
    <Box maxW="xl" mx="auto" p={6} bg="white" shadow="md" rounded="lg">
      <Stack spacing={5}>
        <FormControl isRequired>
          <FormLabel>Pond Name</FormLabel>
          <Input
            name="pondName"
            value={form.pondName}
            onChange={handleChange}
            placeholder="Enter pond name"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Pond Size</FormLabel>
          <Select name="pondSize" value={form.pondSize} onChange={handleChange} placeholder="Select size">
            {dummyPondSizes.map((opt) => (
              <option key={opt.sizeType} value={opt.sizeType}>
                {opt.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Stocking Density</FormLabel>
          <Input
            name="stockingDensity"
            value={form.stockingDensity}
            onChange={handleChange}
            placeholder="e.g. 1000 per acre"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Species</FormLabel>
          <Select name="species" value={form.species} onChange={handleChange} placeholder="Select species">
            {dummySpecies.map((opt) => (
              <option key={opt.speciesType} value={opt.speciesType}>
                {opt.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Monitoring</FormLabel>
          <RadioGroup
            value={form.monitoring}
            onChange={(val) => setForm((prev) => ({ ...prev, monitoring: val as 'manual' | 'sensor' }))}
          >
            <Stack direction="row">
              <Radio value="manual">Manual</Radio>
              <Radio value="sensor">Sensor</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        {form.monitoring === 'sensor' && (
          <FormControl>
            <FormLabel>Device IDs</FormLabel>
            <HStack>
              <Input
                placeholder="Enter device ID"
                name="newDeviceId"
                value={form.newDeviceId}
                onChange={handleChange}
              />
              <Button size="sm" onClick={handleAddDevice}>
                Add
              </Button>
            </HStack>
            <HStack mt={2} wrap="wrap">
              {form.deviceIds.map((id) => (
                <Tag key={id} size="sm" colorScheme="blue">
                  <TagLabel>{id}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveDevice(id)} />
                </Tag>
              ))}
            </HStack>
          </FormControl>
        )}

        <Button colorScheme="green" onClick={handleSubmit}>
          Add Pond
        </Button>
      </Stack>
    </Box>
  );
};

export default AddPond;
