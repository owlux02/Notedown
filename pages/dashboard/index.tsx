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
import Markdown from 'markdown-to-jsx';
import CodeMD from '@/components/Code/Code';

import Editor from '@monaco-editor/react';
import { Toaster, toast } from 'sonner';

import UserButton from './components/UserButton';
import classes from './css/NavBar.module.css';
import styles from './css/styles.module.css';
import { supabase } from '@/lib/supabaseClient';
import { TABLE_NAME } from '@/consts/consts';
import NotesData from './components/NotesData';

const Dashboard = ({ notesFromServer }: any) => {
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
    toast.success('Note saved!');
    setSentSaveNote(false);
  };

  const deleteNote = async (event: any) => {
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

    const filteredNotes = updatedList[0].notes.filter(
      (item: any) =>
        item.label.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );

    setNotes(filteredNotes);
  };

  const handleEditorDidMount = (editor: any) => {
    editorMDRef.current = editor;
    editor.onDidBlurEditorWidget(() => {
      setNoteContent(editorMDRef.current?.value);
    });
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
              onSetNote={setNoteContent}
              onDeleteNote={deleteNote}
            />
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
