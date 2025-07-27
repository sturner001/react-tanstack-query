import { Link, useSubmit, redirect, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, updateEvent, queryClient } from '../../util/http.js';
//import LoadingIndicator from '../UI/LoadingIndicator.jsx'
import ErrorBlock from '../UI/ErrorBlock.jsx';


export default function EditEvent() {

  const navigate = useNavigate();
  const { state } = useNavigation();
  const params = useParams();
  const submit = useSubmit();
  const { data, isError, error } = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });

  //const { mutate } = useMutation({
  //  mutationFn: updateEvent,
  //  onMutate: async (data) => {
  //    const newEvent = data.event;
  //    await queryClient.cancelQueries({ queryKey: ['events', params.id] });
  //    const previousEvent = queryClient.getQueryData(['events', params.id]);
  //    queryClient.setQueryData(['events', params.id], newEvent);
  //
  //    return { previousEvent };
  //  },
  //  onError: (error, data, context) => {
  //    queryClient.setQueryData(['events', params.id], context.previousEvent);
  //  },
  //  onSettled: () => {
  //    queryClient.invalidateQueries(['events', params.id]);
  //  }
  //});

  function handleSubmit(formData) {
    submit(formData, { method: 'PUT' });
    //console.log('submit?!?')
    //mutate({ id: params.id, event: formData });
    //navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  //if (isPending) {
  //  content = (
  //    <div className="center">
  //      <LoadingIndicator />
  //      <p>Fetching event data...</p>
  //
  //    </div>
  //  );
  //}

  if (isError) {
    content = (
      <>
        <ErrorBlock title="Error pulling event" message={error.info?.message || 'Error pulling event'} />

        <div className="form-actions">
          <Link to="../" className="button">
            OK
          </Link>

        </div>
      </>);
  }
  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? (<p>Sending Data...</p>) : (<>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Update
          </button>
        </>
        )}
      </EventForm>
    );

  }
  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}

export const loader = ({ params }) => {
  return queryClient.fetchQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal: signal, id: params.id }),
    staleTime: 10000,
  });

}

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);
  await updateEvent({ id: params.id, event: updatedEventData });
  await queryClient.invalidateQueries(['events']);
  return redirect('../');
}
