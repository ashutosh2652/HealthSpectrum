import { createSlice } from "@reduxjs/toolkit";
import {
  uploadDocumentThunk,
  getDocumentByIdThunk,
  listDocumentsByPatientThunk,
  deleteDocumentThunk,
  SourceDocument,
} from "../thunk/sourceDocumentThunk.ts";

interface SourceDocumentState {
  documents: SourceDocument[];
  selectedDocument?: SourceDocument;
  loading: boolean;
  error: string | null;
}

const initialState: SourceDocumentState = {
  documents: [],
  selectedDocument: undefined,
  loading: false,
  error: null,
};

const sourceDocumentSlice = createSlice({
  name: "sourceDocuments",
  initialState,
  reducers: {
    clearSelectedDocument(state) {
      state.selectedDocument = undefined;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Upload
    builder.addCase(uploadDocumentThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadDocumentThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.documents.push(action.payload);
    });
    builder.addCase(uploadDocumentThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Upload failed";
    });

    // Get by ID
    builder.addCase(getDocumentByIdThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDocumentByIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedDocument = action.payload;
    });
    builder.addCase(getDocumentByIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Fetch failed";
    });

    // List by patient
    builder.addCase(listDocumentsByPatientThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(listDocumentsByPatientThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.documents = action.payload;
    });
    builder.addCase(listDocumentsByPatientThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Fetch failed";
    });

    // Delete
    builder.addCase(deleteDocumentThunk.fulfilled, (state, action) => {
      state.documents = state.documents.filter((doc) => doc._id !== action.payload);
    });
  },
});

export const { clearSelectedDocument, clearError } = sourceDocumentSlice.actions;
export default sourceDocumentSlice.reducer;
