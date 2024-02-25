package com.bs.iot.entity;

import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.JSONWriter;
import lombok.Data;

@Data
public class RestBean<T> {
    int code;
    T data;
    String message;

    private RestBean(int code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }
    public static <T> RestBean<T> success (T data){
        return new RestBean<>(200, data, "success");
    }

    public static <T> RestBean<T> failure (int code, String message){
        return new RestBean<>(code, null, message);
    }

    public String asJsonString() {
        return JSONObject
                .from(this, JSONWriter.Feature.WriteNulls)
                .toString();
    }
}
