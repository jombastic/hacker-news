// import styles from './App.module.css';
// import cs from 'classnames';
import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { Story, StoriesState, StoriesAction } from './storiesTypes';
import { SearchForm } from './SearchForm';
import { List } from './List';
import LastSearches from './LastSearches';

const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;
  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

// A
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue];
};

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter((story) => action.payload.objectID !== story.objectID)
      }
    default:
      throw new Error();
  }
};

const getSumComments = (stories: StoriesState) => {
  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};

const getUrl = (searchTerm: string) => `${API_ENDPOINT}${searchTerm}`;

const extractSearchTerm = (url: string) => url.replace(API_ENDPOINT, '');
const getLastSearches = (urls: string[]) =>
  urls.reduce((result: string[], url: string, index: number) => {
    const searchTerm = extractSearchTerm(url);

    if (index === 0)
      return result.concat(searchTerm);

    const previousSearchTerm = result[result.length - 1];

    if (searchTerm === previousSearchTerm)
      return result;
    else
      return result.concat(searchTerm);
  }, []).slice(-6, -1);

const App = () => {
  // data
  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);

  // computed
  const sumComments = React.useMemo(() => getSumComments(stories), [stories]); // will run only if stories changes, not on every re-render of the component

  // callbacks
  // A
  const handleFetchStories = React.useCallback(async () => { // B
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl); // B
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits // D
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]); // E

  // watchers | mounted
  React.useEffect(() => {
    handleFetchStories(); // C
  }, [handleFetchStories]); // D

  // methods
  const handleRemoveStory = React.useCallback((item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  }, []);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (searchTerm: string) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    handleSearch(searchTerm);

    event.preventDefault();
  };

  const handleLastSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);

    handleSearch(searchTerm);
  }

  const lastSearches = getLastSearches(urls);

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories with {sumComments} comments.</StyledHeadlinePrimary>

      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />

      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </StyledContainer>
  );
}

export default App;

export { storiesReducer };