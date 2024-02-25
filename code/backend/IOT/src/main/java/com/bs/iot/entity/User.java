package com.bs.iot.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String name;
    String password;
    String email;
    String phone;

    public User merge(User user) {
        if (user.name != null) {
            this.name = user.name;
        }
        if (user.email != null) {
            this.email = user.email;
        }
        if (user.phone != null) {
            this.phone = user.phone;
        }
        return this;
    }
}
