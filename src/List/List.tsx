import * as React from 'react';
import { Story, Stories } from '../storiesTypes';
import { sortBy } from 'lodash';

import { Item } from '../Item/Item';
import { StyledItem, StyledButtonLarge } from '../styles';

import { ReactComponent as Caret } from '../shared/svg/caret-up.svg';
import { ReactComponent as CaretUp } from '../shared/svg/caret-up-fill.svg';

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

const SORTS = {
  NONE: (list: Stories) => list,
  TITLE: (list: Stories) => sortBy(list, 'title'),
  AUTHOR: (list: Stories) => sortBy(list, 'author'),
  COMMENT: (list: Stories) => sortBy(list, 'num_comments').reverse(),
  POINT: (list: Stories) => sortBy(list, 'points').reverse(),
}

const List = React.memo(
  ({ list, onRemoveItem }: ListProps) => {
    // state
    const [sort, setSort] = React.useState<keyof typeof SORTS>('NONE');

    // computed
    const sortedList = SORTS[sort](list);

    // methods
    const handleSort = (sortKey: keyof typeof SORTS) => {
      setSort(sortKey);
    };

    return (
      <>
        <div>
          <span>
            <StyledButtonLarge type="button" onClick={() => handleSort('TITLE')}>
              Title
              &nbsp;
              {sort === 'TITLE' ? (<CaretUp />) : (<Caret />) }
            </StyledButtonLarge>
          </span>
          <span>
            <StyledButtonLarge type="button" onClick={() => handleSort('AUTHOR')}>
              Author
              &nbsp;
              {sort === 'AUTHOR' ? (<CaretUp />) : (<Caret />) }
            </StyledButtonLarge>
          </span>
          <span>
            <StyledButtonLarge type="button" onClick={() => handleSort('COMMENT')}>
              Comments
              &nbsp;
              {sort === 'COMMENT' ? (<CaretUp />) : (<Caret />) }
            </StyledButtonLarge>
          </span>
          <span>
            <StyledButtonLarge type="button" onClick={() => handleSort('POINT')}>
              Points
              &nbsp;
              {sort === 'POINT' ? (<CaretUp />) : (<Caret />) }
            </StyledButtonLarge>
          </span>
        </div>

        <ul>
          <StyledItem style={{ display: 'flex' }}>
            <span style={{ width: '40%' }}>Title</span>
            <span style={{ width: '30%' }}>Author</span>
            <span style={{ width: '10%' }}>Comments</span>
            <span style={{ width: '10%' }}>Points</span>
            <span style={{ width: '10%' }}>Actions</span>
          </StyledItem>

          {sortedList.map((item) => (
            <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
          ))}
        </ul>
      </>
    );
  }
);

export { List };