package com.bs.iot.controller;

import com.bs.iot.entity.RestBean;
import com.bs.iot.repository.MessageRepository;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/message")
public class MessageController {
    @Resource
    MessageRepository repository;

    @GetMapping("/count")
    public String count(Integer userId) {
        Integer count = repository.getCountByUserId(userId);
        return RestBean.success(count).asJsonString();
    }

    @GetMapping("/list")
    public String list(Integer deviceId) {
        return RestBean.success(repository.findByDeviceId(deviceId)).asJsonString();
    }
}
