import * as React from 'react';
import { Story, Stories } from '../storiesTypes';
import { sortBy } from 'lodash';

import { Item } from '../Item';
import { StyledItem } from '../styles';

import SortButton from './SortButton';

const sortOptions = [
  { title: 'Title', sortType: 'TITLE', idx: 'title', width: '40%' },
  { title: 'Author', sortType: 'AUTHOR', idx: 'author', width: '30%' },
  { title: 'Comments', sortType: 'COMMENT', idx: 'num_comments', width: '10%' },
  { title: 'Points', sortType: 'POINT', idx: 'points', width: '10%' },
]

export interface SORTS {
  [key: string]: (list: Stories) => Stories
}

export const SORTS:SORTS = {
  NONE: (list) => list,
};

sortOptions.forEach(option => {
  SORTS[option.sortType] = (list) => sortBy(list, option.idx)
});

export interface Sort {
  sortKey: keyof SORTS,
  isReverse: boolean
}

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

const List = React.memo(
  ({ list, onRemoveItem }: ListProps) => {
    // state
    const [sort, setSort] = React.useState<Sort>({
      sortKey: 'NONE',
      isReverse: false
    });

    const sortFunction = SORTS[sort.sortKey];
    // computed
    const sortedList = sort.isReverse ? sortFunction(list).reverse() : sortFunction(list);

    // methods
    const handleSort = (sortKey: keyof SORTS) => {
      const isReverse = sort.sortKey === sortKey && !sort.isReverse;
      setSort({ sortKey, isReverse });
    };

    return (
      <>
        <div>
          {sortOptions.map((option) => (
            <SortButton key={option.title} title={option.title} sortType={option.sortType} sort={sort} handleSort={handleSort} />
          ))}
        </div>

        <ul>
          <StyledItem>
            {sortOptions.map(option => (
              <span key={option.title} style={{ width: option.width }}>{option.title}</span>
            ))}
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