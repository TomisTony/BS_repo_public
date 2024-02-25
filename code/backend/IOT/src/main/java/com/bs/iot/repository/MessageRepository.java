package com.bs.iot.repository;

import com.bs.iot.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    @Query(value = """
            SELECT COUNT(Message.id)
            FROM User
            LEFT JOIN Device ON User.id = Device.user_id
            LEFT JOIN Message ON Device.id = Message.device_id
            WHERE User.id = :userId
            """, nativeQuery = true)
    Integer getCountByUserId(@Param("userId") Integer userId);

    List<Message> findByDeviceId(Integer deviceId);
}

