package unoeste.fipp.ativooperante.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import unoeste.fipp.ativooperante.entities.Tipo;
import unoeste.fipp.ativooperante.repositories.TipoRepository;

import java.util.List;

@Service
public class TipoService {
    @Autowired
    private final TipoRepository tipoRepository;

    public TipoService(TipoRepository tipoRepository) {
        this.tipoRepository = tipoRepository;
    }

    public List<Tipo> getAll() {
        return tipoRepository.findAll();
    }

    public Tipo create(Tipo tipo) {
        return tipoRepository.save(tipo);
    }

    public Tipo findById(Long id) {
        return tipoRepository.findById(id).orElse(null);
    }

    public Tipo update(Tipo tipo) {
        return tipoRepository.save(tipo);
    }

    public boolean delete(Long id) {
        Tipo t = findById(id);
        if (t != null) {
            tipoRepository.delete(t);
            return true;
        }
        else
            return false;
    }
}
