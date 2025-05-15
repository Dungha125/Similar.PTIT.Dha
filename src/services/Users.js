import axios from "axios";
import {base,current} from "./base";


export const getUsers = async (branchID) => {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base}/api/branch/${branchID}/user`, // Use the base variable here
        withCredentials: true, // Automatically include cookies
    };
    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
