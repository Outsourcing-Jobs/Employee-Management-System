import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AsyncReducer } from "../AsyncReducers/asyncreducer.js"
import { HandlePostEmployees, HandleGetEmployees } from "../Thunks/EmployeeThunk.js"

const EmployeeSlice = createSlice({
    name: 'employees',
    initialState: {
        data: null, 
        isLoading: false,
        isAuthenticated: false,
        isAuthourized: false,
        isResetPasswords: false,
        error: {
            status: false,
            message: null,
            content: null
        }
    },
    extraReducers: (builder) => {
        AsyncReducer(builder, HandlePostEmployees); 
        AsyncReducer(builder, HandleGetEmployees)
    }
})

export default EmployeeSlice.reducer