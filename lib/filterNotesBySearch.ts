const filterNotesBySearch = (query: any, notes: any, filterNotes: any) => {
  const querySearch = query;
  const updatedList = [...notes];

  const filteredNotes = updatedList.filter(
    (item: any) =>
      item.label.toLowerCase().indexOf(querySearch?.toLowerCase()) !== -1
  );

  filterNotes(filteredNotes);
  return;
};

export default filterNotesBySearch;
