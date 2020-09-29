import React from 'react';
import classnames from 'classnames';
import { ITEM_SIZE } from './consts';

const Item = ({ title, url, onClick, style = {}, classNames = [] }) => {
// onClick={() => handleItemClick(_toys, item)}
// key={item.title}
// className={classnames('game-item', item.title, { toy: _toys.includes(item) })}
// style
  return (<div>
      <div onClick={onClick}
        className={classnames(['game-item', ...classNames])} style={{
          backgroundImage: `url('${url}')`,
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          ...style
      }}/>
  </div>);
}

export default Item;