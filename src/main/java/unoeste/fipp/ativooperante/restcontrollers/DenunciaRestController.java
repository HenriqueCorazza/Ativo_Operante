package unoeste.fipp.ativooperante.restcontrollers;

import jakarta.servlet.annotation.WebFilter;
import org.hibernate.annotations.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unoeste.fipp.ativooperante.entities.*;
import unoeste.fipp.ativooperante.services.DenunciaService;
import unoeste.fipp.ativooperante.services.ImagemService;

import java.util.List;
@RestController
@RequestMapping("apis/admin/denuncia")
public class DenunciaRestController {
    @Autowired
    private DenunciaService denunciaService;
    @GetMapping
    public ResponseEntity<Object> getAll(){
        List<Denuncia> listaDenuncia;
        listaDenuncia = denunciaService.getAll();
        if(!listaDenuncia.isEmpty()){
            return ResponseEntity.ok(listaDenuncia);
        }
        else
            return ResponseEntity.badRequest().body(new Erro("Denuncias não encontradas!"));
    }

    @GetMapping("/minhas-denuncias")
    public ResponseEntity<Object> getByUsuario(@RequestParam Long id){
        List<Denuncia> listaDenuncia;
        listaDenuncia = denunciaService.getByUsuario(id);
        if(!listaDenuncia.isEmpty()){
            return ResponseEntity.ok().body(listaDenuncia);
        }
        else
            return ResponseEntity.badRequest().body(new Erro("Não há denuncias para esse usuário"));
    }

    @PostMapping
    public ResponseEntity<Object> addDenuncia(@RequestBody Denuncia denuncia){
        Denuncia nova_denuncia = denunciaService.addDenuncia(denuncia);
        if(nova_denuncia == null){
            return ResponseEntity.badRequest().body(new Erro("Erro na criação da denuncia!"));
        }
        else
            return ResponseEntity.ok().body(nova_denuncia);
    }

    @DeleteMapping("{id}/")
    public ResponseEntity<Object> deleteDenuncia(@PathVariable Long id){
        if(denunciaService.deleteDenuncia(id)){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.badRequest().body(new Erro("Denuncia não excluida!"));
    }

    @PostMapping("add-feedback/{id}/{texto}")
    private ResponseEntity<Object> addFeedback(@PathVariable Long id, @PathVariable String texto){
        if(denunciaService.addFeedback(new Feedback(id,texto)))
            return ResponseEntity.noContent().build();
        else
            return ResponseEntity.badRequest().body(new Erro("Erro ao adicionar feedback!"));
    }

}
