package unoeste.fipp.ativooperante.repositories;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import unoeste.fipp.ativooperante.entities.Denuncia;

import java.util.List;

@Repository
public interface DenunciaRepository extends JpaRepository<Denuncia,Long> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO feedback(fee_texto,den_id) VALUES (:fee_texto, :den_id)", nativeQuery = true)
    public void addFeedback(@Param("den_id") Long id, @Param("fee_texto") String texto);
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM feedback where den_id = :den_id", nativeQuery = true)
    public void deleteFeedback(@Param("den_id") Long den_id);

    List<Denuncia> findDenunciaByUsuario_Id(Long usuarioId);
}
