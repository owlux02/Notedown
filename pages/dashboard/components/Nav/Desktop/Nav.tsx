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
import classes from '../../../css/NavBar.module.css';
import NotesData from '../../NotesData';
import filterNotesBySearch from '../utils/filterNotesBySearch';

const NavDesktop = ({
  notesClient,
  notesServer,
  createNote,
  editorMode,
  noteContent,
  deleteNote,
  noteTitle,
  filterNotes,
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
