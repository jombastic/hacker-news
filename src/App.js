import './App.css';
import React from 'react';

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const fetchInit = 'STORIES_FETCH_INIT';
const fetchSucess = 'STORIES_FETCH_SUCCESS';
const fetchError = 'STORIEST_FETCH_FAILURE';
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

const getAsyncStories = () => new Promise((resolve, reject) => {
  // setTimeout(reject, 2000);
  setTimeout(() => {
    resolve({ data: { stories: initialStories } });
  }, 2000);
});

const App = () => {
  // data
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {data: [], isLoading: false, isError: false});
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  // computed
  const searchedStories = stories.data.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // mounted
  React.useEffect(() => {
    dispatchStories({type: fetchInit});

    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: fetchSucess,
          payload: result.data.stories
        });
      })
      .catch(() => {
        dispatchStories({type: fetchError});
      });
  }, []);

  // methods
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: removeStory,
      payload: item
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" label="Search" value={searchTerm} onInputChange={handleSearch} isFocused>
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
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
