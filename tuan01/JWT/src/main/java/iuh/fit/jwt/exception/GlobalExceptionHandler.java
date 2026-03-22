package iuh.fit.jwt.exception;

import iuh.fit.jwt.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .code(exception.getErrorCode())
                .message(exception.getMessage())
                .build());
    }

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .code(9999)
                .message(exception.getMessage())
                .build());
    }
}