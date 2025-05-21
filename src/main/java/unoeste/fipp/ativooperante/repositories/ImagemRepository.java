package unoeste.fipp.ativooperante.repositories;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import unoeste.fipp.ativooperante.entities.Imagem;

import java.util.List;

@Repository
public interface ImagemRepository extends JpaRepository<Imagem, Long> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO imagem (img_dt, den_id) VALUES (:imagem, :den_id)", nativeQuery = true)
    void inserirImagem(@Param("imagem") byte[] imagem, @Param("den_id") Long den_id);

    List<Imagem> findAllByDenuncia_Id(Long denunciaId);
}
