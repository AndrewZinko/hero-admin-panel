import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
});

export const fetchHeroesFilters = createAsyncThunk(
    'filters/fetchHeroesFilters',
    async () => {
        const {request} = useHttp();
        return request("http://localhost:3001/filters");
    }
);

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChange: (state, action) => {state.activeFilter = action.payload;}
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroesFilters.pending, state => {state.filtersLoadingStatus = 'loading';})
            .addCase(fetchHeroesFilters.fulfilled, (state, action) => {
                filtersAdapter.setOne(state, action.payload)
                state.filtersLoadingStatus = 'idle';
            })
            .addCase(fetchHeroesFilters.rejected, state => {state.filtersLoadingStatus = 'error';})
            .addDefaultCase(() => {});
    }
});

const {actions, reducer} = filtersSlice;
export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);
export default reducer;
export const {
    heroesFilterFetching,
    heroesFilterFetched,
    heroesFilterFetchingError,
    activeFilterChange
} = actions;