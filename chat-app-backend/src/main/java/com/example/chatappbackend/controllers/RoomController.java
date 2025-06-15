package com.example.chatappbackend.controllers;

import com.example.chatappbackend.entities.Message;
import com.example.chatappbackend.entities.Room;
import com.example.chatappbackend.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/api/v1/room")
@CrossOrigin("http://localhost:5173")
public class RoomController {
    @Autowired
    RoomRepository roomRepository;

    //create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomCode) {
        if (!roomCode.trim().isEmpty()) {
            if (roomRepository.findByRoomCode(roomCode) != null) {
                return ResponseEntity.badRequest().body("Mã phòng đã tồn tại!");
            }
            Room room = new Room();
            room.setId(UUID.randomUUID().toString());
            room.setRoomCode(roomCode);
            Room savedRoom = roomRepository.save(room);
            return ResponseEntity.status(HttpStatus.CREATED).body(room);
        }
        return ResponseEntity.badRequest().body("Vui lòng nhập mã phòng!");
    }

    //get room: code
    @GetMapping("/{roomCode}")
    public ResponseEntity<?> getRoom(@PathVariable String roomCode) {
        Room room = roomRepository.findByRoomCode(roomCode);
        if (room == null) {
            return ResponseEntity.badRequest().body("Mã phòng không tồn tại!");
        }
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{roomCode}/messages")
    public ResponseEntity<List<Message>> getMessage(@PathVariable String roomCode,
                                                    @RequestParam(value = "page", defaultValue = "0", required = false) int page,
                                                    @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ) {
        Room room = roomRepository.findByRoomCode(roomCode);
        if (room == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Message> messages = room.getMessages();
        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min(messages.size(), start + size);
        List<Message> paginatedMessages = messages.subList(start, end);
        return ResponseEntity.ok(paginatedMessages);
    }
}
