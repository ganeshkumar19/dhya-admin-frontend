import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { updateFarm, UpdateFarmPayload } from '../../api/farms';



type Farm = {
  id: number;
  name: string;
  location: string;
  userId: number;
  farmSize: string;
  farmType: string;
  waterSource: string;
};
type FarmSizeOption = {
  id: number;
  name: string;
  sizeType: string;
};

type FarmTypeOption = {
  id: number;
  name: string;
  farmType: string;
};

type WaterSourceOption = {
  id: number;
  name: string;
  srcType: string;
};

type EditFarmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm | null;
  farmSizes: FarmSizeOption[];
  farmTypes: FarmTypeOption[];
  waterSources: WaterSourceOption[];
};


  const EditFarmModal: React.FC<EditFarmModalProps> = ({
    isOpen,
    onClose,
    farm,
    farmSizes,
    farmTypes,
    waterSources
  }) => {
  const [farmSize, setFarmSize] = useState('');
  const [farmType, setFarmType] = useState('');
  const [waterSrc, setWaterSrc] = useState('');
  const toast = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    console.log(farm)
    if (farm) {
      setFarmSize(farm.farmSize || '');
      setFarmType(farm.farmType || '');
      setWaterSrc(farm.waterSource || '');
    }
  }, [farm]);

  
  useEffect(() => {
    if (farm) {
      setFarmSize(farm.farmSize);
      setFarmType(farm.farmType);
      setWaterSrc(farm.waterSource);
    }
  }, [farm]);

  const handleSave = async () => {
    if (!farm) return;
    try {
      const payload: UpdateFarmPayload = { farmSize, farmType, waterSrc };
      await updateFarm(String(farm.id), payload);
      toast({ title: 'Farm updated', status: 'success', duration: 3000 });
      qc.invalidateQueries({ queryKey: ['farms'] })
      onClose();
    } catch (err) {
      console.error(err);
      toast({ title: 'Update failed', status: 'error', duration: 3000 });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Farm</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Farm Size</FormLabel>
            <Select
              placeholder="Select Farm Size"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
            >
              {farmSizes.map((size) => (
                <option key={size.id} value={size.sizeType}>
                  {size.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Farm Type</FormLabel>
            <Select
              placeholder="Select Farm Type"
              value={farmType}
              onChange={(e) => setFarmType(e.target.value)}
            >
              {farmTypes.map((type) => (
                <option key={type.id} value={type.farmType}>
                  {type.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Water Source</FormLabel>
            <Select
              placeholder="Select Water Source"
              value={waterSrc}
              onChange={(e) => setWaterSrc(e.target.value)}
            >
              {waterSources.map((source) => (
                <option key={source.id} value={source.srcType}>
                  {source.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditFarmModal;
