import Image from "next/image";
import Link from "next/link";
import { getUserInfo } from "../service/authorizationService";
import { LogoutButton } from "./LogoutButton";

export async function SideBar() {
  const authState = await getUserInfo();

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
          {authState.loggedIn && (
            <>
              <li>
                <div
                  className="bg-white text-slate-700 font-bold text-4xl size-12 leading-[50px] rounded-full text-center cursor-pointer"
                  title={authState.user.email}
                >
                  A
                </div>
              </li>
              <li>
                <LogoutButton />
              </li>
            </>
          )}
          {!authState.loggedIn && (
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
