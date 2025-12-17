import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES, ROLES } from '../utils/constants';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/shared/layout/Layout';

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

// Páginas de administrador
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import SemesterManagement from '../pages/admin/SemesterManagement';
import RoomManagement from '../pages/admin/RoomManagement';
import NotFound from '../pages/NotFound';
import StudentCourses from '../pages/student/StudentCourses';

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
        path={ROUTES.STUDENT_COURSES}
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Layout>
              <StudentCourses />
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
      {/* Administrador */}
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_USERS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Layout>
              <UserManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_SEMESTERS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SECRETARY]}>
            <Layout>
              <SemesterManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN_ROOMS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Layout>
              <RoomManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* 404 */}
      <Route
        path="*"
        element={
          <NotFound/>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
