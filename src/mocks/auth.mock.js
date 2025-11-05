/**
 * Mocks de autenticación.
 *
 * Estos mocks se utilizan cuando la variable de entorno
 * `VITE_USE_MOCK_DATA` es `true`.  Simulan el comportamiento del
 * backend para login, logout y recuperación de contraseña.  Las
 * contraseñas no se validan realmente, se asume que todas las
 * cuentas utilizan la contraseña `123456`.
 */

const users = [
  {
    id: 'stu-1',
    name: 'Juan Pérez',
    email: 'alumno@unsa.edu.pe',
    code: '2020123456',
    role: 'STUDENT',
  },
  {
    id: 'tch-1',
    name: 'María López',
    email: 'docente@unsa.edu.pe',
    code: 'DOC001',
    role: 'TEACHER',
  },
];

export async function mockLogin(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = users.find((u) => u.email === email);
  if (user && password === '123456') {
    return { success: true, user, token: `${user.id}-token` };
  }
  return { success: false, message: 'Credenciales inválidas' };
}

export async function mockLogout() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { success: true };
}

export async function mockRecoverPassword(email) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = users.find((u) => u.email === email);
  if (user) {
    return { success: true, message: 'Se ha enviado un enlace para restablecer tu contraseña a tu correo institucional.' };
  }
  return { success: false, message: 'Correo no encontrado en el sistema.' };
}
