package unoeste.fipp.ativooperante.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import unoeste.fipp.ativooperante.entities.Tipo;
import unoeste.fipp.ativooperante.entities.Usuario;
import unoeste.fipp.ativooperante.repositories.TipoRepository;
import unoeste.fipp.ativooperante.repositories.UsuarioRepository;

import java.util.List;

@Service
public class UsuarioService {
    @Autowired
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }

    public Usuario create(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario update(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public boolean delete(Usuario usuario) {
        Usuario u = findById(usuario.getId());
        if (u != null) {
            usuarioRepository.delete(u);
            return true;
        }
        else
            return false;
    }

    public Usuario authenticate(String email, int password) {
        Usuario u = usuarioRepository.findByEmail(email);
        if (u != null) {
            if(u.getSenha() == password) {
                return u;
            }
        }
        return null;
    }
}

