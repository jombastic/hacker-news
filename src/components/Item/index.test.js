import * as React from 'react';
import {
    render,
    screen,
    fireEvent,
    act,
} from '@testing-library/react';

import { Item } from '.';

import { storyOne } from '../App/App.test'; 

describe('Item', () => {
    it('renders all properties', () => {
        render(<Item item={storyOne} />);

        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute(
            'href',
            'https://reactjs.org/'
        );
    });

    it('renders a clickable dismiss button', () => {
        render(<Item item={storyOne} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('clicking the dismiss button calls the callback handler', () => {
        const handleRemoveItem = jest.fn();

        render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

        fireEvent.click(screen.getByRole('button'));

        expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    });
});
