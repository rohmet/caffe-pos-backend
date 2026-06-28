import { injectable } from "tsyringe";
import { supabase } from "@/core/supabase.js";

export interface ILoginUseCase {
  execute(email: string, password: string): Promise<{ token: string; user: any }>;
}

export interface ILogoutUseCase {
  execute(): Promise<void>;
}

@injectable()
export class LoginUseCase implements ILoginUseCase {
  async execute(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    if (!data.session) {
      throw new Error("Failed to start session");
    }
    return {
      token: data.session.access_token,
      user: data.user,
    };
  }
}

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
  async execute() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }
}
