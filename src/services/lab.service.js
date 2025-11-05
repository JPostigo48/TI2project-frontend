// Servicio de laboratorios: delega en StudentService porque las
// operaciones de laboratorio pertenecen al contexto del estudiante.
import StudentService from './student.service';

class LabService {
  async getLabs() {
    return StudentService.getLabs();
  }
  async enroll(labId) {
    return StudentService.enrollLab(labId);
  }
}

export default new LabService();
