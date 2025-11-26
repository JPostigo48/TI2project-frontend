import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES, ROLES } from '../utils/constants';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/shared/Layout';

import ProjectDocs from '../pages/ProjectDocs';
import Login from '../pages/Login';

// Páginas de Estudiante
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentSchedule from '../pages/student/StudentSchedule';
import StudentGrades from '../pages/student/StudentGrades';
import StudentLabs from '../pages/student/StudentLabs';

// Páginas de Docente
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import Attendance from '../pages/teacher/Attendance';
import GradeManagement from '../pages/teacher/GradeManagement';
import TeacherSchedule from '../pages/teacher/TeacherSchedule';
import RoomReservation from '../pages/teacher/RoomReservation';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Página principal - Documentación del proyecto */}
      <Route path="/" element={<ProjectDocs />} />
      {/* Ruta de login */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      {/* Rutas de Estudiante */}
      <Route
        path={ROUTES.STUDENT_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Layout>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STUDENT_SCHEDULE}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Layout>
              <StudentSchedule />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STUDENT_GRADES}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Layout>
              <StudentGrades />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.STUDENT_LABS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Layout>
              <StudentLabs />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Rutas de Docente */}
      <Route
        path={ROUTES.TEACHER_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <Layout>
              <TeacherDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.TEACHER_ATTENDANCE}
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <Layout>
              <Attendance />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.TEACHER_GRADES}
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <Layout>
              <GradeManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.TEACHER_SCHEDULE}
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <Layout>
              <TeacherSchedule />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.TEACHER_ROOMS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <Layout>
              <RoomReservation />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600 mb-6">Página no encontrada</p>
              <a href="/" className="text-blue-600 hover:underline">
                Volver al inicio
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
