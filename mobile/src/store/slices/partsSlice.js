import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

const initialState = {
  parts: [],
  currentPart: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
  },
  filters: {
    search: '',
    category: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    stockStatus: null,
  },
};

// Fetch parts
export const fetchParts = createAsyncThunk(
  'parts/fetchParts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/parts', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parts');
    }
  }
);

// Fetch single part
export const fetchPart = createAsyncThunk(
  'parts/fetchPart',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/parts/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch part');
    }
  }
);

// Create part
export const createPart = createAsyncThunk(
  'parts/createPart',
  async (partData, { rejectWithValue }) => {
    try {
      const response = await api.post('/parts', partData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create part');
    }
  }
);

// Update part
export const updatePart = createAsyncThunk(
  'parts/updatePart',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/parts/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update part');
    }
  }
);

// Delete part
export const deletePart = createAsyncThunk(
  'parts/deletePart',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/parts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete part');
    }
  }
);

// Search parts
export const searchParts = createAsyncThunk(
  'parts/searchParts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`/parts/search/${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

// Update stock
export const updateStock = createAsyncThunk(
  'parts/updateStock',
  async ({ id, quantity, operation }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/parts/${id}/stock`, { quantity, operation });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stock');
    }
  }
);

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentPart: (state) => {
      state.currentPart = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch parts
    builder
      .addCase(fetchParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload.data;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single part
    builder
      .addCase(fetchPart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPart.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPart = action.payload;
      })
      .addCase(fetchPart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create part
    builder
      .addCase(createPart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPart.fulfilled, (state, action) => {
        state.loading = false;
        state.parts.unshift(action.payload);
      })
      .addCase(createPart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update part
    builder
      .addCase(updatePart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePart.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.parts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.parts[index] = action.payload;
        }
        if (state.currentPart?._id === action.payload._id) {
          state.currentPart = action.payload;
        }
      })
      .addCase(updatePart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete part
    builder
      .addCase(deletePart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePart.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = state.parts.filter(p => p._id !== action.payload);
      })
      .addCase(deletePart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Search parts
    builder
      .addCase(searchParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload.data;
      })
      .addCase(searchParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearFilters, clearCurrentPart } = partsSlice.actions;
export default partsSlice.reducer;
