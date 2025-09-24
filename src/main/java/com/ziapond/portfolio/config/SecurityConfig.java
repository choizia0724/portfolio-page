package com.ziapond.portfolio.config;

import com.ziapond.portfolio.security.JwtAuthFilter;
import com.ziapond.portfolio.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${ADMIN_USERNAME}") private String adminUsername;
    @Value("${ADMIN_PASSWORD}") private String adminPassword;
    @Value("${app.cors.allowed-origins:http://localhost:5174}")
    private String allowedOrigins;

    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails admin = User.withUsername(adminUsername)
                .password(encoder.encode(adminPassword))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtUtil jwtUtil) throws Exception {
       http
          .csrf(csrf -> csrf.disable())
          .cors(Customizer.withDefaults())
          .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .httpBasic(b -> b.disable())
          .authorizeHttpRequests(auth -> auth
             
              .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        
              .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
        
              .requestMatchers(HttpMethod.GET, "/api/health", "/api/dbping", "/api/posts/**").permitAll()
    
              .requestMatchers(HttpMethod.POST,   "/api/posts/**").hasRole("ADMIN")
              .requestMatchers(HttpMethod.PUT,    "/api/posts/**").hasRole("ADMIN")
              .requestMatchers(HttpMethod.PATCH,  "/api/posts/**").hasRole("ADMIN")
              .requestMatchers(HttpMethod.DELETE, "/api/posts/**").hasRole("ADMIN")
    
              .anyRequest().authenticated()
          );

        http.addFilterBefore(new JwtAuthFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    
    List<String> origins = new ArrayList<>(Arrays.asList(allowedOrigins.split(",")));
     origins.add("http://localhost:*");

     cfg.setAllowedOriginPatterns(origins);
    cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
    cfg.setAllowedHeaders(List.of("Authorization","Content-Type","Accept","Origin"));
    cfg.setExposedHeaders(List.of("Location"));
    cfg.setAllowCredentials(true); // ← 쿠키/Authorization 등 자격정보 허용
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cfg);
    return source;
}

}
