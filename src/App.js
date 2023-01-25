import './App.css';
import React from 'react';

// A
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const fetchInit = 'STORIES_FETCH_INIT';
const fetchSucess = 'STORIES_FETCH_SUCCESS';
const fetchError = 'STORIES_FETCH_FAILURE';
const removeStory = 'REMOVE_STORY';
const storiesReducer = (state, action) => {
  switch (action.type) {
    case fetchInit:
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case fetchSucess:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case fetchError:
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case removeStory:
      return {
        ...state,
        data: state.data.filter((story) => action.payload.objectID !== story.objectID)
      }
    default:
      throw new Error();
  }
};

const App = () => {
  // data
  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  // callbacks
  // A
  const handleFetchStories = React.useCallback(() => { // B
    if (!searchTerm) return;

    dispatchStories({ type: fetchInit });

    fetch(url) // B
      .then((response) => response.json()) // C
      .then((result) => {
        dispatchStories({
          type: fetchSucess,
          payload: result.hits // D
        });
      })
      .catch(() => {
        dispatchStories({ type: fetchError });
      });
  }, [url]); // E

  // watchers | mounted
  React.useEffect(() => {
    handleFetchStories(); // C
  }, [handleFetchStories]); // D

  // methods
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: removeStory,
      payload: item
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" label="Search" value={searchTerm} onInputChange={handleSearchInput} isFocused>
        <strong>Search:</strong>
      </InputWithLabel>

      <button type='button' disabled={!searchTerm} onClick={handleSearchSubmit}>Submit</button>

      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
}

const Item = ({ item, onRemoveItem }) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type='button' onClick={() => onRemoveItem(item)}>Dismiss</button>
      </span>
    </li>
  );
}

const InputWithLabel = ({ id, children, value, type = "text", onInputChange, isFocused }) => {
  // A
  const inputRef = React.useRef();

  // C
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      // D
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      {/* B */}
      <input type={type} id={id} value={value} onChange={onInputChange} ref={inputRef} />
    </>
  );
}

export default App;
