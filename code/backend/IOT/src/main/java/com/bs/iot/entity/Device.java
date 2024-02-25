package com.bs.iot.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "device")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String name;
    String description;
    int type;
    String last_active;
    @Column(name = "user_id")
    int userId;

    public Device merge(Device device) {
        if (device.name != null) {
            this.name = device.name;
        }
        if (device.description != null) {
            this.description = device.description;
        }
        this.type = device.type;
        if (device.last_active != null) {
            this.last_active = device.last_active;
        }
        return this;
    }
}
