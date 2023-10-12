import Head from 'next/head';
import Image from 'next/image';
import { useDisclosure } from '@mantine/hooks';

import {
  TextInput,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  Button,
  Box,
  Burger,
  Drawer,
  ScrollArea,
} from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import CodeMD from '@/components/Code/Code';

import { Toaster, toast } from 'sonner';

import UserButton from './components/UserButton';
import classes from './css/NavBar.module.css';
import styles from './css/styles.module.css';
import { supabase } from '@/lib/supabaseClient';
import { TABLE_NAME } from '@/consts/consts';
import NotesData from './components/NotesData';

const Dashboard = ({ notesFromServer }: any) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [notes, setNotes]: any = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [editorMode, setEditorMode] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');

  const [sentSaveNote, setSentSaveNote] = useState(false);

  const [firstPageLoad, setFirstPageLoad] = useState(true);
  const editorMDRef: any = useRef(null);

  const saveNote = async () => {
    setSentSaveNote(true);
    const username = localStorage.getItem('username');

    const noteIndex = notes.findIndex((note: any) => note.label === noteTitle);

    if (noteIndex) {
      notes.at(noteIndex).content =
        noteContent ?? '# Type here your awesome note';
      setNotes([...notes]);
    }

    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        notes: [...notes],
      })
      .eq('name', username)
      .select();

    if (error) {
      toast.error('Something went wrong');
      throw new Error(error.message);
    }
    toast.success('Note saved!');
    setSentSaveNote(false);
  };

  const deleteNote = async (event: any) => {
    const confirmDelete = window.confirm('Are you sure?');

    if (confirmDelete) {
      const username = localStorage.getItem('username');

      const notesFiltered = notes.filter(
        (note: any) => note.label !== event.currentTarget.id
      );
      setNotes(notesFiltered);

      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          notes: [...notesFiltered],
        })
        .eq('name', username)
        .select();

      if (error) {
        toast.error('Something went wrong');
        throw new Error(error.message);
      }
      toast.success('Note deleted!');
      return;
    }
    return null;
  };

  const createNote = () => {
    const newNote: any = prompt('File name');

    if (newNote) {
      setNoteTitle(newNote);
      setNotes([
        ...notes,
        { label: newNote, content: '# Type here your awesome note' },
      ]);
      return;
    }
    return null;
  };

  const filterBySearch = (event: any) => {
    const query = event.target.value;
    const updatedList = [...notesFromServer];

    // find the username in the DB and target the notes
    const username = localStorage.getItem('username');
    const userNotes = updatedList.findIndex(
      (note: any) => note.name === username
    );

    if (userNotes) {
      const filteredNotes = updatedList
        .at(userNotes)
        .notes.filter(
          (item: any) =>
            item.label.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );

      setNotes(filteredNotes);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (firstPageLoad) {
      const findYourNotes = notesFromServer.find(
        (note: any) => note.name === user
      );
      setNotes(findYourNotes.notes);
      setFirstPageLoad(false);
    }
  }, [firstPageLoad, notesFromServer]);

  return (
    <>
      <Head>
        <title>Dashboard / Notedown</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster richColors />
      <main className={styles.container}>
        <Box className={classes.navbarMobile} hiddenFrom="sm">
          <Drawer
            opened={drawerOpened}
            onClose={closeDrawer}
            size="85%"
            padding="md"
            title="Menu"
            hiddenFrom="sm"
            zIndex={1000000}
          >
            <div className={classes.section}>
              <UserButton />
            </div>

            <TextInput
              placeholder="Search"
              size="xs"
              onChange={filterBySearch}
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
            <ScrollArea mx="-md">
              <Group
                justify="center"
                grow
                pb="xl"
                px="md"
                className={classes.navNotesContainer}
              >
                <header>
                  <Text size="xs" fw={500} c="dimmed">
                    Your Notes
                  </Text>
                  <Group>
                    <Tooltip
                      label="Create a new note"
                      withArrow
                      position="right"
                    >
                      <Button
                        variant="default"
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
                      </Button>
                    </Tooltip>
                  </Group>
                </header>

                <NotesData
                  notes={notes}
                  onSetContent={setNoteContent}
                  onDeleteNote={deleteNote}
                  onClickNote={closeDrawer}
                />
              </Group>
            </ScrollArea>
          </Drawer>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Box>

        <Box className={classes.navbar} visibleFrom="sm">
          <div className={classes.section}>
            <UserButton />
          </div>

          <TextInput
            placeholder="Search"
            size="xs"
            onChange={filterBySearch}
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
            <Group
              className={classes.collectionsHeader}
              justify="space-between"
            >
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
              notes={notes}
              onSetContent={setNoteContent}
              onDeleteNote={deleteNote}
              onClickNote={closeDrawer}
            />
          </div>
        </Box>

        <section className={styles.previewContainer}>
          {noteContent === '' && !editorMode ? (
            <div className={styles.page404}>
              <Image src="/404.svg" alt="404" width={250} height={250} />
              Oh, there is no content here, try selecting a note in the menu.
            </div>
          ) : null}
          {editorMode && noteContent !== '' ? (
            <textarea
              className={styles.editor}
              defaultValue={noteContent}
              onBlur={() => setNoteContent(editorMDRef.current.value)}
              ref={editorMDRef}
              autoFocus
            ></textarea>
          ) : (
            <Markdown
              options={{
                overrides: {
                  pre: {
                    component: CodeMD,
                  },
                },
              }}
            >
              {noteContent}
            </Markdown>
          )}

          {noteContent !== '' && (
            <div className={styles.modeButton}>
              <Button
                onClick={saveNote}
                disabled={sentSaveNote}
                data-cy="save-note-btn"
              >
                {sentSaveNote ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={() => setEditorMode(!editorMode)}
                data-cy="editor-mode-btn"
              >
                {editorMode ? 'Viewer Mode' : 'Editor Mode'}
              </Button>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Dashboard;

export const getServerSideProps = async () => {
  const { data } = await supabase.from(TABLE_NAME).select('name, notes');

  return {
    props: {
      notesFromServer: data,
    },
  };
};
