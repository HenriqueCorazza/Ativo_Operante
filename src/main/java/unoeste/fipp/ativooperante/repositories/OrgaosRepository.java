package unoeste.fipp.ativooperante.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import unoeste.fipp.ativooperante.entities.Orgaos;

@Repository
public interface OrgaosRepository extends JpaRepository<Orgaos, Long> {
}
