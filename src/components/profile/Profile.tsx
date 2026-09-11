import { useProfile } from './useProfile';
import './profile.scss';

export function Profile() {
  const { currentUser } = useProfile();

  return (
    <div className="c-profile">
      <div className="page">
        <p className="crumb">Inicio / Configuración de perfil</p>
        <h1>Configuración de perfil</h1>

        {currentUser && (
          <>
            <div className="card">
              <div className="row">
                <span className="label">Nombre</span>
                <span>{currentUser.fullName}</span>
              </div>
              <div className="row">
                <span className="label">Email</span>
                <span>{currentUser.email}</span>
              </div>
              <div className="row">
                <span className="label">Sysadmin</span>
                <span>{currentUser.isSysadmin ? 'Sí' : 'No'}</span>
              </div>
            </div>
            <p className="note">Editar nombre/contraseña todavía no está implementado.</p>
          </>
        )}
      </div>
    </div>
  );
}
