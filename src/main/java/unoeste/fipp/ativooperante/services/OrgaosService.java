package unoeste.fipp.ativooperante.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import unoeste.fipp.ativooperante.entities.Orgaos;
import unoeste.fipp.ativooperante.repositories.OrgaosRepository;
import java.util.List;

@Service
public class OrgaosService
{
    @Autowired
    private final OrgaosRepository orgaosRepository;

    public OrgaosService(OrgaosRepository orgaosRepository)
    {
        this.orgaosRepository = orgaosRepository;
    }

    public List<Orgaos> getAll()
    {
        return orgaosRepository.findAll();
    }

    public Orgaos create(Orgaos orgaos)
    {
        return orgaosRepository.save(orgaos);
    }

    public Orgaos findById(Long id)
    {
        return orgaosRepository.findById(id).orElse(null);
    }

    public Orgaos update(Orgaos orgaos)
    {
        return orgaosRepository.save(orgaos);
    }

    public boolean delete(Long id)
    {
        Orgaos o = findById(id);
        if(o != null)
        {
            orgaosRepository.delete(o);
            return true
        }
        else
            return false;
    }
}
