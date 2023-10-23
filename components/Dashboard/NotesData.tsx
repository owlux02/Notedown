import classes from './css/NavBar.module.css';
import styles from './css/styles.module.css';
import {
  ScrollArea,
  rem,
  Group,
  Popover,
  Text,
  Button,
  ActionIcon,
} from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';

type Note = {
  type: string;
  label: string;
  content: string;
  notes: Note[];
};

type Folder = {
  type: string;
  label: string;
  notes: Note[];
};

const NotesData = ({
  notes,
  onSetContent,
  onDeleteNote,
  onDeleteFolder,
  onClickNote,
  noteTitle,
  createNoteInnerFolder,
  folderNameState,
}: any) => {
  const Element = ({ children, note }: Note | any) => {
    return (
      <a
        href="#"
        onClick={(event) => {
          event.preventDefault();
          onSetContent(note.content);
          noteTitle(note.label);
          onClickNote();
        }}
        key={note?.label}
        className={classes.collectionLink}
        data-cy="note"
      >
        {children}
      </a>
    );
  };

  const Folder = ({ note }: Note | any) => {
    return (
      <div className={classes.flexFolder}>
        <details
          onFocus={(event) => {
            folderNameState(event.currentTarget.id);
          }}
          id={note?.label}
        >
          <summary>
            <div className={classes.folderName}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-folder-fill"
                viewBox="0 0 16 16"
              >
                <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z" />
              </svg>

              {note?.label}
            </div>

            <div
              onFocus={() => folderNameState(note?.label)}
              className={classes.folderOptions}
            >
              <Popover
                width={185}
                position="bottom"
                withArrow
                shadow="md"
                zIndex={10000000}
              >
                <Popover.Target>
                  <ActionIcon
                    variant="subtle"
                    size={30}
                    radius="xs"
                    pl={0}
                    pr={0}
                    onFocus={() => {
                      folderNameState(note?.label);
                    }}
                    data-cy="create-note-btn"
                  >
                    <IconMenu2
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Button onClick={createNoteInnerFolder} mb={5} fullWidth>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-file-earmark-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z" />
                    </svg>

                    <Text ml={3}>Create note</Text>
                  </Button>
                  <Button onClick={onDeleteFolder} id={note?.label} fullWidth>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>

                    <Text ml={3}>Delete Folder</Text>
                  </Button>
                </Popover.Dropdown>
              </Popover>
            </div>
          </summary>

          {note?.notes?.map((noteFolder: Folder, index: number) => (
            <div key={index} className={classes.allNotesFolder}>
              {[noteFolder].map((note: Note | any, index: number) => (
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    onSetContent(note.content);
                    noteTitle(note.label);
                    onClickNote();
                  }}
                  key={index}
                  className={classes.folderFile}
                  data-cy="note"
                >
                  {note?.label}
                  <button
                    className={styles.deleteButton}
                    onClick={onDeleteNote}
                    id={note?.label}
                    data-cy="delete-note-btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>
                  </button>
                </a>
              ))}
            </div>
          ))}
        </details>
      </div>
    );
  };

  return (
    <div className={classes.collections}>
      <ScrollArea
        h={`calc(100vh - ${rem(80)})`}
        mx="-md"
        className={classes.scrollbar}
      >
        <Group justify="stretch" grow className={classes.navNotes}>
          {notes?.map((note: Note, index: number) => (
            <div key={index}>
              {note?.type === 'folder' ? (
                <Folder note={note} />
              ) : (
                <Element key={note?.label} note={note}>
                  {note?.label}
                  <button
                    className={styles.deleteButton}
                    onClick={onDeleteNote}
                    id={note?.label}
                    data-cy="delete-note-btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>
                  </button>
                </Element>
              )}
            </div>
          ))}
        </Group>
      </ScrollArea>
    </div>
  );
};

export default NotesData;
