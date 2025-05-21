package unoeste.fipp.ativooperante.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import unoeste.fipp.ativooperante.entities.Tipo;

@Repository
public interface TipoRepository extends JpaRepository<Tipo, Long> {
}
