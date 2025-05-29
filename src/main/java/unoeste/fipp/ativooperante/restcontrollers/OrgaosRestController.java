package unoeste.fipp.ativooperante.restcontrollers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unoeste.fipp.ativooperante.entities.Erro;
import unoeste.fipp.ativooperante.entities.Orgaos;
import unoeste.fipp.ativooperante.services.OrgaosService;

import java.util.List;

@RestController
@RequestMapping("apis/orgaos")
public class OrgaosRestController
{
    Autowired
    OrgaosService orgaosService;

    @GetMapping
    public ResponseEntity<Object> getAll()
    {
        List<Orgaos> listaOrgaos;
        listaOrgaos = orgaosService.getAll();
        if(!listaOrgaos.isEmpty()){
            return ResponseEntity.ok(listaOrgaos);
        }
        else
            return ResponseEntity.badRequest().body(new Erro("Orgão não encontrado!"));
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Orgaos orgaos)
    {
        Orgaos novo_orgao = orgaosService.create(orgaos);
        if(novo_orgao == null)
            return ResponseEntity.badRequest().body(new Erro("Criação não realizada!"));
        else
            return ResponseEntity.ok(novo_orgao);
    }

    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Orgaos orgaos)
    {
        Orgaos novo_orgao = orgaosService.update(orgaos);
        if(novo_orgao == null)
            return ResponseEntity.badRequest().body(new Erro("Update não realizado!"));
        else
            return ResponseEntity.ok(novo_orgao);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable Long id)
    {
        Orgaos novo_orgao = orgaosService.findById(id);
        if(novo_orgao == null)
            return ResponseEntity.badRequest().body(new Erro("Orgão não encontrado!"));
        else
            return ResponseEntity.ok(novo_orgao);
    }

    @DeleteMapping
    public ResponseEntity<Object> delete(@PathVariable Long id)
    {
        if(orgaosService.delete(id)){
            return ResponseEntity.noContent().build();
        }
        else
            return ResponseEntity.badRequest().body(new Erro("Não encontrado!"));
    }
}
