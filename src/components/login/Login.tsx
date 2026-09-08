import { useLogin } from './useLogin';
import './login.scss';

export function Login() {
  const { email, setEmail, password, setPassword, error, loading, submit } = useLogin();

  return (
    <div className="c-login">
      <main className="login-pagina">
        <div className="login-tarjeta">
          <div className="login-logo">
            <img
              className="login-logo__img"
              src="/assets/logo-cdmx-2024.svg"
              alt="Ciudad de México. Capital de la Transformación."
              width="140"
              height="32"
            />
          </div>

          <p className="marca">Ibero Data MX</p>
          <h1>Inicia sesión</h1>

          <form onSubmit={submit} className="grupo-formulario" noValidate>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />

            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && <p className="ayuda-error">{error}</p>}

            <button type="submit" className="boton" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
