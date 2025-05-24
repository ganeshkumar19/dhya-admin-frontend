import { Box, Td, Tooltip } from "@chakra-ui/react";

export const TruncatedCell = ({ value }: { value: string }) => (
  <Td
    border="1px solid"
    borderColor="gray.200"
    fontSize={{ base: 'xs', md: 'sm' }}
    maxW="150px"
    overflow="hidden"
    whiteSpace="nowrap"
    textOverflow="ellipsis"
  >
    <Tooltip label={value} isDisabled={value?.length <= 15} hasArrow>
      <Box as="span" maxW="100%" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
        {value?.length > 15 ? `${value.slice(0, 15)}...` : value}
      </Box>
    </Tooltip>
  </Td>
);
