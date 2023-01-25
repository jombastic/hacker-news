import './App.css';
import React from 'react';
import axios from 'axios';

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
  const handleFetchStories = React.useCallback(async () => { // B
    if (!searchTerm) return;

    dispatchStories({ type: fetchInit });

    try {
      const result = await axios.get(url); // B
      dispatchStories({
        type: fetchSucess,
        payload: result.data.hits // D
      });
    } catch {
      dispatchStories({ type: fetchError });
    }
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

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />

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

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
  return (
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel id="search" label="Search" value={searchTerm} onInputChange={onSearchInput} isFocused>
        <strong>Search:</strong>
      </InputWithLabel>

      <button type='submit' disabled={!searchTerm}>Submit</button>
    </form>
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

// const InputWithLabel = ({ id, children, value, type = "text", onInputChange, isFocused }) => {
//   // A
//   const inputRef = React.useRef();

//   // C
//   React.useEffect(() => {
//     if (isFocused && inputRef.current) {
//       // D
//       inputRef.current.focus();
//     }
//   }, [isFocused]);

//   return (
//     <>
//       <label htmlFor={id}>{children}</label>
//       &nbsp;
//       {/* B */}
//       <input type={type} id={id} value={value} onChange={onInputChange} ref={inputRef} />
//     </>
//   );
// }

class InputWithLabel extends React.Component {
  render() {
    const {
      id,
      value,
      type = 'text',
      onInputChange,
      children
    } = this.props
    
    return (
      <>
        <label htmlFor="id">{children}</label>
        &nbsp;
        <input 
          id={id}
          type={type} 
          value={value}
          onChange={onInputChange}
        />
      </>
    )
  }
}

export default App;
