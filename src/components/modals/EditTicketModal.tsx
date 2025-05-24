import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { updateSupportTicket } from '../../api/support';
 // wherever you put it

type SupportTicket = {
  id: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolution: string;
};

const API_URL = import.meta.env.VITE_API_URL;

const statusOptions = [
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Closed', value: 'CLOSED' },
];

interface EditTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
}

export default function EditTicketModal({
  isOpen,
  onClose,
  ticket,
}: EditTicketModalProps) {
  const toast = useToast();
  const qc = useQueryClient();

  const [status, setStatus] = useState<SupportTicket['status']>('OPEN');
  const [resolution, setResolution] = useState<string>('');

  // Keep form in sync with the ticket prop
  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setResolution(ticket.resolution);
    }
  }, [ticket]);

  const handleSave = async () => {
    if (!ticket) return;

    try {
    await updateSupportTicket(ticket.id, status, resolution);
    toast({ title: 'Ticket updated', status: 'success', duration: 3000 });
    qc.invalidateQueries({ queryKey: ['supportTickets'] });
    onClose();
  } catch {
    toast({ title: 'Failed to update', status: 'error', duration: 3000 });
  }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Status</FormLabel>
            <Select
              value={status}
              onChange={e => setStatus(e.target.value as SupportTicket['status'])}
            >
              {statusOptions.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Resolution</FormLabel>
            <Input
              value={resolution}
              onChange={e => setResolution(e.target.value)}
              placeholder="Your resolution notes"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
