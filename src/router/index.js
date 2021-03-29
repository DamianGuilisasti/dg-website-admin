import Vue from "vue";
import VueRouter from "vue-router";
import decode from "jwt-decode";
import Admin from "../views/Admin";
import Dashboard from "../components/Dashboard";
import Login from "../views/Login";
import AdminSettings from "../components/AdminSettings";
import AdminServices from "../components/AdminServices";
import AdminClients from "../components/AdminClients";
import BlogAdmin from "../components/BlogAdmin";
import AdminBudgets from "../components/AdminBudgets";
import AdminExpenses from "../components/AdminExpenses";
import AdminEmails from "../components/AdminEmails";
import AdminUsers from "../components/AdminUsers";
import AdminEditAccount from "../components/AdminEditAccount";
import ErrorPath from "../views/404";

import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    component: ErrorPath,
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
  },
  {
    path: "/admin",
    component: Admin,
    name: "Admin",
    meta: {
      AdminRol: true,
    },
    redirect: "/admin/dashboard",
    children: [
      {
        path: "Dashboard",
        component: Dashboard,
        name: "Dashboard",
      },
      {
        path: "Blog",
        component: BlogAdmin,
        name: "BlogAdmin",
      },
      {
        path: "Services",
        component: AdminServices,
        name: "AdminServices",
      },
      {
        path: "Clients",
        component: AdminClients,
        name: "AdminClients",
      },
      {
        path: "EditAccount",
        component: AdminEditAccount,
        name: "AdminEditAccount",
      },
      {
        path: "Users",
        component: AdminUsers,
        name: "AdminUsers",
      },
      {
        path: "Emails",
        component: AdminEmails,
        name: "AdminEmails",
      },
      {
        path: "Budgets",
        component: AdminBudgets,
        name: "AdminBudgets",
      },
      {
        path: "Settings",
        component: AdminSettings,
        name: "AdminSettings",
      },
      {
        path: "Expenses",
        component: AdminExpenses,
        name: "AdminExpenses",
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const protectedRouteAdmin = to.matched.some((record) => record.meta.AdminRol);
  const protectedRouteSeller = to.matched.some(
    (record) => record.meta.SellerRol
  );

  let token = localStorage.getItem("token");

  if (token && to.name !== "Login" && protectedRouteAdmin) {
    try {
      const User = decode(token);

      let isAdmin = User.rol.some((user) => user.name === "Admin");

      if (isAdmin) {
        next();
      } else {
        GoToLogin();
        store.dispatch("setSnackbar", {
          text: `No tienes los permisos para ingresar.`,
          color: "red",
        });
      }
    } catch (error) {
      GoToLogin();
    }
  }

  function GoToLogin() {
    store.dispatch("exit");
  }

  next();
});

export default router;
