package com.bs.iot.entity;

import lombok.Data;

@Data
public class ModifyPasswordRequestBody {
    Integer id;
    String password;
    String oldPassword;
}
