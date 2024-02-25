package com.bs.iot.repository;

import com.bs.iot.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Integer> {
    // 根据 userId 查询设备列表
    List<Device> findByUserId(Integer userId);
}
