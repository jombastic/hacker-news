import * as React from 'react';
import axios from 'jest-mock-axios';

jest.mock('axios');

import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel,
} from './App';

import {
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';
import { async } from 'q';

export const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
}

export const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
}

export const stories = [storyOne, storyTwo];
export const initialState = { data: [], isLoading: false, isError: false };

describe('storiesReducer', () => {
  it('removes a story from all stories', () => {
    const action = { type: 'REMOVE_STORY', payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    }

    expect(newState).toStrictEqual(expectedState);
  });

  it('initializes a fetch of stories', () => {
    const action = { type: 'STORIES_FETCH_INIT' };

    const newState = storiesReducer(initialState, action);

    const expectedState = {
      data: [],
      isLoading: true,
      isError: false,
    }

    expect(newState).toStrictEqual(expectedState);
  });

  it('succesfuly fetches stories', () => {
    const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories };

    const newState = storiesReducer(initialState, action);

    const expectedState = {
      data: stories,
      isLoading: false,
      isError: false,
    }

    expect(newState).toStrictEqual(expectedState);
  });

  it('fails to fetch stories', () => {
    const action = { type: 'STORIES_FETCH_FAILURE', payload: stories };

    const newState = storiesReducer(initialState, action);

    const expectedState = {
      data: [],
      isLoading: false,
      isError: true,
    }

    expect(newState).toStrictEqual(expectedState);
  });
});

describe('App', () => {
  it('succeeds fetching data', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await act(() => promise);

    expect(screen.queryByText(/Loading/)).toBeNull();

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getAllByText('check.svg').length).toBe(2);
  });

  // it('fails fetching data', async () => {
  //   const promise = Promise.reject();

  //   axios.get.mockImplementationOnce(() => promise);

  //   render(<App />);

  //   expect(screen.getByText(/Loading/)).toBeInTheDocument();

  //   try {
  //     await act(() => promise);
  //   } catch (error) {
  //     expect(screen.queryByText(/Loading/)).toBeNull();
  //     expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
  //   }
  // });

  it('removes a story', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories
      }
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    await act(() => promise);

    expect(screen.getAllByText('check.svg').length).toBe(2);
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('check.svg')[0]);

    expect(screen.getAllByText('check.svg').length).toBe(1);
    expect(screen.queryByText('Jordan Walke')).toBeNull();
  });

  it('searches for specific stories', async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories
      }
    });

    const anotherStory = {
      title: 'JavaScript',
      url: 'https://en.wikipedia.org/wiki/JavaScript',
      author: 'Brendan Eich',
      points: 10,
      objectID: 3
    };

    const javascriptPromise = Promise.resolve({
      data: {
        hits: [anotherStory]
      }
    });

    axios.get.mockImplementation((url) => {
      if (url.includes('React')) {
        return reactPromise;
      }

      if (url.includes('JavaScript')) {
        return javascriptPromise;
      }

      throw Error();
    });

    render(<App />);

    await act(() => reactPromise);

    expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('JavaScript')).toBeNull();

    expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();

    expect(
      screen.queryByText('Dan Abramov, Andrew Clark')
    ).toBeInTheDocument();
    expect(screen.queryByText('Brendan Eich')).toBeNull();

    // User interaction -> Search

    fireEvent.change(screen.queryByDisplayValue('React'), {
      target: {
        value: 'JavaScript'
      }
    });

    expect(screen.queryByDisplayValue('React')).toBeNull();
    expect(screen.queryByDisplayValue('JavaScript')).toBeInTheDocument();

    fireEvent.submit(screen.queryByText('Submit'));

    // Second Data Fetching

    await act(() => javascriptPromise);

    expect(screen.queryByText('Jordan Walke')).toBeNull();
    expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull();
    expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
  });
});