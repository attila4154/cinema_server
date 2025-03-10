import { getAuthState } from "../service/authorizationService";
import { LogoutButton } from "./LogoutButton";
import { LinkButton } from "./styled/LinkButton";

export async function Header() {
  const authState = await getAuthState();
  return (
    <header className="flex flex-row bg-black justify-end items-center">
      <nav>
        <ul className="flex flex-row items-center gap-4 md:mr-4 md:mt-2 md:mb-2 mr-2 mt-1 mb-1">
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
                <LinkButton href="/authorize/login">
                  Login
                </LinkButton>
              </li>
              <li>
                <LinkButton href="/authorize/register">
                  Register
                </LinkButton>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
