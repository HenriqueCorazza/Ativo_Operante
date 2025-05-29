package unoeste.fipp.ativooperante.restcontrollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unoeste.fipp.ativooperante.entities.Erro;
import unoeste.fipp.ativooperante.entities.Usuario;
import unoeste.fipp.ativooperante.services.TipoService;
import unoeste.fipp.ativooperante.services.UsuarioService;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("apis/cidadao")
public class UsuarioRestController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Object> getAll(){
        List<Usuario> listUsuario;
        listUsuario = usuarioService.getAll();
        if(!listUsuario.isEmpty()){
            return ResponseEntity.ok().body(listUsuario);
        }
        return ResponseEntity.badRequest().body(new Erro("Não encontrado!"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getbyId(@PathVariable Long id){
        Usuario user;
        user = usuarioService.findById(id);
        if(user==null){
            return ResponseEntity.badRequest().body(new Erro("Usuario não encontrado!"));
        }
        return ResponseEntity.ok().body(user);
    }
    @DeleteMapping
    public ResponseEntity<Object> delete(@RequestBody Usuario usuario){
        if(!usuarioService.delete(usuario)){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.badRequest().body(new Erro("Usuario não encontrado!"));
    }

    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Usuario usuario){
        Usuario  user = usuarioService.update(usuario);
        if(user==null){
            return ResponseEntity.badRequest().body(new Erro("Usuario não encontrado!"));
        }
        return ResponseEntity.ok().body(usuario);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Usuario usuario){
        Usuario novo_usuario = usuarioService.create(usuario);
        if (novo_usuario==null)
            return ResponseEntity.badRequest().body(new Erro("Criação não realizada"));
        return ResponseEntity.ok().body(novo_usuario);
    }
}
