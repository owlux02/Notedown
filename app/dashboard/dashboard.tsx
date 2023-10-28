'use client';

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

  const [folderName, setFolderName] = useState('');
  const editorMDRef: any = useRef(null);

  const saveNote = async () => {
    setSentSaveNote(true);
    const username = localStorage.getItem('username');
    const noteIndex = notesCopy.findIndex(
      (note: any) => note.label === noteTitle
    );

    const noteValue = editorMDRef?.current?.value || noteContent;

    const isFolder = notesCopy[noteIndex]?.type === 'folder';

    const saveNoteContent = (index: number, content: string) => {
      if (index !== -1) {
        notesCopy[index].content = content;
      }
    };

    if (isFolder) {
      const noteFolderIndex = notesCopy.findIndex(
        (note: any) => note.label === folderName
      );
      const noteIndexFolder = notesCopy[noteFolderIndex]?.notes.findIndex(
        (note: any) => note.label !== noteTitle
      );

      saveNoteContent(
        noteIndexFolder,
        noteValue ?? '# Type here your awesome note'
      );

      const otherNotes = notesCopy[noteFolderIndex]?.notes.filter(
        (note: any) => note.label !== noteTitle
      );
      notesCopy[noteFolderIndex].notes = otherNotes;
    } else {
      saveNoteContent(noteIndex, noteValue ?? '# Type here your awesome note');
    }

    setNotes([...notes]);
    setNotesCopy([...notes, ...(notesCopy[noteIndex]?.notes || [])]);

    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        notes: notesCopy,
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
    const confirmDelete = confirm('Are you sure?');

    if (!confirmDelete) {
      return null;
    }

    const username = localStorage.getItem('username');
    const noteLabel = event.currentTarget.id;

    const noteFolderIndex = notesCopy.findIndex(
      (note: any) => note.label === folderName
    );
    const notesFiltered = notesCopy.filter(
      (note: any) => note.label !== noteLabel
    );

    if (
      noteFolderIndex !== -1 &&
      notesFiltered[noteFolderIndex].type === 'folder'
    ) {
      notesFiltered[noteFolderIndex].notes = notesFiltered[
        noteFolderIndex
      ].notes.filter((note: any) => note.label !== noteLabel);
    }

    setNotes(notesFiltered);
    setNotesCopy(notesFiltered);

    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ notes: [...notesFiltered] })
      .eq('name', username)
      .select();

    if (error) {
      toast.error('Something went wrong');
      throw new Error(error.message);
    }

    toast.success('Note deleted!');
  };

  const deleteFolder = async (event: any) => {
    const confirmDelete = confirm('Are you sure?');

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
      toast.success('Folder deleted!');
      return;
    }
    return null;
  };

  const createNote = () => {
    const newNote = prompt('Name of your note');

    if (!newNote) return null;

    const isNoteExist = notes.some((note: any) => note.label === newNote);

    if (isNoteExist) {
      toast.error('Note already exists');
      return;
    }

    const newNoteData = {
      label: newNote,
      content: `# ${newNote}`,
      type: 'note',
      isOnFolder: false,
    };

    setNoteTitle(newNote);
    setNotes([...notes, newNoteData]);
    setNotesCopy([...notesCopy, newNoteData]);
  };

  const createFolder = () => {
    const newFolder: string | null = prompt('Name of your folder');

    if (newFolder) {
      const newFolderObject = { label: newFolder, notes: [], type: 'folder' };
      setNotes((prevNotes: any) => [...prevNotes, newFolderObject]);
      setNotesCopy((prevNotesCopy: any) => [...prevNotesCopy, newFolderObject]);
    }
  };

  const createNoteInnerFolder = () => {
    const newNote: string | null = prompt('Name of your note');

    if (newNote) {
      const noteToAdd = {
        label: newNote,
        content: `# ${newNote}`,
        type: 'note',
        isOnFolder: true,
      };

      notesCopy.forEach((note: any) => {
        if (note.label === folderName) {
          note.notes.push(noteToAdd);
        }
      });

      setNotes([...notes]);
      setNotesCopy([...notes]);
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
          createFolder={createFolder}
          folderNameState={setFolderName}
          createNoteInnerFolder={createNoteInnerFolder}
          deleteFolder={deleteFolder}
        />

        <NavDesktop
          notesClient={notes}
          notesServer={notesCopy}
          createNote={createNote}
          createFolder={createFolder}
          folderNameState={setFolderName}
          createNoteInnerFolder={createNoteInnerFolder}
          editorMode={setEditorMode}
          noteContent={setNoteContent}
          deleteNote={deleteNote}
          deleteFolder={deleteFolder}
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
