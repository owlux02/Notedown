const filterNotesBySearch = (
  query: any,
  notes: any,
  filterNotes: any,
) => {
  const querySearch = query;
  const updatedList = [...notes];

  // find the username in the DB and target the notes
  const username = localStorage.getItem('username');
  const userNotes = updatedList.findIndex(
    (note: any) => note.name === username
  );

  const filteredNotes = updatedList
    .at(userNotes)
    .notes.filter(
      (item: any) =>
        item.label.toLowerCase().indexOf(querySearch?.toLowerCase()) !== -1
    );

  filterNotes(filteredNotes);
  return;
};

export default filterNotesBySearch;
