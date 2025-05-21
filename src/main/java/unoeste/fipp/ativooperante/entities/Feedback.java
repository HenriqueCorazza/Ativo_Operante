package unoeste.fipp.ativooperante.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "feedback")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fee_id")
    private Long Id;
    @Column(name = "fee_texto")
    private String texto;
    @OneToOne
    @JoinColumn(name = "den_id", referencedColumnName = "den_id")
    private Denuncia denuncia;

    public Feedback() {
    }

    public Feedback(Long id,String texto) {
        this.Id = id;
        this.texto = texto;
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }
}
