package com.br.mindeasy.controller;

import com.br.mindeasy.security.JwtTokenUtil;
import com.br.mindeasy.security.UserDetailsServiceConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin // Permite que o frontend acesse
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsServiceConfig userDetailsService;

    // Endpoint de Login
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody Map<String, String> authenticationRequest) throws Exception {
        
        String username = authenticationRequest.get("username");
        String password = authenticationRequest.get("password");

        // Autentica o usuário
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        // Carrega os detalhes do usuário
        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // Gera o token
        final String token = jwtTokenUtil.generateToken(userDetails);

        // Retorna o token
        return ResponseEntity.ok(Map.of("token", token));
    }
}