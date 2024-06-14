import React, { useState } from 'react';
import { Container, Heading, Button, VStack, HStack, Table, Thead, Tbody, Tr, Th, Td, Spinner, useToast } from '@chakra-ui/react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../integrations/supabase/index.js';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Events = () => {
  const { data: events, isLoading, isError } = useEvents();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const toast = useToast();
  const [newEventName, setNewEventName] = useState('');

  const handleAddEvent = () => {
    addEvent.mutate({ name: newEventName }, {
      onSuccess: () => {
        toast({ title: "Event added.", status: "success", duration: 2000, isClosable: true });
        setNewEventName('');
      },
      onError: () => {
        toast({ title: "Error adding event.", status: "error", duration: 2000, isClosable: true });
      }
    });
  };

  const handleUpdateEvent = (id, name) => {
    updateEvent.mutate({ id, name }, {
      onSuccess: () => {
        toast({ title: "Event updated.", status: "success", duration: 2000, isClosable: true });
      },
      onError: () => {
        toast({ title: "Error updating event.", status: "error", duration: 2000, isClosable: true });
      }
    });
  };

  const handleDeleteEvent = (id) => {
    deleteEvent.mutate(id, {
      onSuccess: () => {
        toast({ title: "Event deleted.", status: "success", duration: 2000, isClosable: true });
      },
      onError: () => {
        toast({ title: "Error deleting event.", status: "error", duration: 2000, isClosable: true });
      }
    });
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error loading events.</div>;

  return (
    <Container maxW="container.lg" mt={10}>
      <VStack spacing={4}>
        <Heading as="h1" size="xl">Events</Heading>
        <HStack>
          <input value={newEventName} onChange={(e) => setNewEventName(e.target.value)} placeholder="New Event Name" />
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={handleAddEvent}>Add Event</Button>
        </HStack>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {events.map(event => (
              <Tr key={event.id}>
                <Td>{event.name}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button leftIcon={<FaEdit />} colorScheme="blue" onClick={() => handleUpdateEvent(event.id, prompt("New name:", event.name))}>Edit</Button>
                    <Button leftIcon={<FaTrash />} colorScheme="red" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  );
};

export default Events;