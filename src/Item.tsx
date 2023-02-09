import * as React from 'react';
import { Story } from './storiesTypes';

import styled from 'styled-components';
import { StyledButtonSmall } from './styles';
import { ReactComponent as Check } from './check.svg';

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;

  span {
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: ${(props: any) => props.width};

    a {
      color: inherit;
    }
  }
`;

type ItemProps = {
    item: Story;
    onRemoveItem: (item: Story) => void;
};

const Item = ({ item, onRemoveItem }: ItemProps) => {
    return (
        <StyledItem>
            <span style={{ width: '40%' }}>
                <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '10%' }}>{item.num_comments}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span style={{ width: '10%' }}>
                <StyledButtonSmall type='button' onClick={() => onRemoveItem(item)}>
                    <Check height="18px" width="18px" />
                </StyledButtonSmall>
            </span>
        </StyledItem>
    );
}

export { Item };