import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import MD5 from 'crypto-js/md5';
import { nanoid } from 'nanoid';

interface ComicsState {
    comics: any[];
    favouritesComics: any[],
    filteredComics: any[],
    loading: boolean;
    error: string | null;
    comicsPerPage: number;
    currentPage: number;
}

const API_URL = 'https://gateway.marvel.com:443/v1/';

const getHash = (ts: string, secretKey: string, publicKey: string) => {
    return MD5(ts + secretKey + publicKey).toString();
};

const initialState: ComicsState = {
    comics: [],
    favouritesComics: [],
    filteredComics: [],
    loading: false,
    error: null,
    comicsPerPage: 12,
    currentPage: 1,
};

let baseUrl = `${API_URL}/public/comics`;
let ts = nanoid(10);
let apiKey = 'f4bb7c43073357bda2eab008bb4cd9cc';
let privateKey = '454008c057f6ad1b8f5cabf69bc5d6cd58af68e8';
let hash = getHash(ts, privateKey, apiKey);
let url = `${baseUrl}?ts=${ts}&apikey=${apiKey}&hash=${hash}`;

export const fetchAllComics = createAsyncThunk('comics/fetchAllComics', async (_, { rejectWithValue }) => {
    try {
        let response = await axios.get(url);
        let data = await response.data.data.results;
        console.log(data);
        return data;
    } catch (error) {
        // @ts-ignore
        return rejectWithValue(error.response?.data || 'Failed to fetch comics.');
    }
});

export const fetchComics = createAsyncThunk('comics/fetchComics', async (name: string, { rejectWithValue }) => {
    let extension = `&titleStartsWith=`;
    try {
        let response = await axios.get(url + extension + name);
        let data = await response.data.data.results;
        console.log(data);
        return data;
    } catch (error) {
        // @ts-ignore
        return rejectWithValue(error.response?.data || 'Failed to fetch comics.');
    }
});

export const comicsSlice = createSlice({
    name: 'comics',
    initialState,
    reducers: {
        searchComic: (state, action) => {
            console.log(action.payload);
            state.filteredComics = action.payload;
        },

        handleFavouriteComic: (state, action) => {
            const comic = action.payload;
            const existingIndex = state.favouritesComics.findIndex((favourite) => favourite.id === comic.id);

            if (existingIndex !== -1) {
                const newFavourites = [...state.favouritesComics];
                console.log(newFavourites)
                newFavourites.splice(existingIndex, 1);
                return {
                    ...state,
                    favouritesComics: newFavourites,
                };
            } else if (existingIndex === -1) {
                state.favouritesComics.push(comic);
            }

            return state;
        },
        removeAllFavouriteComics: (state) => {
            state.favouritesComics = [];
        },
        onNavigateNext: (state) => {
            state.currentPage++;
        },
        onNavigatePrev: (state) => {
            state.currentPage--;
        },
        onChangeComicPerPage: (state, action: PayloadAction<number>) => {
            state.comicsPerPage = action.payload;
        },
        onClickCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllComics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllComics.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.comics = payload;
            })
            .addCase(fetchAllComics.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = null;
            })
    },
});

// export const { reset } = comicsSlice.actions
export const {searchComic, removeAllFavouriteComics , handleFavouriteComic, onNavigateNext, onNavigatePrev} = comicsSlice.actions
export default comicsSlice.reducer;
