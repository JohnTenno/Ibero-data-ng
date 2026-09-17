import { useId, useRef, useState, type FormEvent } from 'react';
import { Button } from 'sectei-library';
import './profile-form.css';

export interface ProfileFormValues {
  username?: string;
  fullName?: string;
  email?: string;
  imageUrl?: string;
}

export interface ProfileFormSubmitData extends ProfileFormValues {
  imageMode: 'upload' | 'link';
  fileName: string;
  previousPassword: string;
  password: string;
  passwordConfirm: string;
}

export interface ProfileFormProps {
  initialValues?: ProfileFormValues;
  onUpdate?: (data: ProfileFormSubmitData) => void;
  onClear?: () => void;
  className?: string;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="profile-form__field">
      <label htmlFor={id}>{label}</label>
      <div className="profile-form__password">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          autoComplete="new-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          type="button"
          variant="bare-secondary"
          size="small"
          iconOnly
          icon={visible ? 'pictogram-eye-hide' : 'pictogram-eye-view'}
          className="profile-form__password-toggle"
          aria-pressed={visible}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          onClick={onToggle}
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </Button>
      </div>
    </div>
  );
}

export function ProfileForm({
  initialValues = {},
  onUpdate,
  onClear,
  className = '',
}: ProfileFormProps) {
  const baseId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [username] = useState(initialValues.username ?? '');
  const [fullName, setFullName] = useState(initialValues.fullName ?? '');
  const [email, setEmail] = useState(initialValues.email ?? '');
  const [imageMode, setImageMode] = useState<'upload' | 'link'>('upload');
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl ?? '');
  const [fileName, setFileName] = useState('');

  const [previousPassword, setPreviousPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const ids = {
    username: `${baseId}-username`,
    fullName: `${baseId}-full-name`,
    email: `${baseId}-email`,
    imageUrl: `${baseId}-image-url`,
    file: `${baseId}-file`,
    previousPassword: `${baseId}-pass-prev`,
    password: `${baseId}-pass`,
    passwordConfirm: `${baseId}-pass-confirm`,
  };

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onUpdate?.({
      username,
      fullName,
      email,
      imageMode,
      imageUrl: imageMode === 'link' ? imageUrl : '',
      fileName: imageMode === 'upload' ? fileName : '',
      previousPassword,
      password,
      passwordConfirm,
    });
  }

  function handleClear() {
    setFullName('');
    setEmail(initialValues.email ?? '');
    setImageUrl('');
    setFileName('');
    setPreviousPassword('');
    setPassword('');
    setPasswordConfirm('');
    if (fileRef.current) fileRef.current.value = '';
    onClear?.();
  }

  return (
    <form
      className={['profile-form', className].filter(Boolean).join(' ')}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="profile-form__columns">
        <fieldset className="profile-form__section">
          <legend className="profile-form__title">Cambie sus detalles</legend>

          <div className="profile-form__field">
            <label htmlFor={ids.username}>Nombre de usuario</label>
            <input
              id={ids.username}
              name="username"
              type="text"
              value={username}
              readOnly
              disabled
              aria-readonly="true"
            />
            <p className="form-help">El nombre de usuario no se puede modificar.</p>
          </div>

          <div className="profile-form__field">
            <label htmlFor={ids.fullName}>Nombre completo</label>
            <input
              id={ids.fullName}
              name="fullName"
              type="text"
              placeholder="ej. Joe Bloggs"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="profile-form__field">
            <label htmlFor={ids.email}>
              Dirección de correo electrónico
              <span className="form-required">(Obligatorio)</span>
            </label>
            <input
              id={ids.email}
              name="email"
              type="email"
              required
              aria-required="true"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="form-help" aria-live="polite" role="status" />
          </div>

          <div className="profile-form__field">
            <div className="profile-form__image-header">
              <span className="profile-form__label" id={`${baseId}-image`}>
                Imagen del perfil
              </span>
              <div
                className="profile-form__image-actions"
                role="group"
                aria-labelledby={`${baseId}-image`}
              >
                <Button
                  type="button"
                  variant="bare-secondary"
                  size="small"
                  icon="pictogram-file-upload"
                  className={
                    imageMode === 'upload'
                      ? 'profile-form__mode-btn is-active'
                      : 'profile-form__mode-btn'
                  }
                  aria-pressed={imageMode === 'upload'}
                  onClick={() => setImageMode('upload')}
                >
                  Subir
                </Button>
                <Button
                  type="button"
                  variant="bare-secondary"
                  size="small"
                  icon="pictogram-link-external"
                  className={
                    imageMode === 'link'
                      ? 'profile-form__mode-btn is-active'
                      : 'profile-form__mode-btn'
                  }
                  aria-pressed={imageMode === 'link'}
                  onClick={() => setImageMode('link')}
                >
                  Enlace
                </Button>
              </div>
            </div>

            <input
              ref={fileRef}
              id={ids.file}
              name="imageFile"
              type="file"
              accept="image/*"
              className="profile-form__file-input"
              aria-label="Archivo de imagen del perfil"
              tabIndex={-1}
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFileName(file?.name ?? '');
              }}
            />

            {imageMode === 'upload' ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  icon="pictogram-file-upload"
                  aria-controls={ids.file}
                  onClick={() => fileRef.current?.click()}
                >
                  {fileName ? 'Cambiar imagen' : 'Elegir imagen'}
                </Button>
                <p className="form-help">
                  {fileName || 'Selecciona una imagen desde tu dispositivo.'}
                </p>
              </>
            ) : (
              <>
                <label htmlFor={ids.imageUrl}>URL de la imagen</label>
                <input
                  id={ids.imageUrl}
                  name="imageUrl"
                  type="url"
                  placeholder="https://…"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <p className="form-help">Pega la dirección de una imagen pública.</p>
              </>
            )}
          </div>
        </fieldset>

        <fieldset className="profile-form__section">
          <legend className="profile-form__title">Cambia tu contraseña</legend>

          <PasswordField
            id={ids.previousPassword}
            label="Contraseña anterior"
            value={previousPassword}
            onChange={setPreviousPassword}
            visible={showPrevious}
            onToggle={() => setShowPrevious((v) => !v)}
          />
          <PasswordField
            id={ids.password}
            label="Contraseña"
            value={password}
            onChange={setPassword}
            visible={showNew}
            onToggle={() => setShowNew((v) => !v)}
          />
          <PasswordField
            id={ids.passwordConfirm}
            label="Confirmar contraseña"
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            visible={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />
        </fieldset>
      </div>

      <div className="profile-form__footer">
        <div className="profile-form__actions">
          <Button type="button" variant="secondary" onClick={handleClear}>
            Borrar
          </Button>
          <Button type="submit" variant="primary">
            Actualizar perfil
          </Button>
        </div>
      </div>
    </form>
  );
}
