package unoeste.fipp.ativooperante.services;

import org.springframework.stereotype.Service;
import unoeste.fipp.ativooperante.entities.Denuncia;
import unoeste.fipp.ativooperante.entities.Feedback;
import unoeste.fipp.ativooperante.entities.Tipo;
import unoeste.fipp.ativooperante.entities.Usuario;
import unoeste.fipp.ativooperante.repositories.DenunciaRepository;
import unoeste.fipp.ativooperante.repositories.TipoRepository;

import java.util.List;

@Service
public class DenunciaService {
    private DenunciaRepository denunciaRepository;

    public DenunciaService(DenunciaRepository denunciaRepository) {
        this.denunciaRepository = denunciaRepository;
    }

    public List<Denuncia> getAll(){
        return denunciaRepository.findAll();
    }

    public List<Denuncia> getByUsuario(Long id){
        return denunciaRepository.findDenunciaByUsuario_Id(id);
    }

    public Denuncia addDenuncia(Denuncia denuncia){
        return denunciaRepository.save(denuncia);
    }

    public boolean addFeedback(Feedback feedback){
        denunciaRepository.addFeedback(feedback.getId(), feedback.getTexto());
        return true;
    }

    public boolean deleteDenuncia(Long id){
        Denuncia d = denunciaRepository.getById(id);
        if(d != null){
            if(d.getFeedback() != null) {
                denunciaRepository.deleteFeedback(d.getId());
            }
            denunciaRepository.delete(d);
            return true;
        }
        return false;
    }
}
