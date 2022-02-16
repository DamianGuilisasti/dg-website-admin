import Vue from "vue";
import VueRouter from "vue-router";
import decode from "jwt-decode";
import Admin from "../views/Admin";
import Dashboard from "../components/Dashboard";
import Login from "../views/Login";
import AdminSettings from "../components/AdminSettings";
import AdminClientsServices from "../components/AdminClientsServices";
import AdminServices from "../components/AdminServices";
import AdminClients from "../components/AdminClients";
import BlogAdmin from "../components/BlogAdmin";
import AdminBudgets from "../components/AdminBudgets";
import AdminExpenses from "../components/AdminExpenses";
import AdminEmails from "../components/AdminEmails";
import AdminUsers from "../components/AdminUsers";
import AdminEditAccount from "../components/AdminEditAccount";
import ErrorPath from "../views/404";
import ResetPassword from "../views/ResetPassword";
import AdminSliderSettings from "../components/AdminSliderSettings";
import AdminPortfolioSettings from "../components/AdminPortfolioSettings";
import AdminClientsImages from "../components/AdminClientsImages";
import AdminColors from "../components/AdminColors";
import AdminReviews from "../components/AdminReviews";
import AdminPortfolios from "../components/AdminPortfolios";
import AdminPortfolioCategories from "../components/AdminPortfolioCategories";
import AdminMenus from "../components/AdminMenus";
import CallToAction from "../components/AdminCallToAction";

import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Login,
    name: "Login",
  },
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
    path: "/resetPassword/:token",
    component: ResetPassword,
    name: "ResetPassword",
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
        path: "clients-services",
        component: AdminClientsServices,
        name: "AdminClientsServices",
      },
      {
        path: "services",
        component: AdminServices,
        name: "AdminServices",
      },
      {
        path: "portfolios/list",
        component: AdminPortfolios,
        name: "AdminPortfolios",
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
        path: "settings/company",
        component: AdminSettings,
        name: "AdminSettings",
      },
      {
        path: "settings/sliderHome",
        component: AdminSliderSettings,
        name: "AdminSliderSettings",
      },
      {
        path: "portfolios/slider",
        component: AdminPortfolioSettings,
        name: "AdminPortfolioSettings",
      },
      {
        path: "portfolios/categories",
        component: AdminPortfolioCategories,
        name: "AdminPortfolioCategories",
      },
      {
        path: "settings/reviews",
        component: AdminReviews,
        name: "AdminReviews",
      },
      {
        path: "settings/clientslogo",
        component: AdminClientsImages,
        name: "AdminClientsImages",
      },
      {
        path: "settings/colors",
        component: AdminColors,
        name: "AdminColors",
      },
      {
        path: "Expenses",
        component: AdminExpenses,
        name: "AdminExpenses",
      },
      {
        path: "settings/menu",
        component: AdminMenus,
        name: "AdminMenus",
      },
      {
        path: "settings/calltoaction",
        component: CallToAction,
        name: "CallToAction",
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
