package com.bs.iot.utils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
//继承OncePerRequestFilter表示每次请求过滤一次，用于快速编写JWT校验规则

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //首先从Header中取出JWT
        String authorization = request.getHeader("Authorization");
        //判断是否包含JWT且格式正确
        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);
            //开始解析成UserDetails对象，如果得到的是null说明解析失败，JWT有问题
            UserDetails user = JwtUtils.resolveJwt(token);
            if (user != null) {
                //验证没有问题，那么就可以开始创建Authentication了，这里我们跟默认情况保持一致
                //使用UsernamePasswordAuthenticationToken作为实体，填写相关用户信息进去
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                //然后直接把配置好的Authentication塞给SecurityContext表示已经完成验证
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        //最后放行，继续下一个过滤器
        //可能各位小伙伴会好奇，要是没验证成功不是应该拦截吗？这个其实没有关系的
        //因为如果没有验证失败上面是不会给SecurityContext设置Authentication的，后面直接就被拦截掉了
        //而且有可能用户发起的是用户名密码登录请求，这种情况也要放行的，不然怎么登录，所以说直接放行就好
        filterChain.doFilter(request, response);
    }
}
