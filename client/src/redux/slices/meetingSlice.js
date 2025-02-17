import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi, postApi, deleteApi } from '../../services/api';

// Thunk actions
export const fetchMeetingData = createAsyncThunk(
    'meeting/fetchData',
    async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const endpoint = user.role === 'superAdmin' 
            ? 'api/meeting' 
            : `api/meeting/?createBy=${user._id}`;
            
        const response = await getApi(endpoint);
        return response;
    }
);

export const addMeeting = createAsyncThunk(
    'meeting/add',
    async (meetingData) => {
        const response = await postApi('api/meeting', meetingData);
        return response;
    }
);

export const deleteMeeting = createAsyncThunk(
    'meeting/delete',
    async (id) => {
        const response = await deleteApi(`api/meeting/${id}`);
        return response;
    }
);

export const deleteManyMeetings = createAsyncThunk(
    'meeting/deleteMany',
    async (ids) => {
        const response = await postApi('api/meeting/deleteMany', { ids });
        return response;
    }
);

const meetingSlice = createSlice({
    name: 'meeting',
    initialState: {
        data: [],
        isLoading: false,
        error: null,
        currentMeeting: null
    },
    reducers: {
        setCurrentMeeting: (state, action) => {
            state.currentMeeting = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // now it will fetch meetings 
            .addCase(fetchMeetingData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMeetingData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
            })
            .addCase(fetchMeetingData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            // functionality to add meetings 
            .addCase(addMeeting.fulfilled, (state, action) => {
                state.data.unshift(action.payload.data);
            })
            // functionality to delet meeting (single)
            .addCase(deleteMeeting.fulfilled, (state, action) => {
                state.data = state.data.filter(meeting => 
                    meeting._id !== action.payload.data._id
                );
            })
            // functionality to delete many meetings
            .addCase(deleteManyMeetings.fulfilled, (state, action) => {
                const deletedIds = action.payload.data.map(meeting => meeting._id);
                state.data = state.data.filter(meeting => 
                    !deletedIds.includes(meeting._id)
                );
            });
    }
});

export const { setCurrentMeeting, clearError } = meetingSlice.actions;
export default meetingSlice.reducer;