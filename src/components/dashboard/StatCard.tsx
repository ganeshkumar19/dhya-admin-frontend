import { Box, Stat, StatLabel, StatNumber } from '@chakra-ui/react';

interface StatCardProps {
  label: string;
  value: number;
  color: string; // Chakra color token like 'green.400'
}

const StatCard = ({ label, value, color }: StatCardProps) => (
  <Box
    borderWidth="1px"
    borderRadius="md"
    overflow="hidden"
    boxShadow="sm"
    bg="white"
    _dark={{ bg: 'gray.700' }}
    display="flex"
  >
    {/* Colored Side Bar */}
    <Box w="6px" bg={color} />

    {/* Content */}
    <Box p={4} flex="1">
      <Stat>
        <StatLabel fontSize="sm" color="gray.500" _dark={{ color: 'gray.300' }}>
          {label}
        </StatLabel>
        <StatNumber fontSize="2xl">{value}</StatNumber>
      </Stat>
    </Box>
  </Box>
);

export default StatCard;
