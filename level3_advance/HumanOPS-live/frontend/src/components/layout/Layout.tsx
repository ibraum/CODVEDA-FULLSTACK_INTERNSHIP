import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isAlertPanelOpen, setIsAlertPanelOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
    setIsLogoutDialogOpen(false);
  };

  return (
    <div
      className={`min-h-screen grid grid-rows-[280px_2fr] bg-white transition-all duration-300 ease-in-out ${
        isAlertPanelOpen ? "grid-cols-[1fr_400px]" : "grid-cols-[1fr]"
      }`}
    >
      <div className="w-full h-full grid grid-rows-[280px_2fr]">
              <header className="bg-neutral-100 py-6 px-12 flex justify-between items-center col-start-1">
        <div className="w-full max-w-[750px] h-full flex flex-col justify-between items-start">
          <div className="flex items-center gap-4">
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <div className="menu h-14 w-14 rounded-full bg-white flex items-center justify-center shadow cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                    />
                  </svg>
                </div>
              </DrawerTrigger>
              <DrawerContent className="h-full w-[300px] mt-0 rounded-none inset-y-0 left-0 right-auto bg-white border-r">
                <DrawerHeader>
                  <DrawerTitle className="text-2xl font-bold">Menu</DrawerTitle>
                  <DrawerDescription>
                    Accédez aux différentes sections de l'application.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 mt-8 px-4">
                  <Link
                    to="/dashboard"
                    className="text-lg font-medium hover:text-neutral-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/"
                    className="text-lg font-medium hover:text-neutral-600 transition-colors"
                  >
                    Accueil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-lg font-medium text-left hover:text-red-600 transition-colors"
                  >
                    Se déconnecter
                  </button>
                </div>
              </DrawerContent>
            </Drawer>
            <div className="h-14 w-14 rounded-full bg-black"></div>
            <div className="h-14 pt-1">
              <div className="text-lg">HumanOps-Live</div>
              <div className="text-sm text-neutral-500">Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="dm-sans-medium h-22 w-22 rounded-full flex items-center justify-center text-3xl font-semibold text-neutral-900 border border-neutral-300">
              04
            </div>
            <div className="text-md text-neutral-900">
              <div className="">Sun,</div>
              <div className="">January</div>
            </div>
            <div className="h-10 w-[1px] bg-neutral-300"></div>
            <Drawer>
              <DrawerTrigger asChild>
                <button className="cursor-pointer text-white text-sm h-12 px-8 bg-black hover:bg-neutral-700 duration-300 rounded-full flex items-center gap-2">
                  Show my Teams{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              </DrawerTrigger>
              <DrawerContent className="h-[calc(100vh-100px)] mt-0 rounded-t-3xl bg-white">
                <DrawerHeader>
                  <DrawerTitle>Mes Équipes</DrawerTitle>
                  <DrawerDescription>
                    Visualisez et gérez vos équipes ici.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <div className="flex flex-col gap-4">
                    {/* Placeholder for teams content */}
                    <div className="h-20 w-full bg-neutral-100 rounded-lg animate-pulse"></div>
                    <div className="h-20 w-full bg-neutral-100 rounded-lg animate-pulse"></div>
                    <div className="h-20 w-full bg-neutral-100 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
            <button
              onClick={() => setIsAlertPanelOpen(!isAlertPanelOpen)}
              className="alert-button cursor-pointer text-white h-12 w-12 border border-neutral-300 rounded-full flex items-center justify-center relative text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                />
              </svg>
              <div className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-0"></div>
            </button>
          </div>
        </div>
        <div className="w-full max-w-[750px] h-full flex flex-col justify-between items-start">
          <div className="w-full flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="parametre-profil h-14 w-14 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                  />
                </svg>
              </div>
              <div className="h-14 w-14 rounded-full bg-black bg-[url('/src/assets/profil-bg.png')] bg-cover bg-center border border-neutral-300 shadow"></div>
              <div className="h-14 pt-1 dm-sans-regular">
                <div className="text-lg">Kondo Ibrahim</div>
                <div className="text-sm">Admin RH</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 flex items-center justify-center rounded-full border border-neutral-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              <div className="dm-sans-regular text-neutral-500">
                Start searching here...
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between w-full gap-6">
            <div className="dm-sans-light text-neutral-400">
              <div className="text-5xl">Hey, Welcome back </div>
              <div className="text-5xl text-neutral-900">Kondo Ibrahim !</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-black duration-300 group relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 group-hover:text-white duration-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>

                <div className="h-20 group-hover:h-64 orverflow-hidden w-20 rounded-full grid group-hover:grid-rows-3 gap-1 cursor-pointer duration-300 group absolute top-0 group-hover:top-22 duration-300">
                  <div className="h-20 w-20 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-neutral-300 duration-300 group-hover:flex hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                      />
                    </svg>
                  </div>
                  <div className="h-20 w-20 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-neutral-300 duration-300 group-hover:flex hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </div>
                  <div
                    onClick={handleLogout}
                    className="h-20 w-20 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-red-700 bg-red-500 duration-300 group-hover:flex hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="w-full mx-auto py-4 px-12 col-start-1">
        <Outlet />
      </main>
      </div>
      <div
        className={`row-span-2 col-start-2 bg-neutral-100 border-l border-neutral-200 h-full overflow-hidden transition-all duration-500 ease-in-out ${
          isAlertPanelOpen
            ? "opacity-100 translate-x-0 "
            : "opacity-0 translate-x-full hidden"
        }`}
      >
        <div className="h-full p-2 w-full bg-white rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold dm-sans-bold">Notifications</h2>
            <button
              onClick={() => setIsAlertPanelOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-4">vv
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">New Message</h4>
                  <p className="text-sm text-neutral-500 mt-1">
                    You have a new message from the HR team.
                  </p>
                  <p className="text-xs text-neutral-400 mt-2">2 mins ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Task Completed</h4>
                  <p className="text-sm text-neutral-500 mt-1">
                    Project "Alpha" has been marked as complete.
                  </p>
                  <p className="text-xs text-neutral-400 mt-2">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action vous déconnectera de votre compte. Vous devrez vous
              reconnecter pour accéder à votre tableau de bord.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Se déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Layout;
