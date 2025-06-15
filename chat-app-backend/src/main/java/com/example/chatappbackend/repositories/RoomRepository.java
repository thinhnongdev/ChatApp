package com.example.chatappbackend.repositories;

import com.example.chatappbackend.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, String> {
    //get room using room code
    Room findByRoomCode(String roomCode);
}
