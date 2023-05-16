import {Task} from '../types/task';

export const filterTaskItems = (searchText: string, taskItems: Task[]) => {
  // create regex for search terms - case insensistive
  const searchRegex = new RegExp(searchText, 'i');

  // filter out tasks by test against search terms
  const searchItems = taskItems.filter(({task}) => searchRegex.test(task));
  
  return searchItems
}