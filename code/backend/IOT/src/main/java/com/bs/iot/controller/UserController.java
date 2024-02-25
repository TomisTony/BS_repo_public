package com.bs.iot.controller;

import com.bs.iot.entity.RestBean;
import com.bs.iot.entity.User;
import com.bs.iot.repository.UserRepository;
import jakarta.annotation.Resource;
import com.bs.iot.entity.ModifyPasswordRequestBody;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Resource
    UserRepository repository;

    @GetMapping("/info")
    public String info(Integer userId) {
        User user = repository.findById(userId).get();
        Map<String, String> map = Map.of("name", user.getName(),
                "email", user.getEmail(),
                "id", String.valueOf(user.getId()),
                "phone", user.getPhone());
        return RestBean.success(map).asJsonString();
    }

    @PostMapping("/modify/info")
    public String modify(@RequestBody User user) {
        User origin = repository.findById(user.getId()).get();
        repository.save(origin.merge(user));
        Map<String, Boolean> map = Map.of("success", true);
        return RestBean.success(map).asJsonString();
    }

    @PostMapping("/modify/password")
    public String modifyPassword(@RequestBody ModifyPasswordRequestBody body) {
        User origin = repository.findById(body.getId()).get();
        if(!new BCryptPasswordEncoder().matches(body.getOldPassword(), origin.getPassword())) {
            Map<String, Boolean> map = Map.of("success", false);
            return RestBean.success(map).asJsonString();
        }
        origin.setPassword(new BCryptPasswordEncoder().encode(body.getPassword()));
        repository.save(origin);
        Map<String, Boolean> map = Map.of("success", true);
        return RestBean.success(map).asJsonString();
    }

}
