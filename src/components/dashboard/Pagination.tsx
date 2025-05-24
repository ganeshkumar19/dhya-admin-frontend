import { Button, Flex } from '@chakra-ui/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <Flex justify="center" mt={4} gap={2}>
      <Button
        size="sm"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        isDisabled={currentPage === 1}
      >
        Previous
      </Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i}
          size="sm"
          variant={currentPage === i + 1 ? 'solid' : 'outline'}
          colorScheme="blue"
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        size="sm"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        isDisabled={currentPage === totalPages}
      >
        Next
      </Button>
    </Flex>
  );
};

export default Pagination;