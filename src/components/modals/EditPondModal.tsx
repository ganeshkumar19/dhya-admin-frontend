import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input,
  Select, Button, useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { updatePond } from '../../api/ponds';
import { PondSizeOption, SpeciesOption } from '../../types/ponds';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pond: {
    id: string;
    name: string;
    size: string;
    density: number;
    species: string;
  };
  pondSizes: PondSizeOption[];
  speciesList: SpeciesOption[];
  onUpdated: () => void;
};

const EditPondModal = ({ isOpen, onClose, pond, pondSizes, speciesList, onUpdated }: Props) => {
  const toast = useToast();
  const [formData, setFormData] = useState({ ...pond });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'density' ? Number(value) : value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.size || !formData.density || !formData.species) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updatePond(pond.id, {
        name: formData.name,
        size: formData.size,
        density: formData.density,
        species: formData.species,
      });
      toast({
        title: 'Pond updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onUpdated();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error updating pond',
        description: error?.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Pond</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Size</FormLabel>
            <Select name="size" value={formData.size} onChange={handleChange}>
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
              name="density"
              value={formData.density}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Species</FormLabel>
            <Select name="species" value={formData.species} onChange={handleChange}>
              {speciesList.map(species => (
                <option key={species.speciesType} value={species.speciesType}>
                  {species.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isSubmitting}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPondModal;