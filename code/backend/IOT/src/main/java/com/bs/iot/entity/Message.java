package com.bs.iot.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @Column(name = "device_id")
    int deviceId;
    @Column(precision = 9, scale = 6)
    BigDecimal lat;
    @Column(precision = 9, scale = 6)
    BigDecimal lng;
    boolean alert;
    String timestamp;
    String info;
    int value;

}
