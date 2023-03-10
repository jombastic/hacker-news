import * as React from 'react';
import styled from 'styled-components';

import { InputWithLabel } from '../shared/Input';

import { StyledButtonLarge } from '../../resources/css/styles';

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

type SearchFormProps = {
    searchTerm: string;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }: SearchFormProps) => {
    return (
        <StyledSearchForm onSubmit={onSearchSubmit}>
            <InputWithLabel id="search" value={searchTerm} onInputChange={onSearchInput} isFocused>
                <strong>Search:</strong>
            </InputWithLabel>

            <StyledButtonLarge type='submit' disabled={!searchTerm}>Submit</StyledButtonLarge>
        </StyledSearchForm>
    );
}

export { SearchForm }; 