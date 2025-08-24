import axios from "axios";
import type { NewNoteData, Note } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface Params {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

// ✅ Отримуємо змінні з .env
const myKey = process.env.NEXT_PUBLIC_NOTES_TOKEN;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// ✅ Перевіряємо, чи вони існують
if (!baseUrl) {
  throw new Error("❌ Missing NEXT_PUBLIC_BASE_URL in environment variables");
}

if (!myKey) {
  throw new Error(
    "❌ Missing NEXT_PUBLIC_NOTES_TOKEN in environment variables"
  );
}

const notesUrl = `${baseUrl}/notes`;

// =============================
//      API функції
// =============================

export async function fetchNotes(
  searchValue: string = "",
  page: number = 1,
  tag?: string,
  perPage: number = 12
): Promise<FetchNotesResponse> {
  const params: Params = {
    page,
    perPage,
    tag,
  };

  if (searchValue) {
    params.search = searchValue;
  }

  const response = await axios.get<FetchNotesResponse>(notesUrl, {
    params,
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });

  return response.data;
}

export const addNote = async (noteData: NewNoteData): Promise<Note> => {
  const response = await axios.post<Note>(notesUrl, noteData, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${notesUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data;
};

export async function fetchGetNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`${notesUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data;
}
