import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postApi } from '../../../api/apiClient';

interface UploadState {
  loading: boolean;
  success: boolean;
  error: string | null;
  response: any | null;
}

const initialState: UploadState = {
  loading: false,
  success: false,
  error: null,
  response: null,
};

interface UploadPayload {
  sessionId: string;
  file: File;
}

export const uploadSlides = createAsyncThunk<any, UploadPayload, { rejectValue: string }>(
  'upload/uploadSlides',
  async ({ sessionId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('file', file);

      const response = await postApi('api/v1/Slides/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Upload failed. Please try again.');
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    resetUploadState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadSlides.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.response = null;
      })
      .addCase(uploadSlides.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.response = action.payload;
      })
      .addCase(uploadSlides.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message || 'Upload failed.';
      });
  },
});

export const { resetUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;
