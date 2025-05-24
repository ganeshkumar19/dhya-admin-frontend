import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { createPlan, fetchPlans } from '../../api/plans';
import { searchUser } from '../../api/users';

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = React.useState('');
  const [userInput, setUserInput] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [amount, setAmount] = React.useState<number>(0);
  const [isAmountEditable, setIsAmountEditable] = React.useState<boolean>(false);
  const toast = useToast();
  const queryClient = useQueryClient();


  const handlePlanChange = (value: string) => {
  setSelectedPlan(value);
  const selected = plans.find((plan: any) => plan.subscriptionType === value);
  if (selected) {
    if (selected.subscriptionType === 'Enterprise') {
      setAmount(NaN); // Set to NaN so it renders as empty
      setIsAmountEditable(true);
    } else {
      setAmount(selected.amount);
      setIsAmountEditable(false);
    }
  }
};

  const validateInput = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    return emailRegex.test(value) || mobileRegex.test(value);
  };

   const { data: plans = [], isLoading: loadingPlans, isError } = useQuery({
  queryKey: ['plans'],
  queryFn: fetchPlans,
  refetchOnWindowFocus: false,
  retry: false
   });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    setIsValid(validateInput(value));
  };

  const handleVerify = async () => {
  setIsVerifying(true);
  try {
    const user = await searchUser(userInput);
    if (user) {
      setUserId(user.id);
    } else {
      alert('User not found.');
    }
  } catch (err) {
    console.error(err);
    alert('Verification failed.');
  } finally {
    setIsVerifying(false);
  }
};

  const handleSubmit = async () => {
  if (!userId) return toast({ title: 'Verification required', status: 'warning', isClosable: true });

  const selected = plans.find((plan: any) => plan.subscriptionType === selectedPlan);
  if (!selected) return toast({ title: 'Plan not found', status: 'error', isClosable: true });

  const payload = {
    userId,
    planId: selected.id,
    amount,
    startDate: new Date(fromDate).toISOString(),
    endDate: new Date(toDate).toISOString(),
  };

  try {
    await createPlan(payload);
    toast({
      title: 'Subscription created successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // ✅ Refetch subscriptions
    queryClient.invalidateQueries({ queryKey: ['subscriptions'] });

    // Reset form or close modal
    onClose();
  } catch (error) {
    console.error(error);
    toast({
      title: 'Failed to create subscription.',
      description: 'An unexpected error occurred.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Subscription</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <FormControl id="plan" isRequired mb={4}>
                <FormLabel>Plan</FormLabel>
                <Select
                    placeholder={loadingPlans ? 'Loading plans...' : 'Select a plan'}
                    value={selectedPlan}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    isDisabled={loadingPlans || isError}
                >
                    {plans.map((plan: any) => (
                    <option key={plan.subscriptionType} value={plan.subscriptionType}>
                        {plan.name}
                    </option>
                    ))}
                </Select>
                </FormControl>
            <FormControl id="amount" isRequired mb={4}>
  <FormLabel>Amount (₹)</FormLabel>
  <Input
  type="number"
  value={isNaN(amount) ? '' : amount}
  onChange={(e) => setAmount(Number(e.target.value))}
  isDisabled={!isAmountEditable}
  min={0}
/>

</FormControl>

   
            <FormControl mb={4}>
            <FormLabel>Email or Mobile</FormLabel>
            <InputGroup>
              <Input
                    placeholder="Enter email or mobile"
                    value={userInput}
                    onChange={handleInputChange}
                    isDisabled={!!userId}
                />

              <InputRightElement width="5.5rem">
                <Button
                h="1.75rem"
                size="md"
                colorScheme="blue"
                onClick={handleVerify}
                isDisabled={!isValid || !!userId}
                isLoading={isVerifying}
                >
                {userId ? 'Verified' : 'Verify'}
                </Button>

              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>From Date</FormLabel>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => {
                const val = e.target.value;
                setFromDate(val);
                if (toDate && toDate < val) setToDate(''); // Reset toDate if it's before fromDate
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel>To Date</FormLabel>
            <Input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleSubmit}
            isDisabled={!selectedPlan || !isValid || !fromDate || !toDate}
          >
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateSubscriptionModal;

