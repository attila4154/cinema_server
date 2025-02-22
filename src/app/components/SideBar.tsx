"use client";
import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";
import { authActions } from "@/store/auth";
import Image from "next/image";
import Link from "next/link";

export function SideBar() {
  const { loggedIn, user } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  function logout() {
    dispatch(authActions.logout());
  }

  return (
    <aside className="fixed top-0 left-0 h-full pr-2 bg-slate-700 pt-2 pl-2">
      <nav className="flex flex-col">
        <ul>
          <li>
            <Link href={"/"}>
              <Image
                src="/icon.svg"
                alt="logo"
                height={50}
                width={50}
              />
            </Link>
          </li>
          {loggedIn && (
            <>
              <li>
                <div className="bg-white text-slate-700 font-bold text-4xl size-12 leading-[50px] rounded-full text-center cursor-pointer"
                title={user?.email}
                >

                  A
                </div>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
          {!loggedIn && (
            <>
              <li>
                <Link href="/authorize/login">Login</Link>
              </li>
              <li>
                <Link href="/authorize/register">
                  Register
                </Link>
              </li>
            </>
          )}
          {/* <li>First</li>
          <li>Second</li>
          <li>Third</li>
          <li>Fourth</li>
          <li>Fifth</li>
          <li>Sixth</li> */}
        </ul>
      </nav>
    </aside>
  );
}
