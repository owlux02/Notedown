import {
  TextInput,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  Box,
} from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';

import UserButton from '../../UserButton';
import NotesData from '../../NotesData';
import filterNotesBySearch from '@/lib/filterNotesBySearch';
import classes from '../../css/NavBar.module.css';

const NavDesktop = ({
  notesClient,
  notesServer,
  createNote,
  createNoteInnerFolder,
  createFolder,
  editorMode,
  noteContent,
  deleteNote,
  deleteFolder,
  noteTitle,
  filterNotes,
  folderNameState,
}: any) => {
  return (
    <Box className={classes.navbar} visibleFrom="sm">
      <div className={classes.section}>
        <UserButton />
      </div>

      <TextInput
        placeholder="Search"
        size="xs"
        onChange={(event: any) =>
          filterNotesBySearch(event.target.value, notesServer, filterNotes)
        }
        leftSection={
          <IconSearch
            style={{ width: rem(12), height: rem(12) }}
            stroke={1.5}
          />
        }
        rightSectionWidth={70}
        styles={{ section: { pointerEvents: 'none' } }}
        mb="sm"
        data-cy="search-input"
      />

      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Your Notes
          </Text>
          <Group>
            <Tooltip label="Create a new folder" withArrow position="right">
              <ActionIcon
                variant="default"
                size={30}
                pl={2}
                pr={2}
                onClick={createFolder}
                data-cy="create-note-btn"
              >
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
                <IconPlus
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Create a new note" withArrow position="right">
              <ActionIcon
                variant="default"
                size={30}
                pl={2}
                pr={2}
                onClick={createNote}
                data-cy="create-note-btn"
              >
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
                <IconPlus
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        <NotesData
          notes={notesClient}
          onSetContent={noteContent}
          onDeleteNote={deleteNote}
          onDeleteFolder={deleteFolder}
          createNoteInnerFolder={createNoteInnerFolder}
          folderNameState={folderNameState}
          onClickNote={() => {
            if (editorMode) {
              editorMode(false);
            }
          }}
          noteTitle={noteTitle}
        />
      </div>
    </Box>
  );
};

export default NavDesktop;
