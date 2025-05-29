package unoeste.fipp.ativooperante.restcontrollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unoeste.fipp.ativooperante.entities.Usuario;
import unoeste.fipp.ativooperante.services.UsuarioService;
import unoeste.fipp.ativooperante.util.JWTTokenProvider;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("apis/login")
public class Autenticacao {
    @Autowired
    UsuarioService usuarioService;

    @GetMapping("/{usuario}/{senha}")
    public ResponseEntity<Object> login(@PathVariable String usuario, @PathVariable String senha) {
        JWTTokenProvider tokenProvider = new JWTTokenProvider();
        Usuario u = usuarioService.authenticate(usuario, Integer.parseInt(senha));
        if (u != null) {
            String token = tokenProvider.getToken(u.getEmail(), String.valueOf(u.getNivel()));
            Map<String, String> map = new HashMap<>();
            map.put("token", token);
            map.put("nivel", String.valueOf(u.getNivel()));
            map.put("usu_id", String.valueOf(u.getId()));
            return ResponseEntity.ok().body(map);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/verificar")
    public ResponseEntity<Object> verificar(@RequestHeader ("Authorization") String token) {
        JWTTokenProvider tokenProvider = new JWTTokenProvider();
        if(tokenProvider.verifyToken(token))
            return ResponseEntity.ok().build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
