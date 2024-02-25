package com.bs.iot.controller;

import com.bs.iot.entity.RestBean;
import com.bs.iot.entity.User;
import jakarta.annotation.Resource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.bs.iot.repository.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Resource
    UserRepository repository;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        // 检查用户名和邮箱是否重复
        if (repository.findByName(user.getName()) != null) {
            Map<String, String> map = Map.of("error", "用户名已存在");
            return RestBean.success(map).asJsonString();
        }
        if (repository.findByEmail(user.getEmail()) != null) {
            Map<String, String> map = Map.of("error", "邮箱已存在");
            return RestBean.success(map).asJsonString();
        }
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        repository.save(user);
        Map<String, Boolean> map = Map.of("success", true);
        return RestBean.success(map).asJsonString();
    }

}
