import * as React from 'react';
import { Story, Stories } from '../storiesTypes';

import { Item } from '../Item/Item';

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

const List = React.memo(
  ({ list, onRemoveItem }: ListProps) => {

    return (
      <ul>
        {list.map((item) => (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        ))}
      </ul>
    );
  }
);

export { List };