package com.bs.iot.controller;

import com.bs.iot.entity.RestBean;
import jakarta.servlet.ServletException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
@RestController
public class ExceptionController {
    @ExceptionHandler(Exception.class)
    public RestBean<String> error(Exception e){
        if(e instanceof NoHandlerFoundException exception)  //这里就大概处理一下404就行
            return RestBean.failure(404, e.getMessage());
        else if (e instanceof ServletException exception)  //其他的Servlet异常就返回400状态码
            return RestBean.failure(400, e.getMessage());
        else
            return RestBean.failure(500, e.getMessage());  //其他异常直接返回500
    }
}
