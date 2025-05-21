package unoeste.fipp.ativooperante.entities;

import java.util.Base64;

public class ImagemDTO {
    private Long id;
    private String imagemBase64; // já vem como "data:image/png;base64,..."

    public ImagemDTO(Long id, byte[] dadosImagem) {
        this.id = id;
        this.imagemBase64 = "data:image/png;base64," + Base64.getEncoder().encodeToString(dadosImagem);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImagemBase64() {
        return imagemBase64;
    }

    public void setImagemBase64(String imagemBase64) {
        this.imagemBase64 = imagemBase64;
    }
}
