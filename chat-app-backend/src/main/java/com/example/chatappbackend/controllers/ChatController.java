package com.example.chatappbackend.controllers;

import com.example.chatappbackend.entities.Message;
import com.example.chatappbackend.entities.Room;
import com.example.chatappbackend.playload.MessageRequest;
import com.example.chatappbackend.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {

    @Autowired
    RoomRepository roomRepository;

    @MessageMapping("/sendMessage/{roomCode}")
    @SendTo("/topic/room/{roomCode}")
    public Message sendMessage(
            @DestinationVariable String roomCode,
            @RequestBody MessageRequest messageRequest
    ) throws Exception {
        Room room = roomRepository.findByRoomCode(roomCode);

        Message message = new Message();
        message.setContent(messageRequest.getContent());
        message.setSender(messageRequest.getSender());
        message.setTimeStamp(LocalDateTime.now());
        if (room != null) {
            room.getMessages().add(message);
            roomRepository.save(room);
        } else {
            throw new RuntimeException("Không có mã phòng phù hợp!");
        }
        return message;
    }


}
