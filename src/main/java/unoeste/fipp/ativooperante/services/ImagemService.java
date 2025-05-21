package unoeste.fipp.ativooperante.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import unoeste.fipp.ativooperante.entities.Imagem;
import unoeste.fipp.ativooperante.repositories.ImagemRepository;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImagemService {
    @Autowired
    private ImagemRepository imagemRepository;

    public Imagem addImagem(MultipartFile arquivo, Long den_id ) {
        Imagem imagem = new Imagem();
        try {
            imagem.setImagem(arquivo.getBytes());
        } catch (IOException e) {
            return null;
        }
        imagemRepository.inserirImagem(imagem.getImagem(),den_id);
        return imagem;
    }

    public List<Imagem> getImagem(Long den_id) {
        List<Imagem> listBytes = imagemRepository.findAllByDenuncia_Id(den_id);
        if(listBytes != null) {
            System.out.println(listBytes.size());
            return listBytes;
        }
        return null;
    }
}
