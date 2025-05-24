import {
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Button,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface SearchFilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (val: string) => void;

  filters: {
    label: string;
    value: string;
    options: any[];
    onChange: (val: string) => void;
  }[];

  onClearFilters: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters,
  onClearFilters,
}) => {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} spacing={4} px={4} mb={6} justifyContent="space-between">
      <InputGroup maxW={{ base: '100%', md: '500px' }}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          fontSize={{ base: 'sm', md: 'md' }}
        />
      </InputGroup>

      {/* Filter Popover */}
      <HStack spacing={4} alignItems="center">
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button variant="outline" maxW="200px">Filter</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Filter Options</PopoverHeader>
            <PopoverBody>
              <Stack spacing={4}>
                {filters.map((filter, idx) => (
                  <Select
                    key={idx}
                    placeholder={`By ${filter.label}`}
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                  >
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                ))}
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {/* Clear Button */}
        <Button
          variant="ghost"
          colorScheme="red"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </HStack>
    </Stack>
  );
};

export default SearchFilterBar;
