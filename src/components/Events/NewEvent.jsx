import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createNewEvent } from '../../util/http.js';
import { queryClient } from '../../util/http.js';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/events');
    },

  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting'}

        {!isPending &&
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>

            <button type="submit" className="button">
              Create
            </button>
          </>}
      </EventForm>
      {isError && <ErrorBlock title="Error saving data."
        message={error.info?.message || 'Failed to create event.'} />}
    </Modal>
  );
}
