package unoeste.fipp.ativooperante.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
@Entity
@Table(name = "denuncia")
public class Denuncia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "den_id")
    private Long id;
    @Column(name = "den_titulo")
    private String titulo;
    @Column(name = "den_texto")
    private String texto;
    @ManyToOne
    @JoinColumn(name = "org_id",nullable = false)
    private Orgaos orgao;
    @Column(name = "den_urgencia")
    private int urgencia;
    @Column(name = "den_data")
    private LocalDate data;
    @ManyToOne
    @JoinColumn(name = "tip_id", nullable = false)
    private Tipo tipo;
    @OneToOne(mappedBy = "denuncia")
    private Feedback feedback;
    @ManyToOne
    @JoinColumn(name = "usu_id",nullable = false)
    private Usuario usuario;

    public Denuncia(Long id, String titulo, String texto, Orgaos orgao, int urgencia, LocalDate data, Tipo tipo, Usuario usuario) {
        this.id = id;
        this.titulo = titulo;
        this.texto = texto;
        this.orgao = orgao;
        this.urgencia = urgencia;
        this.data = data;
        this.tipo = tipo;
        this.usuario = usuario;
    }

    public Denuncia() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public Orgaos getOrgao() {
        return orgao;
    }

    public void setOrgao(Orgaos orgao) {
        this.orgao = orgao;
    }

    public int getUrgencia() {
        return urgencia;
    }

    public void setUrgencia(int urgencia) {
        this.urgencia = urgencia;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public Usuario getUsuario() {return this.usuario = usuario;}

    public void setUsuario(Usuario usuario) {this.usuario = usuario;}

    public Feedback getFeedback() {
        return feedback;
    }

    public void setFeedback(Feedback feedback) {
        this.feedback = feedback;
    }
}
