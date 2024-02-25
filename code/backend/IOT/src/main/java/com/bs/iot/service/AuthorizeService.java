package com.bs.iot.service;

import com.bs.iot.entity.User;
import com.bs.iot.repository.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthorizeService implements UserDetailsService {
    @Resource
    UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        System.out.println("服务端：正在验证用户" + username);
        User user = repository.findByName(username);
        System.out.println(user.getName());
        if (user == null) {
            throw new UsernameNotFoundException("服务端：用户名或密码错误");
        }
        return org.springframework.security.core.userdetails.User
                .withUsername(username)
                .password(user.getPassword())
                .build();
    }

}
