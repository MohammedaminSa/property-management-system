import { fromNodeHeaders } from "better-auth/node";
import { tryCatch } from "../utils/async-handler";
import { auth } from "../lib/auth";

export default {
  signIn: tryCatch(async (req, res, next) => {
    const { token } = await auth.api.signInEmail({
      body: { email: "", password: "" },
    });

    console.log("Login successfull", token);
    res.send({ token });
  }),
  signUp: tryCatch(async (req, res, next) => {
    console.log("Sign-up request received");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    
    const { email, password, name } = req.body;

    // Basic validation
    if (!email || !password || !name) {
      console.log("Validation failed - missing fields");
      return res.status(400).json({ error: "Email, password, and name are required" });
    }

    console.log("Attempting to sign up user:", email);
    const { token, user } = await auth.api.signUpEmail({
      body: { email, password, name, rememberMe: true } as any,
    });

    console.log("Sign-up successful for:", email);
    res.send({ token, user });
  }),
  signOut: tryCatch(async (req, res, next) => {
    // Simple sign-out response - better-auth handles the actual session clearing
    res.json({ success: true, message: "Sign out successful" });
  }),
  me: tryCatch(async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    res.send(session);
  }),
};
