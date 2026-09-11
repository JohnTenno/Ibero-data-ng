import { useLogin } from './useLogin';
import './login.scss';

export function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errorEmail,
    errorPassword,
    errorGeneral,
    loading,
    submit
  } = useLogin();

  return (
    <div className="c-login">
      <main className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <img
              className="login-logo__img"
              src="/assets/logo-cdmx-2024.svg"
              alt="Ciudad de México. Capital de la Transformación."
              width="140"
              height="32"
            />
          </div>

          <p className="brand">Ibero Data MX</p>
          <h1>Inicia sesión</h1>

          <form onSubmit={submit} className="form-group" noValidate>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              aria-invalid={!!errorEmail}
              aria-describedby={errorEmail ? "email-error" : undefined}
            />
            {errorEmail && (
              <p id="email-error" className="error-hint">{errorEmail}</p>
            )}

            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-invalid={!!errorPassword}
              aria-describedby={errorPassword ? "password-error" : undefined}
            />
            {errorPassword && (
              <p id="password-error" className="error-hint">{errorPassword}</p>
            )}

            {errorGeneral && (
              <p className="error-hint error-hint--general">{errorGeneral}</p>
            )}

            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
