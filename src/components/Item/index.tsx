import * as React from 'react';
import { Story } from '../../resources/interfaces/storiesTypes';

import styled from 'styled-components';
import { StyledButtonSmall } from '../../resources/css/styles';
import { ReactComponent as Check } from '../../resources/svg/check.svg';

import { StyledItem } from '../../resources/css/styles';

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