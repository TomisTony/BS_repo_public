package com.bs.iot.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.*;
import com.auth0.jwt.exceptions.*;
import com.auth0.jwt.interfaces.*;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.*;

import java.util.*;

public class JwtUtils {
    //Jwt秘钥
    private static final String key = "abcdefghijklmn";

    //根据用户信息创建Jwt令牌
    public static String createJwt(UserDetails user){
        Algorithm algorithm = Algorithm.HMAC256(key);
        Calendar calendar = Calendar.getInstance();
        Date now = calendar.getTime();
        calendar.add(Calendar.SECOND, 3600 * 24 * 7);
        return JWT.create()
                .withClaim("name", user.getUsername())  //配置JWT自定义信息
                .withClaim("authorities", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
                .withExpiresAt(calendar.getTime())  //设置过期时间
                .withIssuedAt(now)    //设置创建创建时间
                .sign(algorithm);   //最终签名
    }

    //根据Jwt验证并解析用户信息
    public static UserDetails resolveJwt(String token){
        Algorithm algorithm = Algorithm.HMAC256(key);
        JWTVerifier jwtVerifier = JWT.require(algorithm).build();
        try {
            DecodedJWT verify = jwtVerifier.verify(token);  //对JWT令牌进行验证，看看是否被修改
            Map<String, Claim> claims = verify.getClaims();  //获取令牌中内容
            if(new Date().after(claims.get("exp").asDate())) //如果是过期令牌则返回null
                return null;
            else
                //重新组装为UserDetails对象，包括用户名、授权信息等
                return User
                        .withUsername(claims.get("name").asString())
                        .password("")
                        .authorities(claims.get("authorities").asArray(String.class))
                        .build();
        } catch (JWTVerificationException e) {
            return null;
        }
    }
}

