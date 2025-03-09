import { getAuthState } from "../service/authorizationService";
import { LogoutButton } from "./LogoutButton";
import { LinkButton } from "./styled/LinkButton";

export async function Header() {
  const authState = await getAuthState();
  return (
    <header className="flex flex-row bg-slate-500 justify-end items-center">
      <nav>
        <ul className="flex flex-row items-center gap-4 mr-4">
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
