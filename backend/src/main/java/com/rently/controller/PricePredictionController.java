package com.rently.controller;

import com.rently.dto.PredictionRequest;
import com.rently.dto.PredictionResponse;
import com.rently.service.PricePredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/predict")
@RequiredArgsConstructor
public class PricePredictionController {

    private final PricePredictionService predictionService;

    @PostMapping
    public ResponseEntity<PredictionResponse> predictPrice(@RequestBody PredictionRequest request) {
        return ResponseEntity.ok(predictionService.predictPrice(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PredictionResponse> predictForProperty(
            @PathVariable Long id,
            @RequestParam(defaultValue = "5") Integer years) {
        return ResponseEntity.ok(predictionService.predictForProperty(id, years));
    }
}
