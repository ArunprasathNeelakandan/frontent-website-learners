import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const returnErr = (err) => {
    if (err.response.data.message) {
        return err.response.data.message
    }
    return "somthing went wrong"
}

const returnSuccess = (res) => {
     return {
            status: 200,
            data:res.data
        }
}

export const signup = (data) => API.post('auth/signup', data);
export const login = (data) => API.post('auth/login', data);

export const setMark = (data) => API.post('medications/mark', data);

export const addMedicationApi = async (data) => {
    console.log(data)
    try {
        const res = await API.post("/medications/add", data);
        return returnSuccess(res)
    } catch (error) {  
        returnErr(error)
    }

}

export const getMedicationApi = async (userId) => {
    

    try {
        const res = await API.get(`/medications/get/${userId}`);
        return returnSuccess(res)
    } catch (error) {  
        returnErr(error)
    }

}

export const getPatientApi = async () => {
    try {
        const res = await API.get(`/patients/get`)
        return returnSuccess(res)
    } catch (error) {
        returnErr(error)
    }
}


export const markMedication = (userId, date) =>
  API.post('/medications/mark', { userId, date });

export const getTakenDates = (userId) =>
  API.get(`/medications/taken/${userId}`);



export const GetMedicationHistory=async (patientId) => {
   
    try {
        const res = await API.get(`medications/history/${patientId}`);
        
        return {
            status: res.status,
            data:res.data
        }
    } catch (error) {
       
        returnErr(error)
    }
}
export const apiUserSummury = async (userId) =>{
    try {
        const res = await API.get(`caretaker/patient/${userId}/summary`);
        return {
            status:res.status,
            data:res.data
        }
     

    } catch (error) {
        returnErr(error)
    }
}

