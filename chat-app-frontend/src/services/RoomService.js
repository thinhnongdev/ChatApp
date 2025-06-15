import { httpClient } from "../config/axiosHelper"

export const createRoomApi=async (roomDetail)=>{
const response =await httpClient.post(`/api/v1/room`,roomDetail)
return response.data;
}

export const joinRoomApi=async (roomDetail)=>{
 const response =await httpClient.get(`/api/v1/room/${roomDetail}`);
 return response.data;
}
export const getMessagesApi=async (roomCode,size=50, page=0)=>{
    const response = await httpClient.get(`/api/v1/room/${roomCode}/messages?size=${size}&page=${page}`);
    return response.data;
}