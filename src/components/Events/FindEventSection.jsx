import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../../util/http.js';
import { useRef, useState } from 'react';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem';

export default function FindEventSection() {
  const searchElement = useRef();

  const [searchTerm, SetSearchTerm] = useState();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events', { searchTerm: searchTerm }],
    queryFn: ({signal, queryKey}) => fetchEvents({ signal, ...queryKey[1] }),
    enabled: searchTerm !== undefined,
  });

  function handleSubmit(event) {
    event.preventDefault();
    SetSearchTerm(searchElement.current.value);
  }


  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading) {
    content = <LoadingIndicator />
  }

  if (isError) {
    content = <ErrorBlock title="An error occured"
      message={error.info?.message || 'error searching events'} />
  }

  if (data) {
    content = <ul className="events-list">
      {data.map(event =>
      (
        <li key={event.id}>
          <EventItem event={event} />
        </li>
      ))}
    </ul>
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
