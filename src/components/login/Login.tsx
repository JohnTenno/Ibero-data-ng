import { useState } from 'react';
import { Button } from 'sectei-library';
import { useLogin } from './useLogin';
import './login.css';

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
    submit,
  } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="c-login">
      <main className="c-login__page">
        <div className="c-login__card">
          <div className="c-login__logo">
            <img
              className="c-login__logo-img"
              src="/assets/logo-cdmx-2024.svg"
              alt="Ciudad de México. Capital de la Transformación."
              width="140"
              height="32"
            />
          </div>

          <p className="c-login__brand">Ibero Data MX</p>
          <h1 className="c-login__title">Inicia sesión</h1>

          <form onSubmit={submit} className="c-login__form" noValidate>
            <div className="c-login__field">
              <label htmlFor="login-email">Correo electrónico</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                aria-invalid={!!errorEmail}
                aria-describedby={errorEmail ? 'login-email-error' : undefined}
              />
              {errorEmail ? (
                <p id="login-email-error" className="c-login__error" role="alert">
                  {errorEmail}
                </p>
              ) : null}
            </div>

            <div className="c-login__field">
              <label htmlFor="login-password">Contraseña</label>
              <div className="c-login__password">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  aria-invalid={!!errorPassword}
                  aria-describedby={errorPassword ? 'login-password-error' : undefined}
                />
                <Button
                  type="button"
                  variant="bare-secondary"
                  size="small"
                  iconOnly
                  icon={showPassword ? 'pictogram-eye-hide' : 'pictogram-eye-view'}
                  className="c-login__password-toggle"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword((v) => !v)}
                />
              </div>
              {errorPassword ? (
                <p id="login-password-error" className="c-login__error" role="alert">
                  {errorPassword}
                </p>
              ) : null}
            </div>

            {errorGeneral ? (
              <p className="c-login__error c-login__error--general" role="alert">
                {errorGeneral}
              </p>
            ) : null}

            <div className="c-login__actions">
              <Button type="submit" variant="primary" disabled={loading} className="c-login__submit">
                {loading ? 'Entrando…' : 'Entrar'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
