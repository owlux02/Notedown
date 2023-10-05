import Head from 'next/head';
import {
  TextInput,
  Code,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  Button,
} from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import { Toaster, toast } from 'sonner';

import UserButton from './components/UserButton';
import classes from './css/NavBar.module.css';
import styles from './css/styles.module.css';
import { supabase } from '@/lib/supabaseClient';
import { TABLE_NAME } from '@/consts/consts';

export default function Dashboard({ notesFromServer }: any) {
  const [notes, setNotes]: any = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [editorMode, setEditorMode] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');

  const [sentSaveNote, setSentSaveNote] = useState(false);

  const [firstPageLoad, setFirstPageLoad] = useState(true);
  const editorMDRef: any = useRef(null);

  async function saveNote() {
    setSentSaveNote(true);
    const username = localStorage.getItem('username');

    const noteIndex = notes.findIndex((note: any) => note.label === noteTitle);

    if (noteIndex) {
      notes.at(noteIndex).content = editorMDRef.current?.value;
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
    toast.success('Note added!');
    setSentSaveNote(false);
  }

  async function deleteNote(event: any) {
    const confirmDelete = window.confirm('Are you sure?');

    if (confirmDelete) {
      const username = localStorage.getItem('username');
      const noteIndex = notes.findIndex(
        (note: any) => note.label === event.target.id
      );
      notesFromServer[0].notes.splice(noteIndex, 1);
      setNotes([...notesFromServer[0].notes]);

      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          notes: [...notesFromServer[0].notes],
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
  }

  function createNote() {
    const newNote: any = prompt('Create new note');
    setNoteTitle(newNote);
    setNotes([
      ...notes,
      { label: newNote, content: '# Type here your awesome note' },
    ]);
  }

  const filterBySearch = (event: any) => {
    const query = event.target.value;
    const updatedList = [...notesFromServer];
    
    const filteredNotes = updatedList[0].notes.filter(
      (item: any) =>
        item.label.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );

    setNotes(filteredNotes);
  };

  function handleEditorDidMount(editor: any) {
    editorMDRef.current = editor;
    editor.onDidBlurEditorWidget(() => {
      setNoteContent(editorMDRef.current?.value);
    });
  }

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
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard / Notedown</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster richColors />
      <main className={styles.container}>
        <nav className={classes.navbar}>
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
            rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
            styles={{ section: { pointerEvents: 'none' } }}
            mb="sm"
          />

          <div className={classes.section}>
            <Group
              className={classes.collectionsHeader}
              justify="space-between"
            >
              <Text size="xs" fw={500} c="dimmed">
                Your Notes
              </Text>
              <Tooltip label="Create a new note" withArrow position="right">
                <ActionIcon variant="default" size={18} onClick={createNote}>
                  <IconPlus
                    style={{ width: rem(12), height: rem(12) }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Tooltip>
            </Group>
            <div className={classes.collections}>
              {notes.map((note: any) => (
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setNoteContent(note.content);
                  }}
                  key={note?.label}
                  className={classes.collectionLink}
                >
                  {note?.label}
                  <button
                    className={styles.deleteButton}
                    onClick={deleteNote}
                    id={note?.label}
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
          </div>
        </nav>

        <section className={styles.previewContainer}>
          {editorMode && noteContent !== '' ? (
            <Editor
              defaultValue={noteContent}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              language="markdown"
              onChange={(value) => (editorMDRef.current.value = value)}
              options={{
                minimap: {
                  enabled: false,
                },

                lineNumbers: 'off',
                glyphMargin: false,
                folding: false,
                // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
                tabSize: 2,
              }}
            />
          ) : (
            <Markdown>{noteContent}</Markdown>
          )}

          {noteContent !== '' && (
            <div className={styles.modeButton}>
              <Button onClick={saveNote} disabled={sentSaveNote}>
                {sentSaveNote ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={() => setEditorMode(!editorMode)}>
                {editorMode ? 'Viewer Mode' : 'Editor Mode'}
              </Button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = async () => {
  const { data } = await supabase.from(TABLE_NAME).select('name, notes');

  return {
    props: {
      notesFromServer: data,
    },
  };
};
