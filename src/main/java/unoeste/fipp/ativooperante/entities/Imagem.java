package unoeste.fipp.ativooperante.entities;
import jakarta.persistence.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Entity
@Table(name = "imagem")
public class Imagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "img_id")
    private Long id;

    @Column(name = "img_dt")
    private byte[] imagem;
    @ManyToOne
    @JoinColumn(name = "den_id", nullable = true)
    Denuncia denuncia;

    public Imagem(Long id, byte[] imagem) {
        this.id = id;
        this.imagem = imagem;
    }

    public Imagem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getImagem() {
        return imagem;
    }

    public void setImagem(byte[] imagem) {
        this.imagem = imagem;
    }

    public Denuncia getDenuncia() {
        return denuncia;
    }

    public void setDenuncia(Denuncia denuncia) {
        this.denuncia = denuncia;
    }
}
