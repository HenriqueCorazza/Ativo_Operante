package unoeste.fipp.ativooperante.restcontrollers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import unoeste.fipp.ativooperante.entities.Erro;
import unoeste.fipp.ativooperante.entities.Imagem;
import unoeste.fipp.ativooperante.entities.ImagemDTO;
import unoeste.fipp.ativooperante.services.ImagemService;

import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("apis/")
public class ImagemRestController {

    @Autowired
    private ImagemService imagemService;

    @PostMapping("upload")
    public ResponseEntity<Object> uploadImagem(@RequestParam("arquivo") MultipartFile arquivo, @RequestParam("den_id") Long den_id) {
        try {
                Imagem img = imagemService.addImagem(arquivo,den_id);
                if(img != null) {
                    return ResponseEntity.ok().body(img);
                }
        } catch (Exception e){
        }
        return ResponseEntity.badRequest().body(new Erro("Erro ao enviar imagem!"));
    }

    @GetMapping("getimg")
    public ResponseEntity<Object> getImagem(@RequestParam("den_id") Long den_id) {
        List<Imagem> listImagem = imagemService.getImagem(den_id);
        List<ImagemDTO> convertido = new ArrayList<>();
        for (Imagem imagem : listImagem) {
            convertido.add(new ImagemDTO(imagem.getId(),imagem.getImagem()));
        }
        if(convertido != null) {
            return ResponseEntity.ok().body(convertido);
        }
        return ResponseEntity.badRequest().body(new Erro("Erro ao enviar imagem!"));
    }
}