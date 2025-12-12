import SignInLayout from "../components/layouts/signInLayout";
import MainLayout from "../components/layouts/mainLayout";
import React from "react";
import Home from "src/pages/home";
import NotFoundPage from "src/pages/home/notFounded";

import OnBoardingScreen from "src/pages/authUsr/OnBoardingScreen";

import ProtectedRoute from "../components/ProtectedRoute";

import SignIn from "src/pages/authUsr/sign-in";
import PatientsTable from "src/pages/patient";
import DetailPatient from "src/pages/patient/detailPatient";
import DoctorTable from "src/pages/docteur";
import DetailDoctor from "src/pages/docteur/detailDocteur";
import Abonnement from "src/pages/abonnement";
import RendezVous from "src/pages/rendezvous";
import Transaction from "src/pages/transaction";
import MessageStruct from "src/pages/messageStruct";
import AddMessage from "src/pages/messageStruct/add";
import Synchro from "src/pages/synchronisation";
import FormationCont from "src/pages/formationConti";
import AddFormation from "src/pages/formationConti/add";
import Ordannance from "src/pages/ordonnance";
import AddOrdonnance from "src/pages/ordonnance/add";
import Video from "src/pages/videoEduc";
import AddVideo from "src/pages/videoEduc/add";
import AddCategorie from "src/pages/categorie/add";
import Categorie from "src/pages/categorie";
import CategorieVideo from "src/pages/categoriVideo";
import AddCategorieVideo from "src/pages/categoriVideo/add";
import Medicament from "src/pages/medicament";
import AddMedicament from "src/pages/medicament/add";

interface RouteType {
  path: string;
  element: React.ReactNode;
  children?: RouteType[];
}

const routes: RouteType[] = [
  {
    path: "/",
    element: <SignInLayout />,

    children: [{ path: "/", element: <SignIn /> }],
  },

  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/home", element: <Home /> }],
  },

  {
    path: "/patients",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/patients", element: <PatientsTable /> }],
  },

  {
    path: "/detail_patient/:id",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/detail_patient/:id", element: <DetailPatient /> }],
  },

  {
    path: "/doctors",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/doctors", element: <DoctorTable /> }],
  },

  {
    path: "/detail_doctor/:id",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/detail_doctor/:id", element: <DetailDoctor /> }],
  },

  {
    path: "/abonnement",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/abonnement", element: <Abonnement /> }],
  },

  {
    path: "/rendez_vous",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/rendez_vous", element: <RendezVous /> }],
  },

  {
    path: "/synchronisation",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/synchronisation", element: <Synchro /> }],
  },

  {
    path: "/formation",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/formation", element: <FormationCont /> }],
  },

  {
    path: "/message_structure",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/message_structure", element: <MessageStruct /> }],
  },

  {
    path: "/add_categorie",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/add_categorie", element: <AddCategorie /> }],
  },

  {
    path: "/categorie",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/categorie", element: <Categorie /> }],
  },

  {
    path: "/ajouter_message",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/ajouter_message", element: <AddMessage /> }],
  },

  {
    path: "/ordonnance",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/ordonnance", element: <Ordannance /> }],
  },

  {
    path: "/ajouter_ordonnance",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/ajouter_ordonnance", element: <AddOrdonnance /> }],
  },

  {
    path: "/medicamant",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/medicamant", element: <Medicament /> }],
  },

  {
    path: "/ajouter_medicamant",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/ajouter_medicamant", element: <AddMedicament /> }],
  },

  {
    path: "/videos",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/videos", element: <Video /> }],
  },

  {
    path: "/categorie_video",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/categorie_video", element: <CategorieVideo /> }],
  },

  {
    path: "/add_categorieVideo",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/add_categorieVideo", element: <AddCategorieVideo /> }],
  },

  {
    path: "/ajouter_video",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/ajouter_video", element: <AddVideo /> }],
  },

  {
    path: "/ajouter_formation",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/ajouter_formation", element: <AddFormation /> }],
  },

  {
    path: "/transaction",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "/transaction", element: <Transaction /> }],
  },

  {
    path: "/",
    element: <SignInLayout />,
    children: [{ path: "/onboard", element: <OnBoardingScreen /> }],
  },

  { path: "*", element: <NotFoundPage /> },
];

export default routes;
