import Head from 'next/head';
import Image from 'next/image';

import { Button } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import CodeMD from '@/components/Code/Code';

import { Toaster, toast } from 'sonner';

import styles from './css/styles.module.css';
import { supabase } from '@/lib/supabaseClient';
import { TABLE_NAME } from '@/consts/consts';

import NavMobile from '@/components/Dashboard/Nav/Mobile/Nav';
import NavDesktop from '@/components/Dashboard/Nav/Desktop/Nav';

const Dashboard = ({ notesFromServer }: any) => {
  const [notes, setNotes]: any = useState([]);
  const [notesCopy, setNotesCopy]: any = useState(notesFromServer); // for filtering
  const [noteContent, setNoteContent] = useState('');
  const [editorMode, setEditorMode] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');

  const [sentSaveNote, setSentSaveNote] = useState(false);

  const [firstPageLoad, setFirstPageLoad] = useState(true);
  const editorMDRef: any = useRef(null);

  const saveNote = async () => {
    setSentSaveNote(true);
    const username = localStorage.getItem('username');
    const noteIndex = notesCopy.findIndex((note: any) => note.label === noteTitle);

    const noteValue = editorMDRef?.current?.value || noteContent;

    notesCopy.at(noteIndex).content = noteValue ?? '# Type here your awesome note';

    const otherNotes = notesCopy.filter(
      (note: any) => note.label !== noteTitle
    );

    setNotes([...notes]);
    setNotesCopy([...notes, ...otherNotes]);

    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        notes: [...notesCopy],
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

      const notesFiltered = notesCopy.filter(
        (note: any) => note.label !== event.currentTarget.id
      );
      setNotes(notesFiltered);
      setNotesCopy(notesFiltered);

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
    const newNote: any = prompt('Name of your note');

    // Check if the note already exists
    const isNoteExist = notes.find((note: any) => note.label === newNote);
    const isNoteCopyExist = notesCopy.find((note: any) => note.label === newNote);

    if (isNoteExist || isNoteCopyExist) {
      toast.error('Note already exists');
      return;
    }

    if (newNote) {
      setNoteTitle(newNote);
      setNotes([
        ...notes,
        { label: newNote, content: `# ${newNote}` },
      ]);

      setNotesCopy([
        ...notesCopy,
        { label: newNote, content: `# ${newNote}` },
      ]);
      return;
    }
    return null;
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
      setNotesCopy(findYourNotes.notes);
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
        <NavMobile
          notesClient={notes}
          notesServer={notesCopy}
          createNote={createNote}
          editorMode={setEditorMode}
          noteContent={setNoteContent}
          deleteNote={deleteNote}
          noteTitle={setNoteTitle}
          filterNotes={setNotes}
        />

        <NavDesktop
          notesClient={notes}
          notesServer={notesCopy}
          createNote={createNote}
          editorMode={setEditorMode}
          noteContent={setNoteContent}
          deleteNote={deleteNote}
          noteTitle={setNoteTitle}
          filterNotes={setNotes}
        />

        <section className={styles.previewContainer}>
          {noteContent === '' && !editorMode ? (
            <div className={styles.notFound}>
              <Image
                src="/img/notfound.svg"
                alt="No Content here"
                width={250}
                height={250}
                priority
              />
              Oh, there is no content here, try selecting a note in the menu.
            </div>
          ) : null}
          {editorMode && noteContent !== '' ? (
            <>
              <small>{noteTitle} - Markdown Editor</small>
              <textarea
                className={styles.editor}
                defaultValue={noteContent}
                onBlur={() => setNoteContent(editorMDRef.current.value)}
                ref={editorMDRef}
                name="editor"
                autoComplete="off"
                autoFocus
              ></textarea>
            </>
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
