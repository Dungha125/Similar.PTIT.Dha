import axios from 'axios'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {json} from "react-router-dom";
import {base} from "../../services/base";
import {useToast} from "../../Sponsor/Toast/useToast";

export const userLogin = createAsyncThunk(
    'auth/login',
    async ({username, password}, {rejectWithValue}) => {
        try {
            var formdata = new FormData();
            formdata.append("username", username);
            formdata.append("password", password);
            var requestOptions = {
                method: 'POST',
                body: formdata,
                credentials: "include",
                redirect: 'follow',
            };
            // configure header's Content-Type as JSON

            const response  = await fetch(`${base}/auth/login`, requestOptions)
            // store user's token in local storage
            const jsonData = await response.json();

            if (response.status < 200 || response.status >= 300) {
                return rejectWithValue(jsonData);
            }
            localStorage.setItem('userToken', jsonData.useToken)
            return jsonData;
        } catch (error) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)