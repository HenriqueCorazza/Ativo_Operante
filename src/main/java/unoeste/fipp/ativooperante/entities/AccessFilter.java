package unoeste.fipp.ativooperante.entities;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AccessFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        String token = req.getHeader("Authorization");
        if(token!=null && JWTTokenProvider.verifyToken(token)) {
            if(verificaNivel(token,request))
               chain.doFilter(request, response);
        }
        else {
            ((HttpServletResponse) response).setStatus(500);
            response.getOutputStream().write("Não autorizado ".getBytes());
        }
    }

    private boolean verificaNivel(String token, ServletRequest request){
        boolean isAuthorized = true;
        String nivel = JWTTokenProvider.getAllClaimsFromToken(token).get("nivel").toString();
        String rotaDestino = (((HttpServletRequest) request).getRequestURI());
        if(nivel.equals("2") && rotaDestino.contains("adm"))
            isAuthorized = false;
        return isAuthorized;
    }
}

    
