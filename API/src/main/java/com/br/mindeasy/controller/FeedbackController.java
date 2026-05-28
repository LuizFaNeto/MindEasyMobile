package com.br.mindeasy.controller;

import com.br.mindeasy.dto.request.FeedbackRequestDTO;
import com.br.mindeasy.model.Feedback;
import com.br.mindeasy.model.Paciente;
import com.br.mindeasy.repository.FeedbackRepository;
import com.br.mindeasy.repository.PacienteRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final PacienteRepository pacienteRepository;

    public FeedbackController(FeedbackRepository feedbackRepository, PacienteRepository pacienteRepository) {
        this.feedbackRepository = feedbackRepository;
        this.pacienteRepository = pacienteRepository;
    }

    @PostMapping("/pacientes/{pacienteId}")
    public ResponseEntity<Void> enviarFeedback(
            @PathVariable Long pacienteId,
            @Valid @RequestBody FeedbackRequestDTO dto) {
        
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado"));

        Feedback feedback = new Feedback(dto.getMensagem(), paciente);
        feedbackRepository.save(feedback);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
