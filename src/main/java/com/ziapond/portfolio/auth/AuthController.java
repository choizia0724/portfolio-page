package com.ziapond.portfolio.auth;

import com.ziapond.portfolio.post.vo.LoginRequestVo;
import com.ziapond.portfolio.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestVo req) {
        var tokenReq = new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword());
        Authentication auth = authManager.authenticate(tokenReq); // 실패시 예외(401)

        UserDetails user = (UserDetails) auth.getPrincipal();

        String jwtToken = jwt.generateToken(user);
        return ResponseEntity.ok(Map.of(
                "token", jwtToken,
                "username", user.getUsername(),
                "roles", user.getAuthorities().stream().map(a -> a.getAuthority()).toList()
        ));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        UserDetails u = (UserDetails) auth.getPrincipal();
        return ResponseEntity.ok(Map.of(
                "username", u.getUsername(),
                "roles", u.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList()
        ));
    }
}
