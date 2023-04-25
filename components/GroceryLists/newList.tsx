import { FC } from 'react';

const NewList: FC<{ groceryListCreator: string; groceryListId: string }> = ({
  groceryListCreator,
  groceryListId,
}) => {
  // TODO: query for user-chosen grocery list name as groceryListId

  return <>Create new grocery list</>;
};

export default NewList;
