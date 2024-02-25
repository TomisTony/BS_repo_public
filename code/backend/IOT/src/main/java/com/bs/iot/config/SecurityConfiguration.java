package com.bs.iot.config;

import com.bs.iot.repository.UserRepository;
import com.bs.iot.utils.JwtAuthenticationFilter;
import com.bs.iot.utils.JwtUtils;
import com.bs.iot.entity.RestBean;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.io.PrintWriter;

@Configuration
public class SecurityConfiguration {
    @Resource
    UserRepository repository;
    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(conf -> {
                    conf.requestMatchers(request -> {
                        String url = request.getServletPath();
                        return url.startsWith("/api/auth/register");
                    }).permitAll();
                    conf.anyRequest().authenticated();
                })
                .formLogin(conf -> {
                    //一般分离之后，为了统一规范接口，使用 /api/模块/功能 的形式命名接口
                    conf.loginProcessingUrl("/api/auth/login");
                    conf.successHandler(this::handleProcess);
                    conf.failureHandler(this::handleProcess);
                    conf.permitAll();
                })
                .csrf(AbstractHttpConfigurer::disable)
                .cors(conf -> {
                    CorsConfiguration cors = new CorsConfiguration();
                    //添加前端站点地址，这样就可以告诉浏览器信任了
                    cors.addAllowedOrigin("http://localhost:3000");
                    //虽然也可以像这样允许所有 cors.addAllowedOriginPattern("*");
                    //但是这样并不安全，我们应该只许可给我们信任的站点
                    cors.setAllowCredentials(true);  //允许跨域请求中携带Cookie
                    cors.addAllowedHeader("*");   //其他的也可以配置，为了方便这里就 * 了
                    cors.addAllowedMethod("*");
                    cors.addExposedHeader("*");
                    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                    source.registerCorsConfiguration("/**", cors);  //直接针对于所有地址生效
                    conf.configurationSource(source);
                })
                .exceptionHandling(conf -> {
                    conf.accessDeniedHandler(this::handleProcess);
                    conf.authenticationEntryPoint(this::handleProcess);
                })
                .sessionManagement(conf -> {
                    conf.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                //添加我们用于处理JWT的过滤器到Security过滤器链中，注意要放在UsernamePasswordAuthenticationFilter之前
                .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    private void handleProcess(HttpServletRequest request,
                               HttpServletResponse response,
                               Object exceptionOrAuthentication) throws IOException {
        response.setContentType("application/json;charset=utf-8");
        PrintWriter writer = response.getWriter();
        if(exceptionOrAuthentication instanceof AccessDeniedException exception) {
            writer.write(RestBean.failure(403, exception.getMessage()).asJsonString());
        } else if(exceptionOrAuthentication instanceof Exception exception) {
            writer.write(RestBean.failure(401, exception.getMessage()).asJsonString());
        } else if(exceptionOrAuthentication instanceof Authentication authentication){

            writer.write(RestBean.success(new SuccessResponse(
                    JwtUtils.createJwt((User) authentication.getPrincipal()),
                    authentication.getName(),
                    repository.findByName(authentication.getName()).getId()).asJsonString()).asJsonString());
        }
    }

}

class SuccessResponse {
    private String token;
    private String username;
    private int userId;

    public SuccessResponse(String token, String username, int userId) {
        this.token = token;
        this.username = username;
        this.userId = userId;
    }

    public String asJsonString() {
        return "{\"token\":\"" + token + "\",\"username\":\"" + username + "\",\"userId\":" + userId + "}";
    }
}