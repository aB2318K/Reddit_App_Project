import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SearchResults from '../Components/SearchResult/SearchResults';
import '@testing-library/jest-dom';


// Mock your Redux store
const mockStore = configureStore([thunk]);

describe('SearchResults component', () => {
  it('Renders search results for link type', async () => {
    const mockResults = [
      {
        data: {
          children: [
            {
              data: {
                id: '1',
                subreddit: 'testsubreddit',
                title: 'Test Post',
                ups: 10,
                num_comments: 5,
                thumbnail: 'https://example.com/thumbnail.jpg',
                thumbnail_height: 120,
              },
            },
          ],
        },
      },
    ];

    const store = mockStore({
      search: {
        results: mockResults,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search?q=test&type=link']}>
          <Routes>
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for the asynchronous dispatch and rendering to complete
    await waitFor(() => {
      // Assertions
      expect(screen.getByText('Test Post')).toBeInTheDocument();
      expect(screen.getByText('r/testsubreddit')).toBeInTheDocument();
      expect(screen.getByText('10 Votes 5 Comments')).toBeInTheDocument();
    });
  });

  it('Renders search results for sr type', async () => {
    const mockResults = [
      {
        data: {
          children: [
            {
              data: {
                id: '1',
                url: 'r/testCommunity',
                subscribers: 1000,
                public_description: 'Test Community',
              },
            },
          ],
        },
      },
    ];

    const store = mockStore({
      search: {
        results: mockResults,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search?q=test&type=sr']}>
          <Routes>
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for the asynchronous dispatch and rendering to complete
    await waitFor(() => {
      // Assertions
      expect(screen.getByText('Test Community')).toBeInTheDocument();
      expect(screen.getByText('r/testCommunity')).toBeInTheDocument();
      expect(screen.getByText('1k Members')).toBeInTheDocument();
    });
  });
});
