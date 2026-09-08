import { useProfile } from './useProfile';
import './profile.scss';

export function Profile() {
  const { currentUser } = useProfile();

  return (
    <div className="c-profile">
      <div className="pagina">
        <p className="migaja">Inicio / Configuración de perfil</p>
        <h1>Configuración de perfil</h1>

        {currentUser && (
          <>
            <div className="tarjeta">
              <div className="fila">
                <span className="etiqueta">Nombre</span>
                <span>{currentUser.fullName}</span>
              </div>
              <div className="fila">
                <span className="etiqueta">Email</span>
                <span>{currentUser.email}</span>
              </div>
              <div className="fila">
                <span className="etiqueta">Sysadmin</span>
                <span>{currentUser.isSysadmin ? 'Sí' : 'No'}</span>
              </div>
            </div>
            <p className="nota">Editar nombre/contraseña todavía no está implementado.</p>
          </>
        )}
      </div>
    </div>
  );
}
