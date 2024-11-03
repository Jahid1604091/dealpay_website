"use client";
import React, { useEffect, useRef } from "react";
import { ArrowLeft, Power } from "lucide-react";
import Link from "next/link";
import { dashboardMenu } from "@/app/utils/menu";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setClearUserInfo } from "@/app/(root)/redux/slices/authSlice";

const Sidebar = ({
  isSidebarSmall,
  setIsSidebarSmall,
  handleSidebarCollapse,
}) => {
  const sidebarRef = useRef(null);
  const path = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Close the sidebar if it is open and the click is outside the sidebar
      if (
        isSidebarSmall &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarSmall(false);
      }
    };
    // Attach the event listener when the component mounts
    document.addEventListener("click", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isSidebarSmall]);

  const handleLogout = () => {
    dispatch(setClearUserInfo());
    router.push("/");
    // try {
    //   const { data } = await axiosPrivate.post(`/logout`);

    //   if (data?.status_code === 200) {
    //     toast.dismiss();
    //     toast.success(data?.message);
    //     router.push("/");
    //     setUserInfo(null);
    //     setUser("");
    //
    //   }
    // } catch (error) {
    //   const errorMessages = error?.response?.data?.message;
    //   errorMessages?.forEach((msg) => {
    //     toast.error(msg);
    //   });
    // }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`sidebar w-270 bg-white h-screen overflow-y-auto fixed transition-all duration-500 ease-in-out shadow-dashboard-sidebar dark:bg-dark-bg-neutral-900 ${
          isSidebarSmall ? "sidebar_small" : ""
        }`}
      >
        <h2 className="text-center my-6 mb-6">Dealpay</h2>
        <div
          className={`sidebar-collapse hidden`}
          onClick={handleSidebarCollapse}
        >
          <ArrowLeft />
        </div>

        <div className="mt-32">
          {dashboardMenu.map((menuItem) => (
            <div key={menuItem.id}>
              <Link
                href={menuItem.url}
                className={`responsive-bar sidebar-menu group hover:bg-green-100 hover:border-primary  flex flex-row space-x-4 items-center p-2  ${
                  path.replace(/\/$/, "") === menuItem.url.replace(/\/$/, "")
                    ? "active"
                    : ""
                }`}
              >
                {menuItem.icon}
                <span className="font-semibold text-xl flex space-x-4 items-center p-2 capitalize">
                  {menuItem.text}
                </span>
              </Link>
            </div>
          ))}

          <div
            className={`responsive-bar sidebar-menu group hover:bg-light-bg-neutral-100 hover:border-light-border-primary-500 dark:hover:bg-dark-bg-neutral-800`}
          >
            <button
              type="submit"
              className="flex flex-row space-x-4 items-center p-2"
              onClick={handleLogout}
            >
              <Power />
              <span className="font-semibold text-xl flex">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
