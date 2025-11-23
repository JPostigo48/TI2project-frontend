export const users = [
  {
    id: 'stu-1',
    name: 'Juan Pérez',
    email: 'alumno_test@unsa.edu.pe',
    code: '20201234',
    role: 'student',
  },
  {
    id: 'tch-1',
    name: 'María López',
    email: 'docente_test@unsa.edu.pe',
    code: 'DOC001',
    role: 'teacher',
  },
];

export async function mockLogin(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = users.find((u) => u.email === email);
  if (user && password === 'pass_test_123') {
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
