// Servicio de laboratorios. Este servicio delega en StudentService
// porque las operaciones de laboratorio pertenecen al contexto del
// estudiante autenticado.  Proporciona métodos convenientes para
// obtener grupos disponibles y registrar preferencias de inscripción.

import StudentService from './student.service';

class LabService {
  /**
   * Obtener los grupos de laboratorio disponibles.  Se aceptan
   * opcionalmente los filtros `courseCode` y `semester` para reducir
   * la lista en el backend. Devuelve un arreglo de grupos.  En modo
   * mock se llama al servicio de estudiante que devuelve datos
   * simulados.
   */
  async getLabs({ courseCode, semester } = {}) {
    return await StudentService.getAvailableLabs({ courseCode, semester });
  }

  /**
   * Registrar las preferencias de laboratorio de un estudiante.  El
   * parámetro `courseCode` identifica el curso y `preferences` es un
   * arreglo ordenado con los id de grupos de laboratorio elegidos.
   * Devuelve la respuesta del servidor.  En modo mock lanza un
   * error si la funcionalidad no está implementada.
   */
  async enroll(courseCode, preferences) {
    return await StudentService.enrollLab(courseCode, preferences);
  }
}

export default new LabService();