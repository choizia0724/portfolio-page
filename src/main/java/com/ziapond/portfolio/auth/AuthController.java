package com.ziapond.portfolio.auth;

import com.ziapond.portfolio.security.JwtUtil;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwt;

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        var tokenReq = new UsernamePasswordAuthenticationToken(req.username(), req.password());
        authManager.authenticate(tokenReq); // 실패시 예외(401)

        UserDetails user = userDetailsService.loadUserByUsername(req.username());
        String jwtToken = jwt.generateToken(user);
        return ResponseEntity.ok(Map.of(
                "token", jwtToken,
                "username", user.getUsername(),
                "roles", user.getAuthorities()
        ));
    }
}
