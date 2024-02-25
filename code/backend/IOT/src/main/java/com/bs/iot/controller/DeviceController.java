package com.bs.iot.controller;

import com.bs.iot.entity.Device;
import com.bs.iot.repository.DeviceRepository;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import com.bs.iot.entity.RestBean;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/device")
public class DeviceController {
    @Resource
    DeviceRepository repository;

    @GetMapping("/list")
    public String list(Integer userId) {
        List<Device> device = repository.findByUserId(userId);
        return RestBean.success(device).asJsonString();
    }

    @PostMapping("/add")
    public String add(@RequestBody Device device) {
        repository.save(device);
        Map<String, Boolean> map = Map.of("success", true);
        return RestBean.success(map).asJsonString();
    }

    @PostMapping("/modify")
    public String modify(@RequestBody Device device) {
        Device origin = repository.findById(device.getId()).get();
        repository.save(origin.merge(device));
        Map<String, Boolean> map = Map.of("success", true);
        return RestBean.success(map).asJsonString();
    }

}
