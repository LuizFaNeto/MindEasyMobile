package com.br.mindeasy.security;

import java.util.Optional;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.br.mindeasy.model.Paciente;
import com.br.mindeasy.model.Terapeuta;
import com.br.mindeasy.repository.PacienteRepository;
import com.br.mindeasy.repository.TerapeutaRepository;

@Service
public class UserDetailsServiceConfig implements UserDetailsService {

    private final TerapeutaRepository terapeutaRepository;
    private final PacienteRepository pacienteRepository;

    public UserDetailsServiceConfig(TerapeutaRepository terapeutaRepository, PacienteRepository pacienteRepository) {
        this.terapeutaRepository = terapeutaRepository;
        this.pacienteRepository = pacienteRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) 
            throws UsernameNotFoundException {

        // 1. Tenta encontrar como Terapeuta
        Optional<Terapeuta> terapeutaOpt = terapeutaRepository.findByEmail(username);
        if (terapeutaOpt.isPresent()) {
            Terapeuta terapeuta = terapeutaOpt.get();
            return User.withUsername(terapeuta.getEmail())
                       .password(terapeuta.getSenha())
                       .roles("TERAPEUTA") // Role de Terapeuta
                       .build();
        }

        // 2. Se não encontrar, tenta como Paciente
        Optional<Paciente> pacienteOpt = pacienteRepository.findByEmail(username);
        if (pacienteOpt.isPresent()) {
            Paciente paciente = pacienteOpt.get();
            return User.withUsername(paciente.getEmail())
                       .password(paciente.getSenha())
                       .roles("PACIENTE") // Role de Paciente
                       .build();
        }

        // 3. Se não encontrar nenhum, lança exceção
        throw new UsernameNotFoundException("Usuário não encontrado: " + username);
    }
}