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

import NavMobile from './components/Nav/Mobile/Nav';
import NavDesktop from './components/Nav/Desktop/Nav';

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

    const noteValue = editorMDRef?.current?.value || noteContent;

    notes.at(noteIndex).content = noteValue ?? '# Type here your awesome note';
    setNotes([...notes]);

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
    const newNote: any = prompt('Name of your note');

    // Check if the note already exists
    const isNoteExist = notes.find((note: any) => note.label === newNote);

    if (isNoteExist) {
      toast.error('Note already exists');
      return;
    }

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
        <NavMobile
          notesClient={notes}
          notesServer={notesFromServer}
          createNote={createNote}
          editorMode={setEditorMode}
          noteContent={setNoteContent}
          deleteNote={deleteNote}
          noteTitle={setNoteTitle}
          filterNotes={setNotes}
        />

        <NavDesktop
          notesClient={notes}
          notesServer={notesFromServer}
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
              <Image src="/notfound.svg" alt="404" width={250} height={250} />
              Oh, there is no content here, try selecting a note in the menu.
            </div>
          ) : null}
          {editorMode && noteContent !== '' ? (
            <>
              <small>Markdown Editor</small>
              <textarea
                className={styles.editor}
                defaultValue={noteContent}
                onBlur={() => setNoteContent(editorMDRef.current.value)}
                ref={editorMDRef}
                name="editor"
                autoComplete='off'
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
