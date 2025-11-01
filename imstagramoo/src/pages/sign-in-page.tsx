import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignInWithPassword } from "@/hooks/mutations/use-sign-in";
import { useState } from "react";
import { Link } from "react-router";
import gitHubLogo from "@/assets/github-mark.png";
import googoleLogo from "@/assets/google-mark.png";
import { useSignInWithOAuth } from "@/hooks/mutations/use-sign-in-with-oauth";
import type { Provider } from "@supabase/supabase-js";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signInWithpassword } = useSignInWithPassword();
  const { mutate: signInWithOAuth } = useSignInWithOAuth();

  const handleSignInWithPasswordClick = () => {
    if (email.trim()) return;
    if (password.trim()) return;
    signInWithpassword({
      email,
      password,
    });
  };
  const handleSignInWithOAuthClick = (socialType: Provider) => {
    signInWithOAuth(socialType);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-xl font-bold">로그인</div>
      <div className="flex flex-col gap-2">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-6"
          type="email"
          placeholder="example@google.com"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="py-6"
          type="password"
          placeholder="password"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleSignInWithPasswordClick} className="w-full">
          로그인
        </Button>

        <Button
          variant={"outline"}
          onClick={() => handleSignInWithOAuthClick("github")}
          className="w-full"
        >
          <img src={gitHubLogo} className="h-4 w-4" />
          Github 로그인
        </Button>
        <Button
          variant={"outline"}
          onClick={() => handleSignInWithOAuthClick("google")}
          className="w-full"
        >
          <img src={googoleLogo} className="h-4 w-4" />
          Google 로그인
        </Button>
      </div>
      <div>
        <Link className="text-muted-foreground hover:underline" to={"/sign-up"}>
          계정이 없으시다면? 회원가입
        </Link>
      </div>
    </div>
  );
}
