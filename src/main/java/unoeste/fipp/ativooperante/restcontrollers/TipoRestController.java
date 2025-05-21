package unoeste.fipp.ativooperante.restcontrollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unoeste.fipp.ativooperante.entities.Erro;
import unoeste.fipp.ativooperante.entities.Tipo;
import unoeste.fipp.ativooperante.services.TipoService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("apis/tipo")
public class TipoRestController {

    @Autowired
    TipoService tipoService;

    @GetMapping
    public ResponseEntity<Object> getAll(){
        List<Tipo> listaTipo;
        listaTipo = tipoService.getAll();
        if(!listaTipo.isEmpty()){
            return ResponseEntity.ok(listaTipo);
        }
        else
            return ResponseEntity.badRequest().body(new Erro("Tipo não encontrado"));
    }
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Tipo tipo){
        Tipo novo_tipo = tipoService.create(tipo);
        if(novo_tipo == null)
            return ResponseEntity.badRequest().body(new Erro("Criação não realizada!"));
        return ResponseEntity.ok(novo_tipo);
    }

    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Tipo tipo){
        Tipo novo_tipo = tipoService.update(tipo);
        if(novo_tipo == null)
            return ResponseEntity.badRequest().body(new Erro("Update não realizada!"));
        return ResponseEntity.ok(novo_tipo);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable Long id){
        Tipo novo_tipo = tipoService.findById(id);
        if(novo_tipo == null)
            return ResponseEntity.badRequest().body(new Erro("Tipo não encontrado!"));
        return ResponseEntity.ok(novo_tipo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id){
        if(tipoService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.badRequest().body(new Erro("Não encontrado!"));
    }
}
